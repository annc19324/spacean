# Nhật ký Lệnh Dự án SpaceAn (Command HistoryLog)

Tài liệu này ghi lại các bước thiết lập và lệnh quan trọng đã thực hiện trong dự án **SpaceAn - Không Gian Của An**.

## 1. Khởi tạo Dự án & Kết nối Git
```powershell
# Tạo cấu trúc thư mục
mkdir server
mkdir client

# Kết nối với GitHub Repository
git init
git remote add origin https://github.com/annc19324/spacean.git
git fetch origin
git branch -M main
```

## 2. Thiết lập Backend (NodeJS & Prisma)
```powershell
cd server
npm init -y

# Cài đặt các thư viện thiết yếu
npm install express @prisma/client jsonwebtoken bcryptjs cors dotenv
npm install -D prisma nodemon

# Khởi tạo Prisma với PostgreSQL
npx prisma init --datasource-provider postgresql
```

## 2.1 Cấu hình Database
- Tệp cấu hình: `server/prisma/schema.prisma`
- Biến môi trường: `server/.env` (đã nạp chuỗi kết nối PostgreSQL của người dùng).
```powershell
# Chuyển đổi Schema vào Database và khởi tạo bảng
npx prisma generate
npx prisma db push
```

## 3. Thiết lập Frontend (ReactJS)
```powershell
cd ..
# Khởi tạo React App bản truyền thống (Webpack) theo yêu cầu người dùng
npx create-react-app client

# Cài đặt thêm các thư viện hỗ trợ giao diện và logic
cd client
npm install axios react-router-dom lucide-react framer-motion
```

## 4. Quản lý Phiên bản (Git) - Lần 1
```powershell
# Đưa những thiết lập đầu tiên lên GitHub
git add .
git commit -m "Initialize SpaceAn project with React, Node, and Prisma PostgreSQL"
git push -u origin main
```

## 5. Xây dựng Logic Backend (Auth & Apps)
- Tạo cấu trúc thư mục `server/src`: `routes`, `controllers`, `middlewares`.
- Triển khai API Đăng ký/Đăng nhập với cơ chế phê duyệt tài khoản (`isApproved`).
- Triển khai API Quản lý ứng dụng (App Management) với tracking lượt xem.
- Tạo Middleware kiểm tra JWT và quyền Admin.

## 6. Khởi tạo dữ liệu Admin (Seeding)
```powershell
# Chạy script tạo tài khoản admin mặc định
cd server
npx prisma db seed
```

## 7. Quản lý Phiên bản (Git) - Lần 2
```powershell
git add .
git commit -m "Implement Backend logic (Auth, Apps, Admin Approval) and update history"
git push
```

---
*Ghi chú: Nhật ký này sẽ được cập nhật khi có các lệnh quan trọng tiếp theo.*
