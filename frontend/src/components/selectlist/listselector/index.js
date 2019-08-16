import React from "react";
import ListsList from "../listslist";
import ListCreator from "../listcreator";

const ListSelector = () => {
  return (
    <div>
      <ListCreator />
      <ListsList />
    </div>
  );
};

export default ListSelector;
