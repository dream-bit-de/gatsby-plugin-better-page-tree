const { transformPageID, capitalizeFirstLetter, normalizePathToPageName } = require('../src/helpers');

test('transformPageID check', () => {
  expect(transformPageID('SitePage /about-us/')).toMatch(/PageTree-about-us-id-[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i);
});

test('capitalizeFirstLetter check', () => {
  expect(capitalizeFirstLetter('test string')).toBe('Test string');
});

test('normalizePathToPageName check', () => {
  expect(normalizePathToPageName('/about-us/')).toBe('About us');
});
