import React, { Component } from "react";

import Lists from "./components/items/Lists";
import AddItemForm from "./AddItemForm";
import Api from "./Api";
import Menu from "./Menu";
import EditItemForm from "./components/items/EditItemForm";
import AddFromPantryDialog from "./components/AddFromPantryDialog";

import { DragDropContext } from "react-beautiful-dnd";
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
import ShoppingIcon from "@material-ui/icons/ShoppingCartOutlined";
import KitchenIcon from "@material-ui/icons/KitchenOutlined";
import ListIcon from "@material-ui/icons/ListAlt";
import ClearIcon from "@material-ui/icons/ClearOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToAppOutlined";
import { FirebaseAuthConsumer, IfFirebaseAuthed } from "@react-firebase/auth";

import {
  swapSections,
  setItems,
  toggleChecked,
  setToken,
  setListName
} from "./actions/actions";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    selectedList: state.selectedList,
    sections: state.sections,
    items: state.items,
    token: state.token,
    lists: state.lists
  };
}

const mapDispatchToProps = {
  swapSections,
  setItems,
  toggleChecked,
  setToken,
  setListName
};

class App extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
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

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "LIST") {
      this.props.swapSections(source.index, destination.index, draggableId);
      return;
    }

    const droppableIdChanged = source.droppableId !== destination.droppableId;
    const indexChanged = destination.index !== source.index;
    const droppedToChecked = destination.droppableId === "checked-list";
    if (!droppableIdChanged && !indexChanged) {
      return;
    }

    if (droppableIdChanged && droppedToChecked) {
      this.props.toggleChecked(draggableId);
      return;
    }

    console.log(result);

    var newItems = this.props.items;

    const draggedItemIndexInItems = newItems.findIndex(item => {
      return item.id === draggableId;
    });
    const draggedItem = newItems.find(item => {
      return item.id === draggableId;
    });

    var itemsInDestinationDroppable = null;
    if (droppedToChecked) {
      itemsInDestinationDroppable = this.props.items.filter(item => {
        return item.checked === true && item.deleted === false;
      });
    } else {
      itemsInDestinationDroppable = this.props.items.filter(item => {
        return (
          item.section === destination.droppableId &&
          item.checked === false &&
          item.deleted === false
        );
      });
    }

    const destinationSectionEmpty = itemsInDestinationDroppable.length === 0;

    const addedAsLastIndex =
      destination.index >= itemsInDestinationDroppable.length;

    if (droppableIdChanged) {
      draggedItem.section = destination.droppableId;
      draggedItem.synced = false;
    }

    if (!destinationSectionEmpty) {
      newItems.splice(draggedItemIndexInItems, 1);

      if (addedAsLastIndex && droppableIdChanged) {
        const destinationItemId =
          itemsInDestinationDroppable[destination.index - 1].id;
        const destinationItemIndexInItems = newItems.findIndex(item => {
          return item.id === destinationItemId;
        });
        newItems.splice(destinationItemIndexInItems + 1, 0, draggedItem);
      } else {
        const destinationItemId =
          itemsInDestinationDroppable[destination.index].id;
        var destinationItemIndexInItems = newItems.findIndex(item => {
          return item.id === destinationItemId;
        });

        const pulledUpInSameList =
          destinationItemIndexInItems < draggedItemIndexInItems ||
          (destinationItemIndexInItems >= draggedItemIndexInItems &&
            droppableIdChanged);

        destinationItemIndexInItems =
          destinationItemIndexInItems + (pulledUpInSameList ? 0 : 1);

        newItems.splice(destinationItemIndexInItems, 0, draggedItem);
      }
    }

    if (
      source.droppableId === "checked-list" &&
      destination.droppableId !== "checked-list"
    ) {
      this.props.toggleChecked(draggableId);
    }

    var _items = [];
    for (var i = 0; i < newItems.length; i++) {
      _items.push(newItems[i]);
    }
    _items.map((entry, index) => {
      if (index !== entry.position) {
        entry.synced = false;
        entry.position = index;
      }
      return entry;
    });

    this.props.setItems(_items);
  };

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
                    <EditItemForm />
                    <AddFromPantryDialog />
                    <Api client={this.client} key={this.props.selectedList} />
                    <NavBar
                      icon={
                        this.props.lists.find(
                          list => list.id === this.props.selectedList
                        ).listtype === "shopping" ? (
                          <ShoppingIcon />
                        ) : (
                          <KitchenIcon />
                        )
                      }
                      backIcon={<ClearIcon />}
                      page={
                        this.props.lists.find(
                          list => list.id === this.props.selectedList
                        ).name
                      }
                      onBack={() => this.props.setListName("")}
                    />
                    <AddItemForm />
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      <Lists />
                    </DragDropContext>
                    <Menu />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
