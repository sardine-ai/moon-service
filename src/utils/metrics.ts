/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatsD } from 'hot-shots';
import Logger from '@/loaders/logger';

export const dogstatsd = new StatsD({
  port: 8125
});

export const functionCounterWrapper = <F extends (...args: any[]) => any>(
  fn: F,
  metric: string
): F => {
  return <F>function (...args: any[]) {
    dogstatsd.increment(metric);
    const result = fn(...args);
    return result;
  };
};

export const functionTimerWrapper = <F extends (...args: any[]) => any>(
  fn: F,
  methodName: string
): F => {
  return <F>function (...args: any[]) {
    const startTime = new Date();
    let result: any;
    try {
      result = fn(...args);
    } finally {
      const endTime = new Date();
      const executionTime =
        endTime.getMilliseconds() - startTime.getMilliseconds();
      Logger.info(`${methodName} ran in ${executionTime} milliseconds`);
    }
    return result;
  };
};
