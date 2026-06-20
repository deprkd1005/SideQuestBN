# SideQuest Tourism Vertical - Developer Guide

This document is the master specification guide for the **SideQuest Tourism** vertical. This module is designed as a completely isolated, decoupled marketplace for premium peer-to-peer activities, heritage workshops, local artisans, and unique cultural experiences in Brunei (without any generic gig economy, student, or driver vocabularies).

---

## 📂 Module Directory Structure

All files for this vertical are organized under `/verticals/tourism/`:

```text
/verticals/tourism/
├── database/
│   └── schema.sql                    # Neon Serverless PostgreSQL DDL tables
├── backend/
│   └── routes/
│       └── routes.js                 # Express.js API routes implementing firewalls
├── frontend/
│   └── widgets/
│       ├── activity_card.dart        # Flutter widget – activity display card
│       ├── marketplace_grid.dart     # Flutter widget – search, filter & activity grid
│       ├── escrow_booking_widget.dart # Flutter widget – booking & escrow fee ledger
│       └── payout_status_widget.dart  # Flutter widget – bank KYC & AML payout control
├── tests/
│   └── verify_endpoints.js           # Automated firewall verification test suite
└── docs/
    └── developer_guide.md            # This master spec document
```

---

## 🗄️ Database Connectivity

The backend uses the **`@neondatabase/serverless`** driver for PostgreSQL connectivity:

