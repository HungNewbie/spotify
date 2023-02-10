const clientId = 'fefb9fee0c4d406bb9b41b8a065446b8';
const redirectUri = 'http://bouncy-sky.surge.sh';
//const redirectUri = 'http://localhost:3000/';
let accessToken;
const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        //if accessToken is not set, check the URL to see if it has just been obtained.
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
                // these codes are for wiping the access token and URL parameters in order to grab a new access token 
        // when it expires.
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
        }
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },
     async search(keyword) {
        let accessToken = Spotify.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${keyword}`, {
             headers: {
                 Authorization: `Bearer ${accessToken}`
             }
         });
         const jsonResponse = await response.json();
         if (!jsonResponse.tracks) {
             return [];
         }
         return jsonResponse.tracks.items.map(track => {
             return {
                 id: track.id,
                 name: track.name,
                 artist: track.artists[0].name,
                 album: track.album.name,
                 uri: track.uri,
                 preview: track.preview_url
             };
         });},

 async savePlaylist(playlistName, tracksUri) {
    if (!(playlistName && tracksUri)) return;

    // Get spotify user Id
    let userId = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => jsonResponse.id)

    // Create playlist
    let playlistId = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
        }),
        json: true,
      }
    )
      .then((response) => response.json())
      .then((jsonResponse) => jsonResponse.id)

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracksUri,
      }),
    })
      .then((response) => {
        console.log("Successfully add songs to playlist");
      })
      .catch((error) => {
        console.log("Can't add song to playlist");
      });
  },
   async playTrack(name, trackUris) {
    if (!(name && trackUris)) return;

    // Get spotify user Id
    await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => jsonResponse.id)
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                method: 'POST',
                body: JSON.stringify({
                        name: name,
                        "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                        "offset": {"position": 5},
                        "position_ms": 0
                    })
                      })
}
}
export default Spotify;