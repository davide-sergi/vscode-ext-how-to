import * as vscode from "vscode";
import * as atp from "cube-atp-sdk/dist/export";
import { Node } from "cube-atp-sdk/dist/ui/Panel";

export class PanelInstance {
    static panel: atp.ui.panel.Panel | undefined
}

export function updatePanel(folder: vscode.Uri | undefined = undefined, cmd: string | undefined = undefined, logs: string[] | undefined = undefined){
    
    // if(!PanelInstance.panel){
    //     PanelInstance.panel = new atp.ui.panel.Panel("shell-example-sub-view", [], "Empty");
    // }

    let nodes : atp.ui.panel.Node[] = [];

    let configChildren = [];
    if(folder){
        configChildren.push(new Node(folder.fsPath, undefined, undefined, undefined, "folder", undefined));
    }
    if(cmd){
        configChildren.push(new Node(cmd, undefined, undefined, undefined, "cmd", undefined));
    }
    nodes.push(new Node("Configuration", undefined, undefined, configChildren, "logs", undefined));


    if(logs){
        let logNodes = logs.map( l => new Node(l, undefined, undefined, undefined, "log", l))
        nodes.push(new Node("Logs", undefined, undefined, logNodes, "logs", undefined));
    }

    PanelInstance.panel = new atp.ui.panel.Panel("shell-example-sub-view", nodes, "Empty");
}