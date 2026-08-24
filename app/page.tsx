'use client'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { LICENSE_TYPES } from '@/lib/license-types'

export const languages = [
  { code: 'en', flag: 'בריטניה', name: 'English',  welcome: 'Welcome',
    menu: ['Feedback','Updates','Messages','Reminders','Banking Services','Personal Page'],
    card: { title: 'Home Budget Management', namePh: 'Name / Last Name', emailPh: 'Email / Email Address', passPh: 'Password', confirmPassPh: 'Confirm Password', register: 'Register', login: 'Login', locked: 'Locked', registered: 'Registered', update: 'Update', line1: 'During launch period', line2: 'Free', errName: 'Please enter your name', errEmail: 'Please enter a valid email', errPassLen: 'Password must be at least 6 characters', errPassMatch: 'Please type a matching password confirmation', errEmailExists: 'Email already registered', cancel: 'Cancel', install: 'Install', library: 'Guide Files', run: 'Run', videos: 'Videos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Already installed\nNo need to reinstall', msgDownloading: 'Downloading installation file', msgInstallComplete: 'Save and run the file\nto complete installation', msgDownloadError: 'Download error\nTry again', mFinance: 'M Finance', msgExists: 'User already registered\nwith these details', msgUpdated: 'Details updated successfully', msgRegistered: 'Registration complete', existingCustomer: 'Existing Customer', newCustomer: 'New Customer', notRecognized: 'Customer not registered. Click to register', msgSelectPlan: 'Please select a plan in your personal page', infoServices: 'Information Services', guidesAndVideos: 'Guides & Videos', siteHeaderPrefix: 'The website of', theWebsite: 'The Website', loginSubtitle: 'Log in to your account', emailPhSimple: 'Email', passPhSimple: 'Password', connectingEllipsis: 'Connecting...', noAccountQuestion: 'Don\'t have an account?', registerHereLink: 'Register here', invalidCredentials: 'Invalid email or password', registerErrorGeneric: 'Registration error' },
    profile: { fullName: 'Full Name', email: 'Email', ip: 'IP', language: 'Language', country: 'Country', plan: 'Plan', planStart: 'Plan Start', planEnd: 'Plan End', unlimited: 'Unlimited', comingSoon: 'Coming Soon', choosePlan: 'Choose Plan', close: '✕ Close', loginRequired: 'Login required to view personal page', login: 'Login', products: 'Products', change: 'Change',
      price: 'Price', changePlan: 'Choose Plan', planName: 'Name', planFrom: 'From', planTo: 'To', back: 'Back', currencyLocal: '$', free: 'Free',       planNames: { System_Free_Run: 'Free Run', User_Trial: 'Trial', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monthly', User_Annual: 'Annual', User_One_Time: 'Single Entry', System_Suspended_NonPayment: 'Suspended', User_Cancelled: 'Cancelled' } },
    feedback: { customerRelations: 'Customer Relations', systemMessage: 'System Message', respectfully: 'Respectfully,', rating: 'Rating', ratingWebsite: 'Website', ratingBudget: 'Home Budget Management', userMessage: 'User Message', date: 'Date:', title: 'Title:', from: 'From:', systemReply: 'System Reply' },
    system: { systemLabel: 'System', selectAction: 'Select action from right sidebar', users: 'Users', buildMessages: 'Build Messages', schedule: 'Tables and Data', pr: 'Public Relations', announcements: 'Announcements', publishedDate: 'Published date:', reset: 'Reset', saved: 'Saved', records: 'records', scheduleSubject: 'Subject', schedulePriceUSD: 'Price\n[$]', schedulePeriod: 'Period\n[mo]', scheduleNotes: 'Notes', clear: 'Clear', pause: 'Pause', resume: 'Resume', active: '● Active', paused: 'Paused', lines: 'lines', filter: 'Filter', refresh: 'Refresh', loading: 'Loading...', loadingBuild: 'Loading build data...', error: 'Error', noBuildData: 'No build data. Run Release_KeyClick.bat', networkError: 'Network error', testsCreateFolderLegend: 'Create folder in download folder', testsNameLabel: 'Name', testsCreateButton: 'Click to create', testsFolderCreatedPrefix: 'Folder created:', scheduleTitle: 'Price list and schedule', allFinancialInstitutions: 'All financial institutions', newSystemMessageTitle: 'New system message', systemMessageLabel: 'System message', broadcastPlaceholder: 'Message content', sensitiveColEnv: 'Environment', sensitiveColFlag: 'Flag Name', sensitiveColPurpose: 'Purpose', sensitiveDevBypassEnv: 'Site 3000 (local dev)', sensitiveDevBypassFlag: 'Bypass login', sensitiveDevBypassPurpose: '1=bypass 0=no bypass — developer only', adminButton: 'System Use', generalGroup: 'General', colName: 'Name', colCurrency: 'Currency', colCreated: 'Created', colActive: 'Is Active', colAppInstalled: 'App Installed', colLicenceType: 'Licence Type', colSystemForce: 'System Force', distributionDay: 'Distribution Day X', messages: 'Messages', send: 'Send', sent: 'Sent!', reply: 'Reply', noMessages: 'No messages', replySent: 'Reply sent!', ref: 'Ref.', msgNo: 'No.', replyToRef: 'Reply to ref.', msgNumber: 'Message No.', new: 'New', delete: 'Delete', newMessage: '+ New Message', selectToView: 'Select a message to view', monitor: 'Monitor', systemData: 'System Data', resetTable: 'Reset Table', debug: 'Debug', db: 'DB', sensitivePoints: 'Sensitive Points', productVersionTable: 'Product Version Table in Updates Tab', lab: 'Lab', allCustomers: 'All Customers', newMessageNotif: 'New message, please click here', colType: 'Type', labTests: 'Tests', labBanking: 'Financial Institutions', colCustomer: 'Customer', adminNewMsg: '- New Message -', dataCollection: 'Data Collection', data: 'Live', statistics: 'Processing', billing: 'Billing', billLastPlan: 'Last Plan', billLastAmount: 'Last Amount', billLastDate: 'Last Payment Date', billStatus: 'Status', billPlan: 'Plan', billAmount: 'Amount', billDate: 'Date', billNoPayments: 'No payments', colRunningNo: 'No.', colIp: 'IP Address', colEntered: 'Entry Time', colExited: 'Exit Time', colDuration: 'Duration', durationMin: 'min', durationSec: 'sec', statTotalVisits: 'Total Visits', statUniqueVisitors: 'Unique Visitors', statOnlineNow: 'Online Now', statAvgDuration: 'Avg. Duration', statLongestVisit: 'Longest Visit', statBusiestHour: 'Busiest Hour', statBusiestDay: 'Busiest Day', statNamed: 'Identified', statAnonymous: 'Anonymous', statHourlyTitle: 'Activity by Hour', statDayTitle: 'Activity by Day', statNoData: 'Not enough data yet', statPeriod: 'Measured period', statTotalVisitsDesc: 'Total number of recorded visits (every page load counts)', statUniqueVisitorsDesc: 'Number of distinct IP addresses that visited, counted once each', statOnlineNowDesc: 'Visitors currently on the site who have not exited yet', statAvgDurationDesc: 'Average browsing time of visitors who have already exited', statHourlyTitleDesc: 'Total visits that entered during each hour of the day, summed over the whole period', statDayTitleDesc: 'Total visits that entered on each day of the week, summed over the whole period', statNamedDesc: 'Visitors whose IP address matches a registered user', statAnonymousDesc: 'Visitors with no match to a registered user', statBusiestHourDesc: 'The hour with the most entries', statBusiestDayDesc: 'The day with the most entries', statLongestVisitDesc: 'The longest browsing duration recorded in a single visit', statLegend: 'Legend', statYearlyTitle: 'Yearly Activity', statByMonth: 'By Month', statByWeek: 'By Week', statReturning: 'Returning', statLinked: 'Linked', statCountryTitle: 'Visits by Country', statNoGeoData: 'Unknown', statDurationTitle: 'Browsing Time Distribution', statDur0_5: '0–5 min', statDur5_15: '5–15 min', statDur15_60: '15–60 min', statDur60_120: '60–120 min', statDurOver120: 'Over 2 hours', statWeekOf: 'Week of', statOngoingTitle: 'Ongoing Data Processing', statActivityTab: 'Activity', runStatusRunning: 'Active', runStatusStopped: 'Stopped', dataCollectionLegend: 'Data Collection', collectionStart: 'Start', collectionEnd: 'End', endToggleActive: 'Until Here', endToggleInactive: 'No End', runToggleActive: 'Data Collection Active', runToggleInactive: 'Data Collection Inactive', legendUnregistered: 'Unregistered', legendRegistered: 'Registered', graphEntriesTitle: 'Number of Site Visitors', graphDurationTitle: 'Site Browsing Time', providersTitle: 'Providers', providerStatusConfigured: '✓ Configured', providerStatusPendingRegistration: '✗ Pending registration', providerNordigenDesc: 'Europe — 2300+ banks', providerPlaidDesc: 'US — thousands of banks', providerIlName: 'Israel (Salt Edge)', providerIlDesc: 'Israel — banks and credit cards', providerGroqDesc: 'Automatic country detection', colProvider: 'Provider', colRole: 'Role', routeDescTokenNordigen: 'access token from Nordigen', routeDescInstitutionsNordigen: 'list of banks by country', routeDescConnectNordigen: 'create requisition + bank link', routeDescCallbackNordigen: 'receive confirmation + save to DB', routeDescLinkTokenPlaid: 'create Link Token', routeDescExchangePlaid: 'exchange public_token after connecting', routeDescSyncPlaid: 'sync transactions + balances', routeDescConnectIl: 'connect to Israeli provider', routeDescCallbackIl: 'callback + save to DB', routeDescAccountsShared: 'user\'s accounts', routeDescTransactionsShared: 'transactions + sync from provider', routeDescDetectProvider: 'automatic detection: country → provider', routeDescStatusSystem: 'credentials status', routeDescDataSystem: 'DB data', providerLabelIsrael: 'Israel', providerLabelShared: 'Shared', providerLabelSystem: 'System', accountsBalancesTitle: 'Accounts and Balances', colFinancialInstitution: 'Financial Institution', colAccount: 'Account', colBalance: 'Balance', noAccountsConnectedExample: 'No accounts connected — showing example', connectionsLabel: 'Connections', accountsLabel: 'Accounts', transactionsLabel: 'Transactions', noRecordsFound: 'No records', editButton: 'Edit', weightedScoreTitle: 'Weighted Score', colPercent: 'Percent', colMetric: 'Metric', colExplanation: 'Explanation', totalWeightsLabel: 'Total weights:', weightedNumberLabel: 'Weighted number', weightedFormula: 'Weighted score (0–10) = Σ ( metric_i ∈ {0,1} × weight_i% ) × 10 / 100', scanningLabel: 'Scanning...', scanUsersButton: 'Scan users and update score', mfMessagesLegend: 'Messages for M Finance', entranceGateMessagesLegend: 'Messages for the entrance gate', entranceGateWord: 'Entrance Gate', connectionsManagementTitle: 'Manage Connections', connectBankAction: 'Connect Bank', noConnections: 'No connections', disconnectButton: 'Disconnect', plaidNotYetSupported: 'Plaid — supported in a future step', israeliProviderNotConfigured: 'Israeli provider — not configured yet', providerNotDetected: 'Provider not detected', noTransactions: 'No transactions' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Pound', EUR: 'Euro', RUB: 'Ruble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupee' },
    updates: { colDate: 'Date & Time', colProduct: 'Product', colVersion: 'Version', colTitle: 'Title', productKeyClick: 'KeyClick Website', productMFinance: 'M Finance Home Budget' },
    reminders: { loginRequired: 'Login required to view reminders', titlePh: 'Reminder title', timePh: 'Time', add: '+ Add', noReminders: 'No reminders' },
    guides: { overview: 'Overview', userGuide: 'User Guide', financeOverviewTitle: 'What is M Finance', financeOverviewDesc: 'A short overview of home budget management — accounts, transactions, categories and forecasts, and who it is intended for.', financeGuideTitle: 'Step-by-step usage', financeGuideDesc: 'A written guide with screenshots: installation, connecting accounts, categorization and reports.', financeVideosTitle: 'Short tutorials', financeVideosDesc: 'Short video tutorials for every key feature in home budget management.', siteOverviewTitle: 'What the website offers', siteOverviewDesc: "A short tour of the KeyClick platform — products, services and customer relations.", siteGuideTitle: 'Registration and navigation', siteGuideDesc: 'How to register, log in and find every service on the website.', siteVideosTitle: 'Website demos', siteVideosDesc: "Short recorded demos of the website's main features." },
    banking: { autoDetectFailed: 'Auto-detect failed — choose manually', detectionError: 'Detection error', loadBanksError: 'Error loading banks', plaidTokenError: 'Plaid token error', bankConnected: 'Bank connected', connectionError: 'Connection error', linkOpened: 'A connection window opened for {name}. After approving, come back and click refresh.', linkCreateError: 'Error creating bank link', refreshing: 'Refreshing...', updated: 'Updated', fetchingData: 'Fetching data...', noAccountsConnected: 'No accounts connected', downloadedFiles: 'Downloaded {count} files', downloadError: 'Download error', connectBankTitle: 'Connect Bank', autoDetect: 'Auto Detect', orManually: 'or manually', unitedStates: 'United States', back: 'Back', selectInstitution: 'Select institution', noInstitutions: 'No institutions', refresh: 'Refresh', downloadFiles: 'Download Files', clickToDownload: 'Click to download', decorWorldwide: 'Around the world', decorPrivateLine1: 'Private connection to the bank', decorPrivateLine2: 'Disconnected from home budget management', instructionsTitle: 'Instructions', instructionsLine1: 'Please follow the red arrow pointing to the button you need to click.', instructionsLine2: 'Log in to your financial institution using the security credentials used by that institution.', instructionsLine3: 'Please complete the entire process, at the end of which you will disconnect from the financial institution.', instructionsLine4: 'Please follow the system messages.', systemMessagesTitle: 'System Messages', noMessagesYet: 'No messages yet', clickToConnect: 'Click to Connect', readData: 'Read Data', clickToDisconnect: 'Click to Disconnect', clickToClose: 'Click to Close', waitingForSelection: 'Waiting for selection', chooseDownloadType: 'Choose the data download type', downloadFilesToComputer: 'Download Files to Computer', loadDataBtn: 'Load Data', connectingToInstitution: 'Connecting to {name}...', connectedStatus: 'Connected', connectDoneMsg: 'Connected to {name}', disconnectingFromInstitution: 'Disconnecting from {name}...', disconnectDoneMsg: 'Disconnected', readingDataMsg: 'Reading data from the financial institution...', readingDataDoneMsg: 'Data reading complete', loadingDataMsg: 'Loading data...', accountStatementMsg: 'Account statement {id} for the period {period}', creditStatementMsg: 'Credit card statement {id} for the period {period}', dataLoadedDoneMsg: 'Data loaded successfully', doneStatus: 'Done', loadDataErrorMsg: 'Error loading data', downloadingFilesMsg: 'Downloading files to computer...', fileDownloadedForPeriodMsg: '{file} downloaded - for the period {period}', downloadFilesErrorMsg: 'Error downloading files', closingWindowMsg: 'Closing the website window...', selectedDownloadFilesMsg: 'Selected: Download Files to Computer', selectedLoadDataMsg: 'Selected: Load Data', totalFilesMsg: 'Total: {count} files', introTitlePrefix: 'Hi, welcome to the banking services of', card1Title: 'The service includes', card1Item1: 'Connecting to a financial institution where you have an account', card1Item2: 'Downloading account statement files', card1Item3: 'Direct loading into home budget management', card1Item4: 'An experience in an advanced technological environment', card2Title: 'Key points', card2Item1: 'The connection is only for downloading files, no other action', card2Item2: 'The connection follows the security settings used by the selected financial institution', card2Item3: 'The account statements remain only in the current environment - no connection to clouds or external storage', card2Item4: 'This service can be activated from here, and also directly from home budget management', card3Title: 'Process steps', card3Item1: 'Click on "Select financial institution"', card3Item2: 'On the institutions page, select an institution', card3Item3: 'Follow the red arrow, click where it points', card3Item4: 'Complete the process until full disconnection closure', introSuccess: 'Good luck', }, captions: { guidesRight1: 'A cabinet of drawers', guidesRight2: 'with guides and videos', guidesLeft: 'Treasure drawers...', guidesDrawersLine1: 'Drawers 1–6', guidesDrawersLine2: 'also from here…', registerRight1: 'A quick registration', registerRight2: 'on the way to a variety of surprises...', personalDefaultRight: 'Basic personal details, from the system', personalDefaultLeft: 'Active plan. Option to change the plan', personalPlanRight: 'Selecting a plan will show the period and price', personalPlanLeft1: 'Click', personalPlanLeft2: 'Update', personalPlanLeft3: "when you're done choosing", feedbackAboveButton: 'Each new form is for one message and one reply. See the New Message button', updatesWord1: 'Software', updatesWord2: 'versions', updatesWord3: "for the project's", updatesWord4: 'components', remindersRight1: 'Reminders service', remindersRight2: 'Calendar of important events', remindersLeft1: 'Dates of the active plan', remindersLeft2: 'Option to add private', remindersLeft3: 'reminder dates' } },
  { code: 'ru', flag: 'רוסיה',   name: 'Русский',  welcome: 'Добро пожаловать',
    menu: ['Отзыв','Обновления','Сообщения','Напоминания','Банковские услуги','Личная страница'],
    card: { title: 'Управление домашним бюджетом', namePh: 'Имя / Фамилия', emailPh: 'Email / Адрес эл. почты', passPh: 'Пароль', confirmPassPh: 'Подтвердите пароль', register: 'Регистрация', login: 'Войти', locked: 'Заблокировано', registered: 'Зарегистрирован', update: 'Обновить', line1: 'В период запуска', line2: 'Бесплатно', errName: 'Пожалуйста, введите имя', errEmail: 'Введите корректный email', errPassLen: 'Пароль должен содержать не менее 6 символов', errPassMatch: 'Пожалуйста, введите совпадающее подтверждение пароля', errEmailExists: 'Email уже зарегистрирован', cancel: 'Отмена', install: 'Установить', library: 'Файлы руководства', run: 'Запуск', videos: 'Видео', guide: 'Руководство', ok: 'ОК', msgAlreadyInstalled: 'Уже установлено\nПереустановка не нужна', msgDownloading: 'Загрузка установщика', msgInstallComplete: 'Сохраните и запустите файл\nдля завершения установки', msgDownloadError: 'Ошибка загрузки\nПопробуйте снова', mFinance: 'M Finance', msgExists: 'Пользователь уже зарегистрирован\nс этими данными', msgUpdated: 'Данные обновлены успешно', msgRegistered: 'Регистрация завершена', existingCustomer: 'Существующий клиент', newCustomer: 'Новый клиент', notRecognized: 'Клиент не зарегистрирован. Нажмите для регистрации', msgSelectPlan: 'Выберите тарифный план в личном кабинете', infoServices: 'Информационные услуги', guidesAndVideos: 'Руководства и видео', siteHeaderPrefix: 'Веб-сайт', theWebsite: 'Сайт', loginSubtitle: 'Вход в аккаунт', emailPhSimple: 'Email', passPhSimple: 'Пароль', connectingEllipsis: 'Вход...', noAccountQuestion: 'Нет аккаунта?', registerHereLink: 'Зарегистрироваться здесь', invalidCredentials: 'Неверный email или пароль', registerErrorGeneric: 'Ошибка регистрации' },
    profile: { fullName: 'Полное имя', email: 'Email', ip: 'IP', language: 'Язык', country: 'Страна', plan: 'Тариф', planStart: 'Начало тарифа', planEnd: 'Конец тарифа', unlimited: 'Без ограничений', comingSoon: 'Скоро', choosePlan: 'Выбрать тариф', close: '✕ Закрыть', loginRequired: 'Необходимо войти для просмотра', login: 'Войти', products: 'Продукты', change: 'Изменить',
      price: 'Цена', changePlan: 'Выбрать тариф', planName: 'Название', planFrom: 'С', planTo: 'По', back: 'Назад', currencyLocal: '₽', free: 'Бесплатно',       planNames: { System_Free_Run: 'Тест', User_Trial: 'Пробный', User_VIP_Free: 'VIP', System_Owner: 'Система', User_Monthly: 'Ежемесячно', User_Annual: 'Ежегодно', User_One_Time: 'Разовый', System_Suspended_NonPayment: 'Отключён', User_Cancelled: 'Отменён' } },
    feedback: { customerRelations: 'Связи с клиентами', systemMessage: 'Системное сообщение', respectfully: 'С уважением,', rating: 'Оценка', ratingWebsite: 'Сайт', ratingBudget: 'Управление бюджетом', userMessage: 'Сообщение пользователя', date: 'Дата:', title: 'Тема:', from: 'От:', systemReply: 'Ответ системы' },
    system: { systemLabel: 'Система', selectAction: 'Выберите действие на правой панели', users: 'Пользователи', buildMessages: 'Журнал сборки', schedule: 'Таблицы и данные', pr: 'PR', announcements: 'Объявления', publishedDate: 'Опубликовано:', reset: 'Сбросить', saved: 'Сохранено', records: 'записей', scheduleSubject: 'Тема', schedulePriceUSD: 'Цена\n[$]', schedulePeriod: 'Период\n[мес]', scheduleNotes: 'Заметки', clear: 'Очистить', pause: 'Пауза', resume: 'Продолжить', active: '● Активно', paused: 'На паузе', lines: 'строк', filter: 'Фильтр', refresh: 'Обновить', loading: 'Загрузка...', loadingBuild: 'Загрузка данных сборки...', error: 'Ошибка', noBuildData: 'Нет данных. Запустите Release_KeyClick.bat', networkError: 'Ошибка сети', testsCreateFolderLegend: 'Создать папку в папке загрузок', testsNameLabel: 'Имя', testsCreateButton: 'Нажмите, чтобы создать', testsFolderCreatedPrefix: 'Папка создана:', scheduleTitle: 'Прайс-лист и график', allFinancialInstitutions: 'Все финансовые учреждения', newSystemMessageTitle: 'Новое системное сообщение', systemMessageLabel: 'Системное сообщение', broadcastPlaceholder: 'Текст сообщения', sensitiveColEnv: 'Среда', sensitiveColFlag: 'Имя флага', sensitiveColPurpose: 'Назначение', sensitiveDevBypassEnv: 'Сайт 3000 (локальная разработка)', sensitiveDevBypassFlag: 'Обход входа', sensitiveDevBypassPurpose: '1=обход 0=без обхода — только для разработчика', adminButton: 'Системный вход', generalGroup: 'Общие', colName: 'Имя', colCurrency: 'Валюта', colCreated: 'Создан', colActive: 'Активен', colAppInstalled: 'Приложение', colLicenceType: 'Тип лицензии', colSystemForce: 'Системный режим', distributionDay: 'День X распространения', messages: 'Сообщения', send: 'Отправить', sent: 'Отправлено!', reply: 'Ответить', noMessages: 'Нет сообщений', replySent: 'Ответ отправлен!', ref: 'Реф.', msgNo: '№', replyToRef: 'Ответ на реф.', msgNumber: 'Сообщение №', new: 'Новое', delete: 'Удалить', newMessage: '+ Новое сообщение', selectToView: 'Выберите сообщение', monitor: 'Монитор', systemData: 'Данные системы', resetTable: 'Сброс таблицы', debug: 'Отладка', db: 'БД', sensitivePoints: 'Уязвимые точки', productVersionTable: 'Таблица версий продукта (вкладка обновлений)', lab: 'Лаборатория', allCustomers: 'Все клиенты', newMessageNotif: 'Новое сообщение, нажмите здесь', colType: 'Тип', labTests: 'Тесты', labBanking: 'Финансовые учреждения', colCustomer: 'Клиент', adminNewMsg: '- Новое сообщение -', dataCollection: 'Сбор данных', data: 'Онлайн', statistics: 'Обработка', billing: 'Расчёты', billLastPlan: 'Последний план', billLastAmount: 'Последняя сумма', billLastDate: 'Дата последнего платежа', billStatus: 'Статус', billPlan: 'План', billAmount: 'Сумма', billDate: 'Дата', billNoPayments: 'Нет платежей', colRunningNo: '№', colIp: 'IP-адрес', colEntered: 'Время входа', colExited: 'Время выхода', colDuration: 'Длительность', durationMin: 'мин', durationSec: 'сек', statTotalVisits: 'Всего визитов', statUniqueVisitors: 'Уникальные посетители', statOnlineNow: 'Онлайн сейчас', statAvgDuration: 'Средняя длительность', statLongestVisit: 'Самый долгий визит', statBusiestHour: 'Самый загруженный час', statBusiestDay: 'Самый загруженный день', statNamed: 'Опознанные', statAnonymous: 'Анонимные', statHourlyTitle: 'Активность по часам', statDayTitle: 'Активность по дням', statNoData: 'Пока недостаточно данных', statPeriod: 'Измеряемый период', statTotalVisitsDesc: 'Общее число зафиксированных визитов (каждая загрузка страницы считается)', statUniqueVisitorsDesc: 'Число различных IP-адресов, посетивших сайт, каждый считается один раз', statOnlineNowDesc: 'Посетители, которые сейчас на сайте и ещё не вышли', statAvgDurationDesc: 'Среднее время просмотра у посетителей, которые уже вышли', statHourlyTitleDesc: 'Общее число визитов в каждый час суток за весь период', statDayTitleDesc: 'Общее число визитов в каждый день недели за весь период', statNamedDesc: 'Посетители, чей IP совпадает с зарегистрированным пользователем', statAnonymousDesc: 'Посетители без совпадения с зарегистрированным пользователем', statBusiestHourDesc: 'Час с наибольшим числом входов', statBusiestDayDesc: 'День с наибольшим числом входов', statLongestVisitDesc: 'Самая долгая продолжительность, зафиксированная за один визит', statLegend: 'Легенда', statYearlyTitle: 'Годовая активность', statByMonth: 'По месяцам', statByWeek: 'По неделям', statReturning: 'Повторные', statLinked: 'Связанные', statCountryTitle: 'Визиты по странам', statNoGeoData: 'Неизвестно', statDurationTitle: 'Распределение времени просмотра', statDur0_5: '0–5 мин', statDur5_15: '5–15 мин', statDur15_60: '15–60 мин', statDur60_120: '60–120 мин', statDurOver120: 'Более 2 часов', statWeekOf: 'Неделя', statOngoingTitle: 'Текущая обработка данных', statActivityTab: 'Активность', runStatusRunning: 'Активно', runStatusStopped: 'Остановлено', dataCollectionLegend: 'Сбор данных', collectionStart: 'Начало', collectionEnd: 'Конец', endToggleActive: 'До сюда', endToggleInactive: 'Без конца', runToggleActive: 'Сбор данных активен', runToggleInactive: 'Сбор данных неактивен', legendUnregistered: 'Незарегистрированные', legendRegistered: 'Зарегистрированные', graphEntriesTitle: 'Количество посетителей сайта', graphDurationTitle: 'Время просмотра сайта', providersTitle: 'Провайдеры', providerStatusConfigured: '✓ Настроено', providerStatusPendingRegistration: '✗ Ожидает регистрации', providerNordigenDesc: 'Европа — 2300+ банков', providerPlaidDesc: 'США — тысячи банков', providerIlName: 'Израиль (Salt Edge)', providerIlDesc: 'Израиль — банки и кредитные карты', providerGroqDesc: 'Автоматическое определение страны', colProvider: 'Провайдер', colRole: 'Роль', routeDescTokenNordigen: 'токен доступа от Nordigen', routeDescInstitutionsNordigen: 'список банков по стране', routeDescConnectNordigen: 'создание requisition + ссылки на банк', routeDescCallbackNordigen: 'получение подтверждения + сохранение в БД', routeDescLinkTokenPlaid: 'создание Link Token', routeDescExchangePlaid: 'обмен public_token после подключения', routeDescSyncPlaid: 'синхронизация транзакций и балансов', routeDescConnectIl: 'подключение к израильскому провайдеру', routeDescCallbackIl: 'callback + сохранение в БД', routeDescAccountsShared: 'счета пользователя', routeDescTransactionsShared: 'транзакции + синхронизация от провайдера', routeDescDetectProvider: 'автоопределение: страна → провайдер', routeDescStatusSystem: 'статус учётных данных', routeDescDataSystem: 'данные БД', providerLabelIsrael: 'Израиль', providerLabelShared: 'Общее', providerLabelSystem: 'Система', accountsBalancesTitle: 'Счета и балансы', colFinancialInstitution: 'Финансовое учреждение', colAccount: 'Счёт', colBalance: 'Баланс', noAccountsConnectedExample: 'Нет подключённых счетов — показан пример', connectionsLabel: 'Подключения', accountsLabel: 'Счета', transactionsLabel: 'Транзакции', noRecordsFound: 'Нет записей', editButton: 'Редактировать', weightedScoreTitle: 'Взвешенная оценка', colPercent: 'Проценты', colMetric: 'Показатель', colExplanation: 'Пояснение', totalWeightsLabel: 'Сумма весов:', weightedNumberLabel: 'Взвешенное число', weightedFormula: 'Взвешенная оценка (0–10) = Σ ( показатель_i ∈ {0,1} × вес_i% ) × 10 / 100', scanningLabel: 'Сканирование...', scanUsersButton: 'Сканировать пользователей и обновить оценку', mfMessagesLegend: 'Сообщения для M Finance', entranceGateMessagesLegend: 'Сообщения для входного шлюза', entranceGateWord: 'Входной шлюз', connectionsManagementTitle: 'Управление подключениями', connectBankAction: 'Подключить банк', noConnections: 'Нет подключений', disconnectButton: 'Отключить', plaidNotYetSupported: 'Plaid — будет поддержан позже', israeliProviderNotConfigured: 'Израильский провайдер — ещё не настроен', providerNotDetected: 'Провайдер не определён', noTransactions: 'Нет транзакций' },
    currencyNames: { ILS: 'Шекель', USD: 'Доллар', GBP: 'Фунт', EUR: 'Евро', RUB: 'Рубль', JPY: 'Иена', SAR: 'Риял', CNY: 'Юань', INR: 'Рупия' },
    updates: { colDate: 'Дата и время', colProduct: 'Продукт', colVersion: 'Версия', colTitle: 'Заголовок', productKeyClick: 'KeyClick Сайт', productMFinance: 'M Finance Бюджет' },
    reminders: { loginRequired: 'Войдите для просмотра напоминаний', titlePh: 'Название напоминания', timePh: 'Время', add: '+ Добавить', noReminders: 'Нет напоминаний' },
    guides: { overview: 'Общее описание', userGuide: 'Руководство пользователя', financeOverviewTitle: 'Что такое M Finance', financeOverviewDesc: 'Краткий обзор управления домашним бюджетом — счета, операции, категории и прогнозы, и для кого это подходит.', financeGuideTitle: 'Пошаговое использование', financeGuideDesc: 'Письменное руководство со скриншотами: установка, подключение счетов, категоризация и отчёты.', financeVideosTitle: 'Короткие уроки', financeVideosDesc: 'Короткие видеоуроки по каждой ключевой функции управления домашним бюджетом.', siteOverviewTitle: 'Что предлагает сайт', siteOverviewDesc: 'Краткий обзор платформы KeyClick — продукты, услуги и работа с клиентами.', siteGuideTitle: 'Регистрация и навигация', siteGuideDesc: 'Как зарегистрироваться, войти и найти любую услугу на сайте.', siteVideosTitle: 'Демонстрации сайта', siteVideosDesc: 'Короткие видеозаписи основных функций сайта.' },
    banking: { autoDetectFailed: 'Автоопределение не удалось — выберите вручную', detectionError: 'Ошибка определения', loadBanksError: 'Ошибка загрузки банков', plaidTokenError: 'Ошибка Plaid Token', bankConnected: 'Банк подключён', connectionError: 'Ошибка подключения', linkOpened: 'Открыто окно подключения к {name}. После подтверждения вернитесь и нажмите обновить.', linkCreateError: 'Ошибка создания ссылки на банк', refreshing: 'Обновление...', updated: 'Обновлено', fetchingData: 'Получение данных...', noAccountsConnected: 'Нет подключённых счетов', downloadedFiles: 'Загружено файлов: {count}', downloadError: 'Ошибка загрузки', connectBankTitle: 'Подключить банк', autoDetect: 'Автоопределение', orManually: 'или вручную', unitedStates: 'США', back: 'Назад', selectInstitution: 'Выберите банк', noInstitutions: 'Нет банков', refresh: 'Обновить', downloadFiles: 'Скачать файлы', clickToDownload: 'Нажмите, чтобы скачать', decorWorldwide: 'Вокруг света', decorPrivateLine1: 'Частное подключение к банку', decorPrivateLine2: 'Не связано с управлением семейным бюджетом', instructionsTitle: 'Инструкции', instructionsLine1: 'Пожалуйста, следуйте за красной стрелкой, указывающей на кнопку, которую нужно нажать.', instructionsLine2: 'Войдите в свою финансовую организацию, используя данные безопасности, принятые в этой организации.', instructionsLine3: 'Пожалуйста, завершите весь процесс, в конце которого вы отключитесь от финансовой организации.', instructionsLine4: 'Пожалуйста, следите за системными сообщениями.', systemMessagesTitle: 'Системные сообщения', noMessagesYet: 'Пока нет сообщений', clickToConnect: 'Нажмите для подключения', readData: 'Считать данные', clickToDisconnect: 'Нажмите для отключения', clickToClose: 'Нажмите для закрытия', waitingForSelection: 'Ожидание выбора', chooseDownloadType: 'Выберите способ загрузки данных', downloadFilesToComputer: 'Скачать файлы на компьютер', loadDataBtn: 'Загрузить данные', connectingToInstitution: 'Подключение к {name}...', connectedStatus: 'Подключено', connectDoneMsg: 'Подключение к {name} выполнено', disconnectingFromInstitution: 'Отключение от {name}...', disconnectDoneMsg: 'Отключение выполнено', readingDataMsg: 'Считывание данных из финансовой организации...', readingDataDoneMsg: 'Считывание данных завершено', loadingDataMsg: 'Загрузка данных...', accountStatementMsg: 'Выписка по счёту {id} за период {period}', creditStatementMsg: 'Выписка по кредитной карте {id} за период {period}', dataLoadedDoneMsg: 'Данные успешно загружены', doneStatus: 'Выполнено', loadDataErrorMsg: 'Ошибка загрузки данных', downloadingFilesMsg: 'Скачивание файлов на компьютер...', fileDownloadedForPeriodMsg: '{file} загружен — за период {period}', downloadFilesErrorMsg: 'Ошибка загрузки файлов', closingWindowMsg: 'Закрытие окна сайта...', selectedDownloadFilesMsg: 'Выбрано: скачать файлы на компьютер', selectedLoadDataMsg: 'Выбрано: загрузить данные', totalFilesMsg: 'Всего: {count} файлов', introTitlePrefix: 'Привет, добро пожаловать в банковские услуги', card1Title: 'Услуга включает', card1Item1: 'Подключение к финансовому учреждению, в котором у вас есть счёт', card1Item2: 'Загрузка файлов выписок по счёту', card1Item3: 'Прямая загрузка в управление семейным бюджетом', card1Item4: 'Опыт работы в передовой технологической среде', card2Title: 'Основные моменты', card2Item1: 'Подключение служит только для загрузки файлов и не выполняет никаких других действий', card2Item2: 'Подключение осуществляется в соответствии с настройками безопасности, принятыми в выбранном финансовом учреждении', card2Item3: 'Выписки по счёту остаются только в текущей среде — нет подключения к облакам или внешним хранилищам', card2Item4: 'Эту услугу можно запустить отсюда, а также напрямую из управления семейным бюджетом', card3Title: 'Порядок выполнения', card3Item1: 'Нажмите "Выбрать финансовое учреждение"', card3Item2: 'На странице учреждений выберите учреждение', card3Item3: 'Следуйте за красной стрелкой, нажмите там, куда она указывает', card3Item4: 'Завершите процесс до полного отключения', introSuccess: 'Удачи', }, captions: { guidesRight1: 'Шкаф с ящиками', guidesRight2: 'с руководствами и видео', guidesLeft: 'Ящики сокровищ...', guidesDrawersLine1: 'Ящики 1–6', guidesDrawersLine2: 'тоже отсюда…', registerRight1: 'Быстрая регистрация', registerRight2: 'на пути к множеству сюрпризов...', personalDefaultRight: 'Основные личные данные из системы', personalDefaultLeft: 'Активный тариф. Возможность сменить тариф', personalPlanRight: 'При выборе тарифа отобразятся срок и цена', personalPlanLeft1: 'Нажмите', personalPlanLeft2: '«Обновить»', personalPlanLeft3: 'по завершении выбора', feedbackAboveButton: 'Каждая новая форма — для одного сообщения и одного ответа. См. кнопку «Новое сообщение»', updatesWord1: 'Версии', updatesWord2: 'программного', updatesWord3: 'обеспечения', updatesWord4: 'проекта', remindersRight1: 'Сервис напоминаний', remindersRight2: 'Календарь важных событий', remindersLeft1: 'Даты активного тарифа', remindersLeft2: 'Возможность добавить личные', remindersLeft3: 'даты напоминаний' } },
  { code: 'de', flag: 'גרמניה',  name: 'Deutsch',  welcome: 'Willkommen',
    menu: ['Feedback','Updates','Nachrichten','Erinnerungen','Bankdienstleistungen','Persönliche Seite'],
    card: { title: 'Haushaltsverwaltung', namePh: 'Name / Nachname', emailPh: 'E-Mail / E-Mail-Adresse', passPh: 'Passwort', confirmPassPh: 'Passwort bestätigen', register: 'Registrieren', login: 'Anmelden', locked: 'Gesperrt', registered: 'Registriert', update: 'Aktualisieren', line1: 'Während der Einführungsphase', line2: 'Kostenlos', errName: 'Bitte geben Sie Ihren Namen ein', errEmail: 'Bitte geben Sie eine gültige E-Mail ein', errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein', errPassMatch: 'Bitte geben Sie eine passende Passwortbestätigung ein', errEmailExists: 'E-Mail bereits registriert', cancel: 'Abbrechen', install: 'Installieren', library: 'Anleitungsdateien', run: 'Starten', videos: 'Videos', guide: 'Anleitung', ok: 'OK', msgAlreadyInstalled: 'Bereits installiert\nKeine Neuinstallation nötig', msgDownloading: 'Installationsdatei wird heruntergeladen', msgInstallComplete: 'Datei speichern und ausführen\num die Installation abzuschließen', msgDownloadError: 'Fehler beim Herunterladen\nNochmal versuchen', mFinance: 'M Finance', msgExists: 'Benutzer bereits registriert\nmit diesen Daten', msgUpdated: 'Daten erfolgreich aktualisiert', msgRegistered: 'Registrierung abgeschlossen', existingCustomer: 'Bestehender Kunde', newCustomer: 'Neuer Kunde', notRecognized: 'Kunde nicht registriert. Klicken zum Registrieren', msgSelectPlan: 'Bitte wähle einen Plan auf deiner persönlichen Seite', infoServices: 'Informationsdienste', guidesAndVideos: 'Anleitungen & Videos', siteHeaderPrefix: 'Die Website von', theWebsite: 'Die Website', loginSubtitle: 'Anmeldung zu Ihrem Konto', emailPhSimple: 'E-Mail', passPhSimple: 'Passwort', connectingEllipsis: 'Anmelden...', noAccountQuestion: 'Noch kein Konto?', registerHereLink: 'Hier registrieren', invalidCredentials: 'E-Mail oder Passwort falsch', registerErrorGeneric: 'Fehler bei der Registrierung' },
    profile: { fullName: 'Vollständiger Name', email: 'E-Mail', ip: 'IP', language: 'Sprache', country: 'Land', plan: 'Tarif', planStart: 'Tarif Beginn', planEnd: 'Tarif Ende', unlimited: 'Unbegrenzt', comingSoon: 'Demnächst', choosePlan: 'Tarif wählen', close: '✕ Schließen', loginRequired: 'Anmeldung erforderlich', login: 'Anmelden', products: 'Produkte', change: 'Ändern',
      price: 'Preis', changePlan: 'Tarif wählen', planName: 'Name', planFrom: 'Von', planTo: 'Bis', back: 'Zurück', currencyLocal: '€', free: 'Kostenlos',       planNames: { System_Free_Run: 'Testlauf', User_Trial: 'Testphase', User_VIP_Free: 'VIP', System_Owner: 'System', User_Monthly: 'Monatlich', User_Annual: 'Jährlich', User_One_Time: 'Einmalig', System_Suspended_NonPayment: 'Gesperrt', User_Cancelled: 'Storniert' } },
    feedback: { customerRelations: 'Kundenpflege', systemMessage: 'Systemnachricht', respectfully: 'Mit freundlichen Grüßen,', rating: 'Bewertung', ratingWebsite: 'Website', ratingBudget: 'Haushaltsverwaltung', userMessage: 'Nutzernachricht', date: 'Datum:', title: 'Betreff:', from: 'Von:', systemReply: 'Systemantwort' },
    system: { systemLabel: 'System', selectAction: 'Aktion in der rechten Leiste wählen', users: 'Benutzer', buildMessages: 'Build-Protokoll', schedule: 'Tabellen und Daten', pr: 'PR', announcements: 'Ankündigungen', publishedDate: 'Veröffentlicht:', reset: 'Zurücksetzen', saved: 'Gespeichert', records: 'Einträge', scheduleSubject: 'Thema', schedulePriceUSD: 'Preis\n[$]', schedulePeriod: 'Zeitraum\n[Mo]', scheduleNotes: 'Notizen', clear: 'Löschen', pause: 'Pause', resume: 'Fortsetzen', active: '● Aktiv', paused: 'Pausiert', lines: 'Zeilen', filter: 'Filter', refresh: 'Aktualisieren', loading: 'Laden...', loadingBuild: 'Build-Daten laden...', error: 'Fehler', noBuildData: 'Keine Daten. Starten Sie Release_KeyClick.bat', networkError: 'Netzwerkfehler', testsCreateFolderLegend: 'Ordner im Download-Ordner erstellen', testsNameLabel: 'Name', testsCreateButton: 'Klicken zum Erstellen', testsFolderCreatedPrefix: 'Ordner erstellt:', scheduleTitle: 'Preisliste und Zeitplan', allFinancialInstitutions: 'Alle Finanzinstitute', newSystemMessageTitle: 'Neue Systemnachricht', systemMessageLabel: 'Systemnachricht', broadcastPlaceholder: 'Nachrichteninhalt', sensitiveColEnv: 'Umgebung', sensitiveColFlag: 'Flag-Name', sensitiveColPurpose: 'Zweck', sensitiveDevBypassEnv: 'Website 3000 (lokale Entwicklung)', sensitiveDevBypassFlag: 'Login umgehen', sensitiveDevBypassPurpose: '1=umgehen 0=nicht umgehen — nur für Entwickler', adminButton: 'Systembereich', generalGroup: 'Allgemein', colName: 'Name', colCurrency: 'Währung', colCreated: 'Erstellt', colActive: 'Aktiv', colAppInstalled: 'App', colLicenceType: 'Lizenztyp', colSystemForce: 'Systemmodus', distributionDay: 'Verbreitungstag X', messages: 'Nachrichten', send: 'Senden', sent: 'Gesendet!', reply: 'Antworten', noMessages: 'Keine Nachrichten', replySent: 'Antwort gesendet!', ref: 'Ref.', msgNo: 'Nr.', replyToRef: 'Antwort auf Ref.', msgNumber: 'Nachricht Nr.', new: 'Neu', delete: 'Löschen', newMessage: '+ Neue Nachricht', selectToView: 'Nachricht auswählen', monitor: 'Monitor', systemData: 'Systemdaten', resetTable: 'Tabelle zurücksetzen', debug: 'Debug', db: 'DB', sensitivePoints: 'Schwachstellen', productVersionTable: 'Produktversionstabelle (Updates)', lab: 'Labor', allCustomers: 'Alle Kunden', newMessageNotif: 'Neue Nachricht, bitte hier klicken', colType: 'Typ', labTests: 'Tests', labBanking: 'Finanzinstitute', colCustomer: 'Kunde', adminNewMsg: '- Neue Nachricht -', dataCollection: 'Datenerfassung', data: 'Live', statistics: 'Verarbeitung', billing: 'Abrechnung', billLastPlan: 'Letzter Tarif', billLastAmount: 'Letzter Betrag', billLastDate: 'Letztes Zahlungsdatum', billStatus: 'Status', billPlan: 'Tarif', billAmount: 'Betrag', billDate: 'Datum', billNoPayments: 'Keine Zahlungen', colRunningNo: 'Nr.', colIp: 'IP-Adresse', colEntered: 'Eintrittszeit', colExited: 'Austrittszeit', colDuration: 'Dauer', durationMin: 'Min', durationSec: 'Sek', statTotalVisits: 'Besuche gesamt', statUniqueVisitors: 'Eindeutige Besucher', statOnlineNow: 'Jetzt online', statAvgDuration: 'Ø Dauer', statLongestVisit: 'Längster Besuch', statBusiestHour: 'Stärkste Stunde', statBusiestDay: 'Stärkster Tag', statNamed: 'Identifiziert', statAnonymous: 'Anonym', statHourlyTitle: 'Aktivität nach Stunde', statDayTitle: 'Aktivität nach Tag', statNoData: 'Noch nicht genug Daten', statPeriod: 'Gemessener Zeitraum', statTotalVisitsDesc: 'Gesamtzahl der erfassten Besuche (jeder Seitenaufruf zählt)', statUniqueVisitorsDesc: 'Anzahl unterschiedlicher IP-Adressen, die besucht haben, je einmal gezählt', statOnlineNowDesc: 'Besucher, die sich gerade auf der Seite befinden und noch nicht verlassen haben', statAvgDurationDesc: 'Durchschnittliche Verweildauer der Besucher, die bereits gegangen sind', statHourlyTitleDesc: 'Gesamtzahl der Besuche pro Stunde des Tages, über den gesamten Zeitraum summiert', statDayTitleDesc: 'Gesamtzahl der Besuche pro Wochentag, über den gesamten Zeitraum summiert', statNamedDesc: 'Besucher, deren IP-Adresse mit einem registrierten Benutzer übereinstimmt', statAnonymousDesc: 'Besucher ohne Übereinstimmung mit einem registrierten Benutzer', statBusiestHourDesc: 'Die Stunde mit den meisten Eintritten', statBusiestDayDesc: 'Der Tag mit den meisten Eintritten', statLongestVisitDesc: 'Die längste bei einem einzelnen Besuch gemessene Verweildauer', statLegend: 'Legende', statYearlyTitle: 'Jahresaktivität', statByMonth: 'Nach Monat', statByWeek: 'Nach Woche', statReturning: 'Wiederkehrend', statLinked: 'Verknüpft', statCountryTitle: 'Besuche nach Land', statNoGeoData: 'Unbekannt', statDurationTitle: 'Verweildauer-Verteilung', statDur0_5: '0–5 Min', statDur5_15: '5–15 Min', statDur15_60: '15–60 Min', statDur60_120: '60–120 Min', statDurOver120: 'Über 2 Stunden', statWeekOf: 'Woche vom', statOngoingTitle: 'Laufende Datenverarbeitung', statActivityTab: 'Aktivität', runStatusRunning: 'Aktiv', runStatusStopped: 'Gestoppt', dataCollectionLegend: 'Datenerfassung', collectionStart: 'Start', collectionEnd: 'Ende', endToggleActive: 'Bis hier', endToggleInactive: 'Kein Ende', runToggleActive: 'Datenerfassung aktiv', runToggleInactive: 'Datenerfassung inaktiv', legendUnregistered: 'Nicht registriert', legendRegistered: 'Registriert', graphEntriesTitle: 'Anzahl der Website-Besucher', graphDurationTitle: 'Verweildauer auf der Website', providersTitle: 'Anbieter', providerStatusConfigured: '✓ Konfiguriert', providerStatusPendingRegistration: '✗ Registrierung ausstehend', providerNordigenDesc: 'Europa — über 2300 Banken', providerPlaidDesc: 'USA — Tausende Banken', providerIlName: 'Israel (Salt Edge)', providerIlDesc: 'Israel — Banken und Kreditkarten', providerGroqDesc: 'Automatische Länderkennung', colProvider: 'Anbieter', colRole: 'Rolle', routeDescTokenNordigen: 'Zugriffstoken von Nordigen', routeDescInstitutionsNordigen: 'Bankliste nach Land', routeDescConnectNordigen: 'Requisition erstellen + Bankverbindung', routeDescCallbackNordigen: 'Bestätigung empfangen + in DB speichern', routeDescLinkTokenPlaid: 'Link Token erstellen', routeDescExchangePlaid: 'public_token nach Verbindung umtauschen', routeDescSyncPlaid: 'Transaktionen + Salden synchronisieren', routeDescConnectIl: 'Verbindung zum israelischen Anbieter', routeDescCallbackIl: 'Callback + in DB speichern', routeDescAccountsShared: 'Konten des Benutzers', routeDescTransactionsShared: 'Transaktionen + Sync vom Anbieter', routeDescDetectProvider: 'automatische Erkennung: Land → Anbieter', routeDescStatusSystem: 'Status der Zugangsdaten', routeDescDataSystem: 'DB-Daten', providerLabelIsrael: 'Israel', providerLabelShared: 'Gemeinsam', providerLabelSystem: 'System', accountsBalancesTitle: 'Konten und Salden', colFinancialInstitution: 'Finanzinstitut', colAccount: 'Konto', colBalance: 'Saldo', noAccountsConnectedExample: 'Keine Konten verbunden — Beispiel wird angezeigt', connectionsLabel: 'Verbindungen', accountsLabel: 'Konten', transactionsLabel: 'Transaktionen', noRecordsFound: 'Keine Datensätze', editButton: 'Bearbeiten', weightedScoreTitle: 'Gewichtete Bewertung', colPercent: 'Prozent', colMetric: 'Kennzahl', colExplanation: 'Erklärung', totalWeightsLabel: 'Summe der Gewichte:', weightedNumberLabel: 'Gewichtete Zahl', weightedFormula: 'Gewichtete Bewertung (0–10) = Σ ( Kennzahl_i ∈ {0,1} × Gewicht_i% ) × 10 / 100', scanningLabel: 'Scannen...', scanUsersButton: 'Benutzer scannen und Bewertung aktualisieren', mfMessagesLegend: 'Nachrichten für M Finance', entranceGateMessagesLegend: 'Nachrichten für das Eingangstor', entranceGateWord: 'Eingangstor', connectionsManagementTitle: 'Verbindungen verwalten', connectBankAction: 'Bank verbinden', noConnections: 'Keine Verbindungen', disconnectButton: 'Trennen', plaidNotYetSupported: 'Plaid — wird in einem späteren Schritt unterstützt', israeliProviderNotConfigured: 'Israelischer Anbieter — noch nicht konfiguriert', providerNotDetected: 'Anbieter nicht erkannt', noTransactions: 'Keine Transaktionen' },
    currencyNames: { ILS: 'Schekel', USD: 'Dollar', GBP: 'Pfund', EUR: 'Euro', RUB: 'Rubel', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupie' },
    updates: { colDate: 'Datum & Uhrzeit', colProduct: 'Produkt', colVersion: 'Version', colTitle: 'Titel', productKeyClick: 'KeyClick Website', productMFinance: 'M Finance Haushalt' },
    reminders: { loginRequired: 'Anmeldung für Erinnerungen erforderlich', titlePh: 'Erinnerungstitel', timePh: 'Uhrzeit', add: '+ Hinzufügen', noReminders: 'Keine Erinnerungen' },
    guides: { overview: 'Allgemeine Beschreibung', userGuide: 'Benutzerhandbuch', financeOverviewTitle: 'Was ist M Finance', financeOverviewDesc: 'Ein kurzer Überblick über die Haushaltsbudgetverwaltung — Konten, Transaktionen, Kategorien und Prognosen, und für wen es gedacht ist.', financeGuideTitle: 'Schritt-für-Schritt-Anleitung', financeGuideDesc: 'Eine schriftliche Anleitung mit Screenshots: Installation, Kontoverbindung, Kategorisierung und Berichte.', financeVideosTitle: 'Kurze Anleitungen', financeVideosDesc: 'Kurze Video-Tutorials zu jeder wichtigen Funktion der Haushaltsbudgetverwaltung.', siteOverviewTitle: 'Was die Website bietet', siteOverviewDesc: 'Ein kurzer Rundgang durch die KeyClick-Plattform — Produkte, Dienstleistungen und Kundenbeziehungen.', siteGuideTitle: 'Registrierung und Navigation', siteGuideDesc: 'Wie man sich registriert, anmeldet und jeden Dienst auf der Website findet.', siteVideosTitle: 'Website-Demos', siteVideosDesc: 'Kurze aufgezeichnete Demos der wichtigsten Funktionen der Website.' },
    banking: { autoDetectFailed: 'Automatische Erkennung fehlgeschlagen — manuell wählen', detectionError: 'Erkennungsfehler', loadBanksError: 'Fehler beim Laden der Banken', plaidTokenError: 'Plaid-Token-Fehler', bankConnected: 'Bank verbunden', connectionError: 'Verbindungsfehler', linkOpened: 'Ein Verbindungsfenster für {name} wurde geöffnet. Nach der Bestätigung zurückkehren und aktualisieren klicken.', linkCreateError: 'Fehler beim Erstellen des Bank-Links', refreshing: 'Wird aktualisiert...', updated: 'Aktualisiert', fetchingData: 'Daten werden abgerufen...', noAccountsConnected: 'Keine Konten verbunden', downloadedFiles: '{count} Dateien heruntergeladen', downloadError: 'Download-Fehler', connectBankTitle: 'Bank verbinden', autoDetect: 'Automatische Erkennung', orManually: 'oder manuell', unitedStates: 'USA', back: 'Zurück', selectInstitution: 'Bank auswählen', noInstitutions: 'Keine Banken', refresh: 'Aktualisieren', downloadFiles: 'Dateien herunterladen', clickToDownload: 'Zum Herunterladen klicken', decorWorldwide: 'Rund um die Welt', decorPrivateLine1: 'Private Verbindung zur Bank', decorPrivateLine2: 'Getrennt von der Haushaltsbudgetverwaltung', instructionsTitle: 'Anleitung', instructionsLine1: 'Bitte folgen Sie dem roten Pfeil, der auf die zu klickende Schaltfläche zeigt.', instructionsLine2: 'Melden Sie sich bei Ihrem Finanzinstitut mit den dort üblichen Sicherheitsdaten an.', instructionsLine3: 'Bitte schließen Sie den gesamten Vorgang ab; am Ende trennen Sie die Verbindung zum Finanzinstitut.', instructionsLine4: 'Bitte verfolgen Sie die Systemmeldungen.', systemMessagesTitle: 'Systemmeldungen', noMessagesYet: 'Noch keine Meldungen', clickToConnect: 'Klicken zum Verbinden', readData: 'Daten lesen', clickToDisconnect: 'Klicken zum Trennen', clickToClose: 'Klicken zum Schließen', waitingForSelection: 'Warten auf Auswahl', chooseDownloadType: 'Wählen Sie die Art des Datendownloads', downloadFilesToComputer: 'Dateien auf den Computer herunterladen', loadDataBtn: 'Daten laden', connectingToInstitution: 'Verbindung zu {name} wird hergestellt...', connectedStatus: 'Verbunden', connectDoneMsg: 'Verbindung zu {name} hergestellt', disconnectingFromInstitution: 'Verbindung zu {name} wird getrennt...', disconnectDoneMsg: 'Verbindung getrennt', readingDataMsg: 'Daten werden vom Finanzinstitut gelesen...', readingDataDoneMsg: 'Daten wurden gelesen', loadingDataMsg: 'Daten werden geladen...', accountStatementMsg: 'Kontoauszug {id} für den Zeitraum {period}', creditStatementMsg: 'Kreditkartenauszug {id} für den Zeitraum {period}', dataLoadedDoneMsg: 'Daten wurden erfolgreich geladen', doneStatus: 'Erledigt', loadDataErrorMsg: 'Fehler beim Laden der Daten', downloadingFilesMsg: 'Dateien werden auf den Computer heruntergeladen...', fileDownloadedForPeriodMsg: '{file} heruntergeladen – für den Zeitraum {period}', downloadFilesErrorMsg: 'Fehler beim Herunterladen der Dateien', closingWindowMsg: 'Website-Fenster wird geschlossen...', selectedDownloadFilesMsg: 'Ausgewählt: Dateien auf den Computer herunterladen', selectedLoadDataMsg: 'Ausgewählt: Daten laden', totalFilesMsg: 'Insgesamt: {count} Dateien', introTitlePrefix: 'Hallo, willkommen bei den Bankdienstleistungen von', card1Title: 'Der Service umfasst', card1Item1: 'Verbindung zu einem Finanzinstitut, bei dem Sie ein Konto haben', card1Item2: 'Herunterladen von Kontoauszugsdateien', card1Item3: 'Direkter Import in die Haushaltsbudgetverwaltung', card1Item4: 'Ein Erlebnis in einer fortschrittlichen technologischen Umgebung', card2Title: 'Wichtige Hinweise', card2Item1: 'Die Verbindung dient ausschliesslich dem Herunterladen von Dateien, keine weitere Aktion', card2Item2: 'Die Verbindung erfolgt gemass den Sicherheitseinstellungen des ausgewaehlten Finanzinstituts', card2Item3: 'Die Kontoauszuege verbleiben ausschliesslich in der aktuellen Umgebung - keine Verbindung zu Clouds oder externen Speichern', card2Item4: 'Dieser Dienst kann von hier aus und auch direkt aus der Haushaltsbudgetverwaltung gestartet werden', card3Title: 'Ablauf der Durchfuehrung', card3Item1: 'Klicken Sie auf "Finanzinstitut auswaehlen"', card3Item2: 'Waehlen Sie auf der Institutsseite ein Institut aus', card3Item3: 'Folgen Sie dem roten Pfeil und klicken Sie dort, wohin er zeigt', card3Item4: 'Schliessen Sie den Vorgang bis zur vollstaendigen Trennung ab', introSuccess: 'Viel Erfolg', }, captions: { guidesRight1: 'Ein Schubladenschrank', guidesRight2: 'mit Anleitungen und Videos', guidesLeft: 'Schatztruhen-Schubladen...', guidesDrawersLine1: 'Schubladen 1–6', guidesDrawersLine2: 'auch von hier…', registerRight1: 'Eine kurze Registrierung', registerRight2: 'auf dem Weg zu vielen Überraschungen...', personalDefaultRight: 'Grundlegende persönliche Daten aus dem System', personalDefaultLeft: 'Aktiver Tarif. Möglichkeit, den Tarif zu ändern', personalPlanRight: 'Bei der Tarifwahl werden Zeitraum und Preis angezeigt', personalPlanLeft1: 'Klicken Sie auf', personalPlanLeft2: '„Aktualisieren"', personalPlanLeft3: 'nach Abschluss der Auswahl', feedbackAboveButton: 'Jedes neue Formular ist für eine Nachricht und eine Antwort. Siehe Schaltfläche „Neue Nachricht"', updatesWord1: 'Software-', updatesWord2: 'versionen', updatesWord3: 'der Projekt-', updatesWord4: 'komponenten', remindersRight1: 'Erinnerungsdienst', remindersRight2: 'Kalender wichtiger Ereignisse', remindersLeft1: 'Termine des aktiven Tarifs', remindersLeft2: 'Möglichkeit, private Erinnerungs-', remindersLeft3: 'termine hinzuzufügen' } },
  { code: 'fr', flag: 'צרפת',    name: 'Français', welcome: 'Bienvenue',
    menu: ['Retour','Mises à jour','Messages','Rappels','Services bancaires','Page personnelle'],
    card: { title: 'Gestion du budget familial', namePh: 'Prénom / Nom', emailPh: 'Email / Adresse e-mail', passPh: 'Mot de passe', confirmPassPh: 'Confirmer le mot de passe', register: "S'inscrire", login: 'Se connecter', locked: 'Verrouille', registered: 'Inscrit', update: 'Mettre à jour', line1: 'Pendant la période de lancement', line2: 'Gratuit', errName: 'Veuillez entrer votre nom', errEmail: 'Veuillez entrer un email valide', errPassLen: 'Le mot de passe doit contenir au moins 6 caractères', errPassMatch: 'Veuillez saisir une confirmation de mot de passe correspondante', errEmailExists: 'Email déjà enregistré', cancel: 'Annuler', install: 'Installer', library: 'Fichiers guide', run: 'Lancer', videos: 'Vidéos', guide: 'Guide', ok: 'OK', msgAlreadyInstalled: 'Déjà installé\nPas besoin de réinstaller', msgDownloading: 'Téléchargement du fichier', msgInstallComplete: 'Enregistrez et exécutez le fichier\npour terminer l\'installation', msgDownloadError: 'Erreur de téléchargement\nRéessayer', mFinance: 'M Finance', msgExists: 'Utilisateur déjà enregistré\navec ces informations', msgUpdated: 'Informations mises à jour avec succès', msgRegistered: 'Inscription terminée', existingCustomer: 'Client existant', newCustomer: 'Nouveau client', notRecognized: 'Client non enregistré. Cliquer pour s\'inscrire', msgSelectPlan: 'Veuillez choisir un forfait sur votre page personnelle', infoServices: 'Services d\'information', guidesAndVideos: 'Guides & Vidéos', siteHeaderPrefix: 'Le site Internet de', theWebsite: 'Le Site', loginSubtitle: 'Connexion à votre compte', emailPhSimple: 'Email', passPhSimple: 'Mot de passe', connectingEllipsis: 'Connexion...', noAccountQuestion: 'Vous n\'avez pas de compte ?', registerHereLink: 'S\'inscrire ici', invalidCredentials: 'Email ou mot de passe incorrect', registerErrorGeneric: 'Erreur d\'inscription' },
    profile: { fullName: 'Nom complet', email: 'E-mail', ip: 'IP', language: 'Langue', country: 'Pays', plan: 'Abonnement', planStart: 'Début', planEnd: 'Fin', unlimited: 'Illimité', comingSoon: 'Bientôt', choosePlan: 'Choisir un abonnement', close: '✕ Fermer', loginRequired: 'Connexion requise', login: 'Se connecter', products: 'Produits', change: 'Modifier',
      price: 'Prix', changePlan: "Choisir un abonnement", planName: 'Nom', planFrom: 'De', planTo: 'Au', back: 'Retour', currencyLocal: '€', free: 'Gratuit',       planNames: { System_Free_Run: 'Lancement', User_Trial: 'Essai', User_VIP_Free: 'VIP', System_Owner: 'Système', User_Monthly: 'Mensuel', User_Annual: 'Annuel', User_One_Time: 'Unique', System_Suspended_NonPayment: 'Suspendu', User_Cancelled: 'Annulé' } },
    feedback: { customerRelations: 'Relations clients', systemMessage: 'Message du système', respectfully: 'Cordialement,', rating: 'Évaluation', ratingWebsite: 'Site web', ratingBudget: 'Gestion du budget familial', userMessage: "Message de l'utilisateur", date: 'Date :', title: 'Titre :', from: 'De :', systemReply: 'Réponse du système' },
    system: { systemLabel: 'Système', selectAction: 'Sélectionner une action dans la barre droite', users: 'Utilisateurs', buildMessages: 'Journal de build', schedule: 'Tableaux et données', pr: 'RP', announcements: 'Annonces', publishedDate: 'Publié le :', reset: 'Réinitialiser', saved: 'Enregistré', records: 'enregistrements', scheduleSubject: 'Sujet', schedulePriceUSD: 'Prix\n[$]', schedulePeriod: 'Période\n[mois]', scheduleNotes: 'Notes', clear: 'Effacer', pause: 'Pause', resume: 'Reprendre', active: '● Actif', paused: 'En pause', lines: 'lignes', filter: 'Filtre', refresh: 'Actualiser', loading: 'Chargement...', loadingBuild: 'Chargement du build...', error: 'Erreur', noBuildData: 'Aucune donnée. Lancez Release_KeyClick.bat', networkError: 'Erreur réseau', testsCreateFolderLegend: 'Créer un dossier dans le dossier de téléchargement', testsNameLabel: 'Nom', testsCreateButton: 'Cliquer pour créer', testsFolderCreatedPrefix: 'Dossier créé :', scheduleTitle: 'Tarifs et calendrier', allFinancialInstitutions: 'Tous les établissements financiers', newSystemMessageTitle: 'Nouveau message système', systemMessageLabel: 'Message système', broadcastPlaceholder: 'Contenu du message', sensitiveColEnv: 'Environnement', sensitiveColFlag: 'Nom du drapeau', sensitiveColPurpose: 'Objectif', sensitiveDevBypassEnv: 'Site 3000 (dév local)', sensitiveDevBypassFlag: 'Contourner la connexion', sensitiveDevBypassPurpose: '1=contourner 0=ne pas contourner — développeur uniquement', adminButton: 'Espace système', generalGroup: 'Général', colName: 'Nom', colCurrency: 'Devise', colCreated: 'Créé', colActive: 'Actif', colAppInstalled: 'Application', colLicenceType: 'Type de licence', colSystemForce: 'Mode système', distributionDay: 'Jour de distribution X', messages: 'Messages', send: 'Envoyer', sent: 'Envoyé !', reply: 'Répondre', noMessages: 'Aucun message', replySent: 'Réponse envoyée !', ref: 'Réf.', msgNo: 'N°', replyToRef: 'Réponse à réf.', msgNumber: 'Message N°', new: 'Nouveau', delete: 'Supprimer', newMessage: '+ Nouveau message', selectToView: 'Sélectionner un message', monitor: 'Moniteur', systemData: 'Données système', resetTable: 'Réinitialiser la table', debug: 'Débogage', db: 'BD', sensitivePoints: 'Points sensibles', productVersionTable: 'Tableau des versions (onglet mises à jour)', lab: 'Laboratoire', allCustomers: 'Tous les clients', newMessageNotif: 'Nouveau message, cliquez ici', colType: 'Type', labTests: 'Tests', labBanking: 'Institutions financières', colCustomer: 'Client', adminNewMsg: '- Nouveau message -', dataCollection: 'Collecte de données', data: 'En direct', statistics: 'Traitement', billing: 'Facturation', billLastPlan: 'Dernier plan', billLastAmount: 'Dernier montant', billLastDate: 'Dernière date de paiement', billStatus: 'Statut', billPlan: 'Plan', billAmount: 'Montant', billDate: 'Date', billNoPayments: 'Aucun paiement', colRunningNo: 'N°', colIp: 'Adresse IP', colEntered: 'Heure d entrée', colExited: 'Heure de sortie', colDuration: 'Durée', durationMin: 'min', durationSec: 'sec', statTotalVisits: 'Total des visites', statUniqueVisitors: 'Visiteurs uniques', statOnlineNow: 'En ligne maintenant', statAvgDuration: 'Durée moyenne', statLongestVisit: 'Visite la plus longue', statBusiestHour: 'Heure la plus active', statBusiestDay: 'Jour le plus actif', statNamed: 'Identifiés', statAnonymous: 'Anonymes', statHourlyTitle: 'Activité par heure', statDayTitle: 'Activité par jour', statNoData: 'Pas encore assez de données', statPeriod: 'Période mesurée', statTotalVisitsDesc: 'Nombre total de visites enregistrées (chaque chargement de page compte)', statUniqueVisitorsDesc: "Nombre d'adresses IP distinctes ayant visité, comptées une seule fois", statOnlineNowDesc: 'Visiteurs actuellement sur le site qui ne sont pas encore sortis', statAvgDurationDesc: 'Durée de navigation moyenne des visiteurs déjà sortis', statHourlyTitleDesc: 'Total des visites entrées à chaque heure de la journée, cumulé sur toute la période', statDayTitleDesc: 'Total des visites entrées chaque jour de la semaine, cumulé sur toute la période', statNamedDesc: "Visiteurs dont l'adresse IP correspond à un utilisateur enregistré", statAnonymousDesc: "Visiteurs sans correspondance avec un utilisateur enregistré", statBusiestHourDesc: "L'heure avec le plus d'entrées", statBusiestDayDesc: "Le jour avec le plus d'entrées", statLongestVisitDesc: 'La durée de navigation la plus longue enregistrée en une seule visite', statLegend: 'Légende', statYearlyTitle: 'Activité annuelle', statByMonth: 'Par mois', statByWeek: 'Par semaine', statReturning: 'Récurrents', statLinked: 'Liés', statCountryTitle: 'Visites par pays', statNoGeoData: 'Inconnu', statDurationTitle: 'Répartition du temps de navigation', statDur0_5: '0–5 min', statDur5_15: '5–15 min', statDur15_60: '15–60 min', statDur60_120: '60–120 min', statDurOver120: 'Plus de 2 heures', statWeekOf: 'Semaine du', statOngoingTitle: 'Traitement continu des données', statActivityTab: 'Activité', runStatusRunning: 'Actif', runStatusStopped: 'Arrêté', dataCollectionLegend: 'Collecte de données', collectionStart: 'Début', collectionEnd: 'Fin', endToggleActive: "Jusqu'ici", endToggleInactive: 'Sans fin', runToggleActive: 'Collecte de données active', runToggleInactive: 'Collecte de données inactive', legendUnregistered: 'Non inscrits', legendRegistered: 'Inscrits', graphEntriesTitle: 'Nombre de visiteurs du site', graphDurationTitle: 'Temps de navigation sur le site', providersTitle: 'Fournisseurs', providerStatusConfigured: '✓ Configuré', providerStatusPendingRegistration: '✗ En attente d\'inscription', providerNordigenDesc: 'Europe — plus de 2300 banques', providerPlaidDesc: 'États-Unis — des milliers de banques', providerIlName: 'Israël (Salt Edge)', providerIlDesc: 'Israël — banques et cartes de crédit', providerGroqDesc: 'Détection automatique du pays', colProvider: 'Fournisseur', colRole: 'Rôle', routeDescTokenNordigen: 'jeton d\'accès de Nordigen', routeDescInstitutionsNordigen: 'liste des banques par pays', routeDescConnectNordigen: 'création de requisition + lien bancaire', routeDescCallbackNordigen: 'réception de la confirmation + sauvegarde en BD', routeDescLinkTokenPlaid: 'création du Link Token', routeDescExchangePlaid: 'échange du public_token après connexion', routeDescSyncPlaid: 'synchronisation des transactions + soldes', routeDescConnectIl: 'connexion au fournisseur israélien', routeDescCallbackIl: 'callback + sauvegarde en BD', routeDescAccountsShared: 'comptes de l\'utilisateur', routeDescTransactionsShared: 'transactions + synchronisation depuis le fournisseur', routeDescDetectProvider: 'détection automatique : pays → fournisseur', routeDescStatusSystem: 'statut des identifiants', routeDescDataSystem: 'données BD', providerLabelIsrael: 'Israël', providerLabelShared: 'Partagé', providerLabelSystem: 'Système', accountsBalancesTitle: 'Comptes et soldes', colFinancialInstitution: 'Établissement financier', colAccount: 'Compte', colBalance: 'Solde', noAccountsConnectedExample: 'Aucun compte connecté — exemple affiché', connectionsLabel: 'Connexions', accountsLabel: 'Comptes', transactionsLabel: 'Transactions', noRecordsFound: 'Aucun enregistrement', editButton: 'Modifier', weightedScoreTitle: 'Score pondéré', colPercent: 'Pourcentage', colMetric: 'Indicateur', colExplanation: 'Explication', totalWeightsLabel: 'Total des poids :', weightedNumberLabel: 'Nombre pondéré', weightedFormula: 'Score pondéré (0–10) = Σ ( indicateur_i ∈ {0,1} × poids_i% ) × 10 / 100', scanningLabel: 'Analyse en cours...', scanUsersButton: 'Analyser les utilisateurs et mettre à jour le score', mfMessagesLegend: 'Messages pour M Finance', entranceGateMessagesLegend: 'Messages pour le portail d\'entrée', entranceGateWord: 'Portail d\'entrée', connectionsManagementTitle: 'Gestion des connexions', connectBankAction: 'Connecter une banque', noConnections: 'Aucune connexion', disconnectButton: 'Déconnecter', plaidNotYetSupported: 'Plaid — pris en charge dans une prochaine étape', israeliProviderNotConfigured: 'Fournisseur israélien — pas encore configuré', providerNotDetected: 'Fournisseur non détecté', noTransactions: 'Aucune transaction' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollar', GBP: 'Livre', EUR: 'Euro', RUB: 'Rouble', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Roupie' },
    updates: { colDate: 'Date et heure', colProduct: 'Produit', colVersion: 'Version', colTitle: 'Titre', productKeyClick: 'KeyClick Site web', productMFinance: 'M Finance Budget familial' },
    reminders: { loginRequired: 'Connexion requise pour les rappels', titlePh: 'Titre du rappel', timePh: 'Heure', add: '+ Ajouter', noReminders: 'Aucun rappel' },
    guides: { overview: 'Description générale', userGuide: 'Guide utilisateur', financeOverviewTitle: 'Présentation de M Finance', financeOverviewDesc: "Un bref aperçu de la gestion du budget familial — comptes, transactions, catégories et prévisions, et à qui elle est destinée.", financeGuideTitle: 'Utilisation étape par étape', financeGuideDesc: "Un guide écrit avec des captures d'écran : installation, connexion des comptes, catégorisation et rapports.", financeVideosTitle: 'Tutoriels courts', financeVideosDesc: 'De courts tutoriels vidéo pour chaque fonctionnalité clé de la gestion du budget familial.', siteOverviewTitle: 'Ce que propose le site', siteOverviewDesc: 'Un bref tour de la plateforme KeyClick — produits, services et relations clients.', siteGuideTitle: 'Inscription et navigation', siteGuideDesc: 'Comment créer un compte, se connecter et trouver chaque service sur le site.', siteVideosTitle: 'Démonstrations du site', siteVideosDesc: 'De courtes démonstrations filmées des principales fonctionnalités du site.' },
    banking: { autoDetectFailed: 'Détection automatique échouée — choisir manuellement', detectionError: 'Erreur de détection', loadBanksError: 'Erreur de chargement des banques', plaidTokenError: 'Erreur de jeton Plaid', bankConnected: 'Banque connectée', connectionError: 'Erreur de connexion', linkOpened: 'Une fenêtre de connexion pour {name} a été ouverte. Après approbation, revenez et cliquez sur actualiser.', linkCreateError: 'Erreur lors de la création du lien bancaire', refreshing: 'Actualisation...', updated: 'Mis à jour', fetchingData: 'Récupération des données...', noAccountsConnected: 'Aucun compte connecté', downloadedFiles: '{count} fichiers téléchargés', downloadError: 'Erreur de téléchargement', connectBankTitle: 'Connecter une banque', autoDetect: 'Détection automatique', orManually: 'ou manuellement', unitedStates: 'États-Unis', back: 'Retour', selectInstitution: 'Choisir une banque', noInstitutions: 'Aucune banque', refresh: 'Actualiser', downloadFiles: 'Télécharger les fichiers', clickToDownload: 'Cliquez pour télécharger', decorWorldwide: 'Autour du monde', decorPrivateLine1: 'Connexion privée à la banque', decorPrivateLine2: 'Déconnecté de la gestion du budget familial', instructionsTitle: 'Instructions', instructionsLine1: 'Veuillez suivre la flèche rouge qui indique le bouton sur lequel cliquer.', instructionsLine2: 'Connectez-vous à votre établissement financier avec les identifiants de sécurité utilisés par cet établissement.', instructionsLine3: 'Veuillez terminer tout le processus, à l\'issue duquel vous vous déconnecterez de l\'établissement financier.', instructionsLine4: 'Veuillez suivre les messages du système.', systemMessagesTitle: 'Messages système', noMessagesYet: 'Aucun message pour le moment', clickToConnect: 'Cliquez pour vous connecter', readData: 'Lire les données', clickToDisconnect: 'Cliquez pour vous déconnecter', clickToClose: 'Cliquez pour fermer', waitingForSelection: 'En attente de sélection', chooseDownloadType: 'Choisissez le type de téléchargement des données', downloadFilesToComputer: 'Télécharger les fichiers sur l\'ordinateur', loadDataBtn: 'Charger les données', connectingToInstitution: 'Connexion à {name}...', connectedStatus: 'Connecté', connectDoneMsg: 'Connexion établie avec {name}', disconnectingFromInstitution: 'Déconnexion de {name}...', disconnectDoneMsg: 'Déconnexion effectuée', readingDataMsg: 'Lecture des données de l\'établissement financier...', readingDataDoneMsg: 'Lecture des données terminée', loadingDataMsg: 'Chargement des données...', accountStatementMsg: 'Relevé de compte {id} pour la période {period}', creditStatementMsg: 'Relevé de carte de crédit {id} pour la période {period}', dataLoadedDoneMsg: 'Données chargées avec succès', doneStatus: 'Terminé', loadDataErrorMsg: 'Erreur lors du chargement des données', downloadingFilesMsg: 'Téléchargement des fichiers sur l\'ordinateur...', fileDownloadedForPeriodMsg: '{file} téléchargé - pour la période {period}', downloadFilesErrorMsg: 'Erreur lors du téléchargement des fichiers', closingWindowMsg: 'Fermeture de la fenêtre du site...', selectedDownloadFilesMsg: 'Sélectionné : Télécharger les fichiers sur l\'ordinateur', selectedLoadDataMsg: 'Sélectionné : Charger les données', totalFilesMsg: 'Total : {count} fichiers', introTitlePrefix: 'Bonjour, bienvenue dans les services bancaires de', card1Title: 'Le service comprend', card1Item1: 'Connexion a un etablissement financier ou vous avez un compte', card1Item2: 'Telechargement des fichiers de releves de compte', card1Item3: 'Chargement direct dans la gestion du budget familial', card1Item4: 'Une experience dans un environnement technologique avance', card2Title: 'Points cles', card2Item1: 'La connexion sert uniquement a telecharger des fichiers, aucune autre action', card2Item2: 'La connexion respecte les parametres de securite de l etablissement financier selectionne', card2Item3: 'Les releves de compte restent uniquement dans l environnement actuel - aucune connexion a des clouds ou stockages externes', card2Item4: 'Ce service peut etre active depuis ici, ainsi que directement depuis la gestion du budget familial', card3Title: 'Etapes du processus', card3Item1: 'Cliquez sur "Selectionner un etablissement financier"', card3Item2: 'Sur la page des etablissements, selectionnez un etablissement', card3Item3: 'Suivez la fleche rouge, cliquez la ou elle pointe', card3Item4: 'Terminez le processus jusqu a la deconnexion complete', introSuccess: 'Bonne chance', }, captions: { guidesRight1: 'Une armoire à tiroirs', guidesRight2: 'avec guides et vidéos', guidesLeft: 'Tiroirs aux trésors...', guidesDrawersLine1: 'Tiroirs 1–6', guidesDrawersLine2: "aussi d'ici…", registerRight1: 'Une inscription rapide', registerRight2: "vers tout un monde de surprises...", personalDefaultRight: "Coordonnées personnelles de base, issues du système", personalDefaultLeft: "Abonnement actif. Possibilité de changer d'abonnement", personalPlanRight: "La sélection d'un abonnement affichera la durée et le prix", personalPlanLeft1: 'Cliquez sur', personalPlanLeft2: '« Mettre à jour »', personalPlanLeft3: 'une fois votre choix terminé', feedbackAboveButton: "Chaque nouveau formulaire correspond à un message et une réponse. Voir le bouton « Nouveau message »", updatesWord1: 'Versions', updatesWord2: 'logicielles', updatesWord3: 'des composants', updatesWord4: 'du projet', remindersRight1: 'Service de rappels', remindersRight2: 'Agenda des événements importants', remindersLeft1: "Dates de l'abonnement actif", remindersLeft2: "Possibilité d'ajouter des dates", remindersLeft3: 'de rappel privées' } },
  { code: 'he', flag: 'ישראל',   name: 'עברית',    welcome: 'ברוכים הבאים',
    menu: ['משוב','עדכונים','הודעות','תזכורות','שרותים בנקאיים','דף אישי'],
    card: { title: 'ניהול תקציב בית', namePh: 'שם / שם משפחה', emailPh: 'Email / כתובת מייל', passPh: 'סיסמא', confirmPassPh: 'אימות סיסמא', register: 'הרשמה', login: 'כניסה', locked: 'נעול', registered: 'רשום', update: 'עדכון', line1: 'בתקופת ההרצה', line2: 'חינם', errName: 'נא להזין שם', errEmail: 'נא להזין כתובת מייל תקינה', errPassLen: 'סיסמה חייבת להכיל לפחות 6 תווים', errPassMatch: 'נא להקליד אימות סיסמה מתאים', errEmailExists: 'אימייל כבר קיים במערכת', cancel: 'בטל', install: 'התקנה', library: 'קובצי הדרכה', run: 'הפעלה', videos: 'סרטונים', guide: 'הדרכה', ok: 'לחץ', msgAlreadyInstalled: 'כבר מותקן\nאין צורך בהתקנה', msgDownloading: 'הורד קובץ התקנה', msgInstallComplete: 'שמור והפעל את הקובץ\nלהשלמת ההתקנה', msgDownloadError: 'שגיאה בהורדה\nנסה שוב', mFinance: 'M Finance', msgExists: 'המשתמש עם הפרטים שהקשת\nכבר רשום במערכת', msgUpdated: 'הפרטים עודכנו בהצלחה', msgRegistered: 'הרשמה הושלמה', existingCustomer: 'לקוח קיים', newCustomer: 'לקוח חדש', notRecognized: 'לקוח לא רשום. לחץ להרשמה', msgSelectPlan: 'בחר תכנית בדף האישי', infoServices: 'שרותי מידע', guidesAndVideos: 'מדריכים וסרטונים', siteHeaderPrefix: 'אתר האינטרנט של', theWebsite: 'האתר', loginSubtitle: 'כניסה לחשבון', emailPhSimple: 'אימייל', passPhSimple: 'סיסמה', connectingEllipsis: 'מתחבר...', noAccountQuestion: 'אין לך חשבון?', registerHereLink: 'הירשם כאן', invalidCredentials: 'אימייל או סיסמה שגויים', registerErrorGeneric: 'שגיאה בהרשמה' },
    profile: { fullName: 'שם ומשפחה', email: 'דוא"ל', ip: 'IP', language: 'שפה', country: 'מדינה', plan: 'תכנית', planStart: 'תחילת תכנית', planEnd: 'סיום תכנית', unlimited: 'ללא הגבלה', comingSoon: 'בקרוב', choosePlan: 'בחר תכנית', close: '✕ סגור', loginRequired: 'נדרשת כניסה לצפייה בדף האישי', login: 'כניסה', products: 'מוצרים', change: 'שינוי',
      price: 'מחיר', changePlan: 'בחר תכנית', planName: 'שם', planFrom: 'מ-', planTo: 'עד-', back: 'חזרה', currencyLocal: '₪', free: 'חינם',       planNames: { System_Free_Run: 'תקופת הרצה', User_Trial: 'תקופת נסיון', User_VIP_Free: 'VIP', System_Owner: 'מערכת', User_Monthly: 'חודשי', User_Annual: 'שנתי', User_One_Time: 'כניסה בודדת', System_Suspended_NonPayment: 'מנותק', User_Cancelled: 'בוטל' } },
    feedback: { customerRelations: 'קשרי לקוחות', systemMessage: 'הודעת המערכת', respectfully: 'בכבוד רב,', rating: 'דירוג', ratingWebsite: 'אתר', ratingBudget: 'ניהול תקציב בית', userMessage: 'דבר המשתמש', date: 'תאריך:', title: 'כותרת:', from: 'מאת:', systemReply: 'תשובת המערכת' },
    system: { systemLabel: 'מערכת', selectAction: 'בחר פעולה מהסרגל הימני', users: 'משתמשים', buildMessages: 'הודעות בניית מערכת', schedule: 'טבלאות ונתונים', pr: 'יחסי ציבור', announcements: 'מודעות', publishedDate: 'פורסם בתאריך:', reset: 'איפוס', saved: 'נשמר', records: 'רשומות', scheduleSubject: 'נושא', schedulePriceUSD: 'מחיר\n[$]', schedulePeriod: 'תקופה\n[ח׳]', scheduleNotes: 'הערות', clear: 'נקה', pause: 'עצור', resume: 'המשך', active: '● פעיל', paused: 'מושהה', lines: 'שורות', filter: 'סינון', refresh: 'רענן', loading: 'טוען...', loadingBuild: 'טוען נתוני בנייה...', error: 'שגיאה', noBuildData: 'אין נתוני בנייה. הרץ את Release_KeyClick.bat', networkError: 'שגיאת רשת', testsCreateFolderLegend: 'צור תיקייה בתיקיית download', testsNameLabel: 'שם', testsCreateButton: 'לחץ ליצירה', testsFolderCreatedPrefix: 'נוצרה תיקייה:', scheduleTitle: 'מחירון ולו״ז', allFinancialInstitutions: 'כל המוסדות הפיננסיים', newSystemMessageTitle: 'הודעת מערכת חדשה', systemMessageLabel: 'הודעת מערכת', broadcastPlaceholder: 'תוכן ההודעה', sensitiveColEnv: 'סביבת עבודה', sensitiveColFlag: 'שם הדגל', sensitiveColPurpose: 'מטרה', sensitiveDevBypassEnv: 'אתר 3000 (פיתוח מקומי)', sensitiveDevBypassFlag: 'עוקף כניסה', sensitiveDevBypassPurpose: '1=עוקף 0=לא עוקף — עבור המפתח בלבד', adminButton: 'בשימוש המערכת', generalGroup: 'כללי', colName: 'שם', colCurrency: 'מטבע', colCreated: 'תאריך הצטרפות', colActive: 'פעיל', colAppInstalled: 'אפליקציה', colLicenceType: 'סוג רישיון', colSystemForce: 'כפיית מערכת', distributionDay: 'יום ה-X ההפצה', messages: 'הודעות', send: 'שלח', sent: 'נשלח!', reply: 'תשובה', noMessages: 'אין הודעות', replySent: 'תשובה נשלחה!', ref: 'סימוכין', msgNo: 'מס.', replyToRef: 'מענה לסימוכין', msgNumber: 'הודעה מס.', new: 'חדש', delete: 'מחיקה', newMessage: '+ הודעה חדשה', selectToView: 'בחר הודעה לצפייה', monitor: 'מוניטור', systemData: 'נתוני מערכת', resetTable: 'איפוס טבלה', debug: 'ניפוי', db: 'בסיס נתונים', sensitivePoints: 'נקודות רגישות', productVersionTable: 'טבלת גרסאות מוצר שבלשונית עדכונים', lab: 'מעבדה', allCustomers: 'כל הלקוחות', newMessageNotif: 'הודעה חדשה, נא ללחוץ כאן', colType: 'סוג', labTests: 'בדיקות', labBanking: 'רשימות סוכנים', financialInstitutions: 'מוסדות פיננסיים', colCustomer: 'לקוח', adminNewMsg: '- הודעה חדשה -', dataCollection: 'איסוף נתונים', data: 'חי', statistics: 'עיבוד', billing: 'סליקה', billLastPlan: 'תוכנית אחרונה', billLastAmount: 'סכום אחרון', billLastDate: 'תאריך תשלום אחרון', billStatus: 'סטטוס', billPlan: 'תוכנית', billAmount: 'סכום', billDate: 'תאריך', billNoPayments: 'אין תשלומים', colRunningNo: 'מספר רץ', colIp: 'כתובת IP', colEntered: 'זמן כניסה', colExited: 'זמן יציאה', colDuration: 'זמן גלישה', durationMin: 'דק', durationSec: 'שנ', statTotalVisits: 'סה״כ ביקורים', statUniqueVisitors: 'מבקרים ייחודיים', statOnlineNow: 'מחוברים כרגע', statAvgDuration: 'משך ממוצע', statLongestVisit: 'הביקור הארוך ביותר', statBusiestHour: 'השעה העמוסה', statBusiestDay: 'היום העמוס', statNamed: 'מזוהים', statAnonymous: 'אנונימיים', statHourlyTitle: 'פעילות לפי שעה', statDayTitle: 'פעילות לפי יום', statNoData: 'עדיין אין מספיק נתונים', statPeriod: 'תקופה נמדדת', statTotalVisitsDesc: 'מספר כל הביקורים שנרשמו (כל כניסה לאתר נספרת)', statUniqueVisitorsDesc: 'מספר כתובות IP שונות שביקרו, ללא כפילויות', statOnlineNowDesc: 'מבקרים שנמצאים באתר כרגע ועדיין לא יצאו', statAvgDurationDesc: 'זמן הגלישה הממוצע של מבקרים שכבר יצאו', statHourlyTitleDesc: 'סה״כ ביקורים שנכנסו בכל שעה ביממה, מצטבר על פני כל התקופה', statDayTitleDesc: 'סה״כ ביקורים שנכנסו בכל יום בשבוע, מצטבר על פני כל התקופה', statNamedDesc: 'מבקרים שכתובת ה-IP שלהם תואמת למשתמש רשום', statAnonymousDesc: 'מבקרים שלא נמצאה התאמה למשתמש רשום', statBusiestHourDesc: 'השעה עם הכי הרבה כניסות', statBusiestDayDesc: 'היום עם הכי הרבה כניסות', statLongestVisitDesc: 'משך הגלישה הארוך ביותר שנמדד בביקור בודד', statLegend: 'מקרא', statYearlyTitle: 'פעילות שנתית', statByMonth: 'לפי חודש', statByWeek: 'לפי שבוע', statReturning: 'חוזרים', statLinked: 'מקושרים', statCountryTitle: 'ביקורים לפי מדינה', statNoGeoData: 'לא ידוע', statDurationTitle: 'התפלגות זמני גלישה', statDur0_5: '0–5 דק׳', statDur5_15: '5–15 דק׳', statDur15_60: '15–60 דק׳', statDur60_120: '60–120 דק׳', statDurOver120: 'מעל שעתיים', statWeekOf: 'שבוע של', statOngoingTitle: 'עיבוד נתונים שוטף', statActivityTab: 'פעילות', runStatusRunning: 'בפעולה', runStatusStopped: 'עצירה', dataCollectionLegend: 'איסוף נתונים', collectionStart: 'התחלה', collectionEnd: 'סיום', endToggleActive: 'עד כאן', endToggleInactive: 'ללא סיום', runToggleActive: 'איסוף הנתונים בפעולה', runToggleInactive: 'איסוף הנתונים לא פעיל', legendUnregistered: 'לא רשומים', legendRegistered: 'רשומים', graphEntriesTitle: 'כמות הנכנסים לאתר', graphDurationTitle: 'זמן גלישה באתר', providersTitle: 'ספקים', providerStatusConfigured: '✓ מוגדר', providerStatusPendingRegistration: '✗ ממתין לרישום', providerNordigenDesc: 'אירופה — 2300+ בנקים', providerPlaidDesc: 'ארה"ב — אלפי בנקים', providerIlName: 'ישראל (Salt Edge)', providerIlDesc: 'ישראל — בנקים וכרטיסי אשראי', providerGroqDesc: 'זיהוי מדינה אוטומטי', colProvider: 'ספק', colRole: 'תפקיד', routeDescTokenNordigen: 'access token מ-Nordigen', routeDescInstitutionsNordigen: 'רשימת בנקים לפי מדינה', routeDescConnectNordigen: 'יצירת requisition + קישור לבנק', routeDescCallbackNordigen: 'קבלת אישור + שמירה ב-DB', routeDescLinkTokenPlaid: 'יצירת Link Token', routeDescExchangePlaid: 'המרת public_token לאחר חיבור', routeDescSyncPlaid: 'sync עסקאות + יתרות', routeDescConnectIl: 'התחברות לספק ישראלי', routeDescCallbackIl: 'callback + שמירה ב-DB', routeDescAccountsShared: 'חשבונות המשתמש', routeDescTransactionsShared: 'עסקאות + sync מהספק', routeDescDetectProvider: 'זיהוי אוטומטי: מדינה → ספק', routeDescStatusSystem: 'סטטוס credentials', routeDescDataSystem: 'נתוני DB', providerLabelIsrael: 'ישראל', providerLabelShared: 'משותף', providerLabelSystem: 'מערכת', accountsBalancesTitle: 'חשבונות ויתרות', colFinancialInstitution: 'מוסד פיננסי', colAccount: 'חשבון', colBalance: 'יתרה', noAccountsConnectedExample: 'אין חשבונות מחוברים — מוצגת דוגמה', connectionsLabel: 'חיבורים', accountsLabel: 'חשבונות', transactionsLabel: 'עסקאות', noRecordsFound: 'אין רשומות', editButton: 'עריכה', weightedScoreTitle: 'דרוג משוקלל', colPercent: 'אחוזים', colMetric: 'מדד', colExplanation: 'הסבר', totalWeightsLabel: 'סה״כ משקלות:', weightedNumberLabel: 'מספר משוקלל', weightedFormula: 'דרוג משוקלל (0–10) = Σ ( מדד_i ∈ {0,1} × משקל_i% ) × 10 / 100', scanningLabel: 'סורק...', scanUsersButton: 'סרוק משתמשים חשב ועדכן דרוג', mfMessagesLegend: 'הודעות לניהול תקציב בית', entranceGateMessagesLegend: 'הודעות לשער הכניסה', entranceGateWord: 'שער הכניסה', connectionsManagementTitle: 'ניהול חיבורים', connectBankAction: 'חבר בנק', noConnections: 'אין חיבורים', disconnectButton: 'נתק', plaidNotYetSupported: 'Plaid — יתמך בשלב הבא', israeliProviderNotConfigured: 'ספק ישראלי — עדיין לא מוגדר', providerNotDetected: 'לא זוהה ספק', noTransactions: 'אין עסקאות' },
    currencyNames: { ILS: 'ש"ח', USD: 'דולר', GBP: 'ליש"ט', EUR: 'יורו', RUB: 'רובל', JPY: 'ין', SAR: 'ריאל', CNY: 'יואן', INR: 'רופי' },
    updates: { colDate: 'תאריך ושעה', colProduct: 'מוצר', colVersion: 'גרסה', colTitle: 'כותרת', productKeyClick: 'אתר KeyClick', productMFinance: 'ניהול תקציב בית M Finance' },
    reminders: { loginRequired: 'נדרשת כניסה לצפייה בתזכורות', titlePh: 'כותרת תזכורת', timePh: 'שעה', add: '+ הוסף', noReminders: 'אין תזכורות' },
    guides: { overview: 'תיאור כללי', userGuide: 'מדריך למשתמש', financeOverviewTitle: 'מה זה M Finance', financeOverviewDesc: 'סקירה קצרה של ניהול תקציב הבית — חשבונות, תנועות, קטגוריות ותחזיות, ולמי זה מיועד.', financeGuideTitle: 'שימוש שלב-אחר-שלב', financeGuideDesc: 'מדריך כתוב עם צילומי מסך: התקנה, חיבור חשבונות, סיווגים ודוחות.', financeVideosTitle: 'הדרכות קצרות', financeVideosDesc: 'סרטוני וידאו קצרים לכל תכונה עיקרית בניהול משק הבית.', siteOverviewTitle: 'מה מציע האתר', siteOverviewDesc: 'סיור קצר על פלטפורמת KeyClick — המוצרים, השירותים וקשרי הלקוחות.', siteGuideTitle: 'הרשמה וניווט', siteGuideDesc: 'איך נרשמים, מתחברים ומוצאים כל שירות באתר.', siteVideosTitle: 'הדגמות האתר', siteVideosDesc: 'הדגמות מצולמות קצרות של תכונות האתר המרכזיות.' },
    banking: { autoDetectFailed: 'לא זוהה אוטומטית — בחר ידנית', detectionError: 'שגיאה בזיהוי', loadBanksError: 'שגיאה בטעינת בנקים', plaidTokenError: 'שגיאה ביצירת Plaid Token', bankConnected: 'הבנק חובר בהצלחה', connectionError: 'שגיאה בחיבור', linkOpened: 'נפתח חלון חיבור ל-{name}. לאחר האישור חזור ולחץ רענן.', linkCreateError: 'שגיאה ביצירת קישור לבנק', refreshing: 'מרענן...', updated: 'עודכן', fetchingData: 'שולף נתונים...', noAccountsConnected: 'אין חשבונות מחוברים', downloadedFiles: 'הורדו {count} קבצים', downloadError: 'שגיאה בהורדה', connectBankTitle: 'חיבור לבנק', autoDetect: 'זיהוי אוטומטי', orManually: 'או בחר ידנית', unitedStates: 'ארצות הברית', back: 'חזור', selectInstitution: 'בחר מוסד פיננסי', noInstitutions: 'אין מוסדות', refresh: 'רענן', downloadFiles: 'הורד קבצים', clickToDownload: 'לחץ להורדה', decorWorldwide: 'מסביב לעולם', decorPrivateLine1: 'התחברות פרטית לבנק', decorPrivateLine2: 'מנותק מניהול תקציב בית', instructionsTitle: 'הנחיות', instructionsLine1: 'נא לעקוב אחר החץ האדום המסמן את הכפתור שיש ללחוץ עליו.', instructionsLine2: 'התחברות למוסד הפיננסי שלך עם נתוני האבטחה הנהוגים במוסד זה.', instructionsLine3: 'נא להשלים את כל התהליך אשר בסופו תתנתק מהמוסד הפיננסי.', instructionsLine4: 'נא לעקוב אחר הודעות המערכת.', systemMessagesTitle: 'הודעות מערכת', noMessagesYet: 'אין הודעות עדיין', clickToConnect: 'לחץ להתחברות', readData: 'קרא נתונים', clickToDisconnect: 'לחץ להתנתקות', clickToClose: 'לחץ לסגירה', waitingForSelection: 'ממתין לבחירה', chooseDownloadType: 'בחר סוג הורדת הנתונים', downloadFilesToComputer: 'הורד קבצים למחשב', loadDataBtn: 'טען נתונים', connectingToInstitution: 'מתחבר למוסד {name}...', connectedStatus: 'מחובר', connectDoneMsg: 'התחברות בוצעה למוסד {name}', disconnectingFromInstitution: 'מתנתק ממוסד {name}...', disconnectDoneMsg: 'התנתקות בוצעה', readingDataMsg: 'קריאת נתונים מהמוסד הפיננסי...', readingDataDoneMsg: 'קריאת נתונים הושלמה', loadingDataMsg: 'טעינת נתונים...', accountStatementMsg: 'דף חשבון {id} לתקופה {period}', creditStatementMsg: 'דף חשבון אשראי {id} לתקופה {period}', dataLoadedDoneMsg: 'הנתונים נטענו בהצלחה', doneStatus: 'בוצע', loadDataErrorMsg: 'שגיאה בטעינת הנתונים', downloadingFilesMsg: 'הורדת קבצים למחשב...', fileDownloadedForPeriodMsg: '{file} הורד - לתקופה {period}', downloadFilesErrorMsg: 'שגיאה בהורדת הקבצים', closingWindowMsg: 'סוגר את חלון האתר...', selectedDownloadFilesMsg: 'נבחר: הורד קבצים למחשב', selectedLoadDataMsg: 'נבחר: טען נתונים', totalFilesMsg: 'סה"כ {count} קבצים', introTitlePrefix: 'הי, ברוכים הבאים לשרותים הבנקאיים של', card1Title: 'השרות כולל', card1Item1: 'התחברות למוסד פיננסי בו יש לכם חשבון', card1Item2: 'הורדת קבצים של דפי חשבון', card1Item3: 'טעינה ישירה לניהול תקציב בית', card1Item4: 'חווית התנסות בסביבה טכנולוגית מתקדמת', card2Title: 'מספר דגשים', card2Item1: 'ההתחברות היא אך ורק להורדת קבצים ולא לשום פעולה נוספת', card2Item2: 'ההתחברות מתבצעת על פי הגדרת הבטחון הנהוג במוסד הפיננסי הנבחר', card2Item3: 'דפי החשבון נשארים בסביבה הנוכחית בלבד, אין חיבור לעננים או זכרונות חיצוניים', card2Item4: 'השרות הזה יכול להתבצע מכאן וגם ישירות מניהול תקציב בית', card3Title: 'תהליך הביצוע', card3Item1: 'לחץ על "בחר מוסד פיננסי"', card3Item2: 'בדף המוסדות בחר מוסד', card3Item3: 'עקוב אחר החץ האדום, לחץ היכן שהוא מצביע', card3Item4: 'השלם את התהליך עד לסגירה לניתוק מלא', introSuccess: 'בהצלחה', }, captions: { guidesRight1: 'ארונית מגירות עם', guidesRight2: 'מדריכים וסרטונים', guidesLeft: 'מגירות מטמון...', guidesDrawersLine1: 'מגירות 1-6 לבחירתך', guidesDrawersLine2: 'גם מכאן...', registerRight1: 'הרשמה קצרה', registerRight2: '…בדרך אל מגוון ההפתעות', personalDefaultRight: 'פרטים אישיים בסיסיים, מתוך המערכת', personalDefaultLeft: 'תכנית פעילה. אפשרות שינוי התכנית', personalPlanRight: 'בבחירת התכנית תוצג התקופה והמחיר', personalPlanLeft1: 'יש ללחוץ', personalPlanLeft2: 'על עדכון', personalPlanLeft3: 'בסיום הבחירה', feedbackAboveButton: 'טופס חדש להודעה אחת ותשובה אחת. ראה כפתור להודעה חדשה', updatesWord1: 'גרסאות', updatesWord2: 'תוכנה', updatesWord3: 'למרכיבי', updatesWord4: 'הפרויקט', remindersRight1: 'שרות תזכורות', remindersRight2: 'יומן ארועים חשובים', remindersLeft1: 'תאריכי התכנית הפעילה', remindersLeft2: 'אפשרות הוספת תאריכי', remindersLeft3: 'תזכורות פרטיים' } },
  { code: 'es', flag: 'ספרד',    name: 'Español',  welcome: 'Bienvenido',
    menu: ['Comentarios','Actualizaciones','Mensajes','Recordatorios','Servicios bancarios','Página personal'],
    card: { title: 'Gestión del presupuesto familiar', namePh: 'Nombre / Apellido', emailPh: 'Email / Dirección de correo', passPh: 'Contraseña', confirmPassPh: 'Confirmar contraseña', register: 'Registrarse', login: 'Iniciar sesión', locked: 'Bloqueado', registered: 'Registrado', update: 'Actualizar', line1: 'Durante el período de lanzamiento', line2: 'Gratis', errName: 'Por favor ingrese su nombre', errEmail: 'Por favor ingrese un email válido', errPassLen: 'La contraseña debe tener al menos 6 caracteres', errPassMatch: 'Por favor ingrese una confirmación de contraseña que coincida', errEmailExists: 'El correo ya está registrado', cancel: 'Cancelar', install: 'Instalar', library: 'Archivos de guía', run: 'Ejecutar', videos: 'Videos', guide: 'Guía', ok: 'OK', msgAlreadyInstalled: 'Ya instalado\nNo es necesario reinstalar', msgDownloading: 'Descargando archivo de instalación', msgInstallComplete: 'Guarda y ejecuta el archivo\npara completar la instalación', msgDownloadError: 'Error de descarga\nInténtalo de nuevo', mFinance: 'M Finance', msgExists: 'El usuario ya está registrado\ncon estos datos', msgUpdated: 'Datos actualizados correctamente', msgRegistered: 'Registro completado', existingCustomer: 'Cliente existente', newCustomer: 'Cliente nuevo', notRecognized: 'Cliente no registrado. Haga clic para registrarse', msgSelectPlan: 'Por favor selecciona un plan en tu página personal', infoServices: 'Servicios de información', guidesAndVideos: 'Guías y Videos', siteHeaderPrefix: 'El sitio web de', theWebsite: 'El Sitio', loginSubtitle: 'Inicia sesión en tu cuenta', emailPhSimple: 'Email', passPhSimple: 'Contraseña', connectingEllipsis: 'Conectando...', noAccountQuestion: '¿No tienes una cuenta?', registerHereLink: 'Regístrate aquí', invalidCredentials: 'Email o contraseña incorrectos', registerErrorGeneric: 'Error de registro' },
    profile: { fullName: 'Nombre completo', email: 'Correo', ip: 'IP', language: 'Idioma', country: 'País', plan: 'Plan', planStart: 'Inicio del plan', planEnd: 'Fin del plan', unlimited: 'Sin límite', comingSoon: 'Próximamente', choosePlan: 'Elegir plan', close: '✕ Cerrar', loginRequired: 'Se requiere inicio de sesión', login: 'Iniciar sesión', products: 'Productos', change: 'Cambiar',
      price: 'Precio', changePlan: 'Elegir plan', planName: 'Nombre', planFrom: 'Desde', planTo: 'Hasta', back: 'Volver', currencyLocal: '€', free: 'Gratis',       planNames: { System_Free_Run: 'Ejecución', User_Trial: 'Prueba', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensual', User_Annual: 'Anual', User_One_Time: 'Único', System_Suspended_NonPayment: 'Suspendido', User_Cancelled: 'Cancelado' } },
    feedback: { customerRelations: 'Relaciones con clientes', systemMessage: 'Mensaje del sistema', respectfully: 'Atentamente,', rating: 'Calificación', ratingWebsite: 'Sitio web', ratingBudget: 'Gestión del presupuesto familiar', userMessage: 'Mensaje del usuario', date: 'Fecha:', title: 'Título:', from: 'De:', systemReply: 'Respuesta del sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleccionar acción de la barra derecha', users: 'Usuarios', buildMessages: 'Registro de build', schedule: 'Tablas y datos', pr: 'RRPP', announcements: 'Anuncios', publishedDate: 'Publicado:', reset: 'Restablecer', saved: 'Guardado', records: 'registros', scheduleSubject: 'Asunto', schedulePriceUSD: 'Precio\n[$]', schedulePeriod: 'Período\n[mes]', scheduleNotes: 'Notas', clear: 'Limpiar', pause: 'Pausar', resume: 'Reanudar', active: '● Activo', paused: 'En pausa', lines: 'líneas', filter: 'Filtro', refresh: 'Actualizar', loading: 'Cargando...', loadingBuild: 'Cargando datos de build...', error: 'Error', noBuildData: 'Sin datos. Ejecute Release_KeyClick.bat', networkError: 'Error de red', testsCreateFolderLegend: 'Crear carpeta en la carpeta de descargas', testsNameLabel: 'Nombre', testsCreateButton: 'Haga clic para crear', testsFolderCreatedPrefix: 'Carpeta creada:', scheduleTitle: 'Lista de precios y calendario', allFinancialInstitutions: 'Todas las instituciones financieras', newSystemMessageTitle: 'Nuevo mensaje del sistema', systemMessageLabel: 'Mensaje del sistema', broadcastPlaceholder: 'Contenido del mensaje', sensitiveColEnv: 'Entorno', sensitiveColFlag: 'Nombre de la bandera', sensitiveColPurpose: 'Propósito', sensitiveDevBypassEnv: 'Sitio 3000 (desarrollo local)', sensitiveDevBypassFlag: 'Omitir inicio de sesión', sensitiveDevBypassPurpose: '1=omitir 0=no omitir — solo para el desarrollador', adminButton: 'Área del sistema', generalGroup: 'General', colName: 'Nombre', colCurrency: 'Moneda', colCreated: 'Creado', colActive: 'Activo', colAppInstalled: 'Aplicación', colLicenceType: 'Tipo de licencia', colSystemForce: 'Modo sistema', distributionDay: 'Día de distribución X', messages: 'Mensajes', send: 'Enviar', sent: '¡Enviado!', reply: 'Responder', noMessages: 'Sin mensajes', replySent: '¡Respuesta enviada!', ref: 'Ref.', msgNo: 'N°', replyToRef: 'Respuesta a ref.', msgNumber: 'Mensaje N°', new: 'Nuevo', delete: 'Eliminar', newMessage: '+ Nuevo mensaje', selectToView: 'Seleccionar un mensaje', monitor: 'Monitor', systemData: 'Datos del sistema', resetTable: 'Restablecer tabla', debug: 'Depurar', db: 'BD', sensitivePoints: 'Puntos sensibles', productVersionTable: 'Tabla de versiones (pestaña actualizaciones)', lab: 'Laboratorio', allCustomers: 'Todos los clientes', newMessageNotif: 'Nuevo mensaje, haga clic aquí', colType: 'Tipo', labTests: 'Pruebas', labBanking: 'Instituciones financieras', colCustomer: 'Cliente', adminNewMsg: '- Nuevo mensaje -', dataCollection: 'Recopilación de datos', data: 'En vivo', statistics: 'Procesamiento', billing: 'Facturación', billLastPlan: 'Último plan', billLastAmount: 'Último importe', billLastDate: 'Última fecha de pago', billStatus: 'Estado', billPlan: 'Plan', billAmount: 'Importe', billDate: 'Fecha', billNoPayments: 'Sin pagos', colRunningNo: 'N°', colIp: 'Dirección IP', colEntered: 'Hora de entrada', colExited: 'Hora de salida', colDuration: 'Duración', durationMin: 'min', durationSec: 'seg', statTotalVisits: 'Visitas totales', statUniqueVisitors: 'Visitantes únicos', statOnlineNow: 'En línea ahora', statAvgDuration: 'Duración media', statLongestVisit: 'Visita más larga', statBusiestHour: 'Hora más activa', statBusiestDay: 'Día más activo', statNamed: 'Identificados', statAnonymous: 'Anónimos', statHourlyTitle: 'Actividad por hora', statDayTitle: 'Actividad por día', statNoData: 'Aún no hay suficientes datos', statPeriod: 'Período medido', statTotalVisitsDesc: 'Número total de visitas registradas (cada carga de página cuenta)', statUniqueVisitorsDesc: 'Número de direcciones IP distintas que visitaron, contadas una vez cada una', statOnlineNowDesc: 'Visitantes actualmente en el sitio que aún no han salido', statAvgDurationDesc: 'Duración media de navegación de los visitantes que ya salieron', statHourlyTitleDesc: 'Total de visitas que entraron en cada hora del día, sumado en todo el período', statDayTitleDesc: 'Total de visitas que entraron en cada día de la semana, sumado en todo el período', statNamedDesc: 'Visitantes cuya IP coincide con un usuario registrado', statAnonymousDesc: 'Visitantes sin coincidencia con un usuario registrado', statBusiestHourDesc: 'La hora con más entradas', statBusiestDayDesc: 'El día con más entradas', statLongestVisitDesc: 'La duración de navegación más larga registrada en una sola visita', statLegend: 'Leyenda', statYearlyTitle: 'Actividad anual', statByMonth: 'Por mes', statByWeek: 'Por semana', statReturning: 'Recurrentes', statLinked: 'Vinculados', statCountryTitle: 'Visitas por país', statNoGeoData: 'Desconocido', statDurationTitle: 'Distribución del tiempo de navegación', statDur0_5: '0–5 min', statDur5_15: '5–15 min', statDur15_60: '15–60 min', statDur60_120: '60–120 min', statDurOver120: 'Más de 2 horas', statWeekOf: 'Semana del', statOngoingTitle: 'Procesamiento continuo de datos', statActivityTab: 'Actividad', runStatusRunning: 'Activo', runStatusStopped: 'Detenido', dataCollectionLegend: 'Recopilación de datos', collectionStart: 'Inicio', collectionEnd: 'Fin', endToggleActive: 'Hasta aquí', endToggleInactive: 'Sin fin', runToggleActive: 'Recopilación de datos activa', runToggleInactive: 'Recopilación de datos inactiva', legendUnregistered: 'No registrados', legendRegistered: 'Registrados', graphEntriesTitle: 'Número de visitantes del sitio', graphDurationTitle: 'Tiempo de navegación en el sitio', providersTitle: 'Proveedores', providerStatusConfigured: '✓ Configurado', providerStatusPendingRegistration: '✗ Pendiente de registro', providerNordigenDesc: 'Europa — más de 2300 bancos', providerPlaidDesc: 'EE. UU. — miles de bancos', providerIlName: 'Israel (Salt Edge)', providerIlDesc: 'Israel — bancos y tarjetas de crédito', providerGroqDesc: 'Detección automática del país', colProvider: 'Proveedor', colRole: 'Función', routeDescTokenNordigen: 'token de acceso de Nordigen', routeDescInstitutionsNordigen: 'lista de bancos por país', routeDescConnectNordigen: 'creación de requisition + enlace bancario', routeDescCallbackNordigen: 'recepción de confirmación + guardado en BD', routeDescLinkTokenPlaid: 'creación de Link Token', routeDescExchangePlaid: 'intercambio de public_token tras la conexión', routeDescSyncPlaid: 'sincronización de transacciones + saldos', routeDescConnectIl: 'conexión con el proveedor israelí', routeDescCallbackIl: 'callback + guardado en BD', routeDescAccountsShared: 'cuentas del usuario', routeDescTransactionsShared: 'transacciones + sincronización del proveedor', routeDescDetectProvider: 'detección automática: país → proveedor', routeDescStatusSystem: 'estado de las credenciales', routeDescDataSystem: 'datos de la BD', providerLabelIsrael: 'Israel', providerLabelShared: 'Compartido', providerLabelSystem: 'Sistema', accountsBalancesTitle: 'Cuentas y saldos', colFinancialInstitution: 'Entidad financiera', colAccount: 'Cuenta', colBalance: 'Saldo', noAccountsConnectedExample: 'No hay cuentas conectadas — se muestra un ejemplo', connectionsLabel: 'Conexiones', accountsLabel: 'Cuentas', transactionsLabel: 'Transacciones', noRecordsFound: 'Sin registros', editButton: 'Editar', weightedScoreTitle: 'Puntuación ponderada', colPercent: 'Porcentaje', colMetric: 'Indicador', colExplanation: 'Explicación', totalWeightsLabel: 'Total de pesos:', weightedNumberLabel: 'Número ponderado', weightedFormula: 'Puntuación ponderada (0–10) = Σ ( indicador_i ∈ {0,1} × peso_i% ) × 10 / 100', scanningLabel: 'Escaneando...', scanUsersButton: 'Escanear usuarios y actualizar puntuación', mfMessagesLegend: 'Mensajes para M Finance', entranceGateMessagesLegend: 'Mensajes para la puerta de entrada', entranceGateWord: 'Puerta de entrada', connectionsManagementTitle: 'Gestión de conexiones', connectBankAction: 'Conectar banco', noConnections: 'Sin conexiones', disconnectButton: 'Desconectar', plaidNotYetSupported: 'Plaid — se admitirá en un paso futuro', israeliProviderNotConfigured: 'Proveedor israelí — aún no configurado', providerNotDetected: 'Proveedor no detectado', noTransactions: 'Sin transacciones' },
    currencyNames: { ILS: 'Séquel', USD: 'Dólar', GBP: 'Libra', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' },
    updates: { colDate: 'Fecha y hora', colProduct: 'Producto', colVersion: 'Versión', colTitle: 'Título', productKeyClick: 'KeyClick Sitio web', productMFinance: 'M Finance Presupuesto familiar' },
    reminders: { loginRequired: 'Inicio de sesión requerido', titlePh: 'Título del recordatorio', timePh: 'Hora', add: '+ Agregar', noReminders: 'Sin recordatorios' },
    guides: { overview: 'Descripción general', userGuide: 'Guía del usuario', financeOverviewTitle: 'Qué es M Finance', financeOverviewDesc: 'Una breve descripción de la gestión del presupuesto familiar — cuentas, transacciones, categorías y previsiones, y a quién está dirigido.', financeGuideTitle: 'Uso paso a paso', financeGuideDesc: 'Una guía escrita con capturas de pantalla: instalación, conexión de cuentas, categorización e informes.', financeVideosTitle: 'Tutoriales cortos', financeVideosDesc: 'Breves videotutoriales de cada función clave en la gestión del presupuesto familiar.', siteOverviewTitle: 'Qué ofrece el sitio', siteOverviewDesc: 'Un breve recorrido por la plataforma KeyClick — productos, servicios y relación con los clientes.', siteGuideTitle: 'Registro y navegación', siteGuideDesc: 'Cómo registrarse, iniciar sesión y encontrar cada servicio en el sitio.', siteVideosTitle: 'Demostraciones del sitio', siteVideosDesc: 'Breves demostraciones grabadas de las principales funciones del sitio.' },
    banking: { autoDetectFailed: 'Detección automática fallida — elija manualmente', detectionError: 'Error de detección', loadBanksError: 'Error al cargar los bancos', plaidTokenError: 'Error de token de Plaid', bankConnected: 'Banco conectado', connectionError: 'Error de conexión', linkOpened: 'Se abrió una ventana de conexión para {name}. Después de aprobar, vuelva y haga clic en actualizar.', linkCreateError: 'Error al crear el enlace bancario', refreshing: 'Actualizando...', updated: 'Actualizado', fetchingData: 'Obteniendo datos...', noAccountsConnected: 'No hay cuentas conectadas', downloadedFiles: '{count} archivos descargados', downloadError: 'Error de descarga', connectBankTitle: 'Conectar banco', autoDetect: 'Detección automática', orManually: 'o manualmente', unitedStates: 'Estados Unidos', back: 'Volver', selectInstitution: 'Seleccionar banco', noInstitutions: 'No hay bancos', refresh: 'Actualizar', downloadFiles: 'Descargar archivos', clickToDownload: 'Haga clic para descargar', decorWorldwide: 'Alrededor del mundo', decorPrivateLine1: 'Conexión privada al banco', decorPrivateLine2: 'Desconectado de la gestión del presupuesto familiar', instructionsTitle: 'Instrucciones', instructionsLine1: 'Sigue la flecha roja que señala el botón que debes pulsar.', instructionsLine2: 'Inicia sesión en tu entidad financiera con los datos de seguridad habituales de esa entidad.', instructionsLine3: 'Completa todo el proceso; al final te desconectarás de la entidad financiera.', instructionsLine4: 'Sigue los mensajes del sistema.', systemMessagesTitle: 'Mensajes del sistema', noMessagesYet: 'Aún no hay mensajes', clickToConnect: 'Haz clic para conectar', readData: 'Leer datos', clickToDisconnect: 'Haz clic para desconectar', clickToClose: 'Haz clic para cerrar', waitingForSelection: 'Esperando selección', chooseDownloadType: 'Elige el tipo de descarga de datos', downloadFilesToComputer: 'Descargar archivos al ordenador', loadDataBtn: 'Cargar datos', connectingToInstitution: 'Conectando con {name}...', connectedStatus: 'Conectado', connectDoneMsg: 'Conexión establecida con {name}', disconnectingFromInstitution: 'Desconectando de {name}...', disconnectDoneMsg: 'Desconexión realizada', readingDataMsg: 'Leyendo datos de la entidad financiera...', readingDataDoneMsg: 'Lectura de datos completada', loadingDataMsg: 'Cargando datos...', accountStatementMsg: 'Extracto de cuenta {id} del periodo {period}', creditStatementMsg: 'Extracto de tarjeta de crédito {id} del periodo {period}', dataLoadedDoneMsg: 'Datos cargados correctamente', doneStatus: 'Hecho', loadDataErrorMsg: 'Error al cargar los datos', downloadingFilesMsg: 'Descargando archivos al ordenador...', fileDownloadedForPeriodMsg: '{file} descargado - del periodo {period}', downloadFilesErrorMsg: 'Error al descargar los archivos', closingWindowMsg: 'Cerrando la ventana del sitio...', selectedDownloadFilesMsg: 'Seleccionado: descargar archivos al ordenador', selectedLoadDataMsg: 'Seleccionado: cargar datos', totalFilesMsg: 'Total: {count} archivos', introTitlePrefix: 'Hola, bienvenido a los servicios bancarios de', card1Title: 'El servicio incluye', card1Item1: 'Conexion con una institucion financiera donde tiene una cuenta', card1Item2: 'Descarga de archivos de extractos de cuenta', card1Item3: 'Carga directa en la gestion del presupuesto familiar', card1Item4: 'Una experiencia en un entorno tecnologico avanzado', card2Title: 'Puntos clave', card2Item1: 'La conexion es unicamente para descargar archivos, ninguna otra accion', card2Item2: 'La conexion se realiza conforme a la configuracion de seguridad de la institucion financiera seleccionada', card2Item3: 'Los extractos de cuenta permanecen solo en el entorno actual - sin conexion a nubes ni almacenamiento externo', card2Item4: 'Este servicio se puede activar desde aqui, y tambien directamente desde la gestion del presupuesto familiar', card3Title: 'Pasos del proceso', card3Item1: 'Haga clic en "Seleccionar institucion financiera"', card3Item2: 'En la pagina de instituciones, seleccione una institucion', card3Item3: 'Siga la flecha roja, haga clic donde apunta', card3Item4: 'Complete el proceso hasta la desconexion completa', introSuccess: 'Buena suerte', }, captions: { guidesRight1: 'Un armario de cajones', guidesRight2: 'con guías y vídeos', guidesLeft: 'Cajones del tesoro...', guidesDrawersLine1: 'Cajones 1–6', guidesDrawersLine2: 'también desde aquí…', registerRight1: 'Un registro rápido', registerRight2: 'hacia un mundo de sorpresas...', personalDefaultRight: 'Datos personales básicos, del sistema', personalDefaultLeft: 'Plan activo. Posibilidad de cambiar de plan', personalPlanRight: 'Al elegir el plan se mostrará el período y el precio', personalPlanLeft1: 'Haga clic en', personalPlanLeft2: '«Actualizar»', personalPlanLeft3: 'al terminar de elegir', feedbackAboveButton: 'Cada formulario nuevo es para un mensaje y una respuesta. Vea el botón «Nuevo mensaje»', updatesWord1: 'Versiones', updatesWord2: 'de software', updatesWord3: 'de los componentes', updatesWord4: 'del proyecto', remindersRight1: 'Servicio de recordatorios', remindersRight2: 'Calendario de eventos importantes', remindersLeft1: 'Fechas del plan activo', remindersLeft2: 'Posibilidad de añadir fechas', remindersLeft3: 'de recordatorio privadas' } },
  { code: 'ja', flag: 'יפן',     name: '日本語',    welcome: 'ようこそ',
    menu: ['フィードバック','更新','メッセージ','リマインダー','銀行サービス','個人ページ'],
    card: { title: '家計管理', namePh: '名前 / 苗字', emailPh: 'メール / メールアドレス', passPh: 'パスワード', confirmPassPh: 'パスワードの確認', register: '登録', login: 'ログイン', locked: 'ロック中', registered: '登録済み', update: '更新', line1: 'ローンチ期間中', line2: '無料', errName: '名前を入力してください', errEmail: '有効なメールアドレスを入力してください', errPassLen: 'パスワードは6文字以上必要です', errPassMatch: '一致するパスワード確認を入力してください', errEmailExists: 'このメールアドレスはすでに登録されています', cancel: 'キャンセル', install: 'インストール', library: 'ガイドファイル', run: '起動', videos: 'ビデオ', guide: 'ガイド', ok: 'OK', msgAlreadyInstalled: 'インストール済み\n再インストール不要', msgDownloading: 'インストールファイルをダウンロード中', msgInstallComplete: 'ファイルを保存して実行\nインストールを完了', msgDownloadError: 'ダウンロードエラー\n再試行', mFinance: 'M Finance', msgExists: 'このメールは\nすでに登録されています', msgUpdated: '情報が正常に更新されました', msgRegistered: '登録が完了しました', existingCustomer: '既存のお客様', newCustomer: '新規のお客様', notRecognized: 'お客様は登録されていません。登録するにはクリック', msgSelectPlan: '個人ページでプランを選択してください', infoServices: '情報サービス', guidesAndVideos: 'ガイドと動画', siteHeaderPrefix: '公式サイト：', theWebsite: '本サイト', loginSubtitle: 'アカウントにログイン', emailPhSimple: 'メール', passPhSimple: 'パスワード', connectingEllipsis: 'ログイン中...', noAccountQuestion: 'アカウントをお持ちでないですか？', registerHereLink: 'こちらから登録', invalidCredentials: 'メールまたはパスワードが正しくありません', registerErrorGeneric: '登録エラー' },
    profile: { fullName: 'フルネーム', email: 'メール', ip: 'IP', language: '言語', country: '国', plan: 'プラン', planStart: 'プラン開始', planEnd: 'プラン終了', unlimited: '無制限', comingSoon: '近日公開', choosePlan: 'プランを選択', close: '✕ 閉じる', loginRequired: 'ログインが必要です', login: 'ログイン', products: '製品', change: '変更',
      price: '価格', changePlan: 'プランを選択', planName: '名前', planFrom: 'から', planTo: 'まで', back: '戻る', currencyLocal: '¥', free: '無料',       planNames: { System_Free_Run: '試運転', User_Trial: '試用', User_VIP_Free: 'VIP', System_Owner: 'システム', User_Monthly: '月次', User_Annual: '年次', User_One_Time: '単回', System_Suspended_NonPayment: '停止', User_Cancelled: 'キャンセル' } },
    feedback: { customerRelations: 'カスタマーサービス', systemMessage: 'システムメッセージ', respectfully: '敬具,', rating: '評価', ratingWebsite: 'ウェブサイト', ratingBudget: '家計管理', userMessage: 'ユーザーメッセージ', date: '日付:', title: 'タイトル:', from: '差出人:', systemReply: 'システム返信' },
    system: { systemLabel: 'システム', selectAction: '右サイドバーからアクションを選択', users: 'ユーザー', buildMessages: 'ビルドログ', schedule: '表とデータ', pr: 'PR', announcements: 'お知らせ', publishedDate: '公開日:', reset: 'リセット', saved: '保存済み', records: '件', scheduleSubject: '件名', schedulePriceUSD: '価格\n[$]', schedulePeriod: '期間\n[月]', scheduleNotes: 'メモ', clear: 'クリア', pause: '一時停止', resume: '再開', active: '● アクティブ', paused: '一時停止中', lines: '行', filter: 'フィルター', refresh: '更新', loading: '読み込み中...', loadingBuild: 'ビルドデータ読み込み中...', error: 'エラー', noBuildData: 'データなし。Release_KeyClick.bat を実行', networkError: 'ネットワークエラー', testsCreateFolderLegend: 'ダウンロードフォルダにフォルダを作成', testsNameLabel: '名前', testsCreateButton: 'クリックして作成', testsFolderCreatedPrefix: 'フォルダが作成されました:', scheduleTitle: '価格表とスケジュール', allFinancialInstitutions: 'すべての金融機関', newSystemMessageTitle: '新しいシステムメッセージ', systemMessageLabel: 'システムメッセージ', broadcastPlaceholder: 'メッセージ内容', sensitiveColEnv: '環境', sensitiveColFlag: 'フラグ名', sensitiveColPurpose: '目的', sensitiveDevBypassEnv: 'サイト 3000（ローカル開発）', sensitiveDevBypassFlag: 'ログインをバイパス', sensitiveDevBypassPurpose: '1=バイパス 0=バイパスしない－開発者専用', adminButton: 'システム管理', generalGroup: '全般', colName: '名前', colCurrency: '通貨', colCreated: '作成日', colActive: '有効', colAppInstalled: 'アプリ', colLicenceType: 'ライセンス種別', colSystemForce: 'システムモード', distributionDay: '配布日X', messages: 'メッセージ', send: '送信', sent: '送信済み!', reply: '返信', noMessages: 'メッセージなし', replySent: '返信済み!', ref: '参照', msgNo: 'No.', replyToRef: '参照への返信', msgNumber: 'メッセージNo.', new: '新着', delete: '削除', newMessage: '+ 新メッセージ', selectToView: 'メッセージを選択', monitor: 'モニター', systemData: 'システムデータ', resetTable: 'テーブルリセット', debug: 'デバッグ', db: 'DB', sensitivePoints: '重要ポイント', productVersionTable: '更新タブの製品バージョン一覧', lab: 'ラボ', allCustomers: '全顧客', newMessageNotif: '新着メッセージ、こちらをクリック', colType: '種類', labTests: 'テスト', labBanking: '金融機関', colCustomer: '顧客', adminNewMsg: '- 新着メッセージ -', dataCollection: 'データ収集', data: 'ライブ', statistics: '処理', billing: '決済', billLastPlan: '最終プラン', billLastAmount: '最終金額', billLastDate: '最終支払日', billStatus: 'ステータス', billPlan: 'プラン', billAmount: '金額', billDate: '日付', billNoPayments: '支払いなし', colRunningNo: '番号', colIp: 'IPアドレス', colEntered: '入室時刻', colExited: '退室時刻', colDuration: '滞在時間', durationMin: '分', durationSec: '秒', statTotalVisits: '総訪問数', statUniqueVisitors: 'ユニーク訪問者', statOnlineNow: '現在オンライン', statAvgDuration: '平均滞在時間', statLongestVisit: '最長の訪問', statBusiestHour: '最も混雑した時間', statBusiestDay: '最も混雑した曜日', statNamed: '識別済み', statAnonymous: '匿名', statHourlyTitle: '時間別アクティビティ', statDayTitle: '曜日別アクティビティ', statNoData: 'まだデータが十分ではありません', statPeriod: '測定期間', statTotalVisitsDesc: '記録された訪問の総数（ページの読み込みごとにカウント）', statUniqueVisitorsDesc: '訪問した異なるIPアドレスの数（重複なし）', statOnlineNowDesc: '現在サイトにいて、まだ退出していない訪問者', statAvgDurationDesc: 'すでに退出した訪問者の平均滞在時間', statHourlyTitleDesc: '全期間を通じて、1日の各時間帯に入室した訪問の合計数', statDayTitleDesc: '全期間を通じて、曜日ごとに入室した訪問の合計数', statNamedDesc: 'IPアドレスが登録ユーザーと一致する訪問者', statAnonymousDesc: '登録ユーザーと一致しない訪問者', statBusiestHourDesc: '最も入室が多かった時間帯', statBusiestDayDesc: '最も入室が多かった曜日', statLongestVisitDesc: '1回の訪問で記録された最長の滞在時間', statLegend: '凡例', statYearlyTitle: '年間アクティビティ', statByMonth: '月別', statByWeek: '週別', statReturning: 'リピーター', statLinked: '紐付け済み', statCountryTitle: '国別訪問数', statNoGeoData: '不明', statDurationTitle: '滞在時間の分布', statDur0_5: '0～5分', statDur5_15: '5～15分', statDur15_60: '15～60分', statDur60_120: '60～120分', statDurOver120: '2時間以上', statWeekOf: '週:', statOngoingTitle: '継続的データ処理', statActivityTab: 'アクティビティ', runStatusRunning: '稼働中', runStatusStopped: '停止中', dataCollectionLegend: 'データ収集', collectionStart: '開始', collectionEnd: '終了', endToggleActive: 'ここまで', endToggleInactive: '終了なし', runToggleActive: 'データ収集中', runToggleInactive: 'データ収集停止中', legendUnregistered: '未登録', legendRegistered: '登録済み', graphEntriesTitle: 'サイト訪問者数', graphDurationTitle: 'サイト滞在時間', providersTitle: 'プロバイダー', providerStatusConfigured: '✓ 設定済み', providerStatusPendingRegistration: '✗ 登録待ち', providerNordigenDesc: 'ヨーロッパ — 2300以上の銀行', providerPlaidDesc: '米国 — 数千の銀行', providerIlName: 'イスラエル（Salt Edge）', providerIlDesc: 'イスラエル — 銀行とクレジットカード', providerGroqDesc: '国の自動検出', colProvider: 'プロバイダー', colRole: '役割', routeDescTokenNordigen: 'Nordigenからのアクセストークン', routeDescInstitutionsNordigen: '国別の銀行リスト', routeDescConnectNordigen: 'requisitionの作成 + 銀行リンク', routeDescCallbackNordigen: '確認の受信 + DBへの保存', routeDescLinkTokenPlaid: 'Link Tokenの作成', routeDescExchangePlaid: '接続後のpublic_tokenの交換', routeDescSyncPlaid: '取引と残高の同期', routeDescConnectIl: 'イスラエルのプロバイダーへの接続', routeDescCallbackIl: 'コールバック + DBへの保存', routeDescAccountsShared: 'ユーザーの口座', routeDescTransactionsShared: '取引 + プロバイダーからの同期', routeDescDetectProvider: '自動検出：国 → プロバイダー', routeDescStatusSystem: '認証情報のステータス', routeDescDataSystem: 'DBデータ', providerLabelIsrael: 'イスラエル', providerLabelShared: '共通', providerLabelSystem: 'システム', accountsBalancesTitle: '口座と残高', colFinancialInstitution: '金融機関', colAccount: '口座', colBalance: '残高', noAccountsConnectedExample: '接続された口座がありません — 例を表示中', connectionsLabel: '接続', accountsLabel: '口座', transactionsLabel: '取引', noRecordsFound: 'レコードがありません', editButton: '編集', weightedScoreTitle: '加重スコア', colPercent: 'パーセント', colMetric: '指標', colExplanation: '説明', totalWeightsLabel: '重みの合計：', weightedNumberLabel: '加重数値', weightedFormula: '加重スコア (0–10) = Σ ( 指標_i ∈ {0,1} × 重み_i% ) × 10 / 100', scanningLabel: 'スキャン中...', scanUsersButton: 'ユーザーをスキャンしてスコアを更新', mfMessagesLegend: 'M Finance向けメッセージ', entranceGateMessagesLegend: '入口ゲート向けメッセージ', entranceGateWord: '入口ゲート', connectionsManagementTitle: '接続の管理', connectBankAction: '銀行を接続', noConnections: '接続がありません', disconnectButton: '切断', plaidNotYetSupported: 'Plaid — 今後のステップで対応予定', israeliProviderNotConfigured: 'イスラエルのプロバイダー — まだ設定されていません', providerNotDetected: 'プロバイダーが検出されませんでした', noTransactions: '取引がありません' },
    currencyNames: { ILS: 'シェケル', USD: 'ドル', GBP: 'ポンド', EUR: 'ユーロ', RUB: 'ルーブル', JPY: '円', SAR: 'リヤル', CNY: '元', INR: 'ルピー' },
    updates: { colDate: '日時', colProduct: '製品', colVersion: 'バージョン', colTitle: 'タイトル', productKeyClick: 'KeyClick サイト', productMFinance: 'M Finance 家計管理' },
    reminders: { loginRequired: 'リマインダーを表示するにはログインが必要です', titlePh: 'リマインダーのタイトル', timePh: '時刻', add: '+ 追加', noReminders: 'リマインダーなし' },
    guides: { overview: '概要', userGuide: 'ユーザーガイド', financeOverviewTitle: 'M Financeとは', financeOverviewDesc: '家計管理の簡単な概要 — 口座、取引、カテゴリ、予測、対象となる方について。', financeGuideTitle: '使い方ステップガイド', financeGuideDesc: 'スクリーンショット付きの説明書：インストール、口座の連携、分類とレポート。', financeVideosTitle: '短いチュートリアル', financeVideosDesc: '家計管理の主要機能ごとの短い動画チュートリアル。', siteOverviewTitle: 'サイトが提供するもの', siteOverviewDesc: 'KeyClickプラットフォームの簡単な紹介 — 製品、サービス、カスタマーリレーション。', siteGuideTitle: '登録とナビゲーション', siteGuideDesc: '登録方法、ログイン方法、サイト内の各サービスの見つけ方。', siteVideosTitle: 'サイトのデモ', siteVideosDesc: 'サイトの主要機能を短く撮影したデモ。' },
    banking: { autoDetectFailed: '自動検出に失敗しました。手動で選択してください', detectionError: '検出エラー', loadBanksError: '銀行の読み込みエラー', plaidTokenError: 'Plaidトークンエラー', bankConnected: '銀行が接続されました', connectionError: '接続エラー', linkOpened: '{name}への接続ウィンドウが開きました。承認後、戻って更新をクリックしてください。', linkCreateError: '銀行リンクの作成エラー', refreshing: '更新中...', updated: '更新しました', fetchingData: 'データを取得中...', noAccountsConnected: '接続された口座がありません', downloadedFiles: '{count}件のファイルをダウンロードしました', downloadError: 'ダウンロードエラー', connectBankTitle: '銀行を接続', autoDetect: '自動検出', orManually: 'または手動で', unitedStates: 'アメリカ合衆国', back: '戻る', selectInstitution: '銀行を選択', noInstitutions: '銀行がありません', refresh: '更新', downloadFiles: 'ファイルをダウンロード', clickToDownload: 'クリックしてダウンロード', decorWorldwide: '世界中を', decorPrivateLine1: '銀行への個人的な接続', decorPrivateLine2: '家計管理とは切り離されています', instructionsTitle: '手順', instructionsLine1: 'クリックするボタンを示す赤い矢印に従ってください。', instructionsLine2: 'その金融機関で使用されているセキュリティ情報を使ってログインしてください。', instructionsLine3: '一連の手順を最後まで完了してください。最後に金融機関との接続を切断します。', instructionsLine4: 'システムメッセージを確認してください。', systemMessagesTitle: 'システムメッセージ', noMessagesYet: 'まだメッセージはありません', clickToConnect: 'クリックして接続', readData: 'データを読み込む', clickToDisconnect: 'クリックして切断', clickToClose: 'クリックして閉じる', waitingForSelection: '選択待ち', chooseDownloadType: 'データのダウンロード方法を選択してください', downloadFilesToComputer: 'ファイルをパソコンにダウンロード', loadDataBtn: 'データを読み込む', connectingToInstitution: '{name}に接続中...', connectedStatus: '接続済み', connectDoneMsg: '{name}への接続が完了しました', disconnectingFromInstitution: '{name}から切断中...', disconnectDoneMsg: '切断が完了しました', readingDataMsg: '金融機関からデータを読み込み中...', readingDataDoneMsg: 'データの読み込みが完了しました', loadingDataMsg: 'データを読み込んでいます...', accountStatementMsg: '口座明細書{id}（期間：{period}）', creditStatementMsg: 'クレジットカード明細書{id}（期間：{period}）', dataLoadedDoneMsg: 'データが正常に読み込まれました', doneStatus: '完了', loadDataErrorMsg: 'データの読み込みエラー', downloadingFilesMsg: 'ファイルをパソコンにダウンロード中...', fileDownloadedForPeriodMsg: '{file}をダウンロードしました - 期間：{period}', downloadFilesErrorMsg: 'ファイルのダウンロードエラー', closingWindowMsg: 'サイトのウィンドウを閉じています...', selectedDownloadFilesMsg: '選択：ファイルをパソコンにダウンロード', selectedLoadDataMsg: '選択：データを読み込む', totalFilesMsg: '合計：{count}件のファイル', introTitlePrefix: 'こんにちは、銀行サービスへようこそ', card1Title: 'サービス内容', card1Item1: '口座をお持ちの金融機関への接続', card1Item2: '口座明細ファイルのダウンロード', card1Item3: '家計管理への直接読み込み', card1Item4: '先進的なテクノロジー環境での体験', card2Title: '重要なポイント', card2Item1: '接続はファイルのダウンロードのみを目的とし、他の操作は行いません', card2Item2: '接続は選択した金融機関のセキュリティ設定に従って行われます', card2Item3: '口座明細は現在の環境にのみ保存され、クラウドや外部ストレージへの接続はありません', card2Item4: 'このサービスはここから、また家計管理から直接実行することもできます', card3Title: '実行手順', card3Item1: '「金融機関を選択」をクリック', card3Item2: '機関ページで金融機関を選択', card3Item3: '赤い矢印に従い、指し示す場所をクリックしてください', card3Item4: 'プロセスを完了し、完全に切断してください', introSuccess: '頑張ってください', }, captions: { guidesRight1: 'ガイドと動画が', guidesRight2: '詰まった引き出し棚', guidesLeft: '宝物の引き出し...', guidesDrawersLine1: '引き出し1～6', guidesDrawersLine2: 'ここからも…', registerRight1: '簡単な登録で', registerRight2: '様々なサプライズへ...', personalDefaultRight: 'システムからの基本的な個人情報', personalDefaultLeft: '有効なプラン。プラン変更も可能', personalPlanRight: 'プランを選択すると期間と料金が表示されます', personalPlanLeft1: '選択が終わったら', personalPlanLeft2: '「更新」を', personalPlanLeft3: 'クリックしてください', feedbackAboveButton: '新規フォームは1件のメッセージと1件の返信専用です。「新規メッセージ」ボタンをご覧ください', updatesWord1: 'プロジェクト', updatesWord2: '構成要素の', updatesWord3: 'ソフトウェア', updatesWord4: 'バージョン', remindersRight1: 'リマインダーサービス', remindersRight2: '重要な予定のカレンダー', remindersLeft1: '有効なプランの日付', remindersLeft2: '個人的なリマインダーの', remindersLeft3: '日付を追加可能' } },
  { code: 'ar', flag: 'סעודיה',  name: 'العربية',  welcome: 'أهلاً وسهلاً',
    menu: ['ملاحظات','تحديثات','رسائل','تذكيرات','خدمات مصرفية','الصفحة الشخصية'],
    card: { title: 'إدارة الميزانية المنزلية', namePh: 'الاسم / اسم العائلة', emailPh: 'البريد الإلكتروني', passPh: 'كلمة المرور', confirmPassPh: 'تأكيد كلمة المرور', register: 'تسجيل', login: 'دخول', locked: 'مقفل', registered: 'مسجّل', update: 'تحديث', line1: 'خلال فترة الإطلاق', line2: 'مجاناً', errName: 'الرجاء إدخال اسمك', errEmail: 'الرجاء إدخال بريد إلكتروني صحيح', errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل', errPassMatch: 'يرجى إدخال تأكيد كلمة مرور مطابق', errEmailExists: 'البريد الإلكتروني مسجل بالفعل', cancel: 'إلغاء', install: 'تثبيت', library: 'ملفات الدليل', run: 'تشغيل', videos: 'مقاطع', guide: 'دليل', ok: 'حسناً', msgAlreadyInstalled: 'مثبت بالفعل\nلا حاجة لإعادة التثبيت', msgDownloading: 'جارٍ تنزيل ملف التثبيت', msgInstallComplete: 'احفظ الملف وشغّله\nلإكمال التثبيت', msgDownloadError: 'خطأ في التنزيل\nحاول مرة أخرى', mFinance: 'M Finance', msgExists: 'المستخدم مسجل بالفعل\nبهذه البيانات', msgUpdated: 'تم تحديث البيانات بنجاح', msgRegistered: 'اكتمل التسجيل', existingCustomer: 'عميل موجود', newCustomer: 'عميل جديد', notRecognized: 'العميل غير مسجل. انقر للتسجيل', msgSelectPlan: 'يرجى اختيار خطة في صفحتك الشخصية', infoServices: 'خدمات المعلومات', guidesAndVideos: 'أدلة ومقاطع فيديو', siteHeaderPrefix: 'الموقع الإلكتروني لـ', theWebsite: 'الموقع', loginSubtitle: 'تسجيل الدخول إلى حسابك', emailPhSimple: 'البريد الإلكتروني', passPhSimple: 'كلمة المرور', connectingEllipsis: 'جارٍ تسجيل الدخول...', noAccountQuestion: 'ليس لديك حساب؟', registerHereLink: 'سجّل هنا', invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', registerErrorGeneric: 'خطأ في التسجيل' },
    profile: { fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', ip: 'IP', language: 'اللغة', country: 'الدولة', plan: 'الخطة', planStart: 'بداية الخطة', planEnd: 'نهاية الخطة', unlimited: 'بلا حدود', comingSoon: 'قريباً', choosePlan: 'اختر خطة', close: '✕ إغلاق', loginRequired: 'تسجيل الدخول مطلوب', login: 'دخول', products: 'المنتجات', change: 'تغيير',
      price: 'السعر', changePlan: 'اختر الخطة', planName: 'الاسم', planFrom: 'من', planTo: 'إلى', back: 'رجوع', currencyLocal: '﷼', free: 'مجاناً',       planNames: { System_Free_Run: 'تشغيل', User_Trial: 'تجريبي', User_VIP_Free: 'VIP', System_Owner: 'النظام', User_Monthly: 'شهري', User_Annual: 'سنوي', User_One_Time: 'مرة واحدة', System_Suspended_NonPayment: 'موقوف', User_Cancelled: 'ملغى' } },
    feedback: { customerRelations: 'خدمة العملاء', systemMessage: 'رسالة النظام', respectfully: 'مع التحية،', rating: 'تقييم', ratingWebsite: 'الموقع', ratingBudget: 'إدارة الميزانية المنزلية', userMessage: 'رسالة المستخدم', date: 'التاريخ:', title: 'الموضوع:', from: 'من:', systemReply: 'رد النظام' },
    system: { systemLabel: 'النظام', selectAction: 'اختر إجراء من الشريط الأيمن', users: 'المستخدمون', buildMessages: 'سجل البناء', schedule: 'جداول وبيانات', pr: 'العلاقات العامة', announcements: 'إعلانات', publishedDate: 'تاريخ النشر:', reset: 'إعادة تعيين', saved: 'تم الحفظ', records: 'سجلات', scheduleSubject: 'الموضوع', schedulePriceUSD: 'السعر\n[$]', schedulePeriod: 'الفترة\n[شهر]', scheduleNotes: 'ملاحظات', clear: 'مسح', pause: 'إيقاف مؤقت', resume: 'استئناف', active: '● نشط', paused: 'متوقف مؤقتاً', lines: 'سطور', filter: 'تصفية', refresh: 'تحديث', loading: 'جارٍ التحميل...', loadingBuild: 'تحميل بيانات البناء...', error: 'خطأ', noBuildData: 'لا بيانات. شغّل Release_KeyClick.bat', networkError: 'خطأ في الشبكة', testsCreateFolderLegend: 'إنشاء مجلد في مجلد التنزيلات', testsNameLabel: 'الاسم', testsCreateButton: 'انقر للإنشاء', testsFolderCreatedPrefix: 'تم إنشاء المجلد:', scheduleTitle: 'قائمة الأسعار والجدول الزمني', allFinancialInstitutions: 'جميع المؤسسات المالية', newSystemMessageTitle: 'رسالة نظام جديدة', systemMessageLabel: 'رسالة النظام', broadcastPlaceholder: 'محتوى الرسالة', sensitiveColEnv: 'البيئة', sensitiveColFlag: 'اسم العلم', sensitiveColPurpose: 'الغرض', sensitiveDevBypassEnv: 'الموقع 3000 (تطوير محلي)', sensitiveDevBypassFlag: 'تجاوز تسجيل الدخول', sensitiveDevBypassPurpose: '1=تجاوز 0=عدم التجاوز — للمطور فقط', adminButton: 'النظام', generalGroup: 'عام', colName: 'الاسم', colCurrency: 'العملة', colCreated: 'تاريخ الإنشاء', colActive: 'نشط', colAppInstalled: 'التطبيق', colLicenceType: 'نوع الترخيص', colSystemForce: 'وضع النظام', distributionDay: 'يوم التوزيع X', messages: 'الرسائل', send: 'إرسال', sent: 'تم!', reply: 'رد', noMessages: 'لا رسائل', replySent: 'تم إرسال الرد!', ref: 'مرجع', msgNo: 'رقم', replyToRef: 'رد على المرجع', msgNumber: 'رسالة رقم', new: 'جديد', delete: 'حذف', newMessage: '+ رسالة جديدة', selectToView: 'اختر رسالة للعرض', monitor: 'مراقب', systemData: 'بيانات النظام', resetTable: 'إعادة تعيين الجدول', debug: 'تصحيح', db: 'قاعدة', sensitivePoints: 'نقاط حساسة', productVersionTable: 'جدول الإصدارات في تبويب التحديثات', lab: 'المختبر', allCustomers: 'جميع العملاء', newMessageNotif: 'رسالة جديدة، انقر هنا', colType: 'النوع', labTests: 'اختبارات', labBanking: 'المؤسسات المالية', colCustomer: 'العميل', adminNewMsg: '- رسالة جديدة -', dataCollection: 'جمع البيانات', data: 'مباشر', statistics: 'معالجة', billing: 'الفوترة', billLastPlan: 'الخطة الأخيرة', billLastAmount: 'آخر مبلغ', billLastDate: 'تاريخ آخر دفعة', billStatus: 'الحالة', billPlan: 'الخطة', billAmount: 'المبلغ', billDate: 'التاريخ', billNoPayments: 'لا توجد مدفوعات', colRunningNo: 'الرقم', colIp: 'عنوان IP', colEntered: 'وقت الدخول', colExited: 'وقت الخروج', colDuration: 'مدة التصفح', durationMin: 'د', durationSec: 'ث', statTotalVisits: 'إجمالي الزيارات', statUniqueVisitors: 'زوار فريدون', statOnlineNow: 'متصل الآن', statAvgDuration: 'متوسط المدة', statLongestVisit: 'أطول زيارة', statBusiestHour: 'أكثر ساعة ازدحاماً', statBusiestDay: 'أكثر يوم ازدحاماً', statNamed: 'معروفون', statAnonymous: 'مجهولون', statHourlyTitle: 'النشاط حسب الساعة', statDayTitle: 'النشاط حسب اليوم', statNoData: 'لا توجد بيانات كافية بعد', statPeriod: 'الفترة المقاسة', statTotalVisitsDesc: 'إجمالي عدد الزيارات المسجلة (كل تحميل صفحة يُحتسب)', statUniqueVisitorsDesc: 'عدد عناوين IP المختلفة التي زارت الموقع، كل واحد يُحتسب مرة واحدة', statOnlineNowDesc: 'الزوار الموجودون حالياً على الموقع ولم يغادروا بعد', statAvgDurationDesc: 'متوسط مدة التصفح للزوار الذين غادروا بالفعل', statHourlyTitleDesc: 'إجمالي الزيارات التي دخلت في كل ساعة من اليوم، مجمّعة على مدار الفترة كاملة', statDayTitleDesc: 'إجمالي الزيارات التي دخلت في كل يوم من الأسبوع، مجمّعة على مدار الفترة كاملة', statNamedDesc: 'الزوار الذين يتطابق عنوان IP الخاص بهم مع مستخدم مسجل', statAnonymousDesc: 'الزوار الذين لا يوجد تطابق لهم مع مستخدم مسجل', statBusiestHourDesc: 'الساعة التي شهدت أكبر عدد من الدخول', statBusiestDayDesc: 'اليوم الذي شهد أكبر عدد من الدخول', statLongestVisitDesc: 'أطول مدة تصفح سُجلت في زيارة واحدة', statLegend: 'مفتاح الرموز', statYearlyTitle: 'النشاط السنوي', statByMonth: 'حسب الشهر', statByWeek: 'حسب الأسبوع', statReturning: 'عائدون', statLinked: 'مرتبطون', statCountryTitle: 'الزيارات حسب الدولة', statNoGeoData: 'غير معروف', statDurationTitle: 'توزيع مدة التصفح', statDur0_5: '0-5 دقائق', statDur5_15: '5-15 دقيقة', statDur15_60: '15-60 دقيقة', statDur60_120: '60-120 دقيقة', statDurOver120: 'أكثر من ساعتين', statWeekOf: 'أسبوع', statOngoingTitle: 'معالجة البيانات المستمرة', statActivityTab: 'النشاط', runStatusRunning: 'قيد التشغيل', runStatusStopped: 'متوقف', dataCollectionLegend: 'جمع البيانات', collectionStart: 'البداية', collectionEnd: 'النهاية', endToggleActive: 'حتى هنا', endToggleInactive: 'بدون نهاية', runToggleActive: 'جمع البيانات نشط', runToggleInactive: 'جمع البيانات غير نشط', legendUnregistered: 'غير مسجلين', legendRegistered: 'مسجلون', graphEntriesTitle: 'عدد زوار الموقع', graphDurationTitle: 'وقت التصفح في الموقع', providersTitle: 'مزودو الخدمة', providerStatusConfigured: '✓ تم الإعداد', providerStatusPendingRegistration: '✗ بانتظار التسجيل', providerNordigenDesc: 'أوروبا — أكثر من 2300 بنك', providerPlaidDesc: 'الولايات المتحدة — آلاف البنوك', providerIlName: 'إسرائيل (Salt Edge)', providerIlDesc: 'إسرائيل — بنوك وبطاقات ائتمان', providerGroqDesc: 'اكتشاف تلقائي للدولة', colProvider: 'المزود', colRole: 'الدور', routeDescTokenNordigen: 'رمز الوصول من Nordigen', routeDescInstitutionsNordigen: 'قائمة البنوك حسب الدولة', routeDescConnectNordigen: 'إنشاء requisition + رابط البنك', routeDescCallbackNordigen: 'استلام التأكيد + الحفظ في قاعدة البيانات', routeDescLinkTokenPlaid: 'إنشاء Link Token', routeDescExchangePlaid: 'استبدال public_token بعد الاتصال', routeDescSyncPlaid: 'مزامنة المعاملات والأرصدة', routeDescConnectIl: 'الاتصال بالمزود الإسرائيلي', routeDescCallbackIl: 'callback + الحفظ في قاعدة البيانات', routeDescAccountsShared: 'حسابات المستخدم', routeDescTransactionsShared: 'المعاملات + المزامنة من المزود', routeDescDetectProvider: 'اكتشاف تلقائي: الدولة ← المزود', routeDescStatusSystem: 'حالة بيانات الاعتماد', routeDescDataSystem: 'بيانات قاعدة البيانات', providerLabelIsrael: 'إسرائيل', providerLabelShared: 'مشترك', providerLabelSystem: 'النظام', accountsBalancesTitle: 'الحسابات والأرصدة', colFinancialInstitution: 'المؤسسة المالية', colAccount: 'الحساب', colBalance: 'الرصيد', noAccountsConnectedExample: 'لا توجد حسابات متصلة — يتم عرض مثال', connectionsLabel: 'الاتصالات', accountsLabel: 'الحسابات', transactionsLabel: 'المعاملات', noRecordsFound: 'لا توجد سجلات', editButton: 'تعديل', weightedScoreTitle: 'التقييم الموزون', colPercent: 'النسبة', colMetric: 'المؤشر', colExplanation: 'الشرح', totalWeightsLabel: 'إجمالي الأوزان:', weightedNumberLabel: 'الرقم الموزون', weightedFormula: 'التقييم الموزون (0–10) = Σ ( المؤشر_i ∈ {0,1} × الوزن_i% ) × 10 / 100', scanningLabel: 'جارٍ الفحص...', scanUsersButton: 'فحص المستخدمين وتحديث التقييم', mfMessagesLegend: 'رسائل لـ M Finance', entranceGateMessagesLegend: 'رسائل لبوابة الدخول', entranceGateWord: 'بوابة الدخول', connectionsManagementTitle: 'إدارة الاتصالات', connectBankAction: 'ربط بنك', noConnections: 'لا توجد اتصالات', disconnectButton: 'قطع الاتصال', plaidNotYetSupported: 'Plaid — سيتم دعمه في خطوة لاحقة', israeliProviderNotConfigured: 'المزود الإسرائيلي — لم يُعد بعد', providerNotDetected: 'لم يتم اكتشاف المزود', noTransactions: 'لا توجد معاملات' },
    currencyNames: { ILS: 'شيكل', USD: 'دولار', GBP: 'جنيه', EUR: 'يورو', RUB: 'روبل', JPY: 'ين', SAR: 'ريال', CNY: 'يوان', INR: 'روبية' },
    updates: { colDate: 'التاريخ والوقت', colProduct: 'المنتج', colVersion: 'الإصدار', colTitle: 'العنوان', productKeyClick: 'KeyClick موقع', productMFinance: 'M Finance ميزانية المنزل' },
    reminders: { loginRequired: 'تسجيل الدخول مطلوب لعرض التذكيرات', titlePh: 'عنوان التذكير', timePh: 'الوقت', add: '+ إضافة', noReminders: 'لا توجد تذكيرات' },
    guides: { overview: 'وصف عام', userGuide: 'دليل المستخدم', financeOverviewTitle: 'ما هو M Finance', financeOverviewDesc: 'نظرة عامة موجزة على إدارة ميزانية المنزل — الحسابات، المعاملات، الفئات والتوقعات، ولمن هذا مخصص.', financeGuideTitle: 'الاستخدام خطوة بخطوة', financeGuideDesc: 'دليل مكتوب مع لقطات شاشة: التثبيت، ربط الحسابات، التصنيف والتقارير.', financeVideosTitle: 'شروحات قصيرة', financeVideosDesc: 'مقاطع فيديو تعليمية قصيرة لكل ميزة أساسية في إدارة ميزانية المنزل.', siteOverviewTitle: 'ما الذي يقدمه الموقع', siteOverviewDesc: 'جولة قصيرة في منصة KeyClick — المنتجات والخدمات وخدمة العملاء.', siteGuideTitle: 'التسجيل والتنقل', siteGuideDesc: 'كيفية التسجيل وتسجيل الدخول والعثور على كل خدمة في الموقع.', siteVideosTitle: 'عروض توضيحية للموقع', siteVideosDesc: 'عروض توضيحية مصورة قصيرة لأهم ميزات الموقع.' },
    banking: { autoDetectFailed: 'فشل الاكتشاف التلقائي — اختر يدويًا', detectionError: 'خطأ في الاكتشاف', loadBanksError: 'خطأ في تحميل البنوك', plaidTokenError: 'خطأ في رمز Plaid', bankConnected: 'تم ربط البنك بنجاح', connectionError: 'خطأ في الاتصال', linkOpened: 'تم فتح نافذة الاتصال بـ {name}. بعد الموافقة، ارجع واضغط تحديث.', linkCreateError: 'خطأ في إنشاء رابط البنك', refreshing: 'جارٍ التحديث...', updated: 'تم التحديث', fetchingData: 'جارٍ جلب البيانات...', noAccountsConnected: 'لا توجد حسابات متصلة', downloadedFiles: 'تم تنزيل {count} ملفات', downloadError: 'خطأ في التنزيل', connectBankTitle: 'ربط بنك', autoDetect: 'اكتشاف تلقائي', orManually: 'أو يدويًا', unitedStates: 'الولايات المتحدة', back: 'رجوع', selectInstitution: 'اختر مؤسسة مالية', noInstitutions: 'لا توجد مؤسسات', refresh: 'تحديث', downloadFiles: 'تنزيل الملفات', clickToDownload: 'انقر للتنزيل', decorWorldwide: 'حول العالم', decorPrivateLine1: 'اتصال خاص بالبنك', decorPrivateLine2: 'منفصل عن إدارة ميزانية المنزل', instructionsTitle: 'التعليمات', instructionsLine1: 'يرجى اتباع السهم الأحمر الذي يشير إلى الزر الذي يجب الضغط عليه.', instructionsLine2: 'قم بتسجيل الدخول إلى مؤسستك المالية باستخدام بيانات الأمان المعتمدة في تلك المؤسسة.', instructionsLine3: 'يرجى إكمال العملية بأكملها، وفي نهايتها سيتم قطع الاتصال بالمؤسسة المالية.', instructionsLine4: 'يرجى متابعة رسائل النظام.', systemMessagesTitle: 'رسائل النظام', noMessagesYet: 'لا توجد رسائل بعد', clickToConnect: 'انقر للاتصال', readData: 'قراءة البيانات', clickToDisconnect: 'انقر لقطع الاتصال', clickToClose: 'انقر للإغلاق', waitingForSelection: 'بانتظار الاختيار', chooseDownloadType: 'اختر نوع تنزيل البيانات', downloadFilesToComputer: 'تنزيل الملفات إلى الكمبيوتر', loadDataBtn: 'تحميل البيانات', connectingToInstitution: 'جارٍ الاتصال بـ {name}...', connectedStatus: 'متصل', connectDoneMsg: 'تم الاتصال بـ {name}', disconnectingFromInstitution: 'جارٍ قطع الاتصال بـ {name}...', disconnectDoneMsg: 'تم قطع الاتصال', readingDataMsg: 'جارٍ قراءة البيانات من المؤسسة المالية...', readingDataDoneMsg: 'اكتملت قراءة البيانات', loadingDataMsg: 'جارٍ تحميل البيانات...', accountStatementMsg: 'كشف حساب {id} لفترة {period}', creditStatementMsg: 'كشف بطاقة ائتمان {id} لفترة {period}', dataLoadedDoneMsg: 'تم تحميل البيانات بنجاح', doneStatus: 'تم', loadDataErrorMsg: 'خطأ في تحميل البيانات', downloadingFilesMsg: 'جارٍ تنزيل الملفات إلى الكمبيوتر...', fileDownloadedForPeriodMsg: 'تم تنزيل {file} - لفترة {period}', downloadFilesErrorMsg: 'خطأ في تنزيل الملفات', closingWindowMsg: 'جارٍ إغلاق نافذة الموقع...', selectedDownloadFilesMsg: 'تم الاختيار: تنزيل الملفات إلى الكمبيوتر', selectedLoadDataMsg: 'تم الاختيار: تحميل البيانات', totalFilesMsg: 'الإجمالي: {count} ملفات', introTitlePrefix: 'مرحبًا، أهلاً بكم في الخدمات المصرفية لـ', card1Title: 'تشمل الخدمة', card1Item1: 'الاتصال بمؤسسة مالية لديك حساب فيها', card1Item2: 'تنزيل ملفات كشوف الحساب', card1Item3: 'التحميل المباشر إلى إدارة ميزانية المنزل', card1Item4: 'تجربة في بيئة تكنولوجية متقدمة', card2Title: 'نقاط أساسية', card2Item1: 'الاتصال هو فقط لتنزيل الملفات وليس لأي إجراء آخر', card2Item2: 'يتم الاتصال وفقًا لإعدادات الأمان المعمول بها في المؤسسة المالية المختارة', card2Item3: 'تبقى كشوف الحساب في البيئة الحالية فقط - لا يوجد اتصال بالسحابة أو أي تخزين خارجي', card2Item4: 'يمكن تنفيذ هذه الخدمة من هنا، وأيضًا مباشرة من إدارة ميزانية المنزل', card3Title: 'خطوات التنفيذ', card3Item1: 'انقر على "اختر مؤسسة مالية"', card3Item2: 'في صفحة المؤسسات، اختر مؤسسة', card3Item3: 'اتبع السهم الأحمر، وانقر في المكان الذي يشير إليه', card3Item4: 'أكمل العملية حتى الإغلاق والانفصال الكامل', introSuccess: 'بالتوفيق', }, captions: { guidesRight1: 'خزانة أدراج مع', guidesRight2: 'أدلة ومقاطع فيديو', guidesLeft: 'أدراج الكنوز...', guidesDrawersLine1: 'الأدراج 1-6', guidesDrawersLine2: 'من هنا أيضاً...', registerRight1: 'تسجيل سريع', registerRight2: '…في الطريق إلى مجموعة من المفاجآت', personalDefaultRight: 'بيانات شخصية أساسية، من النظام', personalDefaultLeft: 'خطة نشطة. إمكانية تغيير الخطة', personalPlanRight: 'عند اختيار الخطة ستظهر المدة والسعر', personalPlanLeft1: 'يجب الضغط', personalPlanLeft2: 'على تحديث', personalPlanLeft3: 'عند الانتهاء من الاختيار', feedbackAboveButton: 'كل نموذج جديد مخصص لرسالة واحدة ورد واحد. انظر زر رسالة جديدة', updatesWord1: 'إصدارات', updatesWord2: 'البرمجيات', updatesWord3: 'لمكونات', updatesWord4: 'المشروع', remindersRight1: 'خدمة التذكيرات', remindersRight2: 'تقويم الأحداث المهمة', remindersLeft1: 'تواريخ الخطة النشطة', remindersLeft2: 'إمكانية إضافة تواريخ', remindersLeft3: 'تذكير خاصة' } },
  { code: 'zh', flag: 'סין',     name: '中文',      welcome: '欢迎',
    menu: ['反馈','更新','消息','提醒','银行服务','个人页面'],
    card: { title: '家庭预算管理', namePh: '名字 / 姓氏', emailPh: '邮箱 / 电子邮件地址', passPh: '密码', confirmPassPh: '确认密码', register: '注册', login: '登录', locked: '已锁定', registered: '已注册', update: '更新', line1: '在发布期间', line2: '免费', errName: '请输入您的姓名', errEmail: '请输入有效的电子邮件地址', errPassLen: '密码必须至少包含6个字符', errPassMatch: '请输入匹配的密码确认', errEmailExists: '该邮箱已注册', cancel: '取消', install: '安装', library: '指南文件', run: '运行', videos: '视频', guide: '指南', ok: '确定', msgAlreadyInstalled: '已安装\n无需重新安装', msgDownloading: '正在下载安装文件', msgInstallComplete: '保存并运行文件\n以完成安装', msgDownloadError: '下载错误\n请重试', mFinance: 'M Finance', msgExists: '该用户已注册\n使用这些信息', msgUpdated: '信息更新成功', msgRegistered: '注册完成', existingCustomer: '现有客户', newCustomer: '新客户', notRecognized: '客户未注册。点击注册', msgSelectPlan: '请在个人页面选择套餐', infoServices: '信息服务', guidesAndVideos: '指南与视频', siteHeaderPrefix: '官方网站：', theWebsite: '网站', loginSubtitle: '登录您的账户', emailPhSimple: '邮箱', passPhSimple: '密码', connectingEllipsis: '登录中...', noAccountQuestion: '还没有账户？', registerHereLink: '点击此处注册', invalidCredentials: '邮箱或密码错误', registerErrorGeneric: '注册出错' },
    profile: { fullName: '全名', email: '邮箱', ip: 'IP', language: '语言', country: '国家', plan: '套餐', planStart: '套餐开始', planEnd: '套餐结束', unlimited: '无限制', comingSoon: '即将推出', choosePlan: '选择套餐', close: '✕ 关闭', loginRequired: '需要登录', login: '登录', products: '产品', change: '更改',
      price: '价格', changePlan: '选择套餐', planName: '名称', planFrom: '从', planTo: '至', back: '返回', currencyLocal: '¥', free: '免费',       planNames: { System_Free_Run: '试运行', User_Trial: '试用', User_VIP_Free: 'VIP', System_Owner: '系统', User_Monthly: '每月', User_Annual: '每年', User_One_Time: '单次', System_Suspended_NonPayment: '停用', User_Cancelled: '已取消' } },
    feedback: { customerRelations: '客户关系', systemMessage: '系统消息', respectfully: '此致敬礼,', rating: '评分', ratingWebsite: '网站', ratingBudget: '家庭预算管理', userMessage: '用户消息', date: '日期:', title: '标题:', from: '发件人:', systemReply: '系统回复' },
    system: { systemLabel: '系统', selectAction: '从右侧栏选择操作', users: '用户', buildMessages: '构建日志', schedule: '表格与数据', pr: '公关', announcements: '公告', publishedDate: '发布日期:', reset: '重置', saved: '已保存', records: '条记录', scheduleSubject: '主题', schedulePriceUSD: '价格\n[$]', schedulePeriod: '周期\n[月]', scheduleNotes: '备注', clear: '清除', pause: '暂停', resume: '继续', active: '● 活跃', paused: '已暂停', lines: '行', filter: '筛选', refresh: '刷新', loading: '加载中...', loadingBuild: '正在加载构建数据...', error: '错误', noBuildData: '无构建数据。请运行 Release_KeyClick.bat', networkError: '网络错误', testsCreateFolderLegend: '在下载文件夹中创建文件夹', testsNameLabel: '名称', testsCreateButton: '点击创建', testsFolderCreatedPrefix: '已创建文件夹：', scheduleTitle: '价目表和时间表', allFinancialInstitutions: '所有金融机构', newSystemMessageTitle: '新系统消息', systemMessageLabel: '系统消息', broadcastPlaceholder: '消息内容', sensitiveColEnv: '环境', sensitiveColFlag: '标志名称', sensitiveColPurpose: '目的', sensitiveDevBypassEnv: '网站 3000（本地开发）', sensitiveDevBypassFlag: '绕过登录', sensitiveDevBypassPurpose: '1=绕过 0=不绕过—仅限开发人员', adminButton: '系统管理', generalGroup: '常规', colName: '姓名', colCurrency: '货币', colCreated: '创建时间', colActive: '已激活', colAppInstalled: '应用程序', colLicenceType: '许可证类型', colSystemForce: '系统模式', distributionDay: '分发日X', messages: '消息', send: '发送', sent: '已发送!', reply: '回复', noMessages: '无消息', replySent: '回复已发送!', ref: '参考', msgNo: '编号', replyToRef: '回复参考', msgNumber: '消息编号', new: '新', delete: '删除', newMessage: '+ 新消息', selectToView: '选择消息以查看', monitor: '监控', systemData: '系统数据', resetTable: '重置表格', debug: '调试', db: 'DB', sensitivePoints: '敏感点', productVersionTable: '更新标签中的产品版本表', lab: '实验室', allCustomers: '所有客户', newMessageNotif: '新消息，请点击这里', colType: '类型', labTests: '测试', labBanking: '金融机构', colCustomer: '客户', adminNewMsg: '- 新消息 -', dataCollection: '数据采集', data: '实时', statistics: '处理', billing: '结算', billLastPlan: '最近套餐', billLastAmount: '最近金额', billLastDate: '最近付款日期', billStatus: '状态', billPlan: '套餐', billAmount: '金额', billDate: '日期', billNoPayments: '无付款记录', colRunningNo: '编号', colIp: 'IP地址', colEntered: '进入时间', colExited: '离开时间', colDuration: '浏览时长', durationMin: '分', durationSec: '秒', statTotalVisits: '总访问量', statUniqueVisitors: '独立访客', statOnlineNow: '当前在线', statAvgDuration: '平均时长', statLongestVisit: '最长访问', statBusiestHour: '最繁忙时段', statBusiestDay: '最繁忙日', statNamed: '已识别', statAnonymous: '匿名', statHourlyTitle: '按小时活动', statDayTitle: '按天活动', statNoData: '数据还不够', statPeriod: '统计周期', statTotalVisitsDesc: '记录的访问总数（每次页面加载都计算在内）', statUniqueVisitorsDesc: '访问过的不同IP地址数量，每个只计一次', statOnlineNowDesc: '当前在网站上尚未离开的访客', statAvgDurationDesc: '已离开访客的平均浏览时长', statHourlyTitleDesc: '整个统计周期内，每个小时进入的访问总数', statDayTitleDesc: '整个统计周期内，每个星期几进入的访问总数', statNamedDesc: 'IP地址与已注册用户匹配的访客', statAnonymousDesc: '未匹配到已注册用户的访客', statBusiestHourDesc: '进入次数最多的小时', statBusiestDayDesc: '进入次数最多的星期', statLongestVisitDesc: '单次访问中记录的最长浏览时长', statLegend: '图例', statYearlyTitle: '年度活动', statByMonth: '按月', statByWeek: '按周', statReturning: '回访', statLinked: '已关联', statCountryTitle: '按国家/地区访问量', statNoGeoData: '未知', statDurationTitle: '浏览时长分布', statDur0_5: '0-5分钟', statDur5_15: '5-15分钟', statDur15_60: '15-60分钟', statDur60_120: '60-120分钟', statDurOver120: '超过2小时', statWeekOf: '周', statOngoingTitle: '持续数据处理', statActivityTab: '活动', runStatusRunning: '运行中', runStatusStopped: '已停止', dataCollectionLegend: '数据收集', collectionStart: '开始', collectionEnd: '结束', endToggleActive: '到此为止', endToggleInactive: '无结束', runToggleActive: '数据收集运行中', runToggleInactive: '数据收集未运行', legendUnregistered: '未注册', legendRegistered: '已注册', graphEntriesTitle: '网站访问人数', graphDurationTitle: '网站浏览时间', providersTitle: '服务提供商', providerStatusConfigured: '✓ 已配置', providerStatusPendingRegistration: '✗ 等待注册', providerNordigenDesc: '欧洲 — 2300多家银行', providerPlaidDesc: '美国 — 数千家银行', providerIlName: '以色列（Salt Edge）', providerIlDesc: '以色列 — 银行和信用卡', providerGroqDesc: '国家自动识别', colProvider: '提供商', colRole: '角色', routeDescTokenNordigen: '来自Nordigen的访问令牌', routeDescInstitutionsNordigen: '按国家列出的银行列表', routeDescConnectNordigen: '创建requisition +银行链接', routeDescCallbackNordigen: '接收确认+保存到数据库', routeDescLinkTokenPlaid: '创建Link Token', routeDescExchangePlaid: '连接后交换public_token', routeDescSyncPlaid: '同步交易和余额', routeDescConnectIl: '连接以色列提供商', routeDescCallbackIl: '回调+保存到数据库', routeDescAccountsShared: '用户账户', routeDescTransactionsShared: '交易+来自提供商的同步', routeDescDetectProvider: '自动识别:国家→提供商', routeDescStatusSystem: '凭证状态', routeDescDataSystem: '数据库数据', providerLabelIsrael: '以色列', providerLabelShared: '共享', providerLabelSystem: '系统', accountsBalancesTitle: '账户与余额', colFinancialInstitution: '金融机构', colAccount: '账户', colBalance: '余额', noAccountsConnectedExample: '没有已连接的账户 — 显示示例', connectionsLabel: '连接', accountsLabel: '账户', transactionsLabel: '交易', noRecordsFound: '没有记录', editButton: '编辑', weightedScoreTitle: '加权评分', colPercent: '百分比', colMetric: '指标', colExplanation: '说明', totalWeightsLabel: '权重总计:', weightedNumberLabel: '加权数值', weightedFormula: '加权评分 (0–10) = Σ ( 指标_i ∈ {0,1} × 权重_i% ) × 10 / 100', scanningLabel: '扫描中...', scanUsersButton: '扫描用户并更新评分', mfMessagesLegend: 'M Finance消息', entranceGateMessagesLegend: '入口闸门消息', entranceGateWord: '入口闸门', connectionsManagementTitle: '连接管理', connectBankAction: '连接银行', noConnections: '没有连接', disconnectButton: '断开连接', plaidNotYetSupported: 'Plaid — 将在后续步骤中支持', israeliProviderNotConfigured: '以色列提供商 — 尚未配置', providerNotDetected: '未检测到提供商', noTransactions: '没有交易' },
    currencyNames: { ILS: '谢克尔', USD: '美元', GBP: '英镑', EUR: '欧元', RUB: '卢布', JPY: '日元', SAR: '里亚尔', CNY: '人民币', INR: '卢比' },
    updates: { colDate: '日期与时间', colProduct: '产品', colVersion: '版本', colTitle: '标题', productKeyClick: 'KeyClick 网站', productMFinance: 'M Finance 家庭预算' },
    reminders: { loginRequired: '需要登录才能查看提醒', titlePh: '提醒标题', timePh: '时间', add: '+ 添加', noReminders: '暂无提醒' },
    guides: { overview: '概述', userGuide: '用户指南', financeOverviewTitle: '什么是 M Finance', financeOverviewDesc: '家庭预算管理简介 — 账户、交易、分类和预测，以及适用对象。', financeGuideTitle: '分步使用说明', financeGuideDesc: '附截图的图文指南：安装、连接账户、分类和报表。', financeVideosTitle: '简短教程', financeVideosDesc: '家庭预算管理每项主要功能的简短视频教程。', siteOverviewTitle: '网站提供的内容', siteOverviewDesc: 'KeyClick 平台简介 — 产品、服务与客户关系。', siteGuideTitle: '注册与导航', siteGuideDesc: '如何注册、登录并在网站上找到每项服务。', siteVideosTitle: '网站演示', siteVideosDesc: '网站主要功能的简短录制演示。' },
    banking: { autoDetectFailed: '自动检测失败 — 请手动选择', detectionError: '检测错误', loadBanksError: '加载银行时出错', plaidTokenError: 'Plaid 令牌错误', bankConnected: '银行已连接', connectionError: '连接错误', linkOpened: '已打开与{name}的连接窗口。批准后请返回并点击刷新。', linkCreateError: '创建银行链接时出错', refreshing: '正在刷新...', updated: '已更新', fetchingData: '正在获取数据...', noAccountsConnected: '没有已连接的账户', downloadedFiles: '已下载 {count} 个文件', downloadError: '下载错误', connectBankTitle: '连接银行', autoDetect: '自动检测', orManually: '或手动选择', unitedStates: '美国', back: '返回', selectInstitution: '选择银行', noInstitutions: '没有银行', refresh: '刷新', downloadFiles: '下载文件', clickToDownload: '点击下载', decorWorldwide: '环游世界', decorPrivateLine1: '与银行的私人连接', decorPrivateLine2: '与家庭预算管理无关', instructionsTitle: '说明', instructionsLine1: '请按照红色箭头所指的按钮点击。', instructionsLine2: '使用该金融机构通用的安全信息登录您的金融机构。', instructionsLine3: '请完成整个流程,流程结束时将与该金融机构断开连接。', instructionsLine4: '请留意系统消息。', systemMessagesTitle: '系统消息', noMessagesYet: '暂无消息', clickToConnect: '点击连接', readData: '读取数据', clickToDisconnect: '点击断开连接', clickToClose: '点击关闭', waitingForSelection: '等待选择', chooseDownloadType: '选择数据下载方式', downloadFilesToComputer: '将文件下载到电脑', loadDataBtn: '加载数据', connectingToInstitution: '正在连接到{name}...', connectedStatus: '已连接', connectDoneMsg: '已成功连接到{name}', disconnectingFromInstitution: '正在断开与{name}的连接...', disconnectDoneMsg: '已断开连接', readingDataMsg: '正在从金融机构读取数据...', readingDataDoneMsg: '数据读取完成', loadingDataMsg: '正在加载数据...', accountStatementMsg: '账户对账单{id},期间{period}', creditStatementMsg: '信用卡对账单{id},期间{period}', dataLoadedDoneMsg: '数据加载成功', doneStatus: '已完成', loadDataErrorMsg: '数据加载出错', downloadingFilesMsg: '正在将文件下载到电脑...', fileDownloadedForPeriodMsg: '{file}已下载 - 期间{period}', downloadFilesErrorMsg: '文件下载出错', closingWindowMsg: '正在关闭网站窗口...', selectedDownloadFilesMsg: '已选择:将文件下载到电脑', selectedLoadDataMsg: '已选择:加载数据', totalFilesMsg: '共{count}个文件', introTitlePrefix: '您好，欢迎使用银行服务', card1Title: '服务包括', card1Item1: '连接到您开户的金融机构', card1Item2: '下载账户对账单文件', card1Item3: '直接加载到家庭预算管理', card1Item4: '先进技术环境中的体验', card2Title: '要点', card2Item1: '连接仅用于下载文件，不执行任何其他操作', card2Item2: '连接遵循所选金融机构使用的安全设置', card2Item3: '账户对账单仅保留在当前环境中 - 不连接云端或外部存储', card2Item4: '此服务可以从此处激活，也可以直接从家庭预算管理激活', card3Title: '操作流程', card3Item1: '点击"选择金融机构"', card3Item2: '在机构页面上选择一个机构', card3Item3: '跟随红色箭头，点击其指向的位置', card3Item4: '完成流程直到完全断开连接', introSuccess: '祝您顺利', }, captions: { guidesRight1: '装满指南和视频', guidesRight2: '的抽屉柜', guidesLeft: '百宝抽屉...', guidesDrawersLine1: '抽屉1-6', guidesDrawersLine2: '也可从这里…', registerRight1: '简短注册', registerRight2: '开启多样惊喜之旅...', personalDefaultRight: '来自系统的基本个人资料', personalDefaultLeft: '当前有效方案。可更改方案', personalPlanRight: '选择方案后将显示期限和价格', personalPlanLeft1: '选择完成后', personalPlanLeft2: '请点击', personalPlanLeft3: '「更新」', feedbackAboveButton: '每份新表单对应一条留言和一条回复。请查看「新留言」按钮', updatesWord1: '项目', updatesWord2: '组件', updatesWord3: '软件', updatesWord4: '版本', remindersRight1: '提醒服务', remindersRight2: '重要事项日历', remindersLeft1: '当前方案的日期', remindersLeft2: '可添加个人', remindersLeft3: '提醒日期' } },
  { code: 'it', flag: 'איטליה',  name: 'Italiano', welcome: 'Benvenuto',
    menu: ['Feedback','Aggiornamenti','Messaggi','Promemoria','Servizi bancari','Pagina personale'],
    card: { title: 'Gestione del budget familiare', namePh: 'Nome / Cognome', emailPh: 'Email / Indirizzo email', passPh: 'Password', confirmPassPh: 'Conferma password', register: 'Registrati', login: 'Accedi', locked: 'Bloccato', registered: 'Registrato', update: 'Aggiorna', line1: 'Durante il periodo di lancio', line2: 'Gratis', errName: 'Inserisci il tuo nome', errEmail: 'Inserisci un indirizzo email valido', errPassLen: 'La password deve contenere almeno 6 caratteri', errPassMatch: 'Inserisci una conferma password corrispondente', errEmailExists: 'Email già registrata', cancel: 'Annulla', install: 'Installa', library: 'File guida', run: 'Avvia', videos: 'Video', guide: 'Guida', ok: 'OK', msgAlreadyInstalled: 'Già installato\nNessuna reinstallazione necessaria', msgDownloading: 'Download del file di installazione', msgInstallComplete: 'Salva ed esegui il file\nper completare l\'installazione', msgDownloadError: 'Errore di download\nRiprova', mFinance: 'M Finance', msgExists: 'Utente già registrato\ncon questi dati', msgUpdated: 'Dati aggiornati con successo', msgRegistered: 'Registrazione completata', existingCustomer: 'Cliente esistente', newCustomer: 'Nuovo cliente', notRecognized: 'Cliente non registrato. Clicca per registrarti', msgSelectPlan: 'Seleziona un piano nella tua pagina personale', infoServices: 'Servizi informativi', guidesAndVideos: 'Guide e Video', siteHeaderPrefix: 'Il sito web di', theWebsite: 'Il Sito', loginSubtitle: 'Accedi al tuo account', emailPhSimple: 'Email', passPhSimple: 'Password', connectingEllipsis: 'Accesso in corso...', noAccountQuestion: 'Non hai un account?', registerHereLink: 'Registrati qui', invalidCredentials: 'Email o password errati', registerErrorGeneric: 'Errore di registrazione' },
    profile: { fullName: 'Nome completo', email: 'Email', ip: 'IP', language: 'Lingua', country: 'Paese', plan: 'Piano', planStart: 'Inizio piano', planEnd: 'Fine piano', unlimited: 'Illimitato', comingSoon: 'Prossimamente', choosePlan: 'Scegli piano', close: '✕ Chiudi', loginRequired: 'Accesso richiesto', login: 'Accedi', products: 'Prodotti', change: 'Modifica',
      price: 'Prezzo', changePlan: 'Scegli piano', planName: 'Nome', planFrom: 'Da', planTo: 'A', back: 'Indietro', currencyLocal: '€', free: 'Gratuito',       planNames: { System_Free_Run: 'Lancio', User_Trial: 'Prova', User_VIP_Free: 'VIP', System_Owner: 'Sistema', User_Monthly: 'Mensile', User_Annual: 'Annuale', User_One_Time: 'Singolo', System_Suspended_NonPayment: 'Sospeso', User_Cancelled: 'Annullato' } },
    feedback: { customerRelations: 'Relazioni clienti', systemMessage: 'Messaggio di sistema', respectfully: 'Cordiali saluti,', rating: 'Valutazione', ratingWebsite: 'Sito web', ratingBudget: 'Gestione del budget familiare', userMessage: 'Messaggio utente', date: 'Data:', title: 'Titolo:', from: 'Da:', systemReply: 'Risposta di sistema' },
    system: { systemLabel: 'Sistema', selectAction: 'Seleziona azione dalla barra destra', users: 'Utenti', buildMessages: 'Registro di build', schedule: 'Tabelle e dati', pr: 'RP', announcements: 'Annunci', publishedDate: 'Pubblicato il:', reset: 'Reimposta', saved: 'Salvato', records: 'record', scheduleSubject: 'Oggetto', schedulePriceUSD: 'Prezzo\n[$]', schedulePeriod: 'Periodo\n[mesi]', scheduleNotes: 'Note', clear: 'Cancella', pause: 'Pausa', resume: 'Riprendi', active: '● Attivo', paused: 'In pausa', lines: 'righe', filter: 'Filtra', refresh: 'Aggiorna', loading: 'Caricamento...', loadingBuild: 'Caricamento dati di build...', error: 'Errore', noBuildData: 'Nessun dato. Eseguire Release_KeyClick.bat', networkError: 'Errore di rete', testsCreateFolderLegend: 'Crea cartella nella cartella download', testsNameLabel: 'Nome', testsCreateButton: 'Clicca per creare', testsFolderCreatedPrefix: 'Cartella creata:', scheduleTitle: 'Listino prezzi e programma', allFinancialInstitutions: 'Tutti gli istituti finanziari', newSystemMessageTitle: 'Nuovo messaggio di sistema', systemMessageLabel: 'Messaggio di sistema', broadcastPlaceholder: 'Contenuto del messaggio', sensitiveColEnv: 'Ambiente', sensitiveColFlag: 'Nome flag', sensitiveColPurpose: 'Scopo', sensitiveDevBypassEnv: 'Sito 3000 (sviluppo locale)', sensitiveDevBypassFlag: 'Bypass login', sensitiveDevBypassPurpose: '1=bypass 0=no bypass — solo sviluppatore', adminButton: 'Area di sistema', generalGroup: 'Generale', colName: 'Nome', colCurrency: 'Valuta', colCreated: 'Creato', colActive: 'Attivo', colAppInstalled: 'App', colLicenceType: 'Tipo di licenza', colSystemForce: 'Modalità sistema', distributionDay: 'Giorno di distribuzione X', messages: 'Messaggi', send: 'Invia', sent: 'Inviato!', reply: 'Rispondi', noMessages: 'Nessun messaggio', replySent: 'Risposta inviata!', ref: 'Rif.', msgNo: 'N°', replyToRef: 'Risposta a rif.', msgNumber: 'Messaggio N°', new: 'Nuovo', delete: 'Elimina', newMessage: '+ Nuovo messaggio', selectToView: 'Seleziona un messaggio', monitor: 'Monitor', systemData: 'Dati di sistema', resetTable: 'Reimposta tabella', debug: 'Debug', db: 'DB', sensitivePoints: 'Punti sensibili', productVersionTable: 'Tabella versioni (scheda aggiornamenti)', lab: 'Laboratorio', allCustomers: 'Tutti i clienti', newMessageNotif: 'Nuovo messaggio, clicca qui', colType: 'Tipo', labTests: 'Test', labBanking: 'Istituti finanziari', colCustomer: 'Cliente', adminNewMsg: '- Nuovo messaggio -', dataCollection: 'Raccolta dati', data: 'Live', statistics: 'Elaborazione', billing: 'Fatturazione', billLastPlan: 'Ultimo piano', billLastAmount: 'Ultimo importo', billLastDate: 'Ultima data di pagamento', billStatus: 'Stato', billPlan: 'Piano', billAmount: 'Importo', billDate: 'Data', billNoPayments: 'Nessun pagamento', colRunningNo: 'N°', colIp: 'Indirizzo IP', colEntered: 'Ora di ingresso', colExited: 'Ora di uscita', colDuration: 'Durata', durationMin: 'min', durationSec: 'sec', statTotalVisits: 'Visite totali', statUniqueVisitors: 'Visitatori unici', statOnlineNow: 'Online ora', statAvgDuration: 'Durata media', statLongestVisit: 'Visita più lunga', statBusiestHour: 'Ora di punta', statBusiestDay: 'Giorno di punta', statNamed: 'Identificati', statAnonymous: 'Anonimi', statHourlyTitle: 'Attività per ora', statDayTitle: 'Attività per giorno', statNoData: 'Dati non ancora sufficienti', statPeriod: 'Periodo misurato', statTotalVisitsDesc: 'Numero totale di visite registrate (ogni caricamento di pagina conta)', statUniqueVisitorsDesc: 'Numero di indirizzi IP distinti che hanno visitato, contati una sola volta ciascuno', statOnlineNowDesc: 'Visitatori attualmente sul sito che non sono ancora usciti', statAvgDurationDesc: 'Durata media di navigazione dei visitatori già usciti', statHourlyTitleDesc: "Totale delle visite entrate in ciascuna ora del giorno, sommato sull'intero periodo", statDayTitleDesc: "Totale delle visite entrate in ciascun giorno della settimana, sommato sull'intero periodo", statNamedDesc: 'Visitatori il cui indirizzo IP corrisponde a un utente registrato', statAnonymousDesc: 'Visitatori senza corrispondenza con un utente registrato', statBusiestHourDesc: "L'ora con il maggior numero di ingressi", statBusiestDayDesc: 'Il giorno con il maggior numero di ingressi', statLongestVisitDesc: 'La durata di navigazione più lunga registrata in una singola visita', statLegend: 'Legenda', statYearlyTitle: 'Attività annuale', statByMonth: 'Per mese', statByWeek: 'Per settimana', statReturning: 'Ricorrenti', statLinked: 'Collegati', statCountryTitle: 'Visite per paese', statNoGeoData: 'Sconosciuto', statDurationTitle: 'Distribuzione del tempo di navigazione', statDur0_5: '0–5 min', statDur5_15: '5–15 min', statDur15_60: '15–60 min', statDur60_120: '60–120 min', statDurOver120: 'Oltre 2 ore', statWeekOf: 'Settimana del', statOngoingTitle: 'Elaborazione dati continua', statActivityTab: 'Attività', runStatusRunning: 'Attivo', runStatusStopped: 'Fermato', dataCollectionLegend: 'Raccolta dati', collectionStart: 'Inizio', collectionEnd: 'Fine', endToggleActive: 'Fino a qui', endToggleInactive: 'Senza fine', runToggleActive: 'Raccolta dati attiva', runToggleInactive: 'Raccolta dati non attiva', legendUnregistered: 'Non registrati', legendRegistered: 'Registrati', graphEntriesTitle: 'Numero di visitatori del sito', graphDurationTitle: 'Tempo di navigazione sul sito', providersTitle: 'Fornitori', providerStatusConfigured: '✓ Configurato', providerStatusPendingRegistration: '✗ In attesa di registrazione', providerNordigenDesc: 'Europa — oltre 2300 banche', providerPlaidDesc: 'USA — migliaia di banche', providerIlName: 'Israele (Salt Edge)', providerIlDesc: 'Israele — banche e carte di credito', providerGroqDesc: 'Rilevamento automatico del paese', colProvider: 'Fornitore', colRole: 'Ruolo', routeDescTokenNordigen: 'token di accesso da Nordigen', routeDescInstitutionsNordigen: 'elenco banche per paese', routeDescConnectNordigen: 'creazione requisition + collegamento bancario', routeDescCallbackNordigen: 'ricezione conferma + salvataggio nel DB', routeDescLinkTokenPlaid: 'creazione Link Token', routeDescExchangePlaid: 'scambio public_token dopo la connessione', routeDescSyncPlaid: 'sincronizzazione transazioni + saldi', routeDescConnectIl: 'connessione al fornitore israeliano', routeDescCallbackIl: 'callback + salvataggio nel DB', routeDescAccountsShared: 'conti dell\'utente', routeDescTransactionsShared: 'transazioni + sincronizzazione dal fornitore', routeDescDetectProvider: 'rilevamento automatico: paese → fornitore', routeDescStatusSystem: 'stato delle credenziali', routeDescDataSystem: 'dati del DB', providerLabelIsrael: 'Israele', providerLabelShared: 'Condiviso', providerLabelSystem: 'Sistema', accountsBalancesTitle: 'Conti e saldi', colFinancialInstitution: 'Istituto finanziario', colAccount: 'Conto', colBalance: 'Saldo', noAccountsConnectedExample: 'Nessun conto collegato — viene mostrato un esempio', connectionsLabel: 'Connessioni', accountsLabel: 'Conti', transactionsLabel: 'Transazioni', noRecordsFound: 'Nessun record', editButton: 'Modifica', weightedScoreTitle: 'Punteggio ponderato', colPercent: 'Percentuale', colMetric: 'Indicatore', colExplanation: 'Spiegazione', totalWeightsLabel: 'Totale pesi:', weightedNumberLabel: 'Numero ponderato', weightedFormula: 'Punteggio ponderato (0–10) = Σ ( indicatore_i ∈ {0,1} × peso_i% ) × 10 / 100', scanningLabel: 'Scansione in corso...', scanUsersButton: 'Scansiona utenti e aggiorna il punteggio', mfMessagesLegend: 'Messaggi per M Finance', entranceGateMessagesLegend: 'Messaggi per il cancello d\'ingresso', entranceGateWord: 'Cancello d\'ingresso', connectionsManagementTitle: 'Gestione connessioni', connectBankAction: 'Collega banca', noConnections: 'Nessuna connessione', disconnectButton: 'Disconnetti', plaidNotYetSupported: 'Plaid — supportato in un passaggio futuro', israeliProviderNotConfigured: 'Fornitore israeliano — non ancora configurato', providerNotDetected: 'Fornitore non rilevato', noTransactions: 'Nessuna transazione' },
    currencyNames: { ILS: 'Shekel', USD: 'Dollaro', GBP: 'Sterlina', EUR: 'Euro', RUB: 'Rublo', JPY: 'Yen', SAR: 'Riyal', CNY: 'Yuan', INR: 'Rupia' },
    updates: { colDate: 'Data e ora', colProduct: 'Prodotto', colVersion: 'Versione', colTitle: 'Titolo', productKeyClick: 'KeyClick Sito web', productMFinance: 'M Finance Gestione budget' },
    reminders: { loginRequired: 'Accesso richiesto per i promemoria', titlePh: 'Titolo promemoria', timePh: 'Ora', add: '+ Aggiungi', noReminders: 'Nessun promemoria' },
    guides: { overview: 'Descrizione generale', userGuide: 'Guida utente', financeOverviewTitle: 'Panoramica di M Finance', financeOverviewDesc: 'Una breve panoramica della gestione del bilancio familiare — conti, transazioni, categorie e previsioni, e a chi è destinata.', financeGuideTitle: 'Utilizzo passo dopo passo', financeGuideDesc: "Una guida scritta con screenshot: installazione, collegamento dei conti, categorizzazione e report.", financeVideosTitle: 'Brevi tutorial', financeVideosDesc: 'Brevi video tutorial per ogni funzione principale della gestione del bilancio familiare.', siteOverviewTitle: 'Cosa offre il sito', siteOverviewDesc: 'Un breve tour della piattaforma KeyClick — prodotti, servizi e relazioni con i clienti.', siteGuideTitle: 'Registrazione e navigazione', siteGuideDesc: 'Come registrarsi, accedere e trovare ogni servizio sul sito.', siteVideosTitle: 'Demo del sito', siteVideosDesc: 'Brevi demo registrate delle principali funzionalità del sito.' },
    banking: { autoDetectFailed: 'Rilevamento automatico fallito — scegli manualmente', detectionError: 'Errore di rilevamento', loadBanksError: 'Errore nel caricamento delle banche', plaidTokenError: 'Errore token Plaid', bankConnected: 'Banca collegata', connectionError: 'Errore di connessione', linkOpened: 'È stata aperta una finestra di collegamento per {name}. Dopo aver approvato, torna e clicca su aggiorna.', linkCreateError: 'Errore nella creazione del collegamento bancario', refreshing: 'Aggiornamento...', updated: 'Aggiornato', fetchingData: 'Recupero dati...', noAccountsConnected: 'Nessun conto collegato', downloadedFiles: '{count} file scaricati', downloadError: 'Errore di download', connectBankTitle: 'Collega banca', autoDetect: 'Rilevamento automatico', orManually: 'o manualmente', unitedStates: 'Stati Uniti', back: 'Indietro', selectInstitution: 'Seleziona banca', noInstitutions: 'Nessuna banca', refresh: 'Aggiorna', downloadFiles: 'Scarica file', clickToDownload: 'Clicca per scaricare', decorWorldwide: 'In giro per il mondo', decorPrivateLine1: 'Connessione privata alla banca', decorPrivateLine2: 'Scollegato dalla gestione del budget domestico', instructionsTitle: 'Istruzioni', instructionsLine1: 'Segui la freccia rossa che indica il pulsante su cui fare clic.', instructionsLine2: 'Accedi al tuo istituto finanziario con i dati di sicurezza in uso presso quell\'istituto.', instructionsLine3: 'Completa l\'intero processo, al termine del quale ti disconnetterai dall\'istituto finanziario.', instructionsLine4: 'Segui i messaggi di sistema.', systemMessagesTitle: 'Messaggi di sistema', noMessagesYet: 'Nessun messaggio ancora', clickToConnect: 'Clicca per connetterti', readData: 'Leggi i dati', clickToDisconnect: 'Clicca per disconnetterti', clickToClose: 'Clicca per chiudere', waitingForSelection: 'In attesa di selezione', chooseDownloadType: 'Scegli il tipo di download dei dati', downloadFilesToComputer: 'Scarica i file sul computer', loadDataBtn: 'Carica i dati', connectingToInstitution: 'Connessione a {name} in corso...', connectedStatus: 'Connesso', connectDoneMsg: 'Connessione a {name} effettuata', disconnectingFromInstitution: 'Disconnessione da {name} in corso...', disconnectDoneMsg: 'Disconnessione effettuata', readingDataMsg: 'Lettura dei dati dall\'istituto finanziario in corso...', readingDataDoneMsg: 'Lettura dei dati completata', loadingDataMsg: 'Caricamento dei dati in corso...', accountStatementMsg: 'Estratto conto {id} per il periodo {period}', creditStatementMsg: 'Estratto carta di credito {id} per il periodo {period}', dataLoadedDoneMsg: 'Dati caricati con successo', doneStatus: 'Fatto', loadDataErrorMsg: 'Errore nel caricamento dei dati', downloadingFilesMsg: 'Download dei file sul computer in corso...', fileDownloadedForPeriodMsg: '{file} scaricato - per il periodo {period}', downloadFilesErrorMsg: 'Errore nel download dei file', closingWindowMsg: 'Chiusura della finestra del sito in corso...', selectedDownloadFilesMsg: 'Selezionato: scarica i file sul computer', selectedLoadDataMsg: 'Selezionato: carica i dati', totalFilesMsg: 'Totale: {count} file', introTitlePrefix: 'Ciao, benvenuto nei servizi bancari di', card1Title: 'Il servizio include', card1Item1: 'Connessione a un istituto finanziario presso cui hai un conto', card1Item2: 'Download dei file degli estratti conto', card1Item3: 'Caricamento diretto nella gestione del budget familiare', card1Item4: 'Un esperienza in un ambiente tecnologico avanzato', card2Title: 'Punti chiave', card2Item1: 'La connessione serve solo per scaricare i file, nessun altra azione', card2Item2: 'La connessione avviene secondo le impostazioni di sicurezza dell istituto finanziario selezionato', card2Item3: 'Gli estratti conto rimangono solo nell ambiente attuale - nessuna connessione a cloud o archivi esterni', card2Item4: 'Questo servizio puo essere avviato da qui, e anche direttamente dalla gestione del budget familiare', card3Title: 'Fasi del processo', card3Item1: 'Clicca su "Seleziona istituto finanziario"', card3Item2: 'Nella pagina degli istituti, seleziona un istituto', card3Item3: 'Segui la freccia rossa, clicca dove indica', card3Item4: 'Completa il processo fino alla disconnessione completa', introSuccess: 'Buona fortuna', }, captions: { guidesRight1: 'Un armadio a cassetti', guidesRight2: 'con guide e video', guidesLeft: 'Cassetti del tesoro...', guidesDrawersLine1: 'Cassetti 1–6', guidesDrawersLine2: 'anche da qui…', registerRight1: 'Una registrazione rapida', registerRight2: 'verso tante sorprese...', personalDefaultRight: 'Dati personali di base, dal sistema', personalDefaultLeft: 'Piano attivo. Possibilità di cambiare piano', personalPlanRight: 'Selezionando il piano verranno mostrati il periodo e il prezzo', personalPlanLeft1: 'Fare clic su', personalPlanLeft2: '«Aggiorna»', personalPlanLeft3: 'al termine della scelta', feedbackAboveButton: 'Ogni nuovo modulo è per un messaggio e una risposta. Vedi il pulsante «Nuovo messaggio»', updatesWord1: 'Versioni', updatesWord2: 'software', updatesWord3: 'dei componenti', updatesWord4: 'del progetto', remindersRight1: 'Servizio promemoria', remindersRight2: 'Calendario degli eventi importanti', remindersLeft1: 'Date del piano attivo', remindersLeft2: 'Possibilità di aggiungere date', remindersLeft3: 'di promemoria privati' } },
  { code: 'hi', flag: 'הודו',    name: 'हिंदी',     welcome: 'स्वागत है',
    menu: ['फीडबैक','अपडेट','संदेश','अनुस्मारक','बैंकिंग सेवाएं','व्यक्तिगत पृष्ठ'],
    card: { title: 'घरेलू बजट प्रबंधन', namePh: 'नाम / उपनाम', emailPh: 'ईमेल / ईमेल पता', passPh: 'पासवर्ड', confirmPassPh: 'पासवर्ड की पुष्टि करें', register: 'पंजीकरण', login: 'लॉग इन', locked: 'लॉक', registered: 'पंजीकृत', update: 'अपडेट', line1: 'लॉन्च अवधि के दौरान', line2: 'मुफ्त', errName: 'कृपया अपना नाम दर्ज करें', errEmail: 'कृपया एक मान्य ईमेल दर्ज करें', errPassLen: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए', errPassMatch: 'कृपया मेल खाता पासवर्ड पुष्टिकरण दर्ज करें', errEmailExists: 'ईमेल पहले से पंजीकृत है', cancel: 'रद्द करें', install: 'इंस्टॉल करें', library: 'गाइड फ़ाइलें', run: 'चलाएं', videos: 'वीडियो', guide: 'मार्गदर्शिका', ok: 'ठीक है', msgAlreadyInstalled: 'पहले से इंस्टॉल है\nपुनः इंस्टॉल की आवश्यकता नहीं', msgDownloading: 'इंस्टॉलेशन फ़ाइल डाउनलोड हो रही है', msgInstallComplete: 'फ़ाइल सहेजें और चलाएं\nइंस्टॉलेशन पूरा करने के लिए', msgDownloadError: 'डाउनलोड त्रुटि\nपुनः प्रयास करें', mFinance: 'M Finance', msgExists: 'यह उपयोगकर्ता पहले से पंजीकृत है\nइन विवरणों के साथ', msgUpdated: 'विवरण सफलतापूर्वक अपडेट किए गए', msgRegistered: 'पंजीकरण पूरा हो गया', existingCustomer: 'मौजूदा ग्राहक', newCustomer: 'नया ग्राहक', notRecognized: 'ग्राहक पंजीकृत नहीं है। पंजीकरण के लिए क्लिक करें', msgSelectPlan: 'कृपया अपने व्यक्तिगत पृष्ठ पर एक योजना चुनें', infoServices: 'सूचना सेवाएं', guidesAndVideos: 'गाइड और वीडियो', siteHeaderPrefix: 'आधिकारिक वेबसाइट:', theWebsite: 'वेबसाइट', loginSubtitle: 'अपने खाते में लॉग इन करें', emailPhSimple: 'ईमेल', passPhSimple: 'पासवर्ड', connectingEllipsis: 'लॉग इन हो रहा है...', noAccountQuestion: 'खाता नहीं है?', registerHereLink: 'यहाँ पंजीकरण करें', invalidCredentials: 'ईमेल या पासवर्ड गलत है', registerErrorGeneric: 'पंजीकरण में त्रुटि' },
    profile: { fullName: 'पूरा नाम', email: 'ईमेल', ip: 'IP', language: 'भाषा', country: 'देश', plan: 'योजना', planStart: 'योजना शुरू', planEnd: 'योजना समाप्त', unlimited: 'असीमित', comingSoon: 'जल्द आ रहा है', choosePlan: 'योजना चुनें', close: '✕ बंद करें', loginRequired: 'लॉगिन आवश्यक है', login: 'लॉग इन', products: 'उत्पाद', change: 'बदलें',
      price: 'मूल्य', changePlan: 'योजना चुनें', planName: 'नाम', planFrom: 'से', planTo: 'तक', back: 'वापस', currencyLocal: '₹', free: 'मुफ्त',       planNames: { System_Free_Run: 'परीक्षण रन', User_Trial: 'परीक्षण', User_VIP_Free: 'VIP', System_Owner: 'सिस्टम', User_Monthly: 'मासिक', User_Annual: 'वार्षिक', User_One_Time: 'एकल', System_Suspended_NonPayment: 'निलंबित', User_Cancelled: 'रद्द' } },
    feedback: { customerRelations: 'ग्राहक सेवा', systemMessage: 'सिस्टम संदेश', respectfully: 'सादर,', rating: 'रेटिंग', ratingWebsite: 'वेबसाइट', ratingBudget: 'गृह बजट प्रबंधन', userMessage: 'उपयोगकर्ता संदेश', date: 'तारीख:', title: 'शीर्षक:', from: 'से:', systemReply: 'सिस्टम उत्तर' },
    system: { systemLabel: 'सिस्टम', selectAction: 'दाहिनी बार से क्रिया चुनें', users: 'उपयोगकर्ता', buildMessages: 'बिल्ड लॉग', schedule: 'तालिकाएं और डेटा', pr: 'जनसंपर्क', announcements: 'घोषणाएं', publishedDate: 'प्रकाशन तिथि:', reset: 'रीसेट', saved: 'सहेजा', records: 'रिकॉर्ड', scheduleSubject: 'विषय', schedulePriceUSD: 'मूल्य\n[$]', schedulePeriod: 'अवधि\n[माह]', scheduleNotes: 'नोट्स', clear: 'साफ़ करें', pause: 'रोकें', resume: 'जारी रखें', active: '● सक्रिय', paused: 'रुका हुआ', lines: 'पंक्तियाँ', filter: 'फ़िल्टर', refresh: 'ताज़ा करें', loading: 'लोड हो रहा है...', loadingBuild: 'बिल्ड डेटा लोड हो रहा है...', error: 'त्रुटि', noBuildData: 'कोई डेटा नहीं। Release_KeyClick.bat चलाएं', networkError: 'नेटवर्क त्रुटि', testsCreateFolderLegend: 'डाउनलोड फ़ोल्डर में फ़ोल्डर बनाएं', testsNameLabel: 'नाम', testsCreateButton: 'बनाने के लिए क्लिक करें', testsFolderCreatedPrefix: 'फ़ोल्डर बनाया गया:', scheduleTitle: 'मूल्य सूची और अनुसूची', allFinancialInstitutions: 'सभी वित्तीय संस्थाएं', newSystemMessageTitle: 'नया सिस्टम संदेश', systemMessageLabel: 'सिस्टम संदेश', broadcastPlaceholder: 'संदेश सामग्री', sensitiveColEnv: 'वातावरण', sensitiveColFlag: 'फ्लैग नाम', sensitiveColPurpose: 'उद्देश्य', sensitiveDevBypassEnv: 'साइट 3000 (स्थानीय डेव)', sensitiveDevBypassFlag: 'लॉगिन बाइपास', sensitiveDevBypassPurpose: '1=बाइपास 0=नो बाइपास — केवल डेवलपर', adminButton: 'सिस्टम उपयोग', generalGroup: 'सामान्य', colName: 'नाम', colCurrency: 'मुद्रा', colCreated: 'निर्माण तिथि', colActive: 'सक्रिय', colAppInstalled: 'ऐप', colLicenceType: 'लाइसेंस प्रकार', colSystemForce: 'सिस्टम मोड', distributionDay: 'वितरण दिवस X', messages: 'संदेश', send: 'भेजें', sent: 'भेजा!', reply: 'उत्तर', noMessages: 'कोई संदेश नहीं', replySent: 'उत्तर भेजा!', ref: 'संदर्भ', msgNo: 'क्र.', replyToRef: 'संदर्भ का उत्तर', msgNumber: 'संदेश क्र.', new: 'नया', delete: 'हटाएं', newMessage: '+ नया संदेश', selectToView: 'देखने के लिए संदेश चुनें', monitor: 'मॉनिटर', systemData: 'सिस्टम डेटा', resetTable: 'टेबल रीसेट', debug: 'डीबग', db: 'DB', sensitivePoints: 'संवेदनशील बिंदु', productVersionTable: 'अपडेट टैब में संस्करण तालिका', lab: 'लैब', allCustomers: 'सभी ग्राहक', newMessageNotif: 'नया संदेश, यहां क्लिक करें', colType: 'प्रकार', labTests: 'परीक्षण', labBanking: 'वित्तीय संस्थान', colCustomer: 'ग्राहक', adminNewMsg: '- नया संदेश -', dataCollection: 'डेटा संग्रह', data: 'लाइव', statistics: 'प्रसंस्करण', billing: 'बिलिंग', billLastPlan: 'अंतिम योजना', billLastAmount: 'अंतिम राशि', billLastDate: 'अंतिम भुगतान तिथि', billStatus: 'स्थिति', billPlan: 'योजना', billAmount: 'राशि', billDate: 'तिथि', billNoPayments: 'कोई भुगतान नहीं', colRunningNo: 'क्र.', colIp: 'IP पता', colEntered: 'प्रवेश समय', colExited: 'निकास समय', colDuration: 'अवधि', durationMin: 'मिनट', durationSec: 'सेकंड', statTotalVisits: 'कुल विज़िट', statUniqueVisitors: 'अद्वितीय आगंतुक', statOnlineNow: 'अभी ऑनलाइन', statAvgDuration: 'औसत अवधि', statLongestVisit: 'सबसे लंबी विज़िट', statBusiestHour: 'सबसे व्यस्त घंटा', statBusiestDay: 'सबसे व्यस्त दिन', statNamed: 'पहचाने गए', statAnonymous: 'अज्ञात', statHourlyTitle: 'घंटे के अनुसार गतिविधि', statDayTitle: 'दिन के अनुसार गतिविधि', statNoData: 'अभी पर्याप्त डेटा नहीं है', statPeriod: 'मापी गई अवधि', statTotalVisitsDesc: 'दर्ज की गई कुल विज़िट की संख्या (हर पेज लोड गिना जाता है)', statUniqueVisitorsDesc: 'विज़िट करने वाले अलग-अलग IP पतों की संख्या, प्रत्येक को एक बार गिना गया', statOnlineNowDesc: 'वे आगंतुक जो अभी साइट पर हैं और अभी तक बाहर नहीं गए हैं', statAvgDurationDesc: 'उन आगंतुकों की औसत ब्राउज़िंग अवधि जो पहले ही बाहर जा चुके हैं', statHourlyTitleDesc: 'पूरी अवधि में, दिन के हर घंटे में प्रवेश करने वाली विज़िट की कुल संख्या', statDayTitleDesc: 'पूरी अवधि में, सप्ताह के हर दिन प्रवेश करने वाली विज़िट की कुल संख्या', statNamedDesc: 'वे आगंतुक जिनका IP पता किसी पंजीकृत उपयोगकर्ता से मेल खाता है', statAnonymousDesc: 'वे आगंतुक जिनका किसी पंजीकृत उपयोगकर्ता से मेल नहीं मिला', statBusiestHourDesc: 'सबसे अधिक प्रवेश वाला घंटा', statBusiestDayDesc: 'सबसे अधिक प्रवेश वाला दिन', statLongestVisitDesc: 'एक ही विज़िट में दर्ज की गई सबसे लंबी ब्राउज़िंग अवधि', statLegend: 'लीजेंड', statYearlyTitle: 'वार्षिक गतिविधि', statByMonth: 'महीने के अनुसार', statByWeek: 'सप्ताह के अनुसार', statReturning: 'वापस आने वाले', statLinked: 'जुड़े हुए', statCountryTitle: 'देश के अनुसार विज़िट', statNoGeoData: 'अज्ञात', statDurationTitle: 'ब्राउज़िंग समय वितरण', statDur0_5: '0–5 मिनट', statDur5_15: '5–15 मिनट', statDur15_60: '15–60 मिनट', statDur60_120: '60–120 मिनट', statDurOver120: '2 घंटे से अधिक', statWeekOf: 'सप्ताह', statOngoingTitle: 'सतत डेटा प्रसंस्करण', statActivityTab: 'गतिविधि', runStatusRunning: 'सक्रिय', runStatusStopped: 'रुका हुआ', dataCollectionLegend: 'डेटा संग्रह', collectionStart: 'शुरुआत', collectionEnd: 'अंत', endToggleActive: 'यहाँ तक', endToggleInactive: 'कोई अंत नहीं', runToggleActive: 'डेटा संग्रह सक्रिय', runToggleInactive: 'डेटा संग्रह निष्क्रिय', legendUnregistered: 'अपंजीकृत', legendRegistered: 'पंजीकृत', graphEntriesTitle: 'साइट आगंतुकों की संख्या', graphDurationTitle: 'साइट ब्राउज़िंग समय', providersTitle: 'प्रदाता', providerStatusConfigured: '✓ कॉन्फ़िगर किया गया', providerStatusPendingRegistration: '✗ पंजीकरण लंबित', providerNordigenDesc: 'यूरोप — 2300+ बैंक', providerPlaidDesc: 'अमेरिका — हजारों बैंक', providerIlName: 'इज़राइल (Salt Edge)', providerIlDesc: 'इज़राइल — बैंक और क्रेडिट कार्ड', providerGroqDesc: 'स्वचालित देश पहचान', colProvider: 'प्रदाता', colRole: 'भूमिका', routeDescTokenNordigen: 'Nordigen से एक्सेस टोकन', routeDescInstitutionsNordigen: 'देश के अनुसार बैंकों की सूची', routeDescConnectNordigen: 'requisition बनाना + बैंक लिंक', routeDescCallbackNordigen: 'पुष्टि प्राप्त करना + DB में सहेजना', routeDescLinkTokenPlaid: 'Link Token बनाना', routeDescExchangePlaid: 'कनेक्ट होने के बाद public_token का आदान-प्रदान', routeDescSyncPlaid: 'लेनदेन और शेष राशि सिंक करना', routeDescConnectIl: 'इज़राइली प्रदाता से कनेक्ट करना', routeDescCallbackIl: 'कॉलबैक + DB में सहेजना', routeDescAccountsShared: 'उपयोगकर्ता के खाते', routeDescTransactionsShared: 'लेनदेन + प्रदाता से सिंक', routeDescDetectProvider: 'स्वचालित पहचान: देश → प्रदाता', routeDescStatusSystem: 'क्रेडेंशियल स्थिति', routeDescDataSystem: 'DB डेटा', providerLabelIsrael: 'इज़राइल', providerLabelShared: 'साझा', providerLabelSystem: 'सिस्टम', accountsBalancesTitle: 'खाते और शेष राशि', colFinancialInstitution: 'वित्तीय संस्थान', colAccount: 'खाता', colBalance: 'शेष राशि', noAccountsConnectedExample: 'कोई खाता कनेक्ट नहीं है — उदाहरण दिखाया जा रहा है', connectionsLabel: 'कनेक्शन', accountsLabel: 'खाते', transactionsLabel: 'लेनदेन', noRecordsFound: 'कोई रिकॉर्ड नहीं', editButton: 'संपादित करें', weightedScoreTitle: 'भारित स्कोर', colPercent: 'प्रतिशत', colMetric: 'मापदंड', colExplanation: 'स्पष्टीकरण', totalWeightsLabel: 'कुल भार:', weightedNumberLabel: 'भारित संख्या', weightedFormula: 'भारित स्कोर (0–10) = Σ ( मापदंड_i ∈ {0,1} × भार_i% ) × 10 / 100', scanningLabel: 'स्कैन हो रहा है...', scanUsersButton: 'उपयोगकर्ताओं को स्कैन करें और स्कोर अपडेट करें', mfMessagesLegend: 'M Finance के लिए संदेश', entranceGateMessagesLegend: 'प्रवेश द्वार के लिए संदेश', entranceGateWord: 'प्रवेश द्वार', connectionsManagementTitle: 'कनेक्शन प्रबंधन', connectBankAction: 'बैंक कनेक्ट करें', noConnections: 'कोई कनेक्शन नहीं', disconnectButton: 'डिस्कनेक्ट करें', plaidNotYetSupported: 'Plaid — भविष्य के चरण में समर्थित होगा', israeliProviderNotConfigured: 'इज़राइली प्रदाता — अभी तक कॉन्फ़िगर नहीं किया गया', providerNotDetected: 'प्रदाता का पता नहीं चला', noTransactions: 'कोई लेनदेन नहीं' },
    currencyNames: { ILS: 'शेकेल', USD: 'डॉलर', GBP: 'पाउंड', EUR: 'यूरो', RUB: 'रूबल', JPY: 'येन', SAR: 'रियाल', CNY: 'युआन', INR: 'रुपया' },
    updates: { colDate: 'दिनांक और समय', colProduct: 'उत्पाद', colVersion: 'संस्करण', colTitle: 'शीर्षक', productKeyClick: 'KeyClick वेबसाइट', productMFinance: 'M Finance घरेलू बजट' },
    reminders: { loginRequired: 'अनुस्मारक देखने के लिए लॉगिन आवश्यक है', titlePh: 'अनुस्मारक शीर्षक', timePh: 'समय', add: '+ जोड़ें', noReminders: 'कोई अनुस्मारक नहीं' },
    guides: { overview: 'सामान्य विवरण', userGuide: 'उपयोगकर्ता गाइड', financeOverviewTitle: 'M Finance क्या है', financeOverviewDesc: 'घरेलू बजट प्रबंधन का संक्षिप्त विवरण — खाते, लेन-देन, श्रेणियां और पूर्वानुमान, और यह किसके लिए है।', financeGuideTitle: 'चरण-दर-चरण उपयोग', financeGuideDesc: 'स्क्रीनशॉट के साथ लिखित गाइड: इंस्टॉलेशन, खाते जोड़ना, वर्गीकरण और रिपोर्ट।', financeVideosTitle: 'संक्षिप्त ट्यूटोरियल', financeVideosDesc: 'घरेलू बजट प्रबंधन की हर मुख्य विशेषता के लिए संक्षिप्त वीडियो ट्यूटोरियल।', siteOverviewTitle: 'वेबसाइट क्या प्रदान करती है', siteOverviewDesc: 'KeyClick प्लेटफ़ॉर्म का संक्षिप्त भ्रमण — उत्पाद, सेवाएं और ग्राहक संबंध।', siteGuideTitle: 'पंजीकरण और नेविगेशन', siteGuideDesc: 'कैसे पंजीकरण करें, लॉगिन करें और वेबसाइट पर हर सेवा खोजें।', siteVideosTitle: 'वेबसाइट डेमो', siteVideosDesc: 'वेबसाइट की मुख्य विशेषताओं के संक्षिप्त रिकॉर्ड किए गए डेमो।' },
    banking: { autoDetectFailed: 'स्वचालित पहचान विफल — मैन्युअल रूप से चुनें', detectionError: 'पहचान त्रुटि', loadBanksError: 'बैंक लोड करने में त्रुटि', plaidTokenError: 'Plaid टोकन त्रुटि', bankConnected: 'बैंक सफलतापूर्वक जुड़ा', connectionError: 'कनेक्शन त्रुटि', linkOpened: '{name} के लिए कनेक्शन विंडो खुली। स्वीकृति के बाद वापस आकर रिफ्रेश पर क्लिक करें।', linkCreateError: 'बैंक लिंक बनाने में त्रुटि', refreshing: 'रीफ्रेश हो रहा है...', updated: 'अपडेट हो गया', fetchingData: 'डेटा प्राप्त हो रहा है...', noAccountsConnected: 'कोई खाता कनेक्ट नहीं है', downloadedFiles: '{count} फ़ाइलें डाउनलोड हुईं', downloadError: 'डाउनलोड त्रुटि', connectBankTitle: 'बैंक कनेक्ट करें', autoDetect: 'स्वचालित पहचान', orManually: 'या मैन्युअल रूप से', unitedStates: 'संयुक्त राज्य अमेरिका', back: 'वापस', selectInstitution: 'बैंक चुनें', noInstitutions: 'कोई बैंक नहीं', refresh: 'रीफ्रेश', downloadFiles: 'फ़ाइलें डाउनलोड करें', clickToDownload: 'डाउनलोड करने के लिए क्लिक करें', decorWorldwide: 'दुनिया भर में', decorPrivateLine1: 'बैंक से निजी कनेक्शन', decorPrivateLine2: 'घरेलू बजट प्रबंधन से डिस्कनेक्ट', instructionsTitle: 'निर्देश', instructionsLine1: 'कृपया उस लाल तीर का अनुसरण करें जो क्लिक करने वाले बटन की ओर इशारा करता है।', instructionsLine2: 'उस वित्तीय संस्थान में प्रचलित सुरक्षा जानकारी का उपयोग करके अपने वित्तीय संस्थान में लॉग इन करें।', instructionsLine3: 'कृपया पूरी प्रक्रिया पूरी करें, जिसके अंत में आप वित्तीय संस्थान से डिस्कनेक्ट हो जाएंगे।', instructionsLine4: 'कृपया सिस्टम संदेशों का पालन करें।', systemMessagesTitle: 'सिस्टम संदेश', noMessagesYet: 'अभी तक कोई संदेश नहीं', clickToConnect: 'कनेक्ट करने के लिए क्लिक करें', readData: 'डेटा पढ़ें', clickToDisconnect: 'डिस्कनेक्ट करने के लिए क्लिक करें', clickToClose: 'बंद करने के लिए क्लिक करें', waitingForSelection: 'चयन की प्रतीक्षा में', chooseDownloadType: 'डेटा डाउनलोड का प्रकार चुनें', downloadFilesToComputer: 'फ़ाइलें कंप्यूटर पर डाउनलोड करें', loadDataBtn: 'डेटा लोड करें', connectingToInstitution: '{name} से कनेक्ट हो रहा है...', connectedStatus: 'कनेक्ट हो गया', connectDoneMsg: '{name} से कनेक्शन हो गया', disconnectingFromInstitution: '{name} से डिस्कनेक्ट हो रहा है...', disconnectDoneMsg: 'डिस्कनेक्ट हो गया', readingDataMsg: 'वित्तीय संस्थान से डेटा पढ़ा जा रहा है...', readingDataDoneMsg: 'डेटा पढ़ना पूर्ण हुआ', loadingDataMsg: 'डेटा लोड हो रहा है...', accountStatementMsg: 'खाता विवरण {id}, अवधि {period}', creditStatementMsg: 'क्रेडिट कार्ड विवरण {id}, अवधि {period}', dataLoadedDoneMsg: 'डेटा सफलतापूर्वक लोड हुआ', doneStatus: 'पूर्ण हुआ', loadDataErrorMsg: 'डेटा लोड करने में त्रुटि', downloadingFilesMsg: 'फ़ाइलें कंप्यूटर पर डाउनलोड हो रही हैं...', fileDownloadedForPeriodMsg: '{file} डाउनलोड हुआ - अवधि {period}', downloadFilesErrorMsg: 'फ़ाइलें डाउनलोड करने में त्रुटि', closingWindowMsg: 'वेबसाइट विंडो बंद हो रही है...', selectedDownloadFilesMsg: 'चयनित: फ़ाइलें कंप्यूटर पर डाउनलोड करें', selectedLoadDataMsg: 'चयनित: डेटा लोड करें', totalFilesMsg: 'कुल: {count} फ़ाइलें', introTitlePrefix: 'नमस्ते, बैंकिंग सेवाओं में आपका स्वागत है', card1Title: 'सेवा में शामिल है', card1Item1: 'उस वित्तीय संस्थान से जुड़ना जहाँ आपका खाता है', card1Item2: 'खाता विवरण फ़ाइलें डाउनलोड करना', card1Item3: 'होम बजट प्रबंधन में सीधा लोड करना', card1Item4: 'एक उन्नत तकनीकी वातावरण में अनुभव', card2Title: 'मुख्य बिंदु', card2Item1: 'कनेक्शन केवल फ़ाइलें डाउनलोड करने के लिए है, कोई अन्य कार्रवाई नहीं', card2Item2: 'कनेक्शन चयनित वित्तीय संस्थान की सुरक्षा सेटिंग्स के अनुसार होता है', card2Item3: 'खाता विवरण केवल वर्तमान वातावरण में रहते हैं - किसी क्लाउड या बाहरी संग्रहण से कोई संबंध नहीं', card2Item4: 'यह सेवा यहाँ से, और सीधे होम बजट प्रबंधन से भी सक्रिय की जा सकती है', card3Title: 'प्रक्रिया के चरण', card3Item1: '"वित्तीय संस्थान चुनें" पर क्लिक करें', card3Item2: 'संस्थान पृष्ठ पर, एक संस्थान चुनें', card3Item3: 'लाल तीर का अनुसरण करें, जहाँ वह इंगित करे वहाँ क्लिक करें', card3Item4: 'पूर्ण डिस्कनेक्शन बंद होने तक प्रक्रिया पूरी करें', introSuccess: 'शुभकामनाएँ', }, captions: { guidesRight1: 'गाइड और वीडियो वाली', guidesRight2: 'दराजों की अलमारी', guidesLeft: 'खज़ाने की दराजें...', guidesDrawersLine1: 'दराज़ 1-6', guidesDrawersLine2: 'यहाँ से भी…', registerRight1: 'एक संक्षिप्त पंजीकरण', registerRight2: 'कई आश्चर्यों की ओर...', personalDefaultRight: 'सिस्टम से बुनियादी व्यक्तिगत विवरण', personalDefaultLeft: 'सक्रिय योजना। योजना बदलने का विकल्प', personalPlanRight: 'योजना चुनने पर अवधि और मूल्य दिखाई देगा', personalPlanLeft1: 'चयन पूरा होने पर', personalPlanLeft2: "'अपडेट' पर", personalPlanLeft3: 'क्लिक करें', feedbackAboveButton: "हर नया फॉर्म एक संदेश और एक उत्तर के लिए है। 'नया संदेश' बटन देखें", updatesWord1: 'परियोजना के', updatesWord2: 'घटकों के', updatesWord3: 'सॉफ़्टवेयर', updatesWord4: 'संस्करण', remindersRight1: 'रिमाइंडर सेवा', remindersRight2: 'महत्वपूर्ण घटनाओं की डायरी', remindersLeft1: 'सक्रिय योजना की तिथियां', remindersLeft2: 'निजी रिमाइंडर तिथियां', remindersLeft3: 'जोड़ने का विकल्प' } },
]

const GRANITE_BG: React.CSSProperties = {
  backgroundColor: '#e3e3e6',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0' result='grey'/%3E%3CfeComponentTransfer in='grey'%3E%3CfeFuncR type='linear' slope='2.5' intercept='-0.95'/%3E%3CfeFuncG type='linear' slope='2.7' intercept='-0.9'/%3E%3CfeFuncB type='linear' slope='3.4' intercept='-0.78'/%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")",
  backgroundSize: '180px 180px',
}

type UserRecord = { id: number; name: string; last_name?: string; email: string; language: string; M_Finance_license_type: string; is_active: boolean; is_M_Finance_installed: boolean; last_ip?: string; ip_registration?: string; UUID_Local_BIOS?: string; country?: string; created_at?: string; plan_start?: string; plan_end?: string; system_force?: string | null; currency?: string | null; notes?: string | null; weighted_score?: number | null }

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
  const [bankingDirect, setBankingDirect] = useState(false)
  const [pendingBankSession, setPendingBankSession] = useState<string | null>(null)
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
  const visitIdRef     = useRef<number | null>(null)
  const [Current_User_Pointer_to_DB, set_Current_User_Pointer_to_DB] = useState<UserRecord | null>(null)
  const [isLoggedInExplicit, setIsLoggedInExplicit] = useState(false)
  const [clientIp, setClientIp] = useState('')
  const [hasUnreadMsg, setHasUnreadMsg] = useState(false)
  const [hasNewCustomerMsg, setHasNewCustomerMsg] = useState(false)
  const lang = languages[langIdx]
  const isAdminAccount = Current_User_Pointer_to_DB?.M_Finance_license_type === LICENSE_TYPES.System_Owner

  const sidebarOuterRef   = useRef<HTMLElement>(null)
  const sidebarContentRef = useRef<HTMLDivElement>(null)
  const [sidebarScale, setSidebarScale] = useState(1)
  const [sidebarBoxHeight, setSidebarBoxHeight] = useState<number | undefined>(undefined)
  const [sidebarAvailable, setSidebarAvailable] = useState<number | undefined>(undefined)
  const MIN_SIDEBAR_SCALE = 0.55

  useLayoutEffect(() => {
    const outer = sidebarOuterRef.current
    const content = sidebarContentRef.current
    if (!outer || !content) return
    const recompute = () => {
      const available = outer.clientHeight
      setSidebarAvailable(available)
      const natural = content.offsetHeight
      if (!available || !natural) return
      const nextScale = Math.max(MIN_SIDEBAR_SCALE, Math.min(1, available / natural))
      setSidebarScale(nextScale)
      setSidebarBoxHeight(natural * nextScale)
    }
    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(outer)
    window.addEventListener('resize', recompute)
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute) }
  }, [lang, activePage, isLoggedInExplicit, hasNewCustomerMsg])

  useEffect(() => {
    const onPageHide = () => {
      if (visitIdRef.current) {
        navigator.sendBeacon('/api/visits/heartbeat', JSON.stringify({ id: visitIdRef.current }))
      }
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])

  useEffect(() => {
    if (!Current_User_Pointer_to_DB?.id) { setHasUnreadMsg(false); return }
    const checkUnread = () => {
      fetch(`/api/feedback/unread?userId=${Current_User_Pointer_to_DB.id}`)
        .then(r => r.json())
        .then(d => { if (d.hasUnread) setHasUnreadMsg(true) })
        .catch(() => {})
    }
    checkUnread()
    const interval = setInterval(checkUnread, 300000)
    return () => clearInterval(interval)
  }, [Current_User_Pointer_to_DB?.id, activePage])

  useEffect(() => {
    if (!isAdminAccount) { setHasNewCustomerMsg(false); return }
    const checkAdminUnread = () => {
      fetch('/api/feedback/admin-unread')
        .then(r => r.json())
        .then(d => { if (d.hasUnread) setHasNewCustomerMsg(true) })
        .catch(() => {})
    }
    checkAdminUnread()
    const interval = setInterval(checkAdminUnread, 300000)
    return () => clearInterval(interval)
  }, [isAdminAccount, activePage])

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
    dbg('pageLoad', `isLoggedInExplicit=${isLoggedInExplicit} (should be false here, before any login)`)
    if (process.env.NODE_ENV === 'development') {
      dbg('devBypass', 'fetch GET /api/system/dev-bypass-login (dev env only)')
      fetch('/api/system/dev-bypass-login').then(r => r.json()).then(d => {
        dbg('devBypass', `enabled=${d.enabled}`)
        if (d.enabled) setIsLoggedInExplicit(true)
      }).catch(() => {})
    }
    dbg('flowDiagram', '1/10-לקוח נכנס לאתר, הקלט IP לסטטיסטיקה')
    fetch('/api/visits', { method: 'POST' })
      .then(r => r.json())
      .then(rd => { if (rd.ok) visitIdRef.current = rd.id })
      .catch(() => {})
    dbg('initEffect', 'fetch ipify for clientIp (needed for current-user lookup on loopback/dev)')
    fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(d => { const ip = d.ip || ''; if (ip) setClientIp(ip); dbg('initEffect', `ipify ok ip="${ip}"`); return ip })
      .catch(e => { dbg('initEffect', `ipify failed/timeout: ${String(e)}`); return '' })
      .then(ip => {
        dbg('initEffect', `fetch GET /api/current-user clientIp="${ip}"`)
        return fetch(`/api/current-user?clientIp=${encodeURIComponent(ip)}`)
      })
      .then(r => r.json())
      .then(data => {
        dbg('initEffect', `identified_by="${data.identified_by}" current_ip="${data.current_ip ?? 'unknown'}"`)
        dbg('initEffect', `Current_User=${data.user?.id ?? 0}  email="${data.user?.email ?? 'none'}"  IP="${data.user?.last_ip ?? data.current_ip ?? 'none'}"`)
        if (!data.user) return
        set_Current_User_Pointer_to_DB(data.user)
      })
      .catch(err => dbg('initEffect', `current-user failed err="${String(err)}"`))
    const params = new URLSearchParams(window.location.search)
    if (params.get('installed') === '1') {
      const uuidLocalBios = params.get('uuid') || ''
      dbg('flowDiagram', '14-בקשת UUID מקומי (מנגנון פסיבי) => 15-רישום UUID ברשומת לקוח')
      localStorage.setItem('mf_installed', '1')
      setPopupMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: lang.card.msgInstallComplete })
      window.history.replaceState({}, '', window.location.pathname)
      const pendingEmail = localStorage.getItem('mf_pending_install_email') || Current_User_Pointer_to_DB?.email || ''
      dbg('installCallback', `installed=1 detected uuid="${uuidLocalBios}" pendingEmail="${pendingEmail}" => mf_installed saved`)
      fetch('/api/set-mfinance-installed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingEmail, clientIp, uuidLocalBios }) })
        .then(r => r.json())
        .then(d => {
          dbg('installCallback', `DB updated ok=${d.ok}`)
          localStorage.removeItem('mf_pending_install_email')
          return fetch(`/api/current-user?clientIp=${encodeURIComponent(clientIp)}`).then(r2 => r2.json())
        })
        .then(d2 => { if (d2.user) set_Current_User_Pointer_to_DB(d2.user) })
        .catch(e => dbg('installCallback', `DB update failed: ${String(e)}`))
      handleRun()
    }
    const bankingParam = params.get('banking')
    if (bankingParam === 'success' || bankingParam === 'direct') {
      const bsessionParam = params.get('bsession')
      if (bsessionParam) setPendingBankSession(bsessionParam)
      window.history.replaceState({}, '', window.location.pathname)
      setActivePage('4')
      if (bankingParam === 'direct') setBankingDirect(true)
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
      type SimExportRecord = {
        record_id: string; source: number; is_credit_card: boolean; format_info: string
        institution_name: string; account_number: string; credit_card_number: string
        transaction_date: string; value_date: string; description: string
        debit_amount: number; credit_amount: number; balance: number; currency: string
        category: string; notes: string; num_of_months: number; category_tag: string
      }
      const n2 = (v: number) => v.toFixed(2)
      ;(async () => {
        try {
          const bank = await fetch('/simulation/keyclick-export-checking.json').then(r => r.json())
          dbg('════════ BANK ════════', '')
          ;(bank.records ?? []).forEach((r: SimExportRecord) =>
            dbg('BANK', `${r.transaction_date}   ${r.description}   ${n2(r.debit_amount)}   ${n2(r.credit_amount)}   ${n2(r.balance)}`))
        } catch (e) { dbg('BANK', `fetch failed err="${String(e)}"`) }
        try {
          const credit = await fetch('/simulation/keyclick-export-credit.json').then(r => r.json())
          dbg('════════ CREDIT ════════', '')
          ;(credit.records ?? []).forEach((r: SimExportRecord) =>
            dbg('CREDIT', `${r.transaction_date}   ${r.description}   ${n2(r.debit_amount)}`))
        } catch (e) { dbg('CREDIT', `fetch failed err="${String(e)}"`) }
      })()
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
    if (Current_User_Pointer_to_DB?.email) {
      localStorage.setItem('mf_pending_install_email', Current_User_Pointer_to_DB.email)
      dbg('handleInstall', `saved mf_pending_install_email="${Current_User_Pointer_to_DB.email}" (so the ?installed=1 callback, which may load in a fresh tab with no React user state yet, updates the right user)`)
    }
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
      setPopupMsg(null)
      dbg('handleInstall', 'popupMsg closed (download triggered)')
      await new Promise(r => setTimeout(r, 1000))
      URL.revokeObjectURL(url)
      dbg('handleInstall', 'revokeObjectURL done => file ready (InstallCard page already shows msgInstallComplete + run button, no popup needed)')
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
        {hasUnreadMsg && (
          <>
            <style>{`@keyframes blinkNotif { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
            <button onClick={async () => {
                setHasUnreadMsg(false)
                if (Current_User_Pointer_to_DB?.id) {
                  await fetch('/api/feedback/unread', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: Current_User_Pointer_to_DB.id }) }).catch(() => {})
                }
                setActivePage('0')
              }}
              style={{ marginLeft: 'auto', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', animation: 'blinkNotif 1s infinite', whiteSpace: 'nowrap' }}>
              {lang.system.newMessageNotif}
            </button>
          </>
        )}
      </header>

      {/* MIDDLE ROW */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* CENTER */}
        <main style={{ flex: 1, ...GRANITE_BG, position: 'relative', overflow: 'hidden' }}>
          {activePage === null ? (
            <GatePage lang={lang} />
          ) : (
            <PageContent page={activePage} lang={lang} langIdx={langIdx} onChangeLang={changeLang} clientIp={clientIp} user={Current_User_Pointer_to_DB} systemMessage={systemMessage} onSetSystemMessage={setSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} bankingDirect={bankingDirect} pendingBankSession={pendingBankSession} onConsumeBankSession={() => setPendingBankSession(null)} onClose={() => setActivePage(null)} onLogin={(user) => {
              set_Current_User_Pointer_to_DB(user)
              setIsLoggedInExplicit(true)
              if (mfChainRef.current) {
                mfChainRef.current = false
                if (!user.is_M_Finance_installed) setActivePage('mf-install')
                else setActivePage(null)
              }
            }} onUserUpdate={(user) => set_Current_User_Pointer_to_DB(user)} onNavigate={(p) => setActivePage(p)} onMsg={setPopupMsg} onDbg={dbg} onInstall={handleInstall} onRun={handleRun} onOpenDebug={() => {
              if (debugWinRef.current && !debugWinRef.current.closed) { debugWinRef.current.close(); debugWinRef.current = null }
              else openDebugWin()
            }} />
          )}
        </main>

        {/* RIGHT — Sidebar */}
        <aside ref={sidebarOuterRef} style={{ width: '140px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'stretch', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ width: '100%', height: sidebarBoxHeight, position: 'relative', flexShrink: 0 }}>
        <div ref={sidebarContentRef} style={{ width: '100%', minHeight: sidebarAvailable, transform: `scale(${sidebarScale})`, transformOrigin: 'top center', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '4px 6px 8px', borderBottom: '1px solid #333' }}>
            <div style={{ fontFamily: 'var(--font-dancing), Georgia, serif', fontSize: '23px', color: '#FFD700', fontWeight: 'bold', textAlign: 'center' }}>KeyClick</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '44px', marginTop: '6px' }}>
              <Image src={`/flags/${lang.code}1.png`} alt={lang.flag} width={55} height={55} />
            </div>
          </div>
          {/* שער כניסה לקבוצת השרותים הפיננסיים - אימות + בדיקת תכנית/התקנה, בלי הפעלה אוטומטית */}
          <div style={{ position: 'relative', width: '120px', margin: '6px auto 4px', overflow: 'hidden', borderRadius: '10px' }}>
            {isLoggedInExplicit && (
              <div style={{ position: 'absolute', top: '4px', left: '-22px', width: '90px', transform: 'rotate(-45deg)', background: '#2f9e5c', color: '#fff', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '1px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 5, pointerEvents: 'none' }}>{lang.card.registered}</div>
            )}
            <button onClick={() => { if (isLoggedInExplicit) return; dbg('flowDiagram', '2-לקוח לחץ על כניסה'); mfChainRef.current = true; setActivePage('mf-login') }}
              style={{ display: 'block', width: '100%', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>
              {lang.card.login}
            </button>
          </div>
          {/* 1. מדריכים וסרטונים */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '10px auto 20px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
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
          <div className={isLoggedInExplicit ? 'mf-luxury-btn' : ''} style={{ position: 'relative', display: 'block', margin: '6px auto', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '22px 6px 8px', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 5px', fontSize: '11px', fontWeight: 'bold', color: '#FFD700', whiteSpace: 'nowrap', maxWidth: '116px', overflow: 'hidden', textOverflow: 'ellipsis' }}>M Finance</div>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '8px', overflow: 'hidden', pointerEvents: 'none' }}>
              {!isLoggedInExplicit && (
                <div style={{ position: 'absolute', top: '6px', left: '-22px', width: '90px', transform: 'rotate(-45deg)', background: '#c0392b', color: '#fff', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '1px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 5 }}>{lang.card.locked}</div>
              )}
            </div>
            <button onClick={() => { dbg('btnClick', `M Finance clicked isLoggedInExplicit=${isLoggedInExplicit}`); if (isLoggedInExplicit) { handleRun() } }}
              style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center', fontSize: lang.code === 'he' || lang.code === 'ar' ? '22px' : '18px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.2', fontFamily: 'var(--font-amatic),"Amatic SC",cursive', textShadow: '0 0 8px rgba(255,215,0,0.8), 0 1px 3px rgba(0,0,0,0.9)', letterSpacing: '1px', WebkitTextStroke: '0.6px #FFD700', wordBreak: 'break-word' }}
              onMouseEnter={e => { if (isLoggedInExplicit) e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{lang.card.title}</button>
          </div>

          {/* 3. קשרי לקוחות */}
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '16px auto 6px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
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
          <div className="mf-luxury-btn" style={{ position: 'relative', display: 'block', margin: '12px auto 20px', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 5px', fontSize: '11px', fontWeight: 'bold', color: '#FFD700', whiteSpace: 'nowrap', maxWidth: '116px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lang.card.infoServices}</div>
            {[1, 3].map(idx => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden' }}>
                {idx === 1 && !isLoggedInExplicit && (
                  <div style={{ position: 'absolute', top: '2px', left: '-22px', width: '90px', transform: 'rotate(-45deg)', background: '#c0392b', color: '#fff', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '1px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 5, pointerEvents: 'none' }}>{lang.card.locked}</div>
                )}
              <button onClick={() => { dbg('btnClick', `menu[${idx}] clicked isLoggedInExplicit=${isLoggedInExplicit}`); if (idx === 1 && !isLoggedInExplicit) { return } setActivePage(String(idx) === activePage ? null : String(idx)) }}
                style={{
                  display: 'block', width: '100%', background: activePage === String(idx) ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)',
                  color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center',
                  fontSize: lang.code === 'he' || lang.code === 'ar' ? '17px' : '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3', wordBreak: 'break-word',
                }}
                onMouseEnter={e => { if (!(idx === 1 && !isLoggedInExplicit)) e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >{lang.menu[idx]}</button>
              </div>
            ))}
          </div>

          {/* 5. שרותים בנקאיים */}
          <div className={isLoggedInExplicit ? 'mf-luxury-btn' : ''} style={{ position: 'relative', display: 'block', margin: '6px auto', width: '120px', background: 'linear-gradient(to bottom, #0d0d2b, #001a4a)', border: '2px solid #FFD700', borderRadius: '10px', color: '#FFD700', textAlign: 'center', padding: '10px 6px 8px', overflow: 'visible' }}>
            {!isLoggedInExplicit && (
              <div style={{ position: 'absolute', top: '4px', left: '-22px', width: '90px', transform: 'rotate(-45deg)', background: '#c0392b', color: '#fff', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '1px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.5)', zIndex: 5, pointerEvents: 'none' }}>{lang.card.locked}</div>
            )}
            <button onClick={() => { dbg('btnClick', `Banking clicked isLoggedInExplicit=${isLoggedInExplicit}`); if (!isLoggedInExplicit) { return } setActivePage(activePage === '4' ? null : '4') }}
              style={{ display: 'block', width: '100%', background: activePage === '4' ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', borderTop: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', padding: '7px 4px', cursor: 'pointer', textAlign: 'center', fontSize: lang.code === 'he' || lang.code === 'ar' ? '15px' : '13px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '1.3', wordBreak: 'break-word' }}
              onMouseEnter={e => { if (isLoggedInExplicit) e.currentTarget.style.opacity = '0.75' }}
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
              borderTop: '2px solid #555', color: '#ff0000',
              padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              fontSize: '15px', fontStyle: 'italic', fontWeight: 'bold', lineHeight: '1.3',
            }}
          >{lang.system.adminButton}</button>
          {hasNewCustomerMsg && (
            <button onClick={async () => {
                setHasNewCustomerMsg(false)
                await fetch('/api/feedback/admin-unread', { method: 'PATCH' }).catch(() => {})
              }}
              style={{
                background: 'none', border: 'none', borderTop: '1px solid #555',
                color: '#ff9500', padding: '6px 8px', cursor: 'pointer', textAlign: 'center',
                fontSize: '12px', fontWeight: 'bold',
              }}
            >{lang.system.adminNewMsg}</button>
          )}
        </div>
        </div>
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
type FeedbackMessage = { id: number; user_id: number | null; user_name: string | null; sent_date: string | null; title: string | null; body: string | null; rating_site: number | null; rating_budget: number | null; reply_text: string | null; reply_date: string | null; is_read: boolean; created_at: string; sender_ip?: string | null; is_system?: boolean; is_broadcast?: boolean }
type PaymentRecord = { id: number; user_id: number; amount: number | null; currency: string | null; plan: string | null; payment_date: string; status: string }

function BillingTable({ users, lang }: { users: UserRecord[]; lang: typeof languages[0] }) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/billing/payments').then(r => r.json()).then(d => setPayments(d.payments ?? [])).catch(() => {})
  }, [])

  const byUser = new Map<number, PaymentRecord[]>()
  for (const p of payments) {
    if (!byUser.has(p.user_id)) byUser.set(p.user_id, [])
    byUser.get(p.user_id)!.push(p)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: 'fit-content' }}>
        <div style={{ border: '2px solid #003399', borderRadius: 3 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, direction: 'ltr', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: '#e8eaf6' }}>
                {['ID', lang.system.colName, lang.profile.email, lang.system.billLastPlan, lang.system.billLastAmount, lang.system.billLastDate, lang.system.billStatus].map(h => (
                  <th key={h} style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const userPayments = byUser.get(u.id) ?? []
                const last = userPayments[0]
                const rowBg = idx % 2 === 0 ? '#fff' : '#f5f5fc'
                const expanded = expandedUserId === u.id
                return (
                  <React.Fragment key={String(u.id)}>
                    <tr style={{ background: rowBg, cursor: 'pointer' }} onClick={() => setExpandedUserId(expanded ? null : u.id)}>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{u.id}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{u.name ?? ''}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0' }}>{u.email ?? ''}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{last?.plan ?? '—'}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{last ? `${last.amount ?? ''} ${last.currency ?? ''}` : '—'}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{last ? String(last.payment_date).slice(0, 10) : '—'}</td>
                      <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{last?.status ?? '—'}</td>
                    </tr>
                    {expanded && (
                      <tr style={{ background: rowBg }}>
                        <td colSpan={7} style={{ padding: '4px 8px', border: '1px solid #c8cce0', borderTop: 'none' }}>
                          {userPayments.length === 0
                            ? <div style={{ fontSize: 12, color: '#888', padding: '4px' }}>{lang.system.billNoPayments}</div>
                            : (
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                  <tr style={{ background: '#f0f2fa' }}>
                                    {[lang.system.billPlan, lang.system.billAmount, lang.system.billDate, lang.system.billStatus].map(h => (
                                      <th key={h} style={{ padding: '3px 6px', border: '1px solid #dde', textAlign: 'center' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {userPayments.map(p => (
                                    <tr key={p.id}>
                                      <td style={{ padding: '3px 6px', border: '1px solid #dde', textAlign: 'center' }}>{p.plan ?? ''}</td>
                                      <td style={{ padding: '3px 6px', border: '1px solid #dde', textAlign: 'center' }}>{p.amount ?? ''} {p.currency ?? ''}</td>
                                      <td style={{ padding: '3px 6px', border: '1px solid #dde', textAlign: 'center' }}>{String(p.payment_date).slice(0, 10)}</td>
                                      <td style={{ padding: '3px 6px', border: '1px solid #dde', textAlign: 'center' }}>{p.status}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SystemPage({ user, lang, langIdx, onChangeLang, onOpenDebug, onDbg, onUserUpdate, onSetSystemMessage, prText, setPrText, prDate, setPrDate, onNavigate, onInstall, onRun }: { user: UserRecord | null; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; onOpenDebug: () => void; onDbg: (func: string, msg: string) => void; onUserUpdate: (u: UserRecord) => void; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void; onNavigate: (page: string) => void; onInstall: () => void; onRun: () => void }) {
  const [view, setView] = useState<'none' | 'db' | 'users' | 'schedule' | 'pr' | 'messages' | 'sensitive' | 'tests' | 'banking' | 'data' | 'statistics' | 'billing' | 'institutions'>('none')
  const [devBypassLogin, setDevBypassLogin] = useState(false)
  useEffect(() => {
    if (view !== 'sensitive') return
    fetch('/api/system/dev-bypass-login').then(r => r.json()).then(d => setDevBypassLogin(!!d.enabled)).catch(() => {})
  }, [view])
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const reloadVisits = () => {
    onDbg('reloadVisits', 'fetch GET /api/visits')
    fetch('/api/visits').then(r => r.json()).then(d => {
      onDbg('reloadVisits', `count=${(d.visits ?? []).length}`)
      setVisits(d.visits ?? [])
    }).catch(e => onDbg('reloadVisits', `error: ${String(e)}`))
  }
  const [samplingConfig, setSamplingConfig] = useState<SamplingConfig>({ runEnabled: false, startDate: null, endDate: null, endEnabled: true })
  const samplingConfigRef = useRef(samplingConfig)
  useEffect(() => { samplingConfigRef.current = samplingConfig }, [samplingConfig])

  useEffect(() => {
    onDbg('samplingConfig.load', 'fetch GET /api/visits/sampling-config')
    fetch('/api/visits/sampling-config').then(r => r.json()).then(d => {
      if (d.config) {
        onDbg('samplingConfig.load', `runEnabled=${d.config.run_enabled} start=${d.config.start_date} end=${d.config.end_date} endEnabled=${d.config.end_enabled}`)
        setSamplingConfig({
          runEnabled: !!d.config.run_enabled,
          startDate: d.config.start_date ? String(d.config.start_date).slice(0, 16) : null,
          endDate: d.config.end_date ? String(d.config.end_date).slice(0, 16) : null,
          endEnabled: !!d.config.end_enabled,
        })
      }
    }).catch(e => onDbg('samplingConfig.load', `error: ${String(e)}`))
  }, [])

  const updateSamplingConfig = (next: SamplingConfig) => {
    onDbg('samplingConfig.update', `runEnabled=${next.runEnabled} start=${next.startDate} end=${next.endDate} endEnabled=${next.endEnabled}`)
    setSamplingConfig(next)
    fetch('/api/visits/sampling-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(e => onDbg('samplingConfig.update', `error: ${String(e)}`))
  }

  useEffect(() => {
    reloadVisits()
    const interval = setInterval(() => {
      const cfg = samplingConfigRef.current
      if (!cfg.runEnabled) { onDbg('samplingTimer', 'tick — skip, runEnabled=false'); return }
      const now = new Date()
      if (cfg.startDate && now < new Date(cfg.startDate)) { onDbg('samplingTimer', `tick — skip, before startDate=${cfg.startDate}`); return }
      if (cfg.endEnabled && cfg.endDate && now > new Date(cfg.endDate)) { onDbg('samplingTimer', `tick — skip, after endDate=${cfg.endDate}`); return }
      onDbg('samplingTimer', 'tick — running reloadVisits')
      reloadVisits()
    }, 300000)
    return () => clearInterval(interval)
  }, [])
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
  const [newFolderNameTest, setNewFolderNameTest] = useState('')
  const [usersEditMode, setUsersEditMode] = useState(false)
  const [pendingUserEdits, setPendingUserEdits] = useState<Record<string, Record<string, unknown>>>({})
  const [debugOpen, setDebugOpen] = useState(false)
  const [buildOpen, setBuildOpen] = useState(false)
  const [prSaved, setPrSaved] = useState(false)
  const [updatesResetDone, setUpdatesResetDone] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserRecord | null>(null)
  const buildWinRef = React.useRef<Window | null>(null)
  const [dbTables, setDbTables] = useState<{ name: string; rows: Record<string, unknown>[] }[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])
  const [expandedUser, setExpandedUser] = useState<number | null>(null)
  const [prTxText, setPrTxText] = useState('')
  const [bankingData, setBankingData] = useState<{ connections: Record<string,unknown>[]; accounts: Record<string,unknown>[]; transactions: Record<string,unknown>[] } | null>(null)
  const [bankingStatus, setBankingStatus] = useState<{ nordigen: boolean; plaid: boolean; il: boolean; groq: boolean } | null>(null)
  const [prEditing, setPrEditing] = useState(false)
  const [mfMsgText, setMfMsgText] = useState('')
  const [mfMsgDate, setMfMsgDate] = useState('')
  const [mfMsgSaved, setMfMsgSaved] = useState(false)
  const [gateMsgText, setGateMsgText] = useState('')
  const [gateMsgDate, setGateMsgDate] = useState('')
  const [gateMsgSaved, setGateMsgSaved] = useState(false)
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
    fetch('/api/system/mf-message').then(r => r.json()).then(d => {
      if (d.text) setMfMsgText(d.text)
      if (d.date) setMfMsgDate(d.date)
    }).catch(() => {})
    fetch('/api/system/gate-message').then(r => r.json()).then(d => {
      if (d.text) setGateMsgText(d.text)
      if (d.date) setGateMsgDate(d.date)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (view === 'users' || view === 'billing') {
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
    background: 'none', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '4px',
    color: '#fff', padding: '5px 2px', cursor: 'pointer',
    fontSize: '11px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2',
  }

  const viewSubtitle: Record<typeof view, string | null> = {
    none: null,
    db: `${lang.system.monitor} - ${lang.system.db}`,
    users: `${lang.system.systemData} - ${lang.system.users}`,
    schedule: `${lang.system.systemData} - ${lang.system.schedule}`,
    sensitive: `${lang.system.systemData} - ${lang.system.sensitivePoints}`,
    pr: `${lang.system.pr} - ${lang.system.announcements}`,
    messages: `${lang.system.pr} - ${lang.system.messages}`,
    tests: `${lang.system.lab} - ${lang.system.labTests}`,
    banking: `${lang.system.lab} - ${lang.system.labBanking}`,
    data: `${lang.system.dataCollection} - ${lang.system.data}`,
    statistics: `${lang.system.dataCollection} - ${lang.system.statistics}`,
    billing: `${lang.system.systemData} - ${lang.system.billing}`,
    institutions: `${lang.system.systemData} - ${lang.system.financialInstitutions}`,
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <PageHeader subtitle={lang.system.adminButton} lang={lang} extra={viewSubtitle[view] ? (
        <div style={{ display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center', background: 'linear-gradient(180deg, #d3213a, #8e0f22)', color: '#ffffff', padding: '8px 26px', borderRadius: '999px', boxShadow: '0 8px 18px -8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)', fontFamily: 'Arial, sans-serif', fontWeight: 'normal', fontSize: '20px' }}>
          {viewSubtitle[view]}
        </div>
      ) : undefined} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: view === 'messages' ? 0 : view === 'statistics' ? '0 20px 16px' : '16px 20px', ...GRANITE_BG }}>
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

            <div style={{ position: 'relative', marginTop: '28px', direction: 'rtl', width: '730px' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{lang.system.mfMessagesLegend}</span>
              <div style={{ border: '2px solid #003399', borderRadius: '6px', minHeight: '96px', padding: '12px', display: 'flex', flexDirection: 'column', background: '#fff', resize: 'vertical', overflow: 'auto' }}>
                <textarea value={mfMsgText} onChange={e => setMfMsgText(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', minHeight: '50px', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: 'rtl', background: 'transparent' }} />
                <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                  {lang.feedback.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {lang.card.title}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '8px', width: '730px', textAlign: 'right', direction: 'rtl' }}>
              {lang.system.publishedDate} <input type="date" value={mfMsgDate} onChange={e => setMfMsgDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #999', fontSize: '13px', outline: 'none', background: 'transparent', color: '#333' }} />
            </div>
            <div style={{ marginTop: '6px', width: '730px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button onClick={() => {
                setMfMsgSaved(true)
                setTimeout(() => setMfMsgSaved(false), 2000)
                fetch('/api/system/mf-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: mfMsgText, date: mfMsgDate }) }).catch(() => {})
              }} style={{ fontSize: '11px', padding: '2px 10px', background: mfMsgSaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{mfMsgSaved ? '✓ ' + lang.system.saved : lang.card.update}</button>
              <button onClick={() => { setMfMsgText('') }} style={{ fontSize: '11px', padding: '2px 10px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.reset}</button>
            </div>

            <div style={{ position: 'relative', marginTop: '28px', direction: 'rtl', width: '730px' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{lang.system.entranceGateMessagesLegend}</span>
              <div style={{ border: '2px solid #003399', borderRadius: '6px', minHeight: '96px', padding: '12px', display: 'flex', flexDirection: 'column', background: '#fff', resize: 'vertical', overflow: 'auto' }}>
                <textarea value={gateMsgText} onChange={e => setGateMsgText(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', minHeight: '50px', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: 'rtl', background: 'transparent' }} />
                <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                  {lang.feedback.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {lang.system.entranceGateWord}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '8px', width: '730px', textAlign: 'right', direction: 'rtl' }}>
              {lang.system.publishedDate} <input type="date" value={gateMsgDate} onChange={e => setGateMsgDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #999', fontSize: '13px', outline: 'none', background: 'transparent', color: '#333' }} />
            </div>
            <div style={{ marginTop: '6px', width: '730px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button onClick={() => {
                setGateMsgSaved(true)
                setTimeout(() => setGateMsgSaved(false), 2000)
                fetch('/api/system/gate-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: gateMsgText, date: gateMsgDate }) }).catch(() => {})
              }} style={{ fontSize: '11px', padding: '2px 10px', background: gateMsgSaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{gateMsgSaved ? '✓ ' + lang.system.saved : lang.card.update}</button>
              <button onClick={() => { setGateMsgText('') }} style={{ fontSize: '11px', padding: '2px 10px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.reset}</button>
            </div>
          </div>
        )}

        {view === 'sensitive' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
              <table style={{ borderCollapse: 'collapse', fontSize: 13, direction: 'rtl' }}>
                <thead>
                  <tr>
                    <th style={{ color: '#FFD700', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveColEnv}</th>
                    <th style={{ color: '#FFD700', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveColFlag}</th>
                    <th style={{ color: '#FFD700', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveColPurpose}</th>
                    <th style={{ color: '#FFD700', border: '1px solid #555', padding: '6px 10px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: '#ccc', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveDevBypassEnv}</td>
                    <td style={{ color: '#ccc', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveDevBypassFlag}</td>
                    <td style={{ color: '#ccc', border: '1px solid #555', padding: '6px 10px' }}>{lang.system.sensitiveDevBypassPurpose}</td>
                    <td style={{ border: '1px solid #555', padding: '6px 10px', textAlign: 'center' }}>
                      <input type="checkbox" checked={devBypassLogin} onChange={e => {
                        const next = e.target.checked
                        setDevBypassLogin(next)
                        fetch('/api/system/dev-bypass-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: next }) }).catch(() => {})
                      }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

        {view === 'billing' && <BillingTable users={users} lang={lang} />}

        {view === 'data' && <VisitsTable lang={lang} visits={visits} reload={reloadVisits} samplingConfig={samplingConfig} onUpdateSamplingConfig={updateSamplingConfig} onDbg={onDbg} />}
        {view === 'statistics' && <ProcessingPage lang={lang} visits={visits} reload={reloadVisits} onDbg={onDbg} samplingConfig={samplingConfig} />}
        {view === 'institutions' && <InstitutionsAdminPanel lang={lang} />}

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

        {confirmDeleteUser && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#1e1e2e', border: '2px solid #cc0000', borderRadius: '12px', padding: '28px 32px', minWidth: '320px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', direction: 'rtl' }}>
              <div style={{ color: '#ff5555', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #cc0000', paddingBottom: '10px', width: '100%', textAlign: 'center' }}>{lang.system.delete}</div>
              <div style={{ color: '#ccc', fontSize: '14px', textAlign: 'center' }}>
                למחוק את המשתמש {confirmDeleteUser.name || confirmDeleteUser.email} (ID {confirmDeleteUser.id})?<br/>הפעולה בלתי הפיכה.
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button onClick={async () => {
                  const id = confirmDeleteUser.id
                  setConfirmDeleteUser(null)
                  await fetch('/api/system/delete-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) }).catch(() => {})
                  setUsers(prev => prev.filter(u => String(u.id) !== String(id)))
                }} style={{ fontSize: '13px', padding: '6px 20px', background: '#cc0000', color: '#fff', border: '1px solid #ff5555', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.delete}</button>
                <button onClick={() => setConfirmDeleteUser(null)} style={{ fontSize: '13px', padding: '6px 20px', background: '#444', color: '#ccc', border: '1px solid #666', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{lang.card.cancel}</button>
              </div>
            </div>
          </div>
        )}

        {view === 'banking' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

            {/* ספקים */}
            <div style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 10, direction: 'rtl' }}>{lang.system.providersTitle}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { key: 'nordigen', name: 'GoCardless Nordigen', desc: lang.system.providerNordigenDesc },
                  { key: 'plaid',    name: 'Plaid',               desc: lang.system.providerPlaidDesc },
                  { key: 'il',       name: lang.system.providerIlName,   desc: lang.system.providerIlDesc },
                  { key: 'groq',     name: 'Groq AI',             desc: lang.system.providerGroqDesc },
                ].map(p => {
                  const active = bankingStatus?.[p.key as keyof typeof bankingStatus]
                  return (
                    <div key={p.key} style={{ border: `1px solid ${active ? '#4CAF50' : '#555'}`, borderRadius: 6, padding: '8px 14px', background: '#111' }}>
                      <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>{p.name}</div>
                      <div style={{ color: '#aaa', fontSize: 11 }}>{p.desc}</div>
                      <div style={{ color: active ? '#4CAF50' : '#ff6b6b', fontSize: 11, marginTop: 4 }}>
                        {bankingStatus === null ? '...' : active ? lang.system.providerStatusConfigured : lang.system.providerStatusPendingRegistration}
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
                    <th style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'left' }}>{lang.system.colProvider}</th>
                    <th style={{ border: '1px solid #333', padding: '4px 8px', color: '#FFD700', textAlign: 'right' }}>{lang.system.colRole}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { route: '/api/banking/nordigen/token',        provider: 'Nordigen',       desc: lang.system.routeDescTokenNordigen },
                    { route: '/api/banking/nordigen/institutions', provider: 'Nordigen',       desc: lang.system.routeDescInstitutionsNordigen },
                    { route: '/api/banking/nordigen/connect',      provider: 'Nordigen',       desc: lang.system.routeDescConnectNordigen },
                    { route: '/api/banking/nordigen/callback',     provider: 'Nordigen',       desc: lang.system.routeDescCallbackNordigen },
                    { route: '/api/banking/plaid/link-token',      provider: 'Plaid',          desc: lang.system.routeDescLinkTokenPlaid },
                    { route: '/api/banking/plaid/exchange',        provider: 'Plaid',          desc: lang.system.routeDescExchangePlaid },
                    { route: '/api/banking/plaid/sync',            provider: 'Plaid',          desc: lang.system.routeDescSyncPlaid },
                    { route: '/api/banking/il/connect',            provider: lang.system.providerLabelIsrael,          desc: lang.system.routeDescConnectIl },
                    { route: '/api/banking/il/callback',           provider: lang.system.providerLabelIsrael,          desc: lang.system.routeDescCallbackIl },
                    { route: '/api/banking/accounts',              provider: lang.system.providerLabelShared,          desc: lang.system.routeDescAccountsShared },
                    { route: '/api/banking/transactions',          provider: lang.system.providerLabelShared,          desc: lang.system.routeDescTransactionsShared },
                    { route: '/api/banking/detect-provider',        provider: 'Groq AI',         desc: lang.system.routeDescDetectProvider },
                    { route: '/api/banking/status',                provider: lang.system.providerLabelSystem,          desc: lang.system.routeDescStatusSystem },
                    { route: '/api/banking/data',                  provider: lang.system.providerLabelSystem,          desc: lang.system.routeDescDataSystem },
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
                  <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 10 }}>{lang.system.accountsBalancesTitle}</div>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#111' }}>
                        {[lang.system.colFinancialInstitution, lang.system.colAccount, lang.system.colBalance, lang.system.colCurrency, lang.system.colProvider].map(h => (
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
                  {isEmpty && <div style={{ color: '#555', fontSize: 11, marginTop: 6, textAlign: 'center' as const }}>{lang.system.noAccountsConnectedExample}</div>}
                </div>
              )
            })()}

            {/* ניהול חיבורים */}
            <BankingConnectPanel userId={user?.id} lang={lang} />

            {/* טבלאות חיות */}
            {(['connections', 'accounts', 'transactions'] as const).map(tbl => {
              const rows = bankingData?.[tbl] ?? []
              const cols = rows.length > 0 ? Object.keys(rows[0]) : []
              const labels: Record<string, string> = { connections: lang.system.connectionsLabel, accounts: lang.system.accountsLabel, transactions: lang.system.transactionsLabel }
              return (
                <div key={tbl} style={{ background: '#000', border: '1px solid #cc9900', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: 5, marginBottom: 8, direction: 'rtl' }}>
                    {labels[tbl]} ({rows.length})
                  </div>
                  {!bankingData ? (
                    <div style={{ color: '#aaa', fontSize: 12 }}>{lang.system.loading}</div>
                  ) : rows.length === 0 ? (
                    <div style={{ color: '#666', fontSize: 12 }}>{lang.system.noRecordsFound}</div>
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
            <fieldset style={{ margin: '8px 6px', border: '1px solid #003399', borderRadius: '6px', padding: '10px 12px', height: 'fit-content' }}>
              <legend style={{ color: 'red', fontSize: '20px', fontWeight: 'bold', padding: '0 6px', direction: 'rtl' }}>{lang.system.testsCreateFolderLegend}</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                  <span style={{ color: '#003399', fontSize: '16px', fontWeight: 'bold' }}>{lang.system.testsNameLabel}</span>
                  <input value={newFolderNameTest} onChange={e => setNewFolderNameTest(e.target.value)}
                    style={{ background: '#fff', border: '1px solid #555', borderRadius: '4px', color: '#000', padding: '6px 8px', fontSize: '16px' }} />
                </div>
                <button onClick={async () => {
                    const res = await fetch('/api/test-create-folder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newFolderNameTest }) })
                    const data = await res.json()
                    alert(data.path ? `${lang.system.testsFolderCreatedPrefix} ${data.path}` : `${lang.system.error}: ${data.error}`)
                  }}
                  style={{ background: '#003399', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '50%', alignSelf: 'flex-end' }}>{lang.system.testsCreateButton}</button>
              </div>
            </fieldset>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 'fit-content' }}>
            <div style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 10, color: '#003399', textAlign: 'right' }}>{lang.system.users}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', direction: 'ltr' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#e8eaf6' }}><th style={{ padding: '4px 10px', border: '1px solid transparent', color: '#003399' }}>&nbsp;</th></tr>
                <tr style={{ background: '#e8eaf6' }}><th style={{ padding: '4px 8px', border: '1px solid transparent' }}>&nbsp;</th></tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const rowBg = idx % 2 === 0 ? '#fff' : '#f5f5fc'
                  return (
                    <React.Fragment key={`del-${String(u.id)}`}>
                      <tr style={{ background: rowBg }}>
                        <td style={{ padding: '3px 8px', border: '1px solid transparent', textAlign: 'center' }}>
                          <button onClick={() => setConfirmDeleteUser(u)} title={lang.system.delete}
                            style={{ width: 20, height: 20, lineHeight: '18px', padding: 0, borderRadius: '50%', background: '#fff', border: '2px solid #cc0000', color: '#cc0000', fontWeight: 'bold', fontSize: 12, cursor: 'pointer' }}>✕</button>
                        </td>
                      </tr>
                      <tr style={{ background: rowBg }}>
                        <td style={{ padding: '2px 8px', border: '1px solid transparent' }}>&nbsp;</td>
                      </tr>
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
            <div style={{ border: '2px solid #003399', borderRadius: 3 }}>
              <table style={{ borderCollapse: 'collapse', fontSize: 13, direction: 'ltr', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#e8eaf6' }}>
                    <th colSpan={10} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>{lang.system.generalGroup}</th>
                    <th colSpan={6} style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center' }}>M Finance</th>
                  </tr>
                  <tr style={{ background: '#e8eaf6' }}>
                    {['ID', `${lang.system.weightedScoreTitle} 0-10`, lang.system.colCreated, lang.system.colName, lang.profile.email, lang.profile.language, lang.system.colCurrency, 'IP Registration', 'Last IP', 'UUID Local BIOS'].map(h => (
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
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.ip_registration ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>{String(u.last_ip ?? '')}</td>
                          <td style={{ padding: '3px 8px', border: '1px solid #c8cce0', textAlign: 'center' }}>
                            {usersEditMode
                              ? <input value={String(u.UUID_Local_BIOS ?? '')} onChange={e => { const v = e.target.value; setUsers(prev => prev.map(usr => String(usr.id) === String(u.id) ? { ...usr, UUID_Local_BIOS: v } : usr)); setPendingUserEdits(prev => ({ ...prev, [String(u.id)]: { ...prev[String(u.id)], UUID_Local_BIOS: v } })) }} style={{ fontSize: 12, border: '1px solid #ccc', borderRadius: 3, padding: '1px 4px', width: '150px', backgroundColor: 'yellow' }} />
                              : String(u.UUID_Local_BIOS ?? '')}
                          </td>
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
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button
                onClick={() => { setUsersEditMode(m => !m); if (usersEditMode) { setPendingUserEdits({}); setPendingForce({}) } }}
                style={{ background: usersEditMode ? '#cc6600' : '#003399', border: 'none', borderRadius: 5, color: '#fff', padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 'bold' }}>
                {lang.system.editButton}
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
                <span style={{ fontSize: 15, fontWeight: 'bold', color: '#003399' }}>{lang.system.scheduleTitle}</span>
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
                <div style={{ fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 6 }}>{lang.system.weightedScoreTitle}</div>
                <div style={{ border: '2px solid #003399', borderRadius: 3, display: 'inline-block' }}>
                  <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#e8eaf6' }}>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 70 }}>{lang.system.colPercent}</th>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 130 }}>{lang.system.colMetric}</th>
                        <th style={{ padding: '4px 10px', border: '1px solid #a0a8c0', color: '#003399', fontWeight: 'bold', textAlign: 'center', width: 220 }}>{lang.system.colExplanation}</th>
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
                          {lang.system.totalWeightsLabel} {weightedRows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)}%
                        </td>
                        <td style={{ padding: '4px 8px', border: '1px solid #a0a8c0', color: '#003399', textAlign: 'center' }}>{lang.system.weightedNumberLabel}</td>
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
                            {lang.system.weightedFormula}
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
                    {isScanning ? lang.system.scanningLabel : lang.system.scanUsersButton}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '14px 6px', width: '100%', boxSizing: 'border-box' }}>

          {/* monitor */}
          <div style={{ position: 'relative', border: '1px solid #cc9900', borderRadius: '8px', padding: '10px 4px 6px' }}>
            <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#555', padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.monitor}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm, fontSize: '13px' }} onClick={() => { onOpenDebug(); setDebugOpen(prev => !prev) }}>{lang.system.debug}</button>
              <button style={{ ...sysBtnSm }} onClick={handleDb}>{lang.system.db}</button>
              <button style={{ ...sysBtnSm, gridColumn: 'span 2' }} onClick={() => { handleBuild(); setBuildOpen(prev => !prev) }}>{lang.system.buildMessages}</button>
            </div>
          </div>

          {/* lab */}
          <div style={{ position: 'relative', border: '1px solid #cc9900', borderRadius: '8px', padding: '10px 4px 6px' }}>
            <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#555', padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.lab}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <button style={{ ...sysBtnSm, fontSize: '14px' }} onClick={() => setView(view === 'tests' ? 'none' : 'tests')}>{lang.system.labTests}</button>
              <button style={{ ...sysBtnSm, fontSize: '14px' }} onClick={() => { if (view === 'banking') { setView('none') } else { setView('banking'); fetch('/api/banking/data').then(r => r.json()).then(d => setBankingData(d)).catch(() => {}); fetch('/api/banking/status').then(r => r.json()).then(d => setBankingStatus(d)).catch(() => {}) } }}>{lang.system.labBanking}</button>
            </div>
          </div>

          {/* systemData */}
          <div style={{ position: 'relative', border: '1px solid #cc9900', borderRadius: '8px', padding: '10px 4px 6px' }}>
            <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#555', padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.systemData}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm }} onClick={handleUsers}>{lang.system.users}</button>
              <button style={{ ...sysBtnSm }} onClick={handleSchedule}>{lang.system.schedule}</button>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'sensitive' ? 'none' : 'sensitive')}>{lang.system.sensitivePoints}</button>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'billing' ? 'none' : 'billing')}>{lang.system.billing}</button>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'institutions' ? 'none' : 'institutions')}>{lang.system.financialInstitutions}</button>
            </div>
          </div>

          {/* dataCollection */}
          <div style={{ position: 'relative', border: '1px solid #cc9900', borderRadius: '8px', padding: '10px 4px 6px' }}>
            <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#555', padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.dataCollection}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'data' ? 'none' : 'data')}>{lang.system.data}</button>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'statistics' ? 'none' : 'statistics')}>{lang.system.statistics}</button>
            </div>
          </div>

          {/* pr */}
          <div style={{ position: 'relative', border: '1px solid #cc9900', borderRadius: '8px', padding: '10px 4px 6px' }}>
            <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#555', padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.pr}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'pr' ? 'none' : 'pr')}>{lang.system.announcements}</button>
              <button style={{ ...sysBtnSm }} onClick={() => setView(view === 'messages' ? 'none' : 'messages')}>{lang.system.messages}</button>
            </div>
          </div>

        </div>
      </aside>

    </div>
    </div>
  )
}

function InstitutionsAdminPanel({ lang }: { lang: typeof languages[0] }) {
  const [institutions, setInstitutions] = useState<FinancialInstitutionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [enableClicked, setEnableClicked] = useState(false)
  const [simClicked, setSimClicked] = useState(false)
  const BROWN = '#6b4423'

  useEffect(() => {
    setLoading(true)
    fetch('/api/banking/institutions').then(r => r.json()).then(d => {
      const list: FinancialInstitutionRecord[] = d.institutions ?? []
      setInstitutions(list)
      if (list.length > 0) {
        setEnableClicked(list.every(i => i.system_enable_flag))
        setSimClicked(list.every(i => i.system_simulation_mode))
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function bulkAction(body: object) {
    setLoading(true)
    try {
      const res = await fetch('/api/banking/institutions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      setInstitutions(d.institutions ?? [])
    } finally { setLoading(false) }
  }

  const COUNTRY_ISO: Record<string, string> = {
    'בריטניה': 'GB', 'גרמניה': 'DE', 'צרפת': 'FR', 'ספרד': 'ES', 'איטליה': 'IT', 'רוסיה': 'RU',
    'ארצות-הברית': 'US', 'יפן': 'JP', 'סין': 'CN', 'הודו': 'IN', 'ישראל': 'IL', 'סעודיה': 'SA',
  }
  function countryName(file: string): string {
    const iso = COUNTRY_ISO[file]
    if (!iso) return file.replace('-', ' ')
    try { return new Intl.DisplayNames([lang.code], { type: 'region' }).of(iso) ?? file.replace('-', ' ') }
    catch { return file.replace('-', ' ') }
  }
  const BANKS: Record<string, string[]> = {
    'בריטניה': ['Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander UK'],
    'רוסיה': ['Sberbank', 'VTB', 'Gazprombank', 'Alfa-Bank'],
    'ארצות-הברית': ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Goldman Sachs', 'Morgan Stanley'],
    'גרמניה': ['Deutsche Bank', 'Commerzbank', 'DZ Bank', 'KfW'],
    'צרפת': ['BNP Paribas', 'Société Générale', 'Crédit Agricole', 'La Banque Postale', 'Crédit Mutuel'],
    'ספרד': ['Santander', 'BBVA', 'CaixaBank', 'Bankinter'],
    'איטליה': ['UniCredit', 'Intesa Sanpaolo', 'Banco BPM', 'BPER Banca'],
    'יפן': ['MUFG', 'Mizuho', 'SMBC', 'Japan Post Bank'],
    'סין': ['ICBC', 'Bank of China', 'CCB', 'ABC', 'Bank of Communications'],
    'הודו': ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak Mahindra'],
    'ישראל': ['בנק הפועלים', 'בנק לאומי', 'בנק דיסקונט', 'בנק מזרחי', 'הבנק הבינלאומי', 'בנק יהב', 'בנק מסד', 'בנק ברקליס', 'בנק ירושלים', 'ישראכרט', 'כאל', 'מקס', 'אמריקן אקספרס'],
    'סעודיה': ['Al Rajhi Bank', 'SNB', 'Riyad Bank', 'Banque Saudi Fransi'],
  }
  const ISRAEL_BANK_LATIN: Record<string, string> = {
    'בנק הפועלים': 'Bank Hapoalim', 'בנק לאומי': 'Bank Leumi', 'בנק דיסקונט': 'Discount Bank',
    'בנק מזרחי': 'Mizrahi Bank', 'הבנק הבינלאומי': 'The International Bank', 'בנק יהב': 'Bank Yahav', 'בנק מסד': 'Bank Massad',
    'בנק ברקליס': 'Barclays', 'בנק ירושלים': 'Bank of Jerusalem', 'ישראכרט': 'Isracard',
    'כאל': 'Cal', 'מקס': 'Max', 'אמריקן אקספרס': 'American Express',
  }
  function bankName(bank: string): string {
    return lang.code === 'he' ? bank : (ISRAEL_BANK_LATIN[bank] ?? bank)
  }
  function findInst(file: string, bank: string): FinancialInstitutionRecord | undefined {
    const iso = COUNTRY_ISO[file]
    const englishName = ISRAEL_BANK_LATIN[bank] ?? bank
    return institutions.find(i => i.country_code === iso && i.institution_name === englishName)
  }

  async function toggleFlag(instId: number, key: 'system_enable_flag' | 'system_simulation_mode', current: boolean) {
    const res = await fetch('/api/banking/institutions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institution_record_id: instId, [key]: !current }),
    })
    const d = await res.json()
    if (d.institution) {
      setInstitutions(prev => prev.map(i => i.institution_record_id === d.institution.institution_record_id ? d.institution : i))
    }
  }

  const FIELD_LABELS: [keyof FinancialInstitutionRecord, string][] = [
    ['country_name', 'Country'], ['country_code', 'Country Code'],
    ['institution_name', 'Institution'], ['institution_code', 'Institution Code'],
    ['provider_name', 'Provider'], ['provider_code', 'Provider Code'],
    ['institution_available', 'Available'], ['system_enable_flag', 'System Enabled'],
    ['system_simulation_mode', 'Simulation Mode'], ['institution_registration_date', 'Registered'],
  ]

  function InstitutionButton({ file, bank }: { file: string; bank: string }) {
    const inst = findInst(file, bank)
    const isOpen = !!inst && selectedId === inst.institution_record_id
    const avail = !!inst?.institution_code
    const sim = !!inst?.system_simulation_mode
    const dot = (on: boolean, color: string) => (
      <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'block', background: on ? color : 'rgba(255,255,255,0.15)' }} />
    )
    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 0 }}>
        <button onClick={() => setSelectedId(isOpen ? null : (inst?.institution_record_id ?? null))}
          style={{ background: BROWN, color: '#fff', border: '1px solid #543319', borderRadius: 5, padding: '3px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
          {bankName(bank)}
        </button>
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, verticalAlign: 'middle' }}>
          {dot(!avail, '#ee2222')}
          {dot(sim, '#eebb00')}
          {dot(avail, '#22cc44')}
        </span>
        {isOpen && inst && (
          <div style={{ position: 'absolute', top: 0, insetInlineStart: '100%', marginInlineStart: 8, zIndex: 40, background: '#555', border: '1px solid #cc9900', borderRadius: 8, padding: 14, minWidth: 260, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
            <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 15, marginBottom: 10, borderBottom: '1px solid #777', paddingBottom: 6 }}>
              {inst.institution_name}
            </div>
            <table style={{ color: '#fff', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {FIELD_LABELS.map(([key, label]) => (
                  <tr key={key}>
                    <td style={{ padding: '3px 10px 3px 0', color: '#ccc', verticalAlign: 'top' }}>{label}</td>
                    <td style={{ padding: '3px 0', fontWeight: 'bold' }}>
                      {key === 'institution_available' ? (
                        <span style={{ color: inst.institution_code ? '#22cc44' : '#ee6666' }}>{inst.institution_code ? 'Yes' : 'No'}</span>
                      ) : typeof inst[key] === 'boolean' ? (
                        <button onClick={() => toggleFlag(inst.institution_record_id, key as 'system_enable_flag' | 'system_simulation_mode', inst[key] as boolean)}
                          style={{ background: inst[key] ? '#22aa44' : '#aa2222', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>
                          {inst[key] ? 'Yes' : 'No'}
                        </button>
                      ) : String(inst[key] ?? '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setSelectedId(null)}
              style={{ marginTop: 12, background: '#003399', color: '#FFD700', border: 'none', borderRadius: 4, padding: '4px 14px', cursor: 'pointer', fontWeight: 'bold' }}>
              ✕
            </button>
          </div>
        )}
      </div>
    )
  }

  function Ticks({ file, bottomStart, left }: { file: string; bottomStart: number; left: number }) {
    return (
      <>
        {BANKS[file].map((_, i) => (
          <div key={`${file}-tick-${i}`} style={{ position: 'absolute', bottom: bottomStart + i * 46, left, width: 20, height: 2, background: BROWN }} />
        ))}
      </>
    )
  }
  function BankLabels({ file, bottomStart, left }: { file: string; bottomStart: number; left: number }) {
    return (
      <>
        {BANKS[file].map((bank, i) => (
          <div key={`${file}-bank-${i}`} style={{ position: 'absolute', bottom: bottomStart + i * 46 - 6, left: left + 24 }}>
            <InstitutionButton file={file} bank={bank} />
          </div>
        ))}
      </>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <fieldset style={{ border: `2px solid ${BROWN}`, borderRadius: '8px', padding: '10px 14px 14px', display: 'inline-block' }}>
        <legend style={{ padding: '0 8px', color: '#e02020', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{lang.system.allFinancialInstitutions}</legend>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={() => { bulkAction({ bulk: true, system_enable_flag: !enableClicked }); setEnableClicked(!enableClicked) }}
            style={{ background: enableClicked ? '#22aa44' : '#003399', color: '#ffffff', border: enableClicked ? '1px solid #1a8535' : '1px solid #002266', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.03em', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            System Enable: {enableClicked ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => { bulkAction({ bulk: true, system_simulation_mode: !simClicked }); setSimClicked(!simClicked) }}
            style={{ background: simClicked ? '#ccaa00' : '#003399', color: simClicked ? '#2a1f00' : '#ffffff', border: simClicked ? '1px solid #a68700' : '1px solid #002266', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.03em', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            Simulation Mode: {simClicked ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => { bulkAction({ reset: true }); setEnableClicked(true); setSimClicked(false) }}
            style={{ background: '#aa2222', color: '#ffffff', border: '1px solid #841a1a', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.03em', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            Reset
          </button>
        </div>
      </fieldset>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', height: 640, minWidth: 1550, flex: '1 1 auto', overflow: 'auto' }}>
        {loading && <div style={{ color: '#aaa', fontSize: 14 }}>...</div>}

        <button disabled style={{ position: 'absolute', top: 0, left: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/ארצות-הברית.png`} alt="ארצות הברית" width={28} height={28} />
          {countryName('ארצות-הברית')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 99, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="ארצות-הברית" bottomStart={10} left={99} />
        <BankLabels file="ארצות-הברית" bottomStart={10} left={99} />

        <button disabled style={{ position: 'absolute', top: 0, left: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/בריטניה.png`} alt="בריטניה" width={28} height={28} />
          {countryName('בריטניה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 212, height: 218, width: 2, background: BROWN }} />
        {BANKS['בריטניה'].map((_, i) => (
          <div key={`gb-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 212, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['בריטניה'].map((bank, i) => (
          <div key={`gb-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 236 }}>
            <InstitutionButton file="בריטניה" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/רוסיה.png`} alt="רוסיה" width={28} height={28} />
          {countryName('רוסיה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 360, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="רוסיה" bottomStart={10} left={360} />
        <BankLabels file="רוסיה" bottomStart={10} left={360} />

        <button disabled style={{ position: 'absolute', top: 0, left: 372, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/גרמניה.png`} alt="גרמניה" width={28} height={28} />
          {countryName('גרמניה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 410, height: 184, width: 2, background: BROWN }} />
        {BANKS['גרמניה'].map((_, i) => (
          <div key={`de-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 410, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['גרמניה'].map((bank, i) => (
          <div key={`de-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 434 }}>
            <InstitutionButton file="גרמניה" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/צרפת.png`} alt="צרפת" width={28} height={28} />
          {countryName('צרפת')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 549, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="צרפת" bottomStart={10} left={549} />
        <BankLabels file="צרפת" bottomStart={10} left={549} />

        <button disabled style={{ position: 'absolute', top: 0, left: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/ישראל.png`} alt="ישראל" width={28} height={28} />
          {countryName('ישראל')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 723, height: 554, width: 2, background: BROWN }} />
        {BANKS['ישראל'].map((_, i) => (
          <div key={`il-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 723, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['ישראל'].map((bank, i) => (
          <div key={`il-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 747 }}>
            <InstitutionButton file="ישראל" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/ספרד.png`} alt="ספרד" width={28} height={28} />
          {countryName('ספרד')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 849, height: 184, width: 2, background: BROWN }} />
        {BANKS['ספרד'].map((_, i) => (
          <div key={`es-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 849, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['ספרד'].map((bank, i) => (
          <div key={`es-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 873 }}>
            <InstitutionButton file="ספרד" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 950, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/יפן.png`} alt="יפן" width={28} height={28} />
          {countryName('יפן')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 976, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="יפן" bottomStart={10} left={976} />
        <BankLabels file="יפן" bottomStart={10} left={976} />

        <button disabled style={{ position: 'absolute', top: 0, left: 1005, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/סעודיה.png`} alt="סעודיה" width={28} height={28} />
          {countryName('סעודיה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1033, height: 184, width: 2, background: BROWN }} />
        {BANKS['סעודיה'].map((_, i) => (
          <div key={`sa-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 1033, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['סעודיה'].map((bank, i) => (
          <div key={`sa-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 1057 }}>
            <InstitutionButton file="סעודיה" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 1170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/סין.png`} alt="סין" width={28} height={28} />
          {countryName('סין')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1196, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="סין" bottomStart={10} left={1196} />
        <BankLabels file="סין" bottomStart={10} left={1196} />

        <button disabled style={{ position: 'absolute', top: 0, left: 1250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/איטליה.png`} alt="איטליה" width={28} height={28} />
          {countryName('איטליה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1288, height: 184, width: 2, background: BROWN }} />
        {BANKS['איטליה'].map((_, i) => (
          <div key={`it-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 1288, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['איטליה'].map((bank, i) => (
          <div key={`it-bank-${i}`} style={{ position: 'absolute', top: 84 + i * 46, left: 1312 }}>
            <InstitutionButton file="איטליה" bank={bank} />
          </div>
        ))}

        <button disabled style={{ position: 'absolute', top: 0, left: 1380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1, cursor: 'default' }}>
          <Image src={`/flags/הודו.png`} alt="הודו" width={28} height={28} />
          {countryName('הודו')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1409, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="הודו" bottomStart={10} left={1409} />
        <BankLabels file="הודו" bottomStart={10} left={1409} />
      </div>
      </div>
    </div>
  )
}

function GatePage({ lang }: { lang: typeof languages[0] }) {
  const [gateMsg, setGateMsg] = useState('')
  const [txGateMsg, setTxGateMsg] = useState('')

  useEffect(() => {
    fetch('/api/system/gate-message').then(r => r.json()).then(d => { if (d.text) setGateMsg(d.text) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (lang.code === 'he' || !gateMsg) { setTxGateMsg(''); return }
    translateFromHe(gateMsg, lang.code).then(t => setTxGateMsg(t))
  }, [gateMsg, lang.code])

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
      <div style={{ position: 'absolute', top: '85%', right: '-2%', width: '30%', textAlign: 'center',
        fontFamily: lang.code === 'he' ? '"Guttman Yad","Levenim MT","Miriam","David",serif' : 'var(--font-dancing),Georgia,serif',
        fontWeight: 'bold', fontSize: '20px', color: '#cc00cc', whiteSpace: 'pre-wrap', zIndex: 10,
        direction: lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr' }}>
        {(lang.code !== 'he' && txGateMsg) || gateMsg}
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
  const [showCompose, setShowCompose] = useState(true)
  const [txBody, setTxBody] = useState('')
  const [txReply, setTxReply] = useState('')
  const [txTitle, setTxTitle] = useState('')
  const [txSysMsg, setTxSysMsg] = useState('')
  const [txTitlesList, setTxTitlesList] = useState<Record<number, string>>({})
  const [adminReplyEditing, setAdminReplyEditing] = useState(false)
  const [sortField, setSortField] = useState<'type' | 'date' | 'number' | 'ref' | 'title' | 'ratingSite' | 'ratingBudget' | 'reply' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  function toggleSort(field: typeof sortField) {
    if (sortField === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }
    else { setSortField(field); setSortDir('asc') }
  }
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
      fetch('/api/feedback?view=feedback')
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
      if (!isAdmin) {
        fetch('/api/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, customerRead: true }) }).catch(() => {})
      }
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
        fetch('/api/feedback?view=feedback').then(r => r.json()).then(d => {
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
        body: JSON.stringify({ id: selectedMsgId, replyText, replyDate, isRead: true, customerRead: false, replyBody })
      })
      fetch('/api/feedback?view=feedback').then(r => r.json()).then(d => {
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
      ? `${m.user_id ?? 'sys'}-${d2.getFullYear()}${String(d2.getMonth()+1).padStart(2,'0')}${String(d2.getDate()).padStart(2,'0')}-${String(d2.getHours()).padStart(2,'0')}${String(d2.getMinutes()).padStart(2,'0')}${String(d2.getSeconds()).padStart(2,'0')}`
      : String(m.id)
  }
  const side16 = isRTL ? { right: '16px' } : { left: '16px' }
  const side12 = isRTL ? { right: '12px' } : { left: '12px' }
  const thS: React.CSSProperties = { padding: '3px 4px', background: '#003399', color: '#FFD700', fontWeight: 'bold', fontSize: 12, whiteSpace: 'normal', lineHeight: 1.2, border: '1px solid #1144aa', textAlign: 'center' }
  const tdS: React.CSSProperties = { padding: '3px 5px', fontSize: 12, border: '1px solid #c0c8e0', whiteSpace: 'nowrap', textAlign: 'center' }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <PageHeader subtitle={`${lang.feedback.customerRelations} - ${lang.menu[0]}`} lang={lang} />
      <div style={{ width: '100%', flex: 1, ...GRANITE_BG, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '24px', boxSizing: 'border-box', overflow: 'auto' }}>

      {/* LEFT - Messages Library */}
      <div style={{ flex: 1, minWidth: '320px', flexShrink: 0, position: 'sticky', top: 0, background: '#f5f5f5', borderRadius: '12px', border: '2px solid #003399', overflow: 'auto', direction: 'rtl' }}>
        <div style={{ background: '#003399', padding: '8px 12px', textAlign: 'center' }}>
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{lang.system.messages}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, direction: 'rtl' }}>
          <thead>
            <tr>
              <th rowSpan={2} onClick={() => toggleSort('type')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{lang.system.colType} {sortField === 'type' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th rowSpan={2} onClick={() => toggleSort('date')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.date.replace(':','').trim()} {sortField === 'date' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th rowSpan={2} onClick={() => toggleSort('number')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}># {sortField === 'number' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th rowSpan={2} onClick={() => toggleSort('ref')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{lang.system.ref} {sortField === 'ref' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th rowSpan={2} onClick={() => toggleSort('title')} style={{ ...thS, background: '#e8eeff', color: '#003399', width: '220px', textAlign: 'start', cursor: 'pointer', userSelect: 'none' }}>{fb.title.replace(':','').trim()} {sortField === 'title' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th colSpan={2} style={{ ...thS, background: '#e8eeff', color: '#003399' }}>{fb.rating}</th>
              <th rowSpan={2} onClick={() => toggleSort('reply')} style={{ ...thS, background: '#e8eeff', color: '#003399', borderInlineEnd: 'none', cursor: 'pointer', userSelect: 'none' }}>{fb.systemReply} {sortField === 'reply' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th rowSpan={2} style={{ ...thS, background: '#e8eeff', borderInlineEnd: 'none' }}></th>
            </tr>
            <tr>
              <th onClick={() => toggleSort('ratingSite')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.ratingWebsite} {sortField === 'ratingSite' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
              <th onClick={() => toggleSort('ratingBudget')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.ratingBudget} {sortField === 'ratingBudget' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const chronological = [...loadedMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              const numbered = chronological.map((m, idx) => ({ m, msgNum: idx + 1 }))
              const sorted = [...numbered].sort((a, b) => {
                let cmp = 0
                if (sortField === 'type') cmp = Number(a.m.is_system) - Number(b.m.is_system)
                else if (sortField === 'date') cmp = new Date(a.m.created_at).getTime() - new Date(b.m.created_at).getTime()
                else if (sortField === 'number') cmp = a.msgNum - b.msgNum
                else if (sortField === 'ref') cmp = buildMsgRef(a.m).localeCompare(buildMsgRef(b.m))
                else if (sortField === 'title') cmp = (a.m.title || '').localeCompare(b.m.title || '')
                else if (sortField === 'ratingSite') cmp = (a.m.rating_site ?? -1) - (b.m.rating_site ?? -1)
                else if (sortField === 'ratingBudget') cmp = (a.m.rating_budget ?? -1) - (b.m.rating_budget ?? -1)
                else if (sortField === 'reply') cmp = Number(!!a.m.reply_text) - Number(!!b.m.reply_text)
                return sortDir === 'asc' ? cmp : -cmp
              })
              return sorted.map(({ m, msgNum }) => {
                const isExp = expandedMsgId === m.id
                const i = loadedMessages.findIndex(x => x.id === m.id)
                return (
                  <tr key={m.id} onClick={() => { if (isExp) { setExpandedMsgId(null); setShowCompose(false) } else { setExpandedMsgId(m.id); handleSelectMsg(m.id); setShowCompose(false) } }}
                    style={{ cursor: 'pointer', background: isExp ? '#c8d8ff' : i % 2 === 0 ? '#fff' : '#f4f6ff' }}>
                    <td style={{ ...tdS, color: '#003399', fontWeight: 'bold' }}>{m.is_system ? 'מערכת' : 'משוב'}</td>
                    <td style={{ ...tdS }}>{m.sent_date || '—'}</td>
                    <td style={{ ...tdS, color: '#555' }}>{msgNum}</td>
                    <td style={{ ...tdS, fontSize: 10, color: '#888', direction: 'ltr' }}>{buildMsgRef(m) || '—'}</td>
                    <td style={{ ...tdS, textAlign: 'start', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {(lang.code !== 'he' && txTitlesList[m.id]) || m.title || '—'}
                    </td>
                    {m.is_system ? (
                      <td colSpan={3} style={{ ...tdS, color: '#aaa' }}>—</td>
                    ) : (
                      <>
                        <td style={{ ...tdS, color: '#003399', fontWeight: 'bold' }}>{m.rating_site ?? '—'}</td>
                        <td style={{ ...tdS, color: '#003399', fontWeight: 'bold' }}>{m.rating_budget ?? '—'}</td>
                        <td style={{ ...tdS, color: m.reply_text ? '#006600' : '#cc6600', fontWeight: 'bold' }}>{m.reply_text ? '✓' : '○'}</td>
                      </>
                    )}
                    <td style={{ ...tdS, padding: '3px 4px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={async () => {
                          await fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id, scope: 'feedback' }) }).catch(() => {})
                          setLoadedMessages(prev => prev.filter(msg => msg.id !== m.id))
                          if (expandedMsgId === m.id) setExpandedMsgId(null)
                        }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.delete}</button>
                    </td>
                  </tr>
                )
              })
            })()}
            {loadedMessages.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: 12 }}>{lang.system.noMessages}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '26px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', marginBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
          {lang.captions.feedbackAboveButton}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <button onClick={() => {
              if (showCompose && !selectedMsg) { setShowCompose(false); return }
              setExpandedMsgId(null); setSelectedMsgId(null); setUserDate(''); setUserTitle(''); setUserFrom(''); setUserText(''); setReplyDate(''); setReplyText(''); setHasReply(false); setRatingSite(null); setRatingBudget(null); setValidationErrors({}); setRefNum(''); setShowCompose(true)
            }}
            style={{ fontSize: '13px', padding: '4px 14px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{showCompose && !selectedMsg ? lang.profile.close : lang.system.newMessage}</button>
        </div>
      {!selectedMsg && !showCompose ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 15 }}>{lang.system.selectToView}</div>
      ) : (
      <div style={{ width: '720px', minHeight: selectedMsg?.is_system ? '560px' : '1123px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column' }}>

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


        {/* System Message — הודעת יחסי-הציבור הגלובלית, מוסתרת כשצופים בהודעת-מערכת ספציפית כדי למנוע כפל תוויות זהות */}
        {!selectedMsg?.is_system && (
        <div style={{ position: 'relative', marginTop: '28px', direction: dir }}>
          <span style={{ position: 'absolute', top: '-10px', ...side16, background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemMessage}</span>
          <div style={{ border: '2px solid #003399', borderRadius: '6px', height: '135px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '13px', color: '#222', flex: 1, whiteSpace: 'pre-wrap' }}>{(lang.code !== 'he' && txSysMsg) || systemMessage}</div>
            <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
              {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
            </div>
          </div>
        </div>
        )}

        {selectedMsg?.is_system ? (
          /* הודעת מערכת — טופס נפרד לגמרי, לא בתוך טופס המשוב */
          <div style={{ marginTop: '28px', direction: dir, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ position: 'absolute', top: '-10px', ...side12, background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{fb.systemMessage}</span>
              <div style={{ flex: 1, border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto' }}>
                <div style={{ fontSize: '13px', color: '#222', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span>{fb.date}{' '}{selectedMsg.sent_date || '______'}</span>
                  <span style={{ fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.ref + ' '}{buildMsgRef(selectedMsg) || '______'}</span>
                </div>
                <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: '#222', margin: '8px 0', flex: 1 }}>{(lang.code !== 'he' && txReply) || replyText || '______'}</div>
                <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                  {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                </div>
              </div>
            </div>
          </div>
        ) : (
        <>
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
        </>
        )}

      </div>
      )}
      </div>
    </div>
    </div>
  )
}

function MessagesPage({ user, lang, onDbg }: { user: UserRecord | null; lang: typeof languages[0]; onDbg: (func: string, msg: string) => void }) {
  const isAdmin = user?.M_Finance_license_type === LICENSE_TYPES.System_Owner
  const [msgs, setMsgs] = useState<FeedbackMessage[]>([])
  const [selectedMsg, setSelectedMsg] = useState<FeedbackMessage | null>(null)
  const [sortField, setSortField] = useState<'type' | 'date' | 'number' | 'ref' | 'customer' | 'title' | 'ratingSite' | 'ratingBudget' | 'reply' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  function toggleSort(field: typeof sortField) {
    if (sortField === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }
    else { setSortField(field); setSortDir('asc') }
  }
  const [adminReply, setAdminReply] = useState('')
  const [adminReplyDate, setAdminReplyDate] = useState('')
  const [replySaved, setReplySaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [txMsgBody, setTxMsgBody] = useState('')
  const [txMsgReply, setTxMsgReply] = useState('')
  const [txMsgTitle, setTxMsgTitle] = useState('')
  const [txSysMsg, setTxSysMsg] = useState('')
  const [adminReplyEditing, setAdminReplyEditing] = useState(false)
  const [showBroadcastForm, setShowBroadcastForm] = useState(false)
  const [broadcastTarget, setBroadcastTarget] = useState('all')
  const [broadcastText, setBroadcastText] = useState('')
  const [broadcastDate, setBroadcastDate] = useState(new Date().toISOString().slice(0, 10))
  const [broadcastSaved, setBroadcastSaved] = useState(false)
  const [allUsers, setAllUsers] = useState<UserRecord[]>([])
  const isRTL = lang.code === 'he' || lang.code === 'ar'
  const dir = isRTL ? 'rtl' as const : 'ltr' as const

  function reloadMessages() {
    if (!user) return
    const url = isAdmin ? '/api/feedback?view=system' : `/api/feedback?userId=${user.id}`
    fetch(url).then(r => r.json()).then(d => setMsgs(d.messages ?? [])).catch(() => {})
  }

  useEffect(() => {
    if (isAdmin && showBroadcastForm && allUsers.length === 0) {
      fetch('/api/system/users').then(r => r.json()).then(d => setAllUsers(d.users ?? [])).catch(() => {})
    }
  }, [isAdmin, showBroadcastForm])

  async function handleSendBroadcast() {
    if (!broadcastText.trim()) return
    const targetUser = broadcastTarget === 'all' ? null : allUsers.find(u => String(u.id) === broadcastTarget)
    onDbg('MessagesPage.broadcast', `target=${broadcastTarget} textLen=${broadcastText.length}`)
    const res = await fetch('/api/system/broadcast-message', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: targetUser ? targetUser.id : null,
        userName: targetUser ? [targetUser.name, targetUser.last_name].filter(Boolean).join(' ') : 'כל הלקוחות',
        title: 'הודעת מערכת',
        text: broadcastText,
        date: broadcastDate,
      }),
    }).catch(() => null)
    const data = await res?.json().catch(() => null)
    if (data?.ok) {
      setBroadcastSaved(true)
      setBroadcastText('')
      setTimeout(() => setBroadcastSaved(false), 2500)
      reloadMessages()
    }
  }

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


  useEffect(() => {
    if (!user) { setLoading(false); return }
    const url = isAdmin ? '/api/feedback?view=system' : `/api/feedback?userId=${user.id}`
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
    setShowBroadcastForm(false)
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
      const res = await fetch('/api/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedMsg.id, replyText: adminReply, replyDate: adminReplyDate, isRead: true, customerRead: false }) })
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
  if (msgs.length === 0 && !isAdmin) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ color: '#888', fontSize: 15 }}>{lang.system.noMessages}</div></div>

  const thS: React.CSSProperties = { padding: '6px 8px', background: '#003399', color: '#FFD700', fontWeight: 'bold', fontSize: 12, whiteSpace: 'nowrap', border: '1px solid #1144aa', textAlign: 'center' }
  const tdS: React.CSSProperties = { padding: '5px 8px', fontSize: 12, border: '1px solid #c0c8e0', whiteSpace: 'nowrap', textAlign: 'center' }
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

  const buildMsgRef = (m: FeedbackMessage | undefined) => {
    if (!m) return ''
    const match = (m.body ?? '').match(/^סימוכין:\s*(\S+)/)
    if (match) return match[1]
    const d2 = m.created_at ? new Date(m.created_at) : null
    return d2
      ? `${m.user_id ?? 'sys'}-${d2.getFullYear()}${String(d2.getMonth()+1).padStart(2,'0')}${String(d2.getDate()).padStart(2,'0')}-${String(d2.getHours()).padStart(2,'0')}${String(d2.getMinutes()).padStart(2,'0')}${String(d2.getSeconds()).padStart(2,'0')}`
      : String(m.id)
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', ...GRANITE_BG, padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', direction: 'rtl' }}>

        {/* RIGHT — טבלאות לפי משתמש */}
        <div style={{ flex: '0 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px', direction: 'ltr' }}>
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start', direction: 'rtl' }}>
              <button
                onClick={() => { setShowBroadcastForm(p => !p); if (!showBroadcastForm) setSelectedMsg(null) }}
                title={lang.system.newSystemMessageTitle}
                style={{ width: 32, height: 32, background: showBroadcastForm ? '#4a1a6e' : '#003399', color: '#FFD700', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
              >+</button>
              <span style={{ fontSize: 13, fontWeight: 'bold', color: '#003399' }}>{lang.system.newSystemMessageTitle}</span>
            </div>
          )}
          <div style={{ background: '#f5f5f5', borderRadius: '12px', border: '2px solid #003399', overflow: 'auto', direction: 'rtl' }}>
            <div style={{ background: '#003399', padding: '8px 12px', textAlign: 'center' }}>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{lang.system.messages}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th rowSpan={2} onClick={() => toggleSort('type')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{lang.system.colType} {sortField === 'type' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} onClick={() => toggleSort('date')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.date.replace(':','').trim()} {sortField === 'date' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} onClick={() => toggleSort('number')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}># {sortField === 'number' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} onClick={() => toggleSort('ref')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{lang.system.ref} {sortField === 'ref' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} onClick={() => toggleSort('customer')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{lang.system.colCustomer} {sortField === 'customer' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} onClick={() => toggleSort('title')} style={{ ...thS, background: '#e8eeff', color: '#003399', width: '100%', textAlign: 'start', cursor: 'pointer', userSelect: 'none' }}>{fb.title.replace(':','').trim()} {sortField === 'title' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th colSpan={2} style={{ ...thS, background: '#e8eeff', color: '#003399' }}>{fb.rating}</th>
                  <th rowSpan={2} onClick={() => toggleSort('reply')} style={{ ...thS, background: '#e8eeff', color: '#003399', borderInlineEnd: 'none', cursor: 'pointer', userSelect: 'none' }}>{fb.systemReply} {sortField === 'reply' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th rowSpan={2} style={{ ...thS, background: '#e8eeff', borderInlineEnd: 'none' }}></th>
                </tr>
                <tr>
                  <th onClick={() => toggleSort('ratingSite')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.ratingWebsite} {sortField === 'ratingSite' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                  <th onClick={() => toggleSort('ratingBudget')} style={{ ...thS, background: '#e8eeff', color: '#003399', cursor: 'pointer', userSelect: 'none' }}>{fb.ratingBudget} {sortField === 'ratingBudget' ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const chronological = [...msgs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  const numbered = chronological.map((m, idx) => ({ m, msgNum: idx + 1 }))
                  const sorted = [...numbered].sort((a, b) => {
                    let cmp = 0
                    if (sortField === 'type') cmp = Number(a.m.is_system) - Number(b.m.is_system)
                    else if (sortField === 'date') cmp = new Date(a.m.created_at).getTime() - new Date(b.m.created_at).getTime()
                    else if (sortField === 'number') cmp = a.msgNum - b.msgNum
                    else if (sortField === 'ref') cmp = buildMsgRef(a.m).localeCompare(buildMsgRef(b.m))
                    else if (sortField === 'customer') cmp = (a.m.user_name || '').localeCompare(b.m.user_name || '')
                    else if (sortField === 'title') cmp = (a.m.title || '').localeCompare(b.m.title || '')
                    else if (sortField === 'ratingSite') cmp = (a.m.rating_site ?? -1) - (b.m.rating_site ?? -1)
                    else if (sortField === 'ratingBudget') cmp = (a.m.rating_budget ?? -1) - (b.m.rating_budget ?? -1)
                    else if (sortField === 'reply') cmp = Number(!!a.m.reply_text) - Number(!!b.m.reply_text)
                    return sortDir === 'asc' ? cmp : -cmp
                  })
                  return sorted.map(({ m: msg, msgNum }, i) => {
                    const isSelected = selectedMsg?.id === msg.id
                    const rowBg = isSelected ? '#c8d8ff' : i % 2 === 0 ? '#fff' : '#f4f6ff'
                    return (
                      <tr key={msg.id} onClick={() => { if (isSelected) { setSelectedMsg(null) } else { handleSelectMsg(msg) } }}
                        style={{ cursor: 'pointer', background: rowBg, outline: isSelected ? '2px solid #003399' : 'none' }}>
                        <td style={{ ...tdS, textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{msg.is_system ? 'מערכת' : 'משוב'}</td>
                        <td style={{ ...tdS, textAlign: 'center', whiteSpace: 'nowrap' }}>{msg.sent_date || msg.created_at?.slice(0, 10) || '—'}</td>
                        <td style={{ ...tdS, textAlign: 'center', color: '#555' }}>{msgNum}</td>
                        <td style={{ ...tdS, textAlign: 'center', fontSize: 10, color: '#888', direction: 'ltr' }}>{buildMsgRef(msg) || '—'}</td>
                        <td style={{ ...tdS, textAlign: 'center', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {msg.is_broadcast ? lang.system.allCustomers : (msg.user_name || '—')}
                        </td>
                        <td style={{ ...tdS, textAlign: 'start', minWidth: 170, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.title || '—'}</td>
                        {msg.is_system ? (
                          <td colSpan={3} style={{ ...tdS, textAlign: 'center', color: '#aaa' }}>—</td>
                        ) : (
                          <>
                            <td style={{ ...tdS, textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{msg.rating_site ?? '—'}</td>
                            <td style={{ ...tdS, textAlign: 'center', color: '#003399', fontWeight: 'bold' }}>{msg.rating_budget ?? '—'}</td>
                            <td style={{ ...tdS, textAlign: 'center', color: msg.reply_text ? '#006600' : '#cc6600', fontWeight: 'bold' }}>{msg.reply_text ? '✓' : '○'}</td>
                          </>
                        )}
                        <td style={{ ...tdS, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => {
                            fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id, scope: 'system' }) })
                              .then(() => { setMsgs(prev => prev.filter(m => m.id !== msg.id)); if (selectedMsg?.id === msg.id) setSelectedMsg(null) })
                              .catch(() => {})
                          }} style={{ fontSize: 10, padding: '2px 8px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 'bold' }}>{lang.system.delete}</button>
                        </td>
                      </tr>
                    )
                  })
                })()}
                {msgs.length === 0 && (
                  <tr><td colSpan={10} style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: 12 }}>{lang.system.noMessages}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!selectedMsg && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', color: '#888', fontSize: 15 }}>{lang.system.selectToView}</div>
          )}
        </div>

        {/* RIGHT — טופס אחד: הודעה נבחרת, או טופס הודעת מערכת חדשה */}
        {isAdmin && showBroadcastForm && !selectedMsg && (
          <div style={{ flex: 1, position: 'sticky', top: 0 }}>
            <div style={{ width: '720px', minHeight: '560px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <select value={broadcastTarget} onChange={e => setBroadcastTarget(e.target.value)} style={{ fontSize: 13, padding: '4px 6px', border: '1px solid #ccc', borderRadius: 4, maxWidth: '160px' }}>
                    <option value="all">{lang.system.allCustomers}</option>
                    {allUsers.map(u => (
                      <option key={u.id} value={String(u.id)}>{[u.name, u.last_name].filter(Boolean).join(' ')}</option>
                    ))}
                  </select>
                </div>
                <div style={{ background: '#003399', borderRadius: '12px 12px 0 0', padding: '4px 6px 6px', display: 'inline-flex', alignItems: 'center', gap: '32px', border: '2px solid #FFD700', boxShadow: '0 4px 16px rgba(0,0,80,0.2)' }}>
                  <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontSize: '46px', fontWeight: 'bold', fontStyle: 'italic', color: '#FFD700' }}>KeyClick</span>
                  <span style={{ fontFamily: handFont(lang.code), fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>{fb.customerRelations}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '6px', color: '#003399' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'normal' }}>{msgs.filter(m => m.is_system).length + 1}</div>
                  <div style={{ fontSize: '13px', color: '#888', direction: 'rtl' }}>{lang.system.msgNumber}</div>
                </div>
              </div>

              {/* Subtitle */}
              <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#003399', marginTop: '10px' }}>{lang.system.systemMessageLabel}</div>

              {/* Message box */}
              <div style={{ position: 'relative', marginTop: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{lang.system.systemMessageLabel}</span>
                <div style={{ border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#222', borderBottom: '1px solid #ddd', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {fb.date}
                    <input type="date" value={broadcastDate} onChange={e => setBroadcastDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #333', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '130px', direction: 'ltr' }} />
                  </div>
                  <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)} placeholder={lang.system.broadcastPlaceholder} style={{ minHeight: '160px', flex: 1, border: '1px dashed #a0a8d0', outline: 'none', resize: 'vertical', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: 'rtl', background: '#f0f4ff', width: '100%', boxSizing: 'border-box', borderRadius: 4, padding: '4px 8px' }} />
                  <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                    {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
                  <button onClick={handleSendBroadcast} disabled={!broadcastText.trim()} style={{ fontSize: 13, padding: '5px 18px', background: broadcastSaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', opacity: broadcastText.trim() ? 1 : 0.5 }}>
                    {broadcastSaved ? '✓ ' + lang.system.sent : lang.system.send}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {selectedMsg && <div style={{ flex: 1, position: 'sticky', top: 0 }}>
          {(() => {
            const msg = selectedMsg
            const { refNum, userText, sysMsgText } = parseMsgBody(msg)
            const msgIdx = msgs.findIndex(m => m.id === msg.id)
            return (
              <div style={{ width: '720px', minHeight: msg.is_system ? '560px' : '1123px', background: '#f5f5f5', borderRadius: '12px', border: '3px solid #003399', boxSizing: 'border-box', flexShrink: 0, padding: '32px', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>

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

                {msg.is_system ? (
                  /* הודעת מערכת — טופס נפרד לגמרי, לא בתוך טופס המשוב */
                  <div style={{ marginTop: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#003399', marginBottom: '10px' }}>{lang.system.systemMessageLabel}</div>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ position: 'absolute', top: '-10px', right: '12px', background: '#f5f5f5', padding: '0 6px', fontSize: '13px', color: '#003399', fontWeight: 700 }}>{lang.system.systemMessageLabel}</span>
                      <div style={{ border: '2px solid #003399', borderRadius: '6px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#222', borderBottom: '1px solid #ddd', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {fb.date}
                            {isAdmin
                              ? <input type="date" value={adminReplyDate} onChange={e => setAdminReplyDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #333', outline: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', background: 'transparent', width: '130px', direction: 'ltr' }} />
                              : <span style={{ marginInlineStart: 6 }}>{msg.reply_date || '______'}</span>
                            }
                          </span>
                          <span style={{ fontSize: '11px', color: '#888', direction: 'ltr' }}>{lang.system.ref + ' '}{buildMsgRef(msg) || '______'}</span>
                        </div>
                        <textarea value={isAdmin && adminReplyEditing ? adminReply : (lang.code !== 'he' && txMsgReply) || (isAdmin ? adminReply : msg.reply_text || '')} readOnly={!isAdmin} onFocus={isAdmin ? () => setAdminReplyEditing(true) : undefined} onBlur={isAdmin ? () => setAdminReplyEditing(false) : undefined} onChange={isAdmin ? e => setAdminReply(e.target.value) : undefined} style={{ minHeight: '160px', flex: 1, border: isAdmin ? '1px dashed #a0a8d0' : 'none', outline: 'none', resize: isAdmin ? 'vertical' : 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif', direction: isAdmin && adminReplyEditing ? 'rtl' : dir, background: isAdmin ? '#f0f4ff' : 'transparent', cursor: isAdmin ? 'text' : 'default', width: '100%', boxSizing: 'border-box' as const, borderRadius: isAdmin ? 4 : 0, padding: isAdmin ? '4px 8px' : '0' }} />
                        <div style={{ fontSize: '13px', color: '#222', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                          {fb.respectfully} <span style={{ fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', fontWeight: 'bold', color: '#003399' }}>KeyClick</span> {fb.customerRelations}
                        </div>
                      </div>
                      {isAdmin && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
                          <button onClick={handleSendReply} disabled={!adminReply.trim() || !adminReplyDate.trim()} style={{ fontSize: 13, padding: '5px 18px', background: replySaved ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', opacity: adminReply.trim() && adminReplyDate.trim() ? 1 : 0.5 }}>
                            {replySaved ? '✓ ' + lang.system.replySent : lang.system.send}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                <>
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
                </>
                )}
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
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', ...GRANITE_BG, padding: '32px 28px', boxSizing: 'border-box', direction: 'rtl' }}>
      <PageHeader subtitle={`${lang.card.infoServices} - ${lang.menu[1]}`} lang={lang} />

      <div style={{ position: 'absolute', top: '220px', right: 0, width: 'calc(50% - 420px)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '28px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
        {lang.captions.updatesWord1}<br/>{lang.captions.updatesWord2}<br/>{lang.captions.updatesWord3}<br/>{lang.captions.updatesWord4}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'min-content' }}>
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

function PageHeader({ subtitle, layout = 'row', lang, extra }: { subtitle: string; layout?: 'row' | 'column'; lang: typeof languages[0]; extra?: React.ReactNode }) {
  const textDir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'
  return (
    <div className={layout === 'column' ? 'page-header-block stack' : 'page-header-block'} dir="rtl">
      <style>{PAGE_HEADER_CSS}</style>
      <div className="site-header" dir={textDir}>
        <span>{lang.card.siteHeaderPrefix}</span>
        <span className="brand-script">KeyClick</span>
        <span>-</span>
        <span>M Solution Group</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div className="page-subtitle">{subtitle}</div>
        {extra}
      </div>
    </div>
  )
}

type VisitRecord = { id: number; ip: string | null; user_name: string | null; entered_at: string; last_seen_at: string; country: string | null; region: string | null }
type SamplingConfig = { runEnabled: boolean; startDate: string | null; endDate: string | null; endEnabled: boolean }

function VisitsTable({ lang, visits: liveVisits, reload, samplingConfig, onUpdateSamplingConfig, onDbg }: { lang: typeof languages[0]; visits: VisitRecord[]; reload: () => void; samplingConfig: SamplingConfig; onUpdateSamplingConfig: (next: SamplingConfig) => void; onDbg: (func: string, msg: string) => void }) {
  const [sortField, setSortField] = useState<'num' | 'ip' | 'entered' | 'exited' | 'duration' | 'name' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [paused, setPaused] = useState(false)
  const [frozenVisits, setFrozenVisits] = useState<VisitRecord[]>(liveVisits)
  const [justRefreshed, setJustRefreshed] = useState(false)

  useEffect(() => {
    onDbg('VisitsTable', `liveVisits changed count=${liveVisits.length} paused=${paused}`)
    if (!paused) setFrozenVisits(liveVisits)
  }, [liveVisits, paused])

  const visits = frozenVisits

  const handleReset = async () => {
    onDbg('VisitsTable.handleReset', 'DELETE /api/visits')
    await fetch('/api/visits', { method: 'DELETE' }).catch(e => onDbg('VisitsTable.handleReset', `error: ${String(e)}`))
    reload()
  }
  const handleRefresh = async () => {
    onDbg('VisitsTable.handleRefresh', 'start')
    let clientIp = ''
    try {
      const r = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      clientIp = d.ip || ''
      onDbg('VisitsTable.handleRefresh', `ipify ok ip="${clientIp}"`)
    } catch (e) { onDbg('VisitsTable.handleRefresh', `ipify failed/timeout: ${String(e)}`) }
    await fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientIp }) }).catch(e => onDbg('VisitsTable.handleRefresh', `POST error: ${String(e)}`))
    reload()
    setJustRefreshed(true)
    setTimeout(() => setJustRefreshed(false), 1000)
  }
  const handleTogglePause = () => {
    onDbg('VisitsTable.handleTogglePause', `paused ${paused} => ${!paused}`)
    const next = !paused
    setPaused(next)
    if (!next) setFrozenVisits(liveVisits)
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }
    else { setSortField(field); setSortDir('asc') }
  }

  const ipHex = (ip: string | null) => {
    if (!ip) return ''
    const parts = ip.split('.')
    return parts.length === 4 ? parts.map(n => parseInt(n).toString(16).padStart(2, '0').toUpperCase()).join('') : ''
  }
  const fmtDateTime = (iso: string) => {
    const d = new Date(iso)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    return (
      <span style={{ direction: 'ltr', unicodeBidi: 'bidi-override', display: 'inline-block' }}>{date} {time}</span>
    )
  }
  const hasExited = (v: VisitRecord) => new Date(v.last_seen_at).getTime() - new Date(v.entered_at).getTime() > 1000
  const durationMs = (v: VisitRecord) => new Date(v.last_seen_at).getTime() - new Date(v.entered_at).getTime()
  const liveDurationMs = (v: VisitRecord) => hasExited(v) ? durationMs(v) : Date.now() - new Date(v.entered_at).getTime()
  const fmtDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const numbered = visits.map((v, i) => ({ v, num: i + 1 }))
  const sorted = [...numbered].sort((a, b) => {
    let cmp = 0
    if (sortField === 'num') cmp = a.num - b.num
    else if (sortField === 'ip') cmp = (a.v.ip || '').localeCompare(b.v.ip || '')
    else if (sortField === 'entered') cmp = new Date(a.v.entered_at).getTime() - new Date(b.v.entered_at).getTime()
    else if (sortField === 'exited') cmp = new Date(a.v.last_seen_at).getTime() - new Date(b.v.last_seen_at).getTime()
    else if (sortField === 'duration') cmp = liveDurationMs(a.v) - liveDurationMs(b.v)
    else if (sortField === 'name') cmp = (a.v.user_name || '').localeCompare(b.v.user_name || '')
    return sortDir === 'asc' ? cmp : -cmp
  })

  const thS: React.CSSProperties = { padding: '6px 8px', background: '#003399', color: '#FFD700', fontWeight: 'bold', fontSize: 12, whiteSpace: 'nowrap', border: '1px solid #1144aa', textAlign: 'center', cursor: 'pointer', userSelect: 'none' }
  const tdS: React.CSSProperties = { padding: '5px 8px', fontSize: 12, border: '1px solid #c0c8e0', whiteSpace: 'nowrap', textAlign: 'center' }

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'flex-start', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, direction: 'rtl' }}>
        <thead>
          <tr>
            <th style={thS} onClick={() => toggleSort('num')}></th>
            <th style={{ ...thS, minWidth: '160px' }} onClick={() => toggleSort('ip')}>{lang.system.colIp}</th>
            <th style={{ ...thS, minWidth: '140px' }} onClick={() => toggleSort('entered')}>{lang.system.colEntered}</th>
            <th style={{ ...thS, minWidth: '140px' }} onClick={() => toggleSort('exited')}>{lang.system.colExited}</th>
            <th style={thS} onClick={() => toggleSort('duration')}>{lang.system.colDuration}</th>
            <th style={{ ...thS, minWidth: '160px' }} onClick={() => toggleSort('name')}>{lang.system.colName}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ v, num }, i) => (
            <tr key={v.id} style={{ background: i % 2 === 0 ? '#fff' : '#f4f6ff' }}>
              <td style={tdS}>{num}</td>
              <td style={{ ...tdS, minWidth: '160px', direction: 'ltr' }}>{v.ip || ''}{v.ip && ipHex(v.ip) ? ` (${ipHex(v.ip)})` : ''}</td>
              <td style={{ ...tdS, direction: 'ltr' }}>{fmtDateTime(v.entered_at)}</td>
              <td style={{ ...tdS, direction: 'ltr' }}>{hasExited(v) ? fmtDateTime(v.last_seen_at) : ''}</td>
              <td style={tdS}>{fmtDuration(liveDurationMs(v))}</td>
              <td style={{ ...tdS, minWidth: '160px' }}>{v.user_name || ''}</td>
            </tr>
          ))}
          {visits.length === 0 && (
            <tr><td colSpan={6} style={{ ...tdS, padding: 20, color: '#888' }}>{lang.system.noMessages}</td></tr>
          )}
        </tbody>
      </table>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <button onClick={handleReset} style={{ padding: '6px 14px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{lang.system.reset}</button>
        <button onClick={handleRefresh} style={{ padding: '6px 14px', background: justRefreshed ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{lang.system.refresh}</button>
        <button onClick={handleTogglePause} style={{ padding: '6px 14px', background: paused ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{paused ? lang.system.resume : lang.system.pause}</button>

        <div style={{ textAlign: 'right', marginTop: -12, marginLeft: 150, fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: 32, color: '#cc0000', fontWeight: 'bold' }}>
          {samplingConfig.runEnabled ? lang.system.runStatusRunning : lang.system.runStatusStopped}
        </div>
        <fieldset style={{ marginTop: 4, border: '2px solid #003399', borderRadius: 6, padding: '10px 12px 12px' }}>
          <legend style={{ fontSize: 16, fontWeight: 'bold', color: '#003399', padding: '0 6px' }}>{lang.system.dataCollectionLegend}</legend>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: 16, fontWeight: 'bold', color: '#003399' }}>{lang.system.collectionEnd}</label>
              <input type="datetime-local" value={samplingConfig.endDate ?? ''} disabled={!samplingConfig.endEnabled}
                onChange={e => onUpdateSamplingConfig({ ...samplingConfig, endDate: e.target.value || null })}
                style={{ fontSize: 15, padding: '6px 8px', border: '1px solid #6688bb', borderRadius: 5, background: samplingConfig.endEnabled ? '#006600' : '#888', color: '#FFD700', direction: 'ltr' }} />
              <button onClick={() => onUpdateSamplingConfig({ ...samplingConfig, endEnabled: !samplingConfig.endEnabled })}
                style={{ padding: '6px 10px', background: samplingConfig.endEnabled ? '#006600' : '#cc0000', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>
                {samplingConfig.endEnabled ? lang.system.endToggleActive : lang.system.endToggleInactive}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: 16, fontWeight: 'bold', color: '#003399' }}>{lang.system.collectionStart}</label>
              <input type="datetime-local" value={samplingConfig.startDate ?? ''}
                onChange={e => onUpdateSamplingConfig({ ...samplingConfig, startDate: e.target.value || null })}
                style={{ fontSize: 15, padding: '6px 8px', border: '1px solid #6688bb', borderRadius: 5, background: '#006600', color: '#FFD700', direction: 'ltr' }} />
            </div>
          </div>
        </fieldset>
        <button onClick={() => onUpdateSamplingConfig({ ...samplingConfig, runEnabled: !samplingConfig.runEnabled })}
          style={{ marginTop: 8, padding: '6px 14px', background: samplingConfig.runEnabled ? '#cc0000' : '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>
          {samplingConfig.runEnabled ? lang.system.runToggleActive : lang.system.runToggleInactive}
        </button>
      </div>
    </div>
  )
}

const PROC_CSS = `
  .kc-proc-card{ animation: kcProcFadeIn 0.5s ease both; }
  @keyframes kcProcFadeIn{ from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:none; } }
  .kc-proc-pulse-dot{ animation: kcProcPulse 1.6s ease-in-out infinite; }
  @keyframes kcProcPulse{ 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.35; transform:scale(1.7); } }
  .kc-proc-current-wedge{ animation: kcProcGlow 1.8s ease-in-out infinite; }
  @keyframes kcProcGlow{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
  @media (prefers-reduced-motion: reduce){
    .kc-proc-card, .kc-proc-pulse-dot, .kc-proc-current-wedge{ animation:none !important; }
  }
`

const PROC_LOCALE: Record<string, string> = { en: 'en-US', ru: 'ru-RU', de: 'de-DE', fr: 'fr-FR', he: 'he-IL', es: 'es-ES', ja: 'ja-JP', ar: 'ar-SA', zh: 'zh-CN', it: 'it-IT', hi: 'hi-IN' }

function ProcessingPage({ lang, visits: liveVisits, reload, onDbg, samplingConfig }: { lang: typeof languages[0]; visits: VisitRecord[]; reload: () => void; onDbg: (func: string, msg: string) => void; samplingConfig: SamplingConfig }) {
  const dragScrollRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{ startX: number; startScroll: number } | null>(null)
  const dragScrollRef2 = useRef<HTMLDivElement>(null)
  const dragStateRef2 = useRef<{ startX: number; startScroll: number } | null>(null)
  const [paused, setPaused] = useState(false)
  const [frozenVisits, setFrozenVisits] = useState<VisitRecord[]>(liveVisits)
  const [justRefreshed, setJustRefreshed] = useState(false)

  useEffect(() => {
    onDbg('ProcessingPage', `liveVisits changed count=${liveVisits.length} paused=${paused}`)
    if (!paused) setFrozenVisits(liveVisits)
  }, [liveVisits, paused])

  const visits = frozenVisits

  const handleReset = async () => {
    onDbg('ProcessingPage.handleReset', 'DELETE /api/visits')
    await fetch('/api/visits', { method: 'DELETE' }).catch(e => onDbg('ProcessingPage.handleReset', `error: ${String(e)}`))
    reload()
  }
  const handleRefresh = async () => {
    onDbg('ProcessingPage.handleRefresh', 'start')
    let clientIp = ''
    try {
      const r = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      clientIp = d.ip || ''
      onDbg('ProcessingPage.handleRefresh', `ipify ok ip="${clientIp}"`)
    } catch (e) { onDbg('ProcessingPage.handleRefresh', `ipify failed/timeout: ${String(e)}`) }
    await fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientIp }) }).catch(e => onDbg('ProcessingPage.handleRefresh', `POST error: ${String(e)}`))
    reload()
    if (dragScrollRef.current) dragScrollRef.current.scrollLeft = dragScrollRef.current.scrollWidth
    if (dragScrollRef2.current) dragScrollRef2.current.scrollLeft = dragScrollRef2.current.scrollWidth
    setJustRefreshed(true)
    setTimeout(() => setJustRefreshed(false), 1000)
  }
  const handleTogglePause = () => {
    onDbg('ProcessingPage.handleTogglePause', `paused ${paused} => ${!paused}`)
    const next = !paused
    setPaused(next)
    if (!next) setFrozenVisits(liveVisits)
  }

  useEffect(() => {
    if (dragScrollRef.current) dragScrollRef.current.scrollLeft = dragScrollRef.current.scrollWidth
    if (dragScrollRef2.current) dragScrollRef2.current.scrollLeft = dragScrollRef2.current.scrollWidth
  }, [visits])

  const isOpen = (v: VisitRecord) => new Date(v.last_seen_at).getTime() - new Date(v.entered_at).getTime() <= 1000
  const durationMs = (v: VisitRecord) => new Date(v.last_seen_at).getTime() - new Date(v.entered_at).getTime()

  const total = visits.length

  const weekStartOf = (d: Date) => { const s = new Date(d); s.setHours(0, 0, 0, 0); s.setDate(s.getDate() - s.getDay()); return s }
  const weekKeyOf = (d: Date) => weekStartOf(d).getTime()

  type Week = { weekStart: Date; entriesReg: number; entriesAnon: number; durSumReg: number; durCountReg: number; durSumAnon: number; durCountAnon: number; monthIdx: number }
  const weeks: Week[] = []
  if (total > 0) {
    const minWeek = weekStartOf(new Date(Math.min(...visits.map(v => new Date(v.entered_at).getTime()))))
    const maxWeek = weekStartOf(new Date())
    let i = 0
    for (let cur = new Date(maxWeek); cur.getTime() >= minWeek.getTime(); cur.setDate(cur.getDate() - 7), i++) {
      weeks.push({ weekStart: new Date(cur), entriesReg: 0, entriesAnon: 0, durSumReg: 0, durCountReg: 0, durSumAnon: 0, durCountAnon: 0, monthIdx: Math.floor(i / 4) })
    }
    const byWeekKey = new Map<number, Week>()
    weeks.forEach(w => byWeekKey.set(weekKeyOf(w.weekStart), w))
    visits.forEach(v => {
      const w = byWeekKey.get(weekKeyOf(new Date(v.entered_at)))
      if (!w) return
      const isReg = !!v.user_name
      if (isReg) w.entriesReg++; else w.entriesAnon++
      const m = (isOpen(v) ? Date.now() - new Date(v.entered_at).getTime() : durationMs(v)) / 60000
      if (isReg) { w.durSumReg += m; w.durCountReg++ } else { w.durSumAnon += m; w.durCountAnon++ }
    })
  }

  useEffect(() => {
    onDbg('ProcessingPage.compute', `total=${total} weeks=${weeks.length}`)
  }, [total, weeks.length])

  const GRID_ROWS = 4
  const niceMax = (v: number) => Math.max(GRID_ROWS, Math.ceil(v / GRID_ROWS) * GRID_ROWS)
  const maxEntries = niceMax(Math.max(1, ...weeks.map(w => w.entriesReg + w.entriesAnon)))
  const sumRegOf = (w: Week) => w.durSumReg
  const sumAnonOf = (w: Week) => w.durSumAnon
  const fmtHMS = (mins: number) => {
    const totalSec = Math.round(mins * 60)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  const maxDurSum = niceMax(Math.max(1, ...weeks.map(w => sumRegOf(w) + sumAnonOf(w))))
  const monthCount = weeks.length ? weeks[weeks.length - 1].monthIdx + 1 : 0
  const monthLabel = (m: number) => {
    if (!weeks.length) return ''
    const base = weeks[0].weekStart
    const d = new Date(base.getFullYear(), base.getMonth() + m, 1)
    return `${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const CHART_H = 220
  const TOP_PAD = 16
  const WEEK_W = 26
  const Y_AXIS_W = 60
  const MIN_MONTH_SLOTS = 36
  const totalMonthSlots = Math.max(monthCount, MIN_MONTH_SLOTS)
  const chartW = totalMonthSlots * 4 * WEEK_W
  const weekX = (i: number) => chartW - WEEK_W - i * WEEK_W
  const monthDividerX = (m: number) => chartW - m * 4 * WEEK_W
  const monthLabelX = (m: number) => chartW - (m * 4 * WEEK_W + 2 * WEEK_W)
  const DEPTH_X = 4
  const DEPTH_Y = -4

  const shadeColor = (hex: string, amt: number) => {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.min(255, Math.max(0, (num >> 16 & 0xff) + amt))
    const g = Math.min(255, Math.max(0, (num >> 8 & 0xff) + amt))
    const b = Math.min(255, Math.max(0, (num & 0xff) + amt))
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  const PrismBar = ({ x, w, h, chartH, color }: { x: number; w: number; h: number; chartH: number; color: string }) => {
    if (h <= 0) return null
    const top = chartH - h
    return (
      <g>
        <rect x={x} y={top} width={w} height={h} fill={color} />
        <polygon points={`${x},${top} ${x + w},${top} ${x + w + DEPTH_X},${top + DEPTH_Y} ${x + DEPTH_X},${top + DEPTH_Y}`} fill={shadeColor(color, 40)} />
        <polygon points={`${x + w},${top} ${x + w + DEPTH_X},${top + DEPTH_Y} ${x + w + DEPTH_X},${chartH + DEPTH_Y} ${x + w},${chartH}`} fill={shadeColor(color, -40)} />
      </g>
    )
  }

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragScrollRef.current) return
    dragStateRef.current = { startX: e.clientX, startScroll: dragScrollRef.current.scrollLeft }
    dragScrollRef.current.setPointerCapture(e.pointerId)
  }
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current || !dragScrollRef.current) return
    dragScrollRef.current.scrollLeft = dragStateRef.current.startScroll - (e.clientX - dragStateRef.current.startX)
  }
  const onDragEnd = () => { dragStateRef.current = null }

  const onDragStart2 = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragScrollRef2.current) return
    dragStateRef2.current = { startX: e.clientX, startScroll: dragScrollRef2.current.scrollLeft }
    dragScrollRef2.current.setPointerCapture(e.pointerId)
  }
  const onDragMove2 = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef2.current || !dragScrollRef2.current) return
    dragScrollRef2.current.scrollLeft = dragStateRef2.current.startScroll - (e.clientX - dragStateRef2.current.startX)
  }
  const onDragEnd2 = () => { dragStateRef2.current = null }

  const graphCardS: React.CSSProperties = { background: '#ffffff', borderRadius: 6, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.15)', border: '1px solid #ddd' }

  return (
    <div style={{ padding: '0 16px 16px 16px', width: '100%', position: 'relative' }}>
      <style>{PROC_CSS}</style>
      <div style={{ position: 'absolute', top: 0, right: 12, fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: 32, color: '#cc0000', fontWeight: 'bold' }}>
        {samplingConfig.runEnabled ? lang.system.runStatusRunning : lang.system.runStatusStopped}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ display: 'inline-flex', gap: 8 }}>
            <button onClick={handleReset} style={{ padding: '6px 14px', background: '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{lang.system.reset}</button>
            <button onClick={handleRefresh} style={{ padding: '6px 14px', background: justRefreshed ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{lang.system.refresh}</button>
            <button onClick={handleTogglePause} style={{ padding: '6px 14px', background: paused ? '#006600' : '#003399', color: '#FFD700', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>{paused ? lang.system.resume : lang.system.pause}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, background: '#e02020', borderRadius: 2 }} />
              <span style={{ fontSize: 13, fontWeight: 'bold' }}>{lang.system.legendUnregistered}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, background: '#003399', borderRadius: 2 }} />
              <span style={{ fontSize: 13, fontWeight: 'bold' }}>{lang.system.legendRegistered}</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#cc0000', whiteSpace: 'nowrap', width: 170, textAlign: 'right', marginRight: -170 }}>{lang.system.graphEntriesTitle}</div>
            <div className="kc-proc-card" style={{ ...graphCardS, flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <svg width={Y_AXIS_W} height={CHART_H + 24 + TOP_PAD} style={{ display: 'block', flexShrink: 0 }}>
                {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => {
                  const y = (CHART_H / GRID_ROWS) * r
                  const val = Math.round(maxEntries * (1 - r / GRID_ROWS))
                  return <text key={`yl${r}`} x={6} y={y + TOP_PAD + 4} fontSize={10} fontWeight="bold" fill="#003399" textAnchor="start">{val}</text>
                })}
                <line x1={0} y1={TOP_PAD} x2={0} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
              </svg>
              <div
                ref={dragScrollRef}
                onPointerDown={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerLeave={onDragEnd}
                style={{ overflowX: 'auto', cursor: 'grab', direction: 'ltr' }}
              >
                <svg width={chartW + DEPTH_X} height={CHART_H - DEPTH_Y + 24 + TOP_PAD} style={{ display: 'block' }}>
                  {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => {
                    const y = (CHART_H / GRID_ROWS) * r + TOP_PAD
                    return <line key={`h${r}`} x1={0} y1={y} x2={chartW} y2={y} stroke="#A9A9A9" strokeWidth={1} />
                  })}
                  <line x1={0} y1={CHART_H + TOP_PAD} x2={chartW} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
                  {Array.from({ length: totalMonthSlots * 4 + 1 }).map((_, i) => (
                    <line key={`vw${i}`} x1={chartW - i * WEEK_W} y1={TOP_PAD} x2={chartW - i * WEEK_W} y2={CHART_H + TOP_PAD} stroke="#B0B0B0" strokeWidth={1} />
                  ))}
                  {Array.from({ length: totalMonthSlots + 1 }).map((_, m) => (
                    <line key={`v${m}`} x1={monthDividerX(m)} y1={TOP_PAD} x2={monthDividerX(m)} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
                  ))}
                  {weeks.map((w, i) => {
                    const barHAnon = (w.entriesAnon / maxEntries) * (CHART_H - 6)
                    const barHReg = (w.entriesReg / maxEntries) * (CHART_H - 6)
                    const x = weekX(i)
                    return (
                      <g key={i}>
                        <PrismBar x={x + 5} w={WEEK_W - 10} h={barHAnon} chartH={CHART_H + TOP_PAD} color="#e02020" />
                        <PrismBar x={x + 5} w={WEEK_W - 10} h={barHReg} chartH={CHART_H + TOP_PAD - barHAnon} color="#003399" />
                      </g>
                    )
                  })}
                  {Array.from({ length: totalMonthSlots }).map((_, m) => (
                    <text key={`ml${m}`} x={monthLabelX(m)} y={CHART_H + TOP_PAD + 16} fontSize={11} fontWeight="bold" fill="#003399" textAnchor="middle">{monthLabel(m)}</text>
                  ))}
                </svg>
              </div>
            </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 170, textAlign: 'right', marginRight: -170 }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#cc0000', whiteSpace: 'nowrap' }}>{lang.system.graphDurationTitle}</div>
            </div>
            <div className="kc-proc-card" style={{ ...graphCardS, flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <svg width={Y_AXIS_W} height={CHART_H + 24 + TOP_PAD} style={{ display: 'block', flexShrink: 0 }}>
                {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => {
                  const y = (CHART_H / GRID_ROWS) * r
                  const val = maxDurSum * (1 - r / GRID_ROWS)
                  return <text key={`yl${r}`} x={4} y={y + TOP_PAD + 4} fontSize={9} fontWeight="bold" fill="#003399" textAnchor="start">{fmtHMS(val)}</text>
                })}
                <line x1={0} y1={TOP_PAD} x2={0} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
              </svg>
              <div
                ref={dragScrollRef2}
                onPointerDown={onDragStart2}
                onPointerMove={onDragMove2}
                onPointerUp={onDragEnd2}
                onPointerLeave={onDragEnd2}
                style={{ overflowX: 'auto', cursor: 'grab', direction: 'ltr' }}
              >
                <svg width={chartW + DEPTH_X} height={CHART_H - DEPTH_Y + 24 + TOP_PAD} style={{ display: 'block' }}>
                  {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => {
                    const y = (CHART_H / GRID_ROWS) * r + TOP_PAD
                    return <line key={`h${r}`} x1={0} y1={y} x2={chartW} y2={y} stroke="#A9A9A9" strokeWidth={1} />
                  })}
                  <line x1={0} y1={CHART_H + TOP_PAD} x2={chartW} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
                  {Array.from({ length: totalMonthSlots * 4 + 1 }).map((_, i) => (
                    <line key={`vw${i}`} x1={chartW - i * WEEK_W} y1={TOP_PAD} x2={chartW - i * WEEK_W} y2={CHART_H + TOP_PAD} stroke="#B0B0B0" strokeWidth={1} />
                  ))}
                  {Array.from({ length: totalMonthSlots + 1 }).map((_, m) => (
                    <line key={`v${m}`} x1={monthDividerX(m)} y1={TOP_PAD} x2={monthDividerX(m)} y2={CHART_H + TOP_PAD} stroke="#003399" strokeWidth={1.5} />
                  ))}
                  {weeks.map((w, i) => {
                    const sumReg = sumRegOf(w)
                    const sumAnon = sumAnonOf(w)
                    const barHAnon = (sumAnon / maxDurSum) * (CHART_H - 6)
                    const barHReg = (sumReg / maxDurSum) * (CHART_H - 6)
                    const x = weekX(i)
                    return (
                      <g key={i}>
                        <PrismBar x={x + 5} w={WEEK_W - 10} h={barHAnon} chartH={CHART_H + TOP_PAD} color="#e02020" />
                        <PrismBar x={x + 5} w={WEEK_W - 10} h={barHReg} chartH={CHART_H + TOP_PAD - barHAnon} color="#003399" />
                      </g>
                    )
                  })}
                  {Array.from({ length: totalMonthSlots }).map((_, m) => (
                    <text key={`ml${m}`} x={monthLabelX(m)} y={CHART_H + TOP_PAD + 16} fontSize={11} fontWeight="bold" fill="#003399" textAnchor="middle">{monthLabel(m)}</text>
                  ))}
                </svg>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GUIDES_CSS = `
  .guides-page, .guides-page *{ box-sizing:border-box; }

  .guides-page{
    position:relative;
    height:100%;
    margin:0;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:26px;
    padding:32px 20px 90px;
    overflow:auto;
    background-color:#e3e3e6;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0' result='grey'/%3E%3CfeComponentTransfer in='grey'%3E%3CfeFuncR type='linear' slope='2.5' intercept='-0.95'/%3E%3CfeFuncG type='linear' slope='2.7' intercept='-0.9'/%3E%3CfeFuncB type='linear' slope='3.4' intercept='-0.78'/%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    background-position: 0 0, 3px 5px, 6px 2px;
    font-family:"Segoe UI","Segoe UI Semibold",Arial,sans-serif;
    color:#131a3d;
  }

  .guides-page .eyebrow{ font-size:13px; letter-spacing:.06em; color:#7c5c1c; opacity:.9; }

  .guides-page .side-caption{
    position:absolute;
    top:62%;
    transform:translateY(-50%);
    font-family:"Guttman Yad Brush","Guttman Yad","Levenim MT",serif;
    font-size:40px;
    line-height:1.15;
    color:#c31432;
    text-align:center;
    text-shadow:0 2px 4px rgba(0,0,0,.15);
  }
  .guides-page .side-caption .cap-line{
    width:fit-content;
    margin:0 auto 26px;
    border-bottom:4px solid #0a8a2c;
    padding-bottom:6px;
    transform:rotate(10deg);
  }
  .guides-page .side-caption .cap-line:last-child{ margin-bottom:0; }
  .guides-page .side-caption.right{ right:0; width:calc(50% - 270px); font-size:32px; }
  .guides-page .side-caption.right .cap-line{ border-bottom:none; padding-bottom:0; transform:none; }
  .guides-page .side-caption.left{ left:0; width:calc(50% - 270px); }

  @media (max-width:1100px){
    .guides-page .side-caption{ display:none; }
  }

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

function GuidesDrawer({ id, label, title, desc, openId, setOpenId, comingSoon, onOpen }: {
  id: string; label: string; title: string; desc: string; comingSoon: string
  openId: string | null; setOpenId: (v: string | null) => void; onOpen?: () => void
}) {
  const open = openId === id
  return (
    <div className={open ? 'drawer open' : 'drawer'} data-id={id}>
      <button className="d-front" aria-expanded={open} onClick={() => onOpen ? onOpen() : setOpenId(open ? null : id)}>
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

function GuidesPage({ lang, onNavigate }: { lang: typeof languages[0]; onNavigate: (page: string) => void }) {
  const [openFin, setOpenFin] = useState<string | null>(null)
  const [openSite, setOpenSite] = useState<string | null>(null)

  const g = lang.guides

  return (
    <div className="guides-page" dir="rtl">
      <style>{GUIDES_CSS}</style>

      <PageHeader subtitle={lang.card.guidesAndVideos} layout="column" lang={lang} />

      <div className="side-caption right">
        <div className="cap-line">{lang.captions.guidesRight1}</div>
        <div className="cap-line">{lang.captions.guidesRight2}</div>
      </div>
      <div className="side-caption left">
        <div className="cap-line">{lang.captions.guidesLeft}</div>
      </div>

      <div className="furniture">
        <div className="cap"><span className="brandplate">KeyClick</span></div>

        <div className="cabinet">
          <div className="columns">

            <div className="column">
              <div className="col-plate script">{lang.card.title}</div>
              <GuidesDrawer id="fin-overview" label={`4 ${g.overview}`} title={g.financeOverviewTitle} desc={g.financeOverviewDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} onOpen={() => onNavigate('guides-fin-overview')} />
              <GuidesDrawer id="fin-guide" label={`5 ${g.userGuide}`} title={g.financeGuideTitle} desc={g.financeGuideDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} onOpen={() => onNavigate('guides-fin-guide')} />
              <GuidesDrawer id="fin-videos" label={`6 ${lang.card.videos}`} title={g.financeVideosTitle} desc={g.financeVideosDesc} comingSoon={lang.profile.comingSoon} openId={openFin} setOpenId={setOpenFin} onOpen={() => onNavigate('guides-fin-videos')} />
            </div>

            <div className="column">
              <div className="col-plate script">{lang.card.theWebsite}</div>
              <GuidesDrawer id="site-overview" label={`1 ${g.overview}`} title={g.siteOverviewTitle} desc={g.siteOverviewDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} onOpen={() => onNavigate('guides-site-overview')} />
              <GuidesDrawer id="site-guide" label={`2 ${g.userGuide}`} title={g.siteGuideTitle} desc={g.siteGuideDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} onOpen={() => onNavigate('guides-site-guide')} />
              <GuidesDrawer id="site-videos" label={`3 ${lang.card.videos}`} title={g.siteVideosTitle} desc={g.siteVideosDesc} comingSoon={lang.profile.comingSoon} openId={openSite} setOpenId={setOpenSite} onOpen={() => onNavigate('guides-site-videos')} />
            </div>

          </div>
        </div>

        <div className="feet"><div className="foot" /><div className="foot" /></div>
      </div>
    </div>
  )
}

type GuideSection = { heading: string; body: string; image?: { src: string; width: number; height: number } }

const SITE_OVERVIEW_TITLES: Record<string, string> = {
  he: 'אתר KeyClick - תיאור כללי',
  en: 'KeyClick Website - General Overview',
  ru: 'Сайт KeyClick — общее описание',
  de: 'KeyClick Website - Allgemeine Übersicht',
  fr: 'Site KeyClick - Présentation générale',
  es: 'Sitio KeyClick - Descripción general',
  ja: 'KeyClickウェブサイト - 概要',
  ar: 'موقع KeyClick - نظرة عامة',
  zh: 'KeyClick 网站 - 概述',
  it: 'Sito KeyClick - Panoramica generale',
  hi: 'KeyClick वेबसाइट - सामान्य विवरण',
}

const SITE_GUIDE_TITLES: Record<string, string> = {
  he: 'אתר KeyClick – מדריך למשתמש',
  en: 'KeyClick Website – User Guide',
  ru: 'Сайт KeyClick – руководство пользователя',
  de: 'KeyClick Website – Benutzerhandbuch',
  fr: "Site KeyClick – Guide de l'utilisateur",
  es: 'Sitio KeyClick – Guía del usuario',
  ja: 'KeyClickウェブサイト – ユーザーガイド',
  ar: 'موقع KeyClick – دليل المستخدم',
  zh: 'KeyClick 网站 – 用户指南',
  it: "Sito KeyClick – Guida per l'utente",
  hi: 'KeyClick वेबसाइट – उपयोगकर्ता गाइड',
}

const FINANCE_OVERVIEW_TITLES: Record<string, string> = {
  he: 'ניהול תקציב בית M_Finance – תיאור כללי',
  en: 'Home Budget Management M_Finance – General Overview',
  ru: 'Управление семейным бюджетом M_Finance – общее описание',
  de: 'Haushaltsbudgetverwaltung M_Finance – Allgemeine Übersicht',
  fr: 'Gestion du budget familial M_Finance – Présentation générale',
  es: 'Gestión del presupuesto familiar M_Finance – Descripción general',
  ja: '家計管理 M_Finance – 概要',
  ar: 'إدارة ميزانية المنزل M_Finance – نظرة عامة',
  zh: '家庭预算管理 M_Finance – 总体介绍',
  it: 'Gestione del bilancio familiare M_Finance – Descrizione generale',
  hi: 'गृह बजट प्रबंधन M_Finance – सामान्य विवरण',
}

const FINANCE_OVERVIEW_SECTIONS: Record<string, GuideSection[]> = {
  he: [
    { heading: '', body: 'פרויקט ניהול תקציב בית M Finance, הנו אחד מהפתרונות הדיגיטאליים של פרויקט M Solution, ונקרא בשם הכולל והמותג KeyClick. מערכת ניהול תקציב בית משמשת כאפליקציה אשר מרכזת את כל התנועות הכספיות של הלקוח – הוצאות והכנסות מהבנק ומכרטיסי האשראי – למקום אחד ומציגה אותן בצורה מאורגנת וברורה. מעבר לתיעוד העבר, המערכת מספקת גם כלים אינטראקטיביים לתכנון עתידי, תרשימים גרפיים בחתכים שונים.' },
    { heading: 'עוגת תקציב חיה', body: '"עוגת תקציב חיה" - הדובדבן שבקצפת. עוגה אשר הפרוסות שלה מציגות את ההוצאות מונחות על עוגת ההכנסות. מנגנון חכם ואינטראקטיבי מאפשר ללקוח באופן ידני לשנות את ערכי העוגה ולהגיע למאזן רצוי.' },
    { heading: 'כרטיסי אשראי', body: 'לחיובי כרטיסי האשראי יש התנהגות שונה מתנועת בנק רגילה - פריסה לתשלומים, ופער בין מועד הרכישה למועד החיוב בפועל. המערכת מטפלת בכך בנפרד, ומשלבת את התוצאה בחזרה לתמונה הכוללת בצורה מדויקת.' },
    { heading: 'מטרה והיקף', body: 'ניהול תקציב בית מאפשרת לקבל החלטות על בסיס נתונים אמיתיים במקום להסתמך על זיכרון או הערכה כללית. הלקוח מקבל תמונה מלאה ומדויקת לאורך זמן.\nמטרת המערכת היא לצמצם את העבודה הידנית הכרוכה במעקב אחרי הכספים ולתת ללקוח כלי לקבלת החלטות מבוססות נתונים, במקום החלטות מבוססות תחושה. היקף כולל תיעוד מלא של העבר (מה כבר קרה), ניתוח של המצב הנוכחי (איך מתחלקות ההוצאות) והסתכלות קדימה (מה צפוי בחודשים הבאים). המערכת אינה עוסקת בביצוע פעולות בנקאיות בפועל (העברות, תשלומים), העיסוק הנו אך ורק באיסוף, ארגון והצגה של המידע הכספי החודשי והשנתי.' },
    { heading: 'השאיפה', body: 'השאיפה היא שניהול תקציב בית תאפשר לייבא דפי חשבון מבנקים וכרטיסי אשראי ממוסדות חובקות עולם - כולל בעתיד חיבור ישיר ואוטומטי לחשבון הבנק, לא רק ייבוא ידני של קבצים - לסווג פעולות, לעקוב אחר הוצאות/הכנסות לאורך זמן ולתכנן קדימה. כלי אחיד שמשלב את כולם לתמונה חודשית/שנתית אחת, זיהוי אוטומטי של פורמט הנתונים, סווג כל עסקה והצגתה. הניתוח המקיף מתבצע בממשק פשוט וב-11 שפות.' },
    { heading: 'התקנה ועדכונים', body: 'ההתקנה והעדכונים מתבצעים דרך אתר KeyClick באופן שקוף ללקוח, כך שהוא תמיד עובד עם הגרסה העדכנית ביותר בלי לבצע פעולה יזומה.' },
    { heading: 'ארכיטקטורה - שכבות המערכת', body: 'המערכת בנויה בשלוש שכבות:\n\n1. שכבת ממשק (UI Layer)\n•    פקודות ובחירות מפקדי מערכת הבקרה\n•    דו שיח אדם-מכונה\n•    גישה לתיקיות ושליפת קבצים\n•    זיהוי סוגי קבצים\n•    בניית ממשק (API) אחיד\n•    ניהול בסיס נתונים\n•    יצירת סביבת בדיקה\n\n2. שכבת לוגיקה (Logic Layer)\n•    קריאת נתונים, מניעת כפילויות\n•    מיפוי פורמטים של מוסדות\n•    מנוע סיווג\n•    כללי סיווג מקומיים\n•    בניית תצוגות\n•    מפעל טבלאות\n\n3. שכבת נתונים (Data Layer)\n•    הגדרות, רשומות, רשימות גלובליות\n•    טעינה/שמירה XML\n•    קובץ מסד הנתונים\n•    זיכרון סיווגים' },
    { heading: 'פאנל הבקרה - העבר לשמאל או ימין', body: 'פאנל הבקרה הראשי מוצג קבוע מימין לתצוגה. בלחיצה על בורר בתחתית הפאנל, פאנל הבקרה עובר לשמאל התצוגה, על פי העדפת הלקוח.' },
    { heading: 'בינה מלאכותית', body: 'האלגוריתמים החכמים באפליקציה משתמשים בבינה מלאכותית. נורית AI בתחתית הפאנל מציגה את זמינות הבינה המלאכותית.' },
  ],
  en: [
    { heading: '', body: 'The Home Budget Management M Finance project is one of the digital solutions of the M Solution project, operating under the overall name and brand KeyClick. The home budget management system is an application that centralizes all of the customer\'s financial transactions – expenses and income from the bank and from credit cards – in one place and presents them in an organized and clear way. Beyond documenting the past, the system also provides interactive tools for future planning, and graphical charts in various breakdowns.' },
    { heading: 'Live Budget Pie', body: '"Live Budget Pie" - the cherry on top. A pie whose slices show expenses laid over the income pie. A smart, interactive mechanism lets the customer manually change the pie\'s values to reach a desired balance.' },
    { heading: 'Credit Cards', body: 'Credit card charges behave differently from a regular bank transaction - installment spreading, and a gap between the purchase date and the actual charge date. The system handles this separately, and integrates the result back into the overall picture accurately.' },
    { heading: 'Purpose and Scope', body: 'Home budget management enables decisions based on real data instead of relying on memory or general estimation. The customer gets a full and accurate picture over time.\nThe system\'s purpose is to reduce the manual work involved in tracking finances and to give the customer a tool for data-based decisions, instead of feeling-based decisions. The scope includes full documentation of the past (what already happened), analysis of the current situation (how expenses are divided) and a look ahead (what is expected in the coming months). The system does not perform actual banking operations (transfers, payments) - it deals only with collecting, organizing and presenting the monthly and annual financial information.' },
    { heading: 'The Vision', body: 'The vision is for home budget management to enable importing account statements from banks and credit cards from institutions worldwide - including, in the future, a direct and automatic connection to the bank account, not just manual file import - to classify transactions, track expenses/income over time and plan ahead. A single tool that combines everything into one monthly/annual picture, automatic recognition of the data format, classification of every transaction and its presentation. The comprehensive analysis is done through a simple interface, in 11 languages.' },
    { heading: 'Installation and Updates', body: 'Installation and updates are performed through the KeyClick website in a way that is transparent to the customer, so they always work with the latest version without needing to take any action.' },
    { heading: 'Architecture - System Layers', body: 'The system is built in three layers:\n\n1. Interface Layer (UI Layer)\n•    Commands and choices from the control panel\n•    Human-machine dialogue\n•    Access to folders and file retrieval\n•    File type detection\n•    Building a unified interface (API)\n•    Database management\n•    Creating a test environment\n\n2. Logic Layer\n•    Reading data, preventing duplicates\n•    Mapping institution formats\n•    Classification engine\n•    Local classification rules\n•    Building views\n•    Table factory\n\n3. Data Layer\n•    Settings, records, global lists\n•    XML load/save\n•    Database file\n•    Classification memory' },
    { heading: 'Control Panel - Move Left or Right', body: 'The main control panel is displayed permanently on the right side of the view. Clicking a selector at the bottom of the panel moves the control panel to the left side of the view, according to the customer\'s preference.' },
    { heading: 'Artificial Intelligence', body: 'The smart algorithms in the application use artificial intelligence. An AI indicator light at the bottom of the panel shows the availability of the artificial intelligence.' },
  ],
  ru: [
    { heading: '', body: 'Проект управления семейным бюджетом M Finance является одним из цифровых решений проекта M Solution, работающим под общим названием и брендом KeyClick. Система управления семейным бюджетом — это приложение, которое централизует все финансовые операции клиента — расходы и доходы из банка и с кредитных карт — в одном месте и представляет их организованно и понятно. Помимо документирования прошлого, система также предоставляет интерактивные инструменты для планирования будущего и графические диаграммы в различных разрезах.' },
    { heading: 'Живая бюджетная диаграмма', body: '«Живая бюджетная диаграмма» — вишенка на торте. Диаграмма, сегменты которой показывают расходы, наложенные на диаграмму доходов. Умный интерактивный механизм позволяет клиенту вручную изменять значения диаграммы для достижения желаемого баланса.' },
    { heading: 'Кредитные карты', body: 'Списания по кредитным картам ведут себя иначе, чем обычная банковская операция — рассрочка платежей и разрыв между датой покупки и фактической датой списания. Система обрабатывает это отдельно и точно интегрирует результат обратно в общую картину.' },
    { heading: 'Цель и охват', body: 'Управление семейным бюджетом позволяет принимать решения на основе реальных данных вместо того, чтобы полагаться на память или общую оценку. Клиент получает полную и точную картину с течением времени.\nЦель системы — сократить ручную работу по отслеживанию финансов и дать клиенту инструмент для принятия решений на основе данных, а не ощущений. Охват включает полное документирование прошлого (что уже произошло), анализ текущей ситуации (как распределяются расходы) и взгляд вперёд (что ожидается в ближайшие месяцы). Система не выполняет фактические банковские операции (переводы, платежи) — она занимается только сбором, организацией и представлением ежемесячной и годовой финансовой информации.' },
    { heading: 'Устремление', body: 'Устремление состоит в том, чтобы управление семейным бюджетом позволяло импортировать банковские и кредитные выписки от учреждений по всему миру — включая в будущем прямое и автоматическое подключение к банковскому счёту, а не только ручной импорт файлов — классифицировать операции, отслеживать расходы/доходы во времени и планировать наперёд. Единый инструмент, объединяющий всё в единую месячную/годовую картину, автоматическое распознавание формата данных, классификация каждой транзакции и её отображение. Комплексный анализ выполняется через простой интерфейс на 11 языках.' },
    { heading: 'Установка и обновления', body: 'Установка и обновления выполняются через сайт KeyClick прозрачно для клиента, поэтому он всегда работает с самой последней версией без необходимости предпринимать какие-либо действия.' },
    { heading: 'Архитектура — слои системы', body: 'Система построена из трёх слоёв:\n\n1. Слой интерфейса (UI Layer)\n•    Команды и выбор в панели управления\n•    Диалог человек-машина\n•    Доступ к папкам и извлечение файлов\n•    Определение типов файлов\n•    Построение единого интерфейса (API)\n•    Управление базой данных\n•    Создание тестовой среды\n\n2. Слой логики (Logic Layer)\n•    Чтение данных, предотвращение дублирования\n•    Сопоставление форматов учреждений\n•    Механизм классификации\n•    Локальные правила классификации\n•    Построение представлений\n•    Фабрика таблиц\n\n3. Слой данных (Data Layer)\n•    Настройки, записи, глобальные списки\n•    Загрузка/сохранение XML\n•    Файл базы данных\n•    Память классификации' },
    { heading: 'Панель управления — перемещение влево или вправо', body: 'Основная панель управления постоянно отображается справа от экрана. При нажатии переключателя внизу панели, панель управления перемещается влево, по предпочтению клиента.' },
    { heading: 'Искусственный интеллект', body: 'Умные алгоритмы приложения используют искусственный интеллект. Индикатор ИИ внизу панели показывает доступность искусственного интеллекта.' },
  ],
  de: [
    { heading: '', body: 'Das Projekt Haushaltsbudgetverwaltung M Finance ist eine der digitalen Lösungen des Projekts M Solution und läuft unter dem Gesamtnamen und der Marke KeyClick. Das Haushaltsbudget-Verwaltungssystem ist eine Anwendung, die alle finanziellen Transaktionen des Kunden – Ausgaben und Einnahmen von der Bank und von Kreditkarten – an einem Ort zentralisiert und übersichtlich darstellt. Über die Dokumentation der Vergangenheit hinaus bietet das System auch interaktive Werkzeuge für die Zukunftsplanung und grafische Diagramme in verschiedenen Ansichten.' },
    { heading: 'Lebendiger Budgetkuchen', body: '„Lebendiger Budgetkuchen" – das Sahnehäubchen. Ein Kuchen, dessen Segmente die Ausgaben zeigen, die über den Einnahmenkuchen gelegt werden. Ein intelligenter, interaktiver Mechanismus ermöglicht es dem Kunden, die Werte des Kuchens manuell zu ändern, um die gewünschte Balance zu erreichen.' },
    { heading: 'Kreditkarten', body: 'Kreditkartenabbuchungen verhalten sich anders als eine normale Banktransaktion – Ratenzahlung und eine Lücke zwischen Kaufdatum und tatsächlichem Abbuchungsdatum. Das System behandelt dies separat und integriert das Ergebnis präzise zurück in das Gesamtbild.' },
    { heading: 'Zweck und Umfang', body: 'Die Haushaltsbudgetverwaltung ermöglicht Entscheidungen auf Basis echter Daten, anstatt sich auf Erinnerung oder allgemeine Schätzung zu verlassen. Der Kunde erhält im Laufe der Zeit ein vollständiges und genaues Bild.\nDer Zweck des Systems ist es, die manuelle Arbeit bei der Finanzverfolgung zu reduzieren und dem Kunden ein Werkzeug für datenbasierte statt gefühlsbasierte Entscheidungen zu geben. Der Umfang umfasst die vollständige Dokumentation der Vergangenheit (was bereits geschehen ist), die Analyse der aktuellen Situation (wie sich die Ausgaben verteilen) und einen Blick nach vorn (was in den kommenden Monaten zu erwarten ist). Das System führt keine tatsächlichen Bankgeschäfte durch (Überweisungen, Zahlungen) – es befasst sich ausschließlich mit dem Sammeln, Organisieren und Darstellen der monatlichen und jährlichen Finanzinformationen.' },
    { heading: 'Die Vision', body: 'Die Vision ist, dass die Haushaltsbudgetverwaltung den Import von Kontoauszügen von Banken und Kreditkarten von Instituten weltweit ermöglicht – künftig einschließlich einer direkten und automatischen Verbindung zum Bankkonto, nicht nur manuellem Datei-Import – um Transaktionen zu klassifizieren, Ausgaben/Einnahmen über die Zeit zu verfolgen und vorausschauend zu planen. Ein einheitliches Werkzeug, das alles zu einem monatlichen/jährlichen Gesamtbild zusammenführt, automatische Erkennung des Datenformats, Klassifizierung jeder Transaktion und deren Darstellung. Die umfassende Analyse erfolgt über eine einfache Oberfläche in 11 Sprachen.' },
    { heading: 'Installation und Updates', body: 'Installation und Updates erfolgen über die KeyClick-Website transparent für den Kunden, sodass er immer mit der neuesten Version arbeitet, ohne selbst aktiv werden zu müssen.' },
    { heading: 'Architektur – Systemschichten', body: 'Das System ist in drei Schichten aufgebaut:\n\n1. Oberflächenschicht (UI Layer)\n•    Befehle und Auswahlmöglichkeiten des Bedienfelds\n•    Mensch-Maschine-Dialog\n•    Zugriff auf Ordner und Dateiabruf\n•    Erkennung von Dateitypen\n•    Aufbau einer einheitlichen Schnittstelle (API)\n•    Datenbankverwaltung\n•    Erstellung einer Testumgebung\n\n2. Logikschicht (Logic Layer)\n•    Datenlesen, Vermeidung von Duplikaten\n•    Zuordnung von Institutsformaten\n•    Klassifizierungs-Engine\n•    Lokale Klassifizierungsregeln\n•    Aufbau von Ansichten\n•    Tabellenfabrik\n\n3. Datenschicht (Data Layer)\n•    Einstellungen, Datensätze, globale Listen\n•    XML-Laden/Speichern\n•    Datenbankdatei\n•    Klassifizierungsspeicher' },
    { heading: 'Bedienfeld – nach links oder rechts verschieben', body: 'Das Hauptbedienfeld wird dauerhaft rechts in der Ansicht angezeigt. Durch Klicken auf einen Schalter am unteren Rand des Feldes wechselt das Bedienfeld nach links, gemäß der Präferenz des Kunden.' },
    { heading: 'Künstliche Intelligenz', body: 'Die intelligenten Algorithmen der Anwendung nutzen künstliche Intelligenz. Eine KI-Anzeigeleuchte am unteren Rand des Feldes zeigt die Verfügbarkeit der künstlichen Intelligenz an.' },
  ],
  fr: [
    { heading: '', body: "Le projet de gestion du budget familial M Finance est l'une des solutions numériques du projet M Solution, opérant sous le nom global et la marque KeyClick. Le système de gestion du budget familial est une application qui centralise toutes les transactions financières du client – dépenses et revenus provenant de la banque et des cartes de crédit – en un seul endroit et les présente de manière organisée et claire. Au-delà de la documentation du passé, le système fournit également des outils interactifs de planification future et des graphiques selon différentes coupes." },
    { heading: 'Camembert budgétaire vivant', body: "« Camembert budgétaire vivant » - la cerise sur le gâteau. Un camembert dont les parts affichent les dépenses posées sur le camembert des revenus. Un mécanisme intelligent et interactif permet au client de modifier manuellement les valeurs du camembert pour atteindre l'équilibre souhaité." },
    { heading: 'Cartes de crédit', body: "Les débits par carte de crédit se comportent différemment d'une transaction bancaire normale - étalement en versements, et un décalage entre la date d'achat et la date de débit réelle. Le système traite cela séparément, et intègre le résultat avec précision dans l'image globale." },
    { heading: 'But et portée', body: "La gestion du budget familial permet de prendre des décisions basées sur des données réelles au lieu de se fier à la mémoire ou à une estimation générale. Le client obtient une image complète et précise dans le temps.\nLe but du système est de réduire le travail manuel lié au suivi des finances et de donner au client un outil de décision basé sur les données, plutôt que sur le ressenti. La portée comprend une documentation complète du passé (ce qui s'est déjà passé), une analyse de la situation actuelle (comment se répartissent les dépenses) et un regard vers l'avenir (ce qui est prévu dans les mois à venir). Le système ne réalise pas d'opérations bancaires réelles (virements, paiements) - il se limite à la collecte, l'organisation et la présentation des informations financières mensuelles et annuelles." },
    { heading: "L'ambition", body: "L'ambition est que la gestion du budget familial permette d'importer des relevés de comptes bancaires et de cartes de crédit d'institutions du monde entier - y compris, à l'avenir, une connexion directe et automatique au compte bancaire, pas seulement l'importation manuelle de fichiers - de classer les transactions, de suivre les dépenses/revenus dans le temps et de planifier à l'avance. Un outil unifié qui combine tout en une seule image mensuelle/annuelle, reconnaissance automatique du format des données, classification de chaque transaction et son affichage. L'analyse complète se fait via une interface simple, en 11 langues." },
    { heading: 'Installation et mises à jour', body: "L'installation et les mises à jour se font via le site KeyClick de manière transparente pour le client, afin qu'il travaille toujours avec la dernière version sans avoir à effectuer d'action particulière." },
    { heading: 'Architecture - couches du système', body: "Le système est construit en trois couches :\n\n1. Couche d'interface (UI Layer)\n•    Commandes et choix du panneau de contrôle\n•    Dialogue homme-machine\n•    Accès aux dossiers et récupération de fichiers\n•    Détection des types de fichiers\n•    Construction d'une interface unifiée (API)\n•    Gestion de la base de données\n•    Création d'un environnement de test\n\n2. Couche logique (Logic Layer)\n•    Lecture des données, prévention des doublons\n•    Mappage des formats des institutions\n•    Moteur de classification\n•    Règles de classification locales\n•    Construction des vues\n•    Fabrique de tableaux\n\n3. Couche de données (Data Layer)\n•    Paramètres, enregistrements, listes globales\n•    Chargement/sauvegarde XML\n•    Fichier de base de données\n•    Mémoire de classification" },
    { heading: 'Panneau de contrôle - déplacer à gauche ou à droite', body: "Le panneau de contrôle principal est affiché en permanence à droite de l'écran. En cliquant sur un sélecteur en bas du panneau, celui-ci se déplace vers la gauche de l'écran, selon la préférence du client." },
    { heading: 'Intelligence artificielle', body: "Les algorithmes intelligents de l'application utilisent l'intelligence artificielle. Un voyant IA en bas du panneau indique la disponibilité de l'intelligence artificielle." },
  ],
  es: [
    { heading: '', body: 'El proyecto de gestión del presupuesto familiar M Finance es una de las soluciones digitales del proyecto M Solution, que opera bajo el nombre general y la marca KeyClick. El sistema de gestión del presupuesto familiar es una aplicación que centraliza todas las transacciones financieras del cliente - gastos e ingresos del banco y de las tarjetas de crédito - en un solo lugar y las presenta de forma organizada y clara. Más allá de documentar el pasado, el sistema también proporciona herramientas interactivas para la planificación futura y gráficos en distintos cortes.' },
    { heading: 'Gráfico circular de presupuesto en vivo', body: '"Gráfico circular de presupuesto en vivo" - la guinda del pastel. Un gráfico circular cuyas porciones muestran los gastos superpuestos al gráfico de ingresos. Un mecanismo inteligente e interactivo permite al cliente cambiar manualmente los valores del gráfico para alcanzar el equilibrio deseado.' },
    { heading: 'Tarjetas de crédito', body: 'Los cargos de tarjetas de crédito se comportan de forma diferente a una transacción bancaria normal - pago a plazos, y una brecha entre la fecha de compra y la fecha real del cargo. El sistema maneja esto por separado, e integra el resultado de vuelta en la imagen general con precisión.' },
    { heading: 'Propósito y alcance', body: 'La gestión del presupuesto familiar permite tomar decisiones basadas en datos reales en lugar de depender de la memoria o una estimación general. El cliente obtiene una imagen completa y precisa a lo largo del tiempo.\nEl propósito del sistema es reducir el trabajo manual involucrado en el seguimiento de las finanzas y dar al cliente una herramienta para decisiones basadas en datos, en lugar de decisiones basadas en la sensación. El alcance incluye documentación completa del pasado (lo que ya sucedió), análisis de la situación actual (cómo se dividen los gastos) y una mirada hacia adelante (qué se espera en los próximos meses). El sistema no realiza operaciones bancarias reales (transferencias, pagos) - se ocupa únicamente de recopilar, organizar y presentar la información financiera mensual y anual.' },
    { heading: 'La aspiración', body: 'La aspiración es que la gestión del presupuesto familiar permita importar extractos de cuentas de bancos y tarjetas de crédito de instituciones de todo el mundo - incluyendo, en el futuro, una conexión directa y automática a la cuenta bancaria, no solo la importación manual de archivos - clasificar transacciones, hacer seguimiento de gastos/ingresos a lo largo del tiempo y planificar con anticipación. Una herramienta unificada que combina todo en una sola imagen mensual/anual, reconocimiento automático del formato de datos, clasificación de cada transacción y su presentación. El análisis integral se realiza a través de una interfaz simple, en 11 idiomas.' },
    { heading: 'Instalación y actualizaciones', body: 'La instalación y las actualizaciones se realizan a través del sitio web de KeyClick de forma transparente para el cliente, de modo que siempre trabaje con la versión más reciente sin necesidad de realizar ninguna acción.' },
    { heading: 'Arquitectura - capas del sistema', body: 'El sistema está construido en tres capas:\n\n1. Capa de interfaz (UI Layer)\n•    Comandos y selecciones del panel de control\n•    Diálogo humano-máquina\n•    Acceso a carpetas y recuperación de archivos\n•    Detección de tipos de archivo\n•    Construcción de una interfaz unificada (API)\n•    Gestión de base de datos\n•    Creación de un entorno de prueba\n\n2. Capa de lógica (Logic Layer)\n•    Lectura de datos, prevención de duplicados\n•    Mapeo de formatos de instituciones\n•    Motor de clasificación\n•    Reglas de clasificación locales\n•    Construcción de vistas\n•    Fábrica de tablas\n\n3. Capa de datos (Data Layer)\n•    Configuraciones, registros, listas globales\n•    Carga/guardado XML\n•    Archivo de base de datos\n•    Memoria de clasificación' },
    { heading: 'Panel de control - mover a la izquierda o derecha', body: 'El panel de control principal se muestra permanentemente a la derecha de la vista. Al hacer clic en un selector en la parte inferior del panel, el panel de control se mueve a la izquierda de la vista, según la preferencia del cliente.' },
    { heading: 'Inteligencia artificial', body: 'Los algoritmos inteligentes de la aplicación utilizan inteligencia artificial. Una luz indicadora de IA en la parte inferior del panel muestra la disponibilidad de la inteligencia artificial.' },
  ],
  ja: [
    { heading: '', body: '家計管理 M Financeプロジェクトは、M Solutionプロジェクトのデジタルソリューションの一つであり、KeyClickという総称ブランドの下で運営されています。家計管理システムは、銀行やクレジットカードからの支出と収入というお客様のすべての金融取引を一箇所に集約し、整理された分かりやすい形で表示するアプリケーションです。過去の記録にとどまらず、システムは将来計画のためのインタラクティブなツールや、さまざまな切り口によるグラフィカルなチャートも提供します。' },
    { heading: 'ライブ予算パイ', body: '「ライブ予算パイ」- 最高の仕上げ。支出が収入のパイの上に重ねて表示されるパイチャートです。スマートでインタラクティブな仕組みにより、お客様はパイの値を手動で変更して希望のバランスに到達できます。' },
    { heading: 'クレジットカード', body: 'クレジットカードの請求は通常の銀行取引とは異なる挙動を示します - 分割払い、購入日と実際の請求日のずれなどです。システムはこれを個別に処理し、その結果を全体像に正確に統合します。' },
    { heading: '目的と範囲', body: '家計管理により、記憶や大まかな見積もりに頼るのではなく、実際のデータに基づいた意思決定が可能になります。お客様は時間の経過とともに完全で正確な全体像を得られます。\nシステムの目的は、財務追跡に伴う手作業を減らし、感覚ではなくデータに基づいた意思決定のためのツールをお客様に提供することです。範囲には、過去の完全な記録（すでに起こったこと）、現状の分析（支出の内訳）、そして将来の見通し（今後数ヶ月の予測）が含まれます。システムは実際の銀行業務（振込、支払い）は行わず、月次および年次の財務情報の収集、整理、表示のみを扱います。' },
    { heading: '目指す姿', body: '目指す姿は、家計管理が世界中の金融機関からの銀行およびクレジットカードの明細書のインポートを可能にすることです - 将来的には手動でのファイルインポートだけでなく、銀行口座への直接的かつ自動的な接続も含みます - 取引を分類し、時間の経過とともに支出/収入を追跡し、先を見越して計画します。すべてを一つの月次/年次の全体像に統合する統一ツール、データ形式の自動認識、各取引の分類と表示。包括的な分析はシンプルなインターフェースで、11言語で行われます。' },
    { heading: 'インストールとアップデート', body: 'インストールとアップデートはKeyClickのウェブサイトを通じて、お客様には見えない形で行われるため、特別な操作をすることなく常に最新バージョンで利用できます。' },
    { heading: 'アーキテクチャ - システムの層', body: 'システムは3つの層で構築されています：\n\n1. インターフェース層（UIレイヤー）\n•    コントロールパネルのコマンドと選択\n•    人間と機械の対話\n•    フォルダへのアクセスとファイルの取得\n•    ファイルタイプの検出\n•    統一インターフェース（API）の構築\n•    データベース管理\n•    テスト環境の作成\n\n2. ロジック層（Logic Layer）\n•    データの読み込み、重複防止\n•    金融機関フォーマットのマッピング\n•    分類エンジン\n•    ローカル分類ルール\n•    ビューの構築\n•    テーブルファクトリー\n\n3. データ層（Data Layer）\n•    設定、レコード、グローバルリスト\n•    XMLの読み込み/保存\n•    データベースファイル\n•    分類メモリ' },
    { heading: 'コントロールパネル - 左右への移動', body: 'メインのコントロールパネルは常に画面の右側に表示されます。パネル下部のセレクターをクリックすると、お客様の好みに応じてコントロールパネルが画面の左側に移動します。' },
    { heading: '人工知能', body: 'アプリケーションのスマートアルゴリズムは人工知能を使用しています。パネル下部のAIインジケーターランプが人工知能の利用可否を示します。' },
  ],
  ar: [
    { heading: '', body: 'مشروع إدارة ميزانية المنزل M Finance هو أحد الحلول الرقمية لمشروع M Solution، ويعمل تحت الاسم العام والعلامة التجارية KeyClick. نظام إدارة ميزانية المنزل هو تطبيق يجمع كل المعاملات المالية للعميل - المصروفات والدخل من البنك ومن بطاقات الائتمان - في مكان واحد ويعرضها بشكل منظم وواضح. بالإضافة إلى توثيق الماضي، يوفر النظام أيضًا أدوات تفاعلية للتخطيط المستقبلي، ورسومًا بيانية بمقاطع مختلفة.' },
    { heading: 'مخطط الميزانية الدائري الحي', body: '"مخطط الميزانية الدائري الحي" - لمسة التميز. مخطط دائري تعرض شرائحه المصروفات موضوعة فوق مخطط الدخل. آلية ذكية وتفاعلية تتيح للعميل تغيير قيم المخطط يدويًا للوصول إلى التوازن المرغوب.' },
    { heading: 'بطاقات الائتمان', body: 'تتصرف رسوم بطاقات الائتمان بشكل مختلف عن المعاملة البنكية العادية - تقسيط الدفعات، وفجوة بين تاريخ الشراء وتاريخ الرسم الفعلي. يتعامل النظام مع ذلك بشكل منفصل، ويدمج النتيجة مرة أخرى في الصورة الكاملة بدقة.' },
    { heading: 'الغرض والنطاق', body: 'تتيح إدارة ميزانية المنزل اتخاذ قرارات بناءً على بيانات حقيقية بدلاً من الاعتماد على الذاكرة أو التقدير العام. يحصل العميل على صورة كاملة ودقيقة عبر الزمن.\nهدف النظام هو تقليل العمل اليدوي المرتبط بمتابعة الأموال ومنح العميل أداة لاتخاذ قرارات مبنية على البيانات، بدلاً من قرارات مبنية على الشعور. يشمل النطاق التوثيق الكامل للماضي (ما حدث بالفعل)، وتحليل الوضع الحالي (كيف تتوزع المصروفات) والنظر إلى المستقبل (ما هو متوقع في الأشهر القادمة). لا يقوم النظام بتنفيذ عمليات مصرفية فعلية (تحويلات، مدفوعات) - يقتصر عمله على جمع وتنظيم وعرض المعلومات المالية الشهرية والسنوية.' },
    { heading: 'الطموح', body: 'الطموح هو أن تتيح إدارة ميزانية المنزل استيراد كشوفات الحسابات من البنوك وبطاقات الائتمان من مؤسسات حول العالم - بما في ذلك مستقبلاً اتصال مباشر وتلقائي بالحساب البنكي، وليس فقط الاستيراد اليدوي للملفات - لتصنيف المعاملات، وتتبع المصروفات/الدخل عبر الزمن والتخطيط للمستقبل. أداة موحدة تجمع كل شيء في صورة شهرية/سنوية واحدة، والتعرف التلقائي على تنسيق البيانات، وتصنيف كل معاملة وعرضها. يتم التحليل الشامل من خلال واجهة بسيطة، بـ 11 لغة.' },
    { heading: 'التثبيت والتحديثات', body: 'يتم التثبيت والتحديثات عبر موقع KeyClick بشكل شفاف للعميل، بحيث يعمل دائمًا بأحدث إصدار دون الحاجة لاتخاذ أي إجراء.' },
    { heading: 'البنية - طبقات النظام', body: 'يُبنى النظام من ثلاث طبقات:\n\n1. طبقة الواجهة (UI Layer)\n•    أوامر واختيارات لوحة التحكم\n•    حوار الإنسان والآلة\n•    الوصول إلى المجلدات واسترجاع الملفات\n•    التعرف على أنواع الملفات\n•    بناء واجهة موحدة (API)\n•    إدارة قاعدة البيانات\n•    إنشاء بيئة اختبار\n\n2. طبقة المنطق (Logic Layer)\n•    قراءة البيانات، منع التكرار\n•    ربط تنسيقات المؤسسات\n•    محرك التصنيف\n•    قواعد التصنيف المحلية\n•    بناء العروض\n•    مصنع الجداول\n\n3. طبقة البيانات (Data Layer)\n•    الإعدادات، السجلات، القوائم العامة\n•    تحميل/حفظ XML\n•    ملف قاعدة البيانات\n•    ذاكرة التصنيف' },
    { heading: 'لوحة التحكم - النقل يسارًا أو يمينًا', body: 'تُعرض لوحة التحكم الرئيسية بشكل دائم على يمين الشاشة. بالنقر على محدد أسفل اللوحة، تنتقل لوحة التحكم إلى يسار الشاشة، حسب تفضيل العميل.' },
    { heading: 'الذكاء الاصطناعي', body: 'تستخدم الخوارزميات الذكية في التطبيق الذكاء الاصطناعي. يُظهر مؤشر الذكاء الاصطناعي أسفل اللوحة مدى توفر الذكاء الاصطناعي.' },
  ],
  zh: [
    { heading: '', body: '家庭预算管理 M Finance 项目是 M Solution 项目的数字解决方案之一，以 KeyClick 这一总品牌名称运营。家庭预算管理系统是一款将客户所有财务交易——来自银行和信用卡的支出和收入——集中在一处并以有条理、清晰的方式呈现的应用程序。除了记录过去之外，该系统还提供用于未来规划的交互式工具，以及不同维度的图表。' },
    { heading: '实时预算饼图', body: '"实时预算饼图" - 锦上添花之作。饼图的各个切片显示叠加在收入饼图上的支出。智能交互机制让客户可以手动更改饼图的数值，以达到期望的平衡。' },
    { heading: '信用卡', body: '信用卡扣款的行为与普通银行交易不同 - 分期付款，以及购买日期与实际扣款日期之间的差距。系统会单独处理这一点，并将结果准确地重新整合到整体情况中。' },
    { heading: '目的与范围', body: '家庭预算管理使您能够基于真实数据做出决策，而不是依赖记忆或大致估计。客户能够随着时间推移获得完整而准确的全貌。\n系统的目的是减少财务跟踪所涉及的手动工作，并为客户提供基于数据而非基于感觉做决策的工具。范围包括对过去的完整记录（已经发生的事）、对当前状况的分析（支出如何分配）以及对未来的展望（未来几个月的预期）。系统不执行实际的银行业务操作（转账、付款）——仅涉及每月和每年财务信息的收集、整理和呈现。' },
    { heading: '愿景', body: '愿景是家庭预算管理能够从世界各地的机构导入银行和信用卡对账单——未来还包括直接自动连接银行账户，而不仅仅是手动导入文件——对交易进行分类，随时间跟踪支出/收入并提前规划。一个统一的工具，将所有内容整合成一个月度/年度全貌，自动识别数据格式，对每笔交易进行分类并呈现。全面的分析通过简单的界面完成，支持11种语言。' },
    { heading: '安装与更新', body: '安装和更新通过 KeyClick 网站进行，对客户透明，因此客户始终使用最新版本，无需采取任何操作。' },
    { heading: '架构 - 系统分层', body: '系统由三层构成：\n\n1. 界面层（UI Layer）\n•    控制面板的命令和选择\n•    人机对话\n•    访问文件夹和获取文件\n•    文件类型检测\n•    构建统一接口（API）\n•    数据库管理\n•    创建测试环境\n\n2. 逻辑层（Logic Layer）\n•    读取数据、防止重复\n•    映射机构格式\n•    分类引擎\n•    本地分类规则\n•    构建视图\n•    表格工厂\n\n3. 数据层（Data Layer）\n•    设置、记录、全局列表\n•    XML 加载/保存\n•    数据库文件\n•    分类记忆' },
    { heading: '控制面板 - 移至左侧或右侧', body: '主控制面板始终固定显示在视图右侧。点击面板底部的选择器，控制面板会根据客户的偏好移动到视图左侧。' },
    { heading: '人工智能', body: '应用程序中的智能算法使用人工智能。面板底部的AI指示灯显示人工智能的可用性。' },
  ],
  it: [
    { heading: '', body: "Il progetto di gestione del bilancio familiare M Finance è una delle soluzioni digitali del progetto M Solution, che opera sotto il nome generale e il marchio KeyClick. Il sistema di gestione del bilancio familiare è un'applicazione che centralizza tutte le transazioni finanziarie del cliente - spese ed entrate dalla banca e dalle carte di credito - in un unico posto e le presenta in modo organizzato e chiaro. Oltre alla documentazione del passato, il sistema fornisce anche strumenti interattivi per la pianificazione futura e grafici in diverse sezioni." },
    { heading: 'Torta di bilancio dal vivo', body: '"Torta di bilancio dal vivo" - la ciliegina sulla torta. Una torta le cui fette mostrano le spese poste sopra la torta delle entrate. Un meccanismo intelligente e interattivo consente al cliente di modificare manualmente i valori della torta per raggiungere l\'equilibrio desiderato.' },
    { heading: 'Carte di credito', body: "Gli addebiti delle carte di credito si comportano diversamente da una normale transazione bancaria - rateizzazione dei pagamenti, e uno scarto tra la data di acquisto e la data effettiva dell'addebito. Il sistema gestisce questo separatamente, e integra il risultato nell'immagine complessiva in modo accurato." },
    { heading: 'Scopo e ambito', body: "La gestione del bilancio familiare consente di prendere decisioni basate su dati reali invece di affidarsi alla memoria o a una stima generale. Il cliente ottiene un quadro completo e accurato nel tempo.\nLo scopo del sistema è ridurre il lavoro manuale legato al monitoraggio delle finanze e fornire al cliente uno strumento per decisioni basate sui dati, anziché decisioni basate sulla sensazione. L'ambito include la documentazione completa del passato (cosa è già successo), l'analisi della situazione attuale (come si distribuiscono le spese) e uno sguardo al futuro (cosa è previsto nei prossimi mesi). Il sistema non esegue operazioni bancarie effettive (bonifici, pagamenti) - si occupa solo di raccogliere, organizzare e presentare le informazioni finanziarie mensili e annuali." },
    { heading: "L'aspirazione", body: "L'aspirazione è che la gestione del bilancio familiare consenta di importare estratti conto bancari e di carte di credito da istituzioni in tutto il mondo - includendo in futuro una connessione diretta e automatica al conto bancario, non solo l'importazione manuale di file - classificare le transazioni, monitorare spese/entrate nel tempo e pianificare in anticipo. Uno strumento unificato che combina tutto in un unico quadro mensile/annuale, riconoscimento automatico del formato dei dati, classificazione di ogni transazione e la sua presentazione. L'analisi completa avviene tramite un'interfaccia semplice, in 11 lingue." },
    { heading: 'Installazione e aggiornamenti', body: "L'installazione e gli aggiornamenti avvengono tramite il sito KeyClick in modo trasparente per il cliente, così che lavori sempre con la versione più recente senza dover intraprendere alcuna azione." },
    { heading: 'Architettura - livelli del sistema', body: "Il sistema è costruito su tre livelli:\n\n1. Livello di interfaccia (UI Layer)\n•    Comandi e scelte del pannello di controllo\n•    Dialogo uomo-macchina\n•    Accesso alle cartelle e recupero dei file\n•    Rilevamento dei tipi di file\n•    Costruzione di un'interfaccia unificata (API)\n•    Gestione del database\n•    Creazione di un ambiente di test\n\n2. Livello logico (Logic Layer)\n•    Lettura dei dati, prevenzione dei duplicati\n•    Mappatura dei formati degli istituti\n•    Motore di classificazione\n•    Regole di classificazione locali\n•    Costruzione delle viste\n•    Fabbrica di tabelle\n\n3. Livello dati (Data Layer)\n•    Impostazioni, record, elenchi globali\n•    Caricamento/salvataggio XML\n•    File del database\n•    Memoria di classificazione" },
    { heading: 'Pannello di controllo - spostare a sinistra o a destra', body: "Il pannello di controllo principale viene visualizzato in modo permanente a destra della vista. Cliccando su un selettore in basso nel pannello, il pannello di controllo si sposta a sinistra della vista, secondo la preferenza del cliente." },
    { heading: 'Intelligenza artificiale', body: "Gli algoritmi intelligenti dell'applicazione utilizzano l'intelligenza artificiale. Una spia luminosa IA nella parte inferiore del pannello mostra la disponibilità dell'intelligenza artificiale." },
  ],
  hi: [
    { heading: '', body: 'गृह बजट प्रबंधन M Finance प्रोजेक्ट, M Solution प्रोजेक्ट के डिजिटल समाधानों में से एक है, जो KeyClick नामक समग्र ब्रांड के तहत संचालित होता है। गृह बजट प्रबंधन प्रणाली एक एप्लिकेशन है जो ग्राहक के सभी वित्तीय लेन-देन - बैंक और क्रेडिट कार्ड से व्यय और आय - को एक ही स्थान पर केंद्रित करता है और उन्हें व्यवस्थित और स्पष्ट रूप से प्रस्तुत करता है। अतीत के दस्तावेज़ीकरण के अलावा, यह प्रणाली भविष्य की योजना के लिए इंटरैक्टिव उपकरण, और विभिन्न विभाजनों में ग्राफिकल चार्ट भी प्रदान करती है।' },
    { heading: 'लाइव बजट पाई', body: '"लाइव बजट पाई" - सबसे खास हिस्सा। एक पाई जिसके टुकड़े आय के पाई पर रखे गए व्यय को दिखाते हैं। एक स्मार्ट, इंटरैक्टिव तंत्र ग्राहक को वांछित संतुलन तक पहुंचने के लिए पाई के मानों को मैन्युअल रूप से बदलने देता है।' },
    { heading: 'क्रेडिट कार्ड', body: 'क्रेडिट कार्ड शुल्क सामान्य बैंक लेन-देन से अलग व्यवहार करते हैं - किस्तों में भुगतान, और खरीद की तारीख तथा वास्तविक शुल्क तारीख के बीच का अंतर। प्रणाली इसे अलग से संभालती है, और परिणाम को सटीक रूप से समग्र चित्र में वापस एकीकृत करती है।' },
    { heading: 'उद्देश्य और दायरा', body: 'गृह बजट प्रबंधन स्मृति या सामान्य अनुमान पर निर्भर रहने के बजाय वास्तविक डेटा के आधार पर निर्णय लेने में सक्षम बनाता है। ग्राहक को समय के साथ एक पूर्ण और सटीक चित्र मिलता है।\nप्रणाली का उद्देश्य वित्त पर नज़र रखने में शामिल मैन्युअल कार्य को कम करना और ग्राहक को भावना-आधारित के बजाय डेटा-आधारित निर्णय लेने का उपकरण देना है। दायरे में अतीत का पूर्ण दस्तावेज़ीकरण (जो पहले ही हो चुका है), वर्तमान स्थिति का विश्लेषण (व्यय कैसे विभाजित होते हैं) और आगे की ओर देखना (आने वाले महीनों में क्या अपेक्षित है) शामिल है। प्रणाली वास्तविक बैंकिंग संचालन (हस्तांतरण, भुगतान) नहीं करती - यह केवल मासिक और वार्षिक वित्तीय जानकारी को एकत्रित करने, व्यवस्थित करने और प्रस्तुत करने से संबंधित है।' },
    { heading: 'आकांक्षा', body: 'आकांक्षा यह है कि गृह बजट प्रबंधन दुनिया भर के संस्थानों से बैंक और क्रेडिट कार्ड स्टेटमेंट आयात करने में सक्षम बनाए - जिसमें भविष्य में बैंक खाते से सीधा और स्वचालित कनेक्शन भी शामिल है, न कि केवल फाइलों का मैन्युअल आयात - लेन-देन को वर्गीकृत करने, समय के साथ व्यय/आय को ट्रैक करने और आगे की योजना बनाने के लिए। एक एकीकृत उपकरण जो सब कुछ एक मासिक/वार्षिक चित्र में जोड़ता है, डेटा प्रारूप की स्वचालित पहचान, प्रत्येक लेन-देन का वर्गीकरण और उसकी प्रस्तुति। व्यापक विश्लेषण एक सरल इंटरफ़ेस के माध्यम से, 11 भाषाओं में किया जाता है।' },
    { heading: 'स्थापना और अपडेट', body: 'स्थापना और अपडेट KeyClick वेबसाइट के माध्यम से ग्राहक के लिए पारदर्शी तरीके से किए जाते हैं, ताकि वह बिना कोई कार्रवाई किए हमेशा नवीनतम संस्करण के साथ काम करे।' },
    { heading: 'आर्किटेक्चर - सिस्टम की परतें', body: 'प्रणाली तीन परतों में बनी है:\n\n1. इंटरफ़ेस परत (UI Layer)\n•    नियंत्रण पैनल के आदेश और चयन\n•    मानव-मशीन संवाद\n•    फ़ोल्डरों तक पहुंच और फ़ाइल पुनर्प्राप्ति\n•    फ़ाइल प्रकार की पहचान\n•    एकीकृत इंटरफ़ेस (API) का निर्माण\n•    डेटाबेस प्रबंधन\n•    परीक्षण वातावरण का निर्माण\n\n2. लॉजिक परत (Logic Layer)\n•    डेटा पढ़ना, दोहराव की रोकथाम\n•    संस्थान प्रारूपों की मैपिंग\n•    वर्गीकरण इंजन\n•    स्थानीय वर्गीकरण नियम\n•    दृश्यों का निर्माण\n•    तालिका फैक्ट्री\n\n3. डेटा परत (Data Layer)\n•    सेटिंग्स, रिकॉर्ड, वैश्विक सूचियां\n•    XML लोड/सेव\n•    डेटाबेस फ़ाइल\n•    वर्गीकरण मेमोरी' },
    { heading: 'नियंत्रण पैनल - बाएं या दाएं ले जाएं', body: 'मुख्य नियंत्रण पैनल हमेशा दृश्य के दाईं ओर स्थायी रूप से प्रदर्शित होता है। पैनल के निचले हिस्से में एक चयनकर्ता पर क्लिक करने से, ग्राहक की प्राथमिकता के अनुसार नियंत्रण पैनल दृश्य के बाईं ओर चला जाता है।' },
    { heading: 'कृत्रिम बुद्धिमत्ता', body: 'एप्लिकेशन में स्मार्ट एल्गोरिदम कृत्रिम बुद्धिमत्ता का उपयोग करते हैं। पैनल के निचले हिस्से में एक AI संकेतक लाइट कृत्रिम बुद्धिमत्ता की उपलब्धता दिखाती है।' },
  ],
}

const FINANCE_GUIDE_TITLES: Record<string, string> = {
  he: 'ניהול תקציב בית M_Finance – מדריך למשתמש',
  en: 'Home Budget Management M_Finance – User Guide',
  ru: 'Управление семейным бюджетом M_Finance – руководство пользователя',
  de: 'Haushaltsbudgetverwaltung M_Finance – Benutzerhandbuch',
  fr: "Gestion du budget familial M_Finance – Guide de l'utilisateur",
  es: 'Gestión del presupuesto familiar M_Finance – Guía del usuario',
  ja: '家計管理 M_Finance – ユーザーガイド',
  ar: 'إدارة ميزانية المنزل M_Finance – دليل المستخدم',
  zh: '家庭预算管理 M_Finance – 用户指南',
  it: "Gestione del bilancio familiare M_Finance – Guida per l'utente",
  hi: 'गृह बजट प्रबंधन M_Finance – उपयोगकर्ता गाइड',
}

const FINANCE_GUIDE_SECTIONS: Record<string, GuideSection[]> = {
  he: [
    { heading: 'KeyClick', body: 'אפליקציית ניהול תקציב בית הנו חלק מפרויקט המותג KeyClick' },
    { heading: 'דף הבית של ניהול תקציב בית', body: 'לחצת על הכפתור מאתר KeyClick ונפתחת תצוגת שער הכניסה, גליל מסוגנן עם ברכת כניסה ודגל השפה.\n\nהשפה לא מתאימה ? בחר 1 מתוך 11 הדגלים בראש האתר ותועבר מידית לשפה הנבחרת. מערכת ריבוי השפות הוא אחד מיחידות הבסיס של האתר ומוצריו. ניתן בכל עת לעבור מידית משפה לשפה.\n\nלחיצה על המסך תסגור את מסך השער ותפתח את תכולת הפרויקט.' },
    { heading: 'בחירת שפה', body: 'בראש המסך תמצא שורת דגלים - דגל לכל אחת מ-11 השפות הנתמכות בתוכנה. לחיצה על דגל כלשהו מחליפה מיידית את כל התוכנה לאותה שפה - כל הכותרות, כל התוויות, כל הודעות המערכת. אתה יכול לעבור בין שפות בכל רגע, ולחזור בחזרה, בלי לאבד שום נתון.' },
    { heading: 'התחלת עבודה', body: 'לחצת על מסך הכניסה ונכנסת לאפליקציה. מה אתה רואה? מה עליך לעשות?\n\nעל מנת לנהל תקציב יש קודם כל לטעון את הנתונים. מה הדרכים לטעינה. מספר מסלולים לטעינה. בתהליך הטעינה תקבל הנחיות והודעות.\n\nסיום הטעינה. מה אתה רואה? דף חשבון שנתי, פריסה שנתית. טבלת מאזן, יתרה, טבלת הפעולות שנטענו, מסווגות לפי נושאים.' },
    { heading: 'תצוגה שנתית', body: 'מסך תצוגה חודשית, מסך מרכזי אשר נפתח ראשון אחרי עמוד השער. בתצוגה זו נראה את המידע המאוחסן במסד הנתונים, אשר נטען מדפי חשבון של מוסד פיננסי. המסך מחולק לשני אזורים עיקריים. טבלה מרכזית הכוללת סיכום של הכנסות, הוצאו, יתרות ומאזנים. החלק השני הוא טבלאות פרוט של כל סיווג. בהקשה על הסיווג נפתח פירוט הפעולות. כל הנתונים בדף השנתי בעצם מוצגים בחתכים ומפתחות שונים בשאר התצוגות אשר מתוארות בהמשך.' },
    { heading: 'תצוגה חודשית', body: 'ברצונך לטפל רק בחודש מסוים, לחץ בלוח הבקרה על תצוגה חודשית. יפתח בפניך דף הכולל נגזרת של חודש מסוים מהדף השנתי. כאן אתה יכול לבחור כל חודש ומיד תקבל את הנתונים למסך.' },
    { heading: 'לוחות הודעות', body: 'בתחתית במסך, באופן קבוע קיימים שלושה לוחות להודעות המערכת, הודעות שוטפות, מידע ושגיאות אפשריות.' },
    { heading: 'לוח הבקרה', body: 'מבט ימינה מביא אותנו ללוח בקרה של האתר. לוח הבקרה מצד ימין תמיד גלוי בפניך,\n\nכל אחד מהפריטים על לוח הבקרה נועד למלא פונקציה של הצגה מקומית או מעבר לדף אחר. בהמשך במסמך זה יפורטו כל הפריטים הללו.', image: { src: '/guides/mfinance-control-panel-he.jpg', width: 136, height: 819 } },
    { heading: 'צד לוח הבקרה', body: 'אם אתה ימני או שמאלי, אתה יכול ללחוץ על כפתור ימין או שמאל בלוח הבקרה ולוח הבקרה יעבור מצד לצד.' },
    { heading: 'נורית ה-AI', body: 'בתחתית לוח הבקרה מוארת נורית AI, צבע ירוק משמע זמין, אדום לא זמין. באופן כללי, גם כש ה AI לא זמין בד"כ המערכת יודעת להתמודד עם רוב הפעולות.' },
    { heading: 'סיום עבודה', body: 'סיימת עבודה וברצונך לסגור את האפליקציה. לחץ צא.' },
    { heading: 'תהליך טעינה ידנית', body: 'תהליך טעינה ידנית מייושם על ידי כפתורי הטעינה בלוח הבקרה. לפני הטעינה אתה יכול לבחור לטעון קובץ אחד מסויים, בחר קובץ, טעינת כל הקבצים בתיקיה, לחץ תיקיה, טעינה אוטומוית של כל הקבצים בתיקיה, לחץ אוטומטי או בכל קובץ תקבל בקשת אישור. בחרת אופן הטעינה, לחץ על כפתור טען. ייפתח בפניך מנהל קבצים, בחר קובץ או תיקיה ואשר.' },
    { heading: 'חיבור ישיר למוסד פיננסי', body: 'פונקציה מיוחדת קיימת לטעינת נתונים באופן ישיר ממוסד פיננסי. בלחיצה על כפתור מוסד פיננסי תועבר לשרותים בנקאיים של הפרויקט. בשירות זה אפשר להתחבר לאחד ממוסדות הפיננסיים בעולם, אלה אשר הוסדרו וזמינים עבורנו. בתהליך זה ניתן להוריד נתונים אל המחשב בייצירת קבצים לטעינה ידנית או להורדת הנתונים ישירות לפרויקט.' },
    { heading: 'תצוגת מספרי חשבון', body: 'לצד כפתורי הטעינה יש לך תווית "מס. חשבון" עם תיבות סימון . המידע הזה נשלף לאחר תהליך הטעינה מתוך הנתונים. בחר חשבון אחד או יותר להתמקדות המערכת (עד 4 חשבונות שונים).' },
    { heading: 'מסך המסד', body: 'טענת נתונים מתוך דפי חשבון ואתה רוצה לראות את הטעינה הגולמית איך שזה נטען, לחץ על כפתור המסד בלוח הבקרה וגלגל להצגה הרצויה.' },
    { heading: 'עמוד הסווגים', body: 'ניתן לפתוח את עמוד הסווגים ולראות את כל הטבלאות.\n\nאם פעולה מסויימת לא בסווג הנכון, לחץ על עריכה, קבע את הסווג הנכון, לחץ על עדכון. המערכת תזכור את הבחירה גם לטעינות הבאות.' },
    { heading: 'תצוגה גרפית ועוגת התקציב', body: 'בפאנל הבקרה יש בפניך רשימה של תצוגות (דף חשבון). בחר תצוגה גרפית. מסך תצוגה שנתית גרפית תפתח בפניך. כאן אתה יכול לבחור כל מה שעולה על דעתך, כל סעיף אותו תרצה לבחון לאורך הזמן בהצגה גרפית.\n\nאתה מדף הגרפי, ברצונך לקבל מושג יותר עמוק וגם לחוות חוויה טכנולוגית מדהימה, לחץ על עוגת התקציב. בתצוגה זו תוכל לבחור את החודש הרצוי ולראות את הפריסה של ההוצאות על גבי ההכנסות. בדף העוגה, הטבלה מימין עם הבוררים מאפשרת לך לשלוט על פרוסות העוגה. להוריד או להעלות את ערכה. בביצוע הוויסות של הפרוסות אתה יכול להגיע לערכים רצויים לקבלת האיזון הרצוי לך.' },
    { heading: 'כרטיסי אשראי', body: 'עבור ללוח הבקרה, לחץ על כרטיסי האשראי ותוכל לראות את כל הכרטיסים. בחר כרטיס ותקבל פירוט.' },
    { heading: 'תכנון עתידי', body: 'עבור שוב ללוח הבקרה, לחץ על תכנון עתידי. לתכנון פעולות לחץ ותפתח כרטיסייית עריכה. בחר את המוסד הפיננסי, מספר החשבון, את ביווג הפעולה, רשום תיאור הפעולה, הערה, סכום לחיוב או לזכות וכן בכמה חודשים מדובר. בסיום לחץ על עדכון.\n\nלאחר שהכנסת את הפעולה לטבלת התכנון, אתה יכול לשכפל אותה או לשנות אותה. זאת על ידי בחית השורה ועריכה באותה הכרטיסיה. עקוב אחר ההוראות.\n\nטבלת התכנון העתידי, כמו כרטיסי האשראי, ישולבו במדויק בדף החשבון השנתי, במעקב החודשים הרלוונטיים. עדכון בכל חודש בחודשו. שים לב שבדפי החשבון השונים, יש ברירה של הצגה וניתוח הנתונים עם תכנון עתידי או בלי, עם פרוט פעולות האשראי או רק הסיכום שלהם.' },
    { heading: 'מעבר בין המסכים', body: 'בפאנל הבקרה תמצא שבעה כפתורים שמעבירים אותך בין המסכים המרכזיים של התוכנה:\n\nשנתי, חודשי, סווג, עתידי, מסד, אשראי, גרפי\n\nכל אחד מהם פותח מסך אחר, ואני אסביר על כל אחד מהם בהמשך המדריך.' },
    { heading: 'טעינת קבצים', body: 'זה המקום שבו אתה מכניס לתוכנה את הקבצים שהורדת מהבנק או מחברת האשראי (בדרך כלל קבצי Excel או CSV). לחץ על הכפתור "טען", ובחר איך אתה רוצה לטעון:\n\n•    קובץ - טעינת קובץ בודד\n•    תיקיה - טעינת כל הקבצים שנמצאים בתיקייה מסוימת בבת אחת\n•    אוטומטי - התוכנה טוענת בעצמה, ללא צורך לבחור כל קובץ בנפרד\n\nאתה לא צריך לדאוג לגבי טעינה כפולה של אותו קובץ בטעות - התוכנה מזהה תנועות שכבר קיימות אצלה ולא תוסיף אותן פעמיים. זה אומר שאתה יכול בלב שקט לטעון שוב קובץ שכבר טענת בעבר, בלי חשש שהמספרים "יתנפחו".' },
    { heading: 'חשבונות', body: 'לצד כפתורי הטעינה יש לך תווית "מס. חשבון" עם תיבות סימון - כאן אתה רואה ואת יכול לבחור באילו חשבונות בנק להתמקד (עד 4 חשבונות שונים).' },
    { heading: 'איפוס והתחלה מחדש', body: 'אם בשלב כלשהו תרצה להתחיל מחדש, יש שני כפתורים נפרדים:\n\n•    אפס מסד - מוחק את כל התנועות שנטענו\n•    אפס סיווגים - מוחק את הסיווגים שנקבעו לתנועות\n\nולסיום, כפתור "צא" ליציאה מהתוכנה.' },
    { heading: 'המסך השנתי', body: 'זהו המסך המרכזי של התוכנה, ונקרא "דף חשבון שנתי".\n\nכאן אתה רואה טבלה גדולה אחת: בשורות - כל קטגוריות ההוצאה וההכנסה שלך, ובעמודות - שלוש שנים שלמות, חודש אחר חודש. בשורה העליונה של הטבלה מופיע לך סיכום כללי - כמה נכנס, כמה יצא, מה היתרה שהצטברה מהתקופה הקודמת, ומה סך הכל.\n\nאם אתה רוצה לראות בדיוק אילו תנועות עומדות מאחורי סכום מסוים - פשוט לחץ על השורה של הקטגוריה שמעניינת אותך, והמסך ייפתח לך גם את הפירוט המלא שלה.\n\nבראש המסך יש לך כמה כפתורים:\n\n•    עידכון - מרענן את הנתונים בטבלה\n•    ייצוא - שומר את הטבלה כקובץ Excel או PDF, כדי שתוכל לשמור אותה או להדפיס אותה\n•    ריענון\n•    ניקוי\n\nוכן שני מתגים חשובים שתראה גם במסכים נוספים בהמשך:\n\n•    כולל עתידי - קובע אם הוצאות והכנסות מתוכננות לעתיד (למשל הוראות קבע) ייכללו בחישוב\n•    כולל כרטיסי אשראי - קובע אם תנועות כרטיסי האשראי ייכללו בחישוב' },
    { heading: 'המסך החודשי', body: 'המסך הזה נקרא "דף חשבון חודשי", והוא נותן לך זום-אין לחודש ספציפי שמעניין אותך.\n\nלמעלה תוכל לבחור שנה וחודש, וללחוץ על הכפתור "עדכן" כדי לראות את הנתונים של אותה תקופה.\n\nמה שמיוחד במסך הזה הוא שהוא מרכז עבורך במקום אחד שמונה טבלאות שונות, כך שאתה רואה את כל התמונה של החודש הנבחר בבת אחת:\n\n•    רשימת הוצאות\n•    ריכוז פעולות על פי סיווג\n•    הכנסות עתידיות\n•    הוצאות עתידיות\n•    חישוב יתרה\n•    מאזן חודשי\n•    כרטיסי אשראי\n•    חשבונות בנק\n\nוגם כאן, שני המתגים "כולל עתידי" ו"כולל כרטיסי אשראי" זמינים לך, אם תרצה לכלול או להשמיט אותם מהתמונה.' },
    { heading: 'מסך הסיווגים', body: 'המסך הזה נקרא "דף חשבון ממוין סיווגים", וכאן אתה רואה את כל התנועות שלך מאורגנות לפי קטגוריה - כל מה ששייך ל"מזון", כל מה ששייך ל"רכב", וכן הלאה.\n\nזה גם המקום שבו אתה יכול לתקן סיווג שהתוכנה קבעה לא נכון. התוכנה עצמה מנחה אותך בדיוק מה לעשות: "שינוי הסווג, לחץ: עריכה, בחירת סווג חדש, עידכון"\n\nכלומר - לחץ על עריכה, בחר את הקטגוריה הנכונה מהרשימה, ולחץ עידכון. חשוב לדעת: כשאתה משנה סיווג של תנועה, התוכנה זוכרת את זה, כך שבפעם הבאה שתטען תנועה דומה (עם אותו תיאור), היא כבר תסווג אותה נכון מעצמה.\n\nוגם כאן זמינים לך שני המתגים "כולל עתידי" ו"כולל כרטיסי אשראי".' },
    { heading: 'מסך המסד', body: 'המסך הזה נקרא "מסד נתונים", וזוהי הרשימה הגולמית והמלאה של כל תנועה ותנועה שנטענה לתוכנה - התאריך שלה, הבנק או חברת האשראי שממנה היא הגיעה, התיאור, הסכום, הסיווג שניתן לה, ועוד.\n\nזה המקום שאליו תוכל לפנות אם אתה רוצה לראות את "כל הנתונים כמו שהם", בלי שום סינון או קיבוץ. כפתור עידכון מרענן את הרשימה.' },
    { heading: 'מסך כרטיסי האשראי', body: 'המסך הזה נקרא "כרטיסי אשראי", וכפי שהוא עצמו מציג לך: "לפניך רשימת כרטיסי האשראי, בחר לפירוט הפעולות"\n\nבחלק העליון תראה טבלה מסכמת של כל כרטיסי האשראי שלך, חודש אחר חודש, לאורך שלוש שנים - בדיוק כמו במסך השנתי, רק ממוקד בכרטיסי אשראי. כשאתה בוחר כרטיס מסוים, מופיעה לך למטה טבלה נוספת עם פירוט לפי בתי העסק שחייבו אותו.\n\nכפתורי רענון וייצוא זמינים גם כאן.' },
    { heading: 'מסך התכנון העתידי', body: 'המסך הזה נקרא "דף חשבון עתידי", וכאן אתה מנהל הוצאות והכנסות שאתה כבר יודע עליהן מראש - הוראת קבע, תשלומים, מנוי חודשי, ועוד.\n\nהתוכנה מנחה אותך: "כרטיסיית פעולה - בחר שורה או התחל חדש".\n\nלכל פריט שאתה מוסיף יש כרטיסייה משלו, עם השדות הבאים:\n\n•    מקור\n•    סיווג\n•    הערה\n•    תיאור\n•    בנק\n•    חשבון\n•    הכנסה או הוצאה\n•    תאריך התחלה\n•    מספר תשלומים\n\nברגע שאתה קובע תאריך התחלה ומספר תשלומים, התוכנה כבר דואגת לפרוס את הסכום קדימה על פני כל אותם החודשים, ומשלבת אותו אוטומטית בכל שאר המסכים (כשהמתג "כולל עתידי" פעיל).\n\nהפעולות הזמינות לך: עדכון, חדש, עריכה, איפוס, מחיקה.' },
    { heading: 'מסך הגרפים', body: 'המסך הזה נקרא "דף חשבון בתצוגה גרפית", והוא נותן לך את אותם הנתונים - אבל בתמונה, לא בטבלה.\n\nתוכל לבחור בין כמה מצבי תצוגה: מאזן, יתרה, הוצאות, וכן תצוגה ממוקדת לפי סיווג, פריט בודד, תכנון עתידי, או כרטיסי אשראי.' },
    { heading: 'עוגת התקציב', body: 'בתוך מסך הגרפים תמצא כלי מיוחד בשם "עוגת התקציב", שמטרתו "תכנון מאזן תקציב בית" - זהו כלי לוויסות חי של התקציב שלך: אתה בוחר תקופה להצגה (שנה וחודש), ויכול לגרור ולשנות את החלוקה בין הקטגוריות ולראות מיד איך זה משפיע על האיזון הכללי של התקציב.\n\nהכפתורים הזמינים: עדכן, אפס, רענן.' },
    { heading: 'לוח ההודעות', body: 'בתחתית המסך, לאורך כל העבודה בתוכנה, יש לך לוח הודעות עם שלושה חלקים:\n\n•    מערכת - מה שקורה כרגע ברקע\n•    הנחייה - טיפים והכוונה\n•    שגיאה - אם משהו לא הצליח, כאן תדע על כך\n\nתוכל לנקות את ההודעות בכפתור ניקוי, או לשמור אותן החוצה בכפתור ייצוא.' },
    { heading: 'ניהול תקציב בית M Finance', body: 'אפליקציית ניהול תקציב בית היא גולת הכותרת של הפרויקט. הסבר מלא ופורט תוכל לקרוא במגירת המסמכים 4,5,6 במדריכים וסרטונים.\n\nבאמצעות האפליקציה תקבל מבט כולל על הפעולות הבנקאיות שלך, הכנסות והוצאות, מאזן חודשי ושנתי. תוכן להוסיף ולתכנן הוצאות או הכנסות עתידיות, בפריסת תשלומים חכמה.\n\nלחצת על מתג ניהול תקציב בית בפאנל הבקרה, יפתח שער האפליקציה, דף הדומה לשער האתר KeyClick, עם ברכת כניסה בשפה שבחרת.\n\nהאפליקציה קוראת קבצי חשבונות בנק וכרטיסי אשראי אשר הורדת מבעוד מועד מחשבונך במוסד פיננסי ועורכת ניתוח מעמיק לפעולות הבנקאיות בדפים אלה.\n\nיכולות האפליקציה למגוון תצוגות בחתכים שונים ובזמנים שונים, כולל הצגות גרפיות פרטניות.\n\nוהנה הדובדובן שבקצפת -- עוגת תקציב חיה. ההוצאות מוצגות כפרוסות בתוך עוגת ההכנסות. מנגנון חכם מאפשר לך לשנות את ערכי הפרוסות עד לקבלת מאזן.' },
    { heading: 'שירותים בנקאיים', body: 'התחלת להשתמש בתקציב ניהול בית ובא לך לקצר תהליכים, בפניך 2 אפשרויות נוספות:\n\n•    הורדה אוטומטית של קבצים של דפי חשבון למחשבך,\n•    הורדה אוטומטית של קבצים של דפי חשבון ישורות לאפליקציית ניהול תקציב בית.\n\nההתחברות לממוסד הפיננסי שלך תתבצע על ידך בלבד, התחברות רגילה כפי שאתה נוהג תמיד, על פי הגדרת הבטחון הנהוגה במוסד זה. מיד לאחר הורדת הקבצים נועלים ומתנתקים.\n\nהשירות כולל חיית התנסות בסביבה טכנולוגית מתקדמת.' },
  ],
  en: [
    { heading: 'KeyClick', body: 'The home budget management application is part of the KeyClick brand project' },
    { heading: 'Home Budget Management Home Page', body: "You clicked the button from the KeyClick site and the gate screen opens - a styled scroll with a welcome greeting and the language flag.\n\nWrong language? Choose 1 of the 11 flags at the top of the site and you'll be moved instantly to the chosen language. The multi-language system is one of the foundational units of the site and its products. You can switch languages instantly at any time.\n\nClicking anywhere on the screen closes the gate screen and opens the project's content." },
    { heading: 'Language Selection', body: "At the top of the screen you'll find a row of flags - one for each of the 11 languages the software supports. Clicking any flag instantly switches the whole software to that language - all titles, all labels, all system messages. You can switch languages at any moment, and switch back, without losing any data." },
    { heading: 'Getting Started', body: "You clicked the entry screen and entered the application. What do you see? What should you do?\n\nTo manage a budget, you first need to load the data. What are the ways to load it. There are several loading routes. During the loading process you'll receive guidance and messages.\n\nEnd of loading. What do you see? Annual account page, annual layout. Balance table, remaining balance, table of the loaded transactions, classified by category." },
    { heading: 'Annual View', body: "The main screen, which opens first after the gate page. In this view we see the information stored in the database, loaded from account statements of a financial institution. The screen is divided into two main areas. A central table with a summary of income, expenses, balances. The second part is detail tables for each category. Tapping a category opens the transaction details. All the data on the annual page is actually shown in different breakdowns and keys in the rest of the views described below." },
    { heading: 'Monthly View', body: "Want to deal with just a specific month? Click Monthly View in the control panel. A page opens showing a derivative of a specific month from the annual page. Here you can choose any month and immediately get its data on screen." },
    { heading: 'Message Panels', body: "At the bottom of the screen, three system message panels are permanently present: ongoing messages, information, and possible errors." },
    { heading: 'Control Panel', body: "Looking to the right brings us to the site's control panel. The control panel is always visible on the right side.\n\nEach of the items on the control panel serves to display something locally or move to another page. All these items are detailed further in this document.", image: { src: '/guides/mfinance-control-panel-en.jpg', width: 128, height: 814 } },
    { heading: 'Control Panel Side', body: "Whether you're right-handed or left-handed, you can click the right or left button on the control panel and the control panel will move from side to side." },
    { heading: 'AI Indicator', body: 'At the bottom of the control panel an AI indicator light is lit - green means available, red means not available. In general, even when AI is not available, the system usually knows how to handle most operations.' },
    { heading: 'Finish Working', body: 'Done working and want to close the application? Click Exit.' },
    { heading: 'Manual Loading Process', body: 'The manual loading process is carried out via the loading buttons in the control panel. Before loading you can choose to load a single specific file - click File; load all files in a folder - click Folder; automatic loading of all files in a folder - click Automatic, where you get a confirmation request for each file. Once you chose the loading method, click the Load button. A file manager will open - choose a file or folder, and confirm.' },
    { heading: 'Direct Connection to a Financial Institution', body: 'A special feature exists for loading data directly from a financial institution. Clicking the "Financial Institution" button takes you to the project\'s banking services. In this service you can connect to one of the financial institutions worldwide - those that have been arranged and are available to us. In this process you can download data to your computer, creating files for manual loading, or download the data directly to the project.' },
    { heading: 'Account Number Display', body: 'Next to the loading buttons you have an "Account No." label with checkboxes. This information is pulled after the loading process, from the data itself. Choose one or more accounts for the system to focus on (up to 4 different accounts).' },
    { heading: 'Database Screen', body: "You loaded data from account pages and want to see the raw loading, as it was loaded. Click the Database button in the control panel and scroll to the desired display." },
    { heading: 'Categories Page', body: 'You can open the categories page and see all the tables.\n\nIf a certain transaction is not in the correct category, click Edit, set the correct category, click Update. The system will remember the choice for future loads as well.' },
    { heading: 'Graphical View and the Budget Pie', body: "In the control panel you have a list of views (account page) in front of you. Choose Graphical View. An annual graphical view screen opens in front of you. Here you can choose anything that comes to mind, any item you'd like to examine over time in a graphical display.\n\nFrom the graphical page, want to get a deeper understanding and also experience an amazing technological experience? Click the Budget Pie. In this view you can choose the desired month and see the layout of expenses over income. On the pie page, the table on the right with the selectors lets you control the pie slices - lower or raise their value. By regulating the slices you can reach the desired values to get the balance you want." },
    { heading: 'Credit Cards', body: 'Go to the control panel, click Credit Cards and you can see all the cards. Choose a card and get a detailed breakdown.' },
    { heading: 'Future Planning', body: 'Go back to the control panel again, click Future Planning. To plan an action, click and an edit card opens. Choose the financial institution, the account number, the transaction category, write a description of the transaction, a note, an amount to charge or credit, and how many months it spans. When done, click Update.\n\nAfter you\'ve entered the item into the planning table, you can duplicate it or change it. Do this by selecting the row and editing within the same card. Follow the instructions.\n\nThe future planning table, like the credit cards, is integrated precisely into the annual account page, tracking the relevant months. Updated every month in its month. Note that in the various account pages, there is an option to display and analyze the data with or without future planning, with full credit card transaction detail or just their summary.' },
    { heading: 'Switching Between Screens', body: "In the control panel you'll find seven buttons that move you between the software's main screens:\n\nAnnual, Monthly, Categories, Future, Database, Credit, Graphical\n\nEach of them opens a different screen, and I'll explain each of them further in the guide." },
    { heading: 'Loading Files', body: 'This is where you bring into the software the files you downloaded from the bank or the credit card company (usually Excel or CSV files). Click the "Load" button, and choose how you want to load:\n\n•    File - load a single file\n•    Folder - load all the files in a certain folder at once\n•    Automatic - the software loads by itself, no need to choose each file separately\n\nYou don\'t need to worry about accidentally loading the same file twice - the software recognizes transactions it already has and won\'t add them again. This means you can safely reload a file you already loaded before, without worrying the numbers will "inflate".' },
    { heading: 'Accounts', body: 'Next to the loading buttons you have an "Account No." label with checkboxes - here you can see and choose which bank accounts to focus on (up to 4 different accounts).' },
    { heading: 'Reset and Start Over', body: 'If at some point you want to start over, there are two separate buttons:\n\n•    Reset Database - deletes all loaded transactions\n•    Reset Categories - deletes the categories set for the transactions\n\nAnd finally, an "Exit" button to exit the software.' },
    { heading: 'The Annual Screen', body: 'This is the main screen of the software, called "Annual Account Page".\n\nHere you see one large table: in the rows - all your expense and income categories, and in the columns - three full years, month by month. In the top row of the table a general summary appears - how much came in, how much went out, what balance carried over from the previous period, and what the total is.\n\nIf you want to see exactly which transactions are behind a certain amount - simply click the row of the category that interests you, and the screen will also open its full detail for you.\n\nAt the top of the screen you have a few buttons:\n\n•    Update - refreshes the data in the table\n•    Export - saves the table as an Excel or PDF file, so you can save or print it\n•    Refresh\n•    Clear\n\nAnd two important switches you\'ll also see on further screens:\n\n•    Include Future - determines whether future planned expenses and income (such as standing orders) are included in the calculation\n•    Include Credit Cards - determines whether credit card transactions are included in the calculation' },
    { heading: 'The Monthly Screen', body: 'This screen is called "Monthly Account Page", and it gives you a zoom-in to a specific month that interests you.\n\nAt the top you can choose a year and month, and click the "Update" button to see that period\'s data.\n\nWhat\'s special about this screen is that it centralizes eight different tables in one place for you, so you see the whole picture of the selected month at once:\n\n•    Expense list\n•    Summary of transactions by category\n•    Future income\n•    Future expenses\n•    Balance calculation\n•    Monthly balance\n•    Credit cards\n•    Bank accounts\n\nAnd here too, the two switches "Include Future" and "Include Credit Cards" are available to you, if you want to include or omit them from the picture.' },
    { heading: 'The Categories Screen', body: 'This screen is called "Sorted-by-Category Account Page", and here you see all your transactions organized by category - everything that belongs to "Food", everything that belongs to "Car", and so on.\n\nThis is also where you can fix a category the software set incorrectly. The software itself guides you exactly what to do: "To change the category, click: Edit, choose new category, Update"\n\nMeaning - click Edit, choose the correct category from the list, and click Update. Important to know: when you change a transaction\'s category, the software remembers it, so next time you load a similar transaction (with the same description), it will already classify it correctly on its own.\n\nAnd here too, the two switches "Include Future" and "Include Credit Cards" are available to you.' },
    { heading: 'The Database Screen', body: 'This screen is called "Database", and it is the raw, complete list of every single transaction loaded into the software - its date, the bank or credit card company it came from, the description, the amount, the category assigned to it, and more.\n\nThis is the place to go if you want to see "all the data as it is", without any filtering or grouping. The Update button refreshes the list.' },
    { heading: 'The Credit Cards Screen', body: 'This screen is called "Credit Cards", and as it displays itself: "Here is the list of your credit cards, choose one for a detailed breakdown"\n\nAt the top you\'ll see a summary table of all your credit cards, month by month, over three years - just like the annual screen, only focused on credit cards. When you choose a specific card, a further table appears below with a breakdown by the merchants that charged it.\n\nRefresh and Export buttons are also available here.' },
    { heading: 'The Future Planning Screen', body: 'This screen is called "Future Account Page", and here you manage expenses and income that you already know about in advance - standing orders, installment payments, monthly subscriptions, and more.\n\nThe software guides you: "Action Card - choose a row or start a new one".\n\nEach item you add has its own card, with the following fields:\n\n•    Source\n•    Category\n•    Note\n•    Description\n•    Bank\n•    Account\n•    Income or Expense\n•    Start Date\n•    Number of Payments\n\nOnce you set a start date and number of payments, the software takes care of spreading the amount forward across all those months, and integrates it automatically into all other screens (when the "Include Future" switch is on).\n\nActions available to you: Update, New, Edit, Reset, Delete.' },
    { heading: 'The Graphs Screen', body: 'This screen is called "Graphical Account Page", and it gives you the same data - but as a picture, not a table.\n\nYou can choose between several display modes: Balance, Remaining Balance, Expenses, as well as a focused display by Category, a single Item, Future Planning, or Credit Cards.' },
    { heading: 'The Budget Pie', body: 'Inside the graphs screen you\'ll find a special tool called "Budget Pie", whose purpose is "Home Budget Balance Planning" - this is a live regulation tool for your budget: you choose a period to display (year and month), and can drag and change the division between categories and immediately see how it affects the overall budget balance.\n\nAvailable buttons: Update, Reset, Refresh.' },
    { heading: 'The Message Board', body: 'At the bottom of the screen, throughout your work in the software, you have a message board with three sections:\n\n•    System - what\'s currently happening in the background\n•    Guidance - tips and direction\n•    Error - if something failed, you\'ll know about it here\n\nYou can clear the messages with the Clear button, or save them out with the Export button.' },
    { heading: 'Home Budget Management M Finance', body: "The home budget management application is the crown jewel of the project. A full, detailed explanation can be read in document drawers 4, 5, 6 in Guides and Videos.\n\nThrough the application you'll get a complete overview of your banking activity, income and expenses, monthly and annual balance. You can also add and plan future expenses or income, in a smart payment schedule.\n\nYou clicked the Home Budget Management switch on the control panel, and the application's gate will open - a page similar to the KeyClick site's gate - with a welcome greeting in the language you chose.\n\nThe application reads bank account and credit card files that you downloaded in advance from your account at a financial institution, and performs a thorough analysis of the banking transactions on these statements.\n\nThe application's capabilities span a variety of views, in different breakdowns and at different times, including individual graphical displays.\n\nAnd here's the cherry on top - a live budget pie. Expenses are shown as slices within the income pie. A smart mechanism lets you change the slice values until you reach a balance." },
    { heading: 'Banking Services', body: "Started using home budget management and want to shorten the processes? You have 2 additional options:\n\n•    Automatic download of account statement files to your computer,\n•    Automatic download of account statement files directly into the home budget management application.\n\nThe connection to your financial institution will be made by you alone, a regular login just as you always do, according to the security setup used by that institution. Immediately after downloading the files, it locks and disconnects.\n\nThe service includes a hands-on experience in an advanced technological environment." },
  ],
  ru: [
    { heading: 'KeyClick', body: 'Приложение управления семейным бюджетом является частью проекта бренда KeyClick' },
    { heading: 'Главная страница управления семейным бюджетом', body: 'Вы нажали кнопку на сайте KeyClick, и открывается экран приветствия - стилизованный свиток с приветствием и флагом языка.\n\nЯзык не подходит? Выберите 1 из 11 флагов вверху сайта, и вы будете немедленно переведены на выбранный язык. Система множества языков - одна из базовых единиц сайта и его продуктов. Вы можете в любой момент мгновенно переключаться между языками.\n\nНажатие в любом месте экрана закрывает экран приветствия и открывает содержимое проекта.' },
    { heading: 'Выбор языка', body: 'Вверху экрана вы найдёте ряд флагов - по одному для каждого из 11 языков, поддерживаемых программой. Нажатие на любой флаг мгновенно переключает всю программу на этот язык - все заголовки, все подписи, все системные сообщения. Вы можете переключаться между языками в любой момент и возвращаться обратно, не теряя никаких данных.' },
    { heading: 'Начало работы', body: 'Вы нажали на экран входа и вошли в приложение. Что вы видите? Что вам нужно делать?\n\nЧтобы управлять бюджетом, сначала нужно загрузить данные. Какие есть способы загрузки. Есть несколько маршрутов загрузки. В процессе загрузки вы получите указания и сообщения.\n\nЗавершение загрузки. Что вы видите? Годовая страница счёта, годовая раскладка. Таблица баланса, остаток, таблица загруженных операций, классифицированных по темам.' },
    { heading: 'Годовой вид', body: 'Главный экран, который открывается первым после страницы входа. В этом виде мы видим информацию, хранящуюся в базе данных, загруженную из выписок финансового учреждения. Экран разделён на две основные области. Центральная таблица со сводкой доходов, расходов, остатков и балансов. Вторая часть - таблицы детализации по каждой категории. При нажатии на категорию открывается детализация операций. Все данные на годовой странице фактически отображаются в разных разрезах и ключах в остальных представлениях, описанных далее.' },
    { heading: 'Месячный вид', body: 'Хотите работать только с определённым месяцем? Нажмите "Месячный вид" на панели управления. Откроется страница, содержащая производную определённого месяца из годовой страницы. Здесь вы можете выбрать любой месяц и сразу получить его данные на экране.' },
    { heading: 'Панели сообщений', body: 'Внизу экрана постоянно присутствуют три панели системных сообщений: текущие сообщения, информация и возможные ошибки.' },
    { heading: 'Панель управления', body: 'Взгляд направо приводит нас к панели управления сайта. Панель управления всегда видна с правой стороны.\n\nКаждый из элементов панели управления предназначен для локального отображения или перехода на другую страницу. Все эти элементы подробно описаны далее в этом документе.', image: { src: '/guides/mfinance-control-panel-ru.jpg', width: 133, height: 814 } },
    { heading: 'Сторона панели управления', body: 'Правша вы или левша, вы можете нажать кнопку "вправо" или "влево" на панели управления, и панель управления переместится с одной стороны на другую.' },
    { heading: 'Индикатор ИИ', body: 'Внизу панели управления горит индикатор ИИ - зелёный цвет означает доступность, красный - недоступность. В целом, даже когда ИИ недоступен, система обычно умеет справляться с большинством операций.' },
    { heading: 'Завершение работы', body: 'Закончили работу и хотите закрыть приложение? Нажмите "Выход".' },
    { heading: 'Процесс ручной загрузки', body: 'Процесс ручной загрузки реализуется через кнопки загрузки на панели управления. Перед загрузкой вы можете выбрать загрузку одного конкретного файла - нажмите "Файл"; загрузку всех файлов в папке - нажмите "Папка"; автоматическую загрузку всех файлов в папке - нажмите "Автоматически", при этом на каждый файл вы получите запрос подтверждения. Выбрав способ загрузки, нажмите кнопку "Загрузить". Откроется менеджер файлов - выберите файл или папку и подтвердите.' },
    { heading: 'Прямое подключение к финансовому учреждению', body: 'Существует специальная функция для загрузки данных напрямую от финансового учреждения. При нажатии кнопки "Финансовое учреждение" вы переходите к банковским сервисам проекта. В этом сервисе можно подключиться к одному из финансовых учреждений по всему миру - тем, которые были налажены и доступны нам. В этом процессе можно скачать данные на компьютер, создав файлы для ручной загрузки, или скачать данные напрямую в проект.' },
    { heading: 'Отображение номеров счетов', body: 'Рядом с кнопками загрузки у вас есть надпись "№ счёта" с флажками. Эта информация извлекается после процесса загрузки из самих данных. Выберите один или несколько счетов для фокусировки системы (до 4 разных счетов).' },
    { heading: 'Экран базы данных', body: 'Вы загрузили данные из страниц счёта и хотите увидеть исходную загрузку, как она была загружена. Нажмите кнопку "База" на панели управления и прокрутите к нужному отображению.' },
    { heading: 'Страница категорий', body: 'Вы можете открыть страницу категорий и увидеть все таблицы.\n\nЕсли определённая операция не в правильной категории, нажмите "Редактировать", установите правильную категорию, нажмите "Обновить". Система запомнит выбор и для будущих загрузок.' },
    { heading: 'Графический вид и бюджетная диаграмма', body: 'На панели управления перед вами список представлений (страница счёта). Выберите "Графический вид". Перед вами откроется экран годового графического представления. Здесь вы можете выбрать всё, что придёт вам в голову, любой пункт, который вы хотите рассмотреть во времени в графическом отображении.\n\nВы на графической странице, хотите получить более глубокое представление, а заодно испытать потрясающий технологический опыт - нажмите на "Бюджетную диаграмму". В этом представлении вы можете выбрать нужный месяц и увидеть раскладку расходов поверх доходов. На странице диаграммы таблица справа с переключателями позволяет вам управлять сегментами диаграммы - уменьшать или увеличивать их значение. Регулируя сегменты, вы можете достичь желаемых значений для получения нужного баланса.' },
    { heading: 'Кредитные карты', body: 'Перейдите на панель управления, нажмите "Кредитные карты", и вы увидите все карты. Выберите карту и получите детализацию.' },
    { heading: 'Будущее планирование', body: 'Снова перейдите на панель управления, нажмите "Будущее планирование". Для планирования операции нажмите, и откроется карточка редактирования. Выберите финансовое учреждение, номер счёта, категорию операции, впишите описание операции, примечание, сумму к списанию или зачислению, а также на сколько месяцев это рассчитано. По завершении нажмите "Обновить".\n\nПосле того как вы внесли операцию в таблицу планирования, вы можете продублировать её или изменить. Для этого выберите строку и редактируйте в той же карточке. Следуйте указаниям.\n\nТаблица будущего планирования, как и кредитные карты, точно интегрируется в годовую страницу счёта, отслеживая соответствующие месяцы. Обновление происходит каждый месяц в своём месяце. Обратите внимание, что на разных страницах счёта есть возможность отображать и анализировать данные с будущим планированием или без него, с полной детализацией операций по картам или только с их сводкой.' },
    { heading: 'Переход между экранами', body: 'На панели управления вы найдёте семь кнопок, которые переводят вас между основными экранами программы:\n\nГодовой, Месячный, Категории, Будущее, База, Кредит, Графика\n\nКаждая из них открывает отдельный экран, и я расскажу о каждом из них далее в руководстве.' },
    { heading: 'Загрузка файлов', body: 'Здесь вы вносите в программу файлы, скачанные из банка или от кредитной компании (обычно файлы Excel или CSV). Нажмите кнопку "Загрузить" и выберите, как вы хотите загрузить:\n\n•    Файл - загрузка одного файла\n•    Папка - загрузка всех файлов, находящихся в определённой папке, сразу\n•    Автоматически - программа загружает самостоятельно, без необходимости выбирать каждый файл отдельно\n\nВам не нужно беспокоиться о случайной повторной загрузке того же файла - программа распознаёт уже имеющиеся у неё операции и не добавит их повторно. Это значит, что вы можете спокойно снова загрузить файл, который уже загружали раньше, не опасаясь, что цифры "раздуются".' },
    { heading: 'Счета', body: 'Рядом с кнопками загрузки у вас есть надпись "№ счёта" с флажками - здесь вы видите и можете выбрать, на каких банковских счетах сосредоточиться (до 4 разных счетов).' },
    { heading: 'Сброс и начало заново', body: 'Если на каком-то этапе вы захотите начать заново, есть две отдельные кнопки:\n\n•    Сбросить базу - удаляет все загруженные операции\n•    Сбросить категории - удаляет установленные для операций категории\n\nИ, наконец, кнопка "Выход" для выхода из программы.' },
    { heading: 'Годовой экран', body: 'Это главный экран программы, называется "Годовая страница счёта".\n\nЗдесь вы видите одну большую таблицу: в строках - все ваши категории расходов и доходов, а в столбцах - три полных года, месяц за месяцем. В верхней строке таблицы отображается общая сводка - сколько поступило, сколько ушло, какой остаток накопился с предыдущего периода, и какой итог.\n\nЕсли вы хотите увидеть, какие именно операции стоят за определённой суммой - просто нажмите на строку интересующей вас категории, и экран также откроет вам её полную детализацию.\n\nВверху экрана у вас есть несколько кнопок:\n\n•    Обновление - обновляет данные в таблице\n•    Экспорт - сохраняет таблицу в файл Excel или PDF, чтобы вы могли её сохранить или распечатать\n•    Обновить\n•    Очистить\n\nА также два важных переключателя, которые вы также увидите на следующих экранах:\n\n•    Включая будущее - определяет, включаются ли в расчёт запланированные будущие расходы и доходы (например, постоянные поручения)\n•    Включая кредитные карты - определяет, включаются ли в расчёт операции по кредитным картам' },
    { heading: 'Месячный экран', body: 'Этот экран называется "Месячная страница счёта", и он даёт вам увеличение конкретного интересующего вас месяца.\n\nВверху вы можете выбрать год и месяц и нажать кнопку "Обновить", чтобы увидеть данные за этот период.\n\nОсобенность этого экрана в том, что он объединяет для вас в одном месте восемь разных таблиц, так что вы видите всю картину выбранного месяца сразу:\n\n•    Список расходов\n•    Сводка операций по категориям\n•    Будущие доходы\n•    Будущие расходы\n•    Расчёт остатка\n•    Месячный баланс\n•    Кредитные карты\n•    Банковские счета\n\nИ здесь тоже вам доступны два переключателя "Включая будущее" и "Включая кредитные карты", если вы хотите включить или исключить их из картины.' },
    { heading: 'Экран категорий', body: 'Этот экран называется "Страница счёта, отсортированная по категориям", и здесь вы видите все свои операции, организованные по категориям - всё, что относится к "Еде", всё, что относится к "Автомобилю", и так далее.\n\nЭто также место, где вы можете исправить категорию, которую программа установила неверно. Сама программа точно указывает вам, что делать: "Для изменения категории нажмите: Редактировать, выбор новой категории, Обновить"\n\nТо есть - нажмите "Редактировать", выберите правильную категорию из списка и нажмите "Обновить". Важно знать: когда вы меняете категорию операции, программа это запоминает, так что в следующий раз, когда вы загрузите похожую операцию (с тем же описанием), она уже классифицирует её правильно сама.\n\nИ здесь тоже вам доступны два переключателя "Включая будущее" и "Включая кредитные карты".' },
    { heading: 'Экран базы данных', body: 'Этот экран называется "База данных", и это исходный, полный список каждой операции, загруженной в программу - её дата, банк или кредитная компания, из которой она пришла, описание, сумма, присвоенная ей категория и многое другое.\n\nЭто место, куда стоит обратиться, если вы хотите увидеть "все данные как есть", без какой-либо фильтрации или группировки. Кнопка "Обновление" обновляет список.' },
    { heading: 'Экран кредитных карт', body: 'Этот экран называется "Кредитные карты", и как он сам показывает вам: "Перед вами список ваших кредитных карт, выберите для детализации операций"\n\nВ верхней части вы увидите сводную таблицу всех ваших кредитных карт, месяц за месяцем, за три года - точно как на годовом экране, только сфокусированную на кредитных картах. Когда вы выбираете определённую карту, внизу появляется дополнительная таблица с детализацией по торговым точкам, которые её списали.\n\nКнопки "Обновить" и "Экспорт" также доступны здесь.' },
    { heading: 'Экран будущего планирования', body: 'Этот экран называется "Страница будущего счёта", и здесь вы управляете расходами и доходами, о которых вы уже знаете заранее - постоянные поручения, платежи, ежемесячные подписки и другое.\n\nПрограмма направляет вас: "Карточка операции - выберите строку или начните новую".\n\nУ каждого добавляемого вами пункта своя карточка, со следующими полями:\n\n•    Источник\n•    Категория\n•    Примечание\n•    Описание\n•    Банк\n•    Счёт\n•    Доход или расход\n•    Дата начала\n•    Количество платежей\n\nКак только вы устанавливаете дату начала и количество платежей, программа сама распределяет сумму вперёд на все эти месяцы, и автоматически интегрирует её во все остальные экраны (когда включён переключатель "Включая будущее").\n\nДоступные вам действия: Обновить, Новый, Редактировать, Сбросить, Удалить.' },
    { heading: 'Экран графиков', body: 'Этот экран называется "Страница счёта в графическом представлении", и он даёт вам те же данные - но в виде картинки, а не таблицы.\n\nВы можете выбрать между несколькими режимами отображения: Баланс, Остаток, Расходы, а также фокусированное отображение по Категории, отдельному Пункту, Будущему планированию или Кредитным картам.' },
    { heading: 'Бюджетная диаграмма', body: 'Внутри экрана графиков вы найдёте специальный инструмент под названием "Бюджетная диаграмма", цель которого - "Планирование баланса семейного бюджета" - это инструмент живого регулирования вашего бюджета: вы выбираете период для отображения (год и месяц), и можете перетаскивать и менять распределение между категориями и сразу видеть, как это влияет на общий баланс бюджета.\n\nДоступные кнопки: Обновить, Сбросить, Обновить.' },
    { heading: 'Доска сообщений', body: 'Внизу экрана, на протяжении всей работы в программе, у вас есть доска сообщений с тремя разделами:\n\n•    Система - что происходит сейчас в фоновом режиме\n•    Указание - советы и направление\n•    Ошибка - если что-то не удалось, вы узнаете об этом здесь\n\nВы можете очистить сообщения кнопкой "Очистить", или сохранить их кнопкой "Экспорт".' },
    { heading: 'Управление семейным бюджетом M Finance', body: 'Приложение управления семейным бюджетом - это жемчужина проекта. Полное, подробное объяснение можно прочитать в ящиках документов 4, 5, 6 в разделе "Руководства и видео".\n\nС помощью приложения вы получите полный обзор своих банковских операций, доходов и расходов, месячного и годового баланса. Вы также можете добавлять и планировать будущие расходы или доходы, с умной раскладкой платежей.\n\nВы нажали переключатель "Управление семейным бюджетом" на панели управления, откроется вход в приложение - страница, похожая на вход на сайт KeyClick, с приветствием на выбранном вами языке.\n\nПриложение считывает файлы банковских счетов и кредитных карт, которые вы заранее скачали со своего счёта в финансовом учреждении, и проводит глубокий анализ банковских операций в этих выписках.\n\nВозможности приложения охватывают разнообразные представления в разных разрезах и в разное время, включая индивидуальные графические отображения.\n\nИ вот вишенка на торте - живая бюджетная диаграмма. Расходы отображаются как сегменты внутри диаграммы доходов. Умный механизм позволяет вам менять значения сегментов до достижения баланса.' },
    { heading: 'Банковские услуги', body: 'Начали использовать управление семейным бюджетом и хотите сократить процессы? Перед вами 2 дополнительные возможности:\n\n•    Автоматическая загрузка файлов выписок по счёту на ваш компьютер,\n•    Автоматическая загрузка файлов выписок по счёту напрямую в приложение управления семейным бюджетом.\n\nПодключение к вашему финансовому учреждению будет выполнено только вами, обычный вход, как вы всегда делаете, согласно настройкам безопасности, принятым в этом учреждении. Сразу после скачивания файлов происходит блокировка и отключение.\n\nУслуга включает практический опыт в передовой технологической среде.' },
  ],
  de: [
    { heading: 'KeyClick', body: 'Die Anwendung zur Haushaltsbudgetverwaltung ist Teil des KeyClick-Markenprojekts' },
    { heading: 'Startseite der Haushaltsbudgetverwaltung', body: 'Sie haben auf die Schaltfläche der KeyClick-Website geklickt, und der Eingangsbildschirm öffnet sich - eine stilisierte Schriftrolle mit Begrüßung und der Sprachflagge.\n\nSprache passt nicht? Wählen Sie 1 von 11 Flaggen oben auf der Website, und Sie werden sofort zur gewählten Sprache weitergeleitet. Das Mehrsprachensystem ist eine der Grundeinheiten der Website und ihrer Produkte. Sie können jederzeit sofort zwischen Sprachen wechseln.\n\nEin Klick irgendwo auf den Bildschirm schließt den Eingangsbildschirm und öffnet den Inhalt des Projekts.' },
    { heading: 'Sprachauswahl', body: 'Oben auf dem Bildschirm finden Sie eine Reihe von Flaggen - eine für jede der 11 von der Software unterstützten Sprachen. Ein Klick auf eine beliebige Flagge wechselt sofort die gesamte Software in diese Sprache - alle Titel, alle Beschriftungen, alle Systemmeldungen. Sie können jederzeit zwischen Sprachen wechseln und zurückwechseln, ohne Daten zu verlieren.' },
    { heading: 'Erste Schritte', body: 'Sie haben auf den Eingangsbildschirm geklickt und die Anwendung betreten. Was sehen Sie? Was sollten Sie tun?\n\nUm ein Budget zu verwalten, müssen Sie zunächst die Daten laden. Was sind die Möglichkeiten zum Laden. Es gibt mehrere Ladewege. Während des Ladevorgangs erhalten Sie Anleitungen und Meldungen.\n\nEnde des Ladevorgangs. Was sehen Sie? Jährliche Kontoseite, Jahresübersicht. Saldotabelle, verbleibendes Guthaben, Tabelle der geladenen Transaktionen, nach Themen klassifiziert.' },
    { heading: 'Jahresansicht', body: 'Der Hauptbildschirm, der zuerst nach der Eingangsseite geöffnet wird. In dieser Ansicht sehen wir die in der Datenbank gespeicherten Informationen, geladen aus Kontoauszügen eines Finanzinstituts. Der Bildschirm ist in zwei Hauptbereiche unterteilt. Eine zentrale Tabelle mit einer Zusammenfassung von Einnahmen, Ausgaben, Salden und Bilanzen. Der zweite Teil sind Detailtabellen für jede Kategorie. Ein Tippen auf die Kategorie öffnet die Transaktionsdetails. Alle Daten auf der Jahresseite werden tatsächlich in verschiedenen Aufschlüsselungen und Schlüsseln in den übrigen unten beschriebenen Ansichten angezeigt.' },
    { heading: 'Monatsansicht', body: 'Möchten Sie sich nur mit einem bestimmten Monat befassen? Klicken Sie im Bedienfeld auf Monatsansicht. Es öffnet sich eine Seite mit einer Ableitung eines bestimmten Monats aus der Jahresseite. Hier können Sie jeden Monat auswählen und erhalten sofort dessen Daten auf dem Bildschirm.' },
    { heading: 'Nachrichtenfelder', body: 'Am unteren Rand des Bildschirms sind dauerhaft drei Systemnachrichtenfelder vorhanden: laufende Meldungen, Informationen und mögliche Fehler.' },
    { heading: 'Bedienfeld', body: 'Ein Blick nach rechts bringt uns zum Bedienfeld der Website. Das Bedienfeld ist immer auf der rechten Seite sichtbar.\n\nJedes der Elemente im Bedienfeld dient dazu, eine lokale Anzeige darzustellen oder zu einer anderen Seite zu wechseln. Alle diese Elemente werden im weiteren Verlauf dieses Dokuments detailliert beschrieben.', image: { src: '/guides/mfinance-control-panel-de.jpg', width: 136, height: 809 } },
    { heading: 'Seite des Bedienfelds', body: 'Ob Sie Rechtshänder oder Linkshänder sind, Sie können die Schaltfläche rechts oder links im Bedienfeld klicken, und das Bedienfeld wechselt von einer Seite zur anderen.' },
    { heading: 'KI-Anzeige', body: 'Am unteren Rand des Bedienfelds leuchtet eine KI-Anzeigeleuchte - grün bedeutet verfügbar, rot bedeutet nicht verfügbar. Im Allgemeinen kann das System auch dann, wenn KI nicht verfügbar ist, mit den meisten Vorgängen umgehen.' },
    { heading: 'Arbeit beenden', body: 'Fertig mit der Arbeit und möchten die Anwendung schließen? Klicken Sie auf Beenden.' },
    { heading: 'Manueller Ladevorgang', body: 'Der manuelle Ladevorgang erfolgt über die Lade-Schaltflächen im Bedienfeld. Vor dem Laden können Sie wählen, eine einzelne bestimmte Datei zu laden - klicken Sie auf Datei; alle Dateien in einem Ordner zu laden - klicken Sie auf Ordner; automatisches Laden aller Dateien in einem Ordner - klicken Sie auf Automatisch, wobei Sie für jede Datei eine Bestätigungsanfrage erhalten. Nachdem Sie die Lademethode gewählt haben, klicken Sie auf die Schaltfläche Laden. Ein Dateimanager öffnet sich - wählen Sie eine Datei oder einen Ordner und bestätigen Sie.' },
    { heading: 'Direkte Verbindung zu einem Finanzinstitut', body: 'Es gibt eine spezielle Funktion zum direkten Laden von Daten von einem Finanzinstitut. Ein Klick auf die Schaltfläche „Finanzinstitut" führt Sie zu den Bankdienstleistungen des Projekts. In diesem Dienst können Sie sich mit einem der Finanzinstitute weltweit verbinden - jenen, die eingerichtet und für uns verfügbar sind. In diesem Prozess können Sie Daten auf Ihren Computer herunterladen und Dateien für den manuellen Import erstellen, oder die Daten direkt in das Projekt herunterladen.' },
    { heading: 'Kontonummernanzeige', body: 'Neben den Lade-Schaltflächen haben Sie eine Beschriftung „Kontonr." mit Kontrollkästchen. Diese Information wird nach dem Ladevorgang aus den Daten selbst abgerufen. Wählen Sie ein oder mehrere Konten aus, auf die sich das System konzentrieren soll (bis zu 4 verschiedene Konten).' },
    { heading: 'Datenbankbildschirm', body: 'Sie haben Daten aus Kontoseiten geladen und möchten den rohen Ladevorgang sehen, so wie er geladen wurde. Klicken Sie im Bedienfeld auf die Schaltfläche Datenbank und scrollen Sie zur gewünschten Anzeige.' },
    { heading: 'Kategorienseite', body: 'Sie können die Kategorienseite öffnen und alle Tabellen sehen.\n\nWenn eine bestimmte Transaktion nicht in der richtigen Kategorie ist, klicken Sie auf Bearbeiten, legen Sie die richtige Kategorie fest, klicken Sie auf Aktualisieren. Das System merkt sich die Wahl auch für zukünftige Ladevorgänge.' },
    { heading: 'Grafische Ansicht und der Budgetkuchen', body: 'Im Bedienfeld haben Sie eine Liste von Ansichten (Kontoseite) vor sich. Wählen Sie Grafische Ansicht. Ein Bildschirm mit jährlicher grafischer Ansicht öffnet sich vor Ihnen. Hier können Sie alles auswählen, was Ihnen einfällt, jeden Punkt, den Sie im Laufe der Zeit in grafischer Darstellung betrachten möchten.\n\nSie sind auf der grafischen Seite und möchten ein tieferes Verständnis gewinnen und gleichzeitig ein erstaunliches technologisches Erlebnis erfahren - klicken Sie auf den Budgetkuchen. In dieser Ansicht können Sie den gewünschten Monat auswählen und die Verteilung der Ausgaben über die Einnahmen sehen. Auf der Kuchenseite ermöglicht Ihnen die Tabelle rechts mit den Reglern, die Kuchensegmente zu steuern - ihren Wert zu senken oder zu erhöhen. Durch Regulieren der Segmente können Sie die gewünschten Werte erreichen, um die gewünschte Balance zu erhalten.' },
    { heading: 'Kreditkarten', body: 'Gehen Sie zum Bedienfeld, klicken Sie auf Kreditkarten, und Sie können alle Karten sehen. Wählen Sie eine Karte und erhalten Sie eine detaillierte Aufschlüsselung.' },
    { heading: 'Zukunftsplanung', body: 'Gehen Sie erneut zum Bedienfeld, klicken Sie auf Zukunftsplanung. Um eine Aktion zu planen, klicken Sie, und eine Bearbeitungskarte öffnet sich. Wählen Sie das Finanzinstitut, die Kontonummer, die Transaktionskategorie, schreiben Sie eine Beschreibung der Transaktion, eine Notiz, einen zu belastenden oder gutzuschreibenden Betrag sowie die Anzahl der Monate. Klicken Sie am Ende auf Aktualisieren.\n\nNachdem Sie den Posten in die Planungstabelle eingegeben haben, können Sie ihn duplizieren oder ändern. Tun Sie dies, indem Sie die Zeile auswählen und in derselben Karte bearbeiten. Folgen Sie den Anweisungen.\n\nDie Zukunftsplanungstabelle wird, wie die Kreditkarten, präzise in die jährliche Kontoseite integriert und verfolgt die relevanten Monate. Aktualisierung jeden Monat in seinem Monat. Beachten Sie, dass es auf den verschiedenen Kontoseiten die Möglichkeit gibt, die Daten mit oder ohne Zukunftsplanung anzuzeigen und zu analysieren, mit vollständiger Detaillierung der Kreditkartentransaktionen oder nur mit deren Zusammenfassung.' },
    { heading: 'Wechsel zwischen den Bildschirmen', body: 'Im Bedienfeld finden Sie sieben Schaltflächen, die Sie zwischen den Hauptbildschirmen der Software bewegen:\n\nJährlich, Monatlich, Kategorien, Zukunft, Datenbank, Kredit, Grafisch\n\nJede von ihnen öffnet einen anderen Bildschirm, und ich werde jede von ihnen im weiteren Verlauf des Leitfadens erklären.' },
    { heading: 'Dateien laden', body: 'Hier bringen Sie die von der Bank oder der Kreditkartengesellschaft heruntergeladenen Dateien (in der Regel Excel- oder CSV-Dateien) in die Software. Klicken Sie auf die Schaltfläche „Laden" und wählen Sie, wie Sie laden möchten:\n\n•    Datei - Laden einer einzelnen Datei\n•    Ordner - Laden aller Dateien in einem bestimmten Ordner auf einmal\n•    Automatisch - die Software lädt selbstständig, ohne dass jede Datei einzeln ausgewählt werden muss\n\nSie müssen sich keine Sorgen machen, dieselbe Datei versehentlich zweimal zu laden - die Software erkennt bereits vorhandene Transaktionen und fügt sie nicht erneut hinzu. Das bedeutet, Sie können beruhigt eine bereits geladene Datei erneut laden, ohne befürchten zu müssen, dass sich die Zahlen „aufblähen".' },
    { heading: 'Konten', body: 'Neben den Lade-Schaltflächen haben Sie eine Beschriftung „Kontonr." mit Kontrollkästchen - hier sehen Sie und können auswählen, auf welche Bankkonten Sie sich konzentrieren möchten (bis zu 4 verschiedene Konten).' },
    { heading: 'Zurücksetzen und Neustart', body: 'Wenn Sie an einem bestimmten Punkt neu beginnen möchten, gibt es zwei separate Schaltflächen:\n\n•    Datenbank zurücksetzen - löscht alle geladenen Transaktionen\n•    Kategorien zurücksetzen - löscht die für die Transaktionen festgelegten Kategorien\n\nUnd schließlich eine Schaltfläche „Beenden", um die Software zu verlassen.' },
    { heading: 'Der Jahresbildschirm', body: 'Dies ist der Hauptbildschirm der Software, genannt „Jährliche Kontoseite".\n\nHier sehen Sie eine große Tabelle: in den Zeilen - alle Ihre Ausgaben- und Einnahmenkategorien, und in den Spalten - drei volle Jahre, Monat für Monat. In der oberen Zeile der Tabelle erscheint eine allgemeine Zusammenfassung - wie viel einging, wie viel ausging, welches Guthaben aus der vorherigen Periode übertragen wurde, und wie hoch die Gesamtsumme ist.\n\nWenn Sie genau sehen möchten, welche Transaktionen hinter einem bestimmten Betrag stehen - klicken Sie einfach auf die Zeile der Sie interessierenden Kategorie, und der Bildschirm öffnet Ihnen auch deren vollständige Details.\n\nOben auf dem Bildschirm haben Sie einige Schaltflächen:\n\n•    Aktualisierung - aktualisiert die Daten in der Tabelle\n•    Export - speichert die Tabelle als Excel- oder PDF-Datei, damit Sie sie speichern oder drucken können\n•    Auffrischen\n•    Löschen\n\nUnd zwei wichtige Schalter, die Sie auch auf weiteren Bildschirmen sehen werden:\n\n•    Zukunft einschließen - bestimmt, ob geplante zukünftige Ausgaben und Einnahmen (z. B. Daueraufträge) in die Berechnung einbezogen werden\n•    Kreditkarten einschließen - bestimmt, ob Kreditkartentransaktionen in die Berechnung einbezogen werden' },
    { heading: 'Der Monatsbildschirm', body: 'Dieser Bildschirm heißt „Monatliche Kontoseite" und gibt Ihnen einen Zoom auf einen bestimmten, Sie interessierenden Monat.\n\nOben können Sie ein Jahr und einen Monat auswählen und auf die Schaltfläche „Aktualisieren" klicken, um die Daten dieses Zeitraums zu sehen.\n\nDas Besondere an diesem Bildschirm ist, dass er für Sie acht verschiedene Tabellen an einem Ort zusammenfasst, sodass Sie das gesamte Bild des ausgewählten Monats auf einmal sehen:\n\n•    Ausgabenliste\n•    Zusammenfassung der Transaktionen nach Kategorie\n•    Zukünftige Einnahmen\n•    Zukünftige Ausgaben\n•    Saldoberechnung\n•    Monatlicher Saldo\n•    Kreditkarten\n•    Bankkonten\n\nAuch hier stehen Ihnen die beiden Schalter „Zukunft einschließen" und „Kreditkarten einschließen" zur Verfügung, wenn Sie sie ein- oder ausblenden möchten.' },
    { heading: 'Der Kategorienbildschirm', body: 'Dieser Bildschirm heißt „Nach Kategorien sortierte Kontoseite", und hier sehen Sie all Ihre Transaktionen nach Kategorie organisiert - alles, was zu „Lebensmittel" gehört, alles, was zu „Auto" gehört, und so weiter.\n\nDies ist auch der Ort, an dem Sie eine von der Software falsch festgelegte Kategorie korrigieren können. Die Software selbst leitet Sie genau an, was zu tun ist: „Um die Kategorie zu ändern, klicken Sie: Bearbeiten, neue Kategorie wählen, Aktualisieren"\n\nDas heißt - klicken Sie auf Bearbeiten, wählen Sie die richtige Kategorie aus der Liste und klicken Sie auf Aktualisieren. Wichtig zu wissen: Wenn Sie die Kategorie einer Transaktion ändern, merkt sich die Software dies, sodass sie beim nächsten Laden einer ähnlichen Transaktion (mit derselben Beschreibung) diese bereits von selbst korrekt klassifiziert.\n\nAuch hier stehen Ihnen die beiden Schalter „Zukunft einschließen" und „Kreditkarten einschließen" zur Verfügung.' },
    { heading: 'Der Datenbankbildschirm', body: 'Dieser Bildschirm heißt „Datenbank" und ist die rohe, vollständige Liste jeder einzelnen in die Software geladenen Transaktion - ihr Datum, die Bank oder Kreditkartengesellschaft, von der sie stammt, die Beschreibung, der Betrag, die ihr zugewiesene Kategorie und mehr.\n\nDies ist der Ort, an den Sie sich wenden können, wenn Sie „alle Daten wie sie sind" sehen möchten, ohne jegliche Filterung oder Gruppierung. Die Schaltfläche Aktualisierung aktualisiert die Liste.' },
    { heading: 'Der Kreditkartenbildschirm', body: 'Dieser Bildschirm heißt „Kreditkarten", und wie er selbst Ihnen anzeigt: „Hier ist die Liste Ihrer Kreditkarten, wählen Sie eine für eine detaillierte Aufschlüsselung"\n\nOben sehen Sie eine zusammenfassende Tabelle all Ihrer Kreditkarten, Monat für Monat, über drei Jahre - genau wie der Jahresbildschirm, nur auf Kreditkarten fokussiert. Wenn Sie eine bestimmte Karte auswählen, erscheint darunter eine weitere Tabelle mit einer Aufschlüsselung nach den Händlern, die sie belastet haben.\n\nSchaltflächen Auffrischen und Export sind hier ebenfalls verfügbar.' },
    { heading: 'Der Zukunftsplanungsbildschirm', body: 'Dieser Bildschirm heißt „Zukünftige Kontoseite", und hier verwalten Sie Ausgaben und Einnahmen, von denen Sie bereits im Voraus wissen - Daueraufträge, Ratenzahlungen, monatliche Abonnements und mehr.\n\nDie Software leitet Sie an: „Aktionskarte - wählen Sie eine Zeile oder beginnen Sie eine neue".\n\nJeder von Ihnen hinzugefügte Posten hat seine eigene Karte mit folgenden Feldern:\n\n•    Quelle\n•    Kategorie\n•    Notiz\n•    Beschreibung\n•    Bank\n•    Konto\n•    Einnahme oder Ausgabe\n•    Startdatum\n•    Anzahl der Zahlungen\n\nSobald Sie ein Startdatum und eine Anzahl von Zahlungen festlegen, sorgt die Software dafür, den Betrag über all diese Monate vorauszuverteilen, und integriert ihn automatisch in alle anderen Bildschirme (wenn der Schalter „Zukunft einschließen" aktiviert ist).\n\nVerfügbare Aktionen: Aktualisieren, Neu, Bearbeiten, Zurücksetzen, Löschen.' },
    { heading: 'Der Diagrammbildschirm', body: 'Dieser Bildschirm heißt „Kontoseite in grafischer Ansicht" und gibt Ihnen dieselben Daten - aber als Bild, nicht als Tabelle.\n\nSie können zwischen mehreren Anzeigemodi wählen: Saldo, Restguthaben, Ausgaben, sowie eine fokussierte Anzeige nach Kategorie, einem einzelnen Posten, Zukunftsplanung oder Kreditkarten.' },
    { heading: 'Der Budgetkuchen', body: 'Im Diagrammbildschirm finden Sie ein spezielles Werkzeug namens „Budgetkuchen", dessen Zweck „Planung der Haushaltsbudgetbalance" ist - dies ist ein Live-Regulierungswerkzeug für Ihr Budget: Sie wählen einen anzuzeigenden Zeitraum (Jahr und Monat), und können die Verteilung zwischen den Kategorien ziehen und ändern und sofort sehen, wie sich dies auf das Gesamtbudgetgleichgewicht auswirkt.\n\nVerfügbare Schaltflächen: Aktualisieren, Zurücksetzen, Auffrischen.' },
    { heading: 'Das Nachrichtenbrett', body: 'Am unteren Rand des Bildschirms haben Sie während Ihrer gesamten Arbeit in der Software ein Nachrichtenbrett mit drei Abschnitten:\n\n•    System - was gerade im Hintergrund passiert\n•    Anleitung - Tipps und Richtung\n•    Fehler - wenn etwas fehlgeschlagen ist, erfahren Sie es hier\n\nSie können die Nachrichten mit der Schaltfläche Löschen leeren, oder sie mit der Schaltfläche Export speichern.' },
    { heading: 'Haushaltsbudgetverwaltung M Finance', body: 'Die Anwendung zur Haushaltsbudgetverwaltung ist das Kronjuwel des Projekts. Eine vollständige, detaillierte Erklärung finden Sie in den Dokumentenschubladen 4, 5, 6 unter Anleitungen und Videos.\n\nÜber die Anwendung erhalten Sie einen vollständigen Überblick über Ihre Bankaktivitäten, Einnahmen und Ausgaben, monatlichen und jährlichen Saldo. Sie können auch zukünftige Ausgaben oder Einnahmen hinzufügen und planen, in einem intelligenten Zahlungsplan.\n\nSie haben den Schalter Haushaltsbudgetverwaltung im Bedienfeld angeklickt, das Eingangstor der Anwendung öffnet sich - eine Seite ähnlich dem Eingangstor der KeyClick-Website - mit einer Begrüßung in der von Ihnen gewählten Sprache.\n\nDie Anwendung liest Bankkonto- und Kreditkartendateien, die Sie im Voraus von Ihrem Konto bei einem Finanzinstitut heruntergeladen haben, und führt eine gründliche Analyse der Bankgeschäfte in diesen Auszügen durch.\n\nDie Fähigkeiten der Anwendung erstrecken sich über eine Vielzahl von Ansichten, in verschiedenen Aufschlüsselungen und zu verschiedenen Zeiten, einschließlich individueller grafischer Darstellungen.\n\nUnd hier ist das Sahnehäubchen - ein lebendiger Budgetkuchen. Ausgaben werden als Segmente innerhalb des Einnahmenkuchens dargestellt. Ein intelligenter Mechanismus lässt Sie die Segmentwerte ändern, bis Sie ein Gleichgewicht erreichen.' },
    { heading: 'Bankdienstleistungen', body: 'Haben Sie mit der Nutzung der Haushaltsbudgetverwaltung begonnen und möchten die Prozesse verkürzen? Sie haben 2 zusätzliche Möglichkeiten:\n\n•    Automatischer Download von Kontoauszugsdateien auf Ihren Computer,\n•    Automatischer Download von Kontoauszugsdateien direkt in die Haushaltsbudgetverwaltungs-Anwendung.\n\nDie Verbindung zu Ihrem Finanzinstitut erfolgt ausschließlich durch Sie, eine reguläre Anmeldung, wie Sie es immer tun, gemäß den bei diesem Institut geltenden Sicherheitseinstellungen. Unmittelbar nach dem Herunterladen der Dateien wird gesperrt und die Verbindung getrennt.\n\nDer Dienst umfasst ein praktisches Erlebnis in einer fortschrittlichen technologischen Umgebung.' },
  ],
  fr: [
    { heading: 'KeyClick', body: "L'application de gestion du budget familial fait partie du projet de la marque KeyClick" },
    { heading: 'Page d\'accueil de la gestion du budget familial', body: "Vous avez cliqué sur le bouton du site KeyClick et l'écran d'accueil s'ouvre - un parchemin stylisé avec un message de bienvenue et le drapeau de la langue.\n\nLa langue ne convient pas ? Choisissez 1 des 11 drapeaux en haut du site et vous serez immédiatement redirigé vers la langue choisie. Le système multilingue est l'une des unités fondamentales du site et de ses produits. Vous pouvez passer instantanément d'une langue à l'autre à tout moment.\n\nCliquer n'importe où sur l'écran ferme l'écran d'accueil et ouvre le contenu du projet." },
    { heading: 'Choix de la langue', body: "En haut de l'écran, vous trouverez une rangée de drapeaux - un pour chacune des 11 langues prises en charge par le logiciel. Cliquer sur n'importe quel drapeau bascule instantanément tout le logiciel vers cette langue - tous les titres, toutes les étiquettes, tous les messages système. Vous pouvez changer de langue à tout moment, et revenir en arrière, sans perdre aucune donnée." },
    { heading: 'Premiers pas', body: "Vous avez cliqué sur l'écran d'entrée et êtes entré dans l'application. Que voyez-vous ? Que devez-vous faire ?\n\nPour gérer un budget, vous devez d'abord charger les données. Quelles sont les façons de charger. Il existe plusieurs parcours de chargement. Pendant le processus de chargement, vous recevrez des instructions et des messages.\n\nFin du chargement. Que voyez-vous ? Page de compte annuelle, présentation annuelle. Tableau de solde, solde restant, tableau des transactions chargées, classées par sujet." },
    { heading: 'Vue annuelle', body: "L'écran principal, qui s'ouvre en premier après la page d'accueil. Dans cette vue, nous voyons les informations stockées dans la base de données, chargées à partir des relevés de compte d'un établissement financier. L'écran est divisé en deux zones principales. Un tableau central comprenant un résumé des revenus, dépenses, soldes et bilans. La seconde partie est constituée de tableaux de détail pour chaque catégorie. Toucher la catégorie ouvre le détail des transactions. Toutes les données de la page annuelle sont en fait affichées selon différentes coupes et clés dans le reste des vues décrites plus loin." },
    { heading: 'Vue mensuelle', body: "Vous voulez traiter uniquement un mois spécifique ? Cliquez sur Vue mensuelle dans le panneau de contrôle. Une page s'ouvre contenant une dérivée d'un mois spécifique à partir de la page annuelle. Ici, vous pouvez choisir n'importe quel mois et obtenir immédiatement ses données à l'écran." },
    { heading: 'Panneaux de messages', body: "En bas de l'écran, trois panneaux de messages système sont présents en permanence : messages courants, informations et erreurs éventuelles." },
    { heading: 'Panneau de contrôle', body: "Un regard vers la droite nous amène au panneau de contrôle du site. Le panneau de contrôle est toujours visible du côté droit.\n\nChacun des éléments du panneau de contrôle sert à afficher quelque chose localement ou à passer à une autre page. Tous ces éléments sont détaillés plus loin dans ce document.", image: { src: '/guides/mfinance-control-panel-fr.jpg', width: 134, height: 817 } },
    { heading: 'Côté du panneau de contrôle', body: "Que vous soyez droitier ou gaucher, vous pouvez cliquer sur le bouton droit ou gauche du panneau de contrôle, et le panneau de contrôle passera d'un côté à l'autre." },
    { heading: "Voyant d'IA", body: "En bas du panneau de contrôle, un voyant IA est allumé - le vert signifie disponible, le rouge signifie non disponible. En général, même lorsque l'IA n'est pas disponible, le système sait généralement gérer la plupart des opérations." },
    { heading: 'Fin du travail', body: "Vous avez terminé de travailler et souhaitez fermer l'application ? Cliquez sur Quitter." },
    { heading: 'Processus de chargement manuel', body: "Le processus de chargement manuel s'effectue via les boutons de chargement du panneau de contrôle. Avant le chargement, vous pouvez choisir de charger un seul fichier spécifique - cliquez sur Fichier ; charger tous les fichiers d'un dossier - cliquez sur Dossier ; chargement automatique de tous les fichiers d'un dossier - cliquez sur Automatique, où vous recevrez une demande de confirmation pour chaque fichier. Une fois la méthode de chargement choisie, cliquez sur le bouton Charger. Un gestionnaire de fichiers s'ouvrira - choisissez un fichier ou un dossier, et confirmez." },
    { heading: 'Connexion directe à un établissement financier', body: "Une fonction spéciale existe pour charger des données directement depuis un établissement financier. Cliquer sur le bouton « Établissement financier » vous amène aux services bancaires du projet. Dans ce service, vous pouvez vous connecter à l'un des établissements financiers du monde entier - ceux qui ont été mis en place et sont disponibles pour nous. Dans ce processus, vous pouvez télécharger des données sur votre ordinateur, en créant des fichiers pour un chargement manuel, ou télécharger les données directement dans le projet." },
    { heading: 'Affichage des numéros de compte', body: "À côté des boutons de chargement, vous avez une étiquette « N° de compte » avec des cases à cocher. Cette information est extraite après le processus de chargement, à partir des données elles-mêmes. Choisissez un ou plusieurs comptes sur lesquels le système doit se concentrer (jusqu'à 4 comptes différents)." },
    { heading: 'Écran de la base de données', body: "Vous avez chargé des données à partir des pages de compte et souhaitez voir le chargement brut, tel qu'il a été chargé. Cliquez sur le bouton Base de données dans le panneau de contrôle et faites défiler jusqu'à l'affichage souhaité." },
    { heading: 'Page des catégories', body: "Vous pouvez ouvrir la page des catégories et voir tous les tableaux.\n\nSi une transaction donnée n'est pas dans la bonne catégorie, cliquez sur Modifier, définissez la bonne catégorie, cliquez sur Mettre à jour. Le système se souviendra du choix également pour les chargements futurs." },
    { heading: 'Vue graphique et le camembert budgétaire', body: "Dans le panneau de contrôle, vous avez devant vous une liste de vues (page de compte). Choisissez Vue graphique. Un écran de vue graphique annuelle s'ouvre devant vous. Ici, vous pouvez choisir tout ce qui vous vient à l'esprit, tout élément que vous souhaitez examiner dans le temps en affichage graphique.\n\nVous êtes sur la page graphique, vous voulez obtenir une compréhension plus profonde et vivre également une expérience technologique incroyable - cliquez sur le Camembert budgétaire. Dans cette vue, vous pouvez choisir le mois souhaité et voir la répartition des dépenses par rapport aux revenus. Sur la page du camembert, le tableau de droite avec les sélecteurs vous permet de contrôler les parts du camembert - de baisser ou d'augmenter leur valeur. En régulant les parts, vous pouvez atteindre les valeurs souhaitées pour obtenir l'équilibre que vous voulez." },
    { heading: 'Cartes de crédit', body: 'Allez au panneau de contrôle, cliquez sur Cartes de crédit et vous pourrez voir toutes les cartes. Choisissez une carte et obtenez une répartition détaillée.' },
    { heading: 'Planification future', body: "Retournez au panneau de contrôle, cliquez sur Planification future. Pour planifier une action, cliquez et une fiche d'édition s'ouvre. Choisissez l'établissement financier, le numéro de compte, la catégorie de la transaction, écrivez une description de la transaction, une note, un montant à débiter ou créditer, ainsi que le nombre de mois concernés. À la fin, cliquez sur Mettre à jour.\n\nAprès avoir saisi l'élément dans le tableau de planification, vous pouvez le dupliquer ou le modifier. Faites-le en sélectionnant la ligne et en modifiant dans la même fiche. Suivez les instructions.\n\nLe tableau de planification future, comme les cartes de crédit, s'intègre précisément dans la page de compte annuelle, en suivant les mois pertinents. Mise à jour chaque mois dans son mois. Notez que sur les différentes pages de compte, il existe une option pour afficher et analyser les données avec ou sans planification future, avec le détail complet des transactions par carte de crédit ou seulement leur résumé." },
    { heading: 'Basculer entre les écrans', body: "Dans le panneau de contrôle, vous trouverez sept boutons qui vous font passer entre les écrans principaux du logiciel :\n\nAnnuel, Mensuel, Catégories, Futur, Base de données, Crédit, Graphique\n\nChacun d'eux ouvre un écran différent, et j'expliquerai chacun d'eux plus loin dans le guide." },
    { heading: 'Chargement de fichiers', body: "C'est ici que vous apportez au logiciel les fichiers que vous avez téléchargés depuis la banque ou la société de carte de crédit (généralement des fichiers Excel ou CSV). Cliquez sur le bouton « Charger », et choisissez comment vous voulez charger :\n\n•    Fichier - chargement d'un seul fichier\n•    Dossier - chargement de tous les fichiers d'un dossier donné en une seule fois\n•    Automatique - le logiciel charge par lui-même, sans avoir besoin de choisir chaque fichier séparément\n\nVous n'avez pas à vous soucier de charger accidentellement le même fichier deux fois - le logiciel reconnaît les transactions déjà présentes et ne les ajoutera pas à nouveau. Cela signifie que vous pouvez recharger sereinement un fichier déjà chargé auparavant, sans craindre que les chiffres ne « gonflent »." },
    { heading: 'Comptes', body: "À côté des boutons de chargement, vous avez une étiquette « N° de compte » avec des cases à cocher - ici vous voyez et pouvez choisir sur quels comptes bancaires vous concentrer (jusqu'à 4 comptes différents)." },
    { heading: 'Réinitialisation et nouveau départ', body: "Si à un moment donné vous souhaitez recommencer, il existe deux boutons séparés :\n\n•    Réinitialiser la base de données - supprime toutes les transactions chargées\n•    Réinitialiser les catégories - supprime les catégories définies pour les transactions\n\nEt enfin, un bouton « Quitter » pour quitter le logiciel." },
    { heading: "L'écran annuel", body: "C'est l'écran principal du logiciel, appelé « Page de compte annuelle ».\n\nIci, vous voyez un grand tableau : dans les lignes - toutes vos catégories de dépenses et de revenus, et dans les colonnes - trois années complètes, mois par mois. Dans la ligne supérieure du tableau apparaît un résumé général - combien est entré, combien est sorti, quel solde a été reporté de la période précédente, et quel est le total.\n\nSi vous voulez voir exactement quelles transactions se cachent derrière un montant donné - cliquez simplement sur la ligne de la catégorie qui vous intéresse, et l'écran vous ouvrira également son détail complet.\n\nEn haut de l'écran, vous avez quelques boutons :\n\n•    Mise à jour - actualise les données du tableau\n•    Export - enregistre le tableau en fichier Excel ou PDF, afin que vous puissiez le sauvegarder ou l'imprimer\n•    Rafraîchir\n•    Effacer\n\nEt deux interrupteurs importants que vous verrez aussi sur les écrans suivants :\n\n•    Inclure le futur - détermine si les dépenses et revenus futurs planifiés (comme les ordres permanents) sont inclus dans le calcul\n•    Inclure les cartes de crédit - détermine si les transactions par carte de crédit sont incluses dans le calcul" },
    { heading: "L'écran mensuel", body: "Cet écran s'appelle « Page de compte mensuelle », et il vous donne un zoom sur un mois spécifique qui vous intéresse.\n\nEn haut, vous pouvez choisir une année et un mois, et cliquer sur le bouton « Mettre à jour » pour voir les données de cette période.\n\nCe qui est particulier à cet écran, c'est qu'il centralise pour vous huit tableaux différents en un seul endroit, afin que vous voyiez toute l'image du mois sélectionné en une seule fois :\n\n•    Liste des dépenses\n•    Résumé des transactions par catégorie\n•    Revenus futurs\n•    Dépenses futures\n•    Calcul du solde\n•    Solde mensuel\n•    Cartes de crédit\n•    Comptes bancaires\n\nEt ici aussi, les deux interrupteurs « Inclure le futur » et « Inclure les cartes de crédit » sont à votre disposition, si vous voulez les inclure ou les omettre de l'image." },
    { heading: 'L\'écran des catégories', body: 'Cet écran s\'appelle « Page de compte triée par catégorie », et ici vous voyez toutes vos transactions organisées par catégorie - tout ce qui appartient à « Alimentation », tout ce qui appartient à « Voiture », et ainsi de suite.\n\nC\'est aussi l\'endroit où vous pouvez corriger une catégorie que le logiciel a mal définie. Le logiciel lui-même vous guide exactement sur quoi faire : « Pour changer la catégorie, cliquez : Modifier, choisir une nouvelle catégorie, Mettre à jour »\n\nC\'est-à-dire - cliquez sur Modifier, choisissez la bonne catégorie dans la liste, et cliquez sur Mettre à jour. Important à savoir : lorsque vous changez la catégorie d\'une transaction, le logiciel s\'en souvient, de sorte que la prochaine fois que vous chargerez une transaction similaire (avec la même description), il la classera déjà correctement de lui-même.\n\nEt ici aussi, les deux interrupteurs « Inclure le futur » et « Inclure les cartes de crédit » sont à votre disposition.' },
    { heading: 'L\'écran de la base de données', body: 'Cet écran s\'appelle « Base de données », et c\'est la liste brute et complète de chaque transaction chargée dans le logiciel - sa date, la banque ou la société de carte de crédit d\'où elle provient, la description, le montant, la catégorie qui lui est attribuée, et plus encore.\n\nC\'est l\'endroit où aller si vous voulez voir « toutes les données telles qu\'elles sont », sans aucun filtrage ni regroupement. Le bouton Mise à jour actualise la liste.' },
    { heading: 'L\'écran des cartes de crédit', body: 'Cet écran s\'appelle « Cartes de crédit », et comme il vous l\'indique lui-même : « Voici la liste de vos cartes de crédit, choisissez-en une pour un détail des opérations »\n\nEn haut, vous verrez un tableau récapitulatif de toutes vos cartes de crédit, mois par mois, sur trois ans - exactement comme l\'écran annuel, mais centré sur les cartes de crédit. Lorsque vous choisissez une carte spécifique, un tableau supplémentaire apparaît en dessous avec un détail par commerçants qui l\'ont débitée.\n\nLes boutons Rafraîchir et Export sont également disponibles ici.' },
    { heading: 'L\'écran de planification future', body: 'Cet écran s\'appelle « Page de compte future », et ici vous gérez les dépenses et revenus que vous connaissez déjà à l\'avance - ordres permanents, paiements échelonnés, abonnements mensuels, et plus encore.\n\nLe logiciel vous guide : « Fiche d\'action - choisissez une ligne ou commencez-en une nouvelle ».\n\nChaque élément que vous ajoutez a sa propre fiche, avec les champs suivants :\n\n•    Source\n•    Catégorie\n•    Note\n•    Description\n•    Banque\n•    Compte\n•    Revenu ou dépense\n•    Date de début\n•    Nombre de paiements\n\nDès que vous définissez une date de début et un nombre de paiements, le logiciel se charge de répartir le montant en avant sur tous ces mois, et l\'intègre automatiquement dans tous les autres écrans (lorsque l\'interrupteur « Inclure le futur » est activé).\n\nActions disponibles : Mettre à jour, Nouveau, Modifier, Réinitialiser, Supprimer.' },
    { heading: 'L\'écran des graphiques', body: 'Cet écran s\'appelle « Page de compte en vue graphique », et il vous donne les mêmes données - mais sous forme d\'image, pas de tableau.\n\nVous pouvez choisir entre plusieurs modes d\'affichage : Solde, Solde restant, Dépenses, ainsi qu\'un affichage ciblé par Catégorie, un Élément unique, Planification future, ou Cartes de crédit.' },
    { heading: 'Le camembert budgétaire', body: 'Dans l\'écran des graphiques, vous trouverez un outil spécial appelé « Camembert budgétaire », dont le but est la « Planification de l\'équilibre du budget familial » - c\'est un outil de régulation en direct de votre budget : vous choisissez une période à afficher (année et mois), et pouvez faire glisser et modifier la répartition entre les catégories et voir immédiatement comment cela affecte l\'équilibre budgétaire global.\n\nBoutons disponibles : Mettre à jour, Réinitialiser, Rafraîchir.' },
    { heading: 'Le tableau des messages', body: 'En bas de l\'écran, tout au long de votre travail dans le logiciel, vous avez un tableau de messages avec trois sections :\n\n•    Système - ce qui se passe actuellement en arrière-plan\n•    Conseil - astuces et orientation\n•    Erreur - si quelque chose a échoué, vous le saurez ici\n\nVous pouvez effacer les messages avec le bouton Effacer, ou les enregistrer avec le bouton Export.' },
    { heading: 'Gestion du budget familial M Finance', body: 'L\'application de gestion du budget familial est le joyau du projet. Une explication complète et détaillée peut être lue dans les tiroirs de documents 4, 5, 6 dans Guides et vidéos.\n\nGrâce à l\'application, vous obtiendrez une vue d\'ensemble complète de vos activités bancaires, revenus et dépenses, solde mensuel et annuel. Vous pouvez également ajouter et planifier des dépenses ou revenus futurs, avec un échéancier de paiement intelligent.\n\nVous avez cliqué sur l\'interrupteur Gestion du budget familial dans le panneau de contrôle, la porte d\'entrée de l\'application s\'ouvrira - une page similaire à la porte d\'entrée du site KeyClick - avec un message de bienvenue dans la langue que vous avez choisie.\n\nL\'application lit les fichiers de compte bancaire et de carte de crédit que vous avez téléchargés à l\'avance depuis votre compte auprès d\'un établissement financier, et effectue une analyse approfondie des opérations bancaires dans ces relevés.\n\nLes capacités de l\'application couvrent une variété de vues, selon différentes coupes et à différents moments, y compris des affichages graphiques individuels.\n\nEt voici la cerise sur le gâteau - un camembert budgétaire vivant. Les dépenses sont affichées comme des parts à l\'intérieur du camembert des revenus. Un mécanisme intelligent vous permet de modifier les valeurs des parts jusqu\'à atteindre un équilibre.' },
    { heading: 'Services bancaires', body: 'Vous avez commencé à utiliser la gestion du budget familial et vous voulez raccourcir les processus ? Vous avez 2 options supplémentaires :\n\n•    Téléchargement automatique des fichiers de relevés de compte sur votre ordinateur,\n•    Téléchargement automatique des fichiers de relevés de compte directement dans l\'application de gestion du budget familial.\n\nLa connexion à votre établissement financier sera effectuée par vous seul, une connexion normale comme vous le faites toujours, selon la configuration de sécurité en vigueur dans cet établissement. Immédiatement après le téléchargement des fichiers, cela se verrouille et se déconnecte.\n\nLe service comprend une expérience pratique dans un environnement technologique avancé.' },
  ],
  es: [
    { heading: 'KeyClick', body: 'La aplicación de gestión del presupuesto familiar forma parte del proyecto de la marca KeyClick' },
    { heading: 'Página de inicio de la gestión del presupuesto familiar', body: 'Hizo clic en el botón del sitio KeyClick y se abre la pantalla de bienvenida - un pergamino estilizado con un saludo de bienvenida y la bandera del idioma.\n\n¿El idioma no es el correcto? Elija 1 de las 11 banderas en la parte superior del sitio y será trasladado de inmediato al idioma elegido. El sistema multilingüe es una de las unidades básicas del sitio y sus productos. Puede cambiar de idioma instantáneamente en cualquier momento.\n\nHacer clic en cualquier parte de la pantalla cierra la pantalla de bienvenida y abre el contenido del proyecto.' },
    { heading: 'Selección de idioma', body: 'En la parte superior de la pantalla encontrará una fila de banderas - una para cada uno de los 11 idiomas que admite el software. Al hacer clic en cualquier bandera, todo el software cambia instantáneamente a ese idioma - todos los títulos, todas las etiquetas, todos los mensajes del sistema. Puede cambiar de idioma en cualquier momento, y volver atrás, sin perder ningún dato.' },
    { heading: 'Primeros pasos', body: 'Hizo clic en la pantalla de entrada y entró en la aplicación. ¿Qué ve? ¿Qué debe hacer?\n\nPara gestionar un presupuesto, primero debe cargar los datos. Cuáles son las formas de cargar. Hay varias rutas de carga. Durante el proceso de carga recibirá indicaciones y mensajes.\n\nFin de la carga. ¿Qué ve? Página de cuenta anual, disposición anual. Tabla de saldo, saldo restante, tabla de las transacciones cargadas, clasificadas por tema.' },
    { heading: 'Vista anual', body: 'La pantalla principal, que se abre primero después de la página de entrada. En esta vista vemos la información almacenada en la base de datos, cargada desde los extractos de cuenta de una entidad financiera. La pantalla se divide en dos áreas principales. Una tabla central con un resumen de ingresos, gastos, saldos y balances. La segunda parte son tablas de detalle para cada categoría. Al tocar la categoría se abre el detalle de las transacciones. Todos los datos de la página anual se muestran en realidad en diferentes desgloses y claves en el resto de las vistas descritas más adelante.' },
    { heading: 'Vista mensual', body: '¿Quiere ocuparse solo de un mes específico? Haga clic en Vista mensual en el panel de control. Se abre una página que contiene una derivada de un mes específico de la página anual. Aquí puede elegir cualquier mes y obtener inmediatamente sus datos en pantalla.' },
    { heading: 'Paneles de mensajes', body: 'En la parte inferior de la pantalla, tres paneles de mensajes del sistema están presentes permanentemente: mensajes en curso, información y posibles errores.' },
    { heading: 'Panel de control', body: 'Una mirada hacia la derecha nos lleva al panel de control del sitio. El panel de control siempre está visible en el lado derecho.\n\nCada uno de los elementos del panel de control sirve para mostrar algo localmente o pasar a otra página. Todos estos elementos se detallan más adelante en este documento.', image: { src: '/guides/mfinance-control-panel-es.jpg', width: 137, height: 811 } },
    { heading: 'Lado del panel de control', body: 'Ya sea diestro o zurdo, puede hacer clic en el botón derecho o izquierdo del panel de control, y el panel de control se moverá de un lado a otro.' },
    { heading: 'Indicador de IA', body: 'En la parte inferior del panel de control hay una luz indicadora de IA encendida - verde significa disponible, rojo significa no disponible. En general, incluso cuando la IA no está disponible, el sistema generalmente sabe manejar la mayoría de las operaciones.' },
    { heading: 'Finalizar el trabajo', body: '¿Terminó de trabajar y quiere cerrar la aplicación? Haga clic en Salir.' },
    { heading: 'Proceso de carga manual', body: 'El proceso de carga manual se realiza a través de los botones de carga en el panel de control. Antes de cargar puede elegir cargar un solo archivo específico - haga clic en Archivo; cargar todos los archivos de una carpeta - haga clic en Carpeta; carga automática de todos los archivos de una carpeta - haga clic en Automático, donde recibirá una solicitud de confirmación por cada archivo. Una vez elegido el método de carga, haga clic en el botón Cargar. Se abrirá un administrador de archivos - elija un archivo o carpeta, y confirme.' },
    { heading: 'Conexión directa con una entidad financiera', body: 'Existe una función especial para cargar datos directamente desde una entidad financiera. Al hacer clic en el botón "Entidad financiera" se le llevará a los servicios bancarios del proyecto. En este servicio puede conectarse a una de las entidades financieras de todo el mundo - aquellas que se han organizado y están disponibles para nosotros. En este proceso puede descargar datos a su computadora, creando archivos para carga manual, o descargar los datos directamente al proyecto.' },
    { heading: 'Visualización de números de cuenta', body: 'Junto a los botones de carga tiene una etiqueta "N.º de cuenta" con casillas de verificación. Esta información se extrae después del proceso de carga, a partir de los propios datos. Elija una o más cuentas para que el sistema se centre en ellas (hasta 4 cuentas diferentes).' },
    { heading: 'Pantalla de la base de datos', body: 'Cargó datos de páginas de cuenta y quiere ver la carga en bruto, tal como se cargó. Haga clic en el botón Base de datos en el panel de control y desplácese hasta la visualización deseada.' },
    { heading: 'Página de categorías', body: 'Puede abrir la página de categorías y ver todas las tablas.\n\nSi una transacción determinada no está en la categoría correcta, haga clic en Editar, establezca la categoría correcta, haga clic en Actualizar. El sistema recordará la elección también para las cargas futuras.' },
    { heading: 'Vista gráfica y el gráfico circular de presupuesto', body: 'En el panel de control tiene ante usted una lista de vistas (página de cuenta). Elija Vista gráfica. Se abre ante usted una pantalla de vista gráfica anual. Aquí puede elegir cualquier cosa que se le ocurra, cualquier punto que desee examinar a lo largo del tiempo en visualización gráfica.\n\nEstá en la página gráfica, ¿quiere obtener una comprensión más profunda y además vivir una experiencia tecnológica asombrosa? Haga clic en el Gráfico circular de presupuesto. En esta vista puede elegir el mes deseado y ver la distribución de los gastos sobre los ingresos. En la página del gráfico circular, la tabla de la derecha con los selectores le permite controlar las porciones del gráfico - bajar o subir su valor. Al regular las porciones puede alcanzar los valores deseados para obtener el equilibrio que desea.' },
    { heading: 'Tarjetas de crédito', body: 'Vaya al panel de control, haga clic en Tarjetas de crédito y podrá ver todas las tarjetas. Elija una tarjeta y obtenga un desglose detallado.' },
    { heading: 'Planificación futura', body: 'Vuelva de nuevo al panel de control, haga clic en Planificación futura. Para planificar una acción, haga clic y se abre una ficha de edición. Elija la entidad financiera, el número de cuenta, la categoría de la transacción, escriba una descripción de la transacción, una nota, un monto a cargar o acreditar, y en cuántos meses se distribuye. Al terminar, haga clic en Actualizar.\n\nDespués de ingresar el elemento en la tabla de planificación, puede duplicarlo o modificarlo. Hágalo seleccionando la fila y editando en la misma ficha. Siga las instrucciones.\n\nLa tabla de planificación futura, al igual que las tarjetas de crédito, se integra con precisión en la página de cuenta anual, siguiendo los meses relevantes. Se actualiza cada mes en su mes. Tenga en cuenta que en las distintas páginas de cuenta hay una opción para mostrar y analizar los datos con o sin planificación futura, con detalle completo de las transacciones de tarjeta de crédito o solo con su resumen.' },
    { heading: 'Cambiar entre pantallas', body: 'En el panel de control encontrará siete botones que le mueven entre las pantallas principales del software:\n\nAnual, Mensual, Categorías, Futuro, Base de datos, Crédito, Gráfico\n\nCada uno de ellos abre una pantalla diferente, y explicaré cada uno de ellos más adelante en la guía.' },
    { heading: 'Carga de archivos', body: 'Aquí es donde introduce en el software los archivos que descargó del banco o de la empresa de tarjetas de crédito (generalmente archivos Excel o CSV). Haga clic en el botón "Cargar", y elija cómo desea cargar:\n\n•    Archivo - carga de un solo archivo\n•    Carpeta - carga de todos los archivos que se encuentran en una carpeta determinada a la vez\n•    Automático - el software carga por sí mismo, sin necesidad de elegir cada archivo por separado\n\nNo necesita preocuparse por cargar accidentalmente el mismo archivo dos veces - el software reconoce las transacciones que ya tiene y no las agregará de nuevo. Esto significa que puede volver a cargar tranquilamente un archivo que ya cargó antes, sin temor a que las cifras se "inflen".' },
    { heading: 'Cuentas', body: 'Junto a los botones de carga tiene una etiqueta "N.º de cuenta" con casillas de verificación - aquí puede ver y elegir en qué cuentas bancarias enfocarse (hasta 4 cuentas diferentes).' },
    { heading: 'Restablecer y empezar de nuevo', body: 'Si en algún momento quiere empezar de nuevo, hay dos botones separados:\n\n•    Restablecer base de datos - elimina todas las transacciones cargadas\n•    Restablecer categorías - elimina las categorías establecidas para las transacciones\n\nY finalmente, un botón "Salir" para salir del software.' },
    { heading: 'La pantalla anual', body: 'Esta es la pantalla principal del software, llamada "Página de cuenta anual".\n\nAquí ve una gran tabla: en las filas - todas sus categorías de gastos e ingresos, y en las columnas - tres años completos, mes a mes. En la fila superior de la tabla aparece un resumen general - cuánto entró, cuánto salió, qué saldo se arrastró del período anterior, y cuál es el total.\n\nSi quiere ver exactamente qué transacciones hay detrás de un monto determinado - simplemente haga clic en la fila de la categoría que le interesa, y la pantalla también le abrirá su detalle completo.\n\nEn la parte superior de la pantalla tiene algunos botones:\n\n•    Actualización - actualiza los datos de la tabla\n•    Exportar - guarda la tabla como archivo Excel o PDF, para que pueda guardarla o imprimirla\n•    Refrescar\n•    Limpiar\n\nY dos interruptores importantes que también verá en pantallas posteriores:\n\n•    Incluir futuro - determina si los gastos e ingresos futuros planificados (como órdenes permanentes) se incluyen en el cálculo\n•    Incluir tarjetas de crédito - determina si las transacciones de tarjeta de crédito se incluyen en el cálculo' },
    { heading: 'La pantalla mensual', body: 'Esta pantalla se llama "Página de cuenta mensual", y le da un acercamiento a un mes específico que le interesa.\n\nEn la parte superior puede elegir un año y mes, y hacer clic en el botón "Actualizar" para ver los datos de ese período.\n\nLo especial de esta pantalla es que centraliza para usted ocho tablas diferentes en un solo lugar, de modo que ve toda la imagen del mes seleccionado de una vez:\n\n•    Lista de gastos\n•    Resumen de transacciones por categoría\n•    Ingresos futuros\n•    Gastos futuros\n•    Cálculo de saldo\n•    Balance mensual\n•    Tarjetas de crédito\n•    Cuentas bancarias\n\nY aquí también, los dos interruptores "Incluir futuro" e "Incluir tarjetas de crédito" están disponibles para usted, si desea incluirlos u omitirlos de la imagen.' },
    { heading: 'La pantalla de categorías', body: 'Esta pantalla se llama "Página de cuenta ordenada por categorías", y aquí ve todas sus transacciones organizadas por categoría - todo lo que pertenece a "Alimentación", todo lo que pertenece a "Coche", y así sucesivamente.\n\nEste es también el lugar donde puede corregir una categoría que el software estableció incorrectamente. El propio software le guía exactamente sobre qué hacer: "Para cambiar la categoría, haga clic: Editar, elegir nueva categoría, Actualizar"\n\nEs decir - haga clic en Editar, elija la categoría correcta de la lista, y haga clic en Actualizar. Importante saber: cuando cambia la categoría de una transacción, el software lo recuerda, de modo que la próxima vez que cargue una transacción similar (con la misma descripción), ya la clasificará correctamente por sí mismo.\n\nY aquí también, los dos interruptores "Incluir futuro" e "Incluir tarjetas de crédito" están disponibles para usted.' },
    { heading: 'La pantalla de la base de datos', body: 'Esta pantalla se llama "Base de datos", y es la lista en bruto y completa de cada transacción cargada en el software - su fecha, el banco o la empresa de tarjeta de crédito de donde proviene, la descripción, el monto, la categoría asignada, y más.\n\nEste es el lugar al que acudir si quiere ver "todos los datos tal cual son", sin ningún filtrado ni agrupación. El botón Actualización refresca la lista.' },
    { heading: 'La pantalla de tarjetas de crédito', body: 'Esta pantalla se llama "Tarjetas de crédito", y como ella misma le muestra: "Aquí tiene la lista de sus tarjetas de crédito, elija una para un desglose detallado"\n\nEn la parte superior verá una tabla resumen de todas sus tarjetas de crédito, mes a mes, durante tres años - exactamente como la pantalla anual, solo que centrada en tarjetas de crédito. Cuando elige una tarjeta específica, aparece debajo una tabla adicional con un desglose por los comercios que la cargaron.\n\nLos botones Refrescar y Exportar también están disponibles aquí.' },
    { heading: 'La pantalla de planificación futura', body: 'Esta pantalla se llama "Página de cuenta futura", y aquí gestiona gastos e ingresos que ya conoce de antemano - órdenes permanentes, pagos a plazos, suscripciones mensuales, y más.\n\nEl software le guía: "Ficha de acción - elija una fila o comience una nueva".\n\nCada elemento que agrega tiene su propia ficha, con los siguientes campos:\n\n•    Fuente\n•    Categoría\n•    Nota\n•    Descripción\n•    Banco\n•    Cuenta\n•    Ingreso o gasto\n•    Fecha de inicio\n•    Número de pagos\n\nUna vez que establece una fecha de inicio y un número de pagos, el software se encarga de distribuir el monto hacia adelante a lo largo de todos esos meses, y lo integra automáticamente en todas las demás pantallas (cuando el interruptor "Incluir futuro" está activado).\n\nAcciones disponibles: Actualizar, Nuevo, Editar, Restablecer, Eliminar.' },
    { heading: 'La pantalla de gráficos', body: 'Esta pantalla se llama "Página de cuenta en vista gráfica", y le da los mismos datos - pero como imagen, no como tabla.\n\nPuede elegir entre varios modos de visualización: Saldo, Saldo restante, Gastos, así como una visualización enfocada por Categoría, un Elemento individual, Planificación futura, o Tarjetas de crédito.' },
    { heading: 'El gráfico circular de presupuesto', body: 'Dentro de la pantalla de gráficos encontrará una herramienta especial llamada "Gráfico circular de presupuesto", cuyo propósito es "Planificación del equilibrio del presupuesto familiar" - esta es una herramienta de regulación en vivo de su presupuesto: elige un período para mostrar (año y mes), y puede arrastrar y cambiar la división entre categorías y ver inmediatamente cómo afecta al equilibrio general del presupuesto.\n\nBotones disponibles: Actualizar, Restablecer, Refrescar.' },
    { heading: 'El tablón de mensajes', body: 'En la parte inferior de la pantalla, a lo largo de todo su trabajo en el software, tiene un tablón de mensajes con tres secciones:\n\n•    Sistema - lo que está sucediendo actualmente en segundo plano\n•    Orientación - consejos y dirección\n•    Error - si algo falló, aquí lo sabrá\n\nPuede borrar los mensajes con el botón Limpiar, o guardarlos con el botón Exportar.' },
    { heading: 'Gestión del presupuesto familiar M Finance', body: 'La aplicación de gestión del presupuesto familiar es la joya de la corona del proyecto. Puede leer una explicación completa y detallada en los cajones de documentos 4, 5, 6 en Guías y videos.\n\nA través de la aplicación obtendrá una visión general completa de su actividad bancaria, ingresos y gastos, saldo mensual y anual. También puede agregar y planificar gastos o ingresos futuros, en un calendario de pagos inteligente.\n\nHizo clic en el interruptor Gestión del presupuesto familiar en el panel de control, se abrirá la puerta de entrada de la aplicación - una página similar a la puerta de entrada del sitio KeyClick - con un saludo de bienvenida en el idioma que eligió.\n\nLa aplicación lee archivos de cuenta bancaria y tarjeta de crédito que descargó de antemano de su cuenta en una entidad financiera, y realiza un análisis exhaustivo de las operaciones bancarias en estos extractos.\n\nLas capacidades de la aplicación abarcan una variedad de vistas, en diferentes desgloses y en diferentes momentos, incluyendo visualizaciones gráficas individuales.\n\nY aquí está la guinda del pastel - un gráfico circular de presupuesto en vivo. Los gastos se muestran como porciones dentro del gráfico circular de ingresos. Un mecanismo inteligente le permite cambiar los valores de las porciones hasta alcanzar un equilibrio.' },
    { heading: 'Servicios bancarios', body: '¿Empezó a usar la gestión del presupuesto familiar y quiere acortar los procesos? Tiene 2 opciones adicionales:\n\n•    Descarga automática de archivos de extractos de cuenta a su computadora,\n•    Descarga automática de archivos de extractos de cuenta directamente a la aplicación de gestión del presupuesto familiar.\n\nLa conexión con su entidad financiera la realizará usted solo, un inicio de sesión normal como siempre lo hace, según la configuración de seguridad vigente en esa entidad. Inmediatamente después de descargar los archivos, se bloquea y se desconecta.\n\nEl servicio incluye una experiencia práctica en un entorno tecnológico avanzado.' },
  ],
  ja: [
    { heading: 'KeyClick', body: '家計管理アプリケーションはKeyClickブランドプロジェクトの一部です' },
    { heading: '家計管理のホームページ', body: 'KeyClickサイトのボタンをクリックすると、ゲート画面が開きます - 歓迎の挨拶と言語の旗が描かれたスタイリッシュな巻物です。\n\n言語が合いませんか？サイト上部の11の旗のうち1つを選ぶと、すぐに選択した言語に切り替わります。多言語システムはサイトとその製品の基本単位の一つです。いつでも即座に言語を切り替えられます。\n\n画面のどこかをクリックするとゲート画面が閉じ、プロジェクトの内容が開きます。' },
    { heading: '言語選択', body: '画面上部には、ソフトウェアがサポートする11言語それぞれの旗の列があります。任意の旗をクリックすると、ソフトウェア全体が即座にその言語に切り替わります - すべてのタイトル、すべてのラベル、すべてのシステムメッセージ。いつでも言語を切り替えたり戻したりでき、データが失われることはありません。' },
    { heading: '使い始める', body: 'ログイン画面をクリックしてアプリケーションに入りました。何が見えますか？何をすべきですか？\n\n予算を管理するには、まずデータを読み込む必要があります。読み込みの方法は何ですか。読み込みにはいくつかの経路があります。読み込みの過程でガイダンスとメッセージを受け取ります。\n\n読み込み完了。何が見えますか？年間口座ページ、年間レイアウト。残高表、繰越残高、カテゴリー別に分類された読み込み済み取引の表。' },
    { heading: '年間表示', body: 'ゲートページの後に最初に開くメイン画面です。この表示では、金融機関の明細書から読み込まれ、データベースに保存された情報を見ます。画面は2つの主要な領域に分かれています。収入、支出、残高、収支の要約を含む中央の表。2番目の部分は各カテゴリーの詳細表です。カテゴリーをタップすると取引の詳細が開きます。年間ページのすべてのデータは、実際には以下で説明する残りの表示で異なる区分とキーによって表示されます。' },
    { heading: '月間表示', body: '特定の月だけを扱いたいですか？コントロールパネルで月間表示をクリックしてください。年間ページから特定の月の派生を含むページが開きます。ここで任意の月を選択すると、すぐにそのデータが画面に表示されます。' },
    { heading: 'メッセージパネル', body: '画面下部には、常時3つのシステムメッセージパネルがあります：進行中のメッセージ、情報、および起こりうるエラー。' },
    { heading: 'コントロールパネル', body: '右を見ると、サイトのコントロールパネルにたどり着きます。コントロールパネルは常に右側に表示されます。\n\nコントロールパネルの各項目は、ローカルに何かを表示するか、別のページに移動するための機能を持っています。これらの項目はすべて、この文書のさらに後で詳しく説明されます。', image: { src: '/guides/mfinance-control-panel-ja.jpg', width: 134, height: 815 } },
    { heading: 'コントロールパネルの側面', body: '右利きでも左利きでも、コントロールパネルの右または左のボタンをクリックすると、コントロールパネルが左右に移動します。' },
    { heading: 'AIインジケーター', body: 'コントロールパネルの下部にAIインジケーターランプが点灯しています - 緑は利用可能、赤は利用不可を意味します。一般的に、AIが利用できない場合でも、システムは通常ほとんどの操作に対応できます。' },
    { heading: '作業終了', body: '作業を終えてアプリケーションを閉じたいですか？終了をクリックしてください。' },
    { heading: '手動読み込みプロセス', body: '手動読み込みプロセスは、コントロールパネルの読み込みボタンを通じて実行されます。読み込みの前に、特定の1つのファイルを読み込む - ファイルをクリック；フォルダ内のすべてのファイルを読み込む - フォルダをクリック；フォルダ内のすべてのファイルを自動的に読み込む - 自動をクリックすると、ファイルごとに確認要求を受け取ります。読み込み方法を選択したら、読み込みボタンをクリックしてください。ファイルマネージャーが開きます - ファイルまたはフォルダを選択して確認してください。' },
    { heading: '金融機関への直接接続', body: '金融機関から直接データを読み込む特別な機能があります。「金融機関」ボタンをクリックすると、プロジェクトの銀行サービスに移動します。このサービスでは、世界中の金融機関の一つに接続できます - 整備され、利用可能なものに限ります。このプロセスでは、データをコンピューターにダウンロードして手動読み込み用のファイルを作成するか、データを直接プロジェクトにダウンロードできます。' },
    { heading: '口座番号表示', body: '読み込みボタンの横に「口座番号」というラベルとチェックボックスがあります。この情報は読み込みプロセスの後、データ自体から取得されます。システムが集中する1つ以上の口座を選択してください（最大4つの異なる口座）。' },
    { heading: 'データベース画面', body: '口座ページからデータを読み込み、読み込まれたままの生データを見たいですか？コントロールパネルのデータベースボタンをクリックして、希望の表示までスクロールしてください。' },
    { heading: 'カテゴリーページ', body: 'カテゴリーページを開いて、すべての表を見ることができます。\n\n特定の取引が正しいカテゴリーにない場合は、編集をクリックし、正しいカテゴリーを設定し、更新をクリックしてください。システムは今後の読み込みのためにもその選択を記憶します。' },
    { heading: 'グラフィカル表示と予算パイ', body: 'コントロールパネルには表示（口座ページ）のリストがあります。グラフィカル表示を選択してください。年間グラフィカル表示画面が開きます。ここでは、時間の経過とともにグラフィカル表示で確認したい任意の項目を選択できます。\n\nグラフィカルページから、より深い理解を得たい、そして素晴らしい技術体験もしたいですか？予算パイをクリックしてください。この表示では、希望の月を選択し、収入の上に配置された支出のレイアウトを見ることができます。パイページでは、セレクター付きの右側の表でパイの切片を制御できます - その値を下げたり上げたりします。切片を調整することで、希望のバランスを得るための望ましい値に到達できます。' },
    { heading: 'クレジットカード', body: 'コントロールパネルに移動し、クレジットカードをクリックすると、すべてのカードを見ることができます。カードを選択すると、詳細な内訳が得られます。' },
    { heading: '将来計画', body: '再びコントロールパネルに戻り、将来計画をクリックしてください。アクションを計画するにはクリックすると編集カードが開きます。金融機関、口座番号、取引カテゴリーを選択し、取引の説明、メモ、請求または入金する金額、および何ヶ月分かを記入してください。完了したら更新をクリックしてください。\n\n計画表に項目を入力した後、それを複製したり変更したりできます。行を選択して同じカード内で編集することでこれを行います。指示に従ってください。\n\n将来計画表は、クレジットカードと同様に、関連する月を追跡しながら年間口座ページに正確に統合されます。毎月その月に更新されます。さまざまな口座ページでは、将来計画を含めるか含めないか、クレジットカード取引の完全な詳細またはその要約のみで、データを表示・分析するオプションがあることに注意してください。' },
    { heading: '画面の切り替え', body: 'コントロールパネルには、ソフトウェアの主要画面間を移動する7つのボタンがあります：\n\n年間、月間、カテゴリー、将来、データベース、クレジット、グラフィカル\n\nそれぞれが異なる画面を開き、ガイドの続きでそれぞれについて説明します。' },
    { heading: 'ファイルの読み込み', body: 'ここは、銀行やクレジットカード会社からダウンロードしたファイル（通常はExcelまたはCSVファイル）をソフトウェアに取り込む場所です。「読み込み」ボタンをクリックし、読み込み方法を選択してください：\n\n•    ファイル - 単一ファイルの読み込み\n•    フォルダ - 特定のフォルダ内のすべてのファイルを一度に読み込み\n•    自動 - ソフトウェアが自動的に読み込み、各ファイルを個別に選択する必要はありません\n\n同じファイルを誤って2回読み込むことを心配する必要はありません - ソフトウェアはすでに存在する取引を認識し、再度追加しません。つまり、以前に読み込んだファイルを安心して再度読み込むことができ、数字が「膨らむ」心配はありません。' },
    { heading: '口座', body: '読み込みボタンの横に「口座番号」というラベルとチェックボックスがあります - ここで、どの銀行口座に集中するかを確認して選択できます（最大4つの異なる口座）。' },
    { heading: 'リセットとやり直し', body: 'ある時点でやり直したい場合、2つの別々のボタンがあります：\n\n•    データベースをリセット - 読み込まれたすべての取引を削除します\n•    カテゴリーをリセット - 取引に設定されたカテゴリーを削除します\n\n最後に、ソフトウェアを終了するための「終了」ボタン。' },
    { heading: '年間画面', body: 'これはソフトウェアのメイン画面で、「年間口座ページ」と呼ばれます。\n\nここでは1つの大きな表を見ます：行には、すべての支出および収入のカテゴリー、列には、3年分丸ごと、月ごとに表示されます。表の上段には全体の要約が表示されます - いくら入ってきたか、いくら出て行ったか、前期から繰り越された残高はいくらか、そして合計はいくらか。\n\n特定の金額の背後にどの取引があるか正確に見たい場合は、興味のあるカテゴリーの行をクリックするだけで、画面がその完全な詳細も開きます。\n\n画面の上部にはいくつかのボタンがあります：\n\n•    更新 - 表のデータを更新します\n•    エクスポート - 表をExcelまたはPDFファイルとして保存し、保存または印刷できます\n•    リフレッシュ\n•    クリア\n\nそして、他の画面でも見る2つの重要なスイッチ：\n\n•    将来を含む - 計画された将来の支出と収入（例えば定期支払い）を計算に含めるかどうかを決定します\n•    クレジットカードを含む - クレジットカード取引を計算に含めるかどうかを決定します' },
    { heading: '月間画面', body: 'この画面は「月間口座ページ」と呼ばれ、興味のある特定の月にズームインできます。\n\n上部で年と月を選択し、「更新」ボタンをクリックしてその期間のデータを表示します。\n\nこの画面の特徴は、8つの異なる表を1か所にまとめて表示し、選択した月の全体像を一度に見られることです：\n\n•    支出リスト\n•    カテゴリー別取引の要約\n•    将来の収入\n•    将来の支出\n•    残高計算\n•    月次残高\n•    クレジットカード\n•    銀行口座\n\nここでも、「将来を含む」と「クレジットカードを含む」の2つのスイッチが利用可能で、画像に含めるか除外するかを選択できます。' },
    { heading: 'カテゴリー画面', body: 'この画面は「カテゴリー別ソート口座ページ」と呼ばれ、ここではすべての取引がカテゴリー別に整理されて表示されます - 「食品」に属するもの、「車」に属するものなど。\n\nここは、ソフトウェアが誤って設定したカテゴリーを修正できる場所でもあります。ソフトウェア自体が何をすべきか正確に案内します：「カテゴリーを変更するには、クリック：編集、新しいカテゴリーを選択、更新」\n\nつまり - 編集をクリックし、リストから正しいカテゴリーを選択し、更新をクリックします。重要な点：取引のカテゴリーを変更すると、ソフトウェアはそれを記憶するため、次回同様の取引（同じ説明の）を読み込むと、すでに正しく自動的に分類されます。\n\nここでも、「将来を含む」と「クレジットカードを含む」の2つのスイッチが利用可能です。' },
    { heading: 'データベース画面', body: 'この画面は「データベース」と呼ばれ、ソフトウェアに読み込まれたすべての取引の生の完全なリストです - その日付、取引元の銀行またはクレジットカード会社、説明、金額、割り当てられたカテゴリーなど。\n\nフィルタリングやグループ化なしで「データをそのまま」見たい場合は、ここに来てください。更新ボタンでリストが更新されます。' },
    { heading: 'クレジットカード画面', body: 'この画面は「クレジットカード」と呼ばれ、それ自体が表示するように：「クレジットカードのリストです。詳細な内訳を見るために選択してください」\n\n上部には、3年間にわたる月ごとのすべてのクレジットカードの要約表が表示されます - 年間画面と全く同じですが、クレジットカードに焦点を当てています。特定のカードを選択すると、それに請求した加盟店ごとの内訳を含む追加の表が下に表示されます。\n\nリフレッシュとエクスポートのボタンもここで利用できます。' },
    { heading: '将来計画画面', body: 'この画面は「将来口座ページ」と呼ばれ、ここでは定期支払い、分割払い、月額サブスクリプションなど、あらかじめ分かっている支出と収入を管理します。\n\nソフトウェアは案内します：「アクションカード - 行を選択するか新規に開始してください」。\n\n追加する各項目には独自のカードがあり、以下のフィールドがあります：\n\n•    出所\n•    カテゴリー\n•    メモ\n•    説明\n•    銀行\n•    口座\n•    収入または支出\n•    開始日\n•    支払い回数\n\n開始日と支払い回数を設定すると、ソフトウェアがそれらの月にわたって金額を自動的に配分し、他のすべての画面に自動的に統合します（「将来を含む」スイッチがオンの場合）。\n\n利用可能なアクション：更新、新規、編集、リセット、削除。' },
    { heading: 'グラフ画面', body: 'この画面は「グラフィカル表示口座ページ」と呼ばれ、同じデータを表ではなく画像として提供します。\n\n残高、繰越残高、支出のほか、カテゴリー、単一項目、将来計画、クレジットカードによる焦点表示など、いくつかの表示モードから選択できます。' },
    { heading: '予算パイ', body: 'グラフ画面の中に「予算パイ」という特別なツールがあり、その目的は「家計予算バランス計画」です - これは予算をライブで調整するツールです：表示する期間（年と月）を選択し、カテゴリー間の配分をドラッグして変更し、それが全体の予算バランスにどう影響するかをすぐに確認できます。\n\n利用可能なボタン：更新、リセット、リフレッシュ。' },
    { heading: 'メッセージボード', body: '画面下部には、ソフトウェアでの作業中ずっと、3つのセクションを持つメッセージボードがあります：\n\n•    システム - 現在バックグラウンドで起こっていること\n•    ガイダンス - ヒントと方向性\n•    エラー - 何かが失敗した場合、ここで知ることができます\n\nクリアボタンでメッセージを消去したり、エクスポートボタンで保存したりできます。' },
    { heading: '家計管理 M Finance', body: '家計管理アプリケーションはプロジェクトの目玉です。完全で詳細な説明は、「ガイドと動画」の文書引き出し4、5、6でお読みいただけます。\n\nアプリケーションを通じて、銀行取引、収入と支出、月次および年次残高の全体像を把握できます。スマートな支払いスケジュールで、将来の支出や収入を追加・計画することもできます。\n\nコントロールパネルの家計管理スイッチをクリックすると、アプリケーションのゲートが開きます - KeyClickサイトのゲートに似たページで、選択した言語での歓迎の挨拶があります。\n\nアプリケーションは、あらかじめ金融機関のアカウントからダウンロードした銀行口座およびクレジットカードのファイルを読み込み、これらの明細書の銀行取引について徹底的な分析を行います。\n\nアプリケーションの機能は、個々のグラフィカル表示を含む、さまざまな区分と時期でのさまざまな表示に及びます。\n\nそして、これが最高の仕上げです - ライブ予算パイ。支出は収入パイの中の切片として表示されます。スマートな仕組みにより、バランスが取れるまで切片の値を変更できます。' },
    { heading: '銀行サービス', body: '家計管理の利用を開始し、プロセスを短縮したいですか？さらに2つのオプションがあります：\n\n•    口座明細ファイルをコンピューターに自動ダウンロード、\n•    口座明細ファイルを家計管理アプリケーションに直接自動ダウンロード。\n\n金融機関への接続はお客様ご自身のみが行い、その機関で採用されているセキュリティ設定に従って、いつもどおりの通常のログインを行います。ファイルのダウンロード直後にロックされ、切断されます。\n\nこのサービスには、高度な技術環境での実体験が含まれます。' },
  ],
  ar: [
    { heading: 'KeyClick', body: 'تطبيق إدارة ميزانية المنزل هو جزء من مشروع علامة KeyClick التجارية' },
    { heading: 'الصفحة الرئيسية لإدارة ميزانية المنزل', body: 'نقرت على الزر من موقع KeyClick وتفتح شاشة البوابة - لفافة مصممة مع تحية ترحيب وعلم اللغة.\n\nاللغة غير مناسبة؟ اختر واحدًا من 11 علمًا في أعلى الموقع وسيتم نقلك فورًا إلى اللغة المختارة. نظام تعدد اللغات هو أحد الوحدات الأساسية للموقع ومنتجاته. يمكنك التبديل بين اللغات فورًا في أي وقت.\n\nالنقر في أي مكان على الشاشة يغلق شاشة البوابة ويفتح محتوى المشروع.' },
    { heading: 'اختيار اللغة', body: 'أعلى الشاشة ستجد صفًا من الأعلام - علم لكل من اللغات الـ 11 التي يدعمها البرنامج. النقر على أي علم يبدل فورًا كل البرنامج إلى تلك اللغة - جميع العناوين، جميع التسميات، جميع رسائل النظام. يمكنك التبديل بين اللغات في أي لحظة، والعودة، دون فقدان أي بيانات.' },
    { heading: 'بدء العمل', body: 'نقرت على شاشة الدخول ودخلت إلى التطبيق. ماذا ترى؟ ماذا يجب أن تفعل؟\n\nلإدارة الميزانية، يجب أولاً تحميل البيانات. ما هي طرق التحميل. هناك عدة مسارات للتحميل. أثناء عملية التحميل ستتلقى إرشادات ورسائل.\n\nانتهاء التحميل. ماذا ترى؟ صفحة حساب سنوية، عرض سنوي. جدول الرصيد، الرصيد المتبقي، جدول المعاملات المحملة، مصنفة حسب الموضوع.' },
    { heading: 'العرض السنوي', body: 'الشاشة الرئيسية، التي تفتح أولاً بعد صفحة البوابة. في هذا العرض نرى المعلومات المخزنة في قاعدة البيانات، المحملة من كشوفات حساب مؤسسة مالية. تنقسم الشاشة إلى منطقتين رئيسيتين. جدول مركزي يتضمن ملخصًا للدخل والمصروفات والأرصدة والموازين. الجزء الثاني هو جداول تفصيلية لكل فئة. النقر على الفئة يفتح تفاصيل المعاملات. جميع البيانات في الصفحة السنوية تُعرض فعليًا بمقاطع ومفاتيح مختلفة في بقية العروض الموصوفة أدناه.' },
    { heading: 'العرض الشهري', body: 'تريد التعامل مع شهر معين فقط؟ انقر على العرض الشهري في لوحة التحكم. تفتح صفحة تحتوي على مشتق من شهر معين من الصفحة السنوية. هنا يمكنك اختيار أي شهر والحصول فورًا على بياناته على الشاشة.' },
    { heading: 'لوحات الرسائل', body: 'أسفل الشاشة، توجد بشكل دائم ثلاث لوحات لرسائل النظام: رسائل جارية، معلومات، وأخطاء محتملة.' },
    { heading: 'لوحة التحكم', body: 'النظر إلى اليمين يقودنا إلى لوحة تحكم الموقع. لوحة التحكم مرئية دائمًا على الجانب الأيمن.\n\nكل عنصر في لوحة التحكم مخصص لعرض شيء محليًا أو الانتقال إلى صفحة أخرى. جميع هذه العناصر مفصلة لاحقًا في هذا المستند.', image: { src: '/guides/mfinance-control-panel-ar.jpg', width: 131, height: 809 } },
    { heading: 'جانب لوحة التحكم', body: 'سواء كنت أيمن أو أعسر، يمكنك النقر على الزر الأيمن أو الأيسر في لوحة التحكم، وستنتقل لوحة التحكم من جانب إلى آخر.' },
    { heading: 'مؤشر الذكاء الاصطناعي', body: 'أسفل لوحة التحكم يضيء مؤشر الذكاء الاصطناعي - الأخضر يعني متاح، الأحمر يعني غير متاح. بشكل عام، حتى عندما لا يكون الذكاء الاصطناعي متاحًا، يعرف النظام عادةً كيفية التعامل مع معظم العمليات.' },
    { heading: 'إنهاء العمل', body: 'انتهيت من العمل وتريد إغلاق التطبيق؟ انقر على خروج.' },
    { heading: 'عملية التحميل اليدوي', body: 'تتم عملية التحميل اليدوي من خلال أزرار التحميل في لوحة التحكم. قبل التحميل يمكنك اختيار تحميل ملف واحد معين - انقر على ملف؛ تحميل جميع الملفات في مجلد - انقر على مجلد؛ التحميل التلقائي لجميع الملفات في مجلد - انقر على تلقائي، حيث ستحصل على طلب تأكيد لكل ملف. بعد اختيار طريقة التحميل، انقر على زر تحميل. سيفتح مدير ملفات - اختر ملفًا أو مجلدًا، وأكّد.' },
    { heading: 'اتصال مباشر بمؤسسة مالية', body: 'توجد وظيفة خاصة لتحميل البيانات مباشرة من مؤسسة مالية. النقر على زر "مؤسسة مالية" ينقلك إلى الخدمات المصرفية للمشروع. في هذه الخدمة يمكنك الاتصال بإحدى المؤسسات المالية حول العالم - تلك التي تم ترتيبها وهي متاحة لنا. في هذه العملية يمكنك تنزيل البيانات إلى جهاز الكمبيوتر الخاص بك، وإنشاء ملفات للتحميل اليدوي، أو تنزيل البيانات مباشرة إلى المشروع.' },
    { heading: 'عرض أرقام الحسابات', body: 'بجانب أزرار التحميل لديك تسمية "رقم الحساب" مع مربعات اختيار. يتم استخراج هذه المعلومات بعد عملية التحميل من البيانات نفسها. اختر حسابًا واحدًا أو أكثر ليركز عليها النظام (حتى 4 حسابات مختلفة).' },
    { heading: 'شاشة قاعدة البيانات', body: 'قمت بتحميل بيانات من صفحات الحساب وتريد رؤية التحميل الخام كما تم تحميله. انقر على زر قاعدة البيانات في لوحة التحكم ومرر إلى العرض المطلوب.' },
    { heading: 'صفحة الفئات', body: 'يمكنك فتح صفحة الفئات ورؤية جميع الجداول.\n\nإذا لم تكن معاملة معينة في الفئة الصحيحة، انقر على تعديل، حدد الفئة الصحيحة، انقر على تحديث. سيتذكر النظام الاختيار للتحميلات المستقبلية أيضًا.' },
    { heading: 'العرض الرسومي ومخطط الميزانية الدائري', body: 'في لوحة التحكم أمامك قائمة بالعروض (صفحة الحساب). اختر العرض الرسومي. تفتح أمامك شاشة عرض رسومي سنوي. هنا يمكنك اختيار أي شيء يخطر ببالك، أي بند تريد فحصه عبر الزمن في عرض رسومي.\n\nأنت في الصفحة الرسومية، تريد الحصول على فهم أعمق وأيضًا خوض تجربة تقنية مذهلة؟ انقر على مخطط الميزانية الدائري. في هذا العرض يمكنك اختيار الشهر المطلوب ورؤية توزيع المصروفات فوق الدخل. في صفحة المخطط الدائري، يتيح لك الجدول الموجود على اليمين مع المحددات التحكم في شرائح المخطط - خفض أو رفع قيمتها. من خلال ضبط الشرائح يمكنك الوصول إلى القيم المرغوبة للحصول على التوازن الذي تريده.' },
    { heading: 'بطاقات الائتمان', body: 'اذهب إلى لوحة التحكم، انقر على بطاقات الائتمان وستتمكن من رؤية جميع البطاقات. اختر بطاقة واحصل على تفصيل دقيق.' },
    { heading: 'التخطيط المستقبلي', body: 'عد مرة أخرى إلى لوحة التحكم، انقر على التخطيط المستقبلي. للتخطيط لعملية، انقر وستفتح بطاقة تحرير. اختر المؤسسة المالية، رقم الحساب، فئة المعاملة، اكتب وصف المعاملة، ملاحظة، مبلغًا للخصم أو الإيداع، وعدد الأشهر المعنية. عند الانتهاء انقر على تحديث.\n\nبعد إدخال العنصر في جدول التخطيط، يمكنك تكراره أو تغييره. قم بذلك عن طريق تحديد الصف والتحرير في نفس البطاقة. اتبع التعليمات.\n\nيتم دمج جدول التخطيط المستقبلي، مثل بطاقات الائتمان، بدقة في صفحة الحساب السنوية، متتبعًا الأشهر ذات الصلة. يتم التحديث كل شهر في شهره. لاحظ أنه في صفحات الحساب المختلفة، توجد خيار لعرض وتحليل البيانات مع أو بدون التخطيط المستقبلي، مع تفصيل كامل لمعاملات بطاقة الائتمان أو ملخصها فقط.' },
    { heading: 'التنقل بين الشاشات', body: 'في لوحة التحكم ستجد سبعة أزرار تنقلك بين الشاشات الرئيسية للبرنامج:\n\nسنوي، شهري، فئات، مستقبل، قاعدة بيانات، ائتمان، رسومي\n\nكل واحد منها يفتح شاشة مختلفة، وسأشرح كل واحد منها لاحقًا في الدليل.' },
    { heading: 'تحميل الملفات', body: 'هذا هو المكان الذي تُدخل فيه إلى البرنامج الملفات التي نزّلتها من البنك أو من شركة بطاقة الائتمان (عادة ملفات Excel أو CSV). انقر على زر "تحميل"، واختر كيف تريد التحميل:\n\n•    ملف - تحميل ملف واحد\n•    مجلد - تحميل جميع الملفات الموجودة في مجلد معين دفعة واحدة\n•    تلقائي - يقوم البرنامج بالتحميل بنفسه، دون الحاجة لاختيار كل ملف على حدة\n\nلا داعي للقلق بشأن تحميل نفس الملف مرتين عن طريق الخطأ - يتعرف البرنامج على المعاملات الموجودة لديه بالفعل ولن يضيفها مرة أخرى. هذا يعني أنه يمكنك بأمان إعادة تحميل ملف قمت بتحميله من قبل، دون خوف من أن "تتضخم" الأرقام.' },
    { heading: 'الحسابات', body: 'بجانب أزرار التحميل لديك تسمية "رقم الحساب" مع مربعات اختيار - هنا يمكنك رؤية واختيار الحسابات المصرفية التي تريد التركيز عليها (حتى 4 حسابات مختلفة).' },
    { heading: 'إعادة الضبط والبدء من جديد', body: 'إذا أردت في مرحلة ما البدء من جديد، يوجد زران منفصلان:\n\n•    إعادة ضبط قاعدة البيانات - يحذف جميع المعاملات المحملة\n•    إعادة ضبط الفئات - يحذف الفئات المحددة للمعاملات\n\nوأخيرًا، زر "خروج" للخروج من البرنامج.' },
    { heading: 'الشاشة السنوية', body: 'هذه هي الشاشة الرئيسية للبرنامج، وتسمى "صفحة الحساب السنوية".\n\nهنا ترى جدولًا كبيرًا واحدًا: في الصفوف - جميع فئات المصروفات والدخل الخاصة بك، وفي الأعمدة - ثلاث سنوات كاملة، شهرًا بشهر. في الصف العلوي من الجدول يظهر ملخص عام - كم دخل، كم خرج، ما الرصيد المرحّل من الفترة السابقة، وما الإجمالي.\n\nإذا أردت أن ترى بالضبط أي معاملات تقف وراء مبلغ معين - انقر ببساطة على صف الفئة التي تهمك، وستفتح لك الشاشة أيضًا تفاصيلها الكاملة.\n\nفي أعلى الشاشة لديك بعض الأزرار:\n\n•    تحديث - يحدّث البيانات في الجدول\n•    تصدير - يحفظ الجدول كملف Excel أو PDF، حتى تتمكن من حفظه أو طباعته\n•    تحديث\n•    مسح\n\nومفتاحان مهمان ستراهما أيضًا في شاشات أخرى:\n\n•    تضمين المستقبل - يحدد ما إذا كانت المصروفات والإيرادات المستقبلية المخططة (مثل الأوامر الدائمة) مشمولة في الحساب\n•    تضمين بطاقات الائتمان - يحدد ما إذا كانت معاملات بطاقة الائتمان مشمولة في الحساب' },
    { heading: 'الشاشة الشهرية', body: 'تسمى هذه الشاشة "صفحة الحساب الشهرية"، وتمنحك تكبيرًا لشهر معين يهمك.\n\nفي الأعلى يمكنك اختيار سنة وشهر، والنقر على زر "تحديث" لرؤية بيانات تلك الفترة.\n\nما يميز هذه الشاشة هو أنها تجمع لك في مكان واحد ثمانية جداول مختلفة، بحيث ترى الصورة الكاملة للشهر المختار دفعة واحدة:\n\n•    قائمة المصروفات\n•    ملخص المعاملات حسب الفئة\n•    الإيرادات المستقبلية\n•    المصروفات المستقبلية\n•    حساب الرصيد\n•    الرصيد الشهري\n•    بطاقات الائتمان\n•    الحسابات المصرفية\n\nوهنا أيضًا، المفتاحان "تضمين المستقبل" و"تضمين بطاقات الائتمان" متاحان لك، إذا أردت تضمينهما أو حذفهما من الصورة.' },
    { heading: 'شاشة الفئات', body: 'تسمى هذه الشاشة "صفحة الحساب المرتبة حسب الفئات"، وهنا ترى جميع معاملاتك منظمة حسب الفئة - كل ما ينتمي إلى "الطعام"، كل ما ينتمي إلى "السيارة"، وهكذا.\n\nهذا أيضًا هو المكان الذي يمكنك فيه تصحيح فئة حددها البرنامج بشكل غير صحيح. يوجهك البرنامج نفسه بالضبط حول ما يجب فعله: "لتغيير الفئة، انقر: تعديل، اختيار فئة جديدة، تحديث"\n\nأي - انقر على تعديل، اختر الفئة الصحيحة من القائمة، وانقر على تحديث. مهم أن تعرف: عندما تغيّر فئة معاملة، يتذكر البرنامج ذلك، بحيث في المرة القادمة التي تحمّل فيها معاملة مشابهة (بنفس الوصف)، سيصنفها بشكل صحيح من تلقاء نفسه.\n\nوهنا أيضًا، المفتاحان "تضمين المستقبل" و"تضمين بطاقات الائتمان" متاحان لك.' },
    { heading: 'شاشة قاعدة البيانات', body: 'تسمى هذه الشاشة "قاعدة البيانات"، وهي القائمة الخام والكاملة لكل معاملة تم تحميلها إلى البرنامج - تاريخها، البنك أو شركة بطاقة الائتمان التي جاءت منها، الوصف، المبلغ، الفئة المخصصة لها، والمزيد.\n\nهذا هو المكان الذي يمكنك التوجه إليه إذا أردت رؤية "جميع البيانات كما هي"، دون أي تصفية أو تجميع. زر تحديث يحدّث القائمة.' },
    { heading: 'شاشة بطاقات الائتمان', body: 'تسمى هذه الشاشة "بطاقات الائتمان"، وكما تعرضها لك بنفسها: "أمامك قائمة بطاقات الائتمان الخاصة بك، اختر واحدة لتفصيل العمليات"\n\nفي الجزء العلوي سترى جدولًا ملخصًا لجميع بطاقات الائتمان الخاصة بك، شهرًا بشهر، على مدى ثلاث سنوات - تمامًا مثل الشاشة السنوية، لكن مع التركيز على بطاقات الائتمان. عندما تختار بطاقة معينة، يظهر أدناه جدول إضافي بتفصيل حسب المتاجر التي خصمت منها.\n\nأزرار تحديث وتصدير متاحة هنا أيضًا.' },
    { heading: 'شاشة التخطيط المستقبلي', body: 'تسمى هذه الشاشة "صفحة الحساب المستقبلية"، وهنا تدير المصروفات والإيرادات التي تعرفها مسبقًا - أوامر دائمة، دفعات، اشتراكات شهرية، والمزيد.\n\nيوجهك البرنامج: "بطاقة عملية - اختر صفًا أو ابدأ واحدة جديدة".\n\nلكل عنصر تضيفه بطاقته الخاصة، مع الحقول التالية:\n\n•    المصدر\n•    الفئة\n•    ملاحظة\n•    الوصف\n•    البنك\n•    الحساب\n•    دخل أو مصروف\n•    تاريخ البدء\n•    عدد الدفعات\n\nبمجرد تحديد تاريخ البدء وعدد الدفعات، يتولى البرنامج توزيع المبلغ إلى الأمام على مدى كل تلك الأشهر، ويدمجه تلقائيًا في جميع الشاشات الأخرى (عند تفعيل مفتاح "تضمين المستقبل").\n\nالإجراءات المتاحة لك: تحديث، جديد، تعديل، إعادة ضبط، حذف.' },
    { heading: 'شاشة الرسوم البيانية', body: 'تسمى هذه الشاشة "صفحة الحساب بعرض رسومي"، وتمنحك نفس البيانات - لكن كصورة، وليس كجدول.\n\nيمكنك الاختيار بين عدة أوضاع عرض: الرصيد، الرصيد المتبقي، المصروفات، وكذلك عرض مركّز حسب الفئة، عنصر واحد، التخطيط المستقبلي، أو بطاقات الائتمان.' },
    { heading: 'مخطط الميزانية الدائري', body: 'داخل شاشة الرسوم البيانية ستجد أداة خاصة تسمى "مخطط الميزانية الدائري"، والغرض منها هو "تخطيط توازن ميزانية المنزل" - هذه أداة لتنظيم ميزانيتك بشكل حي: تختار فترة للعرض (سنة وشهر)، ويمكنك سحب وتغيير التوزيع بين الفئات ورؤية على الفور كيف يؤثر ذلك على التوازن العام للميزانية.\n\nالأزرار المتاحة: تحديث، إعادة ضبط، تحديث.' },
    { heading: 'لوحة الرسائل', body: 'أسفل الشاشة، طوال عملك في البرنامج، لديك لوحة رسائل بثلاثة أقسام:\n\n•    النظام - ما يحدث حاليًا في الخلفية\n•    إرشاد - نصائح وتوجيه\n•    خطأ - إذا فشل شيء ما، ستعرف ذلك هنا\n\nيمكنك مسح الرسائل بزر مسح، أو حفظها بزر تصدير.' },
    { heading: 'إدارة ميزانية المنزل M Finance', body: 'تطبيق إدارة ميزانية المنزل هو تاج المشروع. يمكنك قراءة شرح كامل ومفصل في أدراج المستندات 4 و5 و6 في الأدلة والفيديوهات.\n\nمن خلال التطبيق ستحصل على نظرة شاملة على نشاطك المصرفي، الدخل والمصروفات، الرصيد الشهري والسنوي. يمكنك أيضًا إضافة وتخطيط مصروفات أو إيرادات مستقبلية، بجدول دفعات ذكي.\n\nنقرت على مفتاح إدارة ميزانية المنزل في لوحة التحكم، ستفتح بوابة التطبيق - صفحة مشابهة لبوابة موقع KeyClick - مع تحية ترحيب باللغة التي اخترتها.\n\nيقرأ التطبيق ملفات حسابات البنك وبطاقات الائتمان التي نزّلتها مسبقًا من حسابك لدى مؤسسة مالية، ويجري تحليلاً معمقًا للعمليات المصرفية في هذه الكشوفات.\n\nتمتد قدرات التطبيق إلى مجموعة متنوعة من العروض، بمقاطع مختلفة وفي أوقات مختلفة، بما في ذلك عروض رسومية فردية.\n\nوهنا لمسة التميز - مخطط ميزانية دائري حي. تُعرض المصروفات كشرائح داخل مخطط الدخل الدائري. آلية ذكية تتيح لك تغيير قيم الشرائح حتى تحقيق التوازن.' },
    { heading: 'الخدمات المصرفية', body: 'بدأت باستخدام إدارة ميزانية المنزل وتريد اختصار العمليات؟ أمامك خياران إضافيان:\n\n•    تنزيل تلقائي لملفات كشوفات الحساب إلى جهاز الكمبيوتر الخاص بك،\n•    تنزيل تلقائي لملفات كشوفات الحساب مباشرة إلى تطبيق إدارة ميزانية المنزل.\n\nسيتم الاتصال بمؤسستك المالية من قبلك وحدك، تسجيل دخول عادي كما تفعل دائمًا، وفقًا لإعدادات الأمان المعتمدة في تلك المؤسسة. فور تنزيل الملفات، يتم القفل وقطع الاتصال.\n\nتشمل الخدمة تجربة عملية في بيئة تكنولوجية متقدمة.' },
  ],
  zh: [
    { heading: 'KeyClick', body: '家庭预算管理应用程序是 KeyClick 品牌项目的一部分' },
    { heading: '家庭预算管理主页', body: '您点击了 KeyClick 网站上的按钮，随即打开了门户屏幕 - 一个带有欢迎语和语言旗帜的风格化卷轴。\n\n语言不合适？在网站顶部的11面旗帜中选择1个，您将立即被转到所选语言。多语言系统是网站及其产品的基础单元之一。您可以随时立即切换语言。\n\n点击屏幕上的任意位置将关闭门户屏幕并打开项目内容。' },
    { heading: '语言选择', body: '在屏幕顶部您会找到一排旗帜——软件支持的11种语言各对应一面。点击任意旗帜会立即将整个软件切换到该语言——所有标题、所有标签、所有系统消息。您可以随时切换语言，并切换回来，不会丢失任何数据。' },
    { heading: '开始使用', body: '您点击了登录屏幕并进入了应用程序。您看到了什么？您应该做什么？\n\n要管理预算，首先需要加载数据。加载的方式有哪些。有几条加载路径。在加载过程中您会收到指导和消息。\n\n加载结束。您看到了什么？年度账户页面，年度布局。余额表、结转余额、按类别分类的已加载交易表。' },
    { heading: '年度视图', body: '门户页面之后首先打开的主屏幕。在此视图中，我们看到存储在数据库中的信息，该信息是从金融机构的账户对账单加载而来的。屏幕分为两个主要区域。一个中央表格，包含收入、支出、余额和结余的摘要。第二部分是每个类别的明细表。点击类别会打开交易明细。年度页面上的所有数据实际上以不同的细分和维度显示在下面描述的其余视图中。' },
    { heading: '月度视图', body: '只想处理特定的某个月？在控制面板中点击月度视图。将打开一个页面，其中包含年度页面中特定月份的衍生数据。在这里您可以选择任意月份，并立即在屏幕上获得该月的数据。' },
    { heading: '消息面板', body: '屏幕底部始终存在三个系统消息面板：进行中的消息、信息，以及可能的错误。' },
    { heading: '控制面板', body: '向右看，我们会看到网站的控制面板。控制面板始终显示在右侧。\n\n控制面板上的每个项目都用于本地显示某些内容或转到另一个页面。所有这些项目将在本文档后面详细说明。', image: { src: '/guides/mfinance-control-panel-zh.jpg', width: 135, height: 815 } },
    { heading: '控制面板的位置', body: '无论您是右撇子还是左撇子，您都可以点击控制面板上的右侧或左侧按钮，控制面板就会从一侧移动到另一侧。' },
    { heading: 'AI 指示灯', body: '控制面板底部亮起一个 AI 指示灯——绿色表示可用，红色表示不可用。总体而言，即使 AI 不可用，系统通常也能处理大多数操作。' },
    { heading: '结束工作', body: '完成工作想关闭应用程序？点击"退出"。' },
    { heading: '手动加载流程', body: '手动加载流程通过控制面板中的加载按钮执行。加载前，您可以选择加载单个特定文件——点击"文件"；加载文件夹中的所有文件——点击"文件夹"；自动加载文件夹中的所有文件——点击"自动"，此时每个文件都会收到确认请求。选择加载方式后，点击"加载"按钮。将打开文件管理器——选择文件或文件夹，然后确认。' },
    { heading: '直接连接金融机构', body: '存在一个特殊功能，可直接从金融机构加载数据。点击"金融机构"按钮会将您带到该项目的银行服务。在此服务中，您可以连接到世界各地的某个金融机构——那些已经安排好并对我们可用的机构。在此过程中，您可以将数据下载到计算机上，创建用于手动加载的文件，或将数据直接下载到项目中。' },
    { heading: '账户号码显示', body: '在加载按钮旁边有一个"账户号"标签，带有复选框。此信息在加载过程之后从数据本身中提取。选择系统要关注的一个或多个账户（最多4个不同账户）。' },
    { heading: '数据库屏幕', body: '您从账户页面加载了数据，想查看加载时的原始数据。点击控制面板中的"数据库"按钮，滚动到所需的显示内容。' },
    { heading: '分类页面', body: '您可以打开分类页面并查看所有表格。\n\n如果某笔交易不在正确的类别中，点击"编辑"，设置正确的类别，点击"更新"。系统也会为未来的加载记住此选择。' },
    { heading: '图形视图与预算饼图', body: '在控制面板中您面前有一个视图列表（账户页面）。选择图形视图。您面前会打开一个年度图形视图屏幕。在这里您可以选择任何您想到的内容，任何您想要随时间以图形方式查看的项目。\n\n您在图形页面上，想要获得更深入的了解，同时体验令人惊叹的技术体验？点击预算饼图。在此视图中，您可以选择所需的月份，查看支出叠加在收入之上的分布。在饼图页面上，右侧带有选择器的表格让您可以控制饼图的切片——降低或提高其值。通过调节切片，您可以达到理想的数值，获得您想要的平衡。' },
    { heading: '信用卡', body: '前往控制面板，点击信用卡，您就可以看到所有的卡片。选择一张卡片即可获得详细分类。' },
    { heading: '未来规划', body: '再次返回控制面板，点击未来规划。要规划一项操作，点击后会打开一个编辑卡片。选择金融机构、账户号码、交易类别，填写交易说明、备注、借记或贷记金额，以及涉及多少个月。完成后点击更新。\n\n将该项目输入规划表后，您可以复制或更改它。通过选择该行并在同一卡片中编辑来完成。请按照说明操作。\n\n未来规划表和信用卡一样，会精确整合到年度账户页面中，跟踪相关月份。每月在其对应的月份更新。请注意，在不同的账户页面中，都有选项可以选择是否显示和分析包含未来规划的数据，以及是显示信用卡交易的完整明细还是仅显示其汇总。' },
    { heading: '屏幕间切换', body: '在控制面板中您会找到七个按钮，可在软件的主要屏幕之间移动：\n\n年度、月度、分类、未来、数据库、信用、图形\n\n每一个都会打开不同的屏幕，我将在指南的后续部分逐一说明。' },
    { heading: '加载文件', body: '这里是您将从银行或信用卡公司下载的文件（通常是 Excel 或 CSV 文件）导入软件的地方。点击"加载"按钮，然后选择加载方式：\n\n•    文件 - 加载单个文件\n•    文件夹 - 一次性加载某个文件夹中的所有文件\n•    自动 - 软件自行加载，无需单独选择每个文件\n\n您无需担心意外重复加载同一个文件——软件会识别已有的交易，不会重复添加。这意味着您可以放心地重新加载之前已加载过的文件，而不必担心数字会"膨胀"。' },
    { heading: '账户', body: '在加载按钮旁边有一个"账户号"标签，带有复选框——在这里您可以看到并选择要关注哪些银行账户（最多4个不同账户）。' },
    { heading: '重置和重新开始', body: '如果在某个阶段您想重新开始，有两个独立的按钮：\n\n•    重置数据库 - 删除所有已加载的交易\n•    重置分类 - 删除为交易设置的分类\n\n最后，还有一个"退出"按钮，用于退出软件。' },
    { heading: '年度屏幕', body: '这是软件的主屏幕，称为"年度账户页面"。\n\n在这里您会看到一个大表格：行是您所有的支出和收入类别，列是完整的三年，逐月排列。表格顶行显示总体摘要——收入多少、支出多少、上一期结转的余额是多少，以及总计是多少。\n\n如果您想确切了解某个金额背后是哪些交易——只需点击您感兴趣的类别所在的行，屏幕也会为您打开其完整明细。\n\n屏幕顶部有几个按钮：\n\n•    更新 - 刷新表格中的数据\n•    导出 - 将表格保存为 Excel 或 PDF 文件，以便保存或打印\n•    刷新\n•    清除\n\n以及您在后续屏幕上也会看到的两个重要开关：\n\n•    包含未来 - 决定是否将未来计划的支出和收入（例如定期扣款）纳入计算\n•    包含信用卡 - 决定是否将信用卡交易纳入计算' },
    { heading: '月度屏幕', body: '此屏幕称为"月度账户页面"，让您可以放大查看您感兴趣的特定月份。\n\n在顶部您可以选择年份和月份，点击"更新"按钮查看该期间的数据。\n\n此屏幕的特别之处在于，它为您将八个不同的表格集中在一处，让您一次性看到所选月份的整体情况：\n\n•    支出清单\n•    按分类汇总的交易\n•    未来收入\n•    未来支出\n•    余额计算\n•    月度结余\n•    信用卡\n•    银行账户\n\n在这里，"包含未来"和"包含信用卡"这两个开关同样可供您使用，如果您想将它们纳入或排除在外的话。' },
    { heading: '分类屏幕', body: '此屏幕称为"按分类排序的账户页面"，在这里您会看到所有交易按类别组织——所有属于"食品"的、所有属于"汽车"的，依此类推。\n\n这也是您可以更正软件错误设置的分类的地方。软件本身会准确指导您该怎么做："要更改分类，点击：编辑，选择新分类，更新"\n\n也就是说——点击编辑，从列表中选择正确的类别，然后点击更新。重要提示：当您更改某笔交易的类别时，软件会记住这一点，因此下次您加载类似的交易（描述相同）时，它会自动正确分类。\n\n在这里，"包含未来"和"包含信用卡"这两个开关同样可供您使用。' },
    { heading: '数据库屏幕', body: '此屏幕称为"数据库"，是加载到软件中的每一笔交易的原始完整列表——其日期、来源的银行或信用卡公司、说明、金额、分配给它的类别等等。\n\n如果您想查看"原样的所有数据"，不进行任何筛选或分组，这就是您应该去的地方。更新按钮会刷新列表。' },
    { heading: '信用卡屏幕', body: '此屏幕称为"信用卡"，正如它自己所显示的那样："这是您的信用卡列表，选择一张以查看详细明细"\n\n顶部您会看到一个汇总表，列出您所有信用卡在三年内逐月的情况——就像年度屏幕一样，只是专注于信用卡。当您选择某张特定卡片时，下方会出现一个额外的表格，按向该卡收费的商户进行明细展示。\n\n刷新和导出按钮在这里也可用。' },
    { heading: '未来规划屏幕', body: '此屏幕称为"未来账户页面"，在这里您管理您已提前知道的支出和收入——定期扣款、分期付款、月度订阅等等。\n\n软件会引导您："操作卡片 - 选择一行或开始新的一行"。\n\n您添加的每个项目都有自己的卡片，包含以下字段：\n\n•    来源\n•    分类\n•    备注\n•    说明\n•    银行\n•    账户\n•    收入或支出\n•    起始日期\n•    付款次数\n\n一旦您设置了起始日期和付款次数，软件就会负责将该金额向前分摊到所有这些月份，并自动将其整合到所有其他屏幕中（当"包含未来"开关打开时）。\n\n您可以使用的操作：更新、新建、编辑、重置、删除。' },
    { heading: '图表屏幕', body: '此屏幕称为"图形视图账户页面"，它为您提供相同的数据——但以图片而非表格的形式呈现。\n\n您可以在几种显示模式之间选择：结余、余额、支出，以及按分类、单个项目、未来规划或信用卡进行的聚焦显示。' },
    { heading: '预算饼图', body: '在图表屏幕内，您会找到一个名为"预算饼图"的特殊工具，其目的是"家庭预算平衡规划"——这是一个实时调节您预算的工具：您选择要显示的期间（年份和月份），可以拖动并更改各类别之间的分配，并立即看到这对整体预算平衡的影响。\n\n可用按钮：更新、重置、刷新。' },
    { heading: '消息板', body: '在屏幕底部，在您使用软件的整个过程中，您都有一个包含三个部分的消息板：\n\n•    系统 - 后台当前正在发生的事情\n•    指导 - 提示和方向\n•    错误 - 如果出现问题，您会在这里知道\n\n您可以用清除按钮清除消息，或用导出按钮将其保存下来。' },
    { heading: '家庭预算管理 M Finance', body: '家庭预算管理应用程序是该项目的皇冠明珠。完整详细的说明可以在"指南与视频"的文档抽屉4、5、6中阅读。\n\n通过该应用程序，您将全面了解您的银行活动、收入和支出、月度和年度结余。您还可以添加和规划未来的支出或收入，采用智能付款计划。\n\n您点击了控制面板上的家庭预算管理开关，应用程序的门户将打开——一个类似于 KeyClick 网站门户的页面——以您选择的语言呈现欢迎语。\n\n应用程序会读取您事先从金融机构账户下载的银行账户和信用卡文件，并对这些对账单中的银行交易进行深入分析。\n\n该应用程序的功能涵盖了各种不同细分和不同时间点的视图，包括单独的图形显示。\n\n这里是锦上添花之作——实时预算饼图。支出以切片的形式显示在收入饼图内。智能机制让您可以更改切片的值，直到达到平衡。' },
    { heading: '银行服务', body: '开始使用家庭预算管理，想要简化流程？您还有另外2个选择：\n\n•    自动将账户对账单文件下载到您的计算机，\n•    自动将账户对账单文件直接下载到家庭预算管理应用程序中。\n\n与您的金融机构的连接将完全由您自己完成，按照该机构采用的安全设置，进行您一贯的常规登录。下载文件后会立即锁定并断开连接。\n\n该服务包括在先进技术环境中的亲身体验。' },
  ],
  it: [
    { heading: 'KeyClick', body: "L'applicazione di gestione del bilancio familiare fa parte del progetto del marchio KeyClick" },
    { heading: 'Home page della gestione del bilancio familiare', body: "Hai cliccato sul pulsante dal sito KeyClick e si apre la schermata del portale - un rotolo stilizzato con un saluto di benvenuto e la bandiera della lingua.\n\nLa lingua non è quella giusta? Scegli 1 delle 11 bandiere in alto nel sito e sarai immediatamente trasferito alla lingua scelta. Il sistema multilingue è una delle unità fondamentali del sito e dei suoi prodotti. Puoi passare da una lingua all'altra istantaneamente in qualsiasi momento.\n\nCliccando in qualsiasi punto dello schermo si chiude la schermata del portale e si apre il contenuto del progetto." },
    { heading: 'Selezione della lingua', body: "Nella parte superiore dello schermo troverai una fila di bandiere - una per ciascuna delle 11 lingue supportate dal software. Cliccando su una bandiera qualsiasi, l'intero software passa immediatamente a quella lingua - tutti i titoli, tutte le etichette, tutti i messaggi di sistema. Puoi cambiare lingua in qualsiasi momento, e tornare indietro, senza perdere alcun dato." },
    { heading: 'Iniziare', body: "Hai cliccato sulla schermata di accesso e sei entrato nell'applicazione. Cosa vedi? Cosa dovresti fare?\n\nPer gestire un bilancio, devi prima caricare i dati. Quali sono i modi per caricare. Ci sono diversi percorsi di caricamento. Durante il processo di caricamento riceverai indicazioni e messaggi.\n\nFine del caricamento. Cosa vedi? Pagina del conto annuale, disposizione annuale. Tabella del saldo, saldo residuo, tabella delle transazioni caricate, classificate per argomento." },
    { heading: 'Vista annuale', body: "Lo schermo principale, che si apre per primo dopo la pagina del portale. In questa vista vediamo le informazioni memorizzate nel database, caricate dagli estratti conto di un istituto finanziario. Lo schermo è diviso in due aree principali. Una tabella centrale che include un riepilogo di entrate, uscite, saldi e bilanci. La seconda parte sono tabelle di dettaglio per ogni categoria. Toccando la categoria si apre il dettaglio delle transazioni. Tutti i dati nella pagina annuale sono in realtà mostrati con diverse suddivisioni e chiavi nel resto delle viste descritte di seguito." },
    { heading: 'Vista mensile', body: "Vuoi occuparti solo di un mese specifico? Clicca su Vista mensile nel pannello di controllo. Si apre una pagina contenente una derivata di un mese specifico dalla pagina annuale. Qui puoi scegliere qualsiasi mese e ottenere immediatamente i suoi dati sullo schermo." },
    { heading: 'Pannelli dei messaggi', body: 'Nella parte inferiore dello schermo sono presenti in modo permanente tre pannelli di messaggi di sistema: messaggi correnti, informazioni ed eventuali errori.' },
    { heading: 'Pannello di controllo', body: "Uno sguardo verso destra ci porta al pannello di controllo del sito. Il pannello di controllo è sempre visibile sul lato destro.\n\nOgnuno degli elementi del pannello di controllo serve a mostrare qualcosa localmente o a passare a un'altra pagina. Tutti questi elementi sono descritti in dettaglio più avanti in questo documento.", image: { src: '/guides/mfinance-control-panel-it.jpg', width: 128, height: 817 } },
    { heading: 'Lato del pannello di controllo', body: 'Che tu sia destro o mancino, puoi cliccare sul pulsante destro o sinistro nel pannello di controllo, e il pannello di controllo si sposterà da un lato all\'altro.' },
    { heading: 'Indicatore IA', body: "Nella parte inferiore del pannello di controllo è accesa una spia IA - il verde significa disponibile, il rosso significa non disponibile. In generale, anche quando l'IA non è disponibile, il sistema di solito sa gestire la maggior parte delle operazioni." },
    { heading: 'Terminare il lavoro', body: "Hai finito di lavorare e vuoi chiudere l'applicazione? Clicca su Esci." },
    { heading: 'Processo di caricamento manuale', body: 'Il processo di caricamento manuale viene eseguito tramite i pulsanti di caricamento nel pannello di controllo. Prima del caricamento puoi scegliere di caricare un singolo file specifico - clicca su File; caricare tutti i file in una cartella - clicca su Cartella; caricamento automatico di tutti i file in una cartella - clicca su Automatico, dove riceverai una richiesta di conferma per ogni file. Una volta scelto il metodo di caricamento, clicca sul pulsante Carica. Si aprirà un gestore file - scegli un file o una cartella, e conferma.' },
    { heading: 'Connessione diretta a un istituto finanziario', body: 'Esiste una funzione speciale per caricare dati direttamente da un istituto finanziario. Cliccando sul pulsante "Istituto finanziario" verrai portato ai servizi bancari del progetto. In questo servizio puoi connetterti a uno degli istituti finanziari nel mondo - quelli che sono stati predisposti e sono disponibili per noi. In questo processo puoi scaricare i dati sul tuo computer, creando file per il caricamento manuale, oppure scaricare i dati direttamente nel progetto.' },
    { heading: 'Visualizzazione dei numeri di conto', body: 'Accanto ai pulsanti di caricamento hai un\'etichetta "N. conto" con caselle di controllo. Questa informazione viene estratta dopo il processo di caricamento, dai dati stessi. Scegli uno o più conti su cui far concentrare il sistema (fino a 4 conti diversi).' },
    { heading: 'Schermata del database', body: 'Hai caricato dati dalle pagine del conto e vuoi vedere il caricamento grezzo, così come è stato caricato. Clicca sul pulsante Database nel pannello di controllo e scorri fino alla visualizzazione desiderata.' },
    { heading: 'Pagina delle categorie', body: 'Puoi aprire la pagina delle categorie e vedere tutte le tabelle.\n\nSe una determinata transazione non è nella categoria corretta, clicca su Modifica, imposta la categoria corretta, clicca su Aggiorna. Il sistema ricorderà la scelta anche per i caricamenti futuri.' },
    { heading: 'Vista grafica e la torta di bilancio', body: "Nel pannello di controllo hai davanti a te un elenco di viste (pagina del conto). Scegli Vista grafica. Si apre davanti a te una schermata di vista grafica annuale. Qui puoi scegliere tutto ciò che ti viene in mente, qualsiasi voce che desideri esaminare nel tempo in visualizzazione grafica.\n\nSei nella pagina grafica, vuoi ottenere una comprensione più profonda e anche vivere un'esperienza tecnologica sorprendente? Clicca sulla Torta di bilancio. In questa vista puoi scegliere il mese desiderato e vedere la disposizione delle spese sopra le entrate. Nella pagina della torta, la tabella a destra con i selettori ti permette di controllare le fette della torta - abbassare o aumentare il loro valore. Regolando le fette puoi raggiungere i valori desiderati per ottenere l'equilibrio che desideri." },
    { heading: 'Carte di credito', body: 'Vai al pannello di controllo, clicca su Carte di credito e potrai vedere tutte le carte. Scegli una carta e ottieni un dettaglio completo.' },
    { heading: 'Pianificazione futura', body: "Torna di nuovo al pannello di controllo, clicca su Pianificazione futura. Per pianificare un'azione, clicca e si apre una scheda di modifica. Scegli l'istituto finanziario, il numero di conto, la categoria della transazione, scrivi una descrizione della transazione, una nota, un importo da addebitare o accreditare, e per quanti mesi si estende. Al termine clicca su Aggiorna.\n\nDopo aver inserito la voce nella tabella di pianificazione, puoi duplicarla o modificarla. Fallo selezionando la riga e modificando all'interno della stessa scheda. Segui le istruzioni.\n\nLa tabella di pianificazione futura, come le carte di credito, si integra con precisione nella pagina del conto annuale, seguendo i mesi rilevanti. Aggiornamento ogni mese nel proprio mese. Nota che nelle diverse pagine del conto c'è un'opzione per visualizzare e analizzare i dati con o senza pianificazione futura, con dettaglio completo delle transazioni con carta di credito o solo con il loro riepilogo." },
    { heading: 'Passare da una schermata all\'altra', body: 'Nel pannello di controllo troverai sette pulsanti che ti spostano tra le schermate principali del software:\n\nAnnuale, Mensile, Categorie, Futuro, Database, Credito, Grafico\n\nOgnuno di essi apre una schermata diversa, e spiegherò ciascuno di essi più avanti nella guida.' },
    { heading: 'Caricamento dei file', body: 'Qui è dove porti nel software i file che hai scaricato dalla banca o dalla società della carta di credito (di solito file Excel o CSV). Clicca sul pulsante "Carica", e scegli come vuoi caricare:\n\n•    File - caricamento di un singolo file\n•    Cartella - caricamento di tutti i file presenti in una determinata cartella in una volta sola\n•    Automatico - il software carica da solo, senza bisogno di scegliere ogni file separatamente\n\nNon devi preoccuparti di caricare accidentalmente lo stesso file due volte - il software riconosce le transazioni già presenti e non le aggiungerà di nuovo. Questo significa che puoi tranquillamente ricaricare un file già caricato in precedenza, senza temere che i numeri si "gonfino".' },
    { heading: 'Conti', body: 'Accanto ai pulsanti di caricamento hai un\'etichetta "N. conto" con caselle di controllo - qui puoi vedere e scegliere su quali conti bancari concentrarti (fino a 4 conti diversi).' },
    { heading: 'Reset e ricomincia', body: 'Se a un certo punto vuoi ricominciare, ci sono due pulsanti separati:\n\n•    Reset database - elimina tutte le transazioni caricate\n•    Reset categorie - elimina le categorie impostate per le transazioni\n\nE infine, un pulsante "Esci" per uscire dal software.' },
    { heading: 'Lo schermo annuale', body: 'Questo è lo schermo principale del software, chiamato "Pagina del conto annuale".\n\nQui vedi una grande tabella: nelle righe - tutte le tue categorie di spesa ed entrata, e nelle colonne - tre anni interi, mese per mese. Nella riga superiore della tabella appare un riepilogo generale - quanto è entrato, quanto è uscito, quale saldo è stato riportato dal periodo precedente, e qual è il totale.\n\nSe vuoi vedere esattamente quali transazioni si celano dietro un determinato importo - clicca semplicemente sulla riga della categoria che ti interessa, e lo schermo ti aprirà anche il suo dettaglio completo.\n\nIn alto nello schermo hai alcuni pulsanti:\n\n•    Aggiornamento - aggiorna i dati nella tabella\n•    Esporta - salva la tabella come file Excel o PDF, così puoi salvarla o stamparla\n•    Aggiorna\n•    Pulisci\n\nE due interruttori importanti che vedrai anche nelle schermate successive:\n\n•    Includi futuro - determina se le spese e le entrate future pianificate (come gli ordini permanenti) sono incluse nel calcolo\n•    Includi carte di credito - determina se le transazioni con carta di credito sono incluse nel calcolo' },
    { heading: 'Lo schermo mensile', body: 'Questo schermo si chiama "Pagina del conto mensile", e ti offre uno zoom su un mese specifico che ti interessa.\n\nIn alto puoi scegliere un anno e un mese, e cliccare sul pulsante "Aggiorna" per vedere i dati di quel periodo.\n\nCiò che è speciale in questo schermo è che centralizza per te otto tabelle diverse in un unico posto, così vedi l\'intera immagine del mese selezionato in una volta:\n\n•    Elenco delle spese\n•    Riepilogo delle transazioni per categoria\n•    Entrate future\n•    Spese future\n•    Calcolo del saldo\n•    Saldo mensile\n•    Carte di credito\n•    Conti bancari\n\nE anche qui, i due interruttori "Includi futuro" e "Includi carte di credito" sono disponibili per te, se vuoi includerli o ometterli dall\'immagine.' },
    { heading: 'Lo schermo delle categorie', body: 'Questo schermo si chiama "Pagina del conto ordinata per categoria", e qui vedi tutte le tue transazioni organizzate per categoria - tutto ciò che appartiene a "Alimentari", tutto ciò che appartiene a "Auto", e così via.\n\nQuesto è anche il luogo dove puoi correggere una categoria che il software ha impostato in modo errato. Il software stesso ti guida esattamente su cosa fare: "Per cambiare la categoria, clicca: Modifica, scegli nuova categoria, Aggiorna"\n\nOvvero - clicca su Modifica, scegli la categoria corretta dall\'elenco, e clicca su Aggiorna. Importante sapere: quando cambi la categoria di una transazione, il software se ne ricorda, così la prossima volta che caricherai una transazione simile (con la stessa descrizione), la classificherà già correttamente da sola.\n\nE anche qui, i due interruttori "Includi futuro" e "Includi carte di credito" sono disponibili per te.' },
    { heading: 'Lo schermo del database', body: 'Questo schermo si chiama "Database", ed è l\'elenco grezzo e completo di ogni singola transazione caricata nel software - la sua data, la banca o la società della carta di credito da cui proviene, la descrizione, l\'importo, la categoria assegnata, e altro ancora.\n\nQuesto è il posto a cui rivolgersi se vuoi vedere "tutti i dati così come sono", senza alcun filtro o raggruppamento. Il pulsante Aggiornamento aggiorna l\'elenco.' },
    { heading: 'Lo schermo delle carte di credito', body: 'Questo schermo si chiama "Carte di credito", e come mostra esso stesso: "Ecco l\'elenco delle tue carte di credito, scegline una per un dettaglio delle operazioni"\n\nIn alto vedrai una tabella riassuntiva di tutte le tue carte di credito, mese per mese, per tre anni - esattamente come lo schermo annuale, ma focalizzato sulle carte di credito. Quando scegli una carta specifica, appare sotto una tabella aggiuntiva con un dettaglio per gli esercenti che l\'hanno addebitata.\n\nI pulsanti Aggiorna ed Esporta sono disponibili anche qui.' },
    { heading: 'Lo schermo di pianificazione futura', body: 'Questo schermo si chiama "Pagina del conto futuro", e qui gestisci spese ed entrate che già conosci in anticipo - ordini permanenti, pagamenti rateali, abbonamenti mensili, e altro.\n\nIl software ti guida: "Scheda azione - scegli una riga o iniziane una nuova".\n\nOgni voce che aggiungi ha la propria scheda, con i seguenti campi:\n\n•    Fonte\n•    Categoria\n•    Nota\n•    Descrizione\n•    Banca\n•    Conto\n•    Entrata o spesa\n•    Data di inizio\n•    Numero di pagamenti\n\nUna volta impostate la data di inizio e il numero di pagamenti, il software si occupa di distribuire l\'importo in avanti su tutti quei mesi, e lo integra automaticamente in tutte le altre schermate (quando l\'interruttore "Includi futuro" è attivo).\n\nAzioni disponibili: Aggiorna, Nuovo, Modifica, Reset, Elimina.' },
    { heading: 'Lo schermo dei grafici', body: 'Questo schermo si chiama "Pagina del conto in vista grafica", e ti offre gli stessi dati - ma come immagine, non come tabella.\n\nPuoi scegliere tra diverse modalità di visualizzazione: Saldo, Saldo residuo, Spese, oltre a una visualizzazione focalizzata per Categoria, un singolo Elemento, Pianificazione futura, o Carte di credito.' },
    { heading: 'La torta di bilancio', body: 'All\'interno dello schermo dei grafici troverai uno strumento speciale chiamato "Torta di bilancio", il cui scopo è la "Pianificazione dell\'equilibrio del bilancio familiare" - questo è uno strumento di regolazione dal vivo del tuo bilancio: scegli un periodo da visualizzare (anno e mese), e puoi trascinare e cambiare la ripartizione tra le categorie e vedere immediatamente come ciò influisce sull\'equilibrio generale del bilancio.\n\nPulsanti disponibili: Aggiorna, Reset, Aggiorna.' },
    { heading: 'La bacheca dei messaggi', body: 'In fondo allo schermo, per tutta la durata del tuo lavoro nel software, hai una bacheca dei messaggi con tre sezioni:\n\n•    Sistema - cosa sta succedendo attualmente in background\n•    Guida - suggerimenti e indicazioni\n•    Errore - se qualcosa non è riuscito, lo saprai qui\n\nPuoi cancellare i messaggi con il pulsante Pulisci, o salvarli con il pulsante Esporta.' },
    { heading: 'Gestione del bilancio familiare M Finance', body: "L'applicazione di gestione del bilancio familiare è il gioiello della corona del progetto. Una spiegazione completa e dettagliata può essere letta nei cassetti dei documenti 4, 5, 6 in Guide e video.\n\nAttraverso l'applicazione otterrai una panoramica completa della tua attività bancaria, entrate e uscite, saldo mensile e annuale. Puoi anche aggiungere e pianificare spese o entrate future, con una pianificazione dei pagamenti intelligente.\n\nHai cliccato sull'interruttore Gestione del bilancio familiare nel pannello di controllo, si aprirà il portale dell'applicazione - una pagina simile al portale del sito KeyClick - con un saluto di benvenuto nella lingua che hai scelto.\n\nL'applicazione legge i file del conto bancario e della carta di credito che hai scaricato in anticipo dal tuo conto presso un istituto finanziario, ed esegue un'analisi approfondita delle operazioni bancarie in questi estratti conto.\n\nLe capacità dell'applicazione spaziano su una varietà di viste, in diverse suddivisioni e in tempi diversi, incluse visualizzazioni grafiche individuali.\n\nEd ecco la ciliegina sulla torta - una torta di bilancio dal vivo. Le spese sono mostrate come fette all'interno della torta delle entrate. Un meccanismo intelligente ti permette di cambiare i valori delle fette fino a raggiungere un equilibrio." },
    { heading: 'Servizi bancari', body: "Hai iniziato a usare la gestione del bilancio familiare e vuoi accorciare i processi? Hai 2 opzioni aggiuntive:\n\n•    Download automatico dei file degli estratti conto sul tuo computer,\n•    Download automatico dei file degli estratti conto direttamente nell'applicazione di gestione del bilancio familiare.\n\nLa connessione al tuo istituto finanziario sarà effettuata solo da te, un accesso normale come fai sempre, secondo le impostazioni di sicurezza in uso presso quell'istituto. Immediatamente dopo il download dei file, avviene il blocco e la disconnessione.\n\nIl servizio include un'esperienza pratica in un ambiente tecnologico avanzato." },
  ],
  hi: [
    { heading: 'KeyClick', body: 'गृह बजट प्रबंधन एप्लिकेशन KeyClick ब्रांड प्रोजेक्ट का हिस्सा है' },
    { heading: 'गृह बजट प्रबंधन का होम पेज', body: 'आपने KeyClick साइट से बटन पर क्लिक किया और गेट स्क्रीन खुलती है - स्वागत अभिवादन और भाषा के झंडे के साथ एक स्टाइलिश स्क्रॉल।\n\nभाषा उपयुक्त नहीं है? साइट के शीर्ष पर 11 झंडों में से 1 चुनें और आपको तुरंत चुनी हुई भाषा में स्थानांतरित कर दिया जाएगा। बहु-भाषा प्रणाली साइट और उसके उत्पादों की मूलभूत इकाइयों में से एक है। आप किसी भी समय तुरंत भाषाएं बदल सकते हैं।\n\nस्क्रीन पर कहीं भी क्लिक करने से गेट स्क्रीन बंद हो जाती है और प्रोजेक्ट की सामग्री खुल जाती है।' },
    { heading: 'भाषा चयन', body: 'स्क्रीन के शीर्ष पर आपको झंडों की एक पंक्ति मिलेगी - सॉफ़्टवेयर द्वारा समर्थित 11 भाषाओं में से प्रत्येक के लिए एक। किसी भी झंडे पर क्लिक करने से पूरा सॉफ़्टवेयर तुरंत उस भाषा में बदल जाता है - सभी शीर्षक, सभी लेबल, सभी सिस्टम संदेश। आप किसी भी क्षण भाषाएं बदल सकते हैं, और वापस जा सकते हैं, बिना कोई डेटा खोए।' },
    { heading: 'शुरुआत करना', body: 'आपने प्रवेश स्क्रीन पर क्लिक किया और एप्लिकेशन में प्रवेश किया। आप क्या देखते हैं? आपको क्या करना चाहिए?\n\nबजट प्रबंधित करने के लिए, आपको पहले डेटा लोड करना होगा। लोड करने के तरीके क्या हैं। लोड करने के कई मार्ग हैं। लोडिंग प्रक्रिया के दौरान आपको मार्गदर्शन और संदेश प्राप्त होंगे।\n\nलोडिंग समाप्त। आप क्या देखते हैं? वार्षिक खाता पृष्ठ, वार्षिक लेआउट। शेष तालिका, बकाया शेष, लोड किए गए लेन-देन की तालिका, विषय के अनुसार वर्गीकृत।' },
    { heading: 'वार्षिक दृश्य', body: 'मुख्य स्क्रीन, जो गेट पेज के बाद पहले खुलती है। इस दृश्य में हम डेटाबेस में संग्रहीत जानकारी देखते हैं, जो किसी वित्तीय संस्थान के खाता विवरण से लोड की गई है। स्क्रीन दो मुख्य क्षेत्रों में विभाजित है। आय, व्यय, शेष और बैलेंस के सारांश वाली एक केंद्रीय तालिका। दूसरा भाग प्रत्येक श्रेणी के लिए विवरण तालिकाएं हैं। श्रेणी पर टैप करने से लेन-देन का विवरण खुलता है। वार्षिक पृष्ठ पर सभी डेटा वास्तव में नीचे वर्णित शेष दृश्यों में विभिन्न विभाजनों और कुंजियों में दिखाया जाता है।' },
    { heading: 'मासिक दृश्य', body: 'केवल किसी विशेष महीने से निपटना चाहते हैं? नियंत्रण पैनल में मासिक दृश्य पर क्लिक करें। एक पृष्ठ खुलेगा जिसमें वार्षिक पृष्ठ से किसी विशेष महीने का व्युत्पन्न शामिल है। यहां आप कोई भी महीना चुन सकते हैं और तुरंत स्क्रीन पर उसका डेटा प्राप्त कर सकते हैं।' },
    { heading: 'संदेश पैनल', body: 'स्क्रीन के निचले भाग में, स्थायी रूप से तीन सिस्टम संदेश पैनल मौजूद हैं: चालू संदेश, जानकारी, और संभावित त्रुटियां।' },
    { heading: 'नियंत्रण पैनल', body: 'दाईं ओर देखने से हम साइट के नियंत्रण पैनल पर पहुंचते हैं। नियंत्रण पैनल हमेशा दाईं ओर दिखाई देता है।\n\nनियंत्रण पैनल पर प्रत्येक आइटम स्थानीय रूप से कुछ प्रदर्शित करने या किसी अन्य पृष्ठ पर जाने के लिए है। ये सभी आइटम इस दस्तावेज़ में आगे विस्तार से बताए गए हैं।', image: { src: '/guides/mfinance-control-panel-hi.jpg', width: 133, height: 819 } },
    { heading: 'नियंत्रण पैनल की दिशा', body: 'चाहे आप दाएं हाथ के हों या बाएं हाथ के, आप नियंत्रण पैनल पर दाएं या बाएं बटन पर क्लिक कर सकते हैं, और नियंत्रण पैनल एक तरफ से दूसरी तरफ चला जाएगा।' },
    { heading: 'AI संकेतक', body: 'नियंत्रण पैनल के निचले भाग में एक AI संकेतक लाइट जलती है - हरा का मतलब उपलब्ध है, लाल का मतलब उपलब्ध नहीं है। सामान्य तौर पर, जब AI उपलब्ध नहीं होता है, तब भी सिस्टम आमतौर पर अधिकांश संचालन संभालना जानता है।' },
    { heading: 'काम समाप्त करना', body: 'काम खत्म हो गया और एप्लिकेशन बंद करना चाहते हैं? बाहर निकलें पर क्लिक करें।' },
    { heading: 'मैनुअल लोडिंग प्रक्रिया', body: 'मैनुअल लोडिंग प्रक्रिया नियंत्रण पैनल में लोडिंग बटनों के माध्यम से की जाती है। लोड करने से पहले आप किसी एक विशेष फ़ाइल को लोड करना चुन सकते हैं - फ़ाइल पर क्लिक करें; किसी फ़ोल्डर में सभी फ़ाइलें लोड करें - फ़ोल्डर पर क्लिक करें; किसी फ़ोल्डर में सभी फ़ाइलों की स्वचालित लोडिंग - स्वचालित पर क्लिक करें, जहां आपको प्रत्येक फ़ाइल के लिए पुष्टिकरण अनुरोध मिलेगा। लोडिंग विधि चुनने के बाद, लोड बटन पर क्लिक करें। एक फ़ाइल मैनेजर खुलेगा - एक फ़ाइल या फ़ोल्डर चुनें, और पुष्टि करें।' },
    { heading: 'वित्तीय संस्थान से सीधा कनेक्शन', body: 'किसी वित्तीय संस्थान से सीधे डेटा लोड करने के लिए एक विशेष सुविधा मौजूद है। "वित्तीय संस्थान" बटन पर क्लिक करने से आप प्रोजेक्ट की बैंकिंग सेवाओं पर पहुंच जाते हैं। इस सेवा में आप दुनिया भर के वित्तीय संस्थानों में से किसी एक से जुड़ सकते हैं - जो व्यवस्थित किए गए हैं और हमारे लिए उपलब्ध हैं। इस प्रक्रिया में आप डेटा को अपने कंप्यूटर पर डाउनलोड कर सकते हैं, मैनुअल लोडिंग के लिए फ़ाइलें बना सकते हैं, या डेटा को सीधे प्रोजेक्ट में डाउनलोड कर सकते हैं।' },
    { heading: 'खाता संख्या प्रदर्शन', body: 'लोडिंग बटनों के बगल में आपके पास चेकबॉक्स के साथ "खाता संख्या" लेबल है। यह जानकारी लोडिंग प्रक्रिया के बाद, स्वयं डेटा से निकाली जाती है। सिस्टम को केंद्रित करने के लिए एक या अधिक खाते चुनें (4 अलग-अलग खातों तक)।' },
    { heading: 'डेटाबेस स्क्रीन', body: 'आपने खाता पृष्ठों से डेटा लोड किया है और यह देखना चाहते हैं कि कच्चा लोडिंग कैसा था, जैसा कि यह लोड किया गया था। नियंत्रण पैनल में डेटाबेस बटन पर क्लिक करें और वांछित प्रदर्शन तक स्क्रॉल करें।' },
    { heading: 'श्रेणी पृष्ठ', body: 'आप श्रेणी पृष्ठ खोल सकते हैं और सभी तालिकाएं देख सकते हैं।\n\nयदि कोई विशेष लेन-देन सही श्रेणी में नहीं है, तो संपादित करें पर क्लिक करें, सही श्रेणी सेट करें, अपडेट पर क्लिक करें। सिस्टम भविष्य के लोडिंग के लिए भी इस विकल्प को याद रखेगा।' },
    { heading: 'ग्राफिकल दृश्य और बजट पाई', body: 'नियंत्रण पैनल में आपके सामने दृश्यों (खाता पृष्ठ) की एक सूची है। ग्राफिकल दृश्य चुनें। आपके सामने एक वार्षिक ग्राफिकल दृश्य स्क्रीन खुलती है। यहां आप जो कुछ भी मन में आए उसे चुन सकते हैं, कोई भी आइटम जिसे आप समय के साथ ग्राफिकल प्रदर्शन में जांचना चाहते हैं।\n\nआप ग्राफिकल पृष्ठ पर हैं, गहरी समझ प्राप्त करना चाहते हैं और साथ ही एक अद्भुत तकनीकी अनुभव भी लेना चाहते हैं? बजट पाई पर क्लिक करें। इस दृश्य में आप वांछित महीना चुन सकते हैं और आय के ऊपर रखे गए व्यय का लेआउट देख सकते हैं। पाई पृष्ठ पर, चयनकर्ताओं के साथ दाईं ओर की तालिका आपको पाई के टुकड़ों को नियंत्रित करने देती है - उनके मूल्य को कम या बढ़ा सकते हैं। टुकड़ों को नियंत्रित करके आप वांछित संतुलन प्राप्त करने के लिए वांछित मूल्यों तक पहुंच सकते हैं।' },
    { heading: 'क्रेडिट कार्ड', body: 'नियंत्रण पैनल पर जाएं, क्रेडिट कार्ड पर क्लिक करें और आप सभी कार्ड देख सकेंगे। एक कार्ड चुनें और विस्तृत विवरण प्राप्त करें।' },
    { heading: 'भविष्य की योजना', body: 'फिर से नियंत्रण पैनल पर जाएं, भविष्य की योजना पर क्लिक करें। किसी कार्रवाई की योजना बनाने के लिए, क्लिक करें और एक संपादन कार्ड खुलता है। वित्तीय संस्थान, खाता संख्या, लेन-देन श्रेणी चुनें, लेन-देन का विवरण, एक नोट, डेबिट या क्रेडिट की जाने वाली राशि, और यह कितने महीनों तक फैला है, लिखें। समाप्त होने पर अपडेट पर क्लिक करें।\n\nयोजना तालिका में आइटम दर्ज करने के बाद, आप इसे डुप्लिकेट या बदल सकते हैं। पंक्ति का चयन करके और उसी कार्ड में संपादित करके ऐसा करें। निर्देशों का पालन करें।\n\nभविष्य की योजना तालिका, क्रेडिट कार्ड की तरह, प्रासंगिक महीनों को ट्रैक करते हुए वार्षिक खाता पृष्ठ में सटीक रूप से एकीकृत की जाती है। हर महीने उसके महीने में अपडेट किया जाता है। ध्यान दें कि विभिन्न खाता पृष्ठों पर, भविष्य की योजना के साथ या उसके बिना डेटा प्रदर्शित करने और विश्लेषण करने का विकल्प है, क्रेडिट कार्ड लेन-देन के पूर्ण विवरण के साथ या केवल उनके सारांश के साथ।' },
    { heading: 'स्क्रीनों के बीच स्विच करना', body: 'नियंत्रण पैनल में आपको सात बटन मिलेंगे जो आपको सॉफ़्टवेयर की मुख्य स्क्रीनों के बीच ले जाते हैं:\n\nवार्षिक, मासिक, श्रेणियां, भविष्य, डेटाबेस, क्रेडिट, ग्राफिकल\n\nइनमें से प्रत्येक एक अलग स्क्रीन खोलता है, और मैं गाइड में आगे इनमें से प्रत्येक के बारे में बताऊंगा।' },
    { heading: 'फ़ाइलें लोड करना', body: 'यह वह जगह है जहां आप बैंक या क्रेडिट कार्ड कंपनी से डाउनलोड की गई फ़ाइलों (आमतौर पर Excel या CSV फ़ाइलें) को सॉफ़्टवेयर में लाते हैं। "लोड करें" बटन पर क्लिक करें, और चुनें कि आप कैसे लोड करना चाहते हैं:\n\n•    फ़ाइल - एक एकल फ़ाइल लोड करना\n•    फ़ोल्डर - किसी विशेष फ़ोल्डर में मौजूद सभी फ़ाइलों को एक साथ लोड करना\n•    स्वचालित - सॉफ़्टवेयर स्वयं लोड करता है, प्रत्येक फ़ाइल को अलग से चुनने की आवश्यकता नहीं है\n\nआपको गलती से एक ही फ़ाइल को दो बार लोड करने की चिंता करने की आवश्यकता नहीं है - सॉफ़्टवेयर उन लेन-देन को पहचानता है जो पहले से मौजूद हैं और उन्हें फिर से नहीं जोड़ेगा। इसका मतलब है कि आप निश्चिंत होकर पहले लोड की गई फ़ाइल को फिर से लोड कर सकते हैं, बिना इस डर के कि संख्याएं "फूल" जाएंगी।' },
    { heading: 'खाते', body: 'लोडिंग बटनों के बगल में आपके पास चेकबॉक्स के साथ "खाता संख्या" लेबल है - यहां आप देख सकते हैं और चुन सकते हैं कि किन बैंक खातों पर ध्यान केंद्रित करना है (4 अलग-अलग खातों तक)।' },
    { heading: 'रीसेट और फिर से शुरू करना', body: 'यदि किसी बिंदु पर आप फिर से शुरू करना चाहते हैं, तो दो अलग बटन हैं:\n\n•    डेटाबेस रीसेट करें - सभी लोड किए गए लेन-देन हटाता है\n•    श्रेणियां रीसेट करें - लेन-देन के लिए सेट की गई श्रेणियों को हटाता है\n\nऔर अंत में, सॉफ़्टवेयर से बाहर निकलने के लिए एक "बाहर निकलें" बटन।' },
    { heading: 'वार्षिक स्क्रीन', body: 'यह सॉफ़्टवेयर की मुख्य स्क्रीन है, जिसे "वार्षिक खाता पृष्ठ" कहा जाता है।\n\nयहां आप एक बड़ी तालिका देखते हैं: पंक्तियों में - आपकी सभी व्यय और आय श्रेणियां, और स्तंभों में - तीन पूर्ण वर्ष, महीने दर महीने। तालिका की शीर्ष पंक्ति में एक सामान्य सारांश दिखाई देता है - कितना आया, कितना गया, पिछली अवधि से कितना शेष आगे बढ़ा, और कुल कितना है।\n\nयदि आप ठीक-ठीक देखना चाहते हैं कि किसी विशेष राशि के पीछे कौन से लेन-देन हैं - बस उस श्रेणी की पंक्ति पर क्लिक करें जो आपको रुचिकर लगे, और स्क्रीन आपके लिए उसका पूरा विवरण भी खोल देगी।\n\nस्क्रीन के शीर्ष पर आपके पास कुछ बटन हैं:\n\n•    अपडेट - तालिका में डेटा को रीफ्रेश करता है\n•    निर्यात - तालिका को Excel या PDF फ़ाइल के रूप में सहेजता है, ताकि आप इसे सहेज सकें या प्रिंट कर सकें\n•    रीफ्रेश\n•    साफ़ करें\n\nऔर दो महत्वपूर्ण स्विच जो आप आगे की स्क्रीनों पर भी देखेंगे:\n\n•    भविष्य शामिल करें - यह निर्धारित करता है कि क्या भविष्य के नियोजित व्यय और आय (जैसे स्थायी आदेश) गणना में शामिल हैं\n•    क्रेडिट कार्ड शामिल करें - यह निर्धारित करता है कि क्या क्रेडिट कार्ड लेन-देन गणना में शामिल हैं' },
    { heading: 'मासिक स्क्रीन', body: 'इस स्क्रीन को "मासिक खाता पृष्ठ" कहा जाता है, और यह आपको किसी विशेष महीने पर ज़ूम-इन देता है जिसमें आपकी रुचि है।\n\nशीर्ष पर आप एक वर्ष और महीना चुन सकते हैं, और उस अवधि का डेटा देखने के लिए "अपडेट" बटन पर क्लिक कर सकते हैं।\n\nइस स्क्रीन की विशेष बात यह है कि यह आपके लिए एक ही स्थान पर आठ अलग-अलग तालिकाओं को केंद्रीकृत करती है, ताकि आप चयनित महीने की पूरी तस्वीर एक साथ देख सकें:\n\n•    व्यय सूची\n•    श्रेणी के अनुसार लेन-देन का सारांश\n•    भविष्य की आय\n•    भविष्य के व्यय\n•    शेष गणना\n•    मासिक शेष\n•    क्रेडिट कार्ड\n•    बैंक खाते\n\nयहां भी, "भविष्य शामिल करें" और "क्रेडिट कार्ड शामिल करें" दो स्विच आपके लिए उपलब्ध हैं, यदि आप उन्हें तस्वीर में शामिल करना या छोड़ना चाहते हैं।' },
    { heading: 'श्रेणी स्क्रीन', body: 'इस स्क्रीन को "श्रेणी के अनुसार क्रमबद्ध खाता पृष्ठ" कहा जाता है, और यहां आप अपने सभी लेन-देन को श्रेणी के अनुसार व्यवस्थित देखते हैं - जो कुछ भी "भोजन" से संबंधित है, जो कुछ भी "कार" से संबंधित है, और इसी तरह।\n\nयह वह जगह भी है जहां आप उस श्रेणी को ठीक कर सकते हैं जिसे सॉफ़्टवेयर ने गलत तरीके से सेट किया है। सॉफ़्टवेयर स्वयं आपको बताता है कि क्या करना है: "श्रेणी बदलने के लिए, क्लिक करें: संपादित करें, नई श्रेणी चुनें, अपडेट करें"\n\nयानी - संपादित करें पर क्लिक करें, सूची से सही श्रेणी चुनें, और अपडेट पर क्लिक करें। जानना महत्वपूर्ण है: जब आप किसी लेन-देन की श्रेणी बदलते हैं, तो सॉफ़्टवेयर इसे याद रखता है, ताकि अगली बार जब आप समान लेन-देन लोड करें (उसी विवरण के साथ), तो यह स्वयं ही सही ढंग से वर्गीकृत हो जाए।\n\nयहां भी, "भविष्य शामिल करें" और "क्रेडिट कार्ड शामिल करें" दो स्विच आपके लिए उपलब्ध हैं।' },
    { heading: 'डेटाबेस स्क्रीन', body: 'इस स्क्रीन को "डेटाबेस" कहा जाता है, और यह सॉफ़्टवेयर में लोड किए गए प्रत्येक लेन-देन की कच्ची, पूर्ण सूची है - इसकी तारीख, बैंक या क्रेडिट कार्ड कंपनी जहां से यह आया, विवरण, राशि, इसे सौंपी गई श्रेणी, और अधिक।\n\nयह वह जगह है जहां आपको जाना चाहिए यदि आप बिना किसी फ़िल्टरिंग या समूहीकरण के "सभी डेटा जैसा है वैसा" देखना चाहते हैं। अपडेट बटन सूची को रीफ्रेश करता है।' },
    { heading: 'क्रेडिट कार्ड स्क्रीन', body: 'इस स्क्रीन को "क्रेडिट कार्ड" कहा जाता है, और जैसा कि यह स्वयं आपको दिखाता है: "यहां आपके क्रेडिट कार्ड की सूची है, संचालन के विस्तृत विवरण के लिए एक चुनें"\n\nशीर्ष पर आप अपने सभी क्रेडिट कार्डों की एक सारांश तालिका देखेंगे, महीने दर महीने, तीन वर्षों में - बिल्कुल वार्षिक स्क्रीन की तरह, बस क्रेडिट कार्ड पर केंद्रित। जब आप कोई विशेष कार्ड चुनते हैं, तो नीचे एक अतिरिक्त तालिका दिखाई देती है जिसमें उन व्यापारियों के अनुसार विवरण होता है जिन्होंने इसे चार्ज किया।\n\nरीफ्रेश और निर्यात बटन भी यहां उपलब्ध हैं।' },
    { heading: 'भविष्य की योजना स्क्रीन', body: 'इस स्क्रीन को "भविष्य का खाता पृष्ठ" कहा जाता है, और यहां आप उन व्यय और आय का प्रबंधन करते हैं जिनके बारे में आप पहले से ही जानते हैं - स्थायी आदेश, किस्त भुगतान, मासिक सदस्यता, और अधिक।\n\nसॉफ़्टवेयर आपका मार्गदर्शन करता है: "कार्रवाई कार्ड - एक पंक्ति चुनें या नई शुरू करें"।\n\nआपके द्वारा जोड़े गए प्रत्येक आइटम का अपना कार्ड होता है, निम्नलिखित फ़ील्ड के साथ:\n\n•    स्रोत\n•    श्रेणी\n•    नोट\n•    विवरण\n•    बैंक\n•    खाता\n•    आय या व्यय\n•    प्रारंभ तिथि\n•    भुगतानों की संख्या\n\nएक बार जब आप प्रारंभ तिथि और भुगतानों की संख्या निर्धारित कर लेते हैं, तो सॉफ़्टवेयर उन सभी महीनों में राशि को आगे फैलाने का ध्यान रखता है, और इसे स्वचालित रूप से अन्य सभी स्क्रीनों में एकीकृत करता है (जब "भविष्य शामिल करें" स्विच चालू होता है)।\n\nआपके लिए उपलब्ध कार्रवाइयां: अपडेट, नया, संपादित करें, रीसेट, हटाएं।' },
    { heading: 'ग्राफ़ स्क्रीन', body: 'इस स्क्रीन को "ग्राफिकल दृश्य में खाता पृष्ठ" कहा जाता है, और यह आपको वही डेटा देता है - लेकिन तालिका के बजाय एक चित्र के रूप में।\n\nआप कई प्रदर्शन मोड में से चुन सकते हैं: शेष, बकाया शेष, व्यय, साथ ही श्रेणी, एकल आइटम, भविष्य की योजना, या क्रेडिट कार्ड द्वारा केंद्रित प्रदर्शन।' },
    { heading: 'बजट पाई', body: 'ग्राफ़ स्क्रीन के अंदर आपको "बजट पाई" नामक एक विशेष उपकरण मिलेगा, जिसका उद्देश्य "गृह बजट संतुलन योजना" है - यह आपके बजट के लाइव विनियमन के लिए एक उपकरण है: आप प्रदर्शित करने के लिए एक अवधि चुनते हैं (वर्ष और महीना), और श्रेणियों के बीच विभाजन को खींच और बदल सकते हैं और तुरंत देख सकते हैं कि यह समग्र बजट संतुलन को कैसे प्रभावित करता है।\n\nउपलब्ध बटन: अपडेट, रीसेट, रीफ्रेश।' },
    { heading: 'संदेश बोर्ड', body: 'स्क्रीन के निचले भाग में, सॉफ़्टवेयर में आपके पूरे काम के दौरान, आपके पास तीन खंडों वाला एक संदेश बोर्ड है:\n\n•    सिस्टम - वर्तमान में पृष्ठभूमि में क्या हो रहा है\n•    मार्गदर्शन - सुझाव और दिशा\n•    त्रुटि - यदि कुछ विफल हो जाता है, तो आपको यहां पता चलेगा\n\nआप साफ़ करें बटन से संदेशों को साफ़ कर सकते हैं, या निर्यात बटन से उन्हें सहेज सकते हैं।' },
    { heading: 'गृह बजट प्रबंधन M Finance', body: 'गृह बजट प्रबंधन एप्लिकेशन प्रोजेक्ट का ताज है। पूरा, विस्तृत विवरण गाइड और वीडियो में दस्तावेज़ दराज 4, 5, 6 में पढ़ा जा सकता है।\n\nएप्लिकेशन के माध्यम से आपको अपनी बैंकिंग गतिविधि, आय और व्यय, मासिक और वार्षिक शेष का एक पूर्ण अवलोकन मिलेगा। आप एक स्मार्ट भुगतान अनुसूची में भविष्य के व्यय या आय को भी जोड़ और योजना बना सकते हैं।\n\nआपने नियंत्रण पैनल में गृह बजट प्रबंधन स्विच पर क्लिक किया, एप्लिकेशन का गेट खुलेगा - KeyClick साइट के गेट के समान एक पृष्ठ - आपके द्वारा चुनी गई भाषा में स्वागत अभिवादन के साथ।\n\nएप्लिकेशन उन बैंक खाता और क्रेडिट कार्ड फ़ाइलों को पढ़ता है जिन्हें आपने पहले से किसी वित्तीय संस्थान में अपने खाते से डाउनलोड किया था, और इन विवरणों में बैंकिंग लेन-देन का गहन विश्लेषण करता है।\n\nएप्लिकेशन की क्षमताएं विभिन्न विभाजनों और विभिन्न समयों पर विभिन्न प्रकार के दृश्यों तक फैली हुई हैं, जिसमें व्यक्तिगत ग्राफिकल प्रदर्शन शामिल हैं।\n\nऔर यहां सबसे खास हिस्सा है - एक लाइव बजट पाई। व्यय को आय पाई के अंदर टुकड़ों के रूप में दिखाया जाता है। एक स्मार्ट तंत्र आपको संतुलन प्राप्त होने तक टुकड़ों के मूल्यों को बदलने देता है।' },
    { heading: 'बैंकिंग सेवाएं', body: 'गृह बजट प्रबंधन का उपयोग शुरू कर दिया और प्रक्रियाओं को छोटा करना चाहते हैं? आपके पास 2 अतिरिक्त विकल्प हैं:\n\n•    खाता विवरण फ़ाइलों को अपने कंप्यूटर पर स्वचालित रूप से डाउनलोड करना,\n•    खाता विवरण फ़ाइलों को सीधे गृह बजट प्रबंधन एप्लिकेशन में स्वचालित रूप से डाउनलोड करना।\n\nआपके वित्तीय संस्थान से कनेक्शन केवल आपके द्वारा किया जाएगा, एक नियमित लॉगिन जैसा आप हमेशा करते हैं, उस संस्थान में प्रचलित सुरक्षा सेटअप के अनुसार। फ़ाइलें डाउनलोड होने के तुरंत बाद, यह लॉक हो जाता है और डिस्कनेक्ट हो जाता है।\n\nसेवा में एक उन्नत तकनीकी वातावरण में एक व्यावहारिक अनुभव शामिल है।' },
  ],
}

const SITE_OVERVIEW_SECTIONS: Record<string, GuideSection[]> = {
  he: [
    { heading: '', body: 'KeyClick משמש חזית שיווקית לטכנולוגיה חכמה. המהווה שער כניסה לאוסף כלים דיגיטליים המיועדים לשרת את הציבור הרחב בתחומים מגוונים של החיים היומיומיים, מתוך רצון להנגשה לפתרונות טכנולוגיים איכותיים — שבדרך כלל דורשים ידע טכני מוקדם — לכל אדם, ללא תלות ברמת ההיכרות שלו עם מחשבים.\nהפרויקט בנוי מאתר אינטרנט מודרני ומקצועי, בעל ביצועים גבוהים ויעילות מיטבית. ניהול רישיונות, משתמשים וסליקה. יכולת שילוב מלאה עם אפליקציות בשפות תכנות שונות, גמישות מלאה לפיתוח עתידי ופלטפורמה לגישה לחשבונות בנק. האתר נמצא כל הזמן בהתהוות מתמדת.\nהרעיון המרכזי מאחורי KeyClick הוא הפשטות. כניסה חופשית לאתר, גלישה, קריאה בחומרי העזר וצפייה בסרטונים ללא עלות.' },
    { heading: 'דף נחיתה', body: '•    דף הנחיתה הוא שער הכניסה לפרויקט KeyClick. דף הנחיתה מאפשר הכרות מהירה וכניסה לאתר. מרכיבי דף הנחיתה הם:\n•    הצגת הפלטפורמה\n•    שורת 11 דגלים לבחירת שפת המערכת\n•    שורת כרטיסיות שיווקיות להצגת יכולות\n•    גישה ישירה לאתר עצמו.' },
    { heading: 'רכיבי האתר', body: '•    דף נחיתה (הצגת הפרויקט וכניסה לאתר)\n•    אתר אינטרנט\n•    פרויקט ניהול תקציב הבית\n•    פלטפורמה התחברות לבנקים (אופציה ללקוח)\n•    קשרי לקוחות ודף אישי\n•    מדריכים וסרטונים\n•    מערכת מידע וניהול גרסאות תוכנה\n•    יומן תזכורות לשימוש המערכת וצרכים פרטיים\n•    מערכת סליקה\n•    בשימוש המערכת, ניהול ותחזוקה (נעול ללקוח)' },
  ],
  en: [
    { heading: '', body: 'KeyClick serves as the marketing front for smart technology — a gateway to a collection of digital tools designed to serve the general public across various areas of everyday life, out of a desire to make high-quality technological solutions — which usually require prior technical knowledge — accessible to everyone, regardless of their familiarity with computers.\nThe project is built on a modern, professional website with high performance and maximum efficiency. License, user and billing management. Full integration capability with applications in various programming languages, full flexibility for future development, and a platform for accessing bank accounts. The website is constantly evolving.\nThe core idea behind KeyClick is simplicity. Free entry to the website, browsing, reading the guide materials and watching videos at no cost.' },
    { heading: 'Landing Page', body: '•    The landing page is the entry gate to the KeyClick project. It allows a quick introduction and entry to the website. Its components are:\n•    Presentation of the platform\n•    A row of 11 flags for selecting the system language\n•    A row of marketing cards presenting capabilities\n•    Direct access to the website itself.' },
    { heading: 'Website Components', body: '•    Landing page (project presentation and entry to the website)\n•    Website\n•    Home budget management project\n•    Bank connection platform (optional for the customer)\n•    Customer relations and personal page\n•    Guides and videos\n•    Information and software version management system\n•    Reminder calendar for system use and private needs\n•    Billing system\n•    System use, management and maintenance (locked for the customer)' },
  ],
  ru: [
    { heading: '', body: 'KeyClick служит маркетинговым фасадом умных технологий — воротами в коллекцию цифровых инструментов, предназначенных для широкой публики в различных сферах повседневной жизни, из стремления сделать качественные технологические решения — которые обычно требуют предварительных технических знаний — доступными для каждого, независимо от уровня знакомства с компьютерами.\nПроект построен на современном профессиональном веб-сайте с высокой производительностью и максимальной эффективностью. Управление лицензиями, пользователями и биллингом. Полная возможность интеграции с приложениями на разных языках программирования, полная гибкость для будущего развития и платформа для доступа к банковским счетам. Сайт находится в постоянном развитии.\nОсновная идея KeyClick — простота. Свободный вход на сайт, просмотр, чтение справочных материалов и просмотр видео бесплатно.' },
    { heading: 'Целевая страница', body: '•    Целевая страница — это входные ворота проекта KeyClick. Она позволяет быстро познакомиться с сайтом и войти на него. Её элементы:\n•    Представление платформы\n•    Ряд из 11 флагов для выбора языка системы\n•    Ряд рекламных карточек с описанием возможностей\n•    Прямой доступ к самому сайту.' },
    { heading: 'Компоненты сайта', body: '•    Целевая страница (представление проекта и вход на сайт)\n•    Веб-сайт\n•    Проект управления семейным бюджетом\n•    Платформа подключения к банкам (по желанию клиента)\n•    Связь с клиентами и личная страница\n•    Руководства и видео\n•    Система информации и управления версиями ПО\n•    Календарь напоминаний для нужд системы и личных нужд\n•    Система биллинга\n•    Использование системы, управление и обслуживание (закрыто для клиента)' },
  ],
  de: [
    { heading: '', body: 'KeyClick dient als Marketing-Frontend für intelligente Technologie – ein Tor zu einer Sammlung digitaler Werkzeuge, die der breiten Öffentlichkeit in verschiedenen Bereichen des Alltags dienen sollen, aus dem Wunsch heraus, hochwertige technologische Lösungen – die normalerweise technisches Vorwissen erfordern – für jeden zugänglich zu machen, unabhängig vom Grad seiner Vertrautheit mit Computern.\nDas Projekt basiert auf einer modernen, professionellen Website mit hoher Leistung und maximaler Effizienz. Verwaltung von Lizenzen, Benutzern und Abrechnung. Vollständige Integrationsfähigkeit mit Anwendungen in verschiedenen Programmiersprachen, volle Flexibilität für zukünftige Entwicklung und eine Plattform für den Zugriff auf Bankkonten. Die Website befindet sich in ständiger Weiterentwicklung.\nDie zentrale Idee hinter KeyClick ist Einfachheit. Freier Zugang zur Website, Browsen, Lesen der Hilfematerialien und Ansehen von Videos kostenlos.' },
    { heading: 'Landingpage', body: '•    Die Landingpage ist das Eingangstor zum KeyClick-Projekt. Sie ermöglicht ein schnelles Kennenlernen und den Einstieg in die Website. Ihre Bestandteile sind:\n•    Vorstellung der Plattform\n•    Eine Reihe von 11 Flaggen zur Auswahl der Systemsprache\n•    Eine Reihe von Marketing-Karten zur Darstellung der Funktionen\n•    Direkter Zugang zur Website selbst.' },
    { heading: 'Bestandteile der Website', body: '•    Landingpage (Präsentation des Projekts und Einstieg in die Website)\n•    Website\n•    Projekt zur Verwaltung des Haushaltsbudgets\n•    Plattform zur Bankverbindung (optional für den Kunden)\n•    Kundenbeziehungen und persönliche Seite\n•    Anleitungen und Videos\n•    Informations- und Softwareversionsverwaltungssystem\n•    Erinnerungskalender für Systemnutzung und private Bedürfnisse\n•    Abrechnungssystem\n•    Systemnutzung, Verwaltung und Wartung (für den Kunden gesperrt)' },
  ],
  fr: [
    { heading: '', body: "KeyClick sert de vitrine marketing pour une technologie intelligente — une porte d'entrée vers une collection d'outils numériques destinés à servir le grand public dans divers domaines de la vie quotidienne, dans le but de rendre accessibles à tous, quel que soit leur niveau de familiarité avec les ordinateurs, des solutions technologiques de qualité — qui nécessitent généralement des connaissances techniques préalables.\nLe projet repose sur un site web moderne et professionnel, offrant des performances élevées et une efficacité maximale. Gestion des licences, des utilisateurs et de la facturation. Capacité d'intégration complète avec des applications dans divers langages de programmation, flexibilité totale pour le développement futur, et une plateforme d'accès aux comptes bancaires. Le site est en constante évolution.\nL'idée centrale derrière KeyClick est la simplicité. Accès libre au site, navigation, lecture des documents d'aide et visionnage de vidéos, gratuitement." },
    { heading: "Page d'atterrissage", body: "•    La page d'atterrissage est la porte d'entrée du projet KeyClick. Elle permet une prise de contact rapide et l'accès au site. Ses composants sont :\n•    Présentation de la plateforme\n•    Une rangée de 11 drapeaux pour choisir la langue du système\n•    Une rangée de cartes marketing présentant les fonctionnalités\n•    Accès direct au site lui-même." },
    { heading: 'Composants du site', body: "•    Page d'atterrissage (présentation du projet et accès au site)\n•    Site web\n•    Projet de gestion du budget familial\n•    Plateforme de connexion bancaire (en option pour le client)\n•    Relations clients et page personnelle\n•    Guides et vidéos\n•    Système d'information et de gestion des versions logicielles\n•    Calendrier de rappels pour les besoins du système et les besoins privés\n•    Système de facturation\n•    Utilisation du système, gestion et maintenance (verrouillé pour le client)" },
  ],
  es: [
    { heading: '', body: 'KeyClick funciona como el frente de marketing de la tecnología inteligente: una puerta de entrada a una colección de herramientas digitales destinadas a servir al público en general en diversas áreas de la vida cotidiana, con el deseo de hacer accesibles a cualquier persona, independientemente de su nivel de familiaridad con los ordenadores, soluciones tecnológicas de calidad que normalmente requieren conocimientos técnicos previos.\nEl proyecto está construido sobre un sitio web moderno y profesional, con un alto rendimiento y una eficiencia máxima. Gestión de licencias, usuarios y facturación. Capacidad de integración completa con aplicaciones en diversos lenguajes de programación, plena flexibilidad para el desarrollo futuro y una plataforma para acceder a cuentas bancarias. El sitio está en constante evolución.\nLa idea central detrás de KeyClick es la simplicidad. Entrada libre al sitio, navegación, lectura de los materiales de ayuda y visualización de vídeos, sin coste alguno.' },
    { heading: 'Página de aterrizaje', body: '•    La página de aterrizaje es la puerta de entrada al proyecto KeyClick. Permite un conocimiento rápido y el acceso al sitio. Sus componentes son:\n•    Presentación de la plataforma\n•    Una fila de 11 banderas para elegir el idioma del sistema\n•    Una fila de tarjetas de marketing que presentan las capacidades\n•    Acceso directo al propio sitio.' },
    { heading: 'Componentes del sitio', body: '•    Página de aterrizaje (presentación del proyecto y acceso al sitio)\n•    Sitio web\n•    Proyecto de gestión del presupuesto familiar\n•    Plataforma de conexión con bancos (opcional para el cliente)\n•    Relaciones con el cliente y página personal\n•    Guías y vídeos\n•    Sistema de información y gestión de versiones de software\n•    Calendario de recordatorios para uso del sistema y necesidades privadas\n•    Sistema de facturación\n•    Uso del sistema, gestión y mantenimiento (bloqueado para el cliente)' },
  ],
  ja: [
    { heading: '', body: 'KeyClickは、スマートテクノロジーのマーケティングフロントとして機能します。日常生活のさまざまな分野で一般の人々に役立つデジタルツールのコレクションへの入り口であり、通常は事前の技術知識を必要とする質の高い技術的ソリューションを、コンピューターへの習熟度に関係なく、誰もが利用できるようにしたいという思いから生まれました。\nこのプロジェクトは、高いパフォーマンスと最大限の効率性を備えた、モダンでプロフェッショナルなウェブサイトの上に構築されています。ライセンス、ユーザー、決済の管理。さまざまなプログラミング言語のアプリケーションとの完全な統合機能、将来の開発への完全な柔軟性、銀行口座へのアクセスのためのプラットフォーム。ウェブサイトは常に進化し続けています。\nKeyClickの背後にある中心的な考え方はシンプルさです。ウェブサイトへの自由なアクセス、閲覧、ガイド資料の閲覧、動画の視聴が無料です。' },
    { heading: 'ランディングページ', body: '•    ランディングページはKeyClickプロジェクトへの入り口です。サイトへの素早い理解と入場を可能にします。その構成要素は次のとおりです：\n•    プラットフォームの紹介\n•    システム言語を選択するための11の国旗の列\n•    機能を紹介するマーケティングカードの列\n•    ウェブサイト自体への直接アクセス。' },
    { heading: 'サイトの構成要素', body: '•    ランディングページ（プロジェクトの紹介とサイトへの入場）\n•    ウェブサイト\n•    家計管理プロジェクト\n•    銀行接続プラットフォーム（顧客のオプション）\n•    顧客関係と個人ページ\n•    ガイドと動画\n•    情報およびソフトウェアバージョン管理システム\n•    システム利用とプライベートなニーズのためのリマインダーカレンダー\n•    決済システム\n•    システム利用、管理およびメンテナンス（顧客にはロック）' },
  ],
  ar: [
    { heading: '', body: 'يُستخدم KeyClick كواجهة تسويقية للتكنولوجيا الذكية — بوابة دخول إلى مجموعة من الأدوات الرقمية المخصصة لخدمة الجمهور العام في مجالات متنوعة من الحياة اليومية، انطلاقًا من الرغبة في إتاحة حلول تكنولوجية عالية الجودة — عادةً ما تتطلب معرفة تقنية مسبقة — لكل شخص، بغض النظر عن مستوى إلمامه بالحواسيب.\nالمشروع مبني على موقع إنترنت حديث واحترافي، بأداء عالٍ وأقصى كفاءة لمحركات البحث. إدارة التراخيص والمستخدمين والفوترة. قدرة تكامل كاملة مع تطبيقات بلغات برمجة مختلفة، ومرونة كاملة للتطوير المستقبلي، ومنصة للوصول إلى الحسابات المصرفية. الموقع في تطور مستمر دائمًا.\nالفكرة المركزية وراء KeyClick هي البساطة. دخول حر إلى الموقع، تصفح، قراءة مواد المساعدة ومشاهدة الفيديوهات دون أي تكلفة.' },
    { heading: 'صفحة الهبوط', body: '•    صفحة الهبوط هي بوابة الدخول إلى مشروع KeyClick. تتيح تعرفًا سريعًا ودخولًا إلى الموقع. مكوناتها هي:\n•    عرض المنصة\n•    صف من 11 علمًا لاختيار لغة النظام\n•    صف من البطاقات التسويقية لعرض القدرات\n•    وصول مباشر إلى الموقع نفسه.' },
    { heading: 'مكونات الموقع', body: '•    صفحة الهبوط (عرض المشروع والدخول إلى الموقع)\n•    موقع الإنترنت\n•    مشروع إدارة ميزانية المنزل\n•    منصة الاتصال بالبنوك (اختيارية للعميل)\n•    علاقات العملاء والصفحة الشخصية\n•    الأدلة والفيديوهات\n•    نظام المعلومات وإدارة إصدارات البرمجيات\n•    تقويم تذكيرات لاستخدام النظام والاحتياجات الخاصة\n•    نظام الفوترة\n•    استخدام النظام، الإدارة والصيانة (مقفل أمام العميل)' },
  ],
  zh: [
    { heading: '', body: 'KeyClick 是智能科技的营销门户——通向一系列数字工具的入口，旨在服务日常生活各个领域的广大公众，出于让每个人都能使用高质量科技解决方案（这些解决方案通常需要事先的技术知识）的愿望，无论其对电脑的熟悉程度如何。\n该项目建立在一个现代、专业的网站之上，具有高性能和最高效率。许可证、用户和账单管理。能够与各种编程语言的应用程序完全集成，为未来发展提供充分的灵活性，并提供访问银行账户的平台。网站始终处于不断发展之中。\nKeyClick 背后的核心理念是简单。免费进入网站、浏览、阅读帮助资料和观看视频。' },
    { heading: '着陆页', body: '•    着陆页是 KeyClick 项目的入口。它使您能够快速了解并进入网站。其组成部分包括：\n•    平台展示\n•    一排 11 面旗帜，用于选择系统语言\n•    一排展示功能的营销卡片\n•    直接访问网站本身。' },
    { heading: '网站组成部分', body: '•    着陆页（项目展示与进入网站）\n•    网站\n•    家庭预算管理项目\n•    银行连接平台（客户可选）\n•    客户关系与个人页面\n•    指南与视频\n•    信息及软件版本管理系统\n•    用于系统使用及个人需求的提醒日历\n•    结算系统\n•    系统使用、管理与维护（对客户锁定）' },
  ],
  it: [
    { heading: '', body: "KeyClick funge da vetrina di marketing per la tecnologia intelligente — una porta d'accesso a una raccolta di strumenti digitali destinati a servire il grande pubblico in diversi ambiti della vita quotidiana, nel desiderio di rendere accessibili a chiunque, indipendentemente dal proprio livello di familiarità con i computer, soluzioni tecnologiche di qualità che solitamente richiedono conoscenze tecniche preliminari.\nIl progetto è costruito su un sito web moderno e professionale, con prestazioni elevate e un'efficienza massima. Gestione di licenze, utenti e fatturazione. Piena capacità di integrazione con applicazioni in diversi linguaggi di programmazione, piena flessibilità per lo sviluppo futuro e una piattaforma per l'accesso ai conti bancari. Il sito è in continua evoluzione.\nL'idea centrale alla base di KeyClick è la semplicità. Accesso libero al sito, navigazione, lettura dei materiali guida e visione di video, gratuitamente." },
    { heading: 'Pagina di destinazione', body: "•    La pagina di destinazione è la porta d'ingresso al progetto KeyClick. Consente una rapida presa di contatto e l'accesso al sito. I suoi componenti sono:\n•    Presentazione della piattaforma\n•    Una fila di 11 bandiere per selezionare la lingua del sistema\n•    Una fila di schede di marketing che presentano le funzionalità\n•    Accesso diretto al sito stesso." },
    { heading: 'Componenti del sito', body: '•    Pagina di destinazione (presentazione del progetto e accesso al sito)\n•    Sito web\n•    Progetto di gestione del bilancio familiare\n•    Piattaforma di connessione bancaria (opzionale per il cliente)\n•    Relazioni con i clienti e pagina personale\n•    Guide e video\n•    Sistema di informazione e gestione delle versioni software\n•    Calendario di promemoria per l\'uso del sistema e necessità private\n•    Sistema di fatturazione\n•    Uso del sistema, gestione e manutenzione (bloccato per il cliente)' },
  ],
  hi: [
    { heading: '', body: 'KeyClick स्मार्ट तकनीक के लिए एक मार्केटिंग फ्रंट के रूप में कार्य करता है — डिजिटल टूल्स के एक संग्रह का प्रवेश द्वार, जो रोज़मर्रा की ज़िंदगी के विभिन्न क्षेत्रों में आम जनता की सेवा के लिए बनाया गया है, इस इच्छा से कि उच्च-गुणवत्ता वाले तकनीकी समाधान — जिनके लिए आमतौर पर पूर्व तकनीकी ज्ञान की आवश्यकता होती है — कंप्यूटर से परिचय के स्तर की परवाह किए बिना, हर व्यक्ति के लिए सुलभ हों।\nयह प्रोजेक्ट एक आधुनिक, पेशेवर वेबसाइट पर बना है, जिसमें उच्च प्रदर्शन और अधिकतम दक्षता है। लाइसेंस, उपयोगकर्ता और बिलिंग प्रबंधन। विभिन्न प्रोग्रामिंग भाषाओं में एप्लिकेशन के साथ पूर्ण एकीकरण क्षमता, भविष्य के विकास के लिए पूरी लचीलापन, और बैंक खातों तक पहुंचने के लिए एक प्लेटफ़ॉर्म। वेबसाइट हमेशा निरंतर विकसित हो रही है।\nKeyClick के पीछे का मुख्य विचार सरलता है। वेबसाइट में मुफ़्त प्रवेश, ब्राउज़िंग, सहायता सामग्री पढ़ना और वीडियो देखना, बिना किसी लागत के।' },
    { heading: 'लैंडिंग पेज', body: '•    लैंडिंग पेज KeyClick प्रोजेक्ट का प्रवेश द्वार है। यह वेबसाइट से त्वरित परिचय और प्रवेश की अनुमति देता है। इसके घटक हैं:\n•    प्लेटफ़ॉर्म की प्रस्तुति\n•    सिस्टम की भाषा चुनने के लिए 11 झंडों की एक पंक्ति\n•    क्षमताओं को प्रस्तुत करने वाले मार्केटिंग कार्ड्स की एक पंक्ति\n•    वेबसाइट तक सीधी पहुंच।' },
    { heading: 'वेबसाइट के घटक', body: '•    लैंडिंग पेज (प्रोजेक्ट की प्रस्तुति और वेबसाइट में प्रवेश)\n•    वेबसाइट\n•    गृह बजट प्रबंधन प्रोजेक्ट\n•    बैंक कनेक्शन प्लेटफ़ॉर्म (ग्राहक के लिए वैकल्पिक)\n•    ग्राहक संबंध और व्यक्तिगत पेज\n•    गाइड और वीडियो\n•    सूचना एवं सॉफ़्टवेयर संस्करण प्रबंधन प्रणाली\n•    सिस्टम उपयोग और निजी आवश्यकताओं के लिए रिमाइंडर कैलेंडर\n•    बिलिंग प्रणाली\n•    सिस्टम का उपयोग, प्रबंधन और रखरखाव (ग्राहक के लिए लॉक)' },
  ],
}

const SITE_GUIDE_SECTIONS: Record<string, GuideSection[]> = {
  he: [
    { heading: 'דף הנחיתה', body: 'נכנסת לדף הנחיתה, בחרת שפה, ראית, קראת ואהבת את דף הנחיתה... הגיע הזמן לצלול לאתר.\nלחץ על התווית: כניסה לאתר KeyClick' },
    { heading: 'דף הבית KeyClick', body: 'לחצת? זהו אתה באתר. גליל עם ברכת כניסה ודגל השפה מתגלים לפניך.\nהשפה לא מתאימה ? בחר 1 מתוך 11 הדגלים בראש האתר ותועבר מידית לשפה הנבחרת. מערכת ריבוי השפות הוא אחד מיחידות הבסיס של האתר ומוצריו. ניתן בכל עת לעבור מידית משפה לשפה.' },
    { heading: 'לוח הבקרה', body: 'מבט ימינה מביא אותנו ללוח בקרה של האתר.\nחלק מהפקדים בשלב זה יכללו סרט אדום אשר בו תהיה המילה: נעול". הנעילה נועדה לשמור על פרטיותך. כניסה מאובטחת לפרויקט תשחרר את הנעילה לשימוש חופשי.\nללקוחות חדשים מומלץ ללחוץ על התווית מדריכים וסרטונים.' },
    { heading: 'שימוש חופשי ללא הרשמה', body: 'הפקדים הלא נעולים, כגון: מדריכים וסרטונים, משוב, דף אישי, תזכורות מאפשרים שימוש חופשי ללא צורך בהרשמה.\nעברת על המדריכים והסרטונים וברצונך להתחיל להנות מניהול תקציב בית חכם, לחץ על כפתור הכניסה ובצע רישום מהיר.' },
    { heading: 'כניסה ורישום', body: 'לקוח רשום - אם הנך כבר רשום במערכת, הכנס שם ומשפחה, כתובת מייל, סיסמא.\nבמידה ומתגלות שגיאות או חוסר התאמה בפרטים שהזנת, תקבל הודעה: לקוח לא קיים.\nיש לציין, למען פרטיותך, לא ניתן להיכנס ממחשב אחר, אשר אינו המחשב שביצעת בו את ההרשמה הראשונית. במידה וכבר נרשמת במחשב אחר, תקבל הודעה מתאימה.\nלקוח חדש – לחץ על כניסה ובחר הרשמה.\nכעת מתחיל תהליך קצר של רישום ובחירת תכנית מותאמת אישית.\nבשלב של תקופת הרצה ותקופת ניסיון, השימוש הוא חינם ללא עלות. בתום תקופת ההרצה תצא הודעה מתאימה ללקוחות.\nתהליך הרישום כולל ביצוע הורדה והתקנה של אפליקציית ניהול תקציב בית.\nאם האפליקציה עדיין לא מותקנת, יחל תהליך של התקנה. עקוב אחר הנחיות ההתקנה, בחירת מקום ההורדה של תוכנת ההתקנה ולאחר ההורדה הפעלת קובץ ההתקנה.' },
    { heading: 'חבילות שימוש במערכת', body: 'בתום תקופת ההרצה או תקופת הניסיון , קיבלת על כך הודעת מערכת, גמרת תקופת השימוש החינמי ומגיע הזמן לבחור תכנית חבילת שימוש. לחץ על תווית דף אישי, לחץ על תווית השינוי וייפתח טופס שינוי תכנית.\nקיימות 3 תכניות ממומנות: מנוי שנתי, מנוי חודשי, מנוי לפי שימוש.' },
    { heading: 'דף אישי', body: 'הדף האישי שלך יכיל את הפרטים האישיים הבסיסיים שלך וכן את תכנית הרכישה המועדפת שבחרת, כולל התקופה, זמן התחלה וזמן סיום.\nלבחירת תכנית רכישה מתאימה בחר על כפתור השינוי בדף האישי. לאחר הבחירה לחץ על כפתור עדכן.' },
    { heading: 'תזכורות', body: 'בחרת תכנית רכישה, זמן ההתחלה וזמן הסיום נטענים מיד ליומן מובנה.\nלהצגת היומן לחץ על מתג תזכורות בפאנל הבקרה.\nיש לך צורך בתזכורות פרטיות כלשהן, יומן התזכורות הזה יכול גם לשמש צרכים פרטיים.\nהתזכורת מפעילה התראות הבאות. כל כניסה לאתר תוצג תזכורת אשר הגיעה זמנה.' },
    { heading: 'משוב', body: 'גלשת באתר, הפעלת אפליקציות ויש לך רצון להחליף כמה מילים עם המערכת, בכל נושא, בכל בעיה או סתם בא לך לשלוח משוב. לחץ על התווית משוב.\nברצונך לפתוח שיחה חדשה, לחץ על הודעה חדשה בראש הדף ורשום את הודעתך בסעיף: דבר הלקוח.\nהדף כולל גם את הודעת המערכת, אשר מכניס אותך לעניינים ומציג לך חדשות חמות.\nאם אהבת או חלילה לא כל כך את הפרויקט, לפניך שתי שורות של דירוג: דרוג האתר ודירוג ניהול תקציב בית.\nסיימת לדרג, זהו, לחץ לשליחה.\nשים לב שלכל הודעה יש סימוכין, שמשמת כחותמת ייחודית לכל הודעה, דבר המקל על ניהול ההודעות והשיוך של התשובות מהמערכת.\nבעמוד המשוב נוצרת טבלת הודעות ויש באפשרותך הודעות קודמות.\nתשובת המערכת תתוסף להודעה ששלחת במקומה המיועד בתחתית הדף.\nכל תשובה של המערכת שמורה באותו הטופס בסעיף תשובת המערכת.\nלהודעה נוספת אתה צריך ללחוץ על כפתור הודעה חדשה. כל הודעה בטופס חדש.' },
    { heading: 'עדכונים', body: 'בלחיצה על לשונית העדכונים תוצג טבלה המכילה את היסטוריית הגרסאות של האתר ומוצריו. לכל גרסה יש מספר, תאריך עדכון וכן כותרת המתארת את מהות העדכון.\nבכל שדרוג תתווסף שורה חדשה עם הגרסה החדשה והלקוח יקבל הודעה בהתאם.' },
    { heading: 'ניהול תקציב בית M Finance', body: 'אפליקציית ניהול תקציב בית היא גולת הכותרת של הפרויקט. הסבר מלא ופורט תוכל לקרוא במגירת המסמכים 4,5,6 במדריכים וסרטונים.\nבאמצעות האפליקציה תקבל מבט כולל על הפעולות הבנקאיות שלך, הכנסות והוצאות, מאזן חודשי ושנתי. תוכל להוסיף ולתכנן הוצאות או הכנסות עתידיות, בפריסת תשלומים חכמה.\nלחצת על מתג ניהול תקציב בית בפאנל הבקרה, יפתח שער האפליקציה, דף הדומה לשער האתר KeyClick, עם ברכת כניסה בשפה שבחרת.\nהאפליקציה קוראת קבצי חשבונות בנק וכרטיסי אשראי אשר הורדת מבעוד מועד מחשבונך במוסד פיננסי ועורכת ניתוח מעמיק לפעולות הבנקאיות בדפים אלה.\nשרותים בנקאיים אשר מתוארים בהמשך, יכולים לסייע לך בהורדת הקבצים מחשבונך אל המחשב, או טעינה ישירה אל האפליקציה.\nיכולות האפליקציה למגוון תצוגות בחתכים שונים ובזמנים שונים, כולל הצגות גרפיות פרטניות.\nוהנה הדובדובן שבקצפת – עוגת תקציב חיה. ההוצאות מוצגות כפרוסות בתוך עוגת ההכנסות. מנגנון חכם מאפשר לך לשנות את ערכי הפרוסות עד לקבלת מאזן.' },
    { heading: 'שירותים בנקאיים', body: 'התחלת להשתמש בתקציב ניהול בית ובא לך לקצר תהליכים, בפניך 2 אפשרויות נוספות:\n-    הורדה אוטומטית של קבצים של דפי חשבון למחשבך,\n-    הורדה אוטומטית של קבצים של דפי חשבון ישורות לאפליקציית ניהול תקציב בית.\nההתחברות למוסד הפיננסי שלך תתבצע על ידך בלבד, התחברות רגילה כפי שאתה נוהג תמיד, על פי הגדרת הבטחון הנהוגה במוסד זה. מיד לאחר הורדת הקבצים נועלים ומתנתקים.\nבתהליך בחירת המוסד אליו ברצונך להתחבר, תגיע למפת מוסדות פיננסיים בפריסה בינלאומית. יתכן וחלק מהמוסדות עדיין לא זמינים להתקשרות. נודה לך אם תיידע את המערכת בשליחת משוב בעניין זה.\nהשירות כולל חוויית התנסות בסביבה טכנולוגית מתקדמת.' },
  ],
  en: [
    { heading: 'Landing Page', body: "You entered the landing page, chose a language, saw, read and liked the landing page... it's time to dive into the website.\nClick the label: Enter the KeyClick website" },
    { heading: 'KeyClick Home Page', body: "Clicked? That's it, you're on the website. A scroll with a welcome greeting and the language flag appear before you.\nLanguage not suitable? Choose 1 of the 11 flags at the top of the site and you'll be switched instantly to the chosen language. The multi-language system is one of the basic units of the site and its products. You can switch instantly between languages at any time." },
    { heading: 'Control Panel', body: 'A glance to the right brings us to the site\'s control panel.\nSome of the controls at this stage will include a red ribbon with the word: "Locked". The lock is meant to protect your privacy. A secure login to the project will release the lock for free use.\nNew customers are recommended to click the Guides and Videos label.' },
    { heading: 'Free Use Without Registration', body: 'The unlocked controls, such as: Guides and Videos, Feedback, Personal Page, Reminders, allow free use without the need to register.\nWent over the guides and videos and want to start enjoying smart home budget management? Click the login button and perform a quick registration.' },
    { heading: 'Login and Registration', body: 'Registered customer - if you are already registered in the system, enter first and last name, email address, password.\nIf errors or a mismatch are found in the details you entered, you will receive the message: Customer not found.\nPlease note, for your privacy, you cannot log in from a different computer than the one on which you performed the initial registration. If you have already registered on another computer, you will receive an appropriate message.\nNew customer – click login and choose register.\nA short process of registration and choosing a personalized plan now begins.\nDuring the launch period and trial period, use is free of charge. At the end of the launch period, an appropriate notice will be sent to customers.\nThe registration process includes downloading and installing the home budget management application.\nIf the application is not yet installed, an installation process will begin. Follow the installation instructions, choose where to download the installation software, and after downloading, run the installation file.' },
    { heading: 'System Usage Packages', body: "At the end of the launch period or trial period, you received a system notice about it — your free usage period has ended and it's time to choose a usage package plan. Click the personal page label, click the change label, and a plan change form will open.\nThere are 3 paid plans: annual subscription, monthly subscription, pay-per-use subscription." },
    { heading: 'Personal Page', body: 'Your personal page will contain your basic personal details as well as the preferred purchase plan you chose, including the period, start time and end time.\nTo choose a suitable purchase plan, click the change button on the personal page. After choosing, click the update button.' },
    { heading: 'Reminders', body: 'Once you choose a purchase plan, the start time and end time are immediately loaded into a built-in calendar.\nTo display the calendar, click the reminders switch in the control panel.\nIf you need any private reminders, this reminders calendar can also serve private needs.\nThe reminder triggers upcoming notifications. Every entry to the website will display a reminder whose time has come.' },
    { heading: 'Feedback', body: 'You browsed the site, ran applications, and feel like exchanging a few words with the system — about any topic, any issue, or you simply feel like sending feedback. Click the Feedback label.\nWant to start a new conversation? Click New Message at the top of the page and write your message in the Customer\'s Message section.\nThe page also includes the system message, which brings you up to date and shows you the latest news.\nIf you loved the project, or unfortunately not so much, you\'ll find two rating rows in front of you: Website rating and Home Budget Management rating.\nFinished rating? That\'s it, click to send.\nNote that every message has a reference number, which serves as a unique stamp for each message, making it easier to manage messages and match replies from the system.\nOn the feedback page a table of messages is created, and you can view previous messages.\nThe system\'s reply will be added to the message you sent, in its designated place at the bottom of the page.\nEvery reply from the system is saved in the same form, in the System Reply section.\nFor another message, you need to click the New Message button. Each message in a new form.' },
    { heading: 'Updates', body: 'Clicking the updates tab will display a table containing the version history of the website and its products. Each version has a number, an update date, and a title describing the nature of the update.\nWith every upgrade, a new row is added with the new version, and the customer will receive a notice accordingly.' },
    { heading: 'Home Budget Management – M Finance', body: 'The home budget management application is the crown jewel of the project. A full, detailed explanation can be read in guide drawers 4, 5, 6 in Guides and Videos.\nThrough the application you get a complete view of your banking activity, income and expenses, monthly and annual balance. You can also add and plan future expenses or income, with smart payment scheduling.\nClicked the home budget management switch in the control panel? The application gate will open — a page similar to the KeyClick website gate, with a welcome greeting in the language you chose.\nThe application reads bank account and credit card files that you downloaded in advance from your account at a financial institution, and performs an in-depth analysis of the banking activity in those files.\nBanking services, described later, can help you download the files from your account to your computer, or load them directly into the application.\nThe application offers a variety of views, in different breakdowns and time periods, including individual graphic displays.\nAnd here\'s the cherry on top – a live budget cake. Expenses are shown as slices inside the income cake. A smart mechanism lets you change the slice values until you reach a balance.' },
    { heading: 'Banking Services', body: 'Started using home budget management and want to shorten processes? You have 2 additional options:\n-    Automatic download of account statement files to your computer,\n-    Automatic download of account statement files directly into the home budget management application.\nThe connection to your financial institution is carried out by you alone, a regular login exactly as you always do, according to the security settings used by that institution. Immediately after downloading the files, it locks and disconnects.\nWhen choosing the institution you want to connect to, you will reach a map of financial institutions with international coverage. Some institutions may not yet be available for connection. We would appreciate it if you let us know via feedback about this.\nThe service includes an experience in an advanced technological environment.' },
  ],
  ru: [
    { heading: 'Целевая страница', body: 'Вы зашли на целевую страницу, выбрали язык, увидели, прочитали и вам понравилась целевая страница... пришло время погрузиться в сайт.\nНажмите на надпись: Вход на сайт KeyClick' },
    { heading: 'Главная страница KeyClick', body: 'Нажали? Вот и всё, вы на сайте. Перед вами появляется свиток с приветствием и флагом языка.\nЯзык не подходит? Выберите 1 из 11 флагов в верхней части сайта, и вы будете немедленно переключены на выбранный язык. Многоязычная система — одна из базовых составляющих сайта и его продуктов. В любой момент можно мгновенно переключаться между языками.' },
    { heading: 'Панель управления', body: 'Взгляд направо приводит нас к панели управления сайтом.\nЧасть элементов управления на этом этапе будет иметь красную ленту со словом: "Заблокировано". Блокировка предназначена для защиты вашей конфиденциальности. Безопасный вход в проект снимет блокировку для свободного использования.\nНовым клиентам рекомендуется нажать на надпись «Руководства и видео».' },
    { heading: 'Свободное использование без регистрации', body: 'Незаблокированные элементы управления, такие как: руководства и видео, обратная связь, личная страница, напоминания — позволяют свободно пользоваться сайтом без необходимости регистрации.\nПросмотрели руководства и видео и хотите начать пользоваться умным управлением семейным бюджетом? Нажмите на кнопку входа и выполните быструю регистрацию.' },
    { heading: 'Вход и регистрация', body: 'Зарегистрированный клиент — если вы уже зарегистрированы в системе, введите имя и фамилию, адрес электронной почты, пароль.\nЕсли обнаружены ошибки или несоответствия во введённых данных, вы получите сообщение: Клиент не найден.\nОбратите внимание, что в целях защиты вашей конфиденциальности нельзя войти с другого компьютера, кроме того, на котором вы выполнили первоначальную регистрацию. Если вы уже зарегистрировались на другом компьютере, вы получите соответствующее сообщение.\nНовый клиент – нажмите «Вход» и выберите «Регистрация».\nТеперь начинается короткий процесс регистрации и выбора индивидуального плана.\nНа этапе пробного и ознакомительного периода использование бесплатно, без какой-либо платы. По окончании пробного периода клиентам будет отправлено соответствующее уведомление.\nПроцесс регистрации включает скачивание и установку приложения для управления семейным бюджетом.\nЕсли приложение ещё не установлено, начнётся процесс установки. Следуйте инструкциям по установке, выберите место загрузки установочного файла, а после загрузки запустите файл установки.' },
    { heading: 'Пакеты использования системы', body: 'По окончании пробного или ознакомительного периода вы получите об этом системное уведомление — бесплатный период использования закончился, и пришло время выбрать план пакета использования. Нажмите на надпись «Личная страница», нажмите на надпись «Изменить», и откроется форма изменения плана.\nДоступны 3 платных плана: годовая подписка, ежемесячная подписка, подписка по факту использования.' },
    { heading: 'Личная страница', body: 'Ваша личная страница будет содержать ваши основные личные данные, а также выбранный вами предпочтительный план покупки, включая период, время начала и время окончания.\nЧтобы выбрать подходящий план покупки, нажмите кнопку «Изменить» на личной странице. После выбора нажмите кнопку «Обновить».' },
    { heading: 'Напоминания', body: 'После выбора плана покупки время начала и время окончания сразу же загружаются во встроенный календарь.\nЧтобы отобразить календарь, нажмите переключатель «Напоминания» на панели управления.\nЕсли вам нужны какие-либо личные напоминания, этот календарь напоминаний может также служить личным нуждам.\nНапоминание активирует предстоящие уведомления. При каждом входе на сайт будет отображаться напоминание, время которого наступило.' },
    { heading: 'Обратная связь', body: 'Вы просматривали сайт, запускали приложения, и у вас есть желание обменяться парой слов с системой — на любую тему, по любой проблеме, или просто хочется отправить отзыв. Нажмите на надпись «Обратная связь».\nХотите начать новый разговор? Нажмите «Новое сообщение» в верхней части страницы и напишите своё сообщение в разделе «Сообщение клиента».\nСтраница также включает системное сообщение, которое вводит вас в курс дела и показывает вам горячие новости.\nПонравился ли вам проект, или, к сожалению, не очень — перед вами две строки оценки: оценка сайта и оценка управления семейным бюджетом.\nЗакончили оценивать? Вот и всё, нажмите «Отправить».\nОбратите внимание, что у каждого сообщения есть номер ссылки, который служит уникальной меткой для каждого сообщения, что облегчает управление сообщениями и сопоставление ответов от системы.\nНа странице обратной связи создаётся таблица сообщений, и вы можете просматривать предыдущие сообщения.\nОтвет системы будет добавлен к отправленному вами сообщению, в предназначенном для этого месте внизу страницы.\nКаждый ответ системы сохраняется в той же форме, в разделе «Ответ системы».\nДля нового сообщения нужно нажать кнопку «Новое сообщение». Каждое сообщение — в новой форме.' },
    { heading: 'Обновления', body: 'При нажатии на вкладку обновлений отобразится таблица, содержащая историю версий сайта и его продуктов. У каждой версии есть номер, дата обновления и заголовок, описывающий суть обновления.\nПри каждом обновлении добавляется новая строка с новой версией, и клиент получит соответствующее уведомление.' },
    { heading: 'Управление семейным бюджетом M Finance', body: 'Приложение для управления семейным бюджетом — жемчужина проекта. Полное и подробное описание можно прочитать в разделах-ящиках 4, 5, 6 в «Руководствах и видео».\nС помощью приложения вы получите полный обзор ваших банковских операций, доходов и расходов, месячного и годового баланса. Вы также можете добавлять и планировать будущие расходы или доходы с умным распределением платежей.\nНажали переключатель «Управление семейным бюджетом» на панели управления? Откроются ворота приложения — страница, похожая на ворота сайта KeyClick, с приветствием на выбранном вами языке.\nПриложение считывает файлы банковских счетов и кредитных карт, которые вы заранее скачали со своего счёта в финансовом учреждении, и проводит углублённый анализ банковских операций в этих файлах.\nБанковские услуги, описанные далее, могут помочь вам загрузить файлы с вашего счёта на компьютер или напрямую в приложение.\nВозможности приложения включают разнообразные представления в разных разрезах и за разные периоды времени, включая индивидуальные графические отображения.\nА вот и вишенка на торте – живой бюджетный торт. Расходы отображаются в виде кусочков внутри торта доходов. Умный механизм позволяет вам изменять значения кусочков до достижения баланса.' },
    { heading: 'Банковские услуги', body: 'Начали пользоваться управлением семейным бюджетом и хотите сократить процессы? У вас есть 2 дополнительные возможности:\n-    Автоматическая загрузка файлов выписок по счетам на ваш компьютер,\n-    Автоматическая загрузка файлов выписок по счетам напрямую в приложение управления семейным бюджетом.\nПодключение к вашему финансовому учреждению осуществляется исключительно вами, обычный вход, как вы всегда это делаете, в соответствии с настройками безопасности, принятыми в этом учреждении. Сразу после загрузки файлов происходит блокировка и отключение.\nВ процессе выбора учреждения, к которому вы хотите подключиться, вы попадёте на карту финансовых учреждений с международным охватом. Некоторые учреждения могут быть пока недоступны для подключения. Будем благодарны, если вы сообщите об этом системе через обратную связь.\nУслуга включает опыт работы в передовой технологической среде.' },
  ],
  de: [
    { heading: 'Landingpage', body: 'Sie sind auf die Landingpage gelangt, haben eine Sprache gewählt, gesehen, gelesen und die Landingpage gefallen Ihnen... es ist Zeit, in die Website einzutauchen.\nKlicken Sie auf die Beschriftung: Zur KeyClick-Website' },
    { heading: 'KeyClick Startseite', body: 'Geklickt? Das war\'s, Sie sind auf der Website. Eine Schriftrolle mit Willkommensgruß und der Sprachflagge erscheint vor Ihnen.\nDie Sprache passt nicht? Wählen Sie 1 der 11 Flaggen oben auf der Seite, und Sie werden sofort zur gewählten Sprache gewechselt. Das Mehrsprachigkeitssystem ist eine der Grundeinheiten der Website und ihrer Produkte. Sie können jederzeit sofort zwischen den Sprachen wechseln.' },
    { heading: 'Bedienfeld', body: 'Ein Blick nach rechts bringt uns zum Bedienfeld der Website.\nEinige der Bedienelemente enthalten in dieser Phase ein rotes Band mit dem Wort: "Gesperrt". Die Sperre dient dem Schutz Ihrer Privatsphäre. Eine sichere Anmeldung beim Projekt hebt die Sperre für die freie Nutzung auf.\nNeuen Kunden wird empfohlen, auf die Beschriftung Anleitungen und Videos zu klicken.' },
    { heading: 'Freie Nutzung ohne Registrierung', body: 'Die nicht gesperrten Bedienelemente, wie: Anleitungen und Videos, Feedback, persönliche Seite, Erinnerungen, ermöglichen freie Nutzung ohne Registrierung.\nHaben Sie die Anleitungen und Videos durchgesehen und möchten Sie nun das intelligente Haushaltsbudget-Management genießen? Klicken Sie auf die Anmelde-Schaltfläche und führen Sie eine schnelle Registrierung durch.' },
    { heading: 'Anmeldung und Registrierung', body: 'Registrierter Kunde – wenn Sie bereits im System registriert sind, geben Sie Vor- und Nachname, E-Mail-Adresse und Passwort ein.\nWenn Fehler oder Abweichungen in Ihren Angaben festgestellt werden, erhalten Sie die Meldung: Kunde nicht gefunden.\nBitte beachten Sie, dass Sie sich zum Schutz Ihrer Privatsphäre nicht von einem anderen Computer als dem anmelden können, auf dem Sie die ursprüngliche Registrierung durchgeführt haben. Falls Sie sich bereits auf einem anderen Computer registriert haben, erhalten Sie eine entsprechende Meldung.\nNeuer Kunde – klicken Sie auf Anmelden und wählen Sie Registrieren.\nNun beginnt ein kurzer Prozess der Registrierung und der Auswahl eines individuell angepassten Plans.\nWährend der Einführungs- und Testphase ist die Nutzung kostenlos, ohne Kosten. Am Ende der Einführungsphase erhalten Kunden eine entsprechende Mitteilung.\nDer Registrierungsprozess umfasst das Herunterladen und Installieren der Haushaltsbudget-Anwendung.\nFalls die Anwendung noch nicht installiert ist, beginnt ein Installationsprozess. Folgen Sie den Installationsanweisungen, wählen Sie den Speicherort für die Installationssoftware, und führen Sie nach dem Download die Installationsdatei aus.' },
    { heading: 'Nutzungspakete des Systems', body: 'Am Ende der Einführungs- oder Testphase erhalten Sie eine entsprechende Systemmeldung – Ihre kostenlose Nutzungsphase ist beendet, und es ist Zeit, einen Nutzungspaket-Plan zu wählen. Klicken Sie auf die Beschriftung persönliche Seite, klicken Sie auf die Beschriftung Ändern, und ein Formular zur Planänderung öffnet sich.\nEs gibt 3 kostenpflichtige Pläne: Jahresabonnement, Monatsabonnement, nutzungsabhängiges Abonnement.' },
    { heading: 'Persönliche Seite', body: 'Ihre persönliche Seite enthält Ihre grundlegenden persönlichen Daten sowie den von Ihnen gewählten bevorzugten Kaufplan, einschließlich Zeitraum, Startzeit und Endzeit.\nUm einen passenden Kaufplan zu wählen, klicken Sie auf die Schaltfläche Ändern auf der persönlichen Seite. Klicken Sie nach der Auswahl auf die Schaltfläche Aktualisieren.' },
    { heading: 'Erinnerungen', body: 'Sobald Sie einen Kaufplan gewählt haben, werden Startzeit und Endzeit sofort in einen integrierten Kalender geladen.\nUm den Kalender anzuzeigen, klicken Sie auf den Erinnerungen-Schalter im Bedienfeld.\nWenn Sie irgendwelche privaten Erinnerungen benötigen, kann dieser Erinnerungskalender auch privaten Bedürfnissen dienen.\nDie Erinnerung löst bevorstehende Benachrichtigungen aus. Bei jedem Zugriff auf die Website wird eine fällige Erinnerung angezeigt.' },
    { heading: 'Feedback', body: 'Sie haben auf der Website gestöbert, Anwendungen gestartet und haben das Bedürfnis, ein paar Worte mit dem System zu wechseln – zu jedem Thema, jedem Problem, oder Sie möchten einfach nur Feedback senden. Klicken Sie auf die Beschriftung Feedback.\nMöchten Sie ein neues Gespräch beginnen? Klicken Sie oben auf der Seite auf Neue Nachricht und schreiben Sie Ihre Nachricht im Abschnitt Nachricht des Kunden.\nDie Seite enthält auch die Systemnachricht, die Sie auf den neuesten Stand bringt und Ihnen aktuelle Neuigkeiten zeigt.\nOb Sie das Projekt geliebt haben, oder leider nicht so sehr – vor Ihnen liegen zwei Bewertungszeilen: Bewertung der Website und Bewertung des Haushaltsbudget-Managements.\nMit der Bewertung fertig? Das war\'s, klicken Sie zum Senden.\nBeachten Sie, dass jede Nachricht eine Referenznummer hat, die als eindeutiger Stempel für jede Nachricht dient, was die Verwaltung der Nachrichten und die Zuordnung der Antworten des Systems erleichtert.\nAuf der Feedback-Seite wird eine Nachrichtentabelle erstellt, und Sie können vorherige Nachrichten einsehen.\nDie Antwort des Systems wird der von Ihnen gesendeten Nachricht an ihrem vorgesehenen Platz am unteren Rand der Seite hinzugefügt.\nJede Antwort des Systems wird im selben Formular im Abschnitt Systemantwort gespeichert.\nFür eine weitere Nachricht müssen Sie auf die Schaltfläche Neue Nachricht klicken. Jede Nachricht in einem neuen Formular.' },
    { heading: 'Updates', body: 'Durch Klicken auf den Reiter Updates wird eine Tabelle mit der Versionshistorie der Website und ihrer Produkte angezeigt. Jede Version hat eine Nummer, ein Aktualisierungsdatum sowie einen Titel, der das Wesen des Updates beschreibt.\nBei jedem Upgrade wird eine neue Zeile mit der neuen Version hinzugefügt, und der Kunde erhält eine entsprechende Benachrichtigung.' },
    { heading: 'Haushaltsbudget-Management M Finance', body: 'Die Anwendung zur Verwaltung des Haushaltsbudgets ist das Kronjuwel des Projekts. Eine vollständige und ausführliche Erklärung finden Sie in den Schubladen 4, 5, 6 unter Anleitungen und Videos.\nMit der Anwendung erhalten Sie einen umfassenden Überblick über Ihre Bankaktivitäten, Einnahmen und Ausgaben, Monats- und Jahresbilanz. Sie können auch zukünftige Ausgaben oder Einnahmen mit intelligenter Zahlungsplanung hinzufügen und planen.\nHaben Sie den Schalter Haushaltsbudget-Management im Bedienfeld angeklickt? Das Anwendungstor öffnet sich – eine Seite ähnlich dem Tor der KeyClick-Website, mit einem Willkommensgruß in der von Ihnen gewählten Sprache.\nDie Anwendung liest Bankkonto- und Kreditkartendateien, die Sie zuvor von Ihrem Konto bei einem Finanzinstitut heruntergeladen haben, und führt eine eingehende Analyse der Bankaktivitäten in diesen Dateien durch.\nDie im Folgenden beschriebenen Bankdienstleistungen können Ihnen helfen, die Dateien von Ihrem Konto auf den Computer herunterzuladen oder direkt in die Anwendung zu laden.\nDie Anwendung bietet vielfältige Ansichten in verschiedenen Aufschlüsselungen und Zeiträumen, einschließlich individueller grafischer Darstellungen.\nUnd hier ist die Sahnehäubchen – ein lebendiger Budgetkuchen. Ausgaben werden als Stücke innerhalb des Einnahmenkuchens dargestellt. Ein intelligenter Mechanismus lässt Sie die Stückwerte ändern, bis Sie eine Balance erreichen.' },
    { heading: 'Bankdienstleistungen', body: 'Haben Sie begonnen, das Haushaltsbudget-Management zu nutzen, und möchten Sie Prozesse verkürzen? Sie haben 2 zusätzliche Möglichkeiten:\n-    Automatischer Download von Kontoauszugsdateien auf Ihren Computer,\n-    Automatischer Download von Kontoauszugsdateien direkt in die Haushaltsbudget-Management-Anwendung.\nDie Verbindung zu Ihrem Finanzinstitut erfolgt ausschließlich durch Sie selbst, eine normale Anmeldung, wie Sie sie immer durchführen, gemäß den bei diesem Institut geltenden Sicherheitseinstellungen. Unmittelbar nach dem Herunterladen der Dateien wird gesperrt und getrennt.\nBei der Auswahl des Instituts, mit dem Sie sich verbinden möchten, gelangen Sie zu einer Karte der Finanzinstitute mit internationaler Abdeckung. Möglicherweise sind einige Institute noch nicht verbindungsfähig. Wir würden uns freuen, wenn Sie das System darüber per Feedback informieren.\nDer Dienst umfasst eine Erfahrung in einer fortschrittlichen technologischen Umgebung.' },
  ],
  fr: [
    { heading: "Page d'atterrissage", body: "Vous êtes arrivé sur la page d'atterrissage, avez choisi une langue, vu, lu et aimé la page d'atterrissage... il est temps de plonger dans le site.\nCliquez sur l'étiquette : Entrer sur le site KeyClick" },
    { heading: 'Page d\'accueil KeyClick', body: "Vous avez cliqué ? Voilà, vous êtes sur le site. Un parchemin avec un message de bienvenue et le drapeau de la langue apparaissent devant vous.\nLa langue ne convient pas ? Choisissez l'un des 11 drapeaux en haut du site et vous serez immédiatement transféré vers la langue choisie. Le système multilingue est l'une des unités de base du site et de ses produits. Vous pouvez passer instantanément d'une langue à l'autre à tout moment." },
    { heading: 'Panneau de contrôle', body: 'Un regard vers la droite nous amène au panneau de contrôle du site.\nCertaines des commandes à ce stade comporteront un ruban rouge portant le mot : "Verrouillé". Le verrouillage vise à protéger votre confidentialité. Une connexion sécurisée au projet libérera le verrouillage pour une utilisation libre.\nIl est recommandé aux nouveaux clients de cliquer sur l\'étiquette Guides et vidéos.' },
    { heading: 'Utilisation libre sans inscription', body: "Les commandes non verrouillées, telles que : guides et vidéos, retour d'information, page personnelle, rappels, permettent une utilisation libre sans nécessiter d'inscription.\nVous avez parcouru les guides et les vidéos et souhaitez profiter d'une gestion intelligente du budget familial ? Cliquez sur le bouton de connexion et effectuez une inscription rapide." },
    { heading: 'Connexion et inscription', body: "Client déjà inscrit - si vous êtes déjà inscrit dans le système, entrez votre nom et prénom, votre adresse e-mail, votre mot de passe.\nSi des erreurs ou des incohérences sont détectées dans les informations saisies, vous recevrez le message : Client introuvable.\nVeuillez noter que, pour protéger votre confidentialité, vous ne pouvez pas vous connecter depuis un autre ordinateur que celui sur lequel vous avez effectué l'inscription initiale. Si vous vous êtes déjà inscrit sur un autre ordinateur, vous recevrez un message approprié.\nNouveau client – cliquez sur connexion et choisissez inscription.\nUn court processus d'inscription et de choix d'un plan personnalisé commence alors.\nPendant la période de lancement et la période d'essai, l'utilisation est gratuite, sans frais. À la fin de la période de lancement, une notification appropriée sera envoyée aux clients.\nLe processus d'inscription comprend le téléchargement et l'installation de l'application de gestion du budget familial.\nSi l'application n'est pas encore installée, un processus d'installation commencera. Suivez les instructions d'installation, choisissez l'emplacement de téléchargement du logiciel d'installation, puis, après le téléchargement, exécutez le fichier d'installation." },
    { heading: "Forfaits d'utilisation du système", body: "À la fin de la période de lancement ou de la période d'essai, vous recevrez une notification système à ce sujet — votre période d'utilisation gratuite est terminée et il est temps de choisir un forfait d'utilisation. Cliquez sur l'étiquette page personnelle, cliquez sur l'étiquette modifier, et un formulaire de changement de plan s'ouvrira.\nIl existe 3 forfaits payants : abonnement annuel, abonnement mensuel, abonnement à l'usage." },
    { heading: 'Page personnelle', body: "Votre page personnelle contiendra vos informations personnelles de base ainsi que le plan d'achat préféré que vous avez choisi, y compris la période, l'heure de début et l'heure de fin.\nPour choisir un plan d'achat adapté, cliquez sur le bouton modifier sur la page personnelle. Après avoir choisi, cliquez sur le bouton mettre à jour." },
    { heading: 'Rappels', body: "Une fois le plan d'achat choisi, l'heure de début et l'heure de fin sont immédiatement chargées dans un calendrier intégré.\nPour afficher le calendrier, cliquez sur le commutateur rappels dans le panneau de contrôle.\nSi vous avez besoin de rappels privés, ce calendrier de rappels peut également servir des besoins privés.\nLe rappel déclenche des notifications à venir. Chaque entrée sur le site affichera un rappel dont l'heure est arrivée." },
    { heading: "Retour d'information", body: "Vous avez navigué sur le site, lancé des applications, et vous avez envie d'échanger quelques mots avec le système — sur n'importe quel sujet, n'importe quel problème, ou simplement envie d'envoyer un commentaire. Cliquez sur l'étiquette Retour d'information.\nVous souhaitez démarrer une nouvelle conversation ? Cliquez sur Nouveau message en haut de la page et rédigez votre message dans la section Message du client.\nLa page comprend également le message système, qui vous met au courant et vous montre les dernières actualités.\nQue vous ayez aimé le projet, ou malheureusement pas tant que ça, vous trouverez devant vous deux lignes d'évaluation : évaluation du site et évaluation de la gestion du budget familial.\nVous avez fini d'évaluer ? Voilà, cliquez pour envoyer.\nNotez que chaque message possède un numéro de référence, qui sert de cachet unique à chaque message, ce qui facilite la gestion des messages et l'association des réponses du système.\nSur la page de retour d'information, un tableau de messages est créé, et vous pouvez consulter les messages précédents.\nLa réponse du système sera ajoutée au message que vous avez envoyé, à l'emplacement prévu à cet effet en bas de la page.\nChaque réponse du système est enregistrée dans le même formulaire, dans la section Réponse du système.\nPour un autre message, vous devez cliquer sur le bouton Nouveau message. Chaque message dans un nouveau formulaire." },
    { heading: 'Mises à jour', body: "En cliquant sur l'onglet des mises à jour, un tableau contenant l'historique des versions du site et de ses produits s'affichera. Chaque version possède un numéro, une date de mise à jour ainsi qu'un titre décrivant la nature de la mise à jour.\nÀ chaque mise à niveau, une nouvelle ligne est ajoutée avec la nouvelle version, et le client recevra une notification en conséquence." },
    { heading: 'Gestion du budget familial M Finance', body: "L'application de gestion du budget familial est le fleuron du projet. Une explication complète et détaillée est disponible dans les tiroirs 4, 5, 6 de Guides et vidéos.\nGrâce à l'application, vous obtenez une vue d'ensemble de vos opérations bancaires, revenus et dépenses, solde mensuel et annuel. Vous pouvez également ajouter et planifier des dépenses ou des revenus futurs, avec une répartition intelligente des paiements.\nVous avez cliqué sur le commutateur gestion du budget familial dans le panneau de contrôle ? La porte de l'application s'ouvrira — une page semblable à la porte du site KeyClick, avec un message de bienvenue dans la langue que vous avez choisie.\nL'application lit les fichiers de comptes bancaires et de cartes de crédit que vous avez téléchargés au préalable depuis votre compte auprès d'un établissement financier, et effectue une analyse approfondie des opérations bancaires contenues dans ces fichiers.\nLes services bancaires décrits ci-après peuvent vous aider à télécharger les fichiers de votre compte vers l'ordinateur, ou à les charger directement dans l'application.\nL'application offre une variété d'affichages, selon différentes ventilations et périodes, y compris des représentations graphiques individuelles.\nEt voici la cerise sur le gâteau – un gâteau budgétaire vivant. Les dépenses sont représentées sous forme de parts à l'intérieur du gâteau des revenus. Un mécanisme intelligent vous permet de modifier les valeurs des parts jusqu'à obtenir un équilibre." },
    { heading: 'Services bancaires', body: "Vous avez commencé à utiliser la gestion du budget familial et souhaitez raccourcir les processus ? Vous avez 2 options supplémentaires :\n-    Téléchargement automatique des fichiers de relevés de compte sur votre ordinateur,\n-    Téléchargement automatique des fichiers de relevés de compte directement dans l'application de gestion du budget familial.\nLa connexion à votre établissement financier est effectuée uniquement par vous, une connexion normale comme vous le faites toujours, selon les paramètres de sécurité en vigueur dans cet établissement. Immédiatement après le téléchargement des fichiers, la connexion se verrouille et se déconnecte.\nLors du choix de l'établissement auquel vous souhaitez vous connecter, vous accéderez à une carte d'établissements financiers à couverture internationale. Certains établissements ne sont peut-être pas encore disponibles pour la connexion. Nous vous serions reconnaissants de bien vouloir en informer le système via un retour.\nLe service comprend une expérience dans un environnement technologique avancé." },
  ],
  es: [
    { heading: 'Página de aterrizaje', body: 'Entraste en la página de aterrizaje, elegiste un idioma, viste, leíste y te gustó la página de aterrizaje... ha llegado el momento de sumergirte en el sitio.\nHaz clic en la etiqueta: Entrar al sitio KeyClick' },
    { heading: 'Página de inicio de KeyClick', body: '¿Hiciste clic? Eso es todo, ya estás en el sitio. Ante ti aparecen un pergamino con un mensaje de bienvenida y la bandera del idioma.\n¿El idioma no es el adecuado? Elige 1 de las 11 banderas en la parte superior del sitio y serás trasladado de inmediato al idioma elegido. El sistema multilingüe es una de las unidades básicas del sitio y sus productos. Puedes cambiar de idioma de forma instantánea en cualquier momento.' },
    { heading: 'Panel de control', body: 'Una mirada hacia la derecha nos lleva al panel de control del sitio.\nAlgunos de los controles en esta etapa incluirán una cinta roja con la palabra: "Bloqueado". El bloqueo tiene como objetivo proteger tu privacidad. Un inicio de sesión seguro en el proyecto liberará el bloqueo para el uso libre.\nA los nuevos clientes se les recomienda hacer clic en la etiqueta Guías y vídeos.' },
    { heading: 'Uso libre sin registro', body: 'Los controles no bloqueados, como: guías y vídeos, comentarios, página personal, recordatorios, permiten el uso libre sin necesidad de registrarse.\n¿Has revisado las guías y los vídeos y quieres empezar a disfrutar de una gestión inteligente del presupuesto familiar? Haz clic en el botón de inicio de sesión y realiza un registro rápido.' },
    { heading: 'Inicio de sesión y registro', body: 'Cliente registrado - si ya estás registrado en el sistema, introduce nombre y apellidos, dirección de correo electrónico, contraseña.\nSi se detectan errores o discrepancias en los datos introducidos, recibirás el mensaje: Cliente no encontrado.\nCabe señalar que, para proteger tu privacidad, no puedes iniciar sesión desde un ordenador distinto de aquel en el que realizaste el registro inicial. Si ya te has registrado en otro ordenador, recibirás un mensaje correspondiente.\nCliente nuevo – haz clic en iniciar sesión y elige registro.\nAhora comienza un breve proceso de registro y elección de un plan personalizado.\nDurante el período de lanzamiento y el período de prueba, el uso es gratuito, sin coste alguno. Al finalizar el período de lanzamiento, se enviará un aviso adecuado a los clientes.\nEl proceso de registro incluye la descarga e instalación de la aplicación de gestión del presupuesto familiar.\nSi la aplicación aún no está instalada, comenzará un proceso de instalación. Sigue las instrucciones de instalación, elige la ubicación de descarga del software de instalación y, tras la descarga, ejecuta el archivo de instalación.' },
    { heading: 'Paquetes de uso del sistema', body: 'Al finalizar el período de lanzamiento o el período de prueba, recibirás un aviso del sistema al respecto: tu período de uso gratuito ha terminado y ha llegado el momento de elegir un plan de paquete de uso. Haz clic en la etiqueta página personal, haz clic en la etiqueta cambiar, y se abrirá un formulario de cambio de plan.\nExisten 3 planes de pago: suscripción anual, suscripción mensual, suscripción por uso.' },
    { heading: 'Página personal', body: 'Tu página personal contendrá tus datos personales básicos, así como el plan de compra preferido que hayas elegido, incluyendo el período, la hora de inicio y la hora de finalización.\nPara elegir un plan de compra adecuado, haz clic en el botón cambiar en la página personal. Después de elegir, haz clic en el botón actualizar.' },
    { heading: 'Recordatorios', body: 'Una vez elegido el plan de compra, la hora de inicio y la hora de finalización se cargan de inmediato en un calendario integrado.\nPara mostrar el calendario, haz clic en el interruptor de recordatorios en el panel de control.\nSi necesitas recordatorios privados, este calendario de recordatorios también puede servir para necesidades privadas.\nEl recordatorio activa notificaciones próximas. Cada entrada al sitio mostrará un recordatorio cuya hora haya llegado.' },
    { heading: 'Comentarios', body: 'Has navegado por el sitio, ejecutado aplicaciones y tienes ganas de intercambiar algunas palabras con el sistema, sobre cualquier tema, cualquier problema, o simplemente te apetece enviar un comentario. Haz clic en la etiqueta Comentarios.\n¿Quieres iniciar una nueva conversación? Haz clic en Nuevo mensaje en la parte superior de la página y escribe tu mensaje en la sección Mensaje del cliente.\nLa página también incluye el mensaje del sistema, que te pone al día y te muestra las últimas novedades.\nTanto si te encantó el proyecto como si, lamentablemente, no tanto, tienes ante ti dos líneas de valoración: valoración del sitio y valoración de la gestión del presupuesto familiar.\n¿Terminaste de valorar? Eso es todo, haz clic para enviar.\nTen en cuenta que cada mensaje tiene un número de referencia, que sirve como sello único para cada mensaje, lo que facilita la gestión de los mensajes y la vinculación de las respuestas del sistema.\nEn la página de comentarios se crea una tabla de mensajes, y puedes consultar mensajes anteriores.\nLa respuesta del sistema se añadirá al mensaje que enviaste, en el lugar designado en la parte inferior de la página.\nCada respuesta del sistema se guarda en el mismo formulario, en la sección Respuesta del sistema.\nPara otro mensaje, debes hacer clic en el botón Nuevo mensaje. Cada mensaje en un formulario nuevo.' },
    { heading: 'Actualizaciones', body: 'Al hacer clic en la pestaña de actualizaciones se mostrará una tabla que contiene el historial de versiones del sitio y sus productos. Cada versión tiene un número, una fecha de actualización y un título que describe la naturaleza de la actualización.\nEn cada actualización se añade una nueva fila con la nueva versión, y el cliente recibirá un aviso correspondiente.' },
    { heading: 'Gestión del presupuesto familiar M Finance', body: 'La aplicación de gestión del presupuesto familiar es la joya de la corona del proyecto. Puedes leer una explicación completa y detallada en los cajones 4, 5, 6 de Guías y vídeos.\nA través de la aplicación obtendrás una visión completa de tus operaciones bancarias, ingresos y gastos, saldo mensual y anual. También puedes añadir y planificar gastos o ingresos futuros, con una distribución inteligente de pagos.\n¿Hiciste clic en el interruptor de gestión del presupuesto familiar en el panel de control? Se abrirá la puerta de la aplicación, una página similar a la puerta del sitio KeyClick, con un mensaje de bienvenida en el idioma que elegiste.\nLa aplicación lee los archivos de cuentas bancarias y tarjetas de crédito que descargaste previamente de tu cuenta en una entidad financiera, y realiza un análisis en profundidad de las operaciones bancarias en esos archivos.\nLos servicios bancarios descritos a continuación pueden ayudarte a descargar los archivos de tu cuenta al ordenador, o cargarlos directamente en la aplicación.\nLa aplicación ofrece una variedad de vistas, en diferentes desgloses y períodos de tiempo, incluyendo representaciones gráficas individuales.\nY aquí está la guinda del pastel: una tarta de presupuesto en vivo. Los gastos se muestran como porciones dentro de la tarta de ingresos. Un mecanismo inteligente te permite cambiar los valores de las porciones hasta lograr un equilibrio.' },
    { heading: 'Servicios bancarios', body: '¿Has empezado a usar la gestión del presupuesto familiar y quieres acortar procesos? Tienes 2 opciones adicionales:\n-    Descarga automática de archivos de extractos de cuenta a tu ordenador,\n-    Descarga automática de archivos de extractos de cuenta directamente a la aplicación de gestión del presupuesto familiar.\nLa conexión con tu entidad financiera la realizas únicamente tú, un inicio de sesión normal como el que siempre haces, según la configuración de seguridad utilizada por dicha entidad. Inmediatamente después de descargar los archivos, se bloquea y se desconecta.\nEn el proceso de elegir la entidad a la que deseas conectarte, llegarás a un mapa de entidades financieras con cobertura internacional. Es posible que algunas entidades aún no estén disponibles para la conexión. Te agradeceríamos que informaras al sistema mediante un comentario al respecto.\nEl servicio incluye una experiencia en un entorno tecnológico avanzado.' },
  ],
  ja: [
    { heading: 'ランディングページ', body: 'ランディングページに入り、言語を選び、見て、読んで、ランディングページを気に入っていただけましたか…いよいよサイトに飛び込む時です。\nラベルをクリックしてください：KeyClickサイトに入る' },
    { heading: 'KeyClickホームページ', body: 'クリックしましたか？これでサイトに入りました。歓迎の挨拶と言語の国旗が付いた巻物が目の前に現れます。\n言語が合っていませんか？サイト上部の11の国旗のうち1つを選択すると、すぐに選択した言語に切り替わります。多言語システムは、サイトとその製品の基本ユニットの一つです。いつでも瞬時に言語を切り替えることができます。' },
    { heading: 'コントロールパネル', body: '右を見ると、サイトのコントロールパネルにたどり着きます。\nこの段階では、一部のコントロールに「ロック」という言葉が書かれた赤いリボンが付いています。このロックはお客様のプライバシーを保護するためのものです。プロジェクトへの安全なログインにより、ロックが解除され自由に利用できるようになります。\n新規のお客様は、ガイドと動画のラベルをクリックすることをお勧めします。' },
    { heading: '登録なしでの自由な利用', body: 'ロックされていないコントロール、例えばガイドと動画、フィードバック、個人ページ、リマインダーなどは、登録の必要なく自由に利用できます。\nガイドと動画を確認し、スマートな家計管理を楽しみ始めたいですか？ログインボタンをクリックして、簡単な登録を行ってください。' },
    { heading: 'ログインと登録', body: '既存のお客様 - すでにシステムに登録されている場合は、氏名、メールアドレス、パスワードを入力してください。\n入力した情報にエラーや不一致が見つかった場合、「お客様が見つかりません」というメッセージが表示されます。\nなお、プライバシー保護のため、最初に登録を行ったコンピューター以外のコンピューターからログインすることはできません。すでに別のコンピューターで登録している場合は、適切なメッセージが表示されます。\n新規のお客様 – ログインをクリックし、登録を選択してください。\nこれで、登録とパーソナライズされたプランの選択の短いプロセスが始まります。\n運用開始期間および試用期間中は、無料でご利用いただけます。運用開始期間の終了時には、お客様に適切な通知が送られます。\n登録プロセスには、家計管理アプリケーションのダウンロードとインストールが含まれます。\nアプリケーションがまだインストールされていない場合は、インストールプロセスが始まります。インストール手順に従い、インストールソフトウェアのダウンロード先を選択し、ダウンロード後にインストールファイルを実行してください。' },
    { heading: 'システム利用パッケージ', body: '運用開始期間または試用期間の終了時に、その旨のシステム通知を受け取ります。無料利用期間が終了し、利用パッケージプランを選択する時が来ました。個人ページのラベルをクリックし、変更のラベルをクリックすると、プラン変更フォームが開きます。\n有料プランは3種類あります：年間契約、月間契約、従量課金契約。' },
    { heading: '個人ページ', body: '個人ページには、基本的な個人情報のほか、選択した購入プラン（期間、開始時刻、終了時刻を含む）が表示されます。\n適切な購入プランを選択するには、個人ページの変更ボタンをクリックしてください。選択後、更新ボタンをクリックしてください。' },
    { heading: 'リマインダー', body: '購入プランを選択すると、開始時刻と終了時刻がすぐに組み込みカレンダーに読み込まれます。\nカレンダーを表示するには、コントロールパネルのリマインダースイッチをクリックしてください。\nプライベートなリマインダーが必要な場合、このリマインダーカレンダーはプライベートな用途にも利用できます。\nリマインダーは今後の通知をトリガーします。サイトにアクセスするたびに、期限が来たリマインダーが表示されます。' },
    { heading: 'フィードバック', body: 'サイトを閲覧し、アプリケーションを実行して、どんなトピックでも、どんな問題でも、あるいは単にフィードバックを送りたいと感じ、システムと言葉を交わしたくなったら、フィードバックのラベルをクリックしてください。\n新しい会話を始めたいですか？ページ上部の新規メッセージをクリックし、「お客様のメッセージ」欄にメッセージを記入してください。\nこのページには、最新情報を伝えるシステムメッセージも含まれています。\nプロジェクトを気に入ったかどうか（残念ながらそうでない場合も含めて）、目の前に2行の評価があります：サイトの評価と家計管理の評価。\n評価が終わったら、送信をクリックしてください。\n各メッセージには参照番号があり、各メッセージの一意のスタンプとして機能し、メッセージの管理やシステムからの返信の紐付けを容易にします。\nフィードバックページにはメッセージテーブルが作成され、以前のメッセージを確認できます。\nシステムからの返信は、送信したメッセージに、ページ下部の指定された場所に追加されます。\nシステムからのすべての返信は、同じフォームの「システムの返信」欄に保存されます。\n別のメッセージを送るには、新規メッセージボタンをクリックする必要があります。各メッセージは新しいフォームで作成されます。' },
    { heading: 'アップデート', body: 'アップデートタブをクリックすると、サイトとその製品のバージョン履歴を含むテーブルが表示されます。各バージョンには番号、更新日、およびアップデートの内容を説明するタイトルがあります。\nアップグレードのたびに、新しいバージョンの新しい行が追加され、お客様には適切な通知が送られます。' },
    { heading: '家計管理 M Finance', body: '家計管理アプリケーションは、このプロジェクトの目玉です。詳しい説明は、ガイドと動画の引き出し4、5、6でお読みいただけます。\nアプリケーションを通じて、銀行取引、収入と支出、月次および年次残高の全体像を把握できます。将来の支出や収入をスマートな支払いスケジュールで追加・計画することもできます。\nコントロールパネルの家計管理スイッチをクリックしましたか？アプリケーションの入り口が開きます。KeyClickサイトの入り口に似たページで、選択した言語での歓迎の挨拶が表示されます。\nアプリケーションは、金融機関の口座から事前にダウンロードした銀行口座やクレジットカードのファイルを読み込み、それらのファイル内の銀行取引の詳細な分析を行います。\n後述する銀行サービスは、口座からファイルをコンピューターにダウンロードしたり、アプリケーションに直接読み込んだりするのに役立ちます。\nアプリケーションは、さまざまな内訳と期間で、個別のグラフィック表示を含む多様な表示機能を提供します。\nそして、これがトッピングのチェリーです – ライブ予算ケーキ。支出は収入ケーキの中のスライスとして表示されます。スマートな仕組みにより、バランスが取れるまでスライスの値を変更できます。' },
    { heading: '銀行サービス', body: '家計管理の利用を始め、プロセスを短縮したいですか？さらに2つのオプションがあります：\n-    口座明細ファイルをコンピューターに自動ダウンロード、\n-    口座明細ファイルを家計管理アプリケーションに直接自動ダウンロード。\n金融機関への接続はお客様ご自身のみが行い、その機関で使用されているセキュリティ設定に従って、いつも通りの通常のログインを行います。ファイルのダウンロード後、直ちにロックされ切断されます。\n接続したい金融機関を選択する過程で、国際的な範囲の金融機関マップに到達します。一部の機関はまだ接続できない場合があります。この点についてフィードバックでシステムにお知らせいただけますと幸いです。\nこのサービスには、先進的な技術環境での体験が含まれます。' },
  ],
  ar: [
    { heading: 'صفحة الهبوط', body: 'دخلت إلى صفحة الهبوط، اخترت لغة، رأيت، قرأت وأعجبتك صفحة الهبوط... حان الوقت للغوص في الموقع.\nاضغط على العبارة: الدخول إلى موقع KeyClick' },
    { heading: 'الصفحة الرئيسية لـ KeyClick', body: 'ضغطت؟ ها أنت في الموقع. تظهر أمامك لفافة مع تحية ترحيب وعلم اللغة.\nاللغة غير مناسبة؟ اختر 1 من بين 11 علمًا في أعلى الموقع وسيتم نقلك فورًا إلى اللغة المختارة. نظام تعدد اللغات هو أحد الوحدات الأساسية للموقع ومنتجاته. يمكنك الانتقال فورًا من لغة إلى أخرى في أي وقت.' },
    { heading: 'لوحة التحكم', body: 'نظرة نحو اليمين تأخذنا إلى لوحة تحكم الموقع.\nبعض عناصر التحكم في هذه المرحلة ستتضمن شريطًا أحمر تظهر عليه كلمة: "مقفل". يهدف القفل إلى حماية خصوصيتك. الدخول الآمن إلى المشروع سيزيل القفل للاستخدام الحر.\nيُنصح العملاء الجدد بالضغط على عبارة الأدلة والفيديوهات.' },
    { heading: 'استخدام حر دون تسجيل', body: 'عناصر التحكم غير المقفلة، مثل: الأدلة والفيديوهات، الملاحظات، الصفحة الشخصية، التذكيرات، تتيح استخدامًا حرًا دون الحاجة إلى التسجيل.\nهل اطلعت على الأدلة والفيديوهات وترغب في البدء بالاستمتاع بإدارة ذكية لميزانية المنزل؟ اضغط على زر الدخول وقم بتسجيل سريع.' },
    { heading: 'الدخول والتسجيل', body: 'عميل مسجل - إذا كنت مسجلاً بالفعل في النظام، أدخل الاسم الأول واسم العائلة، عنوان البريد الإلكتروني، وكلمة المرور.\nإذا تم اكتشاف أخطاء أو عدم تطابق في التفاصيل التي أدخلتها، ستتلقى الرسالة: العميل غير موجود.\nيُذكر أنه، من أجل خصوصيتك، لا يمكن تسجيل الدخول من جهاز كمبيوتر آخر غير الجهاز الذي أجريت عليه التسجيل الأولي. إذا كنت قد سجلت بالفعل على جهاز كمبيوتر آخر، ستتلقى رسالة مناسبة.\nعميل جديد – اضغط على دخول واختر تسجيل.\nتبدأ الآن عملية قصيرة من التسجيل واختيار خطة مخصصة.\nخلال فترة الإطلاق وفترة التجربة، يكون الاستخدام مجانيًا دون أي تكلفة. في نهاية فترة الإطلاق، سيتم إرسال إشعار مناسب للعملاء.\nتتضمن عملية التسجيل تحميل وتثبيت تطبيق إدارة ميزانية المنزل.\nإذا لم يكن التطبيق مثبتًا بعد، ستبدأ عملية تثبيت. اتبع تعليمات التثبيت، اختر مكان تحميل برنامج التثبيت، وبعد التحميل، قم بتشغيل ملف التثبيت.' },
    { heading: 'باقات استخدام النظام', body: 'في نهاية فترة الإطلاق أو فترة التجربة، ستتلقى إشعار نظام بذلك — انتهت فترة استخدامك المجانية وحان وقت اختيار خطة باقة استخدام. اضغط على عبارة الصفحة الشخصية، اضغط على عبارة التغيير، وسيُفتح نموذج تغيير الخطة.\nتوجد 3 خطط مدفوعة: اشتراك سنوي، اشتراك شهري، اشتراك حسب الاستخدام.' },
    { heading: 'الصفحة الشخصية', body: 'ستحتوي صفحتك الشخصية على بياناتك الشخصية الأساسية بالإضافة إلى خطة الشراء المفضلة التي اخترتها، بما في ذلك الفترة، وقت البدء ووقت الانتهاء.\nلاختيار خطة شراء مناسبة، اضغط على زر التغيير في الصفحة الشخصية. بعد الاختيار، اضغط على زر التحديث.' },
    { heading: 'التذكيرات', body: 'بمجرد اختيار خطة الشراء، يتم تحميل وقت البدء ووقت الانتهاء فورًا إلى تقويم مدمج.\nلعرض التقويم، اضغط على مفتاح التذكيرات في لوحة التحكم.\nإذا كنت بحاجة إلى أي تذكيرات خاصة، يمكن لتقويم التذكيرات هذا أن يخدم أيضًا الاحتياجات الخاصة.\nيقوم التذكير بتفعيل إشعارات قادمة. سيعرض كل دخول إلى الموقع تذكيرًا حان وقته.' },
    { heading: 'الملاحظات', body: 'تصفحت الموقع، شغّلت تطبيقات، ولديك رغبة في تبادل بضع كلمات مع النظام — حول أي موضوع، أي مشكلة، أو ببساطة تشعر برغبة في إرسال ملاحظات. اضغط على عبارة الملاحظات.\nهل ترغب في بدء محادثة جديدة؟ اضغط على رسالة جديدة في أعلى الصفحة واكتب رسالتك في قسم رسالة العميل.\nتتضمن الصفحة أيضًا رسالة النظام، التي تُطلعك على المستجدات وتعرض لك آخر الأخبار.\nسواء أحببت المشروع أو، لسوء الحظ، لم يعجبك كثيرًا، أمامك صفان للتقييم: تقييم الموقع وتقييم إدارة ميزانية المنزل.\nهل انتهيت من التقييم؟ ها هو، اضغط للإرسال.\nلاحظ أن لكل رسالة رقم مرجعي، يُستخدم كختم فريد لكل رسالة، مما يسهّل إدارة الرسائل وربط الردود من النظام.\nفي صفحة الملاحظات يتم إنشاء جدول رسائل، ويمكنك الاطلاع على رسائل سابقة.\nستُضاف رسالة النظام إلى الرسالة التي أرسلتها، في المكان المخصص لها أسفل الصفحة.\nيتم حفظ كل رد من النظام في نفس النموذج، في قسم رد النظام.\nلإرسال رسالة أخرى، عليك الضغط على زر رسالة جديدة. كل رسالة في نموذج جديد.' },
    { heading: 'التحديثات', body: 'عند الضغط على علامة تبويب التحديثات، سيظهر جدول يحتوي على تاريخ إصدارات الموقع ومنتجاته. لكل إصدار رقم، تاريخ تحديث، وعنوان يصف طبيعة التحديث.\nمع كل ترقية، تُضاف صف جديد بالإصدار الجديد، وسيتلقى العميل إشعارًا وفقًا لذلك.' },
    { heading: 'إدارة ميزانية المنزل M Finance', body: 'تطبيق إدارة ميزانية المنزل هو جوهرة تاج المشروع. يمكنك قراءة شرح كامل ومفصل في أدراج الأدلة 4 و5 و6 ضمن الأدلة والفيديوهات.\nمن خلال التطبيق، تحصل على نظرة شاملة على عملياتك المصرفية، الدخل والمصروفات، الرصيد الشهري والسنوي. يمكنك أيضًا إضافة وتخطيط مصروفات أو دخل مستقبلي، بجدولة دفعات ذكية.\nهل ضغطت على مفتاح إدارة ميزانية المنزل في لوحة التحكم؟ ستُفتح بوابة التطبيق — صفحة شبيهة ببوابة موقع KeyClick، مع تحية ترحيب باللغة التي اخترتها.\nيقرأ التطبيق ملفات الحسابات المصرفية وبطاقات الائتمان التي قمت بتحميلها مسبقًا من حسابك لدى مؤسسة مالية، ويجري تحليلاً معمقًا للعمليات المصرفية في تلك الملفات.\nيمكن أن تساعدك الخدمات المصرفية الموضحة لاحقًا في تنزيل الملفات من حسابك إلى الكمبيوتر، أو تحميلها مباشرة إلى التطبيق.\nيوفر التطبيق مجموعة متنوعة من العروض، بتصنيفات وفترات زمنية مختلفة، بما في ذلك عروض رسومية فردية.\nوها هي القشدة على الوجه – كعكة ميزانية حية. تُعرض المصروفات كشرائح داخل كعكة الدخل. تتيح لك آلية ذكية تغيير قيم الشرائح حتى تحقيق التوازن.' },
    { heading: 'الخدمات المصرفية', body: 'بدأت استخدام إدارة ميزانية المنزل وترغب في تقصير العمليات؟ أمامك خياران إضافيان:\n-    تحميل تلقائي لملفات كشوف الحساب إلى جهاز الكمبيوتر الخاص بك،\n-    تحميل تلقائي لملفات كشوف الحساب مباشرة إلى تطبيق إدارة ميزانية المنزل.\nيتم الاتصال بمؤسستك المالية من قبلك وحدك، تسجيل دخول عادي كما تفعل دائمًا، وفقًا لإعدادات الأمان المتبعة في تلك المؤسسة. فور تحميل الملفات، يتم القفل وقطع الاتصال.\nفي عملية اختيار المؤسسة التي ترغب بالاتصال بها، ستصل إلى خريطة مؤسسات مالية بتغطية دولية. قد تكون بعض المؤسسات غير متاحة للاتصال بعد. سنكون ممتنين لو أعلمت النظام بذلك عبر إرسال ملاحظات.\nتتضمن الخدمة تجربة في بيئة تكنولوجية متقدمة.' },
  ],
  zh: [
    { heading: '着陆页', body: '您进入了着陆页，选择了语言，看到、阅读并喜欢上了着陆页……现在是时候深入了解网站了。\n点击标签：进入 KeyClick 网站' },
    { heading: 'KeyClick 主页', body: '点击了吗？没错，您已进入网站。带有欢迎语和语言旗帜的卷轴呈现在您面前。\n语言不合适？在网站顶部的 11 面旗帜中选择 1 面，即可立即切换到所选语言。多语言系统是网站及其产品的基本单元之一。您可以随时立即在语言之间切换。' },
    { heading: '控制面板', body: '向右看，我们就来到了网站的控制面板。\n此阶段部分控件将带有红色丝带，上面写着："锁定"字样。此锁定旨在保护您的隐私。安全登录该项目后，锁定将被解除，可自由使用。\n建议新客户点击"指南与视频"标签。' },
    { heading: '无需注册的免费使用', body: '未锁定的控件，例如：指南与视频、反馈、个人页面、提醒，可免费使用，无需注册。\n您已浏览过指南与视频，想开始享受智能家庭预算管理？请点击登录按钮并进行快速注册。' },
    { heading: '登录与注册', body: '已注册客户 - 如果您已在系统中注册，请输入姓名、电子邮件地址、密码。\n如果发现您输入的信息有误或不一致，您将收到消息：未找到该客户。\n需要说明的是，为保护您的隐私，您无法从进行初次注册所用电脑以外的其他电脑登录。如果您已在其他电脑上注册，将收到相应提示。\n新客户 – 点击登录并选择注册。\n现在开始一个简短的注册流程，并选择一个个性化方案。\n在启动期和试用期内，使用是免费的，无需任何费用。启动期结束时，将向客户发送相应通知。\n注册流程包括下载并安装家庭预算管理应用程序。\n如果应用程序尚未安装，将开始安装流程。请按照安装说明操作，选择安装软件的下载位置，下载完成后运行安装文件。' },
    { heading: '系统使用套餐', body: '在启动期或试用期结束时，您将收到相关系统通知——您的免费使用期已结束，是时候选择使用套餐方案了。点击"个人页面"标签，点击"更改"标签，即会打开方案更改表单。\n共有 3 种付费方案：年度订阅、月度订阅、按使用量订阅。' },
    { heading: '个人页面', body: '您的个人页面将包含您的基本个人信息，以及您所选择的首选购买方案，包括期限、开始时间和结束时间。\n要选择合适的购买方案，请点击个人页面上的"更改"按钮。选择后，点击"更新"按钮。' },
    { heading: '提醒', body: '选择购买方案后，开始时间和结束时间会立即加载到内置日历中。\n要显示日历，请点击控制面板中的提醒开关。\n如果您需要任何私人提醒，此提醒日历也可用于个人需求。\n提醒会触发即将到来的通知。每次进入网站时，都会显示已到时间的提醒。' },
    { heading: '反馈', body: '您浏览了网站，运行了应用程序，想就任何主题、任何问题与系统交流几句，或者只是想发送反馈。请点击"反馈"标签。\n想开始一段新对话？点击页面顶部的"新消息"，并在"客户留言"部分写下您的消息。\n该页面还包括系统消息，让您了解最新情况并向您展示热门新闻。\n无论您是喜欢这个项目，还是不太喜欢，您面前都有两行评分：网站评分和家庭预算管理评分。\n评分完成了吗？没错，点击发送即可。\n请注意，每条消息都有一个参考编号，作为每条消息的唯一标记，便于管理消息以及匹配系统的回复。\n在反馈页面会生成一个消息表格，您可以查看以往的消息。\n系统的回复将添加到您发送的消息中，位于页面底部的指定位置。\n系统的每一条回复都保存在同一表单的"系统回复"部分中。\n要发送另一条消息，您需要点击"新消息"按钮。每条消息都在一个新表单中。' },
    { heading: '更新', body: '点击更新选项卡将显示一个表格，其中包含网站及其产品的版本历史记录。每个版本都有编号、更新日期以及描述更新内容的标题。\n每次升级都会添加一行新版本，客户也会收到相应通知。' },
    { heading: '家庭预算管理 M Finance', body: '家庭预算管理应用程序是本项目的皇冠明珠。完整详细的说明可在"指南与视频"中的第 4、5、6 个抽屉中阅读。\n通过该应用程序，您可以全面了解您的银行活动、收入与支出、月度及年度余额。您还可以添加并规划未来的支出或收入，并进行智能付款分配。\n您是否点击了控制面板中的家庭预算管理开关？应用程序的入口将会打开——一个类似于 KeyClick 网站入口的页面，并以您所选择的语言呈现欢迎语。\n该应用程序会读取您事先从金融机构账户下载的银行账户和信用卡文件，并对这些文件中的银行活动进行深入分析。\n下文所述的银行服务可以帮助您将文件从账户下载到电脑，或直接加载到应用程序中。\n该应用程序提供多种视图，可按不同细分和时间段查看，包括各类图形化展示。\n锦上添花的是——一个鲜活的预算蛋糕。支出以切片的形式显示在收入蛋糕内。智能机制让您可以调整切片数值，直至达到平衡。' },
    { heading: '银行服务', body: '已开始使用家庭预算管理，并希望简化流程？您还有 2 个额外选项：\n-    将账户对账单文件自动下载到您的电脑，\n-    将账户对账单文件直接自动下载到家庭预算管理应用程序中。\n与您金融机构的连接完全由您本人完成，按照该机构所采用的安全设置，进行您一贯的常规登录。文件下载完成后会立即锁定并断开连接。\n在选择要连接的机构的过程中，您会看到一张覆盖国际范围的金融机构地图。部分机构可能尚未开放连接。如您能通过反馈告知系统这一情况，我们将不胜感激。\n该服务包括在先进技术环境中的体验。' },
  ],
  it: [
    { heading: 'Pagina di destinazione', body: "Sei entrato nella pagina di destinazione, hai scelto una lingua, hai visto, letto e ti è piaciuta la pagina di destinazione... è ora di tuffarsi nel sito.\nClicca sull'etichetta: Entra nel sito KeyClick" },
    { heading: 'Homepage di KeyClick', body: "Hai cliccato? Ecco fatto, sei sul sito. Davanti a te appaiono una pergamena con un messaggio di benvenuto e la bandiera della lingua.\nLa lingua non è adatta? Scegli 1 delle 11 bandiere in cima al sito e verrai immediatamente trasferito alla lingua scelta. Il sistema multilingue è una delle unità di base del sito e dei suoi prodotti. Puoi passare istantaneamente da una lingua all'altra in qualsiasi momento." },
    { heading: 'Pannello di controllo', body: 'Uno sguardo verso destra ci porta al pannello di controllo del sito.\nAlcuni dei controlli in questa fase includeranno un nastro rosso con la parola: "Bloccato". Il blocco è pensato per proteggere la tua privacy. Un accesso sicuro al progetto rimuoverà il blocco per l\'uso libero.\nAi nuovi clienti si consiglia di cliccare sull\'etichetta Guide e video.' },
    { heading: 'Uso libero senza registrazione', body: 'I controlli non bloccati, come: guide e video, feedback, pagina personale, promemoria, consentono un uso libero senza bisogno di registrazione.\nHai esaminato le guide e i video e vuoi iniziare a godere di una gestione intelligente del bilancio familiare? Clicca sul pulsante di accesso ed esegui una registrazione rapida.' },
    { heading: 'Accesso e registrazione', body: "Cliente registrato - se sei già registrato nel sistema, inserisci nome e cognome, indirizzo email, password.\nSe vengono rilevati errori o discrepanze nei dati inseriti, riceverai il messaggio: Cliente non trovato.\nSi segnala che, a tutela della tua privacy, non è possibile accedere da un computer diverso da quello con cui hai effettuato la registrazione iniziale. Se ti sei già registrato su un altro computer, riceverai un messaggio appropriato.\nNuovo cliente – clicca su accesso e scegli registrazione.\nOra inizia un breve processo di registrazione e scelta di un piano personalizzato.\nDurante il periodo di avvio e il periodo di prova, l'uso è gratuito, senza alcun costo. Al termine del periodo di avvio, verrà inviato un avviso appropriato ai clienti.\nIl processo di registrazione include il download e l'installazione dell'applicazione di gestione del bilancio familiare.\nSe l'applicazione non è ancora installata, inizierà un processo di installazione. Segui le istruzioni di installazione, scegli la posizione di download del software di installazione e, dopo il download, esegui il file di installazione." },
    { heading: 'Pacchetti di utilizzo del sistema', body: "Al termine del periodo di avvio o del periodo di prova, riceverai un avviso di sistema a riguardo — il tuo periodo di utilizzo gratuito è terminato ed è il momento di scegliere un piano di pacchetto di utilizzo. Clicca sull'etichetta pagina personale, clicca sull'etichetta modifica, e si aprirà un modulo di cambio piano.\nEsistono 3 piani a pagamento: abbonamento annuale, abbonamento mensile, abbonamento a consumo." },
    { heading: 'Pagina personale', body: 'La tua pagina personale conterrà i tuoi dati personali di base, nonché il piano di acquisto preferito che hai scelto, incluso il periodo, l\'ora di inizio e l\'ora di fine.\nPer scegliere un piano di acquisto adatto, clicca sul pulsante modifica nella pagina personale. Dopo la scelta, clicca sul pulsante aggiorna.' },
    { heading: 'Promemoria', body: 'Una volta scelto il piano di acquisto, l\'ora di inizio e l\'ora di fine vengono immediatamente caricate in un calendario integrato.\nPer visualizzare il calendario, clicca sull\'interruttore promemoria nel pannello di controllo.\nSe hai bisogno di promemoria privati, questo calendario di promemoria può servire anche a necessità private.\nIl promemoria attiva notifiche imminenti. Ogni accesso al sito mostrerà un promemoria il cui orario è arrivato.' },
    { heading: 'Feedback', body: "Hai navigato nel sito, avviato applicazioni, e hai voglia di scambiare qualche parola con il sistema — su qualsiasi argomento, qualsiasi problema, o semplicemente hai voglia di inviare un feedback. Clicca sull'etichetta Feedback.\nVuoi iniziare una nuova conversazione? Clicca su Nuovo messaggio in cima alla pagina e scrivi il tuo messaggio nella sezione Messaggio del cliente.\nLa pagina include anche il messaggio di sistema, che ti aggiorna e ti mostra le ultime novità.\nChe tu abbia amato il progetto, o purtroppo non così tanto, davanti a te ci sono due righe di valutazione: valutazione del sito e valutazione della gestione del bilancio familiare.\nHai finito di valutare? Ecco fatto, clicca per inviare.\nNota che ogni messaggio ha un numero di riferimento, che funge da timbro univoco per ogni messaggio, facilitando la gestione dei messaggi e l'associazione delle risposte del sistema.\nNella pagina di feedback viene creata una tabella di messaggi, e puoi visualizzare i messaggi precedenti.\nLa risposta del sistema verrà aggiunta al messaggio che hai inviato, nel posto designato in fondo alla pagina.\nOgni risposta del sistema viene salvata nello stesso modulo, nella sezione Risposta del sistema.\nPer un altro messaggio, devi cliccare sul pulsante Nuovo messaggio. Ogni messaggio in un nuovo modulo." },
    { heading: 'Aggiornamenti', body: 'Cliccando sulla scheda aggiornamenti verrà visualizzata una tabella contenente la cronologia delle versioni del sito e dei suoi prodotti. Ogni versione ha un numero, una data di aggiornamento e un titolo che descrive la natura dell\'aggiornamento.\nAd ogni aggiornamento viene aggiunta una nuova riga con la nuova versione, e il cliente riceverà una notifica di conseguenza.' },
    { heading: 'Gestione del bilancio familiare M Finance', body: "L'applicazione di gestione del bilancio familiare è il fiore all'occhiello del progetto. Una spiegazione completa e dettagliata è disponibile nei cassetti 4, 5, 6 di Guide e video.\nAttraverso l'applicazione otterrai una visione completa delle tue operazioni bancarie, entrate e uscite, saldo mensile e annuale. Puoi anche aggiungere e pianificare spese o entrate future, con una pianificazione intelligente dei pagamenti.\nHai cliccato sull'interruttore gestione del bilancio familiare nel pannello di controllo? Si aprirà la porta dell'applicazione — una pagina simile alla porta del sito KeyClick, con un messaggio di benvenuto nella lingua che hai scelto.\nL'applicazione legge i file dei conti bancari e delle carte di credito che hai scaricato in precedenza dal tuo conto presso un istituto finanziario, ed esegue un'analisi approfondita delle operazioni bancarie in tali file.\nI servizi bancari descritti di seguito possono aiutarti a scaricare i file dal tuo conto al computer, oppure a caricarli direttamente nell'applicazione.\nL'applicazione offre una varietà di visualizzazioni, in diverse suddivisioni e periodi di tempo, incluse rappresentazioni grafiche individuali.\nEd ecco la ciliegina sulla torta – una torta del bilancio dal vivo. Le spese sono mostrate come fette all'interno della torta delle entrate. Un meccanismo intelligente ti permette di modificare i valori delle fette fino a raggiungere un equilibrio." },
    { heading: 'Servizi bancari', body: "Hai iniziato a usare la gestione del bilancio familiare e vuoi accorciare i processi? Hai 2 opzioni aggiuntive:\n-    Download automatico dei file degli estratti conto sul tuo computer,\n-    Download automatico dei file degli estratti conto direttamente nell'applicazione di gestione del bilancio familiare.\nLa connessione al tuo istituto finanziario viene effettuata solo da te, un accesso normale come fai sempre, secondo le impostazioni di sicurezza utilizzate da tale istituto. Subito dopo il download dei file, si blocca e si disconnette.\nNel processo di scelta dell'istituto a cui desideri collegarti, arriverai a una mappa di istituti finanziari con copertura internazionale. Alcuni istituti potrebbero non essere ancora disponibili per il collegamento. Ti saremmo grati se ne informassi il sistema inviando un feedback.\nIl servizio include un'esperienza in un ambiente tecnologico avanzato." },
  ],
  hi: [
    { heading: 'लैंडिंग पेज', body: 'आप लैंडिंग पेज में प्रवेश कर गए, एक भाषा चुनी, देखा, पढ़ा और लैंडिंग पेज आपको पसंद आया... अब वेबसाइट में गोता लगाने का समय आ गया है।\nलेबल पर क्लिक करें: KeyClick वेबसाइट में प्रवेश करें' },
    { heading: 'KeyClick होम पेज', body: 'क्लिक किया? बस, अब आप वेबसाइट पर हैं। आपके सामने स्वागत संदेश और भाषा के झंडे वाला एक स्क्रॉल दिखाई देता है।\nभाषा उपयुक्त नहीं है? साइट के शीर्ष पर मौजूद 11 झंडों में से 1 चुनें और आप तुरंत चुनी हुई भाषा में स्थानांतरित हो जाएंगे। बहु-भाषा प्रणाली साइट और उसके उत्पादों की मूल इकाइयों में से एक है। आप किसी भी समय तुरंत एक भाषा से दूसरी भाषा में बदल सकते हैं।' },
    { heading: 'नियंत्रण पैनल', body: 'दाईं ओर देखने पर हम साइट के नियंत्रण पैनल तक पहुंचते हैं।\nइस चरण में कुछ नियंत्रणों में एक लाल रिबन होगा जिस पर शब्द होगा: "लॉक्ड"। यह लॉक आपकी गोपनीयता की सुरक्षा के लिए है। प्रोजेक्ट में सुरक्षित लॉगिन से लॉक हट जाएगा और मुफ़्त उपयोग संभव होगा।\nनए ग्राहकों को गाइड और वीडियो लेबल पर क्लिक करने की सलाह दी जाती है।' },
    { heading: 'बिना पंजीकरण के मुफ़्त उपयोग', body: 'अनलॉक किए गए नियंत्रण, जैसे: गाइड और वीडियो, फीडबैक, व्यक्तिगत पेज, रिमाइंडर, बिना पंजीकरण की आवश्यकता के मुफ़्त उपयोग की अनुमति देते हैं।\nक्या आपने गाइड और वीडियो देख लिए हैं और अब स्मार्ट गृह बजट प्रबंधन का आनंद लेना शुरू करना चाहते हैं? लॉगिन बटन पर क्लिक करें और त्वरित पंजीकरण करें।' },
    { heading: 'लॉगिन और पंजीकरण', body: 'पंजीकृत ग्राहक - यदि आप पहले से ही सिस्टम में पंजीकृत हैं, तो अपना पहला और अंतिम नाम, ईमेल पता, पासवर्ड दर्ज करें।\nयदि आपके द्वारा दर्ज विवरण में त्रुटियां या असंगतियां पाई जाती हैं, तो आपको संदेश प्राप्त होगा: ग्राहक नहीं मिला।\nकृपया ध्यान दें, आपकी गोपनीयता के लिए, जिस कंप्यूटर पर आपने प्रारंभिक पंजीकरण किया था, उसके अलावा किसी अन्य कंप्यूटर से लॉगिन नहीं किया जा सकता। यदि आपने पहले ही किसी अन्य कंप्यूटर पर पंजीकरण कर लिया है, तो आपको उचित संदेश प्राप्त होगा।\nनया ग्राहक – लॉगिन पर क्लिक करें और पंजीकरण चुनें।\nअब पंजीकरण और एक व्यक्तिगत योजना चुनने की एक छोटी प्रक्रिया शुरू होती है।\nलॉन्च अवधि और परीक्षण अवधि के दौरान, उपयोग मुफ़्त है, बिना किसी शुल्क के। लॉन्च अवधि समाप्त होने पर, ग्राहकों को एक उचित सूचना भेजी जाएगी।\nपंजीकरण प्रक्रिया में गृह बजट प्रबंधन एप्लिकेशन को डाउनलोड और इंस्टॉल करना शामिल है।\nयदि एप्लिकेशन अभी तक इंस्टॉल नहीं है, तो एक इंस्टॉलेशन प्रक्रिया शुरू होगी। इंस्टॉलेशन निर्देशों का पालन करें, इंस्टॉलेशन सॉफ़्टवेयर के डाउनलोड स्थान का चयन करें, और डाउनलोड के बाद, इंस्टॉलेशन फ़ाइल चलाएं।' },
    { heading: 'सिस्टम उपयोग पैकेज', body: 'लॉन्च अवधि या परीक्षण अवधि के अंत में, आपको इस बारे में एक सिस्टम सूचना प्राप्त होगी — आपकी मुफ़्त उपयोग अवधि समाप्त हो गई है और अब एक उपयोग पैकेज योजना चुनने का समय आ गया है। व्यक्तिगत पेज लेबल पर क्लिक करें, बदलाव लेबल पर क्लिक करें, और एक योजना परिवर्तन फ़ॉर्म खुल जाएगा।\n3 भुगतान योजनाएं उपलब्ध हैं: वार्षिक सदस्यता, मासिक सदस्यता, उपयोग-आधारित सदस्यता।' },
    { heading: 'व्यक्तिगत पेज', body: 'आपके व्यक्तिगत पेज में आपकी बुनियादी व्यक्तिगत जानकारी के साथ-साथ आपकी चुनी हुई पसंदीदा खरीद योजना भी शामिल होगी, जिसमें अवधि, आरंभ समय और समाप्ति समय शामिल हैं।\nउपयुक्त खरीद योजना चुनने के लिए, व्यक्तिगत पेज पर बदलाव बटन पर क्लिक करें। चुनने के बाद, अपडेट बटन पर क्लिक करें।' },
    { heading: 'रिमाइंडर', body: 'खरीद योजना चुनते ही, आरंभ समय और समाप्ति समय तुरंत एक अंतर्निर्मित कैलेंडर में लोड हो जाते हैं।\nकैलेंडर दिखाने के लिए, नियंत्रण पैनल में रिमाइंडर स्विच पर क्लिक करें।\nयदि आपको किसी भी निजी रिमाइंडर की आवश्यकता है, तो यह रिमाइंडर कैलेंडर निजी आवश्यकताओं के लिए भी काम कर सकता है।\nरिमाइंडर आगामी सूचनाओं को सक्रिय करता है। वेबसाइट में हर प्रवेश पर एक ऐसा रिमाइंडर दिखाया जाएगा जिसका समय आ गया है।' },
    { heading: 'फीडबैक', body: 'आपने वेबसाइट ब्राउज़ की, एप्लिकेशन चलाए, और अब आपकी इच्छा है कि किसी भी विषय पर, किसी भी समस्या पर, या बस फीडबैक भेजने के लिए सिस्टम से कुछ शब्द साझा करें। फीडबैक लेबल पर क्लिक करें।\nक्या आप एक नई बातचीत शुरू करना चाहते हैं? पेज के शीर्ष पर नया संदेश पर क्लिक करें और अपना संदेश ग्राहक का संदेश अनुभाग में लिखें।\nपेज में सिस्टम संदेश भी शामिल है, जो आपको ताज़ा जानकारी देता है और आपको ताज़ा खबरें दिखाता है।\nचाहे आपको प्रोजेक्ट पसंद आया हो, या दुर्भाग्य से इतना नहीं, आपके सामने रेटिंग की दो पंक्तियां हैं: वेबसाइट रेटिंग और गृह बजट प्रबंधन रेटिंग।\nरेटिंग देना समाप्त कर लिया? बस, भेजने के लिए क्लिक करें।\nध्यान दें कि हर संदेश का एक संदर्भ संख्या होती है, जो प्रत्येक संदेश के लिए एक अनूठी मुहर के रूप में कार्य करती है, जिससे संदेशों का प्रबंधन और सिस्टम से जवाबों का मिलान आसान हो जाता है।\nफीडबैक पेज पर संदेशों की एक तालिका बनाई जाती है, और आप पिछले संदेश देख सकते हैं।\nसिस्टम का जवाब आपके द्वारा भेजे गए संदेश में, पेज के निचले भाग में निर्धारित स्थान पर जोड़ा जाएगा।\nसिस्टम का हर जवाब उसी फ़ॉर्म में, सिस्टम जवाब अनुभाग में सहेजा जाता है।\nकिसी अन्य संदेश के लिए आपको नया संदेश बटन पर क्लिक करना होगा। हर संदेश एक नए फ़ॉर्म में।' },
    { heading: 'अपडेट्स', body: 'अपडेट्स टैब पर क्लिक करने से वेबसाइट और उसके उत्पादों के संस्करण इतिहास वाली एक तालिका दिखाई देगी। हर संस्करण का एक नंबर, अपडेट की तारीख और अपडेट की प्रकृति का वर्णन करने वाला शीर्षक होता है।\nहर अपग्रेड के साथ, नए संस्करण के साथ एक नई पंक्ति जोड़ी जाती है, और ग्राहक को तदनुसार एक सूचना प्राप्त होगी।' },
    { heading: 'गृह बजट प्रबंधन M Finance', body: 'गृह बजट प्रबंधन एप्लिकेशन इस प्रोजेक्ट का सबसे बेशकीमती हिस्सा है। पूरा और विस्तृत विवरण आप गाइड और वीडियो में दराज 4, 5, 6 में पढ़ सकते हैं।\nइस एप्लिकेशन के माध्यम से आपको अपनी बैंकिंग गतिविधियों, आय और व्यय, मासिक और वार्षिक शेष का एक संपूर्ण दृश्य मिलता है। आप भविष्य के खर्चों या आय को जोड़ और योजनाबद्ध भी कर सकते हैं, स्मार्ट भुगतान अनुसूची के साथ।\nक्या आपने नियंत्रण पैनल में गृह बजट प्रबंधन स्विच पर क्लिक किया? एप्लिकेशन का द्वार खुलेगा — KeyClick वेबसाइट के द्वार जैसा एक पेज, आपकी चुनी हुई भाषा में स्वागत संदेश के साथ।\nएप्लिकेशन उन बैंक खाता और क्रेडिट कार्ड फ़ाइलों को पढ़ता है जिन्हें आपने पहले किसी वित्तीय संस्थान में अपने खाते से डाउनलोड किया था, और उन फ़ाइलों में बैंकिंग गतिविधियों का गहन विश्लेषण करता है।\nआगे बताई गई बैंकिंग सेवाएं आपके खाते से फ़ाइलें कंप्यूटर पर डाउनलोड करने, या सीधे एप्लिकेशन में लोड करने में आपकी मदद कर सकती हैं।\nएप्लिकेशन विभिन्न विभाजनों और समय अवधियों में विविध दृश्य प्रदान करता है, जिसमें व्यक्तिगत ग्राफ़िक प्रदर्शन भी शामिल हैं।\nऔर यह रही केक पर चेरी – एक जीवंत बजट केक। खर्चों को आय केक के अंदर स्लाइस के रूप में दिखाया जाता है। एक स्मार्ट तंत्र आपको संतुलन प्राप्त होने तक स्लाइस मानों को बदलने देता है।' },
    { heading: 'बैंकिंग सेवाएं', body: 'गृह बजट प्रबंधन का उपयोग शुरू कर दिया है और प्रक्रियाओं को छोटा करना चाहते हैं? आपके पास 2 अतिरिक्त विकल्प हैं:\n-    खाता विवरण फ़ाइलों को अपने कंप्यूटर पर स्वचालित रूप से डाउनलोड करना,\n-    खाता विवरण फ़ाइलों को सीधे गृह बजट प्रबंधन एप्लिकेशन में स्वचालित रूप से डाउनलोड करना।\nआपके वित्तीय संस्थान से कनेक्शन केवल आपके द्वारा किया जाएगा, वही सामान्य लॉगिन जो आप हमेशा करते हैं, उस संस्थान में प्रचलित सुरक्षा सेटिंग्स के अनुसार। फ़ाइलें डाउनलोड होते ही तुरंत लॉक और डिस्कनेक्ट हो जाता है।\nजिस संस्थान से आप जुड़ना चाहते हैं उसे चुनने की प्रक्रिया में, आप अंतरराष्ट्रीय कवरेज वाले वित्तीय संस्थानों के मानचित्र तक पहुंचेंगे। हो सकता है कुछ संस्थान अभी कनेक्शन के लिए उपलब्ध न हों। इस बारे में फीडबैक भेजकर सिस्टम को सूचित करें तो हम आभारी होंगे।\nसेवा में एक उन्नत तकनीकी वातावरण में अनुभव शामिल है।' },
  ],
}

function GuidesMusicBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const filesRef = useRef<string[]>([])
  const queueRef = useRef<string[]>([])
  const indexRef = useRef(-1)
  const enabledRef = useRef(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [trackName, setTrackName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('guidesMusicEnabled')
    if (saved !== null) setMusicEnabled(saved === '1')
  }, [])

  useEffect(() => { enabledRef.current = musicEnabled }, [musicEnabled])

  function toggleMusicEnabled() {
    setMusicEnabled(v => {
      const next = !v
      localStorage.setItem('guidesMusicEnabled', next ? '1' : '0')
      return next
    })
  }

  function shuffle(arr: string[]) {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function loadTrack(file: string) {
    const audio = audioRef.current
    if (!audio) return
    audio.src = '/music/' + encodeURIComponent(file)
    setTrackName(file.replace(/\.[^.]+$/, ''))
  }

  function nextTrack() {
    if (!filesRef.current.length) return
    indexRef.current += 1
    if (indexRef.current >= queueRef.current.length) {
      queueRef.current = shuffle(filesRef.current)
      indexRef.current = 0
    }
    loadTrack(queueRef.current[indexRef.current])
  }

  useEffect(() => {
    let cancelled = false
    if (audioRef.current) audioRef.current.volume = 0.7
    fetch('/api/guides-music-list').then(r => r.json()).then(d => {
      if (cancelled) return
      const files: string[] = Array.isArray(d.files) ? d.files : []
      filesRef.current = files
      if (files.length) {
        queueRef.current = shuffle(files)
        indexRef.current = 0
        loadTrack(queueRef.current[0])
      }
    }).catch(() => {})

    const audio = audioRef.current
    const onEnded = () => nextTrack()
    audio?.addEventListener('ended', onEnded)

    const poll = setInterval(() => {
      const a = audioRef.current
      if (!a) return
      const shouldPlay = enabledRef.current && !!(window as any).videoPlaying
      if (shouldPlay && a.paused) a.play().catch(() => {})
      else if (!shouldPlay && !a.paused) a.pause()
    }, 300)

    return () => {
      cancelled = true
      clearInterval(poll)
      audio?.removeEventListener('ended', onEnded)
      audioRef.current?.pause()
      ;(window as any).videoPlaying = false
    }
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: '#3E2712', borderRadius: 8, direction: 'ltr' }}>
      <div
        onClick={toggleMusicEnabled}
        title="הפעלת מוסיקה"
        style={{ position: 'relative', width: 34, height: 18, borderRadius: 9, background: musicEnabled ? '#1a7a54' : '#5C3A1E', border: '1px solid #8A5A32', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 1, left: musicEnabled ? 17 : 1, width: 14, height: 14, borderRadius: '50%', background: '#F1E9D8', transition: 'left .15s' }} />
      </div>
      <div
        onClick={nextTrack}
        title="רצועה הבאה"
        style={{ width: 26, height: 26, borderRadius: '50%', background: '#5C3A1E', border: '1px solid #8A5A32', color: '#F1E9D8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
      >⏭</div>
      <input
        type="range" min={0} max={100} defaultValue={70}
        onChange={e => { if (audioRef.current) audioRef.current.volume = Number(e.target.value) / 100 }}
        style={{ width: 60, height: 4, accentColor: '#8A5A32', cursor: 'pointer', flexShrink: 0 }}
      />
      <span style={{ color: '#F1E9D8', fontSize: 10, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: .85 }}>{trackName}</span>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}

function GuidesDetailPage({ lang, category, drawerLabel, contentTitle, contentDesc, sections, imageSrc, imageWidth, imageHeight, videoSrc, pageId, navButtons, onNavigate }: { lang: typeof languages[0]; category: string; drawerLabel: string; contentTitle: string; contentDesc: string; sections?: { heading: string; body: string; image?: { src: string; width: number; height: number } }[]; imageSrc?: string; imageWidth?: number; imageHeight?: number; videoSrc?: string; pageId?: string; navButtons?: { label: string; page: string }[]; onNavigate?: (page: string) => void }) {
  const isColLayout = true
  const cabinetWidth = isColLayout ? 'min(1040px,100%)' : 'min(1040px,92vw)'
  const isRTL = lang.code === 'he' || lang.code === 'ar'

  const trayCardRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (trayCardRef.current) trayCardRef.current.scrollTop = 0 }, [pageId])

  const leftPanelBox = navButtons && (
    <div style={{ position: 'relative', border: '2px solid #FFD700', borderRadius: 8, padding: '18px 10px 10px', background: '#1a1a1a' }}>
      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 8px', fontFamily: 'var(--font-dancing), Georgia, serif', fontStyle: 'italic', fontSize: 18, color: '#FFD700', whiteSpace: 'nowrap' }}>KeyClick</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {navButtons.slice(0, 3).map(n => {
          const [prefix, category] = n.label.split(' - ')
          return (
            <button key={n.page} onClick={() => onNavigate?.(n.page)} style={{
              width: '140px',
              background: n.page === pageId ? 'linear-gradient(to bottom, #8b1e1e, #4a0d0d)' : 'linear-gradient(to bottom, #0d0d2b, #001a4a)',
              border: '2px solid #FFD700', borderRadius: '10px',
              color: '#FFD700', padding: '10px 14px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
              textAlign: 'center', whiteSpace: 'normal', boxShadow: '0 3px 8px rgba(0,0,0,.35)',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{prefix}<br/>{category}</button>
          )
        })}
      </div>
    </div>
  )

  const rightPanelBox = navButtons && (
    <div style={{ position: 'relative', border: '2px solid #FFD700', borderRadius: 8, padding: '18px 10px 10px', background: '#1a1a1a' }}>
      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 8px', fontWeight: 'bold', fontSize: 14, color: '#FFD700', whiteSpace: 'nowrap' }}>M Finance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {navButtons.slice(3, 6).map(n => {
          const [prefix, category] = n.label.split(' - ')
          return (
            <button key={n.page} onClick={() => onNavigate?.(n.page)} style={{
              width: '140px',
              background: n.page === pageId ? 'linear-gradient(to bottom, #8b1e1e, #4a0d0d)' : 'linear-gradient(to bottom, #0d0d2b, #001a4a)',
              border: '2px solid #FFD700', borderRadius: '10px',
              color: '#FFD700', padding: '10px 14px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
              textAlign: 'center', whiteSpace: 'normal', boxShadow: '0 3px 8px rgba(0,0,0,.35)',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >{prefix}<br/>{category}</button>
          )
        })}
      </div>
    </div>
  )

  const furnitureBox = (
    <div className="furniture" style={{ flex: 1, width: isColLayout ? undefined : '100%', minWidth: isColLayout ? 0 : undefined, minHeight: 0 }}>
      <div className="cap" style={{ width: `calc(${cabinetWidth} + 20px)`, maxWidth: isColLayout ? '100%' : undefined }}>
        <span className="brandplate" style={navButtons ? { background: 'linear-gradient(180deg, #8b1e1e, #4a0d0d)' } : undefined}>{drawerLabel}</span>
      </div>
      <div className="cabinet" style={{ width: cabinetWidth, maxWidth: isColLayout ? '100%' : undefined, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, ...(isColLayout ? {} : { maxHeight: 'calc(100vh - 320px)' }) }}>
        <div className="tray-card" ref={trayCardRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
          {!videoSrc && (
            <div className="tray-row" style={(sections && sections.length > 0) ? { justifyContent: 'center' } : undefined}><strong style={(sections && sections.length > 0) ? { fontSize: 26, color: '#e02020', fontWeight: 800, letterSpacing: '.01em', textShadow: '0 1px 2px rgba(0,0,0,.25)', direction: isRTL ? 'rtl' : 'ltr' } : { direction: isRTL ? 'rtl' : 'ltr' }}>{contentTitle}</strong></div>
          )}
          {videoSrc ? (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <iframe
                  src={videoSrc}
                  title={contentTitle}
                  scrolling="no"
                  style={{ width: '100%', height: '100%', border: '2px solid #FFD700', borderRadius: 8, background: 'red', overflow: 'hidden' }}
                  allow="autoplay"
                />
              </div>
              <GuidesMusicBar />
            </div>
          ) : sections && sections.length > 0 ? (
            <div style={{ marginTop: 6, direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
              {sections.map((s, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 20 }}>
                  {s.image && (
                    <Image src={s.image.src} alt={s.heading || contentTitle} width={s.image.width} height={s.image.height} style={{ float: isRTL ? 'right' : 'left', margin: isRTL ? '0 0 10px 16px' : '0 16px 10px 0', maxWidth: '30%', height: 'auto', borderRadius: 8 }} />
                  )}
                  {s.heading && (
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#131a4a', borderBottom: '2px solid #d4af37', paddingBottom: 3, marginBottom: 6, display: 'inline-block' }}>{s.heading}</div>
                  )}
                  <p className="tray-desc" style={{ maxWidth: 'none', whiteSpace: 'pre-line', color: '#20264a', fontSize: 16, fontWeight: 500, lineHeight: 1.7 }}>{s.body}</p>
                </div>
              ))}
              <div style={{ clear: 'both' }} />
              {imageSrc && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <Image src={imageSrc} alt={contentTitle} width={imageWidth ?? 2080} height={imageHeight ?? 2046} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
                </div>
              )}
            </div>
          ) : (
            <p className="tray-desc" style={{ maxWidth: 'none', flex: 1, direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>{contentDesc}</p>
          )}
        </div>
      </div>
      <div className="feet" style={{ width: `calc(${cabinetWidth} - 34px)`, maxWidth: isColLayout ? '100%' : undefined }}><div className="foot" /><div className="foot" /></div>
    </div>
  )

  return (
    <div className="guides-page" dir="rtl" style={{ gap: 10, paddingBottom: 24 }}>
      <style>{GUIDES_CSS}</style>
      <div style={{ marginBottom: -16 }}>
        <PageHeader subtitle={`${lang.card.guidesAndVideos} - ${category}`} layout="row" lang={lang} />
      </div>

      {navButtons && !isColLayout && (
        <div style={{ position: 'absolute', top: 83, right: 24, zIndex: 5, textAlign: 'center', lineHeight: 1.25, transform: 'rotate(20deg)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: 30, color: '#c31432', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
          {lang.captions.guidesDrawersLine1}<br/>{lang.captions.guidesDrawersLine2}
        </div>
      )}

      {navButtons && isColLayout && (
        <div dir="ltr" style={{ position: 'absolute', top: 68, right: 24, zIndex: 5, textAlign: 'center', lineHeight: 1.25, transform: 'rotate(20deg)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: 30, color: '#c31432', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
          {lang.captions.guidesDrawersLine1}<br/>{lang.captions.guidesDrawersLine2}
        </div>
      )}

      {isColLayout ? (
        <div dir="ltr" style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0, alignItems: 'stretch', justifyContent: 'center', gap: 12 }}>
          {leftPanelBox && <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>{leftPanelBox}</div>}
          {furnitureBox}
          {rightPanelBox && <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>{rightPanelBox}</div>}
        </div>
      ) : (
        <>
          {navButtons && (
            <div style={{ position: 'absolute', top: 300, left: 62, zIndex: 5 }}>{leftPanelBox}</div>
          )}
          {navButtons && (
            <div style={{ position: 'absolute', top: 300, right: 62, zIndex: 5 }}>{rightPanelBox}</div>
          )}
          {furnitureBox}
        </>
      )}
    </div>
  )
}

function buildGuideNavButtons(lang: typeof languages[0]) {
  const mFinanceTitle = lang.code === 'he' ? lang.card.title.replace(/ /g, ' ') : lang.card.title
  return [
    { label: `1 ${lang.card.theWebsite} - ${lang.guides.overview}`, page: 'guides-site-overview' },
    { label: `2 ${lang.card.theWebsite} - ${lang.guides.userGuide}`, page: 'guides-site-guide' },
    { label: `3 ${lang.card.theWebsite} - ${lang.card.videos}`, page: 'guides-site-videos' },
    { label: `4 ${mFinanceTitle} - ${lang.guides.overview}`, page: 'guides-fin-overview' },
    { label: `5 ${mFinanceTitle} - ${lang.guides.userGuide}`, page: 'guides-fin-guide' },
    { label: `6 ${mFinanceTitle} - ${lang.card.videos}`, page: 'guides-fin-videos' },
  ]
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
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', ...GRANITE_BG, padding: '32px 28px', boxSizing: 'border-box', direction: 'rtl' }}>
      <PageHeader subtitle={`${lang.card.infoServices} - ${lang.menu[3]}`} lang={lang} />

      <div style={{ position: 'absolute', top: 'calc(30% + 70px)', transform: 'translateY(-50%)', right: 0, width: 'calc(50% - 300px)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '28px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
        {lang.captions.remindersRight1}<br/>{lang.captions.remindersRight2}
      </div>
      <div style={{ position: 'absolute', top: 'calc(30% + 70px)', transform: 'translateY(-50%)', left: 0, width: 'calc(50% - 300px)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '28px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
        {lang.captions.remindersLeft1}<br/>{lang.captions.remindersLeft2}<br/>{lang.captions.remindersLeft3}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'min-content' }}>

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

function PageContent({ page, lang, langIdx, onChangeLang, clientIp, user, systemMessage, onSetSystemMessage, prText, setPrText, prDate, setPrDate, bankingDirect, pendingBankSession, onConsumeBankSession, onClose, onLogin, onUserUpdate, onNavigate, onMsg, onDbg, onOpenDebug, onInstall, onRun }: { page: string; lang: typeof languages[0]; langIdx: number; onChangeLang: (i: number) => void; clientIp: string; user: UserRecord | null; systemMessage: string; onSetSystemMessage: (m: string) => void; prText: string; setPrText: (v: string) => void; prDate: string; setPrDate: (v: string) => void; bankingDirect: boolean; pendingBankSession: string | null; onConsumeBankSession: () => void; onClose: () => void; onLogin: (user: UserRecord) => void; onUserUpdate: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void; onDbg: (func: string, msg: string) => void; onOpenDebug: () => void; onInstall: () => void; onRun: () => void }) {
  if (page === '0')           return <FeedbackPage user={user} lang={lang} systemMessage={systemMessage} onDbg={onDbg} />
  if (page === '1')           return <UpdatesPage lang={lang} />
  if (page === '2')           return <MessagesPage user={user} lang={lang} onDbg={onDbg} />
  if (page === '3')           return <RemindersPage user={user} lang={lang} />
  if (page === 'mf-login')    return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='default'  onClose={onClose} onLogin={onLogin} onUserUpdate={onUserUpdate} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'mf-register') return <RegisterCard lang={lang} clientIp={clientIp} initialPhase='register' onClose={onClose} onLogin={onLogin} onUserUpdate={onUserUpdate} onNavigate={onNavigate} onMsg={onMsg} onDbg={onDbg} />
  if (page === 'mf-install')  return <InstallCard lang={lang} onInstall={onInstall} onRun={onRun} onDbg={onDbg} />
  if (page === 'system')      return <SystemPage user={user} lang={lang} langIdx={langIdx} onChangeLang={onChangeLang} onOpenDebug={onOpenDebug} onDbg={onDbg} onUserUpdate={onUserUpdate} onSetSystemMessage={onSetSystemMessage} prText={prText} setPrText={setPrText} prDate={prDate} setPrDate={setPrDate} onNavigate={onNavigate} onInstall={onInstall} onRun={onRun} />
  if (page === '4')           return <BankingPage user={user} lang={lang} directInstitutions={bankingDirect} pendingBankSession={pendingBankSession} onConsumeBankSession={onConsumeBankSession} onDbg={onDbg} />
  if (page === '5')           return <PersonalPage user={user} lang={lang} onNavigate={onNavigate} onUserUpdate={onUserUpdate} onDbg={onDbg} />
  if (page === 'guides')      return <GuidesPage lang={lang} onNavigate={onNavigate} />
  if (page === 'guides-fin-overview')  return <GuidesDetailPage lang={lang} category={lang.guides.overview} drawerLabel={`4 ${lang.card.title} - ${lang.guides.overview}`} contentTitle={FINANCE_OVERVIEW_TITLES[lang.code] ?? lang.guides.financeOverviewTitle} contentDesc={lang.guides.financeOverviewDesc} sections={FINANCE_OVERVIEW_SECTIONS[lang.code]} imageSrc="/guides/mfinance-structure-diagram.png" imageWidth={2092} imageHeight={2184} pageId='guides-fin-overview' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  if (page === 'guides-fin-guide')     return <GuidesDetailPage lang={lang} category={lang.guides.userGuide} drawerLabel={`5 ${lang.card.title} - ${lang.guides.userGuide}`} contentTitle={FINANCE_GUIDE_TITLES[lang.code] ?? lang.guides.financeGuideTitle} contentDesc={lang.guides.financeGuideDesc} sections={FINANCE_GUIDE_SECTIONS[lang.code]} pageId='guides-fin-guide' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  if (page === 'guides-fin-videos')    return <GuidesDetailPage lang={lang} category={lang.card.videos} drawerLabel={`6 ${lang.card.title} - ${lang.card.videos}`} contentTitle={lang.guides.financeVideosTitle} contentDesc={lang.guides.financeVideosDesc} videoSrc={`/guides-video/finance-intro${lang.code === 'he' ? '' : '-' + lang.code}.html?v=8`} pageId='guides-fin-videos' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  if (page === 'guides-site-overview') return <GuidesDetailPage lang={lang} category={lang.guides.overview} drawerLabel={`1 ${lang.card.theWebsite} - ${lang.guides.overview}`} contentTitle={SITE_OVERVIEW_TITLES[lang.code] ?? lang.guides.siteOverviewTitle} contentDesc={lang.guides.siteOverviewDesc} sections={SITE_OVERVIEW_SECTIONS[lang.code]} imageSrc={`/guides/site-structure-diagram-${lang.code}.png`} pageId='guides-site-overview' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  if (page === 'guides-site-guide')    return <GuidesDetailPage lang={lang} category={lang.guides.userGuide} drawerLabel={`2 ${lang.card.theWebsite} - ${lang.guides.userGuide}`} contentTitle={SITE_GUIDE_TITLES[lang.code] ?? lang.guides.siteGuideTitle} contentDesc={lang.guides.siteGuideDesc} sections={SITE_GUIDE_SECTIONS[lang.code]} pageId='guides-site-guide' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  if (page === 'guides-site-videos')   return <GuidesDetailPage lang={lang} category={lang.card.videos} drawerLabel={`3 ${lang.card.theWebsite} - ${lang.card.videos}`} contentTitle={lang.guides.siteVideosTitle} contentDesc={lang.guides.siteVideosDesc} videoSrc={`/guides-video/site-intro${lang.code === 'he' ? '' : '-' + lang.code}.html?v=999xyza`} pageId='guides-site-videos' navButtons={buildGuideNavButtons(lang)} onNavigate={onNavigate} />
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#555' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', color: '#9b30c8' }}>{lang.menu[parseInt(page)]}</div>
        <div style={{ fontSize: '16px' }}>{lang.profile.comingSoon}</div>
      </div>
    </div>
  )
}

type BankConnection = { id: string; provider: string; institution_name: string; status: string; created_at: string }
type BankAccount    = { id: string; connection_id: string; iban: string; name: string; currency: string; account_type: string; balance: number }
type BankTx         = { id: string; date: string; description: string; amount: number; currency: string; category: string }
type FinancialInstitutionRecord = {
  institution_record_id: number; country_name: string; country_code: string
  institution_name: string; institution_code: string | null
  provider_name: string | null; provider_code: string | null
  institution_available: boolean; system_enable_flag: boolean; system_simulation_mode: boolean
  institution_registration_date: string | null
}

function BankingConnectPanel({ userId, lang }: { userId: number | undefined; lang: typeof languages[0] }) {
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
        body: JSON.stringify({ language: lang.code }),
      }).then(r => r.json())
      if (dp.provider === 'nordigen') {
        const country = dp.country ?? 'DE'
        const inst = await fetch(`/api/banking/nordigen/institutions?country=${country}`).then(r => r.json())
        setInstitutions(Array.isArray(inst) ? inst : [])
        setStep('institutions')
      } else if (dp.provider === 'plaid') {
        setMsg(lang.system.plaidNotYetSupported)
      } else if (dp.provider === 'il') {
        setMsg(lang.system.israeliProviderNotConfigured)
      } else {
        setMsg(lang.system.providerNotDetected)
      }
    } catch { setMsg(lang.system.error) } finally { setLoading(false) }
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
      if (d.link) { window.open(d.link, '_blank', 'width=600,height=700'); setMsg(lang.banking.linkOpened.replace('{name}', instName)); setStep('main') }
      else { setMsg(lang.banking.linkCreateError) }
    } catch { setMsg(lang.system.error) } finally { setLoading(false) }
  }

  async function handleDisconnect(connectionId: string) {
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
      <div style={S.hdr}>{lang.system.connectionsManagementTitle}</div>

      {step === 'main' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button style={S.btn} onClick={handleConnect} disabled={loading}>+ {lang.system.connectBankAction}</button>
            <button style={S.btnSm} onClick={load} disabled={loading}>↻ {lang.banking.refresh}</button>
          </div>
          {connections.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>{lang.system.noConnections}</div>}
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
                    <button style={S.btnSm} onClick={() => handleViewTxs(acc)}>{lang.system.transactionsLabel}</button>
                    <button style={S.btnRed} onClick={() => handleDisconnect(conn.id)}>{lang.system.disconnectButton}</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {step === 'institutions' && (
        <>
          <button style={S.btnSm} onClick={() => setStep('main')} disabled={loading}>← {lang.banking.back}</button>
          <div style={{ marginTop: 10 }}>
            {institutions.slice(0, 30).map(inst => (
              <div key={inst.id} style={{ ...S.row, cursor: 'pointer' }} onClick={() => handleSelectInst(inst.id, inst.name)}>
                <span style={{ color: '#ccc', fontSize: 12 }}>{inst.name}</span>
              </div>
            ))}
            {institutions.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>{lang.banking.noInstitutions}</div>}
          </div>
        </>
      )}

      {step === 'txs' && selAccount && (
        <>
          <button style={S.btnSm} onClick={() => { setStep('main'); setSelAccount(null) }}>← {lang.banking.back}</button>
          <div style={{ color: '#FFD700', fontSize: 12, marginTop: 8, marginBottom: 6 }}>{selAccount.name} — {selAccount.iban}</div>
          {txs.length === 0 && !loading && <div style={{ color: '#555', fontSize: 12 }}>{lang.system.noTransactions}</div>}
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
      {loading && <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>{lang.system.loading}</div>}
    </div>
  )
}

type CheckingRecord = {
  date: string; valueDate: string; reference: string; description: string
  debit: number; credit: number; runningBalance: number
}
type CreditRecord = {
  purchaseDate: string; merchantName: string
  transactionAmount: number; transactionCurrency: string
  chargeAmount: number; chargeCurrency: string
  voucherNumber: string; additionalDetail: string
}

function csvEscape(value: string): string {
  return value.replace(/"/g, '""')
}

function periodLabel(dates: string[]): string {
  const valid = dates.filter(Boolean).sort()
  if (valid.length === 0) return ''
  const first = valid[0]; const last = valid[valid.length - 1]
  return first === last ? first : `${first} - ${last}`
}

function generateCheckingCSV(institutionName: string, accountNumber: string, records: CheckingRecord[]): string {
  const reportDate = new Date().toLocaleDateString('he-IL') + ' ' + new Date().toLocaleTimeString('he-IL')
  const rows: string[] = [
    csvEscape(institutionName),
    'תנועות בחשבון עו"ש',
    'תנועות עו"ש',
    '',
    `חשבון,"${accountNumber}"`,
    `מועד הפקת הדוח,"${reportDate}"`,
    '',
    'תאריך,תאריך ערך,אסמכתא,תיאור פעולה,חובה,זכות,יתרה משוערכת',
  ]
  for (const r of records) {
    const debit  = r.debit  ? r.debit.toFixed(2)  : '0.00'
    const credit = r.credit ? r.credit.toFixed(2) : '0.00'
    rows.push(`"${csvEscape(r.date)}","${csvEscape(r.valueDate)}","${csvEscape(r.reference)}","${csvEscape(r.description)}",${debit},${credit},${r.runningBalance.toFixed(2)}`)
  }
  return rows.join('\r\n')
}

function generateCreditCSV(institutionName: string, cardLabel: string, last4Digits: string, cardholderName: string, billingMonth: string, records: CreditRecord[], monthlyTotal: number): string {
  const rows: string[] = [
    csvEscape(institutionName),
    'פירוט עסקאות',
    billingMonth,
    '',
    `${csvEscape(cardLabel)} - ${last4Digits}`,
    `על שם ${csvEscape(cardholderName)}`,
    '',
    'עסקאות למועד חיוב',
    'תאריך רכישה,שם בית עסק,סכום עסקה,מטבע עסקה,סכום חיוב,מטבע חיוב,מס\' שובר,פירוט נוסף',
  ]
  for (const r of records) {
    rows.push(`"${csvEscape(r.purchaseDate)}","${csvEscape(r.merchantName)}",${r.transactionAmount.toFixed(2)},${r.transactionCurrency},${r.chargeAmount.toFixed(2)},${r.chargeCurrency},"${csvEscape(r.voucherNumber)}","${csvEscape(r.additionalDetail)}"`)
  }
  rows.push(`סה"כ לחיוב החודש בכרטיס בש"ח,,,,${monthlyTotal.toFixed(2)},,,`)
  return rows.join('\r\n')
}

function buildDownloadFileName(institutionName: string, accountOrCardNumber: string, fileType: 'bank' | 'credit'): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateTime = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}.${pad(now.getHours())}.${pad(now.getMinutes())}`
  const safeName = institutionName.replace(/[^a-zA-Z0-9א-ת]/g, '_')
  const prefix = fileType === 'credit' ? 'MF_credit' : 'MF_bank'
  return `${prefix}_${safeName}_${accountOrCardNumber}_${dateTime}.csv`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const picker = (window as unknown as { showSaveFilePicker?: (opts: unknown) => Promise<{ createWritable: () => Promise<{ write: (b: Blob) => Promise<void>; close: () => Promise<void> }> }> }).showSaveFilePicker
  if (picker) {
    try {
      const handle = await picker({ suggestedName: filename, types: [{ description: 'CSV', accept: { 'text/csv': ['.csv'] } }] })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (e) {
      if ((e as { name?: string })?.name === 'AbortError') throw e
      // showSaveFilePicker unsupported/failed for another reason — fall back below
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
  await new Promise(res => setTimeout(res, 300))
}

function BankingLayout({ loading, selectedCountry, hasConnections, hasSelection, showDownloadArrow, showSelectArrow, onSelectCountry, onDownload, onRefresh, b, children, controlBarOffset, hideControlBar }: {
  loading: boolean; selectedCountry: string; hasConnections: boolean; hasSelection: boolean; showDownloadArrow: boolean; showSelectArrow?: boolean
  onSelectCountry: (country: string) => void; onDownload: () => void; onRefresh: () => void
  b: typeof languages[0]['banking']
  children: React.ReactNode
  controlBarOffset?: number
  hideControlBar?: boolean
}) {
  const asideBtn: React.CSSProperties = {
    background: 'none', border: '1px solid #cc9900', borderRadius: 4,
    color: '#fff', padding: '7px 4px', cursor: 'pointer',
    fontSize: 20, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.3,
  }
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollLeft = contentRef.current.scrollWidth
  })
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
      <div ref={contentRef} style={{ position: 'relative', flex: 1, overflow: 'auto', padding: '14px 18px', ...GRANITE_BG, direction: 'rtl', boxSizing: 'border-box' }}>
        {children}
      </div>

      {/* סרגל בקרה */}
      {!hideControlBar && (
        <aside style={{ width: '110px', alignSelf: 'center', background: '#2a2a2a', border: '2px solid #FFD700', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, margin: `${10 - (controlBarOffset ?? 0)}px 2px 10px 0`, borderRadius: '12px', overflow: 'visible', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: 16, padding: '18px 6px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <button style={asideBtn} disabled={loading} onClick={() => onSelectCountry(selectedCountry)}>{b.selectInstitution}</button>
              {showSelectArrow && !loading && (
                <div style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'row', alignItems: 'center', pointerEvents: 'none', zIndex: 10 }}>
                  <div style={{ width: 39, height: 12, background: 'red' }} />
                  <div style={{ width: 0, height: 0, borderTop: '24px solid transparent', borderBottom: '24px solid transparent', borderLeft: '33px solid red' }} />
                </div>
              )}
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <button style={{ ...asideBtn, opacity: (loading || !hasSelection) ? 0.5 : 1 }} disabled={loading || !hasSelection} onClick={onDownload}>{b.downloadFiles}</button>
              {showDownloadArrow && !loading && (
                <div style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'row', alignItems: 'center', pointerEvents: 'none', zIndex: 10 }}>
                  <div style={{ width: 39, height: 12, background: 'red' }} />
                  <div style={{ width: 0, height: 0, borderTop: '24px solid transparent', borderBottom: '24px solid transparent', borderLeft: '33px solid red' }} />
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

function BankingPage({ user, lang, directInstitutions, pendingBankSession, onConsumeBankSession, onDbg }: { user: UserRecord | null; lang: typeof languages[0]; directInstitutions?: boolean; pendingBankSession?: string | null; onConsumeBankSession?: () => void; onDbg?: (func: string, msg: string) => void }) {
  const dir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [accounts, setAccounts]       = useState<BankAccount[]>([])
  const [bsession, setBsession]       = useState<string | null>(null)
  const [txs, setTxs]                 = useState<BankTx[]>([])
  const [selAccount, setSelAccount]   = useState<BankAccount | null>(null)
  const [institutions, setInstitutions] = useState<{ id: string; name: string; logo?: string }[]>([])
  const [step, setStep]               = useState<'main' | 'institutions' | 'download' | 'txs'>(directInstitutions ? 'institutions' : 'main')
  const [selectedCountry, setSelectedCountry] = useState('DE')
  const [selectedInstitutionName, setSelectedInstitutionName] = useState('')
  const [selectedInstitutionCountry, setSelectedInstitutionCountry] = useState('')
  const [filesDownloaded, setFilesDownloaded] = useState(false)
  const [dataRead, setDataRead] = useState(false)
  const [simConnected, setSimConnected] = useState(false)
  const [disconnected, setDisconnected] = useState(false)
  const [closeClicked, setCloseClicked] = useState(false)
  const [showDownloadTypeDialog, setShowDownloadTypeDialog] = useState(false)
  const [sysLog, setSysLog] = useState<{ time: string; text: string; highlight?: string }[]>([])
  const logMsg = (text: string, highlight?: string) => setSysLog(prev => [...prev, { time: new Date().toLocaleTimeString('he-IL'), text, highlight }])
  const ltr = (s: string) => `⁦${s}⁩`
  const [loading, setLoading]         = useState(false)
  const [msg, setMsg]                 = useState('')
  const [msgIsError, setMsgIsError]   = useState(false)
  const [dbInstitutions, setDbInstitutions] = useState<FinancialInstitutionRecord[]>([])
  const b = lang.banking

  const setError = (text: string) => { setMsg(text); setMsgIsError(true) }
  const setInfo  = (text: string) => { setMsg(text); setMsgIsError(false) }

  useEffect(() => {
    if (!pendingBankSession) return
    decodeBankSession(pendingBankSession)
    onConsumeBankSession?.()
  }, [pendingBankSession])
  useEffect(() => {
    fetch('/api/banking/institutions').then(r => r.json()).then(d => setDbInstitutions(d.institutions ?? [])).catch(() => {})
  }, [])

  function findDbInstitution(file: string, bank: string): FinancialInstitutionRecord | undefined {
    const iso = COUNTRY_ISO[file]
    const englishName = ISRAEL_BANK_LATIN[bank] ?? bank
    return dbInstitutions.find(i => i.country_code === iso && i.institution_name === englishName)
  }

  function instFrame(file: string, bank: string): { border: string; disabled: boolean } {
    const inst = findDbInstitution(file, bank)
    if (!inst?.system_enable_flag) return { border: '2px solid transparent', disabled: true }
    if (inst.institution_code) return { border: '2px solid #22aa44', disabled: false }
    if (inst.system_simulation_mode) return { border: '2px solid #ccaa00', disabled: false }
    return { border: '2px solid transparent', disabled: true }
  }

  async function decodeBankSession(blob: string) {
    onDbg?.('decodeBankSession', `blob.length=${blob.length} fetch POST /api/banking/session/decode`)
    setLoading(true)
    try {
      const r = await fetch('/api/banking/session/decode', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bsession: blob }),
      })
      const d = await r.json()
      onDbg?.('decodeBankSession', `res.status=${r.status} res.ok=${r.ok} connections=${(d.connections ?? []).length} accounts=${(d.accounts ?? []).length}`)
      ;(d.connections ?? []).forEach((c: BankConnection) => onDbg?.('decodeBankSession', `connection id=${c.id} provider=${c.provider} institution="${c.institution_name}" status=${c.status}`))
      ;(d.accounts ?? []).forEach((a: BankAccount) => onDbg?.('decodeBankSession', `account id=${a.id} iban="${a.iban}" name="${a.name}" type=${a.account_type} currency=${a.currency} balance=${a.balance}`))
      if (!r.ok) return
      setConnections(d.connections ?? [])
      setAccounts(d.accounts ?? [])
      setBsession(blob)
    } catch (e) { onDbg?.('decodeBankSession', `failed err="${String(e)}"`) } finally { setLoading(false) }
  }

  async function loadInstitutions(country: string) {
    setSelectedCountry(country)
    setLoading(true); setMsg('')
    try {
      const inst = await fetch(`/api/banking/nordigen/institutions?country=${country}`).then(r => r.json())
      setInstitutions(Array.isArray(inst) ? inst : [])
      setStep('institutions')
    } catch { setError(b.loadBanksError) }
    finally { setLoading(false) }
  }

  async function handleAutoDetect() {
    setLoading(true); setMsg('')
    try {
      const dp = await fetch('/api/banking/detect-provider', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang.code }),
      }).then(r => r.json())
      if (dp.provider === 'nordigen') {
        await loadInstitutions(dp.country ?? 'DE')
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
      await loadInstitutions(selectedCountry)
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
                  body: JSON.stringify({ publicToken, institutionName: metadata?.institution?.name ?? 'Bank' }),
                }).then(r => r.json())
                if (res.ok) {
                  setConnections(res.connections ?? [])
                  setAccounts(res.accounts ?? [])
                  setBsession(res.bsession ?? null)
                  setInfo(b.bankConnected)
                }
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

  function handleSelectInstitution(instId: string, instName: string, countryFile?: string) {
    onDbg?.('handleSelectInstitution', `instId="${instId}" instName="${instName}" countryFile="${countryFile ?? ''}" user=${!!user}`)
    if (!user) return
    setSelectedInstitutionName(instName)
    setFilesDownloaded(false)
    setDataRead(false)
    setSimConnected(false)
    setDisconnected(false)
    setSysLog([])
    if (countryFile) setSelectedInstitutionCountry(countryFile)
  }

  function handleSimConnect() {
    onDbg?.('handleSimConnect', `institution="${bankName(selectedInstitutionName)}" isSimulationSelected=${isSimulationSelected}`)
    logMsg(b.connectingToInstitution.replace('{name}', bankName(selectedInstitutionName)))
    setInfo(b.connectedStatus)
    logMsg(b.connectDoneMsg.replace('{name}', bankName(selectedInstitutionName)))
    setSimConnected(true)
    setTimeout(() => setMsg(''), 2000)
  }

  async function handleDisconnectSelected() {
    onDbg?.('handleDisconnectSelected', `institution="${bankName(selectedInstitutionName)}" isSimulationSelected=${isSimulationSelected}`)
    setLoading(true)
    logMsg(b.disconnectingFromInstitution.replace('{name}', bankName(selectedInstitutionName)))
    if (isSimulationSelected) {
      setSimConnected(false)
    } else {
      const conn = connections.find(c => c.institution_name === bankName(selectedInstitutionName))
      onDbg?.('handleDisconnectSelected', `found_connection=${!!conn} connection_id=${conn?.id ?? 'none'}`)
      if (conn) {
        // Nothing is persisted server-side to revoke — the session lives only in this tab.
        setConnections([]); setAccounts([]); setBsession(null)
      }
    }
    logMsg(b.disconnectDoneMsg)
    setDisconnected(true)
    setLoading(false)
    setTimeout(() => setMsg(''), 2000)
  }

  async function handleReadData() {
    onDbg?.('handleReadData', `institution="${bankName(selectedInstitutionName)}" bsession.present=${!!bsession}`)
    setLoading(true)
    logMsg(b.readingDataMsg)
    await handleRefresh()
    logMsg(b.readingDataDoneMsg)
    setDataRead(true)
    setLoading(false)
  }

  async function handleLoadToApp() {
    const importToken = Date.now().toString()
    onDbg?.('handleLoadToApp', `token=${importToken} bsession.present=${!!bsession} bsession.length=${bsession?.length ?? 0} isSimulationSelected=${isSimulationSelected}`)
    logMsg(`שולח התראה לאפליקציה (token=${importToken})`)
    // iframe נסתר (לא window.location.href ישיר) — מונע ניווט/beforeunload בדף הראשי
    // אם הפרוטוקול mfinance:// לא רשום בדפדפן הבדיקה הנוכחי (M_Finance לא מותקן/רץ)
    onDbg?.('handleLoadToApp', `launch mfinance://import?token=${importToken} via hidden iframe`)
    const importFrame = document.createElement('iframe')
    importFrame.style.display = 'none'
    importFrame.src = `mfinance://import?token=${importToken}`
    document.body.appendChild(importFrame)
    window.focus() // מיד, לא ב-setTimeout - כדי להישאר בתוך חלון-הזמן ש"קשור" ללחיצת המשתמש
    setTimeout(() => document.body.removeChild(importFrame), 1000)
    // TODO: אין עדיין API אמיתי מול M_Finance מעבר לשליחת ההתראה - זה שלד זמני עד שהחיבור המקומי ייבנה
    setLoading(true)
    logMsg(b.loadingDataMsg)
    try {
      if (isSimulationSelected) {
        const checking = await fetch('/simulation/yahav-checking.json').then(r => r.json())
        const credit = await fetch('/simulation/isracard-credit.json').then(r => r.json())
        onDbg?.('handleLoadToApp', `sim checking.records=${(checking.records ?? []).length} credit.records=${(credit.records ?? []).length}`)
        ;(checking.records ?? []).forEach((r: CheckingRecord) => onDbg?.('handleLoadToApp', `sim checking date=${r.date} desc="${r.description}" debit=${r.debit} credit=${r.credit} balance=${r.runningBalance}`))
        ;(credit.records ?? []).forEach((r: CreditRecord) => onDbg?.('handleLoadToApp', `sim credit date=${r.purchaseDate} desc="${r.merchantName}" amount=${r.transactionAmount} charge=${r.chargeAmount}`))
        logMsg(b.accountStatementMsg.replace('{id}', checking.accountNumber).replace('{period}', periodLabel((checking.records ?? []).map((r: CheckingRecord) => r.date))))
        logMsg(b.creditStatementMsg.replace('{id}', credit.last4Digits).replace('{period}', periodLabel((credit.records ?? []).map((r: CreditRecord) => r.purchaseDate))))
        logMsg(b.totalFilesMsg.replace('{count}', '2'))
      } else if (user) {
        const accs: BankAccount[] = accounts
        onDbg?.('handleLoadToApp', `accounts=${accs.length} ids="${accs.map(a => a.id).join(',')}"`)
        for (const acc of accs) {
          const idLabel = acc.iban || acc.name
          const url = `/api/banking/transactions?accountId=${acc.id}&bsession=${encodeURIComponent(bsession ?? '')}`
          onDbg?.('handleLoadToApp', `fetch GET url="${url}"`)
          const tr = await fetch(url).then(r2 => r2.json())
          onDbg?.('handleLoadToApp', `account_id=${acc.id} type=${acc.account_type} transactions=${(tr.transactions ?? []).length}`)
          ;(tr.transactions ?? []).forEach((tx: BankTx) => onDbg?.('handleLoadToApp', `tx id=${tx.id} date=${tx.date} desc="${tx.description}" amount=${tx.amount} currency=${tx.currency}`))
          const period = periodLabel(((tr.transactions ?? []) as BankTx[]).map(tx => tx.date))
          logMsg((acc.account_type === 'credit' ? b.creditStatementMsg : b.accountStatementMsg).replace('{id}', idLabel).replace('{period}', period))
        }
        logMsg(b.totalFilesMsg.replace('{count}', String(accs.length)))
      }
      setInfo(b.doneStatus)
      logMsg(b.dataLoadedDoneMsg)
      setFilesDownloaded(true)
    } catch (e) {
      onDbg?.('handleLoadToApp', `failed err="${String(e)}"`)
      setError(b.downloadError)
      logMsg(b.loadDataErrorMsg)
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 2000)
    }
  }

  async function handleRefresh() {
    setLoading(true); setInfo(b.refreshing)
    if (bsession) await decodeBankSession(bsession)
    setInfo(b.updated)
    setTimeout(() => setMsg(''), 2000)
  }

  function handleDisconnect(_connectionId: string) {
    // Nothing is persisted server-side to revoke — the session lives only in this tab.
    setConnections([]); setAccounts([]); setBsession(null)
  }

  async function handleViewTxs(account: BankAccount) {
    onDbg?.('handleViewTxs', `account_id=${account.id} iban="${account.iban}" type=${account.account_type}`)
    setSelAccount(account); setStep('txs'); setLoading(true); setTxs([])
    try {
      const r = await fetch(`/api/banking/transactions?accountId=${account.id}&bsession=${encodeURIComponent(bsession ?? '')}`)
      const d = await r.json()
      onDbg?.('handleViewTxs', `res.status=${r.status} transactions=${(d.transactions ?? []).length}`)
      setTxs(d.transactions ?? [])
    } catch (e) { onDbg?.('handleViewTxs', `failed err="${String(e)}"`) } finally { setLoading(false) }
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
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...GRANITE_BG }}>
      <div style={{ color: '#555', fontSize: 16 }}>{lang.profile.loginRequired}</div>
    </div>
  )

  async function handleDownloadAll() {
    onDbg?.('handleDownloadAll', `user=${!!user} accounts=${accounts.length} bsession.present=${!!bsession}`)
    if (!user) return
    setLoading(true); setInfo(b.fetchingData)
    logMsg(b.downloadingFilesMsg)
    try {
      const conns: BankConnection[] = connections
      const accs: BankAccount[]     = accounts
      if (accs.length === 0) { setError(b.noAccountsConnected); return }
      let count = 0
      for (const acc of accs) {
        const conn = conns.find(c => c.id === acc.connection_id)
        const institutionName = conn?.institution_name ?? acc.name
        const tr = await fetch(`/api/banking/transactions?accountId=${acc.id}&bsession=${encodeURIComponent(bsession ?? '')}`).then(r2 => r2.json())
        const txList: BankTx[] = tr.transactions ?? []
        onDbg?.('handleDownloadAll', `account_id=${acc.id} institution="${institutionName}" type=${acc.account_type} transactions=${txList.length}`)
        let csv: string
        if (acc.account_type === 'credit') {
          const records: CreditRecord[] = txList.map(tx => ({
            purchaseDate: tx.date, merchantName: tx.description,
            transactionAmount: Math.abs(tx.amount), transactionCurrency: tx.currency || '₪',
            chargeAmount: Math.abs(tx.amount), chargeCurrency: tx.currency || '₪',
            voucherNumber: String(tx.id), additionalDetail: tx.category ?? '',
          }))
          const monthlyTotal = records.reduce((sum, r) => sum + r.chargeAmount, 0)
          csv = generateCreditCSV(institutionName, acc.name, acc.iban || '', '', '', records, monthlyTotal)
        } else {
          let running = acc.balance
          const records: CheckingRecord[] = txList.map((tx, i) => {
            if (i > 0) {
              const prev = txList[i - 1]
              running = running - (prev.amount > 0 ? prev.amount : 0) + (prev.amount < 0 ? Math.abs(prev.amount) : 0)
            }
            return {
              date: tx.date, valueDate: tx.date, reference: String(tx.id), description: tx.description,
              debit: tx.amount < 0 ? Math.abs(tx.amount) : 0, credit: tx.amount > 0 ? tx.amount : 0,
              runningBalance: running,
            }
          })
          csv = generateCheckingCSV(institutionName, acc.iban || acc.name, records)
        }
        const fileName = buildDownloadFileName(institutionName, acc.iban || String(acc.id), acc.account_type === 'credit' ? 'credit' : 'bank')
        const fileNameLtr = ltr(fileName)
        const period = periodLabel(txList.map(tx => tx.date))
        onDbg?.('handleDownloadAll', `fileName="${fileName}" csv.length=${csv.length} => downloadCSV()`)
        await downloadCSV(csv, fileName)
        onDbg?.('handleDownloadAll', `downloadCSV done fileName="${fileName}"`)
        logMsg(b.fileDownloadedForPeriodMsg.replace('{file}', fileNameLtr).replace('{period}', period), fileNameLtr)
        count++
      }
      setInfo(b.downloadedFiles.replace('{count}', String(count)))
      logMsg(b.totalFilesMsg.replace('{count}', String(count)))
      setFilesDownloaded(true)
    } catch (e) {
      if ((e as { name?: string })?.name !== 'AbortError') { setError(b.downloadError); logMsg(b.downloadFilesErrorMsg) }
    }
    finally { setLoading(false) }
  }

  const hasConnections = connections.length > 0

  const BROWN = '#6b4423'

  type FlagCountry = { file: string; iso?: string }

  const ALL_COUNTRIES: FlagCountry[] = [
    { file: 'בריטניה', iso: 'GB' },
    { file: 'גרמניה', iso: 'DE' },
    { file: 'צרפת', iso: 'FR' },
    { file: 'ספרד', iso: 'ES' },
    { file: 'איטליה', iso: 'IT' },
    { file: 'רוסיה', iso: 'RU' },
    { file: 'ארצות-הברית' },
    { file: 'יפן' },
    { file: 'סין' },
    { file: 'הודו' },
    { file: 'ישראל' },
    { file: 'סעודיה' },
  ]

  function handleCountryClick(c: FlagCountry) {
    if (c.iso) loadInstitutions(c.iso)
    else if (c.file === 'ארצות-הברית') handleSelectRegion('plaid')
    else setError('לא נתמך כרגע')
  }

  const COUNTRY_ISO: Record<string, string> = {
    'בריטניה': 'GB', 'גרמניה': 'DE', 'צרפת': 'FR', 'ספרד': 'ES', 'איטליה': 'IT', 'רוסיה': 'RU',
    'ארצות-הברית': 'US', 'יפן': 'JP', 'סין': 'CN', 'הודו': 'IN', 'ישראל': 'IL', 'סעודיה': 'SA',
  }
  function countryName(file: string): string {
    const iso = COUNTRY_ISO[file]
    if (!iso) return file.replace('-', ' ')
    try { return new Intl.DisplayNames([lang.code], { type: 'region' }).of(iso) ?? file.replace('-', ' ') }
    catch { return file.replace('-', ' ') }
  }

  const BANKS: Record<string, string[]> = {
    'בריטניה': ['Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander UK'],
    'רוסיה': ['Sberbank', 'VTB', 'Gazprombank', 'Alfa-Bank'],
    'ארצות-הברית': ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Goldman Sachs', 'Morgan Stanley'],
    'גרמניה': ['Deutsche Bank', 'Commerzbank', 'DZ Bank', 'KfW'],
    'צרפת': ['BNP Paribas', 'Société Générale', 'Crédit Agricole', 'La Banque Postale', 'Crédit Mutuel'],
    'ספרד': ['Santander', 'BBVA', 'CaixaBank', 'Bankinter'],
    'איטליה': ['UniCredit', 'Intesa Sanpaolo', 'Banco BPM', 'BPER Banca'],
    'יפן': ['MUFG', 'Mizuho', 'SMBC', 'Japan Post Bank'],
    'סין': ['ICBC', 'Bank of China', 'CCB', 'ABC', 'Bank of Communications'],
    'הודו': ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak Mahindra'],
    'ישראל': ['בנק הפועלים', 'בנק לאומי', 'בנק דיסקונט', 'בנק מזרחי', 'הבנק הבינלאומי', 'בנק יהב', 'בנק מסד', 'בנק ברקליס', 'בנק ירושלים', 'ישראכרט', 'כאל', 'מקס', 'אמריקן אקספרס'],
    'סעודיה': ['Al Rajhi Bank', 'SNB', 'Riyad Bank', 'Banque Saudi Fransi'],
  }

  const ISRAEL_BANK_LATIN: Record<string, string> = {
    'בנק הפועלים': 'Bank Hapoalim', 'בנק לאומי': 'Bank Leumi', 'בנק דיסקונט': 'Discount Bank',
    'בנק מזרחי': 'Mizrahi Bank', 'הבנק הבינלאומי': 'The International Bank', 'בנק יהב': 'Bank Yahav', 'בנק מסד': 'Bank Massad',
    'בנק ברקליס': 'Barclays', 'בנק ירושלים': 'Bank of Jerusalem', 'ישראכרט': 'Isracard',
    'כאל': 'Cal', 'מקס': 'Max', 'אמריקן אקספרס': 'American Express',
  }
  function bankName(bank: string): string {
    return lang.code === 'he' ? bank : (ISRAEL_BANK_LATIN[bank] ?? bank)
  }

  function BankLabels({ file, bottomStart, left }: { file: string; bottomStart: number; left: number }) {
    return (
      <>
        {BANKS[file].map((bank, i) => { const f = instFrame(file, bank); return (
          <button key={`${file}-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, file)} disabled={loading || f.disabled}
            style={{ position: 'absolute', bottom: bottomStart + i * 46 - 6, left: left + 24, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}
      </>
    )
  }

  function Ticks({ file, bottomStart, left }: { file: string; bottomStart: number; left: number }) {
    return (
      <>
        {BANKS[file].map((_, i) => (
          <div key={`${file}-tick-${i}`} style={{ position: 'absolute', bottom: bottomStart + i * 46, left, width: 20, height: 2, background: BROWN }} />
        ))}
      </>
    )
  }

  if (step === 'institutions') return (
    <BankingLayout loading={loading} selectedCountry={selectedCountry} hasConnections={hasConnections} hasSelection={!!selectedInstitutionName} showDownloadArrow={!!selectedInstitutionName}
      onSelectCountry={loadInstitutions} onDownload={() => setStep('download')} onRefresh={handleRefresh} b={b}>
      <PageHeader subtitle={lang.menu[4]} lang={lang} extra={
        <div style={{ display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center', background: 'linear-gradient(180deg, #d3213a, #8e0f22)', color: '#ffffff', padding: '8px 26px', borderRadius: '999px', boxShadow: '0 8px 18px -8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)', fontFamily: 'Arial, sans-serif', fontWeight: 'normal', fontSize: '20px' }}>
          {b.selectInstitution}
        </div>
      } />
      <div style={{ position: 'absolute', top: 50, right: 10, fontFamily: handFont(lang.code), color: 'red', fontSize: 40, fontWeight: 'bold', zIndex: 2, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
        {b.decorWorldwide}
      </div>
      <div style={{ position: 'relative', height: '100%', minHeight: 60, minWidth: 1550 }}>
        {/* ארצות הברית - פינה שמאלית, ראשונה */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'ארצות-הברית')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/ארצות-הברית.png`} alt="ארצות הברית" width={28} height={28} />
          {countryName('ארצות-הברית')}
        </button>

        {/* קו מארצות הברית - נעצר במוסד האחרון של בריטניה */}
        <div style={{ position: 'absolute', top: 66, left: 99, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="ארצות-הברית" bottomStart={10} left={99} />
        <BankLabels file="ארצות-הברית" bottomStart={10} left={99} />

        {/* בריטניה - אחרי ארצות הברית */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'בריטניה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/בריטניה.png`} alt="בריטניה" width={28} height={28} />
          {countryName('בריטניה')}
        </button>

        {/* קו קצר מבריטניה, נשאר למעלה */}
        <div style={{ position: 'absolute', top: 66, left: 212, height: 218, width: 2, background: BROWN }} />
        {BANKS['בריטניה'].map((_, i) => (
          <div key={`gb-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 212, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['בריטניה'].map((bank, i) => { const f = instFrame('בריטניה', bank); return (
          <button key={`gb-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'בריטניה')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 236, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        {/* רוסיה - אחרי בריטניה */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'רוסיה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/רוסיה.png`} alt="רוסיה" width={28} height={28} />
          {countryName('רוסיה')}
        </button>

        {/* קו מרוסיה - ממורכז מתחת לתווית, נעצר אחרי המוסד האחרון של רוסיה עצמה */}
        <div style={{ position: 'absolute', top: 66, left: 360, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="רוסיה" bottomStart={10} left={360} />
        <BankLabels file="רוסיה" bottomStart={10} left={360} />

        {/* עמודה 2: גרמניה → צרפת → ספרד */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'גרמניה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 372, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/גרמניה.png`} alt="גרמניה" width={28} height={28} />
          {countryName('גרמניה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 410, height: 184, width: 2, background: BROWN }} />
        {BANKS['גרמניה'].map((_, i) => (
          <div key={`de-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 410, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['גרמניה'].map((bank, i) => { const f = instFrame('גרמניה', bank); return (
          <button key={`de-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'גרמניה')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 434, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'צרפת')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/צרפת.png`} alt="צרפת" width={28} height={28} />
          {countryName('צרפת')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 549, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="צרפת" bottomStart={10} left={549} />
        <BankLabels file="צרפת" bottomStart={10} left={549} />

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'ישראל')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/ישראל.png`} alt="ישראל" width={28} height={28} />
          {countryName('ישראל')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 723, height: 554, width: 2, background: BROWN }} />
        {BANKS['ישראל'].map((_, i) => (
          <div key={`il-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 723, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['ישראל'].map((bank, i) => { const f = instFrame('ישראל', bank); return (
          <button key={`il-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'ישראל')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 747, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'ספרד')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/ספרד.png`} alt="ספרד" width={28} height={28} />
          {countryName('ספרד')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 849, height: 184, width: 2, background: BROWN }} />
        {BANKS['ספרד'].map((_, i) => (
          <div key={`es-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 849, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['ספרד'].map((bank, i) => { const f = instFrame('ספרד', bank); return (
          <button key={`es-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'ספרד')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 873, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        {/* עמודה 3: איטליה → יפן → סין */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'איטליה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 950, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/יפן.png`} alt="יפן" width={28} height={28} />
          {countryName('יפן')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 976, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="יפן" bottomStart={10} left={976} />
        <BankLabels file="יפן" bottomStart={10} left={976} />

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'סעודיה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 1005, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/סעודיה.png`} alt="סעודיה" width={28} height={28} />
          {countryName('סעודיה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1033, height: 184, width: 2, background: BROWN }} />
        {BANKS['סעודיה'].map((_, i) => (
          <div key={`sa-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 1033, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['סעודיה'].map((bank, i) => { const f = instFrame('סעודיה', bank); return (
          <button key={`sa-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'סעודיה')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 1057, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'סין')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 1170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/סין.png`} alt="סין" width={28} height={28} />
          {countryName('סין')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1196, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="סין" bottomStart={10} left={1196} />
        <BankLabels file="סין" bottomStart={10} left={1196} />

        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'איטליה')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 1250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/איטליה.png`} alt="איטליה" width={28} height={28} />
          {countryName('איטליה')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1288, height: 184, width: 2, background: BROWN }} />
        {BANKS['איטליה'].map((_, i) => (
          <div key={`it-tick-${i}`} style={{ position: 'absolute', top: 90 + i * 46, left: 1288, width: 20, height: 2, background: BROWN }} />
        ))}
        {BANKS['איטליה'].map((bank, i) => { const f = instFrame('איטליה', bank); return (
          <button key={`it-bank-${i}`} onClick={() => handleSelectInstitution(bank, bank, 'איטליה')} disabled={loading || f.disabled}
            style={{ position: 'absolute', top: 84 + i * 46, left: 1312, background: bank === selectedInstitutionName ? '#cc0000' : BROWN, color: '#fff', border: f.border, borderRadius: 5, padding: '3px 8px', cursor: (loading || f.disabled) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', opacity: f.disabled ? 0.55 : 1 }}>
            {bankName(bank)}
          </button>
        )})}

        {/* עמודה 4: הודו */}
        <button onClick={() => handleCountryClick(ALL_COUNTRIES.find(c => c.file === 'הודו')!)} disabled={loading}
          style={{ position: 'absolute', top: 0, left: 1380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', zIndex: 1 }}>
          <Image src={`/flags/הודו.png`} alt="הודו" width={28} height={28} />
          {countryName('הודו')}
        </button>
        <div style={{ position: 'absolute', top: 66, left: 1409, bottom: 0, width: 2, background: BROWN }} />
        <Ticks file="הודו" bottomStart={10} left={1409} />
        <BankLabels file="הודו" bottomStart={10} left={1409} />
      </div>

      {/* רשת מוסדות */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginTop: 24 }}>
        {institutions.map(inst => (
          <div key={inst.id} onClick={() => handleSelectInstitution(inst.id, inst.name)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: '14px 8px',
              cursor: 'pointer', textAlign: 'center', minHeight: 90, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,51,153,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none' }}>
            {inst.logo ? (
              <img src={inst.logo} alt={inst.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef2ff', color: '#003399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 15 }}>
                {inst.name.slice(0, 1)}
              </div>
            )}
            <span style={{ fontSize: 12, color: '#222', lineHeight: 1.3 }}>{inst.name}</span>
          </div>
        ))}
      </div>
      {loading && <div style={{ color: '#aaa', fontSize: 14, marginTop: 20 }}>...</div>}
      {msg && <div style={{ color: msgIsError ? '#cc0000' : '#006600', fontSize: 14, marginTop: 14 }}>{msg}</div>}
    </BankingLayout>
  )

  const selectedInstDbRecord = selectedInstitutionName && selectedInstitutionCountry
    ? findDbInstitution(selectedInstitutionCountry, selectedInstitutionName)
    : undefined
  const isSimulationSelected = !!selectedInstDbRecord?.system_simulation_mode && !selectedInstDbRecord?.institution_code

  async function handleConnectSelected() {
    if (!selectedInstDbRecord?.provider_code) return
    if (selectedInstDbRecord.provider_code === 'plaid') await handleSelectRegion('plaid')
    else await handleSelectRegion('nordigen')
  }

  async function handleSimulationDownload() {
    onDbg?.('handleSimulationDownload', `institution="${bankName(selectedInstitutionName)}"`)
    setLoading(true); setInfo(b.fetchingData)
    try {
      const checking = await fetch('/simulation/yahav-checking.json').then(r => r.json())
      const checkingCsv = generateCheckingCSV(checking.institutionName, checking.accountNumber, checking.records)
      const checkingFileName = buildDownloadFileName(bankName(selectedInstitutionName), checking.accountNumber, 'bank')
      const checkingFileNameLtr = ltr(checkingFileName)
      const checkingPeriod = periodLabel((checking.records ?? []).map((r: CheckingRecord) => r.date))
      onDbg?.('handleSimulationDownload', `fileName="${checkingFileName}" records=${(checking.records ?? []).length} => downloadCSV()`)
      await downloadCSV(checkingCsv, checkingFileName)
      onDbg?.('handleSimulationDownload', `downloadCSV done fileName="${checkingFileName}"`)
      logMsg(b.fileDownloadedForPeriodMsg.replace('{file}', checkingFileNameLtr).replace('{period}', checkingPeriod), checkingFileNameLtr)

      const credit = await fetch('/simulation/isracard-credit.json').then(r => r.json())
      const creditCsv = generateCreditCSV(credit.institutionName, credit.cardLabel, credit.last4Digits, credit.cardholderName, credit.billingMonth, credit.records, credit.monthlyTotal)
      const creditFileName = buildDownloadFileName(credit.institutionName, credit.last4Digits, 'credit')
      const creditFileNameLtr = ltr(creditFileName)
      const creditPeriod = periodLabel((credit.records ?? []).map((r: CreditRecord) => r.purchaseDate))
      onDbg?.('handleSimulationDownload', `fileName="${creditFileName}" records=${(credit.records ?? []).length} => downloadCSV()`)
      await downloadCSV(creditCsv, creditFileName)
      onDbg?.('handleSimulationDownload', `downloadCSV done fileName="${creditFileName}"`)
      logMsg(b.fileDownloadedForPeriodMsg.replace('{file}', creditFileNameLtr).replace('{period}', creditPeriod), creditFileNameLtr)

      setInfo(b.downloadedFiles.replace('{count}', '2'))
      logMsg(b.totalFilesMsg.replace('{count}', '2'))
      setFilesDownloaded(true)
    } catch (e) {
      onDbg?.('handleSimulationDownload', `err.name="${(e as { name?: string })?.name ?? ''}" err="${String(e)}"`)
      if ((e as { name?: string })?.name !== 'AbortError') { setError(b.downloadError); logMsg(b.downloadFilesErrorMsg) }
    }
    finally { setLoading(false) }
  }

  if (step === 'download') return (
    <BankingLayout controlBarOffset={189} hideControlBar loading={loading} selectedCountry={selectedCountry} hasConnections={hasConnections} hasSelection={!!selectedInstitutionName} showDownloadArrow={false}
      onSelectCountry={loadInstitutions} onDownload={() => setStep('download')} onRefresh={handleRefresh} b={b}>
      <div className="banking-download-header" style={{ marginTop: -42 }}>
        <style>{'.banking-download-header .page-header-block{flex-wrap:nowrap;align-items:flex-start}'}</style>
        <PageHeader subtitle={lang.menu[4]} lang={lang} extra={
          <div style={{ display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center', background: 'linear-gradient(180deg, #d3213a, #8e0f22)', color: '#ffffff', padding: '8px 26px', borderRadius: '999px', boxShadow: '0 8px 18px -8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)', fontFamily: 'Arial, sans-serif', fontWeight: 'normal', fontSize: '20px' }}>
            {b.downloadFiles}
          </div>
        } />
      </div>
      <div style={{ position: 'absolute', top: 38, right: 10, fontFamily: handFont(lang.code), color: 'red', fontSize: 20, fontWeight: 'bold', zIndex: 2, transform: 'rotate(-5deg)', textAlign: 'center', lineHeight: 1.6, borderBottom: '2px solid red' }}>
        {b.decorPrivateLine1}<br />{b.decorPrivateLine2}
      </div>
      {selectedInstitutionName && (
        <div style={{ position: 'absolute', left: 875, top: 431, width: 597, background: 'transparent', border: '1px solid #003399', borderRadius: 8, padding: '14px 20px', direction: dir, textAlign: dir === 'rtl' ? 'right' : 'left', zIndex: 5 }}>
          <div style={{ color: '#003399', fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>{b.instructionsTitle}</div>
          <div style={{ color: 'red', fontSize: 18, fontWeight: 'bold', lineHeight: 1.8 }}>
            <div>1. {b.instructionsLine1}</div>
            <div>2. {b.instructionsLine2}</div>
            <div>3. {b.instructionsLine3}</div>
            <div>4. {b.instructionsLine4}</div>
          </div>
        </div>
      )}
      {selectedInstitutionName && (
        <div style={{ position: 'absolute', left: 94, top: 200, width: 474, height: 424, background: '#000', color: '#fff', fontSize: 18, fontWeight: 'bold', borderRadius: 8, padding: '10px 12px', overflowY: 'auto', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', direction: 'rtl' }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 6 }}>{b.systemMessagesTitle}</div>
          {sysLog.length === 0
            ? <div style={{ color: '#888' }}>{b.noMessagesYet}</div>
            : sysLog.map((entry, i) => {
                const timeEl = <span style={{ color: '#3399ff', fontSize: 15, fontWeight: 'normal' }}>{'<'}{entry.time}{'>'}</span>
                const idx = entry.highlight ? entry.text.indexOf(entry.highlight) : -1
                if (idx === -1) {
                  return <div key={i} style={{ marginBottom: 4, lineHeight: 1.5 }}>{timeEl} - {entry.text}</div>
                }
                const before = entry.text.slice(0, idx)
                const after = entry.text.slice(idx + (entry.highlight as string).length)
                return (
                  <div key={i} style={{ marginBottom: 4, lineHeight: 1.5 }}>
                    {timeEl} - {before}<span style={{ color: 'red', fontSize: 14 }}>{entry.highlight}</span>{after}
                  </div>
                )
              })}
        </div>
      )}
      {selectedInstitutionName && selectedInstitutionCountry && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 85 }}>
        <div style={{ transform: 'scale(1.5)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: BROWN, color: '#fff', borderRadius: 6, padding: '6px 12px', fontSize: 14, fontWeight: 'bold', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
            <Image src={`/flags/${selectedInstitutionCountry}.png`} alt={selectedInstitutionCountry} width={28} height={28} />
            {countryName(selectedInstitutionCountry)}
          </div>
          {(() => {
            const halfCount = Math.ceil(BANKS[selectedInstitutionCountry].length / 2)
            const topIndex = halfCount - 1
            const connectDone = isSimulationSelected ? simConnected : hasConnections
            const seqBtn = (dis: boolean): React.CSSProperties => ({
              background: '#003399', color: '#FFD700', border: '2px solid red', borderRadius: 5, padding: '4px 6px', minWidth: 72,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              cursor: dis ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 500, whiteSpace: 'normal', lineHeight: 1.3,
              fontFamily: 'var(--font-assistant), "Assistant", Arial, sans-serif', letterSpacing: 0.3,
              opacity: dis ? 0.5 : 1,
            })
            const seqBtnLines = (text: string) => text.split(' ').map((w, i) => <div key={i}>{w}</div>)
            return (
              <div style={{ position: 'relative', width: 40, height: halfCount * 46 + 20, marginTop: -4 }}>
                <div style={{ position: 'absolute', top: 0, left: 19, width: 2, height: halfCount * 46 + 10, background: BROWN }} />
                {Array.from({ length: halfCount }).map((_, i) => (
                  <div key={i} style={{ position: 'absolute', bottom: 10 + i * 46, left: 19, width: 20, height: 2, background: BROWN }} />
                ))}
                <div style={{ position: 'absolute', bottom: topIndex * 46 - 16, left: 43, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 0 }}>
                  <div style={{ background: BROWN, color: '#fff', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    {bankName(selectedInstitutionName)}
                  </div>
                  <div style={{ position: 'relative' }}>
                    {!connectDone && !disconnected && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 8, height: 26, background: 'red' }} />
                        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid red' }} />
                      </div>
                    )}
                    <button onClick={isSimulationSelected ? handleSimConnect : handleConnectSelected} disabled={loading || connectDone || disconnected}
                      style={seqBtn(loading || connectDone || disconnected)}>
                      {seqBtnLines(b.clickToConnect)}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {connectDone && !dataRead && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 8, height: 26, background: 'red' }} />
                        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid red' }} />
                      </div>
                    )}
                    <button onClick={handleReadData} disabled={loading || !connectDone || dataRead}
                      style={seqBtn(loading || !connectDone || dataRead)}>
                      {seqBtnLines(b.readData)}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {dataRead && !filesDownloaded && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 8, height: 26, background: 'red' }} />
                        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid red' }} />
                      </div>
                    )}
                    <button onClick={() => { onDbg?.('downloadTypeDialog', 'opened'); logMsg(b.waitingForSelection); setShowDownloadTypeDialog(true) }}
                      disabled={loading || !dataRead || filesDownloaded}
                      style={seqBtn(loading || !dataRead || filesDownloaded)}>
                      {seqBtnLines(b.clickToDownload)}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {filesDownloaded && !disconnected && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 8, height: 26, background: 'red' }} />
                        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid red' }} />
                      </div>
                    )}
                    <button onClick={handleDisconnectSelected} disabled={loading || !filesDownloaded || disconnected}
                      style={seqBtn(loading || !filesDownloaded || disconnected)}>
                      {seqBtnLines(b.clickToDisconnect)}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {disconnected && !closeClicked && (
                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 8, height: 26, background: 'red' }} />
                        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '22px solid red' }} />
                      </div>
                    )}
                    <button onClick={() => { setCloseClicked(true); logMsg(b.closingWindowMsg); window.location.href = 'mfinance://'; window.close() }} disabled={!disconnected || closeClicked}
                      style={seqBtn(!disconnected || closeClicked)}>
                      {seqBtnLines(b.clickToClose)}
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
        </div>
      )}
      {hasConnections && (
        <div style={{ fontSize: 14, color: '#333', marginTop: 16 }}>
          {connections.map(conn => (
            <div key={conn.id} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 'bold', color: '#003399' }}>{conn.institution_name}</span>
              {accounts.filter(a => a.connection_id === conn.id).map(acc => (
                <span key={acc.id} style={{ marginRight: 8, color: '#555' }}> {acc.name} {acc.balance} {acc.currency}</span>
              ))}
            </div>
          ))}
        </div>
      )}
      {showDownloadTypeDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '24px 30px', minWidth: 300, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            <div style={{ fontSize: 17, fontWeight: 'bold', color: '#003399', marginBottom: 20 }}>{b.chooseDownloadType}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => { onDbg?.('downloadTypeDialog', 'choice="downloadFilesToComputer"'); logMsg(b.selectedDownloadFilesMsg); setShowDownloadTypeDialog(false); isSimulationSelected ? handleSimulationDownload() : handleDownloadAll() }}
                style={{ background: '#003399', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 16px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {b.downloadFilesToComputer}
              </button>
              <button onClick={() => { onDbg?.('downloadTypeDialog', 'choice="loadDataBtn"'); logMsg(b.selectedLoadDataMsg); setShowDownloadTypeDialog(false); handleLoadToApp() }}
                style={{ background: '#003399', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 16px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {b.loadDataBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </BankingLayout>
  )

  return (
    <BankingLayout loading={loading} selectedCountry={selectedCountry} hasConnections={hasConnections} hasSelection={!!selectedInstitutionName} showDownloadArrow={!!selectedInstitutionName} showSelectArrow
      onSelectCountry={loadInstitutions} onDownload={() => setStep('download')} onRefresh={handleRefresh} b={b}>
      <PageHeader subtitle={lang.menu[4]} lang={lang} />
      <div style={{ maxWidth: 1100, color: '#333', fontSize: 15, lineHeight: 1.7, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: 'red', fontFamily: handFont(lang.code), marginBottom: 14, whiteSpace: 'nowrap' }}>
          {b.introTitlePrefix} <span style={{ fontFamily: 'var(--font-dancing), Georgia, serif', fontSize: 52, fontWeight: 'bold', fontStyle: 'italic' }}>M Finance</span>.
        </div>

        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 20, marginBottom: 20 }}>
          <div style={{ display: 'inline-block', background: '#6b4423', borderRadius: '12px', padding: '24px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'relative', display: 'inline-block', border: '3px double #FFD700', borderRadius: '10px', padding: '16px', paddingTop: '26px' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '16px', background: '#6b4423', padding: '0 10px', color: '#FFD700', fontSize: '26px', fontWeight: 'bold', fontFamily: handFont(lang.code), whiteSpace: 'nowrap' }}>{b.card3Title}</div>
              <ol style={{ margin: 0, paddingInlineStart: 20, color: '#eee', fontSize: 20, lineHeight: 1.7, listStyleType: 'decimal', listStylePosition: 'outside' }}>
                <li>{b.card3Item1}</li>
                <li>{b.card3Item2}</li>
                <li>{b.card3Item3}</li>
                <li>{b.card3Item4}</li>
              </ol>
            </div>
          </div>

          <div style={{ display: 'inline-block', background: '#6b4423', borderRadius: '12px', padding: '24px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'relative', display: 'inline-block', border: '3px double #FFD700', borderRadius: '10px', padding: '16px', paddingTop: '26px' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '16px', background: '#6b4423', padding: '0 10px', color: '#FFD700', fontSize: '26px', fontWeight: 'bold', fontFamily: handFont(lang.code), whiteSpace: 'nowrap' }}>{b.card1Title}</div>
              <ol style={{ margin: 0, paddingInlineStart: 20, color: '#eee', fontSize: 20, lineHeight: 1.7, listStyleType: 'decimal', listStylePosition: 'outside' }}>
                <li>{b.card1Item1}</li>
                <li>{b.card1Item2}</li>
                <li>{b.card1Item3}</li>
                <li>{b.card1Item4}</li>
              </ol>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ display: 'inline-block', background: '#6b4423', borderRadius: '12px', padding: '24px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'relative', display: 'inline-block', border: '3px double #FFD700', borderRadius: '10px', padding: '16px', paddingTop: '26px' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '16px', background: '#6b4423', padding: '0 10px', color: '#FFD700', fontSize: '26px', fontWeight: 'bold', fontFamily: handFont(lang.code), whiteSpace: 'nowrap' }}>{b.card2Title}</div>
              <ol style={{ margin: 0, paddingInlineStart: 20, color: '#eee', fontSize: 20, lineHeight: 1.7, listStyleType: 'decimal', listStylePosition: 'outside' }}>
                <li>{b.card2Item1}</li>
                <li>{b.card2Item2}</li>
                <li>{b.card2Item3}</li>
                <li>{b.card2Item4}</li>
              </ol>
            </div>
          </div>

          <div style={{ fontSize: 40, fontWeight: 'bold', color: 'red', fontFamily: handFont(lang.code), whiteSpace: 'nowrap' }}>{b.introSuccess}</div>
        </div>
      </div>
    </BankingLayout>
  )

}

function InstallCard({ lang, onInstall, onRun, onDbg }: { lang: typeof languages[0]; onInstall: () => void; onRun: () => void; onDbg: (func: string, msg: string) => void }) {
  useEffect(() => {
    onDbg('InstallCard', 'mount => onInstall()')
    onInstall()
  }, [])
  const dir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...GRANITE_BG, direction: dir }}>
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

export function handFont(code: string) {
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

const M_FINANCE_LOCAL_UUID_SERVER_PORT = 57891

async function Get_UUID_BIOS_Code_From_M_Finance(onDbg: (func: string, msg: string) => void): Promise<string | null> {
  onDbg('Get_UUID_BIOS_Code_From_M_Finance', 'triggering mfinance://get-uuid')
  window.location.href = 'mfinance://get-uuid'

  await new Promise(r => setTimeout(r, 800))

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)
  try {
    onDbg('Get_UUID_BIOS_Code_From_M_Finance', `fetch GET http://localhost:${M_FINANCE_LOCAL_UUID_SERVER_PORT}/`)
    const res = await fetch(`http://localhost:${M_FINANCE_LOCAL_UUID_SERVER_PORT}/`, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) {
      onDbg('Get_UUID_BIOS_Code_From_M_Finance', `res.ok=false status=${res.status}`)
      return null
    }
    const code = (await res.text()).trim()
    onDbg('Get_UUID_BIOS_Code_From_M_Finance', `received code="${code}"`)
    return code || null
  } catch (err) {
    clearTimeout(timeoutId)
    onDbg('Get_UUID_BIOS_Code_From_M_Finance', `no response from M_Finance — err="${String(err)}"`)
    return null
  }
}

function RegisterCard({ lang, clientIp = '', initialPhase = 'default', onClose, onLogin, onUserUpdate, onNavigate, onMsg, onDbg }: { lang: typeof languages[0]; clientIp?: string; initialPhase?: 'default' | 'register'; onClose: () => void; onLogin: (user: UserRecord) => void; onUserUpdate: (user: UserRecord) => void; onNavigate: (page: string) => void; onMsg: (m: { title: string; subtitle?: string; body: string; bodyColor?: string }) => void; onDbg: (func: string, msg: string) => void }) {
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
  const [mfNotice, setMfNotice] = useState('')
  const [txMfNotice, setTxMfNotice] = useState('')

  useEffect(() => {
    fetch('/api/system/mf-message').then(r => r.json()).then(d => { if (d.text) setMfNotice(d.text) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (lang.code === 'he' || !mfNotice) { setTxMfNotice(''); return }
    translateFromHe(mfNotice, lang.code).then(t => setTxMfNotice(t))
  }, [mfNotice, lang.code])

  const locked: React.CSSProperties = { background: '#222', color: '#777', cursor: 'default' }

  function handleRegister() {
    onDbg('handleRegister', 'called => setPhase register')
    setPhase('register')
  }

  async function handleUpdate() {
    onDbg('flowDiagram', '12-לקוח ממלא פרטי הרשמה ולוחץ הרשמה')
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
    onDbg('handleUpdate', `res.status=${res.status} res.ok=${res.ok} code="${data.code}"`)
    if (!res.ok) { onDbg('handleUpdate', `res.ok=false err="${data.error}"`); setError(data.error); return }
    setSavedPass('')
    setSavedConf('')
    setError('')
    onDbg('flowDiagram', '18-הרשמה מוצלחת')
    onDbg('handleUpdate', `success status="${data.status}" => onMsg`)
    onMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: c.msgRegistered })
    if (data.status === 'created') {
      onDbg('handleUpdate', `user="${data.user?.email}" is_M_Finance_installed=${data.user?.is_M_Finance_installed} => onUserUpdate`)
      onUserUpdate(data.user)
      onDbg('flowDiagram', '13-תהליך התקנת M Finance')
      onDbg('handleUpdate', 'status=created => onNavigate mf-install')
      onNavigate('mf-install')
    }
  }

  async function isComputerAlreadyTakenByAnotherCustomer(): Promise<boolean> {
    onDbg('flowDiagram', '23-בדיקה: קיים לקוח רשום במחשב?')
    const newDeviceUuid = await Get_UUID_BIOS_Code_From_M_Finance(onDbg)
    const computerRes = await fetch('/api/check-computer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuidBiosCode: newDeviceUuid }),
    })
    const computerData = await computerRes.json()
    onDbg('handleLogin', `check-computer taken=${computerData.taken}`)
    if (computerData.taken) {
      onDbg('flowDiagram', '22-כניסה נכשלה (מחשב זה כבר משויך ללקוח אחר)')
      onMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: 'התהליך נכשל. משתמש אחד במחשב אחד. כבר קיים.' })
    }
    return computerData.taken
  }

  async function handleLogin() {
    onDbg('flowDiagram', '3-לקוח ממלא פרטי כניסה ולוחץ כניסה')
    onDbg('handleLogin', `email="${savedEmail}" pass.len=${savedPass.length}`)
    setError('')
    if (!savedPass) { onDbg('handleLogin', 'pass empty => errPassLen'); setError(c.errPassLen); return }

    onDbg('flowDiagram', '4-בדיקה: קיימת רשומת לקוח (מייל+סיסמה)')
    onDbg('handleLogin', `fetch POST /api/login-check email="${savedEmail}"`)
    const checkRes = await fetch('/api/login-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: savedEmail, password: savedPass }),
    })
    const checkData = await checkRes.json()
    onDbg('flowDiagram', '5-בדיקה: UUID BIOS קיים ברשומה')
    onDbg('handleLogin', `login-check res.status=${checkRes.status} res.ok=${checkRes.ok}`)
    if (!checkRes.ok) {
      onDbg('handleLogin', `login-check failed err="${checkData.error}" code="${checkData.code}"`)
      if (checkData.code === 'NOT_FOUND') {
        if (await isComputerAlreadyTakenByAnotherCustomer()) return
        setShowNotFoundMsg(true)
        return
      }
      if (checkData.code === 'NEEDS_INSTALL') {
        if (await isComputerAlreadyTakenByAnotherCustomer()) return
        onDbg('flowDiagram', `13-ממשיך בתהליך התקנת M Finance (רשומה קיימת, אין UUID עדיין) user="${checkData.user?.email}"`)
        onUserUpdate(checkData.user)
        onNavigate('mf-install')
        return
      }
      setError(checkData.error); return
    }

    onDbg('flowDiagram', '6-בקשת UUID מקומי מהאפליקציה')
    const uuidBiosCode = await Get_UUID_BIOS_Code_From_M_Finance(onDbg)
    onDbg('flowDiagram', '7-בדיקה: רישום UUID = UUID מקומי')
    onDbg('handleLogin', `fetch POST /api/login email="${savedEmail}" clientIp="${clientIp}" uuidBiosCode="${uuidBiosCode ?? 'null'}"`)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: savedEmail, password: savedPass, clientIp, uuidBiosCode }),
    })
    const data = await res.json()
    onDbg('handleLogin', `res.status=${res.status} res.ok=${res.ok}`)
    if (!res.ok) {
      onDbg('handleLogin', `res.ok=false err="${data.error}" code="${data.code}"`)
      if (data.code === 'NOT_FOUND') { setShowNotFoundMsg(true); return }
      if (data.code === 'WRONG_DEVICE') { onDbg('flowDiagram', '8-הלקוח רשום במחשב אחר => 21-כניסה נכשלה'); setError(data.error); return }
      if (data.code === 'NEEDS_PLAN') { onDbg('flowDiagram', '9-תוכנית לא תקפה'); onMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: data.error }); return }
      if (data.code === 'CRITICAL_FAILURE') { onDbg('flowDiagram', '21-כניסה נכשלה (תקלה קריטית)'); onMsg({ title: lang.card.title, subtitle: lang.card.mFinance, body: data.error }); return }
      onDbg('flowDiagram', '21-כניסה נכשלה')
      setError(data.error); return
    }
    onDbg('flowDiagram', '9-תוכנית תקפה (עבר) => 17-כניסה מוצלחת')
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
    <div style={{ width: '100%', height: '100%', position: 'relative', ...GRANITE_BG }}>
      <PageHeader subtitle={`${lang.card.title} - ${lang.card.login}`} lang={lang} />

      <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 'calc(50% - 200px)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '32px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,.15)' }}>
        {lang.captions.registerRight1}<br/>{lang.captions.registerRight2}
      </div>

      <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 'calc(50% - 200px)', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%', boxSizing: 'border-box', direction: lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr', fontSize: '20px', fontWeight: 'normal', color: '#003399', fontFamily: 'Arial, sans-serif', whiteSpace: 'pre-wrap', textAlign: 'center' }}>{(lang.code !== 'he' && txMfNotice) || mfNotice}</div>
      </div>

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
                <button onClick={() => { onDbg('flowDiagram', '11-לקוח לחץ על הרשמה'); setPhase('register') }} style={{ ...regBtn, padding: '5px 18px', fontSize: '13px' }}>{c.register}</button>
              </div>
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

  if (!user) return <div style={{ width: '100%', height: '100%', ...GRANITE_BG }} />

  const personalFields = [
    { label: p.fullName,  value: [user.name, user.last_name].filter(Boolean).join(' ') || '—' },
    { label: p.email,     value: user.email    || '—' },
    { label: p.ip,        value: (() => { if (!user.last_ip) return '—'; const hex = user.last_ip.split('.').length === 4 ? '(' + user.last_ip.split('.').map(n => parseInt(n).toString(16).padStart(2,'0').toUpperCase()).join('') + ')' : ''; return hex ? `${user.last_ip} ${hex}` : user.last_ip })() },
    { label: p.language,  value: languages.find(l => l.code === user.language)?.name ?? user.language ?? '—' },
  ]

  const outerWrap: React.CSSProperties = { width: '100%', height: '100%', position: 'relative', ...GRANITE_BG, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '0 20px 28px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }

  const sideCaptionStyle: React.CSSProperties = { position: 'absolute', right: 0, width: 'calc(50% - 400px)', fontFamily: '"Guttman Yad Brush","Guttman Yad","Levenim MT",serif', fontSize: '30px', lineHeight: 1.3, color: '#c31432', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,.15)' }
  const cardBox:  React.CSSProperties  = { width: '100%', maxWidth: '780px', background: '#fff', border: '2px solid #003399', borderRadius: '12px', padding: '32px 36px', boxShadow: '0 4px 16px rgba(0,0,60,0.08)' }
  const thStyle:  React.CSSProperties  = { padding: '8px 12px', textAlign: 'right', color: '#003399', fontWeight: 'bold', border: '1px solid #ccd' }
  const tdStyle:  React.CSSProperties  = { padding: '9px 12px', border: '1px solid #ccd' }

  const thP: React.CSSProperties = { padding: '9px 10px', textAlign: 'right', color: '#FFD700', fontWeight: 'bold', border: '1px solid #3355bb' }
  const tdP: React.CSSProperties = { padding: '9px 10px', border: '1px solid #003399', background: '#fff' }
  const secBox: React.CSSProperties = { position: 'relative', border: '2px solid #003399', borderRadius: '12px', background: '#f7f9ff' }
  const secLabel: React.CSSProperties = { position: 'absolute', top: '-11px', right: '18px', background: '#f7f9ff', padding: '0 10px', color: '#003399', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }

  if (planView) {
    const createdAt = user.created_at ? new Date(String(user.created_at)) : new Date()
    return (
      <div style={outerWrap}>
        <PageHeader subtitle={`${lang.feedback.customerRelations} - ${lang.menu[5]}`} lang={lang} />

        <div style={{ ...sideCaptionStyle, top: '260px' }}>{lang.captions.personalPlanRight}</div>
        <div style={{ ...sideCaptionStyle, right: 'auto', left: 0, top: '260px' }}>{lang.captions.personalPlanLeft1}<br/>{lang.captions.personalPlanLeft2}<br/>{lang.captions.personalPlanLeft3}</div>

        <div style={cardBox}>

          {/* Header */}
          <div style={{ marginBottom: '22px', padding: '16px 20px', borderRadius: '10px', background: '#003399' }}>
            <div style={{ fontSize: '22px', color: '#ffffff', fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', marginBottom: '2px' }}>KeyClick</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff' }}>{p.changePlan}</div>
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
              style={{ background: '#f0f0f8', border: '1px solid #003399', borderRadius: '7px', color: '#555', fontSize: '13px', padding: '7px 16px', cursor: 'pointer' }}>
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

      <div style={{ ...sideCaptionStyle, top: '260px' }}>{lang.captions.personalDefaultRight}</div>
      <div style={{ ...sideCaptionStyle, right: 'auto', left: 0, top: '460px' }}>{lang.captions.personalDefaultLeft}</div>

      <div style={cardBox}>

        {/* Header */}
        <div style={{ marginBottom: '22px', padding: '16px 20px', borderRadius: '10px', background: '#003399' }}>
          <div style={{ fontSize: '22px', color: '#ffffff', fontFamily: 'var(--font-dancing),"Dancing Script",Georgia,serif', fontStyle: 'italic', marginBottom: '2px' }}>KeyClick</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff' }}>{lang.menu[5]}</div>
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
