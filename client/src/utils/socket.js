import { io } from 'socket.io-client';

// Use same host as we serve from, or specify API endpoint
const socket = io('/', {
  autoConnect: false, // We'll connect manually when we have a campaign and token
});

export default socket;
