import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl, Source, Layer } from 'react-map-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Mountain, 
  Navigation, 
  Camera, 
  Clock, 
  Route,
  Star,
  Users,
  Compass,
  Maximize2,
  Bot,
  Car,
  Plane
} from 'lucide-react';

// Custom Monastery Marker Component
const MonasteryMarker = ({ monastery, onClick, isSelected, isHovered, onMouseEnter, onMouseLeave }) => {
  const getMarkerColor = (tradition) => {
    return tradition.includes('Nyingma') ? '#FF6B35' : '#4ECDC4';
  };

  const getMarkerSize = () => {
    if (isSelected) return 45;
    if (isHovered) return 40;
    return 35;
  };

  return (
    <Marker
      longitude={monastery.coordinates.lng}
      latitude={monastery.coordinates.lat}
      onClick={onClick}
    >
      <div 
        className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ 
          width: getMarkerSize(), 
          height: getMarkerSize() + 10 
        }}
      >
        {/* Pulsing background for selected/hovered */}
        {(isSelected || isHovered) && (
          <div 
            className="absolute top-0 left-0 rounded-full animate-ping"
            style={{
              width: getMarkerSize(),
              height: getMarkerSize(),
              backgroundColor: getMarkerColor(monastery.tradition),
              opacity: 0.3
            }}
          />
        )}
        
        {/* Main marker */}
        <div 
          className="relative flex items-center justify-center rounded-full shadow-lg border-3 border-white"
          style={{ 
            width: getMarkerSize(), 
            height: getMarkerSize(),
            backgroundColor: getMarkerColor(monastery.tradition)
          }}
        >
          {/* Monastery icon based on tradition */}
          <div className="text-white text-lg font-bold">
            {monastery.tradition.includes('Nyingma') ? '🕊️' : '☸️'}
          </div>
        </div>
        
        {/* Marker label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-md whitespace-nowrap">
          {monastery.name.split(' ')[0]}
        </div>
      </div>
    </Marker>
  );
};

// Travel Route Component
const TravelRoutes = ({ monasteries, selectedRoute }) => {
  // Generate sample routes between monasteries
  const generateRoute = (start, end) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [start.coordinates.lng, start.coordinates.lat],
        [end.coordinates.lng, end.coordinates.lat]
      ]
    }
  });

  const popularRoutes = [
    { 
      name: 'East Sikkim Spiritual Circuit',
      monasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Do-drul Chorten'],
      color: '#FF6B35',
      distance: '45 km',
      duration: '1 day'
    },
    { 
      name: 'West Sikkim Heritage Trail',
      monasteries: ['Pemayangtse Monastery', 'Tashiding Monastery', 'Khecheopalri Monastery'],
      color: '#4ECDC4',
      distance: '120 km',
      duration: '2-3 days'
    }
  ];

  if (!selectedRoute) return null;

  const routeMonasteries = monasteries.filter(m => 
    selectedRoute.monasteries.includes(m.name)
  );

  const routeData = {
    type: 'FeatureCollection',
    features: routeMonasteries.slice(0, -1).map((monastery, index) => 
      generateRoute(monastery, routeMonasteries[index + 1])
    )
  };

  const lineLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': selectedRoute.color,
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  return (
    <Source id="route" type="geojson" data={routeData}>
      <Layer {...lineLayer} />
    </Source>
  );
};

// Main Interactive Map Component
const InteractiveMap = ({ monasteries, onMonasterySelect, onStartTour, selectedMonastery }) => {
  const [viewState, setViewState] = useState({
    longitude: 88.5122,  // Center of Sikkim
    latitude: 27.5330,
    zoom: 9
  });
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [hoveredMonastery, setHoveredMonastery] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/satellite-v9');
  
  const mapRef = useRef();

  // Popular travel routes
  const popularRoutes = [
    { 
      name: 'East Sikkim Spiritual Circuit',
      monasteries: ['Rumtek Monastery', 'Enchey Monastery', 'Do-drul Chorten'],
      color: '#FF6B35',
      distance: '45 km',
      duration: '1 day',
      description: 'Explore the capital region\'s most important monasteries'
    },
    { 
      name: 'West Sikkim Heritage Trail',
      monasteries: ['Pemayangtse Monastery', 'Tashiding Monastery', 'Khecheopalri Monastery'],
      color: '#4ECDC4',
      distance: '120 km',
      duration: '2-3 days',
      description: 'Journey through ancient monasteries and sacred lakes'
    }
  ];

  // Fly to monastery location
  const flyToMonastery = useCallback((monastery) => {
    mapRef.current?.flyTo({
      center: [monastery.coordinates.lng, monastery.coordinates.lat],
      zoom: 14,
      duration: 2000
    });
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((monastery) => {
    setSelectedPopup(monastery);
    flyToMonastery(monastery);
    onMonasterySelect && onMonasterySelect(monastery);
  }, [flyToMonastery, onMonasterySelect]);

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const mapStyles = [
    { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
    { id: 'terrain', name: 'Terrain', url: 'mapbox://styles/mapbox/outdoors-v12' },
    { id: 'streets', name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' }
  ];

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'pk.your_mapbox_token_here'}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />
        <GeolocateControl 
          position="top-right"
          onGeolocate={(e) => setUserLocation([e.coords.longitude, e.coords.latitude])}
        />

        {/* Travel Routes */}
        {showRoutes && selectedRoute && (
          <TravelRoutes monasteries={monasteries} selectedRoute={selectedRoute} />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
          </Marker>
        )}

        {/* Monastery Markers */}
        {monasteries.map((monastery) => (
          <MonasteryMarker
            key={monastery.id}
            monastery={monastery}
            onClick={() => handleMarkerClick(monastery)}
            isSelected={selectedMonastery?.id === monastery.id}
            isHovered={hoveredMonastery?.id === monastery.id}
            onMouseEnter={() => setHoveredMonastery(monastery)}
            onMouseLeave={() => setHoveredMonastery(null)}
          />
        ))}

        {/* Popup for selected monastery */}
        {selectedPopup && (
          <Popup
            longitude={selectedPopup.coordinates.lng}
            latitude={selectedPopup.coordinates.lat}
            onClose={() => setSelectedPopup(null)}
            anchor="bottom"
            maxWidth="400px"
          >
            <Card className="border-0 shadow-none">
              <div className="relative">
                <img 
                  src={selectedPopup.main_image} 
                  alt={selectedPopup.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 right-2 bg-amber-600 text-white">
                  {selectedPopup.altitude}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedPopup.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedPopup.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedPopup.tradition.includes('Nyingma') ? '🕊️ Nyingma' : '☸️ Kagyu'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {selectedPopup.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{selectedPopup.visiting_hours}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{selectedPopup.entrance_fee}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    onClick={() => onStartTour && onStartTour(selectedPopup)}
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Virtual Tour
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => onMonasterySelect && onMonasterySelect(selectedPopup)}
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    Learn More
                  </Button>
                </div>
                
                {/* Travel distance (if user location is available) */}
                {userLocation && (
                  <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700">
                    <div className="flex items-center">
                      <Navigation className="w-3 h-3 mr-1" />
                      Approximately {
                        Math.round(
                          Math.sqrt(
                            Math.pow((selectedPopup.coordinates.lng - userLocation[0]) * 111, 2) +
                            Math.pow((selectedPopup.coordinates.lat - userLocation[1]) * 111, 2)
                          )
                        )
                      } km from your location
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 space-y-3">
        {/* Map Style Selector */}
        <Card className="w-64 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Maximize2 className="w-4 h-4 mr-2" />
              Map Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Map Style</label>
              <select 
                value={mapStyles.find(s => s.url === mapStyle)?.id || 'satellite'}
                onChange={(e) => {
                  const selected = mapStyles.find(s => s.id === e.target.value);
                  setMapStyle(selected.url);
                }}
                className="w-full p-2 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {mapStyles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Travel Routes</span>
              <Button
                size="sm"
                variant={showRoutes ? "default" : "outline"}
                onClick={() => setShowRoutes(!showRoutes)}
                className={showRoutes ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                <Route className="w-3 h-3 mr-1" />
                {showRoutes ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Travel Routes Panel */}
        {showRoutes && (
          <Card className="w-64 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Route className="w-4 h-4 mr-2" />
                Popular Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {popularRoutes.map((route, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRoute?.name === route.name 
                      ? 'border-amber-300 bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRoute(selectedRoute?.name === route.name ? null : route)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-xs text-gray-800">{route.name}</h4>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{route.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Car className="w-3 h-3 mr-1" />
                      {route.distance}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {route.duration}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">🕊️</div>
                <span>Nyingma Monastery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs">☸️</div>
                <span>Kagyu Monastery</span>
              </div>
              {userLocation && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
                  <span>Your Location</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="absolute top-4 right-4">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gray-800">{monasteries.length}</div>
              <div className="text-xs text-gray-600">Sacred Monasteries</div>
            </div>
            <div className="flex justify-around mt-3 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-600">
                  {monasteries.filter(m => m.tradition.includes('Nyingma')).length}
                </div>
                <div className="text-xs text-gray-500">Nyingma</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-teal-600">
                  {monasteries.filter(m => m.tradition.includes('Kagyu')).length}
                </div>
                <div className="text-xs text-gray-500">Kagyu</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMap;
