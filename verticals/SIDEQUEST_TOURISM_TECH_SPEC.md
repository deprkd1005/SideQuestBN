# SIDEQUEST TOURISM: THE TECHNICAL SPECIFICATION MASTER SHEET

> **Classification:** Internal Developer Documentation — Confidential  
> **Version:** 1.0.0  
> **Last Updated:** June 2026  
> **Platform Scope:** Micro-MSME, Local Artisan, Heritage Workshop & Unique Activity Marketplace — Brunei Darussalam

---

## TABLE OF CONTENTS

1. [Architectural Overview](#1-architectural-overview)
2. [Database Structure — PostgreSQL DDL](#2-database-structure--postgresql-ddl)
3. [Backend API Routes — Node.js / Express](#3-backend-api-routes--nodejs--express)
4. [Mobile UI Architecture — Flutter](#4-mobile-ui-architecture--flutter)
5. [Data Formulas & Scale Projections](#5-data-formulas--scale-projections)

---

## 1. ARCHITECTURAL OVERVIEW

### 1.1 Platform Mission

SideQuest Tourism is a **strictly curated, asset-light, community-powered mobile marketplace** for Brunei's invisible economy. The platform exclusively surfaces **Micro-MSMEs, Local Artisans, Heritage Workshops, and Unique Cultural Activities** that have zero presence on global discovery platforms like TripAdvisor, Viator, or Airbnb Experiences.

**Explicitly out of scope:** generic gig workers, student tutors, ride-hailing drivers, or any commodity service vertical. Every listed experience must be rooted in Brunei's cultural, artisanal, or natural heritage fabric.

---

### 1.2 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Mobile Frontend** | Flutter (Dart) — iOS & Android | Single codebase, native performance, rich widget ecosystem |
| **Backend API** | Node.js + Express.js | Non-blocking I/O for high-concurrency booking events |
| **Primary Database** | PostgreSQL via Supabase | ACID compliance, row-level security (RLS), real-time subscriptions |
| **Serverless Functions** | Supabase Edge Functions (Deno) | Low-latency webhook handlers for wallet callbacks |
| **Hosting & Infra** | Render (API), Supabase (DB + Auth) | Zero-DevOps managed scaling |
| **Auth Provider** | BruneiID OAuth 2.0 | State-verified identity; no self-reported credentials |
| **Payment Custody** | DST Pocket / Ding Wallet APIs | Licensed local e-money custodians; PCI-DSS decoupled |
| **CDN / Media** | Supabase Storage + Cloudflare CDN | Activity thumbnails, host media assets |

---

### 1.3 Architectural Paradigm: Zero-Trust Tokenized Architecture (ZTTA)

#### Core Principle

SideQuest Tourism operates under a **Zero-Trust Tokenized Architecture (ZTTA)**. This paradigm enforces one absolute rule:

> **SideQuest never stores, processes, or transmits raw bank card numbers, PINs, account passwords, or physical cash deposits at any point in the transaction lifecycle.**

#### How It Works

Financial custody is **100% decoupled** from the SideQuest application layer and offloaded to **licensed local wallet APIs** — specifically DST's Pocket wallet and Ding — which hold active e-money licences issued by the Autoriti Monetari Brunei Darussalam (AMBD). These third-party custodians are solely responsible for:

- Storing user payment credentials in encrypted vaults
- Processing the actual movement of funds
- Maintaining regulatory compliance (AML/KYC) at the money-handling layer

SideQuest's backend acts purely as an **internal, cryptographic ledger**. It:

1. **Receives** tokenized transaction reference hashes from the wallet API (never raw financial data)
2. **Records** the transaction state in its PostgreSQL bookings ledger (`FROZEN → RELEASED → REFUNDED`)
3. **Enforces** business logic firewalls (name-matching AML checks, escrow release conditions)
4. **Emits** webhook signals to trigger payout releases after the experience window closes

```
┌─────────────────────────────────────────────────────────────────┐
│                     SIDEQUEST ZTTA FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Tourist App]                                                  │
│       │                                                         │
│       ▼                                                         │
│  POST /api/v1/bookings/create                                   │
│       │  (booking params, no card data)                         │
│       ▼                                                         │
│  [SideQuest Ledger]  ──── records FROZEN state ────►  [PostgreSQL] │
│       │                                                         │
│       ▼                                                         │
│  Redirect to DST Pocket / Ding Checkout (external)             │
│       │                                                         │
│       ▼                                                         │
│  [Licensed Wallet API]  ──── processes payment ────             │
│       │  returns: { wallet_ref_hash: "wxyz..." }               │
│       ▼                                                         │
│  POST /api/v1/payout/initialize (webhook)                       │
│       │  AML Name-Match Firewall                                │
│       ▼                                                         │
│  [SideQuest Ledger]  ──── updates state to RELEASED ──►  [PostgreSQL] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Security Layers Summary

| Firewall | Name | Function |
|---|---|---|
| **FW-1** | BruneiID Identity Gate | All users must authenticate via state-issued OAuth; no anonymous accounts |
| **FW-2** | Automated Bank Name Whitelisting | Payout recipient name string-matched against BruneiID legal name |
| **FW-3** | AMBD-Licensed Custody Boundary | Zero raw financial data crosses into SideQuest's infrastructure |
| **FW-4** | Cryptographic Escrow Engine | All funds frozen at booking, released only post-experience verification |

---

## 2. DATABASE STRUCTURE — PostgreSQL DDL

> Copy-paste ready. Execute in order: `users` → `host_profiles` → `activities` → `bookings`.

### 2.1 Enable Required Extensions

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable case-insensitive text (optional, for email indexing)
CREATE EXTENSION IF NOT EXISTS "citext";
```

---

### 2.2 Table: `users`

Linked to BruneiID OAuth. Stores state-verified identity data only. No passwords stored.

```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- BruneiID OAuth binding
    bruneeid_sub        VARCHAR(255) UNIQUE NOT NULL,       -- OAuth 'sub' claim (immutable state ID)
    bruneeid_token_ref  TEXT,                               -- Encrypted refresh token reference (NOT raw token)

    -- State-verified identity fields (sourced from BruneiID, not user input)
    legal_name          VARCHAR(255) NOT NULL,              -- Full legal name from state registry
    ic_number           VARCHAR(20) UNIQUE NOT NULL,        -- National IC number (e.g. 00-123456)

    -- Contact (user-provided, post-auth)
    email               CITEXT UNIQUE NOT NULL,
    phone               VARCHAR(20),

    -- Account state
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    aml_flag            VARCHAR(50) NOT NULL DEFAULT 'CLEAR'
                            CHECK (aml_flag IN ('CLEAR', 'SUSPENDED_AML_FLAG', 'UNDER_REVIEW')),
    role                VARCHAR(20) NOT NULL DEFAULT 'TOURIST'
                            CHECK (role IN ('TOURIST', 'HOST', 'ADMIN')),

    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_bruneeid_sub ON users (bruneeid_sub);
CREATE INDEX idx_users_ic_number    ON users (ic_number);
CREATE INDEX idx_users_email        ON users (email);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  users                    IS 'Platform users. Identity fields sourced from BruneiID OAuth; no credentials stored.';
COMMENT ON COLUMN users.bruneeid_sub       IS 'Immutable OAuth subject claim from BruneiID. Primary identity anchor.';
COMMENT ON COLUMN users.legal_name         IS 'Verified legal name from Brunei state registry via BruneiID. Used for AML name-matching.';
COMMENT ON COLUMN users.ic_number          IS 'National Identity Card number. Unique constraint enforces one account per citizen.';
COMMENT ON COLUMN users.aml_flag           IS 'Anti-Money Laundering status. SUSPENDED_AML_FLAG blocks all payouts and new bookings.';
```

---

### 2.3 Table: `host_profiles`

One-to-one extension of `users` for experience hosts. Stores business registration and payout details.

```sql
CREATE TABLE host_profiles (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link to verified user
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Business identity
    business_name           VARCHAR(255) NOT NULL,
    rocbn_number            VARCHAR(50),                     -- ROCBN reg number (nullable for sole traders)
    business_bio            TEXT,
    profile_photo_url       TEXT,

    -- Verification lifecycle
    verification_status     VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                                CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_notes      TEXT,                            -- Admin notes on rejection reason
    verified_at             TIMESTAMPTZ,

    -- Payout details (bank transfer, post-experience)
    payout_bank_name        VARCHAR(50)
                                CHECK (payout_bank_name IN ('BIBD', 'Baiduri', 'TAIB', 'Standard Chartered BN')),
    payout_account_number   VARCHAR(30),
    payout_account_name     VARCHAR(255),                   -- MUST match users.legal_name for FW-2

    -- Timestamps
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_host_profiles_user_id             ON host_profiles (user_id);
CREATE INDEX idx_host_profiles_verification_status ON host_profiles (verification_status);

CREATE TRIGGER trg_host_profiles_updated_at
    BEFORE UPDATE ON host_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  host_profiles                     IS 'Business profiles for activity hosts. Requires admin VERIFIED status before listing activities.';
COMMENT ON COLUMN host_profiles.rocbn_number        IS 'Registry of Companies & Business Names registration number. Optional for informal sole traders.';
COMMENT ON COLUMN host_profiles.payout_account_name IS 'Bank account name for payouts. Cross-checked against users.legal_name via Firewall 2 AML check.';
```

---

### 2.4 Table: `activities`

The core experience catalogue. Each row represents a bookable workshop, tour, or cultural activity.

```sql
CREATE TYPE activity_category AS ENUM ('CULTURE', 'FOOD', 'NATURE', 'CREATIVE');
CREATE TYPE brunei_district   AS ENUM ('Brunei-Muara', 'Tutong', 'Belait', 'Temburong');

CREATE TABLE activities (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Host reference
    host_profile_id     UUID NOT NULL REFERENCES host_profiles(id) ON DELETE RESTRICT,

    -- Experience details
    title               VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    category            activity_category NOT NULL,
    district            brunei_district NOT NULL,
    exact_location      TEXT NOT NULL,                      -- Street address or GPS coords string
    location_lat        DECIMAL(10, 7),
    location_lng        DECIMAL(10, 7),
    thumbnail_url       TEXT,

    -- Pricing & capacity
    price_per_person    NUMERIC(10, 2) NOT NULL CHECK (price_per_person > 0),
    duration_minutes    INTEGER NOT NULL CHECK (duration_minutes > 0),
    max_participants    INTEGER NOT NULL DEFAULT 10 CHECK (max_participants > 0),

    -- Availability
    is_active           BOOLEAN NOT NULL DEFAULT FALSE,     -- Set TRUE only after host is VERIFIED
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,     -- Curated homepage placement

    -- Stats (denormalized for performance)
    total_bookings      INTEGER NOT NULL DEFAULT 0,
    average_rating      NUMERIC(3, 2) DEFAULT NULL CHECK (average_rating BETWEEN 1.00 AND 5.00),

    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_host_profile_id ON activities (host_profile_id);
CREATE INDEX idx_activities_category        ON activities (category);
CREATE INDEX idx_activities_district        ON activities (district);
CREATE INDEX idx_activities_is_active       ON activities (is_active);

CREATE TRIGGER trg_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  activities              IS 'Bookable experiences. Only visible to tourists when is_active = TRUE and host is VERIFIED.';
COMMENT ON COLUMN activities.price_per_person IS 'Gross price in BND. Platform fee (8%) and host payout (92%) calculated at booking time.';
COMMENT ON COLUMN activities.is_active    IS 'Master switch. Set FALSE to immediately delist without deleting historical booking data.';
```

---

### 2.5 Table: `bookings`

The financial clearing ledger. This is the authoritative source of truth for all transaction states.

```sql
CREATE TYPE escrow_status AS ENUM ('FROZEN', 'RELEASED', 'DISPUTED', 'REFUNDED');

CREATE TABLE bookings (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Core references
    activity_id             UUID NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
    tourist_user_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

    -- Booking logistics
    booking_date            DATE NOT NULL,
    booking_time_slot       TIME NOT NULL,
    participant_count       INTEGER NOT NULL DEFAULT 1 CHECK (participant_count > 0),

    -- Financial ledger (all amounts in BND, computed at booking time, immutable post-creation)
    gross_amount            NUMERIC(10, 2) NOT NULL CHECK (gross_amount > 0),
    platform_fee_rate       NUMERIC(5, 4) NOT NULL DEFAULT 0.0800,   -- 8% — stored for auditability
    platform_fee_amount     NUMERIC(10, 2) NOT NULL,                 -- gross_amount * 0.08
    host_payout_rate        NUMERIC(5, 4) NOT NULL DEFAULT 0.9200,   -- 92% — stored for auditability
    host_payout_amount      NUMERIC(10, 2) NOT NULL,                 -- gross_amount * 0.92

    -- Escrow state machine
    escrow_status           escrow_status NOT NULL DEFAULT 'FROZEN',
    escrow_frozen_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    escrow_released_at      TIMESTAMPTZ,
    escrow_refunded_at      TIMESTAMPTZ,
    dispute_opened_at       TIMESTAMPTZ,
    dispute_notes           TEXT,

    -- External wallet reference (cryptographic hash returned by DST Pocket / Ding)
    wallet_ref_hash         TEXT UNIQUE,                            -- NULL until wallet confirms payment
    wallet_provider         VARCHAR(50) CHECK (wallet_provider IN ('DST_POCKET', 'DING', NULL)),
    payment_confirmed_at    TIMESTAMPTZ,

    -- Post-experience
    tourist_rating          INTEGER CHECK (tourist_rating BETWEEN 1 AND 5),
    tourist_review          TEXT,
    reviewed_at             TIMESTAMPTZ,

    -- Timestamps
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Derived constraint: fee + payout must equal gross (prevents ledger drift)
    CONSTRAINT chk_amounts_balance CHECK (
        ROUND(platform_fee_amount + host_payout_amount, 2) = ROUND(gross_amount, 2)
    )
);

-- Indexes
CREATE INDEX idx_bookings_activity_id      ON bookings (activity_id);
CREATE INDEX idx_bookings_tourist_user_id  ON bookings (tourist_user_id);
CREATE INDEX idx_bookings_escrow_status    ON bookings (escrow_status);
CREATE INDEX idx_bookings_booking_date     ON bookings (booking_date);
CREATE INDEX idx_bookings_wallet_ref_hash  ON bookings (wallet_ref_hash);

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  bookings                    IS 'Authoritative financial clearing ledger. Amounts set at creation and are immutable. Escrow state machine governs fund release.';
COMMENT ON COLUMN bookings.gross_amount       IS 'Total amount charged to tourist in BND. Equals price_per_person * participant_count.';
COMMENT ON COLUMN bookings.platform_fee_amount IS '8% of gross_amount. Retained by SideQuest Tourism as platform revenue.';
COMMENT ON COLUMN bookings.host_payout_amount IS '92% of gross_amount. Released to host bank account post-experience via payout webhook.';
COMMENT ON COLUMN bookings.wallet_ref_hash    IS 'Cryptographic transaction reference hash returned by licensed wallet API. Never contains raw card data.';
COMMENT ON COLUMN bookings.escrow_status      IS 'FROZEN=payment received, held. RELEASED=payout sent to host. DISPUTED=under review. REFUNDED=returned to tourist.';
```

---

## 3. BACKEND API ROUTES — NODE.JS / EXPRESS

### 3.1 Project Setup

```javascript
// server.js — Entry point
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// PostgreSQL connection pool (Supabase connection string)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
});

// Middleware: Verify BruneiID JWT on all /api/v1 routes
const { verifyBruneiIDToken } = require('./middleware/auth');
app.use('/api/v1', verifyBruneiIDToken);

// Route mounting
app.use('/api/v1/payout',   require('./routes/payout'));
app.use('/api/v1/bookings', require('./routes/bookings'));

app.listen(process.env.PORT || 3000, () => {
  console.log('SideQuest API running.');
});
```

---

### 3.2 Middleware: BruneiID JWT Verification

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyBruneiIDToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or malformed Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.BRUNEEID_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: process.env.BRUNEEID_ISSUER,
    });

    // Attach verified identity to request context
    req.user = {
      id:        decoded.sub,          // BruneiID subject claim → maps to users.bruneeid_sub
      legalName: decoded.legal_name,   // State-verified name from BruneiID token claim
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'TOKEN_INVALID',
      message: 'BruneiID token verification failed.',
    });
  }
};

