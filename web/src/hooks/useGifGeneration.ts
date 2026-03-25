import { useState, useCallback, useRef } from "react";
import type { ImageFile, GifSettings, GifResult } from "@/types";
import { DEFAULT_GIF_SETTINGS } from "@/lib/constants";
import { saveGifSettings, loadGifSettings } from "@/lib/storage";
import { generateGif as encodeGif } from "@/lib/gif-encoder";

function getInitialSettings(): GifSettings {
  const persisted = loadGifSettings();
  if (persisted) {
    return { ...DEFAULT_GIF_SETTINGS, ...persisted, startDate: null, endDate: null };
  }
  return { ...DEFAULT_GIF_SETTINGS };
}

export function useGifGeneration(images: ImageFile[]) {
  const [settings, setSettings] = useState<GifSettings>(getInitialSettings);
  const [gifResult, setGifResult] = useState<GifResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const prevResultUrl = useRef<string | null>(null);

  const updateSettings = useCallback((partial: Partial<GifSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveGifSettings(next);
      return next;
    });
    setGifResult(null);
  }, []);

  const generateGif = useCallback(async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    // Revoke previous result
    if (prevResultUrl.current) {
      URL.revokeObjectURL(prevResultUrl.current);
    }

    try {
      const result = await encodeGif(images, settings, setProgress);
      prevResultUrl.current = result.url;
      setGifResult(result);
    } catch (err) {
      console.error("GIF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [images, settings]);

  return {
    settings,
    updateSettings,
    generateGif,
    gifResult,
    progress,
    isGenerating,
  };
}
