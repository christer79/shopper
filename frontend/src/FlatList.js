import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import styled from "styled-components";
import { connect } from "react-redux";
import { deleteSection } from "./actions/actions";
const Container = styled.div`
  display: "flex";
  flex-direction: column;
  background-color: lightsteelblue;
  flex-grow: ${props => (props.grow ? "100" : "1")};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const SectionTitle = styled.h1`
  padding: 0px;
  margin: 0px;
  font-size: 1rem;
  color: black;
  width="100%"
`;

const SectionContainer = styled.div`
  flex: 8;
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

function mapStateToProps(state) {
  return {
    items: state.items,
    sections: state.sections,
    showEmptyLists: state.showEmptyLists
  };
}

const mapDispatchToProps = {
  deleteSection
};

class Title extends React.Component {
  render() {
    const size = this.props.showEmptyLists
      ? "(" + this.props.items.length + ")"
      : "";
    return (
      <TitleContainer>
        <SectionContainer>
          <SectionTitle>
            {this.props.title} {size}
          </SectionTitle>
        </SectionContainer>
        {this.props.showEmptyLists ? (
          <Button
            onClick={() => this.props.deleteSection(this.props.sectionId)}
          >
            D
          </Button>
        ) : (
          ""
        )}
      </TitleContainer>
    );
  }
}

class FlatList extends React.Component {
  render() {
    const renderItems = this.props.items.filter(item => {
      return (
        item.checked === this.props.showChecked &&
        item.deleted === this.props.showDeleted &&
        (!this.props.selectSection
          ? true
          : item.section === this.props.selectSection)
      );
    });

    const listItems = renderItems.map((item, index) => {
      if (this.props.showEmptyLists) return null;
      return <ListItem key={item.id} item={item} index={index} />;
    });

    if (renderItems.length === 0 && !this.props.showEmptyLists) {
      return null;
    }

    return (
      <Droppable droppableId={this.props.id} type="ITEM">
        {provided => (
          <Container
            key={this.props.title}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Title
              title={this.props.title}
              items={renderItems}
              showEmptyLists={this.props.showEmptyLists}
              sectionId={this.props.selectSection}
              deleteSection={this.props.deleteSection}
            />
            {listItems}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlatList);
