# SpaceAn Backend - Render Deployment Guide

## 1. Tạo PostgreSQL Database trên Render

1. Đăng nhập https://render.com
2. New → PostgreSQL
3. Name: `spacean-db`
4. Database: `spacean`
5. User: `spacean`
6. Region: Singapore (gần VN nhất)
7. Instance Type: Free
8. Create Database

## 2. Lấy Database URL

Sau khi tạo xong, vào tab "Connect":
- Copy **Internal Database URL** (dạng: `postgresql://user:pass@hostname/database`)
- Lưu lại để dùng trong bước tiếp theo

## 3. Deploy Backend lên Render

1. New → Web Service
2. Connect Repository: `https://github.com/annc19324/spacean`
3. Root Directory: `server`
4. Environment: Node
5. Build Command: `npm install && npx prisma generate && npx prisma db push`
6. Start Command: `npm start`

## 4. Environment Variables

Thêm các biến môi trường:

```
DATABASE_URL=<Internal Database URL từ bước 2>
JWT_SECRET=your_super_secret_jwt_key_here_change_this
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

## 5. Deploy

- Click "Create Web Service"
- Chờ build & deploy (3-5 phút)
- Lưu URL backend (ví dụ: `https://spacean-backend.onrender.com`)

## 6. Tạo Admin Account

Sau khi deploy xong, vào Render Dashboard → Shell:

```bash
npx prisma studio
```

Hoặc connect qua `psql` và tạo admin manually.

---

**Lưu ý quan trọng:**
- Free tier của Render sẽ sleep sau 15 phút không hoạt động
- Lần đầu truy cập sau khi sleep sẽ mất ~30s để wake up
- Nếu muốn always-on, cần upgrade plan
