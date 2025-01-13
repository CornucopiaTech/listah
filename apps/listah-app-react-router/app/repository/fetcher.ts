
// import MyData from './fake_data.json';
import MyData from './fake_data_w_props.json';

import { type ItemRequestModel, type ItemResponseModel } from "../model/item"


export function getData(dataCategory: Array<string>, dataUser: string){
	return MyData;
}
