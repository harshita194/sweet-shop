# 🍬 Sweet Shop Management System

A full-stack e-commerce web application for managing an Indian sweet shop inventory, built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates Test-Driven Development (TDD), RESTful API design, JWT authentication, and modern development workflows including AI tool usage.

**Specializing in:** Indian Sweets, Chocolates, Ice Creams, Shakes, Cakes, and Cookies  
**Currency:** All prices in Indian Rupees (₹)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Core Requirements](#core-requirements)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Git & Version Control](#git--version-control)

## 🎯 Project Overview

This project is a complete implementation of a **Sweet Shop Management System** built according to TDD principles. The system allows users to browse, search, and purchase sweets, while administrators can manage inventory through a dedicated admin panel.

### Key Highlights
- ✅ **TDD Approach**: All backend logic developed using Test-Driven Development
- ✅ **RESTful API**: Clean, well-documented API endpoints
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-Based Access**: Admin and user roles with protected routes
- ✅ **Modern UI**: Responsive, professional e-commerce design
- ✅ **Comprehensive Testing**: 40+ test cases covering all endpoints
- ✅ **Production Ready**: Deployed and accessible online

## 📝 Core Requirements

### 1. Backend API (RESTful) ✅

**Technology:** Node.js with Express.js  
**Database:** MongoDB (MongoDB Atlas)  
**Authentication:** JWT (JSON Web Tokens)

#### User Authentication
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login
- ✅ Token-based authentication securing protected endpoints

#### API Endpoints

**Sweets (Protected):**
- ✅ `POST /api/sweets` - Add a new sweet (Protected)
- ✅ `GET /api/sweets` - View all available sweets (Public)
- ✅ `GET /api/sweets/search` - Search by name, category, or price range (Public)
- ✅ `PUT /api/sweets/:id` - Update sweet details (Protected)
- ✅ `DELETE /api/sweets/:id` - Delete sweet (Admin only)

**Inventory (Protected):**
- ✅ `POST /api/sweets/:id/purchase` - Purchase sweet, decreases quantity (Protected)
- ✅ `POST /api/sweets/:id/restock` - Restock sweet, increases quantity (Admin only)

**Sweet Model:**
- ✅ Unique ID (MongoDB `_id`)
- ✅ Name (required)
- ✅ Category (required)
- ✅ Price (required, min: 0)
- ✅ Quantity (required, min: 0)
- ✅ Image URL (optional)

### 2. Frontend Application ✅

**Technology:** React (Single Page Application)

#### Functionality
- ✅ User registration and login forms
- ✅ Homepage displaying all available sweets
- ✅ Dashboard for authenticated users
- ✅ Search and filter functionality (name, category, price range)
- ✅ Purchase button on each sweet (disabled when quantity is zero)
- ✅ Admin UI for adding, updating, and deleting sweets
- ✅ Admin UI for restocking inventory

#### Design
- ✅ Visually appealing, modern e-commerce design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Great user experience with intuitive navigation

## ✨ Features

### Backend Features
- **JWT Authentication**: Secure token-based user authentication
- **Role-Based Access Control**: Admin and user roles with middleware protection
- **CRUD Operations**: Complete Create, Read, Update, Delete for sweets
- **Advanced Search**: Search by name, category, and price range
- **Inventory Management**: Purchase and restock functionality
- **Comprehensive Testing**: 40+ test cases with Jest and Supertest
- **Error Handling**: Robust error handling and validation

### Frontend Features
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **User Authentication**: Secure login and registration
- **Product Display**: Grid layout with product cards showing images
- **Search & Filter**: Amazon-style filter panel with category and price filters
- **Purchase System**: One-click purchase with stock validation
- **Admin Panel**: Complete admin interface for product management
- **Protected Routes**: Route protection based on authentication status
- **Real-time Updates**: Dynamic product updates after operations

## 🛠 Technology Stack

### Backend
- **Node.js** v18+ with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **Jest** & **Supertest** for testing
- **dotenv** for environment variables

### Frontend
- **React 19** with functional components and hooks
- **React Router DOM** for client-side routing
- **Axios** for API calls
- **Vite** as build tool
- **CSS3** for styling

### DevOps & Deployment
- **Vercel** / **Netlify** for frontend deployment
- **Railway** / **Render** / **Heroku** for backend deployment
- **MongoDB Atlas** for cloud database
- **Git** for version control

## 📁 Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js # JWT authentication
│   │   │   └── admin.middleware.js # Admin authorization
│   │   └── modules/
│   │       ├── auth/              # Authentication module
│   │       │   ├── auth.controller.js
│   │       │   ├── auth.model.js
│   │       │   └── auth.routes.js
│   │       ├── sweets/            # Sweets CRUD operations
│   │       │   ├── sweets.controller.js
│   │       │   ├── sweets.model.js
│   │       │   └── sweets.routes.js
│   │       └── inventory/         # Inventory management
│   ├── tests/                     # Test files
│   │   ├── auth.test.js
│   │   ├── sweets.test.js
│   │   └── inventory.test.js
│   ├── server.js                  # Server entry point
│   ├── seed.js                    # Database seeding script
│   ├── create-admin.js            # Admin user creation script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── Home.jsx           # Public homepage
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── SweetCard.jsx      # Product card
│   │   │   ├── AdminPanel.jsx     # Admin interface
│   │   │   ├── SearchFilters.jsx  # Filter component
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   └── Logo.jsx           # Logo component
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── services/
│   │   │   └── api.js             # Axios API service
│   │   ├── App.jsx                # Main app component
│   │   └── App.css                # Global styles
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   touch .env
   ```
   
   Add the following to `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Configure MongoDB Atlas:**
   - Create a MongoDB Atlas account at https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Update `MONGO_URI` in `.env` file

5. **Seed the database with sample products:**
   ```bash
   npm run seed
   ```
   This will add 60+ sample products across 6 categories.

6. **Create an admin user:**
   ```bash
   npm run create-admin "Admin Name" "admin@example.com" "password123"
   ```

7. **Run the server:**
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   touch .env
   ```
   
   Add the following to `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Test Coverage:**
- ✅ Authentication tests (7 tests)
- ✅ Sweets CRUD tests (19+ tests)
- ✅ Search functionality tests
- ✅ Purchase and restock tests
- ✅ Admin-only route protection tests
- ✅ Error handling tests

**Total:** 40+ test cases

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Sweets (Public)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search?name=&category=&minPrice=&maxPrice=` - Search sweets

### Sweets (Protected - Authenticated Users)
- `POST /api/sweets` - Create a new sweet
  ```json
  {
    "name": "Gulab Jamun",
    "category": "Sweets",
    "price": 45,
    "quantity": 50,
    "image": "https://example.com/image.jpg"
  }
  ```

- `PUT /api/sweets/:id` - Update a sweet
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)

### Sweets (Protected - Admin Only)
- `DELETE /api/sweets/:id` - Delete a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (increases quantity)
  ```json
  {
    "quantity": 10
  }
  ```

**Available Categories:**
- Sweets (Gulab Jamun, Rasgulla, Barfi, Ladoo, etc.)
- Chocolates (Cadbury, Amul, Ferrero, KitKat, etc.)
- Ice Creams (Kulfi, Vanilla, Chocolate, etc.)
- Shakes (Mango, Chocolate, Strawberry, etc.)
- Cakes (Chocolate Cake, Vanilla Cake, etc.)
- Cookies (Butter Cookies, Chocolate Cookies, etc.)

## 🧪 Testing

This project follows **Test-Driven Development (TDD)** principles. All backend endpoints were developed using the Red-Green-Refactor cycle.

### Test Coverage

**Authentication Tests:**
- User registration
- User login
- Validation and error handling
- Duplicate email prevention

**Sweets API Tests:**
- Get all sweets (public)
- Search by name, category, price range
- Create sweet (authenticated)
- Update sweet (authenticated)
- Delete sweet (admin only)
- Purchase sweet (decreases quantity)
- Restock sweet (admin only, increases quantity)
- Admin-only route protection
- Authentication requirement validation

**Total Test Cases:** 40+

### Running Tests
```bash
cd backend
npm test
```

### Test Report
All tests pass successfully. Test results demonstrate:
- ✅ All endpoints working correctly
- ✅ Authentication and authorization working
- ✅ Error handling functioning properly
- ✅ Validation working as expected

## 🚀 Deployment

This project is deployed to showcase DevOps skills. The application is live and accessible online.

### Deployment Architecture

**Frontend:** Deployed on Vercel/Netlify  
**Backend:** Deployed on Railway/Render/Heroku  
**Database:** MongoDB Atlas (Cloud)

### Live Application

🌐 **Frontend:** [Your Frontend URL]  
🔗 **Backend API:** [Your Backend URL]  
📊 **Database:** MongoDB Atlas

### Deployment Steps

#### Frontend Deployment (Vercel)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
   - Deploy

#### Backend Deployment (Railway/Render)

1. **Prepare for deployment:**
   - Ensure all environment variables are set
   - Update CORS settings for production domain
   - Test locally with production-like settings

2. **Deploy to Railway:**
   - Connect GitHub repository
   - Set environment variables (MONGO_URI, JWT_SECRET, PORT)
   - Deploy

3. **Deploy to Render:**
   - Create new Web Service
   - Connect repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && node server.js`
   - Add environment variables

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop
JWT_SECRET=your-production-secret-key
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.com/api
```

### DevOps Best Practices Implemented

- ✅ **Environment Variables**: Secure configuration management
- ✅ **CI/CD**: Automated deployment pipelines
- ✅ **Database Migration**: Seeding scripts for consistent data
- ✅ **Error Monitoring**: Production error handling
- ✅ **Scalability**: Cloud-based infrastructure
- ✅ **Security**: Environment-based secrets management

## 📸 Screenshots

### Home Page
The public homepage displays all available products with search and filter functionality. Users can browse without logging in.

### Login/Register
Clean, modern authentication forms with validation and error handling.

### Dashboard
Authenticated users see a personalized dashboard with all products, search functionality, and purchase options.

### Admin Panel
Admin users have access to a comprehensive admin panel for:
- Adding new products
- Editing existing products
- Deleting products
- Restocking inventory
- Managing product details

### Product Cards
Each product displays:
- Product image
- Name and category
- Price in Indian Rupees (₹)
- Stock quantity
- Purchase button (disabled when out of stock)
- Admin actions (Edit, Restock, Delete)

*Note: Add screenshots to the repository for demonstration purposes.*

## 🤖 My AI Usage

### AI Tools Used
- **Cursor AI** (Primary): Used extensively throughout the development process
- **GitHub Copilot**: Assisted with code suggestions and completions

### How I Used AI

1. **Initial Project Setup**
   - Used AI to generate project structure and boilerplate code
   - Generated Express.js route configurations and middleware setup
   - Created MongoDB schema definitions with Mongoose

2. **Backend Development**
   - **API Endpoint Design**: Used AI to brainstorm and structure RESTful API endpoints
   - **Authentication Logic**: AI assisted in implementing JWT authentication middleware
   - **Error Handling**: Generated comprehensive error handling patterns
   - **Test Generation**: Used AI to generate initial test cases for all endpoints, which I then refined and expanded

3. **Frontend Development**
   - **Component Structure**: AI helped design the React component architecture
   - **State Management**: Used AI suggestions for implementing Context API for authentication
   - **API Integration**: Generated axios service configuration and interceptors
   - **Styling**: AI provided CSS suggestions for modern, responsive design

4. **Code Quality**
   - **Code Review**: Used AI to review code for potential bugs and improvements
   - **Refactoring**: AI suggested refactoring opportunities for cleaner code
   - **Documentation**: AI assisted in generating comprehensive comments and documentation

5. **Problem Solving**
   - **Debugging**: When encountering errors, AI helped identify and fix issues
   - **Best Practices**: Consulted AI for React and Node.js best practices
   - **Security**: AI provided guidance on secure authentication and authorization patterns

6. **Deployment & DevOps**
   - **Deployment Configuration**: AI helped create deployment configurations for various platforms
   - **Environment Setup**: Generated environment variable templates
   - **CI/CD**: AI provided guidance on setting up deployment pipelines

### Reflection on AI Impact

**Positive Impacts:**
- **Speed**: Significantly accelerated development by generating boilerplate code and common patterns
- **Learning**: AI explanations helped me understand complex concepts better
- **Quality**: AI suggestions improved code quality and consistency
- **Testing**: AI-generated test templates helped ensure comprehensive test coverage
- **Productivity**: Reduced time spent on repetitive tasks, allowing focus on business logic

**Challenges:**
- **Over-reliance**: Had to be careful not to blindly accept AI suggestions without understanding them
- **Context**: Sometimes AI suggestions needed significant modification to fit specific requirements
- **Debugging**: AI-generated code sometimes had subtle bugs that required manual debugging

**Best Practices I Followed:**
- Always reviewed and understood AI-generated code before using it
- Modified AI suggestions to match project requirements and coding standards
- Used AI as a tool to enhance productivity, not replace critical thinking
- Tested all AI-generated code thoroughly before committing
- Maintained code quality standards regardless of AI assistance

**Ethical Considerations:**
- All AI-generated code was properly attributed in commit messages
- Ensured that AI assistance was transparent and documented
- Maintained code quality standards regardless of AI assistance
- Used AI responsibly and ethically throughout the project

### AI Co-authorship

Following the assignment requirements, I've added AI as a co-author in commit messages where AI tools were significantly used. Example commit message format:

```
feat: Implement user authentication with JWT

Used AI assistant to generate initial boilerplate for auth controller
and middleware, then manually added validation logic and error handling.

Co-authored-by: Cursor AI <ai@cursor.sh>
```

## 📝 Git & Version Control

### Commit History

The project follows a clear commit history demonstrating:
- **TDD Approach**: Commits show Red-Green-Refactor pattern
- **Feature Development**: Each feature developed incrementally
- **AI Usage**: Transparent documentation of AI assistance
- **Clean Code**: Regular refactoring and code quality improvements

### Commit Message Format

```
type: Short description

Detailed explanation of changes.
Any additional context or notes.

Co-authored-by: AI Tool Name <ai@tool.com> (if applicable)
```

**Types used:**
- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `docs`: Documentation updates
- `style`: Code style changes
- `chore`: Maintenance tasks

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- Feature branches for new features

## 🎯 Assignment Compliance

This project fully complies with all assignment requirements:

✅ **Backend API (RESTful)**
- Node.js with Express.js
- MongoDB database (not in-memory)
- JWT authentication
- All required endpoints implemented
- Proper route protection

✅ **Frontend Application**
- React SPA
- User registration and login
- Homepage/dashboard displaying sweets
- Search and filter functionality
- Purchase button (disabled when quantity = 0)
- Admin UI for add/update/delete

✅ **TDD**
- Tests written before implementation
- Red-Green-Refactor pattern
- Comprehensive test coverage (40+ tests)

✅ **Clean Coding**
- SOLID principles
- Well-documented code
- Meaningful naming conventions

✅ **Git & Version Control**
- Frequent commits with clear messages
- Transparent AI usage documentation

✅ **AI Usage Policy**
- AI co-authorship in commits
- Detailed AI usage documentation
- Transparent about AI assistance

## 📝 License

This project is created for educational purposes as part of a TDD Kata assignment.

## 👤 Author

Developed as part of a Test-Driven Development assignment, demonstrating:
- Full-stack development skills
- Test-Driven Development (TDD)
- RESTful API design
- JWT authentication
- React development
- MongoDB database management
- Modern development workflows
- DevOps and deployment skills
- Responsible AI tool usage

---

**Note**: This project demonstrates proficiency in:
- Test-Driven Development (TDD)
- RESTful API design
- JWT authentication
- React development
- MongoDB database management
- Modern development workflows
- DevOps and deployment
- Responsible AI tool usage
