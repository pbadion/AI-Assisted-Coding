# Bethany's Pie Shop - Full Stack Application

A modern full-stack e-commerce application for a pie shop, built with React + TypeScript frontend and Express.js backend.

## 🚀 Features

- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Express.js** backend with RESTful API
- **React Router** for client-side navigation
- **Context API** for global state management
- **Custom Hooks** for data fetching and cart management
- **Responsive Design** with modern CSS
- **Component-based Architecture** for maintainability

## 📁 Project Structure

```
├── server/              # Backend Express.js server
│   ├── server.js        # Server entry point
│   ├── app.js           # Express app configuration
│   ├── config/          # Configuration files
│   │   ├── constants.js # App constants and settings
│   │   └── swagger.js   # Swagger/OpenAPI documentation (optional)
│   ├── routes/          # API route handlers
│   │   └── api.js      # Pie API routes
│   ├── middleware/      # Express middleware
│   │   └── security.js # Security headers (Helmet)
│   ├── models/          # Data models
│   │   └── pies.js     # Pies data
│   └── utils/           # Utility functions
│       └── piesHelper.js # Pie helper functions
│
├── src/                 # Frontend React application
│   ├── components/      # Reusable UI components
│   │   ├── PieCard/    # Individual pie display
│   │   ├── Cart/       # Cart functionality
│   │   ├── Header/     # Navigation header
│   │   ├── Hero/       # Hero carousel
│   │   ├── SearchBar/  # Search functionality
│   │   └── Footer/     # Application footer
│   ├── contexts/        # React Context providers
│   │   └── CartContext.tsx # Global cart state
│   ├── hooks/           # Custom React hooks
│   │   ├── useCart.ts  # Cart management hook
│   │   └── usePies.ts  # Pie data fetching hooks
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx    # Home page with hero and monthly pies
│   │   ├── CategoryPage.tsx # Category-specific pages
│   │   └── CartPage.tsx    # Full cart page
│   ├── services/        # API service layer
│   │   └── pieService.ts  # Pie API calls
│   ├── types/           # TypeScript type definitions
│   │   └── pie.ts      # Pie, Cart, and API types
│   └── utils/           # Utility functions
│       └── cartStorage.ts # Cart storage utilities
│
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start Vite development server (frontend)
- `npm start` - Start Express backend server
- `npm run start:dev` - Start backend server with auto-reload (nodemon)
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest

## 🔧 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

You need to run both servers in separate terminals:

**Terminal 1 - Backend Server:**

```bash
npm start
# or for auto-reload on changes:
npm run start:dev
```

Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend (Vite):**

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

The Vite dev server is configured to proxy `/api` requests to the backend on port 4000.

**Open your browser** to `http://localhost:3000`

## 🔗 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/pies` - Fetch all pies
- `GET /api/pies?category={category}` - Fetch pies by category (seasonal, fruit, cheesecake)
- `GET /api/pies/:id` - Get a specific pie by ID
- `GET /api/pies-of-the-month` - Fetch monthly featured pies

### Example API Calls

```bash
# Get all pies
curl http://localhost:4000/api/pies

# Get fruit pies only
curl http://localhost:4000/api/pies?category=fruit

# Get a specific pie
curl http://localhost:4000/api/pies/f1

# Get monthly featured pies
curl http://localhost:4000/api/pies-of-the-month
```

## 🎨 Key Components

- **PieCard**: Displays individual pie information with add to cart functionality
- **Cart**: Modal cart with item management (add, remove, update quantities)
- **Hero**: Auto-advancing carousel showcasing featured pies
- **SearchBar**: Real-time search functionality
- **Header**: Navigation with cart preview and item count

## 🔄 State Management

- **Cart Context**: Global cart state using React Context API
- **Custom Hooks**:
  - `useCart` - Cart management (add, remove, update items)
  - `usePies` - Fetch pies by category
  - `useMonthlyPies` - Fetch featured monthly pies
- **Local Storage**: Persistent cart data across browser sessions
- **Cross-tab Sync**: Cart updates synchronized across browser tabs

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts for pie cards
- Responsive navigation
- Touch-friendly interactions

## 🛡️ Security

- **Helmet.js** for security headers (XSS protection, content security policy, etc.)
- **Input validation** on API endpoints (category parameter validation)
- **Error handling** with proper HTTP status codes

## 🧪 Testing

Tests are configured with Vitest. Run tests with:

```bash
npm test
```

## 📝 Tech Stack

**Frontend:**

- React 19
- TypeScript
- Vite
- React Router
- Axios

**Backend:**

- Express.js
- Node.js
- Helmet (security)

**Development:**

- Vitest (testing)
- Nodemon (auto-reload)
- TypeScript
