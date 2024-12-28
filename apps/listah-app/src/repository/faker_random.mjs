import { faker } from '@faker-js/faker';
import * as fs from 'fs';


export function getData(arraySize) {
    let numTags = 5;
    let maxProps = 10;
    let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: arraySize });
    allTags = faker.helpers.uniqueArray(allTags, arraySize);

    let faked = faker.helpers.multiple(
        () => (
            {
                userId: faker.string.uuid(),
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
            }),
        { count: arraySize }
    );

    fs.writeFile('./listah/apps/listah-app/src/repository/fake_data_w_props.json',
        JSON.stringify(faked),
        (err) => {
            // In case of a error throw err.
            if (err) throw err;
        }
    );
}

getData(500);
