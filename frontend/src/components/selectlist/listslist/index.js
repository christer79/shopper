import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { setListName } from "../../../actions/actions";
import { connect } from "react-redux";
import List from "../list";
const LISTS = gql`
  {
    lists {
      id
      name
    }
  }
`;
const mapDispatchToProps = {
  setListName
};

class Error extends React.Component {
  render() {
    return <div>Error loading: {this.props.error}</div>;
  }
}

class Loading extends React.Component {
  render() {
    return <div>Loading</div>;
  }
}
class ListsList extends React.Component {
  render() {
    return (
      <Query query={LISTS} errorPolicy="all">
        {({ error, loading, data, ...result }) => {
          if (error) return <Error error={error} />;
          if (loading) return <Loading />;
          return data.lists ? (
            data.lists.map(list => (
              <List key={list.id} name={list.name} id={list.id} />
            ))
          ) : (
            <div>No lists yet!</div>
          );
        }}
      </Query>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ListsList);
