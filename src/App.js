import React, { Component } from "react";

import Layout from "./containers/Layout/Layout";
import { BrowserRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Background from "./static/images/BackgroundImage.jpg";

const styles = theme => ({
  App: {
    // backgroundImage: "url(" + { Background } + ")"
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <div className={classes.App}>
          <Layout />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(App);