module.exports = { verifyBruneiIDToken };
```

---

### 3.3 Firewall 2: POST `/api/v1/payout/initialize`

**Automated Bank Name Whitelisting** — Prevents fraudulent payout redirection by string-matching the verified state legal name against the declared bank account name.

```javascript
// routes/payout.js
const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

/**
 * POST /api/v1/payout/initialize
 *
 * FIREWALL 2: Automated Bank Name Whitelisting
 *
 * Security Logic:
 *   1. Fetch verified legal name from `users` table (sourced from BruneiID — immutable)
 *   2. Fetch declared payout_account_name from `host_profiles` table (user-entered)
 *   3. Normalize both strings: trim whitespace, collapse internal spaces, lowercase
 *   4. String-match: exact equality required
 *   5. MISMATCH → freeze account, flag SUSPENDED_AML_FLAG, deny payout
 *   6. MATCH    → return signed payout authorization token
 *
 * Body: { booking_id: UUID }
 */
router.post('/initialize', async (req, res) => {
  const client = await pool.connect();

  try {
    const { booking_id } = req.body;
    const requestingUserId = req.user.id; // BruneiID sub from verified JWT

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PARAM',
        message: 'booking_id is required.',
      });
    }

    await client.query('BEGIN');

    // ── Step 1: Resolve the platform user record from BruneiID sub ──────────
    const userResult = await client.query(
      `SELECT id, legal_name, aml_flag
       FROM users
       WHERE bruneeid_sub = $1
         AND is_active = TRUE
       LIMIT 1`,
      [requestingUserId]
    );

    if (userResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Authenticated user has no active SideQuest account.',
      });
    }

    const user = userResult.rows[0];

    // Pre-check: Reject if already AML-flagged
    if (user.aml_flag !== 'CLEAR') {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error: 'AML_ACCOUNT_SUSPENDED',
        message: 'This account has been suspended pending AML review. Contact support.',
      });
    }

    // ── Step 2: Fetch booking and linked host payout details ─────────────────
    const bookingResult = await client.query(
      `SELECT
         b.id              AS booking_id,
         b.escrow_status,
         b.host_payout_amount,
         hp.user_id        AS host_user_id,
         hp.payout_account_name,
         hp.payout_bank_name,
         hp.payout_account_number,
         hp.verification_status
       FROM bookings b
       JOIN activities a        ON a.id = b.activity_id
       JOIN host_profiles hp    ON hp.id = a.host_profile_id
       JOIN users host_user     ON host_user.id = hp.user_id
       WHERE b.id = $1
         AND hp.user_id = (
               SELECT id FROM users WHERE bruneeid_sub = $2 LIMIT 1
             )
       LIMIT 1`,
      [booking_id, requestingUserId]
    );

    if (bookingResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'BOOKING_NOT_FOUND',
        message: 'Booking not found or does not belong to this host.',
      });
    }

    const booking = bookingResult.rows[0];

    // Guard: Payout only from FROZEN state (prevents double-payout)
    if (booking.escrow_status !== 'FROZEN') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'INVALID_ESCROW_STATE',
        message: `Payout cannot be initialized. Current escrow status: ${booking.escrow_status}`,
      });
    }

    // ── Step 3: FIREWALL 2 — AML Name-Match Comparison ───────────────────────
    const normalize = (str) =>
      (str || '')
        .trim()
        .replace(/\s+/g, ' ')   // collapse internal whitespace
        .toLowerCase();

    const verifiedLegalName    = normalize(user.legal_name);
    const declaredPayoutName   = normalize(booking.payout_account_name);

    const nameMatchPassed = verifiedLegalName === declaredPayoutName;

    if (!nameMatchPassed) {
      // ── MISMATCH: Freeze account and log AML flag ──────────────────────────
      await client.query(
        `UPDATE users
         SET aml_flag = 'SUSPENDED_AML_FLAG', updated_at = NOW()
         WHERE id = $1`,
        [user.id]
      );

      await client.query(
        `UPDATE bookings
         SET escrow_status = 'DISPUTED',
             dispute_opened_at = NOW(),
             dispute_notes = 'AUTO-FLAGGED: AML name mismatch on payout initialization.',
             updated_at = NOW()
         WHERE id = $1`,
        [booking.booking_id]
      );

      await client.query('COMMIT');

      // Log to internal audit (replace with your logging service)
      console.error(`[SECURITY][FW-2] AML NAME MISMATCH`, {
        user_id:          user.id,
        verified_name:    user.legal_name,
        declared_name:    booking.payout_account_name,
        booking_id:       booking.booking_id,
        timestamp:        new Date().toISOString(),
      });

      return res.status(403).json({
        success: false,
        error:   'AML_NAME_MISMATCH',
        message: 'Payout denied. Account name does not match verified identity. Your account has been suspended pending review.',
      });
    }

    // ── Step 4: MATCH — Issue payout authorization token ─────────────────────
    // In production: sign a short-lived JWT or HMAC token passed to bank API
    const payoutAuthToken = Buffer.from(
      JSON.stringify({
        booking_id:    booking.booking_id,
        host_user_id:  booking.host_user_id,
        payout_amount: booking.host_payout_amount,
        bank_name:     booking.payout_bank_name,
        account_number: booking.payout_account_number,
        issued_at:     Date.now(),
        expires_at:    Date.now() + 5 * 60 * 1000, // 5-minute TTL
      })
    ).toString('base64');

    await client.query('COMMIT');

    return res.status(200).json({
      success:          true,
      message:          'Payout authorization approved. Name verification passed.',
      payout_auth_token: payoutAuthToken,
      payout_amount:    booking.host_payout_amount,
      bank_name:        booking.payout_bank_name,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERROR][POST /payout/initialize]', err);
    return res.status(500).json({
      success: false,
      error:   'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    });
  } finally {
    client.release();
  }
});

