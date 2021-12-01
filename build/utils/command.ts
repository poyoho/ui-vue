import glob from 'fast-glob'
import { bgRed, red, underline } from 'chalk'

import { excludeFiles } from '../utils/pkg'

export async function getComponentTargets () {
  const files = excludeFiles(
    await glob([
      'packages/components/**/*/index.ts'
    ])
  )
  const matchTarget = new RegExp('packages/components/(.*)/index.ts')
  return files.map(file => matchTarget.exec(file)![1])
}

export function fuzzyMatchTarget (partialTargets: string[], allTargets: string[]) {
  const matched: string[] = []
  partialTargets.forEach(partialTarget => {
    for (const target of allTargets) {
      if (target.match(partialTarget)) {
        matched.push(target)
      }
    }
  })
  if (matched.length) {
    return matched
  } else {
    console.log()
    console.error(
      `  ${bgRed.white(' ERROR ')} ${red(
        `Target ${underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

export async function filterTargets (targets: string[]) {
  const allTargets = await getComponentTargets()
  if (!targets.length) {
    targets = allTargets
  } else {
    targets = fuzzyMatchTarget(targets, allTargets)
  }
  return targets
}
