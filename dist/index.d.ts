export interface tibberConnectorOptions {
    token: string;
    homeId: string | string[];
    onData?: Function;
    onError?: Function;
    ws?: WebSocket;
}
declare class tibberConnector {
    private homeId;
    private onData;
    private onError;
    private link;
    private client;
    constructor(options: tibberConnectorOptions);
    start: () => void;
}
export default tibberConnector;
