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

class Clipboarder extends React.Component {
  constructor(props) {
    super(props);
    this.pasteText = this.pasteText.bind(this);
  }

  componentDidMount() {
    document.addEventListener("paste", async event => {
      const text = await navigator.clipboard.readText();
      text.split("\n").forEach(line => {
        line !== ""
          ? this.props.addItem({ item: line })
          : console.log("Empty line");
      });
    });
  }
  pasteText() {
    navigator.clipboard.readText().then(text => {
      text.split("\n").forEach(line => {
        line !== ""
          ? this.props.addItem({ item: line })
          : console.log("Empty line");
      });
    });
  }
  generateText() {
    const text = this.props.items
      .map(item => {
        return item.amount === 0
          ? item.item
          : item.item + " " + item.amount + " " + item.unit;
      })
      .join("\n");
    return text;
  }
  render() {
    return (
      <div>
        <Clipboard
          data-clipboard-text={this.generateText()}
          button-title="I'm a tooltip"
        >
          CP
        </Clipboard>
        <button onClick={this.pasteText}>P</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clipboarder);
