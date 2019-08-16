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

function Clipboarder(props) {
  const { addItem, items } = props;

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
    const text = items
      .map(item => {
        return item.amount === 0
          ? item.name
          : item.name + " " + item.amount + " " + item.unit;
      })
      .join("\n");
    return text;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clipboarder);
