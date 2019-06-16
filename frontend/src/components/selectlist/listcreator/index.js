import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_LIST = gql`
  mutation CreateList($id: ID!, $name: String!, $listtype: String!) {
    createList(input: { id: $id, name: $name, listtype: $listtype}) {
      name
      id
    }
  }
`;

function ListCreator() {
  const [form, setValues] = React.useState({
    name: ""
  });

  const updateField = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <Mutation mutation={CREATE_LIST}>
        {(createList, { ...data }) => (
          <form
            onSubmit={e => {
              e.preventDefault();
              createList({
                variables: {
                  id:
                    "_" +
                    Math.random()
                      .toString(36)
                      .substr(2, 9),
                  name: form.name,
                  listtype: "shopping"
                }
              });
              setValues({ name: "" });
            }}
            noValidate
            autoComplete="off"
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={updateField}
            />
            <input type="submit" name="Add" />
          </form>
        )}
      </Mutation>
    </div>
  );
}

export default ListCreator;
