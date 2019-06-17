import React from "react";
import ListsList from "../listslist";
import ListCreator from "../listcreator";

const ListSelector = () => {
  return (
    <div>
      <h1>Create new List</h1>
      <ListCreator />
      <h1>Select List</h1>
      <ListsList />
    </div>
  );
};

export default ListSelector;
