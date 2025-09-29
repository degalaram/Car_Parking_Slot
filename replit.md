# Parkslot Pro

## Overview

Parkslot Pro is a modern React-based web application built for parking management. The project leverages React 18 with Vite for fast development, TailwindCSS for styling, and Redux Toolkit for state management. The application features a comprehensive UI component library, data visualization capabilities, and modern web development best practices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with concurrent features for improved rendering performance
- **Vite** as the build tool and development server for lightning-fast development experience
- **Component-based architecture** with reusable UI components organized in `/src/components/`
- **Page-based routing** using React Router v6 for declarative navigation
- **CSS-in-JS approach** using TailwindCSS utility classes with custom design system

### State Management
- **Redux Toolkit** for centralized state management with simplified Redux setup
- **Modern Redux patterns** reducing boilerplate and improving developer experience

### Styling and UI
- **TailwindCSS** as the primary CSS framework with utility-first approach
- **Custom design system** with CSS variables for consistent theming and color management
- **Responsive design** built-in with TailwindCSS mobile-first approach
- **Component styling** using class-variance-authority and clsx for conditional styling

### Data Visualization
- **D3.js** integration for complex data visualizations and custom charts
- **Recharts** for pre-built chart components and quick data visualization needs
- **Dual approach** allowing both custom D3 implementations and ready-to-use chart components

### Form Management
- **React Hook Form** for efficient form handling with minimal re-renders
- **Performance-optimized** form validation and submission handling

### Animation and Interactions
- **Framer Motion** for smooth UI animations and micro-interactions
- **Enhanced user experience** through motion design patterns

### Development Tools
- **Hot Module Replacement** through Vite for instant development feedback
- **PostCSS** with autoprefixer for CSS processing and vendor prefixing
- **Path mapping** configured through jsconfig.json for cleaner imports

## External Dependencies

### Core Framework Dependencies
- **React 18.2.0** - Main frontend framework
- **React DOM 18.2.0** - DOM rendering library
- **React Router DOM 6.0.2** - Client-side routing

### State Management
- **Redux Toolkit 2.6.1** - State management toolkit
- **Redux 5.0.1** - Core Redux library

### HTTP Client
- **Axios 1.8.4** - Promise-based HTTP client for API communications

### UI and Styling
- **TailwindCSS 3.4.6** - Utility-first CSS framework
- **Lucide React 0.484.0** - Icon library
- **Radix UI Slot 1.2.3** - Primitive component library

### Data Visualization
- **D3.js 7.9.0** - Data-driven document manipulation
- **Recharts 2.15.2** - React chart library

### Form and Validation
- **React Hook Form 7.55.0** - Form state management and validation

### Animation
- **Framer Motion 10.16.4** - Animation library for React

### Utilities
- **Date-fns 4.1.0** - Date utility library
- **Class Variance Authority 0.7.1** - Styling utilities
- **CLSX 2.1.1** - Conditional class name utility
- **Tailwind Merge 3.3.1** - TailwindCSS class merging utility

### Development and Deployment Platform
- **Replit environment** for development with hot module replacement
- **Autoscale deployment** configuration for production hosting
- **Port 5000** configured for frontend server with proper host settings for Replit proxy

### Testing Framework
- **Jest** with React Testing Library for component testing
- **Testing utilities** for user interaction simulation