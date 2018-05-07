import io from "socket.io-client";
import { default as store, designerOperations } from "./store";

const mockupSocket = io(`${window.location.origin}/mockups`);

mockupSocket.on("connect", () => {
  console.log("Connected to mockups server.");
  mockupSocket.emit("join-session", { mockupId: 1 });
});

mockupSocket.on("load-initial-state", state => {
  console.log("Receiving initial state");
  store.dispatch(designerOperations.loadElements(state));
});

mockupSocket.on("update-mockup-state", action => {
  console.log("Received mockup action", action);
  store.dispatch(action);
});

mockupSocket.on("error", error => {
  console.log("Socket error: ", error);
});

mockupSocket.on("disconnect", () => {
  console.log("Disconnected from mockups server.");
});

export default mockupSocket;
