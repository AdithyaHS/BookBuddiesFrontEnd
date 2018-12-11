import React, { Component } from "react";
import Axios from "axios";
import Search from "../../components/Search/Search";
import "../../components/Search/Search.css";
import Book from "../../components/Book/Book";
import Modal from "../../components/ModalDialog/ModalDialog";
import SERVER_URL from "../../static/Config/Config";
import FilterDrawer from "../../components/FilterDrawer/FilterDrawer";
import defaultImage from "../../static/images/cards/index";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import "../Request/Request.css";
import { Redirect } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import requestIcon from '../../static/images/request.png'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#424242'
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

class Request extends Component {
  state = {
    books: [],
    showData: false,
    searchString: "",
    open: false,
    currentBook: {},
    availableFilters: {},
    authorSelected: [],
    languageSelected: [],
    checked: [],
    showFilterDrawer: false,
    showAppBar: true,
    showErroMessage: false,
    errorMessage: "",
    showSnackbar: false,
    snackbarMessage: ""
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  filterSelectedAuthors = () => { };

  displayRequestModalHandler = () => {
    this.setState({ open: true });
  };

  componentDidMount() {
    localStorage.setItem("currentPage", "request");

  }

  searchQueryHandler = () => {
    let queryString = this.state.searchString;
    this.setState({ showAppBar: false });
    const searchStringText = this.state.searchString;

    let data = {
      searchString: searchStringText
    };
    //console.log(data);
    Axios.post(SERVER_URL + "api/bookFilter/getSharedBooks", { data }).then(
      response => {
        //console.log(response);
        if (response.data.books.length === 0) {
          //console.log(response.data.books.length);
          this.setState({ errorMessage: "No books to display" });
          this.setState({ showErroMessage: true });
        } else {
          this.setState({ books: response.data.books });
          this.setState({ showData: true });
        }
      }
    );
    Axios.post(SERVER_URL + "api/bookFilter/fetchSharedBookFilters", {
      data
    }).then(Response => {
      this.setState({ availableFilters: Response.data[0] });
      //console.log(
      //  Response.data[0],
      //  this.state.availableFilters,
      //  "available filters--------"
      // );
      this.setState({ showFilterDrawer: true });
      this.setState({ showAppBar: true });
    });
  };
  SearchTextboxChangeHandler = event => {
    this.setState({ searchString: event.target.value });
  };

  displayModalHandler(id) {
    const currentBook1 = this.state.books.map(book => {
      //console.log(book._id);
      //console.log(id);
      return book._id === id.Key ? book : undefined;
    });

    currentBook1.map(book => {
      if (book !== undefined) {
        this.setState({ currentBook: book });
      }
      return undefined;
    });
    this.setState({ open: true });
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
    //console.log(this.state.checked);
  };

  applyButtonHandler = () => {
    //console.log("here");
    let newCheckedState = { ...this.state.checked };
    let authorArray = [];
    let genreArray = [];
    let language = ""; /* should be changed to array after murtaza's checkin*/
    let locationArray = [];
    let ratingValue = -2;
    Object.keys(newCheckedState).map(index => {
      switch (newCheckedState[index].split("~", 1)[0]) {
        case "Authors":
          authorArray.push(newCheckedState[index].split("~", 2)[1]);
          break;
        case "Genre":
          genreArray.push(newCheckedState[index].split("~", 2)[1]);
          break;
        case "Language":
          language = newCheckedState[index].split("~", 2)[1];
          break;
        case "Location":
          locationArray.push(newCheckedState[index].split("~", 2)[1]);
          break;
        case "Rating":
          ratingValue = newCheckedState[index].split("~", 2)[1];
          break;
        default:
      }
    });

    //console.log("Apply Buuton handler authors-", authorArray);
    const searchStringText = this.state.searchString;

    let data = {
      searchString: searchStringText,
      genre: genreArray.length === 0 ? [""] : genreArray,
      authors: authorArray,
      language: language,
      page: "0",
      rating: ratingValue,
      location: ""
    };
    Axios.post(SERVER_URL + "api/bookFilter/getSharedBooks", {
      data
    }).then(response => {
      //console.log(JSON.stringify(response.data.books));
      //console.log(JSON.stringify(response.data));
      this.setState({ books: response.data.books });
    });
  };

  requestBookButtonClickHandler = key => {
    //console.log(key);
    let data = {
      bookId: this.state.currentBook._id
    };
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    //console.log(data);
    Axios.post(SERVER_URL + "api/books/initiateCommunication", data, config)
      .then(response => {
        //console.log(response);
      })
      .catch(error => { }); //console.log(error));

    this.setState({ open: false });
    this.setState({ snackbarMessage: "Your request is submitted!" });
    this.setState({ showSnackbar: true });
  };
  reportButtonClickHandler = () => {

    let data = "";
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    Axios.post(
      SERVER_URL + "api/books/report/" + this.state.currentBook._id,
      data,
      config
    )
      .then(response => {

      })
      .catch(error => { }); //console.log(error));

    this.setState({ open: false });
    this.setState({ snackbarMessage: "Thank you for reporting!" });
    this.setState({ showSnackbar: true });
  };
  render() {
    if (localStorage.getItem("authToken") === null) {
      //console.log("", localStorage.getItem("authToken"));
      return <Redirect to={{ pathname: "/login" }} />;
    }





    let showbooks = null;
    let imageURL = null;
    let authorContent = null;
    let appBar = null;
    let filterDrawerDisplay = null;
    const { classes } = this.props;

    let snackbar = null;

    if (this.state.showSnackbar) {
      //console.log("show snach bar")
      snackbar =
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={true}
          autoHideDuration={2000}
          onClose={() => this.setState({ showSnackbar: false })}
          ContentProps={{
            'aria-describedby': 'message-id',
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
            </IconButton>,
          ]}
        />
    }
    if (this.state.showFilterDrawer && !this.state.showErroMessage) {
      filterDrawerDisplay = (
        <section>
          <FilterDrawer
            filterDetails={this.state.availableFilters}
            showdata={this.state.showData}
            toggle={this.handleToggle}
            check={this.state.checked}
            click={this.applyButtonHandler}
            className={classes.drawer}
          />
        </section>
      );
    }

    if (this.state.showAppBar && !this.state.showErroMessage) {

      appBar = (
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: "1" }}>
              <a href="/" className="AppBarButton">
                Book Buddies
              </a>
              <a href="/request" className="AppBarButton" id="request" style={{ color: "Orange" }}>
                Explore
              </a>
              <a href="/share" className="AppBarButton">
                Share
              </a>
              <a href="/profile" className="AppBarButton">
                Profile
              </a>
              {localStorage.getItem("isAdmin") !== "false" && localStorage.getItem("isAdmin") !== null ? (
                <a href="/admin" className="AppBarButton">
                  Admin
            </a>
              ) :
                (
                  null
                )}
            </Typography>
            <Typography variant="h6" color="inherit">
              {localStorage.getItem("authToken") === null ? (
                <a href="/login" className="AppBarButton">
                  Login
                </a>
              ) : (
                  <a
                    href="/logout"
                    className="AppBarButton"
                    style={{ display: "flex" }}
                  >
                    <div style={{ padding: "8px" }}>
                      <SvgIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 18 18"
                        >
                          <path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 2.75c1.24 0 2.25 1.01 2.25 2.25S10.24 8.25 9 8.25 6.75 7.24 6.75 6 7.76 3.75 9 3.75zM9 14.5c-1.86 0-3.49-.92-4.49-2.33C4.62 10.72 7.53 10 9 10c1.47 0 4.38.72 4.49 2.17-1 1.41-2.63 2.33-4.49 2.33z" />
                        </svg>
                      </SvgIcon>
                    </div>
                    <div style={{ padding: "8px" }}>Logout</div>
                  </a>
                )}
            </Typography>
          </Toolbar>
        </AppBar>
      );
      // document.getElementById("request").setAttribute("style","color: Orange");
    }

