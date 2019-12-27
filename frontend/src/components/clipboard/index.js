import React from "react";
import Clipboard from "react-clipboard.js";
import { connect } from "react-redux";
import { addItem } from "../../actions/actions";
function mapStateToProps(state) {
  return {
    sections: state.sections,
    items: state.items
  };
}

const mapDispatchToProps = {
  addItem
};

const sortFunction = function(a, b) {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return +1;
  return 0;
};

function Clipboarder(props) {
  const { addItem } = props;

  React.useEffect(() => {
    document.addEventListener("paste", async event => {
      const text = await navigator.clipboard.readText();
      text.split("\n").forEach(line => {
        line !== "" ? addItem({ name: line }) : console.log("Empty line");
      });
    });
  });

  const pasteText = () => {
    navigator.clipboard.readText().then(text => {
      text.split("\n").forEach(line => {
        line !== "" ? addItem({ name: line }) : console.log("Empty line");
      });
    });
  };

  const generateText = () => {
    const sections_with_items = props.sections.filter(section => {
      return (
        props.items.filter(item => {
          return item.section === section.id;
        }).length !== 0
      );
    });
    return sections_with_items
      .sort(sortFunction)
      .map((section, index) => {
        var text = "";
        let items_in_section = props.items.filter(item => {
          return item.section === section.id;
        });
        if (items_in_section.length > 0) {
          text = text + section.name + "\n";
          text =
            text +
            items_in_section
              .map(item => {
                return item.amount === 1
                  ? " " + item.name
                  : " " + item.name + " " + item.amount + " " + item.unit;
              })
              .join("\n");
        }
        return text;
      })
      .join("\n");
  };

  return (
    <div>
      <Clipboard
        data-clipboard-text={generateText()}
        button-title="I'm a tooltip"
      >
        CP
      </Clipboard>
      <button onClick={pasteText}>P</button>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Clipboarder);
