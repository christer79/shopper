import React from "react";
import { Query } from "react-apollo";
import { setListName } from "../../../actions/actions";
import { connect } from "react-redux";
import List from "../list";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { LISTS } from "../../../graphqlRequests";

const mapDispatchToProps = {
  setListName
};

function Error(props) {
  return <Typography>Error loading: + {props.error}</Typography>;
}

function Loading() {
  return <Typography>Loading</Typography>;
}

function ListsList() {
  return (
    <Paper>
      <Typography variant="h5" component="h3">
        Select list
      </Typography>
      <Grid container spacing={4} style={{ padding: 24 }}>
        <Query query={LISTS} errorPolicy="all">
          {({ error, loading, data, ...result }) => {
            if (error) return <Error error={error} />;
            if (loading) return <Loading />;
            console.log(data.lists);
            return data.lists ? (
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
            );
          }}
        </Query>
      </Grid>
    </Paper>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(ListsList);