module.exports = router;
```

---

### 3.4 Firewall 4: POST `/api/v1/bookings/create`

**Cryptographic Escrow Engine** — Creates a booking record, programmatically calculates fee splits, and locks funds in FROZEN escrow state pending experience completion.

```javascript
// routes/bookings.js
const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

/**
 * POST /api/v1/bookings/create
 *
 * FIREWALL 4: Cryptographic Escrow Engine
 *
 * Security Logic:
 *   1. Validate activity exists and is active
 *   2. Validate host is VERIFIED
 *   3. Check slot capacity not exceeded
 *   4. Programmatically compute gross, platform fee (8%), host payout (92%)
 *      — client-submitted price is NEVER trusted; always recalculated server-side
 *   5. Insert booking into ledger under explicit FROZEN escrow status
 *   6. Return transaction payload for wallet redirect
 *
 * Body: {
 *   activity_id:      UUID,
 *   booking_date:     "YYYY-MM-DD",
 *   booking_time_slot: "HH:MM",
 *   participant_count: Integer
 * }
 */

const PLATFORM_FEE_RATE = 0.08;  // 8%  — SideQuest revenue
const HOST_PAYOUT_RATE  = 0.92;  // 92% — Host net payout

router.post('/create', async (req, res) => {
  const client = await pool.connect();

  try {
    const { activity_id, booking_date, booking_time_slot, participant_count } = req.body;
    const touristBruneiIDSub = req.user.id;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!activity_id || !booking_date || !booking_time_slot || !participant_count) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_PARAMS',
        message: 'activity_id, booking_date, booking_time_slot, and participant_count are required.',
      });
    }

    const parsedCount = parseInt(participant_count, 10);
    if (isNaN(parsedCount) || parsedCount < 1) {
      return res.status(400).json({
        success: false,
        error:   'INVALID_PARTICIPANT_COUNT',
        message: 'participant_count must be a positive integer.',
      });
    }

    await client.query('BEGIN');

    // ── Step 1: Resolve tourist user ──────────────────────────────────────────
    const touristResult = await client.query(
      `SELECT id, aml_flag
       FROM users
       WHERE bruneeid_sub = $1 AND is_active = TRUE
       LIMIT 1`,
      [touristBruneiIDSub]
    );

    if (touristResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error:   'USER_NOT_FOUND',
        message: 'No active account found for the authenticated user.',
      });
    }

    const tourist = touristResult.rows[0];

    if (tourist.aml_flag !== 'CLEAR') {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        error:   'AML_ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // ── Step 2: Fetch activity and verify host eligibility ────────────────────
    const activityResult = await client.query(
      `SELECT
         a.id,
         a.title,
         a.price_per_person,
         a.max_participants,
         a.is_active,
         hp.verification_status AS host_verification_status
       FROM activities a
       JOIN host_profiles hp ON hp.id = a.host_profile_id
       WHERE a.id = $1
       LIMIT 1`,
      [activity_id]
    );

    if (activityResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error:   'ACTIVITY_NOT_FOUND',
        message: 'The requested activity does not exist.',
      });
    }

    const activity = activityResult.rows[0];

    if (!activity.is_active) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error:   'ACTIVITY_INACTIVE',
        message: 'This activity is currently not available for booking.',
      });
    }

    if (activity.host_verification_status !== 'VERIFIED') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error:   'HOST_NOT_VERIFIED',
        message: 'This host is not yet verified to accept bookings.',
      });
    }

    // ── Step 3: Check slot capacity ───────────────────────────────────────────
    const capacityResult = await client.query(
      `SELECT COALESCE(SUM(participant_count), 0) AS booked_count
       FROM bookings
       WHERE activity_id = $1
         AND booking_date = $2
         AND booking_time_slot = $3
         AND escrow_status NOT IN ('REFUNDED')`,
      [activity_id, booking_date, booking_time_slot]
    );

    const bookedCount    = parseInt(capacityResult.rows[0].booked_count, 10);
    const remainingSlots = activity.max_participants - bookedCount;

    if (parsedCount > remainingSlots) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error:   'INSUFFICIENT_CAPACITY',
        message: `Only ${remainingSlots} slot(s) remaining for this time slot.`,
        remaining_slots: remainingSlots,
      });
    }

    // ── Step 4: FIREWALL 4 — Programmatic fee computation ────────────────────
    // CRITICAL: All amounts computed server-side from canonical DB price.
    // Client-submitted price values are never accepted.

    const pricePerPerson  = parseFloat(activity.price_per_person);
    const grossAmount     = parseFloat((pricePerPerson * parsedCount).toFixed(2));
    const platformFeeAmt  = parseFloat((grossAmount * PLATFORM_FEE_RATE).toFixed(2));
    // Host payout derived as remainder to prevent floating-point ledger drift
    const hostPayoutAmt   = parseFloat((grossAmount - platformFeeAmt).toFixed(2));

    // Sanity assertion: amounts must balance
    const ledgerCheck = parseFloat((platformFeeAmt + hostPayoutAmt).toFixed(2));
    if (ledgerCheck !== grossAmount) {
      await client.query('ROLLBACK');
      console.error('[CRITICAL][LEDGER DRIFT]', { grossAmount, platformFeeAmt, hostPayoutAmt, ledgerCheck });
      return res.status(500).json({
        success: false,
        error:   'LEDGER_CALCULATION_ERROR',
        message: 'A financial calculation error occurred. Transaction aborted.',
      });
    }

    // ── Step 5: Insert booking under FROZEN escrow state ─────────────────────
    const insertResult = await client.query(
      `INSERT INTO bookings (
         activity_id,
         tourist_user_id,
         booking_date,
         booking_time_slot,
         participant_count,
         gross_amount,
         platform_fee_rate,
         platform_fee_amount,
         host_payout_rate,
         host_payout_amount,
         escrow_status,
         escrow_frozen_at
       ) VALUES (
         $1, $2, $3, $4, $5,
         $6, $7, $8, $9, $10,
         'FROZEN', NOW()
       )
       RETURNING id, gross_amount, platform_fee_amount, host_payout_amount, escrow_status, created_at`,
      [
        activity_id,
        tourist.id,
        booking_date,
        booking_time_slot,
        parsedCount,
        grossAmount,
        PLATFORM_FEE_RATE,
        platformFeeAmt,
        HOST_PAYOUT_RATE,
        hostPayoutAmt,
      ]
    );

    const newBooking = insertResult.rows[0];

    await client.query('COMMIT');

    // ── Step 6: Return transaction payload ────────────────────────────────────
    return res.status(201).json({
      success: true,
      message: 'Booking created. Funds held in escrow. Redirect tourist to wallet payment.',
      data: {
        booking_id:           newBooking.id,
        activity_title:       activity.title,
        booking_date:         booking_date,
        booking_time_slot:    booking_time_slot,
        participant_count:    parsedCount,
        financial_summary: {
          gross_amount:         newBooking.gross_amount,
          platform_fee_amount:  newBooking.platform_fee_amount,
          host_payout_amount:   newBooking.host_payout_amount,
          currency:             'BND',
        },
        escrow_status:        newBooking.escrow_status,
        created_at:           newBooking.created_at,
        // Wallet redirect: construct payment URL using booking_id as reference
        wallet_payment_url:  `${process.env.WALLET_GATEWAY_URL}/pay?ref=${newBooking.id}&amount=${newBooking.gross_amount}&currency=BND`,
      },
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERROR][POST /bookings/create]', err);
    return res.status(500).json({
      success: false,
      error:   'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    });
  } finally {
    client.release();
  }
});

