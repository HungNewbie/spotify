
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
    playlistName: "Default Playlist", 
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
        playlistName: "Default Playlist", 
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
      <p className='Claire'>Hello everyone, welcome to my Spotify website!</p>
        <p className='Claire'>
          In order to search for a song, a Spotify account is needed (you will be redirected to the
          login page when you click on the the search button). And you can change the name of your playlist
          too by clicking and deleting the default name and type the new name for it.
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
