export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', '__tests__', 'docs', 'test-utils']
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}
