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
  Dimensions,
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
function App({navigation}): React.JSX.Element {
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
  const [textbitrate, setTextBitrate] = useState('1500000');
  const [textaudiobitrate, setTextAudioBitrate] = useState('128000');
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
  // -------------------------------------------
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={{marginTop: '50%'}}>
        <TouchableOpacity
          onPress={() => {
            requestCameraPermission();
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            CHECK PERMISSION
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 50}}></View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Publisher', {
              videosettings: {
                width: 720,
                height: 1280,
                bitrate: 1500000,
                audioBitrate: 128000,
              },
            });
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            PUBLISHER STANDARD
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 20}}></View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Publisher', {
              videosettings: {
                width: 1080,
                height: 1920,
                bitrate: 5000 * 1024,
                audioBitrate: 192 * 1000,
              },
            });
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            PUBLISHER HD
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 20}}></View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            padding: 5,
            color: '#FF0000',
          }}>
          Bitrate
        </Text>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#fff',
            color: '#000',
          }}
          onChangeText={setTextBitrate}
          value={textbitrate}
          placeholder="bitrate"
          keyboardType="numeric"
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            padding: 5,
            color: '#FF0000',
          }}>
          AudioBitrate
        </Text>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#fff',
            color: '#000',
          }}
          onChangeText={setTextAudioBitrate}
          value={textaudiobitrate}
          placeholder="audioBitrate"
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Publisher', {
              videosettings: {
                width: 720,
                height: 1280,
                bitrate: parseInt(textbitrate),
                audioBitrate: parseInt(textaudiobitrate),
              },
            });
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            PUBLISHER COSTUM BITRATE
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 20}}></View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Subscriber');
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            GO TO SUBSCRIBER
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default App;
