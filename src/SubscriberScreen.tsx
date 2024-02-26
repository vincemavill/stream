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
  const [textsubscriber, onChangeTextSubscriber] = useState('https://rtmp.huvr.com/live/');
  const [resetpublisher, setResetPublisher] = useState(true);
  const [resetsubscriber, setResetSubscriber] = useState(true);
  const [camera, setCamera] = useState(1);
  const [zoom, setZoom] = useState(0.0);
  const [mute, setMute] = useState(false);
  useEffect(() => {}, []);
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
          style={{height: '100%', width: '100%', zIndex: 100}}
          // videoAspectRatio="16:9"
          // source={{uri: 'https://rtmp.huvr.com/live/vince.flv'}}
          source={{uri: textsubscriber}}
          // resizeMode="fill"
          autoAspectRatio={true}
          ref={v => {
            console.log(v);
          }}
          muted={mute}
          playInBackground={true}
        />
      ) : (
        <View style={{height: '100%', width: '100%'}}></View>
      )}
      <View style={{position: 'absolute', zIndex: 150, top: 50, width: '100%'}}>
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
            color: '#000',
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
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              if (mute) {
                setMute(false);
              } else {
                setMute(true);
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
        </View>
      </View>
    </SafeAreaView>
  );
}
export default App;
