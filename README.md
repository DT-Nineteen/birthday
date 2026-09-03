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

1. `docs/HANDOFF.md` — bối cảnh sản phẩm, trạng thái hiện tại và cách tiếp tục trên máy mới.
2. `DESIGN.md` — DNA hình ảnh của template gốc, chuẩn chất lượng chính.
3. `docs/ui/TEMPLATE-CONTRACT.md` — ranh giới dữ liệu và template.
4. `docs/ui/MOTION.md` — nhịp animation và reduced-motion.
5. `docs/ui/TEMPLATE-QUALITY-CHECKLIST.md` — checklist bắt buộc trước khi duyệt template.
6. `ASSET-SOURCES.md` — nguồn và license asset.

## Template hiện có

- Pink Celebration — template gốc và baseline chất lượng.
- Midnight Disco — neon/chrome, nhịp tiệc tối.
- Paper Garden — botanical editorial, giấy và hoa.
- Soft Film — home movie thập niên 90, hoài niệm.
- Sticker Book — photobooth và sticker sinh nhật; gần hướng base nhất.

Chi tiết kỹ thuật và roadmap nằm trong `docs/HANDOFF.md`.
