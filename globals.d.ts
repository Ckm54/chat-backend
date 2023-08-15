// better typing on global scope
export interface global {}
declare module global {
  namespace NodeJS {
    interface Global {
      onlineUsers: Map<any, any>; //todo:: update this any typing with correct type for online users
    }
  }
}
