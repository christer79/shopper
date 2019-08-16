import React from "react";
import { connect } from "react-redux";

import gql from "graphql-tag";

import {
  setSections,
  setItems,
  itemSynced,
  sectionSynced,
  setItemSuggestions
} from "./actions/actions";

const SUGGESTIONS = gql`
  query getSuggestions($list: ID!) {
    suggestions(list: $list) {
      name
      section
      unit
    }
  }
`;
const LIST = gql`
  query getList($id: ID!) {
    list(id: $id) {
      name
      id
      sections {
        name
        id
        position
      }
      items {
        id
        name
        amount
        goal
        unit
        section
        checked
        deleted
        position
      }
    }
  }
`;

const CREATE_ITEM = gql`
  mutation createItem(
    $id: ID!
    $name: String!
    $amount: Float
    $goal: Float
    $unit: String
    $section: String
    $checked: Boolean
    $deleted: Boolean
    $position: Int
    $table: ID!
  ) {
    createItem(
      input: {
        id: $id
        name: $name
        amount: $amount
        goal: $goal
        unit: $unit
        section: $section
        checked: $checked
        deleted: $deleted
        position: $position
        table: $table
      }
    ) {
      id
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation updateItem(
    $id: ID!
    $name: String!
    $amount: Float
    $goal: Float
    $unit: String
    $section: String
    $checked: Boolean
    $deleted: Boolean
    $position: Int
    $table: ID!
  ) {
    updateItem(
      input: {
        id: $id
        name: $name
        amount: $amount
        goal: $goal
        unit: $unit
        section: $section
        checked: $checked
        deleted: $deleted
        position: $position
        table: $table
      }
    ) {
      id
    }
  }
`;

const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!, $table: ID!) {
    deleteItem(input: { id: $id, table: $table }) {
      id
    }
  }
`;

const CREATE_SECTION = gql`
  mutation createSection(
    $id: ID!
    $name: String!
    $position: Int!
    $table: ID!
  ) {
    createSection(
      input: { id: $id, name: $name, position: $position, table: $table }
    ) {
      id
    }
  }
`;
const UPDATE_SECTION = gql`
  mutation updateSection(
    $id: ID!
    $name: String!
    $position: Int!
    $table: ID!
  ) {
    updateSection(
      input: { id: $id, name: $name, position: $position, table: $table }
    ) {
      id
    }
  }
`;
const DELETE_SECTION = gql`
  mutation deleteSection($id: ID!, $table: ID!) {
    deleteSection(input: { id: $id, table: $table }) {
      id
    }
  }
`;

function mapStateToProps(state) {
  return {
    sections: state.sections,
    items: state.items,
    selectedList: state.selectedList
  };
}

const mapDispatchToProps = {
  setSections,
  setItems,
  itemSynced,
  sectionSynced,
  setItemSuggestions
};

class Api extends React.Component {
  constructor(props) {
    super(props);
    this.fetchFromRemote = this.fetchFromRemote.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.syncStateWithServer = this.syncStateWithServer.bind(this);
  }

  syncStateWithServer() {
    console.log("syncStateWithServer");

    // SYNC SECTIONS
    this.props.sections
      .filter(section => section.synced === false)
      .forEach(section => {
        console.log("Unsynced section: ", section);
        if (section.isNew && section.isNew === true) {
          this.props.client
            .mutate({
              mutation: CREATE_SECTION,
              variables: {
                id: section.id,
                name: section.name,
                position: section.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.sectionSynced(data.data.createSection.id);
            });
        }
        if (section.deleted && section.synced === false) {
          this.props.client
            .mutate({
              mutation: DELETE_SECTION,
              variables: {
                id: section.id,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.sectionSynced(data.data.deleteSection.id);
            });
        } else if (section.synced === false) {
          this.props.client
            .mutate({
              mutation: UPDATE_SECTION,
              variables: {
                id: section.id,
                name: section.name,
                position: section.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.sectionSynced(data.data.updateSection.id);
            });
        }
      });

    // SYNC ITEMS
    this.props.items
      .filter(item => item.synced === false)
      .forEach(item => {
        console.log("Unsynced item: ", item);
        if (item.isNew && item.isNew === true) {
          this.props.client
            .mutate({
              mutation: CREATE_ITEM,
              variables: {
                id: item.id,
                name: item.name,
                amount: item.amount,
                goal: item.goal,
                unit: item.unit,
                section: item.section,
                checked: item.checked,
                deleted: item.deleted,
                position: item.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.itemSynced(data.data.createItem.id);
            });
        }
        if (item.synced === false && item.deleted === true) {
          this.props.client
            .mutate({
              mutation: DELETE_ITEM,
              variables: {
                id: item.id,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.itemSynced(data.data.deleteItem.id);
            });
        } else if (item.synced === false) {
          this.props.client
            .mutate({
              mutation: UPDATE_ITEM,
              variables: {
                id: item.id,
                name: item.name,
                amount: item.amount,
                goal: item.goal,
                unit: item.unit,
                section: item.section,
                checked: item.checked,
                deleted: item.deleted,
                position: item.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              this.props.itemSynced(data.data.updateItem.id);
            });
        }
      });
  }

  fetchFromRemote() {
    this.props.client
      .query({
        query: SUGGESTIONS,
        variables: { list: this.props.selectedList }
      })
      .then(data => {
        this.props.setItemSuggestions(
          data.data.suggestions ? data.data.suggestions : []
        );
      });
    this.props.client
      .query({
        query: LIST,
        variables: { id: this.props.selectedList }
      })
      .then(data => {
        this.props.setItems(
          data.data.list.items
            ? data.data.list.items.map(entry => {
                entry.synced = true;
                return entry;
              })
            : []
        );
        this.props.setSections(
          data.data.list.sections
            ? data.data.list.sections.map(entry => {
                entry.synced = true;
                return entry;
              })
            : []
        );
      });
  }

  componentDidMount() {
    this.fetchFromRemote();
    this.interval = setInterval(this.syncStateWithServer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return null;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Api);
