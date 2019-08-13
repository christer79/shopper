import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const LISTS = gql`
  {
    lists {
      id
      name
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($id: ID!, $name: String!, $listtype: String!) {
    createList(input: { id: $id, name: $name, listtype: $listtype }) {
      name
      id
    }
  }
`;

function ListCreator() {
  const [form, setValues] = React.useState({
    name: "",
    listtype: "shopping"
  });

  const updateField = e => {
    console.log("Updating field: ", e.target.name, " with: ", e.target.value);
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
                  listtype: form.listtype
                },
                refetchQueries: [
                  {
                    query: LISTS
                  }
                ]
              });
              setValues({ name: "" });
            }}
            noValidate
            autoComplete="off"
            id="createlist"
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={updateField}
            />
            <select name="listtype" form="createlist" onChange={updateField}>
              <option value="shopping">shopping</option>
              <option value="pantry">pantry</option>
            </select>
            <input type="submit" name="Add" />
          </form>
        )}
      </Mutation>
    </div>
  );
}

export default ListCreator;
