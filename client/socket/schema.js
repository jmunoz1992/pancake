import io from "socket.io-client";
import { default as store } from "../store";

const schemaSocket = io(`${window.location.origin}/schema`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3
});

export const connectToSession = callback => {
  if (!schemaSocket.connected) schemaSocket.connect();
  console.log("sending join-session");
  const projectId = store.getState().user.activeProjectId;
  schemaSocket.emit("join-session", projectId);
  schemaSocket.callback = callback;
};

export const sendSchemaUpdate = json => {
  console.log("sendSchemaUpdate");
  if (!schemaSocket.connected) throw new Error("Not connected to schema socket.");
  schemaSocket.emit("dispatch-schema", json);
};

schemaSocket.on("load-initial-state", state => {
  console.log("onLoadInitialState", state);
  schemaSocket.callback(state);
});

schemaSocket.on("notify-client-schema", json => {
  console.log("notifyClientSchema");
  schemaSocket.callback(json);
});

schemaSocket.on("connect", () => {
  console.log("Connected to schema socket.");
});

schemaSocket.on("disconnect", () => {
  console.log("Disconnected from schema socket.");
});
