import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
const logger = new Logger();

const axiosClient = axios.create({
  // baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  //@ts-ignore
  function (config: AxiosRequestConfig) {
    const opition = {
      url: config.url,
      body: config.data,
      params: config.params,
    };
    logger.verbose('[AXIOS - REQUEST]', opition);

    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    logger.verbose('[AXIOS - RESPONSE]', response.data);
    return response.data;
  },
  function (error: AxiosError) {
    logger.error('[AXIOS - ERROR]', error.response.data);

    return Promise.reject(error.response?.data);
  },
);
export default axiosClient;
