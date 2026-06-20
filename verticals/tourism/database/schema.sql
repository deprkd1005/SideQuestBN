-- PostgreSQL Schema for SideQuest Tourism Vertical
-- Focuses 100% on premium peer-to-peer activities for Micro-MSMEs, Local Artisans, and Heritage Workshops in Brunei.

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Define custom enum types
CREATE TYPE activity_category AS ENUM ('CULTURE', 'FOOD', 'NATURE', 'CREATIVE');
CREATE TYPE brunei_district   AS ENUM ('Brunei-Muara', 'Tutong', 'Belait', 'Temburong');
CREATE TYPE escrow_status     AS ENUM ('FROZEN', 'RELEASED', 'DISPUTED', 'REFUNDED');

-- 1. USERS TABLE
-- Linked to BruneiID OAuth. Stores state-verified identity data only. No passwords stored.
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

-- 2. HOST PROFILES TABLE
-- One-to-one extension of users for experience hosts. Stores business registration and payout details.
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
    payout_account_name     VARCHAR(255),                   -- MUST match users.legal_name for AML checks

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

-- 3. ACTIVITIES TABLE
-- The core experience catalogue. Each row represents a bookable workshop, tour, or cultural activity.
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

-- 4. BOOKINGS TABLE (FINANCIAL CLEARING LEDGER)
-- Tracks activity bookings, locks funds, and maintains escrow/aml audit trails.
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

-- Indexes for performance & lookups
CREATE INDEX idx_bookings_activity_id      ON bookings (activity_id);
CREATE INDEX idx_bookings_tourist_user_id  ON bookings (tourist_user_id);
CREATE INDEX idx_bookings_escrow_status    ON bookings (escrow_status);
CREATE INDEX idx_bookings_booking_date     ON bookings (booking_date);
CREATE INDEX idx_bookings_wallet_ref_hash  ON bookings (wallet_ref_hash);

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  users                    IS 'Platform users. Identity fields sourced from BruneiID OAuth; no credentials stored.';
COMMENT ON COLUMN users.bruneeid_sub       IS 'Immutable OAuth subject claim from BruneiID. Primary identity anchor.';
COMMENT ON COLUMN users.legal_name         IS 'Verified legal name from Brunei state registry via BruneiID. Used for AML name-matching.';
COMMENT ON COLUMN users.ic_number          IS 'National Identity Card number. Unique constraint enforces one account per citizen.';
COMMENT ON COLUMN users.aml_flag           IS 'Anti-Money Laundering status. SUSPENDED_AML_FLAG blocks all payouts and new bookings.';

COMMENT ON TABLE  host_profiles                     IS 'Business profiles for activity hosts. Requires admin VERIFIED status before listing activities.';
COMMENT ON COLUMN host_profiles.rocbn_number        IS 'Registry of Companies & Business Names registration number. Optional for informal sole traders.';
COMMENT ON COLUMN host_profiles.payout_account_name IS 'Bank account name for payouts. Cross-checked against users.legal_name via Firewall 2 AML check.';

COMMENT ON TABLE  activities              IS 'Bookable experiences. Only visible to tourists when is_active = TRUE and host is VERIFIED.';
COMMENT ON COLUMN activities.price_per_person IS 'Gross price in BND. Platform fee (8%) and host payout (92%) calculated at booking time.';
COMMENT ON COLUMN activities.is_active    IS 'Master switch. Set FALSE to immediately delist without deleting historical booking data.';

COMMENT ON TABLE  bookings                    IS 'Authoritative financial clearing ledger. Amounts set at creation and are immutable. Escrow state machine governs fund release.';
COMMENT ON COLUMN bookings.gross_amount       IS 'Total amount charged to tourist in BND. Equals price_per_person * participant_count.';
COMMENT ON COLUMN bookings.platform_fee_amount IS '8% of gross_amount. Retained by SideQuest Tourism as platform revenue.';
COMMENT ON COLUMN bookings.host_payout_amount IS '92% of gross_amount. Released to host bank account post-experience via payout webhook.';
COMMENT ON COLUMN bookings.wallet_ref_hash    IS 'Cryptographic transaction reference hash returned by licensed wallet API. Never contains raw card data.';
COMMENT ON COLUMN bookings.escrow_status      IS 'FROZEN=payment received, held. RELEASED=payout sent to host. DISPUTED=under review. REFUNDED=returned to tourist.';

