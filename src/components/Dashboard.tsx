import React from 'react';
import { Task, Category, TaskStatus, Priority } from '../types';
import { 
  Building, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Zap, 
  Tv, 
  Lightbulb, 
  FileText, 
  User, 
  Calendar,
  Layers
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onFilterCategory: (cat: Category | 'All') => void;
}

export default function Dashboard({ tasks, onSelectTask, onFilterCategory }: DashboardProps) {
  // Compute analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.HoanThanh).length;
  const waitingApproval = tasks.filter(t => t.status === TaskStatus.ChoDuyet).length;
  const inProgress = tasks.filter(t => t.status === TaskStatus.DangThucHien).length;
  const notStarted = tasks.filter(t => t.status === TaskStatus.ChuaBatDau).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Breakdown by category
  const categoryCounts = {
    [Category.Nuoc]: tasks.filter(t => t.category === Category.Nuoc).length,
    [Category.Dien]: tasks.filter(t => t.category === Category.Dien).length,
    [Category.MayLanh]: tasks.filter(t => t.category === Category.MayLanh).length,
    [Category.ChieuSang]: tasks.filter(t => t.category === Category.ChieuSang).length,
    [Category.Khac]: tasks.filter(t => t.category === Category.Khac).length,
  };

  const categoryColors = {
    [Category.Nuoc]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconColor: '#0284c7', progress: 'bg-blue-600' },
    [Category.Dien]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconColor: '#d97706', progress: 'bg-amber-500' },
    [Category.MayLanh]: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', iconColor: '#0369a1', progress: 'bg-sky-400' },
    [Category.ChieuSang]: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', iconColor: '#ca8a04', progress: 'bg-yellow-500' },
    [Category.Khac]: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', iconColor: '#475569', progress: 'bg-slate-600' },
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case Category.Nuoc: return <Droplet className="w-5 h-5 text-blue-600" />;
      case Category.Dien: return <Zap className="w-5 h-5 text-amber-600" />;
      case Category.MayLanh: return <Tv className="w-5 h-5 text-sky-600" />;
      case Category.ChieuSang: return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default: return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  // Breakdown by priority
  const highPriorityTotal = tasks.filter(t => t.priority === Priority.Cao).length;
  const medPriorityTotal = tasks.filter(t => t.priority === Priority.TrungBinh).length;
  const lowPriorityTotal = tasks.filter(t => t.priority === Priority.Thap).length;

  // Breakdown by assignee
  const assigneeStats: { [name: string]: { total: number; completed: number } } = {};
  tasks.forEach(t => {
    const assignee = t.assignee || 'Chưa phân công';
    if (!assigneeStats[assignee]) {
      assigneeStats[assignee] = { total: 0, completed: 0 };
    }
    assigneeStats[assignee].total += 1;
    if (t.status === TaskStatus.HoanThanh) {
      assigneeStats[assignee].completed += 1;
    }
  });

  // Near due tasks (active and due within 3 days or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const urgentTasks = tasks
    .filter(t => t.status !== TaskStatus.HoanThanh)
    .map(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...t, diffDays };
    })
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Tổng Công Việc</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</h3>
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Đang Thực Hiện</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{inProgress}</h3>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Chờ Duyệt</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{waitingApproval}</h3>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Hoàn Thành</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks}</h3>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Tỉ Lệ Hoàn Thành</p>
            <span className="text-sm font-bold text-indigo-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{completedTasks}/{totalTasks} công việc đã xong</p>
        </div>
      </div>

      {/* Main Stats Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category breakdown (Columns & click filtering) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <span>Phân Loại Theo Danh Mục</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">Số lượng công việc chi tiết chia theo từng bộ phận tiện ích phụ trách.</p>
            
            <div className="space-y-4">
              {(Object.keys(categoryCounts) as Category[]).map((cat) => {
                const count = categoryCounts[cat];
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                const style = categoryColors[cat];
                
                return (
                  <div key={cat} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <button 
                        onClick={() => onFilterCategory(cat)}
                        className={`flex items-center space-x-2.5 px-2 py-0.5 rounded-lg border hover:opacity-80 transition text-sm font-medium ${style.bg} ${style.text} ${style.border}`}
                      >
                        {getCategoryIcon(cat)}
                        <span>{cat}</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-800">{count} việc</span>
                        <span className="text-xs text-slate-400">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${style.progress} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between text-xs text-slate-500">
            <span>* Click vào danh mục để xem chi tiết</span>
            <button onClick={() => onFilterCategory('All')} className="text-indigo-600 font-semibold hover:underline">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Priority & Status Summary (SVG Donut simulated/beautiful visual bars) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Độ Ưu Tiên & Trạng Thái</h3>
            <p className="text-xs text-slate-500 mb-5 font-medium uppercase tracking-wider text-slate-400">Độ ưu tiên</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                <span className="inline-block p-1 bg-rose-100 text-rose-700 rounded-md mb-1">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <p className="text-xs text-slate-500 font-medium">Cao</p>
                <p className="text-lg font-extrabold text-rose-700 mt-0.5">{highPriorityTotal}</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
                <span className="inline-block p-1 bg-amber-100 text-amber-700 rounded-md mb-1">
                  <Clock className="w-4 h-4" />
                </span>
                <p className="text-xs text-slate-500 font-medium">T.Bình</p>
                <p className="text-lg font-extrabold text-amber-700 mt-0.5">{medPriorityTotal}</p>
              </div>

              <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl text-center">
                <span className="inline-block p-1 bg-sky-100 text-sky-700 rounded-md mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <p className="text-xs text-slate-500 font-medium">Thấp</p>
                <p className="text-lg font-extrabold text-sky-700 mt-0.5">{lowPriorityTotal}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider text-slate-400">Trạng thái hiện tại</p>
            <div className="space-y-2.5">
              {[
                { label: 'Chưa bắt đầu', count: notStarted, color: 'bg-slate-400', pct: totalTasks > 0 ? (notStarted / totalTasks) * 100 : 0 },
                { label: 'Đang thực hiện', count: inProgress, color: 'bg-amber-500', pct: totalTasks > 0 ? (inProgress / totalTasks) * 100 : 0 },
                { label: 'Chờ duyệt', count: waitingApproval, color: 'bg-indigo-500', pct: totalTasks > 0 ? (waitingApproval / totalTasks) * 100 : 0 },
                { label: 'Hoàn thành', count: completedTasks, color: 'bg-emerald-500', pct: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0 },
              ].map((st) => (
                <div key={st.label} className="flex items-center space-x-3 text-sm">
                  <div className="w-24 font-medium text-slate-600 text-xs">{st.label}</div>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div className={`h-full ${st.color} rounded-full`} style={{ width: `${st.pct}%` }} />
                  </div>
                  <div className="w-12 text-right font-bold text-slate-800 text-xs">{st.count} việc</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
            Đảm bảo hoàn thành các công việc Cao trước hạn định để tăng sự hài lòng.
          </div>
        </div>

        {/* Assigned people panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Danh Sách Người Được Giao</h3>
            <p className="text-xs text-slate-500 mb-5">Thống kê số lượng đầu việc được phân công cho điều phối kỹ thuật viên.</p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {Object.keys(assigneeStats).map((name) => {
                const stats = assigneeStats[name];
                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
                const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                
                return (
                  <div key={name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">Hiệu suất: {successRate}% hoàn thành</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {stats.total} việc
                      </span>
                    </div>
                  </div>
                );
              })}
              {Object.keys(assigneeStats).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">Chưa có thông tin phân công</div>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
            * Có thể sử dụng bộ lọc tìm kiếm nhanh theo kỹ thuật viên.
          </div>
        </div>

      </div>

      {/* Near Due / Urgency List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Tiến Độ Theo Hạn Hoàn Thành</h3>
            <p className="text-xs text-slate-500">Các công việc chưa hoàn tất có lịch đến hạn sớm nhất.</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-600 rounded-full flex items-center space-x-1 border border-rose-100 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Theo dõi rủi ro trễ hạn</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
                <th className="py-3 px-4 font-semibold">Mã CV</th>
                <th className="py-3 px-4 font-semibold">Danh mục</th>
                <th className="py-3 px-4 font-semibold">Chi tiết công việc</th>
                <th className="py-3 px-4 font-semibold">Hạn hoàn thành</th>
                <th className="py-3 px-4 font-semibold">Người thực hiện</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-3 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {urgentTasks.map((t) => {
                const spec = categoryColors[t.category];
                const isOverdue = t.diffDays < 0;
                const isDueToday = t.diffDays === 0;

                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono text-xs">{t.id}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${spec.bg} ${spec.text}`}>
                        {getCategoryIcon(t.category)}
                        <span>{t.category}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="truncate text-slate-800 font-medium text-xs">{t.details}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={`font-semibold text-xs ${
                          isOverdue ? 'text-rose-600 font-extrabold' : isDueToday ? 'text-amber-600 font-semibold' : 'text-slate-600'
                        }`}>
                          {t.dueDate}
                        </span>
                        {isOverdue && (
                          <span className="bg-rose-100 text-rose-800 px-1 text-[10px] rounded font-bold uppercase tracking-wider">Trễ hạn</span>
                        )}
                        {isDueToday && (
                          <span className="bg-amber-100 text-amber-800 px-1 text-[10px] rounded font-bold uppercase tracking-wider">Hôm nay</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium">{t.assignee || 'Chưa ai'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold border rounded-md ${
                        t.status === TaskStatus.DangThucHien ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        t.status === TaskStatus.ChoDuyet ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => onSelectTask(t)}
                        className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
              {urgentTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 text-xs">Mọi công việc đã được giải quyết hoặc chưa có dữ liệu!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
