# Action Sequences

Action Sequences adds a dedicated Activity Bar view for running multi-step VS Code command workflows with one click.

Define named sequences in settings, then run them from the Sequences panel.

## Features

- Adds an Activity Bar container named Action Sequences.
- Shows configured sequences in a tree view.
- Runs commands in order with progress notifications.
- Includes quick actions to open sequence settings and refresh the list.

## Usage

1. Open Settings JSON.
2. Configure `actionsExtension.sequences`.
3. Open the Action Sequences view from the Activity Bar.
4. Click a sequence to run it.

Example configuration:

```json
"actionsExtension.sequences": [
	{
		"name": "Format & Save",
		"commands": [
			"editor.action.formatDocument",
			"workbench.action.files.save"
		]
	},
	{
		"name": "Reload Window",
		"commands": [
			"workbench.action.reloadWindow"
		]
	}
]
```

## Extension Settings

This extension contributes the following setting:

- `actionsExtension.sequences`: Array of sequence objects. Each sequence requires:
	- `name`: Display name.
	- `commands`: List of VS Code command IDs to execute in order.

## Notes

- Commands are executed sequentially.
- If a command fails, VS Code handles the error based on that command's behavior.

## Release Notes

### 0.0.1

- Initial release of Action Sequences.
