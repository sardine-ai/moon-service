import axios from 'axios'; 
import { PubSub } from '@google-cloud/pubsub';
import { MoonOutboundRequestResponse } from '../../generated/moon_outbound_request_response';

const pubsub = new PubSub();

const publishToPubSub = (moonOutboundRequestResponse: MoonOutboundRequestResponse) => {
  const topic = pubsub.topic("log-moon-outbound-request-response");
  const data = MoonOutboundRequestResponse.encode(moonOutboundRequestResponse).finish();
  topic.publishMessage({data: data})
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
  publishToPubSub({
    url: response.config.url ?? '',
    method: response.config.method ?? '',
    requestParams: response.config.params ?? {},
    clientId: "get from headers",
    sessionKey: "get from headers",
    requestBody: JSON.stringify(response.config.data) ?? '',
    responseBody: JSON.stringify(response.data) ?? '',
    statusCode: response.status,
    timestamp: Date.now() / 1000,
    latencyMillis: 0,
    serviceName: "get from headers",
    requestId: "get from headers",
  })
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("intercepted error response", error);
  return Promise.reject(error);
});

export default axios;