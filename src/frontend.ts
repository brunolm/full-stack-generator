import { copy, pathExists, writeFile, remove, move } from 'fs-extra'
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

    await remove(path.join(clientDir, '.git'))
    await remove(path.join(clientDir, 'src/logo.svg'))
    await remove(path.join(clientDir, 'src/App.css'))
    await remove(path.join(clientDir, 'src/App.test.tsx'))
    await remove(path.join(clientDir, 'src/App.tsx'))
    await remove(path.join(clientDir, 'src/index.css'))

    await move(path.join(clientDir, 'src/serviceWorker.ts'), path.join(clientDir, 'src/service-worker.ts'))

    const isWin = process.platform === 'win32'

    await writeFile(path.join(clientDir, '.env'), isWin ? `CHOKIDAR_USEPOLLING='true'\n` : '')

    const clientPackagePath = path.join(clientDir, 'package.json')
    const clientPackage = require(clientPackagePath)
    clientPackage.name = name
    clientPackage.version = '1.0.0'
    clientPackage.description = `${name} full stack project.`
    clientPackage.keywords = [name, 'full-stack-generator']

    await writeFile(clientPackagePath, JSON.stringify(clientPackage, null, 2))

    const installDependencies = 'npm i -S styled-components'
    const installDevDependencies = 'npm i -D tslint tslint-config-prettier tslint-consistent-codestyle'

    cd(targetDir)
    exec(
      `docker-compose run --rm client bash -c "${installDependencies} && ${installDevDependencies}"`,
    )
  } catch (error) {
    console.error(error)
  }
}
