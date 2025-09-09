import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { MapPin, Calendar, Clock, Globe, Search, Camera, Mountain, Star, Navigation, RotateCcw, ZoomIn, ZoomOut, Move, Maximize2, MessageCircle, Bot, Send, Sparkles, Heart, Users, Phone, Mail, CalendarDays, UserCheck } from 'lucide-react';
import Panoramic360Viewer from './components/Panoramic360Viewer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.placeholder.com';
const API = `${BACKEND_URL}/api`;

// Mock data for when backend is not available
const MOCK_MONASTERIES = [
  {
    id: '1',
    name: 'Rumtek Monastery',
    location: 'Rumtek, East Sikkim',
    district: 'East Sikkim',
    altitude: '1,550 meters',
    tradition: 'Kagyu School of Tibetan Buddhism',
    description: 'Also known as the Dharma Chakra Centre, Rumtek is one of the largest monasteries in Sikkim and serves as the seat-in-exile of the Karmapa Lama.',
    founded: '1966 (originally 1734)',
    architecture: 'Traditional Tibetan architecture with intricate woodwork and colorful murals',
    spiritual_significance: 'Seat of the 16th Karmapa and center of Kagyu lineage in exile',
    main_image: 'https://images.pexels.com/photos/32010298/pexels-photo-32010298.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/32010298/pexels-photo-32010298.jpeg',
      'https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg',
      'https://images.pexels.com/photos/19715251/pexels-photo-19715251.jpeg'
    ],
    panoramic_images: [
      'https://miro.medium.com/v2/resize:fit:2000/0*QOTVj3y0Z0o3a_Hv',
      'https://images.unsplash.com/photo-1570201319960-4e72c0cb26b3?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.2996, lng: 88.5565 },
    highlights: ['Golden Stupa', 'Shrine Hall', 'Monastery Museum', 'Sacred Dance Festival'],
    visiting_hours: '6:00 AM - 6:00 PM',
    entrance_fee: '₹0',
    accessibility: 'Road accessible, moderate walk from parking',
    cultural_importance: 'Most important Kagyu monastery in Sikkim, seat of Karmapa lineage',
    festivals: [
      {
        name: 'Kagyu Monlam',
        date: 'February/March',
        description: 'Annual prayer festival with masked dances',
        significance: 'Important spiritual gathering for Kagyu practitioners'
      }
    ],
    travel_info: {
      best_time_to_visit: 'March to June, September to December',
      nearest_airport: 'Bagdogra Airport (124 km)',
      accommodation: ['Hotel Sonam Delek', 'Rumtek Monastery Guest House'],
      local_transport: 'Shared jeeps, private taxis from Gangtok (24 km)',
      permits_required: 'Inner Line Permit for non-Indians',
      weather_info: 'Pleasant climate, avoid monsoon season'
    }
  },
  {
    id: '2',
    name: 'Pemayangtse Monastery',
    location: 'Pelling, West Sikkim',
    district: 'West Sikkim',
    altitude: '2,085 meters',
    tradition: 'Nyingma School of Tibetan Buddhism',
    description: 'One of the oldest and most important monasteries in Sikkim, meaning Perfect Sublime Lotus.',
    founded: '1705',
    architecture: 'Three-story structure with traditional Sikkimese architecture',
    spiritual_significance: 'Second most important monastery in Sikkim, head monastery of Nyingma sect',
    main_image: 'https://images.unsplash.com/photo-1634308670152-17f7f1aa4e79',
    gallery_images: [
      'https://images.unsplash.com/photo-1634308670152-17f7f1aa4e79',
      'https://images.unsplash.com/photo-1687074106203-f3dad46d9eb6'
    ],
    panoramic_images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.3182, lng: 88.2160 },
    highlights: ['Zangdog Palri Model', 'Ancient Manuscripts', 'Kanchenjunga Views'],
    visiting_hours: '7:00 AM - 5:00 PM',
    entrance_fee: '₹20 for Indians, ₹200 for foreigners',
    accessibility: 'Well-connected by road, short walk from parking',
    cultural_importance: 'Premier Nyingma monastery, showcases traditional Sikkimese Buddhism',
    festivals: [
      {
        name: 'Chaam Dance Festival',
        date: 'January/February',
        description: 'Sacred masked dance performances',
        significance: 'Drives away evil spirits and brings good fortune'
      }
    ],
    travel_info: {
      best_time_to_visit: 'October to May for clear mountain views',
      nearest_airport: 'Bagdogra Airport (160 km)',
      accommodation: ['Hotel Garuda', 'Pelling Tourist Lodge'],
      local_transport: 'Shared jeeps from Pelling (2 km), taxis available',
      permits_required: 'Inner Line Permit for areas beyond Pelling',
      weather_info: 'Cool climate, clear views in autumn'
    }
  },
  {
    id: '3',
    name: 'Enchey Monastery',
    location: 'Gangtok, East Sikkim',
    district: 'East Sikkim',
    altitude: '1,800 meters',
    tradition: 'Nyingma School of Tibetan Buddhism',
    description: 'Located on a hilltop overlooking Gangtok, this monastery is believed to be blessed by guardian spirits and offers panoramic views of the city.',
    founded: '1909',
    architecture: 'Traditional Tibetan style with Chinese architectural influences',
    spiritual_significance: 'Important pilgrimage site, believed to be protected by tantric masters',
    main_image: 'https://images.unsplash.com/photo-1543341724-c6f823532cac',
    gallery_images: [
      'https://images.unsplash.com/photo-1543341724-c6f823532cac',
      'https://images.unsplash.com/photo-1755011310512-38cfb597241c',
      'https://images.pexels.com/photos/2409032/pexels-photo-2409032.jpeg'
    ],
    panoramic_images: [
      'https://images.unsplash.com/photo-1591123720950-2ec8c92e3a02?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605108176507-b4b5c4b91b51?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.3389, lng: 88.6065 },
    highlights: ['Prayer Hall', 'Ancient Statues', 'City Views', 'Guardian Deities'],
    visiting_hours: '6:00 AM - 6:00 PM',
    entrance_fee: '₹0',
    accessibility: 'Easy road access from Gangtok city center',
    cultural_importance: 'Important urban monastery, center of Buddhist activities in Gangtok',
    festivals: [
      {
        name: 'Chaam Festival',
        date: 'December/January',
        description: 'Annual masked dance festival with elaborate costumes',
        significance: 'Celebrates victory of good over evil'
      }
    ],
    travel_info: {
      best_time_to_visit: 'March to June, September to December',
      nearest_airport: 'Bagdogra Airport (124 km)',
      accommodation: ['Hotels in Gangtok city', 'Mayfair Spa Resort'],
      local_transport: 'Local taxis, walking distance from MG Road',
      permits_required: 'None for the monastery itself',
      weather_info: 'Pleasant climate year-round, avoid monsoon season'
    }
  },
  {
    id: '4',
    name: 'Tashiding Monastery',
    location: 'Tashiding, West Sikkim',
    district: 'West Sikkim',
    altitude: '1,465 meters',
    tradition: 'Nyingma School of Tibetan Buddhism',
    description: 'Perched on a hilltop between Rathong and Rangeet rivers, this monastery is considered one of the most sacred in Sikkim.',
    founded: '1717',
    architecture: 'Traditional architecture harmoniously blended with the natural landscape',
    spiritual_significance: 'Most sacred monastery in Sikkim, blessed by Guru Padmasambhava',
    main_image: 'https://images.unsplash.com/photo-1633538028057-838fd4e027a4',
    gallery_images: [
      'https://images.unsplash.com/photo-1633538028057-838fd4e027a4',
      'https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg',
      'https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg'
    ],
    panoramic_images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1570201319960-4e72c0cb26b3?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.3433, lng: 88.2167 },
    highlights: ['Sacred Chortens', 'Holy Spring', 'Bhumchu Festival', 'River Confluence Views'],
    visiting_hours: '6:00 AM - 6:00 PM',
    entrance_fee: '₹0',
    accessibility: 'Moderate trek from road, scenic walking path',
    cultural_importance: 'Holiest site in Sikkim, significant for all Buddhist sects',
    festivals: [
      {
        name: 'Bhumchu Festival',
        date: 'February/March',
        description: 'Sacred water ceremony predicting the year ahead',
        significance: 'Most important festival, determines fortune for the year'
      }
    ],
    travel_info: {
      best_time_to_visit: 'October to May, especially during Bhumchu Festival',
      nearest_airport: 'Bagdogra Airport (140 km)',
      accommodation: ['Basic guest houses in Tashiding', 'Hotels in nearby Geyzing'],
      local_transport: 'Shared jeeps from Geyzing, private taxis available',
      permits_required: 'Inner Line Permit for non-Indians',
      weather_info: 'Pleasant climate, can be misty, best visibility in winter'
    }
  },
  {
    id: '5',
    name: 'Do-drul Chorten',
    location: 'Gangtok, East Sikkim',
    district: 'East Sikkim',
    altitude: '1,650 meters',
    tradition: 'Nyingma School of Tibetan Buddhism',
    description: 'The most important stupa in Sikkim, surrounded by 108 prayer wheels and containing sacred relics and mantras.',
    founded: '1945',
    architecture: 'Traditional Tibetan stupa architecture with golden spire',
    spiritual_significance: 'Important pilgrimage site, believed to subdue evil forces',
    main_image: 'https://images.pexels.com/photos/33262249/pexels-photo-33262249.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/33262249/pexels-photo-33262249.jpeg',
      'https://images.pexels.com/photos/19715251/pexels-photo-19715251.jpeg',
      'https://images.unsplash.com/photo-1566499175117-c78fabf20b7d'
    ],
    panoramic_images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1634308654308-2d12cb6d0f47?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.3178, lng: 88.6094 },
    highlights: ['108 Prayer Wheels', 'Golden Stupa', 'Sacred Relics', 'Prayer Flags'],
    visiting_hours: '5:00 AM - 7:00 PM',
    entrance_fee: '₹0',
    accessibility: 'Easy access from Gangtok, well-maintained paths',
    cultural_importance: 'Spiritual center of Gangtok, important meditation site',
    festivals: [
      {
        name: 'Buddha Jayanti',
        date: 'May',
        description: 'Celebrates Buddha\'s birth with prayers and offerings',
        significance: 'Special prayers and circumambulation of the stupa'
      }
    ],
    travel_info: {
      best_time_to_visit: 'Year-round, especially early morning for prayers',
      nearest_airport: 'Bagdogra Airport (124 km)',
      accommodation: ['Hotels in Gangtok', 'Nearby guest houses'],
      local_transport: 'Walking distance from city center, local taxis available',
      permits_required: 'None',
      weather_info: 'Pleasant climate, covered walkways for rainy season'
    }
  },
  {
    id: '6',
    name: 'Khecheopalri Monastery',
    location: 'Khecheopalri, West Sikkim',
    district: 'West Sikkim',
    altitude: '1,700 meters',
    tradition: 'Nyingma School of Tibetan Buddhism',
    description: 'Located near the sacred Khecheopalri Lake (Wishing Lake), this monastery is surrounded by pristine forests and is considered highly sacred.',
    founded: 'Unknown (ancient)',
    architecture: 'Simple traditional architecture in harmony with nature',
    spiritual_significance: 'Sacred lake monastery, fulfills devotees\' wishes',
    main_image: 'https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg',
    gallery_images: [
      'https://images.pexels.com/photos/6576294/pexels-photo-6576294.jpeg',
      'https://images.unsplash.com/photo-1755011310512-38cfb597241c',
      'https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg'
    ],
    panoramic_images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048&h=1024&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1591123720950-2ec8c92e3a02?w=2048&h=1024&fit=crop&crop=center'
    ],
    coordinates: { lat: 27.3167, lng: 88.2000 },
    highlights: ['Sacred Wishing Lake', 'Forest Trek', 'Bird Watching', 'Prayer Flags'],
    visiting_hours: 'Dawn to Dusk',
    entrance_fee: '₹0',
    accessibility: 'Moderate trek through forest, well-marked trail',
    cultural_importance: 'Sacred pilgrimage site, both Buddhist and Hindu significance',
    festivals: [
      {
        name: 'Maghe Sankranti',
        date: 'January',
        description: 'Sacred bathing and prayers at the lake',
        significance: 'Purification of sins and fulfillment of wishes'
      }
    ],
    travel_info: {
      best_time_to_visit: 'March to June, September to December',
      nearest_airport: 'Bagdogra Airport (150 km)',
      accommodation: ['Eco-lodges near lake', 'Hotels in Pelling (30 km)'],
      local_transport: 'Jeeps from Pelling, then 30-minute forest walk',
      permits_required: 'Inner Line Permit for non-Indians',
      weather_info: 'Cool and misty, leeches during monsoon, beautiful in winter'
    }
  }
];

