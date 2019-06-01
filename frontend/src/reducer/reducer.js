const initialState = {
  token: "",
  selectedList: "",
  sections: {
    list: [], // list element:{ title: "", id: ""}
    section_order: [],
    section_orderSynced: true
  },
  itemOrderSynced: true,
  items: [], // items element: {}
  itemSuggestions: [],
  showEmptyLists: false,
  editItemModal: {
    Showing: false,
    itemId: "",
    itemToEdit: {
      item: "",
      item_id: "",
      amount: 0,
      unit: "",
      section: "",
      section_name: ""
    }
  }
};

function reducer(state = initialState, action) {
  var newSections;
  var newItems;
  switch (action.type) {
    case "SET_TOKEN":
      return Object.assign({}, state, {
        token: action.payload.token
      });
    case "SET_LIST_NAME":
      return Object.assign({}, state, {
        selectedList: action.payload.id
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
      if (action.payload.item_name === "" && action.payload.item_id === "") {
        return state;
      }

      if (action.payload.item_name !== "") {
        itemToEdit = {
          item: action.payload.item_name,
          section: "section-0",
          section_name: "",
          item_id: "",
          amout: 0,
          unit: "st"
        };
      } else {
        itemToEdit = state.items.find(item => {
          return item.item_id === action.payload.item_id;
        });
        // Find section name

        var section = state.sections.list.find(section => {
          return section.id === itemToEdit.section;
        });
        itemToEdit.section_name = section.title;
      }
      return Object.assign({}, state, {
        editItemModal: {
          ...state.editItemModal,
          Showing: true,
          itemId: action.payload.item_id,
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
        item => item.item_id === action.payload.item.item_id
      );
      var isNewItem = index === -1;
      item.synced = false;

      if (isNewItem) {
        item.item_id =
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9);
        item.checked = false;
        item.deleted = false;
        if (item.section === "" || !item.section) {
          const suggested = state.itemSuggestions.find(
            suggestion => suggestion.item === item.item
          );

          if (!suggested) {
            item.section = "section-0";
          } else {
            const section = state.sections.list.find(
              section => section.title === suggested.section
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
        if (element.item_id === action.payload.id) {
          element.synced = false;
          element.deleted = true;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "ITEM_SYNCED":
      newItems = [...state.items];
      newItems.map(element => {
        if (element.item_id === action.payload.id) {
          element.synced = true;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "TOGGLE_CHECKED":
      newItems = [...state.items];

      newItems.map(element => {
        if (element.item_id === action.payload.id) {
          element.synced = false;
          element.checked = !element.checked;
        }
        return element;
      });
      return Object.assign({}, state, { items: newItems });
    case "INCREASE_AMOUNT":
      newItems = [...state.items];
      index = newItems.findIndex(item => item.item_id === action.payload.id);
      item = Object.assign({}, newItems[index]);
      item.synced = false;
      item.amount = item.amount + action.payload.amount;
      newItems[index] = item;
      return Object.assign({}, state, { items: newItems });
    case "SWAP_SECTIONS":
      newSections = { ...state.sections };
      newSections.section_order.splice(action.payload.index1, 1);
      newSections.section_order.splice(
        action.payload.index2,
        0,
        action.payload.id
      );
      newSections.section_orderSynced = false;
      return Object.assign({}, state, { sections: newSections });

    case "SET_SECTIONS":
      return Object.assign({}, state, {
        sections: {
          list: action.payload.list,
          section_order: action.payload.order,
          section_orderSynced: true
        }
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
        sections: {
          list: [
            ...state.sections.list,
            { title: action.payload.section_name, id: id }
          ],
          section_order: [...state.sections.section_order, id],
          section_orderSynced: false
        }
      });
    case "DELETE_SECTION":
      newSections = { ...state.sections };
      newItems = [...state.items];

      newSections.list = newSections.list.filter(section => {
        return section.id !== action.payload.section_id;
      });
      newSections.section_order = newSections.section_order.filter(
        section_id => {
          return section_id !== action.payload.section_id;
        }
      );
      newItems.map(item => {
        if (item.section === action.payload.section_id) {
          item.section = "section-0";
          item.synced = false;
        }
        return item;
      });
      newSections.section_orderSynced = false;
      return Object.assign({}, state, {
        sections: newSections,
        items: newItems
      });
    case "SECTION_ORDER_SYNCED":
      newSections = { ...state.sections };
      newSections.section_orderSynced = true;
      return Object.assign({}, state, { sections: newSections });
    default:
      return state;
  }
}

export default reducer;
