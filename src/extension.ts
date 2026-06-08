import * as vscode from 'vscode';

interface SequenceConfig {
	name: string;
	commands: string[];
}

class SequenceItem extends vscode.TreeItem {
	constructor(public readonly sequence: SequenceConfig) {
		super(sequence.name, vscode.TreeItemCollapsibleState.None);
		this.tooltip = sequence.commands.join('\n');
		this.description = sequence.commands.length > 1 ? `${sequence.commands.length} commands` : '1 command';
		this.contextValue = 'actionSequence';
	}
}

class SequenceTreeDataProvider implements vscode.TreeDataProvider<SequenceItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<void>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: SequenceItem): vscode.TreeItem {
		return element;
	}

	getChildren(): SequenceItem[] {
		const config = vscode.workspace.getConfiguration('actionsExtension');
		const sequences = config.get<SequenceConfig[]>('sequences', []);
		return sequences.map(s => new SequenceItem(s));
	}
}

async function runSequence(sequence: SequenceConfig): Promise<void> {
	const total = sequence.commands.length;

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `Running sequence: ${sequence.name}`,
			cancellable: false
		},
		async progress => {
			for (const [index, cmd] of sequence.commands.entries()) {
				progress.report({
					message: `Running ${index + 1}/${total}: ${cmd}`,
					increment: 100 / total
				});
				await vscode.commands.executeCommand(cmd);
			}
		}
	);
}

export function activate(context: vscode.ExtensionContext) {
	const treeDataProvider = new SequenceTreeDataProvider();

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('actionsExtension.sequencesView', treeDataProvider),

		vscode.commands.registerCommand('actionsExtension.runSequence', (item: SequenceItem) => {
			runSequence(item.sequence);
		}),

		vscode.commands.registerCommand('actionsExtension.openSequencesSettings', async () => {
			try {
				await vscode.commands.executeCommand('workbench.action.openSettingsJson', {
					revealSetting: {
						key: 'actionsExtension.sequences',
						edit: true
					}
				});
			} catch {
				await vscode.commands.executeCommand('workbench.action.openSettingsJson');
			}
		}),

		vscode.commands.registerCommand('actionsExtension.refreshSequences', () => {
			treeDataProvider.refresh();
		}),

		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('actionsExtension.sequences')) {
				treeDataProvider.refresh();
			}
		})
	);
}

export function deactivate() { }
