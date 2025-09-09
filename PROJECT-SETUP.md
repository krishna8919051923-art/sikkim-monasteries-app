# 🎉 Sikkim Monasteries - VS Code Project Ready!

## 📍 Project Location
```
/Users/krishna/Desktop/sikkim-monasteries-vscode/
```

## 🚀 Quick Setup (5 Minutes)

### 1. Open in VS Code
```bash
# Navigate to project
cd /Users/krishna/Desktop/sikkim-monasteries-vscode

# Open in VS Code
code .
```

### 2. Install Extensions (Auto-prompt)
VS Code will automatically suggest these extensions:
- ✅ **Prettier** - Code formatting
- ✅ **ESLint** - JavaScript linting  
- ✅ **Tailwind CSS IntelliSense** - CSS class suggestions
- ✅ **ES7+ React Snippets** - React code snippets
- ✅ **Auto Rename Tag** - JSX tag management
- ✅ **GitLens** - Enhanced Git features

### 3. Install Dependencies & Start
```bash
# Install all npm packages
npm install

# Start development server
npm start
```

**🎯 Your app will open at: http://localhost:3000**

## 📂 What's Included

### 🎮 Complete React Application
- **360° Panoramic Viewer** with Three.js
- **AI Guide System** with smart responses
- **6 Featured Monasteries** with detailed information
- **Booking System** for monastery visits
- **Cultural Calendar** with Buddhist festivals
- **Responsive Design** for all devices

### 🔧 VS Code Configuration
- **settings.json** - Optimized workspace settings
- **extensions.json** - Recommended extensions
- **launch.json** - Debug configurations
- **tasks.json** - Automated build tasks

### 📚 Documentation
- **README.md** - Main project documentation
- **DEVELOPMENT.md** - Developer guide with tips
- **PROJECT-SETUP.md** - This quick setup file

## 🎯 Key Features Working

### ✅ Fully Functional Features
- ✅ **360° Virtual Tours** - Immersive monastery exploration
- ✅ **AI Guide Chat** - Intelligent monastery assistant
- ✅ **Responsive Design** - Works on mobile/tablet/desktop
- ✅ **Image Galleries** - High-quality monastery photos
- ✅ **Booking Forms** - Visit scheduling system
- ✅ **Festival Calendar** - Buddhist events and dates
- ✅ **Travel Information** - Complete visiting guides

### 🎪 360° Panoramic Features
- **Mouse/Touch Navigation** - Drag to explore
- **Interactive Hotspots** - Click for information
- **Auto-rotation** - Gentle movement when idle
- **Zoom Controls** - Scroll to zoom in/out
- **Monastery-Specific** - Unique hotspots per location

### 🤖 AI Guide Capabilities
- **Greeting Responses** - "Hello", "Hi", "Namaste"
- **History Questions** - Monastery founding and heritage
- **Festival Information** - Buddhist celebrations and dates
- **Travel Planning** - Visiting hours, permits, transport
- **Weather Guidance** - Best times to visit Sikkim
- **Buddhist Teachings** - Philosophy and practices
- **Architecture Details** - Building styles and features
- **Local Culture** - Food, customs, traditions

## 🌐 Live Demo
**Production Site:** https://sikkim-monasteries-app.surge.sh

## 🛠️ Development Commands

### Essential Commands
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm install        # Install dependencies
```

### VS Code Tasks (Ctrl+Shift+P → Tasks: Run Task)
- **Start Development Server** - Launch with hot reload
- **Build for Production** - Create optimized build
- **Install Dependencies** - Run npm install
- **Run Tests** - Execute test suite

## 🎨 Project Structure

```
sikkim-monasteries-vscode/
├── 📁 .vscode/                    # VS Code configuration
├── 📁 src/
│   ├── 📄 App.js                  # Main app with monastery data
│   ├── 📁 components/
│   │   ├── 📄 Panoramic360Viewer.jsx  # 360° viewer
│   │   └── 📁 ui/                 # UI components
│   └── 📄 App.css                 # Global styles
├── 📁 backend/                    # Optional FastAPI backend
├── 📁 public/                     # Static assets
├── 📄 package.json                # Dependencies & scripts
├── 📄 tailwind.config.js          # Tailwind configuration
├── 📄 README.md                   # Complete documentation
├── 📄 DEVELOPMENT.md              # Developer guide
└── 📄 .gitignore                  # Git ignore rules
```

## 🎯 Featured Monasteries

1. **🏛️ Rumtek Monastery** - Kagyu tradition, Golden Stupa
2. **🌸 Pemayangtse Monastery** - Nyingma tradition, Mountain views
3. **🏔️ Enchey Monastery** - Gangtok city views
4. **⭐ Tashiding Monastery** - Most sacred in Sikkim
5. **🕊️ Do-drul Chorten** - 108 Prayer Wheels
6. **🌊 Khecheopalri Monastery** - Sacred Wishing Lake

## 🔧 Quick Fixes

### If 360° Images Don't Load:
```javascript
// Check image URLs in src/App.js
panoramic_images: [
  'https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg',
  // Add your own 360° images here
]
```

### If Build Fails:
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### If Tailwind CSS Not Working:
- Ensure Tailwind CSS extension is installed
- Check `tailwind.config.js` content paths
- Restart VS Code if needed

## 🚀 Deployment Ready

### Deploy to Surge.sh:
```bash
npm run build
cd build
surge . your-domain.surge.sh
```

### Deploy to Netlify:
- Upload `build` folder to Netlify
- Or connect GitHub repository

### Deploy to Vercel:
- Connect GitHub repository to Vercel
- Auto-deploy on push

## 📞 Need Help?

### 📚 Documentation:
- **README.md** - Complete feature overview
- **DEVELOPMENT.md** - Developer guide with tips
- Code comments throughout the project

### 🌐 Live Reference:
- **Demo Site:** https://sikkim-monasteries-app.surge.sh
- Test all features to see expected behavior

### 🔧 Common Tasks:
- **Add new monastery** - Edit `MOCK_MONASTERIES` in App.js
- **Modify AI responses** - Update `sendMessage` function
- **Change 360° images** - Update `panoramic_images` arrays
- **Customize styling** - Edit Tailwind classes

## 🎉 Ready to Code!

Your complete Sikkim Monasteries project is ready for development in VS Code! 

**🏔️ Open the project and start exploring the beautiful monasteries of Sikkim! 🙏**

### Next Steps:
1. ✅ Open project in VS Code: `code .`
2. ✅ Install recommended extensions
3. ✅ Run `npm install` 
4. ✅ Start with `npm start`
5. ✅ Visit http://localhost:3000
6. ✅ Start developing! 

**Happy Coding! 🚀✨**
