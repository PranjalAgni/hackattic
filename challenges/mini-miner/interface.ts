type tuple = [string, number];

export interface IBlock {
  data: tuple[];
  nonce: null | number;
}
export interface IData {
  difficulty: number;
  block: IBlock;
}

export interface IMessage {
  nonce: number;
}
