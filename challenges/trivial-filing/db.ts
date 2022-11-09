import { IFile } from "./interface";

export let fileDB: IFile = {};

export const addFiles = (newFiles: IFile) => {
  fileDB = Object.assign({}, fileDB, newFiles);
};
