import React from "react";
import { connect } from "react-redux";
import { addItem, addSection } from "./actions/actions";
import CreatableSelect from "react-select/lib/Creatable";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    flex: 1
  }
}));

function AddItemForm(props) {
  const classes = useStyles();

  const [name, setName] = React.useState(null);

  const handleItemChange = event => {
    const pressedClear = !event;
    if (pressedClear) {
      return;
    }

    if (event.__isNew__) {
      props.addItem({
        name: event.label,
        unit: "st",
        section: "section-0",
        amount: 0.0,
        goal: 1
      });
    } else {
      // find correct item in itemSuggestions
      const suggested = props.itemSuggestions.find(
        suggestion => suggestion.name === event.label
      );

      // find in sections
      var section_id;
      const section = props.sections.find(
        section => section.name === suggested.section
      );
      //   if not create section
      if (!section) {
        section_id =
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9);
        props.addSection(suggested.section, section_id);
      } else {
        section_id = section.id;
      }
      // add item with section and unit
      props.addItem({
        name: event.label,
        unit: suggested.unit,
        section: section_id,
        amount: 0.0
      });
    }
    setName(null);
  };

  const itemOptions = props.itemSuggestions.map(function(item) {
    return { label: item.name, value: item.section };
  });

  return (
    <CreatableSelect
      placeholder="Add new item..."
      isClearable
      id="item"
      value={name}
      onChange={handleItemChange}
      options={itemOptions}
      className={classes.inputInput}
    />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemForm);
