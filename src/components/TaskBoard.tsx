import React, { useState } from 'react';
import { Task, Category, TaskStatus, Priority } from '../types';
import { 
  Plus, 
  Calendar, 
  User, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  Droplet,
  Zap,
  Tv,
  Lightbulb,
  Layers,
  ChevronRight
} from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  onChangeStatus: (id: string, newStatus: TaskStatus) => void;
  currentUserRole?: 'admin' | 'staff';
  currentStaffName?: string;
}

export default function TaskBoard({ 
  tasks, 
  onSelectTask, 
  onAddTask, 
  onChangeStatus,
  currentUserRole = 'admin',
  currentStaffName = ''
}: TaskBoardProps) {
  // Mobile active status column state
  const [activeMobileCol, setActiveMobileCol] = useState<TaskStatus>(TaskStatus.ChuaBatDau);

  const columns: { status: TaskStatus; title: string; color: string; bg: string; dot: string }[] = [
    { 
      status: TaskStatus.ChuaBatDau, 
      title: 'Chưa bắt đầu', 
      color: 'text-zinc-700 bg-zinc-100 border-zinc-200', 
      bg: 'bg-zinc-50/50',
      dot: 'bg-zinc-400'
    },
    { 
      status: TaskStatus.DangThucHien, 
      title: 'Đang thực hiện', 
      color: 'text-amber-700 bg-amber-50 border-amber-200', 
      bg: 'bg-amber-50/10',
      dot: 'bg-amber-500 font-extrabold shadow-sm'
    },
    { 
      status: TaskStatus.ChoDuyet, 
      title: 'Chờ duyệt', 
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200', 
      bg: 'bg-indigo-50/10',
      dot: 'bg-indigo-500'
    },
    { 
      status: TaskStatus.HoanThanh, 
      title: 'Hoàn thành', 
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200', 
      bg: 'bg-emerald-50/10',
      dot: 'bg-emerald-500'
    }
  ];

  const categoryColors = {
    [Category.Nuoc]: { bg: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Droplet className="w-3.5 h-3.5" /> },
    [Category.Dien]: { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Zap className="w-3.5 h-3.5" /> },
    [Category.MayLanh]: { bg: 'bg-sky-50 text-sky-700 border-sky-100', icon: <Tv className="w-3.5 h-3.5" /> },
    [Category.ChieuSang]: { bg: 'bg-yellow-50 text-yellow-800 border-yellow-100', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    [Category.Khac]: { bg: 'bg-slate-50 text-slate-700 border-slate-100', icon: <Layers className="w-3.5 h-3.5" /> },
  };

  const priorityColors = {
    [Priority.Thap]: 'bg-slate-100 text-slate-600',
    [Priority.TrungBinh]: 'bg-amber-100 text-amber-700',
    [Priority.Cao]: 'bg-rose-100 text-rose-700',
  };

  // Status linear movement helper
  const nextStatus = (curr: TaskStatus): TaskStatus | null => {
    switch (curr) {
      case TaskStatus.ChuaBatDau: return TaskStatus.DangThucHien;
      case TaskStatus.DangThucHien: return TaskStatus.ChoDuyet;
      case TaskStatus.ChoDuyet: 
        // Only admin can transition to Completed!
        if (currentUserRole === 'staff') return null;
        return TaskStatus.HoanThanh;
      default: return null;
    }
  };

  const prevStatus = (curr: TaskStatus): TaskStatus | null => {
    switch (curr) {
      case TaskStatus.HoanThanh: 
        // Only admin can pull tasks back from Completed!
        if (currentUserRole === 'staff') return null;
        return TaskStatus.ChoDuyet;
      case TaskStatus.ChoDuyet: return TaskStatus.DangThucHien;
      case TaskStatus.DangThucHien: return TaskStatus.ChuaBatDau;
      default: return null;
    }
  };

  const canTransition = (task: Task): boolean => {
    if (currentUserRole !== 'staff') return true;
    return task.assignee === currentStaffName;
  };

  return (
    <div className="space-y-4">
      
      {/* Mobile-Only Horizontal Columns Navigation Slider */}
      <div className="md:hidden flex space-x-1.5 overflow-x-auto p-1 bg-slate-100 rounded-2xl border border-slate-200 scrollbar-none">
        {columns.map((col) => {
          const count = tasks.filter(t => t.status === col.status).length;
          const isActive = activeMobileCol === col.status;
          return (
            <button
              key={col.status}
              onClick={() => setActiveMobileCol(col.status)}
              className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition cursor-pointer ${
                isActive 
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span>{col.title.split(' ')[0]}</span>
              <span className="bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Responsive Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.status);
          const isMobileVisible = activeMobileCol === col.status;

          return (
            <div 
              key={col.status} 
              className={`border border-slate-150 rounded-2xl overflow-hidden ${col.bg} flex flex-col min-h-[380px] md:min-h-[450px] shadow-xs transition-all duration-300 ${
                isMobileVisible ? 'flex' : 'hidden md:flex'
              }`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <h3 className="font-bold text-slate-800 text-sm tracking-wide">{col.title}</h3>
                </div>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks list */}
              <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] md:max-h-[640px]">
                {colTasks.map((task) => {
                  const catStyle = categoryColors[task.category];
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.HoanThanh;

                  return (
                    <div 
                      key={task.id}
                      className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top labels */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.bg}`}>
                            {catStyle.icon}
                            <span>{task.category}</span>
                          </span>
                          
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {task.id}
                          </span>
                        </div>

                        {/* Main details */}
                        <p className="text-slate-700 text-xs font-medium leading-relaxed mb-3 line-clamp-3">
                          {task.details}
                        </p>

                        {/* Middle metadata */}
                        <div className="space-y-1.5 border-t border-slate-50 pt-2.5 mb-3">
                          {/* Assignee */}
                          <div className="flex items-center text-[10px] text-slate-500 space-x-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate">Thực hiện: <strong>{task.assignee || 'Chưa nhận việc'}</strong></span>
                          </div>

                          {/* Deadline */}
                          <div className="flex items-center text-[10px] space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className={`${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                              Hạn: {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom buttons / interactive trigger */}
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50">
                        
                        {/* File count indicator and priority */}
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${priorityColors[task.priority]}`}>
                            {task.priority === Priority.Cao && <Flame className="w-3 h-3 inline mr-0.5" />}
                            {task.priority}
                          </span>

                          {task.attachment && (
                            <span className="text-slate-400" title="Có tệp đính kèm">
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Movement and detailed buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onSelectTask(task)}
                            className="text-[10px] text-indigo-600 font-semibold hover:bg-indigo-50 px-2 py-1 rounded transition border border-transparent hover:border-indigo-100 cursor-pointer"
                          >
                            Chi tiết
                          </button>

                          {canTransition(task) && (prevStatus(task.status) || nextStatus(task.status)) ? (
                            <div className="flex items-center border border-slate-100 rounded bg-slate-50 overflow-hidden">
                              {/* Left transition */}
                              {prevStatus(task.status) && (
                                <button
                                  onClick={() => onChangeStatus(task.id, prevStatus(task.status)!)}
                                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                  title="Chuyển về trạng thái trước"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              
                              {/* Right transition */}
                              {nextStatus(task.status) && (
                                <button
                                  onClick={() => onChangeStatus(task.id, nextStatus(task.status)!)}
                                  className="p-1 hover:bg-slate-200 text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                                  title="Chuyển sang trạng thái tiếp"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            currentUserRole === 'staff' && task.assignee !== currentStaffName ? (
                              <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium select-none">
                                việc của {task.assignee || 'người khác'}
                              </span>
                            ) : currentUserRole === 'staff' && task.status === TaskStatus.ChoDuyet ? (
                              <span className="text-[9px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded font-bold select-none">
                                Đang chờ Duyệt
                              </span>
                            ) : null
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 bg-white/50 text-center select-none text-slate-400">
                    <div className="scale-90">
                      <p className="text-xs font-semibold">Trống</p>
                      <p className="text-[10px] text-slate-400 font-medium">Không có công việc ở giai đoạn này</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick add button inside unpaid or not started column */}
              {col.status === TaskStatus.ChuaBatDau && currentUserRole === 'admin' && (
                <button
                  onClick={onAddTask}
                  className="m-4 mt-0 p-2.5 border border-dashed border-indigo-200 text-indigo-600 bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-400 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm việc mới</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
