// Each mockup diagram may have an entry in the sessions map.  When a user opens a diagram on the
// front-end, they'll send a message to the server requesting to join a session for that diagram.
// If a session already exists, the server will add that user to the array of connected users in
// that session.
// If one doesn't exist, the server will start a new session for that diagram, creating a Socket.IO
// room and a Redux store for the user (and any subsequent ones) to work with.
// If a user disconnects, we'll check if there are any more users in that mockup's session.  If not,
// we'll clean it up by closing the Socket.IO room, persisting the mockup to the disk, and removing
// the session from the map.
const createMockupStore = require("./mockups/store");
const sessions = new Map();

/*
session = {
  users: array of sockets,
  mockup: sequelize model
  store: redux store for current mockup,
}
*/

const createNewSession = mockupId => {
  // const mockup = await Mockup.findById(mockupId);
  console.log(`Session ${mockupId} is being created.`);
  const newSession = {
    clients: [],
    mockup: mockupId,
    store: createMockupStore()
  };
  sessions.set(mockupId, newSession);
};

const clientJoinedSession = (sessionName, socket) => {
  console.log(`Client ${socket.id} is joining session ${sessionName}`);
  if (!sessions.get(sessionName)) createNewSession(sessionName);
  socket.join(sessionName);
  sessions.get(sessionName).clients.push(socket.id);
};

const clientLeftSession = (sessionName, socket) => {
  console.log(`Client ${socket.id} is leaving session ${sessionName}`);
  socket.leave(sessionName);
  const session = sessions.get(sessionName);
  session.clients = session.clients.filter(client => client !== socket.id);
};

const clientDispatchedAction = (action, socket) => {
  console.log("received action", action.type);
  socket.emit("update-mockup-state", action);
};

// Loops through the session map and tries to find which session a socket belongs to.
const findSessionForSocket = socket => {
  for (const [sessionName, session] of sessions) {
    if (session.clients.find(client => client === socket.id)) return sessionName;
  }
  return null;
};

const mockupServer = io => {
  return io.of("/mockups").on("connection", socket => {
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

module.exports = mockupServer;
