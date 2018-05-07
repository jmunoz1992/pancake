import * as SRD from "storm-react-diagrams";
export declare class Application {
    protected activeModel: SRD.DiagramModel;
    protected diagramEngine: SRD.DiagramEngine;
    constructor();
    newModel(): void;
    getActiveDiagram(): SRD.DiagramModel;
    getDiagramEngine(): SRD.DiagramEngine;
}
