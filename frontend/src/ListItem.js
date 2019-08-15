import React, { Component } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import {
  increaseAmount,
  toggleChecked,
  openEditItemModal
} from "./actions/actions";

const mapDispatchToProps = {
  increaseAmount,
  toggleChecked,
  openEditItemModal
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  border-width: 0px;
  border-color: black;
  border-style: solid;
  margin: 2px;
  background: ${props => (props.checked ? "grey" : "white")};
`;

const Input = styled.input`
  flex: 1;
  height: 25px;
  display: inline-block;
  vertical-align: text-top;
  background-color: #eee;
`;

const ItemContainer = styled.div`
  flex: 5;
  font-size: 20px;
`;

const Button = styled.button`
  flex: 1;
  margin: 0px;
  border-style: line;
  border-width: 0px;
  border-color: black;
  margin-left: 1px;
`;

const SyncIndicator = styled.div`
  width=5px;
  background: ${props => (props.synced ? "green" : "red")};
`;

class ListItem extends Component {
  constructor() {
    super();
    this.state = {
      isShowing: false,
      editedItem: ""
    };
  }

  render() {
    const { item, index, pantry } = this.props;
    if (!item) return null;
    return (
      <Draggable draggableId={item.id} index={index}>
        {provided => (
          <Container
            checked={item.checked}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <SyncIndicator synced={item.synced}>&nbsp; </SyncIndicator>
            <Input
              type="checkbox"
              checked={item.checked ? "checked" : ""}
              onChange={() => this.props.toggleChecked(item.id)}
            />
            <ItemContainer>{item.name}</ItemContainer>
            {pantry ? "" : ""}
            {!item.checked ? (
              <Button onClick={() => this.props.openEditItemModal(item.id)}>
                E
              </Button>
            ) : null}
          </Container>
        )}
      </Draggable>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ListItem);
