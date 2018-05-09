const sessions = new Map();
const { Schema } = require("../db/models");

const loadSchemaFromDatabase = async schemaId => {
  try {
    const schemaRow = await Schema.findById(schemaId);
    return schemaRow.properties;
  } catch (error) {
    console.log("error in loadSchemaFromDatabase", error);
  }
};

const findOrCreateSession = async schemaId => {
  try {
    const existingSession = sessions.get(schemaId);
    if (existingSession) return existingSession;

    const newSession = {
      clients: [],
      schema: schemaId,
      state: await loadSchemaFromDatabase(schemaId)
    };
    sessions.set(schemaId, newSession);
    return newSession;
  } catch (error) {
    console.log("error in findOrCreateSession", error);
  }
};

const findSessionForSocket = socket => {
  for (const [sessionName, session] of sessions) {
    if (session.clients.find(client => client === socket.id)) return sessionName;
  }
  return null;
};

const writeStateToDatabase = async schemaId => {
  try {
    const session = sessions.get(schemaId);
    if (!session) throw new Error("No session exists.");
    await Schema.update({ properties: session.state }, { where: { id: schemaId } });
  } catch (error) {
    console.log("error in writeStateToDatabase", error);
  }
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
  console.log("socket in onLeaveSession ", socket);
  socket.leave(schemaId);
  if (!session) return;
  session.clients = session.clients.filter(client => client !== socket.id);

  if (!session.clients.length) {
    try {
      console.log(`Tearing down session ${schemaId}.`);
      await writeStateToDatabase(schemaId);
      sessions.delete(schemaId);
    } catch (error) {
      console.log("error in onLeaveSession", error);
    }
  }
};

const onJsonReceived = async (json, socket) => {
  try {
    console.log("onJsonReceived");
    const schemaId = findSessionForSocket(socket);
    if (!schemaId) throw new Error("Client isn't part of any session.");
    const session = sessions.get(schemaId);
    session.state = json;
    await writeStateToDatabase(schemaId);
    socket.to(schemaId).emit("notify-client-schema", session.state);
  } catch (error) {
    console.log("error in jsonRecieved ", error);
  }
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
