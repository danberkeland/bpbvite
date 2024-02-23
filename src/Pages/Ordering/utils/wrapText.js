/**
 * 
 * @param {String} s - Input String 
 * @param {Int} w - Column width; Max # of characters per line 
 * @returns String with newlines inserted 
 */
export const wrapText = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);
