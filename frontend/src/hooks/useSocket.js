import { useEffect } from "react";

export function useSocket(event, handler){
  // Mock: expose global event bus on window
  useEffect(() => {
    if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
    const el = window.__campus_bus;
    el.addEventListener(event, (e)=> handler?.(e.detail));
    return () => el.removeEventListener(event, (e)=> handler?.(e.detail));
  }, [event, handler]);
}

// helper to emit events
export function emitSocket(event, payload){
  if(!window.__campus_bus) window.__campus_bus = document.createElement("div");
  const el = window.__campus_bus;
  el.dispatchEvent(new CustomEvent(event, { detail: payload }));
}
