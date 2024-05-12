import { authLoginMock } from "./utils/auth";
import { songs as mockSongs } from "./utils/consts";
import {
  addLoginCookie,
  getLoginCookie,
  removeLoginCookie,
} from "./utils/cookie";
import {
  addMultipleToLocalStorage,
  addToLocalStorage,
  clearLocalStorage,
  getFromLocalStorage,
  getThemeFromLocalStorage,
  setThemeToLocalStorage,
} from "./utils/storage";

/**
 * auth.ts tests
 */

test("authLoginMock returns true", () => {
  expect(authLoginMock()).toBe(true);
});

/**
 * cookie.ts tests
 */
test("addLoginCookie", () => {
  const uid = "test";
  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
});

test("getLoginCookie", () => {
  const uid = "test";
  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
});

test("removeLoginCookie", () => {
  const uid = "test";
  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
  expect(getLoginCookie()).not.toBeUndefined();
  expect(getLoginCookie()).not.toBeNull();
  expect(getLoginCookie()).not.toBe("");

  removeLoginCookie();
  expect(getLoginCookie()).toBeUndefined();
});

test("add remove add login cookie", () => {
  const uid = "test";

  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
  expect(getLoginCookie()).not.toBeUndefined();
  expect(getLoginCookie()).not.toBeNull();
  expect(getLoginCookie()).not.toBe("");

  removeLoginCookie();
  expect(getLoginCookie()).toBeUndefined();

  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
  expect(getLoginCookie()).not.toBeUndefined();
  expect(getLoginCookie()).not.toBeNull();
  expect(getLoginCookie()).not.toBe("");
});

test("add remove add login cookie with different uid", () => {
  const uid = "test";
  const uid2 = "test2";

  addLoginCookie(uid);
  expect(getLoginCookie()).toBe(uid);
  expect(getLoginCookie()).not.toBeUndefined();
  expect(getLoginCookie()).not.toBeNull();
  expect(getLoginCookie()).not.toBe("");

  removeLoginCookie();
  expect(getLoginCookie()).toBeUndefined();

  addLoginCookie(uid2);
  expect(getLoginCookie()).toBe(uid2);
  expect(getLoginCookie()).not.toBeUndefined();
  expect(getLoginCookie()).not.toBeNull();
  expect(getLoginCookie()).not.toBe("");
});

/**
 * storage.ts tests
 */

test("setThemeToLocalStorage", () => {
  const theme = "test";
  setThemeToLocalStorage(theme);
  expect(getThemeFromLocalStorage()).toBe(theme);
  expect(getThemeFromLocalStorage()).not.toBeUndefined();
});

test("getThemeFromLocalStorage", () => {
  const theme = "test";
  setThemeToLocalStorage(theme);
  expect(getThemeFromLocalStorage()).toBe(theme);
  expect(getThemeFromLocalStorage()).not.toBeUndefined();
});

test("set get set get theme", () => {
  const theme1 = "test1";
  const theme2 = "test2";

  setThemeToLocalStorage(theme1);
  expect(getThemeFromLocalStorage()).toBe(theme1);
  expect(getThemeFromLocalStorage()).not.toBeUndefined();

  setThemeToLocalStorage(theme2);
  expect(getThemeFromLocalStorage()).toBe(theme2);
  expect(getThemeFromLocalStorage()).not.toBeUndefined();
});

test("addToLocalStorage", () => {
  expect(getFromLocalStorage("songs")).toBe([]);
  const like = mockSongs[0];
  addToLocalStorage("likes", like);
  expect(getFromLocalStorage("songs")).toBe([like]);
});

test("getFromLocalStorage", () => {
  expect(getFromLocalStorage("songs")).toBe([]);
  const like = mockSongs[0];
  addToLocalStorage("likes", like);
  expect(getFromLocalStorage("songs")).toBe([like]);
  expect(getFromLocalStorage("songs")).not.toBeUndefined();
});

test("addMultipleToLocalStorage", () => {
  expect(getFromLocalStorage("songs")).toBe([]);
  const likes = mockSongs;
  addMultipleToLocalStorage("likes", likes);
  expect(getFromLocalStorage("songs")).toBe(likes);
  expect(getFromLocalStorage("songs")).not.toBeUndefined();
});

test("clearLocalStorage", () => {
  expect(getFromLocalStorage("songs")).toBe([]);
  const likes = mockSongs;
  addMultipleToLocalStorage("likes", likes);
  expect(getFromLocalStorage("songs")).toBe(likes);
  expect(getFromLocalStorage("songs")).not.toBeUndefined();

  clearLocalStorage("likes");
  expect(getFromLocalStorage("songs")).toBe([]);
});

test("add one clear add multipl Local Storage", () => {
  expect(getFromLocalStorage("songs")).toBe([]);
  const likes = mockSongs;
  addMultipleToLocalStorage("likes", likes);
  expect(getFromLocalStorage("songs")).toBe(likes);
  expect(getFromLocalStorage("songs")).not.toBeUndefined();

  clearLocalStorage("likes");
  expect(getFromLocalStorage("songs")).toBe([]);

  const like = mockSongs[0];
  addToLocalStorage("likes", like);
  expect(getFromLocalStorage("songs")).toBe([like]);
  expect(getFromLocalStorage("songs")).not.toBeUndefined();

  clearLocalStorage("likes");
  expect(getFromLocalStorage("songs")).toBe([]);
});
