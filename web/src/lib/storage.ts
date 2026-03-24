import type { GifSettings, PersistedGifSettings } from "@/types";

const SETTINGS_KEY = "timelapse-gif:gif-settings";

export function saveGifSettings(settings: GifSettings): void {
  const persisted: PersistedGifSettings = {
    width: settings.width,
    duration: settings.duration,
    dateOverlay: settings.dateOverlay,
    overlayFormat: settings.overlayFormat,
    fontSize: settings.fontSize,
    loop: settings.loop,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(persisted));
  } catch {
    // localStorage unavailable (e.g. private browsing)
  }
}

export function loadGifSettings(): PersistedGifSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedGifSettings;
  } catch {
    return null;
  }
}
