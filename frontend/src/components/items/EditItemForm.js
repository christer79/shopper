import React from "react";

import { connect } from "react-redux";
import CreatableSelect from "react-select/lib/Creatable";

import {
  addItem,
  addSection,
  openEditItemModal,
  updateEditItemModalItem,
  closeEditItemModal
} from "../../actions/actions";

import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/ReplayOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

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
  closeEditItemModal
};

function EditItemForm(props) {
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

  const { name, amount, goal, unit, section_name } = props.itemToEdit;
  const selectOptions = props.sections.map(function(section) {
    return { label: section.name, value: section.id };
  });
  return (
    <Dialog
      open={props.editItemModalShowing}
      onClose={props.closeEditItemModal}
    >
      <DialogTitle id="form-dialog-title">Edit Item...</DialogTitle>
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
            inputmode="numeric"
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
                inputmode="numeric"
                step="1"
                value={goal ? goal : 0}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" value="+" onClick={submitForm}>
          <SaveIcon />
        </Button>
        <Button type="button" value="X" onClick={clearForm}>
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
