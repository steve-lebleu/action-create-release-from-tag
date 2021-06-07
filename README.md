[![Build and test](https://github.com/konfer-be/action-create-release-from-tag/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/konfer-be/action-create-release-from-tag/actions/workflows/build-and-test.yml)
[![Coverage Status](https://coveralls.io/repos/github/konfer-be/action-create-release-from-tag/badge.svg?branch=master)](https://coveralls.io/github/konfer-be/action-create-release-from-tag?branch=master)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/konfer-be/action-create-release-from-tag/master)
![Requires.io (branch)](https://img.shields.io/requires/github/konfer-be/action-create-release-from-tag/master)

# Create release with changelog as release note

As repetitive and simple task, release creation is an ideal candidate to automation with Github action. This package create a release where:

- Label is the last tag version
- Body is the commits related to this tag, and formated as changelog

## Getting started

In your action definition:

```yaml
- name: Create release with changelog
  uses: konfer-be/action-create-release-from-tag@v1.0.2
  with:
    token: ${{ secrets.GITHUB_TOKEN }} # required
```

:info: Merge commits are excluded from changelog.

:warning: Be aware that the checkout must absolutely bring back the entire commit history to be able to build changelog.

## Licence

[MIT](/LICENSE)
