import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = themes => ({
  gridMain: {
    marginLeft: "80px"
  }

});

function Credentials(props) {
  const { classes } = props;

  return (
    <React.Fragment>

      <Typography variant="h6" gutterBottom align="center">
        Create Your Credentials
      </Typography>
      <Grid container spacing={40}
        direction="column"
        alignItems="left"
        justify="center"
        className = {classes.gridMain}
      >
        <Grid item xs={2} sm={8}>
          <TextField
            required
            id="username"
            name="username"
            label="Email address"
            fullWidth
            autoComplete="uname"
            onChange={(event)=>props.emailChange(event)}
          />
        </Grid>

        <Grid item xs={2} sm={8}>
          <TextField
            required
            id="password"
            name="password"
            label="Enter a password"
            fullWidth
            autoComplete="password"
            type = "password"
            onChange={(event)=>props.passwordChange(event)}
          />
        </Grid>

        <Grid item xs={2} sm={8}>
          <TextField
            required
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm your password"
            fullWidth
            autoComplete="password"
            type = "password"
            onChange={(event)=>props.confirmPasswordChange(event)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            required
            control={<Checkbox color="secondary" name="agreement" value="yes" />}
            label="I agree all the terms and conditions"
          />
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

Credentials.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Credentials);