'use client'
import React, { useState, useRef, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'

const languages = [
  { code: 'en', flag: 'בריטניה', name: 'English',  welcome: 'Welcome',
    menu: ['Feedback','Updates','Messages','Reminders','Banking Services','Personal Page'],
    card: { title: 'Home Budget Management', namePh: 'Name / Last Name', emailPh: 'Email / Email Address', passPh: 'Password', confirmPassPh: 'Confirm Password', register: 'Register', login: 'Login', update: 'Update', line1: 'During launch period', line2: 'Free', errName: 'Please enter your name', errEmail: 'Please enter a valid email', errPassLen: 'Password must be at least 6 characters', errPassMatch: 'Passwords do not match', errEmailExists: 'Email already registered', cancel: 'Cancel', install: 'Install', library: 'Guide Files' } },
  { code: 'ru', flag: 'רוסיה',   name: 'Русский',  welcome: 'Добро пожаловать',
    menu: ['Отзыв','Обновления','Сообщения','Напоминания','Банковские услуги','Личная страница'],
    card: { title: 'Управление домашним бюджетом', namePh: 'Имя / Фамилия', emailPh: 'Email / Адрес эл. почты', passPh: 'Пароль', confirmPassPh: 'Подтвердите пароль', register: 'Регистрация', login: 'Войти', update: 'Обновить', line1: 'В период запуска', line2: 'Бесплатно', errName: 'Пожалуйста, введите имя', errEmail: 'Введите корректный email', errPassLen: 'Пароль должен содержать не менее 6 символов', errPassMatch: 'Пароли не совпадают', errEmailExists: 'Email уже зарегистрирован', cancel: 'Отмена', install: 'Установить', library: 'Файлы руководства' } },
  { code: 'de', flag: 'גרמניה',  name: 'Deutsch',  welcome: 'Willkommen',
    menu: ['Feedback','Updates','Nachrichten','Erinnerungen','Bankdienstleistungen','Persönliche Seite'],
    card: { title: 'Haushaltsverwaltung', namePh: 'Name / Nachname', emailPh: 'E-Mail / E-Mail-Adresse', passPh: 'Passwort', confirmPassPh: 'Passwort bestätigen', register: 'Registrieren', login: 'Anmelden', update: 'Aktualisieren', line1: 'Während der Einführungsphase', line2: 'Kostenlos', errName: 'Bitte geben Sie Ihren Namen ein', errEmail: 'Bitte geben Sie eine gültige E-Mail ein', errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein', errPassMatch: 'Passwörter stimmen nicht überein', errEmailExists: 'E-Mail bereits registriert', cancel: 'Abbrechen', install: 'Installieren', library: 'Anleitungsdateien' } },
  { code: 'fr', flag: 'צרפת',    name: 'Français', welcome: 'Bienvenue',
    menu: ['Retour','Mises à jour','Messages','Rappels','Services bancaires','Page personnelle'],
    card: { title: 'Gestion du budget familial', namePh: 'Prénom / Nom', emailPh: 'Email / Adresse e-mail', passPh: 'Mot de passe', confirmPassPh: 'Confirmer le mot de passe', register: "S'inscrire", login: 'Se connecter', update: 'Mettre à jour', line1: 'Pendant la période de lancement', line2: 'Gratuit', errName: 'Veuillez entrer votre nom', errEmail: 'Veuillez entrer un email valide', errPassLen: 'Le mot de passe doit contenir au moins 6 caractères', errPassMatch: 'Les mots de passe ne correspondent pas', errEmailExists: 'Email déjà enregistré', cancel: 'Annuler', install: 'Installer', library: 'Fichiers guide' } },
  { code: 'he', flag: 'ישראל',   name: 'עברית',    welcome: 'ברוכים הבאים',
    menu: ['משוב','עדכונים','הודעות','תזכורות','שרותים בנקאיים','דף אישי'],
    card: { title: 'ניהול תקציב בית', namePh: 'שם / שם משפחה', emailPh: 'Email / כתובת מייל', passPh: 'סיסמא', confirmPassPh: 'אימות סיסמא', register: 'הרשמה', login: 'כניסה', update: 'עדכן', line1: 'בתקופת ההרצה', line2: 'חינם', errName: 'נא להזין שם', errEmail: 'נא להזין כתובת מייל תקינה', errPassLen: 'סיסמה חייבת להכיל לפחות 6 תווים', errPassMatch: 'הסיסמאות אינן תואמות', errEmailExists: 'אימייל כבר קיים במערכת', cancel: 'בטל', install: 'התקנה', library: 'קובצי הדרכה' } },
  { code: 'es', flag: 'ספרד',    name: 'Español',  welcome: 'Bienvenido',
    menu: ['Comentarios','Actualizaciones','Mensajes','Recordatorios','Servicios bancarios','Página personal'],
    card: { title: 'Gestión del presupuesto familiar', namePh: 'Nombre / Apellido', emailPh: 'Email / Dirección de correo', passPh: 'Contraseña', confirmPassPh: 'Confirmar contraseña', register: 'Registrarse', login: 'Iniciar sesión', update: 'Actualizar', line1: 'Durante el período de lanzamiento', line2: 'Gratis', errName: 'Por favor ingrese su nombre', errEmail: 'Por favor ingrese un email válido', errPassLen: 'La contraseña debe tener al menos 6 caracteres', errPassMatch: 'Las contraseñas no coinciden', errEmailExists: 'El correo ya está registrado', cancel: 'Cancelar', install: 'Instalar', library: 'Archivos de guía' } },
  { code: 'ja', flag: 'יפן',     name: '日本語',    welcome: 'ようこそ',
    menu: ['フィードバック','更新','メッセージ','リマインダー','銀行サービス','個人ページ'],
    card: { title: '家計管理', namePh: '名前 / 苗字', emailPh: 'メール / メールアドレス', passPh: 'パスワード', confirmPassPh: 'パスワードの確認', register: '登録', login: 'ログイン', update: '更新', line1: 'ローンチ期間中', line2: '無料', errName: '名前を入力してください', errEmail: '有効なメールアドレスを入力してください', errPassLen: 'パスワードは6文字以上必要です', errPassMatch: 'パスワードが一致しません', errEmailExists: 'このメールアドレスはすでに登録されています', cancel: 'キャンセル', install: 'インストール', library: 'ガイドファイル' } },
  { code: 'ar', flag: 'סעודיה',  name: 'العربية',  welcome: 'أهلاً وسهلاً',
    menu: ['ملاحظات','تحديثات','رسائل','تذكيرات','خدمات مصرفية','الصفحة الشخصية'],
    card: { title: 'إدارة الميزانية المنزلية', namePh: 'الاسم / اسم العائلة', emailPh: 'البريد الإلكتروني', passPh: 'كلمة المرور', confirmPassPh: 'تأكيد كلمة المرور', register: 'تسجيل', login: 'دخول', update: 'تحديث', line1: 'خلال فترة الإطلاق', line2: 'مجاناً', errName: 'الرجاء إدخال اسمك', errEmail: 'الرجاء إدخال بريد إلكتروني صحيح', errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل', errPassMatch: 'كلمتا المرور غير متطابقتين', errEmailExists: 'البريد الإلكتروني مسجل بالفعل', cancel: 'إلغاء', install: 'تثبيت', library: 'ملفات الدليل' } },
  { code: 'zh', flag: 'סין',     name: '中文',      welcome: '欢迎',
    menu: ['反馈','更新','消息','提醒','银行服务','个人页面'],
    card: { title: '家庭预算管理', namePh: '名字 / 姓氏', emailPh: '邮箱 / 电子邮件地址', passPh: '密码', confirmPassPh: '确认密码', register: '注册', login: '登录', update: '更新', line1: '在发布期间', line2: '免费', errName: '请输入您的姓名', errEmail: '请输入有效的电子邮件地址', errPassLen: '密码必须至少包含6个字符', errPassMatch: '密码不匹配', errEmailExists: '该邮箱已注册', cancel: '取消', install: '安装', library: '指南文件' } },
  { code: 'it', flag: 'איטליה',  name: 'Italiano', welcome: 'Benvenuto',
    menu: ['Feedback','Aggiornamenti','Messaggi','Promemoria','Servizi bancari','Pagina personale'],
    card: { title: 'Gestione del budget familiare', namePh: 'Nome / Cognome', emailPh: 'Email / Indirizzo email', passPh: 'Password', confirmPassPh: 'Conferma password', register: 'Registrati', login: 'Accedi', update: 'Aggiorna', line1: 'Durante il periodo di lancio', line2: 'Gratis', errName: 'Inserisci il tuo nome', errEmail: 'Inserisci un indirizzo email valido', errPassLen: 'La password deve contenere almeno 6 caratteri', errPassMatch: 'Le password non corrispondono', errEmailExists: 'Email già registrata', cancel: 'Annulla', install: 'Installa', library: 'File guida' } },
  { code: 'hi', flag: 'הודו',    name: 'हिंदी',     welcome: 'स्वागत है',
    menu: ['फीडबैक','अपडेट','संदेश','अनुस्मारक','बैंकिंग सेवाएं','व्यक्तिगत पृष्ठ'],
    card: { title: 'घरेलू बजट प्रबंधन', namePh: 'नाम / उपनाम', emailPh: 'ईमेल / ईमेल पता', passPh: 'पासवर्ड', confirmPassPh: 'पासवर्ड की पुष्टि करें', register: 'पंजीकरण', login: 'लॉग इन', update: 'अपडेट', line1: 'लॉन्च अवधि के दौरान', line2: 'मुफ्त', errName: 'कृपया अपना नाम दर्ज करें', errEmail: 'कृपया एक मान्य ईमेल दर्ज करें', errPassLen: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए', errPassMatch: 'पासवर्ड मेल नहीं खाते', errEmailExists: 'ईमेल पहले से पंजीकृत है', cancel: 'रद्द करें', install: 'इंस्टॉल करें', library: 'गाइड फ़ाइलें' } },
]

export default function Home() {
  const [langIdx, setLangIdx]       = useState(0)
  const [activePage, setActivePage] = useState<string | null>(null)
  const [popupMsg, setPopupMsg] = useState<{ title: string; subtitle?: string; body: string; bodyColor?: string } | null>(null)
  const [Current_User_Pointer_to_DB, set_Current_User_Pointer_to_DB] = useState<{
    id: number; name: string; email: string; language: string; license_type: string; is_active: boolean
  } | null>(null)
  const lang = languages[langIdx]

  useEffect(() => {
    if (!Current_User_Pointer_to_DB) return
    const idx = languages.findIndex(l => l.name === Current_User_Pointer_to_DB.language)
    if (idx !== -1) setLangIdx(idx)
    localStorage.setItem('kc_user', String(Current_User_Pointer_to_DB.id))
  }, [Current_User_Pointer_to_DB])

  useEffect(() => {
    const id = localStorage.getItem('kc_user')
    if (!id) return
    fetch('/api/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id) }),
    }).then(r => r.json()).then(data => {
      if (!data.user) return
      set_Current_User_Pointer_to_DB(data.user)
    })
  }, [])

  function checkIfInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        window.removeEventListener('blur', onBlur)
        resolve(false)
      }, 1500)
      function onBlur() {
        clearTimeout(timeout)
        window.removeEventListener('blur', onBlur)
        resolve(true)
      }
      window.addEventListener('blur', onBlur)
      const a = document.createElement('a')
      a.href = 'mfinance://'
      a.click()
    })
  }

  async function handleInstall() {
    setPopupMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'בודק...' })
    const installed = await checkIfInstalled()
    if (installed) {
      setPopupMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'האפליקציה נפתחה\nבודקת עדכונים...' })
      return
    }
    setPopupMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'הורד קובץ התקנה' })
    try {
      const res  = await fetch('/api/download-mfinance')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'M_Finance_Setup.exe'
      a.click()
      await new Promise(r => setTimeout(r, 1000))
      URL.revokeObjectURL(url)
      setPopupMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'התקנה בוצעה' })
    } catch {
      setPopupMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'שגיאה בהורדה\nנסה שוב', bodyColor: '#ff6600' })
    }
  }

  function handleRun() {
    window.open('mfinance://', '_self')
  }

  function changeLang(i: number) {
    setLangIdx(i)
    if (Current_User_Pointer_to_DB) {
      fetch('/api/update-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: Current_User_Pointer_to_DB.email, language: languages[i].name }),
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {popupMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '16px', padding: '36px 48px 44px', textAlign: 'center', boxShadow: '0 12px 48px rgba(0,0,0,0.7)', minWidth: '300px', position: 'relative' }}>
            <div style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif' }}>{popupMsg.title}</div>
            {popupMsg.subtitle && <div style={{ color: '#FFD700', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{popupMsg.subtitle}</div>}
            <div style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', color: popupMsg.bodyColor ?? '#FFD700', fontSize: '32px', lineHeight: '1.4', marginBottom: '8px', whiteSpace: 'pre-line' }}>{popupMsg.body}</div>
            <div onClick={() => setPopupMsg(null)} style={{ position: 'absolute', right: '12px', bottom: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>לחץ</div>
          </div>
        </div>
      )}

      {/* TOP — Flags bar */}
      <header style={{ background: '#111', padding: '5px 14px', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
        {languages.map((l, i) => (
          <button key={l.code} onClick={() => changeLang(i)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <Image src={`/flags/${l.code}${langIdx === i ? '1' : ''}.png`} alt={l.flag} width={38} height={38}
              style={{ borderRadius: '50%', border: langIdx === i ? '2px solid #fff' : '2px solid transparent', display: 'block', marginTop: l.code === 'hi' ? '2px' : '0px' }} />
            <span style={{ fontSize: '9px', color: langIdx === i ? '#fff' : '#aaa', whiteSpace: 'nowrap', marginTop: l.code === 'hi' ? '2px' : '0px', display: 'block' }}>{l.name}</span>
          </button>
        ))}
      </header>

      {/* MIDDLE ROW */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* CENTER */}
        <main style={{ flex: 1, background: '#f2eef2', position: 'relative', overflow: 'hidden' }}>
          {activePage === null ? (
            <GatePage lang={lang} />
          ) : (
            <PageContent page={activePage} lang={lang} onClose={() => setActivePage(null)} onLogin={(user) => set_Current_User_Pointer_to_DB(user)} onNavigate={(p) => setActivePage(p)} onMsg={setPopupMsg} />
          )}
        </main>

        {/* RIGHT — Sidebar */}
        <aside style={{ width: '140px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'stretch', flexShrink: 0 }}>
          <div style={{ padding: '4px 6px 8px', borderBottom: '1px solid #333' }}>
            <div style={{ fontFamily: 'var(--font-dancing), Georgia, serif', fontSize: '23px', color: '#FFD700', fontWeight: 'bold', textAlign: 'center' }}>KeyClick</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '44px', marginTop: '6px' }}>
              <Image src={`/flags/${lang.code}1.png`} alt={lang.flag} width={55} height={55} />
            </div>
          </div>
          {lang.menu.map((item, idx) => (
            <button key={idx} onClick={() => setActivePage(String(idx) === activePage ? null : String(idx))}
              style={{
                background: activePage === String(idx) ? '#4a1a6e' : 'none', border: 'none',
                borderBottom: '1px solid #333', color: activePage === String(idx) ? '#fff' : '#ccc',
                padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
                fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.3',
              }}
              onMouseEnter={e => { if (activePage !== String(idx)) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (activePage !== String(idx)) e.currentTarget.style.color = '#ccc' }}
            >{item}</button>
          ))}

          {/* M Finance container */}
          <div style={{ margin: '8px 6px', border: '1px solid #666', borderRadius: '8px', padding: '6px 4px 8px' }}>
            <div style={{ color: '#FFD700', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '5px', marginBottom: '6px', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif' }}>
              ניהול תקציב בית
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <button onClick={() => setActivePage('mf-login')}
                style={{ ...mfBtn, ...(activePage === 'mf-login' ? { background: '#4a1a6e' } : {}) }}>
                כניסה
              </button>
              <button onClick={() => setActivePage('mf-register')}
                style={{ ...mfBtn, ...(activePage === 'mf-register' ? { background: '#4a1a6e' } : {}) }}>
                הרשמה
              </button>
              <button onClick={handleInstall} style={{ ...mfBtn }}>התקנה</button>
              <button onClick={handleRun}    style={{ ...mfBtn }}>הפעלה</button>
              <button onClick={() => {}} style={{ ...mfBtn }}>סרטונים</button>
              <button onClick={() => {}} style={{ ...mfBtn }}>הדרכה</button>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <button onClick={() => setActivePage('system')}
            style={{
              background: activePage === 'system' ? '#4a1a6e' : 'none', border: 'none',
              borderTop: '2px solid #555', color: activePage === 'system' ? '#fff' : '#888',
              padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              fontSize: '11px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.3',
            }}
            onMouseEnter={e => { if (activePage !== 'system') e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { if (activePage !== 'system') e.currentTarget.style.color = '#888' }}
          >בשימוש מערכת</button>
        </aside>

      </div>

      {/* BOTTOM */}
      <footer style={{ background: '#111', color: '#666', padding: '6px 16px', fontSize: '12px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ color: '#FFD700' }}>KeyClick · M Solution Group</span>
        <span style={{ color: '#FFD700' }}>Ver: 2.00 &nbsp; 17.06.2026 00:30</span>
      </footer>

    </div>
  )
}

function GatePage({ lang }: { lang: typeof languages[0] }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image src="/Pictures/Welcome Label1.jpg" alt="scroll" fill style={{ objectFit: 'fill' }} priority />
      <div style={{ position: 'absolute', left: '5%', top: '42%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <Image src={`/flags/${lang.code}1.png`} alt={lang.flag} width={100} height={100} style={{ display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: '1%', top: '62%', width: '15%', textAlign: 'center', fontFamily: 'var(--font-dancing), Georgia, serif', fontWeight: 'bold', fontSize: '36px', color: '#cc00cc', zIndex: 10 }}>
        KeyClick
      </div>
      <div style={{ position: 'absolute', top: '28%', left: '16%', right: '4%', textAlign: 'center',
        fontFamily: lang.code === 'he' ? '"Guttman Yad","Levenim MT","Miriam","David",serif' : 'var(--font-dancing),Georgia,serif',
        fontWeight: 'bold', fontSize: '88px', color: '#cc00cc', zIndex: 10 }}>
        {lang.welcome}
      </div>
      <div style={{ position: 'absolute', top: '56%', left: '14%', right: '4%', textAlign: 'center', fontFamily: 'var(--font-dancing), Georgia, serif', fontWeight: 'bold', fontSize: '94px', color: '#cc00cc', zIndex: 10 }}>
        M Solution Group
      </div>
    </div>
  )
}

type UserRecord = { id: number; name: string; email: string; language: string; license_type: string; is_active: boolean }

function PageContent({ page, lang, onClose, onLogin, onNavigate, onMsg }: { page: string; lang: typeof languages[0]; onClose: () => void; onLogin: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void }) {
  if (page === 'mf-login')    return <RegisterCard lang={lang} initialPhase='default'  onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} />
  if (page === 'mf-register') return <RegisterCard lang={lang} initialPhase='register' onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} />
  if (page === 'system') return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#003399' }}>KeyClick מערכת</div>
    </div>
  )
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', color: '#9b30c8' }}>{lang.menu[parseInt(page)]}</div>
        <div style={{ fontSize: '16px' }}>הדף בפיתוח</div>
      </div>
    </div>
  )
}

function handFont(code: string) {
  if (code === 'he') return '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif'
  if (code === 'ru') return 'var(--font-caveat),"Caveat",cursive'
  return 'var(--font-dancing),"Dancing Script",Georgia,serif'
}

function RegisterCard({ lang, initialPhase = 'default', onClose, onLogin, onNavigate, onMsg }: { lang: typeof languages[0]; initialPhase?: 'default' | 'register'; onClose: () => void; onLogin: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void }) {
  const c    = lang.card
  const dir  = lang.code === 'ar' ? 'rtl' : 'ltr'
  const font = handFont(lang.code)

  const nameRef  = useRef<HTMLInputElement>(null)
  const mailRef  = useRef<HTMLInputElement>(null)
  const passRef  = useRef<HTMLInputElement>(null)
  const confRef  = useRef<HTMLInputElement>(null)
  const dragRef  = useRef({ dragging: false, mx: 0, my: 0, px: 0, py: 0 })
  const [pos,    setPos]    = useState({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current.dragging) return
      setPos({
        x: dragRef.current.px + e.clientX - dragRef.current.mx,
        y: dragRef.current.py + e.clientY - dragRef.current.my,
      })
    }
    function onUp() { dragRef.current.dragging = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  function onDragStart(e: React.MouseEvent) {
    dragRef.current = { dragging: true, mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
  }

  const [phase,      setPhase]      = useState<'default' | 'register'>(initialPhase)
  const [savedName,  setSavedName]  = useState('')
  const [savedEmail, setSavedEmail] = useState('')
  const [savedPass,  setSavedPass]  = useState('')
  const [savedConf,  setSavedConf]  = useState('')
  const [error,      setError]      = useState('')
  const [done,       setDone]       = useState(false)
  const [registered, setRegistered] = useState(false)

  const locked: React.CSSProperties = { background: '#222', color: '#777', cursor: 'default' }

  function handleRegister() {
    setPhase('register')
  }

  async function handleUpdate() {
    setError('')
    if (!savedName)                              { setError(c.errName);     return }
    if (!savedEmail || !savedEmail.includes('@')) { setError(c.errEmail);    return }
    if (savedPass && savedPass.length < 6)       { setError(c.errPassLen);  return }
    if (savedPass !== savedConf)                 { setError(c.errPassMatch); return }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: savedName, email: savedEmail, password: savedPass || null, language: lang.name }),
    })
    const data = await res.json()
    if (!res.ok) { setError(c.errEmailExists); return }
    setSavedPass('')
    setSavedConf('')
    setError('')
    onMsg({ title: 'ניהול תקציב בית', subtitle: 'M Finance', body: 'הרשמה הושלמה' })
  }

  async function handleLogin() {
    setError('')
    if (!savedPass) { setError(c.errPassLen); return }
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: savedEmail, password: savedPass }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    onLogin(data.user)
    setSavedName('')
    setSavedEmail('')
    setSavedPass('')
    setSavedConf('')
    setPhase('default')
    setRegistered(false)
    onClose()
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f2eef2' }}>
      <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '40px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: 'Arial, sans-serif', position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}>

        <div onMouseDown={onDragStart} style={{ textAlign: 'center', marginBottom: '28px', cursor: 'grab', userSelect: 'none' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontStyle: 'italic', fontFamily: 'var(--font-dancing), Georgia, serif' }}>KeyClick</div>
          <div style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', color: '#FFD700', fontSize: '22px', marginTop: '6px' }}>ניהול תקציב בית</div>
          <div style={{ color: '#999', fontSize: '13px', marginTop: '2px', fontFamily: 'Arial, sans-serif' }}>M Finance</div>
        </div>

        {phase === 'default' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text"     placeholder={c.namePh}  value={savedName}  onChange={e => setSavedName(e.target.value)}  style={{ ...regInput, direction: dir }} />
              <input type="email"    placeholder={c.emailPh} value={savedEmail} onChange={e => setSavedEmail(e.target.value)} style={{ ...regInput }} />
              <input type="password" placeholder={c.passPh}  value={savedPass}  onChange={e => setSavedPass(e.target.value)}  style={{ ...regInput }} />
            </div>
            <div style={{ marginTop: '18px', textAlign: 'center', fontFamily: font, color: '#ffffff', fontWeight: 'bold' }}>
              <div style={{ fontSize: '22px' }}>{c.line1}</div>
              <div style={{ fontSize: '32px' }}>{c.line2}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={handleLogin} style={{ ...regBtn }}>{c.login}</button>
            </div>
            {error && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
            <div onClick={onClose} style={{ position: 'absolute', right: '12px', bottom: '12px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>בטל</div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text"     placeholder={c.namePh}        value={savedName}  onChange={e => setSavedName(e.target.value)}  style={{ ...regInput, direction: dir }} />
              <input type="email"    placeholder={c.emailPh}       value={savedEmail} onChange={e => setSavedEmail(e.target.value)} style={{ ...regInput }} />
              <input type="password" placeholder={c.passPh}        value={savedPass}  onChange={e => setSavedPass(e.target.value)}  style={{ ...regInput }} />
              <input type="password" placeholder={c.confirmPassPh} value={savedConf}  onChange={e => setSavedConf(e.target.value)}  style={{ ...regInput }} />
            </div>
            {error && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
            <div style={{ marginTop: '18px', textAlign: 'center', fontFamily: font, color: '#ffffff', fontWeight: 'bold' }}>
              <div style={{ fontSize: '22px' }}>{c.line1}</div>
              <div style={{ fontSize: '32px' }}>{c.line2}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button onClick={handleUpdate} style={{ ...regBtn }}>הרשמה</button>
            </div>
            <div onClick={onClose} style={{ position: 'absolute', right: '12px', bottom: '12px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>בטל</div>
          </>
        )}

      </div>
    </div>
  )
}

const regInput: React.CSSProperties = {
  background: '#333', border: '1px solid #444', borderRadius: '8px',
  padding: '12px 16px', color: '#fff', fontSize: '14px', fontWeight: 'bold',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

const regBtn: React.CSSProperties = {
  background: '#003399', borderRadius: '6px', padding: '8px 20px',
  color: '#FFD700', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
}

const mfBtn: React.CSSProperties = {
  background: '#003399', borderRadius: '5px', padding: '7px 2px',
  color: '#FFD700', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
  border: '1px solid #0055cc', textAlign: 'center',
}
