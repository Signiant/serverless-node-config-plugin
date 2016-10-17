'use strict';
const BbPromise = require('bluebird');

const initialize = require('./lib/initialize');
const packConfig = require('./lib/packConfig');
const cleanup = require('./lib/cleanup');

class ServerlessNodeConfig {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

    
        Object.assign(
            this,
            initialize,
            packConfig,
            cleanup
        );
        
        this.hooks = {
            'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
                .then(this.initialize)
                .then(this.packConfig),
            
            'after:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
                .then(this.cleanup)
        }
    }
    
}

module.exports = ServerlessNodeConfig;