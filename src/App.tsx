import React, { useState, useEffect } from 'react';
import { Task, Category, TaskStatus, Priority } from './types';
import { MOCK_TASKS, INITIAL_USER_EMAIL } from './mockData';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetailModal from './components/TaskDetailModal';
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
  UserCheck
} from 'lucide-react';

const STORAGE_KEY = 'quanly_congviec_tasks';

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Top Banner & Multi-user verification bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Title Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3 select-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide whitespace-nowrap">Quản Lý Công Việc</h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase hidden sm:block">Hệ Thống Phân Công Kỹ Thuật</p>
              </div>
            </div>

            {/* Quick Session user / simulator (Giao việc) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              <div className="hidden md:flex items-center space-x-2 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-full">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[11px] text-slate-500 font-semibold">Người giao việc mặc định:</span>
                <span className="text-xs font-bold text-slate-800">{currentUserEmail}</span>
                
                <button 
                  onClick={() => {
                    setTempEmailInput(currentUserEmail);
                    setIsSimulatingUser(!isSimulatingUser);
                  }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline ml-1 cursor-pointer"
                >
                  [Thay đổi]
                </button>
              </div>

              {/* Mobile Profile Trigger */}
              <button 
                onClick={() => {
                  setTempEmailInput(currentUserEmail);
                  setIsSimulatingUser(!isSimulatingUser);
                }}
                className="md:hidden p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                title="Thay đổi user"
              >
                <UserCheck className="w-4.5 h-4.5 text-indigo-600" />
              </button>

              {/* Create job shortcut */}
              <button
                onClick={() => {
                  setTaskToEdit(undefined);
                  setIsFormOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-150 transition cursor-pointer select-none"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Giao Việc</span>
              </button>

            </div>

          </div>
        </div>

        {/* User simulated editing bar */}
        {isSimulatingUser && (
          <div className="bg-indigo-50 border-y border-indigo-100 p-3 animate-fade-in text-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                <p className="font-semibold text-indigo-900">
                  Phân quyền Người Giao Việc: Bạn có thể thay đổi tên người giao việc mặc định khi tạo mới yêu cầu.
                </p>
              </div>
              <form onSubmit={applySimulatedUser} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  className="px-2.5 py-1 text-xs border border-indigo-200 focus:border-indigo-500 rounded bg-white flex-1 sm:w-60 font-semibold text-slate-800"
                  value={tempEmailInput}
                  onChange={(e) => setTempEmailInput(e.target.value)}
                  placeholder="Nhập họ tên người giao..."
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 text-white font-bold text-[11px] rounded hover:bg-indigo-700 cursor-pointer"
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

            {/* Utility Deck (Import Export backup, Seed database) */}
            <div className="flex items-center space-x-3 text-xs self-end sm:self-center">
              
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

          </div>
        </div>
      </nav>

      {/* Main active layout viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="animate-fade-in">
          {selectedTab === 'dashboard' && (
            <Dashboard 
              tasks={tasks} 
              onSelectTask={setSelectedTask} 
              onFilterCategory={handleDashboardCategoryFilter} 
            />
          )}

          {selectedTab === 'board' && (
            <TaskBoard 
              tasks={tasks} 
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
              tasks={tasks} 
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

    </div>
  );
}
