import { debug, setFailed, warning } from '@actions/core';
import { exec } from 'child-process-promise';

/**
 * @description Implements git interactions commands
 */
export class GitService {

  constructor() {}

  /**
   * Finds the n last tags in history
   * 
   * @param n Max number of tags to return
   */
  static async getLastTags(n: number): Promise<string[]> {

    const tags = await exec('git tag -l --sort=-creatordate');

    debug(`${n} last tags are ${tags.stdout}`);

    if (!tags.stdout || tags.stdout === '') {
      setFailed('Tags cannot be retrieved');
    }

    return tags.stdout.split('\n').slice(0, n) || null;
  }

  /**
   * List all commit messages since last tag
   * 
   * @param tag Last tag reference
   */
  static async getCommits(tags: string[]): Promise<string> {

    debug(`Tags received in input ${tags}`);

    let command = '';

    switch(tags.length) {
      case 1:
        command = `git log --oneline --pretty=format:"%s"`;
        break;
      case 2:
        command = `git log ${tags.slice().pop().trim()}..${tags.slice().shift().trim()} --oneline --pretty=format:"%s"`;
        break;
    }

    debug(`Command ${command}`);

    const messages = await exec(command);
    
    debug(`The commit messages are ${messages.stdout}`);

    if (!messages || !messages?.stdout) {
      warning(`No messages have been found`);
    }

    return messages.stdout ?? 'N/A';
  }
}