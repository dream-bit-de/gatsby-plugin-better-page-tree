<p align="center">
<a href="https://www.gatsbyjs.com/">
  <img alt="Gatsby" src="https://camo.githubusercontent.com/c82d5dbe0efc4f71771b4c656fd96b91d6103a8d/68747470733a2f2f7777772e6761747362796a732e636f6d2f4761747362792d4d6f6e6f6772616d2e737667" width="35" />
</a>
</p>
<h1 align="center">
  gatsby-plugin-better-page-tree
</h1>

<p align="center">
  <a href="http://makeapullrequest.com">  
      <img alt="Gatsby" src="https://img.shields.io/badge/PRs-welcome-brightgreen" />
  </a>
</p>

**This plugin will make the page tree provided by gatsby graphql more intuitive. It was created to overcome some issues with child and parent relations in gatsbyjs.**

The initial question on Stackoverflow was this one: [How do you figure out parent and child relations between pages in gatsbyjs?](https://stackoverflow.com/questions/63674700/how-do-you-figure-out-parent-and-child-relations-between-pages-in-gatsbyjs). After taking this directly to the [gatsby community](https://github.com/gatsbyjs/gatsby/issues/26752), the need for a plugin was clear.

 gatsby-plugin-better-page-tree will generate the relations like this: `/src/pages/subpages`,

```
/src/pages/parentpage/index.js
/src/pages/parentpage/subpage/index.js
```

will now give you:

```JSON
{
  "node": {
    "id": "PageTree-parentpage-id-8496bef7-3809-4fac-8f97-ab2b98b7f54d",
    "name": "Parentpage",
    "pathRaw": "/parentpage/",
    "pathNoTrail": "/parentpage",
    "isparentpage": true,
    "children": [
      {
        "id": "PageTree-parentpage/subpage-id-bc8cec01-3f85-47d2-aec9-2e3ddc76df32",
        "name": "Subpage",
        "pathRaw": "/parentpage/subpage/",
        "pathNoTrail": "/parentpage/subpage"
      }
    ]
  },
  "node": {
    "id": "PageTree-parentpage/subpage-id-bc8cec01-3f85-47d2-aec9-2e3ddc76df32",
    "name": "Subpage",
    "pathRaw": "/parentpage/subpage/",
    "pathNoTrail": "/parentpage/subpage",
    "isparentpage": false,
    "children": []
  }
}
```

## :mortar_board: Install

Just use `npm install gatsby-plugin-better-page-tree` or `yarn install gatsby-plugin-better-page-tree`, it's your choice.
After that you have to modify your `gatsby-config.js`:

```javascript
module.exports = {
  siteMetadata: {
    title: `Your Super Gatsby Site!`,
    description: `I love Gatsby!`,
    author: `Community,`,
    siteUrl: `https://www.my-gatsby-site-yeeehaaaw.com/`
  },
  plugins: [
    // ... other plugins
    `gatsby-plugin-better-page-tree`
  ]
};
```

## :tada: Usage

To use this for example in a sidebar you have to use it like this:

`sidebar.js`:

```JSX
import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

function Sidebar() {
  const Pages = useStaticQuery(graphql`
    query {
      allSitePage(filter: { id: { nin: ["SitePage /", "SitePage /dev-404-page/", "SitePage /404/", "SitePage /404.html"] } }) {
        nodes {
          id
          children {
            id
          }
          path
        }
      }
    }
  `);
  const { nodes } = Pages.allSitePage;

return (
     {nodes.map((n) => (
     <ul key={`sidebar-${n.id}`}>
      <li button className={classes.listItem} component="div">
       <Link className={classes.listLinks} to={n.path}>
        <span>{Helpers.normalizePathToPagename(n.path)}</span>
       </Link>
      </li>
     </ul>
     ))}
);

```

That's it!


## :collision: Configuration

TBD!

## :star: contributing

You want to help us, and join the Dream-bit Community?
Great! Please make sure to check out and understand what is written in the following files:

- CODE-OF-CONDUCT.md
- CONTRIBUTING.md

As well as the gatsby-plugin docs:

- [GatsbyJS Creating Plugins Docs](https://www.gatsbyjs.com/docs/creating-plugins/)

## :blush: About Dream-bit

At dream-bit dreams become software!
We encourage people to do good things with software and bring humanity forward.
You can be a part of us by contributing or joining the community at https://dream-bit.de

Develop software with your :heart: as your :brain:.