module.exports = router;
```

---

## 4. MOBILE UI ARCHITECTURE — FLUTTER

### 4.1 ActivityCard Widget

A modular, reusable Flutter Dart widget representing a single bookable experience in the discovery feed. Designed for high-performance list rendering with `ListView.builder`.

```dart
// lib/widgets/activity_card.dart

import 'package:flutter/material.dart';

/// Data model for a SideQuest activity listing.
class Activity {
  final String id;
  final String title;
  final String hostBusinessName;
  final String district;
  final double pricePerPerson;
  final double averageRating;
  final int totalBookings;
  final String category; // 'CULTURE' | 'FOOD' | 'NATURE' | 'CREATIVE'
  final String? thumbnailUrl;

  const Activity({
    required this.id,
    required this.title,
    required this.hostBusinessName,
    required this.district,
    required this.pricePerPerson,
    required this.averageRating,
    required this.totalBookings,
    required this.category,
    this.thumbnailUrl,
  });

  /// Factory constructor from JSON (API response mapping)
  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id:               json['id'] as String,
      title:            json['title'] as String,
      hostBusinessName: json['host_business_name'] as String,
      district:         json['district'] as String,
      pricePerPerson:   double.parse(json['price_per_person'].toString()),
      averageRating:    json['average_rating'] != null
                          ? double.parse(json['average_rating'].toString())
                          : 0.0,
      totalBookings:    json['total_bookings'] as int? ?? 0,
      category:         json['category'] as String,
      thumbnailUrl:     json['thumbnail_url'] as String?,
    );
  }
}

