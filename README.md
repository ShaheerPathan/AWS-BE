# User Registration API

A Node.js REST API for user registration with MongoDB database and JWT authentication. Built for local development and AWS deployment.

## Features

- ✅ User registration and authentication
- ✅ JWT token-based authentication with user details
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ MongoDB local database integration
- ✅ CORS enabled
- ✅ Security headers with helmet
- ✅ Request logging with morgan
- ✅ AWS EC2 deployment ready
- ✅ Docker containerization
- ✅ Health check endpoint

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Local)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan
- **Deployment**: AWS EC2, Docker

## Prerequisites

- Node.js (>=16.0.0)
- MongoDB (local installation)
- npm or yarn

## MongoDB Setup

### Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Verify Installation**
   ```bash
   mongosh
   # or
   mongo
   ```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BE_API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```

4. **Configure Environment Variables**
   Edit `.env` file and update:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/user-registration-api
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status

### User Management
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - User login
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID

### Request/Response Examples

#### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## JWT Token Payload

The JWT token now includes user details in the payload:

```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "johndoe",
  "fullname": "John Doe",
  "email": "john@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Database Schema

### User Model
```javascript
{
  fullName: String (required, 5-50 chars),
  username: String (required, unique, 5-30 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication with user details
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Security headers with helmet
- ✅ Environment variable protection
- ✅ MongoDB injection protection (Mongoose)

## Deployment

### AWS EC2 Deployment
See `aws-deployment.md` for detailed AWS deployment instructions.

### Docker Deployment
```bash
# Build Docker image
docker build -t user-registration-api .

# Run container
docker run -p 3000:3000 --env-file .env user-registration-api
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user-registration-api
JWT_SECRET=your-production-jwt-secret
```

## Testing

### Manual Testing
Use the provided test files:
- `test-api.js` - Basic API testing with JWT payload analysis
- `test-with-data.js` - Testing with sample data
- `test-remote-deployment.js` - Remote deployment testing

### Automated Testing
```bash
npm test
```

## Monitoring and Logging

- Request logging with Morgan
- Error handling middleware
- Health check endpoint
- MongoDB connection monitoring
- Graceful shutdown handling

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running locally
   - Check if port 27017 is available
   - Ensure MongoDB service is started

2. **JWT Token Issues**
   - Verify JWT_SECRET is set in environment
   - Check token expiration
   - Validate token payload structure

3. **CORS Issues**
   - Verify CORS configuration for your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
