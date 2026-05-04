import { faker } from '@faker-js/faker';
// import * as fs from 'fs';

// import path from 'path';

console.log(import.meta.filename);
console.log(import.meta.dirname);


const maxUsers = 10;
const possibleUserIds = faker.helpers.multiple(() => faker.string.uuid(), { count: 2 * maxUsers });
const updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];
const allUserIds = [
  "user_2w6Aa0oNT0bhplyZZarP03PD4MJ",
  ...faker.helpers.uniqueArray(possibleUserIds, maxUsers)
];



function apiCall(url, payload) {
  const py = JSON.stringify(payload);
  const req = new Request(url, {
    method: "POST",
    body: py,
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = fetch(req);
  if (!res.ok) {
    throw new Error(`Network response was not ok: ${res.statusText}`);
  }
  return res.json();
}

export function fakeTags(arraySize) {
  let maxProps = 10;
  const maxTagProps = 5;
  const possiblePropIndex = [...Array(maxTagProps).keys()].filter(i => i > 0);

  let allProps = faker.helpers.multiple(() => faker.word.noun(), { count: 2 * maxProps });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

  allProps = faker.helpers.uniqueArray(allProps, maxProps);

  let combFaked = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(allUserIds),
      name: faker.lorem.sentence(),
      props: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allProps)),
        {
          count: { min: 1, max: faker.helpers.arrayElement(possiblePropIndex) }
        }
      ), maxTagProps),

      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
    }),
    { count: arraySize }
  );
  return JSON.stringify({ tags: combFaked });
}

async function loadTags(maxLoaded, maxGen, apiUrl) {
  const url = `${apiUrl}/UpsertTag`;
  for (let i = 0; i < maxLoaded; i++) {
    const data = fakeTags(maxGen);
    const req = new Request(url, {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
    });
    const res = await fetch(req);
    if (!res.ok) {
      throw new Error(`Tag Upsert - Network response was not ok: ${res.statusText}`);
    }

    const result = await res.json();
    console.log(`Tag Upsert - Api result length: ${result.tagIds.length}`);

  }
}

async function fakeFilters(arraySize, tagList) {
  const maxFilterTag = 5;
  const allTags = tagList.map(i => i.name);
  const possibleTagIndex = [...Array(allTags.length).keys()].filter(i => i > 0);
  let combFaked = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(allUserIds),
      name: faker.lorem.sentence(),
      tags: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allTags)),
        {
          count: { min: 1, max: faker.helpers.arrayElement(possibleTagIndex) }
        }
      ), maxFilterTag),

      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
    }),
    { count: arraySize }
  );
  return JSON.stringify({ filters: combFaked });
}

async function loadFilters(maxLoaded, apiUrl, tags) {
  const url = `${apiUrl}/UpsertFilter`;
  const data = await fakeFilters(maxLoaded, tags);
  const req = new Request(url, {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error(`Filter Upsert - Network response was not ok: ${res.statusText}`);
  }

  const result = await res.json();
  console.log(`Filter Upsert - Api result length: ${result.filterIds.length}`);
}


async function fakeItems(arraySize, tagList) {
  const maxItemTags = 5;
  const maxItemProps = 5;
  const possibleTagIndex = [...Array(maxItemTags).keys()].filter(i => i > 0);
  const allTags = await tagList.map(i => i.name);

  let combFaked = await faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(allUserIds),
      name: faker.lorem.sentence(),
      note: faker.lorem.sentence(),
      tags: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allTags)),
        {
          count: { min: 1, max: faker.helpers.arrayElement(possibleTagIndex) }
        }
      ), maxItemTags),
      props: Object.fromEntries(
        faker.helpers.multiple(
          () => ([faker.word.sample(), faker.word.sample()]),
          { count: faker.helpers.arrayElement([...Array(maxItemProps).keys()]) }
        )
      ),
      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
    }),
    { count: arraySize }
  );
  return await JSON.stringify({ items: combFaked });
}

async function loadItems(maxLoaded, maxGen, apiUrl, tags) {
  const url = `${apiUrl}/UpsertItem`;
  for (let i = 0; i < maxLoaded; i++) {
    const data = fakeItems(maxGen, tags);
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
  }
}


function load_db(aUrl) {
  loadTags(1, 20, aUrl).then(
    () => {
      allUserIds.forEach(
        uId => {
          const pl = { "userId": uId, "pagination": { "pageSize": -1, } }
          apiCall(`${aUrl}/ReadTag`, pl).then(
            (tags) => {
              console.log('Retrieved Tags - ', tags)
              loadItems(1, 200, aUrl, tags);
              loadFilters(1, 200, aUrl, tags);
            }
          ).catch((error) => console.log('Load Filters and Items - ', error.message))
        }
      )
    }
  ).catch((error) => console.log('Load Tags - ', error.message))
}

// const url = "http://localhost:8081/listah.v1.ItemService";
// const url = "http://localhost:8080/listah.v1.ItemService";
// loadItems(10, 3000, url);
// loadItems(1, 50, url);
// loadFilters(100, url);

const urls = [
  "http://localhost:8080/listah.v1.ItemService",
  // "http://localhost:8081/listah.v1.ItemService",
]
urls.forEach(url => load_db(url));



// urls.forEach(url => loadItems(1, 200, url));
// urls.forEach(url => loadItems(10, 3000, url));
// urls.forEach(url => loadFilters(100, url));
