import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CredentialForm from './Credentials';
import ProfileForm from './ProfileForm';
import DenseAppBar from '../../components/AppBar/AppBar';
import Axios from 'axios';
import SERVER_URL from '../../static/Config/Config';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 4,
      padding: theme.spacing.unit * 2,
    },
  },
  stepper: {
    // padding: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    marginLeft: "80px",
    marginRight: "100px",
    marginBottom: "25px"
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
  },

  login: {
    marginLeft: "250px",

    marginTop: "30px",
    align: "center"
  }

});

const steps = ['Your Credentials', 'Build a Profile'];

class Checkout extends React.Component {
  state = {
    activeStep: 0,
    authToken:'',
    userName: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    county: '',
    city: '',
    bio:'',
    bookInterests: [],
    address:'',
  };

  countyChangeHandler = (e) => {
    this.setState({ county: e.target.value });
  }

  cityChangeHandler = (e) => {
    this.setState({ city: e.target.value });
  }

  bioChangeHandler = (e) => {
    this.setState({ bio: e.target.value });
  }
  bookInterestsChangeHandler = (e) => {
    this.setState({ bookInterests: e.target.value });
  }

  userNameChangeHandler = (e) => {
    this.setState({ userName: e.target.value });
  }

  nameChangeHandler = (e) => {
    this.setState({ name: e.target.value });
  }

  emailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  }


  passwordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  }
  confirmPasswordChangeHandler = (e) => {
    this.setState({ confirmPassword: e.target.value });
  }

  addressChangeHandler = (e) => {
    this.setState({ address: e.target.value });
  }

  nextButtonClickHandler=()=>{

    if(this.state.activeStep === 1){
      let data = {
        handle: this.state.userName,
        name: this.state.name,
        address: this.state.address,
        city: this.state.city,
        state: this.state.county,
        bio: this.state.bio,
        email:this.state.email,
        bookInterests:this.state.bookInterests
      }
      const config = {
        headers: {
          'Authorization': this.state.authToken
        }
      };
      console.log(config);
      console.log("Config=========="+ config.headers.Authorization)

      Axios.post(SERVER_URL + 'api/profile', data, config)
        .then((Response) => {
          console.log(Response);
          this.setState(state => ({
            activeStep: state.activeStep + 1,
          }));
        }
        ).catch(error => {
          console.log(error);
        });

    }

    else{
      let data={
        email:this.state.email,
        password:this.state.password,
        password2:this.state.confirmPassword
      }

      Axios.post(SERVER_URL + 'api/users/register',{data})
      .then(response=>{
        this.defaultLoginInstance();
        this.setState(state => ({
          activeStep: state.activeStep + 1,
        }));
        console.log(response.data)
      }

      )
      .catch();
  }
}

  defaultLoginInstance=()=>{
    let tempAuthToken=""
    let tempIdToken = ""
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    Axios
    .post(SERVER_URL+"api/users/login", user)
    .then(res=>{
      this.setState({authToken:res.data.token})
    }
    )
    .catch(err => this.setState({ errors: err.response.data }));
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
    return <CredentialForm 
    emailChange={(event)=>this.emailChangeHandler(event)} 
    passwordChange={(event)=>this.passwordChangeHandler(event)} 
    confirmPasswordChange = {(event)=>this.confirmPasswordChangeHandler(event)}
    />;
      case 1:
        return <ProfileForm 
        stateChange = {(event)=>this.countyChangeHandler(event)}
        cityChange ={(event)=>this.cityChangeHandler(event)}
        bioChange = {(event)=>this.bioChangeHandler(event)}
        userNameChange = {(event)=>this.userNameChangeHandler(event)}
        nameChange = {(event)=>this.nameChangeHandler(event)}
        addressChange ={(event)=>this.addressChangeHandler(event)}
        bookInterestsChange = {(event)=>this.bookInterestsChangeHandler(event)}

        />;
    
      default:
        throw new Error('Unknown step');
    }
  }

  handleNext = () => {
    
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleSearch = () => {
    window.location.assign('/login')
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <DenseAppBar />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Join our family
            </Typography>
            <Stepper  activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step  key={label}>
                  <StepLabel >{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom align="center">
                    Thank you for registering
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    You have successfully registered. Please go ahead and login now.
                  </Typography>
                  <div className={classes.login}>
                    <Button
                    style={{ 
                      backgroundColor: "#424242"
                    }}
                      type="submit"
                      alignItems="center"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handleSearch}
                    >
                      Sign in
                    </Button>
                  </div>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {this.getStepContent(activeStep)}
                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button 
                        onClick={this.handleBack} className={classes.button}>
                          Back
                      </Button>
                      )}
                      <Button
                      style={{ 
                        backgroundColor: "#424242"
                      }}
                        variant="contained"
                        color="primary"
                        onClick={this.nextButtonClickHandler}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish Registration' : 'Next'}
                        
                      </Button>
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);
