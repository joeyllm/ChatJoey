export const languageOptions = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "zh-CN", label: "中文" },
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
] as const;

export type LanguageCode = (typeof languageOptions)[number]["code"];

type Translation = {
  documentTitle: string;
  chatAriaLabel: string;
  productTagline: string;
  status: string;
  thinkingStatus: string;
  liveStatus: string;
  previewStatus: string;
  errorStatus: string;
  languageLabel: string;
  messagesAriaLabel: string;
  thinkingMessage: string;
  welcomeTitle: string;
  welcomeDescription: string;
  examplesAriaLabel: string;
  starterPrompts: readonly [string, string, string];
  userRole: string;
  assistantRole: string;
  inputLabel: string;
  placeholder: string;
  sendButtonLabel: string;
  send: string;
  hint: string;
  disclaimer: string;
  requestFailed: string;
  mockReply: (preview: string) => string;
};

export const translations: Record<LanguageCode, Translation> = {
  en: {
    documentTitle: "ChatJoey | JoeyLLM chat",
    chatAriaLabel: "ChatJoey chat interface",
    productTagline: "Start every conversation with clarity",
    status: "Ready",
    thinkingStatus: "Thinking",
    liveStatus: "JoeyLLM live",
    previewStatus: "Local preview",
    errorStatus: "Connection issue",
    languageLabel: "Language",
    messagesAriaLabel: "Conversation messages",
    thinkingMessage: "Thinking…",
    welcomeTitle: "What can we solve together today?",
    welcomeDescription:
      "Type a question or choose an example below. ChatJoey sends it securely to JoeyLLM through the server.",
    examplesAriaLabel: "Example questions",
    starterPrompts: [
      "Help me plan today's priorities",
      "Explain vector search in simple terms",
      "Create an acceptance checklist for a new feature",
    ],
    userRole: "You",
    assistantRole: "ChatJoey",
    inputLabel: "Message",
    placeholder: "Message ChatJoey…",
    sendButtonLabel: "Send message",
    send: "Send",
    hint: "Enter to send · Shift + Enter for a new line",
    disclaimer:
      "JoeyLLM can make mistakes. Check important information. Qdrant and RAG are not connected yet.",
    requestFailed:
      "ChatJoey could not reach JoeyLLM. Please check the connection and try again.",
    mockReply: (preview) =>
      `Local mock reply: I received “${preview}”. This prototype only demonstrates interface interactions and is not connected to a real model or knowledge base.`,
  },
  fr: {
    documentTitle: "ChatJoey | Chat JoeyLLM",
    chatAriaLabel: "Interface de chat ChatJoey",
    productTagline: "Commencez chaque conversation avec clarté",
    status: "Prêt",
    thinkingStatus: "Réflexion",
    liveStatus: "JoeyLLM connecté",
    previewStatus: "Aperçu local",
    errorStatus: "Problème de connexion",
    languageLabel: "Langue",
    messagesAriaLabel: "Messages de la conversation",
    thinkingMessage: "Réflexion en cours…",
    welcomeTitle: "Que pouvons-nous résoudre ensemble aujourd’hui ?",
    welcomeDescription:
      "Saisissez une question ou choisissez un exemple. ChatJoey l’envoie à JoeyLLM de manière sécurisée via le serveur.",
    examplesAriaLabel: "Questions d’exemple",
    starterPrompts: [
      "Aide-moi à organiser les priorités d’aujourd’hui",
      "Explique-moi simplement la recherche vectorielle",
      "Crée une checklist de validation pour une nouvelle fonctionnalité",
    ],
    userRole: "Vous",
    assistantRole: "ChatJoey",
    inputLabel: "Message",
    placeholder: "Écrivez à ChatJoey…",
    sendButtonLabel: "Envoyer le message",
    send: "Envoyer",
    hint: "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne",
    disclaimer:
      "JoeyLLM peut se tromper. Vérifiez les informations importantes. Qdrant et le RAG ne sont pas encore connectés.",
    requestFailed:
      "ChatJoey n’a pas pu joindre JoeyLLM. Vérifiez la connexion et réessayez.",
    mockReply: (preview) =>
      `Réponse simulée locale : j’ai bien reçu « ${preview} ». Ce prototype montre uniquement les interactions de l’interface et n’est relié à aucun modèle réel ni à aucune base de connaissances.`,
  },
  "zh-CN": {
    documentTitle: "ChatJoey | JoeyLLM 聊天",
    chatAriaLabel: "ChatJoey 聊天界面",
    productTagline: "清晰地开始每一次对话",
    status: "就绪",
    thinkingStatus: "正在思考",
    liveStatus: "JoeyLLM 已连接",
    previewStatus: "本地预览",
    errorStatus: "连接异常",
    languageLabel: "语言",
    messagesAriaLabel: "对话消息",
    thinkingMessage: "正在思考…",
    welcomeTitle: "今天想一起解决什么？",
    welcomeDescription:
      "输入一个问题，或从下面的示例开始。ChatJoey 会通过服务端安全地发送给 JoeyLLM。",
    examplesAriaLabel: "示例问题",
    starterPrompts: [
      "帮我梳理今天的工作重点",
      "解释一下什么是向量检索",
      "为一个新功能列出验收清单",
    ],
    userRole: "你",
    assistantRole: "ChatJoey",
    inputLabel: "输入消息",
    placeholder: "给 ChatJoey 发消息…",
    sendButtonLabel: "发送消息",
    send: "发送",
    hint: "Enter 发送 · Shift + Enter 换行",
    disclaimer: "JoeyLLM 可能出错，请核对重要信息。Qdrant 和 RAG 尚未接入。",
    requestFailed: "ChatJoey 无法连接 JoeyLLM，请检查网络后重试。",
    mockReply: (preview) =>
      `本地模拟回复：我已收到“${preview}”。当前原型只演示界面交互，尚未连接真实模型或知识库。`,
  },
  ru: {
    documentTitle: "ChatJoey | Чат JoeyLLM",
    chatAriaLabel: "Интерфейс чата ChatJoey",
    productTagline: "Начинайте каждый разговор с ясности",
    status: "Готово",
    thinkingStatus: "Размышляет",
    liveStatus: "JoeyLLM подключён",
    previewStatus: "Локальный просмотр",
    errorStatus: "Ошибка подключения",
    languageLabel: "Язык",
    messagesAriaLabel: "Сообщения беседы",
    thinkingMessage: "Думаю…",
    welcomeTitle: "Что мы можем решить вместе сегодня?",
    welcomeDescription:
      "Введите вопрос или выберите пример. ChatJoey безопасно отправит его JoeyLLM через сервер.",
    examplesAriaLabel: "Примеры вопросов",
    starterPrompts: [
      "Помоги расставить приоритеты на сегодня",
      "Объясни простыми словами, что такое векторный поиск",
      "Составь критерии приёмки для новой функции",
    ],
    userRole: "Вы",
    assistantRole: "ChatJoey",
    inputLabel: "Сообщение",
    placeholder: "Напишите ChatJoey…",
    sendButtonLabel: "Отправить сообщение",
    send: "Отправить",
    hint: "Enter — отправить · Shift + Enter — новая строка",
    disclaimer:
      "JoeyLLM может ошибаться. Проверяйте важную информацию. Qdrant и RAG пока не подключены.",
    requestFailed:
      "ChatJoey не удалось связаться с JoeyLLM. Проверьте подключение и повторите попытку.",
    mockReply: (preview) =>
      `Локальный тестовый ответ: получено сообщение «${preview}». Этот прототип демонстрирует только работу интерфейса и не подключён к реальной модели или базе знаний.`,
  },
  es: {
    documentTitle: "ChatJoey | Chat de JoeyLLM",
    chatAriaLabel: "Interfaz de chat de ChatJoey",
    productTagline: "Empieza cada conversación con claridad",
    status: "Listo",
    thinkingStatus: "Pensando",
    liveStatus: "JoeyLLM conectado",
    previewStatus: "Vista previa local",
    errorStatus: "Problema de conexión",
    languageLabel: "Idioma",
    messagesAriaLabel: "Mensajes de la conversación",
    thinkingMessage: "Pensando…",
    welcomeTitle: "¿Qué podemos resolver juntos hoy?",
    welcomeDescription:
      "Escribe una pregunta o elige un ejemplo. ChatJoey lo envía de forma segura a JoeyLLM a través del servidor.",
    examplesAriaLabel: "Preguntas de ejemplo",
    starterPrompts: [
      "Ayúdame a organizar las prioridades de hoy",
      "Explícame de forma sencilla qué es la búsqueda vectorial",
      "Crea una lista de aceptación para una función nueva",
    ],
    userRole: "Tú",
    assistantRole: "ChatJoey",
    inputLabel: "Mensaje",
    placeholder: "Escribe a ChatJoey…",
    sendButtonLabel: "Enviar mensaje",
    send: "Enviar",
    hint: "Enter para enviar · Mayús + Enter para una nueva línea",
    disclaimer:
      "JoeyLLM puede cometer errores. Verifica la información importante. Qdrant y RAG aún no están conectados.",
    requestFailed:
      "ChatJoey no pudo conectarse con JoeyLLM. Comprueba la conexión e inténtalo de nuevo.",
    mockReply: (preview) =>
      `Respuesta simulada local: recibí «${preview}». Este prototipo solo demuestra las interacciones de la interfaz y no está conectado a un modelo real ni a una base de conocimientos.`,
  },
  ja: {
    documentTitle: "ChatJoey | JoeyLLM チャット",
    chatAriaLabel: "ChatJoey チャット画面",
    productTagline: "すべての対話を明確に始める",
    status: "準備完了",
    thinkingStatus: "考えています",
    liveStatus: "JoeyLLM 接続中",
    previewStatus: "ローカルプレビュー",
    errorStatus: "接続エラー",
    languageLabel: "言語",
    messagesAriaLabel: "会話メッセージ",
    thinkingMessage: "考えています…",
    welcomeTitle: "今日は何を一緒に解決しましょうか？",
    welcomeDescription:
      "質問を入力するか、下の例を選んでください。ChatJoey がサーバー経由で JoeyLLM に安全に送信します。",
    examplesAriaLabel: "質問の例",
    starterPrompts: [
      "今日の優先事項を整理して",
      "ベクトル検索をわかりやすく説明して",
      "新機能の受け入れチェックリストを作成して",
    ],
    userRole: "あなた",
    assistantRole: "ChatJoey",
    inputLabel: "メッセージ",
    placeholder: "ChatJoey にメッセージ…",
    sendButtonLabel: "メッセージを送信",
    send: "送信",
    hint: "Enter で送信 · Shift + Enter で改行",
    disclaimer:
      "JoeyLLM は誤ることがあります。重要な情報は確認してください。Qdrant と RAG はまだ接続されていません。",
    requestFailed:
      "ChatJoey は JoeyLLM に接続できませんでした。接続を確認してもう一度お試しください。",
    mockReply: (preview) =>
      `ローカル模擬返信：「${preview}」を受け取りました。この試作は画面操作のみを示すもので、実際のモデルやナレッジベースには接続されていません。`,
  },
};
