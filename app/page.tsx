'use client'
import React, { useState, useRef, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { LICENSE_TYPES } from '@/lib/license-types'

const languages = [
  { code: 'en', flag: 'בריטניה', name: 'English',  welcome: 'Welcome',
    menu: ['Feedback','Updates','Messages','Reminders','Banking Services','Personal Page'],
    card: { title: 'Home Budget Management', namePh: 'Name / Last Name', emailPh: 'Email / Email Address', passPh: 'Password', confirmPassPh: 'Confirm Password', register: 'Register', login: 'Login', update: 'Update', line1: 'During launch period', line2: 'Free', errName: 'Please enter your name', errEmail: 'Please enter a valid email', errPassLen: 'Password must be at least 6 characters', errPassMatch: 'Passwords do not match', errEmailExists: 'Email already registered', cancel: 'Cancel', install: 'Install', library: 'Guide Files', run: 'Run', videos: 'Videos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Already installed\nNo need to reinstall', msgDownloading: 'Downloading installation file', msgInstallComplete: 'Save and run the file\nto complete installation', msgDownloadError: 'Download error\nTry again', msgNotInstalled: 'Not installed\nPlease click Install', mFinance: 'M Finance', msgExists: 'User already registered\nwith these details', msgUpdated: 'Details updated successfully', msgRegistered: 'Registration complete' },
    profile: { fullName: 'Full Name', email: 'Email', ip: 'IP', language: 'Language', country: 'Country', plan: 'Plan', planStart: 'Plan Start', planEnd: 'Plan End', unlimited: 'Unlimited', comingSoon: 'Coming Soon', choosePlan: 'Choose Plan', close: '✕ Close', loginRequired: 'Login required to view personal page', login: 'Login', products: 'Products', change: 'Change',
      price: 'Price', changePlan: 'Change Plan', planName: 'Name', planFrom: 'From', planTo: 'To', back: 'Back', currencyLocal: '$', free: 'Free',       planNames: { System_Free_Run: 'Free Run', User_Trial: 'Trial', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monthly', User_Annual: 'Annual', User_One_Time: 'Single Entry', System_Suspended_NonPayment: 'Suspended', User_Cancelled: 'Cancelled' } },
    feedback: { customerRelations: 'Customer Relations', systemMessage: 'System Message', respectfully: 'Respectfully,', rating: 'Rating', ratingWebsite: 'Website', ratingBudget: 'Home Budget Management', userMessage: 'User Message', date: 'Date:', title: 'Title:', from: 'From:', systemReply: 'System Reply' },
    system: { systemLabel: 'System', selectAction: 'Select action from right sidebar', users: 'Users', buildMessages: 'Build Messages', schedule: 'Schedule & Pricing', pr: 'Public Relations', publishedDate: 'Published date:', reset: 'Reset', saved: 'Saved', records: 'records', scheduleSubject: 'Subject', schedulePriceUSD: 'Price\n[$]', schedulePeriod: 'Period\n[mo]', scheduleNotes: 'Notes', clear: 'Clear', pause: 'Pause', resume: 'Resume', active: '● Active', paused: 'Paused', lines: 'lines', filter: 'Filter', refresh: 'Refresh', loading: 'Loading...', loadingBuild: 'Loading build data...', error: 'Error', noBuildData: 'No build data. Run Release_KeyClick.bat', networkError: 'Network error', adminButton: 'System Use', generalGroup: 'General', colName: 'Name', colCurrency: 'Currency', colCreated: 'Created', colActive: 'Is Active', colAppInstalled: 'App Installed', colLicenceType: 'Licence Type', colSystemForce: 'System Force', distributionDay: 'Distribution Day X', messages: 'Messages', send: 'Send', sent: 'Sent!', reply: 'Reply', noMessages: 'No messages', replySent: 'Reply sent!' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Pound', EUR: 'Euro', RUB: 'Ruble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupee' } },
  { code: 'ru', flag: 'רוסיה',   name: 'Русский',  welcome: 'Добро пожаловать',
    menu: ['Отзыв','Обновления','Сообщения','Напоминания','Банковские услуги','Личная страница'],
    card: { title: 'Управление домашним бюджетом', namePh: 'Имя / Фамилия', emailPh: 'Email / Адрес эл. почты', passPh: 'Пароль', confirmPassPh: 'Подтвердите пароль', register: 'Регистрация', login: 'Войти', update: 'Обновить', line1: 'В период запуска', line2: 'Бесплатно', errName: 'Пожалуйста, введите имя', errEmail: 'Введите корректный email', errPassLen: 'Пароль должен содержать не менее 6 символов', errPassMatch: 'Пароли не совпадают', errEmailExists: 'Email уже зарегистрирован', cancel: 'Отмена', install: 'Установить', library: 'Файлы руководства', run: 'Запуск', videos: 'Видео', guide: 'Руководство', ok: 'ОК', msgAlreadyInstalled: 'Уже установлено\nПереустановка не нужна', msgDownloading: 'Загрузка установщика', msgInstallComplete: 'Сохраните и запустите файл\nдля завершения установки', msgDownloadError: 'Ошибка загрузки\nПопробуйте снова', msgNotInstalled: 'Не установлено\nНажмите Установить', mFinance: 'M Finance', msgExists: 'Пользователь уже зарегистрирован\nс этими данными', msgUpdated: 'Данные обновлены успешно', msgRegistered: 'Регистрация завершена' },
    profile: { fullName: 'Полное имя', email: 'Email', ip: 'IP', language: 'Язык', country: 'Страна', plan: 'Тариф', planStart: 'Начало тарифа', planEnd: 'Конец тарифа', unlimited: 'Без ограничений', comingSoon: 'Скоро', choosePlan: 'Выбрать тариф', close: '✕ Закрыть', loginRequired: 'Необходимо войти для просмотра', login: 'Войти', products: 'Продукты', change: 'Изменить',
      price: 'Цена', changePlan: 'Изменить тариф', planName: 'Название', planFrom: 'С', planTo: 'По', back: 'Назад', currencyLocal: '₽', free: 'Бесплатно',       planNames: { System_Free_Run: 'Тест', User_Trial: 'Пробный', User_VIP_Free: 'VIP', System_Owner: 'Система', User_Monthly: 'Ежемесячно', User_Annual: 'Ежегодно', User_One_Time: 'Разовый', System_Suspended_NonPayment: 'Отключён', User_Cancelled: 'Отменён' } },
    feedback: { customerRelations: 'Связи с клиентами', systemMessage: 'Системное сообщение', respectfully: 'С уважением,', rating: 'Оценка', ratingWebsite: 'Сайт', ratingBudget: 'Управление бюджетом', userMessage: 'Сообщение пользователя', date: 'Дата:', title: 'Тема:', from: 'От:', systemReply: 'Ответ системы' },
    system: { systemLabel: 'Система', selectAction: 'Выберите действие на правой панели', users: 'Пользователи', buildMessages: 'Журнал сборки', schedule: 'Расписание и цены', pr: 'PR', publishedDate: 'Опубликовано:', reset: 'Сбросить', saved: 'Сохранено', records: 'записей', scheduleSubject: 'Тема', schedulePriceUSD: 'Цена\n[$]', schedulePeriod: 'Период\n[мес]', scheduleNotes: 'Заметки', clear: 'Очистить', pause: 'Пауза', resume: 'Продолжить', active: '● Активно', paused: 'На паузе', lines: 'строк', filter: 'Фильтр', refresh: 'Обновить', loading: 'Загрузка...', loadingBuild: 'Загрузка данных сборки...', error: 'Ошибка', noBuildData: 'Нет данных. Запустите Release_KeyClick.bat', networkError: 'Ошибка сети', adminButton: 'Системный вход', generalGroup: 'Общие', colName: 'Имя', colCurrency: 'Валюта', colCreated: 'Создан', colActive: 'Активен', colAppInstalled: 'Приложение', colLicenceType: 'Тип лицензии', colSystemForce: 'Системный режим', distributionDay: 'День X распространения', messages: 'Сообщения', send: 'Отправить', sent: 'Отправлено!', reply: 'Ответить', noMessages: 'Нет сообщений', replySent: 'Ответ отправлен!' },
    currencyNames: { ILS: 'Шекель', USD: 'Доллар', GBP: 'Фунт', EUR: 'Евро', RUB: 'Рубль', JPY: 'Иена', SAR: 'Риял', CNY: 'Юань', INR: 'Рупия' } },
  { code: 'de', flag: 'גרמניה',  name: 'Deutsch',  welcome: 'Willkommen',
    menu: ['Feedback','Updates','Nachrichten','Erinnerungen','Bankdienstleistungen','Persönliche Seite'],
    card: { title: 'Haushaltsverwaltung', namePh: 'Name / Nachname', emailPh: 'E-Mail / E-Mail-Adresse', passPh: 'Passwort', confirmPassPh: 'Passwort bestätigen', register: 'Registrieren', login: 'Anmelden', update: 'Aktualisieren', line1: 'Während der Einführungsphase', line2: 'Kostenlos', errName: 'Bitte geben Sie Ihren Namen ein', errEmail: 'Bitte geben Sie eine gültige E-Mail ein', errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein', errPassMatch: 'Passwörter stimmen nicht überein', errEmailExists: 'E-Mail bereits registriert', cancel: 'Abbrechen', install: 'Installieren', library: 'Anleitungsdateien', run: 'Starten', videos: 'Videos', guide: 'Anleitung', ok: 'OK', msgAlreadyInstalled: 'Bereits installiert\nKeine Neuinstallation nötig', msgDownloading: 'Installationsdatei wird heruntergeladen', msgInstallComplete: 'Datei speichern und ausführen\num die Installation abzuschließen', msgDownloadError: 'Fehler beim Herunterladen\nNochmal versuchen', msgNotInstalled: 'Nicht installiert\nBitte auf Installieren klicken', mFinance: 'M Finance', msgExists: 'Benutzer bereits registriert\nmit diesen Daten', msgUpdated: 'Daten erfolgreich aktualisiert', msgRegistered: 'Registrierung abgeschlossen' },
    profile: { fullName: 'Vollständiger Name', email: 'E-Mail', ip: 'IP', language: 'Sprache', country: 'Land', plan: 'Tarif', planStart: 'Tarif Beginn', planEnd: 'Tarif Ende', unlimited: 'Unbegrenzt', comingSoon: 'Demnächst', choosePlan: 'Tarif wählen', close: '✕ Schließen', loginRequired: 'Anmeldung erforderlich', login: 'Anmelden', products: 'Produkte', change: 'Ändern',
      price: 'Preis', changePlan: 'Tarif ändern', planName: 'Name', planFrom: 'Von', planTo: 'Bis', back: 'Zurück', currencyLocal: '€', free: 'Kostenlos',       planNames: { System_Free_Run: 'Testlauf', User_Trial: 'Testphase', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monatlich', User_Annual: 'Jährlich', User_One_Time: 'Einmalig', System_Suspended_NonPayment: 'Gesperrt', User_Cancelled: 'Storniert' } },
    feedback: { customerRelations: 'Kundenpflege', systemMessage: 'Systemnachricht', respectfully: 'Mit freundlichen Grüßen,', rating: 'Bewertung', ratingWebsite: 'Website', ratingBudget: 'Haushaltsverwaltung', userMessage: 'Nutzernachricht', date: 'Datum:', title: 'Betreff:', from: 'Von:', systemReply: 'Systemantwort' },
    system: { systemLabel: 'System', selectAction: 'Aktion in der rechten Leiste wählen', users: 'Benutzer', buildMessages: 'Build-Protokoll', schedule: 'Zeitplan & Preise', pr: 'PR', publishedDate: 'Veröffentlicht:', reset: 'Zurücksetzen', saved: 'Gespeichert', records: 'Einträge', scheduleSubject: 'Thema', schedulePriceUSD: 'Preis\n[$]', schedulePeriod: 'Zeitraum\n[Mo]', scheduleNotes: 'Notizen', clear: 'Löschen', pause: 'Pause', resume: 'Fortsetzen', active: '● Aktiv', paused: 'Pausiert', lines: 'Zeilen', filter: 'Filter', refresh: 'Aktualisieren', loading: 'Laden...', loadingBuild: 'Build-Daten laden...', error: 'Fehler', noBuildData: 'Keine Daten. Starten Sie Release_KeyClick.bat', networkError: 'Netzwerkfehler', adminButton: 'Systembereich', generalGroup: 'Allgemein', colName: 'Name', colCurrency: 'Währung', colCreated: 'Erstellt', colActive: 'Aktiv', colAppInstalled: 'App', colLicenceType: 'Lizenztyp', colSystemForce: 'Systemmodus', distributionDay: 'Verbreitungstag X', messages: 'Nachrichten', send: 'Senden', sent: 'Gesendet!', reply: 'Antworten', noMessages: 'Keine Nachrichten', replySent: 'Antwort gesendet!' },
    currencyNames: { ILS: 'Schekel', USD: 'Dollar', GBP: 'Pfund', EUR: 'Euro', RUB: 'Rubel', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupie' } },
  { code: 'fr', flag: 'צרפת',    name: 'Français', welcome: 'Bienvenue',
    menu: ['Retour','Mises à jour','Messages','Rappels','Services bancaires','Page personnelle'],
    card: { title: 'Gestion du budget familial', namePh: 'Prénom / Nom', emailPh: 'Email / Adresse e-mail', passPh: 'Mot de passe', confirmPassPh: 'Confirmer le mot de passe', register: "S'inscrire", login: 'Se connecter', update: 'Mettre à jour', line1: 'Pendant la période de lancement', line2: 'Gratuit', errName: 'Veuillez entrer votre nom', errEmail: 'Veuillez entrer un email valide', errPassLen: 'Le mot de passe doit contenir au moins 6 caractères', errPassMatch: 'Les mots de passe ne correspondent pas', errEmailExists: 'Email déjà enregistré', cancel: 'Annuler', install: 'Installer', library: 'Fichiers guide', run: 'Lancer', videos: 'Vidéos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Déjà installé\nPas besoin de réinstaller', msgDownloading: 'Téléchargement du fichier', msgInstallComplete: 'Enregistrez et exécutez le fichier\npour terminer l\'installation', msgDownloadError: 'Erreur de téléchargement\nRéessayer', msgNotInstalled: 'Non installé\nVeuillez cliquer sur Installer', mFinance: 'M Finance', msgExists: 'Utilisateur déjà enregistré\navec ces informations', msgUpdated: 'Informations mises à jour avec succès', msgRegistered: 'Inscription terminée' },
    profile: { fullName: 'Nom complet', email: 'E-mail', ip: 'IP', language: 'Langue', country: 'Pays', plan: 'Abonnement', planStart: 'Début', planEnd: 'Fin', unlimited: 'Illimité', comingSoon: 'Bientôt', choosePlan: 'Choisir un abonnement', close: '✕ Fermer', loginRequired: 'Connexion requise', login: 'Se connecter', products: 'Produits', change: 'Modifier',
      price: 'Prix', changePlan: "Changer d'abonnement", planName: 'Nom', planFrom: 'De', planTo: 'Au', back: 'Retour', currencyLocal: '€', free: 'Gratuit',       planNames: { System_Free_Run: 'Lancement', User_Trial: 'Essai', User_VIP_Free: 'VIP', System_Owner: 'Système', User_Monthly: 'Mensuel', User_Annual: 'Annuel', User_One_Time: 'Unique', System_Suspended_NonPayment: 'Suspendu', User_Cancelled: 'Annulé' } },
    feedback: { customerRelations: 'Relations clients', systemMessage: 'Message du système', respectfully: 'Cordialement,', rating: 'Évaluation', ratingWebsite: 'Site web', ratingBudget: 'Gestion du budget familial', userMessage: "Message de l'utilisateur", date: 'Date :', title: 'Titre :', from: 'De :', systemReply: 'Réponse du système' },
    system: { systemLabel: 'Système', selectAction: 'Sélectionner une action dans la barre droite', users: 'Utilisateurs', buildMessages: 'Journal de build', schedule: 'Planning & Tarifs', pr: 'RP', publishedDate: 'Publié le :', reset: 'Réinitialiser', saved: 'Enregistré', records: 'enregistrements', scheduleSubject: 'Sujet', schedulePriceUSD: 'Prix\n[$]', schedulePeriod: 'Période\n[mois]', scheduleNotes: 'Notes', clear: 'Effacer', pause: 'Pause', resume: 'Reprendre', active: '● Actif', paused: 'En pause', lines: 'lignes', filter: 'Filtre', refresh: 'Actualiser', loading: 'Chargement...', loadingBuild: 'Chargement du build...', error: 'Erreur', noBuildData: 'Aucune donnée. Lancez Release_KeyClick.bat', networkError: 'Erreur réseau', adminButton: 'Espace système', generalGroup: 'Général', colName: 'Nom', colCurrency: 'Devise', colCreated: 'Créé', colActive: 'Actif', colAppInstalled: 'Application', colLicenceType: 'Type de licence', colSystemForce: 'Mode système', distributionDay: 'Jour de distribution X', messages: 'Messages', send: 'Envoyer', sent: 'Envoyé !', reply: 'Répondre', noMessages: 'Aucun message', replySent: 'Réponse envoyée !' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Livre', EUR: 'Euro', RUB: 'Rouble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Roupie' } },
  { code: 'he', flag: 'ישראל',   name: 'עברית',    welcome: 'ברוכים הבאים',
    menu: ['משוב','עדכונים','הודעות','תזכורות','שרותים בנקאיים','דף אישי'],
    card: { title: 'ניהול תקציב בית', namePh: 'שם / שם משפחה', emailPh: 'Email / כתובת מייל', passPh: 'סיסמא', confirmPassPh: 'אימות סיסמא', register: 'הרשמה', login: 'כניסה', update: 'עדכן', line1: 'בתקופת ההרצה', line2: 'חינם', errName: 'נא להזין שם', errEmail: 'נא להזין כתובת מייל תקינה', errPassLen: 'סיסמה חייבת להכיל לפחות 6 תווים', errPassMatch: 'הסיסמאות אינן תואמות', errEmailExists: 'אימייל כבר קיים במערכת', cancel: 'בטל', install: 'התקנה', library: 'קובצי הדרכה', run: 'הפעלה', videos: 'סרטונים', guide: 'הדרכה', ok: 'לחץ', msgAlreadyInstalled: 'כבר מותקן\nאין צורך בהתקנה', msgDownloading: 'הורד קובץ התקנה', msgInstallComplete: 'שמור והפעל את הקובץ\nלהשלמת ההתקנה', msgDownloadError: 'שגיאה בהורדה\nנסה שוב', msgNotInstalled: 'לא מותקן\nאנא לחץ על כפתור ההתקנה', mFinance: 'M Finance', msgExists: 'המשתמש עם הפרטים שהקשת\nכבר רשום במערכת', msgUpdated: 'הפרטים עודכנו בהצלחה', msgRegistered: 'הרשמה הושלמה' },
    profile: { fullName: 'שם ומשפחה', email: 'דוא"ל', ip: 'IP', language: 'שפה', country: 'מדינה', plan: 'תכנית', planStart: 'תחילת תכנית', planEnd: 'סיום תכנית', unlimited: 'ללא הגבלה', comingSoon: 'בקרוב', choosePlan: 'בחר תכנית', close: '✕ סגור', loginRequired: 'נדרשת כניסה לצפייה בדף האישי', login: 'כניסה', products: 'מוצרים', change: 'שינוי',
      price: 'מחיר', changePlan: 'שינוי תכנית', planName: 'שם', planFrom: 'מ-', planTo: 'עד-', back: 'חזרה', currencyLocal: '₪', free: 'חינם',       planNames: { System_Free_Run: 'תקופת הרצה', User_Trial: 'תקופת נסיון', User_VIP_Free: 'VIP', System_Owner: 'מערכת', User_Monthly: 'חודשי', User_Annual: 'שנתי', User_One_Time: 'כניסה בודדת', System_Suspended_NonPayment: 'מנותק', User_Cancelled: 'בוטל' } },
    feedback: { customerRelations: 'קשרי לקוחות', systemMessage: 'הודעת המערכת', respectfully: 'בכבוד רב,', rating: 'דירוג', ratingWebsite: 'אתר', ratingBudget: 'ניהול תקציב בית', userMessage: 'דבר המשתמש', date: 'תאריך:', title: 'כותרת:', from: 'מאת:', systemReply: 'תשובת המערכת' },
    system: { systemLabel: 'מערכת', selectAction: 'בחר פעולה מהסרגל הימני', users: 'משתמשים', buildMessages: 'הודעות בניית מערכת', schedule: 'לו"ז ומחירון', pr: 'יחסי ציבור', publishedDate: 'פורסם בתאריך:', reset: 'איפוס', saved: 'נשמר', records: 'רשומות', scheduleSubject: 'נושא', schedulePriceUSD: 'מחיר\n[$]', schedulePeriod: 'תקופה\n[ח׳]', scheduleNotes: 'הערות', clear: 'נקה', pause: 'עצור', resume: 'המשך', active: '● פעיל', paused: 'מושהה', lines: 'שורות', filter: 'סינון', refresh: 'רענן', loading: 'טוען...', loadingBuild: 'טוען נתוני בנייה...', error: 'שגיאה', noBuildData: 'אין נתוני בנייה. הרץ את Release_KeyClick.bat', networkError: 'שגיאת רשת', adminButton: 'בשימוש המערכת', generalGroup: 'כללי', colName: 'שם', colCurrency: 'מטבע', colCreated: 'תאריך הצטרפות', colActive: 'פעיל', colAppInstalled: 'אפליקציה', colLicenceType: 'סוג רישיון', colSystemForce: 'כפיית מערכת', distributionDay: 'יום ה-X ההפצה', messages: 'הודעות', send: 'שלח', sent: 'נשלח!', reply: 'תשובה', noMessages: 'אין הודעות', replySent: 'תשובה נשלחה!' },
    currencyNames: { ILS: 'ש"ח', USD: 'דולר', GBP: 'ליש"ט', EUR: 'יורו', RUB: 'רובל', JPY: 'ין', SAR: 'ריאל', CNY: 'יואן', INR: 'רופי' } },
  { code: 'es', flag: 'ספרד',    name: 'Español',  welcome: 'Bienvenido',
    menu: ['Comentarios','Actualizaciones','Mensajes','Recordatorios','Servicios bancarios','Página personal'],
    card: { title: 'Gestión del presupuesto familiar', namePh: 'Nombre / Apellido', emailPh: 'Email / Dirección de correo', passPh: 'Contraseña', confirmPassPh: 'Confirmar contraseña', register: 'Registrarse', login: 'Iniciar sesión', update: 'Actualizar', line1: 'Durante el período de lanzamiento', line2: 'Gratis', errName: 'Por favor ingrese su nombre', errEmail: 'Por favor ingrese un email válido', errPassLen: 'La contraseña debe tener al menos 6 caracteres', errPassMatch: 'Las contraseñas no coinciden', errEmailExists: 'El correo ya está registrado', cancel: 'Cancelar', install: 'Instalar', library: 'Archivos de guía', run: 'Ejecutar', videos: 'Videos', guide: 'Guía', ok: 'OK', msgAlreadyInstalled: 'Ya instalado\nNo es necesario reinstalar', msgDownloading: 'Descargando archivo de instalación', msgInstallComplete: 'Guarda y ejecuta el archivo\npara completar la instalación', msgDownloadError: 'Error de descarga\nInténtalo de nuevo', msgNotInstalled: 'No instalado\nHaz clic en Instalar', mFinance: 'M Finance', msgExists: 'El usuario ya está registrado\ncon estos datos', msgUpdated: 'Datos actualizados correctamente', msgRegistered: 'Registro completado' },
    profile: { fullName: 'Nombre completo', email: 'Correo', ip: 'IP', language: 'Idioma', country: 'País', plan: 'Plan', planStart: 'Inicio del plan', planEnd: 'Fin del plan', unlimited: 'Sin límite', comingSoon: 'Próximamente', choosePlan: 'Elegir plan', close: '✕ Cerrar', loginRequired: 'Se requiere inicio de sesión', login: 'Iniciar sesión', products: 'Productos', change: 'Cambiar',
      price: 'Precio', changePlan: 'Cambiar plan', planName: 'Nombre', planFrom: 'Desde', planTo: 'Hasta', back: 'Volver', currencyLocal: '€', free: 'Gratis',       planNames: { System_Free_Run: 'Ejecución', User_Trial: 'Prueba', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensual', User_Annual: 'Anual', User_One_Time: 'Único', System_Suspended_NonPayment: 'Suspendido', User_Cancelled: 'Cancelado' } },
    feedback: { customerRelations: 'Relaciones con clientes', systemMessage: 'Mensaje del sistema', respectfully: 'Atentamente,', rating: 'Calificación', ratingWebsite: 'Sitio web', ratingBudget: 'Gestión del presupuesto familiar', userMessage: 'Mensaje del usuario', date: 'Fecha:', title: 'Título:', from: 'De:', systemReply: 'Respuesta del sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleccionar acción de la barra derecha', users: 'Usuarios', buildMessages: 'Registro de build', schedule: 'Horario y precios', pr: 'RRPP', publishedDate: 'Publicado:', reset: 'Restablecer', saved: 'Guardado', records: 'registros', scheduleSubject: 'Asunto', schedulePriceUSD: 'Precio\n[$]', schedulePeriod: 'Período\n[mes]', scheduleNotes: 'Notas', clear: 'Limpiar', pause: 'Pausar', resume: 'Reanudar', active: '● Activo', paused: 'En pausa', lines: 'líneas', filter: 'Filtro', refresh: 'Actualizar', loading: 'Cargando...', loadingBuild: 'Cargando datos de build...', error: 'Error', noBuildData: 'Sin datos. Ejecute Release_KeyClick.bat', networkError: 'Error de red', adminButton: 'Área del sistema', generalGroup: 'General', colName: 'Nombre', colCurrency: 'Moneda', colCreated: 'Creado', colActive: 'Activo', colAppInstalled: 'Aplicación', colLicenceType: 'Tipo de licencia', colSystemForce: 'Modo sistema', distributionDay: 'Día de distribución X', messages: 'Mensajes', send: 'Enviar', sent: '¡Enviado!', reply: 'Responder', noMessages: 'Sin mensajes', replySent: '¡Respuesta enviada!' },
    currencyNames: { ILS: 'Séquel', USD: 'Dólar', GBP: 'Libra', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' } },
  { code: 'ja', flag: 'יפן',     name: '日本語',    welcome: 'ようこそ',
    menu: ['フィードバック','更新','メッセージ','リマインダー','銀行サービス','個人ページ'],
    card: { title: '家計管理', namePh: '名前 / 苗字', emailPh: 'メール / メールアドレス', passPh: 'パスワード', confirmPassPh: 'パスワードの確認', register: '登録', login: 'ログイン', update: '更新', line1: 'ローンチ期間中', line2: '無料', errName: '名前を入力してください', errEmail: '有効なメールアドレスを入力してください', errPassLen: 'パスワードは6文字以上必要です', errPassMatch: 'パスワードが一致しません', errEmailExists: 'このメールアドレスはすでに登録されています', cancel: 'キャンセル', install: 'インストール', library: 'ガイドファイル', run: '起動', videos: 'ビデオ', guide: 'ガイド', ok: 'OK', msgAlreadyInstalled: 'インストール済み\n再インストール不要', msgDownloading: 'インストールファイルをダウンロード中', msgInstallComplete: 'ファイルを保存して実行\nインストールを完了', msgDownloadError: 'ダウンロードエラー\n再試行', msgNotInstalled: '未インストール\nインストールをクリック', mFinance: 'M Finance', msgExists: 'このメールは\nすでに登録されています', msgUpdated: '情報が正常に更新されました', msgRegistered: '登録が完了しました' },
    profile: { fullName: 'フルネーム', email: 'メール', ip: 'IP', language: '言語', country: '国', plan: 'プラン', planStart: 'プラン開始', planEnd: 'プラン終了', unlimited: '無制限', comingSoon: '近日公開', choosePlan: 'プランを選択', close: '✕ 閉じる', loginRequired: 'ログインが必要です', login: 'ログイン', products: '製品', change: '変更',
      price: '価格', changePlan: 'プラン変更', planName: '名前', planFrom: 'から', planTo: 'まで', back: '戻る', currencyLocal: '¥', free: '無料',       planNames: { System_Free_Run: '試運転', User_Trial: '試用', User_VIP_Free: 'VIP', System_Owner: 'システム', User_Monthly: '月次', User_Annual: '年次', User_One_Time: '単回', System_Suspended_NonPayment: '停止', User_Cancelled: 'キャンセル' } },
    feedback: { customerRelations: 'カスタマーサービス', systemMessage: 'システムメッセージ', respectfully: '敬具,', rating: '評価', ratingWebsite: 'ウェブサイト', ratingBudget: '家計管理', userMessage: 'ユーザーメッセージ', date: '日付:', title: 'タイトル:', from: '差出人:', systemReply: 'システム返信' },
    system: { systemLabel: 'システム', selectAction: '右サイドバーからアクションを選択', users: 'ユーザー', buildMessages: 'ビルドログ', schedule: 'スケジュールと価格', pr: 'PR', publishedDate: '公開日:', reset: 'リセット', saved: '保存済み', records: '件', scheduleSubject: '件名', schedulePriceUSD: '価格\n[$]', schedulePeriod: '期間\n[月]', scheduleNotes: 'メモ', clear: 'クリア', pause: '一時停止', resume: '再開', active: '● アクティブ', paused: '一時停止中', lines: '行', filter: 'フィルター', refresh: '更新', loading: '読み込み中...', loadingBuild: 'ビルドデータ読み込み中...', error: 'エラー', noBuildData: 'データなし。Release_KeyClick.bat を実行', networkError: 'ネットワークエラー', adminButton: 'システム管理', generalGroup: '全般', colName: '名前', colCurrency: '通貨', colCreated: '作成日', colActive: '有効', colAppInstalled: 'アプリ', colLicenceType: 'ライセンス種別', colSystemForce: 'システムモード', distributionDay: '配布日X', messages: 'メッセージ', send: '送信', sent: '送信済み!', reply: '返信', noMessages: 'メッセージなし', replySent: '返信済み!' },
    currencyNames: { ILS: 'シェケル', USD: 'ドル', GBP: 'ポンド', EUR: 'ユーロ', RUB: 'ルーブル', JPY: '円', SAR: 'リヤル', CNY: '元', INR: 'ルピー' } },
  { code: 'ar', flag: 'סעודיה',  name: 'العربية',  welcome: 'أهلاً وسهلاً',
    menu: ['ملاحظات','تحديثات','رسائل','تذكيرات','خدمات مصرفية','الصفحة الشخصية'],
    card: { title: 'إدارة الميزانية المنزلية', namePh: 'الاسم / اسم العائلة', emailPh: 'البريد الإلكتروني', passPh: 'كلمة المرور', confirmPassPh: 'تأكيد كلمة المرور', register: 'تسجيل', login: 'دخول', update: 'تحديث', line1: 'خلال فترة الإطلاق', line2: 'مجاناً', errName: 'الرجاء إدخال اسمك', errEmail: 'الرجاء إدخال بريد إلكتروني صحيح', errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل', errPassMatch: 'كلمتا المرور غير متطابقتين', errEmailExists: 'البريد الإلكتروني مسجل بالفعل', cancel: 'إلغاء', install: 'تثبيت', library: 'ملفات الدليل', run: 'تشغيل', videos: 'مقاطع', guide: 'دليل', ok: 'حسناً', msgAlreadyInstalled: 'مثبت بالفعل\nلا حاجة لإعادة التثبيت', msgDownloading: 'جارٍ تنزيل ملف التثبيت', msgInstallComplete: 'احفظ الملف وشغّله\nلإكمال التثبيت', msgDownloadError: 'خطأ في التنزيل\nحاول مرة أخرى', msgNotInstalled: 'غير مثبت\nانقر على تثبيت', mFinance: 'M Finance', msgExists: 'المستخدم مسجل بالفعل\nبهذه البيانات', msgUpdated: 'تم تحديث البيانات بنجاح', msgRegistered: 'اكتمل التسجيل' },
    profile: { fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', ip: 'IP', language: 'اللغة', country: 'الدولة', plan: 'الخطة', planStart: 'بداية الخطة', planEnd: 'نهاية الخطة', unlimited: 'بلا حدود', comingSoon: 'قريباً', choosePlan: 'اختر خطة', close: '✕ إغلاق', loginRequired: 'تسجيل الدخول مطلوب', login: 'دخول', products: 'المنتجات', change: 'تغيير',
      price: 'السعر', changePlan: 'تغيير الخطة', planName: 'الاسم', planFrom: 'من', planTo: 'إلى', back: 'رجوع', currencyLocal: '﷼', free: 'مجاناً',       planNames: { System_Free_Run: 'تشغيل', User_Trial: 'تجريبي', User_VIP_Free: 'VIP', System_Owner: 'النظام', User_Monthly: 'شهري', User_Annual: 'سنوي', User_One_Time: 'مرة واحدة', System_Suspended_NonPayment: 'موقوف', User_Cancelled: 'ملغى' } },
    feedback: { customerRelations: 'خدمة العملاء', systemMessage: 'رسالة النظام', respectfully: 'مع التحية،', rating: 'تقييم', ratingWebsite: 'الموقع', ratingBudget: 'إدارة الميزانية المنزلية', userMessage: 'رسالة المستخدم', date: 'التاريخ:', title: 'الموضوع:', from: 'من:', systemReply: 'رد النظام' },
    system: { systemLabel: 'النظام', selectAction: 'اختر إجراء من الشريط الأيمن', users: 'المستخدمون', buildMessages: 'سجل البناء', schedule: 'الجدول والأسعار', pr: 'العلاقات العامة', publishedDate: 'تاريخ النشر:', reset: 'إعادة تعيين', saved: 'تم الحفظ', records: 'سجلات', scheduleSubject: 'الموضوع', schedulePriceUSD: 'السعر\n[$]', schedulePeriod: 'الفترة\n[شهر]', scheduleNotes: 'ملاحظات', clear: 'مسح', pause: 'إيقاف مؤقت', resume: 'استئناف', active: '● نشط', paused: 'متوقف مؤقتاً', lines: 'سطور', filter: 'تصفية', refresh: 'تحديث', loading: 'جارٍ التحميل...', loadingBuild: 'تحميل بيانات البناء...', error: 'خطأ', noBuildData: 'لا بيانات. شغّل Release_KeyClick.bat', networkError: 'خطأ في الشبكة', adminButton: 'النظام', generalGroup: 'عام', colName: 'الاسم', colCurrency: 'العملة', colCreated: 'تاريخ الإنشاء', colActive: 'نشط', colAppInstalled: 'التطبيق', colLicenceType: 'نوع الترخيص', colSystemForce: 'وضع النظام', distributionDay: 'يوم التوزيع X', messages: 'الرسائل', send: 'إرسال', sent: 'تم!', reply: 'رد', noMessages: 'لا رسائل', replySent: 'تم إرسال الرد!' },
    currencyNames: { ILS: 'شيكل', USD: 'دولار', GBP: 'جنيه', EUR: 'يورو', RUB: 'روبل', JPY: 'ين', SAR: 'ريال', CNY: 'يوان', INR: 'روبية' } },
  { code: 'zh', flag: 'סין',     name: '中文',      welcome: '欢迎',
    menu: ['反馈','更新','消息','提醒','银行服务','个人页面'],
    card: { title: '家庭预算管理', namePh: '名字 / 姓氏', emailPh: '邮箱 / 电子邮件地址', passPh: '密码', confirmPassPh: '确认密码', register: '注册', login: '登录', update: '更新', line1: '在发布期间', line2: '免费', errName: '请输入您的姓名', errEmail: '请输入有效的电子邮件地址', errPassLen: '密码必须至少包含6个字符', errPassMatch: '密码不匹配', errEmailExists: '该邮箱已注册', cancel: '取消', install: '安装', library: '指南文件', run: '运行', videos: '视频', guide: '指南', ok: '确定', msgAlreadyInstalled: '已安装\n无需重新安装', msgDownloading: '正在下载安装文件', msgInstallComplete: '保存并运行文件\n以完成安装', msgDownloadError: '下载错误\n请重试', msgNotInstalled: '未安装\n请点击安装', mFinance: 'M Finance', msgExists: '该用户已注册\n使用这些信息', msgUpdated: '信息更新成功', msgRegistered: '注册完成' },
    profile: { fullName: '全名', email: '邮箱', ip: 'IP', language: '语言', country: '国家', plan: '套餐', planStart: '套餐开始', planEnd: '套餐结束', unlimited: '无限制', comingSoon: '即将推出', choosePlan: '选择套餐', close: '✕ 关闭', loginRequired: '需要登录', login: '登录', products: '产品', change: '更改',
      price: '价格', changePlan: '更改套餐', planName: '名称', planFrom: '从', planTo: '至', back: '返回', currencyLocal: '¥', free: '免费',       planNames: { System_Free_Run: '试运行', User_Trial: '试用', User_VIP_Free: 'VIP', System_Owner: '系统', User_Monthly: '每月', User_Annual: '每年', User_One_Time: '单次', System_Suspended_NonPayment: '停用', User_Cancelled: '已取消' } },
    feedback: { customerRelations: '客户关系', systemMessage: '系统消息', respectfully: '此致敬礼,', rating: '评分', ratingWebsite: '网站', ratingBudget: '家庭预算管理', userMessage: '用户消息', date: '日期:', title: '标题:', from: '发件人:', systemReply: '系统回复' },
    system: { systemLabel: '系统', selectAction: '从右侧栏选择操作', users: '用户', buildMessages: '构建日志', schedule: '计划与定价', pr: '公关', publishedDate: '发布日期:', reset: '重置', saved: '已保存', records: '条记录', scheduleSubject: '主题', schedulePriceUSD: '价格\n[$]', schedulePeriod: '周期\n[月]', scheduleNotes: '备注', clear: '清除', pause: '暂停', resume: '继续', active: '● 活跃', paused: '已暂停', lines: '行', filter: '筛选', refresh: '刷新', loading: '加载中...', loadingBuild: '正在加载构建数据...', error: '错误', noBuildData: '无构建数据。请运行 Release_KeyClick.bat', networkError: '网络错误', adminButton: '系统管理', generalGroup: '常规', colName: '姓名', colCurrency: '货币', colCreated: '创建时间', colActive: '已激活', colAppInstalled: '应用程序', colLicenceType: '许可证类型', colSystemForce: '系统模式', distributionDay: '分发日X', messages: '消息', send: '发送', sent: '已发送!', reply: '回复', noMessages: '无消息', replySent: '回复已发送!' },
    currencyNames: { ILS: '谢克尔', USD: '美元', GBP: '英镑', EUR: '欧元', RUB: '卢布', JPY: '日元', SAR: '里亚尔', CNY: '人民币', INR: '卢比' } },
  { code: 'it', flag: 'איטליה',  name: 'Italiano', welcome: 'Benvenuto',
    menu: ['Feedback','Aggiornamenti','Messaggi','Promemoria','Servizi bancari','Pagina personale'],
    card: { title: 'Gestione del budget familiare', namePh: 'Nome / Cognome', emailPh: 'Email / Indirizzo email', passPh: 'Password', confirmPassPh: 'Conferma password', register: 'Registrati', login: 'Accedi', update: 'Aggiorna', line1: 'Durante il periodo di lancio', line2: 'Gratis', errName: 'Inserisci il tuo nome', errEmail: 'Inserisci un indirizzo email valido', errPassLen: 'La password deve contenere almeno 6 caratteri', errPassMatch: 'Le password non corrispondono', errEmailExists: 'Email già registrata', cancel: 'Annulla', install: 'Installa', library: 'File guida', run: 'Avvia', videos: 'Video', guide: 'Guida', ok: 'OK', msgAlreadyInstalled: 'Già installato\nNessuna reinstallazione necessaria', msgDownloading: 'Download del file di installazione', msgInstallComplete: 'Salva ed esegui il file\nper completare l\'installazione', msgDownloadError: 'Errore di download\nRiprova', msgNotInstalled: 'Non installato\nFai clic su Installa', mFinance: 'M Finance', msgExists: 'Utente già registrato\ncon questi dati', msgUpdated: 'Dati aggiornati con successo', msgRegistered: 'Registrazione completata' },
    profile: { fullName: 'Nome completo', email: 'Email', ip: 'IP', language: 'Lingua', country: 'Paese', plan: 'Piano', planStart: 'Inizio piano', planEnd: 'Fine piano', unlimited: 'Illimitato', comingSoon: 'Prossimamente', choosePlan: 'Scegli piano', close: '✕ Chiudi', loginRequired: 'Accesso richiesto', login: 'Accedi', products: 'Prodotti', change: 'Modifica',
      price: 'Prezzo', changePlan: 'Cambia piano', planName: 'Nome', planFrom: 'Da', planTo: 'A', back: 'Indietro', currencyLocal: '€', free: 'Gratuito',       planNames: { System_Free_Run: 'Lancio', User_Trial: 'Prova', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensile', User_Annual: 'Annuale', User_One_Time: 'Singolo', System_Suspended_NonPayment: 'Sospeso', User_Cancelled: 'Annullato' } },
    feedback: { customerRelations: 'Relazioni clienti', systemMessage: 'Messaggio di sistema', respectfully: 'Cordiali saluti,', rating: 'Valutazione', ratingWebsite: 'Sito web', ratingBudget: 'Gestione del budget familiare', userMessage: 'Messaggio utente', date: 'Data:', title: 'Titolo:', from: 'Da:', systemReply: 'Risposta di sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleziona azione dalla barra destra', users: 'Utenti', buildMessages: 'Registro di build', schedule: 'Pianificazione e prezzi', pr: 'RP', publishedDate: 'Pubblicato il:', reset: 'Reimposta', saved: 'Salvato', records: 'record', scheduleSubject: 'Oggetto', schedulePriceUSD: 'Prezzo\n[$]', schedulePeriod: 'Periodo\n[mesi]', scheduleNotes: 'Note', clear: 'Cancella', pause: 'Pausa', resume: 'Riprendi', active: '● Attivo', paused: 'In pausa', lines: 'righe', filter: 'Filtra', refresh: 'Aggiorna', loading: 'Caricamento...', loadingBuild: 'Caricamento dati di build...', error: 'Errore', noBuildData: 'Nessun dato. Eseguire Release_KeyClick.bat', networkError: 'Errore di rete', adminButton: 'Area di sistema', generalGroup: 'Generale', colName: 'Nome', colCurrency: 'Valuta', colCreated: 'Creato', colActive: 'Attivo', colAppInstalled: 'App', colLicenceType: 'Tipo di licenza', colSystemForce: 'Modalità sistema', distributionDay: 'Giorno di distribuzione X', messages: 'Messaggi', send: 'Invia', sent: 'Inviato!', reply: 'Rispondi', noMessages: 'Nessun messaggio', replySent: 'Risposta inviata!' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollaro', GBP: 'Sterlina', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' } },
  { code: 'hi', flag: 'הודו',    name: 'हिंदी',     welcome: 'स्वागत है',
    menu: ['फीडबैक','अपडेट','संदेश','अनुस्मारक','बैंकिंग सेवाएं','व्यक्तिगत पृष्ठ'],
    card: { title: 'घरेलू बजट प्रबंधन', namePh: 'नाम / उपनाम', emailPh: 'ईमेल / ईमेल पता', passPh: 'पासवर्ड', confirmPassPh: 'पासवर्ड की पुष्टि करें', register: 'पंजीकरण', login: 'लॉग इन', update: 'अपडेट', line1: 'लॉन्च अवधि के दौरान', line2: 'मुफ्त', errName: 'कृपया अपना नाम दर्ज करें', errEmail: 'कृपया एक मान्य ईमेल दर्ज करें', errPassLen: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए', errPassMatch: 'पासवर्ड मेल नहीं खाते', errEmailExists: 'ईमेल पहले से पंजीकृत है', cancel: 'रद्द करें', install: 'इंस्टॉल करें', library: 'गाइड फ़ाइलें', run: 'चलाएं', videos: 'वीडियो', guide: 'मार्गदर्शिका', ok: 'ठीक है', msgAlreadyInstalled: 'पहले से इंस्टॉल है\nपुनः इंस्टॉल की आवश्यकता नहीं', msgDownloading: 'इंस्टॉलेशन फ़ाइल डाउनलोड हो रही है', msgInstallComplete: 'फ़ाइल सहेजें और चलाएं\nइंस्टॉलेशन पूरा करने के लिए', msgDownloadError: 'डाउनलोड त्रुटि\nपुनः प्रयास करें', msgNotInstalled: 'इंस्टॉल नहीं है\nकृपया इंस्टॉल पर क्लिक करें', mFinance: 'M Finance', msgExists: 'यह उपयोगकर्ता पहले से पंजीकृत है\nइन विवरणों के साथ', msgUpdated: 'विवरण सफलतापूर्वक अपडेट किए गए', msgRegistered: 'पंजीकरण पूरा हो गया' },
    profile: { fullName: 'पूरा नाम', email: 'ईमेल', ip: 'IP', language: 'भाषा', country: 'देश', plan: 'योजना', planStart: 'योजना शुरू', planEnd: 'योजना समाप्त', unlimited: 'असीमित', comingSoon: 'जल्द आ रहा है', choosePlan: 'योजना चुनें', close: '✕ बंद करें', loginRequired: 'लॉगिन आवश्यक है', login: 'लॉग इन', products: 'उत्पाद', change: 'बदलें',
      price: 'मूल्य', changePlan: 'योजना बदलें', planName: 'नाम', planFrom: 'से', planTo: 'तक', back: 'वापस', currencyLocal: '₹', free: 'मुफ्त',       planNames: { System_Free_Run: 'परीक्षण रन', User_Trial: 'परीक्षण', User_VIP_Free: 'VIP', System_Owner: 'सिस्टम', User_Monthly: 'मासिक', User_Annual: 'वार्षिक', User_One_Time: 'एकल', System_Suspended_NonPayment: 'निलंबित', User_Cancelled: 'रद्द' } },
    feedback: { customerRelations: 'ग्राहक सेवा', systemMessage: 'सिस्टम संदेश', respectfully: 'सादर,', rating: 'रेटिंग', ratingWebsite: 'वेबसाइट', ratingBudget: 'गृह बजट प्रबंधन', userMessage: 'उपयोगकर्ता संदेश', date: 'तारीख:', title: 'शीर्षक:', from: 'से:', systemReply: 'सिस्टम उत्तर' },
    system: { systemLabel: 'सिस्टम', selectAction: 'दाहिनी बार से क्रिया चुनें', users: 'उपयोगकर्ता', buildMessages: 'बिल्ड लॉग', schedule: 'शेड्यूल और मूल्य', pr: 'जनसंपर्क', publishedDate: 'प्रकाशन तिथि:', reset: 'रीसेट', saved: 'सहेजा', records: 'रिकॉर्ड', scheduleSubject: 'विषय', schedulePriceUSD: 'मूल्य\n[$]', schedulePeriod: 'अवधि\n[माह]', scheduleNotes: 'नोट्स', clear: 'साफ़ करें', pause: 'रोकें', resume: 'जारी रखें', active: '● सक्रिय', paused: 'रुका हुआ', lines: 'पंक्तियाँ', filter: 'फ़िल्टर', refresh: 'ताज़ा करें', loading: 'लोड हो रहा है...', loadingBuild: 'बिल्ड डेटा लोड हो रहा है...', error: 'त्रुटि', noBuildData: 'कोई डेटा नहीं। Release_KeyClick.bat चलाएं', networkError: 'नेटवर्क त्रुटि', adminButton: 'सिस्टम उपयोग', generalGroup: 'सामान्य', colName: 'नाम', colCurrency: 'मुद्रा', colCreated: 'निर्माण तिथि', colActive: 'सक्रिय', colAppInstalled: 'ऐप', colLicenceType: 'लाइसेंस प्रकार', colSystemForce: 'सिस्टम मोड', distributionDay: 'वितरण दिवस X', messages: 'संदेश', send: 'भेजें', sent: 'भेजा!', reply: 'उत्तर', noMessages: 'कोई संदेश नहीं', replySent: 'उत्तर भेजा!' },
    currencyNames: { ILS: 'शेकेल', USD: 'डॉलर', GBP: 'पाउंड', EUR: 'यूरो', RUB: 'रूबल', JPY: 'येन', SAR: 'रियाल', CNY: 'युआन', INR: 'रुपया' } },
]

type UserRecord = { id: number; name: string; last_name?: string; email: string; language: string; M_Finance_license_type: string; is_active: boolean; is_M_Finance_installed: boolean; last_ip?: string; country?: string; created_at?: string; plan_start?: string; plan_end?: string; system_force?: string | null; currency?: string | null }

export default function Home() {
  const [langIdx, setLangIdx]       = useState(0)
  const [activePage, setActivePage] = useState<string | null>(null)
  const [systemMessage, setSystemMessage] = useState('')
  const [prText, setPrText] = useState('')
  const [prDate, setPrDate] = useState('')
  const [popupMsg, setPopupMsg] = useState<{ title: string; subtitle?: string; body: string; bodyColor?: string } | null>(null)
  const [siteVersion, setSiteVersion] = useState({ line1: '', line2: '' })
  const [debugLog, setDebugLog]       = useState<string[]>([])
  const [debugPaused, setDebugPaused] = useState(false)
  const debugEndRef    = useRef<HTMLDivElement>(null)
  const debugPausedRef = useRef(false)
  const debugWinRef    = useRef<Window | null>(null)
  const [Current_User_Pointer_to_DB, set_Current_User_Pointer_to_DB] = useState<UserRecord | null>(null)
  const [clientIp, setClientIp] = useState('')
  const [activeMfBtn, setActiveMfBtn] = useState<string | null>(null)
  const lang = languages[langIdx]

  useEffect(() => {
    if (!Current_User_Pointer_to_DB) return
    dbg('userEffect', `id=${Current_User_Pointer_to_DB.id} email="${Current_User_Pointer_to_DB.email}" language="${Current_User_Pointer_to_DB.language}" license="${Current_User_Pointer_to_DB.M_Finance_license_type}" active=${Current_User_Pointer_to_DB.is_active}`)
    const idx = languages.findIndex(l => l.name === Current_User_Pointer_to_DB.language)
    dbg('userEffect', `findIndex language="${Current_User_Pointer_to_DB.language}" => idx=${idx}`)
    if (idx !== -1) setLangIdx(idx)
    dbg('userEffect', `user loaded id=${Current_User_Pointer_to_DB.id}`)
    // Check upcoming reminders (today + next 2 days)
    fetch(`/api/reminders?user_id=${Current_User_Pointer_to_DB.id}`)
      .then(r => r.json())
      .then(d => {
        const today = new Date(); today.setHours(0,0,0,0)
        const limit = new Date(today); limit.setDate(limit.getDate() + 3)
        const upcoming = (d.reminders ?? []).filter((r: ReminderRecord) => {
          const dt = new Date(r.date); dt.setHours(0,0,0,0)
          return dt >= today && dt < limit
        })
        if (upcoming.length === 0) return
        const lines = upcoming.map((r: ReminderRecord) => {
          const [y,m,day] = r.date.split('-')
          const dateStr = `${day}/${m}/${y}`
          return r.time ? `${dateStr} ${r.time}  ${r.title}` : `${dateStr}  ${r.title}`
        }).join('\n')
        setPopupMsg({ title: 'תזכורות', body: lines })
      })
      .catch(() => {})
  }, [Current_User_Pointer_to_DB])

  useEffect(() => {
    fetch('/api/site-version').then(r => r.json()).then(data => setSiteVersion(data)).catch(() => {})
    fetch('/api/system/pr-message').then(r => r.json()).then(d => {
      if (d.text) { setPrText(d.text); setSystemMessage(d.text) }
      if (d.date) setPrDate(d.date)
    }).catch(() => {})
    dbg('ipify', 'fetch GET https://api.ipify.org')
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => { dbg('ipify', `ip="${d.ip ?? 'none'}"`) ; if (d.ip) setClientIp(d.ip) })
      .catch(err => dbg('ipify', `failed err="${String(err)}"`))
    const params = new URLSearchParams(window.location.search)
    if (params.get('installed') === '1') {
      localStorage.setItem('mf_installed', '1')
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgInstallComplete })
      window.history.replaceState({}, '', window.location.pathname)
      dbg('installCallback', 'installed=1 detected => mf_installed saved')
    }
    const last = Number(localStorage.getItem('kc_last_version_check') || '0')
    const elapsedH = Math.round((Date.now() - last) / 3600000)
    dbg('periodicCheck', `last=${last ? new Date(last).toLocaleString() : 'never'} elapsed=${elapsedH}h threshold=24h run=${elapsedH >= 24}`)
    if (elapsedH >= 24) checkVersion()
    const onUnload = () => { debugWinRef.current?.close() }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  useEffect(() => {
    dbg('initEffect', 'fetch GET /api/current-user')
    fetch('/api/current-user')
      .then(r => r.json())
      .then(data => {
        dbg('initEffect', `identified_by="${data.identified_by}" current_ip="${data.current_ip ?? 'unknown'}"`)
        dbg('initEffect', `Current_User=${data.user?.id ?? 0}  email="${data.user?.email ?? 'none'}"  IP="${data.user?.last_ip ?? data.current_ip ?? 'none'}"`)
        if (!data.user) return
        set_Current_User_Pointer_to_DB(data.user)
      })
      .catch(err => dbg('initEffect', `current-user failed err="${String(err)}"`))
  }, [])

  function openDebugWin() {
    if (debugWinRef.current && !debugWinRef.current.closed) { debugWinRef.current.focus(); return }
    const w = 400, h = 300
    const left = window.screenX + Math.floor((window.outerWidth  - w) / 2)
    const top  = window.screenY + Math.floor((window.outerHeight - h) / 2)
    const win  = window.open('', 'KeyClickDebug', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no,menubar=no,status=no`)
    if (!win) return
    const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;')
    const parsed = debugLog.map(l => {
      const m = l.match(/^(\S+:\S+:\S+)\s{2}([^:]+):\s(.*)$/)
      return m ? { ts: m[1], fn: m[2], msg: m[3] } : { ts: '', fn: '', msg: l }
    })
    const rows = parsed.map(r =>
      `<div class="r"><span class="ts">${esc(r.ts)}</span>&nbsp;&nbsp;<span class="fn">${esc(r.fn)}:</span> ${esc(r.msg)}</div>`
    ).join('')
    win.document.open()
    win.document.write(`<!DOCTYPE html><html><head><title></title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#1e1e1e;color:#d4d4d4;font-family:Consolas,monospace;font-size:17px;font-weight:bold;display:flex;flex-direction:column;height:100vh}
      #tb{background:#3c3c6e;padding:5px 10px;display:flex;gap:6px;align-items:center;flex-shrink:0}
      #tb span{color:#fff;font-weight:bold;font-size:22px;margin-right:auto}
      button{background:#003399;border:none;color:#FFD700;padding:3px 12px;border-radius:3px;cursor:pointer;font-size:15px;font-weight:bold;font-family:inherit}
      button:hover{background:#0044cc} button.on{background:#226622}
      #log{flex:1;overflow-y:auto;padding:8px 12px;line-height:1.9}
      .r{border-bottom:1px solid #2a2a2a;padding:2px 0}
      .ts{color:#777} .fn{color:#FFD700;font-weight:bold}
      #sb{background:#252526;color:#888;font-size:12px;padding:3px 10px;display:flex;justify-content:space-between;flex-shrink:0}
    </style></head><body>
    <div id="tb"><span>Debug</span>
      <button onclick="document.getElementById('log').innerHTML='';upd()">${lang.system.clear}</button>
      <button id="pb" onclick="tog()">${lang.system.pause}</button>
    </div>
    <div id="log">${rows}</div>
    <div id="sb"><span id="cnt">${debugLog.length} ${lang.system.lines}</span><span id="st">${lang.system.active}</span></div>
    <script>
      var p=false,log=document.getElementById('log');
      var TXT_PAUSE='${lang.system.pause}',TXT_RESUME='${lang.system.resume}',TXT_ACTIVE='${lang.system.active}',TXT_PAUSED='${lang.system.paused}',TXT_LINES=' ${lang.system.lines}';
      function e(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
      function sc(){if(!p)log.scrollTop=log.scrollHeight;}
      function upd(){document.getElementById('cnt').textContent=log.children.length+TXT_LINES;}
      function tog(){p=!p;var b=document.getElementById('pb');b.textContent=p?TXT_RESUME:TXT_PAUSE;b.className=p?'on':'';document.getElementById('st').textContent=p?TXT_PAUSED:TXT_ACTIVE;if(!p)sc();}
      window.addLine=function(ts,fn,msg){var d=document.createElement('div');d.className='r';d.innerHTML='<span class="ts">'+e(ts)+'</span>&nbsp;&nbsp;<span class="fn">'+e(fn)+':</span> '+e(msg);log.appendChild(d);upd();sc();}
      if(window.opener){window.opener.addEventListener('beforeunload',function(){window.close();});}
      sc();
    </script></body></html>`)
    win.document.close()
    debugWinRef.current = win
  }

  useEffect(() => {
    if (activePage === 'system') {
      debugPausedRef.current = false
      dbg('system', 'page opened')
      dbg('session', `Current_User=${Current_User_Pointer_to_DB?.id ?? 0}  email="${Current_User_Pointer_to_DB?.email ?? 'none'}"  IP="${Current_User_Pointer_to_DB?.last_ip ?? 'none'}"`)
      dbg('session', `license="${Current_User_Pointer_to_DB?.M_Finance_license_type ?? 'none'}"  active=${Current_User_Pointer_to_DB?.is_active ?? false}`)
      dbg('lang', `idx=${langIdx} code=${languages[langIdx].code} name=${languages[langIdx].name}`)
    } else {
      debugPausedRef.current = false
      setDebugPaused(false)
    }
  }, [activePage])

  function dbg(func: string, msg: string) {
    if (debugPausedRef.current) return
    const ts   = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const line = `${ts}  ${func}: ${msg}`
    setDebugLog(prev => [...prev, line])
    if (debugWinRef.current && !debugWinRef.current.closed)
      try { (debugWinRef.current as Window & { addLine?: (ts:string,fn:string,msg:string)=>void }).addLine?.(ts, func, msg) } catch { /* closed */ }
  }

  function toggleDebugPause() {
    const next = !debugPausedRef.current
    debugPausedRef.current = next
    setDebugPaused(next)
  }

  const VERSION_URL = 'https://api.github.com/repos/avigdor12/KeyClick/releases/latest'
  const LOCAL_VERSION = 'v67.0.0'

  async function checkVersion() {
    dbg('checkVersion', `fetch GET ${VERSION_URL}`)
    try {
      const r = await fetch(VERSION_URL)
      const data = await r.json()
      const tag: string = data.tag_name ?? 'unknown'
      const pub: string = data.published_at?.slice(0, 10) ?? 'unknown'
      const match = tag === LOCAL_VERSION
      dbg('checkVersion', `github.latest="${tag}" published="${pub}" route.serves="${LOCAL_VERSION}" route.synced=${match}`)
      localStorage.setItem('kc_last_version_check', String(Date.now()))
    } catch (err) {
      dbg('checkVersion', `failed err="${String(err)}"`)
    }
  }

  async function handleInstall() {
    if (Current_User_Pointer_to_DB?.is_M_Finance_installed) {
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgAlreadyInstalled })
      return
    }
    setDebugLog([])
    dbg('handleInstall', `called user=${Current_User_Pointer_to_DB?.email ?? 'not logged in'} is_M_Finance_installed=${Current_User_Pointer_to_DB?.is_M_Finance_installed ?? 'unknown'}`)
    setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgDownloading })
    dbg('handleInstall', 'fetch GET /api/download-mfinance')
    try {
      const res = await fetch('/api/download-mfinance')
      dbg('handleInstall', `res.status=${res.status} res.ok=${res.ok}`)
      if (!res.ok) {
        dbg('handleInstall', `res.status=${res.status} res.statusText="${res.statusText}" => throw`)
        throw new Error(`HTTP ${res.status}`)
      }
      const blob = await res.blob()
      dbg('handleInstall', `blob.size=${blob.size} (${(blob.size/1024/1024).toFixed(2)}MB) blob.type="${blob.type}" size>1MB=${blob.size > 1024*1024}`)
      const url = URL.createObjectURL(blob)
      dbg('handleInstall', `objectURL="${url.substring(0,50)}..."`)
      const a = document.createElement('a')
      a.href = url
      a.download = 'M_Finance_Setup.exe'
      dbg('handleInstall', `a.download="${a.download}" => a.click()`)
      a.click()
      await new Promise(r => setTimeout(r, 1000))
      URL.revokeObjectURL(url)
      dbg('handleInstall', 'revokeObjectURL done => file ready')
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgInstallComplete })
    } catch (err) {
      dbg('handleInstall', `catch err="${String(err)}"`)
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgDownloadError, bodyColor: '#ff6600' })
    }
  }

  async function handleRun() {
    dbg('handleRun', 'mfinance:// via hidden iframe — waiting for blur')
    let appOpened = false
    const onBlur = () => { appOpened = true }
    window.addEventListener('blur', onBlur)
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'mfinance://'
    document.body.appendChild(iframe)
    await new Promise(r => setTimeout(r, 3000))
    window.removeEventListener('blur', onBlur)
    try { document.body.removeChild(iframe) } catch { /* */ }
    dbg('handleRun', `appOpened=${appOpened}`)
    if (!appOpened) {
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgNotInstalled, bodyColor: '#ff6600' })
    }
  }

  async function changeLang(i: number) {
    dbg('changeLang', `i=${i} code=${languages[i].code} name="${languages[i].name}" userLoggedIn=${!!Current_User_Pointer_to_DB}`)
    setLangIdx(i)
    if (Current_User_Pointer_to_DB) {
      const newLang = languages[i].name
      dbg('changeLang', `fetch POST /api/update-language email="${Current_User_Pointer_to_DB.email}" language="${newLang}"`)
      try {
        const r = await fetch('/api/update-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: Current_User_Pointer_to_DB.email, language: newLang }),
        })
        dbg('changeLang', `update-language res.status=${r.status} res.ok=${r.ok}`)
      } catch (err) {
        dbg('changeLang', `update-language failed err="${String(err)}"`)
      }
      set_Current_User_Pointer_to_DB({ ...Current_User_Pointer_to_DB, language: newLang })
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
            <div onClick={() => setPopupMsg(null)} style={{ position: 'absolute', right: '12px', bottom: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>{lang.card.ok}</div>
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
            <PageContent page={activePage} lang={lang} langIdx={langIdx} onChangeLang={changeLang} clientIp={clientIp} user={Current_User_Pointer_to_DB} systemMessage={systemMessage} onSetSystemMessage={setSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} onClose={() => setActivePage(null)} onLogin={(user) => set_Current_User_Pointer_to_DB(user)} onUserUpdate={(user) => set_Current_User_Pointer_to_DB(user)} onNavigate={(p) => setActivePage(p)} onMsg={setPopupMsg} onDbg={dbg} onOpenDebug={() => {
              if (debugWinRef.current && !debugWinRef.current.closed) { debugWinRef.current.close(); debugWinRef.current = null }
              else openDebugWin()
            }} />
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
          {lang.menu.map((item, idx) => idx === 2 ? null : (
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
            <div style={{ color: '#FFD700', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '5px', marginBottom: '6px', fontFamily: handFont(lang.code) }}>
              {lang.card.title}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <button onClick={() => { setActivePage('mf-login'); setActiveMfBtn(null) }}
                style={{ ...mfBtn, ...(activePage === 'mf-login' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.login}
              </button>
              <button onClick={() => { setActivePage('mf-register'); setActiveMfBtn(null) }}
                style={{ ...mfBtn, ...(activePage === 'mf-register' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.register}
              </button>
              <button onClick={() => { setActiveMfBtn(activeMfBtn === 'install' ? null : 'install'); handleInstall() }}
                style={{ ...mfBtn, ...(activeMfBtn === 'install' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.install}
              </button>
              <button onClick={() => { setActiveMfBtn(activeMfBtn === 'run' ? null : 'run'); handleRun() }}
                style={{ ...mfBtn, ...(activeMfBtn === 'run' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.run}
              </button>
              <button onClick={() => setActiveMfBtn(activeMfBtn === 'videos' ? null : 'videos')}
                style={{ ...mfBtn, ...(activeMfBtn === 'videos' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.videos}
              </button>
              <button onClick={() => setActiveMfBtn(activeMfBtn === 'guide' ? null : 'guide')}
                style={{ ...mfBtn, ...(activeMfBtn === 'guide' ? { background: '#4a1a6e' } : {}) }}>
                {lang.card.guide}
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <button onClick={() => {
              if (activePage === 'system') {
                debugWinRef.current?.close()
                debugWinRef.current = null
                setActivePage(null)
              } else {
                setActivePage('system')
              }
            }}
            style={{
              background: activePage === 'system' ? '#4a1a6e' : 'none', border: 'none',
              borderTop: '2px solid #555', color: activePage === 'system' ? '#fff' : '#888',
              padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              fontSize: '11px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.3',
            }}
            onMouseEnter={e => { if (activePage !== 'system') e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { if (activePage !== 'system') e.currentTarget.style.color = '#888' }}
          >{lang.system.adminButton}</button>
        </aside>

      </div>

      {/* BOTTOM */}
      <footer style={{ background: '#111', color: '#666', padding: '6px 16px', fontSize: '12px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ color: '#FFD700' }}>{siteVersion.line1 || 'KeyClick · M Solution Group'}</span>
        <span style={{ color: '#FFD700' }}>{siteVersion.line2 || ''}</span>
      </footer>

    </div>
  )
}

const SCHEDULE_SUBJECTS = ['יום ה-X ההפצה', 'תקופת הרצה', 'תקופת ניסיון', 'VIP', 'חודשי', 'שנתי', 'חד פעמי'] as const
function fmtDate(d: string) { const [y, m, day] = d.split('-'); return `${day}/${m}/${y.slice(2)}` }
type ScheduleRow = { price: string; months: string; fromDate: string; toDate: string; notes: string }
type FeedbackMessage = { id: number; user_id: number | null; user_name: string | null; sent_date: string | null; title: string | null; body: string | null; rating_site: number | null; rating_budget: number | null; reply_text: string | null; reply_date: string | null; is_read: boolean; created_at: string; sender_ip?: string | null }

function SystemPage({ user, lang, langIdx, onChangeLang, onOpenDebug, onDbg, onUserUpdate, onSetSystemMessage, prText, setPrText, prDate, setPrDate }: { user: UserRecord | null; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; onOpenDebug: () => void; onDbg: (func: string, msg: string) => void; onUserUpdate: (u: UserRecord) => void; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void }) {
  const [view, setView] = useState<'none' | 'db' | 'users' | 'schedule' | 'pr' | 'messages'>('none')
  const [debugOpen, setDebugOpen] = useState(false)
  const [buildOpen, setBuildOpen] = useState(false)
  const [prSaved, setPrSaved] = useState(false)
  const [updatesResetDone, setUpdatesResetDone] = useState(false)
  const buildWinRef = React.useRef<Window | null>(null)
  const [dbTables, setDbTables] = useState<{ name: string; rows: Record<string, unknown>[] }[]>([])
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [expandedUser, setExpandedUser] = useState<number | null>(null)
  const [pendingForce, setPendingForce] = useState<Record<string, string>>({})
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(
    SCHEDULE_SUBJECTS.map(() => ({ price: '', months: '', fromDate: '', toDate: '', notes: '' }))
  )
  const [colWidths, setColWidths] = useState<number[]>([140, 62, 62, 80, 80, 180])
  const [rowHeights, setRowHeights] = useState<number[]>(Array(SCHEDULE_SUBJECTS.length).fill(26))
  const colResizeRef = useRef<{ col: number; startX: number; startWidth: number } | null>(null)
  const rowResizeRef = useRef<{ row: number; startY: number; startHeight: number } | null>(null)
  const dateRefs = useRef<(HTMLInputElement | null)[]>(Array(SCHEDULE_SUBJECTS.length * 2).fill(null))

  useEffect(() => {
    if (view === 'users') {
      fetch('/api/system/users').then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {})
    }
  }, [user?.language])

  useEffect(() => {
    if (view === 'schedule') {
      fetch('/api/system/schedule').then(r => r.json()).then(d => {
        if (d.data?.rows) setScheduleRows(d.data.rows)
      }).catch(() => {})
    }
  }, [view])

  function handleDb() {
    if (view === 'db') { setView('none'); return }
    setView('db')
    onDbg('handleDb', 'fetch GET /api/system/db-records')
    fetch('/api/system/db-records').then(r => r.json()).then(d => {
      const tables = d.tables ?? []
      onDbg('handleDb', `tables=${tables.length} names="${tables.map((t: { name: string }) => t.name).join(',')}"`)
      setDbTables(tables)
    }).catch(err => onDbg('handleDb', `failed err="${String(err)}"`))
  }

  function handleBuild() {
    if (buildWinRef.current && !buildWinRef.current.closed) { buildWinRef.current.close(); buildWinRef.current = null; return }
    const w = 700, h = 500
    const left = window.screenX + Math.floor((window.outerWidth  - w) / 2)
    const top  = window.screenY + Math.floor((window.outerHeight - h) / 2)
    const win  = window.open('', 'KeyClickBuild', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no,menubar=no,status=no`)
    if (!win) return
    buildWinRef.current = win
    const apiUrl = `${window.location.origin}/api/system/build-log`
    win.document.open()
    win.document.write(`<!DOCTYPE html><html><head><title>Build Log</title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#1e1e1e;font-family:Consolas,monospace;display:flex;flex-direction:column;height:100vh}
      #tb{background:#3c3c6e;padding:5px 10px;display:flex;gap:6px;align-items:center;flex-shrink:0}
      #tb span{color:#fff;font-weight:bold;font-size:16px;margin-right:auto}
      button{background:#003399;border:none;color:#FFD700;padding:3px 12px;border-radius:3px;cursor:pointer;font-size:16px;font-weight:bold;font-family:inherit}
      button:hover{background:#0044cc}
      #log{flex:1;overflow-y:auto;padding:8px 12px;line-height:1.3;direction:ltr;text-align:left}
      .r{padding:0;white-space:pre-wrap;word-break:break-all;text-align:left}
      .rel{color:#FFD700;font-size:18px;font-weight:bold}
      .noise{color:#ffffff;font-size:16px;font-weight:normal}
      .loading{color:#888;font-style:italic;font-size:16px}
      #sb{background:#252526;color:#888;font-size:14px;padding:3px 10px;display:flex;justify-content:space-between;flex-shrink:0}
    </style></head><body>
    <div id="tb"><span>${lang.system.buildMessages}</span>
      <button onclick="document.getElementById('log').innerHTML='';upd()">${lang.system.clear}</button>
      <button id="fbtn" onclick="toggleFilter()">${lang.system.filter}</button>
      <button onclick="load()">${lang.system.refresh}</button>
    </div>
    <div id="log"><div class="r loading">${lang.system.loadingBuild}</div></div>
    <div id="sb"><span id="cnt">${lang.system.loading}</span><span id="st"></span></div>
    <script>
      var log=document.getElementById('log');
      var TXT_LINES=' ${lang.system.lines}',TXT_ERR='${lang.system.error}',TXT_NET='${lang.system.networkError}: ',TXT_NO='${lang.system.noBuildData}';
      function upd(msg){document.getElementById('cnt').textContent=msg||log.children.length+TXT_LINES;}
      function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
      function add(cls,text){var d=document.createElement('div');d.className='r '+cls;d.innerHTML=esc(text);log.appendChild(d);}
      function isNoise(line){
        var l=line.trim();
        return l.startsWith('+') || l.startsWith('At ') ||
          l.includes('CategoryInfo') || l.includes('FullyQualifiedErrorId') || l.includes('NativeCommandError') ||
          l.includes('libpq') || l.includes('sslmode') || l.includes('verify-full') || l.includes('verify-ca') ||
          l.includes('LF will be replaced') || l.startsWith('In the next major') ||
          l.startsWith('semantics,') || l.startsWith('To prepare') || l.startsWith('- If you want') ||
          l.startsWith('See https://') || l.startsWith('(Use ') || l.startsWith('aliases for') ||
          l.startsWith('char:');
      }
      function load(){
        fetch('${apiUrl}')
          .then(r=>r.json())
          .then(data=>{
            log.innerHTML='';
            if(data.error){add('rel','⚠ '+TXT_ERR+': '+data.error);upd(TXT_ERR);return;}
            if(data.dbVersion) add('rel','dbVersion: '+esc(data.dbVersion));
            if(data.buildTime) add('rel','buildTime: '+esc(data.buildTime));
            if(data.buildLog){
              var lines=data.buildLog.split(String.fromCharCode(10));
              lines.forEach(function(line){
                var clean=line.replace(new RegExp(String.fromCharCode(13),'g'),'');
                if(!clean.trim()) return;
                add(isNoise(clean)?'noise':'rel', clean);
              });
            } else {
              add('rel','— '+TXT_NO+' —');
            }
            log.scrollTop=log.scrollHeight;
            upd(data.buildLog ? data.buildLog.split(String.fromCharCode(10)).filter(function(l){return l.replace(new RegExp(String.fromCharCode(13),'g'),'').trim();}).length+TXT_LINES : '0'+TXT_LINES);
          })
          .catch(e=>{log.innerHTML='';add('rel',TXT_NET+e);upd(TXT_ERR);});
      }
      var filtered=false;
      function toggleFilter(){filtered=!filtered;var ns=document.querySelectorAll('.noise');for(var i=0;i<ns.length;i++)ns[i].style.display=filtered?'none':'';document.getElementById('fbtn').style.background=filtered?'#660000':'#003399';}
      load();
      if(window.opener){window.opener.addEventListener('beforeunload',function(){window.close();});}
    </script></body></html>`)
    win.document.close()
  }

  function handleUsers() {
    if (view === 'users') { setView('none'); return }
    setView('users')
    onDbg('handleUsers', 'fetch GET /api/system/users')
    fetch('/api/system/users').then(r => r.json()).then(d => {
      const users = d.users ?? []
      onDbg('handleUsers', `count=${users.length} ids="${users.map((u: Record<string,unknown>) => u.id).join(',')}"`)
      setUsers(users)
    }).catch(err => onDbg('handleUsers', `failed err="${String(err)}"`))
  }

  function updateScheduleRow(i: number, field: keyof ScheduleRow, value: string) {
    setScheduleRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  function handleSchedule() {
    if (view === 'schedule') { setView('none'); return }
    setView('schedule')
  }

  function handleUpdate() {
    const updated = scheduleRows.map(row => {
      if (row.months && row.fromDate) {
        const from = new Date(row.fromDate)
        from.setMonth(from.getMonth() + parseInt(row.months))
        return { ...row, toDate: from.toISOString().slice(0, 10) }
      }
      return row
    })
    setScheduleRows(updated)
    fetch('/api/system/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows: updated }) }).catch(() => {})
  }

  function onRowResizeDown(rowIdx: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    rowResizeRef.current = { row: rowIdx, startY: e.clientY, startHeight: rowHeights[rowIdx] }
    function onMove(ev: MouseEvent) {
      if (!rowResizeRef.current) return
      const newH = Math.max(20, rowResizeRef.current.startHeight + ev.clientY - rowResizeRef.current.startY)
      setRowHeights(prev => prev.map((h, i) => i === rowResizeRef.current!.row ? newH : h))
    }
    function onUp() { rowResizeRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function onColResizeDown(colIdx: number, e: React.MouseEvent, fromRight = false) {
    e.preventDefault()
    e.stopPropagation()
    colResizeRef.current = { col: colIdx, startX: e.clientX, startWidth: colWidths[colIdx] }
    function onMove(ev: MouseEvent) {
      if (!colResizeRef.current) return
      const delta = ev.clientX - colResizeRef.current.startX
      const newW = Math.max(24, colResizeRef.current.startWidth + (fromRight ? delta : -delta))
      setColWidths(prev => prev.map((w, i) => i === colResizeRef.current!.col ? newW : w))
    }
    function onUp() { colResizeRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const sysBtn: React.CSSProperties = {
    background: '#003399', border: 'none', borderRadius: '6px',
    color: '#FFD700', padding: '8px 12px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 'bold', textAlign: 'center',
  }

  const sysBtnSm: React.CSSProperties = {
    background: '#003399', border: 'none', borderRadius: '4px',
    color: '#FFD700', padding: '5px 2px', cursor: 'pointer',
    fontSize: '11px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2',
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: view === 'messages' ? 0 : '16px 20px', background: '#f7f7f7' }}>
        {view === 'none' && (
          <div style={{ color: '#aaa', fontSize: 16, marginTop: 40, textAlign: 'center' }}>{lang.system.selectAction}</div>
        )}

        {view === 'pr' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', marginTop: '28px', direction: 'rtl', width: '730px' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{lang.feedback.systemMessage}</span>
              <div style={{ border: '2px solid #003399', borderRadius: '6px', minHeight: '96px', padding: '12px', display: 'flex', flexDirection: 'column', background: '#fff', resize: 'vertical', overflow: 'auto' }}>
                <textarea value={prText} onChange={e => setPrText(e.target.value)} autoFocus style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', minHeight: '50px', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: 'rtl', background: 'transparent' }} />
                <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                  {lang.feedback.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {lang.feedback.customerRelations}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '8px', width: '730px', textAlign: 'right', direction: 'rtl' }}>
              {lang.system.publishedDate} <input type="date" value={prDate} onChange={e => setPrDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #999', fontSize: '13px', outline: 'none', background: 'transparent', color: '#333' }} />
            </div>
            <div style={{ marginTop: '6px', width: '730px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button onClick={() => {
                onSetSystemMessage(prText)
                setPrSaved(true)
                setTimeout(() => setPrSaved(false), 2000)
                fetch('/api/system/pr-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: prText, date: prDate }) }).catch(() => {})
              }} style={{ fontSize: '11px', padding: '2px 10px', background: prSaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{prSaved ? '✓ ' + lang.system.saved : lang.card.update}</button>
              <button onClick={() => { setPrText(''); onSetSystemMessage('') }} style={{ fontSize: '11px', padding: '2px 10px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.reset}</button>
            </div>
          </div>
        )}

        {view === 'db' && (
          <div>
            {dbTables.map(t => (
              <div key={t.name} style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 'bold', fontSize: 15, color: '#003399', background: '#e8eaf6', padding: '4px 10px', borderRadius: 4, marginBottom: 6 }}>
                  {t.name} <span style={{ color: '#888', fontWeight: 'normal', fontSize: 12 }}>({t.rows.length} {lang.system.records})</span>
                </div>
                {t.rows.map((row, ri) => (
                  <div key={ri} style={{ borderBottom: '1px solid #eee', padding: '5px 8px', fontSize: 12 }}>
                    {Object.entries(row).map(([k, v]) => (
                      <span key={k} style={{ marginRight: 14 }}>
                        <span style={{ color: '#003399', fontWeight: 'bold' }}>{k}:</span>{' '}
                        <span style={{ color: '#222' }}>{String(v ?? '')}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

{view === 'users' && (
          <div>
            <div style={{ width: 'fit-content' }}>
            <div style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 10, color: '#003399', textAlign: 'right' }}>{lang.system.users}</div>
            <div style={{ border: '2px solid #003399', borderRadius: 3 }}>
              <table style={{ borderCollapse: 'collapse', fontSize: 13, direction: 'ltr', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#e8eaf6' }}>
                    <th colSpan={8} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{lang.system.generalGroup}</th>
                    <th colSpan={6} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>M Finance</th>
                  </tr>
                  <tr style={{ background: '#e8eaf6' }}>
                    {['ID', lang.system.colCreated, lang.system.colName, lang.profile.email, lang.profile.language, lang.system.colCurrency, 'IP', 'Last IP'].map(h => (
                      <th key={h} style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{h}</th>
                    ))}
                    {[lang.system.colActive, lang.system.colAppInstalled, lang.profile.planFrom, lang.profile.planTo, lang.system.colLicenceType, lang.system.colSystemForce].map(h => (
                      <th key={h} style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => {
                    const created = u.created_at ? String(u.created_at).slice(0, 10) : ''
                    return (
                      <tr key={String(u.id)} style={{ background: idx % 2 === 0 ? '#fff' : '#f5f5fc' }}>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.id ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{created}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{String(u.name ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{String(u.email ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.language ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.currency ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}></td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.last_ip ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.is_active ? '✓' : ''}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.is_M_Finance_installed ? '✓' : ''}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.plan_start ? String(u.plan_start).slice(0,10) : ''}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.plan_end ? String(u.plan_end).slice(0,10) : ''}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{String(u.M_Finance_license_type ?? '')}</td>
                        <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                          <select
                            value={String(u.system_force ?? 'User')}
                            onChange={e => {
                              const systemForce = e.target.value
                              onDbg('dropdown', `userId=${u.id} שינוי system_force → ${systemForce}`)
                              setPendingForce(prev => ({ ...prev, [String(u.id)]: systemForce }))
                              setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, system_force: systemForce === 'User' ? null : systemForce } : usr))
                              onDbg('dropdown', `pendingForce עודכן userId=${u.id}`)
                            }}
                            style={{ fontSize: 12, border: '1px solid #a0a8c0', borderRadius: 3, padding: '1px 2px', background: u.system_force && u.system_force !== 'User' ? '#fff3e0' : '#fff', cursor: 'pointer' }}
                          >
                            <option value="User">User</option>
                            <option value="System_Free_Run">{lang.profile.planNames.System_Free_Run}</option>
                            <option value="User_VIP_Free">VIP</option>
                            <option value="System_Owner">{lang.profile.planNames.System_Owner}</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={async () => {
                  const entries = Object.entries(pendingForce)
                  onDbg('עדכון', `לחיצה — ${entries.length} שינויים: ${entries.map(([id, f]) => `user${id}→${f}`).join(', ')}`)
                  await Promise.all(entries.map(async ([userId, systemForce]) => {
                    onDbg('עדכון', `שולח force-plan userId=${userId} systemForce=${systemForce}`)
                    try {
                      const res = await fetch('/api/system/force-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, systemForce }) })
                      const data = await res.json()
                      onDbg('עדכון', `force-plan תגובה userId=${userId} ok=${data.ok ?? false} error=${data.error ?? 'none'}`)
                    } catch (e) {
                      onDbg('עדכון', `force-plan שגיאה userId=${userId} err=${String(e)}`)
                    }
                  }))
                  setPendingForce({})
                  onDbg('עדכון', 'שולח current-user לרענון state')
                  fetch('/api/current-user')
                    .then(r => r.json())
                    .then(d => {
                      onDbg('עדכון', `current-user תגובה id=${d.user?.id ?? 'none'} license=${d.user?.M_Finance_license_type ?? 'none'} system_force=${d.user?.system_force ?? 'none'}`)
                      if (d.user) { onUserUpdate(d.user); onDbg('עדכון', 'onUserUpdate נקרא — state מעודכן') }
                    })
                    .catch(e => onDbg('עדכון', `current-user שגיאה err=${String(e)}`))
                  onDbg('עדכון', 'מרענן טבלת משתמשים')
                  fetch('/api/system/users').then(r => r.json()).then(d => { setUsers(d.users ?? []); onDbg('עדכון', `טבלת משתמשים רועננה — ${d.users?.length ?? 0} שורות`) }).catch(e => onDbg('עדכון', `users שגיאה err=${String(e)}`))
                }}
                disabled={Object.keys(pendingForce).length === 0}
                style={{ background: '#003399', border: 'none', borderRadius: 5, color: '#FFD700', padding: '5px 16px', fontSize: 13, cursor: Object.keys(pendingForce).length > 0 ? 'pointer' : 'default', fontWeight: 'bold', opacity: Object.keys(pendingForce).length > 0 ? 1 : 0.4 }}>
                {lang.card.update}
              </button>
            </div>
            </div>
          </div>
        )}

        {view === 'schedule' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 'fit-content', minWidth: 500 }}>
                            <div style={{ marginBottom: 6, display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'baseline' }}>
                <span style={{ fontSize: 16, color: '#003399' }}>M Finance</span>
                <span style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: 20, color: '#003399', fontWeight: 'bold' }}>{lang.card.title}</span>
              </div>
              <div style={{ border: '2px solid #003399', borderRadius: 3 }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 14, direction: 'rtl', tableLayout: 'fixed', width: colWidths.reduce((a, b) => a + b, 0) }}>
                  <colgroup>
                    {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#e8eaf6' }}>
                      {[lang.system.scheduleSubject, lang.system.schedulePriceUSD, lang.system.schedulePeriod, lang.profile.planFrom, lang.profile.planTo, lang.system.scheduleNotes].map((label, ci) => (
                        <th key={ci} style={{ position: 'relative', padding: '4px 5px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2, whiteSpace: 'pre', overflow: 'hidden' }}>
                          {label}
                          <div onMouseDown={e => onColResizeDown(ci, e, false)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, cursor: 'col-resize' }} />
                          <div onMouseDown={e => onColResizeDown(ci, e, true)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, cursor: 'col-resize' }} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEDULE_SUBJECTS.map((subject, i) => {
                      const scheduleLabels = [lang.system.distributionDay, lang.profile.planNames.System_Free_Run, lang.profile.planNames.User_Trial, lang.profile.planNames.User_VIP_Free, lang.profile.planNames.User_Monthly, lang.profile.planNames.User_Annual, lang.profile.planNames.User_One_Time]
                      return (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5fc', height: rowHeights[i] }}>
                        <td style={{ position: 'relative', padding: '3px 5px', border: '1px solid #c8cce0', fontWeight: 'bold', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                          {scheduleLabels[i] ?? subject}
                          <div onMouseDown={e => onRowResizeDown(i, e)} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, cursor: 'row-resize' }} />
                        </td>
                        <td style={{ padding: '1px 2px', border: '1px solid #c8cce0' }}>
                          <input type="text" value={scheduleRows[i].price}
                            onChange={e => updateScheduleRow(i, 'price', e.target.value)}
                            style={{ width: '100%', padding: '2px 3px', border: 'none', outline: 'none', fontSize: 14, textAlign: 'center', background: 'transparent', boxSizing: 'border-box' }} />
                        </td>
                        <td style={{ padding: '1px 2px', border: '1px solid #c8cce0' }}>
                          <input type="text" value={scheduleRows[i].months}
                            onChange={e => updateScheduleRow(i, 'months', e.target.value)}
                            style={{ width: '100%', padding: '2px 3px', border: 'none', outline: 'none', fontSize: 14, textAlign: 'center', background: 'transparent', boxSizing: 'border-box' }} />
                        </td>
                        {(['fromDate', 'toDate'] as const).map((field, fi) => (
                          <td key={field} onClick={() => dateRefs.current[i * 2 + fi]?.showPicker()}
                            style={{ padding: '1px 2px', border: '1px solid #c8cce0', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="date" ref={el => { dateRefs.current[i * 2 + fi] = el }}
                              value={scheduleRows[i][field]}
                              onChange={e => updateScheduleRow(i, field, e.target.value)}
                              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }} />
                            <span style={{ fontSize: 12, pointerEvents: 'none' }}>
                              {scheduleRows[i][field] ? fmtDate(scheduleRows[i][field]) : ''}
                            </span>
                          </td>
                        ))}
                        <td style={{ padding: '1px 2px', border: '1px solid #c8cce0' }}>
                          <textarea value={scheduleRows[i].notes}
                            onChange={e => updateScheduleRow(i, 'notes', e.target.value)}
                            rows={1}
                            style={{ width: '100%', padding: '2px 3px', border: 'none', outline: 'none', fontSize: 14, resize: 'none', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', background: 'transparent', overflow: 'hidden' }} />
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-start', direction: 'rtl' }}>
                <button onClick={() => setScheduleRows(SCHEDULE_SUBJECTS.map(() => ({ price: '', months: '', fromDate: '', toDate: '', notes: '' })))}
                  style={{ background: '#888', border: 'none', borderRadius: 5, color: '#fff', padding: '5px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.reset}</button>
                <button onClick={handleUpdate}
                  style={{ background: '#003399', border: 'none', borderRadius: 5, color: '#FFD700', padding: '5px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>{lang.card.update}</button>
              </div>
            </div>
          </div>
        )}
        {view === 'messages' && (
          <MessagesPage user={user} lang={lang} onDbg={onDbg} />
        )}

      </div>

      {/* Right sidebar */}
      <aside style={{ width: '140px', background: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, margin: '10px 6px 10px 0', borderRadius: '10px 0 0 10px', overflow: 'hidden', boxShadow: '-2px 0 6px rgba(0,0,0,0.3)' }}>
        <div style={{ background: '#444', padding: '8px 4px 6px', textAlign: 'center', borderBottom: '2px solid #333', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-dancing), Georgia, serif', fontSize: '22px', color: '#FFD700', fontWeight: 'bold', textShadow: '1px 1px 3px #000' }}>KeyClick</div>
          <div style={{ color: '#FFD700', fontSize: '11px', fontWeight: 'bold', letterSpacing: 1, textShadow: '1px 1px 2px #000' }}>{lang.system.systemLabel}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px 6px', width: '100%', boxSizing: 'border-box' }}>

          {/* מוניטור */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>מוניטור</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, ...(debugOpen ? { background: '#4a1a6e' } : {}) }} onClick={() => { onOpenDebug(); setDebugOpen(prev => !prev) }}>Debug</button>
              <button style={{ ...sysBtnSm, ...(view === 'db' ? { background: '#4a1a6e' } : {}) }} onClick={handleDb}>DB</button>
              <button style={{ ...sysBtnSm, gridColumn: 'span 2', ...(buildOpen ? { background: '#4a1a6e' } : {}) }} onClick={() => { handleBuild(); setBuildOpen(prev => !prev) }}>{lang.system.buildMessages}</button>
            </div>
          </div>

          {/* נתוני מערכת */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>נתוני מערכת</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, ...(view === 'users' ? { background: '#4a1a6e' } : {}) }} onClick={handleUsers}>{lang.system.users}</button>
              <button style={{ ...sysBtnSm, ...(view === 'schedule' ? { background: '#4a1a6e' } : {}) }} onClick={handleSchedule}>{lang.system.schedule}</button>
            </div>
          </div>

          {/* קשרי לקוחות */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>קשרי לקוחות</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, ...(view === 'pr' ? { background: '#4a1a6e' } : {}) }} onClick={() => setView(view === 'pr' ? 'none' : 'pr')}>{lang.system.pr}</button>
              <button style={{ ...sysBtnSm, ...(view === 'messages' ? { background: '#4a1a6e' } : {}) }} onClick={() => setView(view === 'messages' ? 'none' : 'messages')}>{lang.system.messages}</button>
            </div>
          </div>

          {/* עדכונים */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>עדכונים</div>
            <button style={{ ...sysBtnSm, width: '100%', background: updatesResetDone ? '#006600' : undefined }} onClick={() => {
              fetch('/api/updates', { method: 'DELETE' })
                .then(() => { setUpdatesResetDone(true); setTimeout(() => setUpdatesResetDone(false), 2000) })
                .catch(() => {})
            }}>{updatesResetDone ? '✓ אופס' : 'איפוס טבלה'}</button>
          </div>

        </div>
      </aside>

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


function FeedbackPage({ user, lang, systemMessage, onDbg }: { user: UserRecord | null; lang: typeof languages[0]; systemMessage: string; onDbg: (func: string, msg: string) => void }) {
  const [ratingSite,   setRatingSite]   = useState<number | null>(null)
  const [ratingBudget, setRatingBudget] = useState<number | null>(null)
  const [userDate,  setUserDate]  = useState('')
  const [userTitle, setUserTitle] = useState('')
  const [userFrom,  setUserFrom]  = useState('')
  const [userText,  setUserText]  = useState('')
  const [replyDate, setReplyDate] = useState('')
  const [replyText, setReplyText] = useState('')
  const [sending,   setSending]   = useState(false)
  const [sendDone,  setSendDone]  = useState(false)
  const [hasReply,  setHasReply]  = useState(false)
  const [loadedMessages, setLoadedMessages] = useState<FeedbackMessage[]>([])
  const [selectedMsgId,  setSelectedMsgId]  = useState<number | null>(null)
  const [refNum, setRefNum] = useState('')
  const [validationErrors, setValidationErrors] = useState<{date?: boolean, title?: boolean, from?: boolean}>({})
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [expandedMsgId, setExpandedMsgId] = useState<number | null>(null)
  const isAdmin = user?.M_Finance_license_type === LICENSE_TYPES.System_Owner

  useEffect(() => {
    if (!user?.id) return
    onDbg('FeedbackPage.init', `mount isAdmin=${isAdmin} sessionId=${sessionId}`)
    if (isAdmin) {
      onDbg('FeedbackPage.init', 'נתיב ADMIN — שולף session ו-messages')
      fetch(`/api/feedback-session?userId=${user.id}`)
        .then(r => r.json())
        .then(d => {
          const sid: number = d.session?.id
          if (sid) { setSessionId(sid); onDbg('FeedbackPage.init', `admin sessionId=${sid}`) }
          else onDbg('FeedbackPage.init', 'admin — sid=null!')
        })
        .catch(e => onDbg('FeedbackPage.init', `admin session error: ${String(e)}`))
      fetch('/api/feedback')
        .then(r => r.json())
        .then(d => {
          const msgs: FeedbackMessage[] = d.messages ?? []
          setLoadedMessages(msgs)
          onDbg('FeedbackPage.admin.load', `count=${msgs.length} ids=${msgs.map(m => m.id).join(',')}`)
          const defMsg = msgs[msgs.length - 1]
          if (defMsg) {
            setSelectedMsgId(defMsg.id)
            setExpandedMsgId(defMsg.id)
            setReplyText(defMsg.reply_text ?? '')
            setReplyDate(defMsg.reply_date || new Date().toISOString().slice(0, 10))
            setHasReply(!!defMsg.reply_text)
            onDbg('FeedbackPage.admin.load', `selected last.id=${defMsg.id} hasReply=${!!defMsg.reply_text}`)
          }
        })
        .catch(e => onDbg('FeedbackPage.admin.load', `error: ${String(e)}`))
    } else {
      fetch(`/api/feedback-session?userId=${user.id}`)
        .then(r => r.json())
        .then(d => {
          const sid: number = d.session?.id
          if (!sid) { onDbg('FeedbackPage.session', 'sid=null — אין session!'); return }
          setSessionId(sid)
          onDbg('FeedbackPage.session', `sessionId=${sid}`)
          return fetch(`/api/feedback?userId=${user.id}&sessionId=${sid}`)
            .then(r => r.json())
            .then(d2 => {
              const msgs: FeedbackMessage[] = d2.messages ?? []
              setLoadedMessages(msgs)
              onDbg('FeedbackPage.loadMsgs', `count=${msgs.length} sessionId=${sid}`)
              const def = msgs[msgs.length - 1]
              if (def) {
                setSelectedMsgId(def.id)
                setExpandedMsgId(def.id)
                setReplyText(def.reply_text ?? '')
                setReplyDate(def.reply_date || new Date().toISOString().slice(0, 10))
                setHasReply(!!def.reply_text)
              }
            })
        })
        .catch(() => {})
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    if (isAdmin) { onDbg('FeedbackPage.poll', `לא מתחיל — isAdmin=true`); return }
    if (!sessionId) { onDbg('FeedbackPage.poll', `לא מתחיל — sessionId=null`); return }
    onDbg('FeedbackPage.poll', `התחלת polling sessionId=${sessionId}`)
    const interval = setInterval(() => {
      fetch(`/api/feedback?userId=${user.id}&sessionId=${sessionId}`)
        .then(r => r.json())
        .then(d => {
          const msgs: FeedbackMessage[] = d.messages ?? []
          setLoadedMessages(msgs)
          const last = msgs[msgs.length - 1]
          const hasR = !!last?.reply_text
          onDbg('FeedbackPage.poll', `count=${msgs.length} lastId=${last?.id ?? 'null'} hasReply=${hasR}`)
          if (last?.reply_text) {
            setExpandedMsgId(last.id)
            setReplyText(last.reply_text)
            setReplyDate(last.reply_date || new Date().toISOString().slice(0, 10))
            setHasReply(true)
            onDbg('FeedbackPage.poll', `תשובה הגיעה! replyLen=${last.reply_text.length}`)
          }
        })
        .catch(e => onDbg('FeedbackPage.poll', `error: ${String(e)}`))
    }, 5000)
    return () => clearInterval(interval)
  }, [user?.id, isAdmin, sessionId])

  function handleSelectMsg(id: number) {
    setSelectedMsgId(id)
    const msg = loadedMessages.find(m => m.id === id)
    if (msg) {
      setReplyText(msg.reply_text ?? '')
      setReplyDate(msg.reply_date || new Date().toISOString().slice(0, 10))
      setHasReply(!!msg.reply_text)
      onDbg('FeedbackPage.selectMsg', `id=${id} ref=${buildMsgRef(msg)} hasReply=${!!msg.reply_text}`)
    }
  }

  function handleReset() {
    setRefNum('')
    setValidationErrors({})
    setLoadedMessages([])
    setRatingSite(null)
    setRatingBudget(null)
    setUserDate('')
    setUserTitle('')
    setUserFrom('')
    setUserText('')
    setReplyDate('')
    setReplyText('')
    setSendDone(false)
    setHasReply(false)
    setSelectedMsgId(null)
    onDbg('FeedbackPage.reset', `closing sessionId=${sessionId}`)
    if (user?.id) {
      fetch('/api/feedback-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'close' })
      })
        .then(r => r.json())
        .then(d => {
          const newSid: number = d.session?.id
          if (newSid) {
            setSessionId(newSid)
            onDbg('FeedbackPage.reset', `newSessionId=${newSid}`)
          }
        })
        .catch(() => {})
    }
  }

  async function handleSend() {
    const errors: {date?: boolean, title?: boolean, from?: boolean} = {}
    if (!userDate.trim()) errors.date = true
    if (!userTitle.trim()) errors.title = true
    if (!userFrom.trim()) errors.from = true
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      onDbg('FeedbackPage.send', `validation failed: date=${errors.date} title=${errors.title} from=${errors.from}`)
      return
    }
    setValidationErrors({})
    let effectiveSid = sessionId
    if (!effectiveSid && user?.id) {
      try {
        const sr = await fetch(`/api/feedback-session?userId=${user.id}`)
        const sd = await sr.json()
        effectiveSid = sd.session?.id ?? null
        if (effectiveSid) { setSessionId(effectiveSid); onDbg('FeedbackPage.send', `sessionId fetched inline: ${effectiveSid}`) }
        else onDbg('FeedbackPage.send', 'sessionId inline fetch — sid=null!')
      } catch (e) { onDbg('FeedbackPage.send', `sessionId inline fetch error: ${String(e)}`) }
    }
    const now = new Date()
    const uid = user?.id ?? 0
    const dateStr = String(now.getFullYear()) + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0')
    const timeStr = String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0') + String(now.getSeconds()).padStart(2,'0')
    const newRef = `${uid}-${dateStr}-${timeStr}`
    setRefNum(newRef)
    setSending(true)
    onDbg('FeedbackPage.send', `isAdmin=${isAdmin} sessionId=${sessionId} userId=${user?.id} title="${userTitle}" ref=${newRef}`)
    try {
      const historyText = loadedMessages.length > 0
        ? '\n\n══════════ היסטוריה ══════════\n' + loadedMessages.map((m, i) => {
            let s = `[${i+1}] תאריך: ${m.sent_date ?? ''} | כותרת: ${m.title ?? ''}\n${m.body ?? ''}`
            if (m.reply_text) s += `\n\n── תשובת המערכת ──\nתאריך: ${m.reply_date ?? ''}\n${m.reply_text}`
            return s
          }).join('\n\n──────────\n')
        : ''
      const systemReplyPart = replyText
        ? `\n\n── תשובת המערכת ──\nתאריך: ${replyDate}\n\n${replyText}\n${lang.feedback.respectfully} KeyClick ${lang.feedback.customerRelations}`
        : ''
      const systemMsgPart = systemMessage
        ? `\n\n── הודעת המערכת ──\n${systemMessage}`
        : ''
      const fullBody = `סימוכין: ${newRef}\nתאריך: ${userDate} | כותרת: ${userTitle} | מאת: ${userFrom || user?.name || ''}\nדירוג אתר: ${ratingSite ?? '-'} | דירוג תקציב: ${ratingBudget ?? '-'}\n\n${userText}${systemReplyPart}${systemMsgPart}${historyText}`
      onDbg('FeedbackPage.send', `POST userId=${user?.id ?? 'null'} sessionId=${effectiveSid} title="${userTitle}"`)
      const postRes = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id ?? null, userName: user?.name || userFrom || null, sentDate: userDate || null, title: userTitle || null, body: fullBody, ratingSite: ratingSite, ratingBudget: ratingBudget, sessionId: effectiveSid })
      })
      const postData = await postRes.json()
      onDbg('FeedbackPage.send', `POST response ok=${postData.ok} id=${postData.id ?? 'null'} error=${postData.error ?? 'none'}`)
      setSendDone(true)
      setTimeout(() => setSendDone(false), 3000)
      setUserTitle(''); setUserText(''); setUserDate(''); setRatingSite(null); setRatingBudget(null); setRefNum('')
      if (user?.id && effectiveSid) {
        fetch(`/api/feedback?userId=${user.id}&sessionId=${effectiveSid}`).then(r => r.json()).then(d => {
          const msgs: FeedbackMessage[] = d.messages ?? []
          setLoadedMessages(msgs)
          onDbg('FeedbackPage.send', `refetched sessionId=${effectiveSid} count=${msgs.length}`)
          if (msgs[msgs.length - 1]) { setSelectedMsgId(msgs[msgs.length - 1].id); setExpandedMsgId(msgs[msgs.length - 1].id) }
        }).catch(() => {})
      } else if (isAdmin) {
        fetch('/api/feedback').then(r => r.json()).then(d => {
          const msgs: FeedbackMessage[] = d.messages ?? []
          setLoadedMessages(msgs)
          onDbg('FeedbackPage.send', `refetched admin count=${msgs.length}`)
          if (msgs[0]) { setSelectedMsgId(msgs[0].id) }
        }).catch(() => {})
      }
      onDbg('FeedbackPage.send', 'ok')
    } catch (e) { onDbg('FeedbackPage.send', `error: ${String(e)}`) }
    setSending(false)
  }

  async function handleSendReply() {
    if (!selectedMsgId || !replyText.trim() || !replyDate.trim()) return
    const selectedMsg = loadedMessages.find(m => m.id === selectedMsgId)
    if (!selectedMsg) return
    onDbg('FeedbackPage.sendReply', `msgId=${selectedMsgId} ref=${buildMsgRef(selectedMsg)}`)
    try {
      const replyBody = `── תשובת המערכת ──\nסימוכין: ${buildMsgRef(selectedMsg)}\nתאריך: ${replyDate}\n\n${replyText}\n${lang.feedback.respectfully} KeyClick ${lang.feedback.customerRelations}\n\n── ההודעה המקורית ──\n${selectedMsg.body ?? ''}`
      await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMsgId, replyText, replyDate, isRead: true, replyBody })
      })
      fetch('/api/feedback').then(r => r.json()).then(d => {
        const msgs: FeedbackMessage[] = d.messages ?? []
        setLoadedMessages(msgs)
        const updated = msgs.find(m => m.id === selectedMsgId)
        if (updated) { setHasReply(!!updated.reply_text) }
        onDbg('FeedbackPage.sendReply', 'ok')
      }).catch(() => {})
    } catch (e) { onDbg('FeedbackPage.sendReply', `error: ${String(e)}`) }
  }

  const isRTL = lang.code === 'he' || lang.code === 'ar'
  const dir = isRTL ? 'rtl' as const : 'ltr' as const
  const fb = lang.feedback
  const selectedMsg = expandedMsgId !== null ? (loadedMessages.find(m => m.id === expandedMsgId) ?? null) : null
  const getBodyText = (m: FeedbackMessage) => {
    const body = m.body ?? ''
    if (!body.startsWith('סימוכין:')) return body
    const firstBreak = body.indexOf('\n\n')
    if (firstBreak === -1) return body
    const afterMeta = body.slice(firstBreak + 2)
    const stops = ['\n\n══════════', '\n\n── תשובת', '\n\n── הודעת']
    let endIdx = afterMeta.length
    for (const sep of stops) {
      const idx = afterMeta.indexOf(sep)
      if (idx !== -1 && idx < endIdx) endIdx = idx
    }
    return afterMeta.slice(0, endIdx).trim()
  }

  const buildMsgRef = (m: FeedbackMessage | undefined) => {
    if (!m) return ''
    const match = (m.body ?? '').match(/^סימוכין:\s*(\S+)/)
    if (match) return match[1]
    const d2 = m.created_at ? new Date(m.created_at) : null
    return d2
      ? `${m.user_id}-${d2.getFullYear()}${String(d2.getMonth()+1).padStart(2,'0')}${String(d2.getDate()).padStart(2,'0')}-${String(d2.getHours()).padStart(2,'0')}${String(d2.getMinutes()).padStart(2,'0')}${String(d2.getSeconds()).padStart(2,'0')}`
      : String(m.id)
  }
  const side16 = isRTL ? { right: '16px' } : { left: '16px' }
  const side12 = isRTL ? { right: '12px' } : { left: '12px' }
  return (
    <div style={{ width: '100%', height: '100%', background: '#d0d0d0', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '24px', boxSizing: 'border-box', overflow: 'auto' }}>

      {/* LEFT - Messages Library */}
      <div style={{ flex: 1, minWidth: '320px', flexShrink: 0, position: 'sticky', top: 0, background: '#f5f5f5', borderRadius: '12px', border: '2px solid #003399', overflow: 'auto' }}>
        <div style={{ background: '#003399', padding: '8px 12px', textAlign: 'center' }}>
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{lang.system.messages}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', fontSize: 12, direction: 'rtl', padding: '0 4px' }}>
          <thead>
            <tr>
              {(['#', fb.date.replace(':','').trim(), fb.title.replace(':','').trim(), fb.ratingWebsite, fb.ratingBudget, fb.systemReply] as string[]).map(h => (
                <th key={h} title={h} style={{ padding: '5px 4px', background: '#e8eeff', color: '#003399', fontWeight: 'bold', borderBottom: '1px solid #b0b8d8', whiteSpace: 'nowrap', textAlign: 'center', fontSize: 11 }}>{h}</th>
              ))}
              <th style={{ padding: '5px 4px', background: '#e8eeff', borderBottom: '1px solid #b0b8d8', width: 28 }}></th>
            </tr>
          </thead>
          <tbody>
            {loadedMessages.map((m, i) => {
              const isExp = expandedMsgId === m.id
              return (
                <React.Fragment key={m.id}>
                  <tr onClick={() => { setExpandedMsgId(m.id); handleSelectMsg(m.id) }}
                    style={{ cursor: 'pointer', background: isExp ? '#c8d8ff' : i % 2 === 0 ? '#fff' : '#f4f6ff', outline: isExp ? '2px solid #003399' : '1px solid #c0c8e0' }}>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: '#555' }}>{i + 1}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>{m.sent_date || '—'}</td>
                    <td style={{ padding: '5px 6px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title || '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{m.rating_site ?? '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{m.rating_budget ?? '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: m.reply_text ? '#006600' : '#cc6600', fontWeight: 'bold' }}>{m.reply_text ? '✓' : '○'}</td>
                    <td style={{ padding: '3px 4px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <button onClick={async () => {
                        await fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id }) }).catch(() => {})
                        setLoadedMessages(prev => prev.filter(msg => msg.id !== m.id))
                        if (expandedMsgId === m.id) setExpandedMsgId(null)
                      }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>מחיקה</button>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })}
            {loadedMessages.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: 12 }}>{lang.system.noMessages}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <button onClick={() => { setExpandedMsgId(null); setSelectedMsgId(null); setUserDate(''); setUserTitle(''); setUserFrom(''); setUserText(''); setReplyDate(''); setReplyText(''); setHasReply(false); setRatingSite(null); setRatingBudget(null); setValidationErrors({}); setRefNum('') }}
            style={{ fontSize: '13px', padding: '4px 14px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ הודעה חדשה</button>
        </div>
      <div style={{ width: '720px', minHeight: '1123px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column' }}>

        {/* כרטיסיה */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '6px', color: '#003399' }}>
            <div style={{ fontSize: '24px', fontWeight: 'normal' }}>{expandedMsgId !== null ? loadedMessages.findIndex(m => m.id === expandedMsgId) + 1 : ''}</div>
            <div style={{ fontSize: '13px', color: '#888', direction: 'rtl' }}>{expandedMsgId !== null ? 'הודעה מס.‏' : ''}</div>
          </div>
          <div style={{
            background: '#003399',
            borderRadius: '12px 12px 0 0',
            padding: '4px 6px 6px',
            display: 'inline-flex', alignItems: 'center', gap: '32px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 16px rgba(0,0,80,0.2)',
          }}>
            <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontSize: '46px', fontWeight: 'bold', fontStyle: 'italic', color: '#FFD700' }}>KeyClick</span>
            <span style={{ fontFamily: handFont(lang.code), fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>{fb.customerRelations}</span>
          </div>
          {user ? (
            <div style={{ flex: 1, textAlign: 'right', paddingBottom: '6px', fontSize: '16px', fontWeight: 'normal', color: '#003399', lineHeight: '1.5' }}>
              <div>{[user.name, user.last_name].filter(Boolean).join(' ')}</div>
              <div style={{ fontSize: '10px' }}>{(() => { if (!user.last_ip) return ''; const parts = user.last_ip.split('.'); const hex = parts.length === 4 ? parts.map(n => parseInt(n).toString(16).padStart(2,'0').toUpperCase()).join('') : ''; return `IP: ${user.last_ip}${hex ? ` (${hex})` : ''}` })()}</div>
            </div>
          ) : <div style={{ flex: 1 }} />}
        </div>


        {/* System Message */}
        <div style={{ position: 'relative', marginTop: '28px', direction: dir }}>
          <span style={{ position: 'absolute', top: '-10px', ...side16, background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemMessage}</span>
          <div style={{ border: '2px solid #003399', borderRadius: '6px', height: '135px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '13px', color: '#222', flex: 1, whiteSpace: 'pre-wrap' }}>{systemMessage}</div>
            <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
              {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ marginTop: '28px', direction: dir, fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#222', marginBottom: '12px' }}>{fb.rating}</div>
          {([[fb.ratingWebsite, selectedMsg ? selectedMsg.rating_site : ratingSite, setRatingSite], [fb.ratingBudget, selectedMsg ? selectedMsg.rating_budget : ratingBudget, setRatingBudget]] as [string, number|null, (n:number)=>void][]).map(([label, val, setVal]) => (
            <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '10px', border: '1.5px solid #003399', borderRadius: '6px', padding: '6px 12px' }}>
              <span style={{ minWidth: '140px', fontSize: '18px', color: '#003399', fontFamily: handFont(lang.code), fontWeight: 'bold' }}>{label}</span>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} onClick={selectedMsg ? undefined : () => setVal(n)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: selectedMsg ? 'default' : 'pointer', margin: '0 2px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #003399', background: val === n ? '#003399' : '#fff', boxShadow: val === n ? '0 0 0 2px #6699ff' : 'none', transition: 'all 0.1s' }} />
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#003399' }}>{n}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* User Message + System Reply */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '28px', direction: dir, flex: 1 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <span style={{ position: 'absolute', top: '-10px', ...side12, background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.userMessage}</span>
            <div style={{ flex: 1, border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto' }}>
              {selectedMsg ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ position: 'relative', height: '26px', fontSize: '13px', color: '#222', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', right: 0 }}>{fb.date}{' '}{selectedMsg.sent_date || '______'}</span>
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fb.title}{' '}{selectedMsg.title || '______'}</span>
                    <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{'סימוכין '}{buildMsgRef(selectedMsg) || '______'}</span>
                  </div>
                  <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', margin: '8px 0', flex: 1 }}>{getBodyText(selectedMsg) || '______'}</div>
                  <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #eee', paddingTop: '6px' }}>{fb.from}{' '}{selectedMsg.user_name || '______'}</div>
                </div>
              ) : (
                <>
                  <div style={{ position: 'relative', height: '26px', fontSize: '13px', color: '#222', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', right: 0, display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                      <span style={{ whiteSpace: 'nowrap' }}>{fb.date}</span>
                      <input type="date" value={userDate} onChange={e => { setUserDate(e.target.value); if (validationErrors.date) setValidationErrors(prev => ({...prev, date: false})) }} style={{ border: 'none', borderBottom: validationErrors.date ? '2px solid red' : '1px solid #aaa', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '100px', direction: 'ltr' }} />
                    </span>
                    {refNum && <span style={{ position: 'absolute', right: '175px', transform: 'translateX(50%)', color: '#555' }}>{'מס.'}{loadedMessages.length}</span>}
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                      <span>{fb.title}</span>
                      <input value={userTitle} onChange={e => { setUserTitle(e.target.value); if (validationErrors.title) setValidationErrors(prev => ({...prev, title: false})) }} style={{ border: 'none', borderBottom: validationErrors.title ? '2px solid red' : '1px solid #aaa', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '150px', direction: dir }} />
                    </span>
                    {refNum && <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{'סימוכין '}{refNum}</span>}
                  </div>
                  <textarea value={userText} onChange={e => setUserText(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', direction: dir, margin: '4px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '13px', color: '#222', flexShrink: 0, borderTop: '1px solid #eee', paddingTop: '6px' }}>
                    <span style={{ whiteSpace: 'nowrap' }}>{fb.from}</span>
                    <input value={userFrom} onChange={e => { setUserFrom(e.target.value); if (validationErrors.from) setValidationErrors(prev => ({...prev, from: false})) }} style={{ border: 'none', borderBottom: validationErrors.from ? '2px solid red' : '1px solid #aaa', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '180px', direction: dir }} />
                  </div>
                </>
              )}
            </div>
            {!selectedMsg && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              {(() => { const canSend = !sending && !!userDate.trim() && !!userTitle.trim() && !!userFrom.trim() && !!userText.trim(); return (
                <button onClick={handleSend} disabled={!canSend}
                  style={{ fontSize: '13px', padding: '5px 18px', background: sendDone ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: '5px', cursor: canSend ? 'pointer' : 'default', fontWeight: 'bold', transition: 'background 0.3s', opacity: canSend ? 1 : 0.5 }}>
                  {sendDone ? '✓ ' + lang.system.sent : lang.system.send}
                </button>
              )})()}
            </div>
            )}
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemReply}</span>
            <div style={{ flex: 1, border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13px', color: '#222', flexShrink: 0, marginBottom: '4px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                  <span>{fb.date}</span>
                  <input type="date" value={replyDate} readOnly={!isAdmin} onChange={isAdmin ? e => setReplyDate(e.target.value) : undefined} className="no-icon" style={{ border: 'none', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '110px', direction: 'ltr', cursor: isAdmin ? 'text' : 'default' }} />
                </div>
                {isAdmin && loadedMessages.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ whiteSpace: 'nowrap' }}>מענה לסימוכין</span>
                    <select value={selectedMsgId ?? ''} onChange={e => handleSelectMsg(Number(e.target.value))}
                      style={{ border: 'none', outline: 'none', fontSize: '11px', color: '#003399', background: 'transparent', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                      {loadedMessages.map(m => <option key={m.id} value={m.id}>{buildMsgRef(m)}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <textarea value={replyText} readOnly={!isAdmin} onChange={isAdmin ? e => setReplyText(e.target.value) : undefined} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: dir, background: !isAdmin ? '#f0f4ff' : 'transparent', cursor: !isAdmin ? 'default' : 'text', margin: '4px 0' }} />
              <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #eee', paddingTop: '6px', direction: dir, flexShrink: 0 }}>
                {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

function MessagesPage({ user, lang, onDbg }: { user: UserRecord | null; lang: typeof languages[0]; onDbg: (func: string, msg: string) => void }) {
  const isAdmin = user?.M_Finance_license_type === LICENSE_TYPES.System_Owner
  const [msgs, setMsgs] = useState<FeedbackMessage[]>([])
  const [expandedUids, setExpandedUids] = useState<Set<number>>(new Set())
  const [selectedMsg, setSelectedMsg] = useState<FeedbackMessage | null>(null)
  const [adminReply, setAdminReply] = useState('')
  const [adminReplyDate, setAdminReplyDate] = useState('')
  const [replySaved, setReplySaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const isRTL = lang.code === 'he' || lang.code === 'ar'
  const dir = isRTL ? 'rtl' as const : 'ltr' as const

  const userGroups = React.useMemo(() => {
    const map = new Map<number, FeedbackMessage[]>()
    msgs.forEach(m => {
      const k = m.user_id ?? 0
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(m)
    })
    return Array.from(map.entries()).map(([uid, ms]) => ({
      uid,
      msgs: ms,
      name: ms[0]?.user_name ?? '—',
      lastMsg: ms[ms.length - 1],
      hasUnread: ms.some(m => !m.is_read),
    }))
  }, [msgs])

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const url = isAdmin ? '/api/feedback' : `/api/feedback?userId=${user.id}`
    onDbg('MessagesPage.load', `fetch ${url}`)
    fetch(url).then(r => r.json()).then(d => {
      const loaded = d.messages ?? []
      setMsgs(loaded)
      setLoading(false)
      onDbg('MessagesPage.load', `count=${loaded.length} ids=${loaded.map((m: FeedbackMessage) => m.id).join(',')}`)
    }).catch(e => { setLoading(false); onDbg('MessagesPage.load', `error: ${String(e)}`) })
  }, [user?.id])

  function handleSelectMsg(msg: FeedbackMessage) {
    setSelectedMsg(msg)
    setAdminReply(msg.reply_text ?? '')
    setAdminReplyDate(msg.reply_date || new Date().toISOString().slice(0, 10))
    onDbg('MessagesPage.selectMsg', `id=${msg.id} hasReply=${!!msg.reply_text}`)
    if (!msg.is_read && isAdmin) {
      fetch('/api/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id, isRead: true }) }).catch(() => {})
      setMsgs(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
    }
  }

  async function handleSendReply() {
    if (!selectedMsg) return
    onDbg('MessagesPage.sendReply', `PATCH id=${selectedMsg.id} replyLen=${adminReply.length} replyDate=${adminReplyDate}`)
    let patchOk = false
    try {
      const res = await fetch('/api/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedMsg.id, replyText: adminReply, replyDate: adminReplyDate, isRead: true }) })
      const data = await res.json()
      patchOk = data.ok === true
      onDbg('MessagesPage.sendReply', `PATCH response ok=${patchOk} status=${res.status} error=${data.error ?? 'none'}`)
    } catch (e) { onDbg('MessagesPage.sendReply', `PATCH error: ${String(e)}`) }
    setMsgs(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, reply_text: adminReply, reply_date: adminReplyDate } : m))
    setSelectedMsg(prev => prev ? { ...prev, reply_text: adminReply, reply_date: adminReplyDate } : null)
    onDbg('MessagesPage.sendReply', `state מקומי עודכן id=${selectedMsg.id}`)
    setReplySaved(true)
    setTimeout(() => setReplySaved(false), 2500)
  }

  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ color: '#555', fontSize: 16 }}>{lang.profile.loginRequired}</div></div>
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ color: '#555' }}>{lang.system.loading}</div></div>
  if (msgs.length === 0) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ color: '#888', fontSize: 15 }}>{lang.system.noMessages}</div></div>

  const thS: React.CSSProperties = { padding: '6px 8px', background: '#003399', color: '#FFD700', fontWeight: 'bold', fontSize: 11, whiteSpace: 'nowrap', borderInlineEnd: '1px solid #1144aa', textAlign: 'center' }
  const tdS: React.CSSProperties = { padding: '5px 8px', fontSize: 12, borderBottom: '1px solid #e0e4f0', whiteSpace: 'nowrap', textAlign: 'center' }
  const fb = lang.feedback

  const parseMsgBody = (msg: FeedbackMessage) => {
    const body = msg.body ?? ''
    const cut = (text: string, sep: string): [string, string] => {
      const i = text.indexOf(sep)
      return i === -1 ? [text, ''] : [text.slice(0, i), text.slice(i + sep.length)]
    }
    const [withoutHistory] = cut(body, '\n\n══════════')
    const [withoutReply] = cut(withoutHistory, '\n\n── תשובת המערכת ──\n')
    const [withoutSysMsg, afterSysMsg] = cut(withoutReply, '\n\n── הודעת המערכת ──\n')
    const lines = withoutSysMsg.split('\n')
    const refNum = (lines[0] ?? '').replace(/^סימוכין:\s*/, '')
    const userText = lines.slice(4).join('\n').trim()
    const sysMsgText = afterSysMsg ? afterSysMsg.split('\n\n')[0] : ''
    return { refNum, userText, sysMsgText }
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f0f2f8', padding: '16px', boxSizing: 'border-box', direction: dir }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        {/* LEFT — טבלאות לפי משתמש */}
        <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {userGroups.map(group => {
            const isExpanded = expandedUids.has(group.uid)
            const toggleExpand = () => setExpandedUids(prev => { const s = new Set(prev); isExpanded ? s.delete(group.uid) : s.add(group.uid); return s })
            return (
              <div key={group.uid} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '2px solid #003399', boxShadow: '0 1px 4px rgba(0,0,80,0.08)' }}>
                <div onClick={toggleExpand} style={{ background: '#003399', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{group.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {group.hasUnread && <span style={{ background: '#cc0000', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 'bold' }}>חדש</span>}
                    <span style={{ color: '#FFD700', fontSize: 11 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thS}>✓</th>
                      <th style={thS}>תאריך</th>
                      <th style={thS}>#</th>
                      <th style={{ ...thS, width: '100%', textAlign: 'start' }}>כותרת</th>
                      <th style={thS}>אתר</th>
                      <th style={thS}>תקציב</th>
                      <th style={{ ...thS, borderInlineEnd: 'none' }}>תשובה</th>
                      {isAdmin && <th style={{ ...thS, borderInlineEnd: 'none' }}></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(isExpanded ? group.msgs : [group.lastMsg]).map((msg, mi) => {
                      const isSelected = selectedMsg?.id === msg.id
                      const rowBg = isSelected ? '#c8d8ff' : mi % 2 === 0 ? '#fff' : '#f4f6ff'
                      return (
                        <tr key={msg.id} onClick={() => handleSelectMsg(msg)} style={{ cursor: 'pointer', background: rowBg, outline: isSelected ? '2px solid #003399' : 'none' }}>
                          <td style={{ ...tdS, color: msg.is_read ? '#006600' : '#cc0000', fontWeight: 'bold' }}>{msg.is_read ? '✓' : '○'}</td>
                          <td style={tdS}>{msg.sent_date || msg.created_at?.slice(0, 10) || '—'}</td>
                          <td style={tdS}>{isExpanded ? mi + 1 : group.msgs.length}</td>
                          <td style={{ ...tdS, textAlign: 'start', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.title || '—'}</td>
                          <td style={{ ...tdS, color: '#003399', fontWeight: 'bold' }}>{msg.rating_site ?? '—'}</td>
                          <td style={{ ...tdS, color: '#003399', fontWeight: 'bold' }}>{msg.rating_budget ?? '—'}</td>
                          <td style={{ ...tdS, color: msg.reply_text ? '#006600' : '#cc6600', fontWeight: 'bold' }}>{msg.reply_text ? '✓' : '○'}</td>
                          {isAdmin && (
                            <td style={tdS} onClick={e => e.stopPropagation()}>
                              <button onClick={() => {
                                fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id }) })
                                  .then(() => { setMsgs(prev => prev.filter(m => m.id !== msg.id)); if (selectedMsg?.id === msg.id) setSelectedMsg(null) })
                                  .catch(() => {})
                              }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>מחיקה</button>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>

        {/* RIGHT — טופס אחד */}
        <div style={{ flex: 1, position: 'sticky', top: 0 }}>
          {!selectedMsg ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#888', fontSize: 15 }}>בחר הודעה לצפייה</div>
          ) : (() => {
            const msg = selectedMsg
            const { refNum, userText, sysMsgText } = parseMsgBody(msg)
            const msgIdx = userGroups.find(g => g.msgs.some(m => m.id === msg.id))?.msgs.findIndex(m => m.id === msg.id) ?? 0
            return (
              <div style={{ width: '720px', minHeight: '1123px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, textAlign: 'right', paddingBottom: '6px', fontSize: '16px', fontWeight: 'normal', color: '#003399', lineHeight: '1.5' }}>
                    <div>{msg.user_name || '—'}</div>
                    <div style={{ fontSize: '10px' }}>{(() => { if (!msg.sender_ip) return ''; const parts = msg.sender_ip.split('.'); const hex = parts.length === 4 ? parts.map(n => parseInt(n).toString(16).padStart(2,'0').toUpperCase()).join('') : ''; return `IP: ${msg.sender_ip}${hex ? ` (${hex})` : ''}` })()}</div>
                  </div>
                  <div style={{ background: '#003399', borderRadius: '12px 12px 0 0', padding: '4px 6px 6px', display: 'inline-flex', alignItems: 'center', gap: '32px', border: '2px solid #FFD700', boxShadow: '0 4px 16px rgba(0,0,80,0.2)' }}>
                    <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontSize: '46px', fontWeight: 'bold', fontStyle: 'italic', color: '#FFD700' }}>KeyClick</span>
                    <span style={{ fontFamily: handFont(lang.code), fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>{fb.customerRelations}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '6px', color: '#003399' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'normal' }}>{msgIdx + 1}</div>
                    <div style={{ fontSize: '13px', color: '#888', direction: 'rtl' }}>{'הודעה מס.‏'}</div>
                  </div>
                </div>

                {sysMsgText && (
                  <div style={{ position: 'relative', marginTop: '28px' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemMessage}</span>
                    <div style={{ border: '2px solid #003399', borderRadius: '6px', height: '135px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '13px', color: '#222', flex: 1, whiteSpace: 'pre-wrap' }}>{sysMsgText}</div>
                      <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                        {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ratings */}
                <div style={{ marginTop: '28px', fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#222', marginBottom: '12px' }}>{fb.rating}</div>
                  {([[fb.ratingWebsite, msg.rating_site], [fb.ratingBudget, msg.rating_budget]] as [string, number | null][]).map(([label, val]) => (
                    <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '10px', border: '1.5px solid #003399', borderRadius: '6px', padding: '6px 12px' }}>
                      <span style={{ minWidth: '140px', fontSize: '18px', color: '#003399', fontFamily: handFont(lang.code), fontWeight: 'bold' }}>{label}</span>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', margin: '0 2px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #003399', background: val === n ? '#003399' : '#fff', boxShadow: val === n ? '0 0 0 2px #6699ff' : 'none' }} />
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#003399' }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* User message + System reply */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '28px', flex: 1 }}>

                  {/* User message */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.userMessage}</span>
                    <div style={{ border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff' }}>
                      <div style={{ position: 'relative', height: '26px', fontSize: '13px', color: '#222' }}>
                        <span style={{ position: 'absolute', right: 0 }}>{fb.date}{' '}{msg.sent_date || '______'}</span>
                        <span style={{ position: 'absolute', right: '175px', transform: 'translateX(50%)', color: '#555' }}>{'מס.'}{msgIdx + 1}</span>
                        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fb.title}{' '}{msg.title || '______'}</span>
                        <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{'סימוכין '}{refNum || '______'}</span>
                      </div>
                      <div style={{ minHeight: '80px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', margin: '8px 0' }}>{userText}</div>
                      <div style={{ fontSize: '13px', color: '#222' }}>{fb.from}{' '}{msg.user_name || '______'}</div>
                    </div>
                  </div>

                  {/* System reply */}
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemReply}</span>
                    <div style={{ border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '13px', color: '#222', borderBottom: '1px solid #ddd', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {fb.date}
                          {isAdmin
                            ? <input type="date" value={adminReplyDate} onChange={e => setAdminReplyDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #333', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '130px', direction: 'ltr' }} />
                            : <span style={{ marginInlineStart: 6 }}>{msg.reply_date || '______'}</span>
                          }
                        </div>
                        <span style={{ fontSize: '11px', color: '#888', direction: 'ltr' }}>{'מענה לסימוכין'}{' '}{refNum}</span>
                      </div>
                      {isAdmin
                        ? <textarea value={adminReply} onChange={e => setAdminReply(e.target.value)} style={{ minHeight: '80px', border: 'none', outline: 'none', resize: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: 'rtl', background: 'transparent' }} />
                        : <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', minHeight: '80px' }}>{msg.reply_text || ''}</div>
                      }
                      <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                        {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
                        <button onClick={handleSendReply} disabled={!adminReply.trim() || !adminReplyDate.trim()} style={{ fontSize: 13, padding: '5px 18px', background: replySaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', opacity: adminReply.trim() && adminReplyDate.trim() ? 1 : 0.5 }}>
                          {replySaved ? '✓ ' + lang.system.replySent : lang.system.send + ' תשובה'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )
          })()}
        </div>

      </div>
    </div>
  )
}

type UpdateRecord = { id: number; product: string; version: string; release_date: string; release_time: string | null; description: string }

const PRODUCT_DISPLAY: Record<string, string> = {
  'KeyClick Site': 'אתר KeyClick',
  'M Finance':     'ניהול תקציב בית M Finance',
}

function formatUpdateDate(date: string, time: string | null) {
  if (!date) return '—'
  const [y, m, d] = date.split('-')
  const dateStr = `${d}/${m}/${y}`
  return time ? `${time}  ${dateStr}` : dateStr
}

function UpdatesPage({ lang }: { lang: typeof languages[0] }) {
  const [updates, setUpdates] = useState<UpdateRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/updates').then(r => r.json()).then(d => { setUpdates(d.updates ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const thS: React.CSSProperties = {
    padding: '12px 20px', fontWeight: 700, fontSize: 17, color: '#FFD700', fontStyle: 'italic',
    whiteSpace: 'nowrap', textAlign: 'center',
    background: '#003399', border: '2px solid #003399',
  }
  const tdS: React.CSSProperties = {
    padding: '11px 20px', fontSize: 14, color: '#003399', fontWeight: 700,
    border: '2px solid #003399', verticalAlign: 'middle', textAlign: 'center',
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f0f2f8', padding: '32px 28px', boxSizing: 'border-box', direction: 'rtl' }}>
      <div style={{ display: 'inline-block', minWidth: 'min-content' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#003399', marginBottom: 18 }}>{lang.menu[1]}</div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>{lang.system.loading}</div>
        ) : updates.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>{lang.system.noMessages}</div>
        ) : (
          <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,80,0.10)', display: 'inline-block', border: '2px solid #003399', background: '#fff' }}>
          <table style={{ borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thS}>תאריך ושעה</th>
                <th style={thS}>מוצר</th>
                <th style={thS}>גרסה</th>
                <th style={thS}>כותרת</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id}>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontSize: 13 }}>{formatUpdateDate(u.release_date, u.release_time)}</td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontFamily: handFont(lang.code), fontSize: 16 }}>{PRODUCT_DISPLAY[u.product] ?? u.product}</td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontSize: 13 }}>{(u.version ?? '').replace(/^ver\s*/i, '')}</td>
                  <td style={{ ...tdS, minWidth: 220 }}>{u.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}

type ReminderRecord = { id: number; user_id: number; title: string; date: string; time: string | null; type: string }

function RemindersPage({ user, lang }: { user: UserRecord | null; lang: typeof languages[0] }) {
  const [reminders, setReminders] = useState<ReminderRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [title, setTitle]         = useState('')
  const [date, setDate]           = useState('')
  const [time, setTime]           = useState('')
  const [saving, setSaving]       = useState(false)

  const fetchReminders = () => {
    if (!user) return
    fetch(`/api/reminders?user_id=${user.id}`).then(r => r.json()).then(d => { setReminders(d.reminders ?? []); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchReminders() }, [user])

  const handleAdd = async () => {
    if (!user || !title.trim() || !date) return
    setSaving(true)
    await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, title: title.trim(), date, time: time || null, type: 'manual' }) })
    setTitle(''); setDate(''); setTime('')
    setSaving(false)
    fetchReminders()
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' })
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const formatDate = (d: string) => { const [y,m,day] = d.split('-'); return `${day}/${m}/${y}` }

  const inputS: React.CSSProperties = { border: '1px solid #99aadd', borderRadius: 5, padding: '7px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#003399', background: '#f7f9ff' }
  const thS: React.CSSProperties = { padding: '10px 16px', fontWeight: 700, fontSize: 15, color: '#FFD700', fontStyle: 'italic', background: '#003399', border: '2px solid #003399', textAlign: 'center', whiteSpace: 'nowrap' }
  const tdS: React.CSSProperties = { padding: '10px 16px', fontSize: 14, color: '#003399', fontWeight: 700, border: '2px solid #003399', textAlign: 'center', verticalAlign: 'middle' }

  if (!user) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 15 }}>
      נדרשת כניסה לצפייה בתזכורות
    </div>
  )

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f0f2f8', padding: '32px 28px', boxSizing: 'border-box', direction: 'rtl' }}>
      <div style={{ display: 'inline-block', minWidth: 'min-content' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#003399', marginBottom: 20 }}>{lang.menu[3]}</div>

        {/* Add form */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <input style={{ ...inputS, minWidth: 220 }} placeholder="כותרת תזכורת" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={{ ...inputS, direction: 'ltr' }} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input style={{ ...inputS, width: 90, direction: 'ltr' }} type="time" value={time} onChange={e => setTime(e.target.value)} placeholder="שעה" />
          <button onClick={handleAdd} disabled={!title.trim() || !date || saving}
            style={{ padding: '7px 22px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontStyle: 'italic', opacity: (!title.trim() || !date) ? 0.5 : 1 }}>
            + הוסף
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ color: '#888', padding: 20 }}>{lang.system.loading}</div>
        ) : reminders.length === 0 ? (
          <div style={{ color: '#888', padding: 20 }}>אין תזכורות</div>
        ) : (
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #003399', display: 'inline-block', background: '#fff' }}>
            <table style={{ borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr>
                  <th style={thS}>תאריך</th>
                  <th style={thS}>שעה</th>
                  <th style={{ ...thS, textAlign: 'right' }}>כותרת</th>
                  <th style={thS}></th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#f5f7fd' }}>
                    <td style={{ ...tdS, whiteSpace: 'nowrap' }}>{formatDate(r.date)}</td>
                    <td style={{ ...tdS, whiteSpace: 'nowrap', direction: 'ltr' }}>{r.time || '—'}</td>
                    <td style={{ ...tdS, textAlign: 'right', minWidth: 200 }}>{r.title}</td>
                    <td style={{ ...tdS, padding: '6px 10px' }}>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PageContent({ page, lang, langIdx, onChangeLang, clientIp, user, systemMessage, onSetSystemMessage, prText, setPrText, prDate, setPrDate, onClose, onLogin, onUserUpdate, onNavigate, onMsg, onDbg, onOpenDebug }: { page: string; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; clientIp: string; user: UserRecord | null; systemMessage: string; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void; onClose: () => void; onLogin: (user: UserRecord) => void; onUserUpdate: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void; onDbg: (func: string, msg: string) => void; onOpenDebug: () => void }) {
  if (page === '0')           return <FeedbackPage user={user} lang={lang} systemMessage={systemMessage} onDbg={onDbg} />
  if (page === '1')           return <UpdatesPage lang={lang} />
  if (page === '2')           return <MessagesPage user={user} lang={lang} onDbg={onDbg} />
  if (page === '3')           return <RemindersPage user={user} lang={lang} />
  if (page === 'mf-login')    return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='default'  onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'mf-register') return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='register' onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'system')      return <SystemPage user={user} lang={lang} langIdx={langIdx} onChangeLang={onChangeLang} onOpenDebug={onOpenDebug} onDbg={onDbg} onUserUpdate={onUserUpdate} onSetSystemMessage={onSetSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} />
  if (page === '5')           return <PersonalPage user={user} lang={lang} onNavigate={onNavigate} onUserUpdate={onUserUpdate} onDbg={onDbg} />
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', color: '#9b30c8' }}>{lang.menu[parseInt(page)]}</div>
        <div style={{ fontSize: '16px' }}>{lang.profile.comingSoon}</div>
      </div>
    </div>
  )
}

function handFont(code: string) {
  if (code === 'he') return '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif'
  if (code === 'ru') return 'var(--font-caveat),"Caveat",cursive'
  return 'var(--font-dancing),"Dancing Script",Georgia,serif'
}

function RegisterCard({ lang, clientIp = '', initialPhase = 'default', onClose, onLogin, onNavigate, onMsg, onDbg }: { lang: typeof languages[0]; clientIp?: string; initialPhase?: 'default' | 'register'; onClose: () => void; onLogin: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void; onDbg: (func: string, msg: string) => void }) {
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
    onDbg('handleRegister', 'called => setPhase register')
    setPhase('register')
  }

  async function handleUpdate() {
    onDbg('handleUpdate', `name="${savedName}" email="${savedEmail}" pass.len=${savedPass.length} clientIp="${clientIp}"`)
    setError('')
    if (savedEmail && !savedEmail.includes('@')) { onDbg('handleUpdate', `email="${savedEmail}" invalid => errEmail`); setError(c.errEmail); return }
    if (savedPass && savedPass.length < 6)       { onDbg('handleUpdate', `pass.len=${savedPass.length} < 6 => errPassLen`); setError(c.errPassLen); return }
    if (savedPass !== savedConf)                 { onDbg('handleUpdate', 'pass !== conf => errPassMatch'); setError(c.errPassMatch); return }
    onDbg('handleUpdate', `fetch POST /api/register email="${savedEmail}" clientIp="${clientIp}"`)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: savedName || null, email: savedEmail || null, password: savedPass || null, language: lang.name, clientIp }),
    })
    const data = await res.json()
    onDbg('handleUpdate', `res.status=${res.status} res.ok=${res.ok} updated=${data.updated}`)
    if (!res.ok) { onDbg('handleUpdate', `res.ok=false err="${data.error}"`); setError(data.error); return }
    setSavedPass('')
    setSavedConf('')
    setError('')
    onDbg('handleUpdate', `success status="${data.status}" => onMsg`)
    const body = data.status === 'exists'
      ? c.msgExists
      : data.status === 'updated'
      ? c.msgUpdated
      : c.msgRegistered
    onMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body })
  }

  async function handleLogin() {
    onDbg('handleLogin', `email="${savedEmail}" pass.len=${savedPass.length}`)
    setError('')
    if (!savedPass) { onDbg('handleLogin', 'pass empty => errPassLen'); setError(c.errPassLen); return }
    onDbg('handleLogin', `fetch POST /api/login email="${savedEmail}" clientIp="${clientIp}"`)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: savedEmail, password: savedPass, clientIp }),
    })
    const data = await res.json()
    onDbg('handleLogin', `res.status=${res.status} res.ok=${res.ok}`)
    if (!res.ok) { onDbg('handleLogin', `res.ok=false err="${data.error}"`); setError(data.error); return }
    onDbg('handleLogin', `success user.id=${data.user?.id} email="${data.user?.email}" last_ip="${data.user?.last_ip}" => onLogin => onClose`)
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
          <div style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', color: '#FFD700', fontSize: '22px', marginTop: '6px' }}>{c.title}</div>
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
            <div onClick={onClose} style={{ position: 'absolute', right: '12px', bottom: '12px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>{c.cancel}</div>
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
              <button onClick={handleUpdate} style={{ ...regBtn }}>{c.register}</button>
            </div>
            <div onClick={onClose} style={{ position: 'absolute', right: '12px', bottom: '12px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>{c.cancel}</div>
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

const FREE_PLANS  = [LICENSE_TYPES.System_Free_Run, LICENSE_TYPES.User_Trial, LICENSE_TYPES.User_VIP_Free, LICENSE_TYPES.System_Owner] as string[]
const PAID_PLANS  = [LICENSE_TYPES.User_Monthly, LICENSE_TYPES.User_Annual, LICENSE_TYPES.User_One_Time] as string[]

const CHANGE_PLAN_OPTIONS: { key: keyof typeof LICENSE_TYPES; paid: boolean; priceUSD: string; priceLocal: string; days: number | null }[] = [
  { key: 'User_Trial',    paid: false, priceUSD: '', priceLocal: '', days: 14 },
  { key: 'User_Monthly',  paid: true,  priceUSD: '', priceLocal: '',     days: 30  },
  { key: 'User_Annual',   paid: true,  priceUSD: '', priceLocal: '',     days: 365 },
  { key: 'User_One_Time', paid: true,  priceUSD: '', priceLocal: '',     days: 1   },
]

const PLAN_OPTIONS: { key: keyof typeof LICENSE_TYPES; paid: boolean }[] = [
  { key: 'System_Free_Run', paid: false },
  { key: 'User_Trial',      paid: false },
  { key: 'User_VIP_Free',   paid: false },
  { key: 'User_Monthly',    paid: true  },
  { key: 'User_Annual',     paid: true  },
  { key: 'User_One_Time',   paid: true  },
]

const CURRENCIES = [
  { code: 'ILS', symbol: '₪', name: 'ש"ח' },
  { code: 'USD', symbol: '$', name: 'דולר' },
  { code: 'GBP', symbol: '£', name: 'ליש"ט' },
  { code: 'EUR', symbol: '€', name: 'יורו' },
  { code: 'RUB', symbol: '₽', name: 'רובל' },
  { code: 'JPY', symbol: '¥', name: 'ין' },
  { code: 'SAR', symbol: '﷼', name: 'ריאל' },
  { code: 'CNY', symbol: '¥', name: 'יואן' },
  { code: 'INR', symbol: '₹', name: 'רופי' },
]
function getDefaultCurrency(langCode: string): string {
  if (langCode === 'he') return 'ILS'
  if (langCode === 'en') return 'GBP'
  return 'EUR'
}

function PersonalPage({ user, lang, onNavigate, onUserUpdate, onDbg }: { user: UserRecord | null; lang: typeof languages[0]; onNavigate: (page: string) => void; onUserUpdate: (user: UserRecord) => void; onDbg: (func: string, msg: string) => void }) {
  const [planView,    setPlanView]    = useState(false)
  const [selKey,      setSelKey]      = useState<keyof typeof LICENSE_TYPES | null>(null)
  const [updating,    setUpdating]    = useState(false)
  const [scheduleData,   setScheduleData]   = useState<Record<string, { price: string; months: string }>>({})
  const [exchangeRates,  setExchangeRates]  = useState<Record<string, number>>({})
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => user?.currency || getDefaultCurrency(lang.code))

  useEffect(() => {
    setSelectedCurrency(user?.currency || getDefaultCurrency(lang.code))
  }, [user?.currency, lang.code])

  useEffect(() => {
    onDbg('scheduleEffect', 'טוען לוח זמנים מ-API')
    fetch('/api/system/schedule').then(r => r.json()).then(d => {
      if (!d.data?.rows) { onDbg('scheduleEffect', 'אין rows בתגובה'); return }
      const PLAN_IDX: Record<string, number> = { User_Trial: 2, User_Monthly: 4, User_Annual: 5, User_One_Time: 6 }
      const map: Record<string, { price: string; months: string }> = {}
      Object.entries(PLAN_IDX).forEach(([planKey, idx]) => {
        const row = d.data.rows[idx]
        if (row) map[planKey] = { price: row.price ?? '', months: row.months ?? '' }
      })
      onDbg('scheduleEffect', `טעון — ${Object.keys(map).join(', ')}`)
      setScheduleData(map)
    }).catch(e => onDbg('scheduleEffect', `שגיאה: ${String(e)}`))
  }, [])

  useEffect(() => {
    if (!planView) return
    onDbg('exchangeEffect', 'טוען שערי חליפין')
    fetch('/api/exchange-rates').then(r => r.json()).then(d => {
      if (d.rates) { setExchangeRates(d.rates); onDbg('exchangeEffect', `טעון — ${Object.keys(d.rates).join(', ')}`) }
    }).catch(e => onDbg('exchangeEffect', `שגיאה: ${String(e)}`))
  }, [planView])

  const fmtDate = (d: Date) => d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })

  async function selectPlan(key: keyof typeof LICENSE_TYPES): Promise<boolean> {
    if (!user) return false
    const value = LICENSE_TYPES[key]
    const createdAt = user.created_at ? new Date(String(user.created_at)) : new Date()
    const planStart = createdAt.toISOString().slice(0, 10)
    const sched = scheduleData[key]
    const months = sched ? parseInt(sched.months) || 0 : 0
    let planEnd: string | null = null
    if (months > 0) {
      const endDate = new Date(createdAt)
      endDate.setMonth(endDate.getMonth() + months)
      planEnd = endDate.toISOString().slice(0, 10)
    }
    onDbg('selectPlan', `key=${key} value="${value}" userId=${user.id} months=${months} planStart=${planStart} planEnd=${planEnd ?? 'null'}`)
    setUpdating(true)
    try {
      const res  = await fetch('/api/update-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, licenseType: value, planStart, planEnd }) })
      const data = await res.json()
      onDbg('selectPlan', `תגובה status=${res.status} ok=${res.ok} license=${data.user?.license_type ?? 'none'}`)
      if (res.ok && data.user) { onDbg('selectPlan', 'onUserUpdate נקרא'); onUserUpdate(data.user); setUpdating(false); return true }
      onDbg('selectPlan', `כשל — data=${JSON.stringify(data)}`)
    } catch (err) { onDbg('selectPlan', `שגיאה: ${String(err)}`) }
    setUpdating(false)
    return false
  }

  async function handleCurrencyChange(code: string) {
    setSelectedCurrency(code)
    if (!user) return
    try {
      await fetch('/api/update-currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currency: code }),
      })
      onUserUpdate({ ...user, currency: code })
    } catch { /* */ }
  }

  const isOwner        = user?.M_Finance_license_type === LICENSE_TYPES.System_Owner
  const isFreeRun      = user?.M_Finance_license_type === LICENSE_TYPES.System_Free_Run
  const isFreePlan     = FREE_PLANS.includes(user?.M_Finance_license_type ?? '')
  const isSystemForced = !!user?.system_force && user.system_force !== 'User' && user.system_force !== 'System_Owner'

  useEffect(() => {
    if (!user) return
    onDbg('PersonalPage', `user updated — license=${user.M_Finance_license_type} system_force=${user.system_force ?? 'null'} isOwner=${isOwner} isFreeRun=${isFreeRun} isSystemForced=${isSystemForced} → כפתור ${isFreeRun || isSystemForced ? 'חסום' : 'פתוח'}`)
  }, [user?.M_Finance_license_type, user?.system_force])

  const p = lang.profile

  if (!user) return <div style={{ width: '100%', height: '100%', background: '#f2eef2' }} />

  const personalFields = [
    { label: p.fullName,  value: [user.name, user.last_name].filter(Boolean).join(' ') || '—' },
    { label: p.email,     value: user.email    || '—' },
    { label: p.ip,        value: (() => { if (!user.last_ip) return '—'; const hex = user.last_ip.split('.').length === 4 ? '(' + user.last_ip.split('.').map(n => parseInt(n).toString(16).padStart(2,'0').toUpperCase()).join('') + ')' : ''; return hex ? `${user.last_ip} ${hex}` : user.last_ip })() },
    { label: p.language,  value: languages.find(l => l.code === user.language)?.name ?? user.language ?? '—' },
  ]

  const outerWrap: React.CSSProperties = { width: '100%', height: '100%', background: '#f2eef2', overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '28px 20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }
  const cardBox:  React.CSSProperties  = { width: '100%', maxWidth: '780px', background: '#fff', border: '2px solid #003399', borderRadius: '12px', padding: '32px 36px', boxShadow: '0 4px 16px rgba(0,0,60,0.08)' }
  const thStyle:  React.CSSProperties  = { padding: '8px 12px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }
  const tdStyle:  React.CSSProperties  = { padding: '9px 12px', border: '1px solid #ccd' }

  if (planView) {
    const createdAt = user.created_at ? new Date(String(user.created_at)) : new Date()
    return (
      <div style={outerWrap}>
        <div style={cardBox}>

          <div style={{ fontFamily: handFont(lang.code), fontSize: '28px', color: '#003399', marginBottom: '2px' }}>
            {lang.card.title}
          </div>
          <div style={{ fontSize: '18px', color: '#003399', marginBottom: '4px' }}>
            M Finance
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#003399', marginBottom: '24px', borderBottom: '2px solid #e0e0f0', paddingBottom: '12px' }}>
            {p.changePlan}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', marginBottom: '22px' }}>
            <thead>
              <tr style={{ background: '#e8eaf6' }}>
                <th style={thStyle}>{p.planName}</th>
                <th style={{ ...thStyle, textAlign: 'center' }}><div>{p.price}</div><div style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>[$]</div></th>
                <th style={{ ...thStyle, textAlign: 'center' }}><div>{p.price}</div><select value={selectedCurrency} onChange={e => handleCurrencyChange(e.target.value)} style={{ fontSize: '11px', border: '1px solid #aab', borderRadius: '3px', padding: '1px 2px', marginTop: '2px', background: '#f0f2ff', cursor: 'pointer', color: '#003399', fontWeight: 'bold', outline: 'none' }}>{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {lang.currencyNames[c.code as keyof typeof lang.currencyNames]}</option>)}</select></th>
                <th style={{ ...thStyle, textAlign: 'center' }}>{p.planFrom}</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>{p.planTo}</th>
              </tr>
            </thead>
            <tbody>
              {CHANGE_PLAN_OPTIONS.map(({ key, paid }) => {
                const sched = scheduleData[key]
                const price = sched?.price || ''
                const currencyCode = selectedCurrency
                const rate = exchangeRates[currencyCode] ?? 1
                const priceNum = parseFloat(price)
                const priceLocal = price && !isNaN(priceNum) ? Math.round(priceNum * rate).toString() : ''
                const months = sched ? parseInt(sched.months) || 0 : 0
                const toDate = months > 0 ? fmtDate(new Date(createdAt.getFullYear(), createdAt.getMonth() + months, createdAt.getDate())) : '—'
                const displayName = lang.profile.planNames[key as keyof typeof lang.profile.planNames]
                const sel     = selKey === key
                const isTrial = key === 'User_Trial'
                void paid
                return (
                  <tr key={key} style={{ background: sel ? '#eef2ff' : '#fff' }}>
                    <td style={tdStyle}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="plan" checked={sel}
                          onChange={() => setSelKey(key)}
                          style={{ width: '16px', height: '16px', accentColor: '#003399', cursor: 'pointer' }} />
                        <span style={{ fontWeight: sel ? 'bold' : 'normal', color: sel ? '#003399' : '#1a1a1a' }}>{displayName}</span>
                      </label>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#555' }}>{isTrial ? p.free : price}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#555' }}>{isTrial ? p.free : priceLocal}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#555' }}>{sel ? fmtDate(createdAt) : ''}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#555' }}>{sel ? toDate : ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={async () => { onDbg('אישור תכנית', `selKey=${selKey ?? 'null'}`); if (selKey && await selectPlan(selKey)) { onDbg('אישור תכנית', 'הצליח — סוגר planView'); setPlanView(false) } }}
              disabled={!selKey || updating}
              style={{ background: '#003399', border: 'none', borderRadius: '7px', color: '#FFD700', fontSize: '13px', fontWeight: 'bold', padding: '7px 20px', cursor: selKey && !updating ? 'pointer' : 'default', opacity: selKey && !updating ? 1 : 0.5 }}>
              {updating ? '...' : lang.card.update}
            </button>
            <button
              onClick={() => setPlanView(false)}
              disabled={updating}
              style={{ background: '#f0f0f8', border: '1px solid #ccd', borderRadius: '7px', color: '#555', fontSize: '13px', padding: '7px 16px', cursor: 'pointer' }}>
              {p.back}
            </button>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div style={outerWrap}>
      <div style={cardBox}>

        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#003399', marginBottom: '24px', borderBottom: '2px solid #003399', paddingBottom: '10px' }}>
          {lang.menu[5]}
        </div>

        {/* Personal info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {personalFields.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ color: '#888', fontSize: '15px', minWidth: '130px' }}>{label}:</span>
              <span style={{ color: '#1a1a1a', fontSize: '18px' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div style={{ borderTop: '2px solid #e0e0f0', paddingTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead>
              <tr style={{ background: '#e8eaf6' }}>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd', width: '1%' }}></th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }}>{p.products}</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }}>{p.plan}</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }}>{p.planStart}</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }}>{p.planEnd}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 10px', border: '1px solid #ccd', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => {
                      onDbg('שינוי', `לחיצה — isFreeRun=${isFreeRun} isSystemForced=${isSystemForced}`)
                      if (isFreeRun || isSystemForced) { onDbg('שינוי', 'חסום — יציאה'); return }
                      const cur = CHANGE_PLAN_OPTIONS.find(o => LICENSE_TYPES[o.key] === user.M_Finance_license_type)?.key ?? null
                      onDbg('שינוי', `פותח planView selKey=${cur ?? 'null'}`)
                      setSelKey(cur)
                      setPlanView(true)
                    }}
                    style={{
                      background: (isFreeRun || isSystemForced) ? '#aab' : '#003399',
                      border: 'none', borderRadius: '5px',
                      color: (isFreeRun || isSystemForced) ? '#dde' : '#FFD700',
                      fontSize: '12px', fontWeight: 'bold', padding: '4px 10px',
                      cursor: (isFreeRun || isSystemForced) ? 'not-allowed' : 'pointer',
                      opacity: (isFreeRun || isSystemForced) ? 0.65 : 1,
                    }}>
                    {p.change}
                  </button>
                </td>
                <td style={{ padding: '8px 10px', border: '1px solid #ccd' }}>
                  <div style={{ fontWeight: 'bold' }}>{lang.card.title}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>M Finance</div>
                </td>
                <td style={{ padding: '8px 10px', border: '1px solid #ccd', color: '#003399', fontWeight: 'bold' }}>
                  {(() => { const k = Object.entries(LICENSE_TYPES).find(([,v]) => v === user.M_Finance_license_type)?.[0]; return k ? (p.planNames as Record<string,string>)[k] ?? user.M_Finance_license_type : user.M_Finance_license_type })()}
                </td>
                <td style={{ padding: '8px 10px', border: '1px solid #ccd', color: '#555' }}>{user.plan_start ? fmtDate(new Date(String(user.plan_start))) : '—'}</td>
                <td style={{ padding: '8px 10px', border: '1px solid #ccd', color: '#555' }}>{user.plan_end ? fmtDate(new Date(String(user.plan_end))) : isFreePlan ? p.unlimited : '—'}</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>
    </div>
  )
}
