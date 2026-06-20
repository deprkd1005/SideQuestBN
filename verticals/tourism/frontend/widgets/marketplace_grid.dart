import 'package:flutter/material.dart';
import 'activity_card.dart';

class MarketplaceGrid extends StatefulWidget {
  final Function(Map<String, dynamic> activity)? onActivitySelected;

  const MarketplaceGrid({
    Key? key,
    this.onActivitySelected,
  }) : super(key: key);

  @override
  State<MarketplaceGrid> createState() => _MarketplaceGridState();
}

class _MarketplaceGridState extends State<MarketplaceGrid> {
  String selectedDistrict = 'All';
  String selectedCategory = 'All';
  String searchQuery = '';

  // Seed mock activities focusing 100% on Brunei Micro-MSMEs, Local Artisans, and Heritage Workshops
  final List<Activity> activitiesList = [
    const Activity(
      id: 'act_weaving_002',
      title: 'Traditional Penan Basket Weaving Masterclass',
      hostBusinessName: 'Penan Weaving Artisans',
      category: 'CULTURE',
      district: 'Temburong',
      pricePerPerson: 45.00,
      averageRating: 4.9,
      totalBookings: 12,
      thumbnailUrl: '',
    ),
    const Activity(
      id: 'act_food_002',
      title: 'Sago Processing & Ambuyat Heritage Workshop',
      hostBusinessName: 'Hajah Aminah Sago Crafts',
      category: 'FOOD',
      district: 'Tutong',
      pricePerPerson: 35.00,
      averageRating: 4.8,
      totalBookings: 34,
      thumbnailUrl: '',
    ),
    const Activity(
      id: 'act_boat_craft_001',
      title: 'Kampong Ayer Wooden Boat Building Craft',
      hostBusinessName: 'Kampong Ayer Wooden Boat Builder',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      pricePerPerson: 50.00,
      averageRating: 5.0,
      totalBookings: 8,
      thumbnailUrl: '',
    ),
    const Activity(
      id: 'act_creative_001',
      title: 'Kain Tenunan Gold Thread Weaving',
      hostBusinessName: 'Dayangku Aishah Silk Weavers',
      category: 'CREATIVE',
      district: 'Brunei-Muara',
      pricePerPerson: 90.00,
      averageRating: 4.9,
      totalBookings: 15,
      thumbnailUrl: '',
    ),
    const Activity(
      id: 'act_creative_002',
      title: 'Belingus Charcoal Pottery Workshop',
      hostBusinessName: 'Awang Salim Ceramic Studio',
      category: 'CREATIVE',
      district: 'Belait',
      pricePerPerson: 55.00,
      averageRating: 4.7,
      totalBookings: 5,
      thumbnailUrl: '',
    ),
    const Activity(
      id: 'act_nature_001',
      title: 'Temburong Rainforest Ethnobotanical Tour',
      hostBusinessName: 'Sumbiling Eco Lodge MSME',
      category: 'NATURE',
      district: 'Temburong',
      pricePerPerson: 80.00,
      averageRating: 4.9,
      totalBookings: 57,
      thumbnailUrl: '',
    )
  ];

  final List<String> districts = ['All', 'Brunei-Muara', 'Tutong', 'Belait', 'Temburong'];
  
  final List<Map<String, String>> categories = [
    {'label': 'All', 'value': 'All'},
    {'label': '🏛️ Culture', 'value': 'CULTURE'},
    {'label': '🍲 Food', 'value': 'FOOD'},
    {'label': '🌿 Nature', 'value': 'NATURE'},
    {'label': '🎨 Creative', 'value': 'CREATIVE'},
  ];

  @override
  Widget build(BuildContext context) {
    // Filter activities based on selection and query
    final filteredActivities = activitiesList.where((item) {
      final matchesDistrict = selectedDistrict == 'All' || item.district == selectedDistrict;
      final matchesCategory = selectedCategory == 'All' || item.category == selectedCategory;
      final matchesSearch = searchQuery.isEmpty ||
          item.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          item.hostBusinessName.toLowerCase().contains(searchQuery.toLowerCase());
      return matchesDistrict && matchesCategory && matchesSearch;
    }).toList();

    return Theme(
      data: ThemeData.dark().copyWith(
        primaryColor: Colors.amber,
        scaffoldBackgroundColor: Colors.black,
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            const Padding(
              padding: EdgeInsets.only(left: 20, right: 20, top: 24, bottom: 8),
              child: Text(
                'Bruneian Heritage & Artisan Marketplace',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(left: 20, right: 20, bottom: 16),
              child: Text(
                'Directly support Local Micro-MSMEs and Traditional Craft Workshops.',
                style: TextStyle(
                  color: Colors.amber,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey.shade900.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: TextField(
                  style: const TextStyle(color: Colors.white),
                  onChanged: (val) {
                    setState(() {
                      searchQuery = val;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: 'Search workshops or local hosts...',
                    hintStyle: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 14),
                    prefixIcon: const Icon(Icons.search, color: Colors.amber),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // District Horizontal Scroll Selection
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: districts.length,
                itemBuilder: (context, index) {
                  final dist = districts[index];
                  final isSelected = selectedDistrict == dist;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(dist),
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
                          setState(() {
                            selectedDistrict = dist;
                          });
                        }
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 8),

            // Category Horizontal Scroll Selection
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = selectedCategory == cat['value'];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(cat['label']!),
                      selected: isSelected,
                      selectedColor: Colors.amber.shade700,
                      backgroundColor: Colors.grey.shade900,
                      labelStyle: TextStyle(
                        color: Colors.white,
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
                          setState(() {
                            selectedCategory = cat['value']!;
                          });
                        }
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // Grid results
            Expanded(
              child: filteredActivities.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off_outlined, size: 48, color: Colors.white.withOpacity(0.3)),
                          const SizedBox(height: 12),
                          Text(
                            'No activities match your filters.',
                            style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 15),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: filteredActivities.length,
                      physics: const BouncingScrollPhysics(),
                      itemBuilder: (context, index) {
                        final act = filteredActivities[index];
                        return ActivityCard(
                          activity: act,
                          onTap: () {
                            if (widget.onActivitySelected != null) {
                              // Convert activity model back to a map to avoid breaking consumers expecting map data
                              final mapData = {
                                'id': act.id,
                                'title': act.title,
                                'host_business_name': act.hostBusinessName,
                                'category': act.category,
                                'district': act.district,
                                'price_per_person': act.pricePerPerson,
                                'average_rating': act.averageRating,
                                'thumbnail_url': act.thumbnailUrl ?? '',
                              };
                              widget.onActivitySelected!(mapData);
                            }
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
