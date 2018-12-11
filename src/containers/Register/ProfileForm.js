import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = themes => ({
  gridLayout: {
    marginLeft: "50px"
  }

});

function ProfileForm(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Create a Profile
      </Typography>
      <Grid container spacing={24} className = {classes.gridLayout}>
      {/* <Grid item>
      <CardMedia image={srcImage} src={srcImage} title="ProfilePicture" />
      </Grid> */}
        <Grid item xs={12} sm={8}>
          <TextField
            required
            id="Name"
            name="Name"
            label="Enter your Name"
            fullWidth
            autoComplete="name"
            onChange={(event)=>props.nameChange(event)}
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            required
            id="userName"
            name="userName"
            label="Type in your User Name"
            fullWidth
            autoComplete="uname"
            onChange={(event)=>props.userNameChange(event)}
          />
        </Grid>
        <Grid item xs={12}sm={8}>
          <TextField
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="billing address-line1"
            onChange={(event)=>props.addressChange(event)}
          />
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
            onChange={(event)=>props.cityChange(event)}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField 
          required
          id="state" 
          name="state" 
          label="State/Province/Region" 
          fullWidth 
          onChange={(event)=>props.stateChange(event)}/>
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <TextField 
          required
          multiline
          helperText="This lets us build a helpful community"
          id="Bio" 
          name="Bio" 
          label="Create your Bio to let others know about you" 
          fullWidth 
          onChange={(event)=>props.bioChange(event)}/>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField 
          helperText = "Seperate each interest by a , (comma)"
          fullWidth
          id="bookInterest" 
          name="bookInterest" 
          label="Share your book interests" 
          onChange={(event)=>props.stateChange(event)}/>
        </Grid>


        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for connecting me to the network"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

ProfileForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (ProfileForm);