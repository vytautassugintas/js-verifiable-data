export interface IIPFSAddResult {
  path: string;
  hash: string;
  size: number;
}

export interface IIPFSClient {
  add(content: any): Promise<IIPFSAddResult>;
  cat(ipfsPath: string): Promise<any>;
}
