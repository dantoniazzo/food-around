export interface IErrorResponse {
  data: {
    errors: IError[];
  };
}

export interface IError {
  code: number;
  message: string;
  title: string;
}
