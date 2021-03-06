#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const wpilgen = __importStar(require("./wpilgenerator"));
(() => {
    const pargv = process.argv;
    const penv = process.env;
    const allowedNodeVersion = '8.9.3';
    let checkPassed = true;
    const doCheck = (checkFn, message) => {
        if (!checkPassed) {
            return;
        }
        const checkFailed = !!checkFn();
        if (checkFailed) {
            new logger_1.Logger().log(message);
        }
        checkPassed = !checkFailed;
    };
    if (pargv.length === 2) {
        doCheck(() => (penv.TRAVIS_SECURE_ENV_VARS !== 'true') || (penv.GH_TOKEN === ''), 'Secure environment variable is not set');
        doCheck(() => penv.TRAVIS_OS_NAME !== 'linux', `Running on '${penv.TRAVIS_OS_NAME}' is not allowed`);
        doCheck(() => penv.TRAVIS_NODE_VERSION !== allowedNodeVersion, `Running on node version '${penv.TRAVIS_NODE_VERSION}' is not allowed`);
        doCheck(() => penv.TRAVIS_PULL_REQUEST !== 'false', 'Running on Pull Request is not allowed');
        doCheck(() => penv.TRAVIS_BRANCH !== 'master', `Running on branch '${penv.TRAVIS_BRANCH}' is not allowed`);
        doCheck(() => penv.TRAVIS_REPO_SLUG !== 'vscode-icons/vscode-icons', `Running on '${penv.TRAVIS_REPO_SLUG}' is not allowed`);
        if (!checkPassed) {
            return;
        }
        pargv.push('all', '-o', 'repo', '-t', penv.GH_TOKEN);
    }
    wpilgen.main();
})();
