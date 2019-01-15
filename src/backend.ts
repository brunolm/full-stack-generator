import { copy, writeFile } from 'fs-extra'
import * as path from 'path'
import { cd, exec } from 'shelljs'

import { patchPackage } from './package/patch-package'
import { Settings } from './settings'

export const setupBackend = async ({ name, sourceDir, targetDir }: Settings) => {
  const apiDir = path.join(targetDir, 'api')

  await copy(path.join(sourceDir, '../src/templates/common'), apiDir)
  await copy(path.join(sourceDir, '../src/templates/backend'), apiDir)

  await writeFile(path.join(apiDir, '.env'), '')

  const apiPackagePath = path.join(apiDir, 'package.json')
  const apiPackage = require(apiPackagePath)
  apiPackage.name = name
  apiPackage.description = `${name} full stack project.`
  apiPackage.keywords = [name, 'full-stack-generator']

  await writeFile(apiPackagePath, JSON.stringify(apiPackage, null, 2))

  cd(targetDir)
  exec(`docker-compose run --rm api npm i`)
}
