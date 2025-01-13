import { faker } from '@faker-js/faker';
import * as fs from 'fs';


export function getData(arraySize) {
    let numTags = 5;
    let maxProps = 10;
    let maxUsers = 50;
    let maxCategories = 50;
    let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: arraySize });
    let allCategory = faker.helpers.multiple(() => faker.word.noun(), { count: arraySize });
	let userIds = faker.helpers.multiple(() => faker.string.uuid(), { count: maxCategories });

    allTags = faker.helpers.uniqueArray(allTags, arraySize);
	allCategory = faker.helpers.uniqueArray(allCategory, arraySize);

    let faked = faker.helpers.multiple(
        () => (
            {
				id: faker.string.uuid(),
				userId: faker.helpers.arrayElement(userIds),
				category: faker.helpers.arrayElement(allCategory),
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraphs(),
                note: faker.lorem.sentence(),
                tags: faker.helpers.arrayElements(allTags, numTags),
                properties: Object.fromEntries(
                    faker.helpers.multiple(
                        () => ([faker.word.sample(), faker.word.sample()]),
                        { count: faker.helpers.arrayElement([...Array(maxProps).keys()]) }
                    )
                ),
                reactivate_at: faker.helpers.arrayElement([faker.date.future(), null]),
                audit: {

                    "created_by": faker.helpers.arrayElement(["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"]),
                    "created_at": faker.date.past(),
                    "updated_by": faker.helpers.arrayElement(["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"]),
                    "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
                    "deleted_by": faker.helpers.arrayElement(["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"]),
                    "deleted_at": faker.helpers.arrayElement([faker.date.past(), null]),

                }
            }),
        { count: arraySize }
    );

	fs.writeFile('./listah/apps/listah-app-react-router/app/repository/fake_data_w_props.json',
        JSON.stringify(faked),
        (err) => {
            // In case of a error throw err.
            if (err) throw err;
        }
    );
}

getData(1000);
