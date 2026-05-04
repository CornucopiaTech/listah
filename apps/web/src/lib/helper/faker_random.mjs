import { faker } from '@faker-js/faker';
// import * as fs from 'fs';

// import path from 'path';

console.log(import.meta.filename);
console.log(import.meta.dirname);



export function getItems(arraySize) {
  let maxTags = 10;
  let maxUsers = 10;
  const maxItemTags = 5;
  const maxItemProps = 5;
  const maxItemTagElems = [...Array(maxItemTags).keys()].filter(i => i > 0);

  let allTags = faker.helpers.multiple(() => faker.word.noun(), { count: maxTags });
  let allUserIds = faker.helpers.multiple(() => faker.string.uuid(), { count: maxUsers });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];


  allTags = faker.helpers.uniqueArray(allTags, maxTags);
  allUserIds = faker.helpers.uniqueArray(allUserIds, maxUsers);
  allUserIds = ["user_2w6Aa0oNT0bhplyZZarP03PD4MJ", ...allUserIds];

  // allTags = ["veto", "pile", "giggle", "trick", "ad", "knuckle",]
  // allUserIds = ["9323c0fd-adee-4d04-b81d-e61082b8d9bf"]

  let combFaked = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(allUserIds),
      name: faker.lorem.sentence(),
      // description: faker.lorem.paragraphs(),
      note: faker.lorem.sentence(),
      tags: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allTags)),
        {
          // count: faker.helpers.arrayElement([...Array(maxItemTags).keys()])
          count: { min: 1, max: faker.helpers.arrayElement(maxItemTagElems) }
        }
      ), maxItemTags),
      // reactivateAt: faker.helpers.arrayElement([faker.date.future(), null]),
      props: Object.fromEntries(
        faker.helpers.multiple(
          () => ([faker.word.sample(), faker.word.sample()]),
          { count: faker.helpers.arrayElement([...Array(maxItemProps).keys()]) }
        )
      ),
      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
      // audit: {
      //   "created_by": faker.helpers.arrayElement(updaters),
      //   "created_at": faker.date.past(),
      //   "updated_by": faker.helpers.arrayElement(updaters),
      //   "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
      //   "deleted_by": faker.helpers.arrayElement(updaters),
      //   "deleted_at": faker.helpers.arrayElement([faker.date.past(), null]),
      // }
    }),
    { count: arraySize }
  );
  let stringFaked = JSON.stringify({ items: combFaked });

  // let filepath = path.join(import.meta.dirname, `fake_data_w_props_${Date.now()}.json`);
  // console.info("Writing to", filepath);
  // fs.writeFile(filepath, stringFaked, (err) => {if (err) throw err;});

  return stringFaked;
}
async function loadItems(maxLoaded, maxGen, apiUrl) {
  const url = `${apiUrl}/UpsertItem`;
  for (let i = 0; i < maxLoaded; i++) {
    try {
      const data = getItems(maxGen);
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
      console.log(`Api error: ${error.message} \t`, error);
    }
  }
}


export async function getFilters(arraySize, apiUrl) {
  const url = `${apiUrl}/ReadTag`;
  try {
    const userId = "user_2w6Aa0oNT0bhplyZZarP03PD4MJ";
    const uId = JSON.stringify({ userId: userId });
    const req = new Request(url, {
      method: "POST",
      body: uId,
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
    });
    const res = await fetch(req);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const result = await res.json();
    const maxFilterTag = 5;
    const allTags = await result.tags.map((item) => item.name);
    const maxFilterTagElems = [...Array(allTags.length).keys()].filter(i => i > 0);
    let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

    // console.log("result", result.tags[0]);
    // console.log("allTags", allTags);
    let combFaked = await faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        userId: userId,
        name: faker.lorem.sentence(),
        tags: faker.helpers.uniqueArray(faker.helpers.multiple(
          () => (faker.helpers.arrayElement(allTags)),
          {
            count: { min: 1, max: faker.helpers.arrayElement(maxFilterTagElems) }
          }
        ), maxFilterTag),

        "updated_by": faker.helpers.arrayElement(updaters),
        "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
      }),
      { count: arraySize }
    );
    // console.log("combFaked", combFaked);
    return await JSON.stringify({ filters: combFaked });
  } catch (error) {
    console.log(`Api error: ${error.message} \t`, error);
  }


}
async function loadFilters(maxLoaded, apiUrl) {
  const url = `${apiUrl}/UpsertFilter`;
  try {
    const data = await getFilters(maxLoaded, apiUrl);
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
    console.log(`Api result length: ${result.filterIds.length}`);
  } catch (error) {
    console.log(`Api error: ${error.message} \t`, error);
  }
}

// const url = "http://localhost:8081/listah.v1.ItemService";
// const url = "http://localhost:8080/listah.v1.ItemService";
// loadItems(10, 3000, url);
// loadItems(1, 50, url);
// loadFilters(100, url);

const urls = [
  "http://localhost:8080/listah.v1.ItemService",
  "http://localhost:8081/listah.v1.ItemService",
]
// urls.forEach(url => loadItems(1, 50, url));
// urls.forEach(url => loadItems(10, 3000, url));
urls.forEach(url => loadFilters(100, url));
