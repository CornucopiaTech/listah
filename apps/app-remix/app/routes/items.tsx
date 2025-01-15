import type { Route } from "./+types/home";
import { ItemsPage } from "~/pages/items/itemsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Listah" },
    { name: "description", content: "Welcome to Listah App!" },
  ];
}

export default function Items() {
  return <ItemsPage />;
}
