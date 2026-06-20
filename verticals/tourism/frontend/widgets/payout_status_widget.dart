import 'package:flutter/material.dart';

class PayoutStatusWidget extends StatefulWidget {
  /// Expects keys matching the backend schema:
  /// - 'id': user_id string
  /// - 'legal_name': verified e-KYC legal name from users table
  /// - 'aml_flag': 'CLEAR' or 'SUSPENDED_AML_FLAG'
  /// - 'payout_account_name': bank destination name from host_profiles
  /// - 'payout_bank_name': bank name (e.g. 'BIBD', 'Baiduri')
  /// - 'payout_account_number': bank account number string
  final Map<String, dynamic> hostUser;
  final Map<String, dynamic>? hostProfile;

  /// Optional booking to initialize payout for
  final Map<String, dynamic>? activeBooking;

  /// Callback for executing payout via POST /payout/initialize
  final Future<Map<String, dynamic>> Function(
    String bookingId,
    String hostUserId,
    String partnerWalletType,
  )? onTriggerPayout;

  const PayoutStatusWidget({
    Key? key,
    required this.hostUser,
    this.hostProfile,
    this.activeBooking,
    this.onTriggerPayout,
  }) : super(key: key);

  @override
  State<PayoutStatusWidget> createState() => _PayoutStatusWidgetState();
}

class _PayoutStatusWidgetState extends State<PayoutStatusWidget> {
  late String amlFlag;
  late String legalName;
  late String payoutAccountName;
  late String payoutBankName;
  late String payoutAccountNumber;
  bool isVerifying = false;
  String? payoutLog;
  bool showMismatchBanner = false;

  @override
  void initState() {
    super.initState();
    _initFromProps();
  }

