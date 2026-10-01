"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  haptic,
  isTelegramReady,
  setMainButton,
  showBackButton,
  subscribeTelegramReady,
} from "@/lib/telegram/webapp-client";

const serverSnapshot = () => false;

/** True once the Telegram SDK is initialised inside a real Telegram client. */
function useTelegramReady(): boolean {
  return useSyncExternalStore(subscribeTelegramReady, isTelegramReady, serverSnapshot);
}

/**
 * Telegram MainButton for the screen's primary action (in TMA the in-page CTA is hidden with `tma:hidden`).
 * Renders nothing; on the web it is a no-op.
 */
export function TmaMainButton({ text, href }: { text: string; href: string }) {
  const router = useRouter();
  const isReady = useTelegramReady();

  useEffect(() => {
    if (!isReady) return;
    return setMainButton({
      text,
      onClick: () => {
        haptic("light");
        router.push(href);
      },
    });
  }, [isReady, text, href, router]);

  return null;
}

/** Telegram's native BackButton (in TMA the in-page back link is hidden with `tma:hidden`). */
export function TmaBackButton({ href }: { href: string }) {
  const router = useRouter();
  const isReady = useTelegramReady();

  useEffect(() => {
    if (!isReady) return;
    return showBackButton(() => router.push(href));
  }, [isReady, href, router]);

  return null;
}
