const { transformPageID, normalizePathToPageName } = require('./src/helpers.js');
// This map will hold the information about,
// the page ids and the relations between them.
const PageTreeMap = {};

// prevent unneeded overwriting.
const _getPageTreeMap = () => PageTreeMap;
const _setPageTreeMap = (key, value) => (PageTreeMap[key] = value);

// more functional.
const _getPageTreeId = (id, path) => (path !== '/' ? transformPageID(id) : transformPageID('SitePage /homepage/'));
const _getPathWithNoSlashAtBeginning = (path) => path.replace(/\//, '');
const _getNormalizedPagename = (path) => (path !== '/' ? normalizePathToPageName(path) : 'Homepage');

const _createPageNode = (id, path, isRoot) => ({
  id: _getPageTreeId(id, path),
  isRootPage: isRoot,
  name: _getNormalizedPagename(path),
  pathRaw: path,
  internal: { type: 'PageTree' }
});

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
  const pathNoSlashBegining = _getPathWithNoSlashAtBeginning(path);
  const pageNesting = pathNoSlashBegining === '/' || pathNoSlashBegining === '' ? ['homepage'] : pathNoSlashBegining.split('/').filter((f) => f !== '');
  const isRootPage = pageNesting.length === 1;
  const currentPage = pageNesting[pageNesting.length - 1] === '' ? 'home' : pageNesting[pageNesting.length - 1];
  const parentPage = pageNesting[0] === '' ? 'home' : pageNesting[0];

  const PageTree = _getPageTreeMap();
  // check if page was already created.
  if (PageTree[currentPage] != null) return;

  // check if parent page was created.
  if (!isRootPage && PageTree[parentPage] == null) {
    const parentPageTree = _createPageNode(`SitePage ${parentPage}`, parentPage, true);
    parentPageTree.internal.contentDigest = createContentDigest(parentPageTree);
    _setPageTreeMap(parentPage, parentPageTree);
    await createNode(parentPageTree);
  }

  const pageTreeNode = _createPageNode(id, path, isRootPage);
  pageTreeNode.internal.contentDigest = createContentDigest(pageTreeNode);
  _setPageTreeMap(currentPage, pageTreeNode);
  await createNode(pageTreeNode);

  if (!isRootPage) {
    try {
      createParentChildLink({
        parent: PageTreeMap[parentPage],
        child: pageTreeNode
      });
    } catch (e) {
      reporter.warn(`Could not create parent child link for parent: ${parentPage} - child: ${currentPage}`);
    }
  }
}

exports.onCreateNode = createPageTree;
