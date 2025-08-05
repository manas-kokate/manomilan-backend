# 💞 Manomilan Backend

Welcome to the **Manomilan Backend**, a RESTful API server designed for a matchmaking/matrimonial application. This backend manages user registration, profile management, authentication, partner preferences, and more using modern web technologies.

---

## 🚀 Features

- 🔐 JWT-based Authentication & Authorization  
- 📝 User Registration & Profile Management  
- ❤️ Partner Preference Matching  
- 📷 Profile Picture Upload (via Multer)  
- 🌐 RESTful API architecture  
- 🔒 Secure password storage using bcrypt  
- 🧪 Modular code structure for scalability  
- 🌍 MongoDB for database management  

---

## 🛠 Tech Stack

- **Node.js** with **Express.js**  
- **MongoDB** with **Mongoose**  
- **JWT** for authentication  
- **bcryptjs** for hashing passwords  
- **Multer** for file uploads  
- **Dotenv** for environment variable management  

---

## 📁 Folder Structure

manomilan-backend/
│
├── config/ # Configuration files (e.g., DB connection, cloudinary)
├── controllers/ # Business logic for routes
├── middleware/ # Middleware (auth, error handling)
├── models/ # Mongoose schemas/models
├── routes/ # API route definitions
├── utils/ # Utility functions
├── uploads/ # Local uploads (temp usage)
├── .env.example # Environment variable example
├── server.js # Entry point of the app
└── package.json

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/manas-kokate/manomilan-backend.git
cd manomilan-backend
2. Install Dependencies
npm install
3. Setup Environment Variables
Create a .env file in the root directory and configure the following variables:
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
You can refer to .env.example for guidance.

4. Run the Server
bash
Copy
Edit
npm run dev
The server will start on http://localhost:5000.

📬 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/users/	Get all users
GET	/api/users/:id	Get user by ID
PUT	/api/users/:id	Update user profile
POST	/api/upload	Upload profile image

More APIs are available — check the routes/ and controllers/ folders for full details.

🧪 Future Improvements
Add email verification during registration

Integrate chat functionality (WebSockets)

Add admin dashboard

Improve preference-based matchmaking algorithm

Add testing (Jest/Supertest)


🙋‍♂️ Author
Manas Kokate

GitHub:https://github.com/manas-kokate