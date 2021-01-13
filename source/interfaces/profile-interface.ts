interface profile {
    flexgetSavePath: string;
    flexgetTab: string;
    appConfig: appConfig;
}

interface appConfig {
    oldOutput: string;
    fileNameOutput: string;
}

export { profile, appConfig };