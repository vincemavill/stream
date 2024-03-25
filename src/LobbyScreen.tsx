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
import RTMPPublisher from 'react-native-rtmp-publisher';
function App({navigation}): React.JSX.Element {
  const publisherRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [publisher, setPublisher] = useState();
  const [refresher, setRefresher] = useState(true);

  // const [textname, onChangeTextName] = useState('beta1');
  // const [textpublisher, onChangeTextPublisher] = useState(
  //   // 'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
  //   'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
  //   // 'https://server.huvr.com:5443/WebRTCAppEE/conference.html'
  // );
  // --------------------------------------------------------
  const [textnameconference, onChangeTextNameConference] =
    useState('beta1');
  const [textconference, onChangeTextConference] = useState(
    // 'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
    'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
    // 'https://server.huvr.com:5443/WebRTCAppEE/conference.html'
  );
  // const [textnameconferencestreamid, onChangeTextNameConferenceStreamId] =
  //   useState('huvr_stream_id_123');
  // --------------------------------------------------------
  const [textnameconferencesubs, onChangeTextNameConferenceSubs] =
    useState('beta1');
  const [textconferencesubs, onChangeTextConferenceSubs] = useState(
    // 'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
    'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
    // 'https://server.huvr.com:5443/WebRTCAppEE/conference.html'
  );
  // const [textnameconferencestreamid, onChangeTextNameConferenceStreamId] =
  //   useState('huvr_stream_id_123');
  // --------------------------------------------------------
  const [textnameplayer, onChangeTextNamePlayer] = useState('beta1');
  const [textplayer, onChangeTextPlayer] = useState(
    'wss://server.huvr.com:5443/WebRTCAppEE/websocket',
    // 'https://server.huvr.com:5443/WebRTCAppEE/play.html?id=vince1&playOrder=webrtc&mute=false&playType=webm',
  );
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
    <KeyboardAvoidingView
      bg="white"
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
      <ScrollView>
        <View style={{marginTop: '10%'}}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              padding: 5,
              textAlign: 'center',
              color: '#FF0000',
            }}>
            REACT NATIVE ANT MEDIA
          </Text>
          <View style={{paddingVertical: 20}}></View>
          {/* <View
            style={{
              borderWidth: 1,
              borderColor: '#000',
              margin: 10,
              padding: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextName}
              value={textname}
              placeholder="Room Name"
            />
            <View style={{padding: 5}}></View>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextPublisher}
              value={textpublisher}
              placeholder="ws://"
            />
            <View style={{padding: 5}}></View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Publisher', {
                  stream_name: textname,
                  player_url: textpublisher,
                });
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  padding: 5,
                  textAlign: 'center',
                  color: '#FF0000',
                }}>
                PROCEED TO PUBLISHER
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingVertical: 20}}></View> */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#000',
              margin: 10,
              padding: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextNameConference}
              value={textnameconference}
              placeholder="Room Name"
            />
            <View style={{padding: 5}}></View>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextConference}
              value={textconference}
              placeholder="ws://"
            />
            <View style={{padding: 5}}></View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Conference', {
                  stream_name: textnameconference,
                  player_url: textconference,
                  // stream_id: textnameconferencestreamid,
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
                PROCEED TO PUBLISHER CONFERENCE
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingVertical: 20}}></View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#000',
              margin: 10,
              padding: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextNameConferenceSubs}
              value={textnameconferencesubs}
              placeholder="Room Name"
            />
            <View style={{padding: 5}}></View>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextConferenceSubs}
              value={textconferencesubs}
              placeholder="ws://"
            />
            <View style={{padding: 5}}></View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ConferenceSubs', {
                  stream_name: textnameconferencesubs,
                  player_url: textconferencesubs,
                  // stream_id: textnameconferencestreamid,
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
                PROCEED TO SUBSCRIBER CONFERENCE
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingVertical: 20}}></View>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#000',
              margin: 10,
              padding: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextNamePlayer}
              value={textnameplayer}
              placeholder="Stream Name"
            />
            <View style={{padding: 5}}></View>
            <TextInput
              style={{
                height: 40,
                // margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: '#fff',
                color: '#000',
              }}
              onChangeText={onChangeTextPlayer}
              value={textplayer}
              placeholder=""
            />
            <View style={{padding: 5}}></View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WebRTCPlayer', {
                  stream_name: textnameplayer,
                  player_url: textplayer,
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
                PROCEED TO SUBSCRIBER PLAYER
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default App;
