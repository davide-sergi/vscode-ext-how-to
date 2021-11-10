
import * as vscode from "vscode";
import * as atp from "cube-atp-sdk/dist/export";

import { contextExt } from "./extension";
import * as fs from "fs";
import { shellInstance } from "./commands";
const path = require("path");

export function openWebview(){
    const appFolder = path.join(contextExt.extensionUri.fsPath, "webview");
    const htmlPage = path.join(appFolder, "index.html");
    
    const htmlPageContent = fs.readFileSync(htmlPage);

    const app = new atp.ui.editor.EditorWebApp(vscode.Uri.file(appFolder), htmlPageContent.toString(), "shell-example", "Schell example");
    app.onMessage( async (message) => {
        if(message.type === "run_command"){
            await vscode.commands.executeCommand("shell-example.runCommand");
            shellInstance.stdout( e => app.sendMessage(new atp.ui.editor.models.EditorMessage("stdout", undefined, e.toString())));
        } else {
            vscode.window.showErrorMessage("Message type unknown !");
        }
    });

    
}