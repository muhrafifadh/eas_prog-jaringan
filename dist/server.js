import * as Constants from './lib/Constants';
import * as http from 'http';
import * as path from 'path';
import * as socketIO from 'socket.io';
import * as socketIOParser from './lib/CustomSocketParser';
import * as url from 'url';
import Game from './server/Game';
import express from 'express';
import morgan from 'morgan';
const PORT = process.env.PORT || 5000;
const FRAME_RATE = 1000 / 60;
const CHAT_TAG = '[Tank Fight]';
const DIRNAME = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer, {
    parser: socketIOParser,
});
const game = new Game();
app.set('port', PORT);
app.use(morgan('dev'));
app.use(express.static(DIRNAME));
app.get('/', (_request, response) => {
    response.sendFile(path.join(DIRNAME, 'html/index.html'));
});
io.on('connection', (socket) => {
    socket.on(Constants.SOCKET.NEW_PLAYER, (name, callback) => {
        game.addNewPlayer(name, socket);
        io.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
            name: CHAT_TAG,
            message: `${name} has joined the game.`,
            isNotification: true,
        });
        callback();
    });
    socket.on(Constants.SOCKET.PLAYER_ACTION, (data) => {
        game.updatePlayerOnInput(socket.id, data);
    });
    socket.on(Constants.SOCKET.CHAT_CLIENT_SERVER, (message) => {
        io.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
            name: game.getPlayerNameBySocketId(socket.id),
            message: message,
            isNotification: false,
        });
    });
    socket.on(Constants.SOCKET.DISCONNECT, () => {
        const name = game.removePlayer(socket.id);
        io.sockets.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
            name: CHAT_TAG,
            message: ` ${name} has left the game.`,
            isNotification: true,
        });
    });
});
setInterval(() => {
    game.update();
    game.sendState();
}, FRAME_RATE);
httpServer.listen(PORT, () => {
    console.log(`Starting server on port ${PORT}`);
});
