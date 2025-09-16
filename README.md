# Lunatune - Modern Music Streaming Platform

A sophisticated, full-stack music streaming application built with cutting-edge web technologies. This repository contains the **React/Next.js frontend** that connects to a robust .NET backend API. Features a beautiful web interface and comprehensive music management system with real-time audio visualization and advanced playback controls.

> **Backend API**: This frontend connects to a separate .NET backend API. View the backend repository at [lunatune-api](https://github.com/TyeStanley/lunatune-api) for the complete server-side implementation.

## Live Demo

**🔗 [View Live Application](https://lunatune-app.vercel.app/)**

> **Note**: This is a portfolio showcase project demonstrating full-stack development skills with modern web technologies.

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Key Highlights](#-key-highlights)
- [Performance & Optimization](#-performance--optimization)
- [Testing](#-testing)
- [Portfolio Context](#-portfolio-context)
- [About the Developer](#-about-the-developer)

## ✨ Features

### 🎵 Music Management

- **Advanced Audio Player**: Dual-audio system with seamless transitions and crossfading
- **Real-time Audio Visualization**: Dynamic visualizer with shooting stars, nebulae, and frequency-based animations
- **Playlist Management**: Create, edit, and organize custom playlists
- **Music Discovery**: Search, browse, and discover new music with intelligent recommendations
- **Favorites System**: Like and save favorite songs with persistent storage
- **Queue Management**: Advanced queue system with shuffle, repeat, and skip functionality

###️ Playback Controls

- **Professional Audio Controls**: Play, pause, skip, seek, and volume control
- **Sleep Timer**: Set automatic sleep timers (15min to 2.5hrs) for bedtime listening
- **Repeat & Shuffle**: Multiple repeat modes and intelligent shuffle algorithms
- **Progress Tracking**: Real-time progress tracking with seek functionality
- **Volume Persistence**: Volume settings saved across sessions

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Dark Theme**: Beautiful dark theme with gradient backgrounds and smooth animations
- **Interactive UI**: Hover effects, loading states, and micro-interactions
- **Accessibility**: Semantic HTML and ARIA attributes for screen readers
- **Smooth Animations**: Custom animations and micro-interactions

### 🔐 Authentication & Security

- **Auth0 Integration**: Secure authentication with social login options
- **Protected Routes**: Route protection with automatic redirects
- **User Management**: Profile management and user data persistence
- **Session Management**: Secure session handling with token refresh

### Cross-Platform

- **Mobile Responsive**: Optimized for mobile devices and tablets

## 🛠 Technologies Used

### Frontend

- **React 19** - Latest React with concurrent features and Suspense
- **Next.js 15** - Full-stack React framework with App Router
- **TypeScript** - Comprehensive type safety throughout the application
- **Tailwind CSS 4** - Utility-first CSS framework with custom design system
- **Lucide React** - Beautiful, customizable icons
- **Custom Hooks** - Reusable logic for audio, authentication, and state management

### State Management

- **Redux Toolkit** - Predictable state container with RTK Query
- **RTK Query** - Data fetching and caching with automatic background updates
- **Custom Slices** - Playback controls, queue management, and user state
- **Persistent Storage** - Local storage integration for user preferences

### Audio & Visualization

- **Web Audio API** - Advanced audio processing and analysis
- **Canvas API** - Real-time audio visualization with custom animations
- **Dual Audio System** - Seamless crossfading between tracks
- **Frequency Analysis** - Real-time frequency data for visual effects

### Backend Integration

- **RESTful API** - Connects to .NET backend for data management
- **Auth0** - Authentication and authorization service
- **File Streaming** - Efficient audio file streaming and caching
- **API Client** - RTK Query for seamless backend communication

### Development Tools

- **Jest** - Comprehensive testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting with Tailwind CSS plugin
- **Turbopack** - Fast bundling and development server

## 📁 Project Structure

```text
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Protected routes
│   │   ├── dashboard/       # User dashboard
│   │   ├── library/         # Music library management
│   │   ├── playlists/       # Playlist pages
│   │   ├── search/          # Music search
│   │   ├── visualizer/      # Audio visualizer page
│   │   └── liked/           # Liked songs
│   ├── (public)/            # Public routes
│   └── layout.tsx           # Root layout with providers
├── components/              # Reusable React components
│   ├── AudioPlayer.tsx      # Core audio player component
│   ├── AudioVisualizer.tsx  # Real-time audio visualization
│   ├── playback-bar/        # Playback control components
│   ├── library/             # Library management components
│   ├── sleep-timer/         # Sleep timer functionality
│   ├── auth/                # Authentication components
│   └── ui/                  # Reusable UI components
├── redux/                   # State management
│   ├── api/                 # RTK Query API definitions
│   ├── state/               # Redux slices
│   └── store.ts             # Store configuration
├── providers/               # React context providers
│   ├── AudioProvider.tsx    # Audio context management
│   ├── AuthProvider.tsx     # Authentication context
│   └── StoreProvider.tsx    # Redux store provider
├── hooks/                   # Custom React hooks
├── lib/utils/               # Utility functions
├── types/                   # TypeScript type definitions
└── __tests__/               # Comprehensive test suite
    ├── components/          # Component tests
    ├── redux/              # Redux slice tests
    └── app/                # Page component tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Access to the backend API (see [lunatune-api](https://github.com/TyeStanley/lunatune-api))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TyeStanley/lunatune-app.git
   cd lunatune-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_AUTH0_DOMAIN=your_auth0_domain
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
   NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/callback
   NEXT_PUBLIC_AUTH0_AUDIENCE=your_auth0_audience
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

This frontend requires the backend API to be running. Please refer to the [lunatune-api repository](https://github.com/TyeStanley/lunatune-api) for backend setup instructions.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🎯 Key Highlights

### Technical Excellence

- **Modern React Patterns**: Hooks, context, custom hooks, and concurrent features
- **Advanced Audio Processing**: Web Audio API with real-time frequency analysis
- **State Management**: Redux Toolkit with RTK Query for efficient data fetching
- **Type Safety**: Comprehensive TypeScript implementation with strict typing
- **Performance**: Optimized rendering, lazy loading, and efficient bundle splitting
- **API Integration**: Seamless communication with .NET backend

### Audio Engineering

- **Dual Audio System**: Seamless crossfading between tracks
- **Real-time Visualization**: Canvas-based audio visualizer with custom animations
- **Advanced Controls**: Professional-grade playback controls and audio processing
- **Sleep Timer**: Intelligent sleep timer with automatic pause functionality
- **Volume Management**: Persistent volume settings with smooth transitions

### User Experience

- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Smooth Animations**: Custom animations and micro-interactions
- **Accessibility**: Semantic HTML and ARIA attributes for screen readers
- **Dark Theme**: Beautiful dark theme with gradient backgrounds
- **Intuitive Navigation**: Clear navigation patterns and user flows

### Code Quality

- **Clean Architecture**: Well-organized component structure and separation of concerns
- **Reusable Components**: Modular design with composable UI elements
- **Custom Hooks**: Abstracted logic for audio, authentication, and state management
- **Comprehensive Testing**: 90%+ test coverage with Jest and React Testing Library
- **Type Safety**: Full TypeScript implementation with strict type checking

## ⚡ Performance & Optimization

- **Next.js 15**: Latest framework features with improved performance
- **Turbopack**: Fast development builds and hot reloading
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with automatic optimization
- **Bundle Analysis**: Optimized JavaScript bundles for faster loading
- **Audio Optimization**: Efficient audio streaming and caching
- **State Optimization**: Memoized selectors and efficient re-renders

## 🧪 Testing

### Test Coverage

- **90%+ Code Coverage** across all components and utilities
- **Component Testing**: Comprehensive component behavior testing
- **Redux Testing**: State management and action testing
- **Integration Testing**: Full user flow testing
- **Utility Testing**: Custom hook and utility function testing

### Testing Tools

- **Jest** - Testing framework with custom matchers
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **Custom Mocks** - Audio API and external service mocking

### Test Structure

```bash
src/__tests__/
├── components/          # Component tests
├── redux/              # Redux slice tests
├── hooks/              # Custom hook tests
├── lib/utils/          # Utility function tests
└── app/                # Page component tests
```

## 🎨 Portfolio Context

### Project Purpose

This project was created as a **comprehensive portfolio showcase** to demonstrate advanced frontend development skills and modern web technologies. Lunatune represents a production-ready music streaming frontend designed to showcase:

- **Frontend Development**: Complete React/Next.js application with modern patterns
- **Modern Web Technologies**: Latest React, Next.js, and TypeScript implementation
- **Audio Engineering**: Advanced Web Audio API and real-time visualization
- **State Management**: Complex state management with Redux Toolkit and RTK Query
- **API Integration**: Seamless communication with backend services
- **Testing Excellence**: Comprehensive test coverage and quality assurance

### Skills Demonstrated

- **React 19 & Next.js 15**: Latest framework features and best practices
- **TypeScript**: Advanced type safety and development experience
- **Redux Toolkit**: Complex state management with RTK Query
- **Web Audio API**: Advanced audio processing and visualization
- **API Integration**: RESTful API communication and data management
- **Testing**: Comprehensive testing with Jest and React Testing Library
- **Performance**: Optimization and bundle analysis
- **UI/UX**: Responsive design and user experience

## 👨‍💻 About the Developer

**Tye Stanley** - Software Developer & UT University Graduate

- **Full-Stack Developer** with expertise in modern web technologies
- **Frontend Specialist** in React, TypeScript, and responsive design
- **Backend Experience** with Node.js, Express.js, .NET, and API development
- **UI/UX Focus** on creating engaging, accessible user experiences
- **Continuous Learner** always exploring new technologies and best practices

## 📞 Contact

- **Portfolio**: [tyestanley.com](https://tyestanley.com/)
- **LinkedIn**: [linkedin.com/in/tyestanley](https://www.linkedin.com/in/tyestanley/)
- **GitHub**: [github.com/TyeStanley](https://github.com/TyeStanley)
- **Email**: Available through contact form on portfolio website

## License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Portfolio Showcase Project** - Demonstrating advanced frontend development skills through a comprehensive music streaming web application with React/Next.js frontend and .NET backend integration.
