interface profile {
    flexgetSavePath: string;
    appConfig: appConfig;
}

interface appConfig {
    oldOutput: string;
    fileNameOutput: string;
}

export { profile, appConfig };