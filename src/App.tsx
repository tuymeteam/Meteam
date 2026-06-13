import React, { useState, useEffect } from 'react';
import { Task, Category, TaskStatus, Priority } from './types';
import { MOCK_TASKS, INITIAL_USER_EMAIL } from './mockData';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetailModal from './components/TaskDetailModal';
import ShareModal from './components/ShareModal';
import { 
  Building2, 
  LayoutDashboard, 
  KanbanSquare, 
  ListTodo, 
  PlusCircle, 
  Mail, 
  RefreshCw, 
  Download, 
  Upload, 
  ShieldAlert,
  Moon,
  Sun,
  UserCheck,
  Shield,
  Users,
  CheckCircle,
  Lock,
  ArrowRight,
  LogOut,
  Settings,
  AlertCircle,
  Wrench,
  Share2,
  Copy,
  Check
} from 'lucide-react';

const STORAGE_KEY = 'quanly_congviec_tasks';

const STAFF_LIST = [
  "NV1: Dũng",
  "NV2: Minh Đạt",
  "NV3: Đạt Phan"
];

export default function App() {
  // Global States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(INITIAL_USER_EMAIL);
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'board' | 'list'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  
  // Category filter shared state (useful when user clicks on dashboard category, it switches to List tab pre-filtered!)
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

  // Multi-user simulation state
  const [isSimulatingUser, setIsSimulatingUser] = useState(false);
  const [tempEmailInput, setTempEmailInput] = useState(INITIAL_USER_EMAIL);

  // Role switching states
  const [activeApp, setActiveApp] = useState<'portal' | 'admin' | 'staff'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'admin' || appParam === 'staff' || appParam === 'portal') {
        localStorage.setItem('active_app', appParam);
        return appParam;
      }
    }
    const saved = localStorage.getItem('active_app');
    if (saved === 'admin' || saved === 'staff') {
      return saved;
    }
    return 'portal';
  });
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'staff'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'staff') return 'staff';
      if (appParam === 'admin') return 'admin';
    }
    const saved = localStorage.getItem('active_app');
    return saved === 'staff' ? 'staff' : 'admin';
  });
  const [currentStaffName, setCurrentStaffName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const staffParam = params.get('staff');
      if (staffParam) {
        localStorage.setItem('active_staff_name', staffParam);
        return staffParam;
      }
    }
    return localStorage.getItem('active_staff_name') || 'NV1: Dũng';
  });
  const [staffFilterOnly, setStaffFilterOnly] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync activeApp with local state configurations
  useEffect(() => {
    localStorage.setItem('active_app', activeApp);
    if (activeApp === 'admin') {
      setCurrentUserRole('admin');
      setStaffFilterOnly(false);
    } else if (activeApp === 'staff') {
      setCurrentUserRole('staff');
      setStaffFilterOnly(true);
      localStorage.setItem('active_staff_name', currentStaffName);
    }
  }, [activeApp, currentStaffName]);

  // Load initial tasks from storage or seed mock data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (err) {
        setTasks(MOCK_TASKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
      }
    } else {
      setTasks(MOCK_TASKS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
    }
  }, []);

  // Sync state with storage
  const saveToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  // Create or Update task
  const handleSaveTask = (savedTask: Task) => {
    let updated: Task[];
    const exists = tasks.some(t => t.id === savedTask.id);
    
    if (exists) {
      updated = tasks.map(t => t.id === savedTask.id ? savedTask : t);
    } else {
      updated = [savedTask, ...tasks];
    }
    
    saveToStorage(updated);
    setIsFormOpen(false);
    setTaskToEdit(undefined);

    // If detail modal is currently open for this task, refresh it as well!
    if (selectedTask && selectedTask.id === savedTask.id) {
      setSelectedTask(savedTask);
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveToStorage(updated);
    setSelectedTask(null);
  };

  // Quick State upgrade from board or details
  const handleChangeStatus = (id: string, newStatus: TaskStatus) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    saveToStorage(updated);
    
    // Auto-update details if currently viewing it
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
  };

  // Category filter trigger clicked on Dashboard
  const handleDashboardCategoryFilter = (cat: Category | 'All') => {
    setCategoryFilter(cat);
    setSelectedTab('list'); // automatically jump to search list preloaded with this category!
  };

  // Reset to original seed database state
  const handleResetDatabase = () => {
    if (window.confirm('Hành động này sẽ xóa các công việc hiện tại và khôi phục về dữ liệu mẫu mặc định. Bạn có muốn tiếp tục?')) {
      saveToStorage(MOCK_TASKS);
      setCategoryFilter('All');
    }
  };

  // Export JSON Task catalog
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quanly_congviec_backup_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Task catalog
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Basic schema checking
            const isValid = parsed.every(item => item && item.id && item.category && item.details);
            if (isValid) {
              saveToStorage(parsed);
              alert(`Nhập thành công ${parsed.length} công việc từ tệp lưu trữ!`);
            } else {
              alert('Tệp tin không đúng định dạng mẫu lưu trữ công việc công ty.');
            }
          } else {
            alert('Định dạng tệp tin lưu trữ phải là một danh sách JSON.');
          }
        } catch (err) {
          alert('Không thể đọc được tệp tin này, tệp tin bị lỗi cấu trúc.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Simulating user email toggler
  const applySimulatedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEmailInput.trim()) {
      setCurrentUserEmail(tempEmailInput.trim());
      setIsSimulatingUser(false);
    }
  };

  // Filter tasks if in staff role with staff filter active
  const visibleTasks = (currentUserRole === 'staff' && staffFilterOnly) 
    ? tasks.filter(t => t.assignee === currentStaffName)
    : tasks;

  // Render Cổng Thông Tin Portal (Lựa chọn phân hệ Admin / Nhân Viên độc lập)
  if (activeApp === 'portal') {
    const portalTotal = tasks.length;
    const portalCompleted = tasks.filter(t => t.status === TaskStatus.HoanThanh).length;
    const portalPending = tasks.filter(t => t.status !== TaskStatus.HoanThanh).length;

    return (
      <div className="min-h-screen bg-slate-900 font-sans flex flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Grid Network & Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>
        <div className="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Global Portal Top Bar */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3.5 select-none">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40 shrink-0">
              <Building2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase">HỆ THỐNG QUẢN LÝ CÔNG VIỆC</h1>
              <p className="text-[10px] text-slate-450 font-bold tracking-widest uppercase text-slate-400">Điều phối, Sửa chữa & Bảo trì kỹ thuật</p>
            </div>
          </div>
          <div className="text-[11px] font-extrabold text-slate-300 bg-slate-800/65 px-4 py-2 border border-slate-700/50 rounded-2xl flex items-center space-x-2 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-450 animate-pulse bg-emerald-450"></span>
            <span className="tracking-wider uppercase">MÁY CHỦ KỸ THUẬT ONLINE</span>
          </div>
        </header>

        {/* Dynamic App Options (Tách biệt Admin & Staff) */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10 flex flex-col justify-center flex-1">
          <div className="text-center mb-10 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
              CỔNG PHÂN HỆ LÀM VIỆC ĐỘC LẬP
            </h2>
            <p className="text-slate-300 mt-3 text-sm sm:text-base font-medium">
              Vui lòng lựa chọn giao diện làm việc thích hợp. Chương trình tự động áp dụng chế độ bảo mật và đặc quyền nghiệp vụ tùy chỉnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch animate-fade-in">
            
            {/* 1. ADMIN CARD & SUB-INTERFACE */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/55 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-2xl shadow-black/40 relative group backdrop-blur-md">
              <div className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-widest">
                ĐIỀU PHỐI CHÍNH
              </div>
              
              <div>
                <div className="w-12 h-12 bg-indigo-500/15 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/25 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-550 transition-all duration-300 shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-400 transition-all duration-200">ADMIN APP (Tuy Trần)</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Hệ điều hành giao việc & Phê duyệt tổng</p>
                
                <ul className="text-xs text-slate-300 mt-6 space-y-3">
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><b>Toàn quyền hệ thống</b>: Khởi động, bàn giao, biên tập và xóa vĩnh viễn các phiếu sự cố.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><b>Nghiệm thu tiến trình</b>: Theo dõi biểu đồ tổng quan, trực ban phê chuẩn bàn giao từ kỹ thuật viên.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><b>Quản trị kỹ thuật</b>: Đặt lại dữ liệu gốc, sao lưu & khôi phục danh mục công việc JSON nhanh chóng.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveApp('admin');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm py-4 px-5 rounded-2xl shadow-lg shadow-indigo-900/55 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98] select-none"
                >
                  <span>Truy cập Quản Trị (Tuy Trần)</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 2. STAFF CARD & SUB-INTERFACE */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/55 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-2xl shadow-black/40 relative group backdrop-blur-md">
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                KIỂM SOÁT THỰC ĐỊA
              </div>
              
              <div>
                <div className="w-12 h-12 bg-emerald-500/15 text-emerald-450 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/25 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-550 transition-all duration-300 shadow-md">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-450 transition-all duration-200">STAFF APP (Kỹ thuật viên)</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Cổng nhận nhiệm vụ & Gửi báo cáo tiến trình</p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-slate-900/65 rounded-2xl p-3 border border-slate-700/60">
                    <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1.5">
                      Chọn Tên Của Bạn Để Đăng Nhập:
                    </label>
                    <select
                      value={currentStaffName}
                      onChange={(e) => setCurrentStaffName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl text-xs px-3 py-2.5 text-white font-bold cursor-pointer"
                    >
                      {STAFF_LIST.map((staff) => (
                        <option key={staff} value={staff} className="bg-slate-900 text-white font-bold">
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-3">
                    <li className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                      <span><b>Bảo mật thông tin</b>: Hệ thống chỉ hiển thị các công việc được giao riêng cho tài khoản của bạn.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                      <span><b>Báo cáo tức thời</b>: Cập nhật nhanh trạng thái công việc và đính kèm tệp tin hình ảnh làm minh chứng.</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></span>
                      <span><b>Cam kết thi hành</b>: Không thể tùy chỉnh thay đổi các thông số lõi như Hạn hoàn thành, Độ ưu tiên.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveApp('staff');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-4 px-5 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98] select-none"
                >
                  <Wrench className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span>Xác nhận & Vào Phân Hệ Nhân Viên</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Counter overview */}
          <div className="grid grid-cols-3 gap-4 text-center py-4.5 px-6 bg-slate-800/20 border border-slate-700/35 rounded-2xl mt-8 max-w-md mx-auto backdrop-blur-md shadow-md">
            <div>
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider text-slate-400">Tổng Phiếu Việc</p>
              <h4 className="text-lg font-black text-white mt-0.5">{portalTotal}</h4>
            </div>
            <div className="border-x border-slate-700/50">
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider text-amber-500">Đang Thực Hiện</p>
              <h4 className="text-lg font-black text-amber-500 mt-0.5">{portalPending}</h4>
            </div>
            <div>
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider text-emerald-400">Đã Hoàn Thành</p>
              <h4 className="text-lg font-black text-emerald-400 mt-0.5">{portalCompleted}</h4>
            </div>
          </div>

        </main>

        {/* Global Footer */}
        <footer className="py-6 border-t border-slate-800/50 max-w-7xl mx-auto px-4 w-full z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="font-semibold text-center sm:text-left text-slate-500">
            Hệ thống Quản lý Sự cố & Phân phối Kỹ thuật © 2026. Phân định vai trò nghiệp vụ tiêu chuẩn Tuy Trần.
          </p>
          <div className="flex space-x-4 font-bold text-slate-400">
            <span>Phiên bản v2.5.0</span>
            <span>|</span>
            <span>Enterprise Gateway Portal</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Dynamic header with different styles for Admin (Dark Indigo) and Staff (Dark Emerald) */}
      <header className={`sticky top-0 z-40 shadow-md border-b transition-all duration-300 ${
        currentUserRole === 'admin' 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-emerald-950 border-emerald-900 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and App Brand Title */}
            <div className="flex items-center space-x-3 select-none">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 transition-all duration-300 ${
                currentUserRole === 'admin' ? 'bg-indigo-600 shadow-indigo-900/40' : 'bg-emerald-600 shadow-emerald-950/40'
              }`}>
                {currentUserRole === 'admin' ? <Shield className="w-5 h-5 text-indigo-100" /> : <Wrench className="w-5 h-5 text-emerald-100" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-black tracking-wide whitespace-nowrap uppercase">
                    {currentUserRole === 'admin' ? 'Hệ Thống Quản Trị' : 'Phân Hệ Kỹ Thuật'}
                  </h1>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border tracking-wider shrink-0 hidden xs:inline-block transition-all ${
                    currentUserRole === 'admin' 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-550/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-550/30'
                  }`}>
                    {currentUserRole === 'admin' ? 'ADMIN APP' : 'STAFF APP'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  {currentUserRole === 'admin' 
                    ? 'Tuy Trần (Người Điều phối)' 
                    : `Kỹ thuật viên: ${currentStaffName}`}
                </p>
              </div>
            </div>

            {/* Middle Quick Info Badge */}
            {currentUserRole === 'staff' ? (
              <div className="hidden md:flex items-center space-x-2 bg-emerald-900/35 border border-emerald-800/80 px-3.5 py-1.5 rounded-full select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-350 font-bold">Chỉ hiển thị công việc kỹ thuật được giao</span>
              </div>
            ) : (
              isSimulatingUser && (
                <div className="hidden lg:flex items-center space-x-2 bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Người tạo làm việc: {currentUserEmail}</span>
                </div>
              )
            )}

            {/* Right Side Header controls */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5">
              
              {/* Optional Admin SIM button */}
              {currentUserRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => setIsSimulatingUser(!isSimulatingUser)}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition duration-150 cursor-pointer border border-slate-700/60"
                  title="Thay đổi tên người giao việc mặc định"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Đổi người giao</span>
                </button>
              )}

              {/* Admin-only direct Create Task button */}
              {currentUserRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setTaskToEdit(undefined);
                    setIsFormOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4.5 py-2 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-950/60 transition duration-150 cursor-pointer select-none"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-200" />
                  <span>Giao Việc</span>
                </button>
              )}

              {/* Back to Portal (Switch Roles) logout button */}
              <button
                type="button"
                onClick={() => {
                  if (currentUserRole === 'admin' || window.confirm('Quay lại cổng thông tin chính và đổi phân hệ làm việc?')) {
                    setActiveApp('portal');
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-black rounded-xl border transition duration-150 cursor-pointer select-none active:scale-[0.98] ${
                  currentUserRole === 'admin'
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
                    : 'border-emerald-800 hover:bg-emerald-900/60 hover:border-emerald-700 text-emerald-200 hover:text-white'
                }`}
                title="Quay lại cổng thông tin chính"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Thoát Phân Hệ</span>
              </button>

            </div>

          </div>
        </div>

        {/* User simulated email editing panel (Admin only) */}
        {currentUserRole === 'admin' && isSimulatingUser && (
          <div className="bg-slate-800 border-t border-slate-700/60 p-3 animate-fade-in text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
                <p className="font-semibold text-slate-300">
                  Phân quyền Người Giao Việc: Bạn có thể thay đổi tên người giao việc mặc định khi tạo mới yêu cầu kỹ thuật.
                </p>
              </div>
              <form onSubmit={applySimulatedUser} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  className="px-3 py-1.5 text-xs border border-slate-750 bg-slate-900 focus:border-indigo-500 rounded-lg text-white font-medium"
                  value={tempEmailInput}
                  onChange={(e) => setTempEmailInput(e.target.value)}
                  placeholder="Nhập họ tên người giao..."
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-[11px] rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Workspace Menu navigation Tabs */}
      <nav className="bg-white border-b border-slate-150 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
            
            {/* Nav Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden sm:inline-block">Mục Home ›</span>
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-none">
                
                <button
                  onClick={() => { setSelectedTab('dashboard'); }}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedTab === 'dashboard' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span>Tổng quan</span>
                </button>

                <button
                  onClick={() => { setSelectedTab('board'); }}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedTab === 'board' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KanbanSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>Kanban</span>
                </button>

                <button
                  onClick={() => { setSelectedTab('list'); }}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedTab === 'list' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ListTodo className="w-3.5 h-3.5 shrink-0" />
                  <span>Việc Chi Tiết</span>
                </button>

              </div>
            </div>

            {/* Utility Deck (Import Export backup, Seed database) - ADMIN ONLY */}
            {currentUserRole === 'admin' ? (
              <div className="flex items-center space-x-3 text-xs self-end sm:self-center">
                
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-1.5 px-3.5 text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-650 border border-indigo-200 hover:border-indigo-600 rounded-xl flex items-center space-x-1.5 font-bold transition duration-150 cursor-pointer shadow-sm"
                  title="Chia sẻ đường dẫn truy cập và mời nhân viên"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Chia sẻ App</span>
                </button>

                <button
                  onClick={handleExportBackup}
                  className="p-1 px-2.5 text-slate-500 hover:text-slate-700 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 font-bold transition cursor-pointer"
                  title="Xuất file lưu trữ JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sao lưu</span>
                </button>

                <label
                  className="p-1 px-2.5 text-slate-500 hover:text-slate-700 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 font-bold transition cursor-pointer select-none"
                  title="Nhập dữ liệu từ file JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Khôi phục</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImportBackup}
                    accept=".json"
                  />
                </label>

                <button
                  onClick={handleResetDatabase}
                  className="p-1 px-2.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg flex items-center space-x-1.5 font-bold transition cursor-pointer"
                  title="Khôi phục lại dữ liệu gốc ban đầu"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đặt Lại</span>
                </button>

              </div>
            ) : (
              <div className="text-xs font-bold self-end sm:self-center bg-emerald-50 text-emerald-800 border border-emerald-150 px-3.5 py-1.5 rounded-xl select-none">
                Đăng nhập: {currentStaffName}
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Main active layout viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="animate-fade-in">
          {selectedTab === 'dashboard' && (
            <Dashboard 
              tasks={visibleTasks} 
              onSelectTask={setSelectedTask} 
              onFilterCategory={handleDashboardCategoryFilter} 
            />
          )}

          {selectedTab === 'board' && (
            <TaskBoard 
              tasks={visibleTasks} 
              currentUserRole={currentUserRole}
              currentStaffName={currentStaffName}
              onSelectTask={setSelectedTask} 
              onAddTask={() => {
                setTaskToEdit(undefined);
                setIsFormOpen(true);
              }} 
              onChangeStatus={handleChangeStatus}
            />
          )}

          {selectedTab === 'list' && (
            <TaskList 
              tasks={visibleTasks} 
              currentUserRole={currentUserRole}
              currentStaffName={currentStaffName}
              onSelectTask={setSelectedTask} 
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsFormOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onAddTask={() => {
                setTaskToEdit(undefined);
                setIsFormOpen(true);
              }}
              categoryFilter={categoryFilter}
              onFilterCategory={setCategoryFilter}
            />
          )}
        </div>
      </main>

      {/* Footer information section */}
      <footer className="bg-white border-t border-slate-100 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            Hệ hỗ trợ điều hành quản lý công việc bảo trì & kỹ thuật © 2026. Thiết kế đạt chuẩn UI/UX trực quan.
          </p>
          <div className="flex space-x-4 text-xs font-bold text-slate-500">
            <span>Phiên bản v2.5.0</span>
            <span className="text-slate-300">|</span>
            <span>Chạy trên môi trường Máy ảo an toàn</span>
          </div>
        </div>
      </footer>

      {/* Global Form Modal: Create & Edit Task */}
      {isFormOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          currentUserEmail={currentUserEmail}
          existingTasks={tasks}
          onSave={handleSaveTask}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(undefined);
          }}
        />
      )}

      {/* Global Task Inspection Details Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          currentUserRole={currentUserRole}
          currentStaffName={currentStaffName}
          onClose={() => setSelectedTask(null)}
          onEdit={(task) => {
            setSelectedTask(null);
            setTaskToEdit(task);
            setIsFormOpen(true);
          }}
          onDelete={(id) => {
            handleDeleteTask(id);
          }}
          onChangeStatus={handleChangeStatus}
        />
      )}

      {/* Global Share App Link Modal */}
      {isShareModalOpen && (
        <ShareModal
          staffList={STAFF_LIST}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

    </div>
  );
}
