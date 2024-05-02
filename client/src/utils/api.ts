import { getLoginCookie } from "./cookie";

const HOST = "http://localhost:3232";

async function queryAPI(
  endpoint: string,
  query_params: Record<string, string>
) {
  // query_params is a dictionary of key-value pairs that gets added to the URL as query parameters
  // e.g. { foo: "bar", hell: "o" } becomes "?foo=bar&hell=o"
  const paramsString = new URLSearchParams(query_params).toString();
  const url = `${HOST}/${endpoint}?${paramsString}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(response.status, response.statusText);
  }
  return response.json();
}

export async function addWord(word: string) {
  return await queryAPI("add-word", {
    uid: getLoginCookie() || "",
    word: word,
  });
}

export async function getWords() {
  return await queryAPI("list-words", {
    uid: getLoginCookie() || "",
  });
}

export async function clearUser(uid: string = getLoginCookie() || "") {
  return await queryAPI("clear-user", {
    uid: uid,
  });
}

export async function viewSongs() {
  return await queryAPI("viewSongs", {
    uid: "fake",//getLoginCookie() || "",
    isAllSongs: "true"
  });
}

export async function getRecommendations(songID: string, liked: string) {
  return await queryAPI("recommendation", {
    uid:  "fake", // getLoginCookie() || "",
    songID: songID,
    liked: liked
  });
}