```javascript
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

All queries are routed through the Neon serverless pool or the mock database store (for local verification without a live DB).

---

## 🏛️ Architecture & Database Design

The vertical's database is modeled using PostgreSQL (see [schema.sql](file:///c:/Users/user/SideQuestBN/verticals/tourism/database/schema.sql)).

### Entity Relationship Model

1. **`users` Table**
   - Stores identity information linked to BruneiID SSO.
   - Key fields: `bruneeid_sub`, `bruneeid_token_ref`, `legal_name`, `ic_number`, `email`, `phone`.
   - Compliance field: `aml_flag` — values: `CLEAR` or `SUSPENDED_AML_FLAG`.
   - `role` distinguishes `HOST` vs `TOURIST`.

2. **`host_profiles` Table**
   - References `users(id)` via `user_id`.
   - Contains `business_name`, `rocbn_number`, `business_bio`, `profile_photo_url`.
   - `verification_status`: `PENDING`, `VERIFIED`, or `REJECTED`.
   - **Payout destination fields** (critical for Firewall 2):
     - `payout_bank_name` — e.g. `BIBD`, `Baiduri`
     - `payout_account_number` — bank account number
     - `payout_account_name` — bank registered name (compared against `users.legal_name`)

3. **`activities` Table**
   - References `host_profiles(id)` via `host_profile_id`.
   - Contains: `title`, `description`, `category` (`CULTURE`, `FOOD`, `NATURE`, `CREATIVE`).
   - `district` — one of: `Brunei-Muara`, `Tutong`, `Belait`, `Temburong`.
   - **Pricing**: `price_per_person` (BND), `duration_minutes`, `max_participants`.
   - Status: `is_active`, `is_featured`, `total_bookings`, `average_rating`.

4. **`bookings` Table**
   - The financial clearing ledger linking travelers to activities.
   - Key fields:
     - `activity_id`, `tourist_user_id` — references to activity and traveler
     - `booking_date`, `booking_time_slot` — scheduling fields
     - `participant_count` — number of participants
   - **Programmatic fee breakdown** (computed server-side):
     - `gross_amount` = `price_per_person × participant_count`
     - `platform_fee_rate` = `0.08` (8%)
     - `platform_fee_amount` = `gross_amount × 0.08`
     - `host_payout_rate` = `0.92` (92%)
     - `host_payout_amount` = `gross_amount - platform_fee_amount`
   - **Escrow state machine**: `escrow_status` — values:
     - `FROZEN` — funds locked at booking creation
     - `RELEASED` — payout cleared to host
     - `DISPUTED` — AML mismatch flagged
     - `REFUNDED` — cancellation/refund processed

---

## 🛡️ Mandatory Backend Firewalls

The backend routes in [routes.js](file:///c:/Users/user/SideQuestBN/verticals/tourism/backend/routes/routes.js) enforce two security firewalls:

### Firewall 1: Tokenized Escrow Firewall (`POST /bookings/create`)

**Purpose**: Programmatic fee computation and escrow fund locking.

**Request Payload**:
```json
{
  "activity_id": "act_boat_craft_001",
  "tourist_user_id": "usr_traveler_001",
  "booking_date": "2025-03-15",
  "booking_time_slot": "10:00",
  "participant_count": 3
}
```

**Logic**:
1. Validates all required parameters.
2. Resolves tourist user — checks `aml_flag === 'CLEAR'`.
3. Resolves activity — checks `is_active === true`.
4. Verifies host profile `verification_status === 'VERIFIED'`.
5. Checks slot capacity: `max_participants - bookedCount >= participant_count`.
6. **Server-side fee computation** (prevents client-side tampering):
   - `gross_amount = price_per_person × participant_count`
   - `platform_fee_amount = gross_amount × 0.08`
   - `host_payout_amount = gross_amount - platform_fee_amount`
7. Runs ledger sanity check: `platform_fee_amount + host_payout_amount === gross_amount`.
8. Creates booking record with `escrow_status: 'FROZEN'`.

**Success Response** (201):
```json
{
  "success": true,
  "message": "Booking created. Funds held in escrow.",
  "booking": {
    "id": "bk_1718837123_456",
    "activity_id": "act_boat_craft_001",
    "tourist_user_id": "usr_traveler_001",
    "gross_amount": 150.00,
    "platform_fee_amount": 12.00,
    "host_payout_amount": 138.00,
    "escrow_status": "FROZEN"
  }
}
```

### Firewall 2: Payout Whitelisting Firewall (`POST /payout/initialize`)

**Purpose**: Automated e-KYC name verification before releasing funds to partner wallets.

**Request Payload**:
```json
{
  "booking_id": "bk_1718837123_456",
  "host_user_id": "usr_host_001",
  "partner_wallet_type": "POCKET"
}
```

**Logic**:
1. Validates required parameters; checks `partner_wallet_type` is `POCKET` or `DING`.
2. Fetches host user — checks `aml_flag === 'CLEAR'`.
3. Fetches booking — checks `escrow_status === 'FROZEN'`.
4. Fetches host profile's `payout_account_name`.
5. **String normalization** for comparison:
   ```javascript
   const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ').toLowerCase();
   ```
6. Compares: `normalize(users.legal_name) === normalize(host_profiles.payout_account_name)`

**On Match**:
- Issues Base64-encoded `payout_auth_token`.
- Updates `escrow_status` → `RELEASED`.
- Returns partner receipt with transaction details.

**On Mismatch**:
1. Updates `aml_flag` → `SUSPENDED_AML_FLAG` for the host user.
2. Traverses all `FROZEN` bookings linked to the host → sets `escrow_status` → `DISPUTED`.
3. Returns `403` with `AML_NAME_MISMATCH` error and audit trail.

---

## 📱 Premium Flutter Frontend Widgets

The widgets in [widgets/](file:///c:/Users/user/SideQuestBN/verticals/tourism/frontend/widgets/) provide high-fidelity user experiences:

### 1. `ActivityCard` ([activity_card.dart](file:///c:/Users/user/SideQuestBN/verticals/tourism/frontend/widgets/activity_card.dart))
- Uses the `Activity` data model with fields: `id`, `title`, `hostBusinessName`, `category`, `district`, `pricePerPerson`, `averageRating`, `totalBookings`, `thumbnailUrl`.
- Glassmorphic card design with rating stars, district badge, MSME tag, duration display, and BND pricing.

### 2. `MarketplaceGrid` ([marketplace_grid.dart](file:///c:/Users/user/SideQuestBN/verticals/tourism/frontend/widgets/marketplace_grid.dart))
- Search and filter container.
- Horizontal scrolling chips for Brunei's 4 districts and activity categories (`CULTURE`, `FOOD`, `NATURE`, `CREATIVE`).
- Emits selected activity as a Map with spec-aligned keys: `id`, `title`, `host_business_name`, `category`, `district`, `price_per_person`, `average_rating`, `thumbnail_url`.

### 3. `EscrowBookingWidget` ([escrow_booking_widget.dart](file:///c:/Users/user/SideQuestBN/verticals/tourism/frontend/widgets/escrow_booking_widget.dart))
- Bottom-sheet checkout UI for travelers.
- Reads activity data using spec keys: `price_per_person`, `host_business_name`.
- Includes **date picker** and **time slot selector** (`booking_date`, `booking_time_slot`).
- Participant counter with live fee recalculation.
- Displays tokenized escrow breakdown: `gross_amount`, `platform_fee_amount` (8%), `host_payout_amount` (92%).
- Constructs the exact API payload matching `POST /bookings/create` request body.
- Success screen reads from the booking response (`escrow_status`, `id`, all financial fields).

### 4. `PayoutStatusWidget` ([payout_status_widget.dart](file:///c:/Users/user/SideQuestBN/verticals/tourism/frontend/widgets/payout_status_widget.dart))
- Host dashboard component for payout management.
- Reads from spec-aligned fields: `legal_name`, `aml_flag`, `payout_account_name`, `payout_bank_name`, `payout_account_number`.
- Accepts optional `activeBooking` context to display pending payout info.
- Displays AML status badge (`CLEAR` / `SUSPENDED`).
- Red warning banner when `SUSPENDED_AML_FLAG` is active — disables payout buttons.
- Two payout actions: **Pay with Pocket** and **Pay with Ding** (matching `partner_wallet_type` enum).
- Client-side normalization replicates Firewall 2 logic: `trim → replaceAll(\s+, ' ') → toLowerCase`.
- Developer Simulator controls: `Simulate Match`, `Simulate Mismatch`, `Reset`.

---

## ✅ Verification & Testing

Run the automated test suite to verify both firewalls:

```bash
cd verticals/tourism
node tests/verify_endpoints.js
```

The test suite ([verify_endpoints.js](file:///c:/Users/user/SideQuestBN/verticals/tourism/tests/verify_endpoints.js)) validates:
1. **Escrow Firewall** — Booking creation with correct fee computation (8%/92% split).
2. **Payout Success** — Name match → `RELEASED` escrow status + partner receipt.
3. **Payout Mismatch** — Name mismatch → `SUSPENDED_AML_FLAG` + `DISPUTED` escrow.
4. **AML Propagation** — Suspended user blocked from creating new bookings.

---

## 🔑 Key Field Name Reference

| Context | Old Field Name | Current Spec Field Name |
|---------|---------------|------------------------|
| Activity pricing | `priceBnd` | `price_per_person` |
| Booking total | `total_price_bnd` | `gross_amount` |
| Platform fee | `platform_fee_bnd` | `platform_fee_amount` |
| Host payout | `host_payout_bnd` | `host_payout_amount` |
| User compliance | `aml_status` | `aml_flag` |
| User KYC name | `ekyc_legal_name` | `legal_name` |
| Bank name | `bank_destination_name` | `payout_account_name` |
| Escrow state values | `CLEARED`, `PENDING`, `SUSPENDED_AML_FLAG` | `CLEAR`, `FROZEN`, `RELEASED`, `DISPUTED`, `REFUNDED` |
| Host name display | `hostName` | `host_business_name` |
