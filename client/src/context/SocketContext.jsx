import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinCourseRoom = (courseId) => {
    if (socket && courseId) {
      socket.emit('join_course', courseId);
    }
  };

  const leaveCourseRoom = (courseId) => {
    if (socket && courseId) {
      socket.emit('leave_course', courseId);
    }
  };

  const sendCourseMessage = (courseId, message) => {
    if (socket && courseId && user) {
      socket.emit('send_course_message', {
        courseId,
        message,
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinCourseRoom,
        leaveCourseRoom,
        sendCourseMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext) || {};
};
