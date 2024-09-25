import React, { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  joinRoom: (roomId: string, duration?: number) => void;
  startSession: (roomId: string, duration: number) => void;
  pauseSession: (roomId: string) => void;
  resumeSession: (roomId: string) => void;
  endSession: (roomId: string) => void;
  sendData: (roomId: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    const newSocket: Socket = io("http://localhost:3000", {
      auth: {
        username: "admin",
        password: "12345",
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, duration?: number) => {
    socket?.emit("join-room", roomId, duration);
  };

  const startSession = (roomId: string, duration: number) => {
    console.log("🚀 ~ startSession ~ duration:", duration)
    console.log("🚀 ~ startSession ~ roomId:", roomId)
    socket?.emit("start-session", roomId, duration);
  };

  const pauseSession = (roomId: string) => {
    socket?.emit("pause-session", roomId);
  };

  const resumeSession = (roomId: string) => {
    socket?.emit("resume-session", roomId);
  };

  const endSession = (roomId: string) => {
    socket?.emit("end-session", roomId);
  };

  const sendData = (roomId: string, data: any) => {
    socket?.emit("send-data", roomId, data);
  };

  const contextValue: SocketContextType = {
    socket,
    joinRoom,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    sendData,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
