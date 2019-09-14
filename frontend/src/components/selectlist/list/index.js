import React from "react";
import { setListName } from "../../../actions/actions";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";

import Card from "@material-ui/core/Card";
import { CardActions, CardContent } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import ShoppingIcon from "@material-ui/icons/ShoppingCartOutlined";
import KitchenIcon from "@material-ui/icons/KitchenOutlined";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { DELETE_LIST, LISTS } from "../../../graphqlRequests";

const mapDispatchToProps = {
  setListName
};

function List(props) {
  const { type, name, id, setListName } = props;
  const [deleteList] = useMutation(DELETE_LIST);

  return (
    <Card>
      <CardContent onClick={() => setListName(id, type)}>
        <Typography gutterBottom variant="h5" component="h2">
          {type === "shopping" ? <ShoppingIcon /> : <KitchenIcon />}
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => setListName(id, type)}>Open</Button>
        <Button
          onClick={e => {
            deleteList({
              variables: {
                id: id
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
      </CardActions>
    </Card>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(List);
