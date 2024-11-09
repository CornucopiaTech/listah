import { faker } from '@faker-js/faker';


export function getCommerce(arraySize: number) {
	let fakeCommerce = [];
	for (let i: number = 0; i < arraySize; i++){
		let generatedObj = {
			id: faker.string.uuid(),
			deparment: faker.commerce.department(),
			isbn: faker.commerce.isbn(),
			price: faker.commerce.price(),
			product: faker.commerce.product(),
			adjective: faker.commerce.productAdjective(),
			description: faker.commerce.productDescription(),
			name: faker.commerce.productName(),
		};
		fakeCommerce.push({...generatedObj, summary: generatedObj.name });
	}
	return fakeCommerce
}


// console.log(getCommerce(3))
