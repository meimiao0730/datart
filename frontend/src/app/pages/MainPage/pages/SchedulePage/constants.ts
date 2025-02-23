import { FormValues } from './types';
export enum JobTypes {
  Email = 'EMAIL',
  WeChart = 'WECHART',
}

export enum FileTypes {
  Excel = 'EXCEL',
  Image = 'IMAGE',
}
export const JOB_TYPES_OPTIONS = [
  { label: '邮箱', value: JobTypes.Email },
  { label: '微信', value: JobTypes.WeChart },
];
export const FILE_TYPE_OPTIONS = [
  // { label: 'Excel', value: FileTypes.Excel },
  { label: '图片', value: FileTypes.Image },
];
export const WECHART_FILE_TYPE_OPTIONS = [
  { label: '图片', value: FileTypes.Image },
];

export enum TimeModes {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}
export enum VizTypes {
  StoryBoard = 'STORYBOARD',
}

// http://emailregex.com/
export const EMAIL_REG =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const DEFAULT_VALUES: FormValues = {
  jobType: JobTypes.Email,
  type: [FileTypes.Image],
  imageWidth: 1920,
  periodUnit: TimeModes.Minute,
  hour: 0,
  minute: 10,
  day: 1,
  month: 1,
  cronExpression: ' 0 0 0 * * ?',
  textContent: '',
};

export const DefaultSchedulePeriodExpression: {
  [key in TimeModes]: string;
} = {
  // Every 10 minutes
  [TimeModes.Minute]: '0 */10 * * * ?',

  // At second :00 of minute :00 of every hour
  [TimeModes.Hour]: '0 0 * * * ?',

  // At 00:00:00am every day
  [TimeModes.Day]: '0 0 0 * * ?',

  // At 00:00:00am, on every Monday, every month
  [TimeModes.Week]: '0 0 0 ? * 1',

  // At 00:00:00am, on the 1st day, every month
  [TimeModes.Month]: '0 0 0 1 * ?',

  // At 00:00:00am, on the 1st day, in January
  [TimeModes.Year]: '0 0 0 1 1 ?',
};

export enum LogStatus {
  S1 = 1,
  S3 = 3,
  S7 = 7,
  S15 = 15,
}

export const LOG_STATUS_TEXT = {
  [LogStatus.S1]: '任务执行',
  [LogStatus.S3]: '配置解析',
  [LogStatus.S7]: '数据获取',
  [LogStatus.S15]: '发送',
};
export const JOB_TYPE_TEXT = {
  [JobTypes.Email]: '邮箱',
  [JobTypes.WeChart]: '微信',
};
