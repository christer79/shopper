import React from "react";
import { Mutation } from "react-apollo";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";

import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { LISTS, CREATE_LIST } from "../../../graphqlRequests";

const styles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    zIndex: 1,
    bottom: 20,

    right: 20,
    margin: "0 auto"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function ListCreator() {
  const [form, setValues] = React.useState({
    name: "",
    listtype: "shopping"
  });

  const classes = styles();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleClose() {
    setDialogOpen(false);
  }

  const updateField = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create new list</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name="name"
            id="name"
            label="List Name"
            type="text"
            fullWidth
            value={form.name}
            onChange={updateField}
          />

          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="listtype">Type</InputLabel>
            <Select
              native
              value={form.listtype}
              onChange={updateField}
              name="listtype"
              inputProps={{
                id: "listtype"
              }}
            >
              <option value="shopping">Shopping</option>
              <option value="pantry">Pantry</option>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Mutation mutation={CREATE_LIST}>
            {(createList, { ...data }) => (
              <Button
                onClick={() => {
                  createList({
                    variables: {
                      id:
                        "_" +
                        Math.random()
                          .toString(36)
                          .substr(2, 9),
                      name: form.name,
                      listtype: form.listtype
                    },
                    refetchQueries: [
                      {
                        query: LISTS
                      }
                    ]
                  });
                  setDialogOpen(false);
                  setValues({ name: "", listtype: "shopping" });
                }}
                noValidate
                autoComplete="off"
                id="createlist"
              >
                ADD
              </Button>
            )}
          </Mutation>
        </DialogActions>
      </Dialog>

      <Fab
        onClick={() => setDialogOpen(true)}
        color="primary"
        aria-label="Add"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

export default ListCreator;
