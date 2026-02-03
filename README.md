# PHP Casting Game: Cast or Craft? 🔨

A developer strategy game inspired by the "Casting in PHP" blog post. Make critical decisions about type handling in PHP while managing technical debt and time pressure in a sprint-based gameplay loop.

## 🎮 Game Overview

You're a developer in a sprint with 10 tickets to complete and only 40 hours. Each variable needs to fit through a "door" (strict type), but they're not always the perfect size. Choose your approach:

- **🔨 Hammer (Fast & Risky)**: Cast the value quickly (2 hours) but risk data loss
- **📏 Measure (Slow & Safe)**: Validate the value carefully (5 hours) preserving data integrity

Accumulate too much technical debt and the sprint fails. Run out of time and you miss the deadline. Balance speed and safety to win!

## 🚀 Quick Start

**Prerequisites:** Node.js (v16 or higher)

1. **Clone the repository**
   ```bash
   git clone https://github.com/voku/PHPCastingGame.git
   cd PHPCastingGame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```
   
   The production build will be in the `dist/` folder.

## 📁 Key Files

Understanding the project structure:

### Core Game Files
- **`App.tsx`** - Main game component with state management and game loop logic
- **`constants.ts`** - Game levels and scenario definitions
- **`types.ts`** - TypeScript type definitions for the game

### Components
- **`components/DoorFrame.tsx`** - Visual representation of the "door" and value fitting
- **`components/TechDebtMeter.tsx`** - Progress bar showing technical debt accumulation
- **`components/Icons.tsx`** - Custom icon components

### Configuration
- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript compiler configuration
- **`package.json`** - Dependencies and scripts

### Entry Points
- **`index.html`** - HTML entry point with Tailwind CSS
- **`index.tsx`** - React application mount point

## 🎯 Key Files Detector Helper

When contributing or understanding the codebase, focus on these key areas:

**Game Logic**: Start with `App.tsx` (lines 1-100) for game state and `constants.ts` for level definitions.

**Visual Components**: Check `components/DoorFrame.tsx` for the main game visualization and `components/TechDebtMeter.tsx` for the UI feedback system.

**Type Safety**: Review `types.ts` for the complete type system used throughout the game.

**Styling**: The game uses Tailwind CSS (via CDN in `index.html`) with custom animations and dark mode support.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

## 🤝 Contributing

Contributions are welcome! Visit the project repository at:
**https://github.com/voku/PHPCastingGame**

## 📄 License

This project is open source. See the repository for license details.

## 🎓 Educational Purpose

This game demonstrates:
- Type casting trade-offs in PHP
- Technical debt accumulation
- Sprint planning and time management
- Risk vs. safety in software development decisions

Based on concepts from the blog post about PHP type casting and data integrity.
