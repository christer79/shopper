import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import CreatableSelect from "react-select/lib/Creatable";
import {
  addItem,
  addSection,
  openEditItemModal,
  updateEditItemModalItem,
  closeEditItemModal
} from "./actions/actions";

const Label = styled.label`
  padding-left: 15px;
`;

const ColContainer = styled.div`
display: flex
flex-direction: column
align-items: flex-start
`;

const RowContainer = styled.div`
display: flex
flex-direction: row
align-items: flex-start

width: 100%
 `;

const Input = styled.input`
  background-color: white
  flex-grow: 1
`;
const Button = styled.input`
  flex-grow: 1
  width: 100px
`;
function mapStateToProps(state) {
  return {
    itemToEdit: state.editItemModal.itemToEdit,
    sections: state.sections,
    originalItemId: state.editItemModal.itemId
  };
}
const mapDispatchToProps = {
  addItem,
  addSection,
  updateEditItemModalItem,
  openEditItemModal,
  closeEditItemModal
};

class EditItemForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSectionChange = event => {
    var newItem = { ...this.props.itemToEdit };
    if (!event) {
      newItem.section = "";
      newItem.section_name = "";
      this.props.updateEditItemModalItem(newItem);
      return;
    }
    const { label } = event;
    const index = this.props.sections.findIndex(
      section => section.name === label
    );
    if (index > -1) {
      newItem.section = this.props.sections[index].id;
      newItem.section_name = this.props.sections[index].name;
    } else {
      newItem.section =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      newItem.section_name = event.label;
      this.props.addSection(newItem.section_name, newItem.section);
    }
    this.props.updateEditItemModalItem(newItem);
  };

  handleChange = event => {
    const { name, value, type } = event.target;
    var val = value;
    if (type === "number") {
      val = Number(value);
    }

    var newItem = { ...this.props.itemToEdit };

    newItem[name] = val;
    this.props.updateEditItemModalItem(newItem);
  };

  submitForm = () => {
    this.props.addItem(this.props.itemToEdit);
    this.props.closeEditItemModal();
  };

  clearForm = () => {
    this.props.openEditItemModal(this.props.originalItemId);
  };

  render() {
    const { name, amount, unit, section_name } = this.props.itemToEdit;
    const selectOptions = this.props.sections.map(function(section) {
      return { label: section.name, value: section.id };
    });
    return (
      <ColContainer>
        <Label HTMLfor="name">Name</Label>
        <Input
          placeholder="Name"
          type="text"
          id="name"
          name="name"
          key="input-name"
          value={name}
          onChange={this.handleChange}
        />
        <Label HTMLfor="section">Section</Label>
        <div style={{ width: "100%" }}>
          <CreatableSelect
            isClearable
            id="section"
            value={{ value: section_name, label: section_name }}
            onChange={this.handleSectionChange}
            options={selectOptions}
          />
        </div>
        <Label HTMLfor="section">Amount</Label>
        <RowContainer>
          <Input
            placeholder="Amount"
            type="number"
            name="amount"
            id="amount"
            key="input-amount"
            inputmode="numeric"
            step="1"
            value={amount ? amount : 0}
            onChange={this.handleChange}
          />

          <Input
            placeholder="Unit"
            type="text"
            name="unit"
            key="input-unit"
            value={unit}
            onChange={this.handleChange}
          />
        </RowContainer>
        <RowContainer>
          <Button type="button" value="+" onClick={this.submitForm} />
          <Button type="button" value="X" onClick={this.clearForm} />
        </RowContainer>
      </ColContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditItemForm);
