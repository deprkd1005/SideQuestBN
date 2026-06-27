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
    // ====== ORIGINAL 14 ACTIVITIES ======
    {
      id: 'act_boat_craft_001',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Kampong Ayer Wooden Boat Building Craft',
      description: 'Learn the ancient art of building wooden boats directly on Kampong Ayer. Join master craftsman Haji Ahmad in his stilted workshop above the Brunei River for a hands-on session in traditional Malay boat construction.',
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
      total_bookings: 23,
      average_rating: 5.0
    },
    {
      id: 'act_weaving_002',
      host_profile_id: 'hp_002',
      host_user_id: 'usr_host_002',
      title: 'Traditional Penan Basket Weaving Masterclass',
      description: 'Craft your own basket using hand-split rattan under tribal guidance. Learn the ancient Penan weaving techniques passed down through generations in the heart of Temburong.',
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
      total_bookings: 17,
      average_rating: 4.9
    },
    {
      id: 'act_baking_003',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Bruneian Traditional Baking Class',
      description: 'Discover the sweet side of Brunei! Learn to bake authentic kuih mor, kuih cincin, and other royal Malay desserts. Includes a take-home gift box of your creations.',
      category: 'FOOD',
      district: 'Brunei-Muara',
      exact_location: 'Gadong Central, Unit 12',
      location_lat: 4.9321,
      location_lng: 114.9456,
      thumbnail_url: 'https://images.sidequest.bn/activities/baking.jpg',
      price_per_person: 38.00,
      duration_minutes: 120,
      max_participants: 8,
      is_active: true,
      is_featured: true,
      total_bookings: 41,
      average_rating: 4.8
    },
    {
      id: 'act_ambuyat_004',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Ambuyat Cooking Experience',
      description: 'Master the art of making Brunei\'s national dish — Ambuyat. Learn to prepare the sago starch delicacy with a variety of dipping sauces (cacah), and enjoy a full traditional lunch spread with your host family.',
      category: 'FOOD',
      district: 'Brunei-Muara',
      exact_location: 'Kampong Kianggeh Market',
      location_lat: 4.8945,
      location_lng: 114.9398,
      thumbnail_url: 'https://images.sidequest.bn/activities/ambuyat.jpg',
      price_per_person: 42.00,
      duration_minutes: 150,
      max_participants: 6,
      is_active: true,
      is_featured: false,
      total_bookings: 28,
      average_rating: 4.9
    },
    {
      id: 'act_canopy_005',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Ulu Temburong Canopy Walk Adventure',
      description: 'Trek through pristine primary rainforest to reach a 60-metre canopy walkway above the jungle floor. Spot hornbills, gibbons, and rare orchids. Includes longboat river transfer and packed jungle lunch.',
      category: 'ADVENTURE',
      district: 'Temburong',
      exact_location: 'Ulu Temburong National Park',
      location_lat: 4.5467,
      location_lng: 115.1589,
      thumbnail_url: 'https://images.sidequest.bn/activities/canopy.jpg',
      price_per_person: 85.00,
      duration_minutes: 360,
      max_participants: 12,
      is_active: true,
      is_featured: true,
      total_bookings: 56,
      average_rating: 4.9
    },
    {
      id: 'act_firefly_006',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Mangrove Firefly Night Cruise',
      description: 'Glide through Brunei\'s magical mangrove forests at dusk on a traditional boat. Watch thousands of synchronous fireflies light up the riverbanks and spot proboscis monkeys returning to their sleeping trees.',
      category: 'NATURE',
      district: 'Tutong',
      exact_location: 'Sungai Liang Mangroves',
      location_lat: 4.8101,
      location_lng: 114.7562,
      thumbnail_url: 'https://images.sidequest.bn/activities/firefly.jpg',
      price_per_person: 55.00,
      duration_minutes: 120,
      max_participants: 15,
      is_active: true,
      is_featured: true,
      total_bookings: 34,
      average_rating: 5.0
    },
    {
      id: 'act_mosque_007',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Royal Mosque Heritage Walking Tour',
      description: 'A guided cultural walking tour of Brunei\'s iconic Sultan Omar Ali Saifuddien Mosque and the surrounding royal heritage quarter. Learn about Islamic architecture, royal history, and Brunei\'s path to independence.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Sultan Omar Ali Saifuddien Mosque',
      location_lat: 4.8841,
      location_lng: 114.9394,
      thumbnail_url: 'https://images.sidequest.bn/activities/mosque.jpg',
      price_per_person: 25.00,
      duration_minutes: 90,
      max_participants: 20,
      is_active: true,
      is_featured: false,
      total_bookings: 62,
      average_rating: 4.7
    },
    {
      id: 'act_nature_walk_008',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Tutong Wetlands Birdwatching Walk',
      description: 'Explore the rich biodiversity of Tutong wetlands with an expert naturalist guide. Spot kingfishers, hornbills, and migratory birds while learning about Brunei\'s unique wetland ecosystem.',
      category: 'NATURE',
      district: 'Tutong',
      exact_location: 'Tutong Wetlands Reserve',
      location_lat: 4.8030,
      location_lng: 114.6510,
      thumbnail_url: 'https://images.sidequest.bn/activities/birdwatch.jpg',
      price_per_person: 35.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 12,
      average_rating: 4.6
    },
    {
      id: 'act_kayak_009',
      host_profile_id: 'hp_006',
      host_user_id: 'usr_host_006',
      title: 'Belait River Sunrise Kayak Expedition',
      description: 'Paddle through the peaceful Belait River at dawn. Watch the rainforest come alive as you navigate through mangrove tunnels and spot proboscis monkeys waking up along the riverbanks.',
      category: 'ADVENTURE',
      district: 'Belait',
      exact_location: 'Kuala Belait Boat Club',
      location_lat: 4.5882,
      location_lng: 114.1915,
      thumbnail_url: 'https://images.sidequest.bn/activities/kayak.jpg',
      price_per_person: 48.00,
      duration_minutes: 210,
      max_participants: 6,
      is_active: true,
      is_featured: false,
      total_bookings: 7,
      average_rating: 4.9
    },
    {
      id: 'act_batik_010',
      host_profile_id: 'hp_002',
      host_user_id: 'usr_host_002',
      title: 'Batik Painting & Textile Design Workshop',
      description: 'Unleash your creativity in a traditional batik workshop. Learn the wax-resist dyeing technique from master artisans and create your own batik piece on silk or cotton showcasing Brunei\'s distinctive floral motifs.',
      category: 'CREATIVE',
      district: 'Brunei-Muara',
      exact_location: 'Kampong Saba Handicraft Centre',
      location_lat: 4.8850,
      location_lng: 114.9360,
      thumbnail_url: 'https://images.sidequest.bn/activities/batik.jpg',
      price_per_person: 28.00,
      duration_minutes: 120,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 33,
      average_rating: 4.7
    },
    {
      id: 'act_batu_011',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Batu Apoi Forest Reserve Night Trek',
      description: 'Experience the magic of Temburong\'s jungle at night. Trek with a flashlight to spot nocturnal wildlife including tarsiers, flying squirrels, and glowing fungi. A truly unforgettable adventure.',
      category: 'ADVENTURE',
      district: 'Temburong',
      exact_location: 'Batu Apoi Forest Reserve',
      location_lat: 4.6530,
      location_lng: 115.0930,
      thumbnail_url: 'https://images.sidequest.bn/activities/nighttrek.jpg',
      price_per_person: 72.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 15,
      average_rating: 4.8
    },
    {
      id: 'act_royal_regalia_012',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Royal Regalia Museum Tour',
      description: 'Explore the stunning Royal Regalia Museum housing the Sultan\'s ceremonial regalia, gold artefacts, and royal chariots. Learn about Brunei\'s monarchy and its constitutional history.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Royal Regalia Museum, BSB',
      location_lat: 4.8905,
      location_lng: 114.9410,
      thumbnail_url: 'https://images.sidequest.bn/activities/regalia.jpg',
      price_per_person: 15.00,
      duration_minutes: 90,
      max_participants: 25,
      is_active: true,
      is_featured: false,
      total_bookings: 48,
      average_rating: 4.6
    },
    {
      id: 'act_tamu_013',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Tamu Weekend Market Cultural Tour',
      description: 'Immerse yourself in Brunei\'s vibrant weekend market culture. Visit the Tamu Kianggeh market to taste exotic fruits, buy local crafts, and interact with vendors.',
      category: 'FOOD',
      district: 'Brunei-Muara',
      exact_location: 'Tamu Kianggeh, BSB',
      location_lat: 4.8920,
      location_lng: 114.9370,
      thumbnail_url: 'https://images.sidequest.bn/activities/tamu.jpg',
      price_per_person: 22.00,
      duration_minutes: 120,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 38,
      average_rating: 4.5
    },
    {
      id: 'act_scuba_014',
      host_profile_id: 'hp_006',
      host_user_id: 'usr_host_006',
      title: 'Brunei Wreck Diving Experience',
      description: 'Explore the famous WWII shipwrecks off Brunei\'s coast. Discover vibrant coral reefs teeming with marine life at the Australian Wreck and American Wreck dive sites. Full equipment provided.',
      category: 'ADVENTURE',
      district: 'Brunei-Muara',
      exact_location: 'Serasa Ferry Terminal',
      location_lat: 5.0180,
      location_lng: 115.0760,
      thumbnail_url: 'https://images.sidequest.bn/activities/diving.jpg',
      price_per_person: 120.00,
      duration_minutes: 300,
      max_participants: 6,
      is_active: true,
      is_featured: true,
      total_bookings: 8,
      average_rating: 5.0
    },
    // ====== NEW PINS: Brunei-Muara Hidden Gems (015-025) ======
    {
      id: 'act_maritime_015',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Brunei Maritime Museum & Heritage Tour',
      description: 'Discover Brunei\'s rich seafaring history at the Maritime Museum in Kota Batu. Explore ancient shipwreck artifacts and traditional boat models.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Kota Batu, Brunei-Muara',
      location_lat: 4.8715,
      location_lng: 114.9580,
      thumbnail_url: 'https://images.sidequest.bn/activities/maritime.jpg',
      price_per_person: 18.00,
      duration_minutes: 90,
      max_participants: 20,
      is_active: true,
      is_featured: false,
      total_bookings: 14,
      average_rating: 4.5
    },
    {
      id: 'act_kgayer_gallery_016',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Kampong Ayer Cultural Gallery Walk',
      description: 'Stroll through the stilted villages of Kampong Ayer and visit the Cultural & Tourism Gallery. Your guide shares stories of life on the water village spanning 1,300 years.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Kampong Ayer Cultural & Tourism Gallery',
      location_lat: 4.8830,
      location_lng: 114.9428,
      thumbnail_url: 'https://images.sidequest.bn/activities/gallery.jpg',
      price_per_person: 15.00,
      duration_minutes: 75,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 19,
      average_rating: 4.6
    },
    {
      id: 'act_jerudong_017',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Jerudong Park Night Lights & Ride Adventure',
      description: 'Enjoy unlimited rides, zipline across the park, and marvel at the colourful LED fountain show under the stars.',
      category: 'ADVENTURE',
      district: 'Brunei-Muara',
      exact_location: 'Jerudong Park Playground',
      location_lat: 4.9640,
      location_lng: 114.8570,
      thumbnail_url: 'https://images.sidequest.bn/activities/jerudong.jpg',
      price_per_person: 25.00,
      duration_minutes: 240,
      max_participants: 50,
      is_active: true,
      is_featured: false,
      total_bookings: 47,
      average_rating: 4.4
    },
    {
      id: 'act_serasa_kayak_018',
      host_profile_id: 'hp_006',
      host_user_id: 'usr_host_006',
      title: 'Serasa Beach Sunset Kayak & Snorkel Combo',
      description: 'Paddle through the calm waters of Serasa Lagoon as the sun sets over the South China Sea. Stop at a secluded sandbar to snorkel among colourful reef fish.',
      category: 'ADVENTURE',
      district: 'Brunei-Muara',
      exact_location: 'Serasa Beach, Muara',
      location_lat: 5.0220,
      location_lng: 115.0670,
      thumbnail_url: 'https://images.sidequest.bn/activities/serasakayak.jpg',
      price_per_person: 45.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 22,
      average_rating: 4.8
    },
    {
      id: 'act_gadong_food_019',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Gadong Night Market Food Safari',
      description: 'Join a local foodie guide through the bustling Gadong Night Market. Sample 10+ street food delicacies from satay to nasi katok.',
      category: 'FOOD',
      district: 'Brunei-Muara',
      exact_location: 'Gadong Night Market, Jalan Gadong',
      location_lat: 4.9340,
      location_lng: 114.9440,
      thumbnail_url: 'https://images.sidequest.bn/activities/gadongfood.jpg',
      price_per_person: 28.00,
      duration_minutes: 120,
      max_participants: 10,
      is_active: true,
      is_featured: true,
      total_bookings: 55,
      average_rating: 4.9
    },
    {
      id: 'act_serusop_020',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Pasar Pelbagai Serusop Culinary Walk',
      description: 'Explore the hidden gem of Serusop Market where locals shop for fresh produce. End with a home-cooked Brunei lunch.',
      category: 'FOOD',
      district: 'Brunei-Muara',
      exact_location: 'Pasar Pelbagai Serusop, BSB',
      location_lat: 4.9120,
      location_lng: 114.9220,
      thumbnail_url: 'https://images.sidequest.bn/activities/seruso.jpg',
      price_per_person: 32.00,
      duration_minutes: 150,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 16,
      average_rating: 4.7
    },
    {
      id: 'act_monkey_cruise_021',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Brunei River Proboscis Monkey Cruise',
      description: 'Board a traditional boat and cruise up the Brunei River into the mangroves. Spot the iconic proboscis monkeys endemic to Borneo.',
      category: 'NATURE',
      district: 'Brunei-Muara',
      exact_location: 'Kiulap Jetty, Brunei River',
      location_lat: 4.8860,
      location_lng: 114.9480,
      thumbnail_url: 'https://images.sidequest.bn/activities/monkeycruise.jpg',
      price_per_person: 48.00,
      duration_minutes: 120,
      max_participants: 12,
      is_active: true,
      is_featured: true,
      total_bookings: 39,
      average_rating: 4.9
    },
    {
      id: 'act_tasek_lama_022',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Tasek Lama Recreational Park Dawn Hike',
      description: 'Start your day with an early morning hike through Tasek Lama Park in BSB. Trek to the waterfall viewpoint and enjoy panoramic views of the capital.',
      category: 'NATURE',
      district: 'Brunei-Muara',
      exact_location: 'Tasek Lama Recreational Park',
      location_lat: 4.8870,
      location_lng: 114.9280,
      thumbnail_url: 'https://images.sidequest.bn/activities/tasek.jpg',
      price_per_person: 20.00,
      duration_minutes: 120,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 31,
      average_rating: 4.6
    },
    {
      id: 'act_wasai_kandal_023',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Wasai Kandal Waterfall Eco-Trek',
      description: 'Venture into the lush jungle behind the Empire Hotel to discover Wasai Kandal, a hidden three-tier waterfall. Cool off in natural rock pools.',
      category: 'ADVENTURE',
      district: 'Brunei-Muara',
      exact_location: 'Wasai Kandal, Jerudong',
      location_lat: 4.9550,
      location_lng: 114.8400,
      thumbnail_url: 'https://images.sidequest.bn/activities/wasaikandal.jpg',
      price_per_person: 35.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 11,
      average_rating: 4.7
    },
    {
      id: 'act_pelumpong_024',
      host_profile_id: 'hp_006',
      host_user_id: 'usr_host_006',
      title: 'Pelumpong Island Snorkel & Beach Escape',
      description: 'Take a speedboat from Muara to the secluded Pelumpong Island. Snorkel in crystal-clear waters over vibrant coral gardens.',
      category: 'ADVENTURE',
      district: 'Brunei-Muara',
      exact_location: 'Muara Harbour, Pelumpong Island',
      location_lat: 5.0500,
      location_lng: 115.0900,
      thumbnail_url: 'https://images.sidequest.bn/activities/pelumpong.jpg',
      price_per_person: 68.00,
      duration_minutes: 300,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 9,
      average_rating: 4.9
    },
    {
      id: 'act_lapau_025',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Lapau Ceremonial Hall & Royal Heritage Walk',
      description: 'Visit the majestic Lapau (Royal Ceremonial Hall) where the Sultan\'s coronation took place. Includes entry to the Royal Regalia Museum.',
      category: 'CULTURE',
      district: 'Brunei-Muara',
      exact_location: 'Jalan Kianggeh, BSB',
      location_lat: 4.8915,
      location_lng: 114.9400,
      thumbnail_url: 'https://images.sidequest.bn/activities/lapau.jpg',
      price_per_person: 22.00,
      duration_minutes: 90,
      max_participants: 25,
      is_active: true,
      is_featured: false,
      total_bookings: 27,
      average_rating: 4.5
    },
    // ====== TUTONG DISTRICT HIDDEN GEMS (026-033) ======
    {
      id: 'act_sg_basong_026',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Sungai Basong Recreational Park Nature Walk',
      description: 'Discover the serene Sungai Basong Recreational Park in Tutong. Walk along wooden boardwalks and spot freshwater turtles and butterflies.',
      category: 'NATURE',
      district: 'Tutong',
      exact_location: 'Sungai Basong Recreational Park, Tutong',
      location_lat: 4.7810,
      location_lng: 114.7330,
      thumbnail_url: 'https://images.sidequest.bn/activities/sgbasong.jpg',
      price_per_person: 12.00,
      duration_minutes: 120,
      max_participants: 20,
      is_active: true,
      is_featured: false,
      total_bookings: 18,
      average_rating: 4.4
    },
    {
      id: 'act_tamu_tutong_027',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Tutong Tamu Serbadan Market Feast',
      description: 'Experience the vibrant Serbadan Market where locals gather every weekend. Taste traditional cakes and sample nasi lemak prepared by village elders.',
      category: 'FOOD',
      district: 'Tutong',
      exact_location: 'Serbadan Market, Jalan Serbadan, Tutong',
      location_lat: 4.8010,
      location_lng: 114.6490,
      thumbnail_url: 'https://images.sidequest.bn/activities/tamutong.jpg',
      price_per_person: 25.00,
      duration_minutes: 120,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 24,
      average_rating: 4.6
    },
    {
      id: 'act_bukit_ambok_028',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Bukit Ambok Sunrise Trekking Challenge',
      description: 'Conquer Bukit Ambok, Tutong\'s highest peak at 185m! A moderate climb rewards you with a stunning 360-degree panorama of Tutong.',
      category: 'ADVENTURE',
      district: 'Tutong',
      exact_location: 'Bukit Ambok, Kampong Bukit Ambok',
      location_lat: 4.7870,
      location_lng: 114.6700,
      thumbnail_url: 'https://images.sidequest.bn/activities/bukitambok.jpg',
      price_per_person: 30.00,
      duration_minutes: 120,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 13,
      average_rating: 4.7
    },
    {
      id: 'act_kp_beruang_029',
      host_profile_id: 'hp_002',
      host_user_id: 'usr_host_002',
      title: 'Kampong Bukit Beruang Handicraft Workshop',
      description: 'Visit a hidden community workshop where local women craft beautiful handwoven textiles. Try your hand at the loom and create a keepsake.',
      category: 'CREATIVE',
      district: 'Tutong',
      exact_location: 'Kampong Bukit Beruang, Tutong',
      location_lat: 4.7750,
      location_lng: 114.6900,
      thumbnail_url: 'https://images.sidequest.bn/activities/beruang.jpg',
      price_per_person: 40.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 7,
      average_rating: 4.8
    },
    {
      id: 'act_tutong_mangrove_030',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Tutong River Mangrove Eco-Cruise & Fishing',
      description: 'Glide through the tranquil Tutong River mangroves on a pontoon boat. Try hand at fishing and spot silver leaf monkeys and sea eagles.',
      category: 'NATURE',
      district: 'Tutong',
      exact_location: 'Tutong River Jetty, Kampong Keriam',
      location_lat: 4.7950,
      location_lng: 114.6620,
      thumbnail_url: 'https://images.sidequest.bn/activities/tutongmangrove.jpg',
      price_per_person: 42.00,
      duration_minutes: 150,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 20,
      average_rating: 4.6
    },
    {
      id: 'act_seri_kenangan_031',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Pantai Seri Kenangan Beach Sunset Picnic',
      description: 'Escape to Pantai Seri Kenangan, a beautiful stretch of golden sand. Enjoy a curated beach picnic with traditional snacks and a stunning ocean sunset.',
      category: 'NATURE',
      district: 'Tutong',
      exact_location: 'Pantai Seri Kenangan, Tutong',
      location_lat: 4.8210,
      location_lng: 114.6490,
      thumbnail_url: 'https://images.sidequest.bn/activities/serikenangan.jpg',
      price_per_person: 18.00,
      duration_minutes: 120,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 26,
      average_rating: 4.5
    },
    {
      id: 'act_wasai_bedanu_032',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Wasai Bedanu Waterfall Adventure',
      description: 'Hike through pristine forest to discover Wasai Bedanu, a hidden waterfall in Tutong. Swim in the cool natural pool beneath the cascade.',
      category: 'ADVENTURE',
      district: 'Tutong',
      exact_location: 'Wasai Bedanu, Kampong Bedanu, Tutong',
      location_lat: 4.7680,
      location_lng: 114.7100,
      thumbnail_url: 'https://images.sidequest.bn/activities/bedanu.jpg',
      price_per_person: 38.00,
      duration_minutes: 240,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 10,
      average_rating: 4.8
    },
    {
      id: 'act_penanjong_033',
      host_profile_id: 'hp_002',
      host_user_id: 'usr_host_002',
      title: 'Kampong Penanjong Silver & Brass Craft Studio',
      description: 'Visit a family-run workshop in Kampong Penanjong. Watch skilled artisans transform metal into intricate traditional jewellery.',
      category: 'CREATIVE',
      district: 'Tutong',
      exact_location: 'Kampong Penanjong, Tutong',
      location_lat: 4.8100,
      location_lng: 114.6400,
      thumbnail_url: 'https://images.sidequest.bn/activities/penanjong.jpg',
      price_per_person: 35.00,
      duration_minutes: 150,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 6,
      average_rating: 4.7
    },
    // ====== BELAIT DISTRICT HIDDEN GEMS (034-041) ======
    {
      id: 'act_kb_waterfront_034',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Kuala Belait Waterfront Heritage & History Walk',
      description: 'Stroll along the charming Kuala Belait waterfront and learn about the town\'s transformation from a fishing village to the oil & gas hub.',
      category: 'CULTURE',
      district: 'Belait',
      exact_location: 'Kuala Belait Waterfront',
      location_lat: 4.5830,
      location_lng: 114.1860,
      thumbnail_url: 'https://images.sidequest.bn/activities/kbwaterfront.jpg',
      price_per_person: 18.00,
      duration_minutes: 90,
      max_participants: 20,
      is_active: true,
      is_featured: false,
      total_bookings: 21,
      average_rating: 4.5
    },
    {
      id: 'act_billionth_barrel_035',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Billionth Barrel Monument & Seria Oil Discovery Tour',
      description: 'Visit the iconic Billionth Barrel Monument marking Brunei\'s billionth barrel of oil. See the original nodding donkeys still pumping.',
      category: 'CULTURE',
      district: 'Belait',
      exact_location: 'Billionth Barrel Monument, Seria',
      location_lat: 4.6130,
      location_lng: 114.3280,
      thumbnail_url: 'https://images.sidequest.bn/activities/billionth.jpg',
      price_per_person: 20.00,
      duration_minutes: 120,
      max_participants: 20,
      is_active: true,
      is_featured: false,
      total_bookings: 33,
      average_rating: 4.4
    },
    {
      id: 'act_andulau_036',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Andulau Forest Reserve Jungle Trek',
      description: 'Explore the Andulau Forest Reserve, one of Brunei\'s most accessible rainforests. Trek beneath a towering canopy of dipterocarp trees.',
      category: 'ADVENTURE',
      district: 'Belait',
      exact_location: 'Andulau Forest Reserve, Sungai Liang',
      location_lat: 4.6920,
      location_lng: 114.5130,
      thumbnail_url: 'https://images.sidequest.bn/activities/andulau.jpg',
      price_per_person: 45.00,
      duration_minutes: 240,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 14,
      average_rating: 4.8
    },
    {
      id: 'act_wasai_mendaram_037',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Wasai Mendaram Waterfall & River Tubing',
      description: 'Combine a jungle trek to stunning Wasai Mendaram Waterfall with exhilarating river tubing back down the Mendaram River.',
      category: 'ADVENTURE',
      district: 'Belait',
      exact_location: 'Wasai Mendaram, Kampong Mendaram, Belait',
      location_lat: 4.6740,
      location_lng: 114.5390,
      thumbnail_url: 'https://images.sidequest.bn/activities/mendaram.jpg',
      price_per_person: 55.00,
      duration_minutes: 300,
      max_participants: 8,
      is_active: true,
      is_featured: true,
      total_bookings: 17,
      average_rating: 4.9
    },
    {
      id: 'act_planetarium_038',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Sungai Liang Planetarium & Science Discovery Lab',
      description: 'Visit Brunei\'s only planetarium in Sungai Liang. Enjoy immersive star shows and explore interactive science exhibits.',
      category: 'CREATIVE',
      district: 'Belait',
      exact_location: 'Tenaga Suria Complex, Sungai Liang',
      location_lat: 4.6890,
      location_lng: 114.5040,
      thumbnail_url: 'https://images.sidequest.bn/activities/planetarium.jpg',
      price_per_person: 15.00,
      duration_minutes: 120,
      max_participants: 30,
      is_active: true,
      is_featured: false,
      total_bookings: 22,
      average_rating: 4.3
    },
    {
      id: 'act_labi_rice_039',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Kampong Labi Traditional Rice Farming Workshop',
      description: 'Visit the picturesque paddy fields of Kampong Labi. Try planting rice seedlings and enjoy a farm-to-table lunch.',
      category: 'FOOD',
      district: 'Belait',
      exact_location: 'Kampong Labi Rice Fields, Belait',
      location_lat: 4.6210,
      location_lng: 114.4870,
      thumbnail_url: 'https://images.sidequest.bn/activities/labirice.jpg',
      price_per_person: 38.00,
      duration_minutes: 180,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 8,
      average_rating: 4.7
    },
    {
      id: 'act_lalak_040',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Luagan Lalak Forest Recreation & Birdwatching',
      description: 'Discover the serene Luagan Lalak forest with its mirror-like lake. A hidden gem for birdwatchers.',
      category: 'NATURE',
      district: 'Belait',
      exact_location: 'Luagan Lalak Recreational Forest, Belait',
      location_lat: 4.6440,
      location_lng: 114.4590,
      thumbnail_url: 'https://images.sidequest.bn/activities/lalak.jpg',
      price_per_person: 18.00,
      duration_minutes: 150,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 16,
      average_rating: 4.6
    },
    {
      id: 'act_seria_energy_041',
      host_profile_id: 'hp_003',
      host_user_id: 'usr_host_003',
      title: 'Seria Energy Lab Interactive Tour',
      description: 'Step inside the futuristic Energy Lab in Seria. Discover Brunei\'s oil & gas through VR and hands-on experiments.',
      category: 'CREATIVE',
      district: 'Belait',
      exact_location: 'Oil & Gas Discovery Centre, Seria',
      location_lat: 4.6150,
      location_lng: 114.3250,
      thumbnail_url: 'https://images.sidequest.bn/activities/energy.jpg',
      price_per_person: 12.00,
      duration_minutes: 90,
      max_participants: 25,
      is_active: true,
      is_featured: false,
      total_bookings: 35,
      average_rating: 4.4
    },
    // ====== TEMBURONG (042-048) ======
    {
      id: 'act_longboat_042',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Temburong Longboat River Safari & Village Visit',
      description: 'Speed up the Temburong River in an iconic longboat. Visit a traditional Iban longhouse.',
      category: 'ADVENTURE',
      district: 'Temburong',
      exact_location: 'Bangar Town Jetty, Temburong',
      location_lat: 4.7080,
      location_lng: 115.0750,
      thumbnail_url: 'https://images.sidequest.bn/activities/longboat.jpg',
      price_per_person: 58.00,
      duration_minutes: 240,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 25,
      average_rating: 4.8
    },
    {
      id: 'act_bukit_patoi_043',
      host_profile_id: 'hp_004',
      host_user_id: 'usr_host_004',
      title: 'Bukit Patoi Hill Trek & Border View',
      description: 'Hike up Bukit Patoi for breathtaking views of Temburong River towards Malaysian Borneo.',
      category: 'ADVENTURE',
      district: 'Temburong',
      exact_location: 'Bukit Patoi, Kampong Senukoh, Temburong',
      location_lat: 4.6830,
      location_lng: 115.1300,
      thumbnail_url: 'https://images.sidequest.bn/activities/bukitpatoi.jpg',
      price_per_person: 35.00,
      duration_minutes: 180,
      max_participants: 10,
      is_active: true,
      is_featured: false,
      total_bookings: 12,
      average_rating: 4.7
    },
    {
      id: 'act_rataie_bamboo_044',
      host_profile_id: 'hp_002',
      host_user_id: 'usr_host_002',
      title: 'Kampong Rataie Bamboo Craft & Instrument Workshop',
      description: 'Master bamboo craftsmen demonstrate making musical instruments. Make your own bamboo flute.',
      category: 'CREATIVE',
      district: 'Temburong',
      exact_location: 'Kampong Rataie, Temburong',
      location_lat: 4.7150,
      location_lng: 115.1120,
      thumbnail_url: 'https://images.sidequest.bn/activities/rataie.jpg',
      price_per_person: 42.00,
      duration_minutes: 180,
      max_participants: 8,
      is_active: true,
      is_featured: false,
      total_bookings: 5,
      average_rating: 4.9
    },
    {
      id: 'act_eco_farm_045',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Temburong Eco-Agriculture Farm Experience',
      description: 'Spend a day at a sustainable family farm. Harvest vegetables and enjoy a farm-fresh lunch.',
      category: 'FOOD',
      district: 'Temburong',
      exact_location: 'Kampong Semabat, Temburong',
      location_lat: 4.7400,
      location_lng: 115.1040,
      thumbnail_url: 'https://images.sidequest.bn/activities/ecofarm.jpg',
      price_per_person: 48.00,
      duration_minutes: 240,
      max_participants: 12,
      is_active: true,
      is_featured: false,
      total_bookings: 11,
      average_rating: 4.8
    },
    {
      id: 'act_freme_rainforest_046',
      host_profile_id: 'hp_005',
      host_user_id: 'usr_host_005',
      title: 'Freme Rainforest Lodge Canopy Walk',
      description: 'Walk along elevated canopy bridges deep in Temburong\'s rainforest. Identify medicinal plants.',
      category: 'NATURE',
      district: 'Temburong',
      exact_location: 'Freme Rainforest Lodge, Temburong',
      location_lat: 4.5570,
      location_lng: 115.1750,
      thumbnail_url: 'https://images.sidequest.bn/activities/freme.jpg',
      price_per_person: 32.00,
      duration_minutes: 150,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 21,
      average_rating: 4.6
    },
    {
      id: 'act_river_tubing_047',
      host_profile_id: 'hp_006',
      host_user_id: 'usr_host_006',
      title: 'Temburong River Tubing Adventure',
      description: 'Float down gentle rapids of the Temburong River. Includes riverside BBQ and life jackets.',
      category: 'ADVENTURE',
      district: 'Temburong',
      exact_location: 'Temburong River, Kampong Selapon',
      location_lat: 4.6990,
      location_lng: 115.0950,
      thumbnail_url: 'https://images.sidequest.bn/activities/ribetubing.jpg',
      price_per_person: 48.00,
      duration_minutes: 240,
      max_participants: 10,
      is_active: true,
      is_featured: true,
      total_bookings: 19,
      average_rating: 4.9
    },
    {
      id: 'act_labu_estate_048',
      host_profile_id: 'hp_001',
      host_user_id: 'usr_host_001',
      title: 'Kampong Labu Estate Heritage Trail',
      description: 'Step back in time at a former rubber plantation. Explore colonial-era bungalows.',
      category: 'CULTURE',
      district: 'Temburong',
      exact_location: 'Kampong Labu Estate, Temburong',
      location_lat: 4.7270,
      location_lng: 115.1390,
      thumbnail_url: 'https://images.sidequest.bn/activities/labu.jpg',
      price_per_person: 22.00,
      duration_minutes: 120,
      max_participants: 15,
      is_active: true,
      is_featured: false,
      total_bookings: 9,
      average_rating: 4.5
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

