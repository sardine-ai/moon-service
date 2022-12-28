import axios from 'axios'; 
import { PubSub, Encodings } from '@google-cloud/pubsub';

const publishToPubSub = async (
  projectId,
  topicNameOrId,
  subscriptionName
) => {
  const pubsub = new PubSub({projectId});
  // Creates a new topic
  const [topic] = await pubsub.createTopic(topicNameOrId);

}

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log("intercepted config", config);
  return config;
}, function (error) {
  // Do something with request error
  console.log("intercepted error", error);
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  console.log("intercepted response", response);
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("intercepted error response", error);
  return Promise.reject(error);
});

export default axios;