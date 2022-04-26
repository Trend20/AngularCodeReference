export interface CommonHttpResponse<T> {
  status: number;
  message: string;
  data?: T;
}
