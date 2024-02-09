import { Server } from 'socket.io';

import server from '../server';
import bind from './socketio-passport-bind';

export interface UserChat {
  message: string,
  created: Date
}

export interface CachedChat extends UserChat {
  author: string,
  received: Date
}

const chatsCache: CachedChat[] = [];

const io = new Server(server, {
  serveClient: false
});

bind(io);

io.on('connection', socket => {
  socket.on('chat-sent', (userChat: any, callback) => {
    if (!implementsUserChat(userChat)) return;

    const cachedChat = {
      ...userChat,
      author: (<any> socket.request).user.name,
      received: new Date
    };
    chatsCache.unshift(cachedChat);
    chatsCache.length = 150;
    callback(chatsCache);
  });

  socket.on('chat-repopulate', callback => callback(chatsCache));
});

export function implementsUserChat(chat: any): chat is UserChat {
  const requiredProperties = ['message', 'created'];

  return requiredProperties.every(property => chat.hasOwnProperty(property));
}
