/** A changelog line without its inline markup: `<kbd>B</kbd>` → "B", [link](url) → "link". */
export const plainText = (text: string) =>
  text
    .replace(/<kbd>(.*?)<\/kbd>/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1");
