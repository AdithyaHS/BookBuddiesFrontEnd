import React from "react";
import CardMedia from "@material-ui/core/CardMedia";
import "./Book.css";
import Card from "@material-ui/core/Card";
import srcImage from "../../static/images/cards/cup_cake.jpg";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

const book = props => {

  let closeButton = null;
  let reportButton = null;
  let ignoreButton = null;

  const { classes } = props;
  if (props.showDeleteButton) {
    let id = props.key;
    closeButton = (
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={id => {
          props.deleteBook(id);
        }}
      >
        Delete
        {/* <DeleteIcon className={classes.rightIcon} /> */}
      </Button>
    );
  }
  if (props.showReportButton) {
    let id = props.key;
    reportButton = (
      <input
        type="button"
        value="report"
        name="report"
        onClick={id => {
          props.reportBook(id);
        }}
      />
    );
  }

  if (props.showIgnoreButton) {
    let id = props.key;
    ignoreButton = <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={id => {
        props.ignoreBook(id);
      }}
    >
      Ignore
  </Button>
  }
  return (
    <div className="Book" onClick={props.click.bind(props.key)} id={props.key}>
      {ignoreButton}
      {closeButton}
      <CardMedia image={srcImage} src={srcImage} title="Book" />

      <h1>
        {props.title.length > 30
          ? props.title.substring(0, 30 - 3) + "..."
          : props.title}
      </h1>
      <div>
        <img
          src={props.smallThumbnail}
          alt="No Preview"
          width="100"
          height="120"
        />
      </div>
      <div className="Info">
        <div className="Authors">
          {props.author.map(author => {
            return <p style={{ color: "black" }}>{author}</p>;
          })}
        </div>

      </div>
    </div>

  );
};

book.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(book);
