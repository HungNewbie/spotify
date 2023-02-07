const clientId = '53759af1d6444beb822b72e84720a6e4';

const redirectUri = 'http://bouncy-sky.surge.sh';
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
                 uri: track.uri
             };
         });},
  /*async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers ={Authorization: `Bearer ${accessToken}`}
        let userId;

        return fetch('https://api.spotify.com/v1/me', {
            headers: {headers}
        }).then(response => {
            return response.json();
    }).then(async jsonResponse => {
        userId = jsonResponse.id;
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
        });
        const jsonResponse_1 = await response.json();
        const playlistId = jsonResponse_1.id;
        return await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
        });
    })
    }
} */
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
      .catch((error) => {
        console.log("Can't fetch user ID");
      });

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
      .catch((error) => {
        console.log("Can't create playlist");
      });

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
}; 
export default Spotify;