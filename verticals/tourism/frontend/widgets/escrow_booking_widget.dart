import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class EscrowBookingWidget extends StatefulWidget {
  final Map<String, dynamic> activity;
  final String travelerId;
  final Future<void> Function(Map<String, dynamic> bookingPayload)? onConfirmBooking;

  const EscrowBookingWidget({
    Key? key,
    required this.activity,
    required this.travelerId,
    this.onConfirmBooking,
  }) : super(key: key);

  @override
  State<EscrowBookingWidget> createState() => _EscrowBookingWidgetState();
}

class _EscrowBookingWidgetState extends State<EscrowBookingWidget> {
  int participantsCount = 1;
  bool isBookingInProgress = false;
  bool bookingCompleted = false;
  Map<String, dynamic>? createdBooking;

  // Booking date & time slot
  DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
  String selectedTimeSlot = '10:00';
  final List<String> availableTimeSlots = [
    '08:00',
    '10:00',
    '13:00',
    '15:00',
    '17:00',
  ];

  static const double _platformFeeRate = 0.08;

  @override
  Widget build(BuildContext context) {
    // Read from spec-aligned field names
    final double pricePerPerson =
        (widget.activity['price_per_person'] as num?)?.toDouble() ?? 0.0;
    final double grossAmount =
        double.parse((pricePerPerson * participantsCount).toStringAsFixed(2));
    final double platformFeeAmount =
        double.parse((grossAmount * _platformFeeRate).toStringAsFixed(2));
    final double hostPayoutAmount =
        double.parse((grossAmount - platformFeeAmount).toStringAsFixed(2));

    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade950,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.only(left: 24, right: 24, top: 20, bottom: 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Bar indicator
          Center(
            child: Container(
              width: 48,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 24),

          if (!bookingCompleted) ...[
            // Title & Host
            Text(
              widget.activity['title'] ?? 'Selected Activity',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Hosted by: ${widget.activity['host_business_name'] ?? 'Unknown Host'}',
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 14,
                fontStyle: FontStyle.italic,
              ),
            ),
            const Divider(color: Colors.white12, height: 32),

            // Booking Date Picker
            _buildSectionLabel('Booking Date'),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: _pickBookingDate,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('EEEE, dd MMM yyyy').format(selectedDate),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const Icon(Icons.calendar_today, color: Colors.amber, size: 18),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Time Slot Selector
            _buildSectionLabel('Time Slot'),
            const SizedBox(height: 8),
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: availableTimeSlots.length,
                itemBuilder: (context, index) {
                  final slot = availableTimeSlots[index];
                  final isSelected = selectedTimeSlot == slot;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(slot),
                      selected: isSelected,
                      selectedColor: Colors.amber,
                      backgroundColor: Colors.grey.shade900,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.black : Colors.white70,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 13,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? Colors.transparent : Colors.white12,
                        ),
                      ),
                      onSelected: (selected) {
                        if (selected) {
                          setState(() => selectedTimeSlot = slot);
                        }
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // Participant Counter
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Number of Participants',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline, color: Colors.amber),
                      onPressed: participantsCount > 1
                          ? () => setState(() => participantsCount--)
                          : null,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Text(
                        '$participantsCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline, color: Colors.amber),
                      onPressed: () => setState(() => participantsCount++),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Tokenized Escrow Ledger Fee Breakdown Widget
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.04),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.amber.withOpacity(0.15),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.shield_outlined, color: Colors.amber, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Tokenized Escrow Protection',
                        style: TextStyle(
                          color: Colors.amber.shade300,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildLedgerRow(
                    'Ticket Cost ($participantsCount pax × BND ${pricePerPerson.toStringAsFixed(2)})',
                    'BND ${grossAmount.toStringAsFixed(2)}',
                    isBold: false,
                  ),
                  const SizedBox(height: 8),
                  _buildLedgerRow(
                    'Programmatic Platform Fee (8%)',
                    'BND ${platformFeeAmount.toStringAsFixed(2)}',
                    isBold: false,
                    isHighlight: true,
                  ),
                  const SizedBox(height: 8),
                  _buildLedgerRow(
                    'Artisan Payout Ledger (92%)',
                    'BND ${hostPayoutAmount.toStringAsFixed(2)}',
                    isBold: false,
                  ),
                  const Divider(color: Colors.white12, height: 20),
                  _buildLedgerRow(
                    'Total Escrow Locked Funds',
                    'BND ${grossAmount.toStringAsFixed(2)}',
                    isBold: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Escrow explanation notice
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline, color: Colors.white.withOpacity(0.4), size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Funds will be held securely in escrow under the "FROZEN" state in our ledger. The host will only receive their payout after the activity completes.',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.4),
                      fontSize: 11,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 2,
                ),
                onPressed: isBookingInProgress ? null : _executeBooking,
                child: isBookingInProgress
                    ? const CircularProgressIndicator(color: Colors.black)
                    : const Text(
                        'Lock Booking in Escrow',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ] else ...[
            // Success Screen — reads from createdBooking response
            _buildSuccessScreen(),
          ],
        ],
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label,
      style: TextStyle(
        color: Colors.white.withOpacity(0.6),
        fontSize: 13,
        fontWeight: FontWeight.w600,
      ),
    );
  }

  Widget _buildSuccessScreen() {
    final booking = createdBooking ?? {};
    final String escrowStatus = booking['escrow_status'] ?? 'FROZEN';
    final double feeAmount =
        (booking['platform_fee_amount'] as num?)?.toDouble() ?? 0.0;
    final double payoutAmount =
        (booking['host_payout_amount'] as num?)?.toDouble() ?? 0.0;
    final double grossAmount =
        (booking['gross_amount'] as num?)?.toDouble() ?? 0.0;
    final String bookingId = booking['id'] ?? '-';
    final String bookingDate = booking['booking_date'] ?? '-';
    final String timeSlot = booking['booking_time_slot'] ?? '-';
    final int pax = (booking['participant_count'] as num?)?.toInt() ?? 0;

    return Center(
      child: Column(
        children: [
          const Icon(
            Icons.check_circle_outline,
            color: Colors.green,
            size: 64,
          ),
          const SizedBox(height: 16),
          const Text(
            'Booking Funds Locked!',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Booking Reference: $bookingId',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.03),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              children: [
                _buildLedgerRow(
                  'Escrow Ledger State',
                  '$escrowStatus 🔒',
                  isBold: true,
                  isHighlight: true,
                ),
                const SizedBox(height: 6),
                _buildLedgerRow(
                  'Date / Time Slot',
                  '$bookingDate · $timeSlot',
                ),
                const SizedBox(height: 6),
                _buildLedgerRow(
                  'Participants',
                  '$pax pax',
                ),
                const SizedBox(height: 6),
                _buildLedgerRow(
                  'Gross Amount',
                  'BND ${grossAmount.toStringAsFixed(2)}',
                ),
                const SizedBox(height: 6),
                _buildLedgerRow(
                  'Platform Fee Allocated',
                  'BND ${feeAmount.toStringAsFixed(2)}',
                ),
                const SizedBox(height: 6),
                _buildLedgerRow(
                  'Host Payout Allocated',
                  'BND ${payoutAmount.toStringAsFixed(2)}',
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white30),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              onPressed: () {
                setState(() {
                  bookingCompleted = false;
                  participantsCount = 1;
                  selectedDate = DateTime.now().add(const Duration(days: 1));
                  selectedTimeSlot = '10:00';
                  createdBooking = null;
                });
              },
              child: const Text('Back to Marketplace'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLedgerRow(String label, String value,
      {bool isBold = false, bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Text(
            label,
            style: TextStyle(
              color: isHighlight
                  ? Colors.amber.shade200
                  : Colors.white.withOpacity(0.7),
              fontSize: 13,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: isHighlight ? Colors.amber : Colors.white,
            fontSize: 13,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Future<void> _pickBookingDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Colors.amber,
              onPrimary: Colors.black,
              surface: Color(0xFF1E1E1E),
              onSurface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => selectedDate = picked);
    }
  }

  Future<void> _executeBooking() async {
    setState(() {
      isBookingInProgress = true;
    });

    // Simulate backend roundtrip to POST /bookings/create
    await Future.delayed(const Duration(milliseconds: 1500));

    // Recalculate amounts server-side style (mirroring backend Firewall 4 logic)
    final double pricePerPerson =
        (widget.activity['price_per_person'] as num?)?.toDouble() ?? 0.0;
    final double grossAmount =
        double.parse((pricePerPerson * participantsCount).toStringAsFixed(2));
    final double platformFeeAmount =
        double.parse((grossAmount * _platformFeeRate).toStringAsFixed(2));
    final double hostPayoutAmount =
        double.parse((grossAmount - platformFeeAmount).toStringAsFixed(2));

    final String bookingDate = DateFormat('yyyy-MM-dd').format(selectedDate);

    // Construct the API-aligned payload matching POST /bookings/create response
    final Map<String, dynamic> bookingPayload = {
      'id': 'bk_${DateTime.now().millisecondsSinceEpoch}_${(participantsCount * 100)}',
      'activity_id': widget.activity['id'],
      'tourist_user_id': widget.travelerId,
      'booking_date': bookingDate,
      'booking_time_slot': selectedTimeSlot,
      'participant_count': participantsCount,
      'gross_amount': grossAmount,
      'platform_fee_rate': _platformFeeRate,
      'platform_fee_amount': platformFeeAmount,
      'host_payout_rate': 1.0 - _platformFeeRate,
      'host_payout_amount': hostPayoutAmount,
      'escrow_status': 'FROZEN',
      'escrow_frozen_at': DateTime.now().toIso8601String(),
      'created_at': DateTime.now().toIso8601String(),
      'updated_at': DateTime.now().toIso8601String(),
    };

    if (widget.onConfirmBooking != null) {
      await widget.onConfirmBooking!(bookingPayload);
    }

    if (mounted) {
      setState(() {
        isBookingInProgress = false;
        bookingCompleted = true;
        createdBooking = bookingPayload;
      });
    }
  }
}
