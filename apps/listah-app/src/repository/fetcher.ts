
import MyData from '@/repository/fake_data.json';

import { ItemRequestModel, ItemResponseModel } from "@/model/item"


export function getData(dataCategory: Array<string>, dataUser: string){
	return MyData;
}

// export const dynamic = 'force-static'

export async function get_items(user_filters: string[],
								tag_filters: string[],
								category_filters: string[]): Promise<ItemResponseModel[] | void>{
	try {
		const response = await fetch(process.env.API_READ_FILTER_SERVICE, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tag_filters: tag_filters,
				category_filters: category_filters,
				user_filters: ["19bb7023-2293-41d6-9170-1e261a1bde92"] // user_filters,
			}),
		});
		const data = await response.json()
		return data.items
	} catch (error) {
		console.log(error);
		// return new (Promise<ItemResponseModel[]>);

	}



}
