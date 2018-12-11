import React, { Component } from "react";
import Book from "../../components/Book/Book";
import SearchBarDiv from "../../components/SearchBarDiv/SearchBarDiv";
import "./Layout.css";
import Axios from "axios";
import defaultImage from "../../static/images/cards/index";
import Modal from "../../components/ModalDialog/ModalDialog";
import Explore from "../Explore/Explore";
import Request from "../Request/Request";
import Share from "../Share/Share";
import { Route, Link, Switch } from "react-router-dom";
import SERVER_URL from "../../static/Config/Config";
import Profile from "../Profile/Profile";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Admin from "../Admin/Admin";
import Logout from "../Logout/Logout";
import AppBar from "../../components/AppBar/AppBar";
import requestIcon from '../../static/images/request.png'

class Layout extends Component {
  constructor(props) {
    super(props);

    //Initialize a state
    this.state = {
      authToken: "",
      books: [],
      showData: false,
      searchString: "",
      open: false,
      currentBook: {},
      showStaticCards: true
    };
  }

  searchStringChangeHandler = event => {
    this.setState({ searchString: event.target.value });
  };

  componentDidMount() {
    let queryString = "interview";
    localStorage.setItem("currentPage", null);
    //console.log(localStorage.getItem("authToken"),"layout")
    let data = {
      page: 0
    }
    Axios.post(SERVER_URL + "api/bookFilter/explore", { data }).then(Response => {
      //console.log(Response);
      this.setState({ books: Response.data.books });
    });
    this.setState({ showStaticCards: false });
    this.setState({ showData: true });
    //console.log("Admin ", localStorage.getItem("isAdmin"))
  }

  reportButtonClickHandler = () => {
    //console.log("Report button clicked");
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
        ;
        //console.log(response);
      })
      .catch(error => { }); //console.log(error));

    this.setState({ open: false });
  };

  searchButtonClickHandler = () => {
    let queryString = this.state.searchString;
    //Axios.get('https://www.googleapis.com/books/v1/volumes?q='+queryString+'&orderBy=relevance&maxResults=12').then(
    //  &orderBy=relevance&maxResults=2
    Axios.get(
      SERVER_URL +
      "api/books/search/" +
      queryString +
      "&orderBy=relevance&maxResults=12"
    ).then(Response => {
      //console.log(Response);
      this.setState({ books: Response.data });
    });
    this.setState({ showStaticCards: false });
    this.setState({ showData: true });
  };

  disableStaticCardsHandler = () => {
    this.setState({ showStaticCards: !this.state.showStaticCards });
  };
  displayModalHandler(id) {
    //console.log("Clicked on the division", id);
    const currentBook1 = this.state.books.map(book => {
      return book._id === id.Key ? book : undefined;
    });

    currentBook1.map(book => {
      if (book !== undefined) {
        this.setState({ currentBook: book });
      }
      return undefined;
    });

    this.setState({ open: true });
    //console.log("the value state", this.state.open);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  setAuthToken = token => {
    //console.log("set Auth Token in parent=======", token);
    this.setState({ authToken: token });
  };

  requestBookButtonClickHandler = key => {

    if (localStorage.getItem("authToken") === "" || localStorage.getItem("authToken") === null) {
      window.location.assign('/login')
    }
    else {
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
        .catch(error => { });//console.log(error));

      this.setState({ open: false });
    }

  };

  render() {
    let book = null;
    let imageURL = null;
    let authorContent = null;
    localStorage.setItem("currentPage", null);
    if (this.state.showData) {
      // //console.log(this.state.books);
      book = this.state.books.map(post => {
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
    const staticcards = this.state.showStaticCards ? (
      <div className="StaticCards">
        <Link className="RouteLink" to={{ pathname: "/request" }}>
          <h1 className="StaticCard" onClick={this.disableStaticCardsHandler}>
            Request
          </h1>
        </Link>

        <Link className="RouteLink" to={{ pathname: "/share" }}>
          <h1 className="StaticCard" onClick={this.disableStaticCardsHandler}>
            Share
          </h1>
        </Link>

        <Link className="RouteLink" to={{ pathname: "/explore" }}>
          <h1 className="StaticCard" onClick={this.disableStaticCardsHandler}>
            Explore
          </h1>
        </Link>
      </div>
    ) : null;

    return (
      <div
      // style={{
      //   backgroundImage: `url(${Background})`,
      //   width: "100%",
      //   height: "auto",
      //   position: "absolute"
      // }}
      >
        <Route
          path="/"
          exact
          render={() => (
            <div>
              <Route
                path="/"
                exact
                render={() => (
                  <div>
                    <section>
                      <AppBar position="fixed">
                        {/* className={classes.appBar}> */}
                      </AppBar>
                    </section>
                    <section>
                      <SearchBarDiv
                        change={event => this.searchStringChangeHandler(event)}
                        click={() => this.searchButtonClickHandler()}
                      />
                    </section>
                    {staticcards}
                    {/* <Route path="/share" exact component={Share}/> */}
                    <section className="Books">{book}</section>
                    <section>
                      <Modal
                        shouldOpen={this.state.open}
                        close={() => this.handleClose()}
                        currentBook={this.state.currentBook}
                        buttonText="Request"
                        editable="false"
                        isLoggedIn={
                          localStorage.getItem("authToken") === "" || localStorage.getItem("authToken") === null ? false : true
                        }
                        authorNameChange={() => { }}
                        titleChange={() => { }}
                        descriptionChange={() => { }}
                        bookButtonClick={() => { }}
                        imageIconSelect={() => { }}
                        imageUrl={requestIcon}
                        bookButtonClick={() => this.requestBookButtonClickHandler()}
                        reportButtonClick={() => this.reportButtonClickHandler()}
                      />
                    </section>
                  </div>
                )}
              />
              <Switch>
                <Route
                  path="/request"
                  exact
                  render={props => <Request authToken={this.state.authToken} />}
                />
                <Route
                  path="/share"
                  exact
                  render={() => <Share authToken={this.state.authToken} />}
                />
                <Route
                  path="/explore"
                  exact
                  render={() => <Explore authToken={this.state.authToken} />}
                />
                <Route path="/profile/:id?" component={Profile} />
                <Route path="/login" exact render={props => <Login />} />
                <Route path="/register" exact render={() => <Register />} />
                <Route path="/admin" exact render={() => <Admin />} />
                <Route path="/logout" exact render={props => <Logout />} />
              </Switch>
            </div>
          )}
        />
        <Switch>
          <Route
            path="/request"
            exact
            render={props => <Request authToken={this.state.authToken} />}
          />
          <Route
            path="/share"
            exact
            render={() => <Share authToken={this.state.authToken} />}
          />
          <Route
            path="/explore"
            exact
            render={() => <Explore authToken={this.state.authToken} />}
          />
          <Route path="/profile/:id?" component={Profile} />
          <Route path="/login" exact render={props => <Login />} />
          <Route path="/register" exact render={() => <Register />} />
          <Route path="/admin" exact render={() => <Admin />} />
          <Route path="/logout" exact render={props => <Logout />} />
        </Switch>
      </div>
    );
  }
}

export default Layout;
