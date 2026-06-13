import React, { useState } from 'react';
import { Task, Category, TaskStatus, Priority } from '../types';
import { 
  Search, 
  Calendar, 
  User, 
  Trash2, 
  Edit3, 
  FileText, 
  Filter, 
  X,
  Plus,
  Play,
  RotateCcw,
  PlusCircle,
  Eye,
  ChevronsUpDown,
  Droplet,
  Zap,
  Tv,
  Lightbulb,
  Layers
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: () => void;
  categoryFilter: Category | 'All';
  onFilterCategory: (cat: Category | 'All') => void;
}

type SortField = 'id' | 'dueDate' | 'priority' | 'status' | 'category' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function TaskList({ 
  tasks, 
  onSelectTask, 
  onEditTask, 
  onDeleteTask,
  onAddTask,
  categoryFilter,
  onFilterCategory
}: TaskListProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Change sort priority index helper
  const priorityWeight = (p: Priority) => {
    switch (p) {
      case Priority.Cao: return 3;
      case Priority.TrungBinh: return 2;
      case Priority.Thap: return 1;
      default: return 0;
    }
  };

  // Change status weighting index helper
  const statusWeight = (s: TaskStatus) => {
    switch (s) {
      case TaskStatus.HoanThanh: return 4;
      case TaskStatus.ChoDuyet: return 3;
      case TaskStatus.DangThucHien: return 2;
      case TaskStatus.ChuaBatDau: return 1;
      default: return 0;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    onFilterCategory('All');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  // Sorting columns toggling
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter list
  const filteredTasks = tasks.filter(task => {
    const sTerm = searchTerm.toLowerCase();
    const matchSearch = 
      task.id.toLowerCase().includes(sTerm) ||
      task.details.toLowerCase().includes(sTerm) ||
      (task.assignee || '').toLowerCase().includes(sTerm) ||
      task.creator.toLowerCase().includes(sTerm);

    const matchCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    return matchSearch && matchCategory && matchStatus && matchPriority;
  });

  // Sort list
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let compA: any = a[sortField];
    let compB: any = b[sortField];

    if (sortField === 'priority') {
      compA = priorityWeight(a.priority);
      compB = priorityWeight(b.priority);
    } else if (sortField === 'status') {
      compA = statusWeight(a.status);
      compB = statusWeight(b.status);
    }

    if (compA < compB) return sortOrder === 'asc' ? -1 : 1;
    if (compA > compB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const categoryColors = {
    [Category.Nuoc]: { bg: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Droplet className="w-3.5 h-3.5 inline mr-1" /> },
    [Category.Dien]: { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Zap className="w-3.5 h-3.5 inline mr-1" /> },
    [Category.MayLanh]: { bg: 'bg-sky-50 text-sky-700 border-sky-100', icon: <Tv className="w-3.5 h-3.5 inline mr-1" /> },
    [Category.ChieuSang]: { bg: 'bg-yellow-50 text-yellow-850 border-yellow-105', icon: <Lightbulb className="w-3.5 h-3.5 inline mr-1" /> },
    [Category.Khac]: { bg: 'bg-slate-50 text-slate-700 border-slate-100', icon: <Layers className="w-3.5 h-3.5 inline mr-1" /> },
  };

  const priorityColors = {
    [Priority.Thap]: 'bg-slate-100 text-slate-700 border-slate-200',
    [Priority.TrungBinh]: 'bg-amber-50 text-amber-700 border-amber-200',
    [Priority.Cao]: 'bg-rose-50 text-rose-700 border-rose-250 font-bold',
  };

  const statusColors = {
    [TaskStatus.ChuaBatDau]: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    [TaskStatus.DangThucHien]: 'bg-amber-100 text-amber-800 border-amber-200',
    [TaskStatus.ChoDuyet]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [TaskStatus.HoanThanh]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-150 shadow-xs overflow-hidden">
      
      {/* Filtering Actions Deck */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/40 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Dynamic search input */}
          <div className="relative flex-1 max-w-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Tìm theo Mã CV, nội dung, người giao, người nhận..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm text-slate-800 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Quick reset filters */}
            {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold rounded-xl transition flex items-center space-x-1 border border-rose-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa lọc</span>
              </button>
            )}

            {/* Quick add task trigger */}
            <button
              onClick={onAddTask}
              className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Giao việc mới</span>
            </button>
          </div>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Danh mục</label>
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-indigo-500 rounded-lg bg-white text-slate-700 font-semibold"
              value={categoryFilter}
              onChange={(e) => onFilterCategory(e.target.value as Category | 'All')}
            >
              <option value="All">⚠️ Tất cả Danh mục</option>
              <option value={Category.Nuoc}>💧 Nước</option>
              <option value={Category.Dien}>⚡ Điện</option>
              <option value={Category.MayLanh}>❄️ Máy Lạnh</option>
              <option value={Category.ChieuSang}>💡 Chiếu sáng</option>
              <option value={Category.Khac}>📦 Khác</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</label>
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-indigo-500 rounded-lg bg-white text-slate-700 font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'All')}
            >
              <option value="All">📋 Tất cả Trạng thái</option>
              <option value={TaskStatus.ChuaBatDau}>⚪ Chưa bắt đầu</option>
              <option value={TaskStatus.DangThucHien}>🟡 Đang thực hiện</option>
              <option value={TaskStatus.ChoDuyet}>🔵 Chờ duyệt</option>
              <option value={TaskStatus.HoanThanh}>🟢 Hoàn thành</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ ưu tiên</label>
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-indigo-500 rounded-lg bg-white text-slate-700 font-semibold"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            >
              <option value="All">🔥 Tất cả Ưu tiên</option>
              <option value={Priority.Thap}>🟢 Thấp (Bảo dưỡng)</option>
              <option value={Priority.TrungBinh}>🟡 Trung bình (Cần làm)</option>
              <option value={Priority.Cao}>🔴 Cao (Sự cố khẩn)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Spreadsheet / Records View (Desktop Only) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest select-none">
              
              <th onClick={() => handleSort('id')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <span>Mã CV</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th onClick={() => handleSort('category')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <span>Danh Mục</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 min-w-[200px]">Nội dung chi tiết</th>
              
              <th className="py-3.5 px-4">Người giao</th>
              
              <th className="py-3.5 px-4">Người nhận</th>

              <th onClick={() => handleSort('dueDate')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <span>Hạn xong</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th onClick={() => handleSort('priority')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span>Độ ưu tiên</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th onClick={() => handleSort('status')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span>Trạng thái</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 text-center">Tệp</th>

              <th className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedTasks.map((t) => {
              const catSpec = categoryColors[t.category];
              const isOverdue = new Date(t.dueDate) < new Date() && t.status !== TaskStatus.HoanThanh;

              return (
                <tr 
                  key={t.id} 
                  className="hover:bg-slate-50/70 transition duration-150 text-slate-800"
                >
                  {/* Job ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {t.id}
                  </td>

                  {/* Category options: Nước, Điện, Máy Lạnh, Chiếu sáng, Khác */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${catSpec.bg}`}>
                      {catSpec.icon}
                      <span>{t.category}</span>
                    </span>
                  </td>

                  {/* Details summary */}
                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <p className="line-clamp-2 text-slate-700 leading-normal font-sans" title={t.details}>
                      {t.details}
                    </p>
                  </td>

                  {/* Creator */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[120px]" title={t.creator}>
                    {t.creator.split('@')[0]}
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-4 font-medium whitespace-nowrap text-slate-700">
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.assignee || '—'}</span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`font-semibold ${isOverdue ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-600'}`}>
                      {t.dueDate}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>

                  {/* Status column */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[t.status]}`}>
                      {t.status}
                    </span>
                  </td>

                  {/* File clip */}
                  <td className="py-3 px-4 text-center">
                    {t.attachment ? (
                      <span className="inline-flex text-indigo-600 hover:text-indigo-800" title={t.attachment.name}>
                        <FileText className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-slate-350">—</span>
                    )}
                  </td>

                  {/* Control actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onSelectTask(t)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditTask(t)}
                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Sửa công việc"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                            onDeleteTask(t.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Xóa công việc"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}

            {sortedTasks.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="space-y-1 scale-95">
                    <p className="font-bold text-sm text-slate-600">Không tìm thấy công việc nào</p>
                    <p className="text-xs">Hãy thay đổi từ khóa tìm kiếm hoặc tắt bớt bộ lọc.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      <span>Về mặc định</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Deck List View (Screen < md) */}
      <div className="block md:hidden divide-y divide-slate-105">
        {sortedTasks.map((t) => {
          const catSpec = categoryColors[t.category];
          const isOverdue = new Date(t.dueDate) < new Date() && t.status !== TaskStatus.HoanThanh;

          return (
            <div 
              key={t.id}
              className="p-4 space-y-3.5 bg-white hover:bg-slate-50/50 active:bg-slate-50 transition"
            >
              {/* Card Header & Badges */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 text-[10px] rounded">
                  {t.id}
                </span>

                <div className="flex items-center space-x-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${catSpec.bg}`}>
                    {catSpec.icon}
                    <span>{t.category}</span>
                  </span>

                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${priorityColors[t.priority]}`}>
                    {t.priority}
                  </span>
                </div>
              </div>

              {/* Task description */}
              <div onClick={() => onSelectTask(t)} className="cursor-pointer">
                <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3">
                  {t.details}
                </p>
              </div>

              {/* Additional Metadata Details rows */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-50/60">
                <div className="space-y-1">
                  <div className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider">Người nhận</div>
                  <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{t.assignee || '—'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider">Người giao</div>
                  <div className="text-slate-600 truncate font-mono">{t.creator}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider">Hạn xong</div>
                  <div className={`flex items-center space-x-1 font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{t.dueDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider">Trạng thái</div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar on mobile */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 bg-slate-50/20 -mx-4 px-4">
                <div className="flex items-center text-[10px] text-slate-400">
                  {t.attachment ? (
                    <span className="inline-flex items-center space-x-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
                      <FileText className="w-3 h-3" />
                      <span className="truncate max-w-[100px] text-[8px]">{t.attachment.name}</span>
                    </span>
                  ) : (
                    <span className="text-slate-350 text-[9px]">Chưa đính kèm tệp</span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {/* Read-view button */}
                  <button
                    onClick={() => onSelectTask(t)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition cursor-pointer"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => onEditTask(t)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition cursor-pointer"
                    title="Sửa công việc"
                  >
                    <Edit3 className="w-4.5 h-4.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                        onDeleteTask(t.id);
                      }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition cursor-pointer"
                    title="Xóa công việc"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="py-12 px-4 text-center text-slate-400">
            <p className="font-bold text-sm text-slate-600">Không tìm thấy công việc nào</p>
            <p className="text-xs">Tắt bớt bộ lọc để hiển thị nhiều thông tin hơn.</p>
            <button
              onClick={resetFilters}
              className="mt-3 inline-flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <span>Về mặc định</span>
            </button>
          </div>
        )}
      </div>

      {/* Length count display footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <span>Hiển thị {sortedTasks.length} trên tổng số {tasks.length} bản ghi</span>
        <span className="text-slate-500 font-bold font-sans">Quản lý kỹ thuật viên</span>
      </div>

    </div>
  );
}
