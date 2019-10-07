import React from "react";
import styled from "styled-components";
import Select from "@material-ui/core/Select";
import { useQuery } from "@apollo/react-hooks";
import { LISTS } from "./graphqlRequests";

import {
  deleteCheckedItems,
  toggleShowEmptyLists,
  setListName,
  addPantryToShoppingList
} from "./actions/actions";

import { connect } from "react-redux";
import Clipboarder from "./components/clipboard";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: box-start;
`;

function mapStateToProps(state) {
  return {
    items: state.items,
    listType: state.selectedListType
  };
}

const mapDispatchToProps = {
  deleteCheckedItems,
  toggleShowEmptyLists,
  setListName,
  addPantryToShoppingList
};

function Menu(props) {
  const pantryItemsToShoppingList = event => {
    console.log(event.target.value);
    var itemsToAdd = props.items
      .filter(item => item.goal > item.amount)
      .map(item => {
        return { name: item.name, amount: item.goal - item.amount };
      });
    console.log(itemsToAdd);

    props.addPantryToShoppingList(event.target.value, itemsToAdd);
    //TODO: Add items from pantry to cachez
    props.setListName(event.target.value);
  };

  const { error, loading, data } = useQuery(LISTS);

  if (error) return "Error loading lists...";
  if (loading) return "Loading lists....";

  return (
    <Container>
      <button onClick={() => props.toggleShowEmptyLists()}>S/H</button>
      <Clipboarder />

      {props.listType === "pantry" ? (
        data.lists ? (
          <Select
            native
            value="Select List To Add..."
            onChange={pantryItemsToShoppingList}
            inputProps={{
              name: "shoppingList",
              id: "age-native-simple"
            }}
          >
            <option key="" value="">
              Select List to add Items
            </option>
            {data.lists
              .filter(list => list.listtype !== "pantry")
              .map(list => {
                return (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                );
              })}
          </Select>
        ) : (
          <span>No lists yet!</span>
        )
      ) : null}
    </Container>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
