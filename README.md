[![Build](https://github.com/steve-lebleu/action-create-release-from-tag/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/steve-lebleu/action-create-release-from-tag/actions/workflows/build-and-test.yml)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/action-create-release-from-tag/badge.svg?branch=master)](https://coveralls.io/github/steve-lebleu/action-create-release-from-tag?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/steve-lebleu/action-create-release-from-tag/master)

# Create release with changelog as release note

This package create a release where:

- Label is the last tag version
- Body is the commits related to this tag, and formated as changelog

## Getting started

In your action definition:

```yaml
- name: Create release with changelog
  uses: konfer-be/action-create-release-from-tag@v1.0.3
  with:
    token: ${{ secrets.GITHUB_TOKEN }} # required
```

:warning: Merge commits are excluded from changelog.

:warning: The checkout must bring back the entire commit history to be able to build changelog.

## Licence

[MIT](/LICENSE)
