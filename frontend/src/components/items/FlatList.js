import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";
import { deleteSection } from "../../actions/actions";
import { connect } from "react-redux";
import Item from "./Item";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";

function mapStateToProps(state) {
  return {
    items: state.items,
    sections: state.sections,
    showEmptyLists: state.showEmptyLists,
    listType: state.selectedListType
  };
}

const mapDispatchToProps = {
  deleteSection
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
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
                {props.title}
              </ListSubheader>
            }
          >
            {listItems}
          </List>
          {provided.placeholder}
        </div>

        // <List
        //   subheader={
        //     <ListSubheader component="div" id="nested-list-subheader">
        //       {props.title}
        //     </ListSubheader>
        //   }
        // >
        // {/* <Container
        //   key={props.title}
        //   ref={provided.innerRef}
        //   {...provided.droppableProps}
        // > */}
        // {/* <Title
        //   title={props.title}
        //   items={renderItems}
        //   showEmptyLists={props.showEmptyLists}
        //   sectionId={props.selectSection}
        //   deleteSection={props.deleteSection}
        // /> */}
        // {/* {listItems}
        // {/* </Container> */}
        // </List>
      )}
    </Droppable>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlatList);
