import React from "react";

import Card from "@material-ui/core/Card";
import {
  CardActions,
  CardContent,
  CardHeader,
  CardMedia
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function Recipe(props) {
  const { name, id, description, votes, images } = props.recipe;
  const classes = useStyles();

  const openRecipe = id => {
    console.log("Would open: ", id);
  };

  const editRecipe = id => {
    console.log("Would edit: ", id);
  };
  console.log(images.length);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            C
          </Avatar>
        }
        title={name}
        subheader={votes}
      />
      <CardMedia
        className={classes.media}
        image={
          images.length > 0
            ? images[0]
            : "https://www.diabetes.org/sites/default/files/styles/paragraph_50_50/public/2019-06/understandingcarbs-desktop-5050.jpg"
        }
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => openRecipe(id)}>Open</Button>
        <Button onClick={() => editRecipe(id)}>Edit</Button>
      </CardActions>
    </Card>
  );
}
