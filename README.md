# PIL2 Language Support for VS Code

A comprehensive Visual Studio Code extension that provides syntax highlighting and language features for the PIL2 Domain Specific Language (DSL).

## Features

This extension provides the following features for PIL2 files (`.pil2`, `.pil`):

### Syntax Highlighting
- **Column Keywords**: `col`, `witness`, `fixed`, `const`, `public`, `private`, `publictable`
- **Data Types**: `fe` (field element), `int`, `string`, `expr`
- **Control Flow**: `function`, `return`, `if`, `else`, `for`, `in`, `while`, `do`, `break`, `continue`, `switch`, `case`, `default`
- **Proof System**: `when`, `once`, `final`, `container`, `air`, `proof`, `airgroup`, `airtemplate`, `on`, `stage`, `challenge`, `aggregate`, `instance`
- **Operators**: 
  - `===` (constraint operator) - **highlighted in distinctive color/bold**
  - `==` (assignment operator)
  - `..` (range operator)
  - `...` (fill operator)
  - `..+..` (arithmetic series)
  - `..*..` (geometric series)
- **Comments**: Line comments (`//`) and block comments (`/* */`)
- **Strings**: Double-quoted strings and template literals (backticks)
- **Numbers**: Decimal and hexadecimal numbers with optional `n` suffix
- **Identifiers**: Variable references (`&variable`), decorators (`@metadata`)
- **Preprocessor**: `include`, `require`, `#pragma` directives

### Language Features
- **Hover Information**: Hover over PIL2 keywords to see documentation
- **Go to Definition**: Click on function names and column declarations to navigate to their definitions
- **Auto-completion**: IntelliSense support for PIL2 keywords, types, operators, and constructs
- **Signature Help**: Parameter hints for function declarations and column definitions
- **Auto-closing**: Automatic closing of brackets, parentheses, and quotes
- **Code Folding**: Fold code blocks and comments
- **Smart Indentation**: Automatic indentation based on code structure

### Special Constraint Highlighting
- **Syntax Scope**: The `===` operator has a unique scope: `entity.name.function.constraint.pil2`
- **Works with Any Theme**: You can add constraint highlighting to your favorite theme

#### 🎨 How to Add Green Constraint Highlighting:

**Option A: For Dark+ Theme Specifically**
1. **Keep using "Dark+ (default dark)" theme** (don't change your theme!)
2. **Open Settings**: File → Preferences → Settings (Ctrl+,)
3. **Search**: "token color customizations"
4. **Click**: "Edit in settings.json"
5. **Add this configuration**:

```json
{
    "editor.tokenColorCustomizations": {
        "[Dark+ (default dark)]": {
            "textMateRules": [
                {
                    "scope": "entity.name.function.constraint.pil2",
                    "settings": {
                        "foreground": "#80FF00",
                        "fontStyle": "bold"
                    }
                }
            ]
        }
    }
}
```

**Option B: For Any Theme**
Replace `[Dark+ (default dark)]` with your theme name, or remove the theme brackets to apply to all themes:

```json
{
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": "entity.name.function.constraint.pil2",
                "settings": {
                    "foreground": "#80FF00",
                    "fontStyle": "bold"
                }
            }
        ]
    }
}
```

**Result**: Your theme stays exactly the same, but `===` operators glow in bright green!

## 📁 File Navigation & Include Support

The extension provides powerful file navigation capabilities:

### Include/Require Patterns Supported
- `include "file.pil2"` - Double quotes (recommended)
- `include 'file.pil'` - Single quotes
- `require "lib/utils.pil2"` - Require with double quotes
- `require 'module.pil'` - Require with single quotes
- `include \`\${std_path}/file.pil\`` - Template strings with variable interpolation
- `require \`\${lib_path}/utils.pil2\`` - Template strings for dynamic paths


### Smart Path Resolution
The extension intelligently searches for included files in:
1. **Relative to current file** - Same directory as the including file
2. **Workspace root** - Top-level project directory  
3. **Common subdirectories**: `include/`, `lib/`, `libs/`, `modules/`
4. **Auto-extension**: Adds `.pil` or `.pil2` if no extension provided

### Navigation Features
- **🔗 Click to Navigate**: Ctrl+Click on include paths to open files
- **📋 Hover Information**: Hover over includes to see file details and template resolution
- **⚠️ Missing File Warnings**: Clear messages when files aren't found
- **🔍 Cross-File Search**: Find symbols across all included files

### Example Usage
```pil2
// Supported include patterns:
include "math_utils.pil2"             // ✅ Double quotes
require "lib/stdlib.pil"              // ✅ Require with double quotes  
require `${std_path}/advanced.pil2`   // ✅ Template with variable (resolves to lib/advanced.pil2)
```

## Example PIL2 Code

```pil2
// Sample PIL2 constraint system
#pragma version "2.0"

include "std.pil2"

// Column declarations
namespace Main(2**10) {
    // Witness columns (provided by prover)
    col witness a, b, c;
    
    // Fixed columns (known at compile time)
    col fixed sel_add, sel_mul;
    
    // Public inputs
    col public public_input[8];
}

// Function definitions
function addGate(fe a, fe b) {
    return a + b;
}

// Polynomial constraints
namespace Main {
    // Addition gate constraint
    sel_add * (a + b - c) === 0;
    
    // Multiplication gate constraint  
    sel_mul * (a * b - c) === 0;
    
    // Copy constraints using ranges
    a[0..7] === public_input[0..7];
}

// AIR definition
air Main {
    stage 0:
        witness a, b, c;
        
    stage 1:
        challenge alpha;
        
    // Polynomial identities
    pol add_check = sel_add * (a + b - c);
    
    // Main constraint
    add_check === 0;
}
```

## Configuration

The extension includes language configuration for:
- Comment toggling (Ctrl+/)
- Bracket matching and auto-closing
- Code folding
- Smart indentation

## Development

To extend or modify this extension:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 to launch a new Extension Development Host window
5. Test your changes with PIL2 files

### Build Commands
- `npm run compile` - Compile the extension
- `npm run watch` - Watch for changes and recompile
- `npm run test` - Run tests
- `npm run package` - Package for production

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This extension is licensed under one of the following options:
- The Apache License, Version 2.0 (see LICENSE-APACHE or http://www.apache.org/licenses/LICENSE-2.0)
- The MIT License (see LICENSE-MIT or http://opensource.org/licenses/MIT)
You may choose either license at your discretion.

## Requirements

- VS Code 1.103.0 or higher

## License

This project is dual-licensed under your choice of:

- **MIT License** (see [LICENSE-MIT](LICENSE-MIT))
- **Apache License 2.0** (see [LICENSE-APACHE](LICENSE-APACHE))

You may use this project under the terms of either license.

**SPDX-License-Identifier**: `MIT OR Apache-2.0`

## Build extension
To build vsix extension:

```
npm run compile
vsce package
```
