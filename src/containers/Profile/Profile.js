import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import SERVER_URL from '../../static/Config/Config';
import Axios from 'axios';
import './Profile.css';
import defaultImage from '../../static/images/cards/index';
import profileImage from '../../static/images/userProfile.png';
import Book from '../../components/Book/Book'
import AppBar from '../../components/AppBar/AppBar'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, Divider} from '@material-ui/core';
import SvgIcon from "@material-ui/core/SvgIcon";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  imageGrid: {
    width: "40%",
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  profileCard: {
    justifyContent: "center",
    display: 'center',
  },
  booksGrid: {
    margin: theme.spacing.unit * 4,
  },
  icons: {
    margin: theme.spacing.unit
  }
});

class Profile extends Component {
  state = {
    name: "",
    age: "",
    email: "",
    booksInterested: [],
    genre: [],
    city: "",
    state: "",
    profilePicture: "",
    sharedBooks: [],
    requestedBooks: [],
    handle: "",
    snackbarMessage: "",
    showSnackbar: false
  };

  componentDidMount() {
    //console.log(this.props.params.id);
    const { id } = this.props.match.params;
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };


    console.log(localStorage.getItem('authToken'), "profile", id)

    if (id !== undefined) {
      Axios.get(SERVER_URL + 'api/profile/handle/' + id, config)
        .then((Response) => {
          // console.log('Response for user profile', JSON.stringify(Response.data))
          this.setState({ name: Response.data.name });
          this.setState({ email: Response.data.email });
          this.setState({ city: Response.data.city });
          this.setState({ state: Response.data.state });
          this.setState({ profilePicture: Response.data.avatar });
          this.setState({ booksInterested: Response.data.bookInterest });
          console.log(this.state);
        })
        .catch(error => {
          console.log(error);
        });

      /* TODO:
         Dont remove this block 
         Auth will be removed from back end
      */

      Axios.get(SERVER_URL + `api/profile/${id}/sharedBooks`, config)
        .then((Response) => {
          console.log('Response for user shared Books', Response.data)
          this.setState({ sharedBooks: Response.data })
        })

      Axios.get(SERVER_URL + `api/profile/${id}/requestedBooks`, config)
        .then((Response) => {
          console.log('Response for user Requested Books', Response.data)
          this.setState({ requestedBooks: Response.data })
        })
    }

    else {
      if ((localStorage.getItem('authToken') === null || localStorage.getItem('authToken') === "")) {
        window.location.assign('/login')
      }
      else {
        Axios.get(SERVER_URL + 'api/profile', config)
          .then((Response) => {
            // console.log('Response for user profile', JSON.stringify(Response.data))
            this.setState({ name: Response.data.name })
            this.setState({ email: Response.data.email })
            this.setState({ city: Response.data.city })
            this.setState({ state: Response.data.state })
            this.setState({ profilePicture: Response.data.avatar })
            this.setState({ booksInterested: Response.data.bookInterest })
            this.setState({ handle: Response.data.handle })
            console.log(this.state)


            Axios.get(SERVER_URL + `api/profile/${this.state.handle}/sharedBooks`, config)
              .then((Response) => {
                console.log('Response for user shared Books', Response)
                this.setState({ sharedBooks: Response.data })
              })

            Axios.get(SERVER_URL + `api/profile/${this.state.handle}/requestedBooks`, config)
              .then((Response) => {
                console.log('Response for user Requested Books', Response)
                this.setState({ requestedBooks: Response.data })
              })

          }
          ).catch(error => {
            console.log(error);
          });

      }

      Axios.get(SERVER_URL + `api/profile/${id}/requestedBooks`, config).then(
        Response => {
          console.log("Response for user Requested Books", Response.data);
          this.setState({ requestedBooks: Response.data });
        }
      );
    }
    // } else {
    //   if (
    //     localStorage.getItem("authToken") === null ||
    //     localStorage.getItem("authToken") === ""
    //   ) {
    //     window.location.assign("/login");
    //   } else {
    //     Axios.get(SERVER_URL + "api/profile", config)
    //       .then(Response => {
    //         // console.log('Response for user profile', JSON.stringify(Response.data))
    //         this.setState({ name: Response.data.name });
    //         this.setState({ email: Response.data.email });
    //         this.setState({ city: Response.data.city });
    //         this.setState({ state: Response.data.state });
    //         this.setState({ profilePicture: Response.data.avatar });
    //         this.setState({ booksInterested: Response.data.bookInterest });
    //         this.setState({ handle: Response.data.handle });
    //         console.log(this.state);

    //         Axios.get(
    //           SERVER_URL + `api/profile/${this.state.handle}/sharedBooks`,
    //           config
    //         ).then(Response => {
    //           console.log("Response for user shared Books", Response);
    //           this.setState({ sharedBooks: Response.data });
    //         });

