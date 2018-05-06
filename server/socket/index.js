// OVERVIEW
// Each mockup diagram can have an abritrary number of users viewing and interacting with it.  When
// a new user opens a diagram on the front-end, they send a message over Socket.IO requesting to
// join a "session" for that diagram.

// A session consists of a Redux store (the authoritative state of the diagram, which each user has
// a copy of) and an array of users who are part of that session.

// When a user joins the session, the server looks for the session in the `sessions` Map.  If it
// doesn't find one, it creates a new session and initializes it with the contents of the persisted
// diagram on the disk.  The contents of the session's Redux store are sent to the newly connected
// user, so they have an initial state to work with.

// Any time a user makes a change to the diagram on the front-end, they send an action to the
// server.  The server dispatches the action to its Redux reducer, and then sends the action back
// to all connected clients, so they can update their copies of the state.

// Each session is also mapped to a Socket.IO "room".  A room acts as a separate channel, so that
// multiple users can work across multiple different diagrams and only receive actions relevant
// to the diagram they're currently working on.

const createMockupStore = require("./mockups/store");
const sessions = new Map();
const uuidv4 = require("uuid/v4");

const findOrCreateSession = sessionName => {
  const existingSession = sessions.get(sessionName);
  if (existingSession) return existingSession;

  console.log(`Session ${sessionName} is being created.`);
  const newSession = {
    clients: [],
    mockup: sessionName,
    store: createMockupStore()
  };
  sessions.set(sessionName, newSession);
  return newSession;
};

// Searches the `sessions` map to find which session a given client is currently a part of
const findSessionForSocket = socket => {
  for (const [sessionName, session] of sessions) {
    if (session.clients.find(client => client === socket.id)) return sessionName;
  }
  return null;
};

const clientJoinedSession = (sessionName, socket) => {
  console.log(`Client ${socket.id} is joining session ${sessionName}`);
  const session = findOrCreateSession(sessionName);
  session.clients.push(socket.id);
  socket.join(sessionName);
  socket.emit("load-initial-state", session.store.getState().designerState);
};

const clientLeftSession = (sessionName, socket) => {
  console.log(`Client ${socket.id} is leaving session ${sessionName}`);
  const session = sessions.get(sessionName);
  session.clients = session.clients.filter(client => client !== socket.id);
  socket.leave(sessionName);
};

const clientDispatchedAction = (action, socket) => {
  console.log("Action:", action.type);
  const sessionName = findSessionForSocket(socket);
  const store = sessions.get(sessionName).store;

  if (action.type === "designer/CREATE_ELEMENT") {
    // Generates a pseudo-unique ID for the new element.
    action.payload.id = uuidv4();
  }
  store.dispatch(action);
  io.to(sessionName).emit("update-mockup-state", action);
};

let io;
const startSocketListener = socketIo => {
  io = socketIo.of("/mockups").on("connection", socket => {
    console.log(`Client has connected to mockups server. (${socket.id})`);

    socket.on("join-session", payload => clientJoinedSession(payload.mockupId, socket));
    socket.on("leave-session", payload => clientLeftSession(payload.mockupId, socket));
    socket.on("dispatch-action", action => clientDispatchedAction(action, socket));

    socket.on("disconnect", () => {
      // When a socket disconnects, iterate over the sessions map and remove them
      // from any sessions they might still be in.
      const sessionName = findSessionForSocket(socket);
      if (sessionName) clientLeftSession(sessionName, socket);

      console.log(`Client has disconnected from mockups server. (${socket.id})`);
    });
  });
};

module.exports = startSocketListener;
