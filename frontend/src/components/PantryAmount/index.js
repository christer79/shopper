import React from "react";
import { connect } from "react-redux";
import { updateAmount } from "../../actions/actions";

const mapDispatchToProps = { updateAmount };

function PantryAmount(props) {
  const { item } = props;
  const [amount, setamount] = React.useState(item.amount);

  const onAmountChange = event => {
    setamount(event.target.value);
    props.updateAmount(item.id, Number(event.target.value));
  };

  return (
    <div>
      <input
        name="amount"
        type="number"
        value={amount}
        onChange={onAmountChange}
        size="2"
      />
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(PantryAmount);
