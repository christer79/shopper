import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { setListName } from "../../actions/actions";
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

class ListsList extends React.Component {
  render() {
    console.log(this.props);
    return (
      <Query query={LISTS} errorPolicy="all">
        {({ error, loading, data, ...result }) => {
          console.log(data.lists);
          if (error) return <span>Error: {error}</span>;
          if (loading) return <span> Loading...</span>;
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
