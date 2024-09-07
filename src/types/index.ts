export type ErrorType = {
  name?: string;
  value?: any;
  code?: number;
  message?: string;
  statusCode?: number;
  keyValue?: { [key: string]: any };
  errors?: DBError[];
};

export type Role = {
  role: "admin" | "user";
};

export type CustomError = {
  statusCode: number;
  msg: string;
};

type DBError = {
  message: string;
  path: string;
  value: any;
  kind: string;
};
