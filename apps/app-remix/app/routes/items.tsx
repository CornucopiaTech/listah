import type { Route } from "../+types/home";
import { ItemsPage } from "~/pages/items/itemsPage";
import { useLoaderData } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';
import {
  ChooseSelectedItem,
  selectItem,
} from '~/hooks/state/itemSlice';
import { getItems } from '~/repository/fetcher';
import type { ItemStateInterface } from '~/model/items';



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Listah" },
    { name: "description", content: "Welcome to Listah App!" },
  ];
}

export default function Items() {
  return <ItemsPage />;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}
