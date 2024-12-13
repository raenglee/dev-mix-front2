import { GLOBAL_URL } from './util';
// const url = 'http://192.168.0.61:8080';

const url = `${GLOBAL_URL}/api/v1/notifications`;

export const sse = () => {
  // SSE (Server-Sent Events)
  const token = localStorage.getItem('token');
  const proxySource = new EventSource(`${url}/connect?token=${token}`);

  proxySource.onmessage = (event) => {
    console.log(event.data);
  };
  proxySource.onerror = (error) => {
    console.error('Error:', error);
  };
};
