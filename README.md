# 🔍 Lost & Found Portal

**A secure, production-ready Lost & Found management system with enterprise-grade security, user authentication, admin dashboard, and modern UI/UX.**

[![Security](https://img.shields.io/badge/Security-Enhanced-green.svg)](./SECURITY.md)
[![Deployment](https://img.shields.io/badge/Deployment-Ready-blue.svg)](./DEPLOYMENT.md)
[![Testing](https://img.shields.io/badge/Testing-Comprehensive-orange.svg)](./TESTING.md)

## 🚀 Features

### User Features
- **Authentication System** - Register, login, JWT-based security
- **Report Items** - Lost/Found items with categories, images, rewards
- **Search & Filter** - Advanced search by type, category, location, tags
- **Claim System** - Users can claim found items
- **User Profile** - Manage personal items and claims
- **Responsive Design** - Works on desktop and mobile

### Admin Features
- **Admin Dashboard** - Statistics and overview
- **User Management** - View, edit roles, delete users
- **Item Management** - Moderate all items, update status
- **Real-time Stats** - Track platform usage

### 🔒 Security Features
- **Enterprise Security** - Rate limiting, XSS protection, NoSQL injection prevention
- **Strong Authentication** - JWT tokens with 7-day expiration, bcrypt (12 rounds)
- **Input Validation** - Server & client-side validation, sanitization
- **Security Headers** - Helmet.js, CORS, CSP policies
- **Error Handling** - Secure error messages, global error boundary
- **Monitoring** - Health checks, security event logging

### Technical Features
- **Modern UI/UX** - Tailwind CSS, responsive design, error boundaries
- **RESTful API** - Express.js backend with security middleware
- **Database** - MongoDB with Mongoose, optimized queries
- **Authentication** - JWT tokens, bcrypt password hashing
- **File Upload** - Ready for image uploads (Cloudinary integration)
- **Email Notifications** - Ready for email integration

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads
- Nodemailer for emails

### Frontend
- React 19 & Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- Heroicons for icons

## 📋 Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas
- Git

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd lost-found-portal
npm run setup
```

### 2. Environment Setup
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/lost-found
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start Development
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👤 Default Admin Account

After running `npm run setup`, you can login with:
- **Email:** admin@lostfound.com
- **Password:** admin123

## 📁 Project Structure

```
lost-found-portal/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   └── api.js       # API configuration
│   └── public/          # Static assets
└── package.json         # Root package.json
```

## 🔧 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend in development
- `npm run start` - Start both in production mode
- `npm run setup` - Complete setup with admin user
- `npm run build` - Build frontend for production

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm run seed:admin` - Create admin user

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Items
- `GET /api/items` - Get all items (with filters)
- `POST /api/items` - Create new item (auth required)
- `GET /api/items/:id` - Get single item
- `PUT /api/items/:id` - Update item (owner/admin only)
- `DELETE /api/items/:id` - Delete item (owner/admin only)
- `POST /api/items/:id/claim` - Claim item (auth required)
- `GET /api/items/my-items` - Get user's items (auth required)
- `GET /api/items/claimed` - Get claimed items (auth required)

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/items` - Get all items
- `PUT /api/admin/items/:id/status` - Update item status

## 🎨 UI Components

### Categories
- Electronics
- Documents
- Clothing
- Accessories
- Bags
- Keys
- Other

### Item Status
- **Open** - Available for claiming
- **Claimed** - Someone claimed it
- **Returned** - Successfully returned
- **Closed** - No longer active

### User Roles
- **User** - Regular user (default)
- **Admin** - Full system access

## 📊 Project Status

### ✅ Completed Features
- ✅ **Security Hardened** - Enterprise-grade security implementation
- ✅ **Production Ready** - Comprehensive deployment guide
- ✅ **Fully Tested** - Manual testing checklist completed
- ✅ **Well Documented** - Complete documentation suite
- ✅ **Performance Optimized** - Rate limiting and query optimization
- ✅ **Error Handling** - Comprehensive error management

### 🔮 Future Enhancements
- Image upload with Cloudinary
- Email notifications for matches
- Real-time chat between users
- Mobile app with React Native
- Advanced matching algorithm
- Geolocation integration
- Push notifications
- Multi-language support
- Unit and E2E test automation
- Advanced analytics dashboard

## 📚 Documentation

- **[Security Guide](./SECURITY.md)** - Comprehensive security features
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Testing Guide](./TESTING.md)** - Testing procedures and checklist
- **[Changelog](./CHANGELOG.md)** - Version history and updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:

1. Check MongoDB is running
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check console for error messages

For additional help, create an issue in the repository.