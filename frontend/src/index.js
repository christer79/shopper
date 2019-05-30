import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import reducer from "./reducer/reducer";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorker from "./serviceWorker";

import { persistStore, persistReducer } from "redux-persist";
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore } from "redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";

import { FirebaseAuthProvider } from "@react-firebase/auth";
import { firebaseConfig } from "./config/firebaseAuth";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, devToolsEnhancer());

const persistor = persistStore(store);
persistor.purge();

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_MOMENTS_GRAPHQL_HTTP_URL
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_MOMENTS_GRAPHQL_WEBSOCKET_URL,
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
const graphqlLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: graphqlLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </ApolloProvider>
    </Provider>
  </FirebaseAuthProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
