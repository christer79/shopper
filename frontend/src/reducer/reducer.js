import {
  ADD_PANTRY_TO_SHOPPING_LIST,
  SET_LISTS,
  SET_SECTION_CHECKED
} from "../actions/actions";

const initialState = {
  token: "",
  selectedList: "",
  selectedListType: "",
  sections: [],
  items: [], // items element: {}
  itemSuggestions: [],
  showEmptyLists: false,
  itemsFromPantry: [],
  listToAddFromPantry: "",
  lists: [],
  editItemModal: {
    Showing: false,
    itemId: "",
    itemToEdit: {
      item: "",
      id: "",
      amount: 0,
      goal: 0,
      unit: "",
      section: "",
      section_name: ""
    }
  }
};

const sortFunction = function(a, b) {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return +1;
  return 0;
};

function reducer(state = initialState, action) {
  var newSections;
  var newItems;
  switch (action.type) {
    case SET_SECTION_CHECKED:
      console.log("state.selectedListType", state.selectedListType);
      console.log("action.payload.checked", action.payload.checked);
      newItems = [...state.items];
      newItems.map(element => {
        if (
          element.section === action.payload.sectionID ||
          (action.payload.sectionID === "checked-list" && element.checked)
        ) {
          if (state.selectedListType !== "pantry") {
            if (element.checked !== action.payload.checked) {
              element.synced = false;

              element.checked = action.payload.checked;
            }
          } else {
            console.log("START", element.name);
            console.log("element.amount", element.amount);
            console.log("element.goal", element.goal);
            const amountBefore = element.amount;
            element.amount = action.payload.checked ? element.goal : 0;
            element.synced = amountBefore !== element.amount;

            console.log("element.amount", element.amount);
            console.log("END", element.name);
          }
        }
        return element;
      });
      return Object.assign({}, state, {
        items: newItems
      });
    case SET_LISTS:
      return Object.assign({}, state, {
        lists: action.payload.lists
      });
    case ADD_PANTRY_TO_SHOPPING_LIST:
      if (action.payload.items.length === 0) {
        return Object.assign({}, state, {
          itemsFromPantry: [],
          listToAddFromPantry: ""
        });
      }
      return Object.assign({}, state, {
        itemsFromPantry: action.payload.items,
        listToAddFromPantry: action.payload.listId
      });
    case "SET_TOKEN":
      return Object.assign({}, state, {
        token: action.payload.token
      });
    case "SET_LIST_NAME":
      return Object.assign({}, state, {
        selectedList: action.payload.id,
        selectedListType: action.payload.type
      });
    case "SET_ITEM_SUGGESTIONS":
      return Object.assign({}, state, {
        itemSuggestions: action.payload.suggestions
      });
    case "CLOSE_EDIT_ITEM_MODAL":
      return Object.assign({}, state, {
        editItemModal: { ...state.editItemModal, Showing: false }
      });
    case "UPDATE_EDIT_ITEM_MODAL_ITEM":
      return Object.assign({}, state, {
        editItemModal: {
          ...state.editItemModal,
          itemToEdit: action.payload.item
        }
      });
    case "OPEN_EDIT_ITEM_MODAL":
      var itemToEdit;
      if (action.payload.item_name === "" && action.payload.id === "") {
        return state;
      }

      if (action.payload.item_name !== "") {
        itemToEdit = {
          item: action.payload.item_name,
          section: "section-0",
          section_name: "",
          id: "",
          amout: 0,
          unit: "st",
          goal: 1
        };
      } else {
        itemToEdit = state.items.find(item => {
          return item.id === action.payload.id;
        });
        // Find section name

        var section = state.sections.find(section => {
          return section.id === itemToEdit.section;
        });
        itemToEdit.section_name = section.name;
      }
      return Object.assign({}, state, {
        editItemModal: {
          ...state.editItemModal,
          Showing: true,
          itemId: action.payload.id,
          itemToEdit: itemToEdit
        }
      });
    case "TOGGLE_SHOW_EMPTY_LISTS":
      return Object.assign({}, state, {
        showEmptyLists: !state.showEmptyLists
      });

    case "ITEM_ORDER_SYNCED":
      return Object.assign({}, state, {
        itemOrderSynced: true
      });
    case "ITEM_ORDER_UNSYNCED":
      return Object.assign({}, state, {
        itemOrderSynced: false
      });

    case "ADD_ITEM":
      // Update if an item with this id already exists
      var item = Object.assign({}, action.payload.item);
      newItems = [...state.items];

      var index = newItems.findIndex(
        item => item.id === action.payload.item.id
      );
      var isNewItem = index === -1;
      item.synced = false;

      if (isNewItem) {
        item.id =
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9);
        item.amount = 1;
        item.goal = 1;
        item.unit = "st";
        item.checked = false;
        item.deleted = false;
        item.isNew = true;
        item.position = state.items.length;
        if (item.section === "" || !item.section) {
          const suggested = state.itemSuggestions.find(
            suggestion => suggestion.name === item.name
          );

          if (!suggested) {
            item.section = "section-0";
          } else {
            const section = state.sections.find(
              section => section.name === suggested.section
            );
            if (!section) {
              item.section = "section-0";
            } else {
              item.section = section.id;
            }
          }
        }
        newItems.push(item);
      } else {
        newItems[index] = item;
      }

      return Object.assign({}, state, {
        itemOrderSynced: false,
        items: newItems
      });
    case "SET_ITEMS":
      return Object.assign({}, state, { items: action.payload.items });
    case "DELETE_ITEM":
      newItems = [...state.items];
      newItems.map(element => {
        if (element.id === action.payload.id) {
          element.synced = false;
          element.deleted = true;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "ITEM_SYNCED":
      newItems = [...state.items];
      newItems.map(element => {
        if (element.id === action.payload.id) {
          element.synced = true;
          element.isNew = false;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "SECTION_SYNCED":
      newSections = [...state.sections];
      newSections.map(element => {
        if (element.id === action.payload.id) {
          element.synced = true;
          element.isNew = false;
        }
        return element;
      });
      return Object.assign({}, state, { sections: newSections });
    case "TOGGLE_CHECKED":
      newItems = [...state.items];

      newItems.map(element => {
        if (element.id === action.payload.id) {
          element.synced = false;
          element.checked = !element.checked;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "DELETE_CHECKED_ITEMS":
      newItems = [...state.items];
      newItems.map(element => {
        if (element.checked === true) {
          element.synced = false;
          element.deleted = true;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "UPDATE_AMOUNT":
      newItems = [...state.items];
      index = newItems.findIndex(item => item.id === action.payload.id);
      item = Object.assign({}, newItems[index]);
      item.synced = false;
      item.amount = action.payload.amount;
      newItems[index] = item;
      return Object.assign({}, state, { items: newItems });
    case "UPDATE_GOAL":
      newItems = [...state.items];
      index = newItems.findIndex(item => item.id === action.payload.id);
      item = Object.assign({}, newItems[index]);
      item.synced = false;
      item.goal = action.payload.goal;
      newItems[index] = item;
      return Object.assign({}, state, { items: newItems });
    case "INCREASE_AMOUNT":
      newItems = [...state.items];
      index = newItems.findIndex(item => item.id === action.payload.id);
      item = Object.assign({}, newItems[index]);
      item.synced = false;
      item.amount = action.payload.amount + item.amount;
      newItems[index] = item;
      return Object.assign({}, state, { items: newItems });
    case "SWAP_SECTIONS":
      newSections = [...state.sections.sort(sortFunction)];
      // Force Unsorted to be in top
      if (
        newSections[action.payload.index1].id === "section-0" ||
        newSections[action.payload.index2].id === "section-0"
      ) {
        return state;
      }
      const moved = newSections[action.payload.index1];
      newSections.splice(action.payload.index1, 1);
      newSections.splice(action.payload.index2, 0, moved);
      newSections.map((entry, index) => {
        if (index !== entry.position) {
          entry.synced = false;
          entry.position = index;
        }
        return entry;
      });
      return Object.assign({}, state, { sections: newSections });

    case "SET_SECTIONS":
      return Object.assign({}, state, {
        sections: action.payload.list
      });
    case "ADD_SECTION":
      var id;
      if (action.payload.section_id === "") {
        id =
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9);
      } else {
        id = action.payload.section_id;
      }

      return Object.assign({}, state, {
        sections: [
          ...state.sections,
          {
            name: action.payload.section_name,
            id: id,
            position: state.sections.length,
            isNew: true,
            synced: false,
            deleted: false
          }
        ]
      });
    case "DELETE_SECTION":
      newSections = [...state.sections];
      newItems = [...state.items];
      newSections.map(element => {
        if (element.id === action.payload.section_id) {
          element.synced = false;
          element.deleted = true;
        }
        return element;
      });

      newItems.map(item => {
        if (item.section === action.payload.section_id) {
          item.section = "section-0";
          item.synced = false;
        }
        return item;
      });
      return Object.assign({}, state, {
        sections: newSections,
        items: newItems
      });

    default:
      return state;
  }
}

export default reducer;
