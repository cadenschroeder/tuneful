import { Song, songs as mockedSongs } from "./consts";
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

export async function addLikes(songNames: string) {
  return await queryAPI("addLikes", {
    uid: getLoginCookie() || "",
    songNames: songNames,
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

export async function viewSongs(isAllSongs: boolean) {
  console.log("hitting api");
  return await queryAPI("viewSongs", {
    uid: getLoginCookie() || "",
    isAllSongs: isAllSongs.toString(),
  });
}

export async function getRecommendations(
  trackIDs: string,
  liked: string,
  first: string
) {
  return await queryAPI("recommendation", {
    uid: getLoginCookie() || "",
    trackIDs: trackIDs,
    liked: liked,
    first: first,
  });
}

export async function fetchSongBatch(mocked?: boolean): Promise<Song[]> {
  if (mocked) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockedSongs;
  }

  const result = await viewSongs(false);
  console.log("result from view songs: ");
  console.log(result);
  console.log("==========");
  return result.responseMap.songs.map((mapSong: { [key: string]: any }) => {
    console.log(mapSong);
    const name: string = mapSong.name?.toString() || "";
    const cover: string = mapSong.images?.toString() || "";
    const artist: string = mapSong.artists?.toString() || "";
    const blob: string = mapSong.snippetURL?.toString() || "";
    const spotify: string =
      "https://open.spotify.com/track/3Z2y6rX1dZCfLJ9yZGzQw5"; // TODO: ask and fix what this does
    const songId: string = mapSong.trackID?.toString() || "";
    return {
      name: name,
      cover: cover,
      artist: artist,
      blob: blob,
      spotify: spotify,
      songId: songId,
    };
  });
}
