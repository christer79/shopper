import React, { Component } from "react";
import Lists from "./Lists";
import AddItemForm from "./AddItemForm";
import Api from "./Api";
import Modal from "./components/Modal/Modal";
import Menu from "./Menu";
import EditItemForm from "./EditItemForm";
import { DragDropContext } from "react-beautiful-dnd";
import SignInScreen from "./components/firebasesignin";
import ListSelector from "./components/listselector";
import styled from "styled-components";
import "firebase/auth";

import { FirebaseAuthConsumer, IfFirebaseAuthed } from "@react-firebase/auth";

import {
  swapSections,
  itemOrderUnsynced,
  setItems,
  toggleChecked,
  closeEditItemModal
} from "./actions/actions";
import { connect } from "react-redux";

const Container = styled.div`
  background-color: #dddddd;
  display: flex
  flex-direction: column;
  height: 100%
`;

function mapStateToProps(state) {
  return {
    selectedList: state.selectedList,
    sections: state.sections,
    items: state.items,
    editItemModalShowing: state.editItemModal.Showing,
    editItemModalItemId: state.editItemModal.ItemId
  };
}

const mapDispatchToProps = {
  swapSections,
  itemOrderUnsynced,
  setItems,
  toggleChecked,
  closeEditItemModal
};

class App extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "LIST") {
      this.props.swapSections(source.index, destination.index, draggableId);
      return;
    }

    const droppableIdChanged = source.droppableId !== destination.droppableId;
    const indexChanged = destination.index !== source.index;
    const droppedToChecked = destination.droppableId === "checked-list";
    var itemOrderSynced = true;
    if (!droppableIdChanged && !indexChanged) {
      return;
    }

    if (droppableIdChanged && droppedToChecked) {
      this.props.toggleChecked(draggableId);
      return;
    }

    var newItems = this.props.items;

    itemOrderSynced = false;
    const draggedItemIndexInItems = newItems.findIndex(item => {
      return item.item_id === draggableId;
    });
    const draggedItem = newItems.find(item => {
      return item.item_id === draggableId;
    });

    var itemsInDestinationDroppable = null;
    if (droppedToChecked) {
      itemsInDestinationDroppable = this.props.items.filter(item => {
        return item.checked === true && item.deleted === false;
      });
    } else {
      itemsInDestinationDroppable = this.props.items.filter(item => {
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
          itemsInDestinationDroppable[destination.index - 1].item_id;
        const destinationItemIndexInItems = newItems.findIndex(item => {
          return item.item_id === destinationItemId;
        });
        newItems.splice(destinationItemIndexInItems + 1, 0, draggedItem);
      } else {
        const destinationItemId =
          itemsInDestinationDroppable[destination.index].item_id;
        var destinationItemIndexInItems = newItems.findIndex(item => {
          return item.item_id === destinationItemId;
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
      this.props.toggleChecked(draggableId);
    }

    var _items = [];
    for (var i = 0; i < newItems.length; i++) {
      _items.push(newItems[i]);
    }
    this.props.setItems(_items);
    if (!itemOrderSynced) this.props.itemOrderUnsynced();
  };

  closeModalHandler = () => {
    this.props.closeEditItemModal();
  };

  render() {
    return (
      <Container>
        <FirebaseAuthConsumer>
          {({ isSignedIn }) => {
            if (isSignedIn === false) {
              return <SignInScreen />;
            }
          }}
        </FirebaseAuthConsumer>

        <IfFirebaseAuthed>
          {() => {
            if (this.props.selectedList === "") {
              return <ListSelector />;
            }
            return (
              <div>
                {this.props.editItemModalShowing ? (
                  <div onClick={this.closeModalHandler} className="back-drop" />
                ) : null}
                <Modal
                  className="modal"
                  show={this.props.editItemModalShowing}
                  close={this.closeModalHandler}
                >
                  <EditItemForm editedItem={this.props.editItemModalItemId} />
                </Modal>
                <Api items={this.props.items} onSynced={this.handleSynced} />
                <AddItemForm handleSubmit={this.handleAdd} />
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Lists />
                </DragDropContext>
                <Menu />
              </div>
            );
          }}
        </IfFirebaseAuthed>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
