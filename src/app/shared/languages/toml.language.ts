import { Language } from "./language";

export const tomlLanguage: Language = {
    id: 'toml',
    extensions: ['.toml', '.conf'],
    aliases: ['Toml', 'toml'],
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
        root: [
            // sections
            [/^(\s*)\[+[^\]]*\]+/, 'metatag'],

            // keys
            [/(^[\w-]+)(\s*)(\=)/, ['key', '', 'delimiter']],

            // whitespace
            { include: '@whitespace' },

            // numbers
            [/\d+/, 'number'],

            // strings: recover on non-terminated strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/"/, 'string', '@string."'],
            [/'/, 'string', "@string.'"]
        ],

        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/.*[#;].*$/, 'comment']
        ],

        string: [
            [/[^\\"']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [
                /["']/,
                {
                    cases: {
                        '$#==$S2': { token: 'string', next: '@pop' },
                        '@default': 'string'
                    }
                }
            ]
        ]
    },
}
