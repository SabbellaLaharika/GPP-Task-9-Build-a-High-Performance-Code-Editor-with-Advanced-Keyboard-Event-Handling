/**
 * Simple Regex-based Tokenizer for JavaScript and other languages
 * 
 * This is a lightweight tokenizer for demonstration purposes.
 * It is not a full parser and may have edge cases.
 */

const KEYWORDS = new Set([
    // JavaScript / TypeScript
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally',
    'throw', 'new', 'class', 'extends', 'super', 'this', 'import', 'export',
    'from', 'default', 'async', 'await', 'void', 'typeof', 'instanceof', 'in',
    'of', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'interface',
    'type', 'implements', 'declare', 'namespace', 'enum',

    // C / C++ / Java / C#
    'int', 'float', 'double', 'char', 'string', 'bool', 'boolean', 'short', 'long',
    'signed', 'unsigned', 'struct', 'union', 'void', 'static', 'public', 'private',
    'protected', 'final', 'virtual', 'override', 'abstract', 'volatile', 'transient',
    'synchronized', 'native', 'throws', 'package', 'namespace', 'using',

    // Python
    'def', 'elif', 'pass', 'None', 'True', 'False', 'and', 'or', 'not', 'is',
    'lambda', 'global', 'nonlocal', 'print', 'exec', 'with', 'yield',

    // Go
    'func', 'package', 'chan', 'go', 'select', 'defer', 'map', 'struct', 'interface',

    // Rust
    'fn', 'mut', 'pub', 'impl', 'trait', 'match', 'loop', 'unsafe', 'where', 'crate',

    // General
    'main', 'args', 'console', 'log', 'System', 'out', 'println'
]);

// Order matters: checks are performed sequentially
const TOKEN_TYPES = [
    { type: 'comment', regex: /\/\/.*|\/\*[\s\S]*?\*\// },
    { type: 'string', regex: /(['"`])(?:\\.|(?!\1)[^\\\r\n])*\1/ },
    { type: 'number', regex: /\b\d+(\.\d+)?\b/ },
    { type: 'keyword', regex: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/ },
    { type: 'operator', regex: /[+\-*/%=&|<>!^~?:]+/ },
    { type: 'punctuation', regex: /[(){}[\],.;]/ },
    { type: 'whitespace', regex: /\s+/ }
];

export const tokenize = (code) => {
    const tokens = [];
    let remaining = code;

    while (remaining.length > 0) {
        let match = null;
        let tokenType = 'text';

        for (const { type, regex } of TOKEN_TYPES) {
            const result = remaining.match(new RegExp(`^(${regex.source})`));
            if (result) {
                match = result[0];
                tokenType = type;

                // Special check for keywords vs identifiers
                if (type === 'keyword' && !KEYWORDS.has(match)) {
                    tokenType = 'identifier'; // It's just a variable/function name
                }
                break;
            }
        }

        if (match) {
            tokens.push({ type: tokenType, value: match });
            remaining = remaining.substring(match.length);
        } else {
            // If no match, consume one character as text to avoid infinite loop
            tokens.push({ type: 'text', value: remaining[0] });
            remaining = remaining.substring(1);
        }
    }

    return tokens;
};
