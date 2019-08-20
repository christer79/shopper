import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";
import { deleteSection, deleteCheckedItems } from "../../actions/actions";
import { connect } from "react-redux";
import Item from "./Item";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import Tooltip from "@material-ui/core/Tooltip";

function mapStateToProps(state) {
  return {
    items: state.items,
    sections: state.sections,
    showEmptyLists: state.showEmptyLists,
    listType: state.selectedListType
  };
}

const mapDispatchToProps = {
  deleteSection,
  deleteCheckedItems
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    zIndex: 0,
    backgroundColor: theme.palette.background.paper
  }
}));

function FlatList(props) {
  const classes = useStyles();

  const sortFunction = function(a, b) {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return +1;
    return 0;
  };

  const renderItems = props.items.sort(sortFunction).filter(item => {
    return (
      item.checked === props.showChecked &&
      item.deleted === props.showDeleted &&
      (!props.selectSection ? true : item.section === props.selectSection)
    );
  });

  const listItems = renderItems.map((item, index) => {
    if (props.showEmptyLists) return null;
    return (
      <Item
        key={item.id}
        item={item}
        index={index}
        pantry={props.listType === "pantry"}
      />
    );
  });

  const numberOfItems = nr => {
    return <span> - ({nr} items)</span>;
  };
  if (renderItems.length === 0 && !props.showEmptyLists) {
    return null;
  }
  if (props.showChecked && props.showEmptyLists) {
    return null;
  }
  if (props.id === "section-0" && props.showEmptyLists) {
    return null;
  }
  return (
    <Droppable droppableId={props.id} type="ITEM">
      {provided => (
        <div
          key={props.title}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <List
            className={classes.root}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {props.title}{" "}
                {props.showEmptyLists
                  ? numberOfItems(renderItems.length)
                  : null}
                {props.showDeleteButton & !props.showEmptyLists ? (
                  <Tooltip title="Delete checked items" aria-label="add">
                    <Button onClick={() => props.deleteCheckedItems()}>
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                ) : null}
                {props.showEmptyLists ? (
                  <Tooltip title="Delete section" aria-label="add">
                    <Button onClick={() => props.deleteSection(props.id)}>
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                ) : null}
              </ListSubheader>
            }
          >
            {listItems}
            {provided.placeholder}
          </List>
        </div>
      )}
    </Droppable>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlatList);
