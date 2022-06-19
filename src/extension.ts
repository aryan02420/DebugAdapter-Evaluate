import * as vscode from 'vscode';

const commands = [
	{
		id: 'debugadapter-evaluate.evaluate',
		handler: async () => {
			const debugSession = vscode.debug.activeDebugSession;
			if (!debugSession) {
				vscode.window.showErrorMessage('No active debug session. Start debugging first.');
				return;
			}

			const inputOptions: vscode.InputBoxOptions = {
				prompt: 'Expression',
				title: 'Execute in Debugger'
			};
			const inputExpression = (await vscode.window.showInputBox(inputOptions))?.trim();
			if (!inputExpression) {
				return;
			}

			vscode.debug.activeDebugConsole.appendLine(`→ ${inputExpression}`);

			// https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Evaluate
			const evaluateArgs = {
				expression: inputExpression,
				context: 'repl',
			};
			const { result: evalResult } = await debugSession.customRequest('evaluate', evaluateArgs);
			vscode.debug.activeDebugConsole.appendLine(`← ${evalResult}`);
		}
	},
];

export function activate(context: vscode.ExtensionContext) {
	for (const {id, handler} of commands) {
		context.subscriptions.push(vscode.commands.registerCommand(id, handler));
	}
}

export function deactivate() {}
