import * as vscode from 'vscode';
import type { Command } from './types';

const getExpressionInput = async () => {
  const inputOptions: vscode.InputBoxOptions = {
    prompt: 'Expression',
    title: 'Execute in Debugger',
    placeHolder: '1 + 1',
  };
  const inputExpression = (await vscode.window.showInputBox(inputOptions));
  return inputExpression;
};

// https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Evaluate
const evaluate = async (session: vscode.DebugSession, expression: string) => {
  const evaluateArgs = {
    expression,
    context: 'repl',
  };
  const { result } = await session.customRequest('evaluate', evaluateArgs);
  return result;
};

const command: Command = {
  id: 'debugadapter-evaluate.evaluate',
  handler: async (expression?: string) => {
    // check if an active debug session exists
    const debugSession = vscode.debug.activeDebugSession;
    if (debugSession === undefined) {
      vscode.window.showErrorMessage('No active debug session. Start debugging first.');
      return;
    }

    // get input expression from args or thru UI
    expression = expression || await getExpressionInput();
    if (expression === undefined) { return; }

    // evaluate
    vscode.debug.activeDebugConsole.appendLine(`→ ${expression}`);
    const result = await evaluate(debugSession, expression);
    vscode.debug.activeDebugConsole.appendLine(`← ${result}`);
  }
};

export default command;