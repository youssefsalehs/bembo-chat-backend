# Bembo - Real-Time Chat Application Backend

A modern, real-time chat application backend built with Node.js, Express, and Socket.io. This API provides user authentication, messaging, and real-time communication features with support for image sharing and typing indicators.

## Description

Bembo is a feature-rich real-time messaging platform backend that enables users to communicate instantly. It includes:

- **User Authentication**: Secure signup and login with JWT tokens and bcrypt password hashing
- **Real-Time Messaging**: Instant message delivery using WebSocket connections via Socket.io
- **Online Status**: Real-time user online/offline status tracking
- **Typing Indicators**: Shows when users are typing messages
- **Media Support**: Upload and share images in messages and profile pictures
- **Profile Management**: Update user profiles with profile pictures and cover photos
- **User Discovery**: View all users and their availability status

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatty/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The server will start on the port specified in your `.env` file (default: 8000) and will automatically reload on file changes using nodemon.

## Usage

### API Endpoints

#### Authentication Routes (`/api/v1/auth`)

- **POST** `/signup` - Register a new user
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/login` - Login existing user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/logout` - Logout user (requires authentication)

- **PATCH** `/update-profile` - Update user profile (requires authentication)
  - Supports file upload for `profilePic` and `coverPic`

- **GET** `/check` - Check if user is authenticated (requires authentication)

#### Messaging Routes (`/api/v1/message`)

- **GET** `/users` - Get list of all users (requires authentication)

- **GET** `/:id` - Get message history with a specific user (requires authentication)
  - Parameters: `id` - User ID to fetch messages from

- **POST** `/send/:id` - Send message to a user (requires authentication)
  - Parameters: `id` - Recipient user ID
  - Supports up to 5 image uploads per message

### WebSocket Events

Connect to the Socket.io server with the user ID in the query:
```javascript
const socket = io('http://localhost:5000', {
  query: { userId: '<user-id>' }
});
```

**Emitted Events:**
- `getOnlineUsers` - List of currently online user IDs
- `userTyping` - User is typing (sent to recipient)
- `userStoppedTyping` - User stopped typing

**Listen Events:**
- `typing` - Emit when user is typing
- `message` - Receive new messages in real-time

### Example Request with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get all users (with JWT token)
curl -X GET http://localhost:5000/api/v1/message/users \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Project Structure

```
.
├── controllers/          # Business logic for routes
│   ├── auth.controller.js
│   └── message.controller.js
├── middleware/          # Custom middleware
│   └── protect.js       # JWT authentication middleware
├── models/              # MongoDB schemas
│   ├── user.model.js
│   └── message.model.js
├── routes/              # API route definitions
│   ├── auth.route.js
│   └── message.route.js
├── lib/                 # Utility libraries
│   ├── socket.js        # Socket.io configuration
│   ├── db.js            # MongoDB connection
│   ├── cloudinary.js    # Image upload service
│   └── utils.js         # Helper functions
├── index.js             # Application entry point
└── package.json
```

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-Time Communication**: Socket.io
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **File Upload**: Multer & Cloudinary
- **CORS**: Cross-Origin Resource Sharing support
- **Dev Tool**: Nodemon for development

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

