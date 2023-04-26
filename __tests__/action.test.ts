import {expect, describe, it, jest, afterEach} from '@jest/globals'
import * as mypy_action from '../src/action'
import {RAW_OUTPUT, TOX_RUN_OUTPUT} from './data.test'

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
