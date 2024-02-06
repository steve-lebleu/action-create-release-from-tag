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
exports.GithubService = void 0;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
/**
 * @description Implements Github interactions methods
 */
class GithubService {
    constructor(token) {
        this.token = token;
        (0, core_1.debug)(`GithubService.token: ${this.token}`);
    }
    /**
     * @description Check if a release with the same tag alreadyExist
     *
     * @param tag
     */
    isExistingReleaseWithSameLabel(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = (0, github_1.getOctokit)(this.token);
            const releaseByTag = yield octokit.rest.repos.getReleaseByTag({
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo,
                tag,
            });
            return true;
        });
    }
    /**
     * @description Create a release with tag_name and changelog as text
     *
     * @param tag
     * @param changelog
     */
    createRelease(tag, changelog) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, core_1.debug)(`#GithubService.createRelease tag supplied: ${tag}`);
            (0, core_1.debug)(`#GithubService.createRelease changelog supplied: ${changelog}`);
            const octokit = (0, github_1.getOctokit)(this.token);
            const response = yield octokit.rest.repos.createRelease({
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo,
                tag_name: tag,
                name: tag,
                body: changelog
            });
            if (response.status != 201) {
                throw new Error(`Failed to create the release: ${response.status}`);
            }
            (0, core_1.info)(`Release created ${response.data.name}`);
            return response.data.html_url;
        });
    }
}
exports.GithubService = GithubService;
