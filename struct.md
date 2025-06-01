# Alzheimer Website Project Structure

## Project Overview
```
Alzheimer-website/
├── frontend/           # React-based frontend application
├── backend/           # Python-based backend server
└── docs/             # Project documentation
```

## Frontend Structure
```
frontend/
├── src/                    # Source code directory
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components and routes
│   ├── contexts/          # React context providers
│   ├── services/          # API services and data fetching
│   ├── api/              # API integration layer
│   ├── assets/           # Static assets (images, fonts)
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   ├── App.css           # App-specific styles
│   ├── index.css         # Global styles and Tailwind
│   ├── theme.js          # Theme configuration
│   └── config.js         # Application configuration
├── public/                # Public static files
├── node_modules/         # Node.js dependencies
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── eslint.config.js      # ESLint configuration
```

## Backend Structure
```
backend/
├── app/                  # Main application package
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── api/             # API endpoints
│   ├── services/        # Business logic services
│   ├── schemas/         # Data validation schemas
│   ├── utils/           # Utility functions
│   ├── ai/             # AI-related functionality
│   │   ├── gpt/        # GPT-4o integration
│   │   └── speech/     # Speech processing (Whisper)
│   └── db/             # Database configuration
├── static/              # Static files
├── main.py             # Application entry point
└── requirements.txt    # Python dependencies
```

## Key Components Description

### Frontend
- **components/**: Reusable UI components following atomic design principles
- **pages/**: Page-level components and routing logic
- **contexts/**: React context providers for state management
- **services/**: API integration and data management
- **api/**: API client configuration and endpoints
- **assets/**: Static resources (images, icons, fonts)

### Backend
- **models/**: Database models and schemas
- **routes/**: API route definitions and handlers
- **services/**: Business logic implementation
- **schemas/**: Data validation and serialization
- **ai/**: AI-related features and integrations
  - **gpt/**: GPT-4o based text analysis
  - **speech/**: Whisper API speech processing
- **utils/**: Backend utility functions and helpers

### Configuration
- **vite.config.js**: Frontend build configuration
- **tailwind.config.js**: UI styling framework configuration
- **requirements.txt**: Backend Python dependencies
- **package.json**: Frontend Node.js dependencies
