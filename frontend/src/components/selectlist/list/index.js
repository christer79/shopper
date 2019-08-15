import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { setListName } from "../../../actions/actions";
import { connect } from "react-redux";

const DELETE_LIST = gql`
  mutation($id: ID!) {
    deleteList(id: $id) {
      id
    }
  }
`;
const mapDispatchToProps = {
  setListName
};

class List extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <button
          onClick={() => this.props.setListName(this.props.id, this.props.type)}
        >
          {this.props.name} - ({this.props.type})
        </button>
        <Mutation mutation={DELETE_LIST}>
          {(deleteList, { ...data }) => (
            <button
              onClick={e => {
                deleteList({
                  variables: {
                    id: this.props.id
                  }
                });
              }}
            >
              X
            </button>
          )}
        </Mutation>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(List);
