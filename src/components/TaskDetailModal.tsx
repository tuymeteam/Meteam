import React from 'react';
import { Task, Category, TaskStatus, Priority } from '../types';
import { 
  X, 
  Calendar, 
  User, 
  UserPlus, 
  AlertTriangle, 
  Download, 
  FileText, 
  CheckCircle, 
  Eye, 
  Trash2, 
  Edit3,
  Flame,
  Clock,
  Layers,
  Droplet,
  Zap,
  Tv,
  Lightbulb
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, newStatus: TaskStatus) => void;
}

export default function TaskDetailModal({ 
  task, 
  onClose, 
  onEdit, 
  onDelete, 
  onChangeStatus 
}: TaskDetailModalProps) {

  const categoryColors = {
    [Category.Nuoc]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Droplet className="w-5 h-5" /> },
    [Category.Dien]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Zap className="w-5 h-5" /> },
    [Category.MayLanh]: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: <Tv className="w-5 h-5" /> },
    [Category.ChieuSang]: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: <Lightbulb className="w-5 h-5" /> },
    [Category.Khac]: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: <Layers className="w-5 h-5" /> },
  };

  const priorityColors = {
    [Priority.Thap]: 'bg-slate-100 text-slate-700 border-slate-200',
    [Priority.TrungBinh]: 'bg-amber-50 text-amber-700 border-amber-200',
    [Priority.Cao]: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const statusColors = {
    [TaskStatus.ChuaBatDau]: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    [TaskStatus.DangThucHien]: 'bg-amber-100 text-amber-800 border-amber-200',
    [TaskStatus.ChoDuyet]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [TaskStatus.HoanThanh]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  // Safe download trigger
  const triggerDownload = () => {
    if (!task.attachment) return;
    const link = document.createElement('a');
    link.href = task.attachment.data;
    link.download = task.attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const catStyle = categoryColors[task.category];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-200/60 px-3 py-1 rounded-md">
              {task.id}
            </span>
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              {catStyle.icon}
              <span>{task.category}</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Details (Vietnamese text description) */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Nội dung chi tiết</h4>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {task.details}
            </div>
          </div>

          {/* Key Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Assignees and Creators */}
            <div className="border border-slate-100 p-4 rounded-2xl bg-white space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 capitalize">Người được giao</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{task.assignee || 'Chưa phân công'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t border-slate-50 pt-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 capitalize">Người giao việc</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 font-mono text-xs break-all">{task.creator}</p>
                </div>
              </div>
            </div>

            {/* Timings and priority levels */}
            <div className="border border-slate-100 p-4 rounded-2xl bg-white space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 capitalize">Hạn hoàn thành</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{task.dueDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t border-slate-50 pt-3">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-xl mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 capitalize">Mức độ ưu tiên</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Trạng thái hiện tại</p>
              <span className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            
            {/* Quick Status Action Hub */}
            <div className="flex flex-col space-y-1 text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Thay đổi trạng thái</span>
              <div className="flex flex-wrap gap-1 mt-1 justify-end">
                {[
                  TaskStatus.ChuaBatDau,
                  TaskStatus.DangThucHien,
                  TaskStatus.ChoDuyet,
                  TaskStatus.HoanThanh
                ].map(st => {
                  if (st === task.status) return null;
                  return (
                    <button
                      key={st}
                      onClick={() => onChangeStatus(task.id, st)}
                      className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 px-2 py-1 rounded-md shadow-xs transition"
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Attachment block */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-widest">Hình ảnh / Tài liệu đính kèm</h4>
            {task.attachment ? (
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex flex-col">
                <div className="p-3 bg-white flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 truncate">{task.attachment.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Size: {(task.attachment.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={triggerDownload}
                    className="p-1 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center space-x-1.5 font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                </div>
                
                {/* Image preview support */}
                {task.attachment.type.startsWith('image/') && (
                  <div className="p-4 flex items-center justify-center max-h-72 overflow-hidden bg-slate-100 select-none">
                    <img 
                      src={task.attachment.data} 
                      alt={task.attachment.name} 
                      referrerPolicy="no-referrer"
                      className="max-h-64 object-contain shadow-md rounded-lg max-w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 px-5 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                Không đính kèm minh chứng công việc nào.
              </div>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
                onDelete(task.id);
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 font-bold rounded-xl transition cursor-pointer order-last sm:order-first"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa công việc</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => onEdit(task)}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
