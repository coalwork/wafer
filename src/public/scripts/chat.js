import { io } from 'https://cdn.socket.io/4.7.4/socket.io.esm.min.js';

const socket = io();

addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const chatDisplay = document.getElementById('chat-display');

  socket.emit('chat-repopulate', repopulateChatDisplay);

  chatInput.addEventListener('keyup', ({ key }) => {
    if (key !== 'Enter') return;

    const startTime = performance.now();
    socket.emit('chat-sent', {
      message: chatInput.value,
      created: new Date
    }, chatsCache => {
      console.log(`received in ${performance.now() - startTime} ms`);
      repopulateChatDisplay(chatsCache);
    });

    chatInput.value = '';
  });

  function repopulateChatDisplay(chats) {
    chatDisplay.textContent = '';
    for (let i = chats.length - 1; i >= 0; i--) {
      const chat = chats[i];
      if (chat === null) continue;
      chatDisplay.append(generateChatElement(chat));
    }
  }

  function generateChatElement(chat) {
    const timeTag = document.createElement('span');
    timeTag.classList.add('time-tag');
    timeTag.setAttribute('title', new Date(chat.created));
    timeTag.textContent = new Date(chat.created).toLocaleTimeString();

    const authorTag = document.createElement('b');
    authorTag.classList.add('author-tag');
    authorTag.textContent = chat.author;
    
    const chatElement = document.createElement('article');
    chatElement.classList.add('chat-message');
    chatElement.append(timeTag, authorTag, chat.message);
    return chatElement;
  }
});
