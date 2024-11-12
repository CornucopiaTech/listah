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
}



export function getAirline(numRecords: number, possibleTags: Array<string>):  Array<Airline> {
	let faked: Array<Airline> = new Array(numRecords);
	let currentTags: Array<string> = new Array(Math.ceil(possibleTags.length / 5));
	for (let i: number = 0; i < numRecords; i++){
		let generatedObj: Airline = {
			id: faker.string.uuid(),
			"aircraft Type": faker.airline.aircraftType(),
			airline: faker.airline.airline().name,
			airport: faker.airline.airport().name,
			"flight Number": faker.airline.flightNumber(),
			"record Locator": faker.airline.recordLocator(),
			seat: faker.airline.seat(),
			tags: currentTags.map(() => (possibleTags[Math.floor(possibleTags.length * Math.random())])),
			summary: "",
		};
		faked[i] = {...generatedObj, summary: generatedObj['flight Number'] +
			' ' + generatedObj['record Locator']};
	}
	return faked
}

export function getBook(numRecords: number, possibleTags: Array<string>): Array<Book> {
	let faked: Array<Book> = new Array(numRecords);
	let currentTags: Array<string> = new Array(Math.ceil(possibleTags.length / 5));

	for (let i: number = 0; i < numRecords; i++){
		let generatedObj: Book = {
			id: faker.string.uuid(),
			author: faker.book.author(),
			format: faker.book.format(),
			genre: faker.book.genre(),
			publisher: faker.book.publisher(),
			series: faker.book.series(),
			title: faker.book.title(),
			tags: currentTags.map(() => (possibleTags[Math.floor(possibleTags.length * Math.random())])),
			summary: ""
		};
		faked[i] = {...generatedObj, summary: generatedObj.title };
	}
	return faked
}

export function getCommerce(numRecords: number, possibleTags: Array<string>): Array<Commerce> {
	let faked: Array<Commerce> = new Array(numRecords);
	let currentTags: Array<string> = new Array(Math.ceil(possibleTags.length / 5));
	for (let i: number = 0; i < numRecords; i++){
		let generatedObj: Commerce = {
			id: faker.string.uuid(),
			department: faker.commerce.department(),
			isbn: faker.commerce.isbn(),
			price: faker.commerce.price(),
			product: faker.commerce.product(),
			adjective: faker.commerce.productAdjective(),
			description: faker.commerce.productDescription(),
			name: faker.commerce.productName(),
			tags: currentTags.map(() => (possibleTags[Math.floor(possibleTags.length * Math.random())])),
			summary: "",
		};
		faked[i] = {...generatedObj, summary: generatedObj.name };
	}
	return faked;
}

export function getFinance(numRecords: number, possibleTags: Array<string>): Array<Finance>{
	let faked: Array<Finance> = new Array(numRecords);
	let currentTags: Array<string> = new Array(Math.ceil(possibleTags.length / 5));
	for (let i: number = 0; i < numRecords; i++){
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
			tags: currentTags.map(() => (possibleTags[Math.floor(possibleTags.length * Math.random())])),
			summary: "",
		};
		faked[i] = {
			...generatedObj, summary: generatedObj['account number']  +
					' ' + generatedObj['currency Symbol'] +  generatedObj['amount']
			};
	}
	return faked
}

export function prevGetData(arraySize: number, possibleTags: Array<string>): [] {
	let fakedCommerce: Array<Commerce> = getCommerce(arraySize);
	let commerceCategories: Array<string> = fakedCommerce.map((item: Commerce) => (item.department));
	let setCommerceCategories: Set<string> = new Set(commerceCategories);
	commerceCategories = Array.from(setCommerceCategories.values())

	let fakedAirline: Array<Airline> = getAirline(arraySize);
	let airlineCategories: Array<string> = fakedAirline.map((item: Airline) => (item.department));
	let setAirlineCategories: Set<string> = new Set(airlineCategories);
	airlineCategories = Array.from(setAirlineCategories.values())


	return {
		data: fakedCommerce.concat(fakedAirline),
		categories:{
			commerce: commerceCategories,

	}}.concat(
		getAirline(arraySize),
		getFinance(arraySize),
		getBook(arraySize),
	)
}

export function getData(arraySize: number): FakeData {
	let allTags: Array<string> = new Array(Math.ceil(arraySize / 2));
	for (let i:number = 0; i < allTags.length; i++){
		allTags[i] = faker.word.noun();
	}

	return {
		data: getAirline(arraySize, allTags).concat(getBook(arraySize, allTags), getCommerce(arraySize, allTags), getFinance(arraySize, allTags)),
		tags: allTags,
	}
}


// console.log(getCommerce(3))
