const SECTION_ORDER_SYNCED = "SECTION_ORDER_SYNCED";
const SECTION_ORDER_UNSYNCED = "SECTION_ORDER_UNSYNCED";
const ITEM_ORDER_SYNCED = "ITEM_ORDER_SYNCED";
const ITEM_ORDER_UNSYNCED = "ITEM_ORDER_UNSYNCED";

const ADD_SECTION = "ADD_SECTION";
const DELETE_SECTION = "DELETE_SECTION";
const SWAP_SECTIONS = "SWAP_SECTIONS";
const SET_SECTIONS = "SET_SECTIONS";

const INCREASE_AMOUNT = "INCREASE_AMOUNT";
const TOGGLE_CHECKED = "TOGGLE_CHECKED";
const DELETE_ITEM = "DELETE_ITEM";
const SET_ITEMS = "SET_ITEMS";
const ADD_ITEM = "ADD_ITEM";
const ITEM_SYNCED = "ITEM_SYNCED";
const TOGGLE_SHOW_EMPTY_LISTS = "TOGGLE_SHOW_EMPTY_LISTS";
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
export function openEditItemModal(item_id = "", item_name = "") {
  return {
    type: OPEN_EDIT_ITEM_MODAL,
    payload: { item_id: item_id, item_name: item_name }
  };
}

const CLOSE_EDIT_ITEM_MODAL = "CLOSE_EDIT_ITEM_MODAL";
export function closeEditItemModal(item_id) {
  return { type: CLOSE_EDIT_ITEM_MODAL };
}
export function toggleShowEmptyLists() {
  return { type: TOGGLE_SHOW_EMPTY_LISTS };
}

export function itemOrderUnsynced() {
  return { type: ITEM_ORDER_UNSYNCED };
}

export function itemOrderSynced() {
  return { type: ITEM_ORDER_SYNCED };
}

export function itemSynced(item_id) {
  return { type: ITEM_SYNCED, payload: { id: item_id } };
}

export function addItem(item) {
  return { type: ADD_ITEM, payload: { item: item } };
}

export function setItems(items) {
  return { type: SET_ITEMS, payload: { items: items } };
}
export function deleteItem(item_id) {
  return { type: DELETE_ITEM, payload: { id: item_id } };
}
export function toggleChecked(item_id) {
  return { type: TOGGLE_CHECKED, payload: { id: item_id } };
}

export function increaseAmount(item_id, amount) {
  return {
    type: INCREASE_AMOUNT,
    payload: { id: item_id, amount: amount }
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

export function sectionOrderSynced() {
  return { type: SECTION_ORDER_SYNCED };
}

export function sectionOrderUnsynced() {
  return { type: SECTION_ORDER_UNSYNCED };
}
