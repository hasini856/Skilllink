export const listToText = (items) => (Array.isArray(items) ? items.join(', ') : '');

export const textToList = (text) =>
  text
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
