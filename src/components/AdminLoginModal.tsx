import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { X, Lock, Key, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const { loginAdmin } = useLeague();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-[#101524] to-[#0b0e14] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            ВХІД В АДМІН-ПАНЕЛЬ
          </h3>
          <p className="text-xs text-slate-400">
            Введіть пароль адміністратора ліги для керування турніром
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Пароль доступу
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Введіть пароль (Igorok24)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Невірний пароль. Спробуйте: Igorok24</span>
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Пароль доступу:</span>
            </div>
            <p>Пароль адміністратора: <code className="text-orange-400 font-bold">Igorok24</code></p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/30"
            >
              Увійти
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
