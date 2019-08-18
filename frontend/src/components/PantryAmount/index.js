import React from "react";
import { connect } from "react-redux";
import { updateAmount } from "../../actions/actions";
import Select from "@material-ui/core/Select";

const mapDispatchToProps = { updateAmount };

function PantryAmount(props) {
  const { item } = props;
  const [amount, setamount] = React.useState(item.amount);

  const onAmountChange = event => {
    setamount(Number(event.target.value));
    props.updateAmount(item.id, Number(event.target.value));
  };

  const createOptions = () => {
    var options = [item.amount];
    for (let i = 0; i <= item.goal; i++) {
      console.log("index", i);
      options.push(i);
    }
    console.log(options);
    return [...new Set(options)];
  };

  const opts = createOptions();

  return (
    <div>
      <Select
        native
        value={amount}
        onChange={onAmountChange}
        inputProps={{
          name: "age",
          id: "age-native-simple"
        }}
      >
        {opts.map((index, opt) => {
          return <option value={opt}>{opt}</option>;
        })}
      </Select>
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(PantryAmount);
