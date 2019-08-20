import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import {
  addItem,
  addSection,
  addPantryToShoppingList
} from "../../actions/actions";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

const mapDispatchToProps = {
  addItem,
  addSection,
  addPantryToShoppingList
};

function mapStateToProps(state) {
  return {
    selectedList: state.selectedList,
    itemsFromPantry: state.itemsFromPantry,
    items: state.items,
    listToAddFromPantry: state.listToAddFromPantry
  };
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

function AddFromPantryDialog(props) {
  const classes = useStyles();

  const deleteFromPantryList = name => {
    props.addPantryToShoppingList(
      props.listToAddFromPantry,
      props.itemsFromPantry.filter(item => item.name !== name)
    );
  };

  const addFromPantry = item => {
    props.addItem(item);
    deleteFromPantryList(item.name);
  };

  const addAllToPantry = () => {
    console.log("props.itemsFromPantry: ", props.itemsFromPantry);
    props.itemsFromPantry.forEach(item => {
      const existingItem = props.items.find(function(exItem) {
        return exItem.name === item.name;
      });
      console.log("existingItem: ", existingItem);
      console.log("item.amount: ", item.amount);
      if (existingItem) {
        console.log("existingItem.amount: ", existingItem.amount);

        addFromPantry({
          ...existingItem,
          amount: existingItem.amount + item.amount
        });
      } else {
        console.log("item: ", item);
        addFromPantry(item);
      }
    });

    deleteAllFromPantry();
  };

  const deleteAllFromPantry = () => {
    props.addPantryToShoppingList("", []);
  };

  const findItemByName = (input, key) => {
    const ret = props.items.find(function(item) {
      return item.name === input.name;
    });

    if (ret) {
      return (
        <ListItem
          key={key}
          onClick={() =>
            addFromPantry({ ...ret, amount: ret.amount + input.amount })
          }
        >
          <ListItemText className={classes.itemText} primary={input.name} />: (
          {input.amount}) -> {ret.amount + input.amount}
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => [deleteFromPantryList(input.name)]}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    } else {
      return (
        <ListItem
          key={key}
          onClick={() =>
            addFromPantry({ name: input.name, amount: input.amount })
          }
        >
          <ListItemText className={classes.itemText} primary={input.name} />:
          {input.amount}
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => [deleteFromPantryList(input.name)]}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    }
  };

  return (
    <Dialog
      open={props.listToAddFromPantry === props.selectedList}
      onClose={deleteAllFromPantry}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={deleteAllFromPantry}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Items From Pantry...
          </Typography>
          <Button color="inherit" onClick={addAllToPantry}>
            Add all
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <List>
          {props.itemsFromPantry.map((item, index) => {
            return findItemByName(item, index);
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFromPantryDialog);
