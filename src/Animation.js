/*
  @format
  @flow strict-local
*/
'use strict';
import * as React from 'react';
import {useRef} from 'react';
import {Animated} from 'react-native';

export function useAnimatedValue(initialValue: number): Animated.Value {
  return useRef<Animated.Value>(new Animated.Value(initialValue)).current;
}
