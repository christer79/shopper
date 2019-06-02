import React, { Component } from "react";
import { connect } from "react-redux";
import { addItem, addSection } from "./actions/actions";
import CreatableSelect from "react-select/lib/Creatable";

const mapDispatchToProps = {
  addItem,
  addSection
};

function mapStateToProps(state) {
  return {
    itemSuggestions: state.itemSuggestions,
    sections: state.sections
  };
}

class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: null };
  }
  handleItemChange = event => {
    const pressedClear = !event;
    if (pressedClear) {
      return;
    }

    if (event.__isNew__) {
      this.props.addItem({
        name: event.label,
        unit: "st",
        section: "section-0",
        amount: 0.0
      });
    } else {
      // find correct item in itemSuggestions
      const suggested = this.props.itemSuggestions.find(
        suggestion => suggestion.name === event.label
      );

      // find in sections
      var section_id;
      const section = this.props.sections.find(
        section => section.name === suggested.section
      );
      //   if not create section
      if (!section) {
        section_id =
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9);
        this.props.addSection(suggested.section, section_id);
      } else {
        section_id = section.id;
      }
      // add item with section and unit
      this.props.addItem({
        name: event.label,
        unit: suggested.unit,
        section: section_id,
        amount: 0.0
      });
    }
    this.setState({ name: null });
  };

  render() {
    const itemOptions = this.props.itemSuggestions.map(function(item) {
      return { label: item.name, value: item.section };
    });

    return (
      <div style={{ width: "100%" }}>
        <CreatableSelect
          isClearable
          id="item"
          value={this.state.item}
          onChange={this.handleItemChange}
          options={itemOptions}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItemForm);
