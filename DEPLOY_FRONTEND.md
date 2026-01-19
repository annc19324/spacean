# SpaceAn Frontend - Vercel Deployment Guide

## 1. Cập nhật API URL

Tạo file `.env.production` trong thư mục `client`:

```env
REACT_APP_API_URL=https://spacean-backend.onrender.com
```

## 2. Cập nhật code để dùng env variable

Tất cả API calls sẽ dùng:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 3. Deploy lên Vercel

### Cách 1: Vercel CLI (Khuyên dùng)

```bash
cd client
npm install -g vercel
vercel login
vercel
```

Trả lời các câu hỏi:
- Set up and deploy? → Y
- Which scope? → Your account
- Link to existing project? → N
- Project name? → spacean
- Directory? → ./
- Override settings? → N

### Cách 2: Vercel Dashboard

1. Vào https://vercel.com
2. New Project
3. Import Git Repository: `https://github.com/annc19324/spacean`
4. Root Directory: `client`
5. Framework Preset: Create React App
6. Environment Variables:
   ```
   REACT_APP_API_URL=https://spacean-backend.onrender.com
   ```
7. Deploy

## 4. Custom Domain (Optional)

1. Vào Project Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

## 5. Kiểm tra

- Vercel sẽ cung cấp URL: `https://spacean.vercel.app`
- Test đăng nhập, đăng ký, upload ảnh
- Kiểm tra console không có lỗi CORS

---

**Lưu ý:**
- Mỗi lần push code lên GitHub, Vercel sẽ tự động deploy
- Preview deployment cho mỗi PR
- Production deployment cho branch `main`
