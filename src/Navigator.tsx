'use strict';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, StyleSheet} from 'react-native';
import {Screen, ScreenContainer} from 'react-native-screens';
import {useAnimatedValue} from './Animation';
import {
  useBackHandler,
  useScreenMap,
  useNavigationStack,
} from './NavigationUtil';

export type ScreenProps = {
  navigation: NavigationProp;
};

export type ScreenConfig = {
  name: string;
  component: (props: ScreenProps) => JSX.Element;
};

export type NavigatorOptions = {
  screens: ScreenConfig[];
  initialScreenName: string;
};

export type NavigationProp = {
  push: (screenName: string) => void;
  pop: () => void;
};

enum TransitionState {
  NONE,
  PUSH,
  POP,
}

type Props = {
  options: NavigatorOptions;
};

export function Navigator({options}: Props): JSX.Element {
  const screenMap = useScreenMap(options);
  const [navigationStack, setNavigationStack, stackRef] = useNavigationStack([
    screenMap[options.initialScreenName],
  ]);
  const [transitionState, setTransitionState] = useState<TransitionState>(
    TransitionState.NONE
  );
  const transition = useAnimatedValue(0);

  // override back action on android to pop screen
  useBackHandler(pop);

  // listen for push animation
  useEffect(() => {
    stackRef.current = navigationStack;
    if (transitionState === TransitionState.PUSH) {
      transition.setValue(0);
      Animated.timing(transition, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setTransitionState(TransitionState.NONE));
    }
  }, [navigationStack]);

  function push(screenName: string): void {
    setTransitionState(TransitionState.PUSH);
    setNavigationStack(prev => [...prev, screenMap[screenName]]);
  }

  function pop(): void {
    if (stackRef.current.length > 1) {
      setTransitionState(TransitionState.POP);
      transition.setValue(0);
      Animated.timing(transition, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setNavigationStack(prev => prev.slice(0, prev.length - 1));
        setTransitionState(TransitionState.NONE);
      });
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      {navigationStack.map(
        (screen: ScreenConfig, i: number): JSX.Element => {
          const Scene = screen.component;
          const isLastScreen = i === navigationStack.length - 1;
          const isCurrentScreen = i === navigationStack.length - 2;
          let style = {};

          if (isLastScreen) {
            if (transitionState === TransitionState.PUSH) {
              style = {
                translateX: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').width, 0],
                }),
              };
            } else if (transitionState === TransitionState.POP) {
              style = {
                translateX: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Dimensions.get('window').width],
                }),
              };
            }
          } else if (isCurrentScreen) {
            if (transitionState === TransitionState.PUSH) {
              const interpolation = transition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -100],
              });
              style = {
                translateX: interpolation,
                opacity: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.5],
                }),
              };
            } else if (transitionState === TransitionState.POP) {
              const interpolation = transition.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              });
              style = {
                translateX: interpolation,
                opacity: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              };
            }
          }

          // disable screen actions (tapping, etc) when transitioning
          const pointerEvents =
            transitionState === TransitionState.NONE ? 'auto' : 'none';
          return (
            <Screen
              pointerEvents={pointerEvents}
              key={screen.name}
              style={[styles.screen, style]}
            >
              <Scene navigation={{push, pop}} />
            </Screen>
          );
        }
      )}
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
