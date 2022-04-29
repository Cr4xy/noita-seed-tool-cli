# CLI for Noita Seed Tool (seed search only)
## Installation
1. You need to install nodejs on your system
2. Clone this repo
3. Run `git submodule update –-remote`
## Usage
 - Enter the criteria you need on the website, and click 'Copy Link'.
 - Paste the copied URL behind the following command: `node cli/cli.js "<url>"`
 - Hit enter and the program will perform the search operation.
 ## Options:
  - `-t`
            You can add -t to the command in order to use all your CPU cores.
  - `-s <seed>`
            Override the starting seed.
## Example:
`node cli.js "https:cr4xy.dev/noita/?seed=3&search=p-l1-pPERKS_LOTTERY%2Cp-l2-pSAVING_GRACE"`
