export interface IJobDTO {
  key: string;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: {
    delay: number;
  };
  handle: (data: any) => Promise<void>; // eslint-disable-line
}
