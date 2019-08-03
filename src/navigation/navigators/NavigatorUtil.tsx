'use strict';
import {useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {NavigatorOptions, ScreenConfig} from './StackNavigator';
import {StrMap} from '../../TypeUtil';

export type ScreenMap = StrMap<ScreenConfig>;
export function useScreenMap(options: NavigatorOptions): ScreenMap {
  return useRef<ScreenMap>(
    options.screens.reduce((map: ScreenMap, screen: ScreenConfig) => {
      map[screen.name] = {name: screen.name, component: screen.component};
      return map;
    }, {})
  ).current;
}

export function useNavigationStack(
  initialValue: ScreenConfig[]
): [
  ScreenConfig[],
  React.Dispatch<React.SetStateAction<ScreenConfig[]>>,
  React.MutableRefObject<ScreenConfig[]>
] {
  const [stack, setStack] = useState<ScreenConfig[]>(initialValue);
  const ref = useRef(stack);
  return [stack, setStack, ref];
}

export function useBackHandler(callback: () => void): void {
  useEffect(() => {
    const back = (): boolean => {
      callback();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => BackHandler.removeEventListener('hardwareBackPress', back);
  }, []);
}
