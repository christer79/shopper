import React from "react";
import FlatList from "./FlatList";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
const Container = styled.div``;

function mapStateToProps(state) {
  return { sections: state.sections };
}

const sortFunction = function(a, b) {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return +1;
  return 0;
};

class SectionList extends React.Component {
  render() {
    return this.props.sections.sort(sortFunction).map((section, index) => {
      return (
        <Draggable draggableId={section.id} index={index} key={section.id}>
          {provided => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              key={section.id}
            >
              <FlatList
                selectSection={section.id}
                showChecked={false}
                showDeleted={false}
                title={section.name}
                id={section.id}
                key={section.id}
              />
            </Container>
          )}
        </Draggable>
      );
    });
  }
}

export default connect(mapStateToProps)(SectionList);
