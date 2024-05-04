import { fetchSongBatch } from "./api";
import { Song } from "./consts";

type Item = Song;

function setThemeToLocalStorage(theme: string): void {
  localStorage.setItem("theme", theme);
}

function getThemeFromLocalStorage(): string {
  return localStorage.getItem("theme") || "";
}

function addToLocalStorage(
  key: "likes" | "dislikes" | "songs",
  item: Item
): void {
  const currentItems = getFromLocalStorage(key);
  if (!currentItems.includes(item)) {
    // Prevents duplicate entries
    const updatedItems = [...currentItems, item];
    localStorage.setItem(key, JSON.stringify(updatedItems));
  }
}

function addMultipleToLocalStorage(
  key: "likes" | "dislikes" | "songs",
  items: Item[]
): void {
  const currentItems = getFromLocalStorage(key);
  const updatedItems = [...currentItems, ...items];
  localStorage.setItem(key, JSON.stringify(updatedItems));
}

function getFromLocalStorage(key: "likes" | "dislikes" | "songs"): Item[] {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
}

function clearLocalStorage(key: "likes" | "dislikes" | "songs"): void {
  localStorage.removeItem(key);
}

var isQueing = false;

async function updateSongsQueue() {
  console.log("updateSongsQueue");
  if (isQueing) return;
  isQueing = true;
  let batch = await fetchSongBatch(false);
  isQueing = false;
  let items = getFromLocalStorage("songs");
  if (items.length >= 3) return items;
  items = [...items, ...batch];
  localStorage.setItem("songs", JSON.stringify(items));
}

function fetchSongsQueue(): Item[] {
  let items = getFromLocalStorage("songs");
  items.shift();
  if (items.length < 3 && !isQueing) updateSongsQueue();
  localStorage.setItem("songs", JSON.stringify(items));
  return items;
}

export {
  addToLocalStorage,
  getFromLocalStorage,
  clearLocalStorage,
  setThemeToLocalStorage,
  getThemeFromLocalStorage,
  addMultipleToLocalStorage,
  updateSongsQueue,
  fetchSongsQueue,
};
