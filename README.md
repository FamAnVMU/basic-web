# 🌌 Phạm An (FamAnVMU) - Immersive 3D Space Portfolio

Website cá nhân phong cách **Immersive 3D Space Experience** được xây dựng riêng cho **Phạm An** – Sinh viên chuyên ngành Công nghệ Thông tin tại **Trường Đại học Hàng hải Việt Nam (VMU)**.

Toàn bộ website là một hành trình tương tác đa chiều trong không gian số sâu thẳm, kết hợp đồ họa 3D WebGL thực thụ với ngôn ngữ thiết kế Cyber-Holographic (tông màu chủ đạo Space Black & Cyan Glow).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. Không Gian Vũ Trụ Sống Động (Three.js WebGL Engine)
- **Hệ thống hạt sao & Bụi vũ trụ mềm mại**: Sử dụng texture tỏa tròn mềm (radial soft-glow) tạo từ Canvas, biến các hạt sao xa, sao trung cảnh và bụi vũ trụ tiền cảnh thành những đốm sáng lung linh không bị răng cưa hay dạng hình vuông.
- **Quả cầu hành tinh 3D chi tiết cao**: Bề mặt cấu tạo từ texture thuật toán (procedural generation), tái hiện lục địa, mảng đại dương và mạch năng lượng điện tử (cyber night lights) ở bán cầu tối.
- **Hào quang khí quyển & Hạt tầng bình lưu (Atmospheric Aura & Fresnel)**: Quầng sáng cyan Fresnel kết hợp đám mây 450+ hạt năng lượng khí quyển trôi dạt chậm quanh bề mặt hành tinh.
- **Vành đai hạt kép (Double Planetary Rings)**: Gồm vành đai năng lượng phát sáng bên trong và vành đai bụi vũ trụ khuếch tán bên ngoài, quay chậm uyển chuyển.
- **Vệ tinh quỹ đạo**: Vệ tinh thám hiểm mang đèn hải đăng LED nhấp nháy bay quanh hành tinh theo chu kỳ thực tế.
- **Bảng màu nhất quán**: Sắc đen vũ trụ `#02040a` kết hợp chùm sáng cyan neon `#00f3ff` & teal `#0891b2`.

### 2. Tương Tác 3D Theo Chuột & Thị Sai (Parallax)
- **Camera Parallax**: Chuyển động của chuột điều khiển góc nhìn và độ nghiêng của toàn bộ không gian với thuật toán nội suy làm mượt (`lerp damping`), tránh cảm giác giật hoặc chóng mặt.
- **Hành tinh phản hồi tự nhiên**: Nghiêng góc nhìn và thay đổi vùng sáng tối theo tọa độ con trỏ.
- **Thẻ Holographic 3D Tilt**: Các khối thông tin nghiêng đa chiều theo vị trí chuột, kèm chùm sáng phản chiếu holographic và viền neon phát sáng khi hover.

### 3. Hành Trình Xuyên Vũ Trụ Liền Mạch (Scroll-Driven Choreography)
- **Sector 01 // Vũ Trụ (Hero)**: Tọa độ mở đầu uy nghi trước hành tinh lớn, hiển thị danh tính số Phạm An (FamAnVMU), chuyên ngành CNTT ĐH Hàng hải Việt Nam, cùng thông số telemetry thời gian thực.
- **Sector 02 // Hồ Sơ (About)**: Camera tiến gần vào góc xiên của hành tinh; mở ra hồ sơ dữ liệu holographic, ảnh đại diện `avatar.jpg` trong khung nhắm mục tiêu xoay đa lớp và triết lý công nghệ hàng hải.
- **Sector 03 // Kỹ Năng (Skills)**: Camera hướng về mặt phẳng vành đai năng lượng; hiển thị ma trận kỹ năng với thanh đo năng lượng cyan (Frontend, Backend, CSDL, DevOps, Nền tảng Khoa học máy tính).
- **Sector 04 // Dự Án (Projects)**: Trưng bày các trạm dự án chiến lược (Hệ thống giám sát hải trình tàu biển VMU AIS Tracker, Vũ trụ Web 3D CosmoWeb, Quản lý bãi container PortMaster, Cổng sinh viên CyberCampus) với cửa sổ modal chi tiết thông số kỹ thuật.
- **Sector 05 // Hành Trình (Journey)**: Quỹ đạo phát sáng kết nối các mốc từ khởi đầu tại ĐH Hàng hải Việt Nam đến định hướng Kỹ sư phần mềm tương lai.
- **Sector 06 // Liên Hệ (Contact)**: Trạm thu phát sóng viễn thông vũ trụ với đầy đủ các kênh liên kết cá nhân (Facebook, Discord, Email, GitHub), nút sao chép nhanh và hiệu ứng pháo hoa sao chổi khi gửi tin nhắn.

### 4. Âm Thanh Không Gian Tương Tác (Web Audio API Synthesizer)
- Tích hợp bộ tổng hợp âm thanh điện tử thuần Web Audio API: tiếng ngân trầm không gian sâu (ambient deep space drone) và tiếng bíp giao diện (UI hover/click/warp).
- Mặc định tắt để tôn trọng người dùng, dễ dàng bật/tắt bằng nút bấm trên thanh điều hướng với bộ visualizer sóng âm.

### 5. Tối Ưu Hiệu Năng & Khả Năng Tiếp Cận
- Tách biệt vòng lặp render 3D `requestAnimationFrame` khỏi chu kỳ render của React.
- Tự động giới hạn `devicePixelRatio` và giảm số lượng hạt sao trên điện thoại để duy trì tốc độ khung hình 60 FPS.
- Hỗ trợ đầy đủ `prefers-reduced-motion` của hệ điều hành.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, Custom GLSL Shaders
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphism & Custom CSS 3D
- **Hiệu ứng & Âm thanh**: Web Audio API Sound Synthesizer, Canvas-Confetti

---

## 📂 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ `http://localhost:5173`.

### 3. Đóng gói cho môi trường thực tế (Production Build)
```bash
npm run build
```

### 4. Chạy thử bản build (Preview)
```bash
npm run preview
```

---

## 📡 Thông Tin Liên Kết Cá Nhân

- **Họ và tên**: Phạm An (FamAnVMU)
- **Trường**: Trường Đại học Hàng hải Việt Nam (VMU) - Khoa Công nghệ Thông tin
- **Facebook**: [facebook.com/pham.an.123114](https://www.facebook.com/pham.an.123114)
- **Discord**: [discord.com/users/846953344903282758](https://discord.com/users/846953344903282758)
- **Email**: [phama6372@gmail.com](mailto:phama6372@gmail.com)
- **GitHub**: [github.com/FamAnVMU](https://github.com/FamAnVMU)
