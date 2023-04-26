import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'

export interface Annotation {
  path: string
  start_line: number
  end_line: number
  annotation_level: string
  message: string
}

export interface InputT {
  github_token: string
  checkName: string
  command: string
  args: string
  annotations_limit: number
}

export interface CheckRun {
  id: string
  name: string
  status: 'queued' | 'in_progress' | 'completed'
  started_at: string // DateTime
}

export async function runWithArgs(cmd_inputs: InputT): Promise<void> {
  const mypyOutput = await runMypy(cmd_inputs.command, cmd_inputs.args)
  let annotations = parseMypyOutput(mypyOutput, cmd_inputs.annotations_limit)
  if (annotations.length == 0) {
    return
  }
  await createCheck(
    cmd_inputs.checkName,
    'mypy failure',
    annotations,
    cmd_inputs.github_token
  )
  core.setFailed(`${annotations.length} errors(s) found`)
}

export function parseMypyOutput(
  output: string,
  annotations_limit: number = 50
): Annotation[] {
  return output
    .split('\n')
    .map(line => line.split(':').map(i => i.trim()))
    .map(line => line.map(i => i.trim()))
    .filter(details => details.length >= 4 && details[2] === 'error')
    .map(details => {
      let message = details[3]
      message = message.slice(0, message.indexOf('[') - 1).trim()
      return {
        path: details[0].replace('./', ''),
        start_line: parseInt(details[1]),
        end_line: parseInt(details[1]),
        annotation_level: 'failure',
        message
      }
    })
    .slice(0, annotations_limit)
}

export async function findCheckRun(
  check_name: string,
  github_token: string
): Promise<CheckRun> {
  const octokit = github.getOctokit(String(github_token))
  let response = await octokit.rest.checks.listForRef({
    check_name,
    ...github.context.repo,
    ref: github.context.sha
  })
  // @ts-ignore
  let runs: CheckRun[] = response.data.check_runs

  if (runs.length > 0) {
    return runs[0]
  }

  response = await octokit.rest.checks.listForRef({
    ...github.context.repo,
    ref: github.context.sha
  })
  // @ts-ignore
  runs = response.data.check_runs
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
    `Could not find check run with name ${check_name}.\nAll checks for ref = ${runs}`
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

async function runMypy(command: string, args: string): Promise<string> {
  let cmd_args = args.split(' ')
  if (command.startsWith('tox') && !args.startsWith('--')) {
    cmd_args = ['--'].concat(cmd_args)
  }
  let myOutput = ''
  const options = {
    listeners: {
      stdout: function (data: Buffer) {
        myOutput += data.toString()
      }
    }
  }
  await exec.exec(command, cmd_args, options)
  return myOutput
}
