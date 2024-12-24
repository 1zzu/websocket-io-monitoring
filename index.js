import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(json());

const EVENTS_TYPES = {
  ATTACHMENT: "ATTACHMENT",
  COMMENT: "COMMENT",
  HISTORY: "HISTORY",
  STATUS: "STATUS",
  ASSIGNEE: "ASSIGNEE",
  TITLE: "TITLE",
  AMOUNT: "AMOUNT",
  TRANSACTION: "TRANSACTION",
  START_DATE: "START DATE",
  END_DATE: "END DATE",
  PING: 'PING',
  ROW: 'ROW'
};

io.on('connection', (socket) => {
  const userID = socket.id;

  console.log(`User  ${userID} connected`);

  socket.on('disconnect', () => {
      console.log(`User  ${userID} disconnected`);
  });

  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`User  ${userID} joined room ${data}`);
  })

  socket.on("leave-room", (data) => {
    socket.leave(data);
    console.log(`User  ${userID} left room ${data}`);
  });

  socket.on(`emit_${EVENTS_TYPES.COMMENT}`, (data) => {
    io.to(data.room).emit(`receive_${EVENTS_TYPES.COMMENT}`, data)
  });

  socket.on(`emit_${EVENTS_TYPES.ATTACHMENT}`, (data) => {
    io.to(data.room).emit(`receive_${EVENTS_TYPES.ATTACHMENT}`, data)
  });

  socket.on(`emit_${EVENTS_TYPES.TRANSACTION}`, (data) => {
    io.to(data.room).emit(`receive_${EVENTS_TYPES.TRANSACTION}`, data)
  });

  socket.on(`emit_${EVENTS_TYPES.HISTORY}`, (data) => {
    io.to(data.room).emit(`receive_${EVENTS_TYPES.HISTORY}`, data)
  });

  socket.on(`emit_${EVENTS_TYPES.ROW}`, (data) => {
    io.to(data.room).emit(`receive_${EVENTS_TYPES.ROW}`, data)
  });

});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});