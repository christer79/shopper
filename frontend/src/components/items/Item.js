import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { toggleChecked, openEditItemModal } from "../../actions/actions";
import PantryAmount from "../PantryAmount";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CreateIcon from "@material-ui/icons/CreateOutlined";
import Button from "@material-ui/core/Button";

const mapDispatchToProps = {
  toggleChecked,
  openEditItemModal
};

function mapStateToProps(state) {
  return {
    listType: state.selectedListType
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: "secondary"
  },
  dense: {
    padding: "0 0 0 16px",
    margin: "0 0 0 0"
  },
  itemText: {
    margin: "0 0 0 0"
  },
  button: {
    padding: "0 0 0 0",
    margin: "0 0 0 0"
  },
  checkbox: {
    padding: "0 0 0 0",
    margin: "0 0 0 0"
  }
}));

function Item(props) {
  const { item, index } = props;
  const classes = useStyles();
  if (!item) return null;
  return (
    <Draggable draggableId={item.id} index={index}>
      {provided => (
        <ListItem
          className={classes.dense}
          key={item.id}
          dense
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {props.listType !== "pantry" ? (
            <ListItemIcon>
              <Checkbox
                className={classes.checkbox}
                edge="start"
                checked={item.checked ? "checked" : ""}
                tabIndex={-1}
                disableRipple
                onChange={() => props.toggleChecked(item.id)}
              />
            </ListItemIcon>
          ) : (
            <ListItemIcon>
              <PantryAmount item={item} />
            </ListItemIcon>
          )}
          <ListItemText className={classes.itemText} primary={item.name} />

          {!item.checked ? (
            <ListItemSecondaryAction>
              <Button
                onClick={() => props.openEditItemModal(item.id)}
                edge="end"
                aria-label="comments"
                className={classes.button}
              >
                <CreateIcon />
              </Button>
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      )}
    </Draggable>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Item);
