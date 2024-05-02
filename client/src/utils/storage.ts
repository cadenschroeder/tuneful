import { Song } from "./consts";

type Item = Song;

function setThemeToLocalStorage(theme: string): void {
  localStorage.setItem("theme", theme);
}

function getThemeFromLocalStorage(): string {
  return localStorage.getItem("theme") || "";
}

function addToLocalStorage(key: "likes" | "dislikes", item: Item): void {
  const currentItems = getFromLocalStorage(key);
  if (!currentItems.includes(item)) {
    // Prevents duplicate entries
    const updatedItems = [...currentItems, item];
    localStorage.setItem(key, JSON.stringify(updatedItems));
  }
}

function getFromLocalStorage(key: "likes" | "dislikes"): Item[] {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
}

function clearLocalStorage(key: "likes" | "dislikes"): void {
  localStorage.removeItem(key);
}

export {
  addToLocalStorage,
  getFromLocalStorage,
  clearLocalStorage,
  setThemeToLocalStorage,
  getThemeFromLocalStorage,
};
