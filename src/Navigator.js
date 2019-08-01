/*
  @format
  @flow strict-local
*/
'use strict';
import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import {ScreenContainer, Screen} from 'react-native-screens';
import {useAnimatedValue} from './Animation';

export type ScreenProps = {|
  +navigation: NavigationProp,
|};

export type ScreenConfig = {|
  +name: string,
  +component: React.ComponentType<ScreenProps>,
|};

export type NavigatorOptions = {|
  +screens: $ReadOnlyArray<ScreenConfig>,
  +initialScreenName: string,
|};

export type NavigationProp = {|
  +push: (screenName: string) => void,
  +pop: () => void,
|};

type TransitionState = 'NONE' | 'PUSH' | 'POP';

type Props = {|
  +options: NavigatorOptions,
|};

export function Navigator({options}: Props): React.Node {
  const screenMap = useRef<{[string]: ScreenConfig}>(
    options.screens.reduce((map, screen) => {
      map[screen.name] = {name: screen.name, component: screen.component};
      return map;
    }, {})
  );
  const [navigationStack, setNavigationStack] = useState<
    $ReadOnlyArray<ScreenConfig>
  >([screenMap.current[options.initialScreenName]]);
  const [transitionState, setTransitionState] = useState<TransitionState>(
    'NONE'
  );
  const transition = useAnimatedValue(0);

  useEffect(() => {
    if (transitionState === 'PUSH') {
      transition.setValue(0);
      Animated.timing(transition, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setTransitionState('NONE'));
    }
  }, [navigationStack]);

  const navigation = {
    push: (screenName: string): void => {
      setTransitionState('PUSH');
      setNavigationStack(prev => [...prev, screenMap.current[screenName]]);
    },
    pop: (): void => {
      alert(navigationStack.length);
      if (navigationStack.length > 1) {
        alert('test');
        setTransitionState('POP');
        transition.setValue(0);
        Animated.timing(transition, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          setNavigationStack(prev => prev.slice(0, prev.length - 1));
          setTransitionState('NONE');
        });
      }
    },
  };

  useEffect(() => {
    const back = (): boolean => {
      navigation.pop();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => BackHandler.removeEventListener('hardwareBackPress', back);
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      {navigationStack.map((screen, i) => {
        const Scene = screen.component;
        let style = null;

        if (i === navigationStack.length - 1) {
          if (transitionState === 'PUSH') {
            style = {
              translateX: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [Dimensions.get('window').width, 0],
              }),
            };
          } else if (transitionState === 'POP') {
            style = {
              translateX: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Dimensions.get('window').width],
              }),
            };
          }
        } else if (i === navigationStack.length - 2) {
          if (transitionState === 'PUSH') {
            const interpolation = transition.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 6],
            });
            style = {
              translateX: interpolation,
              translateY: interpolation,
              opacity: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5],
              }),
            };
          } else if (transitionState === 'POP') {
            const interpolation = transition.interpolate({
              inputRange: [0, 1],
              outputRange: [6, 0],
            });
            style = {
              translateX: interpolation,
              translateY: interpolation,
              opacity: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            };
          }
        }
        return (
          <Screen
            pointerEvents={transitionState === 'NONE' ? 'auto' : 'none'}
            key={screen.name}
            style={[styles.screen, style]}
          >
            <Scene navigation={navigation} />
          </Screen>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  screen: {
    ...StyleSheet.absoluteFillObject,
  },
});
