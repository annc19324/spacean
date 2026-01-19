# SpaceAn - Personal App Store & Sharing Platform

SpaceAn is a full-stack web application that serves as a personal app store and sharing platform. Users can upload their own apps/websites, manage them, and share them with the world. It features a robust user management system, admin approval workflow, and real-time interaction tracking.

![SpaceAn Banner](/client/public/spacean.png)

## 🚀 Live Demo

- **Frontend**: [https://spacean.vercel.app](https://spacean.vercel.app)
- **Backend API**: [https://spacean.onrender.com](https://spacean.onrender.com)

## ✨ Features

- **User Authentication**: Secure login/registration with JWT and role-based access control (Admin/User).
- **App Management**: Users can upload APKs or link websites, with file hosting on Cloudinary.
- **Admin Dashboard**: Full control over users, apps, and system settings.
- **Approval System**: New users require admin approval to access platform features.
- **Interaction Tracking**: Real-time views, likes, dislikes, and downloads tracking with anti-spam cooldowns.
- **Social Integration**: Custom social media links footer management.
- **Responsive Design**: Modern, glassmorphism UI built with React and Framer Motion.

## 🛠 Tech Stack

**Frontend:**
- React (Create React App)
- React Router DOM
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios (API Client)
- CSS Modules & Glassmorphism

**Backend:**
- Node.js & Express
- Prisma ORM
- PostgreSQL (Neon Tech)
- JWT Authentication
- Multer & Cloudinary (File Uploads)

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/annc19324/spacean.git
cd spacean
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `server/` directory:
```env
DATABASE_URL="postgresql://user:pass@host/spacean"
JWT_SECRET="your_secret_key"
PORT=5000
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NODE_ENV="development"
```

Run migrations and seed data:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js # Creates initial test data
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Start the client:
```bash
npm start
```

## 📝 Deployment

**Backend (Render)**
- Connect to GitHub repo
- Set Build Command: `npm install && npx prisma generate && npx prisma db push`
- Set Start Command: `npm start`
- Add Environment Variables

**Frontend (Vercel)**
- Connect to GitHub repo
- Set Root Directory: `client`
- Add Environment Variable: `REACT_APP_API_URL` pointing to backend URL

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
