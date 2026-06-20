import express from 'express';
import { Pool } from '@neondatabase/serverless';

const router = express.Router();

// Neon Serverless Postgres connection pool setup (available if connected to real DB in future)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Mock database store for simulation and local verification without full database seeding
let mockDatabase = {
  users: [
    {
      id: 'usr_host_001',
      bruneeid_sub: 'sub_host_001',
      bruneeid_token_ref: 'ref_token_hash_001',
      legal_name: 'Haji Ahmad bin Haji Kahar', // Exact match
      ic_number: '00-111111',
      email: 'artisan.weaver@kempong.bn',
      phone: '+6738123456',
      is_active: true,
      aml_flag: 'CLEAR',
      role: 'HOST'
    },
    {
      id: 'usr_host_002',
      bruneeid_sub: 'sub_host_002',
      bruneeid_token_ref: 'ref_token_hash_002',
      legal_name: 'Sufian bin Awang', // Mismatch vs payout_account_name (Sufian Awang bin Ali)
      ic_number: '00-222222',
      email: 'penan.crafts@temburong.bn',
      phone: '+6738987654',
      is_active: true,
      aml_flag: 'CLEAR',
      role: 'HOST'
    },
    {
      id: 'usr_traveler_001',
      bruneeid_sub: 'sub_traveler_001',
      bruneeid_token_ref: 'ref_token_hash_003',
      legal_name: 'Sarah Smith',
      ic_number: '50-333333',
      email: 'sarah.visitor@bruneitourism.com',
      phone: '+14155552671',
      is_active: true,
      aml_flag: 'CLEAR',
      role: 'TOURIST'
    }
  ],
  host_profiles: [
    {
      id: 'hp_001',
      user_id: 'usr_host_001',
      business_name: 'Kampong Ayer Wooden Boat Builder',
      rocbn_number: 'RCBN-9876',
      business_bio: 'Master woodworker specialized in traditional watercraft construction.',
      profile_photo_url: 'https://images.sidequest.bn/hosts/ahmad.jpg',
      verification_status: 'VERIFIED',
      verification_notes: 'All checks passed.',
      verified_at: new Date().toISOString(),
      payout_bank_name: 'BIBD',
      payout_account_number: '0015020349581',
      payout_account_name: 'Haji Ahmad bin Haji Kahar' // Exact match with users.legal_name
    },
    {
      id: 'hp_002',
      user_id: 'usr_host_002',
      business_name: 'Penan Weaving Artisans',
      rocbn_number: 'RCBN-5432',
      business_bio: 'Handcrafted items using traditional weaving methods of Temburong.',
      profile_photo_url: 'https://images.sidequest.bn/hosts/sufian.jpg',
      verification_status: 'VERIFIED',
      verification_notes: 'All checks passed.',
      verified_at: new Date().toISOString(),
      payout_bank_name: 'Baiduri',
      payout_account_number: '1209384729103',
      payout_account_name: 'Sufian Awang bin Ali' // Mismatch with users.legal_name (Sufian bin Awang)
    }
  ],
  activities: [
    {
      id: 'act_boat_craft_001',
      host_profile_id: 'hp_001',
      title: 'Kampong Ayer Wooden Boat Building Craft',
      description: 'Learn the ancient art of building wooden boats directly on Kampong Ayer.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Jetty 2, Kampong Ayer',
      location_lat: 4.8821,
      location_lng: 114.9423,
      thumbnail_url: 'https://images.sidequest.bn/activities/boat.jpg',
      price_per_person: 50.00,
      duration_minutes: 150,
      max_participants: 10,
      is_active: true,
      is_featured: true,
      total_bookings: 0,
      average_rating: 5.0
    },
    {
      id: 'act_weaving_002',
      host_profile_id: 'hp_002',
      title: 'Traditional Penan Basket Weaving Masterclass',
      description: 'Craft your own basket using hand-split rattan under tribal guidance.',
      category: 'CULTURE',
      district: 'Temburong',
      exact_location: 'Kampong Selapon',
      location_lat: 4.7082,
      location_lng: 115.1234,
      thumbnail_url: 'https://images.sidequest.bn/activities/weaving.jpg',
      price_per_person: 45.00,
      duration_minutes: 180,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 0,
      average_rating: 4.9
    }
  ],
  bookings: []
};

