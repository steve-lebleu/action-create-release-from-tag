import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { getOctokit, context } from '@actions/github'
import { GitService } from './services/git.service';
import { GithubService } from './services/github.service';
import { toChangelog } from './utils/format.util';

/**
 * @description Entry point of the action
 * 
 * @param tag 
 * @param token 
 */
const main = async (token: string): Promise<void> => {

  try {

    debug('Token input:' + token);

    const tags = await GitService.getLastTags(2); 

    if (!tags) {
      throw new Error('Tags cannot be retrieved');
    }

    debug(`tags: ${tags}`);

    const messages = await GitService.getCommits(tags)
    const changelog = toChangelog(messages);

    debug(`Changelog: ${changelog}`);

    const githubService = new GithubService(token);

    githubService.createRelease(tags.slice(0,1).shift(), changelog);

    setOutput('changelog', changelog);

  } catch (e) {
    setFailed(e.message);
  }
  
};

main( getInput('token') )
  .then(response => debug(`Success with ${response}`))
  .catch(error => setFailed(error.message))

export { main }