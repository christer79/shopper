import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import CreatableSelect from "react-select/lib/Creatable";

import {
  addItem,
  addSection,
  openEditItemModal,
  updateEditItemModalItem,
  closeEditItemModal,
  deleteItem
} from "../../actions/actions";

import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/ReplayOutlined";
import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteButton from "../DeleteButton";
function mapStateToProps(state) {
  return {
    editItemModalShowing: state.editItemModal.Showing,
    editItemModalItemId: state.editItemModal.ItemId,
    itemToEdit: state.editItemModal.itemToEdit,
    sections: state.sections,
    originalItemId: state.editItemModal.itemId,
    listType: state.selectedListType
  };
}
const mapDispatchToProps = {
  addItem,
  addSection,
  updateEditItemModalItem,
  openEditItemModal,
  closeEditItemModal,
  deleteItem
};

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

function EditItemForm(props) {
  const classes = useStyles();
  const { name, amount, goal, unit, section_name } = props.itemToEdit;

  const handleSectionChange = event => {
    var newItem = { ...props.itemToEdit };
    if (!event) {
      newItem.section = "";
      newItem.section_name = "";
      props.updateEditItemModalItem(newItem);
      return;
    }
    const { label } = event;
    const index = props.sections.findIndex(section => section.name === label);
    if (index > -1) {
      newItem.section = props.sections[index].id;
      newItem.section_name = props.sections[index].name;
    } else {
      newItem.section =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      newItem.section_name = event.label;
      props.addSection(newItem.section_name, newItem.section);
    }
    props.updateEditItemModalItem(newItem);
  };

  const handleChange = event => {
    const { name, value, type } = event.target;
    var val = value;
    if (type === "number") {
      val = Number(value);
    }

    var newItem = { ...props.itemToEdit };

    newItem[name] = val;
    props.updateEditItemModalItem(newItem);
  };

  const submitForm = () => {
    props.addItem(props.itemToEdit);
    props.closeEditItemModal();
  };

  const clearForm = () => {
    props.openEditItemModal(props.originalItemId);
  };

  const handleDelete = () => {
    props.deleteItem(props.itemToEdit.id);
    props.closeEditItemModal();
  };

  const selectOptions = props.sections.map(function(section) {
    return { label: section.name, value: section.id };
  });

  return (
    <Dialog
      open={props.editItemModalShowing}
      onClose={props.closeEditItemModal}
      fullScreen
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.closeEditItemModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Edit Item...
          </Typography>
          <Button color="inherit" onClick={submitForm}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <TextField
          label="Name"
          placeholder="Name"
          type="text"
          id="name"
          name="name"
          key="input-name"
          value={name}
          onChange={handleChange}
        />
        <div style={{ width: "100%" }}>
          <CreatableSelect
            isClearable
            id="section"
            value={{ value: section_name, label: section_name }}
            onChange={handleSectionChange}
            options={selectOptions}
          />
        </div>
        <div>
          <TextField
            label="Amount"
            placeholder="Amount"
            type="number"
            name="amount"
            id="amount"
            key="input-amount"
            inputMode="numeric"
            step="1"
            value={amount ? amount : 0}
            onChange={handleChange}
          />
          <TextField
            label="Unit"
            placeholder="Unit"
            type="text"
            name="unit"
            key="input-unit"
            value={unit}
            onChange={handleChange}
          />
        </div>
        {props.listType === "pantry" && (
          <div>
            <div>
              <TextField
                label="Goal"
                placeholder="Goal"
                type="number"
                name="goal"
                id="goal"
                key="input-goal"
                inputMode="numeric"
                step="1"
                value={goal ? goal : 0}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Tooltip title="Delete item" aria-label="add">
          <DeleteButton
            confirmTitle="Really delete item?"
            confirmQuestion="Deleted items are not possible to recover!"
            onClick={handleDelete}
          />
        </Tooltip>

        <Button type="button" onClick={clearForm}>
          <ClearIcon />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditItemForm);
