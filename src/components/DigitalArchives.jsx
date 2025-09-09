import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Image, 
  FileText, 
  Calendar, 
  Tag, 
  Eye, 
  Download, 
  Share2, 
  Heart, 
  Star,
  Palette,
  Scroll,
  Crown,
  Feather,
  Archive,
  Bookmark,
  ZoomIn,
  Info,
  ExternalLink,
  PlayCircle,
  Volume2
} from 'lucide-react';

// Sample archive data - in real app this would come from backend
const archiveData = {
  manuscripts: [
    {
      id: 'ms001',
      title: 'Prajnaparamita Sutra (Heart Sutra)',
      description: 'Ancient Sanskrit manuscript from Rumtek Monastery, written on palm leaves with gold ink',
      monastery: 'Rumtek Monastery',
      period: '12th Century',
      language: 'Sanskrit',
      material: 'Palm leaf with gold ink',
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'],
      category: 'Buddhist Texts',
      rarity: 'Extremely Rare',
      condition: 'Well Preserved',
      significance: 'One of the most important Buddhist texts, this manuscript represents centuries of scholarly tradition in Sikkim.',
      digitizationDate: '2023-08-15',
      tags: ['Buddhism', 'Sanskrit', 'Philosophy', 'Ancient', 'Sacred Text']
    },
    {
      id: 'ms002',
      title: 'Padmasambhava Life Stories',
      description: 'Tibetan manuscript detailing the life and teachings of Guru Rinpoche',
      monastery: 'Pemayangtse Monastery',
      period: '15th Century',
      language: 'Classical Tibetan',
      material: 'Handmade paper with natural pigments',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
      category: 'Biographical Texts',
      rarity: 'Rare',
      condition: 'Good',
      significance: 'Chronicles the sacred biography of Padmasambhava, founder of Tibetan Buddhism.',
      digitizationDate: '2023-07-20',
      tags: ['Padmasambhava', 'Biography', 'Tibetan', 'Nyingma', 'History']
    },
    {
      id: 'ms003',
      title: 'Meditation Instructions Manual',
      description: 'Detailed guide for advanced meditation practices, handwritten by monastery abbots',
      monastery: 'Tashiding Monastery',
      period: '17th Century',
      language: 'Classical Tibetan',
      material: 'Bark paper with black ink',
      images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570'],
      category: 'Practice Manuals',
      rarity: 'Uncommon',
      condition: 'Fair',
      significance: 'Contains unique meditation techniques specific to Sikkim Buddhist tradition.',
      digitizationDate: '2023-09-10',
      tags: ['Meditation', 'Practice', 'Instructions', 'Tibetan Buddhism', 'Spirituality']
    }
  ],
  murals: [
    {
      id: 'mural001',
      title: 'Wheel of Life (Bhavachakra)',
      description: 'Intricate mural depicting the Buddhist cycle of existence, painted on monastery walls',
      monastery: 'Rumtek Monastery',
      period: '18th Century',
      artist: 'Monastery Artisan Guild',
      material: 'Natural pigments on plaster',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
      category: 'Religious Art',
      style: 'Tibetan Traditional',
      condition: 'Excellent',
      significance: 'Masterpiece of Tibetan Buddhist art, illustrating the cycle of samsara.',
      dimensions: '3m x 4m',
      tags: ['Wheel of Life', 'Samsara', 'Buddhist Art', 'Tibetan Style', 'Philosophy']
    },
    {
      id: 'mural002',
      title: 'Medicine Buddha Mandala',
      description: 'Healing mandala featuring Medicine Buddha surrounded by healing deities',
      monastery: 'Enchey Monastery',
      period: '19th Century',
      artist: 'Lama Tenzin Norbu',
      material: 'Mineral pigments on canvas',
      images: ['https://images.unsplash.com/photo-1578928002421-d4fe0b5a3aa9'],
      category: 'Healing Art',
      style: 'Kagyu Tradition',
      condition: 'Good',
      significance: 'Used in healing rituals and meditation practices for centuries.',
      dimensions: '2m x 2m',
      tags: ['Medicine Buddha', 'Healing', 'Mandala', 'Meditation', 'Spiritual Art']
    }
  ],
  artifacts: [
    {
      id: 'art001',
      title: 'Ritual Prayer Wheel',
      description: 'Ancient copper prayer wheel with mantras inscribed inside',
      monastery: 'Do-drul Chorten',
      period: '16th Century',
      material: 'Copper, silver inlay, yak leather',
      images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa'],
      category: 'Ritual Objects',
      condition: 'Excellent',
      significance: 'Contains over 10,000 written mantras, believed to bring spiritual merit.',
      dimensions: '30cm height, 15cm diameter',
      tags: ['Prayer Wheel', 'Mantras', 'Ritual', 'Copper', 'Sacred Object']
    },
    {
      id: 'art002',
      title: 'Ceremonial Thangka of Tara',
      description: 'Silk thangka painting of Green Tara, used in special ceremonies',
      monastery: 'Khecheopalri Monastery',
      period: '18th Century',
      artist: 'Master Thangka Painter Norbu Wangyal',
      material: 'Silk fabric, natural pigments, gold leaf',
      images: ['https://images.unsplash.com/photo-1602904715726-efe7c5e7b2d6'],
      category: 'Sacred Paintings',
      style: 'Classical Tibetan',
      condition: 'Very Good',
      significance: 'Masterwork of thangka art, used in Green Tara empowerments.',
      dimensions: '120cm x 80cm',
      tags: ['Thangka', 'Green Tara', 'Silk Painting', 'Ceremony', 'Buddhist Art']
    }
  ]
};

