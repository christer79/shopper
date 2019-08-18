import React from "react";
import SectionList from "./SectionList";
import FlatList from "./FlatList";
import { Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return { items: state.items };
}

function Lists(props) {
  return (
    <div>
      <Droppable droppableId={"section-list"} type="LIST">
        {provided => (
          <div
            key={props.title}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.title}
            <SectionList id="unchecked" />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <FlatList
        grow={true}
        showChecked={true}
        showDeleted={false}
        selectSection={null}
        showDeleteButton={true}
        title="Checked Items"
        id="checked-list"
      />
    </div>
  );
}

export default connect(mapStateToProps)(Lists);
