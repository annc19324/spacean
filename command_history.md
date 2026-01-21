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

## 11. Nâng cấp Bảo mật, Tương tác & Tải lên Tệp
- Triển khai hiển thị/ẩn mật khẩu cho trang Đăng nhập và Đăng ký.
- **Multer Integration**: Cấu hình Backend để hỗ trợ tải tệp (App/Ảnh) lên Server thay vì chỉ dùng liên kết URL.
- **Interaction Restrictions**: Thêm model `Interaction` vào Prisma để giới hạn mỗi tài khoản chỉ được Like/Dislike 1 lần/mỗi App.
- **Traffic Tracking Fix**: Tách biệt logic tăng lượt xem (POST) và lấy số liệu (GET) để tránh tình trạng tăng gấp đôi View trong môi trường React Dev Mode.

## 12. Tối ưu UX/UI & Đa thiết bị (Responsive)
- **React Hot Toast**: Thay thế hoàn toàn `alert()` và `confirm()` nguyên bản bằng hệ thống thông báo bay mượt mà, chuyên nghiệp.
- **Mobile First Design**: Cấu hình CSS Responsive chung và tinh chỉnh Navbar, User Header, App Cards để hiển thị tối ưu trên mọi kích thước màn hình điện thoại.
- **Metadata Enhancement**: Thêm ngày khởi tạo (createdAt) vào thông tin ứng dụng.

## 13. Quản lý Phiên bản (Git) - Lần 3
```powershell
git add .
git commit -m "Enhance security, file uploads, social limits, and responsive UI with Toast notifications"
git push
```

## 14. Cài đặt Người dùng & Quyền Admin Tối cao
- **User Settings**: Triển khai tính năng đổi tên đăng nhập (Username), cập nhật tiểu sử (Bio) và đổi mật khẩu an toàn (Bcrypt).
- **Admin Supreme Power**:
  - Quản lý toàn bộ người dùng: Xem danh sách, chỉnh sửa thông tin, phê duyệt hoặc xóa vĩnh viễn.
  - Cơ chế Banning: Cho phép Admin cấm (Ban) người dùng; hệ thống sẽ tự động vô hiệu hóa quyền truy cập ngay lập tức thông qua Middleware check.
  - Quản lý nội dung: Admin có quyền xóa bất kỳ App/Web nào trên toàn hệ thống.
- **Improved Dashboard UI**: Tái cấu trúc Dashboard với hệ thống thanh điều hướng (Sidebar) giúp phân tách rõ rệt không gian ứng dụng, cài đặt cá nhân và bảng điều khiển quản trị.

## 15. Quản lý Phiên bản (Git) - Lần 4
```powershell
git add .
git commit -m "Implement User settings (Profile/Password) and Supreme Admin powers (User/App management)"
git push
```

## 16. Triển khai Hệ thống Footer & Cloudinary Storage
- **Footer System**: Xây dựng hệ thống quản lý Social Links động ở Backend, có thể cấu hình từ Admin Dashboard và hiển thị ở client.
- **Cloudinary Integration**: Tích hợp Cloudinary Storage để lưu trữ ảnh và file APK an toàn, chuyên nghiệp, thay vì lưu local file system.
- **Environment Config**: Chuyển các thông tin nhạy cảm (Keys) vào .env để chuẩn bị cho môi trường Production.
- **Logo & Branding**: Cập nhật nhận diện thương hiệu "SpaceAn" với logo và title mới.

## 17. Tối ưu Tracking Views Chống Spam
- Triển khai cơ chế Cooldown (Thời gian hồi) 15 phút cho mỗi lượt xem (View).
- Sử dụng LocalStorage để tracking view dựa trên timestamp để đảm bảo tính công bằng và chính xác.
- Loại bỏ hoàn toàn SessionStorage để view có thể tăng mỗi lần truy cập sau khi hết cooldown.
- Fix lỗi tăng view kép do React.StrictMode.

## 18. Chuẩn bị Deployment (Production Ready)
- **Refactoring API Calls**: Chuyển đổi toàn bộ hardcoded URLs (`http://localhost:5000`) sang Dynamic Config (`getApiUrl`) để tương thích với môi trường Vercel/Render.
- **Configuration Helpers**: Tạo helper `client/src/config/api.js` tự động nhận diện environment.
- **Documentation**: Cập nhật toàn bộ tài liệu hướng dẫn (README.md) phản ánh kiến trúc Deploy: Frontend (Vercel) + Backend (Render) + DB (Neon PostgreSQL).

## 19. Quản lý Phiên bản (Git) - Lần 5
```powershell
git add .
git commit -m "Optimize View tracking, Integrate Cloudinary, and Prepare for Production Deployment (Vercel/Render)"
git push
```

## 20. Khắc phục sự cố Deployment & Setup Production DB
- **Fix Build Vercel**: Thêm `CI=false` vào lệnh build để bỏ qua warning (Treating warnings as errors causes build failure).
- **Cleanup Code**: Loại bỏ các import thừa (Unused imports) trong `Dashboard.js` và `ManageUsers.js` để code sạch hơn.
- **Fix API URL**: Sửa logic `getApiUrl` để loại bỏ dấu slash kép (`//`) gây lỗi 404 khi gọi API trên production.
- **Setup Neon DB**:
  - Kết nối Server với Neon PostgreSQL (cloud).
  - Push schema lên Neon (`npx prisma db push`).
  - Chạy seed data để tạo tài khoản Admin trên Neon (`node prisma/seed-admin.js`).
- **Hoàn tất Deployment**: Frontend (Vercel) và Backend (Render) đã kết nối thành công với Database thật.

## 21. Quản lý Phiên bản (Git) - Lần 6 (Final Polish)
```powershell
git add .
git commit -m "Finalize deployment: Fix build errors, cleanup code, and sync production DB"
git push
```

## 22. Hỗ trợ song song Link Web và Link Tải ứng dụng
- Loại bỏ việc chọn loại hình (Loại hình web/app).
- Cho phép người dùng nhập cả "Đường dẫn Web" và "Link tải ứng dụng" đồng thời.
- Cập nhật giao diện Dashboard (User) và ManageApps (Admin) để hỗ trợ nhập cả 2 trường.
- Đảm bảo trang chi tiết ứng dụng (AppDetails) và hồ sơ người dùng (UserProfile) hiển thị đầy đủ cả 2 nút truy cập nếu có dữ liệu.

## 23. Quản lý Phiên bản (Git) - Lần 7
```powershell
git add .
git commit -m "Allow both Web link and App download link for a single app entry"
git push
```

---
*Ghi chú: Nhật ký này sẽ được cập nhật khi có các lệnh quan trọng tiếp theo.*