  void _initFromProps() {
    amlFlag = widget.hostUser['aml_flag'] ?? 'CLEAR';
    legalName = widget.hostUser['legal_name'] ?? '';

    // Host profile fields may come from hostProfile or be flattened into hostUser
    final profile = widget.hostProfile ?? widget.hostUser;
    payoutAccountName = profile['payout_account_name'] ?? '';
    payoutBankName = profile['payout_bank_name'] ?? '';
    payoutAccountNumber = profile['payout_account_number'] ?? '';

    showMismatchBanner = amlFlag == 'SUSPENDED_AML_FLAG';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade950,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Payout Destination Settings',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              _buildStatusBadge(),
            ],
          ),
          const SizedBox(height: 16),

          // AML Flag Warning Banner
          if (showMismatchBanner || amlFlag == 'SUSPENDED_AML_FLAG') ...[
            Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.red.withOpacity(0.3)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.gpp_bad, color: Colors.redAccent, size: 24),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'AML SECURITY FREEZE ACTIVE',
                          style: TextStyle(
                            color: Colors.redAccent,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Payouts are locked because your payout_account_name does not match your verified legal_name. Contact partner support to clear the SUSPENDED_AML_FLAG.',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],

          // Bank Details Display — uses spec-aligned field names
          _buildDetailRow('Verified Legal Name (users.legal_name)', legalName),
          const SizedBox(height: 12),
          _buildDetailRow(
            'Bank Destination (host_profiles.payout_account_name)',
            payoutAccountName,
            isCritical: true,
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Bank Partner (payout_bank_name)', payoutBankName),
          const SizedBox(height: 12),
          _buildDetailRow('Account Number', payoutAccountNumber),
          const Divider(color: Colors.white12, height: 28),

          // Active booking context
          if (widget.activeBooking != null) ...[
            _buildBookingContext(),
            const SizedBox(height: 16),
          ],

          // Whitelisting Firewall description
          Text(
            'Payout Whitelisting Firewall verification is automated. Before initiating transfer requests to partner wallets (Pocket or Ding), normalizedKycName must equal normalizedBankDestName. Any mismatch triggers SUSPENDED_AML_FLAG and DISPUTED escrow status.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.4),
              fontSize: 11,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 20),

          // Payout action buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber,
                      foregroundColor: Colors.black,
                      disabledBackgroundColor: Colors.grey.shade800,
                      disabledForegroundColor: Colors.white30,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: (amlFlag == 'SUSPENDED_AML_FLAG' || isVerifying)
                        ? null
                        : () => _executePayout('POCKET'),
                    child: isVerifying
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                color: Colors.black, strokeWidth: 2),
                          )
                        : const Text(
                            'Pay with Pocket',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo.shade600,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: Colors.grey.shade800,
                      disabledForegroundColor: Colors.white30,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: (amlFlag == 'SUSPENDED_AML_FLAG' || isVerifying)
                        ? null
                        : () => _executePayout('DING'),
                    child: const Text(
                      'Pay with Ding',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Developer simulator helpers
          const Divider(color: Colors.white12, height: 28),
          const Text(
            'Developer Simulator Options',
            style: TextStyle(
                color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.green),
                  foregroundColor: Colors.green,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  setState(() {
                    amlFlag = 'CLEAR';
                    payoutAccountName = legalName; // Make them match
                    showMismatchBanner = false;
                    payoutLog =
                        'Simulated Match: legal_name == payout_account_name (CLEAR)';
                  });
                },
                child: const Text('Simulate Match',
                    style: TextStyle(fontSize: 11)),
              ),
              const SizedBox(width: 8),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.redAccent),
                  foregroundColor: Colors.redAccent,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  setState(() {
                    payoutAccountName =
                        'Mismatched Name Holder'; // Intentionally mismatch
                    payoutLog =
                        'Simulated Mismatch: payout_account_name changed. Try paying to trigger SUSPENDED_AML_FLAG.';
                  });
                },
                child: const Text('Simulate Mismatch',
                    style: TextStyle(fontSize: 11)),
              ),
              const SizedBox(width: 8),
              TextButton(
                onPressed: () {
                  setState(() {
                    _initFromProps();
                    payoutLog = null;
                  });
                },
                child: const Text('Reset',
                    style: TextStyle(fontSize: 11, color: Colors.white54)),
              ),
            ],
          ),

          if (payoutLog != null) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white10),
              ),
              child: Text(
                payoutLog!,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: Colors.amber,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildBookingContext() {
    final booking = widget.activeBooking!;
    final String bookingId = booking['id'] ?? '-';
    final String escrowStatus = booking['escrow_status'] ?? '-';
    final double hostPayout =
        (booking['host_payout_amount'] as num?)?.toDouble() ?? 0.0;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.amber.withOpacity(0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Active Booking',
            style: TextStyle(
              color: Colors.amber.shade300,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildCompactRow('Booking ID', bookingId),
          const SizedBox(height: 4),
          _buildCompactRow('Escrow Status', escrowStatus),
          const SizedBox(height: 4),
          _buildCompactRow(
              'Host Payout', 'BND ${hostPayout.toStringAsFixed(2)}'),
        ],
      ),
    );
  }

  Widget _buildCompactRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.5),
            fontSize: 11,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge() {
    final bool isSuspended = amlFlag == 'SUSPENDED_AML_FLAG';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isSuspended
            ? Colors.red.withOpacity(0.2)
            : Colors.green.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSuspended
              ? Colors.red.withOpacity(0.5)
              : Colors.green.withOpacity(0.5),
        ),
      ),
      child: Text(
        isSuspended ? 'SUSPENDED' : 'CLEAR',
        style: TextStyle(
          color: isSuspended ? Colors.redAccent : Colors.green,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value,
      {bool isCritical = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.5),
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: isCritical && (_normalizeString(legalName) != _normalizeString(payoutAccountName))
                ? Colors.redAccent
                : Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  /// Normalization matching the backend's Firewall 2 logic:
  /// trim → collapse whitespace → lowercase
  String _normalizeString(String input) {
    return input.trim().replaceAll(RegExp(r'\s+'), ' ').toLowerCase();
  }

  Future<void> _executePayout(String partnerWalletType) async {
    setState(() {
      isVerifying = true;
      payoutLog = 'Initiating Payout Whitelisting Firewall scan...';
    });

    await Future.delayed(const Duration(milliseconds: 1200));

    // Replicate backend Firewall 2 string-match logic
    final String normalizedKycName = _normalizeString(legalName);
    final String normalizedBankDestName = _normalizeString(payoutAccountName);
    final bool nameMatchPassed = normalizedKycName == normalizedBankDestName;

    if (!nameMatchPassed) {
      // Mismatch → trigger SUSPENDED_AML_FLAG (mirrors backend behavior)
      setState(() {
        amlFlag = 'SUSPENDED_AML_FLAG';
        showMismatchBanner = true;
        isVerifying = false;
        payoutLog = '[SECURITY][FW-2] AML NAME MISMATCH\n'
            'legal_name (normalized): "$normalizedKycName"\n'
            'payout_account_name (normalized): "$normalizedBankDestName"\n'
            'aml_flag → SUSPENDED_AML_FLAG\n'
            'escrow_status → DISPUTED\n'
            'TRANSACTION_FREEZE_TRIGGERED';
      });
      return;
    }

    // Name match passed — execute payout via callback or simulate
    if (widget.onTriggerPayout != null && widget.activeBooking != null) {
      try {
        final bookingId = widget.activeBooking!['id'] ?? '';
        final hostUserId = widget.hostUser['id'] ?? '';
        final res = await widget.onTriggerPayout!(
            bookingId, hostUserId, partnerWalletType);

        setState(() {
          isVerifying = false;
          payoutLog = 'Payout Authorized!\n'
              'Response: ${res['message']}\n'
              'payout_auth_token: ${(res['payout_auth_token'] ?? '').toString().substring(0, 20)}...\n'
              'Transaction ID: ${res['partner_receipt']?['transaction_id']}\n'
              'Amount: BND ${res['payout_amount']}\n'
              'Partner: ${res['partner_receipt']?['partner']}';
        });
      } catch (e) {
        setState(() {
          isVerifying = false;
          payoutLog = 'Transfer Error: $e';
        });
      }
    } else {
      // Local simulation without backend
      final double payoutAmount =
          (widget.activeBooking?['host_payout_amount'] as num?)?.toDouble() ??
              0.0;
      setState(() {
        isVerifying = false;
        payoutLog = 'Payout Authorized! (simulated)\n'
            'Cleared: "$normalizedKycName" == "$normalizedBankDestName"\n'
            'Dispatched BND ${payoutAmount.toStringAsFixed(2)} to $partnerWalletType API.\n'
            'escrow_status → RELEASED';
      });
    }
  }
}
