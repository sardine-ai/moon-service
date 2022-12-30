import axios from 'axios';
import { PubSub } from '@google-cloud/pubsub';
import { MoonOutboundRequestResponse } from '../../generated/moon_outbound_request_response';
import logger from '../../loaders/logger';

const pubsub = new PubSub();

const publishToPubSub = (
  moonOutboundRequestResponse: MoonOutboundRequestResponse
) => {
  const topic = pubsub.topic('log-moon-outbound-request-response');
  const data = MoonOutboundRequestResponse.encode(
    moonOutboundRequestResponse
  ).finish();
  topic.publishMessage({ data: data });
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    logger.info(`Sending request to ${config.url}`, config);
    return config;
  },
  function (error) {
    // Do something with request error
    logger.error(`Error sending request`, error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    logger.info(`Response from ${response.config.url}`, response);
    publishToPubSub({
      url: response.config.url ?? '',
      method: response.config.method ?? '',
      requestParams: response.config.params ?? {},
      clientId: 'get from headers',
      sessionKey: 'get from headers',
      requestBody: JSON.stringify(response.config.data) ?? '',
      responseBody: JSON.stringify(response.data) ?? '',
      statusCode: response.status,
      timestamp: Date.now() / 1000,
      latencyMillis: 0,
      serviceName: 'get from headers',
      requestId: 'get from headers'
    });
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    logger.error(`Error getting response`, error);
    publishToPubSub({
      url: error.config.url ?? '',
      method: error.config.method ?? '',
      requestParams: error.config.params ?? {},
      clientId: 'get from headers',
      sessionKey: 'get from headers',
      requestBody: JSON.stringify(error.config.data) ?? '',
      responseBody: JSON.stringify(error.data) ?? '',
      statusCode: error.status,
      timestamp: Date.now() / 1000,
      latencyMillis: 0,
      serviceName: 'get from headers',
      requestId: 'get from headers'
    });
    return Promise.reject(error);
  }
);

export default axios;
