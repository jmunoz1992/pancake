// OVERVIEW
// Each mockup can have multiple clients viewing and interacting with it.  When a new user opens
// a diagram, the front-end sends a request over WebSockets to join a "session" for the diagram.

// A session consists of a Redux store (the authoritative state of the diagram, which each user has
// a copy of) and an array of clients who are part of that session.  When a client joins, the server
// looks for an existing session.  If one does not exist, it spins up a new session and Redux store,
// and initializes the store with the diagram data from PostgreSQL.  The full state of the store
// is then sent to the user so they have an initial state to work with.

// When a user changes the diagram, the front-end creates a Redux action, but does not dispatch it
// immediately.  Instead, the action is sent to the server, where it goes through the server-side
// Redux reducer.  Then, the server relays the action back to all clients, including the client that
// created the action, so that the client-side stores can all be updated.

// Each session is also mapped to a Socket.IO "room".  A room acts as a separate channel, so that
// multiple users can work across multiple different diagrams and only receive actions from the
// server relevant to the diagram they're currently working on.

const { createStoreForMockup, serializeStore } = require("./mockups/store");
const sessions = new Map();
const uuidv4 = require("uuid/v4");

const findOrCreateSession = async sessionName => {
  const existingSession = sessions.get(sessionName);
  if (existingSession) return existingSession;

  console.log(`Session ${sessionName} is being created.`);
  const newSession = {
    clients: [],
    mockup: sessionName,
    store: await createStoreForMockup(sessionName)
  };
  sessions.set(sessionName, newSession);
  return newSession;
};

// Returns the name of the session a given client is connected to.
const findSessionForSocket = socket => {
  for (const [sessionName, session] of sessions) {
    if (session.clients.find(client => client === socket.id)) return sessionName;
  }
  return null;
};

const onJoinSession = async (sessionName, socket) => {
  console.log(`Client ${socket.id} is joining session ${sessionName}`);
  try {
    const session = await findOrCreateSession(sessionName);
    session.clients.push(socket.id);
    socket.join(sessionName);
    socket.emit("load-initial-state", session.store.getState().designer);
  } catch (error) {
    console.log(`Unable to join session. (Client=${socket.id}, Session=${sessionName})`);
    sendClientError(socket, error);
  }
};

const onLeaveSession = async (sessionName, socket) => {
  console.log(`Client ${socket.id} is leaving session ${sessionName}`);
  const session = sessions.get(sessionName);
  socket.leave(sessionName);
  if (!session) return;
  session.clients = session.clients.filter(client => client !== socket.id);

  // If the session has no clients, save its Redux store to the database and shut it down.
  if (session.clients.length === 0) {
    console.log(`Tearing down session ${sessionName}.`);
    await serializeStore(session.store, sessionName);
    session.store = null;
    sessions.delete(sessionName);
  }
};

const onActionReceived = async (action, socket) => {
  try {
    const sessionName = findSessionForSocket(socket);
    if (!sessionName) throw new Error("Client isn't part of any session.");
    const store = sessions.get(sessionName).store;

    // Generate an ID for the element if we're creating a new one.
    if (action.type === "designer/CREATE_ELEMENT") action.payload.id = uuidv4();

    store.dispatch(action);
    store.serialize(store, sessionName);
    console.log("sending", action);
    io.to(sessionName).emit("update-mockup-state", action);
  } catch (error) {
    console.log(`Unable to dispatch action. (Action=${action}, Client=${socket.id}))`);
    sendClientError(socket, error);
  }
};

const sendClientError = (socket, error) => {
  socket.emit("exception", String(error));
  console.log("Mockup Socket Server:", error);
  const sessionName = findSessionForSocket(socket);
  if (sessionName) onLeaveSession(sessionName, socket);
  socket.disconnect();
};

let io;
const startSocketListener = socketIo => {
  io = socketIo.of("/mockups").on("connection", socket => {
    console.log(`Client has connected. (${socket.id})`);
    socket.on("join-session", payload => onJoinSession(payload.mockupId, socket));
    socket.on("leave-session", payload => onLeaveSession(payload.mockupId, socket));
    socket.on("dispatch-action", action => onActionReceived(action, socket));
    socket.on("disconnect", () => {
      const sessionName = findSessionForSocket(socket);
      if (sessionName) onLeaveSession(sessionName, socket);
      console.log(`Client has disconnected. (${socket.id})`);
    });
  });
};

module.exports = startSocketListener;
