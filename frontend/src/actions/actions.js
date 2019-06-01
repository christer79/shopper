const ADD_SECTION = "ADD_SECTION";
const DELETE_SECTION = "DELETE_SECTION";
const SWAP_SECTIONS = "SWAP_SECTIONS";
const SET_SECTIONS = "SET_SECTIONS";

const INCREASE_AMOUNT = "INCREASE_AMOUNT";
const TOGGLE_CHECKED = "TOGGLE_CHECKED";
const DELETE_ITEM = "DELETE_ITEM";
const SET_ITEMS = "SET_ITEMS";
const ADD_ITEM = "ADD_ITEM";
const TOGGLE_SHOW_EMPTY_LISTS = "TOGGLE_SHOW_EMPTY_LISTS";

const SET_LIST_NAME = "SET_LIST_NAME";
export function setListName(id) {
  return {
    type: SET_LIST_NAME,
    payload: { id: id }
  };
}

const SET_TOKEN = "SET_TOKEN";
export function setToken(token) {
  return {
    type: SET_TOKEN,
    payload: { token: token }
  };
}

const SET_ITEM_SUGGESTIONS = "SET_ITEM_SUGGESTIONS";
export function setItemSuggestions(itemSuggestions) {
  return {
    type: SET_ITEM_SUGGESTIONS,
    payload: { suggestions: itemSuggestions }
  };
}

const UPDATE_EDIT_ITEM_MODAL_ITEM = "UPDATE_EDIT_ITEM_MODAL_ITEM";
export function updateEditItemModalItem(item) {
  return { type: UPDATE_EDIT_ITEM_MODAL_ITEM, payload: { item: item } };
}
const OPEN_EDIT_ITEM_MODAL = "OPEN_EDIT_ITEM_MODAL";
export function openEditItemModal(id = "", item_name = "") {
  return {
    type: OPEN_EDIT_ITEM_MODAL,
    payload: { id: id, item_name: item_name }
  };
}

const CLOSE_EDIT_ITEM_MODAL = "CLOSE_EDIT_ITEM_MODAL";
export function closeEditItemModal(id) {
  return { type: CLOSE_EDIT_ITEM_MODAL };
}
export function toggleShowEmptyLists() {
  return { type: TOGGLE_SHOW_EMPTY_LISTS };
}

const ITEM_SYNCED = "ITEM_SYNCED";
export function itemSynced(id) {
  return { type: ITEM_SYNCED, payload: { id: id } };
}

const SECTION_SYNCED = "SECTION_SYNCED";
export function sectionSynced(id) {
  return { type: SECTION_SYNCED, payload: { id: id } };
}

export function addItem(item) {
  return { type: ADD_ITEM, payload: { item: item } };
}

export function setItems(items) {
  return { type: SET_ITEMS, payload: { items: items } };
}
export function deleteItem(id) {
  return { type: DELETE_ITEM, payload: { id: id } };
}
export function toggleChecked(id) {
  return { type: TOGGLE_CHECKED, payload: { id: id } };
}

export function increaseAmount(id, amount) {
  return {
    type: INCREASE_AMOUNT,
    payload: { id: id, amount: amount }
  };
}
export function addSection(section_name, section_id) {
  return {
    type: ADD_SECTION,
    payload: { section_name: section_name, section_id: section_id }
  };
}

export function deleteSection(section_id) {
  return {
    type: DELETE_SECTION,
    payload: { section_id: section_id }
  };
}

export function setSections(list, order) {
  return {
    type: SET_SECTIONS,
    payload: { list: list, order: order }
  };
}

export function swapSections(index1, index2, id) {
  return {
    type: SWAP_SECTIONS,
    payload: { index1: index1, index2: index2, id: id }
  };
}
