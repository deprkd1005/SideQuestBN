export const localMockDb = {
  users: [
    {
      id: 'usr_host_001',
      bruneeid_sub: 'sub_host_001',
      bruneeid_token_ref: 'ref_token_hash_001',
      legal_name: 'Haji Ahmad bin Haji Kahar',
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
      legal_name: 'Sufian bin Awang',
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
      payout_account_name: 'Haji Ahmad bin Haji Kahar'
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
      payout_account_name: 'Sufian Awang bin Ali'
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
