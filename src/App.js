/*
  @format
  @flow strict-local
*/
import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Navigator, type ScreenProps} from './Navigator';

function Screen1({navigation}: ScreenProps): React.Node {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text onPress={() => navigation.push('Screen2')}>SCREEN 1</Text>
    </View>
  );
}

function Screen2({navigation}: ScreenProps): React.Node {
  return (
    <View
      style={{
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text onPress={() => navigation.pop()}>SCREEN 2</Text>
    </View>
  );
}

const options = {
  initialScreenName: 'Screen1',
  screens: [
    {
      name: 'Screen1',
      component: Screen1,
    },
    {
      name: 'Screen2',
      component: Screen2,
    },
  ],
};

type Props = {||};
function App(): React.Node {
  return <Navigator options={options} />;
}

const styles = StyleSheet.create({});

export default React.memo<Props>(App);
