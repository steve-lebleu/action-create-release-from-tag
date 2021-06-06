const expect = require('chai').expect;
const format = require(process.cwd() + '/lib/utils/format.util');

describe('Utils', () => {

  describe('toChangelog', () => {
    it('should return a string', () => {
      expect(format.toChangelog('commit1\ncommit2\ncommit3')).to.be.a('string');
    });
    it('should return a string as changelog format', () => {
      const template = `- commit1\n- commit2\n- commit3`;
      expect(format.toChangelog('commit1\ncommit2\ncommit3')).to.be.eqls(template);
    });
  });

});