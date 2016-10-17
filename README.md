# Serverless Node Config Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
A Serverless v1.0 plugin to pre-compile a [node-config](https://github.com/lorenwest/node-config) 
configuration and include it in a deployment package.


## Install

*Until published to NPM*
Install plugin
```
npm install Signiant/serverless-node-config-plugin
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-node-config-plugin
```

## Configure

### Node Config Environment Variables

Node config determines which configuration files to read and merge
by looking at specific environment variables. [More info here](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

This plugin uses node-config to load the configuration at serverless
deploy time. Therefore any relevant environment variables present will
determine which config files are loaded.

For example, the following will merge and generate a config file from source files
`default`, `development`, `development-a`
```
bash-3.2$ export NODE_ENV='development'
bash-3.2$ export NODE_APP_INSTANCE='a'
bash-3.2$ serverless deploy
```

You can also set the node-config specific environment variables in the
custom section of `serverless.yaml`

```yaml
custom:
  nodeConfigNodeEnv: development
  nodeConfigHostname: ${opt:stage, self:provider.stage}
  nodeConfigAppInstance: a
```

### Temporary Working Directory

By default the plugin will create a temporary working directory called
`.node-config` with the working directory. It will copy the service
contents here before modifying them, and will delete the directory when
completed.
This can be over-ridden by setting the `nodeConfigTmpDir` custom variable.

```yaml
custom:
  nodeConfigTmpDir: ./myTmpDir
```

## Usage

Your project must include the node-config project
```
npm install --save node-config
```

From here you can just use the node-config project as designed.
```
let config = require('config')
```

When deployed, the config module will be replaced with a pre-compiled
configuration based on the environment variables present at deploy-time.


## Known Issues

* This plugin does not work with other plugins that manipulate files
during the `createDeploymentArtifacts` phase of the serverless deploy.
For example [serverless-webpack](https://github.com/elastic-coders/serverless-webpack)


## Todo

* NPM publish
* Handle single function deploys
* Play nicely with other packaging plugins (e.g. serverless-webpack)