    if (this.state.showData && !this.state.showErroMessage) {
      ////console.log(this.state.books);
      showbooks = this.state.books.map(post => {
        if (post !== "") {
          if (post.smallThumbnailURL !== undefined) {
            imageURL = post.smallThumbnailURL;
          } else {
            imageURL = defaultImage;
          }

          if (post.authors !== undefined) {
            authorContent = post.authors;
          }
          const Key = post._id;

          return (
            <Book
              key={Key}
              title={post.title}
              author={authorContent}
              smallThumbnail={imageURL}
              click={() => this.displayModalHandler({ Key })}
            />
          );
        }
        return null;
      });
    }

    return (
      <div>
        {filterDrawerDisplay}
        {appBar}
        <div className="FilterCard">
          <div className="Display">
            <Search
              placeholder="Enter topic, author, genre, ISBN"
              click={this.searchQueryHandler}
              change={this.SearchTextboxChangeHandler}
              checked={this.state.checked}
            />

            {this.state.showErroMessage ? (
              <p>this.state.errorMessage</p>
            ) : (
                showbooks
              )}
            <section>
              <Modal
                shouldOpen={this.state.open}
                close={() => this.handleClose()}
                currentBook={this.state.currentBook}
                buttonText="  Request"
                isLoggedIn={
                  localStorage.getItem("authToken") === "" ? false : true
                }
                editable="false"
                reportButtonClick={() => this.reportButtonClickHandler()}
                authorNameChange={() => { }}
                titleChange={() => { }}
                descriptionChange={() => { }}
                bookButtonClick={() => this.requestBookButtonClickHandler()}
                imageIconSelect={() => { }}
                imageUrl={requestIcon}
              />
            </section>
          </div>
        </div>
        {snackbar}
      </div>
    );
  }
}

Request.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Request);
