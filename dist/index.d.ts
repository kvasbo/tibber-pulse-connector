declare class tibberConnector {
    private homeId;
    private onData;
    private link;
    private client;
    constructor(token: string, homeId: string, onData: Function, ws?: WebSocket);
    start: () => void;
}
export default tibberConnector;
