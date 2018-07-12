export interface FileWriterInterface {
  fileName: string;

  fileSize: number;

  init(): Promise<any>;

  write(data: Uint8Array): void;

  getFileURL(): string | undefined;
}
