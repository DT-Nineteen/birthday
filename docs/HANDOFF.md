# Project handoff

Tài liệu này là bản chuyển giao bối cảnh từ phiên làm việc thiết kế và triển khai ngày 2026-08-31 đến 2026-09-01. Máy hoặc task mới nên đọc file này trước khi thay đổi UI.

## 1. Mục tiêu sản phẩm

Birthday là dịch vụ tạo thiệp sinh nhật miễn phí. Chất lượng template là core value: thiệp phải đẹp, có cảm giác được làm riêng cho người nhận và đủ uy tín để người dùng sẵn sàng trả tiền cho tiện ích phụ.

Định hướng doanh thu sau này:

- custom URL;
- bỏ branding;
- nhạc;
- thời gian lưu/publishing;
- tiện ích bổ sung.

Tài khoản, lưu cloud, publishing và thanh toán chưa nằm trong milestone hiện tại.

## 2. Quyết định sản phẩm đã chốt

- Giai đoạn đầu chỉ tập trung thiệp sinh nhật.
- Các template hiện tại đều miễn phí.
- Chất lượng và khác biệt quan trọng hơn số lượng.
- Builder có toolbar bên trái, preview bên phải, chế độ desktop/mobile và fit-to-frame.
- Basic personalization gồm tên, ngày, lời chúc, emoji và ảnh người nhận.
- Ảnh dùng Object URL trong trình duyệt, không upload server.
- Có kéo căn ảnh theo trục X/Y và zoom; đổi template không được mất dữ liệu.
- Mỗi template sở hữu HTML, CSS, asset và motion riêng nhưng dùng chung CardConfig và bridge gửi config vào iframe.

## 3. Hướng hình ảnh được ưu tiên

Người dùng thích template gốc Pink Celebration nhất và rất ưng Sticker Book. Các template tiếp theo nên thuộc cùng một “design family”, không phải bản recolor:

- sáng, vui, nhiều lớp và có cảm giác thủ công;
- portrait là điểm cảm xúc chính;
- icon/sticker chất lượng, được dùng như một phần của bố cục thay vì đồ trang trí rải ngẫu nhiên;
- headline lớn, giàu cá tính và không bị cắt glyph;
- animation chậm rãi, có thứ tự kể chuyện: stage → headline → portrait → thông tin cá nhân → CTA → ambient;
- desktop và mobile được art-direct riêng;
- decoration không được che tên, headline, CTA hay khuôn mặt.

Không dùng giao diện SaaS generic, glassmorphism, purple AI gradient hoặc một bộ card bo tròn đồng dạng cho phần thiệp người nhận.

## 4. Kiến trúc hiện tại

### Entry points

- `index.html` + `style.css`: thiệp gốc Pink Celebration và baseline hình ảnh.
- `builder.html` + `builder.css` + `scripts/builder.js`: editor và preview shell.
- `scripts/card-config.js`: CardConfig mặc định và normalization.
- `scripts/template-registry.js`: metadata, route và giới hạn nội dung của template.
- `scripts/template-preview.js`: helper chung nhận config/replay trong iframe.
- Mỗi thư mục `templates/<id>/` có `index.html`, `style.css`, `preview.js`.

### CardConfig quan trọng

- `templateId`
- `recipient.name`
- `recipient.dateLabel`
- `recipient.message`
- `recipient.emoji`
- `recipient.portraitUrl`
- `recipient.portraitPosition: { x, y }`
- `recipient.portraitScale`

Builder gửi toàn bộ config sang iframe sau mỗi thay đổi. Template phải dùng dữ liệu này, có fallback ảnh mặc định và hỗ trợ replay.

## 5. Template hiện có và đánh giá

1. `pink-celebration`: baseline tốt nhất; playful editorial, outline đậm, portrait tròn, cờ/balloon/sticker và letter reveal 3D.
2. `midnight-disco`: concept ổn nhưng avatar effect từng bị đánh giá là hơi thô; không phải hướng ưu tiên để nhân rộng.
3. `paper-garden`: đã nâng cấp thành botanical editorial; chữ, caption, hoa và lá rơi đã được sửa. Lá/petal ambient chạy infinite, reduced-motion sẽ tắt.
4. `soft-film`: Home Movie 90s, màu phim ấm và hoài niệm; đã sửa khoảng cách hai dòng Happy Birthday và transform mobile.
5. `sticker-book`: kết quả được đánh giá rất tốt và gần base. Có photobooth, sticker inline SVG do dự án tự tạo, staged motion. Mobile đã sửa portrait bị đẩy/cắt và gift/cake/stars che nội dung.

