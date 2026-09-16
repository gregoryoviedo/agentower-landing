export const BASE = `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/`;

export const REPO = 'https://github.com/gregoryoviedo/agentower';
export const REPO_LANDING = 'https://github.com/gregoryoviedo/agentower-landing';
export const ISSUES = `${REPO}/issues`;
export const LATEST_RELEASE = `${REPO}/releases/latest`;
export const ALL_RELEASES = `${REPO}/releases`;
export const LICENSE = `${REPO}/blob/main/LICENSE`;
export const SECURITY = `${REPO}/blob/main/SECURITY.md`;
export const DESIGN_DOC = `${REPO}/blob/main/docs/DESIGN.md`;

export const DOWNLOADS = {
  macos: `${REPO}/releases/latest/download/Agentower-MacOS.zip`,
  windows: `${REPO}/releases/latest/download/Agentower-Windows.zip`
} as const;

export const BINANCE_PAY_ID = '371811579';
export const VERSION = 'v0.4.1';

export interface Agent {
  name: string;
  transport: string;
  cli: string;
  note: string;
  logo: string;
}

export const AGENTS: Agent[] = [
  { name: 'opencode', transport: 'HTTP + SQLite', cli: 'opencode serve', note: 'Sigue la TUI local por SQLite; HTTP solo para enviar prompts', logo: 'opencode.svg' },
  { name: 'Claude Code', transport: 'stdio JSON', cli: 'claude', note: 'Historial JSONL de todos los proyectos en ~/.claude', logo: 'claude.svg' },
  { name: 'Kiro', transport: 'ACP', cli: 'kiro-cli acp', note: 'Sesiones JSONL en ~/.kiro', logo: 'kiro.svg' },
  { name: 'GitHub Copilot', transport: 'ACP / LSP', cli: 'copilot', note: 'session-store de VS Code', logo: 'copilot.svg' },
  { name: 'Codex', transport: 'headless JSON', cli: 'codex exec --json', note: 'Rollouts en ~/.codex', logo: 'codex.svg' },
  { name: 'Antigravity', transport: 'stream-json', cli: 'agy -p', note: 'Transcripts en ~/.gemini', logo: 'antigravity.svg' }
];

export interface Command {
  cmd: string;
  desc: string;
}

export const COMMANDS: Command[] = [
  { cmd: '/start · /help', desc: 'Bienvenida y lista de comandos disponibles.' },
  { cmd: '/status', desc: 'Qué agente y sesión está siguiendo el bot ahora mismo.' },
  { cmd: '/continue', desc: 'Retoma la última tarea completada y la deja activa para responder.' },
  { cmd: '/resume', desc: 'Detecta la sesión viva en tu máquina y ofrece seguirla desde Telegram.' },
  { cmd: '/agent · /agents', desc: 'Cambia el agente activo del chat sobre la marcha.' },
  { cmd: 'texto libre', desc: 'Responde a la sesión activa, o a la pregunta pendiente del agente.' }
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: '¿Agentower es gratis?',
    a: 'Sí. Es open source bajo licencia MIT y no tiene backend ni cuentas: descargás o compilás el binario y lo corrés en tu propia máquina.'
  },
  {
    q: '¿Qué agentes de IA soporta?',
    a: 'opencode, Claude Code, Kiro, GitHub Copilot, Codex y Antigravity. Detecta los que tengas instalados y te permite cambiar de agente por chat sin reiniciar nada.'
  },
  {
    q: '¿Necesito abrir puertos o configurar un servidor?',
    a: 'No. El bot usa long polling saliente contra la API de Telegram: no expone puertos ni necesita túneles ni webhooks. Las apps nativas hablan con el bot por un socket local en 127.0.0.1.'
  },
  {
    q: '¿Dónde se guardan mi token y mis datos?',
    a: 'Todo queda en tu máquina: el token en un archivo .env con permisos 0600 y el estado en SQLite. Nunca se guarda el contenido de tus prompts ni se manda a un servidor de terceros.'
  },
  {
    q: '¿Puedo usarlo sin la app nativa?',
    a: 'Sí. El binario Go (remote-bot) funciona solo en macOS, Linux y Windows. La app es opcional y aporta toggle, settings y auto-arranque.'
  },
  {
    q: '¿Cómo sabe qué sesión seguir?',
    a: 'Cada agente con locator tiene un observador que auto-sigue la sesión más reciente. Para opencode lee la TUI local por SQLite y para Claude escanea todos los proyectos: no tenés que elegir nada.'
  },
  {
    q: '¿Funciona en Windows y macOS?',
    a: 'Sí. Hay apps nativas para macOS (barra de menús) y Windows (área de notificación), y el binario Go también corre en Linux.'
  },
  {
    q: '¿Cuánto tarda en avisarme?',
    a: 'Si te alejás de la máquina, a los 2 minutos te avisa de una tarea completada y al minuto una pregunta pendiente del agente, con botones para continuar desde Telegram.'
  }
];

export interface Feature {
  title: string;
  body: string;
  icon: string;
}

export const FEATURES: Feature[] = [
  {
    title: 'Multi-agente',
    body: 'Un solo bot maneja opencode, Claude Code, Kiro, Copilot, Codex y Antigravity. Cambiás de agente por chat sin reiniciar nada.',
    icon: 'layers'
  },
  {
    title: 'Long polling a Telegram',
    body: 'Sin puertos expuestos, sin túneles, sin webhooks. El bot solo hace llamadas salientes a la API de Telegram.',
    icon: 'radio'
  },
  {
    title: 'Whitelist estricta',
    body: 'Solo el ALLOWED_CHAT_ID configurado puede usar el bot. Cualquier otro intento se descarta en silencio.',
    icon: 'shield'
  },
  {
    title: 'Workspace acotado',
    body: 'La navegación por carpetas nunca puede salir del WORKSPACE_ROOT, ni siquiera con symlinks o rutas relativas.',
    icon: 'folder'
  },
  {
    title: 'Estado persistente',
    body: 'Workspace, proyecto, sesión y agente activo viven en SQLite y sobreviven a reinicios. Nunca guarda prompts.',
    icon: 'database'
  },
  {
    title: 'Avisos por inactividad',
    body: 'Si te alejás de la máquina, a los 2 minutos recibís la tarea completada; al minuto, las preguntas del agente.',
    icon: 'bell'
  },
  {
    title: 'Preguntas respondibles',
    body: 'Cuando el agente pausa para pedir una decisión, te llega con botones. Tu respuesta vuelve al agente que corre local.',
    icon: 'message'
  },
  {
    title: 'Apps nativas opcionales',
    body: 'Barra de menús en macOS y bandeja del sistema en Windows: toggle, settings, auto-arranque y logs.',
    icon: 'app'
  }
];