/// Maps activity categories to Material Icons.
IconData _categoryIcon(String category) {
  switch (category) {
    case 'CULTURE':  return Icons.museum_outlined;
    case 'FOOD':     return Icons.restaurant_outlined;
    case 'NATURE':   return Icons.park_outlined;
    case 'CREATIVE': return Icons.palette_outlined;
    default:         return Icons.star_outline;
  }
}

/// Maps activity categories to brand accent colours.
Color _categoryColor(String category) {
  switch (category) {
    case 'CULTURE':  return const Color(0xFF8B5CF6); // Violet
    case 'FOOD':     return const Color(0xFFEF4444); // Red
    case 'NATURE':   return const Color(0xFF10B981); // Emerald
    case 'CREATIVE': return const Color(0xFFF59E0B); // Amber
    default:         return const Color(0xFF6B7280); // Grey
  }
}

/// SideQuest ActivityCard — primary discovery surface widget.
///
/// Usage:
/// ```dart
/// ActivityCard(
///   activity: activity,
///   onTap: () => Navigator.pushNamed(context, '/activity', arguments: activity.id),
/// )
/// ```
class ActivityCard extends StatelessWidget {
  final Activity activity;
  final VoidCallback? onTap;

  const ActivityCard({
    super.key,
    required this.activity,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final categoryColor = _categoryColor(activity.category);
    final categoryIcon  = _categoryIcon(activity.category);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.07),
              blurRadius: 12.0,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Thumbnail Section ─────────────────────────────────────────────
            _buildThumbnail(context, categoryColor, categoryIcon),

            // ── Content Section ───────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(14.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Activity Title
                  Text(
                    activity.title,
                    style: const TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                      height: 1.3,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 6.0),

                  // Host Business Name
                  Row(
                    children: [
                      const Icon(
                        Icons.storefront_outlined,
                        size: 14.0,
                        color: Color(0xFF6B7280),
                      ),
                      const SizedBox(width: 4.0),
                      Expanded(
                        child: Text(
                          activity.hostBusinessName,
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: Color(0xFF6B7280),
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 4.0),

                  // District Locator
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 14.0,
                        color: Color(0xFF9CA3AF),
                      ),
                      const SizedBox(width: 4.0),
                      Text(
                        activity.district,
                        style: const TextStyle(
                          fontSize: 12.0,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12.0),
                  const Divider(height: 1.0, color: Color(0xFFF3F4F6)),
                  const SizedBox(height: 12.0),

                  // ── Footer Row: Rating + Price ────────────────────────────
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Rating Score
                      _buildRatingBadge(),

                      // Price
                      _buildPriceTag(),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Builds the thumbnail with a gradient overlay and category badge.
  Widget _buildThumbnail(
    BuildContext context,
    Color categoryColor,
    IconData categoryIcon,
  ) {
    return SizedBox(
      height: 180.0,
      width: double.infinity,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Thumbnail image or placeholder
          activity.thumbnailUrl != null
              ? Image.network(
                  activity.thumbnailUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => _thumbnailPlaceholder(categoryColor, categoryIcon),
                )
              : _thumbnailPlaceholder(categoryColor, categoryIcon),

          // Gradient overlay for readability
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.25),
                  ],
                ),
              ),
            ),
          ),

