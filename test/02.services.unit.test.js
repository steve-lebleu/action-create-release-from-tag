const sinon = require('sinon');
const childProcessPromise = require('child-process-promise');
const expect = require('chai').expect;
const core = require('@actions/core');
const github = require('@actions/github');

const { GitService } = require(process.cwd() + '/lib/services/git.service');
const { GithubService }  = require(process.cwd() + '/lib/services/github.service');

describe('Services', () => {

  describe('GitService', () => {

    let stubExec, stubCoreSetFailed, stubCoreWarning;

    before(() => {
      stubExec = sinon.stub(childProcessPromise, 'exec');
      stubCoreSetFailed = sinon.stub(core, 'setFailed');
      stubCoreWarning = sinon.stub(core, 'warning');
    });

    after(() => {
      stubExec.restore();
      stubCoreSetFailed.restore();
      stubCoreWarning.restore();
    });
  
    describe('getLastTags', () => {

      it('should returns the n last tags', async() => {
        stubExec.callsFake(() => {
          return { stdout: 'v1.0.1\nv1.0.0' };
        });
        const tags = await GitService.getLastTags();
        expect(stubExec.called).to.be.true;
        expect(tags).to.be.an('array');
        expect(tags[0]).to.be.eqls('v1.0.1');
        expect(tags[1]).to.be.eqls('v1.0.0');
      });

      it('should set action as failed', async() => {
        stubExec.callsFake(() => {
          return { stdout: '' };
        });
        stubCoreSetFailed.callsFake(() => {
          return null;
        });
        await GitService.getLastTags();
        expect(stubExec.called).to.be.true;
        expect(stubCoreSetFailed.called).to.be.true;
      });

    });

    describe('getCommits', () => {

      it('should returns the commits between two last tags', async () => {
        stubExec.callsFake(() => {
          return { stdout: 'commit1\ncommit2\ncommit3' };
        });
        const commits = await GitService.getCommits(['v1.0.1', 'v1.0.0']);
        expect(stubExec.called).to.be.true;
        expect(commits).to.be.eqls('commit1\ncommit2\ncommit3');
      });

      it('should returns the commits before last tag', async () => {
        stubExec.callsFake(() => {
          return { stdout: 'commit1\ncommit2\ncommit3' };
        });
        const commits = await GitService.getCommits(['v1.0.0']);
        expect(stubExec.called).to.be.true;
        expect(commits).to.be.eqls('commit1\ncommit2\ncommit3');
      });

      it('should returns N/A', async() => {
        stubExec.callsFake(() => {
          return { stdout: null };
        });
        const tag = await GitService.getCommits(['v1.0.1', 'v1.0.0']);
        expect(stubExec.called).to.be.true;
        expect(tag).to.be.eqls('N/A');
      });

      it('should emit a waring', async() => {
        stubExec.callsFake(() => {
          return { stdout: null };
        });
        stubCoreWarning.callsFake(() => {
          return null;
        });
        const tag = await GitService.getCommits(['v1.0.1', 'v1.0.0']);
        expect(stubExec.called).to.be.true;
        expect(stubCoreWarning.called).to.be.true;
      });
    });
  
  });

  describe('GithubService', () => {
    
    let stubOctokit, stubContext;

    before(() => {
      stubOctokit = sinon.stub(github, 'getOctokit');
      stubContext = sinon.stub(github, 'context').value({ owner: 'konfer-be', repo: 'github-action-create-release' })
    });

    after(() => {
      stubOctokit.restore();
      stubContext.restore();
    });
  
    describe('createRelease', () => {

      it('should create a release', async () => {
        stubOctokit.callsFake(() => {
          return { rest: { repos: { createRelease: (args) => {
            return {
              status: 201,
              data: {
                name: '',
                html_url: 'https://github.com/project/releases/v1.0.0'
              }
            }
          } } } }
        });
        const service = new GithubService('token');
        const url = await service.createRelease('v1.0.0', 'changelog');
        expect(url).to.be.eqls('https://github.com/project/releases/v1.0.0');
      });

      it('should throw an error', async () => {
        stubOctokit.callsFake(() => {
          return { rest: { repos: { createRelease: (args) => {
            return {
              status: 400,
              data: {
                name: '',
                html_url: 'https://github.com/project/releases/v1.0.0'
              }
            }
          } } } }
        });
        const service = new GithubService('token');
        try {
          await service.createRelease('v1.0.0', 'changelog');
        } catch (e) {
          expect(e).to.be.an('error');
          expect(e.message).to.be.eqls('Failed to create the release: 400');
        }
      });

    });

  });
  
});