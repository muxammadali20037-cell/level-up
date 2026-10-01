/** Minimal typing of the Telegram Mini App SDK (https://core.telegram.org/bots/webapps). */

export type TelegramThemeParams = Partial<
  Record<
    | "bg_color"
    | "text_color"
    | "hint_color"
    | "link_color"
    | "button_color"
    | "button_text_color"
    | "secondary_bg_color"
    | "header_bg_color"
    | "bottom_bar_bg_color"
    | "accent_text_color"
    | "section_bg_color"
    | "section_header_text_color"
    | "section_separator_color"
    | "subtitle_text_color"
    | "destructive_text_color",
    string
  >
>;

export type TelegramInset = { top: number; bottom: number; left: number; right: number };

export interface TelegramBackButton {
  isVisible: boolean;
  onClick(callback: () => void): TelegramBackButton;
  offClick(callback: () => void): TelegramBackButton;
  show(): TelegramBackButton;
  hide(): TelegramBackButton;
}

export interface TelegramBottomButton {
  text: string;
  isVisible: boolean;
  isActive: boolean;
  setText(text: string): TelegramBottomButton;
  onClick(callback: () => void): TelegramBottomButton;
  offClick(callback: () => void): TelegramBottomButton;
  show(): TelegramBottomButton;
  hide(): TelegramBottomButton;
  enable(): TelegramBottomButton;
  disable(): TelegramBottomButton;
  showProgress(leaveActive?: boolean): TelegramBottomButton;
  hideProgress(): TelegramBottomButton;
}

export interface TelegramHapticFeedback {
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): TelegramHapticFeedback;
  notificationOccurred(type: "error" | "success" | "warning"): TelegramHapticFeedback;
  selectionChanged(): TelegramHapticFeedback;
}

export type TelegramEvent =
  | "themeChanged"
  | "viewportChanged"
  | "safeAreaChanged"
  | "contentSafeAreaChanged"
  | "activated"
  | "deactivated";

export interface TelegramWebApp {
  /** Raw, signed init data. Send it to the server for HMAC verification; never trust it client-side. */
  initData: string;
  initDataUnsafe: {
    start_param?: string;
    user?: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string };
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportStableHeight: number;
  safeAreaInset?: TelegramInset;
  contentSafeAreaInset?: TelegramInset;
  BackButton: TelegramBackButton;
  MainButton: TelegramBottomButton;
  HapticFeedback: TelegramHapticFeedback;
  ready(): void;
  expand(): void;
  close(): void;
  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  disableVerticalSwipes?(): void;
  onEvent(event: TelegramEvent, callback: () => void): void;
  offEvent(event: TelegramEvent, callback: () => void): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
    TelegramWebviewProxy?: unknown;
  }
}
