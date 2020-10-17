interface show {
    name: string;
    season: number;
    pathName?: string;
    tvdbResponse?: tvdbResponse;
}

interface tvdbResponse {
    id: string | undefined;
    seriesName: string;
}

export { tvdbResponse, show };