// Using the new Panoramic360Viewer component instead

const BookingForm = ({ monastery, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
    visit_date: '',
    visit_time: '10:00',
    group_size: 1,
    tour_type: 'self_guided',
    special_requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const tourPrices = {
    'self_guided': 0,
    'guided_tour': 500,
    'spiritual_session': 300
  };

  useEffect(() => {
    const basePrice = tourPrices[formData.tour_type] || 0;
    setTotalAmount(basePrice * formData.group_size);
  }, [formData.tour_type, formData.group_size]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        ...formData,
        monastery_id: monastery.id,
        total_amount: totalAmount
      };
      
      // Try to use backend API, fallback to mock if unavailable
      try {
        const response = await axios.post(`${API}/bookings`, bookingData);
        onBookingSuccess({
          ...response.data,
          monastery_name: monastery.name
        });
      } catch (apiError) {
        console.log('Backend not available, using mock booking:', apiError.message);
        // Fallback to mock booking
        await new Promise(resolve => setTimeout(resolve, 1000));
        onBookingSuccess({
          ...bookingData,
          id: 'BOOK' + Date.now(),
          booking_status: 'confirmed',
          monastery_name: monastery.name
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Your Visit</h2>
              <p className="text-blue-100">{monastery.name}</p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
              Visitor Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  name="visitor_name"
                  value={formData.visitor_name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-800 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    name="visitor_email"
                    value={formData.visitor_email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 text-gray-800 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  name="visitor_phone"
                  value={formData.visitor_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 text-gray-800 placeholder-gray-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              Visit Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                <Input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleInputChange}
                  required
                  min={today}
                  max={maxDateString}
                  className="w-full text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <select
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                <Input
                  type="number"
                  name="group_size"
                  value={formData.group_size}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="20"
                  className="w-full text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
                <select
                  name="tour_type"
                  value={formData.tour_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="self_guided">Self-Guided Visit (₹0)</option>
                  <option value="guided_tour">Guided Tour (₹500/person)</option>
                  <option value="spiritual_session">Spiritual Session (₹300/person)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Tour Type:</span>
                <span className="font-medium">{formData.tour_type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Group Size:</span>
                <span className="font-medium">{formData.group_size} {formData.group_size === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-amber-700 pt-2 border-t border-amber-200">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold rounded-xl"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing Booking...
              </div>
            ) : (
              `Confirm Booking - Pay ₹${totalAmount}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

const VirtualTourViewer = ({ monastery, onClose, onBookTour }) => {
  const [currentView, setCurrentView] = useState('gallery');
  const [tourPoints] = useState([
    { id: 'exterior', name: 'Exterior View', images: monastery.gallery_images },
    { id: 'interior', name: 'Interior', images: monastery.gallery_images.slice(1) },
    { id: 'panoramic', name: '360° Panoramic', images: monastery.panoramic_images },
    { id: 'details', name: 'Architectural Details', images: monastery.gallery_images }
  ]);
  
  const [showPanorama, setShowPanorama] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const currentTourPoint = tourPoints.find(p => p.id === currentView) || tourPoints[0];

  if (showPanorama) {
    return (
      <Panoramic360Viewer 
        images={monastery.panoramic_images} 
        currentImageIndex={0}
        onClose={() => setShowPanorama(false)}
        onImageChange={(index) => console.log('Image changed to:', index)}
        monastery={monastery}
      />
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white">{monastery.name}</h2>
          <p className="text-amber-100">{monastery.location} • {monastery.altitude}</p>
        </div>
        <Button onClick={onClose} variant="outline" className="text-white border-white hover:bg-white/20">
          Close Tour
        </Button>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <img 
            src={currentTourPoint.images[currentImageIndex] || monastery.main_image}
            alt={`${monastery.name} - ${currentView}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </div>
        
        {/* Image Navigation */}
        {currentTourPoint.images.length > 1 && (
          <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center">
            <Button
              onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
              disabled={currentImageIndex === 0}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              ←
            </Button>
            <Button
              onClick={() => setCurrentImageIndex(Math.min(currentTourPoint.images.length - 1, currentImageIndex + 1))}
              disabled={currentImageIndex === currentTourPoint.images.length - 1}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              →
            </Button>
          </div>
        )}
        
        {/* Tour Navigation */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Virtual Tour Experience</h3>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPanorama(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  360° View
                </Button>
                {onBookTour && (
                  <Button
                    onClick={onBookTour}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Visit
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {tourPoints.map((point) => (
                <Button
                  key={point.id}
                  onClick={() => {
                    setCurrentView(point.id);
                    setCurrentImageIndex(0);
                  }}
                  variant={currentView === point.id ? "default" : "outline"}
                  className={`${currentView === point.id 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'border-white/30 text-white hover:bg-white/20'
                  } transition-all duration-200`}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {point.name}
                </Button>
              ))}
            </div>
            
            {/* Image Counter */}
            {currentTourPoint.images.length > 1 && (
              <div className="text-center text-white/70 text-sm">
                Image {currentImageIndex + 1} of {currentTourPoint.images.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Interactive Hotspots for current view */}
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-amber-600 text-white px-3 py-2 rounded-full text-sm animate-pulse cursor-pointer hover:bg-amber-700 transition-colors">
            <MapPin className="w-4 h-4 inline mr-1" />
            Main Hall
          </div>
        </div>
        
        <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <div className="bg-amber-600 text-white px-3 py-2 rounded-full text-sm animate-pulse cursor-pointer hover:bg-amber-700 transition-colors">
            <Star className="w-4 h-4 inline mr-1" />
            Buddha Statue
          </div>
        </div>
      </div>
    </div>
  );
};

const MonasteryCard = ({ monastery, onStartTour, onLearnMore, onBookVisit }) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 bg-gradient-to-br from-white to-gray-50">
      <div className="relative overflow-hidden">
        <img 
          src={monastery.main_image} 
          alt={monastery.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        {/* Floating Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2 mb-2">
            <Button 
              onClick={() => onStartTour(monastery)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              Virtual Tour
            </Button>
            <Button 
              onClick={() => onLearnMore(monastery)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-lg"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Guide
            </Button>
          </div>
          <Button 
            onClick={() => onBookVisit(monastery)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full shadow-lg font-semibold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Visit
          </Button>
        </div>
        
        {/* Enhanced Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
            {monastery.altitude}
          </Badge>
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
            {monastery.entrance_fee === '₹0' ? '🆓' : '💵'}
          </Badge>
        </div>
        
        {/* Tradition Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            {monastery.tradition.includes('Nyingma') ? '🕊️ Nyingma' : '☸️ Kagyu'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {monastery.name}
            </CardTitle>
            <CardDescription className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
              {monastery.location}
            </CardDescription>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="font-semibold">Est.</div>
            <div>{monastery.founded.split(' ')[0]}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {monastery.description}
        </p>
        
        {/* Highlights Pills */}
        <div className="flex flex-wrap gap-1">
          {monastery.highlights.slice(0, 3).map((highlight, index) => (
            <span key={index} className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {highlight}
            </span>
          ))}
          {monastery.highlights.length > 3 && (
            <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{monastery.highlights.length - 3} more
            </span>
          )}
        </div>
        
        {/* Info Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{monastery.visiting_hours}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 text-amber-400" />
            <span>{monastery.highlights.length} Highlights</span>
          </div>
        </div>
        
        {/* Bottom Action */}
        <Button 
          onClick={() => onLearnMore(monastery)}
          className="w-full bg-gradient-to-r from-slate-100 to-gray-100 hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 border-0 rounded-xl transition-all duration-300 group-hover:shadow-md"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Explore with AI Guide
        </Button>
      </CardContent>
    </Card>
  );
};

const MonasteryDetails = ({ monastery, onClose, onStartTour }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId] = useState(() => 'session_' + Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    setShowWelcome(false);
    const userMessage = newMessage;
    setNewMessage('');
    
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage, timestamp: new Date() }]);
    
    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: sessionId,
        monastery_id: monastery.id
      });
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: response.data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      // Enhanced AI responses with better keyword matching
      let mockResponse = '';
      const lowerMessage = userMessage.toLowerCase();
      
      // Greeting responses
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
        mockResponse = `Namaste! 🙏 I'm your AI guide for ${monastery.name} and Sikkim's Buddhist heritage. I'm here to share insights about this magnificent ${monastery.tradition} monastery, founded in ${monastery.founded}. Ask me about its history, festivals, architecture, visiting tips, or anything about Sikkim! What interests you most?`;
      }
      // History and monastery-specific questions
      else if (lowerMessage.includes('history') || lowerMessage.includes('founded') || lowerMessage.includes('built') || lowerMessage.includes('origin')) {
        mockResponse = `📚 **History of ${monastery.name}:**\n\n${monastery.name} was founded in ${monastery.founded} and belongs to the ${monastery.tradition}. This sacred monastery is located in ${monastery.location} at an elevation of ${monastery.altitude}.\n\n**Cultural Significance:** ${monastery.cultural_importance}\n\n**Architecture:** ${monastery.architecture}\n\nWould you like to know more about its founding legends, architectural details, or the Buddhist lineage associated with it?`;
      }
      // Festivals and celebrations
      else if (lowerMessage.includes('festival') || lowerMessage.includes('celebration') || lowerMessage.includes('event') || lowerMessage.includes('ceremony')) {
        const festivals = monastery.festivals.map(f => `🎭 **${f.name}** (${f.date}): ${f.description}`).join('\n\n');
        mockResponse = `🎊 **Festivals at ${monastery.name}:**\n\n${festivals}\n\nThese festivals are incredible cultural experiences featuring traditional Cham dances, Buddhist rituals, and community gatherings. The monastery comes alive with colorful prayers flags, ritual music, and spiritual ceremonies. Would you like specific details about any of these festivals?`;
      }
      // Travel and visiting information
      else if (lowerMessage.includes('visit') || lowerMessage.includes('travel') || lowerMessage.includes('reach') || lowerMessage.includes('transport') || lowerMessage.includes('how to get')) {
        mockResponse = `🚗 **Visiting ${monastery.name}:**\n\n**Location:** ${monastery.location}\n**Altitude:** ${monastery.altitude}\n**Visiting Hours:** ${monastery.visiting_hours}\n**Entrance Fee:** ${monastery.entrance_fee}\n\n**How to Reach:** ${monastery.travel_info.local_transport}\n**Nearest Airport:** ${monastery.travel_info.nearest_airport}\n**Best Time:** ${monastery.travel_info.best_time_to_visit}\n**Accessibility:** ${monastery.accessibility}\n\n**Important:** ${monastery.travel_info.permits_required}\n\nWould you like specific directions or accommodation suggestions?`;
      }
      // Weather and best time
      else if (lowerMessage.includes('weather') || lowerMessage.includes('climate') || lowerMessage.includes('best time') || lowerMessage.includes('season')) {
        mockResponse = `🌤️ **Weather & Best Time for ${monastery.name}:**\n\n**Best Time to Visit:** ${monastery.travel_info.best_time_to_visit}\n**Weather Info:** ${monastery.travel_info.weather_info}\n\n**Seasonal Guide:**\n• **Spring (Mar-Jun):** Pleasant weather, clear mountain views, blooming rhododendrons\n• **Autumn (Sep-Dec):** Crystal clear skies, perfect for photography, comfortable temperatures\n• **Monsoon (Jul-Aug):** Heavy rains, landslides possible, avoid if possible\n• **Winter (Jan-Feb):** Cold but clear, snow-capped peaks visible, fewer tourists\n\nThe monastery's location at ${monastery.altitude} offers stunning Himalayan views year-round!`;
      }
      // Buddhism and spiritual questions
      else if (lowerMessage.includes('buddhism') || lowerMessage.includes('meditation') || lowerMessage.includes('spiritual') || lowerMessage.includes('teaching') || lowerMessage.includes('philosophy')) {
        mockResponse = `🧘‍♂️ **Buddhism at ${monastery.name}:**\n\n**Tradition:** ${monastery.tradition}\n**Spiritual Significance:** ${monastery.spiritual_significance}\n\nThis monastery follows traditional Tibetan Buddhist practices including:\n• Daily prayer sessions and meditation\n• Ritual ceremonies and offerings\n• Study of Buddhist scriptures\n• Community teachings and dharma talks\n\n**Key Teachings:** The Four Noble Truths, Eightfold Path, compassion (karuna), and wisdom (prajna) form the foundation. Monks here practice both study and meditation to achieve enlightenment.\n\nVisitors can participate in morning prayers, receive blessings, and learn about Buddhist philosophy. Would you like to know about meditation practices or Buddhist ceremonies?`;
      }
      // Architecture and features
      else if (lowerMessage.includes('architecture') || lowerMessage.includes('building') || lowerMessage.includes('structure') || lowerMessage.includes('design') || lowerMessage.includes('art')) {
        const highlights = monastery.highlights.map(h => `• ${h}`).join('\n');
        mockResponse = `🏛️ **Architecture of ${monastery.name}:**\n\n**Architectural Style:** ${monastery.architecture}\n\n**Key Features:**\n${highlights}\n\n**Traditional Elements:**\n• Colorful prayer flags fluttering in mountain breeze\n• Intricate woodwork with traditional Tibetan motifs\n• Golden roof ornaments and sacred symbols\n• Prayer wheels for generating spiritual merit\n• Beautiful murals depicting Buddhist stories\n• Sacred statues of Buddha and Bodhisattvas\n\nThe monastery's design reflects centuries of Himalayan Buddhist architecture, perfectly harmonized with the natural mountain landscape. Each element has deep spiritual significance in Buddhist tradition.`;
      }
      // Food and culture
      else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('cuisine') || lowerMessage.includes('meal')) {
        mockResponse = `🍜 **Food & Cuisine near ${monastery.name}:**\n\n**Traditional Sikkimese Dishes:**\n• **Momos:** Steamed dumplings with vegetables or meat\n• **Thukpa:** Hearty noodle soup perfect for mountain weather\n• **Gundruk:** Fermented leafy green vegetable, local specialty\n• **Sel Roti:** Traditional sweet ring-shaped bread\n• **Phagshapa:** Pork with radish and dried chilies\n• **Sinki:** Fermented radish root soup\n\n**Monastery Food:** Simple vegetarian meals, butter tea (po cha), tsampa (roasted barley flour)\n\n**Local Beverages:** Chang (millet beer), traditional butter tea, locally grown tea\n\nMany monasteries offer simple meals to visitors. The food reflects the region's Tibetan, Nepali, and Lepcha cultural influences. Perfect for the high-altitude mountain climate!`;
      }
      // Permits and regulations
      else if (lowerMessage.includes('permit') || lowerMessage.includes('permission') || lowerMessage.includes('document') || lowerMessage.includes('visa') || lowerMessage.includes('entry')) {
        mockResponse = `📋 **Permits for ${monastery.name}:**\n\n**Current Requirements:** ${monastery.travel_info.permits_required}\n\n**For Non-Indian Visitors:**\n• Inner Line Permit (ILP) required for most areas of Sikkim\n• Can be obtained online or at entry checkpoints\n• Valid for 15-30 days typically\n• Required documents: Passport, visa, photos\n\n**Entry Points:**\n• Rangpo (from West Bengal)\n• Melli (from Nepal border)\n• Nathu La Pass (restricted, special permits needed)\n\n**For Indians:** Valid ID proof (Aadhaar, Voter ID, Passport)\n\n**Monastery-Specific:** Most monasteries welcome visitors during visiting hours. Photography may have restrictions in prayer halls. Respectful dress code appreciated.\n\nAlways check current regulations as permits requirements can change. Local tour operators can assist with permit arrangements.`;
      }
      // Default comprehensive response
      else {
        mockResponse = `🏔️ **About ${monastery.name}:**\n\nI'd be delighted to help you learn about this magnificent ${monastery.tradition} monastery! Located in ${monastery.location} at ${monastery.altitude}, it was founded in ${monastery.founded}.\n\n**Quick Facts:**\n• **Tradition:** ${monastery.tradition}\n• **Highlights:** ${monastery.highlights.slice(0, 3).join(', ')}\n• **Best Visit Time:** ${monastery.travel_info.best_time_to_visit}\n• **Visiting Hours:** ${monastery.visiting_hours}\n\n**I can help you with:**\n🏛️ Architecture and history\n🎭 Festivals and ceremonies\n🚗 Travel and visiting tips\n🧘‍♂️ Buddhism and spiritual practices\n🍜 Local food and culture\n📋 Permits and regulations\n\nWhat specific aspect would you like to explore? Just ask me anything about ${monastery.name} or Sikkim's Buddhist heritage!`;
      }
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: mockResponse,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enhanced Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-90"></div>
        <img 
          src={monastery.main_image} 
          alt={monastery.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-8 right-8">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3 animate-pulse">
            <Mountain className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {monastery.tradition}
            </div>
            <div className="ml-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
              Est. {monastery.founded}
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
            {monastery.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-amber-200">
            <div className="flex items-center bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{monastery.location}</span>
            </div>
            <div className="flex items-center bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <Mountain className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{monastery.altitude}</span>
            </div>
          </div>
          
          <p className="text-white/90 mt-3 text-lg max-w-3xl leading-relaxed">
            {monastery.description}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">📖 Overview</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">🤖 AI Guide</TabsTrigger>
          <TabsTrigger value="festivals" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">🎭 Festivals</TabsTrigger>
          <TabsTrigger value="travel" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">✈️ Travel</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300">📸 Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mountain className="w-5 h-5 mr-2 text-amber-600" />
                About {monastery.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{monastery.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tradition</h4>
                  <Badge className="bg-amber-100 text-amber-800">{monastery.tradition}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Founded</h4>
                  <p className="text-gray-600">{monastery.founded}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Architecture</h4>
                  <p className="text-gray-600">{monastery.architecture}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accessibility</h4>
                  <p className="text-gray-600">{monastery.accessibility}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spiritual Significance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{monastery.spiritual_significance}</p>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Cultural Importance</h4>
                <p className="text-gray-700">{monastery.cultural_importance}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {monastery.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Bot className="w-6 h-6 mr-3 animate-pulse" />
                    Ask Our Sikkim Monastery Expert
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Get personalized insights about {monastery.name}, Buddhist culture, and general travel advice
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 flex flex-col">
                  {/* Chat Messages Area */}
                  <ScrollArea className="flex-1 p-6">
                    {showWelcome && chatMessages.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Welcome to your AI Monastery Guide!</h3>
                        <p className="text-gray-600 max-w-md mx-auto">I'm here to answer all your questions about {monastery.name} and Sikkim's Buddhist culture. Ask me anything!</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                          <button 
                            onClick={() => setNewMessage('Tell me about the history of this monastery')}
                            className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left text-sm border hover:border-blue-300"
                          >
                            📚 "Tell me about the history of this monastery"
                          </button>
                          <button 
                            onClick={() => setNewMessage('What festivals are celebrated here?')}
                            className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left text-sm border hover:border-blue-300"
                          >
                            🎭 "What festivals are celebrated here?"
                          </button>
                          <button 
                            onClick={() => setNewMessage('How do I get permits to visit Sikkim?')}
                            className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left text-sm border hover:border-blue-300"
                          >
                            📋 "How do I get permits to visit Sikkim?"
                          </button>
                          <button 
                            onClick={() => setNewMessage('What is the best time to visit?')}
                            className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left text-sm border hover:border-blue-300"
                          >
                            🌤️ "What is the best time to visit?"
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-sm ${
                              msg.type === 'user' 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                                : 'bg-white text-gray-800 border'
                            }`}>
                              {msg.type === 'ai' && (
                                <div className="flex items-center mb-2">
                                  <Bot className="w-4 h-4 mr-2 text-blue-500" />
                                  <span className="text-xs font-medium text-blue-600">AI Guide</span>
                                </div>
                              )}
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                              <div className={`text-xs mt-2 opacity-70 ${
                                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {msg.timestamp?.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border p-4 rounded-2xl shadow-sm max-w-xs">
                              <div className="flex items-center mb-2">
                                <Bot className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="text-xs font-medium text-blue-600">AI Guide</span>
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Chat Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ask about history, culture, festivals, or travel tips..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={isLoading}
                        className="flex-1 rounded-full border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400"
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={isLoading || !newMessage.trim()}
                        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Info Sidebar */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Quick Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Tradition</p>
                    <p className="text-amber-700 font-semibold">{monastery.tradition}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Founded</p>
                    <p className="text-amber-700 font-semibold">{monastery.founded}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Visiting Hours</p>
                    <p className="text-amber-700 font-semibold">{monastery.visiting_hours}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Popular Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700">• Monastery opening hours</p>
                    <p className="text-green-700">• Festival dates & significance</p>
                    <p className="text-green-700">• Travel permits required</p>
                    <p className="text-green-700">• Best photography spots</p>
                    <p className="text-green-700">• Nearby accommodations</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="festivals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monastery.festivals.map((festival, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700">{festival.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {festival.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{festival.description}</p>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-1">Significance</h4>
                    <p className="text-sm text-gray-700">{festival.significance}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="travel">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-amber-600" />
                  Visiting Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Opening Hours</h4>
                  <p className="text-gray-600">{monastery.visiting_hours}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Entrance Fee</h4>
                  <p className="text-gray-600">
                    {monastery.entrance_fee}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Accessibility</h4>
                  <p className="text-gray-600">{monastery.accessibility}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Best Time to Visit</h4>
                  <p className="text-sm text-gray-600">{monastery.travel_info.best_time_to_visit}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Nearest Airport</h4>
                  <p className="text-sm text-gray-600">{monastery.travel_info.nearest_airport}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Local Transport</h4>
                  <p className="text-sm text-gray-600">{monastery.travel_info.local_transport}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Permits Required</h4>
                  <p className="text-sm text-gray-600">{monastery.travel_info.permits_required}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Weather Info</h4>
                  <p className="text-sm text-gray-600">{monastery.travel_info.weather_info}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monastery.gallery_images.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt={`${monastery.name} view ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex space-x-4">
        <Button 
          onClick={() => onStartTour(monastery)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8"
        >
          <Camera className="w-4 h-4 mr-2" />
          Start Virtual Tour
        </Button>
        <Button onClick={onClose} variant="outline">
          Back to Monasteries
        </Button>
      </div>
    </div>
  );
};

const GlobalAIChat = ({ onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId] = useState(() => 'global_session_' + Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    setShowWelcome(false);
    const userMessage = newMessage;
    setNewMessage('');
    
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage, timestamp: new Date() }]);
    
    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: sessionId,
        monastery_id: null // No specific monastery context
      });
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: response.data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      // Provide intelligent mock responses for general queries
      let mockResponse = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        mockResponse = `Hello! I'm your AI assistant specializing in Sikkim monasteries and Buddhist culture, but I can help with general questions too. What would you like to know about Sikkim, Buddhism, travel, or anything else?`;
      } else if (lowerMessage.includes('sikkim') || lowerMessage.includes('monastery') || lowerMessage.includes('buddhist')) {
        mockResponse = `Sikkim is a beautiful Himalayan state with rich Buddhist heritage! It's home to magnificent monasteries like Rumtek, Pemayangtse, Enchey, Tashiding, Do-drul Chorten, and Khecheopalri. Each monastery has unique architecture, festivals, and spiritual significance. The state follows Tibetan Buddhism with Nyingma and Kagyu traditions. Would you like to know about specific monasteries, festivals, or travel information?`;
      } else if (lowerMessage.includes('weather') || lowerMessage.includes('climate') || lowerMessage.includes('best time')) {
        mockResponse = `The best time to visit Sikkim is March to June and September to December. During these months, you'll enjoy pleasant weather, clear mountain views, and accessibility to most monasteries. Avoid monsoon season (July-August) due to heavy rains and landslides. Winter (December-February) is cold but offers stunning clear views of the Himalayas, including Mount Khangchendzonga.`;
      } else if (lowerMessage.includes('travel') || lowerMessage.includes('how to reach') || lowerMessage.includes('permits')) {
        mockResponse = `To reach Sikkim: Fly to Bagdogra Airport (West Bengal), then take a 2-4 hour drive to your destination. Non-Indians need an Inner Line Permit (ILP) - apply online or at entry checkpoints. The permit is usually valid for 15-30 days. Main entry points are via Rangpo (from West Bengal) or Melli (from Nepal). Shared jeeps and private taxis are the primary transport within Sikkim.`;
      } else if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('eat')) {
        mockResponse = `Sikkimese cuisine is a delicious fusion of Tibetan, Nepali, and Lepcha influences! Must-try dishes include: Momos (steamed dumplings), Thukpa (noodle soup), Gundruk (fermented leafy vegetables), Sel Roti (traditional ring-shaped bread), Phagshapa (pork with radish), and Sikkimese Dal (lentil curry). Don't miss trying local beverages like Chaang (millet beer) and authentic butter tea in monasteries!`;
      } else if (lowerMessage.includes('festival') || lowerMessage.includes('celebration') || lowerMessage.includes('event')) {
        mockResponse = `Sikkim hosts vibrant Buddhist festivals throughout the year! Major ones include: Losar (Tibetan New Year - Feb/Mar), Saga Dawa (Buddha's enlightenment month - May/Jun), Pang Lhabsol (Mount Khangchendzonga worship - Sep), and various monastery-specific festivals like Rumtek's annual celebrations and Enchey's Cham dances. These festivals feature masked dances, traditional music, prayers, and colorful processions.`;
      } else if (lowerMessage.includes('buddhism') || lowerMessage.includes('meditation') || lowerMessage.includes('spiritual')) {
        mockResponse = `Buddhism in Sikkim primarily follows Tibetan traditions - Nyingma and Kagyu schools. Key concepts include compassion, mindfulness, and the path to enlightenment. Many monasteries offer meditation sessions and teachings. The Four Noble Truths and Eightfold Path form the foundation. Visitors can participate in prayer sessions, receive blessings, and learn about Buddhist philosophy. Would you like to know about specific Buddhist practices or philosophy?`;
      } else if (lowerMessage.includes('what') && (lowerMessage.includes('do') || lowerMessage.includes('see') || lowerMessage.includes('visit'))) {
        mockResponse = `In Sikkim, you can: Visit ancient monasteries with stunning architecture, Experience breathtaking views of Mount Khangchendzonga, Trek through pristine forests and mountain trails, Explore Gangtok's markets and ropeway, Visit sacred lakes like Khecheopalri and Tsomgo, Participate in Buddhist festivals and ceremonies, Enjoy local cuisine and cultural performances, Take scenic drives through mountain passes. Each region offers unique experiences - East Sikkim for monasteries, West for trekking, North for high-altitude landscapes!`;
      } else {
        mockResponse = `I'm here to help with all kinds of questions! While I specialize in Sikkim monasteries and Buddhist culture, I can also assist with general topics like travel, culture, history, and more. Sikkim is a fascinating Himalayan state with incredible monasteries, stunning mountain views, rich Buddhist heritage, and unique cultural blend. Feel free to ask me anything - whether it's about planning your trip, understanding Buddhism, or general information!`;
      }
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: mockResponse,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Bot className="w-8 h-8 mr-3 animate-pulse" />
                AI Assistant - Ask Me Anything!
              </h2>
              <p className="text-blue-100 mt-1">Specialized in Sikkim monasteries & Buddhist culture, but ready to help with all your questions</p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            {showWelcome && chatMessages.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Welcome to your AI Assistant!</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">I'm here to answer all your questions - whether about Sikkim monasteries, Buddhist culture, travel advice, or any general topics. What would you like to know?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
                  <button 
                    onClick={() => setNewMessage('Tell me about Sikkim monasteries')}
                    className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border hover:border-amber-300"
                  >
                    <div className="text-2xl mb-2">🏰</div>
                    <div className="font-semibold text-gray-800">About Sikkim Monasteries</div>
                    <div className="text-sm text-gray-600 mt-1">Learn about Buddhist heritage and sacred sites</div>
                  </button>
                  <button 
                    onClick={() => setNewMessage('How do I plan a trip to Sikkim?')}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border hover:border-blue-300"
                  >
                    <div className="text-2xl mb-2">✈️</div>
                    <div className="font-semibold text-gray-800">Plan My Trip</div>
                    <div className="text-sm text-gray-600 mt-1">Get travel advice, permits, and itinerary help</div>
                  </button>
                  <button 
                    onClick={() => setNewMessage('What are the major Buddhist festivals in Sikkim?')}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border hover:border-purple-300"
                  >
                    <div className="text-2xl mb-2">🎆</div>
                    <div className="font-semibold text-gray-800">Buddhist Festivals</div>
                    <div className="text-sm text-gray-600 mt-1">Discover cultural celebrations and events</div>
                  </button>
                  <button 
                    onClick={() => setNewMessage('Tell me about Buddhist philosophy and practices')}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border hover:border-green-300"
                  >
                    <div className="text-2xl mb-2">♈</div>
                    <div className="font-semibold text-gray-800">Buddhist Wisdom</div>
                    <div className="text-sm text-gray-600 mt-1">Explore spiritual teachings and meditation</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border'
                    }`}>
                      {msg.type === 'ai' && (
                        <div className="flex items-center mb-2">
                          <Bot className="w-5 h-5 mr-2 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">AI Assistant</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      <div className={`text-xs mt-2 opacity-70 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp?.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border p-4 rounded-2xl shadow-sm max-w-lg">
                      <div className="flex items-center mb-2">
                        <Bot className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">AI Assistant</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex space-x-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about Sikkim, Buddhism, travel, or anything else..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
                className="flex-1 rounded-full border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400 bg-white"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !newMessage.trim()}
                className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CulturalCalendar = ({ onClose }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      // Try to fetch from backend, fallback to mock data
      try {
        const response = await axios.get(`${API}/cultural-events/calendar/${year}/${month}`);
        setEvents(response.data.events);
      } catch (apiError) {
        console.log('Backend not available, using mock events:', apiError.message);
        // Mock cultural events
        setEvents([
          {
            id: '1',
            title: 'Losar - Tibetan New Year',
            description: 'The most important festival in the Tibetan calendar with prayers and festivities.',
            event_type: 'festival',
            start_date: '2024-02-10',
            end_date: '2024-02-12',
            location: 'All Sikkim Monasteries',
            significance: 'Celebration of new beginnings and prosperity',
            traditions: ['Tibetan Buddhism', 'Nyingma', 'Kagyu'],
            activities: ['Prayer ceremonies', 'Cham dances', 'Traditional music'],
            visitor_info: 'Visitors welcome to observe ceremonies. Traditional dress appreciated.',
            image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
          },
          {
            id: '2',
            title: 'Saga Dawa - Buddha\'s Enlightenment',
            description: 'Sacred month celebrating Buddha\'s birth, enlightenment, and parinirvana.',
            event_type: 'festival',
            start_date: '2024-05-23',
            end_date: '2024-06-22',
            location: 'All Sikkim Monasteries',
            significance: 'Triple blessed month - merit multiplied 100,000 times',
            traditions: ['Tibetan Buddhism'],
            activities: ['Continuous prayers', 'Merit accumulation', 'Butter lamp offerings'],
            visitor_info: 'Ideal time for monastery visits. Early morning prayers recommended.',
            image_url: 'https://images.unsplash.com/photo-1599735462307-c8842d0f6afe'
          },
          {
            id: '3',
            title: 'Pang Lhabsol Festival',
            description: 'Unique Sikkimese festival honoring Mount Khangchendzonga.',
            event_type: 'cultural_event',
            start_date: '2024-09-04',
            end_date: '2024-09-04',
            location: 'All Sikkim',
            significance: 'Worship of Sikkim\'s patron deity',
            traditions: ['Sikkimese Buddhism', 'Lepcha traditions'],
            activities: ['Warrior dances', 'Traditional archery', 'Mountain blessing rituals'],
            visitor_info: 'State holiday. Traditional attire common.',
            image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(event => {
        const eventStart = new Date(event.start_date);
        const eventEnd = new Date(event.end_date);
        const currentDay = new Date(year, month, day);
        return currentDay >= eventStart && currentDay <= eventEnd;
      });
      
      days.push({ day, events: dayEvents });
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'festival': return 'bg-amber-500';
      case 'ceremony': return 'bg-blue-500';
      case 'cultural_event': return 'bg-green-500';
      case 'special_occasion': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cultural calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Cultural Calendar</h2>
              <p className="text-amber-100">Festivals & Events in Sikkim</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-white/20 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded ${viewMode === 'month' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/20'}`}
                >
                  Month
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-white text-amber-600' : 'text-white hover:bg-white/20'}`}
                >
                  List
                </Button>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="text-white border-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'month' ? (
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => navigateMonth(-1)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800"
                >
                  ← Previous
                </Button>
                <h3 className="text-2xl font-bold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <Button
                  onClick={() => navigateMonth(1)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800"
                >
                  Next →
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((dayData, index) => (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border rounded-lg ${
                      dayData ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    {dayData && (
                      <div>
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                          {dayData.day}
                        </div>
                        <div className="space-y-1">
                          {dayData.events.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`text-xs p-1 rounded cursor-pointer text-white ${
                                getEventTypeColor(event.event_type)
                              } hover:opacity-80`}
                            >
                              {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                            </div>
                          ))}
                          {dayData.events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayData.events.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No events found for this period</p>
                </div>
              ) : (
                events.map(event => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${getEventTypeColor(event.event_type)} text-white`}>
                              {event.event_type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(event.start_date).toLocaleDateString('en-US', { 
                                month: 'short', day: 'numeric' 
                              })}
                              {event.start_date !== event.end_date && 
                                ` - ${new Date(event.end_date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric' 
                                })}`
                              }
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h4>
                          <p className="text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        {event.image_url && (
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="w-24 h-24 object-cover rounded-lg ml-6"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Event Details Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className={`${getEventTypeColor(selectedEvent.event_type)} text-white p-6 rounded-t-3xl`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                      <div className="flex items-center text-white/90">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(selectedEvent.start_date).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                        {selectedEvent.start_date !== selectedEvent.end_date && 
                          ` - ${new Date(selectedEvent.end_date).toLocaleDateString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric' 
                          })}`
                        }
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedEvent(null)}
                      variant="outline"
                      className="text-white border-white hover:bg-white/20"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {selectedEvent.image_url && (
                    <img 
                      src={selectedEvent.image_url} 
                      alt={selectedEvent.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedEvent.location}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Significance</h4>
                      <p className="text-gray-600">{selectedEvent.significance}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.activities?.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Traditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.traditions?.map((tradition, index) => (
                        <Badge key={index} className="bg-amber-100 text-amber-800">
                          {tradition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedEvent.visitor_info && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">👥 Visitor Information</h4>
                      <p className="text-blue-700">{selectedEvent.visitor_info}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingSuccess = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-green-100">Your visit is successfully booked</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-semibold text-gray-800">{booking.id}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Monastery</p>
              <p className="font-semibold text-gray-800">{booking.monastery_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-800">{booking.visit_date}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-800">{booking.visit_time}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-600">Total Amount</p>
              <p className="font-bold text-xl text-amber-700">₹{booking.total_amount}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-600 font-medium mb-1">📧 Confirmation Details</p>
            <p className="text-sm text-gray-600">A confirmation email has been sent to {booking.visitor_email}</p>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [monasteries, setMonasteries] = useState([]);
  const [filteredMonasteries, setFilteredMonasteries] = useState([]);
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [tourMonastery, setTourMonastery] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showCulturalCalendar, setShowCulturalCalendar] = useState(false);
  const [showGlobalAIChat, setShowGlobalAIChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTradition, setSelectedTradition] = useState('');
  const [districts, setDistricts] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try to fetch from backend first
        const monasteryResponse = await axios.get(`${API}/monasteries`);
        setMonasteries(monasteryResponse.data);
        setFilteredMonasteries(monasteryResponse.data);
        
        // Fetch filter options
        const [districtsResponse, traditionsResponse] = await Promise.all([
          axios.get(`${API}/districts`),
          axios.get(`${API}/traditions`)
        ]);
        
        setDistricts(districtsResponse.data.districts);
        setTraditions(traditionsResponse.data.traditions);
      } catch (error) {
        console.log('Backend not available, using mock data');
        // Use mock data when backend is not available
        setMonasteries(MOCK_MONASTERIES);
        setFilteredMonasteries(MOCK_MONASTERIES);
        setDistricts(['East Sikkim', 'West Sikkim']);
        setTraditions(['Kagyu School of Tibetan Buddhism', 'Nyingma School of Tibetan Buddhism']);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    let filtered = monasteries;

    if (searchTerm) {
      filtered = filtered.filter(monastery =>
        monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monastery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monastery.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(monastery => monastery.district === selectedDistrict);
    }

    if (selectedTradition) {
      filtered = filtered.filter(monastery => monastery.tradition === selectedTradition);
    }

    setFilteredMonasteries(filtered);
  }, [searchTerm, selectedDistrict, selectedTradition, monasteries]);

  const handleStartTour = (monastery) => {
    setTourMonastery(monastery);
  };

  const handleLearnMore = (monastery) => {
    setSelectedMonastery(monastery);
  };

  const handleBookVisit = (monastery) => {
    setShowBookingForm(monastery);
  };

  if (tourMonastery) {
    return (
      <VirtualTourViewer 
        monastery={tourMonastery} 
        onClose={() => setTourMonastery(null)}
        onBookTour={() => {
          setShowBookingForm(tourMonastery);
        }}
      />
    );
  }

  if (selectedMonastery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
        <MonasteryDetails 
          monastery={selectedMonastery} 
          onClose={() => setSelectedMonastery(null)}
          onStartTour={handleStartTour}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading Sikkim monasteries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1687074106203-f3dad46d9eb6"
            alt="Sikkim Monastery with Himalayas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-48 h-48 bg-amber-400/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-bounce">
                🏛️ AI-Powered Heritage Experience
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Discover Sikkim's
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Sacred Monasteries
              </span>
            </h1>
            
            <p className="text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl">
              Explore mystical monasteries nestled in the Himalayas with our AI guide. Experience ancient Buddhist wisdom, stunning architecture, and spiritual tranquility through immersive virtual tours and intelligent conversations.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Camera className="w-6 h-6 mr-3" />
                Start Virtual Journey
              </Button>
              <Button
                onClick={() => {
                  // Scroll to monastery cards section for booking
                  const monasterySection = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
                  if (monasterySection) {
                    monasterySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Book Your Visit
              </Button>
              <Button 
                onClick={() => setShowCulturalCalendar(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Cultural Calendar
              </Button>
              <Button 
                onClick={() => setShowGlobalAIChat(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Bot className="w-6 h-6 mr-3" />
                Ask AI Guide
              </Button>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 inline mr-2" />
                AI-Powered Insights
              </div>
              <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                <Camera className="w-4 h-4 inline mr-2" />
                360° Virtual Tours
              </div>
              <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                <Mountain className="w-4 h-4 inline mr-2" />
                6 Sacred Sites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search monasteries, locations, or traditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Traditions</option>
                {traditions.map(tradition => (
                  <option key={tradition} value={tradition}>{tradition}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Booking Promotion Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-12 text-white text-center shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📅 Book Your Sacred Journey</h2>
            <p className="text-lg md:text-xl text-green-100 mb-6">
              Reserve your visit to Sikkim's ancient monasteries. Choose from self-guided tours (₹0), guided experiences (₹500), or spiritual sessions (₹300).
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3">
                <span className="font-semibold">🆓 Self-Guided Tours</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3">
                <span className="font-semibold">👨‍🏫 Expert Guided Tours</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3">
                <span className="font-semibold">🧘‍♂️ Spiritual Sessions</span>
              </div>
            </div>
            <p className="text-sm text-green-200 mt-4">
              💡 Hover over any monastery card below and click "Book Visit" to get started!
            </p>
          </div>
        </div>

        {/* Monasteries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMonasteries.map((monastery) => (
            <MonasteryCard
              key={monastery.id}
              monastery={monastery}
              onStartTour={handleStartTour}
              onLearnMore={handleLearnMore}
              onBookVisit={handleBookVisit}
            />
          ))}
        </div>

        {filteredMonasteries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No monasteries found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Sikkim Info Section */}
      <div className="bg-white/60 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Discover Sikkim's Buddhist Heritage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nestled in the Eastern Himalayas, Sikkim is home to some of the most sacred Buddhist monasteries, 
              each telling a unique story of faith, architecture, and cultural preservation.
            </p>
          </div>
        </div>
      </div>
      
      {/* Cultural Calendar Modal */}
      {showCulturalCalendar && (
        <CulturalCalendar onClose={() => setShowCulturalCalendar(false)} />
      )}
      
      {/* Global AI Chat Modal */}
      {showGlobalAIChat && (
        <GlobalAIChat onClose={() => setShowGlobalAIChat(false)} />
      )}
      
      {/* Booking Form Modal - Higher z-index for visibility over virtual tour */}
      {showBookingForm && (
        <div className="fixed inset-0 z-[60]">
          <BookingForm
            monastery={showBookingForm}
            onClose={() => setShowBookingForm(null)}
            onBookingSuccess={(booking) => {
              setShowBookingForm(null);
              setBookingSuccess(booking);
            }}
          />
        </div>
      )}
      
      {/* Booking Success Modal - Highest z-index */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-[70]">
          <BookingSuccess
            booking={bookingSuccess}
            onClose={() => setBookingSuccess(null)}
          />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;