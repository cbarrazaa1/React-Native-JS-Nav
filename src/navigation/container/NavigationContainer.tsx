'use strict';
import * as React from 'react';

export type NavigatorConfig = {
  readonly name: string;
  readonly component: () => JSX.Element;
};

export type ContainerOptions = {
  readonly navigators: NavigatorConfig[];
  readonly initialNavigatorName: string;
};

type Props = {
  readonly options: ContainerOptions;
};

function NavigationContainer({options}: Props): JSX.Element {
  return <></>;
}