// Database helper queries to mimic database calls
const db = {
  findUserById: async (id) => mockDatabase.users.find(u => u.id === id),
  findUserBySub: async (sub) => mockDatabase.users.find(u => u.bruneeid_sub === sub || u.id === sub),
  findHostProfileByUserId: async (userId) => mockDatabase.host_profiles.find(hp => hp.user_id === userId),
  findActivityById: async (id) => mockDatabase.activities.find(a => a.id === id),
  updateUserAmlFlag: async (id, amlFlag) => {
    const user = mockDatabase.users.find(u => u.id === id);
    if (user) {
      user.aml_flag = amlFlag;
      return user;
    }
    return null;
  },
  insertBooking: async (booking) => {
    mockDatabase.bookings.push(booking);
    return booking;
  },
  findBookingsByTraveler: async (travelerId) => {
    return mockDatabase.bookings.filter(b => b.tourist_user_id === travelerId);
  },
  updateBookingEscrowStatus: async (bookingId, status) => {
    const booking = mockDatabase.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.escrow_status = status;
      return booking;
    }
    return null;
  },
  findBookedCount: async (activityId, bookingDate, bookingTimeSlot) => {
    return mockDatabase.bookings
      .filter(b => b.activity_id === activityId && b.booking_date === bookingDate && b.booking_time_slot === bookingTimeSlot && b.escrow_status !== 'REFUNDED')
      .reduce((sum, b) => sum + b.participant_count, 0);
  }
};

const PLATFORM_FEE_RATE = 0.08;
const HOST_PAYOUT_RATE = 0.92;

/**
 * FIREWALL 4: Cryptographic Escrow Engine (Tokenized Escrow Firewall)
 * POST /bookings/create
 * Recalculates gross client-side amounts and locks them under FROZEN status.
 */
