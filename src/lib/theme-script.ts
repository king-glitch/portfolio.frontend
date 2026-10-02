import { config } from "@/config";

/** Runs in <head> before paint: stored choice, else the OS preference, decides the `dark` class (no flash). */
export const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(config.theme.storageKey)});var d=s?s==="dark":matchMedia(${JSON.stringify(config.theme.darkQuery)}).matches;document.documentElement.classList.toggle(${JSON.stringify(config.theme.darkClass)},d)}catch(e){}})()`;
