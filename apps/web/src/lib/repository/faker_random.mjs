import { faker } from '@faker-js/faker';
import * as fs from 'fs';

import path from 'path';

console.log(import.meta.filename);
console.log(import.meta.dirname);


export function getData(arraySize) {
  let numTags = 5;
  let maxTags = 200;
  let maxUsers = 200;
  let maxCategories = 200;
  let maxUniqueTags = 100;
  let maxUniqueProps = 10;
  let maxUniqueUsers = 50;
  let maxUniqueCategories = 20;
  let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: maxTags });
  let allCategory = faker.helpers.multiple(() => faker.word.noun(), { count: maxCategories });
  let allUserIds = faker.helpers.multiple(() => faker.string.uuid(), { count: maxUsers });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

  allTags = faker.helpers.uniqueArray(allTags, maxUniqueTags);
  allCategory = faker.helpers.uniqueArray(allCategory, maxUniqueCategories);
  allUserIds = faker.helpers.uniqueArray(allUserIds, maxUniqueUsers);

  let combFaked = faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(allUserIds),
        category: faker.helpers.arrayElement(allCategory),
        // title: faker.lorem.sentence(),
        summary: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        note: faker.lorem.sentence(),
        // tag: faker.helpers.arrayElements(allTags, numTags),
        tag: faker.helpers.multiple(
          () => (faker.helpers.arrayElement(allCategory)),
          { count: faker.helpers.arrayElement([...Array(numTags).keys()]) }
        ),
        properties: Object.fromEntries(
          faker.helpers.multiple(
            () => ([faker.word.sample(), faker.word.sample()]),
            { count: faker.helpers.arrayElement([...Array(maxUniqueProps).keys()]) }
          )
        ),
        reactivateAt: faker.helpers.arrayElement([faker.date.future(), null]),
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
  let stringFaked = JSON.stringify({items: combFaked});

  // let filepath = path.join(import.meta.dirname, `fake_data_w_props_${Date.now()}.json`);
  // console.info("Writing to", filepath);
  // fs.writeFile(filepath, stringFaked, (err) => {if (err) throw err;});

  return stringFaked;
}


async function loadData(maxLoaded, maxGen) {
  const url = "http://localhost:8080/listah.v1.ItemService/Create";
  for (let i = 0; i < maxLoaded; i++)
  try {
    const data = getData(maxGen);
    // console.info("Data: ");
    // console.info(data)
    const req = new Request(url, {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
    });
    const res = await fetch(req);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const result = await res.json();
    console.log(`Api result length: ${result.itemIds.length}`);
  } catch (error) {
    console.log(`Api error: ${error.message}`);
  }
}


loadData(50, 2000)
