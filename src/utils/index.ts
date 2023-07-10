const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const generateRegex = (find: string) => {
  return new RegExp(escapeRegExp(find), "gmi");
}

export {
  escapeRegExp,
  generateRegex
}