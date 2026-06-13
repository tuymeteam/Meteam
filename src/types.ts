export enum Category {
  Nuoc = 'Nước',
  Dien = 'Điện',
  MayLanh = 'Máy Lạnh',
  ChieuSang = 'Chiếu sáng',
  Khac = 'Khác'
}

export enum TaskStatus {
  ChuaBatDau = 'Chưa bắt đầu',
  DangThucHien = 'Đang thực hiện',
  ChoDuyet = 'Chờ duyệt',
  HoanThanh = 'Hoàn thành'
}

export enum Priority {
  Thap = 'Thấp',
  TrungBinh = 'Trung bình',
  Cao = 'Cao'
}

export interface Attachment {
  name: string;
  type: string; // mime-type e.g. "image/png"
  size: number; // in bytes
  data: string; // base64 representation
}

export interface Task {
  id: string;         // Mã công việc (Unique ID)
  category: Category; // Tên Danh Mục
  details: string;    // Nội dung chi tiết
  assignee: string;   // Người được giao
  creator: string;    // Người giao việc (Initial: USEREMAIL())
  status: TaskStatus; // Trạng thái
  priority: Priority; // Độ ưu tiên
  dueDate: string;    // Hạn hoàn thành
  attachment?: Attachment; // Hình ảnh/Tài liệu đính kèm
  createdAt: string;  // Thời gian tạo để sắp xếp
}
