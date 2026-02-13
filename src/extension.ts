// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// PIL2 Language Server and Features
class PIL2HoverProvider implements vscode.HoverProvider {
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			return undefined;
		}

		const word = document.getText(wordRange);
		
		// PIL2 specific hover information
		const hoverInfo: { [key: string]: string } = {
			// Column types
			'col': 'PIL2 column declaration',
			'witness': 'PIL2 witness column - values provided by the prover',
			'fixed': 'PIL2 fixed column - values known at compile time',
			'const': 'PIL2 constant value',
			'public': 'PIL2 public input column',
			'private': 'PIL2 private column',
			'publictable': 'PIL2 public table declaration',
			
			// Data types
			'fe': 'PIL2 field element type',
			'int': 'PIL2 integer type',
			'string': 'PIL2 string type',
			'expr': 'PIL2 expression type',
			
			// Control flow
			'if': 'PIL2 conditional statement',
			'else': 'PIL2 else clause',
			'for': 'PIL2 for loop',
			'while': 'PIL2 while loop',
			'function': 'PIL2 function declaration',
			'return': 'PIL2 return statement',
			
			// Proof system keywords
			'proof': 'PIL2 proof declaration',
			'air': 'PIL2 AIR (Algebraic Intermediate Representation)',
			'airgroup': 'PIL2 AIR group declaration',
			'airtemplate': 'PIL2 AIR template',
			'challenge': 'PIL2 challenge value from verifier',
			'stage': 'PIL2 execution stage',
			'instance': 'PIL2 instance declaration',
			'aggregate': 'PIL2 aggregation operation',
			
			// Special operators
			'===': 'PIL2 constraint operator - creates a polynomial constraint',
			'<==': 'PIL2 constraint and witness generator operator - creates a polynomial constraint and define how calculate witness',
			'==': 'PIL2 assignment operator',
			'..': 'PIL2 range operator',
			'...': 'PIL2 fill operator',
			'..+..': 'PIL2 arithmetic series range operator',
			'..*..': 'PIL2 geometric series range operator'
		};

		if (hoverInfo[word]) {
			const markdown = new vscode.MarkdownString(`**${word}**\n\n${hoverInfo[word]}`);
			return new vscode.Hover(markdown, wordRange);
		}

		return undefined;
	}
}

class PIL2DefinitionProvider implements vscode.DefinitionProvider {
	provideDefinition(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
		const wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			return undefined;
		}

		const word = document.getText(wordRange);
		
		// Search for PIL2 function definitions, column declarations, etc.
		const text = document.getText();
		
		// Look for function definitions
		const functionRegex = new RegExp(`function\\s+${word}\\s*\\(`, 'g');
		let match = functionRegex.exec(text);
		
		if (match) {
			const definitionPosition = document.positionAt(match.index);
			return new vscode.Location(document.uri, definitionPosition);
		}
		
		// Look for column declarations
		const columnRegex = new RegExp(`(col\\s+(witness|fixed)|const\\s+(int|expr|fe)|public|private)\\s+${word}\\b`, 'g');
		match = columnRegex.exec(text);
		
		if (match) {
			const definitionPosition = document.positionAt(match.index);
			return new vscode.Location(document.uri, definitionPosition);
		}

		return undefined;
	}
}

