const sessions = new Map();
const { Schema } = require("../db/models");

const findOrCreateSession = async schemaId => {
  const existingSession = sessions.get(schemaId);
  if (existingSession) return existingSession;

  const newSession = {
    clients: [],
    schema: schemaId,
    state: await loadSchemaFromDatabase(schemaId)
  };
  sessions.set(schemaId, newSession);
  return newSession;
};

const findSessionForSocket = socket => {
  for (const [sessionName, session] of sessions) {
    if (session.clients.find(client => client === socket.id)) return sessionName;
  }
  return null;
};

const loadSchemaFromDatabase = async schemaId => {
  const schemaRow = await Schema.findById(schemaId);
  return schemaRow.properties;
};

const writeStateToDatabase = async schemaId => {
  const session = sessions.get(schemaId);
  if (!session) throw new Error("No session exists.");
  await Schema.update({ properties: session.state }, { where: { id: schemaId } });
};

const onJoinSession = async (projectId, socket) => {
  try {
    const schema = await Schema.findOne({ where: { projectId } });
    const session = await findOrCreateSession(schema.id);
    console.log(`Client ${socket.id} is joining session ${schema.id}`);
    session.clients.push(socket.id);
    socket.join(schema.id);
    socket.emit("load-initial-state", session.state);
  } catch (error) {
    console.log("onJoinError", error);
  }
};

const onLeaveSession = async socket => {
  const schemaId = findSessionForSocket(socket);
  const session = sessions.get(schemaId);
  socket.leave(schemaId);
  if (!session) return;
  session.clients = session.clients.filter(client => client !== socket.id);

  if (!session.clients.length) {
    console.log(`Tearing down session ${schemaId}.`);
    await writeStateToDatabase(schemaId);
    sessions.delete(schemaId);
  }
};

const onJsonReceived = async (json, socket) => {
  console.log("onJsonReceived");
  const schemaId = findSessionForSocket(socket);
  if (!schemaId) throw new Error("Client isn't part of any session.");
  const session = sessions.get(schemaId);
  session.state = json;
  await writeStateToDatabase(schemaId);
  socket.to(schemaId).emit("notify-client-schema", session.state);
};

let io;
const startSocketListener = socketIo => {
  io = socketIo.of("/schema").on("connection", socket => {
    console.log(`Client has connected. (${socket.id})`);
    socket.on("join-session", payload => onJoinSession(payload, socket));
    socket.on("leave-session", () => onLeaveSession(socket));
    socket.on("dispatch-schema", json => onJsonReceived(json, socket));
    socket.on("disconnect", () => {
      const sessionName = findSessionForSocket(socket);
      if (sessionName) onLeaveSession(sessionName, socket);
      console.log(`Client has disconnected. (${socket.id})`);
    });
  });
};

module.exports = startSocketListener;
