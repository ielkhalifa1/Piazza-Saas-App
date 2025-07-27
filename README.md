# 🐦 Piazza SaaS App

A secure and scalable Twitter-like SaaS platform built with **Node.js**, **Express**, and **MongoDB**. It includes full user authentication, token-based authorization, and tweet/post management with modern API design principles.

---

## 🚀 Features

- 🔐 **User Registration & Login**
  - Input validation with Joi
  - Secure password hashing using bcrypt
  - JWT-based session management

- 🧾 **Tweet/Post Management**
  - Create, read, update, and delete posts
  - Protected routes with token-based access
  - Searchable fields: hashtags, location, text

- 🌍 **RESTful API Endpoints**
  - Clean and modular route structure
  - Middleware-driven token validation

- 📦 **MongoDB Integration**
  - Mongoose ODM
  - Schema-based data modeling

---

## 📁 Project Structure

Piazza-Saas-App/
├── routes/
│ ├── auth.js # User login & registration
│ └── posts.js # Tweet/post management
├── models/
│ └── User.js # MongoDB user schema
├── validations/
│ └── validation.js # Joi-based input validations
├── app.js # Express server config
├── .env # Environment variables (not pushed)
└── README.md


---

## 🧪 API Endpoints

### 🧍‍♂️ Auth

- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — Log in and receive JWT

### 📝 Tweets

> All tweet routes require `Authorization` header with a valid JWT.

- `GET /api/tweets` — Get all tweets
- `POST /api/tweets` — Create a tweet
- `GET /api/tweets/:postId` — Get tweet by ID
- `PATCH /api/tweets/:postId` — Update a tweet
- `DELETE /api/tweets/:postId` — Delete a tweet

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- Node.js v18+
- MongoDB Atlas or local instance
- Git

### 📦 Install dependencies

```bash
npm install

⚙️ Setup environment

DB_CONNECTOR=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
TOKEN_SECRET=your_jwt_secret
PORT=3000

🔐 Security
Uses bcrypt for password hashing

Secrets and sensitive files are excluded via .gitignore

JWT tokens ensure secure route access

🧑‍💻 Author
Ishaq Elkhalifa
