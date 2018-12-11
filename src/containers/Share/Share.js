import React, { Component } from "react";
import classes from "./Share.css";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import Search from "../../components/Search/Search";
import "../../components/Search/Search.css";
import Book from "../../components/Book/Book";
import Modal from "../../components/ModalDialog/ModalDialog";
import SERVER_URL from "../../static/Config/Config";
import AppBar from "../../components/AppBar/AppBar";
import defaultImage from "../../static/images/cards/index";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import BarcodeImage from "../../static/images/barcode.png";
import ImageSearch from "../../static/images/ImageSearch.png";
import shareIcon from "../../static/images/share.png";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = {
  root: {
    backgroundColor: "transparent"
  },

  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden"
  }
};

class Share extends Component {
  state = {
    showBook: false,
    bookISBN: "",
    populatedFieldsFromResponse: false,
    currentBook: {},
    open: false,
    selectedImageFile: "",
    authors: [],
    description: "",
    title: "",
    imageURL: "",
    bookURL: "",
    books: [],
    showData: false,
    showSnackbar: false,
    snackbarMessage: ""
  };

  shareBookClickHandler = () => {
    //console.log("Inside show form");
    this.setState({ showForm: true });
  };

  componentDidMount() {
    localStorage.setItem("currentPage", "share");
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  displayShareModalHandler = () => {
    this.setState({ open: true });
  };
  searchISBNHandler = () => {
    let queryString = this.state.bookISBN;
    //console.log(queryString);
    Axios.get(
      SERVER_URL +
      "api/books/search/isbn:" +
      queryString +
      "&orderBy=relevance&maxResults=12"
    ).then(Response => {
      //console.log(Response, "search isbn");
      this.setDefaultStates(Response.data);
      this.setState({ showBook: true });
      this.setState({ showData: true });
    });
  };
  setDefaultStates = data => {
    //console.log(data);
    //this.setState({currentBook: data[0]});
    this.setState({ books: data });
    //      this.setState({authors:data[0].authors})
    //    this.setState({title:data[0].title})
    //  this.setState({description:data[0].description})
    // this.setState({populatedFieldsFromResponse:true});
    //this.setState({showBook:true});
    //this.setState({showData:true});
  };

  SearchTextboxChangeHandler = event => {
    this.setState({ bookISBN: event.target.value });
    //console.log(typeof this.state.bookISBN.title);
  };

  descriptionChangeHandler = event => {
    this.setState({ description: event.target.innerText });
    // //console.log(this.state.description)
  };
  authorNameChangeHandler = (event, index) => {
    let tempAuthors = { ...event.target.innerText };
    // //console.log(tempAuthors);
    let tempAuthor = Object.keys(tempAuthors).map(author => {
      return tempAuthors[author];
    });
    let author = tempAuthor.join("").split("\n\n");
    // //console.log("authors",author);
    this.setState({ authors: author });
  };
  titleChangeHandler = event => {
    this.setState({ title: event.target.innerText });
    // //console.log(this.state.title)
  };

  shareBookButtonClickHandler = () => {
    let currbook = { ...this.state.currentBook };
    currbook.authors = this.state.authors;
    currbook.title = this.state.title;
    currbook.description = this.state.description;
    //console.log(currbook + " This is updated copy");
    const bookInfo = { ...currbook };
    //console.log(bookInfo.title + " This is updated copy bookInfo");

    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    Axios.post(SERVER_URL + "api/books/share", { bookInfo }, config).then(
      response => {
        //console.log(JSON.stringify(response) + "Here you got a response");
      }
    );
    this.handleClose();
    this.setState({
      snackbarMessage: "Your book is added to the shared library!"
    });
    this.setState({ showSnackbar: true });
  };

  sendToImageServer = (event, selectOption) => {
    let id = null;
    let url = null;
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    //console.log("selected image file ", this.state.selectedImageFile);
    const config = {
      baseURL: "https://api.imgur.com",
      headers: {
        Authorization: "Client-ID " + "08517942367910f"
      }
    };
    Axios.post("/3/image", formData, config)
      .then(Response => {
        //console.log("image post success", Response.request.responseText);
        id = JSON.parse(Response.request.responseText).data.id;
        url = "https://i.imgur.com/" + id + ".png";
        //console.log(id);
        //console.log(url);
        //console.log("select option ", selectOption);
        if (
          selectOption === "searchImage" ||
          selectOption === "searchBarcode"
        ) {
          this.setState({ imageURL: url });
          this.sendImageDataToBackEnd(selectOption);
        } else {
          this.setState({ bookURL: url });
          this.updateCurrentBookState();
        }

        //console.log(Response);
      })
      .catch(error => {
        //console.log("image post error");
        //console.log(error);
      });
  };

  sendImageDataToBackEnd = option => {
    if (option === "searchImage") {
      let data = {
        imageURL: this.state.imageURL
      };
      //console.log(this.state.imageURL);
      //this.sendToImageServer(event,"searchImage");
      Axios.post(SERVER_URL + "api/books/imageSearch", {
        data
      }).then(response => {
        //console.log(response.data);
        this.setDefaultStates(response.data);
        this.setState({ books: response.data });
        this.setState({ showData: true });
      });
    } else if (option === "searchBarcode") {
      let data = {
        imagePath: this.state.imageURL
      };
      //console.log(this.state.imageURL, "url");
      //this.sendToImageServer(event,"searchImage");
      Axios.post(SERVER_URL + "api/barcodeReader", {
        data
      }).then(response => {
        this.setDefaultStates(response.data);
        //console.log(response.data, "here");
        this.setState({ books: response.data });
        this.setState({ showData: true });
      });
    }
  };
  imageIconSelectHandler = event => {
    this.setState({ selectedImageFile: event.target.files[0] });
    //console.log("Image icon clicked------------------", event.target.files[0]);
    this.sendToImageServer(event, "searchImage");
  };

  barcodeSelectHandler = event => {
    this.setState({ selectedImageFile: event.target.files[0] });
    //console.log("Image icon clicked------------------", event.target.files[0]);
    this.sendToImageServer(event, "searchBarcode");
  };

  updateCurrentBookState = () => {
    let currbook = { ...this.state.currentBook };
    //console.log(this.state.currentBook);
    currbook.authors = this.state.authors;
    currbook.title = this.state.title;
    currbook.description = this.state.description;
    //console.log(currbook + "updateCurrentBookState");
    currbook.thumbnailURL = this.state.bookURL;
    currbook.smallThumbnailURL = this.state.bookURL;
    this.setState({ currentBook: currbook });
  };
  bookImageSelectHandler = event => {
    this.setState({ selectedImageFile: event.target.files[0] });
    //console.log("Image icon clicked------------------", event.target.files[0]);
    this.sendToImageServer(event, "bookImage");
    //console.log(this.state.bookURL);
  };

  displayModalHandler(id) {
    //console.log("Clicked on the division", id);
    const currentBook1 = this.state.books.map(book => {
      return book._id === id.Key ? book : undefined;
    });

    currentBook1.map(book => {
      if (book !== undefined) {
        this.setState({ currentBook: book });
        //this.setState({currentBook: data[0]});
        // this.setState({books:data});
        this.setState({ authors: book.authors });
        this.setState({ title: book.title });
        this.setState({ description: book.description });
        this.setState({ populatedFieldsFromResponse: true });
        //this.setState({showBook:true});
        //this.setState({showData:true});
      }
      return undefined;
    });

    this.setState({ open: true });
    //console.log("the value state", this.state.open);
  }

  render() {
    if (localStorage.getItem("authToken") === null) {
      //console.log("", localStorage.getItem("authToken"));
      return <Redirect to={{ pathname: "/login" }} />;
    }
    localStorage.setItem("currentPage", "share");
    let showbooks = null;
    let imageURL = null;
    let authorContent = null;
    if (this.state.showData) {
      //console.log(this.state.books);
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
    let snackbar = null;

    if (this.state.showSnackbar) {
      //console.log("show snach bar");
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
        <section>
          <section>
            <AppBar position="fixed" />
          </section>
        </section>

        {/* <div>
          <Search
            placeholder="Enter ISBN of your book"
            click={this.searchISBNHandler}
            change={this.SearchTextboxChangeHandler}
            imageSelect={this.imageIconSelectHandler}
            barcodeSelect={this.barcodeSelectHandler}
            imageUploadButton={true}
            barcodeUploadButton={true}
          />

        </div> */}

        <div className="FullPost1">
          <div className="Book1">
            <Search
              placeholder="Enter ISBN"
              click={this.searchISBNHandler}
              change={this.SearchTextboxChangeHandler}
              imageSelect={this.imageIconSelectHandler}
              barcodeSelect={this.barcodeSelectHandler}
            />
          </div>
          <div className="Book1">
            <div style={{ marginTop: "22%" }}>
              <div
                width="100px"
                height="100px"
                style={{ maxHeight: "100px", height: "100px" }}
              >
                <img src={ImageSearch} alt="Bar code preview" />
              </div>
              <div style={{ padding: "16px" }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="icon-button-file-image"
                  type="file"
                  onChange={this.imageIconSelectHandler}
                />
                <label htmlFor="icon-button-file-image">
                  <Button
                    style={{
                      backgroundColor: "#424242"
                    }}
                    variant="contained"
                    color="primary"
                    // className={props.button}
                    onClick={() =>
                      document.getElementById("icon-button-file-image").click()
                    }
                  >
                    Image Search
                  </Button>
                </label>
              </div>
            </div>
          </div>
          <div className="Book1">
            <div style={{ marginTop: "22%" }}>
              <div
                width="100px"
                height="100px"
                style={{ maxHeight: "100px", height: "100px" }}
              >
                <img
                  src={BarcodeImage}
                  alt="Bar code preview"
                  style={{ maxHeight: "100px", height: "100px" }}
                />
              </div>
              <div style={{ padding: "16px" }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="icon-button-file-barcode"
                  type="file"
                  onChange={this.barcodeSelectHandler}
                />
                <label htmlFor="icon-button-file-barcode">
                  <Button
                    variant="contained"
                    color="primary"
                    // className={props.button}
                    onClick={() =>
                      document
                        .getElementById("icon-button-file-barcode")
                        .click()
                    }
                    style={{ padding: "10px", backgroundColor: "#424242" }}
                  // onSubmit={props.click}
                  >
                    Barcode Search
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
        <section className="ShowBooks">{showbooks}</section>

        <section>
          <Modal
            shouldOpen={this.state.open}
            close={() => this.handleClose()}
            currentBook={this.state.currentBook}
            buttonText="Add to Shared Books"
            editable="true"
            isLoggedIn={false}
            authorNameChange={(event, index) =>
              this.authorNameChangeHandler(event, index)
            }
            titleChange={event => this.titleChangeHandler(event)}
            descriptionChange={event => {
              this.descriptionChangeHandler(event);
            }}
            bookButtonClick={() => this.shareBookButtonClickHandler()}
            imageIconSelect={this.bookImageSelectHandler}
            imageUrl={shareIcon}
          />
        </section>
        {snackbar}
      </div>
    );
  }
}

Share.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Share);
