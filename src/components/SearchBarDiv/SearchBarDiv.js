import React, { Component } from 'react';
import Search from "../Search/Search";

import "./SearchBarDiv.css";

class FullPost extends Component {
  render() {
    let post = <p>Please select a Post!</p>;
    console.log("In full post reneder", this.props);
    post = (
      <div className="FullPost mainDiv">
        <br />
        <br />
        <Search placeholder="Enter title, author, genre, ISBN" click={this.props.click} change={this.props.change} />
      </div>
    );
    return post;
  }
}

export default FullPost;
