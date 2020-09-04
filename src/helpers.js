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
  normalizePathToPageName
};
