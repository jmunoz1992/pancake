/**
 * Welcome to the seed file! This seed file uses a newer language feature called...
 *
 *                  -=-= ASYNC...AWAIT -=-=
 *
 * Async-await is a joy to use! Read more about it in the MDN docs:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 *
 * Now that you've got the main idea, check it out in practice below!
 */
const db = require("../server/db");
const { Project, Mockup, Schema } = require("../server/db/models");

async function seed() {
  await db.sync({ force: true });
  const project = await Project.create({ owner: "flapjackstack", repository: "demo" });
  const mockup = await Mockup.create({ id: 2, name: "My Test Mockup", projectId: 1 });
  const objToSerialize = {
    id: "00951459-bb5b-4df3-8911-57d99ea38b3e",
    offsetX: 173,
    offsetY: -30,
    zoom: 100,
    gridSize: 0,
    links: [
      {
        id: "f91e1120-d986-4f6d-815f-e91336a1d56b",
        type: "default",
        selected: false,
        source: "464a031b-fff6-4ae7-b425-c0532641e884",
        sourcePort: "ef9d45c4-e011-4010-9891-89cbe7ceb324",
        target: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
        targetPort: "0d577536-9c96-42e9-9c1e-65f49962715d",
        points: [
          {
            id: "19036fb9-ce5a-4385-ab0d-a42a66a8191c",
            selected: false,
            x: -35.350006103515625,
            y: 247.70001220703125
          },
          { id: "c8b813c0-ca9b-42cf-ae16-73d5a9794ea1", selected: false, x: 126, y: 371 },
          { id: "90c7346a-2379-4a6c-87c9-ac9418e09a8c", selected: false, x: 185.5, y: 358.8000183105469 }
        ],
        extras: {},
        labels: [
          {
            id: "9b0b8b21-7596-4eaa-9d94-9c8baa7dd464",
            type: "default",
            selected: false,
            offsetX: 0,
            offsetY: -23,
            label: "User hasMany Project"
          },
          {
            id: "7024b9d1-b968-4aae-9ad9-1c34fcb96951",
            type: "default",
            selected: false,
            offsetX: 0,
            offsetY: -23,
            label: "Project belongsTo User"
          }
        ],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50
      }
    ],
    nodes: [
      {
        id: "464a031b-fff6-4ae7-b425-c0532641e884",
        type: "default",
        selected: false,
        x: -132,
        y: 146,
        extras: {},
        ports: [
          {
            id: "69263b34-f510-45be-9be3-3f447f02ec41",
            type: "default",
            selected: false,
            name: "b09acf92-444e-468d-b8e1-de0a5667ec9b",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: true,
            label: "name"
          },
          {
            id: "92ed025b-26c8-4be1-a8f9-df0f96630398",
            type: "default",
            selected: false,
            name: "63d4eb4c-ea46-49d4-9b24-150e6f24b437",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "b52f8727-01d0-41af-873d-c47d0c010f7a",
            type: "default",
            selected: false,
            name: "285249ea-3004-4722-9ac8-b94c194d7964",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: true,
            label: "email"
          },
          {
            id: "6203375c-e29f-4be8-8a45-f7f4efa7c507",
            type: "default",
            selected: false,
            name: "96568dc7-0347-4905-b629-db98f244544d",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "b1c99ba9-eb61-4112-9090-f2ee2b05538d",
            type: "default",
            selected: false,
            name: "815dcb46-47ea-45a3-9879-63b8fb6bfef2",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: true,
            label: "password"
          },
          {
            id: "166e1441-79a1-4614-ac11-b0d14cf68b4d",
            type: "default",
            selected: false,
            name: "fda95d96-4249-4d28-9f04-aee19d8f6e26",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "c31f8ff1-7ba5-4ead-8541-bf95e3770bf3",
            type: "default",
            selected: false,
            name: "9576546e-c63f-4060-980f-d1c2638a2da9",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: [],
            in: true,
            label: "activeProjectId"
          },
          {
            id: "ef9d45c4-e011-4010-9891-89cbe7ceb324",
            type: "default",
            selected: false,
            name: "ac262c4f-b855-499b-b09b-94117fee0584",
            parentNode: "464a031b-fff6-4ae7-b425-c0532641e884",
            links: ["f91e1120-d986-4f6d-815f-e91336a1d56b"],
            in: false,
            label: " "
          }
        ],
        name: "User",
        color: "rgb(193, 8, 8)"
      },
      {
        id: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
        type: "default",
        selected: false,
        x: 176,
        y: 317,
        extras: {},
        ports: [
          {
            id: "0d577536-9c96-42e9-9c1e-65f49962715d",
            type: "default",
            selected: false,
            name: "2e7f8ea6-1c64-473d-9593-83b08e947da4",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: ["f91e1120-d986-4f6d-815f-e91336a1d56b"],
            in: true,
            label: "id"
          },
          {
            id: "ab83d571-ba9b-4e66-95cc-154a3f2abed0",
            type: "default",
            selected: false,
            name: "6cc0e07c-09d8-48dd-8959-c461332a10f0",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "a6b215c6-b0a7-45e7-8197-f773e9d6aee8",
            type: "default",
            selected: false,
            name: "927038b6-bde0-4e56-9661-3a70feee176a",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: [],
            in: true,
            label: "name"
          },
          {
            id: "b701c21e-1960-4cd0-b690-9ea161f4a844",
            type: "default",
            selected: false,
            name: "4b448959-3669-4670-b6d0-d8f862542fea",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "476aa251-b5cb-4723-936c-0e5abd158f72",
            type: "default",
            selected: false,
            name: "2bc6e819-e9cb-4a2c-a926-d299ec0016a1",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: [],
            in: true,
            label: "content"
          },
          {
            id: "be3fce87-6b57-4042-bc54-7c8d4b49a0e5",
            type: "default",
            selected: false,
            name: "af100307-0a53-43b6-971a-5177d54d598a",
            parentNode: "8c7927aa-a976-4c83-83a1-d279b7eb4e08",
            links: [],
            in: false,
            label: " "
          }
        ],
        name: "Project",
        color: "rgb(139, 9, 9)"
      }
    ]
  };
  const stringifiedData = JSON.stringify(objToSerialize);
  const schema = await Schema.create({ id: 1, properties: stringifiedData, projectId: 1 });
  console.log("db synced!");
}

// Execute the `seed` function
// `Async` functions always return a promise, so we can use `catch` to handle any errors
// that might occur inside of `seed`
seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("closing db connection");
    db.close();
    console.log("db connection closed");
  });

/*
 * note: everything outside of the async function is totally synchronous
 * The console.log below will occur before any of the logs that occur inside
 * of the async function
 */
console.log("seeding...");
