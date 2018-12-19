import React,{Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import './ModalDialog.css'
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Axios from 'axios';
import SERVER_URL from '../../static/Config/Config';
import ReportIcon from '../../static/images/report.png'

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
      backgroundColor:'#424242', 
      '&:hover': {
        backgroundColor: '#ef6c00',
        // color:'black'
    },
    },
    iconSmall: {
      fontSize: 20
    },
    leftIcon: {
      marginRight: theme.spacing.unit
    },
    rightIcon: {
      marginLeft: theme.spacing.unit
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        height: '200px'
      }
  });

class ModalDialog extends Component {
    
     render() {

        let modal=null;
        let editableImage=null;
        let reportButton = null;
        const { classes } = this.props;
        if(this.props.isLoggedIn){
            reportButton = 
            <Button className={classes.button} variant="contained" style={{position:"absolute",float:"left",backgroundColor:"#f50057"}} onClick={()=>this.props.reportButtonClick(this.props.currentBook.id)} color="secondary">
                   <img src={ReportIcon} alt="report icon" width="20px" height="20px" />
                   &nbsp;&nbsp;Report
                </Button>
        }
        if(this.props.editable) {
             //   //console.log(this.props.editable);
                editableImage=
                <input accept="image/*" style={{display:"none"}} id="modal-popup-image" type="file" onChange={this.props.imageIconSelect}/>;

        }

        if(this.props.shouldOpen){
            modal=
            <div className={classes.paper}>
            <Dialog
                open={this.props.shouldOpen}
                onClose={this.props.close}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
            >
                <DialogTitle id="scroll-dialog-title" 
                    contentEditable={this.props.editable} 
                    onInput={this.props.titleChange.bind(this)}
                >
                {this.props.currentBook.title} </DialogTitle>
                <DialogContent style={{height:"500px"}}>
                    <div className ="FlexContainer">
                        <div className="ImageDiv">
                            {editableImage}
                            <label htmlFor="modal-popup-image">
                                <img src= {this.props.currentBook.thumbnailURL} alt= 'No Preview' width="100%" height="100%"/>
                            </label>
                        </div>

                        
                        <div className="Author">
                            <h4>Authors:</h4>
                            <div contentEditable={this.props.editable}  onInput={this.props.authorNameChange}>
                                {this.props.currentBook.authors.map(
                                    (author,keyIndex=0) => {
                                        return <p>{author} </p>;
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <DialogContentText>
                        <article>
                            <h4>Description :</h4> 
                            <p contentEditable={this.props.editable} 
                            onInput={this.props.descriptionChange} 
                            > 
                                {this.props.currentBook.description}
                            </p>
                        </article>
                    </DialogContentText>
                    </DialogContent>
                
                <div className ="Button"  style={{display:"flex",overflow:"hidden",height:"60px"}}>
                {reportButton}
                <Button className={classes.button} style={{position: "absolute",right: "0"}} variant="contained" onClick={()=>this.props.bookButtonClick(this.props.currentBook.id)} color="primary">
                  <img src={this.props.imageUrl} width="20px" height="20px"/>
                  &nbsp;&nbsp;{this.props.buttonText}
                </Button>
                </div>
            {/* </DialogContent> */}
            </Dialog>
            </div>


        }

        return modal;
    }
}

ModalDialog.propTypes = {
    classes: PropTypes.object.isRequired
  };
  export default withStyles(styles)(ModalDialog);
  