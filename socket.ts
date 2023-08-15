import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

export class ServerSocket {
  public io: Server;
  public static serverInstance: ServerSocket;

  // list of all users connected
  public connectedUsers: Map<string, string>;

  constructor(server: HTTPServer) {
    ServerSocket.serverInstance = this;
    this.connectedUsers = new Map();
    this.io = new Server(server, {
      pingInterval: 10000,
      pingTimeout: 5000,
      cors: {
        origin: "*",
      },
    });

    // on connection start listening to listeners
    this.io.on("connect", this.StartListeners);

    console.log("Socket started");
  }

  StartListeners = (socket: Socket) => {
    console.log("Message received from " + socket.id);

    // other events
    socket.on("add-user", (userId: string) => {
      console.log("Received add user", userId);
      this.connectedUsers.set(userId, socket.id);
    });

    socket.on("send-message", (payload) => {
      console.log(this.connectedUsers);
      const sendUserSocket = this.connectedUsers.get(payload.to);

      console.log(payload);

      if (sendUserSocket) {
        console.log("sending message 12345");
        socket.to(sendUserSocket).emit("message-received", payload);
      }
    });

    socket.on(
      "handshake",
      (callback: (uid: string, users: string[]) => void) => {
        console.log("handshake received");

        // check if this is a reconnection
        const reconnectedUser = Object.values(this.connectedUsers).includes(
          socket.id
        );

        if (reconnectedUser) {
          console.log("User reconnected");
          // get user id from socket
          const uid = this.GetUidFromSocket(socket.id);
          const users: string[] = Object.values(this.connectedUsers);

          if (uid) {
            console.log("Sending callback for reconnect...");
            callback(uid, users);
            return;
          }
        }

        // generate new user
        const uid = uuidV4();
        this.connectedUsers.set(uid, socket.id);
        const users: string[] = Object.values(this.connectedUsers);

        console.log("Sending callback for handshake...");
        callback(uid, users);

        // send user to all connected users
        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          users
        );
      }
    );

    socket.on("disconnect", () => {
      console.log("Disconnect received" + socket);

      const uid = this.GetUidFromSocket(socket.id);

      if (uid) {
        this.connectedUsers.delete(uid);
        const users: string[] = Object.values(this.connectedUsers);
        this.SendMessage("user_disconnected", users, uid);
      }
    });
  };

  GetUidFromSocket = (id: string) =>
    Object.keys(this.connectedUsers).find(
      (uid) => this.connectedUsers.get(uid) === id
    );

  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.log("Emitting event " + name + "to: " + users);
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    );
  };
}
