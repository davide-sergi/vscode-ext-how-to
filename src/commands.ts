import * as vscode from "vscode";
import * as atp from "cube-atp-sdk/dist/export";
import { updatePanel } from "./panel"
const path = require("path");

export class Context {
    static folder: vscode.Uri;
    static cmd: string;
}

export let shellInstance : atp.shell.LocalShell;

export async function configureContext(){
    vscode.window.showInformationMessage("Configure context invoked !");

    const folder : vscode.Uri[] | undefined = await vscode.window.showOpenDialog({ canSelectFiles: false, canSelectMany: false, canSelectFolders: true });
    const cmd : string | undefined = await vscode.window.showInputBox({placeHolder: "Insert a shell command to execute"});

    if(!(folder?.length && cmd)){
        vscode.window.showErrorMessage("Folder or command are not defined");
        throw new Error("Folder or command are not defined");
    }

    Context.folder = folder[0];
    Context.cmd = cmd;

    updatePanel(Context.folder, Context.cmd);
}

export function runCommand(){
    vscode.window.showInformationMessage("Run command invoked !");

    // const terminalInstance = vscode.window.createTerminal("shell-example");
    // terminalInstance.show();
    // terminalInstance.sendText("cd \""+Context.folder.fsPath+"\"");
    // terminalInstance.sendText(Context.cmd);

    if(!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length == 0){
        vscode.window.showErrorMessage("No workspace opened");
        throw new Error("No workspace opened"); 
    }

    const logFile = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, "log_" + (new Date().getTime())+".tmp")
    shellInstance = new atp.shell.LocalShell("shell-example", logFile);
    
    shellInstance.stdout((data) => {
        console.log(data)
    });
    shellInstance.exec(Context.cmd, [], undefined, Context.folder);
    
}