class PIL2CompletionProvider implements vscode.CompletionItemProvider {
	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.CompletionContext
	): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
		const completionItems: vscode.CompletionItem[] = [];

		// PIL2 column keywords
		const columnKeywords = ['col', 'witness', 'fixed', 'const', 'public', 'private', 'publictable'];
		columnKeywords.forEach(keyword => {
			const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
			item.documentation = `PIL2 ${keyword} declaration`;
			completionItems.push(item);
		});

		// PIL2 data types
		const types = ['fe', 'int', 'string', 'expr'];
		types.forEach(type => {
			const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
			item.documentation = `PIL2 ${type} type`;
			completionItems.push(item);
		});

		// PIL2 control flow keywords
		const controlKeywords = ['function', 'return', 'if', 'else', 'for', 'in', 'while', 'do', 'break', 'continue'];
		controlKeywords.forEach(keyword => {
			const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
			item.documentation = `PIL2 ${keyword} statement`;
			completionItems.push(item);
		});

		// PIL2 proof system keywords
		const proofKeywords = ['proof', 'air', 'airgroup', 'airtemplate', 'challenge', 'stage', 'instance', 'aggregate'];
		proofKeywords.forEach(keyword => {
			const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
			item.documentation = `PIL2 ${keyword} declaration`;
			completionItems.push(item);
		});

		// PIL2 special operators
		const operators = [
			{ name: '===', detail: 'constraint operator', description: 'Creates a polynomial constraint' },
			{ name: '<==', detail: 'constraint and witness generator operator', description: 'Creates a polynomial constraint and define how calculate witness' },
			{ name: '==', detail: 'assignment operator', description: 'Assigns a value' },
			{ name: '..', detail: 'range operator', description: 'Creates a range' },
			{ name: '...', detail: 'fill operator', description: 'Fills a range' },
			{ name: '..+..', detail: 'arithmetic series', description: 'Arithmetic progression' },
			{ name: '..*..', detail: 'geometric series', description: 'Geometric progression' }
		];
		
		operators.forEach(op => {
			const item = new vscode.CompletionItem(op.name, vscode.CompletionItemKind.Operator);
			item.detail = op.detail;
			item.documentation = op.description;
			completionItems.push(item);
		});

		// PIL2 preprocessor directives
		const preprocessor = ['include', 'require', '#pragma'];
		preprocessor.forEach(directive => {
			const item = new vscode.CompletionItem(directive, vscode.CompletionItemKind.Keyword);
			item.documentation = `PIL2 ${directive} directive`;
			completionItems.push(item);
		});

		return completionItems;
	}
}

class PIL2SignatureHelpProvider implements vscode.SignatureHelpProvider {
	provideSignatureHelp(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.SignatureHelpContext
	): vscode.ProviderResult<vscode.SignatureHelp> {
		// Find the function call at current position
		const line = document.lineAt(position).text;
		const beforeCursor = line.substring(0, position.character);
		
		// Simple function signature detection for PIL2
		const functionMatch = beforeCursor.match(/(\w+)\s*\(\s*([^)]*)$/);
		if (!functionMatch) {
			return undefined;
		}

		const functionName = functionMatch[1];
		
		// Example function signatures for PIL2 built-ins and common patterns
		const signatures: { [key: string]: vscode.SignatureInformation } = {
			'function': new vscode.SignatureInformation(
				'function name(param1: type, param2: type): returnType',
				'PIL2 function declaration'
			),
			'col': new vscode.SignatureInformation(
				'col name[size]',
				'PIL2 column declaration'
			),
			'witness': new vscode.SignatureInformation(
				'witness name[size]',
				'PIL2 witness column declaration'
			),
			'fixed': new vscode.SignatureInformation(
				'fixed name[size]',
				'PIL2 fixed column declaration'
			),
			'public': new vscode.SignatureInformation(
				'public name[size]',
				'PIL2 public column declaration'
			)
		};

		if (signatures[functionName]) {
			const help = new vscode.SignatureHelp();
			help.signatures = [signatures[functionName]];
			help.activeSignature = 0;
			help.activeParameter = 0;
			return help;
		}

		return undefined;
	}
}

