// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';
import { runCommand, configureContext, Context } from './commands';
import { openWebview } from './webview';
import { updatePanel } from './panel';
const path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let logFiles : string[] = [];
let watcher : vscode.FileSystemWatcher;

export let contextExt: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
	contextExt = context;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "shell-example" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableRunCommand = vscode.commands.registerCommand('shell-example.runCommand', runCommand);
	let disposableConfigureContext = vscode.commands.registerCommand('shell-example.configureContext', configureContext);
	let disposableOpenWebview = vscode.commands.registerCommand('shell-example.openWebview', openWebview);

	context.subscriptions.push(disposableRunCommand);
	context.subscriptions.push(disposableConfigureContext);
	context.subscriptions.push(disposableOpenWebview);

	const folder = vscode.workspace.workspaceFolders?.[0];
	if (folder) {
		const ptn = new vscode.RelativePattern(folder, '*.tmp');

		watcher = vscode.workspace.createFileSystemWatcher(ptn, false, true, false);
		watcher.onDidCreate(async uri => { 
			logFiles.push(path.basename(uri.fsPath));
			updatePanel(Context.folder, Context.cmd, logFiles);
		});
		watcher.onDidDelete(async uri => { 
			logFiles = logFiles.filter( lf => lf !== path.basename(uri.fsPath));
			updatePanel(Context.folder, Context.cmd, logFiles);
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
