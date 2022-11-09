export interface IData {
  image_url: string;
}

export interface Point {
  x: number;
  y: number;
  count: number;
  estimatedModuleSize: number;
}

export interface QrData {
  result: string;
  points: Point[];
}

export interface IMessage {
  code: string;
}
