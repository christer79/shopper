import React from "react";

import Lists from "./components/items/Lists";
import AddItemForm from "./AddItemForm";
import Menu from "./Menu";
import EditItemForm from "./components/items/EditItemForm";
import AddFromPantryDialog from "./components/AddFromPantryDialog";
import ListSelector from "./components/selectlist/listselector";

import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { DragDropContext } from "react-beautiful-dnd";

import { connect } from "react-redux";

import {
  swapSections,
  setItems,
  toggleChecked,
  setToken,
  setListName
} from "./actions/actions";
import { Toolbar } from "@material-ui/core";

function mapStateToProps(state) {
  return {
    selectedList: state.selectedList,
    sections: state.sections,
    items: state.items,
    token: state.token,
    lists: state.lists
  };
}

const mapDispatchToProps = {
  swapSections,
  setItems,
  toggleChecked,
  setToken,
  setListName
};

function Shopper(props) {
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "LIST") {
      props.swapSections(source.index, destination.index, draggableId);
      return;
    }

    const droppableIdChanged = source.droppableId !== destination.droppableId;
    const indexChanged = destination.index !== source.index;
    const droppedToChecked = destination.droppableId === "checked-list";
    if (!droppableIdChanged && !indexChanged) {
      return;
    }

    if (droppableIdChanged && droppedToChecked) {
      props.toggleChecked(draggableId);
      return;
    }

    console.log(result);

    var newItems = props.items;

    const draggedItemIndexInItems = newItems.findIndex(item => {
      return item.id === draggableId;
    });
    const draggedItem = newItems.find(item => {
      return item.id === draggableId;
    });

    var itemsInDestinationDroppable = null;
    if (droppedToChecked) {
      itemsInDestinationDroppable = props.items.filter(item => {
        return item.checked === true && item.deleted === false;
      });
    } else {
      itemsInDestinationDroppable = props.items.filter(item => {
        return (
          item.section === destination.droppableId &&
          item.checked === false &&
          item.deleted === false
        );
      });
    }

    const destinationSectionEmpty = itemsInDestinationDroppable.length === 0;

    const addedAsLastIndex =
      destination.index >= itemsInDestinationDroppable.length;

    if (droppableIdChanged) {
      draggedItem.section = destination.droppableId;
      draggedItem.synced = false;
    }

    if (!destinationSectionEmpty) {
      newItems.splice(draggedItemIndexInItems, 1);

      if (addedAsLastIndex && droppableIdChanged) {
        const destinationItemId =
          itemsInDestinationDroppable[destination.index - 1].id;
        const destinationItemIndexInItems = newItems.findIndex(item => {
          return item.id === destinationItemId;
        });
        newItems.splice(destinationItemIndexInItems + 1, 0, draggedItem);
      } else {
        const destinationItemId =
          itemsInDestinationDroppable[destination.index].id;
        var destinationItemIndexInItems = newItems.findIndex(item => {
          return item.id === destinationItemId;
        });

        const pulledUpInSameList =
          destinationItemIndexInItems < draggedItemIndexInItems ||
          (destinationItemIndexInItems >= draggedItemIndexInItems &&
            droppableIdChanged);

        destinationItemIndexInItems =
          destinationItemIndexInItems + (pulledUpInSameList ? 0 : 1);

        newItems.splice(destinationItemIndexInItems, 0, draggedItem);
      }
    }

    if (
      source.droppableId === "checked-list" &&
      destination.droppableId !== "checked-list"
    ) {
      props.toggleChecked(draggableId);
    }

    var _items = [];
    for (var i = 0; i < newItems.length; i++) {
      _items.push(newItems[i]);
    }
    _items.map((entry, index) => {
      if (index !== entry.position) {
        entry.synced = false;
        entry.position = index;
      }
      return entry;
    });

    props.setItems(_items);
  };
  if (props.selectedList === "") {
    return <ListSelector />;
  }
  return (
    <div>
      <div>
        <EditItemForm />
        <AddFromPantryDialog />
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => [props.setListName("")]}
            aria-label="delete"
          >
            <ChevronLeftIcon />
          </IconButton>
          <AddItemForm />
        </Toolbar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Lists />
        </DragDropContext>
        <Menu />
      </div>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Shopper);
