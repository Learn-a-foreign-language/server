# Contributing

*This file might change in a near future.*

Pull Requests are very welcome. You can either directly submit PR with highly descriptive comment(s), or create an issue to let me know of bugs/missing features and then create a linked PR (just reference the issue in the PR comment).

Right now there's no tests whatsoever, so just make sure your PR doesn't break anything. However, in the future I'll probably add some. Then you'll have to make sure all tests pass before submiting anything.

In parallel, I highly recommend you to use [ESLint](http://eslint.org/docs/user-guide/getting-started) in order to keep a consistent code. I also encourage you to use ECMAScript2015 (or ES6) as much as possible.

## Git workflow

A [branching model](http://nvie.com/posts/a-successful-git-branching-model/) is applied for this project. Basically, this means that if you want to contribute, you have to:

1. Fork this project.
2. Create your own branch from the branch `develop`. You can call it `feature-x` where `x` is the name of you feature, or `fix-y`, and so on, for example.
3. Submit a **Pull Request**.

[More information](http://blog.romainpellerin.eu/continuous-integration.html).

### Branches

#### `master`

This branch contains all the stable releases (General Availibility), tagged. It's for production.

#### `develop`

This branch contains the latest release (Release Candidate), including the latest added features. It may contains some bugs. At some points, this branch will be merged into `master` when the next stable release is ready for production.

#### Any other branch

...is unstable and under development. It can be a feature branch or a fix branch. Theses branches are intented to be merged in `develop`.



Happy coding!