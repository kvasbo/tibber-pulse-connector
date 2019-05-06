declare class tibberConnector {
    private homeId;
    private onData;
    private link;
    private client;
    constructor(token: string, homeId: string, onData: Function);
    start: () => void;
}
export default tibberConnector;
//# sourceMappingURL=index.d.ts.map