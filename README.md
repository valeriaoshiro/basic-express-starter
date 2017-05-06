This is an almost replica of [hackathon-starter](https://github.com/sahat/hackathon-starter)


## To Do

* Add compression
* Add Dropbox upload
* Setup Webpack for SASS & js
* hook webpack-hot-middleware and webpack-dev-middleware
* Add mailgun mail service
* Upload files to S3 instead of project directory

## Differences from hackathon-starter

* Stripped from some unwanted functionality (for my purposes)
* I use bootstrap 4
* [nunjucks](https://mozilla.github.io/nunjucks/) template engine
* Some minor differences in handling passport authentication

## Commands

PREREQUISITES:
*  `yarn` - a package manager
* 'mongodb' - This process should already be running with `mongod` on the CLI

In development, you're going to use two commands:
Start your server with `yarn start`
Start your development environment with `yarn dev`

Base.js is global JS that will be run on every page.
When creating a new page, you'll need to add a new entry to the config in `webpack.config.js`.

