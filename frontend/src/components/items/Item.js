import React from "react";
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
import IconButton from "@material-ui/core/IconButton";

const mapDispatchToProps = {
  toggleChecked,
  openEditItemModal
};

function Item(props) {
  const { item, index, pantry } = props;
  if (!item) return null;
  return (
    <Draggable draggableId={item.id} index={index}>
      {provided => (
        <ListItem
          key={item.id}
          dense
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.checked ? "checked" : ""}
              tabIndex={-1}
              disableRipple
              onChange={() => props.toggleChecked(item.id)}
            />
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {pantry ? <PantryAmount item={item} /> : ""}
          {!item.checked ? (
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => props.openEditItemModal(item.id)}
                edge="end"
                aria-label="comments"
              >
                <CreateIcon />
              </IconButton>
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      )}
    </Draggable>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(Item);
