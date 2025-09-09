import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { TextureLoader, SphereGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Navigation, 
  Star, 
  MapPin, 
  Volume2,
  VolumeX,
  Info,
  Camera,
  Move3D
} from 'lucide-react';

// 360° Panoramic Sphere Component
function PanoramicSphere({ imageUrl, hotspots = [], onHotspotClick }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Flip texture horizontally for correct 360° view
  texture.wrapS = texture.wrapT = 1000;
  texture.repeat.set(-1, 1);
  
  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} />
      
      {/* Interactive Hotspots */}
      {hotspots.map((hotspot, index) => (
        <HotspotMarker
          key={index}
          position={hotspot.position}
          title={hotspot.title}
          description={hotspot.description}
          type={hotspot.type}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}
    </mesh>
  );
}

// Interactive Hotspot Markers
function HotspotMarker({ position, title, description, type, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
      // Pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  const getHotspotColor = (type) => {
    switch (type) {
      case 'prayer_hall': return '#FF6B35';
      case 'altar': return '#F7931E';
      case 'meditation': return '#4ECDC4';
      case 'architecture': return '#45B7D1';
      case 'artifact': return '#96CEB4';
      default: return '#FF6B35';
    }
  };
  
  const getHotspotIcon = (type) => {
    switch (type) {
      case 'prayer_hall': return '🙏';
      case 'altar': return '⛩️';
      case 'meditation': return '🧘';
      case 'architecture': return '🏛️';
      case 'artifact': return '🎨';
      default: return '📍';
    }
  };
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[2, 16]} />
        <meshBasicMaterial 
          color={getHotspotColor(type)} 
          transparent 
          opacity={hovered ? 0.9 : 0.7} 
        />
      </mesh>
      
      {/* Hotspot Label */}
      <Html center>
        <div className={`
          bg-white rounded-lg shadow-lg p-3 min-w-[120px] text-center transition-all duration-300
          ${hovered ? 'opacity-100 scale-110' : 'opacity-90 scale-100'}
        `}>
          <div className="text-2xl mb-1">{getHotspotIcon(type)}</div>
          <div className="font-bold text-sm text-gray-800">{title}</div>
          {description && (
            <div className="text-xs text-gray-600 mt-1">{description}</div>
          )}
        </div>
      </Html>
      
      {/* Outer ring animation */}
      <mesh position={[0, 0, -0.1]}>
        <ringGeometry args={[2.5, 3.5, 16]} />
        <meshBasicMaterial 
          color={getHotspotColor(type)} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
}

// Audio Narration Component
function AudioNarration({ audioUrl, isPlaying, onToggle }) {
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  return (
    <div className="flex items-center space-x-2">
      <audio ref={audioRef} src={audioUrl} loop />
      <Button
        onClick={onToggle}
        size="sm"
        variant="outline"
        className="text-white border-white hover:bg-white/20"
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
      <span className="text-white text-sm">
        {isPlaying ? 'Audio Guide Playing' : 'Play Audio Guide'}
      </span>
    </div>
  );
}

// Enhanced 360° Viewer Component
const Enhanced360Viewer = ({ monastery, images, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [viewerMode, setViewerMode] = useState('explore'); // 'explore', 'guided', 'focus'
  const controlsRef = useRef();
  
  // Sample hotspots for each monastery image
  const generateHotspots = (monastery, imageIndex) => {
    const baseHotspots = [
      {
        position: new Vector3(-100, 50, 200),
        title: 'Prayer Hall',
        description: 'Main worship area with ancient murals',
        type: 'prayer_hall'
      },
      {
        position: new Vector3(150, 20, -100),
        title: 'Sacred Altar',
        description: 'Central Buddha statue and offerings',
        type: 'altar'
      },
      {
        position: new Vector3(-50, -30, -200),
        title: 'Meditation Area',
        description: 'Peaceful space for contemplation',
        type: 'meditation'
      },
      {
        position: new Vector3(200, 100, 50),
        title: 'Traditional Architecture',
        description: 'Intricate woodwork and decorative elements',
        type: 'architecture'
      }
    ];
    
    return baseHotspots;
  };
  
  const currentHotspots = generateHotspots(monastery, currentImageIndex);
  
  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
    // You could trigger audio narration or show detailed information
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setSelectedHotspot(null);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setSelectedHotspot(null);
  };
  
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case ' ':
          e.preventDefault();
          setIsAudioPlaying(!isAudioPlaying);
          break;
        case 'r':
        case 'R':
          resetCamera();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAudioPlaying, onClose]);
  
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{monastery.name}</h1>
              <p className="text-amber-200">{monastery.location} • 360° Virtual Experience</p>
            </div>
            
            {/* Audio Controls */}
            <AudioNarration
              audioUrl="/audio/monastery-guide.mp3" // You would add actual audio files
              isPlaying={isAudioPlaying}
              onToggle={() => setIsAudioPlaying(!isAudioPlaying)}
            />
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={prevImage}
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              disabled={currentImageIndex === 0}
            >
              ← Previous
            </Button>
            
            <Badge className="bg-white/20 text-white border-white/30">
              {currentImageIndex + 1} / {images.length}
            </Badge>
            
            <Button
              onClick={nextImage}
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              disabled={currentImageIndex === images.length - 1}
            >
              Next →
            </Button>
            
            <Button
              onClick={resetCamera}
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PanoramicSphere
            imageUrl={images[currentImageIndex]}
            hotspots={currentHotspots}
            onHotspotClick={handleHotspotClick}
          />
          
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={400}
            autoRotate={viewerMode === 'guided'}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Hotspot Information Panel */}
      {selectedHotspot && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{selectedHotspot.type === 'prayer_hall' ? '🙏' : 
                                      selectedHotspot.type === 'altar' ? '⛩️' :
                                      selectedHotspot.type === 'meditation' ? '🧘' : '🏛️'}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedHotspot.title}</h3>
                  <p className="text-gray-600">{selectedHotspot.description}</p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedHotspot(null)}
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">About This Sacred Space</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                This area represents an important aspect of {monastery.tradition} practice, 
                showcasing centuries-old traditions and architectural mastery that continues 
                to inspire visitors and practitioners today.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => setIsAudioPlaying(true)}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Listen to Guide
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-gray-600 border-gray-300"
                onClick={() => setSelectedHotspot(null)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Continue Exploring
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tour Mode Selector */}
      <div className="absolute top-24 right-6 z-10">
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 space-y-2">
          <div className="text-white text-sm font-semibold mb-2">Tour Mode</div>
          {[
            { mode: 'explore', icon: Move3D, label: 'Free Explore' },
            { mode: 'guided', icon: Navigation, label: 'Auto Guided' },
            { mode: 'focus', icon: Star, label: 'Focus Mode' }
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              size="sm"
              variant={viewerMode === mode ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                viewerMode === mode 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => setViewerMode(mode)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white text-sm space-y-1">
          <div className="flex items-center space-x-4">
            <span><Move3D className="w-4 h-4 inline mr-1" />Drag to look around</span>
            <span><ZoomIn className="w-4 h-4 inline mr-1" />Scroll to zoom</span>
            <span><Star className="w-4 h-4 inline mr-1" />Click hotspots</span>
          </div>
          <div className="text-amber-300 text-xs">
            ESC: Exit | ← →: Navigate | Space: Audio | R: Reset view
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enhanced360Viewer;
