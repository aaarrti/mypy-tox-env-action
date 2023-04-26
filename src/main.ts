import * as core from '@actions/core'
import {runWithArgs} from './action'

async function run(): Promise<void> {
  if (!process.env.hasOwnProperty('GITHUB_TOKEN')) {
    core.setFailed('GITHUB_TOKEN is undefined')
  }
  try {
    await runWithArgs({
      checkName: core.getInput('checkName'),
      command: core.getInput('command'),
      args: core.getInput('args'),
      github_token: process.env['GITHUB_TOKEN']!!,
      annotations_limit: 50
    })
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
