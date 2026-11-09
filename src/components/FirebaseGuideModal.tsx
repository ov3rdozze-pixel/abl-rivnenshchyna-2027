import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, Database, Globe, Key, HelpCircle } from 'lucide-react';

interface FirebaseGuideModalProps {
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Публічне читання для всіх відвідувачів сайту АБЛ
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-[#101524] to-[#0b0e14] border border-slate-700/80 shadow-2xl p-6 sm:p-10 space-y-8 my-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>ПОВНА ІНСТРУКЦІЯ РОЗДІЛУ 13: БЕЗКОШТОВНИЙ ХОСТИНГ ТА БАЗА ДАНИХ</span>
          </div>
          <h2 className="font-athletic text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
            КЕРУВАННЯ САЙТОМ АБЛ ТА ХМАРНА БАЗА ДАНИХ
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Як працювати з сайтом, підключити безкоштовний Google Firebase та отримати постійне посилання без жодних оплат.
          </p>
        </div>

        {/* 7 Core Answers requested by user */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          
          {/* 1. How Firebase Works Free */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-athletic text-xl font-bold uppercase text-orange-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs flex items-center justify-center font-sans font-bold">1</span>
              <span>ЯК НАЛАШТУВАТИ БЕЗКОШТОВНИЙ FIREBASE FIRESTORE</span>
            </h3>
            <p>
              Google Firebase надає безстроковий <strong>Spark Plan (Безкоштовно $0/місяць)</strong>, який ідеально покриває потреби регіональної баскетбольної ліги:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-2">
              <li>Перейдіть на офіційний сайт <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-orange-400 underline font-semibold">console.firebase.google.com</a> та увійдіть через ваш обліковий запис Google.</li>
              <li>Натисніть <strong>«Add project»</strong> (Додати проєкт) та введіть назву, наприклад: <code className="text-orange-300">abl-rivne-2027</code>.</li>
              <li>У лівому меню виберіть <strong>Firestore Database</strong> → натисніть <strong>«Create database»</strong>.</li>
              <li>Оберіть розташування бази даних (наприклад, європейський регіон <code className="text-orange-300">europe-west1</code> або <code className="text-orange-300">europe-central2</code>).</li>
              <li>У вкладці <strong>Rules</strong> (Правила безпеки) вставте офіційні правила:</li>
            </ol>

            <div className="relative mt-2 p-3 bg-black/90 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800">
              <pre className="overflow-x-auto">{sampleRules}</pre>
              <button
                onClick={() => copyToClipboard(sampleRules, 'rules')}
                className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1"
              >
                {copiedKey === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Скопіювати правила</span>
              </button>
            </div>
          </div>

          {/* 2. Admin Auth */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-athletic text-xl font-bold uppercase text-orange-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs flex items-center justify-center font-sans font-bold">2</span>
              <span>ЯК СТВОРИТИ АДМІНІСТРАТОРА ТА УВІЙТИ В АДМІН-ПАНЕЛЬ</span>
            </h3>
            <p>
              Для вашої максимальної зручності на сайті вже встановлено захищений вхід в адміністративну панель:
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>Пароль адміністратора: <strong className="text-orange-400 font-mono text-sm">Igorok24</strong></div>
              <div>Кнопка входу: у правому верхньому кутку сайту натисніть <strong>«ВХІД АДМІНА»</strong>.</div>
              <div>Після входу відкривається повнофункціональна панель керування всіма 9 командами, гравцями, календарем матчів, результатами, новинами, MVP туру та Фіналом чотирьох.</div>
            </div>
          </div>

          {/* 3. Free Hosting and Permanent Link */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-athletic text-xl font-bold uppercase text-orange-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs flex items-center justify-center font-sans font-bold">3</span>
              <span>ЯК ОПУБЛІКУВАТИ САЙТ ТА ОТРИМАТИ ПОСТІЙНЕ БЕЗКОШТОВНЕ ПОСИЛАННЯ</span>
            </h3>
            <p>
              Ви можете розгорнути цей проєкт повністю безкоштовно на будь-якому з наступних сервісів:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block">Варіант A: Firebase Hosting (Рекомендовано)</strong>
                <p className="text-slate-400">
                  Безкоштовний хостинг від Google. Надає постійне безпечне посилання виду: <code className="text-orange-400">https://abl-rivne-2027.web.app</code> із безкоштовним SSL-сертифікатом.
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block">Варіант B: Vercel або Netlify</strong>
                <p className="text-slate-400">
                  Підключення вашого GitHub-репозиторію в 1 клік. Безкоштовний хостинг, автоматичне оновлення при змінах, постійний домен <code className="text-orange-400">https://abl-rivne.vercel.app</code>.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Autonomous Updates & JSON Backup */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-athletic text-xl font-bold uppercase text-orange-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs flex items-center justify-center font-sans font-bold">4</span>
              <span>ЯК САМОСТІЙНО ОНОВЛЮВАТИ ДАНІ ТА РЕЗЕРВНЕ КОПІЮВАННЯ</span>
            </h3>
            <p>
              Усі результати матчів, статистика, гравці та новини, які ви вносите в адмін-панелі:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-2">
              <li>Миттєво зберігаються у вашому браузері.</li>
              <li>Ви можете в будь-який момент натиснути кнопку <strong>«Експорт бази даних у JSON»</strong> у вкладці «База даних» і зберегти резервну копію всього сезону собі на комп'ютер чи телефон.</li>
              <li>За потреби відновлення або перенесення на інший пристрій — просто натисніть <strong>«Імпорт бази даних з JSON»</strong>.</li>
            </ul>
          </div>

          {/* 5. Free Limits Control */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-athletic text-xl font-bold uppercase text-orange-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs flex items-center justify-center font-sans font-bold">5</span>
              <span>КОНТРОЛЬ БЕЗКОШТОВНИХ ЛІМІТІВ (ZERO-COST ГАРАНТІЯ)</span>
            </h3>
            <p>
              Безкоштовний тариф Google Firebase Spark Plan включає щодня:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-athletic text-xl font-bold text-orange-400">50,000</div>
                <div className="text-[10px] text-slate-400 uppercase">Читань / день</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-athletic text-xl font-bold text-orange-400">20,000</div>
                <div className="text-[10px] text-slate-400 uppercase">Записів / день</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-athletic text-xl font-bold text-orange-400">1 ГБ</div>
                <div className="text-[10px] text-slate-400 uppercase">Збережених даних</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-athletic text-xl font-bold text-orange-400">10 ГБ</div>
                <div className="text-[10px] text-slate-400 uppercase">Трафіку / місяць</div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Цих обсягів з запасом вистачає для регулярного чемпіонату АБЛ з сотнями щоденних глядачів. Google не знімає кошти автоматично, оскільки на Spark Plan банківська картка взагалі не потрібна!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
          >
            Зрозуміло, закрити інструкцію
          </button>
        </div>

      </div>
    </div>
  );
};
