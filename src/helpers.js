const { v4: uuidv4 } = require('uuid');

/**
 * Will generate a new ID.
 * @param  {String} id ID from SitePage
 * @return {String}    PageTree-<CleanPagePath>-id-<uuidv4>
 */
function transformPageID(id) {
  let transformedId = id.replace('SitePage', '').replace('/', '').slice(1, -1);
  return `PageTree-${transformedId}-id-${uuidv4()}`;
}

/**
 * Will capitalize the first letter in a given String.
 * @see https://stackoverflow.com/a/53930826/4457744
 * @param  {String} first  First character in the passed string.
 * @param  {Array}  rest   this array contains the rest characters in the given string.
 * @param  {String} locale if needed you can pass the locale code.
 * @return {String}        test page -> Test page
 */
function capitalizeFirstLetter([first, ...rest], locale) {
  return [first.toLocaleUpperCase(locale), ...rest].join('');
}

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @see https://stackoverflow.com/questions/2332811/capitalize-words-in-string/7592235#7592235
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
function capitalizeFirstLetterInAllWords(str, lower = false) {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
}

/**
 * Replaces all Whitespaces in String with minus.
 * @param  {string} str String to be modified
 * @return {string}
 * @usage
 *   transformAllWhitespaceWithMinus('hello world');     // -> 'hello-world'
 *   transformAllWhitespaceWithMinus('Hello World   1');          // -> 'Hello-World-1'
 */
function transformAllWhitespaceWithMinus(str) {
  return str.replace(/\s\s+/g, ' ').replace(/\s/g, '-');
}

// German Umlauts transform to URL Safe (better for SEO).
const _umlautsMap = [
  { code: '\u00C4', value: 'Ä', safe: 'AE' },
  { code: '\u00E4', value: 'ä', safe: 'ae' },
  { code: '\u00D6', value: 'Ö', safe: 'OE' },
  { code: '\u00F6', value: 'ö', safe: 'oe' },
  { code: '\u00DC', value: 'Ü', safe: 'UE' },
  { code: '\u00FC', value: 'ü', safe: 'ue' },
  { code: '\u00DF', value: 'ß', safe: 'ss' }
];

const _unicodeToChar = (text) => text.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
const _umlaute = _umlautsMap.map((u) => [u.safe, _unicodeToChar(u.code)]);

/**
 * Replaces all German Umlauts with SEO safe values.
 * @param  {string} str String to be modified
 * @return {string}
 * @usage
 *   transformUmlauts('Grüße von mir);     // -> 'Gruesse von mir'
 *   transformUmlauts('Ölspuren sind gefährlich');          // -> 'Oelspuren sind gefaehrlich'
 *   transformUmlauts('Gruesse von mir', true);          // -> 'Grüße von mir'
 */
function transformUmlauts(str, restore = false) {
  for (let u = 0; u < _umlaute.length; u++) {
    if (restore) {
      // there is some unwanted behaviour in restore with double s.
      str = _umlaute[u][0] !== 'ss' ? str.replace(_umlaute[u][0], _umlaute[u][1]) : str;
    } else {
      str = str.replace(_umlaute[u][1], _umlaute[u][0]);
    }
  }
  return str;
}

/**
 * Takes the SitePage node path and outputs a readable name.
 * @param  {String} str given path e.g. /about-us/
 * @return {String}     readable string e.g. about us.
 */
function normalizePathToPageName(str) {
  const pagePathSplitted = str.split('/').filter((f) => f !== '');
  const preName = pagePathSplitted[pagePathSplitted.length - 1];
  const normalizedName = preName.replace('-', ' ');

  return capitalizeFirstLetter(normalizedName);
}

module.exports = {
  transformPageID,
  capitalizeFirstLetter,
  normalizePathToPageName,
  capitalizeFirstLetterInAllWords,
  transformAllWhitespaceWithMinus,
  transformUmlauts
};
