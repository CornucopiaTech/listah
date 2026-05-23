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



async function apiCall(url, payload) {
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error(`Network response was not ok: ${res.statusText}`);
  }
  return await res.json();
}

export function fakeTags(arraySize) {
  let maxProps = 10 * arraySize;
  const maxTagProps = 10;
  const possiblePropIndex = [...Array(maxTagProps).keys()].filter(i => i > 0);

  let allProps = faker.helpers.multiple(() => faker.word.noun(), { count: 2 * maxProps });
  let updaters = ["AUDIT_UPDATER_ENUM_UNSPECIFIED", "AUDIT_UPDATER_ENUM_FRONTEND", "AUDIT_UPDATER_ENUM_SYSOPS"];

  // allProps = faker.helpers.uniqueArray(allProps, maxProps);
  allProps = [...new Set(allProps)];

  let combFaked = faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(allUserIds),
      name: faker.word.sample(),
      props: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allProps)),
        {
          count: { min: 1, max: faker.helpers.arrayElement(possiblePropIndex) }
        }
      ), maxTagProps),

      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
    }),
    { count: 2 * arraySize }
  );
  // Prevent duplicate tag name
  const uniqueTagNames = [...new Set(combFaked.map(i => i.name))];
  const uniqueCombFaked = uniqueTagNames.reduce((acc, it) => {
    return [...acc, combFaked.filter((i) => i.name == it)[0]]
  }, []);
  return JSON.stringify({ tags: uniqueCombFaked });
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

async function fakeFilters(arraySize, tagList, user) {
  // console.log('fakeFilters - ', tagList)
  const maxFilterTag = 5;
  const allTags = await tagList.map(i => i.id);
  const possibleTagIndex = await [...Array(allTags.length).keys()].filter(i => i > 0);
  let combFaked = await faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: user,
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
  return await JSON.stringify({ filters: combFaked });
}

async function loadFilters(maxLoaded, maxGen, apiUrl, tags, user) {
  const url = `${apiUrl}/UpsertFilter`;
  for (let i = 0; i < maxLoaded; i++) {
    const data = await fakeFilters(maxGen, tags, user);
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
}


async function fakeItems(arraySize, tagList, user) {
  const maxItemTags = 7;
  const maxItemProps = 12;
  const possibleTagIndex = [...Array(maxItemTags).keys()].filter(i => i > 0);
  const allTags = await tagList.map(i => i.id);

  let combFaked = await faker.helpers.multiple(
    () => ({
      id: faker.string.uuid(),
      userId: user,
      name: faker.lorem.sentence(),
      note: faker.lorem.sentence(),
      tags: faker.helpers.uniqueArray(faker.helpers.multiple(
        () => (faker.helpers.arrayElement(allTags)),
        {
          count: { min: 1, max: faker.helpers.arrayElement(possibleTagIndex) }
        }
      ), maxItemTags),
      "updated_by": faker.helpers.arrayElement(updaters),
      "updated_at": faker.helpers.arrayElement([faker.date.past(), null]),
    }),
    { count: arraySize }
  );
  combFaked = combFaked.map((i) => {
    let p = i.tags.reduce((acc, t) => {
      return [...acc, ...tagList.filter(tl => tl.id == t)[0].props];
    }, [])
    p = new Set(p)
    p = [...p]
    const possiblePropIndex = [...Array(maxItemProps).keys()].filter(i => i > 0);
    const prps = Object.fromEntries(
      faker.helpers.multiple(
        () => ([faker.helpers.arrayElement(p), faker.word.sample()]),
        { count: { min: 1, max: faker.helpers.arrayElement(possiblePropIndex) } }
      )
    )
    return { ...i, props: prps }
  })
  // console.log(combFaked)

  return await JSON.stringify({ items: combFaked });
}

async function loadItems(maxLoaded, maxGen, apiUrl, tags, user) {
  const url = `${apiUrl}/UpsertItem`;
  for (let i = 0; i < maxLoaded; i++) {
    const data = await fakeItems(maxGen, tags, user);
    const req = await new Request(url, {
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
  loadTags(1, 1000, aUrl).then(
    () => {
      allUserIds.forEach(
        uId => {
          const pl = { "userId": uId, "pagination": { "pageSize": -1, } }
          apiCall(`${aUrl}/ReadTag`, pl).then(
            (data) => {
              // console.log('Retrieved data - ', data)
              // console.log('Retrieved Tags - ', tags);
              const tags = data.tags;
              loadItems(10, 1000, aUrl, tags, uId);
              loadFilters(10, 1000, aUrl, tags, uId);
            }
          ).catch((error) => console.log('Load Filters and Items - ', error.message))
        }
      )
    }
  ).catch((error) => console.log('Load Tags - ', error.message))
}


const urls = [
  "http://localhost:8080/listah.v1.ItemService",
  // "http://localhost:8081/listah.v1.ItemService",
]
urls.forEach(url => load_db(url));