class PIL2DocumentSymbolProvider implements vscode.DocumentSymbolProvider {
	provideDocumentSymbols(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.DocumentSymbol[]> {
		const symbols: vscode.DocumentSymbol[] = [];
		const text = document.getText();
		const lines = text.split('\n');

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Find function definitions
			const functionMatch = line.match(/function\s+(\w+)\s*\(/);
			if (functionMatch) {
				const range = new vscode.Range(i, 0, i, line.length);
				const symbol = new vscode.DocumentSymbol(
					functionMatch[1],
					'function',
					vscode.SymbolKind.Function,
					range,
					range
				);
				symbols.push(symbol);
			}

			// Find column declarations
			const columnMatch = line.match(/(col|witness|fixed|const|public|private)\s+(\w+)/);
			if (columnMatch) {
				const range = new vscode.Range(i, 0, i, line.length);
				const symbol = new vscode.DocumentSymbol(
					columnMatch[2],
					columnMatch[1] + ' column',
					vscode.SymbolKind.Variable,
					range,
					range
				);
				symbols.push(symbol);
			}

			// Find namespace declarations
			const namespaceMatch = line.match(/namespace\s+(\w+)/);
			if (namespaceMatch) {
				const range = new vscode.Range(i, 0, i, line.length);
				const symbol = new vscode.DocumentSymbol(
					namespaceMatch[1],
					'namespace',
					vscode.SymbolKind.Namespace,
					range,
					range
				);
				symbols.push(symbol);
			}

			// Find AIR declarations
			const airMatch = line.match(/air\s+(\w+)/);
			if (airMatch) {
				const range = new vscode.Range(i, 0, i, line.length);
				const symbol = new vscode.DocumentSymbol(
					airMatch[1],
					'air',
					vscode.SymbolKind.Class,
					range,
					range
				);
				symbols.push(symbol);
			}
		}

		return symbols;
	}
}

class PIL2WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {
	async provideWorkspaceSymbols(
		query: string,
		token: vscode.CancellationToken
	): Promise<vscode.SymbolInformation[]> {
		const symbols: vscode.SymbolInformation[] = [];
		
		// Find all PIL2 files in workspace
		const files = await vscode.workspace.findFiles('**/*.{pil2,pil}', '**/node_modules/**');
		
		for (const file of files) {
			if (token.isCancellationRequested) {
				break;
			}

			try {
				const document = await vscode.workspace.openTextDocument(file);
				const text = document.getText();
				const lines = text.split('\n');

				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					
					// Find functions
					const functionMatch = line.match(/function\s+(\w+)\s*\(/);
					if (functionMatch && functionMatch[1].toLowerCase().includes(query.toLowerCase())) {
						const location = new vscode.Location(file, new vscode.Position(i, 0));
						symbols.push(new vscode.SymbolInformation(
							functionMatch[1],
							vscode.SymbolKind.Function,
							'',
							location
						));
					}

					// Find columns
					const columnMatch = line.match(/(col|witness|fixed|const|public|private)\s+(\w+)/);
					if (columnMatch && columnMatch[2].toLowerCase().includes(query.toLowerCase())) {
						const location = new vscode.Location(file, new vscode.Position(i, 0));
						symbols.push(new vscode.SymbolInformation(
							columnMatch[2],
							vscode.SymbolKind.Variable,
							columnMatch[1],
							location
						));
					}

					// Find namespaces
					const namespaceMatch = line.match(/namespace\s+(\w+)/);
					if (namespaceMatch && namespaceMatch[1].toLowerCase().includes(query.toLowerCase())) {
						const location = new vscode.Location(file, new vscode.Position(i, 0));
						symbols.push(new vscode.SymbolInformation(
							namespaceMatch[1],
							vscode.SymbolKind.Namespace,
							'',
							location
						));
					}
				}
			} catch (error) {
				// Skip files that can't be read
			}
		}

		return symbols;
	}
}

class PIL2ReferenceProvider implements vscode.ReferenceProvider {
	async provideReferences(
		document: vscode.TextDocument,
		position: vscode.Position,
		context: vscode.ReferenceContext,
		token: vscode.CancellationToken
	): Promise<vscode.Location[]> {
		const wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			return [];
		}

		const word = document.getText(wordRange);
		const references: vscode.Location[] = [];

		// Find all PIL2 files in workspace
		const files = await vscode.workspace.findFiles('**/*.{pil2,pil}', '**/node_modules/**');
		
		for (const file of files) {
			if (token.isCancellationRequested) {
				break;
			}

			try {
				const doc = await vscode.workspace.openTextDocument(file);
				const text = doc.getText();
				const lines = text.split('\n');

				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					const regex = new RegExp(`\\b${word}\\b`, 'g');
					let match;
					
					while ((match = regex.exec(line)) !== null) {
						const start = new vscode.Position(i, match.index);
						const end = new vscode.Position(i, match.index + word.length);
						references.push(new vscode.Location(file, new vscode.Range(start, end)));
					}
				}
			} catch (error) {
				// Skip files that can't be read
			}
		}

		return references;
	}
}

