let sourceMap = !!process.env.sourceMap

function reset () {
  sourceMap = !!process.env.sourceMap
}

export function define (object: Record<string, any>) {
  Object.assign(process.env, object)
  reset()
}

export {
  sourceMap,
}
