import { copy, writeFile } from 'fs-extra'
import * as path from 'path'
import { exec, cd } from 'shelljs'

import { patchPackage } from './package/patch-package'
import { Settings } from './settings'

export const setupMeta = async ({ name, sourceDir, targetDir }: Settings) => {
  try {
    await copy(path.join(sourceDir, '../src/templates/common'), targetDir)
    await copy(path.join(sourceDir, '../src/templates/meta'), targetDir)

    exec(`cd "${targetDir}" && git init`)

    await writeFile(path.join(targetDir, '.env'), '')

    const metaPackagePath = path.join(targetDir, 'package.json')
    const metaPackage = patchPackage(require(metaPackagePath))
    metaPackage.name = name
    metaPackage.description = `${name} full stack project.`
    metaPackage.keywords = [name, 'full-stack-generator']

    await writeFile(metaPackagePath, JSON.stringify(metaPackage, null, 2))

    cd(targetDir)
    exec(`npm i`)
  } catch (error) {
    console.error(error)
  }
}
