<div align="center">

# 🔐 SecureAuth API

### A Production-Ready Authentication System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**SecureAuth API** is a robust, scalable, and production-ready authentication system built with Node.js, Express, MongoDB, and JWT. It implements industry-standard security practices including dual-token authentication, token rotation, session management, and OTP-based email verification.

[Features](#-features) • [Architecture](#-project-architecture) • [Auth Flow](#-authentication-flow) • [API Endpoints](#-api-endpoints) • [Setup](#-getting-started)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔑 **JWT Dual-Token Auth** | Short-lived Access Tokens + long-lived Refresh Tokens |
| 🔄 **Token Rotation** | Refresh token rotated on every new access token request |
| 📱 **Session Management** | Track & revoke sessions across all devices |
| 📧 **OTP Email Verification** | Email verification via Nodemailer before account activation |
| 🔒 **Password Hashing** | Cryptographic hashing using bcrypt |
| 🍪 **Secure Cookies** | HttpOnly, Secure cookies for refresh token storage |
| 🚪 **Logout Everywhere** | Invalidate all sessions with a single API call |

---

## 🏗 Project Architecture

```
SecureAuth-API/
│
├── config/
│   ├── db.js              # MongoDB connection via Mongoose
│   └── env.js             # Environment variable management
│
├── controllers/
│   ├── authController.js  # Registration, Login, Logout logic
│   └── otpController.js   # OTP generation & verification
│
├── models/
│   ├── User.js            # User schema & model
│   └── OTP.js             # OTP schema & model
│
├── routes/
│   └── authRoutes.js      # API endpoint definitions
│
├── utils/
│   ├── mailer.js          # Nodemailer email service
│   └── generateOTP.js     # OTP utility function
│
├── middleware/
│   └── authMiddleware.js  # JWT verification middleware
│
├── .env.example
├── server.js
└── package.json
```

---

## 🔄 Authentication Flow

![Auth Flow Diagram](Images/Auth%20Flow%20Diagram.svg)

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive tokens | ❌ |
| `POST` | `/verify-otp` | Verify email via OTP | ❌ |
| `POST` | `/refresh` | Rotate tokens (get new access token) | 🍪 Cookie |
| `POST` | `/logout` | Logout from current device | ✅ |
| `POST` | `/logout-all` | Logout from all devices | ✅ |

### Request & Response Examples


<details>
<summary><strong>POST /api/auth/register</strong></summary>

<table>
<tr>
<td valign="top" width="50%">

**Request Body:**
```json
{
  "username": "harshhere905",
  "email": "harsh@gmail.com",
  "password": "MySecurePass@123"
}
```
**Response `201`:**
```json
{
  "success": true,
  "message": "User registered. Please verify email via OTP."
}
```

</td>
<td valign="top" width="50%">

![Register API result](Images/Screenshot%202026-06-07%20020606.png)

</td>
</tr>
</table>
</details>

<details>
<summary><strong>POST /api/auth/login</strong></summary>

<table>
<tr>
<td valign="top" width="50%">

**Request Body:**
```json
{
  "email": "harsh@example.com",
  "password": "MySecurePass@123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "username": "harshhere905",
    "email": "harsh@example.com"
  }
}
```
> 🍪 Refresh token is set as **HttpOnly Secure Cookie** automatically.

</td>
<td valign="top" width="50%">

![Login API result](Images/Screenshot%202026-06-07%20020713.png)

</td>
</tr>
</table>
</details>

<details>
<summary><strong>POST /api/auth/verify-otp</strong></summary>

<table>
<tr>
<td valign="top" width="50%">

**Request Body:**
```json
{
  "email": "harsh@example.com",
  "otp": "482910"
}
```
**Response `200`:**
```json
{
  "success": true,
  "message": "Email verified. Account is now active."
}
```

</td>
<td valign="top" width="50%">

![OTP verify result](Images/Screenshot%202026-06-07%20020606.png)
![API result](Images/Screenshot%202026-06-07%20020728.png)

</td>
</tr>
</table>
</details>

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail or SMTP credentials for Nodemailer

### 1. Clone the Repository

```bash
git clone https://github.com/harshhere905/SecureAuth-API.git
cd SecureAuth-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/secureauth

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_TOKEN=your_refresh_token_secret

# Google OAuth
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
```

### 4. Start the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000` 🚀

---

## 🔒 Security Highlights

- **Passwords** are hashed with `bcrypt` before storage — never stored in plaintext
- **Refresh tokens** are stored in `HttpOnly` + `Secure` cookies, inaccessible to JavaScript
- **Token Rotation** — refresh token is invalidated and replaced on every use to prevent replay attacks
- **Session tracking** on the server side enables instant revocation for all devices
- **OTP expiry** — OTPs are time-limited and single-use

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & routing |
| **MongoDB + Mongoose** | Database & ODM |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcrypt** | Password hashing |
| **Nodemailer** | OTP email delivery |
| **cookie-parser** | Secure cookie handling |
| **dotenv** | Environment variable management |

---

## 📁 Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT access token secret | `random_secret_key` |
| `JWT_REFRESH_TOKEN` | JWT refresh token secret | `another_secret_key` |
| `CLIENT_ID` | Google OAuth client ID | `xxxx.apps.googleusercontent.com` |
| `CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxx` |
| `EMAIL_USER` | SMTP email address | `you@gmail.com` |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/harshhere905">harshhere905</a><br><br>
⭐ <strong>Star this repo if you found it helpful!</strong> ⭐
</div>
