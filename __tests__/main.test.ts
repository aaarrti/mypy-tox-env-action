import {expect, test} from '@jest/globals'
import * as mypy_action from '../src/main'

const tox_output =
  "type: install_deps> python -I -m pip install 'captum>=0.6' datasets matplotlib mypy pytest 'torch>=1.13.1' 'torchvision>=0.14.1' tqdm 'transformers>=4.26'\n" +
  '.pkg: _optional_hooks> python /Users/artemsereda/miniconda3/lib/python3.10/site-packages/pyproject_api/_backend.py True flit_core.buildapi\n' +
  '.pkg: get_requires_for_build_editable> python /Users/artemsereda/miniconda3/lib/python3.10/site-packages/pyproject_api/_backend.py True flit_core.buildapi\n' +
  '.pkg: get_requires_for_build_sdist> python /Users/artemsereda/miniconda3/lib/python3.10/site-packages/pyproject_api/_backend.py True flit_core.buildapi\n' +
  '.pkg: build_sdist> python /Users/artemsereda/miniconda3/lib/python3.10/site-packages/pyproject_api/_backend.py True flit_core.buildapi\n' +
  "type: install_package_deps> python -I -m pip install 'torch>=1.13.1' tqdm\n" +
  'type: install_package> python -I -m pip install --force-reinstall --no-deps /Users/artemsereda/Documents/IdeaProjects/NoiseGrad/.tox/.tmp/package/3/noisegrad-0.0.1.tar.gz\n' +
  'type: commands[0]> mypy .\n' +
  'noisegrad/utils.py:11: error: Missing return statement  [return]\n' +
  'noisegrad/utils.py:24: error: Function "numpy.core.multiarray.array" is not valid as a type [valid-type]\n' +
  'noisegrad/utils.py:24: note: Perhaps you need "Callable[...]" or a callback protocol?\n' +
  'noisegrad/utils.py:26: error: np.array? has no attribute "min"  [attr-defined]\n' +
  'noisegrad/utils.py:27: error: np.array? has no attribute "max"  [attr-defined]\n' +
  'noisegrad/utils.py:28: error: np.array? has no attribute "max"  [attr-defined]\n' +
  'noisegrad/utils.py:29: error: Unsupported operand type for unary - (np.array?)  [operator]\n' +
  'noisegrad/utils.py:29: error: np.array? has no attribute "min"  [attr-defined]\n' +
  'noisegrad/utils.py:30: error: np.array? has no attribute "max"  [attr-defined]\n' +
  'noisegrad/utils.py:32: error: np.array? has no attribute "min"  [attr-defined]\n' +
  'noisegrad/utils.py:75: error: "ndarray[Any, Any]" has no attribute "cpu"  [attr-defined]\n' +
  'noisegrad/noisegrad.py:137: error: No overload variant of "mean" of "_TensorBase" matches argument type "Tuple[int]"  [call-overload]\n' +
  'noisegrad/noisegrad.py:137: note: Possible overload variants:\n' +
  'noisegrad/noisegrad.py:137: note:     def mean(self, *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/noisegrad.py:137: note:     def mean(self, dim: Union[int, Union[Size, List[int], Tuple[int, ...]], None], keepdim: bool = ..., *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/noisegrad.py:137: note:     def mean(self, dim: Sequence[Union[str, ellipsis, None]], keepdim: bool = ..., *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/noisegrad.py:161: error: Return type "Tensor" of "enhance_explanation" incompatible with return type "int" in supertype "NoiseGrad"  [override]\n' +
  'noisegrad/noisegrad.py:208: error: No overload variant of "mean" of "_TensorBase" matches argument type "Tuple[int, int]"  [call-overload]\n' +
  'noisegrad/noisegrad.py:208: note: Possible overload variants:\n' +
  'noisegrad/noisegrad.py:208: note:     def mean(self, *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/noisegrad.py:208: note:     def mean(self, dim: Union[int, Union[Size, List[int], Tuple[int, ...]], None], keepdim: bool = ..., *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/noisegrad.py:208: note:     def mean(self, dim: Sequence[Union[str, ellipsis, None]], keepdim: bool = ..., *, dtype: Optional[dtype] = ...) -> Tensor\n' +
  'noisegrad/explainers.py:21: error: Function "numpy.core.multiarray.array" is not valid as a type  [valid-type]\n' +
  'noisegrad/explainers.py:21: note: Perhaps you need "Callable[...]" or a callback protocol?\n' +
  'noisegrad/explainers.py:53: error: Function "numpy.core.multiarray.array" is not valid as a type  [valid-type]\n' +
  'noisegrad/explainers.py:53: note: Perhaps you need "Callable[...]" or a callback protocol?\n' +
  'Found 15 errors in 3 files (checked 7 source files)\n' +
  'type: exit 1 (30.66 seconds) /Users/artemsereda/Documents/IdeaProjects/NoiseGrad> mypy . pid=59381\n'

const expected = [
  {
    path: 'noisegrad/utils.py',
    start_line: 11,
    end_line: 11,
    annotation_level: 'failure',
    message: 'Missing return statement  [return]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 24,
    end_line: 24,
    annotation_level: 'failure',
    message:
      'Function "numpy.core.multiarray.array" is not valid as a type [valid-type]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 26,
    end_line: 26,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "min"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 27,
    end_line: 27,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "max"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 28,
    end_line: 28,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "max"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 29,
    end_line: 29,
    annotation_level: 'failure',
    message: 'Unsupported operand type for unary - (np.array?)  [operator]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 29,
    end_line: 29,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "min"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 30,
    end_line: 30,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "max"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 32,
    end_line: 32,
    annotation_level: 'failure',
    message: 'np.array? has no attribute "min"  [attr-defined]'
  },
  {
    path: 'noisegrad/utils.py',
    start_line: 75,
    end_line: 75,
    annotation_level: 'failure',
    message: '"ndarray[Any, Any]" has no attribute "cpu"  [attr-defined]'
  },
  {
    path: 'noisegrad/noisegrad.py',
    start_line: 137,
    end_line: 137,
    annotation_level: 'failure',
    message:
      'No overload variant of "mean" of "_TensorBase" matches argument type "Tuple[int]"  [call-overload]'
  },
  {
    path: 'noisegrad/noisegrad.py',
    start_line: 161,
    end_line: 161,
    annotation_level: 'failure',
    message:
      'Return type "Tensor" of "enhance_explanation" incompatible with return type "int" in supertype "NoiseGrad"  [override]'
  },
  {
    path: 'noisegrad/noisegrad.py',
    start_line: 208,
    end_line: 208,
    annotation_level: 'failure',
    message:
      'No overload variant of "mean" of "_TensorBase" matches argument type "Tuple[int, int]"  [call-overload]'
  },
  {
    path: 'noisegrad/explainers.py',
    start_line: 21,
    end_line: 21,
    annotation_level: 'failure',
    message:
      'Function "numpy.core.multiarray.array" is not valid as a type  [valid-type]'
  },
  {
    path: 'noisegrad/explainers.py',
    start_line: 53,
    end_line: 53,
    annotation_level: 'failure',
    message:
      'Function "numpy.core.multiarray.array" is not valid as a type  [valid-type]'
  }
]

test('test parse output', function () {
  const annotations = mypy_action.parseMypyOutput(tox_output)
  expect(annotations).toMatchObject(expected)
})
