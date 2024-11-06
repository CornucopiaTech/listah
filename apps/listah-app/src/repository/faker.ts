import { faker } from '@faker-js/faker';


export function getCommerce(arraySize: number) {
	let fakeCommerce = [];
	for (let i: number = 0; i < arraySize; i++){
		fakeCommerce.push({
			deparment: faker.commerce.department(),
			isbn: faker.commerce.isbn(),
			price: faker.commerce.price(),
			product: faker.commerce.product(),
			adjective: faker.commerce.productAdjective(),
			description: faker.commerce.productDescription(),
			name: faker.commerce.productName(),
			summary: faker.commerce.productName(),
		});
	}
	return fakeCommerce
}


// console.log(getCommerce(3))
