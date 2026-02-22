import { faker } from '@faker-js/faker';
// import * as fs from 'fs';

// import path from 'path';

console.log(import.meta.filename);
console.log(import.meta.dirname);



export function getData(arraySize) {
  let numTags = 5;
  let maxTags = 20;
  let maxUsers = 5;
  let maxUniqueTags = 5;
  let maxUniqueUsers = 3;
  let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: maxTags });
  let allUserIds = faker.helpers.multiple(() => faker.string.uuid(), { count: maxUsers });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

  allTags = faker.helpers.uniqueArray(allTags, maxUniqueTags);
  allUserIds = faker.helpers.uniqueArray(allUserIds, maxUniqueUsers);

  let combFaked = faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(allUserIds),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(),
        note: faker.lorem.sentence(),
        tag: faker.helpers.uniqueArray(faker.helpers.multiple(
          () => (faker.helpers.arrayElement(allTags)),
          { count: faker.helpers.arrayElement([...Array(maxTags).keys()]) }
        ), maxTags),
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
  const url = "http://localhost:8080/listah.v1.ItemService/Upsert";
  for (let i = 0; i < maxLoaded; i++){
    try {
      const data = getData(maxGen);
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
}


loadData(100, 500)
