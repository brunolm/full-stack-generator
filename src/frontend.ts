import { copy, pathExists, writeFile } from 'fs-extra'
import * as path from 'path'
import { cd, exec } from 'shelljs'

import { patchPackage } from './package/patch-package'
import { Settings } from './settings'

export const setupFrontend = async ({ name, sourceDir, targetDir }: Settings) => {
  try {
    const clientDir = path.join(targetDir, 'client')

    if (await pathExists(clientDir)) {
      console.warn('Client folder already exist, skipping create-react-app setup...')
    } else {
      exec(`npx create-react-app@2 "${clientDir}" --typescript`)
    }

    await copy(path.join(sourceDir, '../src/templates/common'), clientDir)
    await copy(path.join(sourceDir, '../src/templates/frontend'), clientDir)

    const clientPackagePath = path.join(clientDir, 'package.json')
    const clientPackage = patchPackage(require(clientPackagePath))
    clientPackage.name = name
    clientPackage.description = `${name} full stack project.`
    clientPackage.keywords = [name, 'full-stack-generator']

    await writeFile(clientPackagePath, JSON.stringify(clientPackage, null, 2))

    cd(clientDir)
    exec(`npm i -D tslint tslint-config-prettier tslint-consistent-codestyle prettier`)
  } catch (error) {
    console.error(error)
  }
}
