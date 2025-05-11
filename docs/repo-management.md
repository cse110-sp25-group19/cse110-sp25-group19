# Repository Management Guidelines

For future projects in this class, we will be using these guidelines on pull requests and branch commits to keep the project repositories organized.

## Folder Management

```plaintext  
web-app-project/  
├── src/ ← main source code should be here  
│ ├── index.html  
│ ├── styles/  
│ │ └── main.css  
│ ├── scripts/  
│ │ └── app.js  
│ └── components/  
│ └── nav.js  
├── assets/ ← images, fonts, etc.  
├── README.md  
├── package.json  
└── .gitignore  
```
To better organize the respository, all code files should be grouped into a `source` directory, and all assets should be located in a separate folder apart from code. The diagram above is a general template for how the respository should be organized.

## Branching & GitHub Issues

**Important:** Do **NOT** push directly to main. Always create branches and make pull requests.

Creating a new branch (format): <br />
Features: <br />
`git checkout -b feature/feature-name`<br />
**OR** <br />
Bug-fixes: <br />
`git checkout -b bugfix/short-description`

If you find new bugs during development, create a GitHub issue for them first before comitting and making a pull request.

## Commit Message Format

Git commits and pull requests should also close an issue at the same time so it is easier to track.

Update: we will be using commitlint for a standardized commit message format from now on. For commitlint formatting, refer to commitlint docs [here](https://github.com/conventional-changelog/commitlint?tab=readme-ov-file#what-is-commitlint).<br />

If your commit/pull request resolves a GitHub issue, first type out your commit message in commitlint format, then type this at the end: <br />

> insert-commitlint-message-here; fixes #XXX

## Additional Notes
- We will not be forking repositories; creating new branches for features/bug fixes should be sufficient
- Don't merge pull requests by yourself, have someone else approve it
- Make sure you test the code thoroughly before committing a change
<hr>

> Last Edited: Wed April 23, 2025
