/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useRef, useContext} from 'react';
import type {PropsWithChildren} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  PermissionsAndroid,
  Switch,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {VLCPlayer, VlCPlayerView} from 'react-native-vlc-media-player';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LobbyScreen from './src/LobbyScreen';
import PublisherScreen from './src/PublisherScreen';
import SubscriberScreen from './src/SubscriberScreen';
import WebRTCScreen from './src/WebRTCScreen';
import WebRTCPlayerScreen from './src/WebRTCPlayerScreen';
import ConferenceScreen from './src/ConferenceScreen';
import ConferenceSubsScreen from './src/ConferenceSubsScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lobby">
        <Stack.Screen name="Lobby" component={LobbyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Publisher" component={PublisherScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Subscriber" component={SubscriberScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WebRTCS" component={WebRTCScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WebRTCPlayer" component={WebRTCPlayerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Conference" component={ConferenceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConferenceSubs" component={ConferenceSubsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
