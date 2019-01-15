#!/usr/bin/env node

import { prompt } from 'enquirer'
import * as fs from 'fs-extra'
import * as path from 'path'

import { setupBackend } from './backend'
import { setupFrontend } from './frontend'
import { exec } from 'shelljs';
import { setupMeta } from './meta';

interface Options {
  name: string
  backend: 'Node.js' | 'None'
  frontend: 'React' | 'None'
}

export const run = async () => {
  const { name, backend, frontend } = await prompt<Options>([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      initial: 'o',
      validate: (value) => {
        if (!/^[A-Z0-9._-]{1,256}$/i.test(value)) {
          return 'Invalid folder name'
        }

        return true
      },
    },
    {
      type: 'select',
      name: 'backend',
      message: 'Backend?',
      choices: ['Node.js', 'None'],
    },
    {
      type: 'select',
      name: 'frontend',
      message: 'Frontend?',
      choices: ['React', 'None'],
    },
  ])

  if (await fs.existsSync(name)) {
    const { overwrite } = await prompt<{ overwrite: string }>({
      type: 'confirm',
      name: 'overwrite',
      message: 'Folder already exist, overwrite files?',
      initial: true,
    })

    if (!overwrite) {
      console.log('Canceling...')
      process.exit(0)
    }
  } else {
    await fs.mkdir(name)
  }

  const sourceDir = __dirname
  const targetDir = path.resolve(name)

  console.log('Setting up meta...')
  setupMeta({ name, sourceDir, targetDir })

  if (backend !== 'None') {
    console.log('Setting up backend...')
    setupBackend({ name, sourceDir, targetDir })
  }

  if (frontend !== 'None') {
    console.log('Setting up frontend...')
    await setupFrontend({ name, sourceDir, targetDir })
  }
}

run()
