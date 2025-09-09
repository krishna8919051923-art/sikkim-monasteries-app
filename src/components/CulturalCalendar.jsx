import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Star, 
  Camera, 
  Music, 
  Heart, 
  Share2,
  Filter,
  Search,
  Bell,
  Gift,
  Sparkles,
  Crown,
  Mountain,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Calendar localization
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Sample festival and event data
const festivalEvents = [
  {
    id: 'f001',
    title: 'Losar (Tibetan New Year)',
    monastery: 'Rumtek Monastery',
    date: new Date(2024, 1, 18), // February 18, 2024
    endDate: new Date(2024, 1, 20),
    duration: '3 days',
    time: '6:00 AM - 8:00 PM',
    category: 'Major Festival',
    description: 'The most important celebration in Tibetan Buddhism marking the beginning of the new year with prayers, rituals, and traditional performances.',
    significance: 'Celebrates new beginnings, purification, and spiritual renewal according to the Tibetan lunar calendar.',
    activities: [
      'Cham Dance Performances',
      'Butter Lamp Lighting Ceremony', 
      'Traditional Tibetan Music',
      'Community Feast',
      'Prayer Flag Raising'
    ],
    pricing: {
      local: 0,
      tourist: 500,
      premium: 1500
    },
    maxParticipants: 200,
    currentBookings: 45,
    requirements: 'Respectful attire required. Photography permitted in designated areas only.',
    contact: {
      phone: '+91-3592-252102',
      email: 'events@rumtek.org'
    },
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    highlights: ['Traditional Dances', 'Sacred Rituals', 'Cultural Performance', 'Community Gathering']
  },
  {
    id: 'f002',
    title: 'Saga Dawa Festival',
    monastery: 'Tashiding Monastery',
    date: new Date(2024, 4, 23), // May 23, 2024
    endDate: new Date(2024, 4, 23),
    duration: '1 day',
    time: '4:00 AM - 6:00 PM',
    category: 'Sacred Festival',
    description: 'Celebrates the birth, enlightenment, and death of Buddha. The most sacred day in the Buddhist calendar.',
    significance: 'Merit accumulated on this day is multiplied by 100,000 times according to Buddhist belief.',
    activities: [
      'Dawn Prayer Ceremony',
      'Circumambulation of Sacred Sites',
      'Merit Accumulation Activities',
      'Meditation Sessions',
      'Dharma Teachings'
    ],
    pricing: {
      local: 0,
      tourist: 300,
      premium: 800
    },
    maxParticipants: 150,
    currentBookings: 78,
    requirements: 'Early morning start. Comfortable walking shoes recommended for circumambulation.',
    contact: {
      phone: '+91-3595-250345',
      email: 'info@tashiding.org'
    },
    images: ['https://images.unsplash.com/photo-1633538028057-838fd4e027a4'],
    highlights: ['Sacred Merit Day', 'Dawn Prayers', 'Pilgrimage Walk', 'Dharma Teachings']
  },
  {
    id: 'f003',
    title: 'Chaam Dance Festival',
    monastery: 'Pemayangtse Monastery',
    date: new Date(2024, 2, 15), // March 15, 2024
    endDate: new Date(2024, 2, 16),
    duration: '2 days',
    time: '10:00 AM - 5:00 PM',
    category: 'Cultural Performance',
    description: 'Sacred masked dance festival featuring elaborate costumes and traditional choreography representing the victory of good over evil.',
    significance: 'Ancient ritual dance that drives away evil spirits and brings blessings for the coming year.',
    activities: [
      'Masked Dance Performances',
      'Traditional Music',
      'Costume Exhibition',
      'Cultural Workshops',
      'Local Craft Fair'
    ],
    pricing: {
      local: 100,
      tourist: 750,
      premium: 2000
    },
    maxParticipants: 300,
    currentBookings: 156,
    requirements: 'Photography fees apply. Advance booking recommended for premium seating.',
    contact: {
      phone: '+91-3595-250268',
      email: 'festival@pemayangtse.org'
    },
    images: ['https://images.unsplash.com/photo-1634308670152-17f7f1aa4e79'],
    highlights: ['Sacred Dances', 'Traditional Costumes', 'Cultural Immersion', 'Photography Opportunities']
  },
  {
    id: 'f004',
    title: 'Bhumchu Festival',
    monastery: 'Tashiding Monastery',
    date: new Date(2024, 1, 25), // February 25, 2024
    endDate: new Date(2024, 1, 25),
    duration: '1 day',
    time: '6:00 AM - 12:00 PM',
    category: 'Sacred Ritual',
    description: 'Holy water ceremony where sacred vase is opened to predict the year ahead. One of Sikkim\'s most important festivals.',
    significance: 'The water level in the sacred vase predicts fortune, weather, and harvests for the year.',
    activities: [
      'Sacred Vase Opening Ceremony',
      'Holy Water Distribution',
      'Fortune Predictions',
      'Community Prayers',
      'Blessing Rituals'
    ],
    pricing: {
      local: 0,
      tourist: 250,
      premium: 600
    },
    maxParticipants: 100,
    currentBookings: 87,
    requirements: 'Sacred ceremony with limited capacity. Respectful silence during rituals.',
    contact: {
      phone: '+91-3595-250345',
      email: 'bhumchu@tashiding.org'
    },
    images: ['https://images.unsplash.com/photo-1633538028057-838fd4e027a4'],
    highlights: ['Sacred Prophecy', 'Holy Water Blessing', 'Unique Tradition', 'Limited Access']
  },
  {
    id: 'f005',
    title: 'Medicine Buddha Puja',
    monastery: 'Enchey Monastery',
    date: new Date(2024, 3, 20), // April 20, 2024
    endDate: new Date(2024, 3, 20),
    duration: '1 day',
    time: '7:00 AM - 11:00 AM',
    category: 'Healing Ceremony',
    description: 'Special healing ceremony dedicated to Medicine Buddha for health and wellbeing of all beings.',
    significance: 'Powerful healing ritual believed to bring physical and spiritual healing to participants.',
    activities: [
      'Medicine Buddha Prayers',
      'Healing Mantras',
      'Blessed Medicine Distribution',
      'Individual Blessings',
      'Meditation Session'
    ],
    pricing: {
      local: 50,
      tourist: 400,
      premium: 1000
    },
    maxParticipants: 80,
    currentBookings: 23,
    requirements: 'Bring water bottle for blessed water. Meditation experience helpful.',
    contact: {
      phone: '+91-3592-252087',
      email: 'healing@enchey.org'
    },
    images: ['https://images.unsplash.com/photo-1543341724-c6f823532cac'],
    highlights: ['Healing Ritual', 'Blessed Medicine', 'Personal Blessings', 'Wellness Focus']
  }
];

