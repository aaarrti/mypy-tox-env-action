import {expect, describe, it, jest, afterEach} from '@jest/globals'
import * as mypy_action from '../src/action'
import {RAW_OUTPUT, TOX_RUN_OUTPUT} from './data.test'
import * as github from '@actions/github'

const github_key = '....'

afterEach(() => {
  // restore replaced property
  jest.restoreAllMocks()
})

describe('test parse output', function () {
  it('raw', function () {
    const annotations = mypy_action.parseMypyOutput(RAW_OUTPUT)
    expect(annotations.length).toBe(15)
  })

  it('tox', function () {
    const annotations = mypy_action.parseMypyOutput(TOX_RUN_OUTPUT)
    expect(annotations.length).toBe(15)
  })
})

describe('test create check', function () {
  it('check run exists', async function () {
    jest
      .spyOn(github.context, 'repo', 'get')
      .mockReturnValue({owner: 'aaarrti', repo: 'NoiseGrad'})
    jest.replaceProperty(
      github.context,
      'sha',
      'cc39571e66677719532169af615db76c5af5f92f'
    )

    //await mypy_action.findCheckRun('Lint', github_key)
  })

  it('check run does not exist', async function () {
    jest
      .spyOn(github.context, 'repo', 'get')
      .mockReturnValue({owner: 'aaarrti', repo: 'Transformers-X-Gradients'})
    jest.replaceProperty(
      github.context,
      'sha',
      '855d9419cea1d7561464eb399f8c048f8cdc02fe'
    )

    // await mypy_action.findCheckRun('Lint', github_key)
  })
})
