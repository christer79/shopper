import React from "react";
import { connect } from "react-redux";
import { updateAmount } from "../../actions/actions";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const mapDispatchToProps = { updateAmount };

function PantryAmount(props) {
  const { item, classes } = props;
  const [amount, setamount] = React.useState(item.amount);

  const onAmountChange = event => {
    setamount(Number(event.target.value));
    props.updateAmount(item.id, Number(event.target.value));
  };

  const toggleAmount = () => {
    setamount(item.goal === amount ? 0 : Number(item.goal));
    props.updateAmount(item.id, Number(item.goal === amount ? 0 : item.goal));
  };

  const createOptions = () => {
    var options = [item.amount];
    for (let i = 0; i <= item.goal; i++) {
      options.push(i);
    }
    return [...new Set(options)];
  };

  const opts = createOptions();
  return (
    <div>
      {item.goal !== 1 ? (
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
            return (
              <option key={index} value={opt}>
                {opt}
              </option>
            );
          })}
        </Select>
      ) : (
        <Checkbox
          className={classes.checkbox}
          edge="start"
          checked={item.amount === item.goal}
          tabIndex={-1}
          disableRipple
          onChange={() => toggleAmount(item.id)}
        />
      )}
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(PantryAmount);
