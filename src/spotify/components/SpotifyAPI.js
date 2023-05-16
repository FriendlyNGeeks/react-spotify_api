import querystring from "querystring";
import { Buffer } from "buffer";

const NOW_PLAYING_ENDPOINT = process.env.REACT_APP_SPOTIFY_ENDPOINT_PLAYING || null;
const TOKEN_ENDPOINT = process.env.REACT_APP_SPOTIFY_ENDPOINT_TOKEN || null;
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const basic = new Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    // mode: "no-cors", // Add this line
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getNowPlaying = async (client_id, client_secret, refresh_token) => {
  const { access_token } = await getAccessToken(
    client_id,
    client_secret,
    refresh_token
  );

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export default async function getNowPlayingItem(
  client_id,
  client_secret,
  refresh_token
) {
  const response = await getNowPlaying(client_id, client_secret, refresh_token);
  if (response.status === 204 || response.status > 400) {
    return false;
  }

  const song = await response.json();
  if (song.item.album) {
    const albumImageUrl = song.item.album.images[0].url || null;
    const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
    const isPlaying = song.is_playing || null;
    const songUrl = song.item.external_urls.spotify || null;
    const title = song.item.name || null;
    const duration = song.item.duration_ms || null;
    const position = song.progress_ms || null;    
    
    return {
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
      duration,
      position,
    };
  }else {
    const albumImageUrl = null;
    const artist = null;
    const isPlaying = null;
    const songUrl = null;
    const title = null;
    const duration = null;
    const position = null;
    
    return {
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
      duration,
      position,
    };
  }

}
