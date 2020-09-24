const { transformPageID, normalizePathToPageName } = require('./src/helpers.js');
// This map will hold the information about,
// the page ids and the relations between them.
const PageTreeMap = {};

/**
 * Will create a new page tree where the parent and child relations will be correct and some extras.
 * @param  {Object} node                  @see https://www.gatsbyjs.com/docs/node-apis/#onCreateNode
 * @param  {Object} actions               @see https://www.gatsbyjs.com/docs/node-apis/#onCreateNode
 * @param  {Function} createContentDigest @see https://www.gatsbyjs.com/docs/node-apis/#sourceNodes
 */
async function createPageTree({ node, actions, createContentDigest }) {
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
  const pathNoSlashBegining = path.replace(/\//, '');
  const name = path !== '/' ? normalizePathToPageName(path) : 'Homepage';

  const pageNesting = pathNoSlashBegining === '/' || pathNoSlashBegining === '' ? ['homepage'] : pathNoSlashBegining.split('/').filter(f => f !== '');
  const isRootPage = pageNesting.length === 1;
  const currentPage = pageNesting[pageNesting.length - 1];
  const parentPage = pageNesting[0];

  const pageTreeNode = {
    id: pageTreeId,
    isRootPage,
    name,
    pathRaw,
    internal: { type: 'PageTree' }
  };
  pageTreeNode.internal.contentDigest = createContentDigest(pageTreeNode);
  if (isRootPage) {
    PageTreeMap[currentPage === '' ? 'home' : currentPage] = pageTreeNode;
  } else {
    createParentChildLink({
      parent: PageTreeMap[parentPage === '' ? 'home' : parentPage],
      child: pageTreeNode
    });
    PageTreeMap[currentPage] = pageTreeNode;
  }
  createNode(pageTreeNode);
}

exports.onCreateNode = createPageTree;
