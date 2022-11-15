export interface IFile {
  [key: string]: string;
}

export interface IData {
  files: IFile;
}

export interface IRequest {
  stats: {
    remoteAddress: string;
    remotePort: number;
  };
  file: string;
  on: (event: string, callback: (error: { message: string }) => void) => void;
}
