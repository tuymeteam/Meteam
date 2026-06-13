import { Task, Category, TaskStatus, Priority } from './types';

export const INITIAL_USER_EMAIL = 'Tuy Trần';

const demoImages = {
  ac: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%23e0f2fe"/><text x="50%" y="55%" font-family="sans-serif" font-size="10" fill="%230284c7" text-anchor="middle">MayLanh.jpg</text></svg>',
  power: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%23fef3c7"/><text x="50%" y="55%" font-family="sans-serif" font-size="10" fill="%23d97706" text-anchor="middle">HeThongDien.jpg</text></svg>',
  water: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%23dcfce7"/><text x="50%" y="55%" font-family="sans-serif" font-size="10" fill="%2316a34a" text-anchor="middle">OngNuoc.jpg</text></svg>',
};

export const MOCK_TASKS: Task[] = [
  {
    id: "JOB-2508",
    category: Category.Dien,
    details: "Khắc phục sự cố aptomat tổng tầng 4 nhảy liên tục. Nghi ngờ quá tải cục bộ hoặc chập điện tại dãy bàn làm việc phía Tây.",
    assignee: "NV1: Dũng",
    creator: INITIAL_USER_EMAIL,
    status: TaskStatus.DangThucHien,
    priority: Priority.Cao,
    dueDate: "2026-06-15",
    createdAt: "2026-06-12T08:30:00Z",
    attachment: {
      name: "Sodo_dien_tang4.png",
      type: "image/svg+xml",
      size: 1540,
      data: demoImages.power
    }
  },
  {
    id: "JOB-1902",
    category: Category.Nuoc,
    details: "Thay thế vòi xịt vệ sinh bị rò rỉ nước ở buồng WC nam tầng trệt. Cần khoá van tổng chịu lực trước khi tháo lắp.",
    assignee: "NV2: Minh Đạt",
    creator: INITIAL_USER_EMAIL,
    status: TaskStatus.ChuaBatDau,
    priority: Priority.TrungBinh,
    dueDate: "2026-06-18",
    createdAt: "2026-06-11T14:15:00Z"
  },
  {
    id: "JOB-8831",
    category: Category.MayLanh,
    details: "Vệ sinh lưới lọc bụi và đo lượng gas nạp cho chuỗi máy lạnh âm trần cassette tại Phòng Họp Lớn số 1 (Tầng 2). Khách hàng phản hồi điều hòa thổi gió mát yếu quá.",
    assignee: "NV3: Đạt Phan",
    creator: INITIAL_USER_EMAIL,
    status: TaskStatus.ChoDuyet,
    priority: Priority.Cao,
    dueDate: "2026-06-14",
    createdAt: "2026-06-12T10:00:00Z",
    attachment: {
      name: "Minh_chung_gas_nhietdo.jpg",
      type: "image/svg+xml",
      size: 1820,
      data: demoImages.ac
    }
  },
  {
    id: "JOB-4072",
    category: Category.ChieuSang,
    details: "Thay mới 4 bóng đèn LED máng âm trần bị hỏng nhấp nháy liên tục tại hành lang phía sau thang máy tầng 5.",
    assignee: "NV1: Dũng",
    creator: INITIAL_USER_EMAIL,
    status: TaskStatus.HoanThanh,
    priority: Priority.Thap,
    dueDate: "2026-06-12",
    createdAt: "2026-06-10T09:00:00Z"
  },
  {
    id: "JOB-9104",
    category: Category.Khac,
    details: "Lắp đặt lại bản lề cửa cách âm chống cháy phòng máy chủ (Server Room) tầng lửng. Cửa bị xệ cánh gây khó khăn khi đóng kín.",
    assignee: "NV2: Minh Đạt",
    creator: INITIAL_USER_EMAIL,
    status: TaskStatus.DangThucHien,
    priority: Priority.TrungBinh,
    dueDate: "2026-06-20",
    createdAt: "2026-06-11T07:45:00Z"
  }
];
