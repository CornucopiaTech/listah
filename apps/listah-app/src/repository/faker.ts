import { faker } from '@faker-js/faker';

interface Airline {
	id: string;
	"aircraft Type": string;
	airline: string;
	airport: string;
	"flight Number": string;
	"record Locator": string;
	seat: string;
	summary: string;
	category: string;
	tags: Array<string>;
}

interface Book {
	id: string;
	author: string;
	format: string;
	genre: string;
	publisher: string;
	series: string;
	title: string;
	summary: string;
	category: string;
	tags: Array<string>;
}

interface Commerce {
	id: string;
	department: string;
	isbn: string;
	price: string;
	product: string;
	adjective: string;
	description: string;
	name: string;
	summary: string;
	category: string;
	tags: Array<string>;
}

interface Finance {
	id: string;
	'account name': string;
	'account number': string;
	amount: string;
	bic: string;
	'credit Card CVV': string;
	'credit Card Issuer': string;
	'credit Card Number': string;
	'currency Code': string;
	'currency Name': string;
	'currency Symbol': string;
	iban: string;
	pin: string;
	'routing Number': string;
	'transaction Description': string;
	'transaction Type': string;
	summary: string;
	category: string;
	tags: Array<string>;
}

interface Categories {
	airline: Array<string>;
	book: Array<string>;
	commerce: Array<string>;
	finance: Array<string>;

}

interface FakeData {
	data: Array<Airline> | Array<Book> | Array<Commerce> | Array<Finance>;
	tags: Array<string>;
	categories: Array<string>;
}



export function getAirline(numRecords: number, possibleTags: Array<string>):  Array<Airline> {
	let faked: Array<Airline> = new Array(numRecords);
	let numTags: number = Math.ceil(possibleTags.length / 5);
	let j = 0;

	for (let i: number = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let currentTags = possibleTags.slice(j, numTags);

		let generatedObj: Airline = {
			id: faker.string.uuid(),
			"aircraft Type": faker.airline.aircraftType(),
			airline: faker.airline.airline().name,
			airport: faker.airline.airport().name,
			"flight Number": faker.airline.flightNumber(),
			"record Locator": faker.airline.recordLocator(),
			seat: faker.airline.seat(),
			tags: currentTags,
			category: 'Airline',
			summary: "",
		};
		faked[i] = {...generatedObj, summary: generatedObj['flight Number'] +
			' ' + generatedObj['record Locator']};
	}
	return faked
}

export function getBook(numRecords: number, possibleTags: Array<string>): Array<Book> {
	let faked: Array<Book> = new Array(numRecords);
	let numTags: number = Math.ceil(possibleTags.length / 5);

	let j = 0;

	for (let i: number = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let currentTags = possibleTags.slice(j, numTags);

		let generatedObj: Book = {
			id: faker.string.uuid(),
			author: faker.book.author(),
			format: faker.book.format(),
			genre: faker.book.genre(),
			publisher: faker.book.publisher(),
			series: faker.book.series(),
			title: faker.book.title(),
			tags: currentTags,
			category: 'Books',
			summary: ""
		};
		faked[i] = {...generatedObj, summary: generatedObj.title };
	}

	// console.log(faked[0]);
	return faked
}

export function getCommerce(numRecords: number, possibleTags: Array<string>): Array<Commerce> {
	let faked: Array<Commerce> = new Array(numRecords);
	let numTags: number = Math.ceil(possibleTags.length / 5);
	let j = 0;

	for (let i: number = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let currentTags = possibleTags.slice(j, numTags);

		let generatedObj: Commerce = {
			id: faker.string.uuid(),
			department: faker.commerce.department(),
			isbn: faker.commerce.isbn(),
			price: faker.commerce.price(),
			product: faker.commerce.product(),
			adjective: faker.commerce.productAdjective(),
			description: faker.commerce.productDescription(),
			name: faker.commerce.productName(),
			tags: currentTags,
			summary: "",
			category: 'Commerce',
		};
		faked[i] = {...generatedObj, summary: generatedObj.name };
	}
	return faked;
}

export function getFinance(numRecords: number, possibleTags: Array<string>): Array<Finance>{
	let faked: Array<Finance> = new Array(numRecords);
	let numTags: number = Math.ceil(possibleTags.length / 5);

	let j = 0;

	for (let i: number = 0; i < numRecords; i++){
		if (++j >= possibleTags.length - numTags ){
			j = 0;
		}
		let currentTags = possibleTags.slice(j, numTags);

		let generatedObj: Finance = {
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
			tags: currentTags,
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

export function getData(arraySize: number): FakeData {
	let allTags: Array<string> = new Array(Math.ceil(arraySize / 2));
	for (let i:number = 0; i < allTags.length; i++){
		allTags[i] = faker.word.noun();
	}

	return {
		data: getBook(arraySize, allTags),
		tags: allTags,
		categories: ['Airline', 'Book', 'Commerce', 'Finance']
	}

	// return {
	// 	data: getAirline(arraySize, allTags).concat(getBook(arraySize, allTags), getCommerce(arraySize, allTags), getFinance(arraySize, allTags)),
	// 	tags: allTags,
	// }
}


// console.log(getCommerce(3))


// Requiring fs module in which
// writeFile function is defined.
import * as fs from 'fs';

// Data which will write in a file.
let data = getData(500)

// Write data in 'Output.txt' .
fs.writeFile('./fake_data.json', JSON.stringify(data), (err) => {

    // In case of a error throw err.
    if (err) throw err;
})
