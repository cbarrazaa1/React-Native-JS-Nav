'use strict';
import * as React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Nullable} from '../../TypeUtil';
import {useNavigatorMap} from './ContainerUtil';
import {NavigatorOptions} from '../navigators/NavigatorUtil';

export type NavigatorConfig = {
  readonly name: string;
  readonly component: (options: NavigatorOptions) => JSX.Element;
  readonly options: NavigatorOptions;
};

export type ContainerOptions = {
  readonly navigators: NavigatorConfig[];
  readonly initialNavigatorName: string;
};

type Props = {
  readonly options: ContainerOptions;
};

function NavigationContainer({options}: Props): JSX.Element {
  const navigatorMap = useNavigatorMap(options);
  const [currentNavigator, setCurrentNavigator] = useState<NavigatorConfig>(
    navigatorMap[options.initialNavigatorName]
  );
  const [nextNavigator, setNextNavigator] = useState<Nullable<NavigatorConfig>>(
    null
  );

  const Scene = currentNavigator.component;
  return (
    <View style={styles.container}>
      <Scene options={currentNavigator.options} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});

export default React.memo<Props>(NavigationContainer);