## 6. Những lỗi đã gặp — không được lặp lại

### Animation ghi đè responsive transform

Keyframe desktop có final `transform` sẽ ghi đè `transform: none` trong media query. Với mỗi animated element đổi vị trí ở mobile, tạo keyframe mobile riêng và gán `animation-name` trong breakpoint. Luôn kiểm tra khung hình sau khi animation chạy xong, không chỉ first paint.

### Display font bị cắt hoặc hai dòng chạm nhau

- Không dùng container quá chặt với font display/script có overhang.
- Dành padding theo glyph, dùng `overflow: visible` khi phù hợp.
- Đo khoảng cách thực giữa bounding boxes của hai dòng; mục tiêu gần nhưng không overlap.
- Luôn thử chữ tiếng Việt có dấu; font display có thể thiếu glyph hoặc metrics không ổn.

### Decoration che nội dung

- Xác định vùng cấm: khuôn mặt, tên, headline, CTA, message.
- Mobile cần vị trí sticker riêng; không chỉ scale toàn bộ desktop layout.
- Asset phải giữ nguyên cạnh, không crop theo khung vuông tùy tiện.

### Cache khi xem builder

Dev server chuẩn là `python scripts/dev-server.py`, có header no-cache. Nếu vẫn thấy code cũ, hard refresh và kiểm tra query version của `scripts/builder.js` trong `builder.html`.

## 7. Quy trình làm một template mới

1. Nghiên cứu `DESIGN.md`, contract, motion và checklist.
2. Chốt concept/moodboard trước khi code; ghi palette, typography, signature element, composition và timeline.
3. Ưu tiên CSS hoặc inline SVG do dự án tự tạo. Nếu dùng asset ngoài, ghi URL và license vào `ASSET-SOURCES.md` trước khi release.
4. Tạo thư mục template với ba file chuẩn.
5. Đăng ký ID/metadata/route trong `scripts/template-registry.js` và thêm thumbnail builder.
6. Bảo toàn toàn bộ CardConfig khi đổi template.
7. Viết regression test cho route và lỗi responsive/motion đặc thù.
8. Chạy `npm test` và `npm run build`.
9. Visual QA ở 390×844, 768×1024, 1366×768, 1440×900; thử nội dung tiếng Việt dài và nhiều tỉ lệ ảnh.
10. Kiểm tra keyboard, touch, letter/modal, replay, reduced-motion, console và missing assets.

## 8. Roadmap gần nhất

Template tiếp theo đã được đề xuất nhưng chưa triển khai: **Doodle Party**.

Định hướng đã trao đổi:

- cùng design family với Pink Celebration và Sticker Book;
- nét marker, doodle vẽ tay và scrapbook/yearbook;
- portrait vẫn là focal point;
- animation gồm đường vẽ xuất hiện, sticker/doodle pop có kiểm soát và ambient nhẹ;
- tránh biến thành bảng trắng trẻ em hoặc rải icon ngẫu nhiên;
- mobile phải có keyframe và vùng đặt decoration riêng ngay từ đầu.

Các concept dự phòng: Candy Arcade, Balloon Parade, Birthday Comic và Sweet Bakery.

Trước khi triển khai Doodle Party trên task mới, cần xác nhận lại concept với người dùng rồi làm một template hoàn chỉnh để duyệt, không tạo nhiều bản nửa vời cùng lúc.

## 9. Git và chuyển máy

Remote chính: `https://github.com/DT-Nineteen/birthday.git`.

Trên máy mới:

```powershell
cd D:\www
git clone https://github.com/DT-Nineteen/birthday.git
cd birthday
python scripts\dev-server.py
```

Sau đó mở `http://127.0.0.1:4173/builder.html`, chạy test/build và đọc các file ở mục “Tài liệu cần đọc” trong README trước khi sửa UI.
