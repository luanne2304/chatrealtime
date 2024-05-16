import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:8800';
const socket = io.connect(ENDPOINT);

export default socket;
