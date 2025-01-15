import { faker } from '@faker-js/faker';
import * as fs from 'fs';

import path from 'path';

export function getAirline(numRecords, possibleTags){
	let faked = new Array(numRecords);
	let numTags = 5;
	let j = 0;

	for (let i = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let generatedObj = {
			id: faker.string.uuid(),
			"aircraft Type": faker.airline.aircraftType(),
			airline: faker.airline.airline().name,
			airport: faker.airline.airport().name,
			"flight Number": faker.airline.flightNumber(),
			"record Locator": faker.airline.recordLocator(),
			seat: faker.airline.seat(),
			tags: Array.from(possibleTags.slice(j, j+numTags)),
			category: 'Airline',
			summary: "",
		};
		faked[i] = {...generatedObj, summary: generatedObj['flight Number'] +
			' ' + generatedObj['record Locator']};
	}
	return faked
}

export function getBook(numRecords, possibleTags){
	let faked = new Array(numRecords);
	let numTags = 5;

	let j = 0;

	for (let i = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}

		let generatedObj = {
			id: faker.string.uuid(),
			author: faker.book.author(),
			format: faker.book.format(),
			genre: faker.book.genre(),
			publisher: faker.book.publisher(),
			series: faker.book.series(),
			title: faker.book.title(),
			tags: Array.from(possibleTags.slice(j, j+numTags)),
			category: 'Books',
			summary: ""
		};
		faked[i] = {...generatedObj, summary: generatedObj.title };
	}
	return faked
}

export function getCommerce(numRecords, possibleTags) {
	let faked = new Array(numRecords);
	let numTags = 5;
	let j = 0;

	for (let i = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let generatedObj = {
			id: faker.string.uuid(),
			department: faker.commerce.department(),
			isbn: faker.commerce.isbn(),
			price: faker.commerce.price(),
			product: faker.commerce.product(),
			adjective: faker.commerce.productAdjective(),
			description: faker.commerce.productDescription(),
			name: faker.commerce.productName(),
			tags: Array.from(possibleTags.slice(j, j+numTags)),
			summary: "",
			category: 'Commerce',
		};
		faked[i] = {...generatedObj, summary: generatedObj.name };
	}
	return faked;
}

export function getFinance(numRecords, possibleTags){
	let faked = new Array(numRecords);
	let numTags = 5;

	let j = 0;

	for (let i = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let generatedObj = {
			id: faker.string.uuid(),
			'account name': faker.finance.accountName(),
			'account number': faker.finance.accountNumber(),
			amount: faker.finance.amount(),
			bic: faker.finance.bic(),
			'credit Card CVV': faker.finance.creditCardCVV(),
			'credit Card Issuer': faker.finance.creditCardIssuer(),
			'credit Card Number': faker.finance.creditCardNumber(),
			'currency Code': faker.finance.currencyCode(),
			'currency Name': faker.finance.currencyName(),
			'currency Symbol': faker.finance.currencySymbol(),
			iban: faker.finance.iban(),
			pin: faker.finance.pin(),
			'routing Number': faker.finance.routingNumber(),
			'transaction Description': faker.finance.transactionDescription(),
			'transaction Type': faker.finance.transactionType(),
			tags: Array.from(possibleTags.slice(j, j+numTags)),
			category: 'Finance',
			summary: "",
		};
		faked[i] = {
			...generatedObj, summary: generatedObj['account number']  +
					' ' + generatedObj['currency Symbol'] +  generatedObj['amount']
			};
	}
	return faked
}

export function getData(arraySize) {
	let countTags = 100;
	let allTags = new Array(countTags);
	for (let i = 0; i < countTags; i++){
		allTags[i] = faker.word.noun();
	}

	// return {
	// 	data: getAirline(arraySize, allTags).concat(getBook(arraySize, allTags), getCommerce(arraySize, allTags), getFinance(arraySize, allTags)),
	// 	tags: allTags,
	// 	categories: ['Airline', 'Book', 'Commerce', 'Finance']
	// }

	return getBook(arraySize, allTags).concat(getCommerce(arraySize, allTags))
}


// Data which will write in a file.
let fake_data = getData(500);

// sort by name
let sorted_data = fake_data.sort((a, b) => {
	const nameA = a.summary.toUpperCase(); // ignore upper and lowercase
	const nameB = b.summary.toUpperCase(); // ignore upper and lowercase
	if (nameA < nameB) {
	  return -1;
	}
	if (nameA > nameB) {
	  return 1;
	}

	// names must be equal
	return 0;
});

// Write data in 'Output.txt' .
fs.writeFile(
  path.join(import.meta.dirname, 'fake_data_w_props.json'),
  JSON.stringify(sorted_data),
  (err) => {
    // In case of a error throw err.
    if (err) throw err;
});





console.log(import.meta.filename);
console.log(import.meta.dirname);
