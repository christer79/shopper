import React, { Component } from "react";
import SectionList from "./SectionList";
import FlatList from "./FlatList";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { connect } from "react-redux";
const Container = styled.div``;

function mapStateToProps(state) {
  return { items: state.items };
}

class Lists extends Component {
  render() {
    return (
      <div>
        <Droppable droppableId={"section-list"} type="LIST">
          {provided => (
            <Container
              key={this.props.title}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <SectionList id="unchecked" />
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
        <FlatList
          grow={true}
          showChecked={true}
          showDeleted={false}
          selectSection={null}
          title="Checked Items"
          id="checked-list"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Lists);
