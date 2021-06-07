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
exports.GitService = void 0;
const core_1 = require("@actions/core");
const child_process_promise_1 = require("child-process-promise");
/**
 * @description Implements git interactions commands
 */
class GitService {
    constructor() { }
    /**
     * Finds the n last tags in history
     *
     * @param n Max number of tags to return
     */
    static getLastTags(n) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield child_process_promise_1.exec('git tag -l --sort=-creatordate');
            core_1.debug(`${n} last tags are ${tags.stdout}`);
            if (!tags.stdout || tags.stdout === '') {
                core_1.setFailed('Tags cannot be retrieved');
            }
            return tags.stdout.split('\n').slice(0, n) || null;
        });
    }
    /**
     * List all commit messages since last tag
     *
     * @param tag Last tag reference
     */
    static getCommits(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            core_1.debug(`Tags received in input ${tags}`);
            let command = '';
            switch (tags.length) {
                case 1:
                    command = `git log --oneline --pretty=format:"%s"`;
                    break;
                case 2:
                    command = `git log ${tags.slice().pop().trim()}..${tags.slice().shift().trim()} --oneline --pretty=format:"%s"`;
                    break;
            }
            core_1.debug(`Command ${command}`);
            const messages = yield child_process_promise_1.exec(command);
            core_1.debug(`The commit messages are ${messages.stdout}`);
            if (!messages || !(messages === null || messages === void 0 ? void 0 : messages.stdout)) {
                core_1.warning(`No messages have been found`);
            }
            return messages.stdout ? messages.stdout.split('\n').filter(msg => !msg.toLowerCase().includes('merge')).join('\n') : 'N/A';
        });
    }
}
exports.GitService = GitService;
