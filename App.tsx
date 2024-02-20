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
  Platform
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

import {NodeCameraView} from 'react-native-nodemediaclient';

function App(): React.JSX.Element {
  const publisherRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [publisher, setPublisher] = useState();
  const [refresher, setRefresher] = useState(true);
  const [textpublisher, onChangeTextPublisher] = useState('');
  const [textsubscriber, onChangeTextSubscriber] = useState('');

  const [resetpublisher, setResetPublisher] = useState(true);
  const [resetsubscriber, setResetSubscriber] = useState(true);

  const [camera, setCamera] = useState(1);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          // if (nodeCameraRef.current) {
          //   nodeCameraRef.current.startPreview();
          // }
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleResetPub = () => {
    Keyboard.dismiss();
    setResetPublisher(false);
    setTimeout(() => {
      setResetPublisher(true);
    }, 1000);
    setTimeout(() => {
      if (publisherRef.current) {
        publisherRef.current.start();
      }
    }, 1500);
  };

  const handleResetSub = () => {
    Keyboard.dismiss();
    setResetSubscriber(false);
    setTimeout(() => {
      setResetSubscriber(true);
    }, 1500);
  };

  // -------------------------------------------

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          padding: 5,
          textAlign: 'center',
        }}>
        React Native SRS rtmp
      </Text>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {isEnabled ? 'Publsher' : 'Subscriber/Video'}
        </Text>
        <View>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#FF0000'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      {isEnabled ? (
        <>
          <TextInput
            style={{height: 40, margin: 12, borderWidth: 1, padding: 10}}
            onChangeText={onChangeTextPublisher}
            value={textpublisher}
            placeholder="rtmp://rtmp.huvr.com/live/example?secret=huvr"
          />
          <View style={{marginHorizontal: 12, marginBottom: 12}}>
            <Button
              onPress={() => {
                handleResetPub();
              }}
              title={'publish'}
              color="#841584"
            />
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={{height: 40, margin: 12, borderWidth: 1, padding: 10}}
            onChangeText={onChangeTextSubscriber}
            value={textsubscriber}
            placeholder="https://rtmp.huvr.com/live/example.flv"
          />
          <View style={{marginHorizontal: 12, marginBottom: 12}}>
            <Button
              onPress={() => {
                handleResetSub();
              }}
              title={'Start'}
              color="#FFA500"
            />
          </View>
        </>
      )}

      {isEnabled ? (
        resetpublisher ? (
          <>
            <NodeCameraView
              style={{height: '75%', width: '100%'}}
              ref={v => (publisherRef.current = v)}
              // outputUrl={'rtmp://rtmp.huvr.com/live/vince?secret=huvr'}
              outputUrl={textpublisher}
              camera={{cameraId: 1, cameraFrontMirror: true}}
              audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
              video={{
                preset: 12,
                bitrate: 400000,
                profile: 1,
                fps: 15,
                videoFrontMirror: true,
              }}
              autopreview={true}
              denoise={true}
            />
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  if (publisherRef.current) {
                    publisherRef.current.switchCamera();
                  }
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 5,
                    textAlign: 'center',
                  }}>
                    SWITCH CAMERA
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{height: '75%', width: '100%'}}></View>
        )
      ) : resetsubscriber ? (
        <VLCPlayer
          style={{height: '75%', width: '100%'}}
          videoAspectRatio="16:9"
          // source={{uri: 'https://rtmp.huvr.com/live/vince.flv'}}
          source={{uri: textsubscriber}}
        />
      ) : (
        <View style={{height: '75%', width: '100%'}}></View>
      )}

      {/* <Button title="request permissions" onPress={requestCameraPermission} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  remoteVideo: {
    flex: 1,
  },
  remoteVideos: {
    backgroundColor: '#0003',
    height: 200,
    width: 200,
  },
  localVideo: {
    backgroundColor: '#0003',
    height: 200,
    width: 200,
  },
});

export default App;
