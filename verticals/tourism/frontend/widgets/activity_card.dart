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
          activity.thumbnailUrl != null && activity.thumbnailUrl!.isNotEmpty
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
,
    );
  }
}
