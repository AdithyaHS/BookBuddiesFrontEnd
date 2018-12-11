import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import srcImage from "../static/images/cards/cup_cake.jpg";

const styles = {
  root: {
    background: "#ff0000",
    // maxWidth: 345
    padding: "6px 12px"
  }

  //   media: {
  //     height: 140
  //   }
};

function MediaCard(props) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <CardMedia image={srcImage} src={srcImage} title="Book" />
      {/* <h1>{props.title}</h1> */}
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
        <div className="Author">
          {props.author.map(author => {
            return <p>{author}</p>;
          })}
        </div>
      </div>
    </Card>
  );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MediaCard);
