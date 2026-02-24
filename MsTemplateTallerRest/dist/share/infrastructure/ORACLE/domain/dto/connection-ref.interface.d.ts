export interface ConnectionRef {
    alias: string;
    close: () => Promise<void>;
    getStatistics(): any;
}
