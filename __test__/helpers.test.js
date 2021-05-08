/* eslint no-undef: 0 */

const {
  transformPageID,
  capitalizeFirstLetter,
  normalizePathToPageName,
  capitalizeFirstLetterInAllWords,
  transformAllWhitespaceWithMinus,
  transformUmlauts
} = require('../src/helpers');

test('transformPageID check', () => {
  expect(transformPageID('SitePage /about-us/')).toMatch(/PageTree-about-us-id-[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i);
});

test('capitalizeFirstLetter check', () => {
  expect(capitalizeFirstLetter('test string')).toBe('Test string');
});

test('normalizePathToPageName check', () => {
  expect(normalizePathToPageName('/about-us/')).toBe('About us');
});

test('capitalizeFirstLetterInAllWords check', () => {
  expect(capitalizeFirstLetterInAllWords('about us')).toBe('About Us');
  expect(capitalizeFirstLetterInAllWords('about-us')).toBe('About-us');
  expect(capitalizeFirstLetterInAllWords('about - us')).toBe('About - Us');
});

test('transformAllWhitespaceWithMinus check', () => {
  expect(transformAllWhitespaceWithMinus('/about us     1/')).toBe('/about-us-1/');
  expect(transformAllWhitespaceWithMinus('/about us/')).toBe('/about-us/');
  expect(transformAllWhitespaceWithMinus('/about  us  test     test/')).toBe('/about-us-test-test/');
});

test('transformUmlauts check', () => {
  expect(transformUmlauts('/über uns/')).toBe('/ueber uns/');
  expect(transformUmlauts('/ueber uns/', true)).toBe('/über uns/');
  expect(transformUmlauts('/Über uns/')).toBe('/UEber uns/');
  expect(transformUmlauts('/UEber uns/', true)).toBe('/Über uns/');
  expect(transformUmlauts('/Grüße von mir/')).toBe('/Gruesse von mir/');
  expect(transformUmlauts('/Gruesse von mir/', true)).toBe('/Grüsse von mir/');
});
