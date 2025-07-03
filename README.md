# 🔗 URL Shortener Microservice

A lightweight and scalable URL shortening service that allows you to shorten long URLs, track analytics, and manage redirections.

![Project Screenshot](https://github.com/ambujpandey1/22013215300008/blob/main/api%20initgration.png)

---

## 🚀 Features

- 🔒 Shorten long URLs into unique short codes
- 🌐 Redirect to original URL using the short code
- 📊 View analytics like total clicks, timestamps, referrer, and location
- ⏳ Auto-expiry support for short URLs
- ⚡ Built using a Microservice architecture (frontend & backend separated)

---

## 🧰 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- Dotenv

---

## 📂 Project Structure

```bash
url-shortener-microservice/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── services/
│   └── App.jsx
│
└── README.md
