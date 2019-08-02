'use strict';
import {useEffect, useRef} from 'react';
import {BackHandler} from 'react-native';
import {NavigatorOptions, ScreenConfig} from './Navigator';

export type ScreenMap = {[key: string]: ScreenConfig};
export function useScreenMap(options: NavigatorOptions): ScreenMap {
  return useRef<{[key: string]: ScreenConfig}>(
    options.screens.reduce(
      (map: {[key: string]: ScreenConfig}, screen: ScreenConfig) => {
        map[screen.name] = {name: screen.name, component: screen.component};
        return map;
      },
      {}
    )
  ).current;
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
