import React from "react";
import Recipe from "./components/recipe";
import Grid from "@material-ui/core/Grid";
import Filter from "./components/filter";
export default function Recipes(props) {
  const recipes = [
    {
      id: "xxx",
      name: "Potatismos",
      description: "Jätte gott",
      labels: ["potatis", "mos", "smör"],
      images: [],
      votes: 0,
      categories: ["bröd", "gryta"],
      sequence: [
        {
          images: [""],
          description: "Vini vidi vichi.",
          items: [{ id: "a1", amount: "4", unit: "g" }]
        },
        {
          images: [""],
          description: "Vini vidi vichi.",
          items: [{ id: "a1", amount: "4", unit: "g" }]
        }
      ]
    },
    {
      id: "yyy",
      name: "Ärtor",
      description: "Jätte goda",
      labels: ["potatis", "mos", "smör"],
      images: [],
      votes: 10,
      categories: ["bröd", "vört"],
      sequence: [
        {
          images: [""],
          description: "Vini vidi vichi.",
          items: [{ id: "a1", amount: "4", unit: "g" }]
        },
        {
          images: [""],
          description: "Vini vidi vichi.",
          items: [{ id: "a1", amount: "4", unit: "g" }]
        }
      ]
    }
  ];

  return (
    <div>
      <Filter />
      <Grid container spacing={4} style={{ padding: 24 }}>
        {recipes.map(recipe => {
          return (
            <Grid key={recipe.id} item xs={12} sm={6} lg={4} xl={3}>
              <Recipe key={recipe.id} recipe={recipe} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
