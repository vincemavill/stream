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

// import {NodeCameraView} from 'react-native-nodemediaclient';
// import {NodeCameraView} from 'nodemedia-client-with-zoom';

import RTMPPublisher from 'react-native-rtmp-publisher';

function App(): React.JSX.Element {
  const publisherRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [publisher, setPublisher] = useState();
  const [refresher, setRefresher] = useState(true);
  const [textpublisher, onChangeTextPublisher] = useState(
    '',
  );
  const [textsubscriber, onChangeTextSubscriber] = useState(
    '',
  );

  const [resetpublisher, setResetPublisher] = useState(true);
  const [resetsubscriber, setResetSubscriber] = useState(true);

  const [camera, setCamera] = useState(1);
  const [zoom, setZoom] = useState(0.0);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          // PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);
        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] ===
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
    setTimeout(async () => {
      if (publisherRef.current) {
        // publisherRef.current.start();
        // publisherRef.current.startStream();
        await publisherRef.current.startStream();
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
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}

      {isEnabled ? (
        resetpublisher ? (
          <>
            {/* <NodeCameraView

              zoomScale={zoom}
              autopreview={true}
              smoothSkinLevel={3}
              style={{height: '75%', width: '100%'}}
              ref={v => (publisherRef.current = v)}
              // outputUrl = {"rtmp://192.168.0.10/live/stream"}
              outputUrl={textpublisher}
              camera={{cameraId: 1, cameraFrontMirror: true}}
              audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
              video={{
                preset: 12,
                bitrate: 400000,
                profile: 1,
                fps: 30,
                videoFrontMirror: true,
              }}
            /> */}

            <RTMPPublisher
              style={{height: '100%', width: '100%'}}
              ref={publisherRef}
              // streamURL="rtmp://your-publish-url"
            
              streamURL={textpublisher}
              streamName=""
              onConnectionFailedRtmp={() => {}}
              onConnectionStartedRtmp={() => {}}
              onConnectionSuccessRtmp={() => {}}
              onDisconnectRtmp={() => {}}
              onNewBitrateRtmp={() => {}}
              onStreamStateChanged={(status: any) => {
                console.log(status);
              }}
            />
          </>
        ) : (
          <View style={{height: '100%', width: '100%'}}></View>
        )
      ) : resetsubscriber ? (
        <VLCPlayer
          style={{height: '100%', width: '100%'}}
          // videoAspectRatio="16:9"
          // source={{uri: 'https://rtmp.huvr.com/live/vince.flv'}}
          source={{uri: textsubscriber}}
          // resizeMode="fill"
          autoAspectRatio={true}
        />
      ) : (
        <View style={{height: '100%', width: '100%'}}></View>
      )}

      <View style={{position: 'absolute', zIndex: 1, top: 50, width: '100%'}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            padding: 5,
            textAlign: 'center',
            color: isEnabled ? '#fff' : '#000',
          }}>
          React Native SRS rtmp
        </Text>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: isEnabled ? '#fff' : '#000'}}>
            {isEnabled ? 'Publisher' : 'Subscriber/Video'}
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
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
              }}
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
                    color: '#fff',
                  }}>
                  SWITCH CAMERA
                </Text>
              </TouchableOpacity>
              <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 5,
                    textAlign: 'center',
                    color: '#fff',
                  }}>
                  {"    "}
                </Text>
              <TouchableOpacity
                onPress={() => {
                  if (mute) {
                    setMute(false);
                    publisherRef.current.unmute();
                  } else {
                    setMute(true);
                    publisherRef.current.mute();
                  }
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 5,
                    textAlign: 'center',
                    color: '#fff',
                  }}>
                  {mute ? "MUTE" : "UNMUTE"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
              }}
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
      </View>
    </SafeAreaView>
  );
}


export default App;