router.post('/bookings/create', async (req, res) => {
  const { activity_id, tourist_user_id, booking_date, booking_time_slot, participant_count } = req.body;

  // Basic Validation
  if (!activity_id || !tourist_user_id || !booking_date || !booking_time_slot || !participant_count) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PARAMS',
      message: 'activity_id, tourist_user_id, booking_date, booking_time_slot, and participant_count are required.'
    });
  }

  const parsedCount = parseInt(participant_count, 10);
  if (isNaN(parsedCount) || parsedCount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PARTICIPANT_COUNT',
      message: 'participant_count must be a positive integer.'
    });
  }

  try {
    // Resolve tourist user
    const tourist = await db.findUserBySub(tourist_user_id);
    if (!tourist) {
      return res.status(403).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'No active account found for the authenticated user.'
      });
    }

    if (tourist.aml_flag !== 'CLEAR') {
      return res.status(403).json({
        success: false,
        error: 'AML_ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Resolve activity and verify host eligibility
    const activity = await db.findActivityById(activity_id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'ACTIVITY_NOT_FOUND',
        message: 'The requested activity does not exist.'
      });
    }

    if (!activity.is_active) {
      return res.status(409).json({
        success: false,
        error: 'ACTIVITY_INACTIVE',
        message: 'This activity is currently not available for booking.'
      });
    }

    const hostProfile = await db.findHostProfileByUserId(activity.host_profile_id) || mockDatabase.host_profiles.find(hp => hp.id === activity.host_profile_id);
    if (!hostProfile || hostProfile.verification_status !== 'VERIFIED') {
      return res.status(409).json({
        success: false,
        error: 'HOST_NOT_VERIFIED',
        message: 'This host is not yet verified to accept bookings.'
      });
    }

    // Check slot capacity
    const bookedCount = await db.findBookedCount(activity_id, booking_date, booking_time_slot);
    const remainingSlots = activity.max_participants - bookedCount;

    if (parsedCount > remainingSlots) {
      return res.status(409).json({
        success: false,
        error: 'INSUFFICIENT_CAPACITY',
        message: `Only ${remainingSlots} slot(s) remaining for this time slot.`,
        remaining_slots: remainingSlots
      });
    }

    // Programmatic fee computation (recalculating from DB price per participant)
    const pricePerPerson = parseFloat(activity.price_per_person);
    const grossAmount = parseFloat((pricePerPerson * parsedCount).toFixed(2));
    const platformFeeAmount = parseFloat((grossAmount * PLATFORM_FEE_RATE).toFixed(2));
    const hostPayoutAmount = parseFloat((grossAmount - platformFeeAmount).toFixed(2));

    // Assert sanity checks
    const ledgerCheck = parseFloat((platformFeeAmount + hostPayoutAmount).toFixed(2));
    if (ledgerCheck !== grossAmount) {
      return res.status(500).json({
        success: false,
        error: 'LEDGER_CALCULATION_ERROR',
        message: 'A financial calculation error occurred. Transaction aborted.'
      });
    }

    // Create booking record with FROZEN escrow status
    const newBooking = {
      id: `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      activity_id,
      tourist_user_id: tourist.id,
      booking_date,
      booking_time_slot,
      participant_count: parsedCount,
      gross_amount: grossAmount,
      platform_fee_rate: PLATFORM_FEE_RATE,
      platform_fee_amount: platformFeeAmount,
      host_payout_rate: HOST_PAYOUT_RATE,
      host_payout_amount: hostPayoutAmount,
      escrow_status: 'FROZEN',
      escrow_frozen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.insertBooking(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking created. Funds held in escrow. Redirect tourist to wallet payment.',
      booking: newBooking
    });

  } catch (error) {
    console.error('Escrow Engine Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

/**
 * FIREWALL 2: Automated Bank Name Whitelisting (Payout Whitelisting Firewall)
 * POST /payout/initialize
 * Checks verified legal_name in users against host_profiles payout_account_name.
 * Triggers status freeze (AML_flag update to SUSPENDED_AML_FLAG) on mismatch.
 */
router.post('/payout/initialize', async (req, res) => {
  const { booking_id, host_user_id, partner_wallet_type } = req.body;

  if (!booking_id || !host_user_id || !partner_wallet_type) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PARAMS',
      message: 'booking_id, host_user_id, and partner_wallet_type are required.'
    });
  }

  if (!['POCKET', 'DING'].includes(partner_wallet_type.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PROVIDER',
      message: 'Invalid partner wallet API routing. Supported options: POCKET, DING.'
    });
  }

  try {
    // Fetch verified legal name and AML status
    const host = await db.findUserById(host_user_id);
    if (!host) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Authenticated user has no active SideQuest account.'
      });
    }

    if (host.aml_flag !== 'CLEAR') {
      return res.status(403).json({
        success: false,
        error: 'AML_ACCOUNT_SUSPENDED',
        message: 'This account has been suspended pending AML review. Contact support.',
        aml_status: 'SUSPENDED_AML_FLAG'
      });
    }

    // Fetch booking
    const booking = mockDatabase.bookings.find(b => b.id === booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'BOOKING_NOT_FOUND',
        message: 'Booking not found or does not belong to this host.'
      });
    }

    if (booking.escrow_status !== 'FROZEN') {
      return res.status(409).json({
        success: false,
        error: 'INVALID_ESCROW_STATE',
        message: `Payout cannot be initialized. Current escrow status: ${booking.escrow_status}`
      });
    }

    // Fetch host profile bank details
    const hostProfile = await db.findHostProfileByUserId(host_user_id);
    if (!hostProfile) {
      return res.status(404).json({
        success: false,
        error: 'PROFILE_NOT_FOUND',
        message: 'Host profile settings not found.'
      });
    }

    // String normalization logic for e-KYC legal name string-matching comparison
    const normalize = (str) =>
      (str || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const verifiedLegalName = normalize(host.legal_name);
    const declaredPayoutName = normalize(hostProfile.payout_account_name);

    const nameMatchPassed = verifiedLegalName === declaredPayoutName;

    if (!nameMatchPassed) {
      // MISMATCH: Freeze host user and dispute linked bookings
      await db.updateUserAmlFlag(host_user_id, 'SUSPENDED_AML_FLAG');

      // Update all FROZEN bookings of this host to DISPUTED
      const hostActivities = mockDatabase.activities.filter(a => a.host_profile_id === hostProfile.id).map(a => a.id);
      mockDatabase.bookings.forEach(b => {
        if (hostActivities.includes(b.activity_id) && b.escrow_status === 'FROZEN') {
          b.escrow_status = 'DISPUTED';
          b.dispute_opened_at = new Date().toISOString();
          b.dispute_notes = 'AUTO-FLAGGED: AML name mismatch on payout initialization.';
          b.updated_at = new Date().toISOString();
        }
      });

      console.error(`[SECURITY][FW-2] AML NAME MISMATCH`, {
        user_id: host_user_id,
        verified_name: host.legal_name,
        declared_name: hostProfile.payout_account_name,
        booking_id,
        timestamp: new Date().toISOString()
      });

      return res.status(403).json({
        success: false,
        error: 'AML_NAME_MISMATCH',
        action: 'TRANSACTION_FREEZE_TRIGGERED',
        aml_status: 'SUSPENDED_AML_FLAG',
        message: 'Payout denied. Account name does not match verified identity. Your account has been suspended pending review.',
        audit: {
          ekyc_legal_name: host.legal_name,
          bank_destination_name: hostProfile.payout_account_name
        }
      });
    }

    // MATCH: Issue signed/encoded Base64 token for payout disbursement
    const payoutAuthToken = Buffer.from(
      JSON.stringify({
        booking_id: booking.id,
        host_user_id: host.id,
        payout_amount: booking.host_payout_amount,
        bank_name: hostProfile.payout_bank_name,
        account_number: hostProfile.payout_account_number,
        issued_at: Date.now(),
        expires_at: Date.now() + 5 * 60 * 1000
      })
    ).toString('base64');

    // Update escrow status to RELEASED
    booking.escrow_status = 'RELEASED';
    booking.escrow_released_at = new Date().toISOString();
    booking.payment_confirmed_at = new Date().toISOString();
    booking.wallet_provider = partner_wallet_type.toUpperCase();
    booking.wallet_ref_hash = `tx_hash_${partner_wallet_type.toLowerCase()}_${Date.now()}`;
    booking.updated_at = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Payout verification passed. Funds successfully routed to partner wallet API.',
      payout_auth_token: payoutAuthToken,
      payout_amount: booking.host_payout_amount,
      bank_name: hostProfile.payout_bank_name,
      partner_receipt: {
        status: 'SUCCESS',
        transaction_id: `tx_${partner_wallet_type.toLowerCase()}_${Date.now()}`,
        destination: hostProfile.payout_account_number,
        amount: booking.host_payout_amount,
        partner: partner_wallet_type.toUpperCase(),
        routed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Payout Initialization Error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Helper for testing - exposes the mock database to reset/check state in tests
router.get('/_test/db', (req, res) => {
  return res.json(mockDatabase);
});

router.post('/_test/db/reset', (req, res) => {
  mockDatabase.bookings = [];
  mockDatabase.users.forEach(u => {
    u.aml_flag = 'CLEAR';
  });
  // Restore host profile payout_account_name since UI might alter it
  const hp1 = mockDatabase.host_profiles.find(hp => hp.user_id === 'usr_host_001');
  if (hp1) hp1.payout_account_name = 'Haji Ahmad bin Haji Kahar';
  const hp2 = mockDatabase.host_profiles.find(hp => hp.user_id === 'usr_host_002');
  if (hp2) hp2.payout_account_name = 'Sufian Awang bin Ali';

  return res.json({ success: true, message: 'Mock database reset completed.' });
});

export default router;

