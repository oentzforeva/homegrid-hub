# Network Dashboard

A modern, responsive network dashboard for monitoring and managing your local network services and applications. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Network Monitoring
- **Real-time Service Status**: Monitor connectivity and health of your network services
- **Internet Connectivity Check**: Automatic verification of internet connection status
- **Last Check Timestamps**: Track when services were last verified online
- **Visual Status Indicators**: Clear status badges showing service availability

### Service Management
- **Add Custom Services**: Easily add new network services with custom configurations
- **Edit Existing Services**: Modify service details, URLs, icons, and settings
- **Delete Services**: Remove services that are no longer needed
- **Service Categories**: Organize services by type (Network Management, Security, Media, etc.)

### Customizable Interface
- **Dashboard Personalization**: Edit dashboard title, subtitle, and footer text
- **Custom Icons**: Upload and manage custom icons for your services
- **Accent Colors**: Personalize each service with custom accent colors
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Configuration Management
- **Export Configuration**: Save your dashboard setup as a JSON file
- **Import Configuration**: Restore or share dashboard configurations
- **Reset to Defaults**: Easily restore default settings when needed
- **Persistent Storage**: Your settings are saved locally in your browser

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd network-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📋 Configuration

### Adding Services

1. Click the "Add Service" button on the dashboard
2. Fill in the service details:
   - **Name**: Display name for the service
   - **Description**: Brief description of the service
   - **URL**: The web address of your service
   - **Category**: Service type (Network, Security, Media, etc.)
   - **Icon**: Upload a custom icon or use default
   - **Accent Color**: Choose a color theme

### Service Categories

The dashboard supports the following service categories:
- **Network Management**: Routers, switches, network controllers
- **Security & Surveillance**: Security cameras, access control systems
- **Home Automation**: Smart home hubs, IoT controllers
- **Storage & NAS**: Network storage, file servers
- **Media & Entertainment**: Media servers, streaming services
- **Document Management**: Document storage and organization systems

### Network Monitoring

Services can be configured for automatic network connectivity checking:
- Enable "Network Check" when adding/editing a service
- The dashboard will periodically verify if the service is reachable
- Status indicators show real-time connectivity status

## 🛠️ Built With

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **State Management**: React hooks with localStorage persistence
- **HTTP Client**: Fetch API for connectivity checks

## 🎨 Customization

### Design System
The dashboard uses a comprehensive design system with:
- Custom color tokens defined in `index.css`
- Semantic color variables for consistent theming
- Dark/light mode support
- Responsive breakpoints

### Adding Custom Icons
1. Place your icon files in the `src/assets/` directory
2. Import them in your service configuration
3. Use any image format (PNG, SVG, JPG)

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full-featured interface with hover effects
- **Tablet**: Touch-optimized with appropriate sizing
- **Mobile**: Compact layout with mobile-friendly interactions

## 🔧 Development

### Project Structure
```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── AppCard.tsx      # Service card component
│   ├── NetworkDashboard.tsx  # Main dashboard
│   └── ...
├── config/              # Configuration files
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── pages/               # Page components
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Suggested GitHub Description:**
"Modern network dashboard for monitoring local services and applications. Features real-time connectivity checks, customizable interface, and configuration management. Built with React, TypeScript, and Tailwind CSS."