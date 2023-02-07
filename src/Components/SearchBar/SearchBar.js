import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = { keyword: '' };
    this.search = this.search.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
  }
  search() {
    this.props.onSearch(this.state.keyword);
  }
  handleKeywordChange(event) {
    this.setState({keyword: event.target.value});
  }
  render () {
    return (
<div className="SearchBar">
  <input placeholder="Enter A Song, Album, or Artist here" onChange={this.handleKeywordChange} />
  <button className="SearchButton" onClick={this.search}>Search</button>
</div>
      )
    }
  }
  
  export default SearchBar;