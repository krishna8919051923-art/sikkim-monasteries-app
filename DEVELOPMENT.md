# 🛠️ Development Guide - Sikkim Monasteries App

## 🚀 VS Code Setup

### 1. Open Project in VS Code
```bash
cd /Users/krishna/Desktop/sikkim-monasteries-vscode
code .
```

### 2. Install Recommended Extensions
When you open the project, VS Code will automatically prompt you to install recommended extensions:

- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Tailwind CSS IntelliSense** - Tailwind class suggestions
- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **GitLens** - Enhanced Git capabilities
- **Error Lens** - Highlight errors inline

### 3. Quick Commands (Ctrl+Shift+P / Cmd+Shift+P)

- **`Tasks: Run Task`** → Choose from predefined tasks:
  - Start Development Server
  - Build for Production
  - Run Tests
  - Install Dependencies
  - Deploy to Surge

- **`Debug: Start Debugging`** → Launch with Chrome debugger

## 📁 Key Files to Know

### 🔧 Configuration Files
```
.vscode/
├── settings.json         # VS Code workspace settings
├── extensions.json       # Recommended extensions
├── launch.json          # Debug configurations
└── tasks.json           # Automated tasks
```

### ⚛️ React Components
```
src/
├── App.js                # Main application logic & mock data
├── components/
│   ├── Panoramic360Viewer.jsx   # 360° viewer with Three.js
│   └── ui/              # Reusable UI components
└── App.css              # Global styles
```

### 🎨 Styling & Config
```
tailwind.config.js       # Tailwind CSS configuration
craco.config.js          # Create React App config override
postcss.config.js        # PostCSS configuration
```

## 🧩 Component Architecture

### 📊 Data Flow
```
App.js (main state)
├── MOCK_MONASTERIES (array of monastery data)
├── MonasteryCard (display monastery info)
├── MonasteryDetails (detailed view with tabs)
├── VirtualTourViewer (image gallery)
├── Panoramic360Viewer (360° experience)
├── BookingForm (visit scheduling)
├── GlobalAIChat (general AI assistant)
└── CulturalCalendar (events & festivals)
```

### 🎪 360° Panoramic System
```
Panoramic360Viewer.jsx
├── PanoramaSphere (3D sphere with texture)
├── Hotspot3D (interactive 3D points)
├── OrbitControls (mouse/touch navigation)
├── Canvas (Three.js rendering context)
└── HTML overlays (UI controls)
```

## 🎨 Styling System

### 🌈 Color Palette
```css
/* Primary Colors - Buddhist aesthetics */
amber-500 to amber-700    /* Monastery gold */
orange-500 to orange-600  /* Sacred saffron */
blue-600 to indigo-600    /* Peaceful sky */
emerald-600 to green-600  /* Natural harmony */

/* Gradients */
from-amber-50 to-orange-50
from-blue-600 to-indigo-600
from-slate-100 to-slate-200
```

### 📱 Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## 🔧 Development Workflow

### 1. Start Development
```bash
# In VS Code terminal
npm start
# Or use Command Palette: Tasks: Run Task → Start Development Server
```

### 2. Code with IntelliSense
- **Tailwind Classes** - Auto-complete for CSS classes
- **React Snippets** - Type `rafce` for React functional component
- **Auto Import** - Automatic import suggestions
- **Error Highlighting** - Real-time error detection

### 3. Debugging
- **F5** - Start debugging with Chrome
- **Breakpoints** - Click line numbers to set breakpoints
- **Console** - View logs in VS Code Debug Console

### 4. Building & Deploying
```bash
# Build for production
npm run build

# Deploy to Surge (after build)
cd build
surge . your-domain.surge.sh
```

## 🎮 360° Development Tips

### 📐 Image Requirements
- **Format**: Equirectangular projection (2:1 aspect ratio)
- **Resolution**: Minimum 2048x1024, optimal 4096x2048
- **File Size**: Keep under 5MB for web performance
- **Format**: JPG for photos, PNG for graphics

