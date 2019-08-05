'use strict';
import {useRef} from 'react';
import {ContainerOptions, NavigatorConfig} from './NavigationContainer';
import {StrMap} from '../../TypeUtil';

export type NavigatorMap = StrMap<NavigatorConfig>;
export function useNavigatorMap(options: ContainerOptions): NavigatorMap {
  return useRef<NavigatorMap>(
    options.navigators.reduce(
      (map: NavigatorMap, navigator: NavigatorConfig) => {
        map[navigator.name] = {
          name: navigator.name,
          component: navigator.component,
          options: navigator.options,
        };
        return map;
      },
      {}
    )
  ).current;
}
