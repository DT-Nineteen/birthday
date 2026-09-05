# AI template playbook

Đây là entry point dành cho mọi task tạo template Birthday mới. Tài liệu này điều phối quy trình; các quyết định chi tiết vẫn nằm trong tài liệu UI chuyên biệt.

## Câu lệnh mặc định

Khi người dùng gửi một mẫu Canva hoặc ảnh tham khảo, kèm SVG/PNG và nói tương đương:

> Đây là mẫu template Canva và đây là các element hỗ trợ bạn làm.

Hãy hiểu yêu cầu mặc định là:

- tạo một template Birthday mới, không chỉ review reference;
- fidelity cảm nhận mục tiêu khoảng 80%;
- tự kiểm kê asset dù file chưa được đổi tên hoặc phân thư mục;
- giữ tương thích builder, template registry và `CardConfig` hiện tại;
- trình design proposal ngắn và chờ người dùng duyệt trước khi sửa code;
- sau khi được duyệt, tự implement, test và visual QA đến khi đủ chuẩn release.

Người dùng không cần chuẩn bị ZIP có cấu trúc, manifest hay brief dài. Một screenshot/reference, các asset rời và một câu mô tả là đủ để bắt đầu.

## Fidelity 80% nghĩa là gì

Mục tiêu là khi đặt sản phẩm cạnh reference, người dùng nhận ra ngay cùng một concept. Ưu tiên giữ:

- bố cục và phân cấp thị giác chủ đạo;
- palette và độ tương phản;
- tỷ lệ giữa headline, portrait và decoration;
- cảm giác typography;
- cách đóng khung portrait;
- ngôn ngữ icon/illustration và mật độ trang trí;
- mood tổng thể.

Không hiểu 80% là sao chép từng pixel, DOM hoặc toàn bộ artwork. Phần chuyển hóa Birthday phải:

- đổi nội dung thiệp mời thành tên, ngày và lời chúc cá nhân;
- đưa portrait người nhận thành tâm điểm cảm xúc;
- bổ sung staged animation, interaction và ambient motion;
- art-direct desktop và mobile riêng;
- hỗ trợ tiếng Việt, dữ liệu động và reduced motion;
- loại bỏ số thứ tự, nhãn hoặc copy không có ý nghĩa sản phẩm.

Nếu asset được cung cấp không đủ để đạt fidelity mục tiêu, nêu rõ asset còn thiếu và tác động dự kiến trước khi tự thay đổi hướng thiết kế.

## Tài liệu bắt buộc phải đọc

Trước khi đề xuất template:

1. `DESIGN.md`
2. `docs/HANDOFF.md`
3. `docs/ui/TEMPLATE-CONTRACT.md`
4. `docs/ui/MOTION.md`
5. `docs/ui/TEMPLATE-QUALITY-CHECKLIST.md`
6. `docs/ui/TEMPLATE-MOODBOARDS.md`
7. `ASSET-SOURCES.md`

Đọc implementation của Pink Celebration, Sticker Book và Doodle Party để hiệu chỉnh quality bar. Đọc template gần concept mới nhất để tái sử dụng contract và kỹ thuật, không sao chép composition.

## Giai đoạn 1: audit reference và asset

Không sửa code ở giai đoạn này.

### Reference

Xác định:

- design grammar: palette, type, hierarchy, spacing, composition;
- portrait treatment và focal point;
- signature element;
- chi tiết nào chỉ phù hợp với thiệp mời tĩnh;
- chi tiết nào có thể chuyển thành motion hoặc interaction;
- nguy cơ giống Canva quá sát hoặc trùng template Birthday hiện có.

### Asset đầu vào

Người dùng có thể gửi file rời với tên mặc định. Tự preview và phân loại thành:

- `hero`;
- `portrait-frame`;
- `type-decoration`;
- `corner`;
- `ambient`;
- `particle`.

Với SVG, kiểm tra `viewBox`, whitespace, clipping, embedded raster, text chưa convert thành path, stroke, filter, ID collision, khả năng recolor và khả năng animate. Không crop asset theo khung vuông nếu việc đó làm mất cạnh artwork.

SVG lettering cố định như “Happy Birthday” có thể là graphic trang trí. Tên, ngày và lời chúc phải là text động; chọn font web tương đương có glyph tiếng Việt.

Người dùng xác nhận Canva asset được gửi là Free trừ khi họ nói khác. Ghi đây là xác nhận từ người dùng trong `ASSET-SOURCES.md`; không tuyên bố đã kiểm chứng độc lập nếu không có URL hoặc bằng chứng nguồn.

Không đưa nguyên SVG của toàn bộ Canva template vào production. Dùng nó làm reference để dựng composition responsive và motion riêng.

## Semantic motion: icon là diễn viên

Không gắn animation chung chung vào icon chỉ để màn hình chuyển động. Mỗi element quan trọng phải có vai trò trong câu chuyện và hành động có quan hệ nguyên nhân–kết quả với nội dung bên cạnh.

Trước khi viết keyframe, trả lời cho từng element được animate:

1. Nó là vật gì?
2. Vật đó chuyển động như thế nào trong đời thực hoặc trong visual metaphor của concept?
3. Nó liên hệ với headline, portrait, ngày, lời chúc hay CTA/payload?
4. Sự kiện nào kích hoạt hành động?
5. Sau hành động chính, trạng thái settled hoặc ambient của nó là gì?

Design proposal phải có bảng:

| Element | Narrative role | Trigger | Action | Settled/ambient state |
|---|---|---|---|---|

Ví dụ đúng tinh thần Birthday:

- mũ rơi vào headline rồi nghiêng chào sau khi chữ “Birthday” hoàn thành;
- bóng bay buộc vào portrait căng dây, kéo portrait lên sân khấu rồi cùng đung đưa;
- máy ảnh flash trước khi portrait từ từ hiện hình;
- nến lần lượt được thắp sau khi lời chúc xuất hiện và tiếp tục lung linh;
- phong bì đi theo tuyến thư rồi mở ra payload;
- hoa nở hoặc hướng về portrait khi người nhận xuất hiện;
- ruy băng tự tháo nút để reveal tên;
- confetti chỉ bùng ở cao trào, không chạy ngẫu nhiên từ đầu.

Mỗi template phải có ít nhất một signature interaction có nguyên nhân–kết quả. Giới hạn ở một hero interaction và khoảng hai đến ba supporting interactions; các decoration còn lại nên đứng yên hoặc làm ambient rất nhẹ.

Không mặc định dùng `float`, `pulse`, `spin` hoặc `pop`. Chỉ dùng khi có thể giải thích tại sao chuyển động đó thuộc về vật thể và hỗ trợ attention order. Ambient motion phải là dư âm hợp lý của hành động chính, không phải loop độc lập để lấp khoảng trống.

Nếu SVG có các bộ phận cần chuyển động khác nhau, ưu tiên tách hoặc inline chúng thành group có tên. Không làm méo toàn bộ artwork khi chỉ một bộ phận như dây, cánh, ngọn lửa hoặc nắp hộp cần chuyển động.

Mobile có thể rút ngắn quỹ đạo và giảm số supporting interactions nhưng phải giữ nguyên câu chuyện. Reduced motion phải hiển thị trạng thái kết thúc có ý nghĩa và không làm mất quan hệ giữa element với nội dung.

## Giai đoạn 2: design proposal

Trình bày ngắn gọn, ưu tiên quyết định có ảnh hưởng lớn:

1. Những gì sẽ giữ để đạt fidelity 80%.
2. Những gì phải đổi để phù hợp Birthday.
3. Palette và typography roles.
4. Signature moment.
5. Desktop composition.
6. Mobile composition và safe zones.
7. Motion storyboard: stage → headline → portrait → personalization → CTA/payload → ambient.
8. Bảng semantic motion: element → narrative role → trigger → action → settled/ambient state.
9. Mapping sang `CardConfig`.
10. Asset thiếu, rủi ro và cách xử lý.

Dừng lại chờ duyệt. Không bắt đầu implementation trong cùng lượt trình proposal.

## Giai đoạn 3: implementation

Sau khi người dùng duyệt:

- chuẩn hóa asset và tên file;
- tạo renderer/template route theo cấu trúc hiện tại;
- đăng ký metadata và thumbnail trong template registry;
- giữ toàn bộ personalization khi đổi template;
- cô lập HTML, CSS, asset và motion của template;
- dùng layout/keyframe mobile riêng khi transform desktop không còn đúng;
- cập nhật moodboard và `ASSET-SOURCES.md`;
- thêm regression test cho route và lỗi đặc thù.

Không thêm trường `CardConfig` chỉ để phục vụ một nhãn trang trí. Nếu cần field mới, chứng minh nó có ý nghĩa sản phẩm và có khả năng dùng lại.

## Giai đoạn 4: verification

Chạy test/build được khai báo trong repo và kiểm tra builder thực tế. Visual QA tối thiểu tại:

- 390×844;
- 768×1024;
- 1366×768;
- 1440×900.

Thử tên tiếng Việt dài, lời chúc dài, ảnh vuông/dọc/ngang, portrait position/scale, replay, keyboard, touch và `prefers-reduced-motion`.

Kiểm tra cả first paint lẫn trạng thái sau khi animation kết thúc. Không hoàn thành nếu headline hoặc glyph bị cắt, decoration che text/khuôn mặt, asset mất cạnh, có horizontal overflow, console error, missing asset hoặc CSS leakage.

Checklist release đầy đủ nằm tại `docs/ui/TEMPLATE-QUALITY-CHECKLIST.md`.

## Prompt cho task mới

```text
Đây là mẫu template Canva và đây là các element hỗ trợ bạn làm.

Hãy đọc docs/AI-TEMPLATE-PLAYBOOK.md và triển khai thành một template mới đúng chuẩn Birthday. Mức độ tương đồng cảm nhận mong muốn khoảng 80%.
```

Có thể bổ sung một câu về đối tượng hoặc motion nếu cần; mọi thông tin khác là tùy chọn.