// Event Card Component
const EventCard = ({ event, onBook, onLearnMore }) => {
  const availableSpots = event.maxParticipants - event.currentBookings;
  const isAlmostFull = availableSpots <= 20;
  const isFull = availableSpots <= 0;
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Major Festival': return 'bg-purple-100 text-purple-800';
      case 'Sacred Festival': return 'bg-amber-100 text-amber-800';
      case 'Cultural Performance': return 'bg-blue-100 text-blue-800';
      case 'Sacred Ritual': return 'bg-red-100 text-red-800';
      case 'Healing Ceremony': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img 
          src={event.images[0]} 
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(event.category)} shadow-lg`}>
            {event.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          {isAlmostFull && !isFull && (
            <Badge className="bg-orange-100 text-orange-800 shadow-lg">
              <AlertCircle className="w-3 h-3 mr-1" />
              Almost Full
            </Badge>
          )}
          {isFull && (
            <Badge className="bg-red-100 text-red-800 shadow-lg">
              <AlertCircle className="w-3 h-3 mr-1" />
              Fully Booked
            </Badge>
          )}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating date badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {format(event.date, 'dd')}
            </div>
            <div className="text-xs text-gray-600 font-semibold">
              {format(event.date, 'MMM')}
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2">
            {event.title}
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold text-amber-600">₹{event.pricing.tourist}</div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
        </div>
        <CardDescription className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            {event.monastery}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            {event.duration} • {event.time}
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
        
        {/* Highlights */}
        <div className="flex flex-wrap gap-1">
          {event.highlights.slice(0, 3).map((highlight, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
              {highlight}
            </Badge>
          ))}
          {event.highlights.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{event.highlights.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Booking info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{event.currentBookings}/{event.maxParticipants} booked</span>
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>{availableSpots} spots left</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              event.currentBookings / event.maxParticipants > 0.8 
                ? 'bg-red-500' 
                : event.currentBookings / event.maxParticipants > 0.6
                ? 'bg-orange-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${(event.currentBookings / event.maxParticipants) * 100}%` }}
          ></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={() => onBook(event)}
            disabled={isFull}
            className={`flex-1 ${
              isFull 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Ticket className="w-4 h-4 mr-2" />
            {isFull ? 'Fully Booked' : 'Book Now'}
          </Button>
          <Button 
            onClick={() => onLearnMore(event)}
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <Info className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Event Detail Dialog
const EventDetailDialog = ({ event, isOpen, onClose, onBook }) => {
  const [selectedPackage, setSelectedPackage] = useState('tourist');
  const [participantCount, setParticipantCount] = useState(1);
  
  if (!event) return null;
  
  const packages = [
    {
      id: 'local',
      name: 'Local Visitor',
      price: event.pricing.local,
      description: 'Basic access to all ceremonies and activities',
      includes: ['Event participation', 'Basic refreshments', 'Certificate of participation']
    },
    {
      id: 'tourist',
      name: 'Tourist Package',
      price: event.pricing.tourist,
      description: 'Enhanced experience with guided tours and cultural insights',
      includes: ['Event participation', 'English-speaking guide', 'Cultural briefing', 'Traditional lunch', 'Souvenir gift', 'Photo opportunities']
    },
    {
      id: 'premium',
      name: 'Premium Experience',
      price: event.pricing.premium,
      description: 'VIP access with exclusive interactions and premium services',
      includes: ['Priority seating', 'Personal guide', 'Meet monks & artisans', 'Exclusive photo access', 'Premium meals', 'Monastery blessing', 'Professional photos', 'Gift package']
    }
  ];
  
  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  const totalPrice = selectedPkg.price * participantCount;
  const availableSpots = event.maxParticipants - event.currentBookings;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {event.monastery} • {format(event.date, 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <img 
                src={event.images[0]} 
                alt={event.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800">
                {event.category}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">About This Festival</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Cultural Significance
                </h4>
                <p className="text-gray-700 text-sm">{event.significance}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Activities & Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.activities.map((activity, index) => (
                  <div key={index} className="flex items-center bg-blue-50 rounded-lg p-3">
                    <Star className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Event Schedule</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time} ({event.duration})
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.monastery}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                <p className="text-sm text-gray-600">{event.requirements}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {event.contact.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {event.contact.email}
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Book Your Experience</CardTitle>
                <CardDescription>
                  {availableSpots} spots remaining out of {event.maxParticipants}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Select Package</label>
                  <div className="space-y-2">
                    {packages.map((pkg) => (
                      <div 
                        key={pkg.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedPackage === pkg.id 
                            ? 'border-amber-400 bg-amber-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800">{pkg.name}</span>
                          <span className="text-lg font-bold text-amber-600">₹{pkg.price}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
                        <div className="text-xs text-gray-500">
                          Includes: {pkg.includes.slice(0, 2).join(', ')}
                          {pkg.includes.length > 2 && ` +${pkg.includes.length - 2} more`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Participant Count */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Number of Participants</label>
                  <Input
                    type="number"
                    min="1"
                    max={Math.min(10, availableSpots)}
                    value={participantCount}
                    onChange={(e) => setParticipantCount(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
                
                {/* Total Price */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Package ({selectedPkg.name})</span>
                    <span>₹{selectedPkg.price} x {participantCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>Total Amount</span>
                    <span className="text-amber-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Book Button */}
                <Button 
                  onClick={() => onBook(event, selectedPackage, participantCount)}
                  disabled={availableSpots === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  {availableSpots === 0 ? 'Fully Booked' : 'Book Now'}
                </Button>
                
                <div className="text-center">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Package Details */}
            {selectedPkg && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPkg.includes.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Cultural Calendar Component
const CulturalCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'calendar'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(festivalEvents);
  
  // Filter events
  useEffect(() => {
    let events = festivalEvents;
    
    if (filterCategory !== 'all') {
      events = events.filter(event => event.category === filterCategory);
    }
    
    if (searchTerm) {
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.monastery.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEvents(events);
  }, [filterCategory, searchTerm]);
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  
  const handleBook = (event, packageType = 'tourist', participants = 1) => {
    // In a real app, this would integrate with a booking system
    alert(`Booking confirmed for ${event.title}!\nPackage: ${packageType}\nParticipants: ${participants}\n\nYou will receive confirmation details shortly.`);
    setIsDetailOpen(false);
  };
  
  const categories = ['all', ...new Set(festivalEvents.map(event => event.category))];
  
  // Calendar events for react-big-calendar
  const calendarEvents = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    end: event.endDate || event.date,
    resource: event
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <CalendarIcon className="w-12 h-12 inline mr-4 text-purple-600" />
            Cultural Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join authentic Buddhist festivals and ceremonies at Sikkim's sacred monasteries. 
            Experience ancient traditions, participate in rituals, and connect with the spiritual 
            heritage of the Himalayas.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{festivalEvents.length}</div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{new Set(festivalEvents.map(e => e.monastery)).size}</div>
              <div className="text-sm text-gray-600">Sacred Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {festivalEvents.reduce((sum, event) => sum + (event.maxParticipants - event.currentBookings), 0)}
              </div>
              <div className="text-sm text-gray-600">Available Spots</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search festivals and ceremonies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  onClick={() => setView('grid')}
                  className={view === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Grid View
                </Button>
                <Button
                  variant={view === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setView('calendar')}
                  className={view === 'calendar' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Calendar View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {view === 'grid' ? (
          <div className="space-y-8">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onBook={(event) => handleBook(event)}
                    onLearnMore={handleEventSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or browse all events.</p>
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={(event) => handleEventSelect(event.resource)}
                  views={['month', 'week', 'day']}
                  popup
                  style={{ height: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Festivals */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Festivals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">Major Festivals</h3>
                <p className="text-purple-700 text-sm">
                  Grand celebrations marking important dates in the Buddhist calendar
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-0">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Sacred Rituals</h3>
                <p className="text-blue-700 text-sm">
                  Ancient ceremonies and blessings performed by monastery elders
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-0">
              <CardContent className="p-6 text-center">
                <Music className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-800 mb-2">Cultural Performances</h3>
                <p className="text-amber-700 text-sm">
                  Traditional dances, music, and artistic expressions of Buddhist culture
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Detail Dialog */}
        <EventDetailDialog
          event={selectedEvent}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onBook={handleBook}
        />
      </div>
    </div>
  );
};

export default CulturalCalendar;
