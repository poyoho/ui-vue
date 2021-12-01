import { basename, extname, relative, resolve } from 'path'

const absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/
const relativePath = /^\.?\.\//

export function isAbsolute(path: string): boolean {
  return absolutePath.test(path)
}

export function isRelative(path: string): boolean {
  return relativePath.test(path)
}

export function normalize(path: string): string {
  if (path.indexOf('\\') == -1) return path
  return path.replace(/\\/g, '/')
}

export function getAliasName(id: string): string {
  const base = basename(id)
  return base.substr(0, base.length - extname(id).length)
}

export function relativeId(id: string): string {
  if (!isAbsolute(id)) return id
  return relative(resolve(), id)
}

export function isPathFragment(name: string): boolean {
  // starting with "/", "./", "../", "C:/"
  return (
    name[0] === '/' || (name[0] === '.' && (name[1] === '/' || name[1] === '.')) || isAbsolute(name)
  )
}