class PIL2IncludeHoverProvider implements vscode.HoverProvider {
	async provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Hover | undefined> {
		const line = document.lineAt(position);
		const lineText = line.text;

		// Check for include patterns - quoted strings and template strings
		const patterns = [
			/(include|require)\s+"([^"]+)"/,
			/(include|require)\s+'([^']+)'/,
			/(include|require)\s+`([^`]+)`/
		];

		let includePath: string | undefined;
		let matchStart = -1;
		let matchEnd = -1;

		for (const pattern of patterns) {
			const match = lineText.match(pattern);
			if (match) {
				includePath = match[2] || match[1];
				const fullMatch = match[0];
				matchStart = lineText.indexOf(fullMatch);
				matchEnd = matchStart + fullMatch.length;
				
				const cursorChar = position.character;
				if (cursorChar >= matchStart && cursorChar <= matchEnd) {
					break;
				} else {
					includePath = undefined;
				}
			}
		}

		if (!includePath) {
			return undefined;
		}

		// Handle template string interpolation
		let resolvedPath = includePath;
		let isTemplate = false;
		if (resolvedPath.includes('${')) {
			isTemplate = true;
			// Simple template variable resolution
			resolvedPath = resolvedPath
				.replace(/\$\{std_path\}/g, 'lib')
				.replace(/\$\{lib_path\}/g, 'lib')
				.replace(/\$\{include_path\}/g, 'include')
				.replace(/\$\{base_path\}/g, '')
				.replace(/\$\{root\}/g, '')
				.replace(/\$\{([^}]+)\}/g, '$1');
		}

		// Try to find the file using the same logic as the definition provider
		const documentDir = vscode.Uri.joinPath(document.uri, '..');
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

		const possiblePaths = [
			vscode.Uri.joinPath(documentDir, resolvedPath),
			...(resolvedPath.includes('.') ? [] : [
				vscode.Uri.joinPath(documentDir, resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, resolvedPath + '.pil2')
			]),
			...(workspaceFolder ? [
				vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath),
				...(resolvedPath.includes('.') ? [] : [
					vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath + '.pil'),
					vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath + '.pil2')
				])
			] : [])
		];

		for (const path of possiblePaths) {
			try {
				const stat = await vscode.workspace.fs.stat(path);
				if (stat.type === vscode.FileType.File) {
					const relativePath = vscode.workspace.asRelativePath(path);
					const fileSize = (stat.size / 1024).toFixed(1);
					
					const hoverText = new vscode.MarkdownString();
					hoverText.appendMarkdown(`**📁 Include File**\n\n`);
					hoverText.appendMarkdown(`**Path:** \`${relativePath}\`\n\n`);
					if (isTemplate) {
						hoverText.appendMarkdown(`**Original:** \`${includePath}\`\n\n`);
						hoverText.appendMarkdown(`**Resolved:** \`${resolvedPath}\`\n\n`);
					}
					hoverText.appendMarkdown(`**Size:** ${fileSize} KB\n\n`);
					hoverText.appendMarkdown(`*Click to open file*`);
					
					const range = new vscode.Range(
						position.line, 
						matchStart, 
						position.line, 
						matchEnd
					);
					
					return new vscode.Hover(hoverText, range);
				}
			} catch {
				// Continue to next path
			}
		}

		// File not found
		const hoverText = new vscode.MarkdownString();
		hoverText.appendMarkdown(`**⚠️ Include File Not Found**\n\n`);
		hoverText.appendMarkdown(`**Path:** \`${includePath}\`\n\n`);
		hoverText.appendMarkdown(`*File could not be located*`);
		
		const range = new vscode.Range(
			position.line,
			matchStart,
			position.line, 
			matchEnd
		);
		
		return new vscode.Hover(hoverText, range);
	}
}

