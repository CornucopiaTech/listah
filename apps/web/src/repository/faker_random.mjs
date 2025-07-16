import { faker } from '@faker-js/faker';
import * as fs from 'fs';

import path from 'path';

export function getData(arraySize) {
  let numTags = 5;
  let maxTags = 50;
  let maxUsers = 20;
  let maxCategories = 20;
  let maxUniqueTags = 50;
  let maxUniqueProps = 50;
  let maxUniqueUsers = 50;
  let maxUniqueCategories = 10;
  let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: maxTags });
  let allCategory = faker.helpers.multiple(() => faker.word.noun(), { count: maxCategories });
  let allUserIds = faker.helpers.multiple(() => faker.string.uuid(), { count: maxUsers });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

  allTags = faker.helpers.uniqueArray(allTags, maxUniqueTags);
  allCategory = faker.helpers.uniqueArray(allCategory, maxUniqueCategories);
  allUserIds = faker.helpers.uniqueArray(allUserIds, maxUniqueUsers);

  let combFaked = []
  for (var i = 0; i < Math.ceil(arraySize, 100000); i++) {
    let subFaked = faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(allUserIds),
        category: faker.helpers.arrayElement(allCategory),
        title: faker.lorem.sentence(),
        summary: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        note: faker.lorem.sentence(),
        tags: faker.helpers.arrayElements(allTags, numTags),
        properties: Object.fromEntries(
          faker.helpers.multiple(
            () => ([faker.word.sample(), faker.word.sample()]),
            { count: faker.helpers.arrayElement([...Array(maxUniqueProps).keys()]) }
          )
        ),
        reactivate_at: faker.helpers.arrayElement([faker.date.future(), null]),
        audit: {
          "created_by": faker.helpers.arrayElement(updaters),
          "created_at": faker.date.past(),
          "updated_by": faker.helpers.arrayElement(updaters),
          "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
          "deleted_by": faker.helpers.arrayElement(updaters),
          "deleted_at": faker.helpers.arrayElement([faker.date.past(), null]),
        }
      }),
      { count: arraySize }
    );
    combFaked = combFaked.concat(subFaked);
  }


  fs.writeFile(
    path.join(import.meta.dirname, 'fake_data_w_props.json'),
    JSON.stringify(combFaked),
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
  });
};


getData(10000);




console.log(import.meta.filename);
console.log(import.meta.dirname);
