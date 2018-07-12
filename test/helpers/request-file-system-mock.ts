export enum WriteStatus {
  PENDING,
  FINISHED
}

export const FILE_URL = 'TEST_FILE_URL';

export function mockRequestFileSystem() {
  // @ts-ignore
  window.requestFileSystem = (storageType, size, onSuccess) => onSuccess({
    root: {
      getFile: (fileName, options, callback) => {
        if (callback) {
          callback(<any> {
            toURL: () => FILE_URL,
            createWriter: (cbk: any) => cbk({
              truncate: () => {
              },
              write: function () {
                this.status = WriteStatus.PENDING;
                setTimeout(() => {
                  this.status = WriteStatus.FINISHED;
                  this.onwriteend();
                }, 10);
              }
            })
          })
        }
      }
    }
  });
}
