/**
 * Verification Test Suite for SideQuest Tourism Firewalls
 * Tests Tokenized Escrow Firewall (8% platform fee + FROZEN lock)
 * Tests Payout Whitelisting Firewall (perfect match vs mismatch, transaction freeze & status flag update)
 */

import express from 'express';
import router from '../backend/routes/routes.js';
import http from 'http';

const app = express();
app.use(express.json());
// Note: Production server.js mounts on '/api', so routes resolve as /api/bookings/create, /api/payout/initialize, etc.
// This test mounts on '/api' to match production path structure.
app.use('/api', router);

// Simple test runner assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(` ✅ PASS: ${message}`);
}

async function runTests() {
  console.log('--- STARTING SIDEQUEST TOURISM FIREWALL TESTS ---');
  
  // Start temporary listener
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api`;
    
    try {
      // 1. Reset Database State
      await request(baseUrl + '/_test/db/reset', 'POST', {});
      console.log('Database state reset.');

      // 2. TEST 1: Tokenized Escrow Firewall (Correct calculation and state lock)
      console.log('\nTesting Tokenized Escrow Firewall...');
      const escrowPayload = {
        activity_id: 'act_boat_craft_001',
        tourist_user_id: 'usr_traveler_001',
        booking_date: '2026-07-12',
        booking_time_slot: '09:00:00',
        participant_count: 4 // Price per participant is 50.00 -> Total gross BND 200.00
      };

      const escrowRes = await request(baseUrl + '/bookings/create', 'POST', escrowPayload);
      assert(escrowRes.success === true, 'Escrow booking API response indicates success');
      assert(escrowRes.booking.gross_amount === 200.00, `Total price calculated is BND 200.00 (Got: ${escrowRes.booking.gross_amount})`);
      assert(escrowRes.booking.platform_fee_amount === 16.00, `Platform fee is exactly 8% = BND 16.00 (Got: ${escrowRes.booking.platform_fee_amount})`);
      assert(escrowRes.booking.host_payout_amount === 184.00, `Host payout is exactly 92% = BND 184.00 (Got: ${escrowRes.booking.host_payout_amount})`);
      assert(escrowRes.booking.escrow_status === 'FROZEN', `Escrow status initialized to FROZEN (Got: ${escrowRes.booking.escrow_status})`);

      // 3. TEST 2: Payout Whitelisting Firewall - Perfect Match Case (usr_host_001)
      console.log('\nTesting Payout Whitelisting Firewall - Perfect Match...');
      const payoutMatchPayload = {
        booking_id: escrowRes.booking.id,
        host_user_id: 'usr_host_001',
        partner_wallet_type: 'POCKET'
      };

      const matchRes = await request(baseUrl + '/payout/initialize', 'POST', payoutMatchPayload);
      assert(matchRes.success === true, 'Payout whitelisting matches legal names');
      assert(matchRes.partner_receipt.status === 'SUCCESS', 'Receipt status is success');
      assert(matchRes.partner_receipt.partner === 'POCKET', 'Routed to correct partner wallet Pocket');
      assert(matchRes.partner_receipt.amount === 184.00, `Host received correct payout amount of BND 184.00 (Got: ${matchRes.partner_receipt.amount})`);

      // 4. TEST 3: Payout Whitelisting Firewall - Mismatch Case (usr_host_002)
      console.log('\nTesting Payout Whitelisting Firewall - Name Mismatch...');
      // First, create booking for the second host
      const mismatchEscrowPayload = {
        activity_id: 'act_weaving_002',
        tourist_user_id: 'usr_traveler_001',
        booking_date: '2026-07-12',
        booking_time_slot: '10:00:00',
        participant_count: 2 // Price per participant is 45.00 -> Total gross BND 90.00
      };
      const mismatchEscrowRes = await request(baseUrl + '/bookings/create', 'POST', mismatchEscrowPayload);
      assert(mismatchEscrowRes.success === true, 'Escrow booking for second host created successfully');

      const payoutMismatchPayload = {
        booking_id: mismatchEscrowRes.booking.id,
        host_user_id: 'usr_host_002',
        partner_wallet_type: 'DING'
      };

      let mismatchError;
      try {
        await request(baseUrl + '/payout/initialize', 'POST', payoutMismatchPayload);
      } catch (err) {
        mismatchError = err;
      }

      assert(mismatchError !== undefined, 'Mismatch triggers an error response');
      assert(mismatchError.statusCode === 403, `Mismatch returns 403 Forbidden (Got: ${mismatchError.statusCode})`);
      assert(mismatchError.response.success === false, 'Success field is false in error payload');
      assert(mismatchError.response.aml_status === 'SUSPENDED_AML_FLAG', 'AML status updated to SUSPENDED_AML_FLAG');
      assert(mismatchError.response.action === 'TRANSACTION_FREEZE_TRIGGERED', 'Transaction freeze is triggered');

      // 5. TEST 4: Verification of Database AML Suspension Propagation
      console.log('\nTesting Database AML Flag State Persistence...');
      const dbRes = await request(baseUrl + '/_test/db', 'GET');
      const hostUser = dbRes.users.find(u => u.id === 'usr_host_002');
      assert(hostUser.aml_flag === 'SUSPENDED_AML_FLAG', `Host user state flag set to SUSPENDED_AML_FLAG in DB (Got: ${hostUser.aml_flag})`);

      // 6. TEST 5: Subsequent requests to a flagged host should fail automatically
      console.log('\nTesting Payout attempt on suspended host...');
      let retryError;
      try {
        await request(baseUrl + '/payout/initialize', 'POST', {
          booking_id: mismatchEscrowRes.booking.id,
          host_user_id: 'usr_host_002',
          partner_wallet_type: 'DING'
        });
      } catch (err) {
        retryError = err;
      }
      assert(retryError !== undefined, 'Payout request to suspended host fails');
      assert(retryError.statusCode === 403, 'Returns 403 Forbidden');
      assert(retryError.response.error === 'AML_ACCOUNT_SUSPENDED', `Error code matches account suspension (Got: ${retryError.response.error})`);

      console.log('\n=================================================');
      console.log('🎉 ALL SIDEQUEST TOURISM FIREWALL TESTS PASSED SUCCESSFULLY! 🎉');
      console.log('=================================================');

    } catch (e) {
      console.error('\n❌ TEST RUN FAILURE:', e);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

/**
 * Lightweight native http request wrapper to avoid external dependencies like axios/supertest
 */
function request(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject({
            statusCode: res.statusCode,
            response: parsed
          });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

runTests();
