import React, {useCallback, useRef, useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useAntMedia, rtc_view} from '@antmedia/react-native-ant-media';

export default function App({navigation,route}) {
  // var defaultStreamName = 'stream1';
  // const webSocketUrl = 'ws://server.com:5080/WebRTCAppEE/websocket';
  //or webSocketUrl: 'wss://server.com:5443/WebRTCAppEE/websocket',
  var defaultStreamName = route.params.stream_name;
  const webSocketUrl = route.params.player_url;

  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("status");

  const adaptor = useAntMedia({
    url: webSocketUrl,
    mediaConstraints: {
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: 'front',
      },
    },
    callback(command: any, data: any) {
      setStatus(command)
      switch (command) {
        case 'pong':
          break;
        case 'play_started':
          console.log('play_started');
          setIsPlaying(true);
          break;
        case 'play_finished':
          console.log('play_finished');
          
          setIsPlaying(false);
          setRemoteStream('');
        break;
        case "newStreamAvailable": 
        if(data.streamId == streamNameRef.current)
          setRemoteStream(data.stream.toURL());
        break;
        default:
          console.log(command);
          break;
      }
    },
    callbackError: (err: any, data: any) => {
      setStatus(err)
      console.error('callbackError', err, data);
    },
    peer_connection_config: {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    },
    debug: true,
  });



  const handlePlay = useCallback(() => {
    if (!adaptor) {
      return;
    }

    adaptor.play(streamNameRef.current);
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
        {!isPlaying ? (
          <>
            <TouchableOpacity onPress={handlePlay} style={styles.startButton}>
              <Text>Start Playing</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {remoteMedia ? (
              <>{rtc_view(remoteMedia, styles.streamPlayer)}</>
            ) : (
              <></>
            )}
            <TouchableOpacity onPress={handleStop} style={styles.button}>
              <Text>Stop Playing</Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.heading}>{status}</Text>
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.button}>
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
    width: '90%',
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
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    top: 400,
  },
  heading: {
    alignSelf: 'center',
  },
});