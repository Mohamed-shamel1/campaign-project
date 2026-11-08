import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService, VALID_CREDENTIALS } from '../services/authService';
import { Button } from '../components/common/Button';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/';

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [username, setUsername] = useState(() => AuthService.getRememberedUsername() || 'Gamil_122');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Card theme preference (Dark obsidian card vs Light white card on the white background)
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('al_fouad_login_card_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleCardTheme = (theme: 'dark' | 'light') => {
    setCardTheme(theme);
    try {
      localStorage.setItem('al_fouad_login_card_theme', theme);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'فشل تسجيل الدخول.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername(VALID_CREDENTIALS.username);
    setPassword(VALID_CREDENTIALS.password);
    setError(null);
  };

  const isDarkCard = cardTheme === 'dark';

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none relative overflow-hidden"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -12%, rgba(236,30,40,0.12) 0%, transparent 65%), radial-gradient(ellipse 70% 40% at 50% 115%, rgba(236,30,40,0.06) 0%, transparent 60%)',
      }}
    >
      {/* Subtle Crisp Dot Matrix Pattern for Light Mode */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient Crimson Aura Flare in Top Right */}
      <div 
        className="absolute -top-32 -end-32 w-[420px] h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(236,30,40,0.18) 0%, transparent 70%)' }}
      />

      {/* Floating Bottom Ambient Glow */}
      <div 
        className="absolute -bottom-32 -start-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(236,30,40,0.12) 0%, transparent 70%)' }}
      />

      {/* Top Floating Card Theme Switcher */}
      <div className="relative z-20 mb-4 inline-flex items-center gap-1.5 p-1 bg-white/90 border border-slate-200/90 rounded-full shadow-xs backdrop-blur-md text-xs">
        <button
          type="button"
          onClick={() => toggleCardTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
            isDarkCard
              ? 'bg-[#0f141a] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-rose-400" />
          <span>كارت فحمى فاخر</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCardTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
            !isDarkCard
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span>كارت أبيض كامل</span>
        </button>
      </div>

      {/* Center Auth Card Container */}
      <div className="relative z-10 w-full max-w-md mx-auto transition-all duration-300">
        <div
          className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 ${
            isDarkCard
              ? 'bg-[#0f141a]/98 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35),_0_0_35px_rgba(236,30,40,0.12)] text-white'
              : 'bg-white/98 border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.1),_0_0_30px_rgba(236,30,40,0.06)] text-slate-900'
          }`}
        >
          {/* Top Logo Stage */}
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className={`h-20 w-44 rounded-2xl p-2.5 shadow-md flex items-center justify-center mb-4 transition-transform hover:scale-[1.02] ${
                isDarkCard
                  ? 'bg-white border border-slate-200/90'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <img
                src="/logo.png"
                alt="شعار صيدليات الفؤاد الرسمي"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Pill Header */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-2 ${
                isDarkCard
                  ? 'bg-red-950/60 border border-red-800/40 text-rose-300'
                  : 'bg-red-50 border border-red-200/80 text-brand-700'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDarkCard ? 'text-rose-400' : 'text-brand-600'}`} />
              <span>صيدليات الفؤاد • قسم العناية والتجميل</span>
            </div>

            <h1
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isDarkCard ? 'text-white' : 'text-slate-900'
              }`}
            >
              تسجيل الدخول للمنظومة
            </h1>
            <p
              className={`text-xs mt-1 ${
                isDarkCard ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              مدير حملات واتساب التسويقية والربط السحابي
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div
              className={`mb-5 p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-shake ${
                isDarkCard
                  ? 'bg-rose-950/60 border-rose-800/60 text-rose-200'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isDarkCard ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Gamil_122"
                  className={`w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl transition-all font-sans focus:outline-none focus:ring-2 focus:ring-[#ec1e28]/30 focus:border-[#ec1e28] ${
                    isDarkCard
                      ? 'bg-white/[0.04] border border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`block text-xs font-semibold ${
                    isDarkCard ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  كلمة المرور
                </label>
              </div>
              <div className="relative">
                <div className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ps-10 pe-10 py-2.5 text-sm rounded-xl transition-all font-sans focus:outline-none focus:ring-2 focus:ring-[#ec1e28]/30 focus:border-[#ec1e28] ${
                    isDarkCard
                      ? 'bg-white/[0.04] border border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute end-3 top-1/2 -translate-y-1/2 transition-colors p-1 ${
                    isDarkCard
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Credentials Helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label
                className={`flex items-center gap-2 cursor-pointer select-none ${
                  isDarkCard ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-400 bg-white/5 text-[#ec1e28] focus:ring-[#ec1e28]/30"
                />
                <span>تذكّر تسجيل الدخول</span>
              </label>

              {/* Fast autofill helper */}
              <button
                type="button"
                onClick={handleFillDemo}
                className={`text-[11px] flex items-center gap-1 font-semibold underline underline-offset-4 ${
                  isDarkCard
                    ? 'text-rose-400 hover:text-rose-300 decoration-rose-500/40'
                    : 'text-brand-700 hover:text-brand-800 decoration-brand-300'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>تعبئة تلقائية معتمدة</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full bg-[#ec1e28] hover:bg-[#d0151f] text-white shadow-[0_4px_20px_rgba(236,30,40,0.4)] font-bold border-none text-sm py-3 rounded-xl transition-all"
                leftIcon={<ArrowLeft className="w-4 h-4 stroke-[2.5]" />}
              >
                دخول إلى لوحة التحكم
              </Button>
            </div>

          </form>

          {/* Quick Info Box */}
          <div
            className={`mt-6 pt-4 border-t text-center ${
              isDarkCard ? 'border-slate-800/80' : 'border-slate-100'
            }`}
          >
            <div
              className={`inline-flex items-center gap-1.5 text-[11px] ${
                isDarkCard ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>جلسة مصرحة ومحمية محلياً في المتصفح</span>
            </div>
            <p
              className={`text-[10px] mt-1 ${
                isDarkCard ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              صيدليات الفؤاد (AL Fouad PHARMACIES) • الإصدار 1.0.0
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
