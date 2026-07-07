'use client'
import React, { useState, useRef, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { LICENSE_TYPES } from '@/lib/license-types'

const languages = [
  { code: 'en', flag: 'בריטניה', name: 'English',  welcome: 'Welcome',
    menu: ['Feedback','Updates','Messages','Reminders','Banking Services','Personal Page'],
    card: { title: 'Home Budget Management', namePh: 'Name / Last Name', emailPh: 'Email / Email Address', passPh: 'Password', confirmPassPh: 'Confirm Password', register: 'Register', login: 'Login', update: 'Update', line1: 'During launch period', line2: 'Free', errName: 'Please enter your name', errEmail: 'Please enter a valid email', errPassLen: 'Password must be at least 6 characters', errPassMatch: 'Passwords do not match', errEmailExists: 'Email already registered', cancel: 'Cancel', install: 'Install', library: 'Guide Files', run: 'Run', videos: 'Videos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Already installed\nNo need to reinstall', msgDownloading: 'Downloading installation file', msgInstallComplete: 'Save and run the file\nto complete installation', msgDownloadError: 'Download error\nTry again', mFinance: 'M Finance', msgExists: 'User already registered\nwith these details', msgUpdated: 'Details updated successfully', msgRegistered: 'Registration complete', existingCustomer: 'Existing Customer', newCustomer: 'New Customer', notRecognized: 'Customer not found. Click to register', msgSelectPlan: 'Please select a plan in your personal page', infoServices: 'Information Services', guidesAndVideos: 'Guides & Videos', siteHeaderPrefix: 'The website of', theWebsite: 'The Website' },
    profile: { fullName: 'Full Name', email: 'Email', ip: 'IP', language: 'Language', country: 'Country', plan: 'Plan', planStart: 'Plan Start', planEnd: 'Plan End', unlimited: 'Unlimited', comingSoon: 'Coming Soon', choosePlan: 'Choose Plan', close: '✕ Close', loginRequired: 'Login required to view personal page', login: 'Login', products: 'Products', change: 'Change',
      price: 'Price', changePlan: 'Change Plan', planName: 'Name', planFrom: 'From', planTo: 'To', back: 'Back', currencyLocal: '$', free: 'Free',       planNames: { System_Free_Run: 'Free Run', User_Trial: 'Trial', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monthly', User_Annual: 'Annual', User_One_Time: 'Single Entry', System_Suspended_NonPayment: 'Suspended', User_Cancelled: 'Cancelled' } },
    feedback: { customerRelations: 'Customer Relations', systemMessage: 'System Message', respectfully: 'Respectfully,', rating: 'Rating', ratingWebsite: 'Website', ratingBudget: 'Home Budget Management', userMessage: 'User Message', date: 'Date:', title: 'Title:', from: 'From:', systemReply: 'System Reply' },
    system: { systemLabel: 'System', selectAction: 'Select action from right sidebar', users: 'Users', buildMessages: 'Build Messages', schedule: 'טבלאות ונתונים', pr: 'Public Relations', publishedDate: 'Published date:', reset: 'Reset', saved: 'Saved', records: 'records', scheduleSubject: 'Subject', schedulePriceUSD: 'Price\n[$]', schedulePeriod: 'Period\n[mo]', scheduleNotes: 'Notes', clear: 'Clear', pause: 'Pause', resume: 'Resume', active: '● Active', paused: 'Paused', lines: 'lines', filter: 'Filter', refresh: 'Refresh', loading: 'Loading...', loadingBuild: 'Loading build data...', error: 'Error', noBuildData: 'No build data. Run Release_KeyClick.bat', networkError: 'Network error', adminButton: 'System Use', generalGroup: 'General', colName: 'Name', colCurrency: 'Currency', colCreated: 'Created', colActive: 'Is Active', colAppInstalled: 'App Installed', colLicenceType: 'Licence Type', colSystemForce: 'System Force', distributionDay: 'Distribution Day X', messages: 'Messages', send: 'Send', sent: 'Sent!', reply: 'Reply', noMessages: 'No messages', replySent: 'Reply sent!', ref: 'Ref.', msgNo: 'No.', replyToRef: 'Reply to ref.', msgNumber: 'Message No.', new: 'New', delete: 'Delete', newMessage: '+ New Message', selectToView: 'Select a message to view', monitor: 'Monitor', systemData: 'System Data', resetTable: 'Reset Table', debug: 'Debug', db: 'DB', sensitivePoints: 'Sensitive Points', productVersionTable: 'Product Version Table in Updates Tab' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Pound', EUR: 'Euro', RUB: 'Ruble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupee' },
    updates: { colDate: 'Date & Time', colProduct: 'Product', colVersion: 'Version', colTitle: 'Title', productKeyClick: 'KeyClick Website', productMFinance: 'M Finance Home Budget' },
    reminders: { loginRequired: 'Login required to view reminders', titlePh: 'Reminder title', timePh: 'Time', add: '+ Add', noReminders: 'No reminders' },
    guides: { overview: 'Overview', userGuide: 'User Guide', financeOverviewTitle: 'What is M Finance', financeOverviewDesc: 'A short overview of home budget management — accounts, transactions, categories and forecasts, and who it is intended for.', financeGuideTitle: 'Step-by-step usage', financeGuideDesc: 'A written guide with screenshots: installation, connecting accounts, categorization and reports.', financeVideosTitle: 'Short tutorials', financeVideosDesc: 'Short video tutorials for every key feature in home budget management.', siteOverviewTitle: 'What the website offers', siteOverviewDesc: "A short tour of the KeyClick platform — products, services and customer relations.", siteGuideTitle: 'Registration and navigation', siteGuideDesc: 'How to register, log in and find every service on the website.', siteVideosTitle: 'Website demos', siteVideosDesc: "Short recorded demos of the website's main features." },
    banking: { autoDetectFailed: 'Auto-detect failed — choose manually', detectionError: 'Detection error', loadBanksError: 'Error loading banks', plaidTokenError: 'Plaid token error', bankConnected: 'Bank connected', connectionError: 'Connection error', linkOpened: 'A connection window opened for {name}. After approving, come back and click refresh.', linkCreateError: 'Error creating bank link', refreshing: 'Refreshing...', updated: 'Updated', fetchingData: 'Fetching data...', noAccountsConnected: 'No accounts connected', downloadedFiles: 'Downloaded {count} files', downloadError: 'Download error', connectBankTitle: 'Connect Bank', autoDetect: 'Auto Detect', orManually: 'or manually', unitedStates: 'United States', back: 'Back', selectInstitution: 'Select institution', noInstitutions: 'No institutions', refresh: 'Refresh', downloadFiles: 'Download Files' } },
  { code: 'ru', flag: 'רוסיה',   name: 'Русский',  welcome: 'Добро пожаловать',
    menu: ['Отзыв','Обновления','Сообщения','Напоминания','Банковские услуги','Личная страница'],
    card: { title: 'Управление домашним бюджетом', namePh: 'Имя / Фамилия', emailPh: 'Email / Адрес эл. почты', passPh: 'Пароль', confirmPassPh: 'Подтвердите пароль', register: 'Регистрация', login: 'Войти', update: 'Обновить', line1: 'В период запуска', line2: 'Бесплатно', errName: 'Пожалуйста, введите имя', errEmail: 'Введите корректный email', errPassLen: 'Пароль должен содержать не менее 6 символов', errPassMatch: 'Пароли не совпадают', errEmailExists: 'Email уже зарегистрирован', cancel: 'Отмена', install: 'Установить', library: 'Файлы руководства', run: 'Запуск', videos: 'Видео', guide: 'Руководство', ok: 'ОК', msgAlreadyInstalled: 'Уже установлено\nПереустановка не нужна', msgDownloading: 'Загрузка установщика', msgInstallComplete: 'Сохраните и запустите файл\nдля завершения установки', msgDownloadError: 'Ошибка загрузки\nПопробуйте снова', mFinance: 'M Finance', msgExists: 'Пользователь уже зарегистрирован\nс этими данными', msgUpdated: 'Данные обновлены успешно', msgRegistered: 'Регистрация завершена', existingCustomer: 'Существующий клиент', newCustomer: 'Новый клиент', notRecognized: 'Клиент не найден. Нажмите для регистрации', msgSelectPlan: 'Выберите тарифный план в личном кабинете', infoServices: 'Информационные услуги', guidesAndVideos: 'Руководства и видео', siteHeaderPrefix: 'Веб-сайт', theWebsite: 'Сайт' },
    profile: { fullName: 'Полное имя', email: 'Email', ip: 'IP', language: 'Язык', country: 'Страна', plan: 'Тариф', planStart: 'Начало тарифа', planEnd: 'Конец тарифа', unlimited: 'Без ограничений', comingSoon: 'Скоро', choosePlan: 'Выбрать тариф', close: '✕ Закрыть', loginRequired: 'Необходимо войти для просмотра', login: 'Войти', products: 'Продукты', change: 'Изменить',
      price: 'Цена', changePlan: 'Изменить тариф', planName: 'Название', planFrom: 'С', planTo: 'По', back: 'Назад', currencyLocal: '₽', free: 'Бесплатно',       planNames: { System_Free_Run: 'Тест', User_Trial: 'Пробный', User_VIP_Free: 'VIP', System_Owner: 'Система', User_Monthly: 'Ежемесячно', User_Annual: 'Ежегодно', User_One_Time: 'Разовый', System_Suspended_NonPayment: 'Отключён', User_Cancelled: 'Отменён' } },
    feedback: { customerRelations: 'Связи с клиентами', systemMessage: 'Системное сообщение', respectfully: 'С уважением,', rating: 'Оценка', ratingWebsite: 'Сайт', ratingBudget: 'Управление бюджетом', userMessage: 'Сообщение пользователя', date: 'Дата:', title: 'Тема:', from: 'От:', systemReply: 'Ответ системы' },
    system: { systemLabel: 'Система', selectAction: 'Выберите действие на правой панели', users: 'Пользователи', buildMessages: 'Журнал сборки', schedule: 'טבלאות ונתונים', pr: 'PR', publishedDate: 'Опубликовано:', reset: 'Сбросить', saved: 'Сохранено', records: 'записей', scheduleSubject: 'Тема', schedulePriceUSD: 'Цена\n[$]', schedulePeriod: 'Период\n[мес]', scheduleNotes: 'Заметки', clear: 'Очистить', pause: 'Пауза', resume: 'Продолжить', active: '● Активно', paused: 'На паузе', lines: 'строк', filter: 'Фильтр', refresh: 'Обновить', loading: 'Загрузка...', loadingBuild: 'Загрузка данных сборки...', error: 'Ошибка', noBuildData: 'Нет данных. Запустите Release_KeyClick.bat', networkError: 'Ошибка сети', adminButton: 'Системный вход', generalGroup: 'Общие', colName: 'Имя', colCurrency: 'Валюта', colCreated: 'Создан', colActive: 'Активен', colAppInstalled: 'Приложение', colLicenceType: 'Тип лицензии', colSystemForce: 'Системный режим', distributionDay: 'День X распространения', messages: 'Сообщения', send: 'Отправить', sent: 'Отправлено!', reply: 'Ответить', noMessages: 'Нет сообщений', replySent: 'Ответ отправлен!', ref: 'Реф.', msgNo: '№', replyToRef: 'Ответ на реф.', msgNumber: 'Сообщение №', new: 'Новое', delete: 'Удалить', newMessage: '+ Новое сообщение', selectToView: 'Выберите сообщение', monitor: 'Монитор', systemData: 'Данные системы', resetTable: 'Сброс таблицы', debug: 'Отладка', db: 'БД', sensitivePoints: 'Уязвимые точки', productVersionTable: 'Таблица версий продукта (вкладка обновлений)' },
    currencyNames: { ILS: 'Шекель', USD: 'Доллар', GBP: 'Фунт', EUR: 'Евро', RUB: 'Рубль', JPY: 'Иена', SAR: 'Риял', CNY: 'Юань', INR: 'Рупия' },
    updates: { colDate: 'Дата и время', colProduct: 'Продукт', colVersion: 'Версия', colTitle: 'Заголовок', productKeyClick: 'KeyClick Сайт', productMFinance: 'M Finance Бюджет' },
    reminders: { loginRequired: 'Войдите для просмотра напоминаний', titlePh: 'Название напоминания', timePh: 'Время', add: '+ Добавить', noReminders: 'Нет напоминаний' },
    guides: { overview: 'Общее описание', userGuide: 'Руководство пользователя', financeOverviewTitle: 'Что такое M Finance', financeOverviewDesc: 'Краткий обзор управления домашним бюджетом — счета, операции, категории и прогнозы, и для кого это подходит.', financeGuideTitle: 'Пошаговое использование', financeGuideDesc: 'Письменное руководство со скриншотами: установка, подключение счетов, категоризация и отчёты.', financeVideosTitle: 'Короткие уроки', financeVideosDesc: 'Короткие видеоуроки по каждой ключевой функции управления домашним бюджетом.', siteOverviewTitle: 'Что предлагает сайт', siteOverviewDesc: 'Краткий обзор платформы KeyClick — продукты, услуги и работа с клиентами.', siteGuideTitle: 'Регистрация и навигация', siteGuideDesc: 'Как зарегистрироваться, войти и найти любую услугу на сайте.', siteVideosTitle: 'Демонстрации сайта', siteVideosDesc: 'Короткие видеозаписи основных функций сайта.' },
    banking: { autoDetectFailed: 'Автоопределение не удалось — выберите вручную', detectionError: 'Ошибка определения', loadBanksError: 'Ошибка загрузки банков', plaidTokenError: 'Ошибка Plaid Token', bankConnected: 'Банк подключён', connectionError: 'Ошибка подключения', linkOpened: 'Открыто окно подключения к {name}. После подтверждения вернитесь и нажмите обновить.', linkCreateError: 'Ошибка создания ссылки на банк', refreshing: 'Обновление...', updated: 'Обновлено', fetchingData: 'Получение данных...', noAccountsConnected: 'Нет подключённых счетов', downloadedFiles: 'Загружено файлов: {count}', downloadError: 'Ошибка загрузки', connectBankTitle: 'Подключить банк', autoDetect: 'Автоопределение', orManually: 'или вручную', unitedStates: 'США', back: 'Назад', selectInstitution: 'Выберите банк', noInstitutions: 'Нет банков', refresh: 'Обновить', downloadFiles: 'Скачать файлы' } },
  { code: 'de', flag: 'גרמניה',  name: 'Deutsch',  welcome: 'Willkommen',
    menu: ['Feedback','Updates','Nachrichten','Erinnerungen','Bankdienstleistungen','Persönliche Seite'],
    card: { title: 'Haushaltsverwaltung', namePh: 'Name / Nachname', emailPh: 'E-Mail / E-Mail-Adresse', passPh: 'Passwort', confirmPassPh: 'Passwort bestätigen', register: 'Registrieren', login: 'Anmelden', update: 'Aktualisieren', line1: 'Während der Einführungsphase', line2: 'Kostenlos', errName: 'Bitte geben Sie Ihren Namen ein', errEmail: 'Bitte geben Sie eine gültige E-Mail ein', errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein', errPassMatch: 'Passwörter stimmen nicht überein', errEmailExists: 'E-Mail bereits registriert', cancel: 'Abbrechen', install: 'Installieren', library: 'Anleitungsdateien', run: 'Starten', videos: 'Videos', guide: 'Anleitung', ok: 'OK', msgAlreadyInstalled: 'Bereits installiert\nKeine Neuinstallation nötig', msgDownloading: 'Installationsdatei wird heruntergeladen', msgInstallComplete: 'Datei speichern und ausführen\num die Installation abzuschließen', msgDownloadError: 'Fehler beim Herunterladen\nNochmal versuchen', mFinance: 'M Finance', msgExists: 'Benutzer bereits registriert\nmit diesen Daten', msgUpdated: 'Daten erfolgreich aktualisiert', msgRegistered: 'Registrierung abgeschlossen', existingCustomer: 'Bestehender Kunde', newCustomer: 'Neuer Kunde', notRecognized: 'Kunde nicht gefunden. Klicken zum Registrieren', msgSelectPlan: 'Bitte wähle einen Plan auf deiner persönlichen Seite', infoServices: 'Informationsdienste', guidesAndVideos: 'Anleitungen & Videos', siteHeaderPrefix: 'Die Website von', theWebsite: 'Die Website' },
    profile: { fullName: 'Vollständiger Name', email: 'E-Mail', ip: 'IP', language: 'Sprache', country: 'Land', plan: 'Tarif', planStart: 'Tarif Beginn', planEnd: 'Tarif Ende', unlimited: 'Unbegrenzt', comingSoon: 'Demnächst', choosePlan: 'Tarif wählen', close: '✕ Schließen', loginRequired: 'Anmeldung erforderlich', login: 'Anmelden', products: 'Produkte', change: 'Ändern',
      price: 'Preis', changePlan: 'Tarif ändern', planName: 'Name', planFrom: 'Von', planTo: 'Bis', back: 'Zurück', currencyLocal: '€', free: 'Kostenlos',       planNames: { System_Free_Run: 'Testlauf', User_Trial: 'Testphase', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monatlich', User_Annual: 'Jährlich', User_One_Time: 'Einmalig', System_Suspended_NonPayment: 'Gesperrt', User_Cancelled: 'Storniert' } },
    feedback: { customerRelations: 'Kundenpflege', systemMessage: 'Systemnachricht', respectfully: 'Mit freundlichen Grüßen,', rating: 'Bewertung', ratingWebsite: 'Website', ratingBudget: 'Haushaltsverwaltung', userMessage: 'Nutzernachricht', date: 'Datum:', title: 'Betreff:', from: 'Von:', systemReply: 'Systemantwort' },
    system: { systemLabel: 'System', selectAction: 'Aktion in der rechten Leiste wählen', users: 'Benutzer', buildMessages: 'Build-Protokoll', schedule: 'טבלאות ונתונים', pr: 'PR', publishedDate: 'Veröffentlicht:', reset: 'Zurücksetzen', saved: 'Gespeichert', records: 'Einträge', scheduleSubject: 'Thema', schedulePriceUSD: 'Preis\n[$]', schedulePeriod: 'Zeitraum\n[Mo]', scheduleNotes: 'Notizen', clear: 'Löschen', pause: 'Pause', resume: 'Fortsetzen', active: '● Aktiv', paused: 'Pausiert', lines: 'Zeilen', filter: 'Filter', refresh: 'Aktualisieren', loading: 'Laden...', loadingBuild: 'Build-Daten laden...', error: 'Fehler', noBuildData: 'Keine Daten. Starten Sie Release_KeyClick.bat', networkError: 'Netzwerkfehler', adminButton: 'Systembereich', generalGroup: 'Allgemein', colName: 'Name', colCurrency: 'Währung', colCreated: 'Erstellt', colActive: 'Aktiv', colAppInstalled: 'App', colLicenceType: 'Lizenztyp', colSystemForce: 'Systemmodus', distributionDay: 'Verbreitungstag X', messages: 'Nachrichten', send: 'Senden', sent: 'Gesendet!', reply: 'Antworten', noMessages: 'Keine Nachrichten', replySent: 'Antwort gesendet!', ref: 'Ref.', msgNo: 'Nr.', replyToRef: 'Antwort auf Ref.', msgNumber: 'Nachricht Nr.', new: 'Neu', delete: 'Löschen', newMessage: '+ Neue Nachricht', selectToView: 'Nachricht auswählen', monitor: 'Monitor', systemData: 'Systemdaten', resetTable: 'Tabelle zurücksetzen', debug: 'Debug', db: 'DB', sensitivePoints: 'Schwachstellen', productVersionTable: 'Produktversionstabelle (Updates)' },
    currencyNames: { ILS: 'Schekel', USD: 'Dollar', GBP: 'Pfund', EUR: 'Euro', RUB: 'Rubel', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupie' },
    updates: { colDate: 'Datum & Uhrzeit', colProduct: 'Produkt', colVersion: 'Version', colTitle: 'Titel', productKeyClick: 'KeyClick Website', productMFinance: 'M Finance Haushalt' },
    reminders: { loginRequired: 'Anmeldung für Erinnerungen erforderlich', titlePh: 'Erinnerungstitel', timePh: 'Uhrzeit', add: '+ Hinzufügen', noReminders: 'Keine Erinnerungen' },
    guides: { overview: 'Allgemeine Beschreibung', userGuide: 'Benutzerhandbuch', financeOverviewTitle: 'Was ist M Finance', financeOverviewDesc: 'Ein kurzer Überblick über die Haushaltsbudgetverwaltung — Konten, Transaktionen, Kategorien und Prognosen, und für wen es gedacht ist.', financeGuideTitle: 'Schritt-für-Schritt-Anleitung', financeGuideDesc: 'Eine schriftliche Anleitung mit Screenshots: Installation, Kontoverbindung, Kategorisierung und Berichte.', financeVideosTitle: 'Kurze Anleitungen', financeVideosDesc: 'Kurze Video-Tutorials zu jeder wichtigen Funktion der Haushaltsbudgetverwaltung.', siteOverviewTitle: 'Was die Website bietet', siteOverviewDesc: 'Ein kurzer Rundgang durch die KeyClick-Plattform — Produkte, Dienstleistungen und Kundenbeziehungen.', siteGuideTitle: 'Registrierung und Navigation', siteGuideDesc: 'Wie man sich registriert, anmeldet und jeden Dienst auf der Website findet.', siteVideosTitle: 'Website-Demos', siteVideosDesc: 'Kurze aufgezeichnete Demos der wichtigsten Funktionen der Website.' },
    banking: { autoDetectFailed: 'Automatische Erkennung fehlgeschlagen — manuell wählen', detectionError: 'Erkennungsfehler', loadBanksError: 'Fehler beim Laden der Banken', plaidTokenError: 'Plaid-Token-Fehler', bankConnected: 'Bank verbunden', connectionError: 'Verbindungsfehler', linkOpened: 'Ein Verbindungsfenster für {name} wurde geöffnet. Nach der Bestätigung zurückkehren und aktualisieren klicken.', linkCreateError: 'Fehler beim Erstellen des Bank-Links', refreshing: 'Wird aktualisiert...', updated: 'Aktualisiert', fetchingData: 'Daten werden abgerufen...', noAccountsConnected: 'Keine Konten verbunden', downloadedFiles: '{count} Dateien heruntergeladen', downloadError: 'Download-Fehler', connectBankTitle: 'Bank verbinden', autoDetect: 'Automatische Erkennung', orManually: 'oder manuell', unitedStates: 'USA', back: 'Zurück', selectInstitution: 'Bank auswählen', noInstitutions: 'Keine Banken', refresh: 'Aktualisieren', downloadFiles: 'Dateien herunterladen' } },
  { code: 'fr', flag: 'צרפת',    name: 'Français', welcome: 'Bienvenue',
    menu: ['Retour','Mises à jour','Messages','Rappels','Services bancaires','Page personnelle'],
    card: { title: 'Gestion du budget familial', namePh: 'Prénom / Nom', emailPh: 'Email / Adresse e-mail', passPh: 'Mot de passe', confirmPassPh: 'Confirmer le mot de passe', register: "S'inscrire", login: 'Se connecter', update: 'Mettre à jour', line1: 'Pendant la période de lancement', line2: 'Gratuit', errName: 'Veuillez entrer votre nom', errEmail: 'Veuillez entrer un email valide', errPassLen: 'Le mot de passe doit contenir au moins 6 caractères', errPassMatch: 'Les mots de passe ne correspondent pas', errEmailExists: 'Email déjà enregistré', cancel: 'Annuler', install: 'Installer', library: 'Fichiers guide', run: 'Lancer', videos: 'Vidéos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Déjà installé\nPas besoin de réinstaller', msgDownloading: 'Téléchargement du fichier', msgInstallComplete: 'Enregistrez et exécutez le fichier\npour terminer l\'installation', msgDownloadError: 'Erreur de téléchargement\nRéessayer', mFinance: 'M Finance', msgExists: 'Utilisateur déjà enregistré\navec ces informations', msgUpdated: 'Informations mises à jour avec succès', msgRegistered: 'Inscription terminée', existingCustomer: 'Client existant', newCustomer: 'Nouveau client', notRecognized: 'Client non reconnu. Cliquer pour s\'inscrire', msgSelectPlan: 'Veuillez choisir un forfait sur votre page personnelle', infoServices: 'Services d\'information', guidesAndVideos: 'Guides & Vidéos', siteHeaderPrefix: 'Le site Internet de', theWebsite: 'Le Site' },
    profile: { fullName: 'Nom complet', email: 'E-mail', ip: 'IP', language: 'Langue', country: 'Pays', plan: 'Abonnement', planStart: 'Début', planEnd: 'Fin', unlimited: 'Illimité', comingSoon: 'Bientôt', choosePlan: 'Choisir un abonnement', close: '✕ Fermer', loginRequired: 'Connexion requise', login: 'Se connecter', products: 'Produits', change: 'Modifier',
      price: 'Prix', changePlan: "Changer d'abonnement", planName: 'Nom', planFrom: 'De', planTo: 'Au', back: 'Retour', currencyLocal: '€', free: 'Gratuit',       planNames: { System_Free_Run: 'Lancement', User_Trial: 'Essai', User_VIP_Free: 'VIP', System_Owner: 'Système', User_Monthly: 'Mensuel', User_Annual: 'Annuel', User_One_Time: 'Unique', System_Suspended_NonPayment: 'Suspendu', User_Cancelled: 'Annulé' } },
    feedback: { customerRelations: 'Relations clients', systemMessage: 'Message du système', respectfully: 'Cordialement,', rating: 'Évaluation', ratingWebsite: 'Site web', ratingBudget: 'Gestion du budget familial', userMessage: "Message de l'utilisateur", date: 'Date :', title: 'Titre :', from: 'De :', systemReply: 'Réponse du système' },
    system: { systemLabel: 'Système', selectAction: 'Sélectionner une action dans la barre droite', users: 'Utilisateurs', buildMessages: 'Journal de build', schedule: 'טבלאות ונתונים', pr: 'RP', publishedDate: 'Publié le :', reset: 'Réinitialiser', saved: 'Enregistré', records: 'enregistrements', scheduleSubject: 'Sujet', schedulePriceUSD: 'Prix\n[$]', schedulePeriod: 'Période\n[mois]', scheduleNotes: 'Notes', clear: 'Effacer', pause: 'Pause', resume: 'Reprendre', active: '● Actif', paused: 'En pause', lines: 'lignes', filter: 'Filtre', refresh: 'Actualiser', loading: 'Chargement...', loadingBuild: 'Chargement du build...', error: 'Erreur', noBuildData: 'Aucune donnée. Lancez Release_KeyClick.bat', networkError: 'Erreur réseau', adminButton: 'Espace système', generalGroup: 'Général', colName: 'Nom', colCurrency: 'Devise', colCreated: 'Créé', colActive: 'Actif', colAppInstalled: 'Application', colLicenceType: 'Type de licence', colSystemForce: 'Mode système', distributionDay: 'Jour de distribution X', messages: 'Messages', send: 'Envoyer', sent: 'Envoyé !', reply: 'Répondre', noMessages: 'Aucun message', replySent: 'Réponse envoyée !', ref: 'Réf.', msgNo: 'N°', replyToRef: 'Réponse à réf.', msgNumber: 'Message N°', new: 'Nouveau', delete: 'Supprimer', newMessage: '+ Nouveau message', selectToView: 'Sélectionner un message', monitor: 'Moniteur', systemData: 'Données système', resetTable: 'Réinitialiser la table', debug: 'Débogage', db: 'BD', sensitivePoints: 'Points sensibles', productVersionTable: 'Tableau des versions (onglet mises à jour)' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Livre', EUR: 'Euro', RUB: 'Rouble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Roupie' },
    updates: { colDate: 'Date et heure', colProduct: 'Produit', colVersion: 'Version', colTitle: 'Titre', productKeyClick: 'KeyClick Site web', productMFinance: 'M Finance Budget familial' },
    reminders: { loginRequired: 'Connexion requise pour les rappels', titlePh: 'Titre du rappel', timePh: 'Heure', add: '+ Ajouter', noReminders: 'Aucun rappel' },
    guides: { overview: 'Description générale', userGuide: 'Guide utilisateur', financeOverviewTitle: 'Présentation de M Finance', financeOverviewDesc: "Un bref aperçu de la gestion du budget familial — comptes, transactions, catégories et prévisions, et à qui elle est destinée.", financeGuideTitle: 'Utilisation étape par étape', financeGuideDesc: "Un guide écrit avec des captures d'écran : installation, connexion des comptes, catégorisation et rapports.", financeVideosTitle: 'Tutoriels courts', financeVideosDesc: 'De courts tutoriels vidéo pour chaque fonctionnalité clé de la gestion du budget familial.', siteOverviewTitle: 'Ce que propose le site', siteOverviewDesc: 'Un bref tour de la plateforme KeyClick — produits, services et relations clients.', siteGuideTitle: 'Inscription et navigation', siteGuideDesc: 'Comment créer un compte, se connecter et trouver chaque service sur le site.', siteVideosTitle: 'Démonstrations du site', siteVideosDesc: 'De courtes démonstrations filmées des principales fonctionnalités du site.' },
    banking: { autoDetectFailed: 'Détection automatique échouée — choisir manuellement', detectionError: 'Erreur de détection', loadBanksError: 'Erreur de chargement des banques', plaidTokenError: 'Erreur de jeton Plaid', bankConnected: 'Banque connectée', connectionError: 'Erreur de connexion', linkOpened: 'Une fenêtre de connexion pour {name} a été ouverte. Après approbation, revenez et cliquez sur actualiser.', linkCreateError: 'Erreur lors de la création du lien bancaire', refreshing: 'Actualisation...', updated: 'Mis à jour', fetchingData: 'Récupération des données...', noAccountsConnected: 'Aucun compte connecté', downloadedFiles: '{count} fichiers téléchargés', downloadError: 'Erreur de téléchargement', connectBankTitle: 'Connecter une banque', autoDetect: 'Détection automatique', orManually: 'ou manuellement', unitedStates: 'États-Unis', back: 'Retour', selectInstitution: 'Choisir une banque', noInstitutions: 'Aucune banque', refresh: 'Actualiser', downloadFiles: 'Télécharger les fichiers' } },
  { code: 'he', flag: 'ישראל',   name: 'עברית',    welcome: 'ברוכים הבאים',
    menu: ['משוב','עדכונים','הודעות','תזכורות','שרותים בנקאיים','דף אישי'],
    card: { title: 'ניהול תקציב בית', namePh: 'שם / שם משפחה', emailPh: 'Email / כתובת מייל', passPh: 'סיסמא', confirmPassPh: 'אימות סיסמא', register: 'הרשמה', login: 'כניסה', update: 'עדכון', line1: 'בתקופת ההרצה', line2: 'חינם', errName: 'נא להזין שם', errEmail: 'נא להזין כתובת מייל תקינה', errPassLen: 'סיסמה חייבת להכיל לפחות 6 תווים', errPassMatch: 'הסיסמאות אינן תואמות', errEmailExists: 'אימייל כבר קיים במערכת', cancel: 'בטל', install: 'התקנה', library: 'קובצי הדרכה', run: 'הפעלה', videos: 'סרטונים', guide: 'הדרכה', ok: 'לחץ', msgAlreadyInstalled: 'כבר מותקן\nאין צורך בהתקנה', msgDownloading: 'הורד קובץ התקנה', msgInstallComplete: 'שמור והפעל את הקובץ\nלהשלמת ההתקנה', msgDownloadError: 'שגיאה בהורדה\nנסה שוב', mFinance: 'M Finance', msgExists: 'המשתמש עם הפרטים שהקשת\nכבר רשום במערכת', msgUpdated: 'הפרטים עודכנו בהצלחה', msgRegistered: 'הרשמה הושלמה', existingCustomer: 'לקוח קיים', newCustomer: 'לקוח חדש', notRecognized: 'לקוח לא מוכר. לחץ להרשמה', msgSelectPlan: 'בחר תכנית בדף האישי', infoServices: 'שרותי מידע', guidesAndVideos: 'מדריכים וסרטונים', siteHeaderPrefix: 'אתר האינטרנט של', theWebsite: 'האתר' },
    profile: { fullName: 'שם ומשפחה', email: 'דוא"ל', ip: 'IP', language: 'שפה', country: 'מדינה', plan: 'תכנית', planStart: 'תחילת תכנית', planEnd: 'סיום תכנית', unlimited: 'ללא הגבלה', comingSoon: 'בקרוב', choosePlan: 'בחר תכנית', close: '✕ סגור', loginRequired: 'נדרשת כניסה לצפייה בדף האישי', login: 'כניסה', products: 'מוצרים', change: 'שינוי',
      price: 'מחיר', changePlan: 'שינוי תכנית', planName: 'שם', planFrom: 'מ-', planTo: 'עד-', back: 'חזרה', currencyLocal: '₪', free: 'חינם',       planNames: { System_Free_Run: 'תקופת הרצה', User_Trial: 'תקופת נסיון', User_VIP_Free: 'VIP', System_Owner: 'מערכת', User_Monthly: 'חודשי', User_Annual: 'שנתי', User_One_Time: 'כניסה בודדת', System_Suspended_NonPayment: 'מנותק', User_Cancelled: 'בוטל' } },
    feedback: { customerRelations: 'קשרי לקוחות', systemMessage: 'הודעת המערכת', respectfully: 'בכבוד רב,', rating: 'דירוג', ratingWebsite: 'אתר', ratingBudget: 'ניהול תקציב בית', userMessage: 'דבר המשתמש', date: 'תאריך:', title: 'כותרת:', from: 'מאת:', systemReply: 'תשובת המערכת' },
    system: { systemLabel: 'מערכת', selectAction: 'בחר פעולה מהסרגל הימני', users: 'משתמשים', buildMessages: 'הודעות בניית מערכת', schedule: 'טבלאות ונתונים', pr: 'יחסי ציבור', publishedDate: 'פורסם בתאריך:', reset: 'איפוס', saved: 'נשמר', records: 'רשומות', scheduleSubject: 'נושא', schedulePriceUSD: 'מחיר\n[$]', schedulePeriod: 'תקופה\n[ח׳]', scheduleNotes: 'הערות', clear: 'נקה', pause: 'עצור', resume: 'המשך', active: '● פעיל', paused: 'מושהה', lines: 'שורות', filter: 'סינון', refresh: 'רענן', loading: 'טוען...', loadingBuild: 'טוען נתוני בנייה...', error: 'שגיאה', noBuildData: 'אין נתוני בנייה. הרץ את Release_KeyClick.bat', networkError: 'שגיאת רשת', adminButton: 'בשימוש המערכת', generalGroup: 'כללי', colName: 'שם', colCurrency: 'מטבע', colCreated: 'תאריך הצטרפות', colActive: 'פעיל', colAppInstalled: 'אפליקציה', colLicenceType: 'סוג רישיון', colSystemForce: 'כפיית מערכת', distributionDay: 'יום ה-X ההפצה', messages: 'הודעות', send: 'שלח', sent: 'נשלח!', reply: 'תשובה', noMessages: 'אין הודעות', replySent: 'תשובה נשלחה!', ref: 'סימוכין', msgNo: 'מס.', replyToRef: 'מענה לסימוכין', msgNumber: 'הודעה מס.', new: 'חדש', delete: 'מחיקה', newMessage: '+ הודעה חדשה', selectToView: 'בחר הודעה לצפייה', monitor: 'מוניטור', systemData: 'נתוני מערכת', resetTable: 'איפוס טבלה', debug: 'ניפוי', db: 'בסיס נתונים', sensitivePoints: 'נקודות רגישות', productVersionTable: 'טבלת גרסאות מוצר שבלשונית עדכונים' },
    currencyNames: { ILS: 'ש"ח', USD: 'דולר', GBP: 'ליש"ט', EUR: 'יורו', RUB: 'רובל', JPY: 'ין', SAR: 'ריאל', CNY: 'יואן', INR: 'רופי' },
    updates: { colDate: 'תאריך ושעה', colProduct: 'מוצר', colVersion: 'גרסה', colTitle: 'כותרת', productKeyClick: 'אתר KeyClick', productMFinance: 'ניהול תקציב בית M Finance' },
    reminders: { loginRequired: 'נדרשת כניסה לצפייה בתזכורות', titlePh: 'כותרת תזכורת', timePh: 'שעה', add: '+ הוסף', noReminders: 'אין תזכורות' },
    guides: { overview: 'תיאור כללי', userGuide: 'מדריך למשתמש', financeOverviewTitle: 'מה זה M Finance', financeOverviewDesc: 'סקירה קצרה של ניהול תקציב הבית — חשבונות, תנועות, קטגוריות ותחזיות, ולמי זה מיועד.', financeGuideTitle: 'שימוש שלב-אחר-שלב', financeGuideDesc: 'מדריך כתוב עם צילומי מסך: התקנה, חיבור חשבונות, סיווגים ודוחות.', financeVideosTitle: 'הדרכות קצרות', financeVideosDesc: 'סרטוני וידאו קצרים לכל תכונה עיקרית בניהול משק הבית.', siteOverviewTitle: 'מה מציע האתר', siteOverviewDesc: 'סיור קצר על פלטפורמת KeyClick — המוצרים, השירותים וקשרי הלקוחות.', siteGuideTitle: 'הרשמה וניווט', siteGuideDesc: 'איך נרשמים, מתחברים ומוצאים כל שירות באתר.', siteVideosTitle: 'הדגמות האתר', siteVideosDesc: 'הדגמות מצולמות קצרות של תכונות האתר המרכזיות.' },
    banking: { autoDetectFailed: 'לא זוהה אוטומטית — בחר ידנית', detectionError: 'שגיאה בזיהוי', loadBanksError: 'שגיאה בטעינת בנקים', plaidTokenError: 'שגיאה ביצירת Plaid Token', bankConnected: 'הבנק חובר בהצלחה', connectionError: 'שגיאה בחיבור', linkOpened: 'נפתח חלון חיבור ל-{name}. לאחר האישור חזור ולחץ רענן.', linkCreateError: 'שגיאה ביצירת קישור לבנק', refreshing: 'מרענן...', updated: 'עודכן', fetchingData: 'שולף נתונים...', noAccountsConnected: 'אין חשבונות מחוברים', downloadedFiles: 'הורדו {count} קבצים', downloadError: 'שגיאה בהורדה', connectBankTitle: 'חיבור לבנק', autoDetect: 'זיהוי אוטומטי', orManually: 'או בחר ידנית', unitedStates: 'ארצות הברית', back: 'חזור', selectInstitution: 'בחר מוסד פיננסי', noInstitutions: 'אין מוסדות', refresh: 'רענן', downloadFiles: 'הורד קבצים' } },
  { code: 'es', flag: 'ספרד',    name: 'Español',  welcome: 'Bienvenido',
    menu: ['Comentarios','Actualizaciones','Mensajes','Recordatorios','Servicios bancarios','Página personal'],
    card: { title: 'Gestión del presupuesto familiar', namePh: 'Nombre / Apellido', emailPh: 'Email / Dirección de correo', passPh: 'Contraseña', confirmPassPh: 'Confirmar contraseña', register: 'Registrarse', login: 'Iniciar sesión', update: 'Actualizar', line1: 'Durante el período de lanzamiento', line2: 'Gratis', errName: 'Por favor ingrese su nombre', errEmail: 'Por favor ingrese un email válido', errPassLen: 'La contraseña debe tener al menos 6 caracteres', errPassMatch: 'Las contraseñas no coinciden', errEmailExists: 'El correo ya está registrado', cancel: 'Cancelar', install: 'Instalar', library: 'Archivos de guía', run: 'Ejecutar', videos: 'Videos', guide: 'Guía', ok: 'OK', msgAlreadyInstalled: 'Ya instalado\nNo es necesario reinstalar', msgDownloading: 'Descargando archivo de instalación', msgInstallComplete: 'Guarda y ejecuta el archivo\npara completar la instalación', msgDownloadError: 'Error de descarga\nInténtalo de nuevo', mFinance: 'M Finance', msgExists: 'El usuario ya está registrado\ncon estos datos', msgUpdated: 'Datos actualizados correctamente', msgRegistered: 'Registro completado', existingCustomer: 'Cliente existente', newCustomer: 'Cliente nuevo', notRecognized: 'Cliente no encontrado. Haga clic para registrarse', msgSelectPlan: 'Por favor selecciona un plan en tu página personal', infoServices: 'Servicios de información', guidesAndVideos: 'Guías y Videos', siteHeaderPrefix: 'El sitio web de', theWebsite: 'El Sitio' },
    profile: { fullName: 'Nombre completo', email: 'Correo', ip: 'IP', language: 'Idioma', country: 'País', plan: 'Plan', planStart: 'Inicio del plan', planEnd: 'Fin del plan', unlimited: 'Sin límite', comingSoon: 'Próximamente', choosePlan: 'Elegir plan', close: '✕ Cerrar', loginRequired: 'Se requiere inicio de sesión', login: 'Iniciar sesión', products: 'Productos', change: 'Cambiar',
      price: 'Precio', changePlan: 'Cambiar plan', planName: 'Nombre', planFrom: 'Desde', planTo: 'Hasta', back: 'Volver', currencyLocal: '€', free: 'Gratis',       planNames: { System_Free_Run: 'Ejecución', User_Trial: 'Prueba', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensual', User_Annual: 'Anual', User_One_Time: 'Único', System_Suspended_NonPayment: 'Suspendido', User_Cancelled: 'Cancelado' } },
    feedback: { customerRelations: 'Relaciones con clientes', systemMessage: 'Mensaje del sistema', respectfully: 'Atentamente,', rating: 'Calificación', ratingWebsite: 'Sitio web', ratingBudget: 'Gestión del presupuesto familiar', userMessage: 'Mensaje del usuario', date: 'Fecha:', title: 'Título:', from: 'De:', systemReply: 'Respuesta del sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleccionar acción de la barra derecha', users: 'Usuarios', buildMessages: 'Registro de build', schedule: 'טבלאות ונתונים', pr: 'RRPP', publishedDate: 'Publicado:', reset: 'Restablecer', saved: 'Guardado', records: 'registros', scheduleSubject: 'Asunto', schedulePriceUSD: 'Precio\n[$]', schedulePeriod: 'Período\n[mes]', scheduleNotes: 'Notas', clear: 'Limpiar', pause: 'Pausar', resume: 'Reanudar', active: '● Activo', paused: 'En pausa', lines: 'líneas', filter: 'Filtro', refresh: 'Actualizar', loading: 'Cargando...', loadingBuild: 'Cargando datos de build...', error: 'Error', noBuildData: 'Sin datos. Ejecute Release_KeyClick.bat', networkError: 'Error de red', adminButton: 'Área del sistema', generalGroup: 'General', colName: 'Nombre', colCurrency: 'Moneda', colCreated: 'Creado', colActive: 'Activo', colAppInstalled: 'Aplicación', colLicenceType: 'Tipo de licencia', colSystemForce: 'Modo sistema', distributionDay: 'Día de distribución X', messages: 'Mensajes', send: 'Enviar', sent: '¡Enviado!', reply: 'Responder', noMessages: 'Sin mensajes', replySent: '¡Respuesta enviada!', ref: 'Ref.', msgNo: 'N°', replyToRef: 'Respuesta a ref.', msgNumber: 'Mensaje N°', new: 'Nuevo', delete: 'Eliminar', newMessage: '+ Nuevo mensaje', selectToView: 'Seleccionar un mensaje', monitor: 'Monitor', systemData: 'Datos del sistema', resetTable: 'Restablecer tabla', debug: 'Depurar', db: 'BD', sensitivePoints: 'Puntos sensibles', productVersionTable: 'Tabla de versiones (pestaña actualizaciones)' },
    currencyNames: { ILS: 'Séquel', USD: 'Dólar', GBP: 'Libra', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' },
    updates: { colDate: 'Fecha y hora', colProduct: 'Producto', colVersion: 'Versión', colTitle: 'Título', productKeyClick: 'KeyClick Sitio web', productMFinance: 'M Finance Presupuesto familiar' },
    reminders: { loginRequired: 'Inicio de sesión requerido', titlePh: 'Título del recordatorio', timePh: 'Hora', add: '+ Agregar', noReminders: 'Sin recordatorios' },
    guides: { overview: 'Descripción general', userGuide: 'Guía del usuario', financeOverviewTitle: 'Qué es M Finance', financeOverviewDesc: 'Una breve descripción de la gestión del presupuesto familiar — cuentas, transacciones, categorías y previsiones, y a quién está dirigido.', financeGuideTitle: 'Uso paso a paso', financeGuideDesc: 'Una guía escrita con capturas de pantalla: instalación, conexión de cuentas, categorización e informes.', financeVideosTitle: 'Tutoriales cortos', financeVideosDesc: 'Breves videotutoriales de cada función clave en la gestión del presupuesto familiar.', siteOverviewTitle: 'Qué ofrece el sitio', siteOverviewDesc: 'Un breve recorrido por la plataforma KeyClick — productos, servicios y relación con los clientes.', siteGuideTitle: 'Registro y navegación', siteGuideDesc: 'Cómo registrarse, iniciar sesión y encontrar cada servicio en el sitio.', siteVideosTitle: 'Demostraciones del sitio', siteVideosDesc: 'Breves demostraciones grabadas de las principales funciones del sitio.' },
    banking: { autoDetectFailed: 'Detección automática fallida — elija manualmente', detectionError: 'Error de detección', loadBanksError: 'Error al cargar los bancos', plaidTokenError: 'Error de token de Plaid', bankConnected: 'Banco conectado', connectionError: 'Error de conexión', linkOpened: 'Se abrió una ventana de conexión para {name}. Después de aprobar, vuelva y haga clic en actualizar.', linkCreateError: 'Error al crear el enlace bancario', refreshing: 'Actualizando...', updated: 'Actualizado', fetchingData: 'Obteniendo datos...', noAccountsConnected: 'No hay cuentas conectadas', downloadedFiles: '{count} archivos descargados', downloadError: 'Error de descarga', connectBankTitle: 'Conectar banco', autoDetect: 'Detección automática', orManually: 'o manualmente', unitedStates: 'Estados Unidos', back: 'Volver', selectInstitution: 'Seleccionar banco', noInstitutions: 'No hay bancos', refresh: 'Actualizar', downloadFiles: 'Descargar archivos' } },
  { code: 'ja', flag: 'יפן',     name: '日本語',    welcome: 'ようこそ',
    menu: ['フィードバック','更新','メッセージ','リマインダー','銀行サービス','個人ページ'],
    card: { title: '家計管理', namePh: '名前 / 苗字', emailPh: 'メール / メールアドレス', passPh: 'パスワード', confirmPassPh: 'パスワードの確認', register: '登録', login: 'ログイン', update: '更新', line1: 'ローンチ期間中', line2: '無料', errName: '名前を入力してください', errEmail: '有効なメールアドレスを入力してください', errPassLen: 'パスワードは6文字以上必要です', errPassMatch: 'パスワードが一致しません', errEmailExists: 'このメールアドレスはすでに登録されています', cancel: 'キャンセル', install: 'インストール', library: 'ガイドファイル', run: '起動', videos: 'ビデオ', guide: 'ガイド', ok: 'OK', msgAlreadyInstalled: 'インストール済み\n再インストール不要', msgDownloading: 'インストールファイルをダウンロード中', msgInstallComplete: 'ファイルを保存して実行\nインストールを完了', msgDownloadError: 'ダウンロードエラー\n再試行', mFinance: 'M Finance', msgExists: 'このメールは\nすでに登録されています', msgUpdated: '情報が正常に更新されました', msgRegistered: '登録が完了しました', existingCustomer: '既存のお客様', newCustomer: '新規のお客様', notRecognized: 'お客様が見つかりません。登録するにはクリック', msgSelectPlan: '個人ページでプランを選択してください', infoServices: '情報サービス', guidesAndVideos: 'ガイドと動画', siteHeaderPrefix: '公式サイト：', theWebsite: '本サイト' },
    profile: { fullName: 'フルネーム', email: 'メール', ip: 'IP', language: '言語', country: '国', plan: 'プラン', planStart: 'プラン開始', planEnd: 'プラン終了', unlimited: '無制限', comingSoon: '近日公開', choosePlan: 'プランを選択', close: '✕ 閉じる', loginRequired: 'ログインが必要です', login: 'ログイン', products: '製品', change: '変更',
      price: '価格', changePlan: 'プラン変更', planName: '名前', planFrom: 'から', planTo: 'まで', back: '戻る', currencyLocal: '¥', free: '無料',       planNames: { System_Free_Run: '試運転', User_Trial: '試用', User_VIP_Free: 'VIP', System_Owner: 'システム', User_Monthly: '月次', User_Annual: '年次', User_One_Time: '単回', System_Suspended_NonPayment: '停止', User_Cancelled: 'キャンセル' } },
    feedback: { customerRelations: 'カスタマーサービス', systemMessage: 'システムメッセージ', respectfully: '敬具,', rating: '評価', ratingWebsite: 'ウェブサイト', ratingBudget: '家計管理', userMessage: 'ユーザーメッセージ', date: '日付:', title: 'タイトル:', from: '差出人:', systemReply: 'システム返信' },
    system: { systemLabel: 'システム', selectAction: '右サイドバーからアクションを選択', users: 'ユーザー', buildMessages: 'ビルドログ', schedule: 'טבלאות ונתונים', pr: 'PR', publishedDate: '公開日:', reset: 'リセット', saved: '保存済み', records: '件', scheduleSubject: '件名', schedulePriceUSD: '価格\n[$]', schedulePeriod: '期間\n[月]', scheduleNotes: 'メモ', clear: 'クリア', pause: '一時停止', resume: '再開', active: '● アクティブ', paused: '一時停止中', lines: '行', filter: 'フィルター', refresh: '更新', loading: '読み込み中...', loadingBuild: 'ビルドデータ読み込み中...', error: 'エラー', noBuildData: 'データなし。Release_KeyClick.bat を実行', networkError: 'ネットワークエラー', adminButton: 'システム管理', generalGroup: '全般', colName: '名前', colCurrency: '通貨', colCreated: '作成日', colActive: '有効', colAppInstalled: 'アプリ', colLicenceType: 'ライセンス種別', colSystemForce: 'システムモード', distributionDay: '配布日X', messages: 'メッセージ', send: '送信', sent: '送信済み!', reply: '返信', noMessages: 'メッセージなし', replySent: '返信済み!', ref: '参照', msgNo: 'No.', replyToRef: '参照への返信', msgNumber: 'メッセージNo.', new: '新着', delete: '削除', newMessage: '+ 新メッセージ', selectToView: 'メッセージを選択', monitor: 'モニター', systemData: 'システムデータ', resetTable: 'テーブルリセット', debug: 'デバッグ', db: 'DB', sensitivePoints: '重要ポイント', productVersionTable: '更新タブの製品バージョン一覧' },
    currencyNames: { ILS: 'シェケル', USD: 'ドル', GBP: 'ポンド', EUR: 'ユーロ', RUB: 'ルーブル', JPY: '円', SAR: 'リヤル', CNY: '元', INR: 'ルピー' },
    updates: { colDate: '日時', colProduct: '製品', colVersion: 'バージョン', colTitle: 'タイトル', productKeyClick: 'KeyClick サイト', productMFinance: 'M Finance 家計管理' },
    reminders: { loginRequired: 'リマインダーを表示するにはログインが必要です', titlePh: 'リマインダーのタイトル', timePh: '時刻', add: '+ 追加', noReminders: 'リマインダーなし' },
    guides: { overview: '概要', userGuide: 'ユーザーガイド', financeOverviewTitle: 'M Financeとは', financeOverviewDesc: '家計管理の簡単な概要 — 口座、取引、カテゴリ、予測、対象となる方について。', financeGuideTitle: '使い方ステップガイド', financeGuideDesc: 'スクリーンショット付きの説明書：インストール、口座の連携、分類とレポート。', financeVideosTitle: '短いチュートリアル', financeVideosDesc: '家計管理の主要機能ごとの短い動画チュートリアル。', siteOverviewTitle: 'サイトが提供するもの', siteOverviewDesc: 'KeyClickプラットフォームの簡単な紹介 — 製品、サービス、カスタマーリレーション。', siteGuideTitle: '登録とナビゲーション', siteGuideDesc: '登録方法、ログイン方法、サイト内の各サービスの見つけ方。', siteVideosTitle: 'サイトのデモ', siteVideosDesc: 'サイトの主要機能を短く撮影したデモ。' },
    banking: { autoDetectFailed: '自動検出に失敗しました。手動で選択してください', detectionError: '検出エラー', loadBanksError: '銀行の読み込みエラー', plaidTokenError: 'Plaidトークンエラー', bankConnected: '銀行が接続されました', connectionError: '接続エラー', linkOpened: '{name}への接続ウィンドウが開きました。承認後、戻って更新をクリックしてください。', linkCreateError: '銀行リンクの作成エラー', refreshing: '更新中...', updated: '更新しました', fetchingData: 'データを取得中...', noAccountsConnected: '接続された口座がありません', downloadedFiles: '{count}件のファイルをダウンロードしました', downloadError: 'ダウンロードエラー', connectBankTitle: '銀行を接続', autoDetect: '自動検出', orManually: 'または手動で', unitedStates: 'アメリカ合衆国', back: '戻る', selectInstitution: '銀行を選択', noInstitutions: '銀行がありません', refresh: '更新', downloadFiles: 'ファイルをダウンロード' } },
  { code: 'ar', flag: 'סעודיה',  name: 'العربية',  welcome: 'أهلاً وسهلاً',
    menu: ['ملاحظات','تحديثات','رسائل','تذكيرات','خدمات مصرفية','الصفحة الشخصية'],
    card: { title: 'إدارة الميزانية المنزلية', namePh: 'الاسم / اسم العائلة', emailPh: 'البريد الإلكتروني', passPh: 'كلمة المرور', confirmPassPh: 'تأكيد كلمة المرور', register: 'تسجيل', login: 'دخول', update: 'تحديث', line1: 'خلال فترة الإطلاق', line2: 'مجاناً', errName: 'الرجاء إدخال اسمك', errEmail: 'الرجاء إدخال بريد إلكتروني صحيح', errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل', errPassMatch: 'كلمتا المرور غير متطابقتين', errEmailExists: 'البريد الإلكتروني مسجل بالفعل', cancel: 'إلغاء', install: 'تثبيت', library: 'ملفات الدليل', run: 'تشغيل', videos: 'مقاطع', guide: 'دليل', ok: 'حسناً', msgAlreadyInstalled: 'مثبت بالفعل\nلا حاجة لإعادة التثبيت', msgDownloading: 'جارٍ تنزيل ملف التثبيت', msgInstallComplete: 'احفظ الملف وشغّله\nلإكمال التثبيت', msgDownloadError: 'خطأ في التنزيل\nحاول مرة أخرى', mFinance: 'M Finance', msgExists: 'المستخدم مسجل بالفعل\nبهذه البيانات', msgUpdated: 'تم تحديث البيانات بنجاح', msgRegistered: 'اكتمل التسجيل', existingCustomer: 'عميل موجود', newCustomer: 'عميل جديد', notRecognized: 'العميل غير معروف. انقر للتسجيل', msgSelectPlan: 'يرجى اختيار خطة في صفحتك الشخصية', infoServices: 'خدمات المعلومات', guidesAndVideos: 'أدلة ومقاطع فيديو', siteHeaderPrefix: 'الموقع الإلكتروني لـ', theWebsite: 'الموقع' },
    profile: { fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', ip: 'IP', language: 'اللغة', country: 'الدولة', plan: 'الخطة', planStart: 'بداية الخطة', planEnd: 'نهاية الخطة', unlimited: 'بلا حدود', comingSoon: 'قريباً', choosePlan: 'اختر خطة', close: '✕ إغلاق', loginRequired: 'تسجيل الدخول مطلوب', login: 'دخول', products: 'المنتجات', change: 'تغيير',
      price: 'السعر', changePlan: 'تغيير الخطة', planName: 'الاسم', planFrom: 'من', planTo: 'إلى', back: 'رجوع', currencyLocal: '﷼', free: 'مجاناً',       planNames: { System_Free_Run: 'تشغيل', User_Trial: 'تجريبي', User_VIP_Free: 'VIP', System_Owner: 'النظام', User_Monthly: 'شهري', User_Annual: 'سنوي', User_One_Time: 'مرة واحدة', System_Suspended_NonPayment: 'موقوف', User_Cancelled: 'ملغى' } },
    feedback: { customerRelations: 'خدمة العملاء', systemMessage: 'رسالة النظام', respectfully: 'مع التحية،', rating: 'تقييم', ratingWebsite: 'الموقع', ratingBudget: 'إدارة الميزانية المنزلية', userMessage: 'رسالة المستخدم', date: 'التاريخ:', title: 'الموضوع:', from: 'من:', systemReply: 'رد النظام' },
    system: { systemLabel: 'النظام', selectAction: 'اختر إجراء من الشريط الأيمن', users: 'المستخدمون', buildMessages: 'سجل البناء', schedule: 'טבלאות ונתונים', pr: 'العلاقات العامة', publishedDate: 'تاريخ النشر:', reset: 'إعادة تعيين', saved: 'تم الحفظ', records: 'سجلات', scheduleSubject: 'الموضوع', schedulePriceUSD: 'السعر\n[$]', schedulePeriod: 'الفترة\n[شهر]', scheduleNotes: 'ملاحظات', clear: 'مسح', pause: 'إيقاف مؤقت', resume: 'استئناف', active: '● نشط', paused: 'متوقف مؤقتاً', lines: 'سطور', filter: 'تصفية', refresh: 'تحديث', loading: 'جارٍ التحميل...', loadingBuild: 'تحميل بيانات البناء...', error: 'خطأ', noBuildData: 'لا بيانات. شغّل Release_KeyClick.bat', networkError: 'خطأ في الشبكة', adminButton: 'النظام', generalGroup: 'عام', colName: 'الاسم', colCurrency: 'العملة', colCreated: 'تاريخ الإنشاء', colActive: 'نشط', colAppInstalled: 'التطبيق', colLicenceType: 'نوع الترخيص', colSystemForce: 'وضع النظام', distributionDay: 'يوم التوزيع X', messages: 'الرسائل', send: 'إرسال', sent: 'تم!', reply: 'رد', noMessages: 'لا رسائل', replySent: 'تم إرسال الرد!', ref: 'مرجع', msgNo: 'رقم', replyToRef: 'رد على المرجع', msgNumber: 'رسالة رقم', new: 'جديد', delete: 'حذف', newMessage: '+ رسالة جديدة', selectToView: 'اختر رسالة للعرض', monitor: 'مراقب', systemData: 'بيانات النظام', resetTable: 'إعادة تعيين الجدول', debug: 'تصحيح', db: 'قاعدة', sensitivePoints: 'نقاط حساسة', productVersionTable: 'جدول الإصدارات في تبويب التحديثات' },
    currencyNames: { ILS: 'شيكل', USD: 'دولار', GBP: 'جنيه', EUR: 'يورو', RUB: 'روبل', JPY: 'ين', SAR: 'ريال', CNY: 'يوان', INR: 'روبية' },
    updates: { colDate: 'التاريخ والوقت', colProduct: 'المنتج', colVersion: 'الإصدار', colTitle: 'العنوان', productKeyClick: 'KeyClick موقع', productMFinance: 'M Finance ميزانية المنزل' },
    reminders: { loginRequired: 'تسجيل الدخول مطلوب لعرض التذكيرات', titlePh: 'عنوان التذكير', timePh: 'الوقت', add: '+ إضافة', noReminders: 'لا توجد تذكيرات' },
    guides: { overview: 'وصف عام', userGuide: 'دليل المستخدم', financeOverviewTitle: 'ما هو M Finance', financeOverviewDesc: 'نظرة عامة موجزة على إدارة ميزانية المنزل — الحسابات، المعاملات، الفئات والتوقعات، ولمن هذا مخصص.', financeGuideTitle: 'الاستخدام خطوة بخطوة', financeGuideDesc: 'دليل مكتوب مع لقطات شاشة: التثبيت، ربط الحسابات، التصنيف والتقارير.', financeVideosTitle: 'شروحات قصيرة', financeVideosDesc: 'مقاطع فيديو تعليمية قصيرة لكل ميزة أساسية في إدارة ميزانية المنزل.', siteOverviewTitle: 'ما الذي يقدمه الموقع', siteOverviewDesc: 'جولة قصيرة في منصة KeyClick — المنتجات والخدمات وخدمة العملاء.', siteGuideTitle: 'التسجيل والتنقل', siteGuideDesc: 'كيفية التسجيل وتسجيل الدخول والعثور على كل خدمة في الموقع.', siteVideosTitle: 'عروض توضيحية للموقع', siteVideosDesc: 'عروض توضيحية مصورة قصيرة لأهم ميزات الموقع.' },
    banking: { autoDetectFailed: 'فشل الاكتشاف التلقائي — اختر يدويًا', detectionError: 'خطأ في الاكتشاف', loadBanksError: 'خطأ في تحميل البنوك', plaidTokenError: 'خطأ في رمز Plaid', bankConnected: 'تم ربط البنك بنجاح', connectionError: 'خطأ في الاتصال', linkOpened: 'تم فتح نافذة الاتصال بـ {name}. بعد الموافقة، ارجع واضغط تحديث.', linkCreateError: 'خطأ في إنشاء رابط البنك', refreshing: 'جارٍ التحديث...', updated: 'تم التحديث', fetchingData: 'جارٍ جلب البيانات...', noAccountsConnected: 'لا توجد حسابات متصلة', downloadedFiles: 'تم تنزيل {count} ملفات', downloadError: 'خطأ في التنزيل', connectBankTitle: 'ربط بنك', autoDetect: 'اكتشاف تلقائي', orManually: 'أو يدويًا', unitedStates: 'الولايات المتحدة', back: 'رجوع', selectInstitution: 'اختر مؤسسة مالية', noInstitutions: 'لا توجد مؤسسات', refresh: 'تحديث', downloadFiles: 'تنزيل الملفات' } },
  { code: 'zh', flag: 'סין',     name: '中文',      welcome: '欢迎',
    menu: ['反馈','更新','消息','提醒','银行服务','个人页面'],
    card: { title: '家庭预算管理', namePh: '名字 / 姓氏', emailPh: '邮箱 / 电子邮件地址', passPh: '密码', confirmPassPh: '确认密码', register: '注册', login: '登录', update: '更新', line1: '在发布期间', line2: '免费', errName: '请输入您的姓名', errEmail: '请输入有效的电子邮件地址', errPassLen: '密码必须至少包含6个字符', errPassMatch: '密码不匹配', errEmailExists: '该邮箱已注册', cancel: '取消', install: '安装', library: '指南文件', run: '运行', videos: '视频', guide: '指南', ok: '确定', msgAlreadyInstalled: '已安装\n无需重新安装', msgDownloading: '正在下载安装文件', msgInstallComplete: '保存并运行文件\n以完成安装', msgDownloadError: '下载错误\n请重试', mFinance: 'M Finance', msgExists: '该用户已注册\n使用这些信息', msgUpdated: '信息更新成功', msgRegistered: '注册完成', existingCustomer: '现有客户', newCustomer: '新客户', notRecognized: '未找到客户。点击注册', msgSelectPlan: '请在个人页面选择套餐', infoServices: '信息服务', guidesAndVideos: '指南与视频', siteHeaderPrefix: '官方网站：', theWebsite: '网站' },
    profile: { fullName: '全名', email: '邮箱', ip: 'IP', language: '语言', country: '国家', plan: '套餐', planStart: '套餐开始', planEnd: '套餐结束', unlimited: '无限制', comingSoon: '即将推出', choosePlan: '选择套餐', close: '✕ 关闭', loginRequired: '需要登录', login: '登录', products: '产品', change: '更改',
      price: '价格', changePlan: '更改套餐', planName: '名称', planFrom: '从', planTo: '至', back: '返回', currencyLocal: '¥', free: '免费',       planNames: { System_Free_Run: '试运行', User_Trial: '试用', User_VIP_Free: 'VIP', System_Owner: '系统', User_Monthly: '每月', User_Annual: '每年', User_One_Time: '单次', System_Suspended_NonPayment: '停用', User_Cancelled: '已取消' } },
    feedback: { customerRelations: '客户关系', systemMessage: '系统消息', respectfully: '此致敬礼,', rating: '评分', ratingWebsite: '网站', ratingBudget: '家庭预算管理', userMessage: '用户消息', date: '日期:', title: '标题:', from: '发件人:', systemReply: '系统回复' },
    system: { systemLabel: '系统', selectAction: '从右侧栏选择操作', users: '用户', buildMessages: '构建日志', schedule: 'טבלאות ונתונים', pr: '公关', publishedDate: '发布日期:', reset: '重置', saved: '已保存', records: '条记录', scheduleSubject: '主题', schedulePriceUSD: '价格\n[$]', schedulePeriod: '周期\n[月]', scheduleNotes: '备注', clear: '清除', pause: '暂停', resume: '继续', active: '● 活跃', paused: '已暂停', lines: '行', filter: '筛选', refresh: '刷新', loading: '加载中...', loadingBuild: '正在加载构建数据...', error: '错误', noBuildData: '无构建数据。请运行 Release_KeyClick.bat', networkError: '网络错误', adminButton: '系统管理', generalGroup: '常规', colName: '姓名', colCurrency: '货币', colCreated: '创建时间', colActive: '已激活', colAppInstalled: '应用程序', colLicenceType: '许可证类型', colSystemForce: '系统模式', distributionDay: '分发日X', messages: '消息', send: '发送', sent: '已发送!', reply: '回复', noMessages: '无消息', replySent: '回复已发送!', ref: '参考', msgNo: '编号', replyToRef: '回复参考', msgNumber: '消息编号', new: '新', delete: '删除', newMessage: '+ 新消息', selectToView: '选择消息以查看', monitor: '监控', systemData: '系统数据', resetTable: '重置表格', debug: '调试', db: 'DB', sensitivePoints: '敏感点', productVersionTable: '更新标签中的产品版本表' },
    currencyNames: { ILS: '谢克尔', USD: '美元', GBP: '英镑', EUR: '欧元', RUB: '卢布', JPY: '日元', SAR: '里亚尔', CNY: '人民币', INR: '卢比' },
    updates: { colDate: '日期与时间', colProduct: '产品', colVersion: '版本', colTitle: '标题', productKeyClick: 'KeyClick 网站', productMFinance: 'M Finance 家庭预算' },
    reminders: { loginRequired: '需要登录才能查看提醒', titlePh: '提醒标题', timePh: '时间', add: '+ 添加', noReminders: '暂无提醒' },
    guides: { overview: '概述', userGuide: '用户指南', financeOverviewTitle: '什么是 M Finance', financeOverviewDesc: '家庭预算管理简介 — 账户、交易、分类和预测，以及适用对象。', financeGuideTitle: '分步使用说明', financeGuideDesc: '附截图的图文指南：安装、连接账户、分类和报表。', financeVideosTitle: '简短教程', financeVideosDesc: '家庭预算管理每项主要功能的简短视频教程。', siteOverviewTitle: '网站提供的内容', siteOverviewDesc: 'KeyClick 平台简介 — 产品、服务与客户关系。', siteGuideTitle: '注册与导航', siteGuideDesc: '如何注册、登录并在网站上找到每项服务。', siteVideosTitle: '网站演示', siteVideosDesc: '网站主要功能的简短录制演示。' },
    banking: { autoDetectFailed: '自动检测失败 — 请手动选择', detectionError: '检测错误', loadBanksError: '加载银行时出错', plaidTokenError: 'Plaid 令牌错误', bankConnected: '银行已连接', connectionError: '连接错误', linkOpened: '已打开与{name}的连接窗口。批准后请返回并点击刷新。', linkCreateError: '创建银行链接时出错', refreshing: '正在刷新...', updated: '已更新', fetchingData: '正在获取数据...', noAccountsConnected: '没有已连接的账户', downloadedFiles: '已下载 {count} 个文件', downloadError: '下载错误', connectBankTitle: '连接银行', autoDetect: '自动检测', orManually: '或手动选择', unitedStates: '美国', back: '返回', selectInstitution: '选择银行', noInstitutions: '没有银行', refresh: '刷新', downloadFiles: '下载文件' } },
  { code: 'it', flag: 'איטליה',  name: 'Italiano', welcome: 'Benvenuto',
    menu: ['Feedback','Aggiornamenti','Messaggi','Promemoria','Servizi bancari','Pagina personale'],
    card: { title: 'Gestione del budget familiare', namePh: 'Nome / Cognome', emailPh: 'Email / Indirizzo email', passPh: 'Password', confirmPassPh: 'Conferma password', register: 'Registrati', login: 'Accedi', update: 'Aggiorna', line1: 'Durante il periodo di lancio', line2: 'Gratis', errName: 'Inserisci il tuo nome', errEmail: 'Inserisci un indirizzo email valido', errPassLen: 'La password deve contenere almeno 6 caratteri', errPassMatch: 'Le password non corrispondono', errEmailExists: 'Email già registrata', cancel: 'Annulla', install: 'Installa', library: 'File guida', run: 'Avvia', videos: 'Video', guide: 'Guida', ok: 'OK', msgAlreadyInstalled: 'Già installato\nNessuna reinstallazione necessaria', msgDownloading: 'Download del file di installazione', msgInstallComplete: 'Salva ed esegui il file\nper completare l\'installazione', msgDownloadError: 'Errore di download\nRiprova', mFinance: 'M Finance', msgExists: 'Utente già registrato\ncon questi dati', msgUpdated: 'Dati aggiornati con successo', msgRegistered: 'Registrazione completata', existingCustomer: 'Cliente esistente', newCustomer: 'Nuovo cliente', notRecognized: 'Cliente non trovato. Clicca per registrarti', msgSelectPlan: 'Seleziona un piano nella tua pagina personale', infoServices: 'Servizi informativi', guidesAndVideos: 'Guide e Video', siteHeaderPrefix: 'Il sito web di', theWebsite: 'Il Sito' },
    profile: { fullName: 'Nome completo', email: 'Email', ip: 'IP', language: 'Lingua', country: 'Paese', plan: 'Piano', planStart: 'Inizio piano', planEnd: 'Fine piano', unlimited: 'Illimitato', comingSoon: 'Prossimamente', choosePlan: 'Scegli piano', close: '✕ Chiudi', loginRequired: 'Accesso richiesto', login: 'Accedi', products: 'Prodotti', change: 'Modifica',
      price: 'Prezzo', changePlan: 'Cambia piano', planName: 'Nome', planFrom: 'Da', planTo: 'A', back: 'Indietro', currencyLocal: '€', free: 'Gratuito',       planNames: { System_Free_Run: 'Lancio', User_Trial: 'Prova', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensile', User_Annual: 'Annuale', User_One_Time: 'Singolo', System_Suspended_NonPayment: 'Sospeso', User_Cancelled: 'Annullato' } },
    feedback: { customerRelations: 'Relazioni clienti', systemMessage: 'Messaggio di sistema', respectfully: 'Cordiali saluti,', rating: 'Valutazione', ratingWebsite: 'Sito web', ratingBudget: 'Gestione del budget familiare', userMessage: 'Messaggio utente', date: 'Data:', title: 'Titolo:', from: 'Da:', systemReply: 'Risposta di sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleziona azione dalla barra destra', users: 'Utenti', buildMessages: 'Registro di build', schedule: 'טבלאות ונתונים', pr: 'RP', publishedDate: 'Pubblicato il:', reset: 'Reimposta', saved: 'Salvato', records: 'record', scheduleSubject: 'Oggetto', schedulePriceUSD: 'Prezzo\n[$]', schedulePeriod: 'Periodo\n[mesi]', scheduleNotes: 'Note', clear: 'Cancella', pause: 'Pausa', resume: 'Riprendi', active: '● Attivo', paused: 'In pausa', lines: 'righe', filter: 'Filtra', refresh: 'Aggiorna', loading: 'Caricamento...', loadingBuild: 'Caricamento dati di build...', error: 'Errore', noBuildData: 'Nessun dato. Eseguire Release_KeyClick.bat', networkError: 'Errore di rete', adminButton: 'Area di sistema', generalGroup: 'Generale', colName: 'Nome', colCurrency: 'Valuta', colCreated: 'Creato', colActive: 'Attivo', colAppInstalled: 'App', colLicenceType: 'Tipo di licenza', colSystemForce: 'Modalità sistema', distributionDay: 'Giorno di distribuzione X', messages: 'Messaggi', send: 'Invia', sent: 'Inviato!', reply: 'Rispondi', noMessages: 'Nessun messaggio', replySent: 'Risposta inviata!', ref: 'Rif.', msgNo: 'N°', replyToRef: 'Risposta a rif.', msgNumber: 'Messaggio N°', new: 'Nuovo', delete: 'Elimina', newMessage: '+ Nuovo messaggio', selectToView: 'Seleziona un messaggio', monitor: 'Monitor', systemData: 'Dati di sistema', resetTable: 'Reimposta tabella', debug: 'Debug', db: 'DB', sensitivePoints: 'Punti sensibili', productVersionTable: 'Tabella versioni (scheda aggiornamenti)' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollaro', GBP: 'Sterlina', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' },
    updates: { colDate: 'Data e ora', colProduct: 'Prodotto', colVersion: 'Versione', colTitle: 'Titolo', productKeyClick: 'KeyClick Sito web', productMFinance: 'M Finance Gestione budget' },
    reminders: { loginRequired: 'Accesso richiesto per i promemoria', titlePh: 'Titolo promemoria', timePh: 'Ora', add: '+ Aggiungi', noReminders: 'Nessun promemoria' },
    guides: { overview: 'Descrizione generale', userGuide: 'Guida utente', financeOverviewTitle: 'Panoramica di M Finance', financeOverviewDesc: 'Una breve panoramica della gestione del bilancio familiare — conti, transazioni, categorie e previsioni, e a chi è destinata.', financeGuideTitle: 'Utilizzo passo dopo passo', financeGuideDesc: "Una guida scritta con screenshot: installazione, collegamento dei conti, categorizzazione e report.", financeVideosTitle: 'Brevi tutorial', financeVideosDesc: 'Brevi video tutorial per ogni funzione principale della gestione del bilancio familiare.', siteOverviewTitle: 'Cosa offre il sito', siteOverviewDesc: 'Un breve tour della piattaforma KeyClick — prodotti, servizi e relazioni con i clienti.', siteGuideTitle: 'Registrazione e navigazione', siteGuideDesc: 'Come registrarsi, accedere e trovare ogni servizio sul sito.', siteVideosTitle: 'Demo del sito', siteVideosDesc: 'Brevi demo registrate delle principali funzionalità del sito.' },
    banking: { autoDetectFailed: 'Rilevamento automatico fallito — scegli manualmente', detectionError: 'Errore di rilevamento', loadBanksError: 'Errore nel caricamento delle banche', plaidTokenError: 'Errore token Plaid', bankConnected: 'Banca collegata', connectionError: 'Errore di connessione', linkOpened: 'È stata aperta una finestra di collegamento per {name}. Dopo aver approvato, torna e clicca su aggiorna.', linkCreateError: 'Errore nella creazione del collegamento bancario', refreshing: 'Aggiornamento...', updated: 'Aggiornato', fetchingData: 'Recupero dati...', noAccountsConnected: 'Nessun conto collegato', downloadedFiles: '{count} file scaricati', downloadError: 'Errore di download', connectBankTitle: 'Collega banca', autoDetect: 'Rilevamento automatico', orManually: 'o manualmente', unitedStates: 'Stati Uniti', back: 'Indietro', selectInstitution: 'Seleziona banca', noInstitutions: 'Nessuna banca', refresh: 'Aggiorna', downloadFiles: 'Scarica file' } },
  { code: 'hi', flag: 'הודו',    name: 'हिंदी',     welcome: 'स्वागत है',
    menu: ['फीडबैक','अपडेट','संदेश','अनुस्मारक','बैंकिंग सेवाएं','व्यक्तिगत पृष्ठ'],
    card: { title: 'घरेलू बजट प्रबंधन', namePh: 'नाम / उपनाम', emailPh: 'ईमेल / ईमेल पता', passPh: 'पासवर्ड', confirmPassPh: 'पासवर्ड की पुष्टि करें', register: 'पंजीकरण', login: 'लॉग इन', update: 'अपडेट', line1: 'लॉन्च अवधि के दौरान', line2: 'मुफ्त', errName: 'कृपया अपना नाम दर्ज करें', errEmail: 'कृपया एक मान्य ईमेल दर्ज करें', errPassLen: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए', errPassMatch: 'पासवर्ड मेल नहीं खाते', errEmailExists: 'ईमेल पहले से पंजीकृत है', cancel: 'रद्द करें', install: 'इंस्टॉल करें', library: 'गाइड फ़ाइलें', run: 'चलाएं', videos: 'वीडियो', guide: 'मार्गदर्शिका', ok: 'ठीक है', msgAlreadyInstalled: 'पहले से इंस्टॉल है\nपुनः इंस्टॉल की आवश्यकता नहीं', msgDownloading: 'इंस्टॉलेशन फ़ाइल डाउनलोड हो रही है', msgInstallComplete: 'फ़ाइल सहेजें और चलाएं\nइंस्टॉलेशन पूरा करने के लिए', msgDownloadError: 'डाउनलोड त्रुटि\nपुनः प्रयास करें', mFinance: 'M Finance', msgExists: 'यह उपयोगकर्ता पहले से पंजीकृत है\nइन विवरणों के साथ', msgUpdated: 'विवरण सफलतापूर्वक अपडेट किए गए', msgRegistered: 'पंजीकरण पूरा हो गया', existingCustomer: 'मौजूदा ग्राहक', newCustomer: 'नया ग्राहक', notRecognized: 'ग्राहक नहीं मिला। पंजीकरण के लिए क्लिक करें', msgSelectPlan: 'कृपया अपने व्यक्तिगत पृष्ठ पर एक योजना चुनें', infoServices: 'सूचना सेवाएं', guidesAndVideos: 'गाइड और वीडियो', siteHeaderPrefix: 'आधिकारिक वेबसाइट:', theWebsite: 'वेबसाइट' },
    profile: { fullName: 'पूरा नाम', email: 'ईमेल', ip: 'IP', language: 'भाषा', country: 'देश', plan: 'योजना', planStart: 'योजना शुरू', planEnd: 'योजना समाप्त', unlimited: 'असीमित', comingSoon: 'जल्द आ रहा है', choosePlan: 'योजना चुनें', close: '✕ बंद करें', loginRequired: 'लॉगिन आवश्यक है', login: 'लॉग इन', products: 'उत्पाद', change: 'बदलें',
      price: 'मूल्य', changePlan: 'योजना बदलें', planName: 'नाम', planFrom: 'से', planTo: 'तक', back: 'वापस', currencyLocal: '₹', free: 'मुफ्त',       planNames: { System_Free_Run: 'परीक्षण रन', User_Trial: 'परीक्षण', User_VIP_Free: 'VIP', System_Owner: 'सिस्टम', User_Monthly: 'मासिक', User_Annual: 'वार्षिक', User_One_Time: 'एकल', System_Suspended_NonPayment: 'निलंबित', User_Cancelled: 'रद्द' } },
    feedback: { customerRelations: 'ग्राहक सेवा', systemMessage: 'सिस्टम संदेश', respectfully: 'सादर,', rating: 'रेटिंग', ratingWebsite: 'वेबसाइट', ratingBudget: 'गृह बजट प्रबंधन', userMessage: 'उपयोगकर्ता संदेश', date: 'तारीख:', title: 'शीर्षक:', from: 'से:', systemReply: 'सिस्टम उत्तर' },
    system: { systemLabel: 'सिस्टम', selectAction: 'दाहिनी बार से क्रिया चुनें', users: 'उपयोगकर्ता', buildMessages: 'बिल्ड लॉग', schedule: 'טבלאות ונתונים', pr: 'जनसंपर्क', publishedDate: 'प्रकाशन तिथि:', reset: 'रीसेट', saved: 'सहेजा', records: 'रिकॉर्ड', scheduleSubject: 'विषय', schedulePriceUSD: 'मूल्य\n[$]', schedulePeriod: 'अवधि\n[माह]', scheduleNotes: 'नोट्स', clear: 'साफ़ करें', pause: 'रोकें', resume: 'जारी रखें', active: '● सक्रिय', paused: 'रुका हुआ', lines: 'पंक्तियाँ', filter: 'फ़िल्टर', refresh: 'ताज़ा करें', loading: 'लोड हो रहा है...', loadingBuild: 'बिल्ड डेटा लोड हो रहा है...', error: 'त्रुटि', noBuildData: 'कोई डेटा नहीं। Release_KeyClick.bat चलाएं', networkError: 'नेटवर्क त्रुटि', adminButton: 'सिस्टम उपयोग', generalGroup: 'सामान्य', colName: 'नाम', colCurrency: 'मुद्रा', colCreated: 'निर्माण तिथि', colActive: 'सक्रिय', colAppInstalled: 'ऐप', colLicenceType: 'लाइसेंस प्रकार', colSystemForce: 'सिस्टम मोड', distributionDay: 'वितरण दिवस X', messages: 'संदेश', send: 'भेजें', sent: 'भेजा!', reply: 'उत्तर', noMessages: 'कोई संदेश नहीं', replySent: 'उत्तर भेजा!', ref: 'संदर्भ', msgNo: 'क्र.', replyToRef: 'संदर्भ का उत्तर', msgNumber: 'संदेश क्र.', new: 'नया', delete: 'हटाएं', newMessage: '+ नया संदेश', selectToView: 'देखने के लिए संदेश चुनें', monitor: 'मॉनिटर', systemData: 'सिस्टम डेटा', resetTable: 'टेबल रीसेट', debug: 'डीबग', db: 'DB', sensitivePoints: 'संवेदनशील बिंदु', productVersionTable: 'अपडेट टैब में संस्करण तालिका' },
    currencyNames: { ILS: 'शेकेल', USD: 'डॉलर', GBP: 'पाउंड', EUR: 'यूरो', RUB: 'रूबल', JPY: 'येन', SAR: 'रियाल', CNY: 'युआन', INR: 'रुपया' },
    updates: { colDate: 'दिनांक और समय', colProduct: 'उत्पाद', colVersion: 'संस्करण', colTitle: 'शीर्षक', productKeyClick: 'KeyClick वेबसाइट', productMFinance: 'M Finance घरेलू बजट' },
    reminders: { loginRequired: 'अनुस्मारक देखने के लिए लॉगिन आवश्यक है', titlePh: 'अनुस्मारक शीर्षक', timePh: 'समय', add: '+ जोड़ें', noReminders: 'कोई अनुस्मारक नहीं' },
    guides: { overview: 'सामान्य विवरण', userGuide: 'उपयोगकर्ता गाइड', financeOverviewTitle: 'M Finance क्या है', financeOverviewDesc: 'घरेलू बजट प्रबंधन का संक्षिप्त विवरण — खाते, लेन-देन, श्रेणियां और पूर्वानुमान, और यह किसके लिए है।', financeGuideTitle: 'चरण-दर-चरण उपयोग', financeGuideDesc: 'स्क्रीनशॉट के साथ लिखित गाइड: इंस्टॉलेशन, खाते जोड़ना, वर्गीकरण और रिपोर्ट।', financeVideosTitle: 'संक्षिप्त ट्यूटोरियल', financeVideosDesc: 'घरेलू बजट प्रबंधन की हर मुख्य विशेषता के लिए संक्षिप्त वीडियो ट्यूटोरियल।', siteOverviewTitle: 'वेबसाइट क्या प्रदान करती है', siteOverviewDesc: 'KeyClick प्लेटफ़ॉर्म का संक्षिप्त भ्रमण — उत्पाद, सेवाएं और ग्राहक संबंध।', siteGuideTitle: 'पंजीकरण और नेविगेशन', siteGuideDesc: 'कैसे पंजीकरण करें, लॉगिन करें और वेबसाइट पर हर सेवा खोजें।', siteVideosTitle: 'वेबसाइट डेमो', siteVideosDesc: 'वेबसाइट की मुख्य विशेषताओं के संक्षिप्त रिकॉर्ड किए गए डेमो।' },
    banking: { autoDetectFailed: 'स्वचालित पहचान विफल — मैन्युअल रूप से चुनें', detectionError: 'पहचान त्रुटि', loadBanksError: 'बैंक लोड करने में त्रुटि', plaidTokenError: 'Plaid टोकन त्रुटि', bankConnected: 'बैंक सफलतापूर्वक जुड़ा', connectionError: 'कनेक्शन त्रुटि', linkOpened: '{name} के लिए कनेक्शन विंडो खुली। स्वीकृति के बाद वापस आकर रिफ्रेश पर क्लिक करें।', linkCreateError: 'बैंक लिंक बनाने में त्रुटि', refreshing: 'रीफ्रेश हो रहा है...', updated: 'अपडेट हो गया', fetchingData: 'डेटा प्राप्त हो रहा है...', noAccountsConnected: 'कोई खाता कनेक्ट नहीं है', downloadedFiles: '{count} फ़ाइलें डाउनलोड हुईं', downloadError: 'डाउनलोड त्रुटि', connectBankTitle: 'बैंक कनेक्ट करें', autoDetect: 'स्वचालित पहचान', orManually: 'या मैन्युअल रूप से', unitedStates: 'संयुक्त राज्य अमेरिका', back: 'वापस', selectInstitution: 'बैंक चुनें', noInstitutions: 'कोई बैंक नहीं', refresh: 'रीफ्रेश', downloadFiles: 'फ़ाइलें डाउनलोड करें' } },
]

type UserRecord = { id: number; name: string; last_name?: string; email: string; language: string; M_Finance_license_type: string; is_active: boolean; is_M_Finance_installed: boolean; last_ip?: string; country?: string; created_at?: string; plan_start?: string; plan_end?: string; system_force?: string | null; currency?: string | null; notes?: string | null; weighted_score?: number | null }

const _txCache = new Map<string, string>()
async function _txChunk(chunk: string, lc: string): Promise<string> {
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=he|${lc}`)
    const d = await res.json()
    return d.responseData?.translatedText ?? chunk
  } catch { return chunk }
}
async function translateFromHe(text: string, toLang: string): Promise<string> {
  if (!text.trim() || toLang === 'he') return text
  const lc = toLang === 'zh' ? 'zh-CN' : toLang
  const key = `${lc}:${text}`
  if (_txCache.has(key)) return _txCache.get(key)!
  // MyMemory free tier: max ~500 chars per request — split on paragraph breaks
  const MAX = 480
  let result: string
  if (text.length <= MAX) {
    result = await _txChunk(text, lc)
  } else {
    const paragraphs = text.split('\n')
    const chunks: string[] = []
    let cur = ''
    for (const line of paragraphs) {
      if ((cur + '\n' + line).length > MAX && cur) { chunks.push(cur); cur = line }
      else { cur = cur ? cur + '\n' + line : line }
    }
    if (cur) chunks.push(cur)
    const translated = await Promise.all(chunks.map(c => _txChunk(c, lc)))
    result = translated.join('\n')
  }
  _txCache.set(key, result)
  return result
}

export default function Home() {
  const [langIdx, setLangIdx]       = useState(0)
  const [activePage, setActivePage] = useState<string | null>(null)
  const [systemMessage, setSystemMessage] = useState('')
  const [prText, setPrText] = useState('')
  const [prDate, setPrDate] = useState('')
  const [popupMsg, setPopupMsg] = useState<{ title: string; subtitle?: string; body: string; bodyColor?: string } | null>(null)
  const [reminderNotif, setReminderNotif] = useState<ReminderRecord[] | null>(null)
  const [siteVersion, setSiteVersion] = useState({ line1: '', line2: '' })
  const [debugLog, setDebugLog]       = useState<string[]>([])
  const [debugPaused, setDebugPaused] = useState(false)
  const debugEndRef    = useRef<HTMLDivElement>(null)
  const debugPausedRef = useRef(false)
  const debugWinRef    = useRef<Window | null>(null)
  const mfChainRef     = useRef(false)
  const [Current_User_Pointer_to_DB, set_Current_User_Pointer_to_DB] = useState<UserRecord | null>(null)
  const [clientIp, setClientIp] = useState('')
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
        setReminderNotif(upcoming)
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
      fetch('/api/current-user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field: 'is_m_finance_installed', value: true }) })
        .then(r => r.json())
        .then(d => { if (d.ok && d.user) set_Current_User_Pointer_to_DB(d.user); dbg('installCallback', `DB updated ok=${d.ok}`) })
        .catch(e => dbg('installCallback', `DB update failed: ${String(e)}`))
      handleRun()
    }
    const bankingParam = params.get('banking')
    if (bankingParam === 'success') {
      window.history.replaceState({}, '', window.location.pathname)
      setActivePage('4')
    } else if (bankingParam === 'error') {
      window.history.replaceState({}, '', window.location.pathname)
      setActivePage('4')
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

  function handleRun() {
    dbg('handleRun', 'mfinance:// launch')
    window.location.href = 'mfinance://'
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

      {reminderNotif && reminderNotif.length > 0 && (
        <div style={{ position: 'fixed', top: '70px', insetInlineEnd: '20px', zIndex: 9000, minWidth: '280px', maxWidth: '360px', direction: 'rtl', fontFamily: 'Arial, sans-serif', animation: 'slideIn 0.3s ease' }}>
          <div style={{ background: '#fff', border: '2px solid #003399', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,60,0.22)', overflow: 'hidden' }}>
            <div style={{ background: '#003399', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '15px' }}>🔔 {lang.menu[3]}</span>
              <button onClick={() => setReminderNotif(null)} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reminderNotif.map((r, i) => {
                const [y,m,day] = r.date.split('-')
                const isToday = r.date === new Date().toISOString().slice(0,10)
                return (
                  <div key={r.id} style={{ borderBottom: i < reminderNotif.length - 1 ? '1px solid #e0e4f0' : 'none', paddingBottom: i < reminderNotif.length - 1 ? '10px' : 0 }}>
                    <div style={{ fontWeight: 'bold', color: '#003399', fontSize: '14px' }}>{r.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      {isToday && <span style={{ background: '#cc0000', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '8px' }}>{lang.system.new}</span>}
                      <span style={{ color: '#888', fontSize: '12px', direction: 'ltr' }}>{`${day}/${m}/${y}`}{r.time ? ' ' + r.time : ''}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

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
            <PageContent page={activePage} lang={lang} langIdx={langIdx} onChangeLang={changeLang} clientIp={clientIp} user={Current_User_Pointer_to_DB} systemMessage={systemMessage} onSetSystemMessage={setSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} onClose={() => setActivePage(null)} onLogin={(user) => {
              set_Current_User_Pointer_to_DB(user)
              if (mfChainRef.current) {
                mfChainRef.current = false
                if (!user.is_active) { setActivePage(null); setPopupMsg({ title: lang.card.title, subtitle: 'M Finance', body: lang.card.msgSelectPlan }); return }
                if (!user.is_M_Finance_installed) setActivePage('mf-install')
                else { setActivePage(null); handleRun() }
              }
            }} onUserUpdate={(user) => set_Current_User_Pointer_to_DB(user)} onNavigate={(p) => setActivePage(p)} onMsg={setPopupMsg} onDbg={dbg} onInstall={handleInstall} onRun={handleRun} onOpenDebug={() => {
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
          {/* 1. מדריכים וסרטונים */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '16px auto 10px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            <button onClick={() => setActivePage(activePage === 'guides' ? null : 'guides')}
              style={{
                display: 'block', width: '100%', background: activePage === 'guides' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)',
                color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center',
                fontSize: lang.code === 'he' || lang.code === 'ar' ? '17px' : '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{lang.card.guidesAndVideos}</button>
          </div>

          {/* 2. ניהול תקציב בית */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '10px auto', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '22px 6px 8px', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 5px', fontSize: '11px', fontWeight: 'bold', color: '#FFD700', whiteSpace: 'nowrap', maxWidth: '116px', overflow: 'hidden', textOverflow: 'ellipsis' }}>M Finance</div>
            <button onClick={() => { mfChainRef.current = true; setActivePage('mf-login') }}
              style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center', fontSize: lang.code === 'he' || lang.code === 'ar' ? '22px' : '18px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.2', fontFamily: 'var(--font-amatic),"Amatic SC",cursive', textShadow: '0 0 8px rgba(255,215,0,0.8), 0 1px 3px rgba(0,0,0,0.9)', letterSpacing: '1px', WebkitTextStroke: '0.6px #FFD700', wordBreak: 'break-word' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{lang.card.title}</button>
          </div>

          {/* 3. קשרי לקוחות */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '24px auto 10px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 5px', fontSize: '11px', fontWeight: 'bold', color: '#FFD700', whiteSpace: 'nowrap', maxWidth: '116px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lang.feedback.customerRelations}</div>
            {[0, 5].map(idx => (
              <button key={idx} onClick={() => setActivePage(String(idx) === activePage ? null : String(idx))}
                style={{
                  display: 'block', width: '100%', background: activePage === String(idx) ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)',
                  color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center',
                  fontSize: lang.code === 'he' || lang.code === 'ar' ? '17px' : '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3', wordBreak: 'break-word',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >{lang.menu[idx]}</button>
            ))}
          </div>

          {/* 4. שרותי מידע */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '24px auto 10px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 5px', fontSize: '11px', fontWeight: 'bold', color: '#FFD700', whiteSpace: 'nowrap', maxWidth: '116px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lang.card.infoServices}</div>
            {[1, 3].map(idx => (
              <button key={idx} onClick={() => setActivePage(String(idx) === activePage ? null : String(idx))}
                style={{
                  display: 'block', width: '100%', background: activePage === String(idx) ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)',
                  color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center',
                  fontSize: lang.code === 'he' || lang.code === 'ar' ? '17px' : '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3', wordBreak: 'break-word',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >{lang.menu[idx]}</button>
            ))}
          </div>

          {/* 5. שרותים בנקאיים */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '10px auto', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            <button onClick={() => setActivePage(activePage === '4' ? null : '4')}
              style={{ display: 'block', width: '100%', background: activePage === '4' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center', fontSize: lang.code === 'he' || lang.code === 'ar' ? '15px' : '13px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3', wordBreak: 'break-word' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{lang.menu[4]}</button>
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
        <span style={{ color: '#FFD700' }}>- Avigdor Meir -</span>
        <span style={{ color: '#FFD700' }}>{siteVersion.line2 || ''}</span>
      </footer>

    </div>
  )
}

const SCHEDULE_SUBJECTS = ['יום ה-X ההפצה', 'תקופת הרצה', 'תקופת ניסיון', 'VIP', 'חודשי', 'שנתי', 'חד פעמי'] as const
function fmtDate(d: string) { const [y, m, day] = d.split('-'); return `${day}/${m}/${y.slice(2)}` }
type ScheduleRow = { price: string; months: string; fromDate: string; toDate: string; notes: string }
type FeedbackMessage = { id: number; user_id: number | null; user_name: string | null; sent_date: string | null; title: string | null; body: string | null; rating_site: number | null; rating_budget: number | null; reply_text: string | null; reply_date: string | null; is_read: boolean; created_at: string; sender_ip?: string | null }

function SystemPage({ user, lang, langIdx, onChangeLang, onOpenDebug, onDbg, onUserUpdate, onSetSystemMessage, prText, setPrText, prDate, setPrDate, onNavigate, onInstall, onRun }: { user: UserRecord | null; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; onOpenDebug: () => void; onDbg: (func: string, msg: string) => void; onUserUpdate: (u: UserRecord) => void; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void; onNavigate: (page: string) => void; onInstall: () => void; onRun: () => void }) {
  const [view, setView] = useState<'none' | 'db' | 'users' | 'schedule' | 'pr' | 'messages' | 'sensitive' | 'tests' | 'banking'>('none')
  const [isScanning, setIsScanning] = useState(false)
  const [weightedRows, setWeightedRows] = useState<{ weight: string; metric: string; explanation: string }[]>([
    { weight: '20', metric: 'לקוח רשום',        explanation: 'נרשם למערכת' },
    { weight: '10', metric: 'לקוח פעיל',        explanation: 'פעיל' },
    { weight: '30', metric: 'אפליקציה מותקנת',  explanation: 'ניהול תקציב בית' },
    { weight: '30', metric: 'תכנית תקינה',      explanation: 'תכנית רכישה ותשלומים תקינים' },
    { weight: '5',  metric: 'משוב חיובי',       explanation: 'כל המשובים חיוביים' },
    { weight: '5',  metric: 'מתעניין',          explanation: 'מרבה להתכתב (יותר מ 3 לחודש)' },
  ])
  const [activeMfBtnTest, setActiveMfBtnTest] = useState<string | null>(null)
  const [usersEditMode, setUsersEditMode] = useState(false)
  const [pendingUserEdits, setPendingUserEdits] = useState<Record<string, Record<string, unknown>>>({})
  const [debugOpen, setDebugOpen] = useState(false)
  const [buildOpen, setBuildOpen] = useState(false)
  const [prSaved, setPrSaved] = useState(false)
  const [updatesResetDone, setUpdatesResetDone] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const buildWinRef = React.useRef<Window | null>(null)
  const [dbTables, setDbTables] = useState<{ name: string; rows: Record<string, unknown>[] }[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])
  const [expandedUser, setExpandedUser] = useState<number | null>(null)
  const [prTxText, setPrTxText] = useState('')
  const [bankingData, setBankingData] = useState<{ connections: Record<string,unknown>[]; accounts: Record<string,unknown>[]; transactions: Record<string,unknown>[] } | null>(null)
  const [bankingStatus, setBankingStatus] = useState<{ nordigen: boolean; plaid: boolean; il: boolean; groq: boolean } | null>(null)
  const [prEditing, setPrEditing] = useState(false)
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
    if (lang.code === 'he' || !prText) { setPrTxText(''); return }
    if (prEditing) return
    translateFromHe(prText, lang.code).then(t => setPrTxText(t))
  }, [prText, lang.code, prEditing])

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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <PageHeader subtitle={lang.system.adminButton} lang={lang} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

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
                <textarea value={prEditing ? prText : (lang.code !== 'he' && prTxText) || prText} onChange={e => setPrText(e.target.value)} onFocus={() => setPrEditing(true)} onBlur={() => setPrEditing(false)} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', minHeight: '50px', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: prEditing || lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr', background: 'transparent' }} />
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

        {view === 'sensitive' && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: '#555', borderRadius: '8px', padding: '10px 8px' }}>
              <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px', width: '130px' }}>
                <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>{lang.system.productVersionTable}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button style={{ ...sysBtnSm, background: updatesResetDone ? '#006600' : '#003399' }} onClick={() => setShowResetConfirm(true)}>
                    {updatesResetDone ? '✓ ' + lang.system.reset : lang.system.resetTable}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResetConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#1e1e2e', border: '2px solid #cc9900', borderRadius: '12px', padding: '28px 32px', minWidth: '300px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', direction: 'rtl' }}>
              <div style={{ color: '#FFD700', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #cc9900', paddingBottom: '10px', width: '100%', textAlign: 'center' }}>{lang.system.productVersionTable}</div>
              <div style={{ color: '#ccc', fontSize: '14px', textAlign: 'center' }}>{lang.system.resetTable}?</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button onClick={() => {
                  setShowResetConfirm(false)
                  fetch('/api/updates', { method: 'DELETE' })
                    .then(() => { setUpdatesResetDone(true); setTimeout(() => setUpdatesResetDone(false), 2000) })
                    .catch(() => {})
                }} style={{ fontSize: '13px', padding: '6px 20px', background: '#003399', color: '#FFD700', border: '1px solid #cc9900', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.reset}</button>
                <button onClick={() => setShowResetConfirm(false)} style={{ fontSize: '13px', padding: '6px 20px', background: '#444', color: '#ccc', border: '1px solid #666', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.card.cancel}</button>
              </div>
            </div>
          </div>
        )}

        {view === 'banking' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

            {/* ספקים */}
            <div style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 10, direction: 'rtl' }}>ספקים</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { key: 'nordigen', name: 'GoCardless Nordigen', desc: 'אירופה — 2300+ בנקים' },
                  { key: 'plaid',    name: 'Plaid',               desc: 'ארה"ב — אלפי בנקים' },
                  { key: 'il',       name: 'ישראל (Salt Edge)',   desc: 'ישראל — בנקים וכרטיסי אשראי' },
                  { key: 'groq',     name: 'Groq AI',             desc: 'זיהוי מדינה אוטומטי' },
                ].map(p => {
                  const active = bankingStatus?.[p.key as keyof typeof bankingStatus]
                  return (
                    <div key={p.key} style={{ border: `1px solid ${active ? '#4CAF50' : '#555'}`, borderRadius: 6, padding: '8px 14px', background: '#111' }}>
                      <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>{p.name}</div>
                      <div style={{ color: '#aaa', fontSize: 11 }}>{p.desc}</div>
                      <div style={{ color: active ? '#4CAF50' : '#ff6b6b', fontSize: 11, marginTop: 4 }}>
                        {bankingStatus === null ? '...' : active ? '✓ מוגדר' : '✗ ממתין לרישום'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* API Routes */}
            <div style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 8 }}>API Routes</div>
              <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#111' }}>
                    <th style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'left' }}>Route</th>
                    <th style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'left' }}>ספק</th>
                    <th style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'right' }}>תפקיד</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { route: '/api/banking/nordigen/token',        provider: 'Nordigen',       desc: 'access token מ-Nordigen' },
                    { route: '/api/banking/nordigen/institutions', provider: 'Nordigen',       desc: 'רשימת בנקים לפי מדינה' },
                    { route: '/api/banking/nordigen/connect',      provider: 'Nordigen',       desc: 'יצירת requisition + קישור לבנק' },
                    { route: '/api/banking/nordigen/callback',     provider: 'Nordigen',       desc: 'קבלת אישור + שמירה ב-DB' },
                    { route: '/api/banking/plaid/link-token',      provider: 'Plaid',          desc: 'יצירת Link Token' },
                    { route: '/api/banking/plaid/exchange',        provider: 'Plaid',          desc: 'המרת public_token לאחר חיבור' },
                    { route: '/api/banking/plaid/sync',            provider: 'Plaid',          desc: 'sync עסקאות + יתרות' },
                    { route: '/api/banking/il/connect',            provider: 'ישראל',          desc: 'התחברות לספק ישראלי' },
                    { route: '/api/banking/il/callback',           provider: 'ישראל',          desc: 'callback + שמירה ב-DB' },
                    { route: '/api/banking/accounts',              provider: 'משותף',          desc: 'חשבונות המשתמש' },
                    { route: '/api/banking/transactions',          provider: 'משותף',          desc: 'עסקאות + sync מהספק' },
                    { route: '/api/banking/detect-provider',        provider: 'Groq AI',         desc: 'זיהוי אוטומטי: מדינה → ספק' },
                    { route: '/api/banking/status',                provider: 'מערכת',          desc: 'סטטוס credentials' },
                    { route: '/api/banking/data',                  provider: 'מערכת',          desc: 'נתוני DB' },
                  ].map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#111' }}>
                      <td style={{ border: '1px solid #222', padding: '3px 8px', fontFamily: 'monospace' }}>
                        <a href={r.route} target="_blank" rel="noreferrer" style={{ color: '#7eb8f7', textDecoration: 'underline', cursor: 'pointer' }}>{r.route}</a>
                      </td>
                      <td style={{ border: '1px solid #222', padding: '3px 8px', color: '#aaa' }}>{r.provider}</td>
                      <td style={{ border: '1px solid #222', padding: '3px 8px', color: '#ccc', textAlign: 'right', direction: 'rtl' }}>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* טבלת חשבונות ויתרות */}
            {(() => {
              const accs = bankingData?.accounts ?? []
              const conns = bankingData?.connections ?? []
              const PLACEHOLDER = [
                { id: 'ph1', name: 'Bank of America', iban: '****4521', balance: '', currency: 'USD', provider: 'Plaid' },
                { id: 'ph2', name: 'Deutsche Bank',   iban: '****8832', balance: '', currency: 'EUR', provider: 'Nordigen' },
                { id: 'ph3', name: 'בנק לאומי',        iban: '****1190', balance: '', currency: 'ILS', provider: 'IL' },
              ]
              const rows = accs.length > 0 ? accs : PLACEHOLDER
              const isEmpty = accs.length === 0
              return (
                <div style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px', direction: 'rtl' as const }}>
                  <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 10 }}>חשבונות ויתרות</div>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#111' }}>
                        {['מוסד פיננסי','חשבון','יתרה','מטבע','ספק'].map(h => (
                          <th key={h} style={{ border: '1px solid #333', padding: '5px 10px', color: '#FFD700', textAlign: 'right' as const }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: Record<string,unknown>, i: number) => {
                        const conn = conns.find((c: Record<string,unknown>) => c.id === row.connection_id)
                        const provider = (conn as Record<string,unknown>)?.provider ?? row.provider ?? ''
                        return (
                          <tr key={String(row.id ?? i)} style={{ opacity: isEmpty ? 0.25 : 1, background: i % 2 === 0 ? '#0a0a0a' : '#111' }}>
                            <td style={{ border: '1px solid #222', padding: '5px 10px', color: '#ccc' }}>{String(row.name ?? '')}</td>
                            <td style={{ border: '1px solid #222', padding: '5px 10px', color: '#aaa', fontFamily: 'monospace' }}>{String(row.iban ?? '')}</td>
                            <td style={{ border: '1px solid #222', padding: '5px 10px', color: '#fff', textAlign: 'left' as const }}>{String(row.balance ?? '')}</td>
                            <td style={{ border: '1px solid #222', padding: '5px 10px', color: '#aaa' }}>{String(row.currency ?? '')}</td>
                            <td style={{ border: '1px solid #222', padding: '5px 10px', color: '#888' }}>{String(provider)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {isEmpty && <div style={{ color: '#555', fontSize: 11, marginTop: 6, textAlign: 'center' as const }}>אין חשבונות מחוברים — מוצגת דוגמה</div>}
                </div>
              )
            })()}

            {/* ניהול חיבורים */}
            <BankingConnectPanel userId={user?.id} />

            {/* טבלאות חיות */}
            {(['connections', 'accounts', 'transactions'] as const).map(tbl => {
              const rows = bankingData?.[tbl] ?? []
              const cols = rows.length > 0 ? Object.keys(rows[0]) : []
              const labels: Record<string, string> = { connections: 'חיבורים', accounts: 'חשבונות', transactions: 'עסקאות' }
              return (
                <div key={tbl} style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 8, direction: 'rtl' }}>
                    {labels[tbl]} ({rows.length})
                  </div>
                  {!bankingData ? (
                    <div style={{ color: '#aaa', fontSize: 12 }}>טוען...</div>
                  ) : rows.length === 0 ? (
                    <div style={{ color: '#666', fontSize: 12 }}>אין רשומות</div>
                  ) : (
                    <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead>
                        <tr style={{ background: '#111' }}>
                          {cols.map(c => <th key={c} style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'left' }}>{c}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#111' }}>
                            {cols.map(c => <td key={c} style={{ border: '1px solid #222', padding: '3px 8px', color: '#ccc' }}>{String(row[c] ?? '')}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })}

          </div>
        )}

        {view === 'tests' && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ margin: '8px 6px', border: '1px solid #666', borderRadius: '8px', padding: '6px 4px 8px', width: '140px', background: '#1a1a1a' }}>
              <div style={{ color: '#FFD700', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '5px', marginBottom: '6px', fontFamily: handFont(lang.code) }}>
                {lang.card.title}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <button onClick={() => { onNavigate('mf-register'); setActiveMfBtnTest(null) }}
                  style={{ background: '#2a2a2a', border: '1px solid #555', borderRadius: '4px', color: '#ccc', padding: '6px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {lang.card.register}
                </button>
                <button onClick={() => { setActiveMfBtnTest(activeMfBtnTest === 'install' ? null : 'install'); onInstall() }}
                  style={{ background: activeMfBtnTest === 'install' ? '#4a1a6e' : '#2a2a2a', border: '1px solid #555', borderRadius: '4px', color: '#ccc', padding: '6px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {lang.card.install}
                </button>
                <button onClick={() => { onNavigate('mf-login'); setActiveMfBtnTest(null) }}
                  style={{ background: '#2a2a2a', border: '1px solid #555', borderRadius: '4px', color: '#ccc', padding: '6px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {lang.card.login}
                </button>
                <button onClick={() => { setActiveMfBtnTest(activeMfBtnTest === 'run' ? null : 'run'); onRun() }}
                  style={{ background: activeMfBtnTest === 'run' ? '#4a1a6e' : '#2a2a2a', border: '1px solid #555', borderRadius: '4px', color: '#ccc', padding: '6px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {lang.card.run}
                </button>
              </div>
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
                    <th colSpan={9} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{lang.system.generalGroup}</th>
                    <th colSpan={6} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>M Finance</th>
                  </tr>
                  <tr style={{ background: '#e8eaf6' }}>
                    {['ID', 'דרוג משוקלל 0-10', lang.system.colCreated, lang.system.colName, lang.profile.email, lang.profile.language, lang.system.colCurrency, 'IP', 'Last IP'].map(h => (
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
                    const rowBg = idx % 2 === 0 ? '#fff' : '#f5f5fc'
                    return (
                      <React.Fragment key={String(u.id)}>
                        <tr style={{ background: rowBg }}>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.id ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            {usersEditMode
                              ? <input type="number" min={0} max={10} value={Number(u.weighted_score ?? 10)} onChange={e => { const v = Math.min(10, Math.max(0, Number(e.target.value))); setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, weighted_score: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], weighted_score: v } })) }} style={{ fontSize: 12, width: 40, textAlign: 'center', backgroundColor: 'yellow', border: '1px solid #ccc', borderRadius: 3, padding: '1px 2px' }} />
                              : <span style={{ fontWeight: 'bold', color: `hsl(${(Number(u.weighted_score ?? 10)) * 12}, 80%, 35%)` }}>{Number(u.weighted_score ?? 10)}</span>}
                          </td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{created}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>
                            {usersEditMode
                              ? <input value={String(u.name ?? '')} onChange={e => { const v = e.target.value; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, name: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], name: v } })) }} style={{ fontSize: 12, border: '1px solid #ccc', borderRadius: 3, padding: '1px 4px', width: '100px', backgroundColor: 'yellow' }} />
                              : String(u.name ?? '')}
                          </td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>
                            {usersEditMode
                              ? <input value={String(u.email ?? '')} onChange={e => { const v = e.target.value; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, email: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], email: v } })) }} style={{ fontSize: 12, border: '1px solid #ccc', borderRadius: 3, padding: '1px 4px', width: '130px', backgroundColor: 'yellow' }} />
                              : String(u.email ?? '')}
                          </td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.language ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.currency ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}></td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.last_ip ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            {usersEditMode
                              ? <span style={{ display: 'inline-block', backgroundColor: 'yellow', padding: '1px 4px', borderRadius: 3 }}><input type="checkbox" checked={!!u.is_active} onChange={e => { const v = e.target.checked; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, is_active: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], is_active: v } })) }} /></span>
                              : u.is_active ? '✓' : ''}
                          </td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            {usersEditMode
                              ? <span style={{ display: 'inline-block', backgroundColor: 'yellow', padding: '1px 4px', borderRadius: 3 }}><input type="checkbox" checked={!!u.is_M_Finance_installed} onChange={e => { const v = e.target.checked; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, is_M_Finance_installed: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], is_m_finance_installed: v } })) }} /></span>
                              : u.is_M_Finance_installed ? '✓' : ''}
                          </td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.plan_start ? String(u.plan_start).slice(0,10) : ''}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.plan_end ? String(u.plan_end).slice(0,10) : ''}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{String(u.M_Finance_license_type ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            <select
                              value={String(u.system_force ?? 'User')}
                              onChange={e => {
                                const systemForce = e.target.value
                                onDbg('dropdown', `userId=${u.id} system_force changed → ${systemForce}`)
                                setPendingForce(prev => ({ ...prev, [String(u.id)]: systemForce }))
                                setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, system_force: systemForce === 'User' ? null : systemForce } : usr))
                                onDbg('dropdown', `pendingForce updated userId=${u.id}`)
                              }}
                              style={{ fontSize: 12, border: '1px solid #a0a8c0', borderRadius: 3, padding: '1px 2px', background: u.system_force && u.system_force !== 'User' ? '#fff3e0' : '#fff', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                            >
                              <option value="User">User</option>
                              <option value="System_Free_Run">{lang.profile.planNames.System_Free_Run}</option>
                              <option value="User_VIP_Free">VIP</option>
                              <option value="System_Owner">{lang.profile.planNames.System_Owner}</option>
                            </select>
                          </td>
                        </tr>
                        <tr style={{ background: rowBg }}>
                          <td colSpan={15} style={{ padding: '2px 8px', border: '1px solid #c8cce0', borderTop: 'none' }}>
                            {usersEditMode
                              ? <textarea value={String(u.notes ?? '')} onChange={e => { const v = e.target.value; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, notes: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], notes: v } })) }} style={{ fontSize: 11, width: '100%', height: 36, resize: 'vertical', backgroundColor: 'yellow', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px', boxSizing: 'border-box', direction: 'rtl', textAlign: 'right' }} />
                              : <div style={{ fontSize: 11, color: '#444', minHeight: 18, padding: '1px 4px', backgroundColor: '#f9f9f9', borderRadius: 3, direction: 'rtl', textAlign: 'right' }}>{String(u.notes ?? '')}</div>}
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button
                onClick={() => { setUsersEditMode(m => !m); if (usersEditMode) { setPendingUserEdits({}); setPendingForce({}) } }}
                style={{ background: usersEditMode ? '#cc6600' : '#003399', border: 'none', borderRadius: 5, color: '#fff', padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 'bold' }}>
                עריכה
              </button>
              <button
                onClick={async () => {
                  const forceEntries = Object.entries(pendingForce)
                  await Promise.all(forceEntries.map(async ([userId, systemForce]) => {
                    try {
                      await fetch('/api/system/force-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, systemForce }) })
                    } catch { /* */ }
                  }))
                  const editEntries = Object.entries(pendingUserEdits)
                  await Promise.all(editEntries.map(async ([userId, fields]) => {
                    await Promise.all(Object.entries(fields).map(async ([field, value]) => {
                      try {
                        await fetch('/api/system/update-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, field, value }) })
                      } catch { /* */ }
                    }))
                  }))
                  setPendingForce({})
                  setPendingUserEdits({})
                  if (Object.keys(pendingUserEdits).length > 0) setUsersEditMode(false)
                  fetch('/api/current-user').then(r => r.json()).then(d => { if (d.user) onUserUpdate(d.user) }).catch(() => {})
                  fetch('/api/system/users').then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {})
                }}
                disabled={Object.keys(pendingForce).length === 0 && Object.keys(pendingUserEdits).length === 0}
                style={{ background: '#003399', border: 'none', borderRadius: 5, color: '#fff', padding: '5px 16px', fontSize: 13, fontWeight: 'bold', cursor: (Object.keys(pendingForce).length > 0 || Object.keys(pendingUserEdits).length > 0) ? 'pointer' : 'default', opacity: (Object.keys(pendingForce).length > 0 || Object.keys(pendingUserEdits).length > 0) ? 1 : 0.4 }}>
                {lang.card.update}
              </button>
            </div>
            </div>
          </div>
        )}

        {view === 'schedule' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 'fit-content', minWidth: 500 }}>
                            <div style={{ marginBottom: 6, display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'baseline' }}>
                <span style={{ fontSize: 15, fontWeight: 'bold', color: '#003399' }}>מחירון ולו״ז</span>
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

              {/* Weighted Score Table */}
              <div style={{ marginTop: 24, direction: 'rtl' }}>
                <div style={{ fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 6 }}>דרוג משוקלל</div>
                <div style={{ border: '2px solid #003399', borderRadius: 3, display: 'inline-block' }}>
                  <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#e8eaf6' }}>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 70 }}>אחוזים</th>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 130 }}>מדד</th>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 220 }}>הסבר</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightedRows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5fc' }}>
                          <td style={{ padding: '1px 2px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            <input type="text" value={row.weight} onChange={e => setWeightedRows(prev => prev.map((r, j) => j === i ? { ...r, weight: e.target.value } : r))}
                              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, textAlign: 'center', background: 'transparent', boxSizing: 'border-box', padding: '2px 3px' }} />
                          </td>
                          <td style={{ padding: '1px 2px', border: '1px solid #c8cce0' }}>
                            <input type="text" value={row.metric} onChange={e => setWeightedRows(prev => prev.map((r, j) => j === i ? { ...r, metric: e.target.value } : r))}
                              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, textAlign: 'right', background: 'transparent', boxSizing: 'border-box', padding: '2px 3px' }} />
                          </td>
                          <td style={{ padding: '1px 2px', border: '1px solid #c8cce0' }}>
                            <input type="text" value={row.explanation} onChange={e => setWeightedRows(prev => prev.map((r, j) => j === i ? { ...r, explanation: e.target.value } : r))}
                              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, textAlign: 'right', background: 'transparent', boxSizing: 'border-box', padding: '2px 3px' }} />
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: '#e8eaf6', fontWeight: 'bold' }}>
                        <td style={{ padding: '4px 8px', border: '1px solid #a0a8c0', textAlign: 'center', color: '#555', fontSize: 11 }}>
                          סה״כ משקלות: {weightedRows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)}%
                        </td>
                        <td style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', textAlign: 'center' }}>מספר משוקלל</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', textAlign: 'center' }}>0 – 10</td>
                      </tr>
                      <tr>
                        <td colSpan={3} style={{ padding: '4px 8px', border: '1px solid #a0a8c0' }}>
                          <div style={{ background: 'linear-gradient(to left, hsl(0,80%,45%), hsl(30,80%,45%), hsl(60,80%,45%), hsl(90,80%,45%), hsl(120,80%,45%))', borderRadius: 4, height: 10, width: '100%' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginTop: 2, paddingLeft: 1, paddingRight: 1 }}>
                            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} style={{ padding: 0, border: '1px solid #a0a8c0' }}>
                          <div style={{ margin: 6, padding: '6px 10px', border: '1px solid #003399', borderRadius: 4, fontSize: 12, color: '#333', fontFamily: 'monospace', background: '#f0f4ff' }}>
                            דרוג משוקלל (0–10) = Σ ( מדד_i ∈ &#123;0,1&#125; × משקל_i% ) × 10 / 100
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', direction: 'ltr' }}>
                  <button
                    onClick={async () => {
                      setIsScanning(true)
                      const isRegular = (u: typeof users[0]) =>
                        !u.system_force || u.system_force === 'User'

                      const systemUsers = users.filter(u => !isRegular(u))
                      await Promise.all(systemUsers.map(async u => {
                        try {
                          await fetch('/api/system/update-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: u.id, field: 'weighted_score', value: 10 }) })
                        } catch { /* */ }
                      }))

                      const allMsgs: { user_id: number | null; rating_site: number | null; rating_budget: number | null; created_at: string }[] =
                        await fetch('/api/feedback').then(r => r.json()).then(d => d.messages ?? []).catch(() => [])

                      const now = new Date()
                      const thisMonth = now.getMonth()
                      const thisYear  = now.getFullYear()

                      const regularUsers = users.filter(u => isRegular(u))
                      await Promise.all(regularUsers.map(async u => {
                        const uid = String(u.id)
                        const userMsgs = allMsgs.filter(m => String(m.user_id) === uid)
                        const hasNegative = userMsgs.some(m =>
                          (m.rating_site   !== null && m.rating_site   < 6) ||
                          (m.rating_budget !== null && m.rating_budget < 6)
                        )
                        const msgsThisMonth = userMsgs.filter(m => {
                          const d = new Date(m.created_at)
                          return d.getMonth() === thisMonth && d.getFullYear() === thisYear
                        }).length

                        const today = new Date()
                        const scores: Record<string, number> = {
                          'לקוח רשום':       u.email ? 1 : 0,
                          'לקוח פעיל':       u.is_active ? 1 : 0,
                          'אפליקציה מותקנת': u.is_M_Finance_installed ? 1 : 0,
                          'משוב חיובי':      hasNegative ? 0 : 1,
                          'מתעניין':         msgsThisMonth > 3 ? 1 : 0,
                          'תכנית תקינה':     (u.plan_end && new Date(String(u.plan_end)) > today) ? 1 : 0,
                        }
                        const total = weightedRows.reduce((sum, r) => {
                          const w = parseFloat(r.weight) || 0
                          const s = scores[r.metric] ?? 0
                          return sum + w * s
                        }, 0)
                        const score = Math.round(total / 10)
                        try {
                          await fetch('/api/system/update-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: u.id, field: 'weighted_score', value: score }) })
                        } catch { /* */ }
                      }))
                      await fetch('/api/system/users').then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {})
                      setIsScanning(false)
                    }}
                    style={{ background: isScanning ? '#cc6600' : '#003399', border: 'none', borderRadius: 5, color: '#FFD700', padding: '6px 14px', fontSize: 13, fontWeight: 'bold', cursor: isScanning ? 'wait' : 'pointer', direction: 'rtl', transition: 'background 0.3s' }}>
                    {isScanning ? 'סורק...' : 'סרוק משתמשים חשב ועדכן דרוג'}
                  </button>
                </div>
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

          {/* monitor */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>{lang.system.monitor}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, fontSize: '13px', ...(debugOpen ? { background: '#4a1a6e' } : {}) }} onClick={() => { onOpenDebug(); setDebugOpen(prev => !prev) }}>{lang.system.debug}</button>
              <button style={{ ...sysBtnSm, ...(view === 'db' ? { background: '#4a1a6e' } : {}) }} onClick={handleDb}>{lang.system.db}</button>
              <button style={{ ...sysBtnSm, gridColumn: 'span 2', ...(buildOpen ? { background: '#4a1a6e' } : {}) }} onClick={() => { handleBuild(); setBuildOpen(prev => !prev) }}>{lang.system.buildMessages}</button>
            </div>
          </div>

          {/* systemData */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>{lang.system.systemData}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, ...(view === 'users' ? { background: '#4a1a6e' } : {}) }} onClick={handleUsers}>{lang.system.users}</button>
              <button style={{ ...sysBtnSm, ...(view === 'schedule' ? { background: '#4a1a6e' } : {}) }} onClick={handleSchedule}>{lang.system.schedule}</button>
              <button style={{ ...sysBtnSm, gridColumn: 'span 2', ...(view === 'sensitive' ? { background: '#4a1a6e' } : {}) }} onClick={() => setView(view === 'sensitive' ? 'none' : 'sensitive')}>{lang.system.sensitivePoints}</button>
            </div>
          </div>

          {/* pr */}
          <div style={{ border: '1px solid #cc9900', borderRadius: '8px', padding: '5px 4px 6px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #666', paddingBottom: '3px', marginBottom: '5px' }}>{lang.system.pr}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, ...(view === 'pr' ? { background: '#4a1a6e' } : {}) }} onClick={() => setView(view === 'pr' ? 'none' : 'pr')}>{lang.system.pr}</button>
              <button style={{ ...sysBtnSm, ...(view === 'messages' ? { background: '#4a1a6e' } : {}) }} onClick={() => setView(view === 'messages' ? 'none' : 'messages')}>{lang.system.messages}</button>
            </div>
          </div>

          <button style={{ ...sysBtnSm, background: view === 'tests' ? '#4a1a6e' : 'none', color: '#fff', fontSize: '14px' }} onClick={() => setView(view === 'tests' ? 'none' : 'tests')}>בדיקות</button>
          <button style={{ ...sysBtnSm, background: view === 'banking' ? '#4a1a6e' : 'none', color: '#fff', fontSize: '14px' }} onClick={() => { if (view === 'banking') { setView('none') } else { setView('banking'); fetch('/api/banking/data').then(r => r.json()).then(d => setBankingData(d)).catch(() => {}); fetch('/api/banking/status').then(r => r.json()).then(d => setBankingStatus(d)).catch(() => {}) } }}>מוסדות פיננסיים</button>

        </div>
      </aside>

    </div>
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
  const [txBody, setTxBody] = useState('')
  const [txReply, setTxReply] = useState('')
  const [txTitle, setTxTitle] = useState('')
  const [txSysMsg, setTxSysMsg] = useState('')
  const [txTitlesList, setTxTitlesList] = useState<Record<number, string>>({})
  const [adminReplyEditing, setAdminReplyEditing] = useState(false)
  const isAdmin = user?.M_Finance_license_type === LICENSE_TYPES.System_Owner

  useEffect(() => {
    if (lang.code === 'he' || expandedMsgId === null) { setTxBody(''); setTxReply(''); setTxTitle(''); return }
    const msg = loadedMessages.find(m => m.id === expandedMsgId)
    if (!msg) return
    const body = (() => {
      const b = msg.body ?? ''
      if (!b.startsWith('סימוכין:')) return b
      const firstBreak = b.indexOf('\n\n')
      if (firstBreak === -1) return b
      const afterMeta = b.slice(firstBreak + 2)
      const stops = ['\n\n══════════', '\n\n── תשובת', '\n\n── הודעת']
      let endIdx = afterMeta.length
      for (const sep of stops) { const idx = afterMeta.indexOf(sep); if (idx !== -1 && idx < endIdx) endIdx = idx }
      return afterMeta.slice(0, endIdx).trim()
    })()
    Promise.all([
      body ? translateFromHe(body, lang.code) : Promise.resolve(''),
      msg.reply_text ? translateFromHe(msg.reply_text, lang.code) : Promise.resolve(''),
      msg.title ? translateFromHe(msg.title, lang.code) : Promise.resolve('')
    ]).then(([b, r, t]) => { setTxBody(b); setTxReply(r); setTxTitle(t) })
  }, [expandedMsgId, lang.code])

  useEffect(() => {
    if (lang.code === 'he' || !systemMessage) { setTxSysMsg(''); return }
    translateFromHe(systemMessage, lang.code).then(t => setTxSysMsg(t))
  }, [systemMessage, lang.code])

  useEffect(() => {
    if (lang.code === 'he' || loadedMessages.length === 0) { setTxTitlesList({}); return }
    Promise.all(
      loadedMessages.map(m => m.title
        ? translateFromHe(m.title, lang.code).then(t => ({ id: m.id, t }))
        : Promise.resolve({ id: m.id, t: '' })
      )
    ).then(results => {
      const map: Record<number, string> = {}
      results.forEach(({ id, t }) => { if (t) map[id] = t })
      setTxTitlesList(map)
    })
  }, [loadedMessages, lang.code])

  useEffect(() => {
    if (!user?.id) return
    onDbg('FeedbackPage.init', `mount isAdmin=${isAdmin} sessionId=${sessionId}`)
    if (isAdmin) {
      onDbg('FeedbackPage.init', 'admin path — fetching session and messages')
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
          if (!sid) { onDbg('FeedbackPage.session', 'sid=null — no session!'); return }
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
    if (isAdmin) { onDbg('FeedbackPage.poll', 'skip — isAdmin=true'); return }
    if (!sessionId) { onDbg('FeedbackPage.poll', 'skip — sessionId=null'); return }
    onDbg('FeedbackPage.poll', `polling started sessionId=${sessionId}`)
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
            onDbg('FeedbackPage.poll', `reply received! replyLen=${last.reply_text.length}`)
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <PageHeader subtitle={`${lang.feedback.customerRelations} - ${lang.menu[0]}`} lang={lang} />
      <div style={{ width: '100%', flex: 1, background: '#d0d0d0', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '24px', boxSizing: 'border-box', overflow: 'auto' }}>

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
                    <td style={{ padding: '5px 6px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(lang.code !== 'he' && txTitlesList[m.id]) || m.title || '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{m.rating_site ?? '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{m.rating_budget ?? '—'}</td>
                    <td style={{ padding: '5px 4px', textAlign: 'center', color: m.reply_text ? '#006600' : '#cc6600', fontWeight: 'bold' }}>{m.reply_text ? '✓' : '○'}</td>
                    <td style={{ padding: '3px 4px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <button onClick={async () => {
                        await fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id }) }).catch(() => {})
                        setLoadedMessages(prev => prev.filter(msg => msg.id !== m.id))
                        if (expandedMsgId === m.id) setExpandedMsgId(null)
                      }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.delete}</button>
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
            style={{ fontSize: '13px', padding: '4px 14px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.newMessage}</button>
        </div>
      <div style={{ width: '720px', minHeight: '1123px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column' }}>

        {/* כרטיסיה */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '6px', color: '#003399' }}>
            <div style={{ fontSize: '24px', fontWeight: 'normal' }}>{expandedMsgId !== null ? loadedMessages.findIndex(m => m.id === expandedMsgId) + 1 : ''}</div>
            <div style={{ fontSize: '13px', color: '#888', direction: 'rtl' }}>{expandedMsgId !== null ? lang.system.msgNumber : ''}</div>
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
            <div style={{ fontSize: '13px', color: '#222', flex: 1, whiteSpace: 'pre-wrap' }}>{(lang.code !== 'he' && txSysMsg) || systemMessage}</div>
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
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fb.title}{' '}{(lang.code !== 'he' && txTitle) || selectedMsg.title || '______'}</span>
                    <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.ref + ' '}{buildMsgRef(selectedMsg) || '______'}</span>
                  </div>
                  <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', margin: '8px 0', flex: 1 }}>{(lang.code !== 'he' && txBody) || getBodyText(selectedMsg) || '______'}</div>
                  <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #eee', paddingTop: '6px' }}>{fb.from}{' '}{selectedMsg.user_name || '______'}</div>
                </div>
              ) : (
                <>
                  <div style={{ position: 'relative', height: '26px', fontSize: '13px', color: '#222', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', right: 0, display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                      <span style={{ whiteSpace: 'nowrap' }}>{fb.date}</span>
                      <input type="date" value={userDate} onChange={e => { setUserDate(e.target.value); if (validationErrors.date) setValidationErrors(prev => ({...prev, date: false})) }} style={{ border: 'none', borderBottom: validationErrors.date ? '2px solid red' : '1px solid #aaa', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '100px', direction: 'ltr' }} />
                    </span>
                    {refNum && <span style={{ position: 'absolute', right: '175px', transform: 'translateX(50%)', color: '#555' }}>{lang.system.msgNo}{loadedMessages.length}</span>}
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                      <span>{fb.title}</span>
                      <input value={userTitle} onChange={e => { setUserTitle(e.target.value); if (validationErrors.title) setValidationErrors(prev => ({...prev, title: false})) }} style={{ border: 'none', borderBottom: validationErrors.title ? '2px solid red' : '1px solid #aaa', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '150px', direction: dir }} />
                    </span>
                    {refNum && <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.ref + ' '}{refNum}</span>}
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
                    <span style={{ whiteSpace: 'nowrap' }}>{lang.system.replyToRef}</span>
                    <select value={selectedMsgId ?? ''} onChange={e => handleSelectMsg(Number(e.target.value))}
                      style={{ border: 'none', outline: 'none', fontSize: '11px', color: '#003399', background: 'transparent', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                      {loadedMessages.map(m => <option key={m.id} value={m.id}>{buildMsgRef(m)}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <textarea value={isAdmin && adminReplyEditing ? replyText : (lang.code !== 'he' && txReply) || replyText} readOnly={!isAdmin} onFocus={isAdmin ? () => setAdminReplyEditing(true) : undefined} onBlur={isAdmin ? () => setAdminReplyEditing(false) : undefined} onChange={isAdmin ? e => setReplyText(e.target.value) : undefined} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: dir, background: !isAdmin ? '#f0f4ff' : 'transparent', cursor: !isAdmin ? 'default' : 'text', margin: '4px 0' }} />
              <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #eee', paddingTop: '6px', direction: dir, flexShrink: 0 }}>
                {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
              </div>
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
  const [txMsgBody, setTxMsgBody] = useState('')
  const [txMsgReply, setTxMsgReply] = useState('')
  const [txMsgTitle, setTxMsgTitle] = useState('')
  const [txSysMsg, setTxSysMsg] = useState('')
  const [adminReplyEditing, setAdminReplyEditing] = useState(false)
  const isRTL = lang.code === 'he' || lang.code === 'ar'
  const dir = isRTL ? 'rtl' as const : 'ltr' as const

  useEffect(() => {
    if (!selectedMsg || lang.code === 'he') { setTxMsgBody(''); setTxMsgReply(''); setTxMsgTitle(''); setTxSysMsg(''); return }
    const body = selectedMsg.body ?? ''
    const cut = (text: string, sep: string): [string, string] => { const i = text.indexOf(sep); return i === -1 ? [text, ''] : [text.slice(0, i), text.slice(i + sep.length)] }
    const [withoutHistory] = cut(body, '\n\n══════════')
    const [withoutReply] = cut(withoutHistory, '\n\n── תשובת המערכת ──\n')
    const [withoutSysMsg, afterSysMsg] = cut(withoutReply, '\n\n── הודעת המערכת ──\n')
    const lines = withoutSysMsg.split('\n')
    const userText = lines.slice(4).join('\n').trim()
    const sysMsgText = afterSysMsg ? afterSysMsg.split('\n\n')[0] : ''
    Promise.all([
      userText ? translateFromHe(userText, lang.code) : Promise.resolve(''),
      selectedMsg.reply_text ? translateFromHe(selectedMsg.reply_text, lang.code) : Promise.resolve(''),
      selectedMsg.title ? translateFromHe(selectedMsg.title, lang.code) : Promise.resolve(''),
      sysMsgText ? translateFromHe(sysMsgText, lang.code) : Promise.resolve('')
    ]).then(([b, r, t, s]) => { setTxMsgBody(b); setTxMsgReply(r); setTxMsgTitle(t); setTxSysMsg(s) })
  }, [selectedMsg?.id, lang.code])

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
    setAdminReplyEditing(false)
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
    onDbg('MessagesPage.sendReply', `local state updated id=${selectedMsg.id}`)
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
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f0f2f8', padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', direction: 'rtl' }}>

        {/* RIGHT — טבלאות לפי משתמש */}
        <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: '10px', direction: 'ltr' }}>
          {userGroups.map(group => {
            const isExpanded = expandedUids.has(group.uid)
            const toggleExpand = () => setExpandedUids(prev => { const s = new Set(prev); isExpanded ? s.delete(group.uid) : s.add(group.uid); return s })
            return (
              <div key={group.uid} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '2px solid #003399', boxShadow: '0 1px 4px rgba(0,0,80,0.08)' }}>
                <div onClick={toggleExpand} style={{ background: '#003399', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{group.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {group.hasUnread && <span style={{ background: '#cc0000', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 'bold' }}>{lang.system.new}</span>}
                    <span style={{ color: '#FFD700', fontSize: 11 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thS}>✓</th>
                      <th style={thS}>{fb.date.replace(':','').trim()}</th>
                      <th style={thS}>#</th>
                      <th style={{ ...thS, width: '100%', textAlign: 'start' }}>{fb.title.replace(':','').trim()}</th>
                      <th style={thS}>{fb.ratingWebsite}</th>
                      <th style={thS}>{fb.ratingBudget.split(' ')[0]}</th>
                      <th style={{ ...thS, borderInlineEnd: 'none' }}>{fb.systemReply}</th>
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
                              }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.delete}</button>
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
          {!selectedMsg && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', color: '#888', fontSize: 15 }}>{lang.system.selectToView}</div>
          )}
        </div>

        {/* RIGHT — טופס אחד */}
        {selectedMsg && <div style={{ flex: 1, position: 'sticky', top: 0 }}>
          {(() => {
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
                    <div style={{ fontSize: '13px', color: '#888', direction: 'rtl' }}>{lang.system.msgNumber}</div>
                  </div>
                </div>

                {sysMsgText && (
                  <div style={{ position: 'relative', marginTop: '28px' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemMessage}</span>
                    <div style={{ border: '2px solid #003399', borderRadius: '6px', height: '135px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '13px', color: '#222', flex: 1, whiteSpace: 'pre-wrap', direction: dir }}>{(lang.code !== 'he' && txSysMsg) || sysMsgText}</div>
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
                        <span style={{ position: 'absolute', right: '175px', transform: 'translateX(50%)', color: '#555' }}>{lang.system.msgNo}{msgIdx + 1}</span>
                        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fb.title}{' '}{(lang.code !== 'he' && txMsgTitle) || msg.title || '______'}</span>
                        <span style={{ position: 'absolute', left: 0, fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.ref + ' '}{refNum || '______'}</span>
                      </div>
                      <div style={{ minHeight: '80px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', margin: '8px 0', direction: dir }}>{(lang.code !== 'he' && txMsgBody) || userText}</div>
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
                        <span style={{ fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.replyToRef}{' '}{refNum}</span>
                      </div>
                      <textarea value={isAdmin && adminReplyEditing ? adminReply : (lang.code !== 'he' && txMsgReply) || (isAdmin ? adminReply : msg.reply_text || '')} readOnly={!isAdmin} onFocus={isAdmin ? () => setAdminReplyEditing(true) : undefined} onBlur={isAdmin ? () => setAdminReplyEditing(false) : undefined} onChange={isAdmin ? e => setAdminReply(e.target.value) : undefined} style={{ minHeight: '80px', border: isAdmin ? '1px dashed #a0a8d0' : 'none', outline: 'none', resize: isAdmin ? 'vertical' : 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: isAdmin && adminReplyEditing ? 'rtl' : dir, background: isAdmin ? '#f0f4ff' : 'transparent', cursor: isAdmin ? 'text' : 'default', width: '100%', boxSizing: 'border-box' as const, borderRadius: isAdmin ? 4 : 0, padding: isAdmin ? '4px 8px' : '0' }} />
                      <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                        {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
                        <button onClick={handleSendReply} disabled={!adminReply.trim() || !adminReplyDate.trim()} style={{ fontSize: 13, padding: '5px 18px', background: replySaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', opacity: adminReply.trim() && adminReplyDate.trim() ? 1 : 0.5 }}>
                          {replySaved ? '✓ ' + lang.system.replySent : lang.system.send + ' ' + lang.system.reply}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )
          })()}
        </div>}

      </div>
    </div>
  )
}

type UpdateRecord = { id: number; product: string; version: string; release_date: string; release_time: string | null; description: string }

function formatUpdateDate(date: string, time: string | null) {
  if (!date) return '—'
  const [y, m, d] = date.split('-')
  const dateStr = `${d}/${m}/${y}`
  return time ? `${time}  ${dateStr}` : dateStr
}

function UpdatesPage({ lang }: { lang: typeof languages[0] }) {
  const [updates, setUpdates] = useState<UpdateRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [txDescriptions, setTxDescriptions] = useState<Record<number, string>>({})

  useEffect(() => {
    fetch('/api/updates').then(r => r.json()).then(d => { setUpdates(d.updates ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (lang.code === 'he' || updates.length === 0) { setTxDescriptions({}); return }
    const map: Record<number, string> = {}
    Promise.all(updates.map(u =>
      u.description ? translateFromHe(u.description, lang.code).then(t => { map[u.id] = t }) : Promise.resolve()
    )).then(() => setTxDescriptions({ ...map }))
  }, [updates, lang.code])

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
      <PageHeader subtitle={`${lang.card.infoServices} - ${lang.menu[1]}`} lang={lang} />
      <div style={{ display: 'inline-block', minWidth: 'min-content' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>{lang.system.loading}</div>
        ) : updates.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>{lang.system.noMessages}</div>
        ) : (
          <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,80,0.10)', display: 'inline-block', border: '2px solid #003399', background: '#fff' }}>
          <table style={{ borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thS}>{lang.updates.colDate}</th>
                <th style={thS}>{lang.updates.colProduct}</th>
                <th style={thS}>{lang.updates.colVersion}</th>
                <th style={thS}>{lang.updates.colTitle}</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id}>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontSize: 13 }}>{formatUpdateDate(u.release_date, u.release_time)}</td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontFamily: handFont(lang.code), fontSize: 16 }}>
                    {u.product === 'KeyClick Site' ? lang.updates.productKeyClick : u.product === 'M Finance' ? lang.updates.productMFinance : u.product}
                  </td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap', fontSize: 13 }}>{(u.version ?? '').replace(/^ver\s*/i, '')}</td>
                  <td style={{ ...tdS, minWidth: 220 }}>{(lang.code !== 'he' && txDescriptions[u.id]) || u.description || '—'}</td>
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

const PAGE_HEADER_CSS = `
  .page-header-block{
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items:center;
    justify-content:center;
    gap:16px;
    padding-top:28px;
    padding-bottom:26px;
  }

  .page-header-block.stack{
    flex-direction:column;
  }

  .page-header-block .site-header{
    display:inline-flex;
    align-items:baseline;
    gap:16px;
    flex-wrap:wrap;
    justify-content:center;
    background:linear-gradient(180deg, #1e2a6b, #12163a);
    color:#ffd700;
    padding:14px 34px;
    border-radius:999px;
    box-shadow:0 8px 18px -8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1);
    font-family:"Segoe UI Semibold","Segoe UI",Arial,sans-serif;
    font-weight:700;
    font-size:20px;
  }

  .page-header-block .site-header .brand-script{
    font-family:var(--font-dancing),Georgia,serif;
    font-style:italic;
    font-size:36px;
    line-height:1;
    margin:0 12px;
  }

  .page-header-block .page-subtitle{
    display:inline-flex;
    align-items:baseline;
    justify-content:center;
    background:linear-gradient(180deg, #1e2a6b, #12163a);
    color:#ffffff;
    padding:8px 26px;
    border-radius:999px;
    box-shadow:0 8px 18px -8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1);
    font-family:var(--font-amatic),"Amatic SC","Segoe UI Semibold",Arial,sans-serif;
    font-weight:700;
    font-size:30px;
  }
`

function PageHeader({ subtitle, layout = 'row', lang }: { subtitle: string; layout?: 'row' | 'column'; lang: typeof languages[0] }) {
  return (
    <div className={layout === 'column' ? 'page-header-block stack' : 'page-header-block'} dir="rtl">
      <style>{PAGE_HEADER_CSS}</style>
      <div className="site-header">
        <span>{lang.card.siteHeaderPrefix}</span>
        <span className="brand-script">KeyClick</span>
        <span>-</span>
        <span>M Solution Group</span>
      </div>
      <div className="page-subtitle">{subtitle}</div>
    </div>
  )
}

const GUIDES_CSS = `
  .guides-page, .guides-page *{ box-sizing:border-box; }

  .guides-page{
    height:100%;
    margin:0;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:26px;
    padding:32px 20px 90px;
    overflow:auto;
    background:
      radial-gradient(1200px 640px at 50% -12%, #ffffff 0%, transparent 60%),
      #f2eef2;
    font-family:"Segoe UI","Segoe UI Semibold",Arial,sans-serif;
    color:#131a3d;
  }

  .guides-page .eyebrow{ font-size:13px; letter-spacing:.06em; color:#7c5c1c; opacity:.9; }

  .guides-page h1{
    margin:0;
    font-family:"Segoe UI Semibold","Segoe UI",Arial,sans-serif;
    font-weight:700;
    font-size:clamp(26px,3.6vw,36px);
    text-wrap:balance;
    text-align:center;
    color:#131a4a;
  }

  .guides-page .subtitle{
    margin-top:-10px;
    font-size:16px;
    color:#4a5178;
    text-align:center;
    max-width:46ch;
  }

  .guides-page .furniture{
    display:flex;
    flex-direction:column;
    align-items:center;
    filter:drop-shadow(0 28px 34px rgba(20,20,40,.28));
  }

  .guides-page .cap{
    position:relative;
    width:calc(min(520px,92vw) + 20px);
    height:30px;
    background:linear-gradient(180deg, #f3dd94, #b6892c 55%, #7c5c1c);
    border-radius:10px 10px 3px 3px;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.5), inset 0 -6px 10px -6px rgba(0,0,0,.4);
    z-index:2;
  }

  .guides-page .brandplate{
    position:absolute;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    font-family:"Segoe UI Semibold","Segoe UI",Arial,sans-serif;
    font-weight:700;
    font-size:14px;
    letter-spacing:.04em;
    color:#ffd700;
    padding:5px 20px;
    border-radius:999px;
    background:linear-gradient(180deg, #232c68, #12163a);
    box-shadow:0 3px 6px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.08);
  }

  .guides-page .cabinet{
    position:relative;
    width:min(520px,92vw);
    margin-top:-4px;
    padding:22px 20px 26px;
    border-radius:5px;
    background:linear-gradient(155deg, #4b5266 0%, #343a49 45%, #1a1e28 100%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.1), inset 0 -2px 10px rgba(0,0,0,.35);
    border:1px solid #0e1016;
  }

  .guides-page .cabinet::before, .guides-page .cabinet::after{
    content:"";
    position:absolute;
    top:12px;
    width:14px; height:14px;
    border-radius:50%;
    background:radial-gradient(circle at 32% 30%, #7d8496, #2b2f3b 75%);
    box-shadow:inset 0 1px 1px rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.15);
  }
  .guides-page .cabinet::before{ right:12px; }
  .guides-page .cabinet::after{ left:12px; }

  .guides-page .feet{
    display:flex;
    justify-content:space-between;
    width:calc(min(520px,92vw) - 34px);
    margin-top:0;
  }
  .guides-page .foot{
    width:30px; height:12px;
    border-radius:0 0 4px 4px;
    background:linear-gradient(180deg, #2c3140, #101319);
  }

  .guides-page .columns{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:22px;
    margin-top:6px;
  }

  .guides-page .column{ display:flex; flex-direction:column; gap:16px; }

  .guides-page .col-plate{
    text-align:center;
    font-family:"Segoe UI Semibold","Segoe UI",Arial,sans-serif;
    font-weight:700;
    font-size:19px;
    color:#ff1a2b;
    text-shadow:
      -1px -1px 0 rgba(0,0,0,.55),
       1px -1px 0 rgba(0,0,0,.55),
      -1px  1px 0 rgba(0,0,0,.55),
       1px  1px 0 rgba(0,0,0,.55),
       0 2px 3px rgba(0,0,0,.35);
    background:linear-gradient(180deg, #ecd68a, #b6892c 70%, #7c5c1c);
    padding:8px 6px;
    border-radius:7px 7px 3px 3px;
    box-shadow:0 1px 0 rgba(255,255,255,.35) inset, 0 3px 6px rgba(0,0,0,.35);
    letter-spacing:.01em;
  }

  .guides-page .col-plate.script{
    font-family:var(--font-amatic),"Amatic SC","Segoe UI Semibold",Arial,sans-serif;
    font-weight:700;
    font-size:30px;
    letter-spacing:.02em;
    padding-top:2px;
  }

  .guides-page .drawer{ display:flex; flex-direction:column; }

  .guides-page .d-front{
    all:unset;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:7px;
    position:relative;
    width:100%;
    height:74px;
    cursor:pointer;
    border-radius:8px;
    background:linear-gradient(180deg, #232c68, #1a2151 55%, #141a44 100%);
    border:1px solid #0c0f2c;
    box-shadow:
      0 1px 0 rgba(255,255,255,.14) inset,
      0 -3px 0 rgba(0,0,0,.32) inset,
      0 5px 9px -3px rgba(0,0,0,.5);
    transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .guides-page .handle{
    position:relative;
    width:64px; height:10px;
    border-radius:6px;
    background:linear-gradient(180deg, #fff3c4, #ffd700 35%, #b6892c 78%, #7c5c1c);
    box-shadow:0 3px 4px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.65);
  }
  .guides-page .handle::before, .guides-page .handle::after{
    content:"";
    position:absolute;
    top:50%;
    width:7px; height:7px;
    border-radius:50%;
    transform:translateY(-50%);
    background:radial-gradient(circle at 35% 30%, #fff3c4, #b6892c 70%, #7c5c1c);
    box-shadow:0 1px 2px rgba(0,0,0,.5);
  }
  .guides-page .handle::before{ inset-inline-end:-3px; }
  .guides-page .handle::after{ inset-inline-start:-3px; }

  .guides-page .drawer-label{
    font-family:var(--font-amatic),"Amatic SC","Segoe UI Semibold",Arial,sans-serif;
    font-size:26px;
    font-weight:700;
    color:#f4f2ff;
    letter-spacing:.01em;
    text-shadow:0 1px 2px rgba(0,0,0,.4);
  }

  .guides-page .d-front:hover{ background:linear-gradient(180deg, #2b3576, #1a2151 55%, #141a44 100%); }

  .guides-page .d-front:focus-visible{ outline:2px solid #ffd700; outline-offset:2px; }

  .guides-page .drawer.open .d-front{
    transform:scale(1.045) translateY(1px);
    box-shadow:
      0 1px 0 rgba(255,255,255,.14) inset,
      0 -3px 0 rgba(0,0,0,.32) inset,
      0 16px 22px -6px rgba(0,0,0,.55);
    background:linear-gradient(180deg, #333e88, #232c68 60%, #141a44 100%);
  }

  .guides-page .drawer.open .handle{
    background:linear-gradient(180deg, #fff9e0, #ffd700 35%, #b6892c 78%, #7c5c1c);
  }

  .guides-page .drawer-tray{
    display:grid;
    grid-template-rows:0fr;
    transition:grid-template-rows .34s cubic-bezier(.2,.7,.2,1) .05s;
  }
  .guides-page .drawer.open .drawer-tray{ grid-template-rows:1fr; }

  .guides-page .drawer-tray-inner{ overflow:hidden; }

  .guides-page .tray-card{
    margin-top:12px;
    padding:14px 14px 12px;
    border-radius:10px;
    background:#eef1f9;
    color:#131a3d;
    box-shadow:0 10px 22px -12px rgba(0,0,0,.5);
  }

  .guides-page .tray-row{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }

  .guides-page .tray-desc{ margin:6px 0 0; font-size:13px; line-height:1.55; color:#4a5178; max-width:46ch; }

  .guides-page .status-chip{
    flex:none;
    font-size:11px;
    font-weight:700;
    padding:3px 9px;
    border-radius:999px;
    background:#fbe6b0;
    color:#7a5a10;
    white-space:nowrap;
  }

  @media (prefers-reduced-motion: reduce){
    .guides-page .d-front, .guides-page .drawer-tray{ transition:none; }
  }

  @media (max-width:480px){
    .guides-page .columns{ gap:14px; }
    .guides-page .column{ gap:12px; }
    .guides-page .drawer-label{ font-size:12px; }
    .guides-page .handle{ width:46px; }
  }
`

function GuidesDrawer({ id, label, title, desc, openId, setOpenId, comingSoon }: {
  id: string; label: string; title: string; desc: string; comingSoon: string
  openId: string | null; setOpenId: (v: string | null) => void
}) {
  const open = openId === id
  return (
    <div className={open ? 'drawer open' : 'drawer'} data-id={id}>
      <button className="d-front" aria-expanded={open} onClick={() => setOpenId(open ? null : id)}>
        <span className="drawer-label">{label}</span>
        <span className="handle" />
      </button>
      <div className="drawer-tray"><div className="drawer-tray-inner">
        <div className="tray-card">
          <div className="tray-row"><strong>{title}</strong><span className="status-chip">{comingSoon}</span></div>
          <p className="tray-desc">{desc}</p>
        </div>
      </div></div>
    </div>
  )
}

function GuidesPage({ lang }: { lang: typeof languages[0] }) {
  const [openFin, setOpenFin] = useState<string | null>(null)
  const [openSite, setOpenSite] = useState<string | null>(null)

  const g = lang.guides

  return (
    <div className="guides-page" dir="rtl">
      <style>{GUIDES_CSS}</style>

      <PageHeader subtitle={lang.card.guidesAndVideos} layout="column" lang={lang} />

      <div className="furniture">
        <div className="cap"><span className="brandplate">KeyClick</span></div>

        <div className="cabinet">
          <div className="columns">

            <div className="column">
              <div className="col-plate script">{lang.card.title}</div>
              <GuidesDrawer id="fin-overview" label={g.overview} title={g.financeOverviewTitle} desc={g.financeOverviewDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} />
              <GuidesDrawer id="fin-guide" label={g.userGuide} title={g.financeGuideTitle} desc={g.financeGuideDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} />
              <GuidesDrawer id="fin-videos" label={lang.card.videos} title={g.financeVideosTitle} desc={g.financeVideosDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} />
            </div>

            <div className="column">
              <div className="col-plate script">{lang.card.theWebsite}</div>
              <GuidesDrawer id="site-overview" label={g.overview} title={g.siteOverviewTitle} desc={g.siteOverviewDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} />
              <GuidesDrawer id="site-guide" label={g.userGuide} title={g.siteGuideTitle} desc={g.siteGuideDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} />
              <GuidesDrawer id="site-videos" label={lang.card.videos} title={g.siteVideosTitle} desc={g.siteVideosDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} />
            </div>

          </div>
        </div>

        <div className="feet"><div className="foot" /><div className="foot" /></div>
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
      {lang.reminders.loginRequired}
    </div>
  )

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f0f2f8', padding: '32px 28px', boxSizing: 'border-box', direction: 'rtl' }}>
      <PageHeader subtitle={`${lang.card.infoServices} - ${lang.menu[3]}`} lang={lang} />
      <div style={{ display: 'inline-block', minWidth: 'min-content' }}>

        {/* Add form */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <input style={{ ...inputS, minWidth: 220 }} placeholder={lang.reminders.titlePh} value={title} onChange={e => setTitle(e.target.value)} />
          <input style={{ ...inputS, direction: 'ltr' }} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input style={{ ...inputS, width: 90, direction: 'ltr' }} type="time" value={time} onChange={e => setTime(e.target.value)} placeholder={lang.reminders.timePh} />
          <button onClick={handleAdd} disabled={!title.trim() || !date || saving}
            style={{ padding: '7px 22px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontStyle: 'italic', opacity: (!title.trim() || !date) ? 0.5 : 1 }}>
            {lang.reminders.add}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ color: '#888', padding: 20 }}>{lang.system.loading}</div>
        ) : reminders.length === 0 ? (
          <div style={{ color: '#888', padding: 20 }}>{lang.reminders.noReminders}</div>
        ) : (
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #003399', display: 'inline-block', background: '#fff' }}>
            <table style={{ borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr>
                  <th style={thS}>{lang.updates.colDate.split(' ')[0]}</th>
                  <th style={thS}>{lang.reminders.timePh}</th>
                  <th style={{ ...thS, textAlign: 'right' }}>{lang.updates.colTitle}</th>
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

function PageContent({ page, lang, langIdx, onChangeLang, clientIp, user, systemMessage, onSetSystemMessage, prText, setPrText, prDate, setPrDate, onClose, onLogin, onUserUpdate, onNavigate, onMsg, onDbg, onOpenDebug, onInstall, onRun }: { page: string; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; clientIp: string; user: UserRecord | null; systemMessage: string; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void; onClose: () => void; onLogin: (user: UserRecord) => void; onUserUpdate: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void; onDbg: (func: string, msg: string) => void; onOpenDebug: () => void; onInstall: () => void; onRun: () => void }) {
  if (page === '0')           return <FeedbackPage user={user} lang={lang} systemMessage={systemMessage} onDbg={onDbg} />
  if (page === '1')           return <UpdatesPage lang={lang} />
  if (page === '2')           return <MessagesPage user={user} lang={lang} onDbg={onDbg} />
  if (page === '3')           return <RemindersPage user={user} lang={lang} />
  if (page === 'mf-login')    return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='default'  onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'mf-register') return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='register' onClose={onClose} onLogin={onLogin} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'mf-install')  return <InstallCard lang={lang} onInstall={onInstall} onRun={onRun} onDbg={onDbg} />
  if (page === 'system')      return <SystemPage user={user} lang={lang} langIdx={langIdx} onChangeLang={onChangeLang} onOpenDebug={onOpenDebug} onDbg={onDbg} onUserUpdate={onUserUpdate} onSetSystemMessage={onSetSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} onNavigate={onNavigate} onInstall={onInstall} onRun={onRun} />
  if (page === '4')           return <BankingPage user={user} lang={lang} />
  if (page === '5')           return <PersonalPage user={user} lang={lang} onNavigate={onNavigate} onUserUpdate={onUserUpdate} onDbg={onDbg} />
  if (page === 'guides')      return <GuidesPage lang={lang} />
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', color: '#9b30c8' }}>{lang.menu[parseInt(page)]}</div>
        <div style={{ fontSize: '16px' }}>{lang.profile.comingSoon}</div>
      </div>
    </div>
  )
}

type BankConnection = { id: number; provider: string; institution_name: string; status: string; created_at: string }
type BankAccount    = { id: number; connection_id: number; iban: string; name: string; currency: string; account_type: string; balance: number }
type BankTx         = { id: number; date: string; description: string; amount: number; currency: string; category: string }

function BankingConnectPanel({ userId }: { userId: number | undefined }) {
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [accounts, setAccounts]       = useState<BankAccount[]>([])
  const [txs, setTxs]                 = useState<BankTx[]>([])
  const [selAccount, setSelAccount]   = useState<BankAccount | null>(null)
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([])
  const [step, setStep]               = useState<'main' | 'institutions' | 'txs'>('main')
  const [loading, setLoading]         = useState(false)
  const [msg, setMsg]                 = useState('')

  useEffect(() => { if (userId) load() }, [userId])

  async function load() {
    if (!userId) return
    setLoading(true)
    try {
      const r = await fetch(`/api/banking/accounts?userId=${userId}`)
      const d = await r.json()
      setConnections(d.connections ?? [])
      setAccounts(d.accounts ?? [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  async function handleConnect() {
    setLoading(true); setMsg('')
    try {
      const dp = await fetch('/api/banking/detect-provider', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'he' }),
      }).then(r => r.json())
      if (dp.provider === 'nordigen') {
        const country = dp.country ?? 'DE'
        const inst = await fetch(`/api/banking/nordigen/institutions?country=${country}`).then(r => r.json())
        setInstitutions(Array.isArray(inst) ? inst : [])
        setStep('institutions')
      } else if (dp.provider === 'plaid') {
        setMsg('Plaid — יתמך בשלב הבא')
      } else if (dp.provider === 'il') {
        setMsg('ספק ישראלי — עדיין לא מוגדר')
      } else {
        setMsg('לא זוהה ספק')
      }
    } catch { setMsg('שגיאה') } finally { setLoading(false) }
  }

  async function handleSelectInst(instId: string, instName: string) {
    if (!userId) return
    setLoading(true)
    try {
      const r = await fetch('/api/banking/nordigen/connect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId: instId, userId }),
      })
      const d = await r.json()
      if (d.link) { window.open(d.link, '_blank', 'width=600,height=700'); setMsg(`נפתח חלון חיבור ל-${instName}`); setStep('main') }
      else { setMsg('שגיאה ביצירת קישור') }
    } catch { setMsg('שגיאה') } finally { setLoading(false) }
  }

  async function handleDisconnect(connectionId: number) {
    setLoading(true)
    try {
      await fetch('/api/banking/accounts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ connectionId }) })
      await load()
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  async function handleViewTxs(account: BankAccount) {
    setSelAccount(account); setStep('txs'); setLoading(true); setTxs([])
    try {
      const d = await fetch(`/api/banking/transactions?accountId=${account.id}`).then(r => r.json())
      setTxs(d.transactions ?? [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const S = {
    panel:  { background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px', direction: 'rtl' as const },
    hdr:    { color: '#FFD700', fontSize: 13, fontWeight: 'bold' as const, borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 10 },
    btn:    { background: '#1a1a3a', border: '1px solid #FFD700', color: '#FFD700', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' as const },
    btnSm:  { background: '#111', border: '1px solid #555', color: '#aaa', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11 },
    btnRed: { background: '#2a0000', border: '1px solid #ff4444', color: '#ff4444', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11 },
    row:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' },
  }

  return (
    <div style={S.panel}>
      <div style={S.hdr}>ניהול חיבורים</div>

      {step === 'main' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button style={S.btn} onClick={handleConnect} disabled={loading}>+ חבר בנק</button>
            <button style={S.btnSm} onClick={load} disabled={loading}>↻ רענן</button>
          </div>
          {connections.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>אין חיבורים</div>}
          {connections.map(conn => (
            <div key={conn.id} style={{ marginBottom: 12 }}>
              <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                {conn.institution_name} <span style={{ color: conn.status === 'active' ? '#4CAF50' : '#ff6b6b', fontSize: 10 }}>({conn.status})</span>
              </div>
              {accounts.filter(a => a.connection_id === conn.id).map(acc => (
                <div key={acc.id} style={S.row}>
                  <div>
                    <span style={{ color: '#ccc', fontSize: 12 }}>{acc.name}</span>
                    <span style={{ color: '#666', fontSize: 11, marginRight: 8 }}>{acc.iban}</span>
                    <span style={{ color: '#aaa', fontSize: 11 }}>{acc.balance} {acc.currency}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={S.btnSm} onClick={() => handleViewTxs(acc)}>עסקאות</button>
                    <button style={S.btnRed} onClick={() => handleDisconnect(conn.id)}>נתק</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {step === 'institutions' && (
        <>
          <button style={S.btnSm} onClick={() => setStep('main')} disabled={loading}>← חזור</button>
          <div style={{ marginTop: 10 }}>
            {institutions.slice(0, 30).map(inst => (
              <div key={inst.id} style={{ ...S.row, cursor: 'pointer' }} onClick={() => handleSelectInst(inst.id, inst.name)}>
                <span style={{ color: '#ccc', fontSize: 12 }}>{inst.name}</span>
              </div>
            ))}
            {institutions.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>אין מוסדות</div>}
          </div>
        </>
      )}

      {step === 'txs' && selAccount && (
        <>
          <button style={S.btnSm} onClick={() => { setStep('main'); setSelAccount(null) }}>← חזור</button>
          <div style={{ color: '#FFD700', fontSize: 12, marginTop: 8, marginBottom: 6 }}>{selAccount.name} — {selAccount.iban}</div>
          {txs.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>אין עסקאות</div>}
          {txs.map((tx, i) => (
            <div key={i} style={S.row}>
              <span style={{ color: '#aaa', fontSize: 11 }}>{tx.date}</span>
              <span style={{ color: '#ccc', fontSize: 12, flex: 1, margin: '0 12px' }}>{tx.description}</span>
              <span style={{ color: tx.amount < 0 ? '#ff6b6b' : '#4CAF50', fontSize: 12 }}>{tx.amount} {tx.currency}</span>
            </div>
          ))}
        </>
      )}

      {msg && <div style={{ color: '#FFD700', fontSize: 12, marginTop: 8 }}>{msg}</div>}
      {loading && <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>טוען...</div>}
    </div>
  )
}

function generateYahavCSV(institutionName: string, accountNumber: string, accountType: string, transactions: BankTx[], balance: number): string {
  const reportDate = new Date().toLocaleDateString('he-IL') + ' ' + new Date().toLocaleTimeString('he-IL')
  const accTypeLabel = accountType === 'credit' ? 'כרטיס אשראי' : 'תנועות בחשבון עו"ש'
  const rows: string[] = [
    institutionName,
    accTypeLabel,
    '',
    `,"${accountNumber}"`,
    `,"${reportDate}"`,
    '',
  ]
  for (const tx of transactions) {
    const debit  = tx.amount < 0 ? Math.abs(tx.amount).toFixed(2) : '0'
    const credit = tx.amount > 0 ? tx.amount.toFixed(2) : '0'
    rows.push(`"${tx.date}","${tx.date}","","${tx.description}",${debit},${credit},${balance.toFixed(2)}`)
  }
  return rows.join('\r\n')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function BankingPage({ user, lang }: { user: UserRecord | null; lang: typeof languages[0] }) {
  const dir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [accounts, setAccounts]       = useState<BankAccount[]>([])
  const [txs, setTxs]                 = useState<BankTx[]>([])
  const [selAccount, setSelAccount]   = useState<BankAccount | null>(null)
  const [institutions, setInstitutions] = useState<{ id: string; name: string; logo?: string }[]>([])
  const [step, setStep]               = useState<'main' | 'region' | 'institutions' | 'txs'>('main')
  const [selectedCountry, setSelectedCountry] = useState('DE')
  const [loading, setLoading]         = useState(false)
  const [msg, setMsg]                 = useState('')
  const [msgIsError, setMsgIsError]   = useState(false)
  const b = lang.banking

  const setError = (text: string) => { setMsg(text); setMsgIsError(true) }
  const setInfo  = (text: string) => { setMsg(text); setMsgIsError(false) }

  useEffect(() => { if (user) loadConnections() }, [user])

  async function loadConnections() {
    if (!user) return
    setLoading(true)
    try {
      const r = await fetch(`/api/banking/accounts?userId=${user.id}`)
      const d = await r.json()
      setConnections(d.connections ?? [])
      setAccounts(d.accounts ?? [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  function handleConnectBank() {
    setMsg('')
    setStep('region')
  }

  async function handleAutoDetect() {
    setLoading(true); setMsg('')
    try {
      const dp = await fetch('/api/banking/detect-provider', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang.code }),
      }).then(r => r.json())
      if (dp.provider === 'nordigen') {
        const country = dp.country ?? 'DE'
        setSelectedCountry(country)
        const inst = await fetch(`/api/banking/nordigen/institutions?country=${country}`).then(r => r.json())
        setInstitutions(Array.isArray(inst) ? inst : [])
        setStep('institutions')
      } else if (dp.provider === 'plaid') {
        await handleSelectRegion('plaid')
      } else {
        setError(b.autoDetectFailed)
      }
    } catch { setError(b.detectionError) }
    finally { setLoading(false) }
  }

  async function handleSelectRegion(region: 'nordigen' | 'plaid') {
    if (region === 'nordigen') {
      setLoading(true); setMsg('')
      try {
        const inst = await fetch(`/api/banking/nordigen/institutions?country=${selectedCountry}`).then(r => r.json())
        setInstitutions(Array.isArray(inst) ? inst : [])
        setStep('institutions')
      } catch { setError(b.loadBanksError) }
      finally { setLoading(false) }
    } else {
      if (!user) return
      setLoading(true); setMsg('')
      try {
        const lt = await fetch('/api/banking/plaid/link-token', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        }).then(r => r.json())
        if (!lt.link_token) { setError(b.plaidTokenError); return }
        const openPlaid = (token: string) => {
          const handler = (window as any).Plaid.create({
            token,
            onSuccess: async (publicToken: string, metadata: { institution?: { name?: string } }) => {
              setLoading(true)
              try {
                const res = await fetch('/api/banking/plaid/exchange', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ publicToken, userId: user.id, institutionName: metadata?.institution?.name ?? 'Bank' }),
                }).then(r => r.json())
                if (res.ok) { setInfo(b.bankConnected); await loadConnections() }
                else { setError(b.connectionError) }
              } catch { setError(b.connectionError) }
              finally { setLoading(false) }
            },
            onExit: () => { setLoading(false) },
          })
          handler.open()
        }
        if ((window as any).Plaid) { openPlaid(lt.link_token) }
        else {
          const script = document.createElement('script')
          script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
          script.onload = () => openPlaid(lt.link_token)
          document.head.appendChild(script)
        }
        setStep('main')
      } catch { setError(b.connectionError) }
      finally { setLoading(false) }
    }
  }

  async function handleSelectInstitution(instId: string, instName: string) {
    if (!user) return
    setLoading(true); setMsg('')
    try {
      const r = await fetch('/api/banking/nordigen/connect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId: instId, userId: user.id }),
      })
      const d = await r.json()
      if (d.link) {
        window.open(d.link, '_blank', 'width=600,height=700')
        setInfo(b.linkOpened.replace('{name}', instName))
        setStep('main')
      } else { setError(b.linkCreateError) }
    } catch { setError(b.connectionError) } finally { setLoading(false) }
  }

  async function handleRefresh() {
    setLoading(true); setInfo(b.refreshing)
    await loadConnections()
    setInfo(b.updated)
    setTimeout(() => setMsg(''), 2000)
  }

  async function handleDisconnect(connectionId: number) {
    setLoading(true)
    try {
      await fetch('/api/banking/accounts', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId }),
      })
      await loadConnections()
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  async function handleViewTxs(account: BankAccount) {
    setSelAccount(account); setStep('txs'); setLoading(true); setTxs([])
    try {
      const r = await fetch(`/api/banking/transactions?accountId=${account.id}`)
      const d = await r.json()
      setTxs(d.transactions ?? [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const S = {
    wrap:    { width: '100%', height: '100%', background: '#0d0d0d', overflowY: 'auto' as const, direction: dir as 'rtl' | 'ltr', fontFamily: 'Arial, sans-serif', padding: '24px', boxSizing: 'border-box' as const },
    inner:   { display: 'inline-block' as const, minWidth: 420, maxWidth: 640, width: '100%' },
    title:   { color: '#FFD700', fontSize: 22, fontWeight: 'bold', marginBottom: 20, borderBottom: '2px solid #FFD700', paddingBottom: 10 },
    btn:     { background: '#1a1a3a', border: '1px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold' as const },
    btnSm:   { background: '#111', border: '1px solid #555', color: '#aaa', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
    btnRed:  { background: '#2a0000', border: '1px solid #ff4444', color: '#ff4444', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
    card:    { background: '#111', border: '1px solid #333', borderRadius: 10, padding: '16px', marginBottom: 16 },
    cardHdr: { color: '#FFD700', fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
    accRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #222', cursor: 'pointer' },
    txRow:   { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a1a1a', fontSize: 13 },
    instRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #222', cursor: 'pointer', borderRadius: 6 },
  }

  if (!user) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2eef2' }}>
      <div style={{ color: '#555', fontSize: 16 }}>{lang.profile.loginRequired}</div>
    </div>
  )

  async function handleDownloadAll() {
    if (!user) return
    setLoading(true); setInfo(b.fetchingData)
    try {
      const r = await fetch(`/api/banking/accounts?userId=${user.id}`)
      const d = await r.json()
      const conns: BankConnection[] = d.connections ?? []
      const accs: BankAccount[]     = d.accounts ?? []
      if (accs.length === 0) { setError(b.noAccountsConnected); return }
      let count = 0
      for (const acc of accs) {
        const conn = conns.find(c => c.id === acc.connection_id)
        const tr = await fetch(`/api/banking/transactions?accountId=${acc.id}`).then(r2 => r2.json())
        const txList: BankTx[] = tr.transactions ?? []
        const csv = generateYahavCSV(conn?.institution_name ?? acc.name, acc.iban || acc.name, acc.account_type, txList, acc.balance)
        const date = new Date().toISOString().slice(0, 10)
        const safeName = (conn?.institution_name ?? acc.name).replace(/[^a-zA-Z0-9א-ת]/g, '_')
        downloadCSV(csv, `banking_${safeName}_${acc.iban || acc.id}_${date}.csv`)
        count++
        await new Promise(res => setTimeout(res, 300))
      }
      setInfo(b.downloadedFiles.replace('{count}', String(count)))
    } catch { setError(b.downloadError) }
    finally { setLoading(false) }
  }

  const hasConnections = connections.length > 0

  const EU_CODES = ['DE','FR','GB','IT','ES','NL','BE','AT','CH','SE','NO','DK','FI','PL','PT','IE']
  let countryNames: Intl.DisplayNames | null = null
  try { countryNames = new Intl.DisplayNames([lang.code], { type: 'region' }) } catch { countryNames = null }
  const EU_COUNTRIES = EU_CODES.map(code => ({ code, name: countryNames?.of(code) ?? code }))
  const unitedStatesName = countryNames?.of('US') ?? b.unitedStates

  if (step === 'region') return (
    <div style={{ width: '100%', height: '100%', background: '#f2eef2', padding: '12px 14px', direction: dir as 'rtl' | 'ltr' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end' }}>
        <button onClick={() => setStep('main')} style={{ background: 'none', border: 'none', color: '#003399', cursor: 'pointer', fontSize: 18, padding: 0, alignSelf: 'flex-end' }}>← {b.back}</button>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003399' }}>{b.connectBankTitle}</div>

        <button onClick={handleAutoDetect} disabled={loading}
          style={{ background: '#eef2ff', border: '1px solid #99aadd', borderRadius: 6, padding: '6px 14px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, color: '#003399', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          🔍 {b.autoDetect}
        </button>

        <span style={{ color: '#aaa', fontSize: 18 }}>— {b.orManually} —</span>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', direction: dir as 'rtl' | 'ltr' }}>
          <button onClick={() => handleSelectRegion('nordigen')} disabled={loading}
            style={{ background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>►</button>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
            style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid #ccc', fontSize: 18, direction: 'ltr' }}>
            {EU_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <span style={{ fontSize: 18, color: '#333' }}>🇪🇺</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', direction: dir as 'rtl' | 'ltr' }}>
          <button onClick={() => handleSelectRegion('plaid')} disabled={loading}
            style={{ background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>►</button>
          <span style={{ fontSize: 18, color: '#333' }}>🇺🇸 {unitedStatesName}</span>
        </div>

        {msg && <div style={{ color: msgIsError ? '#cc0000' : '#006600', fontSize: 18 }}>{msg}</div>}
        {loading && <div style={{ color: '#aaa', fontSize: 18 }}>...</div>}
      </div>
    </div>
  )

  if (step === 'institutions') return (
    <div style={{ width: '100%', height: '100%', background: '#f2eef2', overflowY: 'auto', padding: 24, direction: dir as 'rtl' | 'ltr' }}>
      <button onClick={() => setStep('main')} style={{ marginBottom: 16, background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>← {b.back}</button>
      <div style={{ fontWeight: 'bold', fontSize: 16, color: '#003399', marginBottom: 12 }}>{b.selectInstitution}</div>
      {institutions.map(inst => (
        <div key={inst.id} onClick={() => handleSelectInstitution(inst.id, inst.name)}
          style={{ padding: '10px 14px', borderBottom: '1px solid #ddd', cursor: 'pointer', fontSize: 14, color: '#222' }}>
          {inst.name}
        </div>
      ))}
      {institutions.length === 0 && !loading && <div style={{ color: '#aaa', fontSize: 13 }}>{b.noInstitutions}</div>}
    </div>
  )

  return (
    <div style={{ width: '100%', height: '100%', background: '#f2eef2', overflowY: 'auto', padding: '12px 14px', direction: 'rtl' }}>
      <PageHeader subtitle={lang.menu[4]} lang={lang} />
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003399' }}>{lang.menu[4]}</div>

        {/* חשבונות מחוברים */}
        {hasConnections && (
          <div style={{ fontSize: 14, color: '#333' }}>
            {connections.map(conn => (
              <div key={conn.id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 'bold', color: '#003399' }}>{conn.institution_name}</span>
                {accounts.filter(a => a.connection_id === conn.id).map(acc => (
                  <span key={acc.id} style={{ marginRight: 8, color: '#555' }}> {acc.name} {acc.balance} {acc.currency}</span>
                ))}
              </div>
            ))}
            <button onClick={handleRefresh} disabled={loading} style={{ background: 'none', border: '1px solid #999', borderRadius: 5, padding: '3px 10px', cursor: 'pointer', fontSize: 14, color: '#555' }}>
              ↻ {b.refresh}
            </button>
          </div>
        )}

        {/* Connect bank */}
        <button onClick={handleAutoDetect} disabled={loading}
          style={{ background: '#eef2ff', border: '1px solid #99aadd', borderRadius: 6, padding: '6px 14px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, color: '#003399', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          🔍 {b.autoDetect}
        </button>

        <span style={{ color: '#aaa', fontSize: 16 }}>— {b.orManually} —</span>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', direction: dir as 'rtl' | 'ltr' }}>
          <button onClick={() => handleSelectRegion('nordigen')} disabled={loading}
            style={{ background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>►</button>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
            style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid #ccc', fontSize: 18, direction: 'ltr' }}>
            {EU_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <span style={{ fontSize: 18, color: '#333' }}>🇪🇺</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', direction: dir as 'rtl' | 'ltr' }}>
          <button onClick={() => handleSelectRegion('plaid')} disabled={loading}
            style={{ background: '#003399', color: '#FFD700', border: 'none', borderRadius: 5, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>►</button>
          <span style={{ fontSize: 18, color: '#333' }}>🇺🇸 {unitedStatesName}</span>
        </div>

        {/* Download files */}
        <button onClick={handleDownloadAll} disabled={loading}
          style={{ background: '#006600', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          ⬇ {b.downloadFiles}
        </button>

        {msg && <div style={{ color: msgIsError ? '#cc0000' : '#006600', fontSize: 16, fontWeight: 'bold' }}>{msg}</div>}
        {loading && <div style={{ color: '#aaa', fontSize: 16 }}>...</div>}
      </div>
    </div>
  )

}

function InstallCard({ lang, onInstall, onRun, onDbg }: { lang: typeof languages[0]; onInstall: () => void; onRun: () => void; onDbg: (func: string, msg: string) => void }) {
  useEffect(() => {
    onDbg('InstallCard', 'mount => onInstall()')
    onInstall()
  }, [])
  const dir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2eef2', direction: dir }}>
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#003399', marginBottom: '6px' }}>{lang.card.mFinance}</div>
        <div style={{ fontSize: '15px', color: '#555', marginBottom: '28px', whiteSpace: 'pre-line', lineHeight: '1.7' }}>{lang.card.msgInstallComplete}</div>
        <button onClick={onRun} style={{ background: '#003399', color: '#FFD700', border: '2px solid #FFD700', borderRadius: '8px', padding: '12px 32px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          {lang.card.run}
        </button>
      </div>
    </div>
  )
}

function handFont(code: string) {
  if (code === 'he') return '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif'
  if (code === 'ru') return 'var(--font-caveat),"Caveat",cursive'
  return 'var(--font-dancing),"Dancing Script",Georgia,serif'
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
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
  const [registered,       setRegistered]       = useState(false)
  const [showNotFoundMsg,  setShowNotFoundMsg]  = useState(false)
  const [showPass,         setShowPass]         = useState(false)
  const [showConfPass,     setShowConfPass]     = useState(false)

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
    if (!res.ok) {
      onDbg('handleLogin', `res.ok=false err="${data.error}" code="${data.code}"`)
      if (data.code === 'NOT_FOUND') { setShowNotFoundMsg(true); return }
      setError(data.error); return
    }
    onDbg('handleLogin', `success user.id=${data.user?.id} email="${data.user?.email}" last_ip="${data.user?.last_ip}" => onClose => onLogin`)
    setSavedName('')
    setSavedEmail('')
    setSavedPass('')
    setSavedConf('')
    setPhase('default')
    setRegistered(false)
    onClose()
    onLogin(data.user)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f2eef2' }}>
      <PageHeader subtitle={`${lang.card.title} - ${lang.card.login}`} lang={lang} />
      <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '40px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: 'Arial, sans-serif', position: 'absolute', top: '100px', left: '50%', transform: `translate(calc(-50% + ${pos.x}px), ${pos.y}px)` }}>

        <div onMouseDown={onDragStart} style={{ textAlign: 'center', marginBottom: '28px', cursor: 'grab', userSelect: 'none' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontStyle: 'italic', fontFamily: 'var(--font-dancing), Georgia, serif' }}>KeyClick</div>
          <div style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', color: '#FFD700', fontSize: '22px', marginTop: '6px' }}>{c.title}</div>
          <div style={{ color: '#999', fontSize: '13px', marginTop: '2px', fontFamily: 'Arial, sans-serif' }}>M Finance</div>
        </div>

        {phase === 'default' ? (
          <>
            <div style={{ position: 'relative', border: '2px solid #555', borderRadius: '10px', padding: '16px', paddingTop: '22px', marginBottom: '10px' }}>
              <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#2a2a2a', padding: '0 10px', color: '#FFD700', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', direction: dir }}>{c.existingCustomer}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text"     placeholder={c.namePh}  value={savedName}  onChange={e => { setSavedName(e.target.value);  setShowNotFoundMsg(false) }} style={{ ...regInput, direction: dir }} />
                <input type="email"    placeholder={c.emailPh} value={savedEmail} onChange={e => { setSavedEmail(e.target.value); setShowNotFoundMsg(false) }} style={{ ...regInput }} />
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder={c.passPh} value={savedPass} onChange={e => { setSavedPass(e.target.value); setShowNotFoundMsg(false) }} style={{ ...regInput, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}><EyeIcon open={showPass} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <button onClick={handleLogin} style={{ ...regBtn, padding: '5px 18px', fontSize: '13px' }}>{c.login}</button>
              </div>
              {error && !showNotFoundMsg && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
              {showNotFoundMsg && (
                <div onClick={() => setPhase('register')} style={{ marginTop: '10px', padding: '8px 14px', background: '#3a1a00', border: '1px solid #FFD700', borderRadius: '8px', color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer', direction: dir }}>
                  {c.notRecognized}
                </div>
              )}
            </div>
            <div style={{ position: 'relative', border: '2px solid #555', borderRadius: '10px', padding: '14px', paddingTop: '22px', marginBottom: '10px' }}>
              <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#2a2a2a', padding: '0 10px', color: '#FFD700', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', direction: dir }}>{c.newCustomer}</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setPhase('register')} style={{ ...regBtn, padding: '5px 18px', fontSize: '13px' }}>{c.register}</button>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontFamily: font, color: '#ffffff', fontWeight: 'bold' }}>
              <div style={{ fontSize: '12px' }}>{c.line1}</div>
              <div style={{ fontSize: '16px' }}>{c.line2}</div>
            </div>
            <div onClick={onClose} style={{ position: 'absolute', right: '12px', bottom: '12px', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00aa00', fontSize: '12px', fontWeight: '900', userSelect: 'none', border: '1px solid #ccc' }}>{c.cancel}</div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text"     placeholder={c.namePh}        value={savedName}  onChange={e => setSavedName(e.target.value)}  style={{ ...regInput, direction: dir }} />
              <input type="email"    placeholder={c.emailPh}       value={savedEmail} onChange={e => setSavedEmail(e.target.value)} style={{ ...regInput }} />
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder={c.passPh} value={savedPass} onChange={e => setSavedPass(e.target.value)} style={{ ...regInput, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}><EyeIcon open={showPass} /></button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showConfPass ? 'text' : 'password'} placeholder={c.confirmPassPh} value={savedConf} onChange={e => setSavedConf(e.target.value)} style={{ ...regInput, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowConfPass(p => !p)} tabIndex={-1} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}><EyeIcon open={showConfPass} /></button>
              </div>
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
    onDbg('scheduleEffect', 'loading schedule from API')
    fetch('/api/system/schedule').then(r => r.json()).then(d => {
      if (!d.data?.rows) { onDbg('scheduleEffect', 'no rows in response'); return }
      const PLAN_IDX: Record<string, number> = { User_Trial: 2, User_Monthly: 4, User_Annual: 5, User_One_Time: 6 }
      const map: Record<string, { price: string; months: string }> = {}
      Object.entries(PLAN_IDX).forEach(([planKey, idx]) => {
        const row = d.data.rows[idx]
        if (row) map[planKey] = { price: row.price ?? '', months: row.months ?? '' }
      })
      onDbg('scheduleEffect', `loaded — ${Object.keys(map).join(', ')}`)
      setScheduleData(map)
    }).catch(e => onDbg('scheduleEffect', `error: ${String(e)}`))
  }, [])

  useEffect(() => {
    if (!planView) return
    onDbg('exchangeEffect', 'loading exchange rates')
    fetch('/api/exchange-rates').then(r => r.json()).then(d => {
      if (d.rates) { setExchangeRates(d.rates); onDbg('exchangeEffect', `loaded — ${Object.keys(d.rates).join(', ')}`) }
    }).catch(e => onDbg('exchangeEffect', `error: ${String(e)}`))
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
      onDbg('selectPlan', `response status=${res.status} ok=${res.ok} license=${data.user?.license_type ?? 'none'}`)
      if (res.ok && data.user) {
        onDbg('selectPlan', 'onUserUpdate called'); onUserUpdate(data.user)
        const displayName = lang.profile.planNames[key as keyof typeof lang.profile.planNames]
        await fetch(`/api/reminders?user_id=${user.id}&type=plan`, { method: 'DELETE' })
        await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, title: `${displayName} - ${lang.profile.planStart}`, date: planStart, time: null, type: 'plan' }) })
        if (planEnd) await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, title: `${displayName} - ${lang.profile.planEnd}`, date: planEnd, time: null, type: 'plan' }) })
        onDbg('selectPlan', `plan reminders synced — start=${planStart} end=${planEnd ?? 'none'}`)
        setUpdating(false); return true
      }
      onDbg('selectPlan', `failed — data=${JSON.stringify(data)}`)
    } catch (err) { onDbg('selectPlan', `error: ${String(err)}`) }
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
    onDbg('PersonalPage', `user updated — license=${user.M_Finance_license_type} system_force=${user.system_force ?? 'null'} isOwner=${isOwner} isFreeRun=${isFreeRun} isSystemForced=${isSystemForced} → button ${isFreeRun || isSystemForced ? 'locked' : 'open'}`)
  }, [user?.M_Finance_license_type, user?.system_force])

  const p = lang.profile

  if (!user) return <div style={{ width: '100%', height: '100%', background: '#f2eef2' }} />

  const personalFields = [
    { label: p.fullName,  value: [user.name, user.last_name].filter(Boolean).join(' ') || '—' },
    { label: p.email,     value: user.email    || '—' },
    { label: p.ip,        value: (() => { if (!user.last_ip) return '—'; const hex = user.last_ip.split('.').length === 4 ? '(' + user.last_ip.split('.').map(n => parseInt(n).toString(16).padStart(2,'0').toUpperCase()).join('') + ')' : ''; return hex ? `${user.last_ip} ${hex}` : user.last_ip })() },
    { label: p.language,  value: languages.find(l => l.code === user.language)?.name ?? user.language ?? '—' },
  ]

  const outerWrap: React.CSSProperties = { width: '100%', height: '100%', background: '#f2eef2', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '0 20px 28px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }
  const cardBox:  React.CSSProperties  = { width: '100%', maxWidth: '780px', background: '#fff', border: '2px solid #003399', borderRadius: '12px', padding: '32px 36px', boxShadow: '0 4px 16px rgba(0,0,60,0.08)' }
  const thStyle:  React.CSSProperties  = { padding: '8px 12px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }
  const tdStyle:  React.CSSProperties  = { padding: '9px 12px', border: '1px solid #ccd' }

  const thP: React.CSSProperties = { padding: '9px 10px', textAlign: 'right', color: '#FFD700', fontWeight: 'bold', border: '1px solid #3355bb' }
  const tdP: React.CSSProperties = { padding: '9px 10px', border: '1px solid #c5cde8', background: '#fff' }
  const secBox: React.CSSProperties = { position: 'relative', border: '2px solid #c5cde8', borderRadius: '12px', background: '#f7f9ff' }
  const secLabel: React.CSSProperties = { position: 'absolute', top: '-11px', right: '18px', background: '#f7f9ff', padding: '0 10px', color: '#003399', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }

  if (planView) {
    const createdAt = user.created_at ? new Date(String(user.created_at)) : new Date()
    return (
      <div style={outerWrap}>
        <PageHeader subtitle={`${lang.feedback.customerRelations} - ${lang.menu[5]}`} lang={lang} />
        <div style={cardBox}>

          {/* Header */}
          <div style={{ marginBottom: '22px', paddingBottom: '14px', borderBottom: '3px solid #003399' }}>
            <div style={{ fontSize: '22px', color: '#003399', fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', marginBottom: '2px' }}>KeyClick</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#003399' }}>{p.changePlan}</div>
          </div>

          {/* Plans table */}
          <div style={{ ...secBox, padding: '22px 16px 16px', marginBottom: '18px' }}>
            <span style={secLabel}>{lang.card.title}</span>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(to left, #003399, #1a4acc)' }}>
                  <th style={thP}>{p.planName}</th>
                  <th style={{ ...thP, textAlign: 'center' }}><div>{p.price}</div><div style={{ fontSize: '11px', color: '#ffd70099', fontWeight: 'normal' }}>[$]</div></th>
                  <th style={{ ...thP, textAlign: 'center' }}><div>{p.price}</div><select value={selectedCurrency} onChange={e => handleCurrencyChange(e.target.value)} style={{ fontSize: '11px', border: '1px solid #5577cc', borderRadius: '3px', padding: '1px 2px', marginTop: '2px', background: '#1a3a88', cursor: 'pointer', color: '#FFD700', fontWeight: 'bold', outline: 'none' }}>{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {lang.currencyNames[c.code as keyof typeof lang.currencyNames]}</option>)}</select></th>
                  <th style={{ ...thP, textAlign: 'center' }}>{p.planFrom}</th>
                  <th style={{ ...thP, textAlign: 'center' }}>{p.planTo}</th>
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
                    <tr key={key} style={{ background: sel ? '#e8edff' : '#fff' }}>
                      <td style={tdP}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="radio" name="plan" checked={sel}
                            onChange={() => setSelKey(key)}
                            style={{ width: '16px', height: '16px', accentColor: '#003399', cursor: 'pointer' }} />
                          <span style={{ fontWeight: sel ? 'bold' : 'normal', color: sel ? '#003399' : '#1a1a1a' }}>{displayName}</span>
                        </label>
                      </td>
                      <td style={{ ...tdP, textAlign: 'center', color: '#555' }}>{isTrial ? p.free : price}</td>
                      <td style={{ ...tdP, textAlign: 'center', color: '#555' }}>{isTrial ? p.free : priceLocal}</td>
                      <td style={{ ...tdP, textAlign: 'center', color: '#555' }}>{sel ? fmtDate(createdAt) : ''}</td>
                      <td style={{ ...tdP, textAlign: 'center', color: '#555' }}>{sel ? toDate : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={async () => { onDbg('confirmPlan', `selKey=${selKey ?? 'null'}`); if (selKey && await selectPlan(selKey)) { onDbg('confirmPlan', 'success — closing planView'); setPlanView(false) } }}
              disabled={!selKey || updating}
              style={{ background: '#003399', border: 'none', borderRadius: '7px', color: '#FFD700', fontSize: '13px', fontWeight: 'bold', padding: '7px 20px', cursor: selKey && !updating ? 'pointer' : 'default', opacity: selKey && !updating ? 1 : 0.5 }}>
              {updating ? '...' : lang.card.update}
            </button>
            <button
              onClick={() => setPlanView(false)}
              disabled={updating}
              style={{ background: '#f0f0f8', border: '1px solid #c5cde8', borderRadius: '7px', color: '#555', fontSize: '13px', padding: '7px 16px', cursor: 'pointer' }}>
              {p.back}
            </button>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div style={outerWrap}>
      <PageHeader subtitle={`${lang.feedback.customerRelations} - ${lang.menu[5]}`} lang={lang} />
      <div style={cardBox}>

        {/* Header */}
        <div style={{ marginBottom: '22px', paddingBottom: '14px', borderBottom: '3px solid #003399' }}>
          <div style={{ fontSize: '22px', color: '#003399', fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', marginBottom: '2px' }}>KeyClick</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#003399' }}>{lang.menu[5]}</div>
        </div>

        {/* Personal info */}
        <div style={{ ...secBox, padding: '22px 20px 18px', marginBottom: '20px' }}>
          <span style={secLabel}>{lang.menu[5]}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {personalFields.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ color: '#6670a0', fontSize: '13px', minWidth: '130px' }}>{label}:</span>
                <span style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div style={{ ...secBox, padding: '22px 16px 16px' }}>
          <span style={secLabel}>{p.products}</span>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(to left, #003399, #1a4acc)' }}>
                <th style={{ ...thP, width: '1%' }}></th>
                <th style={thP}>{p.products}</th>
                <th style={thP}>{p.plan}</th>
                <th style={thP}>{p.planStart}</th>
                <th style={thP}>{p.planEnd}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdP, whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => {
                      onDbg('changePlan', `click — isFreeRun=${isFreeRun} isSystemForced=${isSystemForced}`)
                      if (isFreeRun || isSystemForced) { onDbg('changePlan', 'locked — exit'); return }
                      const cur = CHANGE_PLAN_OPTIONS.find(o => LICENSE_TYPES[o.key] === user.M_Finance_license_type)?.key ?? null
                      onDbg('changePlan', `opening planView selKey=${cur ?? 'null'}`)
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
                <td style={tdP}>
                  <div style={{ fontWeight: 'bold', fontFamily: handFont(lang.code), fontSize: '17px' }}>{lang.card.title}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>M Finance</div>
                </td>
                <td style={{ ...tdP, color: '#003399', fontWeight: 'bold' }}>
                  {(() => { const k = Object.entries(LICENSE_TYPES).find(([,v]) => v === user.M_Finance_license_type)?.[0]; return k ? (p.planNames as Record<string,string>)[k] ?? user.M_Finance_license_type : user.M_Finance_license_type })()}
                </td>
                <td style={{ ...tdP, color: '#555' }}>{user.plan_start ? fmtDate(new Date(String(user.plan_start))) : '—'}</td>
                <td style={{ ...tdP, color: '#555' }}>{user.plan_end ? fmtDate(new Date(String(user.plan_end))) : isFreePlan ? p.unlimited : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
