import { debug, info } from '@actions/core'
import { getOctokit, context } from '@actions/github'

/**
 * @description Implements Github interactions methods
 */
export class GithubService {

  /**
   * @description Current process github token
   */
  token: string;

  constructor(token: string) {
    this.token = token;
    debug(`GithubService.token: ${this.token}`)
  }

  /**
   * @description Check if a release with the same tag alreadyExist
   * 
   * @param tag 
   */
  async isExistingReleaseWithSameLabel(tag: string): Promise<boolean> {
    const octokit = getOctokit(this.token) as { rest: { repos?: { getReleaseByTag: (args: any) => any }} };
    const releaseByTag = await octokit.rest.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag,
    });
    return true;
  }

  /**
   * @description Create a release with tag_name and changelog as text
   * 
   * @param tag 
   * @param changelog 
   */
  async createRelease(tag: string, changelog: string): Promise<string> {
    debug(`#GithubService.createRelease tag supplied: ${tag}`);
    debug(`#GithubService.createRelease changelog supplied: ${changelog}`);
    const octokit = getOctokit(this.token) as { rest: { repos?: { createRelease: (args: any) => any } } };

    const response = await octokit.rest.repos.createRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name: tag, 
      name: tag, 
      body: changelog
    });
  
    if (response.status != 201) {
      throw new Error(`Failed to create the release: ${response.status}`);
    }
  
    info(`Release created ${response.data.name}`);
  
    return response.data.html_url;
  }
}

