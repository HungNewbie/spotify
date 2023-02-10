
import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = { searchResults: [],
    playlistName: "Claire's Playlist", 
    playlistTracks: []  };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) { //if the id is existed, return nothing.
      return;
    }
    tracks.push(track);  //otherwise, add that new song to the array
    this.setState({playlistTracks: tracks})
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
     tracks = tracks.filter(currentTrack => currentTrack.id !== track.id); // if the id of a song that 
     // user try to remove match the id of the song inside the array, then that song will be filter out
     // and be removed. Otherwise, it will be updated into the array.
    this.setState({playlistTracks: tracks});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: "Claire's Playlist", 
        playlistTracks: []
      });
    })
  }

  search(keyword) {
    Spotify.search(keyword).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render () {
    return (
      <div>
  <h1><span className="highlight">Spotify</span> Songs</h1>
  <div className="App">
    <br />
      <p className='Claire'>Hi Claire, welcome to my website!</p>
        <p className='Claire'>
        Please note, the search button will only work after you login to your spotify account 
        (click on search button will redirect you to the login page), and I know you 
        don't want to log your personal Spotify account, so I make a dummy Spotfy account for you to test it 
        instead. 
      </p>
      <p className='Claire'>After login to the account, you can enter your keyword, then click on the search button again. 
        Your result will appear below the Results columm. Now you can play the preview of your choice, or
        click on the "+" button to add it to your playlist (you can change the playlist name by delate the old 
        name, then enter the name of your choice too).
      </p>
      <p className='Claire'>Any song that you add from Results will appear in your playlist. To remove any unwanted songs, click
        on the "-" button. To save your playlist, click on the "SAVE TO SPOTIFY" button and they will be saved on
        your newly created playlist. And if you login into the Spotify account that I gave you, you will see the playlist
        and its song on that account now. Pretty neat, huh? 
      </p>
   <SearchBar onSearch={this.search} /> 
    <div className="App-playlist">

     <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/> 

        <Playlist playlistName ={this.state.playlistName} playlistTracks ={this.state.playlistTracks} 
        onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} /> 
    </div>
  </div>
</div>
    )
  }
}

export default App;
