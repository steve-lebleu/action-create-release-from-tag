const sinon = require('sinon');
const expect = require('chai').expect;
const core = require('@actions/core');

const { GitService } = require(process.cwd() + '/lib/services/git.service');
const { GithubService }  = require(process.cwd() + '/lib/services/github.service');

const { main } = require(process.cwd() + '/lib/');

describe('Main', () => {

  let stubGetLastTag, stubGetCommits, stubCreateRelease, stubSetFailed, githubService = new GithubService('token');

  before(() => {
    stubGetLastTag = sinon.stub(GitService, 'getLastTags');
    stubGetCommits = sinon.stub(GitService, 'getCommits');
    stubCreateRelease = sinon.stub(githubService, 'createRelease');
    stubSetFailed = sinon.stub(core, 'setFailed');
  });

  after(() => {
    stubGetLastTag.restore();
    stubGetCommits.restore();
    stubCreateRelease.restore();
    stubSetFailed.restore();
  });

  it('should retrieve the last tags', async () => {
    stubGetLastTag.callsFake(() => {
      return ['v1.0.1', 'v1.0.0'];
    });
    stubGetCommits.callsFake(() => {
      return 'commit1\ncommit2\ncommit3';
    });
    await main('token');
    expect(stubGetLastTag.called).to.be.true;
  });

  it('should throw error because tag is not found', async () => {
    stubGetLastTag.callsFake(() => {
      return null;
    });
    try {
      await main('token');
    } catch (e) {
      expect(e).to.be.an('error');
      expect(e.message).to.be.eqls('Tags cannot be retrieved');
    }
  });

  it('should retrieve the commits', async () => {
    stubGetLastTag.callsFake(() => {
      return ['v1.0.1', 'v1.0.0'];
    });
    stubGetCommits.callsFake(() => {
      return 'commit1\ncommit2\ncommit3';
    });
    await main('v1.0.0', 'token');
    expect(stubGetCommits.called).to.be.true;
  });
});