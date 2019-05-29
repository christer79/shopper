import React from "react";
import styled from "styled-components";
import { toggleShowEmptyLists } from "./actions/actions";
import { connect } from "react-redux";
import Clipboarder from "./components/clipboard";

import firebase from "firebase/app";
import "firebase/auth";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: box-start;
`;

const mapDispatchToProps = { toggleShowEmptyLists };

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
      </Container>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Menu);