### 🎯 Hotspot Positioning
```javascript
// 3D coordinates for hotspots (x, y, z)
new Vector3(25, 2, 35)    // Front-right, slightly up
new Vector3(-30, 0, 25)   // Front-left, center
new Vector3(0, 12, -45)   // Back-center, high up
```

### 🎪 Three.js Performance
- **Geometry Optimization**: Use `sphereGeometry` with appropriate segments
- **Texture Loading**: Preload with `useLoader(TextureLoader, url)`
- **Memory Management**: Dispose of geometries and materials

## 🤖 AI Guide System

### 📚 Response Categories
```javascript
// Greeting responses
'hello', 'hi', 'hey', 'namaste'

// History queries
'history', 'founded', 'built', 'origin'

// Festival information
'festival', 'celebration', 'event', 'ceremony'

// Travel planning
'visit', 'travel', 'reach', 'transport'

// Weather & timing
'weather', 'climate', 'best time', 'season'
```

### 💬 Adding New Responses
```javascript
// In App.js, add to sendMessage function
else if (lowerMessage.includes('your_keyword')) {
  mockResponse = `Your custom response with ${monastery.name} data`;
}
```

## 🧪 Testing

### 🔍 Manual Testing Checklist
- [ ] All monasteries load correctly
- [ ] 360° viewer works on different devices
- [ ] AI Guide responds to various questions
- [ ] Booking form validation works
- [ ] Mobile responsive design
- [ ] Image galleries function properly

### 🚀 Performance Testing
```bash
# Build and analyze bundle
npm run build
npx serve -s build

# Check in browser DevTools:
# - Lighthouse score
# - Network tab for load times
# - Memory usage in Performance tab
```

## 🐛 Common Issues & Solutions

### 1. **360° Images Not Loading**
```javascript
// Check CORS headers for external images
// Use proper equirectangular format
// Verify image URLs are accessible
```

### 2. **Three.js Performance Issues**
```javascript
// Reduce sphere geometry segments
<sphereGeometry args={[50, 32, 16]} /> // Lower segments

// Optimize image sizes
// Enable texture compression
```

### 3. **Build Memory Errors**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 4. **Tailwind Classes Not Working**
```javascript
// Ensure classes are in purge/content array in tailwind.config.js
// Check for typos in class names
// Verify Tailwind CSS extension is active
```

## 📦 Adding New Features

### 🏛️ Adding a New Monastery
```javascript
// In App.js, add to MOCK_MONASTERIES array
{
  id: '7',
  name: 'New Monastery Name',
  location: 'Location, District',
  tradition: 'Buddhist Tradition',
  panoramic_images: [
    'url1.jpg',  // 360° equirectangular images
    'url2.jpg'
  ],
  // ... other required fields
}
```

### 🎨 Adding New UI Components
```bash
# Create in src/components/ui/
touch src/components/ui/NewComponent.jsx
```

### 📱 Responsive Design Testing
- **Chrome DevTools**: Toggle device toolbar (Ctrl+Shift+M)
- **Test Sizes**: 320px (mobile), 768px (tablet), 1024px (desktop)
- **Touch Events**: Ensure 360° viewer works on touch devices

## 🔄 Version Control

### 📝 Commit Message Format
```
feat: add new monastery to collection
fix: resolve 360° viewer rotation issue
style: update monastery card hover effects
docs: improve installation instructions
```

### 🌿 Branch Structure
```
main           # Production branch
development    # Development branch
feature/xyz    # New features
hotfix/xyz     # Bug fixes
```

---

## 🎯 Quick Reference

### ⚡ Essential VS Code Shortcuts
- `Ctrl+`` ` - Toggle terminal
- `Ctrl+Shift+P` - Command palette
- `Ctrl+P` - Quick file open
- `F5` - Start debugging
- `Ctrl+Shift+F` - Search across files

### 🔧 npm Scripts
```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
npm install      # Install dependencies
```

### 🌐 Live Development URLs
- **Local Dev**: http://localhost:3000
- **Production**: https://sikkim-monasteries-app.surge.sh

**Happy Coding! 🏔️✨**
