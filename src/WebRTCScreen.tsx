import React, {useCallback, useRef, useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';
import {useAntMedia, rtc_view} from '@antmedia/react-native-ant-media';

import InCallManager from 'react-native-incall-manager';

export default function App({navigation}) {
  var defaultStreamName = 'streamTest1';
  // const webSocketUrl = 'ws://server.huvr.com:5080/WebRTCAppEE/websocket';
  const webSocketUrl = 'ws://34.236.237.158:5080/WebRTCAppEE/websocket';
  //or webSocketUrl: 'wss://server.com:5443/WebRTCAppEE/websocket',

  const streamNameRef = useRef<string>(defaultStreamName);
  const [localMedia, setLocalMedia] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [textname, onChangeTextName] = useState('streamTest1');
  const [textpublisher, onChangeTextPublisher] = useState('ws://34.236.237.158:5080/WebRTCAppEE/websocket');


  let localStream: any = useRef(null);

  useEffect(() => {
    console.log(' localStream.current ', localStream.current);
  }, []);
  useEffect(() => {
    streamNameRef.current = textname;
  }, [textname]);

  const adaptor = useAntMedia({
    url: textpublisher,
    mediaConstraints: {
      audio: true,
      video: {
        width: 1920,
        height: 1080,
        frameRate: 30,
        facingMode: 'front',
      },
    },
    callback(command: any, data: any) {
      switch (command) {
        case 'pong':
          break;
        case 'publish_started':
          console.log('publish_started');
          setIsPlaying(true);
          break;
        case 'publish_finished':
          console.log('publish_finished');
          InCallManager.stop();
          setIsPlaying(false);
          break;
        default:
          console.log(command);
          break;
      }
    },
    callbackError: (err: any, data: any) => {
      console.error('callbackError', err, data);
    },
    peer_connection_config: {
      iceServers: [
        {
          url: 'stun:stun.l.google.com:19302',
        },
      ],
    },
    debug: true,
  });

  useEffect(() => {
    const verify = () => {
      console.log('in verify');

      if (adaptor.localStream.current && adaptor.localStream.current.toURL()) {
        console.log('in verify if adaptor local stream', adaptor.localStream);

        console.log(
          'localStream.current.toURL()',
          adaptor.localStream.current.toURL(),
        );

        return setLocalMedia(adaptor.localStream.current.toURL());
      }
      setTimeout(verify, 5000);
    };
    verify();
  }, [adaptor.localStream]);

  useEffect(() => {
    if (localMedia) {
      InCallManager.start({media: 'video'});
    }
  }, [localMedia]);

  const handlePublish = useCallback(() => {
    if (!adaptor) {
      return;
    }

    adaptor.publish(streamNameRef.current);
  }, [adaptor]);

  const handleStop = useCallback(() => {
    if (!adaptor) {
      return;
    }
    adaptor.stop(streamNameRef.current);
  }, [adaptor]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>Ant Media WebRTC Publish</Text>
        {localMedia ? <>{rtc_view(localMedia, styles.streamPlayer)}</> : <></>}
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
          placeholder="Stream Name"
        />
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
        {!isPlaying ? (
          <>
            <TouchableOpacity onPress={handlePublish} style={styles.button}>
              <Text>Start Publishing</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={handleStop} style={styles.button}>
              <Text>Stop Publishing</Text>
            </TouchableOpacity>
          </>
        )}
        <>
            <TouchableOpacity onPress={()=>{
              navigation.goBack();
            }} style={styles.button}>
              <Text>Go Back</Text>
            </TouchableOpacity>
        </>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignSelf: 'center',
    width: '80%',
    height: '80%',
  },
  streamPlayer: {
    width: '100%',
    height: '80%',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
  },
  heading: {
    alignSelf: 'center',
  },
});