// Archive Item Card Component
const ArchiveItemCard = ({ item, type, onView }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Extremely Rare': return 'bg-red-100 text-red-800 border-red-200';
      case 'Rare': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Uncommon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Very Good': 
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'manuscripts': return <BookOpen className="w-4 h-4" />;
      case 'murals': return <Palette className="w-4 h-4" />;
      case 'artifacts': return <Crown className="w-4 h-4" />;
      default: return <Archive className="w-4 h-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
      <div className="relative">
        <img 
          src={item.images[0]} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getRarityColor(item.rarity || item.condition)} shadow-sm`}>
            {item.rarity || item.condition}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm">
            {getTypeIcon(type)}
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-t-lg">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              onClick={() => onView(item)}
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-amber-700 transition-colors">
            {item.title}
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {item.period || item.artist}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm">
          <Star className="w-3 h-3 mr-1 text-amber-500" />
          {item.monastery}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          {item.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {item.language || item.material}
          </span>
          <span className="flex items-center">
            <Archive className="w-3 h-3 mr-1" />
            {type.charAt(0).toUpperCase() + type.slice(1, -1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Detailed Archive View Dialog
const ArchiveDetailDialog = ({ item, type, isOpen, onClose }) => {
  if (!item) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {item.monastery} • {item.period}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={item.images[0]} 
                alt={item.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button size="sm" className="bg-black/60 hover:bg-black/80 text-white">
                  <ZoomIn className="w-4 h-4 mr-1" />
                  Zoom
                </Button>
                <Button size="sm" className="bg-black/60 hover:bg-black/80 text-white">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Historical Significance</h3>
              <p className="text-gray-700 leading-relaxed">{item.significance}</p>
            </div>
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Period</label>
                  <p className="text-gray-800">{item.period}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Language/Artist</label>
                  <p className="text-gray-800">{item.language || item.artist}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Material</label>
                  <p className="text-gray-800">{item.material}</p>
                </div>
                {item.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dimensions</label>
                    <p className="text-gray-800">{item.dimensions}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Condition</label>
                  <Badge className={`${item.condition === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.condition}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-800">{item.category}</p>
                </div>
                {item.rarity && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rarity</label>
                    <Badge className="bg-amber-100 text-amber-800">
                      {item.rarity}
                    </Badge>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Digitized</label>
                  <p className="text-gray-800">{item.digitizationDate}</p>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Related Information */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Visit the Monastery
              </h4>
              <p className="text-sm text-gray-700">
                This artifact is housed at {item.monastery}. Plan your visit to experience 
                the rich cultural heritage in person.
              </p>
              <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                <ExternalLink className="w-3 h-3 mr-1" />
                View Monastery Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Digital Archives Component
const DigitalArchives = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  // Combine all archive data
  const allItems = [
    ...archiveData.manuscripts.map(item => ({ ...item, type: 'manuscripts' })),
    ...archiveData.murals.map(item => ({ ...item, type: 'murals' })),
    ...archiveData.artifacts.map(item => ({ ...item, type: 'artifacts' }))
  ];

  // Filter items based on search and filters
  useEffect(() => {
    let items = allItems;

    // Filter by tab
    if (activeTab !== 'all') {
      items = items.filter(item => item.type === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.monastery.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by period
    if (selectedPeriod !== 'all') {
      items = items.filter(item => item.period.includes(selectedPeriod));
    }

    setFilteredItems(items);
  }, [activeTab, searchTerm, selectedCategory, selectedPeriod]);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const categories = ['all', ...new Set(allItems.map(item => item.category))];
  const periods = ['all', '12th Century', '15th Century', '16th Century', '17th Century', '18th Century', '19th Century'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <Archive className="w-12 h-12 inline mr-4 text-amber-600" />
            Digital Archives
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of sacred manuscripts, ancient murals, 
            and precious artifacts from Sikkim's monastery heritage, digitally preserved 
            for future generations.
          </p>
          
          {/* Statistics */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{archiveData.manuscripts.length}</div>
              <div className="text-sm text-gray-600">Manuscripts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{archiveData.murals.length}</div>
              <div className="text-sm text-gray-600">Murals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{archiveData.artifacts.length}</div>
              <div className="text-sm text-gray-600">Artifacts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{allItems.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search manuscripts, murals, artifacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Periods</option>
                  {periods.slice(1).map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="flex items-center">
              <Archive className="w-4 h-4 mr-2" />
              All ({allItems.length})
            </TabsTrigger>
            <TabsTrigger value="manuscripts" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Manuscripts ({archiveData.manuscripts.length})
            </TabsTrigger>
            <TabsTrigger value="murals" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Murals ({archiveData.murals.length})
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Artifacts ({archiveData.artifacts.length})
            </TabsTrigger>
          </TabsList>

          {/* Results */}
          <div className="mt-8">
            {filteredItems.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Sort by relevance</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <ArchiveItemCard
                      key={item.id}
                      item={item}
                      type={item.type}
                      onView={handleViewItem}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or browse all collections.</p>
              </div>
            )}
          </div>
        </Tabs>

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-0">
              <CardContent className="p-6 text-center">
                <Scroll className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-800 mb-2">Ancient Manuscripts</h3>
                <p className="text-amber-700 text-sm">
                  Rare Buddhist texts and teachings preserved on palm leaves and traditional paper
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-0">
              <CardContent className="p-6 text-center">
                <Palette className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Sacred Art</h3>
                <p className="text-blue-700 text-sm">
                  Intricate murals and thangka paintings showcasing Tibetan Buddhist artistic traditions
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">Ritual Objects</h3>
                <p className="text-purple-700 text-sm">
                  Sacred artifacts and ceremonial items used in Buddhist practices and rituals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detail Dialog */}
        <ArchiveDetailDialog
          item={selectedItem}
          type={selectedItem?.type}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      </div>
    </div>
  );
};

export default DigitalArchives;
