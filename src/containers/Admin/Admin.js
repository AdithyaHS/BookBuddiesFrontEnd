import React, { Component } from "react";
import Axios from "axios";
import SERVER_URL from "../../static/Config/Config";
import defaultImage from "../../static/images/cards/index";
import Book from "../../components/Book/Book";
import AppBar from "../../components/AppBar/AppBar";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#424242"
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar
});

class Admin extends Component {
  state = {
    reportedBooks: [],
    showSnackbar: false,
    snackbarMessage: ""
  };
  componentDidMount() {
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    Axios.post(SERVER_URL + "api/admin/getReportedBooks", "", config).then(
      Response => {
        console.log("Response for user shared Books", Response);
        this.setState({ reportedBooks: Response.data.books });
      }
    );
  }

  deleteBookHandler = key => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    const request = Axios.create(config);

    request
      .delete(`${SERVER_URL}api/admin/deleteReportedBooks/${key}`, key)
      .then(response => {
        console.log(response);
        this.setState({ reportedBooks: response.data.books });
        this.setState({ snackbarMessage: "Book deleted from the database!" });
        this.setState({ showSnackbar: true });
      });
  };

  ignoreButtonHandler = key => {
    console.log(key, "ignore KEY=====");
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    const request = Axios.create(config);

    request
      .delete(`${SERVER_URL}api/admin/discardReportedBooks/${key}`, key)
      .then(response => {
        // console.log(response)
        this.setState({ reportedBooks: response.data.books });
        this.setState({
          snackbarMessage: "Book marked as safe!"
        });
        this.setState({ showSnackbar: true });
      });
  };

  render() {
    let imageURL = null;
    let authorContent = null;
    let reportedBooks = this.state.reportedBooks.map(book => {
      if (book !== "") {
        if (book.smallThumbnailURL !== undefined) {
          imageURL = book.smallThumbnailURL;
        } else {
          imageURL = defaultImage;
        }

        if (book.authors !== undefined) {
          authorContent = book.authors;
        }
        const Key = book._id;

        return (
          <Book
            key={Key}
            title={book.title}
            author={authorContent}
            smallThumbnail={imageURL}
            showDeleteButton={true}
            showIgnoreButton={true}
            deleteBook={() => this.deleteBookHandler(Key)}
            ignoreBook={() => this.ignoreButtonHandler(Key)}
            click={() => {}}
          />
        );
      }
      return null;
    });
    const { classes } = this.props;

    let snackbar = null;

    if (this.state.showSnackbar) {
      console.log("show snach bar");
      snackbar = (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={true}
          autoHideDuration={2000}
          onClose={() => this.setState({ showSnackbar: false })}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.snackbarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => this.setState({ showSnackbar: false })}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      );
    }
    return (
      <div>
        <div>
          <AppBar position="fixed" />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <section>
            <h1> Reported Books</h1>
          </section>
        </div>
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center"
          }}
        >
          {reportedBooks}
        </div>
        {snackbar}
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);
