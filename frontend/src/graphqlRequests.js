import gql from "graphql-tag";

export const DELETE_LIST = gql`
  mutation($id: ID!) {
    deleteList(id: $id) {
      id
    }
  }
`;

export const LISTS = gql`
  {
    lists {
      id
      name
      listtype
    }
  }
`;

export const CREATE_LIST = gql`
  mutation CreateList($id: ID!, $name: String!, $listtype: String!) {
    createList(input: { id: $id, name: $name, listtype: $listtype }) {
      name
      id
    }
  }
`;

export const SUGGESTIONS = gql`
  query getSuggestions($list: ID!) {
    suggestions(list: $list) {
      name
      section
      unit
    }
  }
`;
export const LIST = gql`
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

export const CREATE_ITEM = gql`
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

export const UPDATE_ITEM = gql`
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

export const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!, $table: ID!) {
    deleteItem(input: { id: $id, table: $table }) {
      id
    }
  }
`;

export const CREATE_SECTION = gql`
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
export const UPDATE_SECTION = gql`
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
export const DELETE_SECTION = gql`
  mutation deleteSection($id: ID!, $table: ID!) {
    deleteSection(input: { id: $id, table: $table }) {
      id
    }
  }
`;
