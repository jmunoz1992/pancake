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
const { Project, Mockup, Schema, User } = require("../server/db/models");

async function seed() {
  await db.sync({ force: true });
  const project = await Project.create({ owner: "PrincessPotatoPancake", repository: "demo" });
  const user = await User.create({ username: "PrincessPotatoPancake" });
  user.setActiveProject(project);
  const mockup = Mockup.build({ name: "My Test Mockup" });
  mockup.setProject(project, { save: false });
  mockup.save();
  const objToSerialize = {
    id: "7fe33b4d-9470-4f97-b53c-0c2ead0fd180",
    offsetX: 0,
    offsetY: -1,
    zoom: 100,
    gridSize: 0,
    links: [
      {
        id: "713601b2-bae6-4ac1-8801-9132bbcf0212",
        type: "default",
        selected: false,
        source: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
        sourcePort: "79b75617-28df-45f5-9e5c-9f5efa6bbec7",
        target: "93211d80-bf45-4c30-9d95-c525ec940a21",
        targetPort: "eb475995-67fc-498f-8607-943b936c9919",
        points: [
          {
            id: "f0431458-319c-419c-bf66-9aeae8c57a0e",
            selected: false,
            x: 203.64999389648438,
            y: 179.6999969482422
          },
          { id: "11bd7842-d419-4178-bd2b-98355d096f0b", selected: true, x: 473.5, y: 179.8000030517578 }
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50
      }
    ],
    nodes: [
      {
        id: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
        type: "default",
        selected: false,
        x: 107,
        y: 98,
        extras: {},
        ports: [
          {
            id: "102a01a6-36aa-41c2-8560-cb37a43dfc47",
            type: "default",
            selected: false,
            name: "d7a80205-5a50-4e06-8981-62f1b4d25ea2",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: [],
            in: true,
            label: "username"
          },
          {
            id: "171f0cba-04dc-4ca8-add4-44cae0c6483d",
            type: "default",
            selected: false,
            name: "b1f148fe-726f-4af8-ae73-75e952c0bed9",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "15df2460-34b4-4457-b20d-499158e84cec",
            type: "default",
            selected: false,
            name: "a63ef2da-4fb9-48b7-89c7-aa1095d4316b",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: [],
            in: true,
            label: "password"
          },
          {
            id: "8cb17707-1e02-45de-ad14-5fe8f2e1401e",
            type: "default",
            selected: false,
            name: "5fbf9d3b-c0c7-4781-9cb4-2fc629ce4938",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "df646ad6-de2f-4f20-be05-462db18a6cd7",
            type: "default",
            selected: false,
            name: "6a9e8585-5aef-4de9-8f74-3ed1010e164d",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: [],
            in: true,
            label: "activeProjectId"
          },
          {
            id: "79b75617-28df-45f5-9e5c-9f5efa6bbec7",
            type: "default",
            selected: false,
            name: "e21bef5e-a983-427c-bb16-0179b41f7be8",
            parentNode: "c6f900e1-8560-497c-9f49-cb0cd79e95a0",
            links: ["713601b2-bae6-4ac1-8801-9132bbcf0212"],
            in: false,
            label: " "
          }
        ],
        name: "User",
        color: "rgb(236, 14, 14)"
      },
      {
        id: "93211d80-bf45-4c30-9d95-c525ec940a21",
        type: "default",
        selected: false,
        x: 464,
        y: 138,
        extras: {},
        ports: [
          {
            id: "eb475995-67fc-498f-8607-943b936c9919",
            type: "default",
            selected: false,
            name: "29b76ae0-d098-4911-9f72-8bfe4f3f3b36",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: ["713601b2-bae6-4ac1-8801-9132bbcf0212"],
            in: true,
            label: "id"
          },
          {
            id: "b8d5f011-cb21-4e24-a389-708e4f6eb8d0",
            type: "default",
            selected: false,
            name: "7f084bb0-f1fb-469e-9fdd-3589b6106fa8",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "13e1c931-5d09-436d-9cf7-e27aa2bf3e97",
            type: "default",
            selected: false,
            name: "c8e0012e-c884-4b2b-bc73-e461ffbeed29",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: true,
            label: "name"
          },
          {
            id: "c58799cb-fd4c-4e4d-8f63-9c1cb980f75c",
            type: "default",
            selected: false,
            name: "39c77803-6d50-4758-960b-4ac0fd157dc3",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "bac761a9-b65e-459b-a777-df9734a6571c",
            type: "default",
            selected: false,
            name: "0ba09335-5aed-454c-a661-fc3a21d8bd5f",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: true,
            label: "description"
          },
          {
            id: "c84339cd-e86c-45ac-8ed3-ec6e7a5093a8",
            type: "default",
            selected: false,
            name: "9215dfa5-c153-4cdf-ac52-0d2382d35fe1",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "7be69f48-dba0-4675-b96b-f5b374a47ff5",
            type: "default",
            selected: false,
            name: "7f3f9529-f54a-45e8-82e5-ec4d2c75ce85",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: true,
            label: "members"
          },
          {
            id: "035f5c69-bd8f-4694-9578-d6ccbdc8c5dd",
            type: "default",
            selected: false,
            name: "f66c4773-8ce7-41ce-97eb-4a3816444e67",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: false,
            label: " "
          },
          {
            id: "1cf347e3-5342-47c6-b5d2-cf3327c5bf52",
            type: "default",
            selected: false,
            name: "977f6629-9a5f-4d04-bbe6-7b9b4ca11633",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: true,
            label: "dueDate"
          },
          {
            id: "3dacfb64-6886-4cc5-aa9a-4277ec20e393",
            type: "default",
            selected: false,
            name: "a98dd1cc-8711-4a76-adc0-83afae8da819",
            parentNode: "93211d80-bf45-4c30-9d95-c525ec940a21",
            links: [],
            in: false,
            label: " "
          }
        ],
        name: "Project",
        color: "rgb(87, 11, 235)"
      },
      {
        id: "7ef0ffbb-388e-4dc2-84bc-5c27d0051c21",
        type: "default",
        selected: false,
        x: 216,
        y: 144,
        extras: {},
        ports: [],
        name: "User hasMany Project",
        color: "rgb(255,255, 255)"
      },
      {
        id: "e12c7b93-9e27-4863-b82f-62b1bca48843",
        type: "default",
        selected: false,
        x: 335,
        y: 184,
        extras: {},
        ports: [],
        name: "Project belongsTo User",
        color: "rgb(255,255, 255)"
      }
    ]
  };
  const stringifiedData = JSON.stringify(objToSerialize);
  const schema = Schema.build({ properties: stringifiedData });
  schema.setProject(project, { save: false });
  schema.save();
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
