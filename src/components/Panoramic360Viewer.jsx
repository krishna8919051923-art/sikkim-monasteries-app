import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { TextureLoader, BackSide, Vector3 } from 'three';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Move, Navigation, MapPin, Star, Maximize2, Home, Camera, Eye, Compass } from 'lucide-react';

// 360° Sphere Component
const PanoramaSphere = ({ imageUrl, hotspots = [], onHotspotClick }) => {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, imageUrl);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle auto-rotation when not being controlled
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[50, 60, 40]} />
        <meshBasicMaterial map={texture} side={BackSide} />
      </mesh>
      
      {/* Render hotspots as 3D elements */}
      {hotspots.map((hotspot, index) => (
        <Hotspot3D
          key={index}
          position={hotspot.position}
          title={hotspot.title}
          description={hotspot.description}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}
    </group>
  );
};

// 3D Hotspot Component
const Hotspot3D = ({ position, title, description, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Make hotspot pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? "#f59e0b" : "#ea580c"} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={15}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm max-w-48">
            <div className="font-semibold">{title}</div>
            {description && <div className="text-xs opacity-80">{description}</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Loading Component
const Loading = () => (
  <Html center>
    <div className="bg-black/80 text-white px-4 py-3 rounded-lg flex items-center space-x-3">
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Loading 360° Experience...</span>
    </div>
  </Html>
);

// Main Panoramic 360° Viewer Component
const Panoramic360Viewer = ({ images = [], currentImageIndex = 0, onClose, onImageChange, monastery }) => {
  const [controls, setControls] = useState(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [viewMode, setViewMode] = useState('explore'); // 'explore', 'guided'
  
  const currentImage = images[currentImageIndex];
  
  // Generate monastery-specific hotspots based on monastery data
  const generateHotspots = () => {
    if (!monastery) return [];
    
    const baseHotspots = [
      {
        position: new Vector3(25, 2, 35),
        title: "Main Prayer Hall",
        description: "Sacred space for meditation and prayer",
        icon: "🏛️",
        details: `The main prayer hall of ${monastery.name} features traditional ${monastery.tradition} architecture with intricate murals and sacred statues. Founded in ${monastery.founded}, this space embodies centuries of Buddhist devotion.`
      },
      {
        position: new Vector3(-30, 0, 25),
        title: "Sacred Altar",
        description: `Central shrine of ${monastery.tradition}`,
        icon: "🧘",
        details: `The sacred altar houses precious Buddha statues and ritual objects. This ${monastery.tradition} monastery's altar reflects the spiritual heritage of ${monastery.location}.`
      },
      {
        position: new Vector3(0, 12, -45),
        title: `${monastery.location} Views`,
        description: `Panoramic vista at ${monastery.altitude}`,
        icon: "🏔️",
        details: `Breathtaking panoramic view of ${monastery.location} and surrounding Himalayan landscape. The monastery's elevated position at ${monastery.altitude} offers stunning vistas of Sikkim's natural beauty.`
      },
      {
        position: new Vector3(-20, -5, -30),
        title: monastery.highlights[0] || "Sacred Space",
        description: "Important monastery feature",
        icon: "⭐",
        details: `${monastery.highlights[0]} is one of the distinctive features of ${monastery.name}. ${monastery.cultural_importance}`
      }
    ];
    
    // Add monastery-specific hotspots based on name
    if (monastery.name.includes('Rumtek')) {
      baseHotspots.push({
        position: new Vector3(40, -8, 15),
        title: "Golden Stupa",
        description: "Iconic golden stupa of Rumtek",
        icon: "🏮",
        details: "The magnificent golden stupa is the centerpiece of Rumtek Monastery, representing the enlightened mind of Buddha and serving as a focal point for circumambulation and prayer."
      });
    } else if (monastery.name.includes('Do-drul')) {
      baseHotspots.push({
        position: new Vector3(30, -12, 25),
        title: "108 Prayer Wheels",
        description: "Sacred prayer wheels",
        icon: "☸️",
        details: "The 108 prayer wheels surrounding the stupa contain millions of mantras. Spinning these wheels is believed to generate the same spiritual benefit as reciting the mantras."
      });
    } else if (monastery.name.includes('Khecheopalri')) {
      baseHotspots.push({
        position: new Vector3(-35, 5, 20),
        title: "Sacred Lake View",
        description: "View of Wishing Lake",
        icon: "🌊",
        details: "The sacred Khecheopalri Lake, known as the Wishing Lake, is considered highly sacred by both Buddhists and Hindus. Legend says the lake fulfills the wishes of devotees."
      });
    } else {
      baseHotspots.push({
        position: new Vector3(35, -10, 20),
        title: "Prayer Wheels",
        description: "Traditional prayer wheels",
        icon: "☸️",
        details: "Traditional Tibetan prayer wheels containing sacred mantras, spun by devotees for spiritual merit and blessings."
      });
    }
    
    return baseHotspots;
  };

  const hotspots = generateHotspots();

  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
    if (controls) {
      controls.autoRotate = false;
      setIsAutoRotate(false);
    }
  };

  const resetView = () => {
    if (controls) {
      controls.reset();
      controls.autoRotate = true;
      setIsAutoRotate(true);
    }
    setSelectedHotspot(null);
  };

  const toggleAutoRotate = () => {
    if (controls) {
      controls.autoRotate = !isAutoRotate;
      setIsAutoRotate(!isAutoRotate);
    }
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'r':
      case 'R':
        resetView();
        break;
      case 'ArrowLeft':
        if (currentImageIndex > 0) onImageChange(currentImageIndex - 1);
        break;
      case 'ArrowRight':
        if (currentImageIndex < images.length - 1) onImageChange(currentImageIndex + 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex, images.length]);

  if (!currentImage) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="text-2xl mb-4">No panoramic images available</div>
          <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700">
            <Home className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              360° Panoramic View
            </h1>
            {monastery && (
              <div className="text-amber-200">
                <span className="text-lg font-medium">{monastery.name}</span>
                <div className="text-sm opacity-80">{monastery.location}</div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {images.length > 1 && (
              <>
                <Button
                  onClick={() => onImageChange(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  ←
                </Button>
                <span className="text-white text-sm px-3">
                  {currentImageIndex + 1} / {images.length}
                </span>
                <Button
                  onClick={() => onImageChange(Math.min(images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === images.length - 1}
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  →
                </Button>
              </>
            )}
            
            <Button
              onClick={toggleAutoRotate}
              size="sm"
              className={`${isAutoRotate ? 'bg-amber-600 hover:bg-amber-700' : 'bg-black/50 hover:bg-black/70'} text-white border-white/20`}
            >
              <Compass className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={resetView}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* 360° Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        style={{ background: 'black' }}
      >
        <Suspense fallback={<Loading />}>
          <PanoramaSphere
            imageUrl={currentImage}
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
          />
          <OrbitControls
            ref={setControls}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={isAutoRotate}
            autoRotateSpeed={0.5}
            minDistance={1}
            maxDistance={10}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center justify-center space-x-6 text-white text-sm">
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4" />
            <span>Drag to explore</span>
          </div>
          <div className="flex items-center space-x-2">
            <ZoomIn className="w-4 h-4" />
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4" />
            <span>Click hotspots</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-400">
            <span>ESC to exit • R to reset</span>
          </div>
        </div>
      </div>

      {/* Hotspot Information Panel */}
      {selectedHotspot && (
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/90 backdrop-blur-md text-white p-6 rounded-2xl max-w-sm border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="text-2xl mr-2">{selectedHotspot.icon}</span>
              {selectedHotspot.title}
            </h3>
            <Button
              onClick={() => setSelectedHotspot(null)}
              size="sm"
              className="bg-transparent hover:bg-white/20 text-white border-0 p-1"
            >
              ✕
            </Button>
          </div>
          <p className="text-gray-300 mb-4">{selectedHotspot.details}</p>
          <Button
            onClick={() => setSelectedHotspot(null)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            Continue Exploring
          </Button>
        </div>
      )}

      {/* Instructions Overlay (shows on first load) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-xl">
          <div className="text-6xl mb-2">🏔️</div>
          <h2 className="text-2xl font-bold mb-2">Immersive 360° Experience</h2>
          <p className="text-gray-300">Drag to look around • Scroll to zoom • Click orange hotspots to learn more</p>
        </div>
      </div>
    </div>
  );
};

export default Panoramic360Viewer;
