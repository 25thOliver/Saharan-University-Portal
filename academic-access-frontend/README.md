# Student Portal Frontend

A modern, responsive React frontend for a university student portal system. Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (Student/Admin)
- Secure login/logout functionality
- Token validation and auto-logout

### 👨‍🎓 Student Features
- Personal dashboard with profile overview
- View and manage personal information
- Change password securely
- Responsive design for all devices

### 👨‍💼 Admin Features
- Student management dashboard
- View all registered students
- Create new student accounts
- Delete existing students
- Reset student passwords
- Advanced search and filtering

### 🎨 Modern UI/UX
- Professional academic theme with blue gradients
- Responsive design (mobile-first)
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling
- Sidebar navigation with collapse functionality

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Components:** shadcn/ui component library
- **Routing:** React Router v6
- **State Management:** React Context + Hooks
- **HTTP Client:** Fetch API with error handling
- **Icons:** Lucide React
- **Build Tool:** Vite

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
│   ├── api.ts          # API service layer
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── admin/          # Admin-only pages
│   ├── Dashboard.tsx   # Student/Admin dashboard
│   ├── Login.tsx       # Authentication page
│   └── Profile.tsx     # Profile management
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Environment Setup

### Prerequisites
- Node.js 18+ and npm
- Backend API server running (Spring Boot)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd student-portal-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to a Spring Boot backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login

### Student Management
- `GET /api/students` - List all students (Admin only)
- `POST /api/students` - Create student (Admin only)
- `GET /api/students/{id}` - Get student by ID
- `DELETE /api/students/{id}` - Delete student (Admin only)
- `GET /api/students/me` - Get current user profile
- `PUT /api/students/me/password` - Change password (Student)
- `PUT /api/students/{registrationNumber}/reset-password` - Reset password (Admin)

## Demo Credentials

The application includes demo credentials for testing:

**Student Account:**
- Registration Number: `STU001`
- Password: `password`

**Admin Account:**
- Registration Number: `ADM001`
- Password: `admin123`

## Features in Detail

### Design System
- **Colors:** Professional blue theme with HSL color system
- **Typography:** Clean, readable fonts with proper hierarchy
- **Components:** Consistent button variants, forms, and cards
- **Animations:** Smooth transitions and micro-interactions
- **Responsive:** Mobile-first design with breakpoint system

### Security Features
- JWT token storage in localStorage
- Automatic token validation
- Protected routes with role checking
- Secure password handling
- Auto-logout on token expiration

### User Experience
- Loading states for all async operations
- Error handling with user-friendly messages
- Success notifications for actions
- Responsive navigation with mobile support
- Search and filter functionality
- Confirmation dialogs for destructive actions

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## API Configuration

The application expects the backend API to:

1. Accept JWT tokens in the `Authorization: Bearer <token>` header
2. Return proper HTTP status codes
3. Provide JSON error responses with `message` field
4. Handle CORS for cross-origin requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the browser console for errors
- Verify API endpoint connectivity
- Ensure environment variables are set correctly
- Check network requests in browser dev tools