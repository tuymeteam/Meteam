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
  currentUserRole?: 'admin' | 'staff';
  currentStaffName?: string;
}

export default function TaskDetailModal({ 
  task, 
  onClose, 
  onEdit, 
  onDelete, 
  onChangeStatus,
  currentUserRole = 'admin',
  currentStaffName = ''
}: TaskDetailModalProps) {

  const isAssignedToMe = task.assignee === currentStaffName;
  const isCompleted = task.status === TaskStatus.HoanThanh;
  const canModifyStatus = currentUserRole === 'admin' || (isAssignedToMe && !isCompleted);

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Vui lòng cho phép mở cửa sổ pop-up để tự động xuất và tải báo cáo PDF!');
      return;
    }

    const categoryText = task.category;
    const priorityText = task.priority;
    const statusText = task.status;
    const detailNotes = task.details.replace(/\n/g, '<br/>');
    const attachmentHTML = task.attachment && task.attachment.type.startsWith('image/') 
      ? `<div style="margin-top: 25px; text-align: center;">
          <h3 style="font-size: 13px; color: #475569; margin-bottom: 12px; text-align: left; border-bottom: 2px dashed #e2e8f0; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">ẢNH MINH CHỨNG / THỰC TẾ CHI TIẾT:</h3>
          <img src="${task.attachment.data}" style="max-height: 380px; max-width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background-color: #f8fafc;" />
          <p style="font-size: 10px; color: #64748b; margin-top: 8px; font-style: italic;">Hồ sơ đính kèm số: ${task.attachment.name}</p>
        </div>`
      : task.attachment 
        ? `<div style="margin-top: 25px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Tập tin đính kèm kỹ thuật:</strong> ${task.attachment.name}
            </div>
            <div style="color: #64748b; font-size: 11px;">
              Dung lượng: ${(task.attachment.size / 1024).toFixed(1)} KB (Đã bảo mật hệ thống)
            </div>
          </div>`
        : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PHIEU_CONG_VIEC_${task.id}</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px double #0f172a;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .header-left h1 {
            font-size: 18px;
            margin: 0;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #1e3b8a;
          }
          .header-left p {
            font-size: 11px;
            margin: 5px 0 0 0;
            color: #475569;
            font-weight: 600;
          }
          .doc-id {
            background: #e0f2fe;
            border: 1px solid #bae6fd;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 14px;
            color: #0369a1;
            font-family: monospace;
          }
          .title-area {
            text-align: center;
            margin-bottom: 30px;
          }
          .title-area h2 {
            font-size: 22px;
            margin: 0;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 800;
          }
          .title-area p {
            font-size: 12px;
            margin: 8px 0 0 0;
            color: #64748b;
          }
          .status-banner {
            text-align: center;
            background: #f0fdf4;
            border: 1.5px solid #16a34a;
            color: #15803d;
            padding: 12px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 800;
            margin-bottom: 25px;
            letter-spacing: 0.5px;
          }
          .grid-info {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
          }
          .info-item {
            font-size: 13px;
          }
          .info-item strong {
            color: #475569;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            width: 130px;
          }
          .info-item span {
            color: #0f172a;
            font-weight: 700;
          }
          .details-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            background: #ffffff;
          }
          .details-box h3 {
            margin-top: 0;
            font-size: 12px;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .details-content {
            font-size: 13.5px;
            line-height: 1.7;
            color: #334155;
            white-space: pre-line;
            font-family: 'Merriweather', serif;
          }
          .signatures {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .sig-col {
            width: 45%;
            text-align: center;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
            margin-bottom: 65px;
            letter-spacing: 1px;
          }
          .sig-name {
            font-size: 13.5px;
            font-weight: 800;
            color: #0f172a;
            border-top: 1px solid #e2e8f0;
            display: inline-block;
            padding-top: 6px;
            min-width: 150px;
          }
          .print-btn-no {
            margin-bottom: 20px;
            text-align: center;
          }
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print print-btn-no">
          <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 12px 24px; font-family: sans-serif; font-weight: 800; font-size: 13px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3); transition: all 0.2s;">
            ⎙ TICK VÀO ĐÂY ĐỂ IN NHANH HOẶC LƯU FILE PDF
          </button>
        </div>

        <div class="header">
          <div class="header-left">
            <h1>HỆ THỐNG PHÂN PHỐI SỰ CỐ KỸ THUẬT</h1>
            <p>CHỦ TRÌ ĐIỀU PHỐI GIAO VIỆC: TUY TRẦN</p>
          </div>
          <div class="doc-id">
            ${task.id}
          </div>
        </div>

        <div class="title-area">
          <h2>PHIẾU BÁO CÁO CHI TIẾT CÔNG VIỆC</h2>
          <p>Xuất bản ngày: ${new Date().toLocaleDateString('vi-VN')} vào lúc ${new Date().toLocaleTimeString('vi-VN')}</p>
        </div>

        ${statusText === TaskStatus.HoanThanh ? `
          <div class="status-banner">
            ✓ NÀY LÀ CÔNG VIỆC ĐÃ HOÀN THÀNH - CHỜ NGHIỆM THU ĐẦY ĐỦ
          </div>
        ` : `
          <div class="status-banner" style="background: #fffbeb; border-color: #d97706; color: #b45309;">
            ● TRẠNG THÁI HIỆN TẠI: ${statusText.toUpperCase()}
          </div>
        `}

        <div class="grid-info">
          <div class="info-item">
            <strong>Tên Danh mục:</strong>
            <span>${categoryText}</span>
          </div>
          <div class="info-item">
            <strong>Độ ưu tiên:</strong>
            <span style="color: ${priorityText === Priority.Cao ? '#ef4444' : priorityText === Priority.TrungBinh ? '#f59e0b' : '#3b82f6'}">${priorityText}</span>
          </div>
          <div class="info-item">
            <strong>Nhân viên xử lý:</strong>
            <span>${task.assignee || 'Chưa nhận nhiệm vụ'}</span>
          </div>
          <div class="info-item">
            <strong>Nguồn giao việc:</strong>
            <span>${task.creator || 'Tuy Trần'}</span>
          </div>
          <div class="info-item">
            <strong>Thời điểm hạn:</strong>
            <span>${task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
          <div class="info-item">
            <strong>Mã công việc:</strong>
            <span>${task.id}</span>
          </div>
        </div>

        <div class="details-box">
          <h3>MÔ TẢ VÀ YÊU CẦU CHI TIẾT CÔNG VIỆC:</h3>
          <div class="details-content">${detailNotes}</div>
        </div>

        ${attachmentHTML}

        <div class="signatures">
          <div class="sig-col">
            <div class="sig-title">NHÂN VIÊN ĐƯỢC GIAO</div>
            <div class="sig-name">${task.assignee || 'Ký ghi rõ họ tên'}</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">NGƯỜI GIAO VIỆC (TUY TRẦN)</div>
            <div class="sig-name">${task.creator || 'Tuy Trần'}</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-t-3xl rounded-b-none sm:rounded-3xl max-w-2xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] self-end sm:self-center">
        
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-2xl gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Trạng thái hiện tại</p>
              <span className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            
            {/* Quick Status Action Hub */}
            <div className="flex flex-col space-y-1 sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Thay đổi trạng thái</span>
              {canModifyStatus ? (
                <div className="flex flex-wrap gap-1 mt-1 justify-start sm:justify-end">
                  {[
                    TaskStatus.ChuaBatDau,
                    TaskStatus.DangThucHien,
                    TaskStatus.ChoDuyet,
                    TaskStatus.HoanThanh
                  ].map(st => {
                    if (st === task.status) return null;
                    if (currentUserRole === 'staff' && st === TaskStatus.HoanThanh) return null;
                    return (
                      <button
                        key={st}
                        onClick={() => onChangeStatus(task.id, st)}
                        className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 px-2.5 py-1 rounded-md shadow-xs transition cursor-pointer"
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 p-1.5 rounded-lg border border-zinc-200">
                  {isCompleted 
                    ? "✓ Đã hoàn thành (Chờ admin mở lại)"
                    : `Chỉ dành cho ${task.assignee || 'người khác'}`}
                </span>
              )}
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
          {currentUserRole === 'admin' ? (
            <>
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

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition cursor-pointer"
                  title="Xuất phiếu công việc ra tập tin PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span>Xuất PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Xuất báo cáo PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer text-center"
              >
                Đóng cửa sổ chi tiết
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
