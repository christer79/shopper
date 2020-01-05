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

import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";

import {
  FirebaseAuthConsumer,
  FirebaseAuthProvider
} from "@react-firebase/auth";

import { firebaseConfig } from "./config/firebaseAuth";

import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { blue, orange } from "@material-ui/core/colors";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, devToolsEnhancer());

const persistor = persistStore(store);

persistor.purge();

const theme = createMuiTheme({
  palette: { primary: { main: blue[500] }, secondary: { main: orange[500] } }
});

ReactDOM.render(
  <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <FirebaseAuthConsumer>
            {authState => {
              return <App authState={authState} />;
            }}
          </FirebaseAuthConsumer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </FirebaseAuthProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
