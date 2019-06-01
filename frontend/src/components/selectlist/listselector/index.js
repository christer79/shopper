import React from "react";
import ListsList from "../listslist";
import ListCreator from "../listcreator";

const ListSelector = () => {
  return (
    <div>
      <h1>Select List</h1>
      <ListCreator />
      <ListsList />
    </div>
  );
};

export default ListSelector;
