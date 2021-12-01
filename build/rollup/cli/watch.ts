import * as rollup from 'rollup'
import defu from 'defu'
import { bold, cyan, green, underline } from 'chalk'
import dateTime from 'date-time'

import { handleError, stderr, timing } from './logging'
import { relativeId } from './paths'

export function watch (inputOptions: rollup.RollupOptions, silent = false) {
  let watcher: rollup.RollupWatcher
  process.on('uncaughtException', close)
  // http://nodejs.cn/api/tty.html
  if (!process.stdin.isTTY) {
    process.stdin.on('end', close)
    process.stdin.resume()
  }

  function engine () {
    try {
      watcher = rollup.watch(defu({
        watch: {
          buildDelay: 300
        },
      }, inputOptions))
    } catch (err: any) {
      throw handleError(err)
    }
    watcher.on('event', event => {
      switch (event.code) {
      case 'ERROR':
        handleError(event.error, true)
        break

      case 'START':
        if (!silent) {
          underline(`rollup v${rollup.VERSION}`)
        }
        break

      case 'BUNDLE_START':
        if (!silent) {
          let input = event.input
          if (typeof input !== 'string') {
            input = Array.isArray(input)
              ? input.join(', ')
              : Object.values(input as Record<string, string>).join(', ')
          }
          stderr(
            cyan(`bundles ${bold(input)} → ${bold(event.output.map(relativeId).join(', '))}...`)
          )
        }
        break

      case 'BUNDLE_END':
        if (!silent)
          stderr(
            green(
              `created ${bold(event.output.map(relativeId).join(', '))} in ${bold(event.duration)}`
            )
          )
        if (event.result && event.result.getTimings) {
          timing(event.result.getTimings())
        }
        break

      case 'END':
        if (!silent) {
          stderr(`\n[${dateTime()}] waiting for changes...`)
        }
      }

      if ('result' in event && event.result) {
        event.result.close().catch(error => handleError(error, true))
      }
    })
    return watcher
  }

  function close (code: number | null) {
    process.removeListener('uncaughtException', close)
    // removing a non-existent listener is a no-op
    process.stdin.removeListener('end', close)

    if (watcher) watcher.close()

    if (code) {
      process.exit(code)
    }
  }


  return {
    watcher: engine(),
    close
  }
}
