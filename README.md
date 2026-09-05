# Birthday Card Studio

Dịch vụ tạo thiệp sinh nhật miễn phí với các template được art-direct riêng. Trình tạo thiệp chạy thuần HTML, CSS và ES modules; nội dung và ảnh cập nhật trực tiếp trong iframe preview.

## Chạy local

Yêu cầu Node.js để chạy test/build và Python 3 để chạy dev server không cache.

```powershell
cd D:\www\birthday
python scripts\dev-server.py
```

Mở `http://127.0.0.1:4173/builder.html`.

```powershell
npm test
npm run build
```

## Tài liệu cần đọc

1. `docs/AI-TEMPLATE-PLAYBOOK.md` — entry point và workflow chuẩn để tạo template mới từ reference/Canva assets.
2. `docs/NEW-TEMPLATE-BRIEF.md` — prompt tối giản dùng khi bắt đầu task mới.
3. `docs/HANDOFF.md` — bối cảnh sản phẩm, trạng thái hiện tại và cách tiếp tục trên máy mới.
4. `DESIGN.md` — DNA hình ảnh của template gốc, chuẩn chất lượng chính.
5. `docs/ui/TEMPLATE-CONTRACT.md` — ranh giới dữ liệu và template.
6. `docs/ui/MOTION.md` — nhịp animation và reduced-motion.
7. `docs/ui/TEMPLATE-QUALITY-CHECKLIST.md` — checklist bắt buộc trước khi duyệt template.
8. `ASSET-SOURCES.md` — nguồn và license asset.

## Bắt đầu một template mới

Đính kèm mẫu Canva/reference và các SVG/PNG hỗ trợ rồi gửi:

```text
Đây là mẫu template Canva và đây là các element hỗ trợ bạn làm.

Hãy đọc docs/AI-TEMPLATE-PLAYBOOK.md và triển khai thành một template mới đúng chuẩn Birthday. Mức độ tương đồng cảm nhận mong muốn khoảng 80%.
```

Không cần đổi tên, chia thư mục hoặc viết manifest cho asset trước khi gửi. AI sẽ audit file, trình design proposal ngắn và chờ duyệt trước khi sửa code.

## Template hiện có

- Pink Celebration — template gốc và baseline chất lượng.
- Midnight Disco — neon/chrome, nhịp tiệc tối.
- Paper Garden — botanical editorial, giấy và hoa.
- Soft Film — home movie thập niên 90, hoài niệm.
- Sticker Book — photobooth và sticker sinh nhật; gần hướng base nhất.
- Doodle Party — trang lưu bút vẽ tay với marker frame quanh portrait.

Chi tiết kỹ thuật và roadmap nằm trong `docs/HANDOFF.md`.
