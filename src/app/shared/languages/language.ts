export interface Language {
    id: string,
    extensions: string[],
    aliases: string[],
    escapes: RegExp,
    tokenizer: {[name: string]: monaco.languages.IMonarchLanguageRule[]},
}