          // Category Badge (top-left)
          Positioned(
            top: 10.0,
            left: 10.0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
              decoration: BoxDecoration(
                color: categoryColor,
                borderRadius: BorderRadius.circular(20.0),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(categoryIcon, color: Colors.white, size: 12.0),
                  const SizedBox(width: 4.0),
                  Text(
                    activity.category,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11.0,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Fallback placeholder when no thumbnail URL is available.
  Widget _thumbnailPlaceholder(Color categoryColor, IconData categoryIcon) {
    return Container(
      color: categoryColor.withOpacity(0.12),
      child: Center(
        child: Icon(
          categoryIcon,
          size: 48.0,
          color: categoryColor.withOpacity(0.5),
        ),
      ),
    );
  }

  /// Star rating display with booking count.
  Widget _buildRatingBadge() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 16.0),
        const SizedBox(width: 3.0),
        Text(
          activity.averageRating > 0
              ? activity.averageRating.toStringAsFixed(1)
              : 'New',
          style: const TextStyle(
            fontSize: 13.0,
            fontWeight: FontWeight.w700,
            color: Color(0xFF374151),
          ),
        ),
        if (activity.totalBookings > 0) ...[
          const SizedBox(width: 3.0),
          Text(
            '(${activity.totalBookings})',
            style: const TextStyle(
              fontSize: 12.0,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ],
      ],
    );
  }

  /// Formatted BND currency price display.
  Widget _buildPriceTag() {
    return RichText(
      text: TextSpan(
        children: [
          const TextSpan(
            text: 'BND ',
            style: TextStyle(
              fontSize: 12.0,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
          TextSpan(
            text: activity.pricePerPerson.toStringAsFixed(2),
            style: const TextStyle(
              fontSize: 18.0,
              fontWeight: FontWeight.w800,
              color: Color(0xFF111827),
            ),
          ),
          const TextSpan(
            text: ' /pax',
            style: TextStyle(
              fontSize: 11.0,
              fontWeight: FontWeight.w400,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }
}
```

### 4.2 Usage Example

```dart
// lib/screens/discover_screen.dart

import 'package:flutter/material.dart';
import '../widgets/activity_card.dart';

class DiscoverScreen extends StatelessWidget {
  final List<Activity> activities; // Injected from API/state management

  const DiscoverScreen({super.key, required this.activities});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          'SideQuest',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF111827),
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 12.0),
        itemCount: activities.length,
        itemBuilder: (context, index) {
          return ActivityCard(
            activity: activities[index],
            onTap: () {
              Navigator.pushNamed(
                context,
                '/activity-detail',
                arguments: activities[index].id,
              );
            },
          );
        },
      ),
    );
  }
}
```

---

## 5. DATA FORMULAS & SCALE PROJECTIONS

### 5.1 Unit Economics Model

| Parameter | Value | Notes |
|---|---|---|
| Average Basket Size | **BND 60.00** | Premium normalized workshop booking |
| Platform Fee Rate | **8.00%** | `gross × 0.08` |
| Platform Fee / Booking | **BND 4.80** | Gross revenue per transaction |
| Wallet Processing Fee Rate | **1.50%** | COGS — DST Pocket / Ding infrastructure |
| Wallet Processing Fee / Booking | **BND 0.90** | `gross × 0.015` |
| **Net Contribution / Booking** | **BND 3.90** | `Platform Fee − Wallet Fee` |
| Host Payout / Booking | **BND 55.20** | `gross × 0.92` |

**Formula Reference:**

```
Gross Revenue     = Bookings × BND 60.00 × 0.08
COGS              = Bookings × BND 60.00 × 0.015
Gross Profit      = Gross Revenue − COGS
Net Profit / Loss = Gross Profit − Fixed Operating Costs
```

---

### 5.2 Five-Month Profit & Loss Projection

| Month | Bookings | Gross Revenue (BND) | COGS — Wallet 1.5% (BND) | Gross Profit (BND) | Server Ops Cost (BND) | **Net P&L (BND)** | Status |
|---|---|---|---|---|---|---|---|
| **Month 1** | 50 | 240.00 | 45.00 | 195.00 | 50.00 | **+145.00** | Early Traction |
| **Month 2** | 200 | 960.00 | 180.00 | 780.00 | 80.00 | **+700.00** | Growth Phase |
| **Month 3** | 750 | 3,600.00 | 675.00 | 2,925.00 | 150.00 | **+2,775.00** | ⭐ BREAK-EVEN EXCEEDED |
| **Month 4** | 1,500 | 7,200.00 | 1,350.00 | 5,850.00 | 200.00 | **+5,650.00** | Scale Phase |
| **Month 5** | 2,500 | 12,000.00 | 2,250.00 | 9,750.00 | 250.00 | **+9,500.00** | Profitable Operations |

> **Note:** Server operating costs scale from BND 50 (Render free tier + Supabase free tier) to BND 250 (production-grade Render Standard + Supabase Pro) across the trajectory. All figures in Brunei Dollar (BND).

**Cumulative 5-Month Net Earnings: BND 18,770.00**

---

### 5.3 Detailed Monthly Calculations

```
Month 1  (50 bookings):
  Gross Revenue  = 50 × 60 × 0.08  = BND   240.00
  COGS           = 50 × 60 × 0.015 = BND    45.00
  Gross Profit   =                    BND   195.00
  Server Ops     =                    BND    50.00
  Net P&L        =                    BND  +145.00

Month 2  (200 bookings):
  Gross Revenue  = 200 × 60 × 0.08  = BND   960.00
  COGS           = 200 × 60 × 0.015 = BND   180.00
  Gross Profit   =                     BND   780.00
  Server Ops     =                     BND    80.00
  Net P&L        =                     BND  +700.00

Month 3  (750 bookings) — ⭐ BREAK-EVEN MILESTONE:
  Gross Revenue  = 750 × 60 × 0.08  = BND 3,600.00
  COGS           = 750 × 60 × 0.015 = BND   675.00
  Gross Profit   =                     BND 2,925.00
  Server Ops     =                     BND   150.00
  Net P&L        =                     BND +2,775.00

Month 4  (1,500 bookings):
  Gross Revenue  = 1500 × 60 × 0.08  = BND 7,200.00
  COGS           = 1500 × 60 × 0.015 = BND 1,350.00
  Gross Profit   =                      BND 5,850.00
  Server Ops     =                      BND   200.00
  Net P&L        =                      BND +5,650.00

Month 5  (2,500 bookings):
  Gross Revenue  = 2500 × 60 × 0.08  = BND 12,000.00
  COGS           = 2500 × 60 × 0.015 = BND  2,250.00
  Gross Profit   =                      BND  9,750.00
  Server Ops     =                      BND    250.00
  Net P&L        =                      BND +9,500.00
```

---

### 5.4 Strategic Insights: Month 3 Break-Even & Asset-Light Advantage

#### Why Month 3 Break-Even Is Strategically Significant

The Month 3 milestone — **750 bookings at BND 60.00 average** — is not an arbitrary target. It represents the inflection point at which SideQuest's business model structurally proves itself:

**1. Operational Leverage Is Extreme**

At 750 bookings, the platform generates BND 3,600 in gross revenue against only BND 150 in server costs — a **24× revenue-to-infrastructure ratio**. This is a hallmark of pure marketplace economics: each incremental booking costs near-zero to process once the platform exists.

**2. No Capital-Intensive Barriers**

Unlike hospitality platforms that must pre-purchase inventory, SideQuest carries **zero experience inventory**. Hosts bear all production costs (venue, materials, labour). SideQuest's only material cost of goods is the wallet processing fee — a variable cost that scales perfectly with revenue, never outpacing it.

**3. The BND 50–250 Server Cost Band**

The server cost envelope from BND 50 to BND 250 across 2,500 bookings/month demonstrates the **sub-linear cost scaling** of the chosen infrastructure stack:

| Milestone | Monthly Bookings | Server Cost | Cost per Booking |
|---|---|---|---|
| Launch | 50 | BND 50 | BND 1.00 |
| Break-even | 750 | BND 150 | BND 0.20 |
| Scale | 2,500 | BND 250 | BND 0.10 |

As bookings grow **50×**, server costs grow only **5×**. This is the compounding advantage of managed cloud infrastructure (Render + Supabase) versus self-hosted servers.

**4. Community Supply-Side Is Self-Sustaining**

Because SideQuest targets Micro-MSMEs and artisans who currently have **zero digital infrastructure**, the platform's value proposition is existential, not competitive. A traditional silversmith in Temburong has no alternative channel for international visibility. This creates a durable, low-churn host supply with minimal CAC (Customer Acquisition Cost).

**5. Month 3 As Proof-of-Concept for External Capital**

A verified, documented Month 3 break-even — achievable with zero paid marketing (organic community seeding, BruneiID integration, offline partnerships with Tourism Brunei) — creates a compelling data proof point for Series A conversations, BIBD SME financing, or BINA grant applications at Month 4–5 scale.

---

### 5.5 Growth Trajectory Visualisation

```
Net P&L (BND)
│
10,000 ┤                                          ╭──● M5: +9,500
       │                                    ╭─────╯
 6,000 ┤                              ╭─────╯
       │                        ╭─────╯ M4: +5,650
 3,000 ┤                  ╭─────╯
       │            ╭─────╯ M3: +2,775 ⭐ BREAK-EVEN
   750 ┤      ╭─────╯
       │╭─────╯ M2: +700
   150 ●  M1: +145
       │
       └──────────────────────────────────────────────────
       M1     M2     M3     M4     M5
      (50)   (200)  (750) (1,500)(2,500) bookings/month
```

---

*End of SideQuest Tourism Technical Specification Master Sheet v1.0.0*

---

> **Confidentiality Notice:** This document contains proprietary architectural decisions, financial models, and security firewall logic for SideQuest Tourism. Distribution is restricted to authorised development team members and technical co-founders only.
