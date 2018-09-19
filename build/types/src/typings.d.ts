declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'threads' {
  export interface Thread {
    send(params: any[] | string): void;

    on(eventName: string, handler: (data: any) => any): void;

    kill(): void;
  }

  export function spawn(threadBody: any): Thread;
}

declare module 'ipfs-api' {
  export type IpfsFileHash = string;

  export interface IpfsFile {
    hash: IpfsFileHash;
  }

  export interface IpfsFileContent {
    content: Uint8Array;
  }

  export interface IPfsFiles {
    add(data: Buffer, callback: (error: string, files: IpfsFile[]) => void): void;

    get(hash: IpfsFileHash, callback: (error: string, files: IpfsFileContent[]) => void): void;
  }

  export interface IpfsConfig {
    host: string;
    port: string;
    protocol: string;
  }

  export default class IpfsAPI {
    files: IPfsFiles;

    constructor(ipfsConfig: IpfsConfig);
  }
}

interface TextDecodeOptions {
  stream?: boolean;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecoder {
  decode(input?: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array |
    Float64Array | DataView | ArrayBuffer | null, options?: TextDecodeOptions): string;
}

declare var TextDecoder: {
  prototype: TextDecoder;
  new(label?: string, options?: TextDecoderOptions): TextDecoder;
};

interface TextEncoder {
  encode(input?: string): Uint8Array;
}

declare var TextEncoder: {
  prototype: TextEncoder;
  new(): TextEncoder;
};
