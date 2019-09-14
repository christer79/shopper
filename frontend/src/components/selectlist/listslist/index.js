import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { setLists } from "../../../actions/actions";
import { connect } from "react-redux";
import List from "../list";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { LISTS } from "../../../graphqlRequests";

const mapDispatchToProps = {
  setLists
};

function Error(props) {
  return <Typography>Error loading: </Typography>;
}

function Loading() {
  return <Typography>Loading</Typography>;
}

function ListsList(props) {
  const { error, loading, data } = useQuery(LISTS);

  if (error) return "Error loading lists...";
  if (loading) return "Loading lists....";
  props.setLists(data.lists);

  return (
    <Grid container spacing={4} style={{ padding: 24 }}>
      {data.lists ? (
        data.lists.map(list => (
          <Grid key={list.id} item xs={12} sm={6} lg={4} xl={3}>
            <List
              key={list.id}
              name={list.name}
              type={list.listtype}
              id={list.id}
            />
          </Grid>
        ))
      ) : (
        <span>No lists yet!</span>
      )}
    </Grid>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(ListsList);