    //         Axios.get(
    //           SERVER_URL + `api/profile/${this.state.handle}/requestedBooks`,
    //           config
    //         ).then(Response => {
    //           console.log("Response for user Requested Books", Response);
    //           this.setState({ requestedBooks: Response.data });
    //         });
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    // }
  }

  deleteShareBookHandler = key => {
    console.log(key, "KEY=====");
    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    const request = Axios.create(config);
    //api/profile/:userHandle/sharedBooks/:sharedBookid

    request
      .delete(
        `${SERVER_URL}api/profile/${this.state.handle}/sharedBooks/${key}`,
        key
      )
      .then(response => {
        console.log(response);
        this.setState({ sharedBooks: response.data });
        this.setState({
          snackbarMessage: "Your book is deleted from the shared library!"
        });
        this.setState({ showSnackbar: true });
      })
      .catch(error => {
        console.log("in deletebook handler profile.js", error);
      });
  };
  deletRequestBookHandler = key => {

    const config = {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    };
    const request = Axios.create(config);

    request
      .delete(
        `${SERVER_URL}api/profile/${this.state.handle}/requestedBooks/${key}`,
        key
      )
      .then(response => {
        console.log(response);
        this.setState({ requestedBooks: response.data });
        this.setState({
          snackbarMessage:
            "Your book is deleted from the requested book records!"
        });
        this.setState({ showSnackbar: true });
      })
      .catch(error => {
        console.log("in deletebook handler profile.js", error);
      });
  };


  render() {
    //   if(localStorage.getItem('authToken')===null){
    //     console.log("",localStorage.getItem('authToken'))
    //     return <Redirect to={{pathname: '/login'}}/>
    // }
    const { classes } = this.props;


    localStorage.setItem("currentPage", "profile");
    console.log("Profile item set as currentPage");

    let imageURL = null;
    let authorContent = null;
    let sharedBooks = this.state.sharedBooks.map(book => {
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
            showDeleteButton={
              localStorage.getItem("authToken") === null ||
                localStorage.getItem("authToken") === ""
                ? false
                : true
            }

            deleteBook={() => this.deleteShareBookHandler(Key)}
            click={key => { }}
          />
        );
      }
      return null;
    });

    let requestedBooks = this.state.requestedBooks.map(book => {
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
            showDeleteButton={
              localStorage.getItem("authToken") === null ||
                localStorage.getItem("authToken") === ""
                ? false
                : true
            }
            deleteBook={() => this.deletRequestBookHandler(Key)}
            click={key => { }}
          />
        );
      }
      return null;
    });

    // const { classes } = this.props;
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

    return (<React.Fragment>

      <AppBar position="relative" />


      <Grid container direction="column" justify="center" alignItems="center" spacing={40}>
        <Grid className={classes.imageGrid} >
          <Card className={classes.profileCard}>
            <CardContent>
              <Grid container direction="column">

                <div style={{ justifyContent: "center", display: 'flex', backgroundColor: 'orange' }}>
                  <img style={{ width: "40%", backgroundColor: "orange" }} className="Img" src={profileImage} alt="upload a dp" />
                </div>
                <div style={{ justifyContent: "center", display: 'flex', backgroundColor: 'orange' }}>
                  <Typography contentEditable={true} variant="h5">
                    {this.state.name}
                  </Typography>
                </div>

                <div>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <td>
                        {/* <div style={{ justifyContent: "center", display: 'flex' }}>
                          <Typography contentEditable={true} variant="body2">
                            {this.state.email}
                          </Typography>
                        </div> */}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ justifyContent: "center", display: 'flex' }}>
                          <Typography contentEditable={true} variant="body2">
                            {this.state.city},  {this.state.state}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </Grid>
              <Divider style={{ backgroundColor: "Orange" }} />
              <div className={classes.icons} style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
                <SvgIcon style={{ paddingRight: "10px", color: "#553b08" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 448 512"
                  >
                    <path d="M299.9 191.2c5.1 37.3-4.7 79-35.9 100.7-22.3 15.5-52.8 14.1-70.8 5.7-37.1-17.3-49.5-58.6-46.8-97.2 4.3-60.9 40.9-87.9 75.3-87.5 46.9-.2 71.8 31.8 78.2 78.3zM448 88v336c0 30.9-25.1 56-56 56H56c-30.9 0-56-25.1-56-56V88c0-30.9 25.1-56 56-56h336c30.9 0 56 25.1 56 56zM330 313.2s-.1-34-.1-217.3h-29v40.3c-.8.3-1.2-.5-1.6-1.2-9.6-20.7-35.9-46.3-76-46-51.9.4-87.2 31.2-100.6 77.8-4.3 14.9-5.8 30.1-5.5 45.6 1.7 77.9 45.1 117.8 112.4 115.2 28.9-1.1 54.5-17 69-45.2.5-1 1.1-1.9 1.7-2.9.2.1.4.1.6.2.3 3.8.2 30.7.1 34.5-.2 14.8-2 29.5-7.2 43.5-7.8 21-22.3 34.7-44.5 39.5-17.8 3.9-35.6 3.8-53.2-1.2-21.5-6.1-36.5-19-41.1-41.8-.3-1.6-1.3-1.3-2.3-1.3h-26.8c.8 10.6 3.2 20.3 8.5 29.2 24.2 40.5 82.7 48.5 128.2 37.4 49.9-12.3 67.3-54.9 67.4-106.3z"></path>
                  </svg>
                </SvgIcon>

                <SvgIcon style={{ color: "#3b5998", paddingRight: "10px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 448 512"
                  >
                    <path fillColor="blue" d="M448 56.7v398.5c0 13.7-11.1 24.7-24.7 24.7H309.1V306.5h58.2l8.7-67.6h-67v-43.2c0-19.6 5.4-32.9 33.5-32.9h35.8v-60.5c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 31.5-87 89.4v49.9h-58.4v67.6h58.4V480H24.7C11.1 480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32h398.5c13.7 0 24.8 11.1 24.8 24.7z"></path>
                  </svg>
                </SvgIcon>

                <SvgIcon style={{ paddingRight: "10px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" enable-background="new 0 0 48 48" id="Layer_1" version="1.1" viewBox="0 0 48 48"><circle cx="24" cy="24" fill="#CA3737" r="24" /><path d="M24,12.1c-6.6,0-11.9,5.3-11.9,11.9c0,4.9,2.9,9,7.1,10.9c0-0.8,0-1.8,0.2-2.7c0.2-1,1.5-6.5,1.5-6.5  s-0.4-0.8-0.4-1.9c0-1.8,1-3.1,2.3-3.1c1.1,0,1.6,0.8,1.6,1.8c0,1.1-0.7,2.7-1,4.2C23.1,28,24.1,29,25.3,29c2.3,0,3.8-2.9,3.8-6.3  c0-2.6-1.8-4.5-4.9-4.5c-3.6,0-5.8,2.7-5.8,5.7c0,1,0.3,1.8,0.8,2.3c0.2,0.3,0.3,0.4,0.2,0.7c-0.1,0.2-0.2,0.7-0.2,1  c-0.1,0.3-0.3,0.4-0.6,0.3c-1.7-0.7-2.4-2.5-2.4-4.5c0-3.4,2.8-7.4,8.5-7.4c4.5,0,7.5,3.3,7.5,6.8c0,4.7-2.6,8.1-6.4,8.1  c-1.3,0-2.5-0.7-2.9-1.5c0,0-0.7,2.7-0.8,3.3c-0.3,0.9-0.7,1.8-1.2,2.5c1.1,0.3,2.2,0.5,3.4,0.5c6.6,0,11.9-5.3,11.9-11.9  C35.9,17.4,30.6,12.1,24,12.1z" fill="#FFFFFF" /></svg>
                </SvgIcon>

                <SvgIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" enable-background="new 0 0 48 48" id="Layer_1" version="1.1" viewBox="0 0 48 48"><circle cx="24" cy="24" fill="#1CB7EB" r="24" /><g><g><path d="M36.8,15.4c-0.9,0.5-2,0.8-3,0.9c1.1-0.7,1.9-1.8,2.3-3.1c-1,0.6-2.1,1.1-3.4,1.4c-1-1.1-2.3-1.8-3.8-1.8    c-2.9,0-5.3,2.5-5.3,5.7c0,0.4,0,0.9,0.1,1.3c-4.4-0.2-8.3-2.5-10.9-5.9c-0.5,0.8-0.7,1.8-0.7,2.9c0,2,0.9,3.7,2.3,4.7    c-0.9,0-1.7-0.3-2.4-0.7c0,0,0,0.1,0,0.1c0,2.7,1.8,5,4.2,5.6c-0.4,0.1-0.9,0.2-1.4,0.2c-0.3,0-0.7,0-1-0.1    c0.7,2.3,2.6,3.9,4.9,3.9c-1.8,1.5-4.1,2.4-6.5,2.4c-0.4,0-0.8,0-1.3-0.1c2.3,1.6,5.1,2.6,8.1,2.6c9.7,0,15-8.6,15-16.1    c0-0.2,0-0.5,0-0.7C35.2,17.6,36.1,16.6,36.8,15.4z" fill="#FFFFFF" /></g></g></svg>
                </SvgIcon>

              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid style={{ borderBottom: "2px solid #424242", display: "flex", flexGrow: 1, width: '70%', height: '50px', justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h4" style={{ color: "#424242" }}>
            Shared Books
          </Typography>
        </Grid>
        <Grid className={classes.booksGrid}>
          <div className="SharedBooks">
            {sharedBooks}
          </div>
        </Grid>
        <Grid style={{ borderBottom: "2px solid #424242", display: "flex", flexGrow: 1, width: '70%', height: '50px', justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h4" style={{ color: "#424242" }}>
            Requested Books
          </Typography>
        </Grid >
        <Grid className={classes.booksGrid}>
          <div className="SharedBooks">
            {requestedBooks}
          </div>
        </Grid>
      </Grid>
      {snackbar}
    </React.Fragment>);
  }
}


Profile.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Profile);

