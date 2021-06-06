"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChangelog = void 0;
/**
 *
 * @param str
 */
const toChangelog = (str) => {
    return str.split('\n').map(line => (line ? `- ${line}` : '')).join('\n');
};
exports.toChangelog = toChangelog;
