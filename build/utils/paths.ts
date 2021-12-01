import { resolve } from 'path'

/* code */
export const projectRoot = resolve(__dirname, '..', '..')
export const pkgRoot = resolve(projectRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const stylesRoot = resolve(pkgRoot, 'components/styles/')
export const entryRoot = resolve(pkgRoot, 'ui-vue')

/* package.json */
export const projectPackage = resolve(projectRoot, 'package.json')
export const compPackage = resolve(compRoot, 'package.json')
export const entryPackage = resolve(entryRoot, 'package.json')

/* dist */
export const buildOutput = resolve(projectRoot, 'dist')
