import io from "socket.io-client";
import { default as store } from "../store";

const schemaSocket = io(`${window.location.origin}/schema`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3
});

export const connectToSession = callback => {
  if (!schemaSocket.connected) schemaSocket.connect();
  console.log("Joining schema session...");
  const projectId = store.getState().user.activeProjectId;
  schemaSocket.emit("join-session", projectId);
  schemaSocket.callback = callback;
};

export const sendSchemaUpdate = json => {
  if (!schemaSocket.connected) throw new Error("Not connected to schema socket.");
  console.log("Sending schema update to server.");
  schemaSocket.emit("dispatch-schema", json);
};

schemaSocket.on("load-initial-state", state => {
  console.log("Joined schema session.");
  schemaSocket.callback(state);
});

schemaSocket.on("notify-client-schema", json => {
  console.log("Received schema update from server.");
  schemaSocket.callback(json);
});

schemaSocket.on("connect", () => {
  console.log("Connected to schema socket.");
});

schemaSocket.on("disconnect", () => {
  console.log("Disconnected from schema socket.");
});
