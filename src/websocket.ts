import { io } from "./http";

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface Message {
    room: string;
    username: string;
    createdAt: Date;
    text: string;
}

const users: RoomUser[] = [];

const messages: Message[] = [];

io.on('connection', (socket) => {
    socket.on('select_room', (data, callback) => {
        const { username, room } = data;

        socket.join(room);

        const usersInRoom = users.find(user => user.username === username && user.room === room);
        if (usersInRoom) {
            usersInRoom.socket_id = socket.id;
        } else {
            users.push({
                socket_id: socket.id,
                username,
                room
            })
        }

        const messagesRoom = getMessagesRoom(room);
        callback(messagesRoom);


    });

    socket.on('message', data => {
        const message: Message = {
            room: data.room,
            username: data.username,
            createdAt: new Date(),
            text: data.message
        }
        messages.push(message);

        io.to(data.room).emit('message', message);
    })
})

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room);
    return messagesRoom;
}