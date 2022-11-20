declare module "qrcode-reader";
declare module "tftp";
declare module "tftp2";

declare namespace Express {
  export interface Request {
    rawBody: string;
  }
}
