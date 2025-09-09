# 🏔️ Sikkim Monasteries - Interactive 360° Virtual Experience

A modern React web application showcasing the Buddhist monasteries of Sikkim with immersive 360° panoramic views, AI-powered guides, and comprehensive cultural information.

## 🌟 Live Demo
**🌐 Website:** [https://sikkim-monasteries-app.surge.sh](https://sikkim-monasteries-app.surge.sh)

## ✨ Features

### 🎯 Core Features
- **🏛️ 6 Featured Monasteries** - Rumtek, Pemayangtse, Enchey, Tashiding, Do-drul Chorten, Khecheopalri
- **🎪 360° Panoramic Viewer** - Immersive virtual monastery exploration using React Three Fiber
- **🤖 AI Guide** - Intelligent chatbot with monastery-specific knowledge
- **🎭 Festival Information** - Buddhist festivals, dates, and cultural significance
- **🚗 Travel Planning** - Detailed visiting information, permits, and transportation
- **📸 Virtual Tours** - Interactive image galleries with hotspots
- **📅 Booking System** - Visit scheduling with different tour types
- **🗓️ Cultural Calendar** - Buddhist events and monastery festivals

### 🔧 Technical Features
- **⚛️ React 19** with modern hooks and state management
- **🎨 Tailwind CSS** with custom gradients and animations
- **🎮 3D Graphics** using React Three Fiber and Three.js
- **🎪 360° Image Support** with equirectangular projection
- **📱 Responsive Design** optimized for all devices
- **🔍 Smart Search** and filtering capabilities
- **🚀 Fast Performance** with code splitting and optimization
- **☁️ Easy Deployment** ready for Surge.sh, Netlify, or Vercel

## 📁 Project Structure

```
sikkim-monasteries-vscode/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 Panoramic360Viewer.jsx     # 360° panoramic viewer component
│   │   └── 📁 ui/                        # Reusable UI components
│   ├── 📄 App.js                         # Main application component
│   ├── 📄 App.css                        # Global styles
│   └── 📄 index.js                       # Application entry point
├── 📁 backend/                           # FastAPI backend (optional)
├── 📁 public/                           # Static assets
├── 📁 build/                            # Production build
├── 📄 package.json                      # Dependencies and scripts
├── 📄 tailwind.config.js                # Tailwind CSS configuration
├── 📄 craco.config.js                   # CRACO configuration
└── 📄 README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **VS Code** (recommended)

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Start Development Server
```bash
npm start
# or
yarn start
```

The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
# or
yarn build
```

## 🎮 360° Panoramic Viewer

The app features a custom-built 360° panoramic viewer with:

### 🎯 Interactive Features
- **🖱️ Mouse/Touch Controls** - Drag to explore, scroll to zoom
- **⌨️ Keyboard Navigation** - Arrow keys, ESC, R to reset
- **🎪 Auto-rotation** - Gentle automatic rotation
- **📍 Interactive Hotspots** - 3D clickable information points
- **🎨 Visual Effects** - Smooth transitions and atmospheric lighting

### 🏛️ Monastery-Specific Hotspots
- **Rumtek Monastery** - Golden Stupa, Prayer Hall, Mountain Views
- **Do-drul Chorten** - 108 Prayer Wheels, Sacred Stupa
- **Khecheopalri** - Sacred Wishing Lake Views
- **And more...** - Each monastery has unique points of interest

## 🤖 AI Guide System

### 📚 Knowledge Areas
- **🏛️ Monastery History** - Founding dates, cultural significance
- **🎭 Festival Information** - Buddhist celebrations and ceremonies
- **🚗 Travel Planning** - Visiting hours, permits, transportation
- **🌤️ Weather Guidance** - Best times to visit, seasonal information
- **🧘 Buddhist Philosophy** - Spiritual practices and teachings
- **🏗️ Architecture** - Building styles and traditional elements
- **🍜 Local Culture** - Food, customs, and traditions

### 💬 Smart Responses
The AI provides detailed, contextual responses with:
- **📖 Structured Information** with emojis and formatting
- **🎯 Monastery-Specific Details** using real data
- **🔗 Follow-up Questions** to encourage exploration
- **📱 Mobile-Friendly** conversation interface

## 🎨 UI/UX Design

### 🎭 Design System
- **🎨 Color Palette** - Warm amber/orange gradients reflecting Buddhist aesthetics
- **📱 Responsive Layout** - Mobile-first design with Tailwind CSS
- **✨ Smooth Animations** - CSS transitions and hover effects
- **🖼️ High-Quality Images** - Optimized monastery photography
- **🎪 Interactive Elements** - Cards, buttons, and form components

### 🌟 Key Design Features
- **Gradient Overlays** for visual depth
- **Card-based Layout** for content organization
- **Floating Action Buttons** for quick actions
- **Backdrop Blur Effects** for modern aesthetics
- **Typography Hierarchy** for clear information structure

## 🔧 Technical Stack

### Frontend
- **⚛️ React 19** - Modern React with concurrent features
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎮 React Three Fiber** - 3D graphics and 360° rendering
- **📊 Three.js** - WebGL-based 3D library
- **🎪 React Router** - Client-side routing
- **📡 Axios** - HTTP client for API calls
- **🎯 Lucide React** - Beautiful SVG icons

### Development Tools
- **🔧 CRACO** - Create React App Configuration Override
- **📦 npm/yarn** - Package management
- **🎨 PostCSS** - CSS processing
- **⚡ ES6+** - Modern JavaScript features

## 📱 Responsive Design

The application is fully responsive with:
- **📱 Mobile** - Touch-optimized controls and navigation
- **📱 Tablet** - Balanced layout with touch interactions
- **💻 Desktop** - Full-featured experience with mouse controls
- **🖥️ Large Screens** - Enhanced visual experience

## 🚀 Deployment

### Surge.sh (Current)
```bash
npm run build
cd build
surge . your-domain.surge.sh
```

### Netlify
```bash
npm run build
# Upload build folder to Netlify or connect Git repo
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

## 🎯 Featured Monasteries

### 1. 🏛️ Rumtek Monastery
- **Tradition:** Kagyu School
- **Founded:** 1966 (originally 1734)
- **Highlights:** Golden Stupa, Monastery Museum
- **Significance:** Seat of the Karmapa Lama

### 2. 🌸 Pemayangtse Monastery
- **Tradition:** Nyingma School
- **Founded:** 1705
- **Highlights:** Zangdog Palri Model, Kanchenjunga Views
- **Significance:** Premier Nyingma monastery

### 3. 🏔️ Enchey Monastery
- **Tradition:** Nyingma School
- **Founded:** 1909
- **Highlights:** City Views, Guardian Deities
- **Significance:** Important urban monastery

### 4. ⭐ Tashiding Monastery
- **Tradition:** Nyingma School
- **Founded:** 1717
- **Highlights:** Sacred Chortens, Holy Spring
- **Significance:** Most sacred monastery in Sikkim

### 5. 🕊️ Do-drul Chorten
- **Tradition:** Nyingma School
- **Founded:** 1945
- **Highlights:** 108 Prayer Wheels, Golden Stupa
- **Significance:** Important pilgrimage site

### 6. 🌊 Khecheopalri Monastery
- **Tradition:** Nyingma School
- **Founded:** Ancient
- **Highlights:** Sacred Wishing Lake, Forest Setting
- **Significance:** Sacred lake monastery

## 🎭 Cultural Information

### 📅 Buddhist Festivals
- **🎊 Losar** - Tibetan New Year (Feb/Mar)
- **🌕 Saga Dawa** - Buddha's Enlightenment (May/Jun)
- **🏔️ Pang Lhabsol** - Mount Khangchendzonga Worship (Sep)
- **🎭 Cham Dances** - Various monastery-specific festivals

### 🧘 Buddhist Traditions
- **☸️ Nyingma School** - Oldest Tibetan Buddhist tradition
- **🏛️ Kagyu School** - "Oral Transmission" lineage
- **📿 Prayer Practices** - Mantras, meditation, circumambulation
- **🎪 Ritual Arts** - Sacred dances, music, visual arts

## 🔍 Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new dependency
npm install package-name

# Update dependencies
npm update

# Check bundle size
npm run build && npx serve -s build
```

## 📋 VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Prettier - Code formatter**
- **ESLint**

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with memory issues**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

2. **360° images not loading**
   - Check image URLs are accessible
   - Ensure CORS headers are set for external images
   - Verify equirectangular format (2:1 aspect ratio)

3. **3D rendering issues**
   - Update graphics drivers
   - Check browser WebGL support
   - Clear browser cache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. Feel free to use and modify for your own projects.

## 📞 Support

For questions or support, please:
- Check the documentation above
- Review the code comments
- Test on the live demo site

---

**🏔️ Experience the spiritual beauty of Sikkim's monasteries from anywhere in the world! 🙏**

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
