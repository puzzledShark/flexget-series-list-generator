interface profile {
    flexgetSavePath: string;
    flexgetTab: string;
    appConfig: appConfig;
    concurrentSearches: number;
}

interface appConfig {
    oldOutput: string;
    fileNameOutput: string;
}

export { profile, appConfig };