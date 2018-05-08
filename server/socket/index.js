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

// Searches the `sessions` map to find which session a given client is currently a part of
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
    socket.emit("load-initial-state", session.store.getState().designerState);
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
    if (action.type === "designer/CREATE_ELEMENT") {
      // Generates a pseudo-unique ID for the new element.
      action.payload.id = uuidv4();
    }
    store.dispatch(action);
    await serializeStore(store, sessionName);
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
      // When a socket disconnects, iterate over the sessions map and remove them
      // from any sessions they might still be in.
      const sessionName = findSessionForSocket(socket);
      if (sessionName) onLeaveSession(sessionName, socket);
      console.log(`Client has disconnected. (${socket.id})`);
    });
  });
};

module.exports = startSocketListener;
