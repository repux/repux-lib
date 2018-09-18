import { UserAgent } from '../utils/user-agent';
export declare class FileSize {
    private userAgent;
    constructor(userAgent: UserAgent);
    getMaxFileSize(): Promise<number>;
}
