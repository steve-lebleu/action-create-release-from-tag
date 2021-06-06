/**
 * 
 * @param str 
 */
const toChangelog = (str: string): string => {
  return str.split('\n').map(line => (line ? `- ${line}` : '')).join('\n');
};

export { toChangelog }