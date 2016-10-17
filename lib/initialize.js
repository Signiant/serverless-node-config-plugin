'use strict';
const path = require('path');
const TMP_DIR = '.node-config'

module.exports = {
    initialize () {
        if (this.serverless.service.custom) {
            this.nodeConfigTmpDir = this.serverless.service.custom.nodeConfigTmpDir ||
                path.join(this.serverless.config.servicePath, TMP_DIR)
        }
    }
}