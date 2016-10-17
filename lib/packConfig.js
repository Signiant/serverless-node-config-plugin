'use strict';
const path = require('path');
const fse = require('fs-extra');
const BbPromise = require('bluebird');
let loadFileConfigs = require('config').util.loadFileConfigs;

const HOSTNAME_ENV = 'HOSTNAME';
const APP_INSTANCE_ENV = 'NODE_APP_INSTANCE';
const NODE_ENV = 'NODE_ENV';

let filter = dirName => {
    dirName = path.resolve(dirName);
    return fileName => dirName !== fileName;
}

let rmDir = dir =>
    BbPromise.fromCallback(cb => fse.remove(dir, cb));

let emptyDir = dir =>
    BbPromise.fromCallback(cb => fse.emptyDir(dir, cb));

let copyDir = (src, dest, options) =>
    BbPromise.fromCallback(cb => fse.copy(src, dest, options, cb));

let writeFile = (path, content) =>
    BbPromise.fromCallback(cb => fse.outputFile(path, content, cb));


let cachedEnv = {};
let setEnv = (value, property) => {
    if (value) {
        cachedEnv[property] = process.env[property];
        process.env[property] = value;
    }
};

let restoreEnv = () => {
    for (let key in cachedEnv) {
        let val = cachedEnv[key];
        if (val) {
            process.env[key] = val;
        } else {
            delete process.env[key];
        }
    }
};

let getConfig = custom => {
    setEnv(custom.nodeConfigNodeEnv, NODE_ENV);
    setEnv(custom.nodeConfigHostname, HOSTNAME_ENV);
    setEnv(custom.nodeConfigAppInstance, APP_INSTANCE_ENV);
    
    let config = loadFileConfigs();
    
    restoreEnv();
    
    return config;
}


module.exports = {
    packConfig()  {
        this.originalServicePath = this.serverless.config.servicePath;
        this.serverless.config.servicePath = this.nodeConfigTmpDir;
    
        const config = getConfig(this.serverless.service.custom);
        
        
        
        let configModulePath = path.join(this.nodeConfigTmpDir, 'node_modules', 'config');
        let configIndexFile = path.join(configModulePath, 'index.js');
        let indexContents = `module.exports = ${JSON.stringify(config)}`;
        
        this.serverless.cli.log(`Writing temporary node-config-plugin to directory ${this.nodeConfigTmpDir}`);
        
        return rmDir(this.nodeConfigTmpDir)
            .then(() => copyDir(this.originalServicePath, this.nodeConfigTmpDir,
                {
                    filter: filter(this.nodeConfigTmpDir)
                }))
            .then(() => emptyDir(configModulePath))
            .then(() => writeFile(configIndexFile, indexContents));
    }
};