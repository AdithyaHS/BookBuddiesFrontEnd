import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Button} from '@material-ui/core'
import './FilterDrawer.css'

const drawerWidth = 240;


const renderswitch = (params, props) => {
  switch (params) {
    case 'Authors':
      return props.filterDetails.authors;
    case 'Language':
      return props.filterDetails.language;
    case 'Genre':
      return props.filterDetails.genre;
    case 'Rating':
      return props.filterDetails.rating;
    case 'Location':
      return props.filterDetails.location;
    default:
      return "empty";
  }
}


const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  button:{
    backgroundColor:"#424242",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

function ClippedDrawer(props) {
  const { classes } = props;
  let arr=null;

  return (
    <div className={classes.root}>
      <CssBaseline />
     
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Typography variant="h5" color="inherit">Filters</Typography>
        <List>
          {['Language', 'Authors', 'Genre', 'Rating', 'Location'].map((text, index) => {
            // console.log("asdsa")
            let temp = renderswitch(text, props);
           
            if (temp !== "empty" && props.showdata === true) {
              arr = Object.keys(temp).map(index => {
                // console.log(temp[index])
                //if(index<5) {
                  return   <ListItem key={temp[index]} button>
                         
                          <Checkbox onChange={props.toggle(text+ "~" +temp[index])}
                          checked = {props.check.indexOf(text+ "~" +temp[index]) !== -1}/>
                          <p >{temp[index]}</p>
                          </ListItem>  
              //}
              });
            }

            return (
              <div>

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{text}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      {arr}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>

            )
          })}
        </List>
        <Button variant="extendedFab" aria-label="Delete" color="primary" className={classes.button} onClick={props.click}>
            Apply
        </Button> 
      </Drawer>
    </div>
  );
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

//TODO: create a function to switch between indexes of filter details

export default withStyles(styles)(ClippedDrawer);
