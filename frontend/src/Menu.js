import React from "react";
import styled from "styled-components";
import {
  deleteCheckedItems,
  toggleShowEmptyLists,
  setListName
} from "./actions/actions";
import { connect } from "react-redux";
import Clipboarder from "./components/clipboard";

import firebase from "firebase/app";
import "firebase/auth";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: box-start;
`;

const mapDispatchToProps = {
  deleteCheckedItems,
  toggleShowEmptyLists,
  setListName
};

class Menu extends React.Component {
  render() {
    return (
      <Container>
        <button onClick={() => this.props.toggleShowEmptyLists()}>S/H</button>
        <Clipboarder />
        <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button>
        <button onClick={() => this.props.setListName("")}> CL </button>
        <button onClick={() => this.props.deleteCheckedItems()}> DC </button>
      </Container>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Menu);
