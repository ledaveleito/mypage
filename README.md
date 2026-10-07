# Personal portfolio

Website tĩnh dùng HTML, CSS và JavaScript thuần. Nội dung hiển thị được quản lý tại **[data/content.json](data/content.json)**; không cần sửa HTML khi thêm bài viết hay thẻ thông tin.

## Chỉnh nội dung

Mở `data/content.json` và sửa các nhóm:

| Nhóm | Hiển thị ở đâu |
| --- | --- |
| `site` | Tên, giới thiệu, avatar và nút resume |
| `about` | Mục About |
| `achievements` | Các thành tích |
| `experience` | Trang Activities và mục nổi bật trên trang chủ |
| `blogs` | Trang Blogs, mục nổi bật và trang bài viết |
| `projects` | Trang Projects và mục nổi bật |
| `contact` | Các liên kết liên hệ |

Mỗi mục trong `blogs`, `experience` và `projects` có `id` **duy nhất trong nhóm**. Thêm mục mới vào mảng tương ứng; thẻ danh sách và trang chi tiết sẽ xuất hiện sau khi tải lại trang. Ba mục đầu tiên của mỗi nhóm cũng xuất hiện ở trang chủ.

Ví dụ thêm một bài blog:

```json
{
  "id": "my-new-post",
  "title": "My new post",
  "meta": "October 2026",
  "summary": "A short introduction shown on the card.",
  "image": "images/blog/my-new-post.jpg",
  "content": [
    { "type": "paragraph", "text": "The opening paragraph." },
    { "type": "heading", "text": "What I learned" },
    { "type": "list", "items": ["First idea", "Second idea"] },
    { "type": "code", "text": "console.log('hello');" },
    { "type": "quote", "text": "A short quotation." },
    { "type": "link", "text": "Further reading", "url": "https://example.com" }
  ]
}
```

`image` là tùy chọn; nếu dùng, đặt ảnh trong thư mục `images/` và dùng đường dẫn tương đối như ví dụ. Nội dung hỗ trợ `paragraph`, `heading`, `list` (thêm `"ordered": true` để đánh số), `code`, `quote`, `image` (dùng `src`, `alt`, `caption`) và `link` (dùng `text`, `url`). Văn bản được hiển thị an toàn như chữ thuần, không thực thi HTML.

### Liên kết GitHub của dự án

Trong mỗi mục của `projects`, nhập URL repository vào `githubUrl` để hiện nút **Source** trên thẻ dự án và trang chi tiết:

```json
{
  "id": "my-project",
  "title": "My project",
  "meta": "Web Development",
  "summary": "A short description.",
  "githubUrl": "https://github.com/username/repository",
  "tags": ["JavaScript", "CSS"]
}
```

URL cần bắt đầu bằng `https://github.com/` và có tên người dùng cùng tên repository. Để `"githubUrl": ""` khi chưa có repo; nút Source sẽ tự ẩn. Dự án Portfolio Website đã được điền URL từ remote Git của source hiện tại.

Trong `contact`, dùng `icon` với một trong các giá trị `github`, `facebook`, `linkedin`, `email`, `instagram`, `discord`, `phone`; hoặc dùng `iconImage` trỏ tới ảnh trong `images/` như VNOI, Codeforces và LeetCode.

Các mô tả bài viết cũ đã được giữ làm nội dung khởi đầu trong JSON. Bạn có thể mở rộng mảng `content` để viết bài đầy đủ.

Sau khi sửa JSON, chạy `.\check-content.cmd` trong PowerShell để kiểm tra cú pháp, ID trùng và đường dẫn ảnh. Lệnh này dùng Node.js đi kèm Codex nên không cần cài thêm Node.js.

## Xem trước

Cần mở website qua máy chủ web vì trình duyệt thường chặn việc đọc JSON khi mở trực tiếp `index.html` bằng `file://`.

```powershell
cd "D:\CV And Portfolio\mypage"
.\preview.cmd
```

Lệnh trên dùng Node.js đi kèm Codex để chạy server. Sau đó mở http://127.0.0.1:4173 và tải lại trang nếu trình duyệt còn hiển thị lỗi cũ. Giữ cửa sổ PowerShell mở trong lúc xem, nhấn Ctrl+C để dừng. Nếu port 4173 đã được dùng, bản xem trước có thể đang chạy sẵn. Trang cũng chạy trên GitHub Pages; không cần cài thư viện hoặc chạy bước build.

## Cấu trúc

```text
data/content.json       Nội dung cần chỉnh
js/script.js            Bộ dựng giao diện và trang chi tiết
css/style.css           Giao diện chung
index.html              Trang chủ
experience.html         Danh sách hoạt động (Activities)
blogs.html              Danh sách blog
projects.html           Danh sách dự án
post.html               Trang chi tiết dùng chung
images/                 Ảnh
resume.pdf              Resume được liên kết từ trang chủ
tools/preview.cjs       Máy chủ xem trước tại máy
preview.cmd             Khởi chạy trên Windows bằng Node.js đi kèm Codex
tools/check-content.cjs Kiểm tra dữ liệu và đường dẫn ảnh
check-content.cmd       Kiểm tra dữ liệu trên Windows
```
