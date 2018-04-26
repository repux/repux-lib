export class FileWriterInterface {
    init() {
        // Overwrite me
    }
    static async isSupported() {
        // Overwrite me
    }

    write(data) {
        // Overwrite me
    }

    getFileURL() {
        // Overwrite me
    }
}
