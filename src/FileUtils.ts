import cpy from 'cpy'
import del from 'del'
import eol from 'eol'
import fsp from 'fs/promises'

export interface DeleteGlobOptions {
  readonly cwd?: string
  readonly force?: boolean
}

export const deleteGlob = (patterns: string | string[], options: DeleteGlobOptions = {}): Promise<string[]> => {
  // Need to cast to any, because some globby options are missing from del.Options.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return del(patterns, options as any)
}

export interface CopyGlobOptions {
  readonly cwd?: string
}

export const copyGlob = (
  source: string | string[],
  destination: string,
  options: CopyGlobOptions = {},
): Promise<string[]> => {
  return cpy(source, destination, options)
}

export const normaliseEOL = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    const content = await fsp.readFile(filePath, 'utf-8')

    await fsp.writeFile(filePath, eol.lf(content))
  }
}
