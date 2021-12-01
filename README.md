# ui-vue

## Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn dev [xxx: components]
```

### Lints and fixes files
```
yarn lint
```

### Build vue2 and vue3 components
```
yarn build
```

## 😀 feature

* [ ] js (for example: [dialog](./packages/components/dialog/index.ts))
  * [x] [build script](./build/build.ts) with vue2/3
  * [x] [dev script](./build/dev.ts) with vue2/3 at the same time
  * [x] support vue2 and vue3 [unit test config](./jest.config.js)
  * [ ] e2e
* [x] css (for example: [dialog](./packages/components/dialog/style/index.ts))
  * [x] manual block [tree shaking](https://sass-lang.cn/documentation/syntax)
  * [x] use [BEM](https://css-tricks.com/bem-101/) for modules css
* [ ] documents (for example: [dialog](./packages/components/dialog/docs/readme.md))
  * [x] [dev script](./docs/bootstrap/vite.config.ts)
  * [x] [markdown](https://github.com/antfu/vite-plugin-md) for document
  * [ ] beautify markdown document output
  * [ ] multi components demo support
  * [ ] ssg pages
* [ ] git
  * [ ] change log
  * [ ] commit lint
  * [ ] ci/cd
  * [ ] npm release script
