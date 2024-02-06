"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const core_1 = require("@actions/core");
const git_service_1 = require("./services/git.service");
const github_service_1 = require("./services/github.service");
const format_util_1 = require("./utils/format.util");
/**
 * @description Entry point of the action
 *
 * @param tag
 * @param token
 */
const main = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, core_1.debug)('Token input:' + token);
        const tags = yield git_service_1.GitService.getLastTags(2);
        if (!tags) {
            throw new Error('Tags cannot be retrieved');
        }
        (0, core_1.debug)(`tags: ${tags}`);
        const messages = yield git_service_1.GitService.getCommits(tags);
        const changelog = (0, format_util_1.toChangelog)(messages);
        (0, core_1.debug)(`Changelog: ${changelog}`);
        const githubService = new github_service_1.GithubService(token);
        githubService.createRelease(tags.slice(0, 1).shift(), changelog);
        (0, core_1.setOutput)('changelog', changelog);
    }
    catch (e) {
        (0, core_1.setFailed)(e.message);
    }
});
exports.main = main;
main((0, core_1.getInput)('token'))
    .then(response => (0, core_1.debug)(`Success with ${response}`))
    .catch(error => (0, core_1.setFailed)(error.message));
