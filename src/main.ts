import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import {ExecOutput} from '@actions/exec'
import { components } from "@octokit/openapi-types";

const {GITHUB_TOKEN} = process.env
const annotations_limit: number = 50


type CheckRun = components["schemas"]["check-run"]
type CheckAnnotation = components["schemas"]["check-annotation"]


export interface Annotation {
  path: string
  start_line: number
  end_line: number
  annotation_level: string
  message: string
}

// export, because we need to test it.
export const parseMypyOutput = (output: string): Annotation[] =>
  output
    .split('\n')
    .map(line => line.split(':').map(i => i.trim()))
    .filter(line => line[0].includes('.py'))
    .map(line => line.slice(0, 4).concat([line.slice(4).join(':')]))
    .filter(line => line[2] === 'error')
    .map(line => {
      return {
        path: line[0].replace('./', ''),
        start_line: parseInt(line[1]),
        end_line: parseInt(line[1]),
        annotation_level: 'failure',
        message: line[3]
      }
    })
    .slice(0, annotations_limit)

async function findCheckRun(
  check_name: string,
  github_token: string
): Promise<CheckRun> {
  const octokit = github.getOctokit(String(github_token))
  let response: Response = await octokit.rest.checks.listForRef({
    check_name,
    ...github.context.repo,
    ref: github.context.sha
  })

  let runs: CheckRun[] = response.data.check_runs
  core.info(`${check_name}'s runs = ${runs}`)

  if (runs.length > 0) {
    return runs[0]
  }

  response = await octokit.rest.checks.listForRef({
    ...github.context.repo,
    ref: github.context.sha
  })
  runs = response.data.check_runs
  core.info(`All runs = ${runs}`)
  for (const i of runs) {
    if (i.name.toLocaleLowerCase() === check_name.toLowerCase()) {
      return i
    }
  }
  for (const i of runs) {
    if (i.name.toLocaleLowerCase().includes('mypy')) {
      return i
    }
  }
  for (const i of runs) {
    if (i.name.toLocaleLowerCase().includes('type')) {
      return i
    }
  }
  throw new Error(
    `Could not find check run with name ${check_name}.\n`
  )
}

async function createCheck(
  check_name: string,
  title: string,
  annotations: Annotation[],
  github_token: string
): Promise<void> {
  const octokit = github.getOctokit(String(github_token))
  const check_run = await findCheckRun(check_name, github_token)
  await octokit.rest.checks.update({
    ...github.context.repo,
    check_run: check_run.id,
    output: {
      title,
      summary: `${annotations.length} typing errors(s) found`,
      annotations
    }
  })
}

async function runMypy(
  command: string,
  env_name: string,
  args: string
): Promise<ExecOutput> {
  let cmd_args = ['-e', env_name, '--'].concat(args.split(' '))
  const output = await exec.getExecOutput(command, cmd_args, {
    ignoreReturnCode: true
  })
  core.info(`Exec output = ${JSON.stringify(output)}`)
  return output
}

async function run(): Promise<void> {
  if (!process.env.hasOwnProperty('GITHUB_TOKEN')) {
    core.setFailed('GITHUB_TOKEN is undefined')
  }
  const command = core.getInput('command')
  const env_name = core.getInput('env_name')
  const args = core.getInput('args')
  const check_name = core.getInput('check_name')

  try {
    const mypyOutput = await runMypy(command, env_name, args)
    let annotations = parseMypyOutput(mypyOutput.stdout)
    core.info(`Parsed annotations = ${JSON.stringify(annotations)}`)
    if (annotations.length > 0) {
      await createCheck(check_name, 'mypy failure', annotations, GITHUB_TOKEN!!)
      core.setFailed(`${annotations.length} errors(s) found`)
    }
  } catch (error: any) {
    core.error(`Failed with: ${JSON.stringify(error)}`)
    core.setFailed(`Failed with: ${error.message}`)
  }
}

run()
