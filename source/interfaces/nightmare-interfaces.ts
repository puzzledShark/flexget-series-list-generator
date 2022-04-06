interface nightmareConfig {
    show: boolean;
    typeInterval: number;
    x: number;
    y: number;
}

interface nightmareError {
    code: number;
    message: string;
    stack: any;
}


export { nightmareConfig, nightmareError };