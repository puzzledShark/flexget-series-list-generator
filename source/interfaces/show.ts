interface show {
    domainName: string;
    season: number;
    pathName?: string;
    response?: parserResponse;
}

interface parserResponse {
    id: string | undefined;
    title: string;
}

export { parserResponse, show };