import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { setListName } from "../../../actions/actions";
import { connect } from "react-redux";

import Card from "@material-ui/core/Card";
import { CardActionArea, CardContent } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import ShoppingIcon from "@material-ui/icons/ShoppingCartOutlined";
import KitchenIcon from "@material-ui/icons/KitchenOutlined";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const DELETE_LIST = gql`
  mutation($id: ID!) {
    deleteList(id: $id) {
      id
    }
  }
`;

const LISTS = gql`
  {
    lists {
      id
      name
      listtype
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
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.type === "shopping" ? (
              <ShoppingIcon />
            ) : (
              <KitchenIcon />
            )}
            {this.props.name}
          </Typography>
        </CardContent>
        <CardActionArea>
          <Button
            onClick={() =>
              this.props.setListName(this.props.id, this.props.type)
            }
          >
            Open
          </Button>
          <Mutation mutation={DELETE_LIST}>
            {(deleteList, { ...data }) => (
              <Button
                onClick={e => {
                  deleteList({
                    variables: {
                      id: this.props.id
                    },
                    refetchQueries: [
                      {
                        query: LISTS
                      }
                    ]
                  });
                }}
              >
                <DeleteIcon />
              </Button>
            )}
          </Mutation>
        </CardActionArea>
      </Card>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(List);
