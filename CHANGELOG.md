# Changelog

## [1.8.1](https://github.com/eggjs/egg-view-assets/compare/v1.8.0...v1.8.1) (2023-04-27)


### Bug Fixes

* compatible windows env.Path environment value ([#43](https://github.com/eggjs/egg-view-assets/issues/43)) ([c66b7d1](https://github.com/eggjs/egg-view-assets/commit/c66b7d1b78761023377b6278802e62c752a50946))

---


1.8.0 / 2021-10-16
==================

**features**
  * [[`cdab574`](http://github.com/eggjs/egg-view-assets/commit/cdab574d0d5a95533a6b7a8af34f850b0168b532)] - feat: support config.nonce (#42) (Yiyu He <<dead_horse@qq.com>>)

1.7.0 / 2021-04-08
==================

**features**
  * [[`6c5b719`](http://github.com/eggjs/egg-view-assets/commit/6c5b71913994a0f18bf4585df6245cbba0390e3f)] - feat: start detecting port from devServer.port (#40) (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.6.2 / 2021-03-22
==================

**fixes**
  * [[`ee0012e`](http://github.com/eggjs/egg-view-assets/commit/ee0012eca841b1ce2b3264e8154a9a4e3d5f8c15)] - fix: 修复autoPort时，port数据格式和fs模块要求数据格式不匹配问题 (#39) (拾邑 <<mr_suanmei@163.com>>)

1.6.1 / 2020-06-09
==================

**features**
  * [[`c7ec6e6`](http://github.com/eggjs/egg-view-assets/commit/c7ec6e671220a71db0ba59ef485f064ca622ccd7)] - feat: make sure `__webpack_public_path__` inserted just once (#31) (viko16 <<viko16@users.noreply.github.com>>)

**fixes**
  * [[`c992877`](http://github.com/eggjs/egg-view-assets/commit/c992877307e4c4178e3e337a5ca43a982e3254e4)] - fix: prefer http://127.0.0.1 even if https is on (#37) (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.6.0 / 2019-09-19
==================

**features**
  * [[`287aedb`](http://github.com/eggjs/egg-view-assets/commit/287aedb4e1ee58861e76198a364e4ff9d7122d92)] - feat: set protocol according to app.options.https (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.5.0 / 2019-04-09
==================

**features**
  * [[`226de2e`](http://github.com/eggjs/egg-view-assets/commit/226de2e5ed9d89bac203ead5a47f2a91fd9158ad)] - feat: script support crossorigin attribute (#30) (仙森 <<dapixp@gmail.com>>)

1.4.4 / 2019-01-29
==================

**fixes**
  * [[`8f0092e`](http://github.com/eggjs/egg-view-assets/commit/8f0092ef4e4dd33b63dbf836bdad72bc7a0b88be)] - fix: use w3c valid link format (#29) (fengmk2 <<fengmk2@gmail.com>>)

1.4.3 / 2019-01-08
==================

**fixes**
  * [[`f5966ec`](http://github.com/eggjs/egg-view-assets/commit/f5966eca57fcfe5819617e264555ba00c9c6c95b)] - fix(devServer): reset port when app get port from agent (#28) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`a5866bc`](http://github.com/eggjs/egg-view-assets/commit/a5866bc0b47a0df4d024f44b9fc05d39494fcf47)] - fix: remove unnecessary console (#27) (Haoliang Gao <<sakura9515@gmail.com>>)

1.4.2 / 2019-01-07
==================

**features**
  * [[`f6e9fb7`](http://github.com/eggjs/egg-view-assets/commit/f6e9fb7b51435516ce9d7f20a8de2e7a62b87c61)] - feat(devServer): support autoport in env (#26) (Haoliang Gao <<sakura9515@gmail.com>>)

1.4.1 / 2019-01-07
==================

**fixes**
  * [[`9378984`](http://github.com/eggjs/egg-view-assets/commit/9378984ad71465eb9cc46beba4936e8bb95f97f6)] - fix: port should be paased from agent to app (#25) (Haoliang Gao <<sakura9515@gmail.com>>)

1.4.0 / 2019-01-06
==================

**features**
  * [[`59d20a0`](http://github.com/eggjs/egg-view-assets/commit/59d20a0e7f1451aee14cb1a5117e8cda2d999498)] - feat: auto check port with autoPort (#24) (Haoliang Gao <<sakura9515@gmail.com>>)

**others**
  * [[`bf05a99`](http://github.com/eggjs/egg-view-assets/commit/bf05a99da9661aa731c6938ec7e8443dd381d2eb)] - refactor: use inherit instead of pipe (#22) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`d233b74`](http://github.com/eggjs/egg-view-assets/commit/d233b74cc38648a310146802385031d001d971e9)] - test: set proc null when exit by self (#23) (Haoliang Gao <<sakura9515@gmail.com>>)

1.3.0 / 2018-08-20
==================

**others**
  * [[`0815337`](http://github.com/eggjs/egg-view-assets/commit/0815337586c10ed393786bb7c3ad8f08242a9135)] - refactor: no need to encode context with base64 (#21) (fengmk2 <<fengmk2@gmail.com>>)

1.2.0 / 2018-08-15
==================

**features**
  * [[`6d9be84`](http://github.com/eggjs/egg-view-assets/commit/6d9be84495ae1e789e20276f33f184e736cf7e86)] - feat: manifest add absolute path and complete path support (#20) (仙森 <<dapixp@gmail.com>>)

1.1.2 / 2018-04-16
==================

**others**
  * [[`9b32a6e`](http://github.com/eggjs/egg-view-assets/commit/9b32a6ed4e2219e323946fb987e900a1477d66d9)] - refactor: atob should be minified (#16) (Haoliang Gao <<sakura9515@gmail.com>>)

1.1.1 / 2018-04-15
==================

**fixes**
  * [[`6d8793b`](http://github.com/eggjs/egg-view-assets/commit/6d8793b43e98618b2be76101011ad8732906f114)] - fix: atob browser compatible (#15) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`2475b7c`](http://github.com/eggjs/egg-view-assets/commit/2475b7c54fe088e2469181eb63f1a48c7c94fdbf)] - fix: command can be run on Windows (#13) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`ab29dee`](http://github.com/eggjs/egg-view-assets/commit/ab29deed14e0b6d266fc5a90b8f46950ce096431)] - fix: set context data more safely (#14) (Yiyu He <<dead_horse@qq.com>>)

1.1.0 / 2018-04-04
==================

**features**
  * [[`772164a`](http://github.com/eggjs/egg-view-assets/commit/772164a3669610659cd43614caf7825a74f30c65)] - feat: unittest environment is same as local (#12) (Haoliang Gao <<sakura9515@gmail.com>>)

1.0.4 / 2018-04-01
==================

**fixes**
  * [[`9d7fdac`](http://github.com/eggjs/egg-view-assets/commit/9d7fdac51c6799db63d948b37e94ad47a280a7c4)] - fix: should transform jsx to js (#11) (Haoliang Gao <<sakura9515@gmail.com>>)

1.0.3 / 2018-04-01
==================

**fixes**
  * [[`f58d766`](http://github.com/eggjs/egg-view-assets/commit/f58d766907f6e18627a44d42b3513e41b71bcf09)] - fix: check port when devServer is enabled (#10) (Haoliang Gao <<sakura9515@gmail.com>>)

1.0.2 / 2018-03-29
==================

**fixes**
  * [[`3f02556`](http://github.com/eggjs/egg-view-assets/commit/3f0255680aa8f6460faf08957efdff184c781b3f)] - fix: publicPath should contains leading and trailing slash (#9) (Haoliang Gao <<sakura9515@gmail.com>>)
  * [[`5db9e90`](http://github.com/eggjs/egg-view-assets/commit/5db9e906e85a414ae276e7de1033c1539aff8ea5)] - fix: more safe context when locals is from query (#8) (Haoliang Gao <<sakura9515@gmail.com>>)

1.0.1 / 2018-03-15
==================

**fixes**
  * [[`2ebef9d`](http://github.com/eggjs/egg-view-assets/commit/2ebef9d86235cc8c13dc262f1b767bdad77cea02)] - fix: publicPath should be __webpack_public_path__ (#7) (Haoliang Gao <<sakura9515@gmail.com>>)

1.0.0 / 2018-03-15
==================

**others**
  * [[`e369e2c`](http://github.com/eggjs/egg-view-assets/commit/e369e2c924bb09e949f27e5095c29d7bcddda68a)] - docs: update readme (#6) (Haoliang Gao <<sakura9515@gmail.com>>),fatal: No names found, cannot describe anything.

