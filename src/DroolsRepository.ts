import fs from 'fs'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import path from 'path'

import { copyGlob, deleteGlob, normaliseEOL } from './FileUtils'
import * as process from "process"


const DROOLS_DIRNAME = 'drools'

export const syncDrools = async (commandId: string) => {
  switch (commandId) {
    case 'pull':
      await pullDrools()
      break
    case 'push':
      await pushDrools()
      break
    case 'clean':
      await cleanDrools()
      break
    default:
      throw new Error(`syncDrools: command '${commandId}' is not found`)
  }
}

const pullDrools = async () => {
  await withLocalDroolsGit(async (localDroolsGitPath: string) => {
    const mseDroolsDirPath = path.resolve('assets', DROOLS_DIRNAME)

    await deleteGlob(mseDroolsDirPath)

    const filePaths = await copyGlob('src/**', path.join(mseDroolsDirPath, 'src'), {
      cwd: localDroolsGitPath,
    })

    await normaliseEOL(filePaths)

    const changedFiles: string[] = await getChangedFiles(path.join(mseDroolsDirPath, '..', '..'), (file: string) =>
      file.startsWith(`assets/${DROOLS_DIRNAME}/`),
    )

    console.log(`Pulled ${changedFiles.length} file(s)`, changedFiles)
  })
}

const pushDrools = async () => {
  await withLocalDroolsGit(async (localDroolsGitPath: string) => {

    const mseDroolsDirPath = path.resolve('assets', DROOLS_DIRNAME)

    await deleteGlob('src/**', { cwd: localDroolsGitPath })

    await copyGlob('src/**', path.join(localDroolsGitPath, 'src'), {
      cwd: mseDroolsDirPath,
    })

    const changedFiles: string[] = await getChangedFiles(localDroolsGitPath)

    if (changedFiles.length) {
      await git.add({ fs, dir: localDroolsGitPath, filepath: 'src' })

      await git.commit({
        fs,
        dir: localDroolsGitPath,
        author: { name: process.env.DROOLS_USERNAME },
        message: 'sync-drools push',
      })

      git.push({
        fs,
        http,
        dir: localDroolsGitPath,
        onAuth: handleGitAuth,
      })
    }

    console.log(`Pushed ${changedFiles.length} file(s)`, changedFiles)
  })
}

const cleanDrools = async () => {

  await deleteGlob(DROOLS_DIRNAME, { cwd: process.env.localTmpPath, force: true })
}

type LocalDroolsGitCallback = (localDroolsGitPath: string) => Promise<void>

const withLocalDroolsGit = async (callback: LocalDroolsGitCallback): Promise<void> => {

  const droolsGitUrl = `${process.env.DROOLS_BASE_URL}/${process.env.DROOLS_GIT_PATH}`
  const timestamp = new Date().toISOString().replace(/\W/g, '').substring(2, 15).replace('T', '_')
  const localDroolsGitPath = path.join(process.env.localTmpPath?process.env.localTmpPath:'tmp', DROOLS_DIRNAME, timestamp)

  await git.clone({
    fs,
    http,
    dir: localDroolsGitPath,
    url: droolsGitUrl,
    singleBranch: true,
    depth: 1,
    onAuth: handleGitAuth,
  })

  await callback(localDroolsGitPath)

  if (process.env.NODE_ENV === 'production') {
    await deleteGlob(localDroolsGitPath)
  }
}

const gitStatusIndex = {
  HEAD: 1,
  WORKDIR: 2,
  STAGE: 3,
}

const getChangedFiles = async (gitPath: string, filter?: (file: string) => boolean): Promise<string[]> => {
  const statusMatrix = await git.statusMatrix({ fs, dir: gitPath, filter })

  return statusMatrix
    .filter((row) => {
      // [1, 1, 1] means no change https://isomorphic-git.org/docs/en/statusMatrix
      return row[gitStatusIndex.HEAD] !== 1 || row[gitStatusIndex.WORKDIR] !== 1 || row[gitStatusIndex.STAGE] !== 1
    })
    .map((row) => row[0])
}

const handleGitAuth = () => {

  return {
    username: process.env.DROOLS_USERNAME,
    password: process.env.DROOLS_PASSWORD,
  }
}
