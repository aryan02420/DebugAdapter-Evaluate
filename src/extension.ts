import * as vscode from 'vscode';
import EvaluateCommand from './commands/evaluate';

const commands = [
	EvaluateCommand
];

export function activate(context: vscode.ExtensionContext) {
	for (const {id, handler} of commands) {
		context.subscriptions.push(vscode.commands.registerCommand(id, handler));
	}
}

export function deactivate() {}
