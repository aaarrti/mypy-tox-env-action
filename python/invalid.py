from __future__ import annotations
from typing import Dict, Hashable, TypeVar, Callable, Mapping


K = TypeVar("K", bound=Hashable, covariant=True)
V = TypeVar("V")
R = TypeVar("R")


def map_dict(
    dictionary: Mapping[K, V],
    value_mapper: Callable[[V], R],
    key_mapper: Callable[[K], K] | None = None,
) -> Dict[str, R]:
    result = {}
    for k, v in dictionary.items():
        result[key_mapper(k)] = value_mapper(v)
    return result


def filter_dict(
    dictionary: Mapping[K, V],
    key_filter: Callable[[K], bool] | None = None,
    value_filter: Callable[[V], bool] | None = None,
) -> Dict[K, V]:
    result = {}

    def key_matches(key):
        return key_filter is None or key_filter(key)

    def value_matches(value):
        return value_filter is None or value_filter(value)

    for k, v in dictionary.items():
        if key_matches(k):
            result[k] = value_matches(v)

    return result
