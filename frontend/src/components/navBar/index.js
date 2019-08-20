import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import BackIcon from "@material-ui/icons/ArrowBackOutlined";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

export default function NavBar(props) {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={props.onBack}
          aria-label="close"
        >
          <BackIcon />
        </IconButton>
        {props.icon}
        <Typography variant="h6" className={classes.title}>
          {props.page}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
