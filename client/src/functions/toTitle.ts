

function toTitle(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default toTitle;