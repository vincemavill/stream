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
  KeyboardAvoidingView,
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
// import RTMPPublisher from 'react-native-rtmp-publisher';
import RTMPPublisher from 'react-native-publisher';
function App({route, navigation}): React.JSX.Element {
  const publisherRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [publisher, setPublisher] = useState();
  const [refresher, setRefresher] = useState(true);
  const [textpublisher, onChangeTextPublisher] = useState('rtmp://rtmp.huvr.com/live');
  const [textsubscriber, onChangeTextSubscriber] = useState('');
  const [resetpublisher, setResetPublisher] = useState(true);
  const [resetsubscriber, setResetSubscriber] = useState(true);
  const [camera, setCamera] = useState(1);
  const [zoom, setZoom] = useState(0.0);
  const [mute, setMute] = useState(false);
  const [audioType, setAudioType] = useState('SPEAKER');
  const [status_value, setStatus] = useState('');
  useEffect(() => {}, []);
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
        await publisherRef.current.setAudioInput('SPEAKER');
      }
    }, 1500);
  };
  // -------------------------------------------
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const handleSound = async () => {
    if (publisherRef.current) {
      if (audioType === 'SPEAKER') {
        setAudioType('BLUETOOTH_HEADSET');
        await publisherRef.current.setAudioInput('BLUETOOTH_HEADSET');
      } else if (audioType === 'BLUETOOTH_HEADSET') {
        setAudioType('WIRED_HEADSET');
        await publisherRef.current.setAudioInput('WIRED_HEADSET');
      } else if (audioType === 'WIRED_HEADSET') {
        setAudioType('SPEAKER');
        await publisherRef.current.setAudioInput('SPEAKER');
      }
    }
  };
  return (
    <KeyboardAvoidingView
      bg="white"
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
      {resetpublisher ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <RTMPPublisher
            style={{height: '100%', width: Platform.OS === 'ios' ? '100%' : '115%'}}
            ref={publisherRef}
            // streamURL="rtmp://your-publish-url"
            videoSettings={route.params.videosettings}
            allowedVideoOrientations={[
              'portrait',
              'landscapeLeft',
              'landscapeRight',
              // "portraitUpsideDown"
            ]}
            videoOrientation="portrait"
            AudioInputType="speaker"
            streamURL={textpublisher}
            streamName=""
            onConnectionFailedRtmp={() => {}}
            onConnectionStartedRtmp={() => {}}
            onConnectionSuccessRtmp={() => {}}
            onDisconnectRtmp={() => {}}
            onNewBitrateRtmp={() => {}}
            onStreamStateChanged={(status: any) => {
              console.log(status);
              setStatus(status);
            }}
          />
        </View>
      ) : (
        <View style={{height: '100%', width: '100%'}}></View>
      )}
      <View style={{position: 'absolute', zIndex: 1, top: 50, width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            GO BACK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Subscriber');
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            GO TO SUBSCRIBER
          </Text>
        </TouchableOpacity>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#fff',
            color: '#000',
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
                fontSize: 15,
                fontWeight: 'bold',
                padding: 5,
                textAlign: 'center',
                color: '#FF0000',
              }}>
              SWITCH CAMERA
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#fff',
            }}>
            {'    '}
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
                fontSize: 15,
                fontWeight: 'bold',
                padding: 5,
                textAlign: 'center',
                color: '#FF0000',
              }}>
              {mute ? 'UNMUTE' : 'MUTE'}
            </Text>
          </TouchableOpacity>
          {/* <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#fff',
            }}>
            {'    '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleSound();
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                padding: 5,
                textAlign: 'center',
                color: '#FF0000',
              }}>
              {audioType}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={{position: 'absolute', zIndex: 1, bottom: 0}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Subscriber');
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            {status_value}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
export default App;
