

// This map will hold the information about,
// the page ids and the relations between them.
const PageTreeMap = {};

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

/**
 * Will create a new page tree where the parent and child relations will be correct and some extras.
 * @param  {Object} node                  @see https://www.gatsbyjs.com/docs/node-apis/#onCreateNode
 * @param  {Object} actions               @see https://www.gatsbyjs.com/docs/node-apis/#onCreateNode
 * @param  {Function} createContentDigest @see https://www.gatsbyjs.com/docs/node-apis/#sourceNodes
 */
async function createPageTree({ node, actions, createContentDigest, reporter }) {
  // only proceed if is SitePage
  if (node.internal.type !== 'SitePage') return;

  /**
   * @see https://www.gatsbyjs.com/docs/actions/#createNode
   * @see https://www.gatsbyjs.com/docs/actions/#createParentChildLink
   */
  const { createNode, createParentChildLink } = actions;

  // get relevant node informations.
  const { id, path } = node;

  // put new data together
  const pageTreeId = path !== '/' ? transformPageID(id) : transformPageID('SitePage /homepage/');
  const pathRaw = path;
  const pathNoTrail = path !== '/' ? path.slice(0, -1) : path;
  const name = path !== '/' ? normalizePathToPageName(path) : 'Homepage';

  const pageNesting = pathNoTrail.slice(1).split('/');
  const isRootPage = pageNesting.length === 1;

  const pageTreeNode = {
    id: pageTreeId,
    isRootPage,
    name,
    pathRaw,
    pathNoTrail,
    internal: { type: 'PageTree' }
  };
  pageTreeNode.internal.contentDigest = createContentDigest(pageTreeNode);

  if (isRootPage) {
    PageTreeMap[pageNesting[0]] = pageTreeNode;
  } else {
    createParentChildLink({ parent: PageTreeMap[pageNesting[0]], child: pageTreeNode });
    PageTreeMap[pageNesting[pageNesting.length - 1]] = pageTreeNode;
  }

  createNode(pageTreeNode);
}

exports.onCreateNode = createPageTree;
