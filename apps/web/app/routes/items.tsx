import type { Route } from "./+types/home";
import Items from "../pages/items/items";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Items | Listah" },
    { name: "description", content: "List of items" },
  ];
}

export default function ItemsPage() {
  return <Items />;
}
