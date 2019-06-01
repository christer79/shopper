import React from "react";
import { connect } from "react-redux";

import gql from "graphql-tag";

import { setSections, setItems, itemSynced } from "./actions/actions";

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
  itemSynced
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
    this.props.items
      .filter(item => item.synced === false)
      .forEach(item => {
        console.log("Unsynced item:", item);
        if (item.isNew && item.isNew === true) {
          this.props.client
            .mutate({
              mutation: CREATE_ITEM,
              variables: {
                id: item.id,
                name: item.name,
                amount: item.amount,
                unit: item.unit,
                section: item.section,
                checked: item.checked,
                deleted: item.deleted,
                position: item.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              console.log(data.data.createItem.id);
              this.props.itemSynced(data.data.createItem.id);
            });
        }
        if (item.synced === false && item.deleted === true) {
          this.props.client
            .mutate({
              mutation: DELETE_ITEM,
              variables: {
                id: item.id
              }
            })
            .then(data => {
              this.props.itemSynced(data.data.createItem.id);
            });
        } else if (item.synced === false) {
          this.props.client
            .mutate({
              mutation: UPDATE_ITEM,
              variables: {
                id: item.id,
                name: item.name,
                amount: item.amount,
                unit: item.unit,
                section: item.section,
                checked: item.checked,
                deleted: item.deleted,
                position: item.position,
                table: this.props.selectedList
              }
            })
            .then(data => {
              console.log(data.data.updateItem.id);
              this.props.itemSynced(data.data.updateItem.id);
            });
        }
      });
    //forEach
  }

  fetchFromRemote() {
    this.props.client
      .query({
        query: LIST,
        variables: { id: this.props.selectedList }
      })
      .then(data => {
        this.props.setItems(data.data.list.items);
        this.props.setSections(data.data.list.sections);
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
