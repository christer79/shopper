import React, { Component } from "react";

import Api from "./Api";
import SignInScreen from "./components/firebasesignin";
import ListSelector from "./components/selectlist/listselector";
import NavBar from "./components/navBar";
import * as firebase from "firebase";

import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split, concat, ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import ListIcon from "@material-ui/icons/ListAlt";
import ExitToAppIcon from "@material-ui/icons/ExitToAppOutlined";
import { FirebaseAuthConsumer, IfFirebaseAuthed } from "@react-firebase/auth";
import Shopper from "./Shopper";

import { setToken } from "./actions/actions";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    token: state.token
  };
}

const mapDispatchToProps = {
  setToken
};

class App extends Component {
  constructor(props) {
    super(props);
    // this.onDragEnd = this.onDragEnd.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  httpLink = new HttpLink({
    uri: process.env.REACT_APP_SHOPPER_GRAPHQL_HTTP_URL
  });

  wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_SHOPPER_GRAPHQL_WEBSOCKET_URL,
    options: {
      lazy: true,
      reconnect: true,
      connectionCallback: err => {
        if (err) {
          console.log("Error Connecting to Subscriptions Server", err);
        }
      }
    }
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  graphqlLink = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    this.wsLink,
    this.httpLink
  );

  componentDidMount() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      authUser.getIdToken().then(token => {
        this.props.setToken(token);
      });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: "Bearer " + this.props.token
      }
    });
    //
    // // Add onto payload for WebSocket authentication
    // (operation as Operation & { authToken: string | undefined }).authToken = localStorage.getItem("token");

    return forward(operation);
  });

  client = new ApolloClient({
    link: concat(this.authMiddleware, this.graphqlLink),
    cache: new InMemoryCache()
  });

  render() {
    return (
      <div>
        <FirebaseAuthConsumer>
          {({ isSignedIn }) => {
            if (isSignedIn === false) {
              return <SignInScreen />;
            }
          }}
        </FirebaseAuthConsumer>
        <ApolloHooksProvider client={this.client}>
          <ApolloProvider client={this.client}>
            <IfFirebaseAuthed>
              {authState => {
                if (this.props.token === "") {
                  return <div>Waiting for token</div>;
                }
                if (this.props.selectedList === "") {
                  return (
                    <div>
                      <NavBar
                        icon={<ListIcon />}
                        page="Select list...."
                        onBack={() => firebase.auth().signOut()}
                        backIcon={<ExitToAppIcon />}
                      />
                      <ListSelector />
                    </div>
                  );
                }
                return (
                  <div>
                    <Api client={this.client} key={this.props.selectedList} />
                    <Shopper />
                  </div>
                );
              }}
            </IfFirebaseAuthed>
          </ApolloProvider>
        </ApolloHooksProvider>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
