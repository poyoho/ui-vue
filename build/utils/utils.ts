export async function runParallel<T=any> (maxConcurrency: number, source: T[], iteratorFn: (item: T, source: T[]) => void) {
  const ret = []
  const executing: Promise<void>[] = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

export function debounce<T extends (...args: any[]) => void> (handle: T, delay = 300): T {
  let prevTimer: any = null

  return function (this: any, ...args: any[]) {
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    prevTimer = setTimeout(() => {
      handle.apply(this, args)
      prevTimer = null
    }, delay)
  } as any
}
