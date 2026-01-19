# Dự án SpaceAn - Không Gian Lưu Trữ Cá Nhân

## 🔗 Tổng quan dự án
**SpaceAn** là một hệ thống lưu trữ và quản lý ứng dụng/liên kết cá nhân, được xây dựng trên nền tảng Fullstack (ReactJS & NodeJS) với cơ sở dữ liệu PostgreSQL. Dự án tập trung vào tính cá nhân hóa cao nhưng có khả năng mở rộng để chia sẻ tài nguyên cho cộng đồng.

### 🌟 Tính năng cốt lõi:
- **Quản lý đa vai trò:**
  - `Guest`: Xem hồ sơ người dùng, thống kê lượt truy cập, thích, tải xuống và truy cập ứng dụng.
  - `User`: Quản lý không gian cá nhân (thêm/sửa/xóa App/Web), theo dõi các chỉ số tương tác.
  - `Admin`: Phê duyệt người dùng đăng ký, quản lý toàn bộ hệ thống.
- **Cơ chế Phê duyệt:** Người dùng đăng ký mới phải đợi quản trị viên phê duyệt mới có thể bắt đầu sử dụng các tính năng quản lý.
- **Hệ thống Metrics:** Theo dõi lượt xem (views), thích (likes), không thích (dislikes) và lượt tải (downloads) cho cả hồ sơ cá nhân và từng ứng dụng riêng lẻ.
- **Linh hoạt Content:** Hỗ trợ cả liên kết web đơn giản và ứng dụng có tệp tải xuống kèm ảnh minh họa.

---

# Nhật ký Lệnh Dự án SpaceAn (Command History Log)


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

## 8. Triển khai Hệ thống Hồ sơ Công khai & Tương tác
- Tạo `userController.js` và route `/api/users` để khách có thể xem danh sách User và hồ sơ cá nhân.
- Cập nhật `appController.js` thêm các logic: `likeApp`, `dislikeApp`, `downloadApp`.
- Thiết lập cơ chế tracking views: Tăng view cho cả ứng dụng và chủ sở hữu khi hồ sơ hoặc app được truy cập.
- Xây dựng trang `UserProfile.js` (React) hiển thị không gian riêng của từng User với đầy đủ các chỉ số thống kê.
- Cập nhật `Home.js` chuyển trọng tâm sang khám phá "Không gian" (Spaces) của các User.
- Bổ sung các nút tương tác (Thích, Ghét, Tải về) với hiệu ứng cập nhật dữ liệu thời gian thực.

## 9. Cấu hình Validation & Fix Prisma 7
- Triển khai xác thực (validation) cho Username: ít nhất 6 ký tự, gồm chữ thường, hoa, số và dấu chấm.
- Triển khai xác thực cho Password: ít nhất 8 ký tự, gồm chữ thường, hoa, số và ký tự đặc biệt.
- Cập nhật cả Backend (Controller) và Frontend (Register page) để đồng bộ quy tắc xác thực.
- Khắc phục lỗi tương thích Prisma 7 bằng cách hạ cấp xuống Prisma 6.2.1 để đảm bảo tính ổn định với cấu hình hiện tại.

## 10. Hoàn thiện Quản lý Ứng dụng (CRUD)
- Triển khai logic Thêm, Sửa, Xóa ứng dụng ngay trong trang Dashboard của người dùng.
- Tích hợp Modal Form với validation và xử lý API (POST/PUT/DELETE).
- Hỗ trợ phân loại linh hoạt giữa Web (dùng Link) và App (dùng Link tải về).
- Cập nhật giao diện Dashboard để đồng bộ dữ liệu ngay lập tức sau khi thay đổi.

---
*Ghi chú: Nhật ký này sẽ được cập nhật khi có các lệnh quan trọng tiếp theo.*
