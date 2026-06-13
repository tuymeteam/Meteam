import React, { useState, useEffect, useRef } from 'react';
import { Task, Category, TaskStatus, Priority, Attachment } from '../types';
import { 
  X, 
  Upload, 
  File, 
  Check, 
  User, 
  HelpCircle, 
  Trash2, 
  Droplet, 
  Zap, 
  Tv, 
  Lightbulb, 
  Layers 
} from 'lucide-react';

interface TaskFormProps {
  taskToEdit?: Task; // If provided, we are editing
  currentUserEmail: string;
  onSave: (task: Task) => void;
  onClose: () => void;
  existingTasks: Task[];
}

export default function TaskForm({ 
  taskToEdit, 
  currentUserEmail, 
  onSave, 
  onClose,
  existingTasks
}: TaskFormProps) {
  // Primary states
  const [category, setCategory] = useState<Category>(Category.Nuoc);
  const [details, setDetails] = useState('');
  const [assignee, setAssignee] = useState('');
  const [creator, setCreator] = useState(currentUserEmail);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.ChuaBatDau);
  const [priority, setPriority] = useState<Priority>(Priority.TrungBinh);
  
  // Set default dueDate to tomorrow
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  };
  const [dueDate, setDueDate] = useState(getTomorrowString());
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  
  // Support drag-and-drop state
  const [isDragging, setIsDragging] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  useEffect(() => {
    if (taskToEdit) {
      setCategory(taskToEdit.category);
      setDetails(taskToEdit.details);
      setAssignee(taskToEdit.assignee);
      setCreator(taskToEdit.creator);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setAttachment(taskToEdit.attachment);
    } else {
      // Create mode
      setCategory(Category.Nuoc);
      setDetails('');
      setAssignee('');
      setCreator(currentUserEmail);
      setStatus(TaskStatus.ChuaBatDau);
      setPriority(Priority.TrungBinh);
      setDueDate(getTomorrowString());
      setAttachment(undefined);
    }
    setErrMessage('');
  }, [taskToEdit, currentUserEmail]);

  // Generate Unique ID pattern: JOB-XXXX
  const generateUniqueID = (): string => {
    let attempts = 0;
    while (attempts < 100) {
      const num = Math.floor(1000 + Math.random() * 9000);
      const possibleId = `JOB-${num}`;
      if (!existingTasks.some(t => t.id === possibleId)) {
        return possibleId;
      }
      attempts++;
    }
    return `JOB-${Date.now().toString().slice(-4)}`;
  };

  // Process files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrMessage('');
    // Check file size (e.g. limit to 3.5MB to avoid LocalStorage quota overflow easily)
    if (file.size > 3.5 * 1024 * 1024) {
      setErrMessage('Kích thước tệp vượt quá giới hạn cho phép (Tối đa 3.5MB). Vui lòng chọn tệp nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachment({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          data: reader.result
        });
      }
    };
    reader.onerror = () => {
      setErrMessage('Có lỗi xảy ra khi đọc tệp.');
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save Task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrMessage('');

    if (!details.trim()) {
      setErrMessage('Vui lòng nhập nội dung chi tiết công việc.');
      return;
    }
    if (!assignee.trim()) {
      setErrMessage('Vui lòng chọn nhân viên thực hiện (Tick chọn kỹ thuật viên).');
      return;
    }
    if (!creator.trim()) {
      setErrMessage('Vui lòng nhập Email người giao việc.');
      return;
    }

    const targetId = taskToEdit ? taskToEdit.id : generateUniqueID();
    const targetCreatedAt = taskToEdit ? taskToEdit.createdAt : new Date().toISOString();

    const finalizedTask: Task = {
      id: targetId,
      category,
      details: details.trim(),
      assignee: assignee.trim(),
      creator: creator.trim(),
      status,
      priority,
      dueDate,
      attachment,
      createdAt: targetCreatedAt
    };

    onSave(finalizedTask);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-t-3xl rounded-b-none sm:rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] self-end sm:self-center">
        
        {/* Header content */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {taskToEdit ? `Chỉnh sửa công việc: ${taskToEdit.id}` : 'Thêm Công Việc Mới'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {taskToEdit ? 'Cập nhật lại các thông số kỹ thuật của công việc' : 'Điền thông tin và giao việc cho kỹ thuật viên'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Error Alerts */}
        {errMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl border border-rose-100 flex items-start space-x-2">
            <span className="font-extrabold text-rose-600 shrink-0">⚠️ Lỗi:</span>
            <span>{errMessage}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700">
          
          {/* Category selection - unique styling required */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Tên Danh Mục <span className="text-rose-500 font-extrabold">* Bắt buộc</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { type: Category.Nuoc, label: 'Nước', icon: <Droplet className="w-4 h-4" />, activeColor: 'bg-blue-600 border-blue-600 text-white', inactiveColor: 'bg-blue-50/50 hover:bg-blue-50 text-blue-700 border-blue-100' },
                { type: Category.Dien, label: 'Điện', icon: <Zap className="w-4 h-4" />, activeColor: 'bg-amber-500 border-amber-500 text-white', inactiveColor: 'bg-amber-50/50 hover:bg-amber-50 text-amber-700 border-amber-100' },
                { type: Category.MayLanh, label: 'Máy Lạnh', icon: <Tv className="w-4 h-4" />, activeColor: 'bg-sky-500 border-sky-500 text-white', inactiveColor: 'bg-sky-50/50 hover:bg-sky-50 text-sky-700 border-sky-100' },
                { type: Category.ChieuSang, label: 'Chiếu sáng', icon: <Lightbulb className="w-4 h-4" />, activeColor: 'bg-yellow-500 border-yellow-500 text-white', inactiveColor: 'bg-yellow-50/50 hover:bg-yellow-50 text-yellow-800 border-yellow-100' },
                { type: Category.Khac, label: 'Khác', icon: <Layers className="w-4 h-4" />, activeColor: 'bg-slate-600 border-slate-600 text-white', inactiveColor: 'bg-slate-50/50 hover:bg-slate-50 text-slate-700 border-slate-100' }
              ].map(item => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setCategory(item.type)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1.5 border rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    category === item.type ? item.activeColor : item.inactiveColor
                  }`}
                >
                  <span className="mb-1">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details - longtext */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Nội dung chi tiết <span className="text-rose-500 font-extrabold">* Bắt buộc</span>
            </label>
            <textarea
              className="w-full min-h-[90px] p-3 text-slate-800 text-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition duration-200 overflow-y-auto"
              placeholder="Mô tả cụ thể sự cố cần xử lý, vị trí cơ sở, yêu cầu kỹ thuật đặc biệt..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Grid fields for Assignee and due dates */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Person Assigned - Người được giao */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 tracking-wider uppercase flex justify-between items-center">
                <span>Nhân viên thực hiện <span className="text-rose-500">* Bắt buộc</span></span>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">Tích chọn để giao việc</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "NV1: Dũng", name: "NV1: Dũng" },
                  { id: "NV2: Minh Đạt", name: "NV2: Minh Đạt" },
                  { id: "NV3: Đạt Phan", name: "NV3: Đạt Phan" }
                ].map((staff) => {
                  const isChecked = assignee === staff.id;
                  return (
                    <button
                      type="button"
                      key={staff.id}
                      onClick={() => setAssignee(staff.id)}
                      className={`flex items-center justify-between p-3.5 border rounded-2xl transition-all text-left cursor-pointer select-none active:scale-[0.98] ${
                        isChecked 
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{staff.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Kỹ thuật viên</span>
                      </div>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                        isChecked 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && (
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion Deadline - Hạn hoàn thành */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Hạn hoàn thành
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 text-slate-800 text-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Grid fields for Priority and status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority - Độ ưu tiên */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Mức độ ưu tiên
              </label>
              <select
                className="w-full px-3 py-2.5 text-slate-800 text-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl bg-white transition"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value={Priority.Thap}>Thấp - Xử lý trong tuần</option>
                <option value={Priority.TrungBinh}>Trung bình - Cần làm ngay</option>
                <option value={Priority.Cao}>Cao - Khẩn cấp / Sự cố nghiêm trọng</option>
              </select>
            </div>

            {/* Status - Trạng thái */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Trạng thái ban đầu
              </label>
              <select
                className="w-full px-3 py-2.5 text-slate-800 text-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl bg-white transition"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value={TaskStatus.ChuaBatDau}>Chưa bắt đầu</option>
                <option value={TaskStatus.DangThucHien}>Đang thực hiện</option>
                <option value={TaskStatus.ChoDuyet}>Chờ duyệt</option>
                <option value={TaskStatus.HoanThanh}>Hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Creator of Task - Người giao việc */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase flex justify-between items-center">
              <span>Người giao việc</span>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">Mặc định: Tuy Trần</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 text-slate-800 text-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition"
              placeholder="Nhập họ tên hoặc email người giao"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              required
            />
          </div>

          {/* Attachment upload - File/Document */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Hình ảnh / Tài liệu chứng minh
            </label>
            
            {/* Drag & Drop Canvas */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 select-none flex flex-col items-center justify-center ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50' 
                  : attachment 
                    ? 'border-emerald-300 bg-emerald-50/10' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              />

              {attachment ? (
                <div className="space-y-2.5 w-full">
                  <div className="flex items-center justify-center text-emerald-600 space-x-1">
                    <Check className="w-5 h-5 bg-emerald-100 p-0.5 rounded-full" />
                    <span className="text-xs font-bold font-sans">Đã đính kèm tệp thành công</span>
                  </div>
                  
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-left max-w-sm mx-auto">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      {attachment.type.startsWith('image/') ? (
                        <img 
                          src={attachment.data} 
                          alt="preview" 
                          className="w-8 h-8 rounded-md object-cover border border-slate-100 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <File className="w-8 h-8 text-indigo-500 shrink-0" />
                      )}
                      
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 truncate">{attachment.name}</p>
                        <p className="text-[10px] text-slate-400">{(attachment.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAttachment();
                      }}
                      className="p-1 hover:bg-slate-100 rounded-full text-rose-500 hover:text-rose-700 transition"
                      title="Gỡ bỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-500">
                  <Upload className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Kéo thả hoặc Click để tải tài liệu lên</p>
                  <p className="text-[10px] text-slate-400">Hình ảnh, file PDF, Word, Txt,... tối đa 3.5MB</p>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            {taskToEdit ? 'Cập nhật công việc' : 'Tạo mới công việc'}
          </button>
        </div>

      </div>
    </div>
  );
}
