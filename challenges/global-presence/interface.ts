export interface IData {
  presence_token: string;
}

type Protocol = "http" | "https";

export interface IProxy {
  type: Protocol;
  host: string;
  port: number;
}
