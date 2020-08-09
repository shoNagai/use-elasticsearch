import * as React from "react";
import ListItem from "./ListItem";
import { User } from "../interfaces";
import useElasticsearch from "../../src/index";

type Props = {
  items: User[];
};

const List = ({ items }: Props) => {
  const state = useElasticsearch("topics", {
    query: { bool: { must: [{ match: { title: "あ" } }] } },
  });
  console.log(state);
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <ListItem data={item} />
        </li>
      ))}
    </ul>
  );
};

export default List;
