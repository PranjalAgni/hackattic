export interface IPbkdf2Config {
  rounds: number;
  hash: string;
}

export interface IScryptConfig {
  N: number;
  r: number;
  p: number;
  buflen: number;
  _control: string;
}

export interface IData {
  password: string;
  salt: string;
  pbkdf2: IPbkdf2Config;
  scrypt: IScryptConfig;
}
