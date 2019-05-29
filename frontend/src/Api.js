import React from "react";
import { connect } from "react-redux";
import {
  sectionOrderSynced,
  setSections,
  setItems,
  itemSynced,
  itemOrderSynced,
  setItemSuggestions
} from "./actions/actions";

const getHostname = () => {
  const defaultUrl = "https://murmuring-fortress-57803.herokuapp.com";
  const url = process.env.REACT_APP_BACKEND_URL;
  if (!url) {
    return defaultUrl;
  } else {
    return "http://" + window.location.hostname + ":9090";
  }
};

function mapStateToProps(state) {
  return {
    sections: state.sections,
    items: state.items,
    itemOrderSyncedState: state.itemOrderSynced,
    section_orderSynced: state.sectionOrderSynced
  };
}

const mapDispatchToProps = {
  sectionOrderSynced,
  setSections,
  setItems,
  itemSynced,
  itemOrderSynced,
  setItemSuggestions
};

class Api extends React.Component {
  constructor(props) {
    super(props);
    this.syncStateWithServer = this.syncStateWithServer.bind(this);
    this.toggleShowList = this.toggleShowList.bind(this);
    this.fetchFromRemote = this.fetchFromRemote.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = { showlist: false };
  }

  toggleShowList() {
    this.setState({ showlist: !this.state.showlist });
  }

  syncStateWithServer() {
    // Sync sections
    if (this.props.sections.section_orderSynced === false) {
      fetch(getHostname() + "/api/sections", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.props.sections)
      })
        .then(
          function(response) {
            if (response.ok) {
              this.props.sectionOrderSynced();
            }
            return response.json(); //response.json() is resolving its promise. It waits for the body to load
          }.bind(this)
        )
        .then(function(responseData) {});
    }

    // Sync items
    const items = this.props.items;
    const unsynced = items.filter(element => {
      return element.synced !== true;
    });

    unsynced.forEach(
      function(element, idx) {
        fetch(getHostname() + "/api/items", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(element)
        })
          .then(
            function(response) {
              if (response.ok) {
                this.props.itemSynced(element.item_id);
              }
              return response.json(); //response.json() is resolving its promise. It waits for the body to load
            }.bind(this)
          )
          .then(function(responseData) {});
      }.bind(this)
    );

    // Sync item order
    if (this.props.itemOrderSyncedState === false) {
      var itemOrder = [];
      this.props.items.forEach((item, index) => {
        itemOrder.push({ item_id: item.item_id, order: index });
      });
      fetch(getHostname() + "/api/items/order", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(itemOrder)
      })
        .then(
          function(response) {
            if (response.ok) {
              this.props.itemOrderSynced();
            }
            return response.json(); //response.json() is resolving its promise. It waits for the body to load
          }.bind(this)
        )
        .then(function(responseData) {});
    }
  }

  fetchFromRemote() {
    fetch(getHostname() + "/api/items", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.ok) {
        }
        return response.json(); //response.json() is resolving its promise. It waits for the body to load
      })
      .then(
        function(responseData) {
          if (!responseData.items) {
            this.props.setItems([]);
          } else {
            this.props.setItems(responseData.items);
          }
        }.bind(this)
      );

    fetch(getHostname() + "/api/items/suggestions", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.ok) {
        }
        return response.json(); //response.json() is resolving its promise. It waits for the body to load
      })
      .then(
        function(responseData) {
          this.props.setItemSuggestions(responseData ? responseData : []);
        }.bind(this)
      );

    fetch(getHostname() + "/api/sections", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.ok) {
        }
        return response.json(); //response.json() is resolving its promise. It waits for the body to load
      })
      .then(
        function(responseData) {
          this.props.setSections(
            responseData.list ? responseData.list : [],
            responseData.section_order ? responseData.section_order : []
          );
        }.bind(this)
      );
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
