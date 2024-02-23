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
function App({navigation}): React.JSX.Element {
  const publisherRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [publisher, setPublisher] = useState();
  const [refresher, setRefresher] = useState(true);
  const [textpublisher, onChangeTextPublisher] = useState('');
  const [textsubscriber, onChangeTextSubscriber] = useState('https://rtmp.huvr.com/live/friday.flv');
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
      {resetsubscriber ? (
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
            BACK TO PUBLISHER
          </Text>
        </TouchableOpacity>
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
      </View>
    </SafeAreaView>
  );
}
export default App;