class PIL2IncludeDefinitionProvider implements vscode.DefinitionProvider {
	async provideDefinition(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Definition | undefined> {
		const line = document.lineAt(position);
		const lineText = line.text;

		// Match include/require with quoted strings and template strings
		const patterns = [
			/(include|require)\s+"([^"]+)"/,           // include "file.pil"
			/(include|require)\s+'([^']+)'/,           // include 'file.pil'  
			/(include|require)\s+`([^`]+)`/            // include `${path}/file.pil`
		];

		let includePath: string | undefined;
		let matchStart = -1;
		let matchEnd = -1;

		// Try each pattern to find the include statement
		for (const pattern of patterns) {
			const match = lineText.match(pattern);
			if (match) {
				includePath = match[2] || match[1]; // Get the captured group with the path
				const fullMatch = match[0];
				matchStart = lineText.indexOf(fullMatch);
				matchEnd = matchStart + fullMatch.length;
				
				// Check if cursor is within the include statement
				const cursorChar = position.character;
				if (cursorChar >= matchStart && cursorChar <= matchEnd) {
					break;
				} else {
					includePath = undefined; // Reset if cursor not in range
				}
			}
		}

		if (!includePath) {
			return undefined;
		}

		// Handle template string interpolation
		let resolvedPath = includePath;
		if (resolvedPath.includes('${')) {
			// Simple template variable resolution
			// Replace common template variables with reasonable defaults
			resolvedPath = resolvedPath
				.replace(/\$\{std_path\}/g, 'lib')
				.replace(/\$\{lib_path\}/g, 'lib')
				.replace(/\$\{include_path\}/g, 'include')
				.replace(/\$\{base_path\}/g, '')
				.replace(/\$\{root\}/g, '')
				.replace(/\$\{([^}]+)\}/g, '$1'); // Replace any other ${var} with just var
		}

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		const documentDir = vscode.Uri.joinPath(document.uri, '..');

		// Comprehensive path resolution strategy
		const possiblePaths = [
			// Exact path as specified (after template resolution)
			vscode.Uri.joinPath(documentDir, resolvedPath),
			
			// Try with common PIL extensions if no extension provided
			...(resolvedPath.includes('.') ? [] : [
				vscode.Uri.joinPath(documentDir, resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, resolvedPath + '.pil2')
			]),
			
			// Try relative to workspace root if available
			...(workspaceFolder ? [
				vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath),
				...(resolvedPath.includes('.') ? [] : [
					vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath + '.pil'),
					vscode.Uri.joinPath(workspaceFolder.uri, resolvedPath + '.pil2')
				])
			] : []),
			
			// Try common subdirectories with original path
			vscode.Uri.joinPath(documentDir, 'include', includePath),
			vscode.Uri.joinPath(documentDir, 'lib', includePath),
			vscode.Uri.joinPath(documentDir, 'libs', includePath),
			vscode.Uri.joinPath(documentDir, 'modules', includePath),
			
			// Try with resolved path in subdirectories
			vscode.Uri.joinPath(documentDir, 'include', resolvedPath),
			vscode.Uri.joinPath(documentDir, 'lib', resolvedPath),
			vscode.Uri.joinPath(documentDir, 'libs', resolvedPath),
			vscode.Uri.joinPath(documentDir, 'modules', resolvedPath),
			
			// Try with extensions in subdirectories
			...(resolvedPath.includes('.') ? [] : [
				vscode.Uri.joinPath(documentDir, 'include', resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, 'include', resolvedPath + '.pil2'),
				vscode.Uri.joinPath(documentDir, 'lib', resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, 'lib', resolvedPath + '.pil2'),
				vscode.Uri.joinPath(documentDir, 'libs', resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, 'libs', resolvedPath + '.pil2'),
				vscode.Uri.joinPath(documentDir, 'modules', resolvedPath + '.pil'),
				vscode.Uri.joinPath(documentDir, 'modules', resolvedPath + '.pil2')
			])
		];

		// Try to find the file
		for (const path of possiblePaths) {
			try {
				const stat = await vscode.workspace.fs.stat(path);
				if (stat.type === vscode.FileType.File) {
					return new vscode.Location(path, new vscode.Position(0, 0));
				}
			} catch {
				// File doesn't exist or can't be accessed, try next path
			}
		}

		// If no file found, show helpful error message
		vscode.window.showWarningMessage(`Could not find included file: ${includePath}`);
		return undefined;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pil2-language-support" is now active!');

	// Register language features for PIL2
	const PIL2_MODE: vscode.DocumentSelector = { language: 'pil2', scheme: 'file' };

	// Register hover provider
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(PIL2_MODE, new PIL2HoverProvider())
	);

	// Register definition provider
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(PIL2_MODE, new PIL2DefinitionProvider())
	);

	// Register completion provider
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(PIL2_MODE, new PIL2CompletionProvider(), '.', '(')
	);

	// Register signature help provider
	context.subscriptions.push(
		vscode.languages.registerSignatureHelpProvider(PIL2_MODE, new PIL2SignatureHelpProvider(), '(', ',')
	);

	// Register document symbol provider for outline view
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider(PIL2_MODE, new PIL2DocumentSymbolProvider())
	);

	// Register workspace symbol provider for Go to Symbol in Workspace
	context.subscriptions.push(
		vscode.languages.registerWorkspaceSymbolProvider(new PIL2WorkspaceSymbolProvider())
	);

	// Register reference provider for Find All References
	context.subscriptions.push(
		vscode.languages.registerReferenceProvider(PIL2_MODE, new PIL2ReferenceProvider())
	);

	// Register include file definition provider for navigating to included files
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(PIL2_MODE, new PIL2IncludeDefinitionProvider())
	);

	// Register include file hover provider for file information
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(PIL2_MODE, new PIL2IncludeHoverProvider())
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('pil2-language-support.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from PIL2 Language Support!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
