import React, { useState } from 'react';
import { X, Copy, Check, Share2, Users, Send, ExternalLink, Link } from 'lucide-react';

interface ShareModalProps {
  staffList: string[];
  onClose: () => void;
}

export default function ShareModal({ staffList, onClose }: ShareModalProps) {
  const [shareType, setShareType] = useState<'general' | 'specific'>('specific');
  const [selectedStaff, setSelectedStaff] = useState<string>(staffList[0]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Helper to get raw application URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return '';
  };

  const baseUrl = getBaseUrl();
  
  // Calculate generation URLs
  const generalLink = `${baseUrl}?app=portal`;
  const specificLink = `${baseUrl}?app=staff&staff=${encodeURIComponent(selectedStaff)}`;
  
  const activeLink = shareType === 'general' ? generalLink : specificLink;

  // Invitation Message Template
  const invitationMessage = shareType === 'general'
    ? `[BQL KỸ THUẬT] Kính gửi đội ngũ kỹ thuật viên công ty, đây là liên kết truy cập Cổng quản trị và nhận việc trực tuyến: ${generalLink}. Vui lòng đăng nhập bằng đúng tên của bạn để tác nghiệp.`
    : `[BQL KỸ THUẬT] Chào ${selectedStaff}, đây là liên kết nhận nhiệm vụ sửa chữa trực tiếp dành riêng cho bạn: ${specificLink}. Vui lòng lưu lại để cập nhật tiến độ công tác thường xuyên nhé!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(invitationMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-950/20 border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration block */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-850 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/15 rounded-xl border border-white/20">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">Chia sẻ App cho Nhân Viên</h3>
              <p className="text-indigo-200 text-xs mt-0.5">Gửi liên kết điều hành tác nghiệp đến kỹ thuật viên</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              Phương thức bàn giao liên kết:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-150">
              <button
                type="button"
                onClick={() => setShareType('specific')}
                className={`py-2 px-3 rounded-xl text-xs font-black tracking-wide transition flex items-center justify-center space-x-2 cursor-pointer ${
                  shareType === 'specific'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Theo Nhân Viên</span>
              </button>
              
              <button
                type="button"
                onClick={() => setShareType('general')}
                className={`py-2 px-3 rounded-xl text-xs font-black tracking-wide transition flex items-center justify-center space-x-2 cursor-pointer ${
                  shareType === 'general'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Liên kết Chung</span>
              </button>
            </div>
          </div>

          {/* Conditional Dropdown for selecting specific employee */}
          {shareType === 'specific' && (
            <div className="bg-indigo-50/50 border border-indigo-100/80 p-4 rounded-2xl animate-fade-in">
              <label className="block text-xs font-bold text-indigo-805 uppercase tracking-wide mb-1.5 font-sans">
                Chọn kỹ thuật viên đích danh:
              </label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full bg-white border border-indigo-200 focus:border-indigo-500 text-slate-800 font-bold focus:outline-none rounded-xl text-xs px-3.5 py-3 shadow-xs cursor-pointer"
              >
                {staffList.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff} (Tự động đăng nhập cá nhân)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-indigo-600 mt-1.5 font-medium leading-relaxed">
                * Kỹ thuật viên khi click vào link này sẽ được <b>tự động phân quyền</b> vào ngay tài khoản của họ và chỉ xem chính xác các việc họ cần làm.
              </p>
            </div>
          )}

          {/* Quick generated Link output panel */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Đường dẫn bảo mật phát hành:
            </label>
            <div className="flex bg-slate-900 text-slate-200 rounded-xl overflow-hidden font-mono text-xs border border-slate-850 p-1 pl-3.5 items-center justify-between">
              <span className="truncate mr-2 select-all text-[11px] text-slate-350">
                {activeLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition shrink-0 flex items-center space-x-1.5 ${
                  copiedLink 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-750 text-indigo-350 hover:text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Chép link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Invitation SMS/Zalo box */}
          <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mẫu tin nhắn mời gửi qua Zalo / Viber / SMS:</span>
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold hover:bg-indigo-150 px-2.5 py-1 rounded-lg transition"
              >
                {copiedMessage ? 'Đã sao chép tin nhắn!' : 'Sao chép tin mẫu'}
              </button>
            </div>
            <div className="text-xs text-slate-600 bg-white border border-slate-150 p-3 rounded-xl leading-relaxed italic text-[11px] select-all font-medium">
              {invitationMessage}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-100 p-4.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[10px] text-slate-450 font-medium">
            * Liên kết này hoạt động ổn định trên cả điện thoại (iOS, Android) & máy tính.
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng lại
            </button>
            <a
              href={activeLink}
              target="_blank"
              rel="noreferrer"
              className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center space-x-1.5"
            >
              <span>Test thử Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
