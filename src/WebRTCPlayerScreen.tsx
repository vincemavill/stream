import React, {useCallback, useRef, useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import {useAntMedia, rtc_view} from '@antmedia/react-native-ant-media';
import {VLCPlayer, VlCPlayerView} from 'react-native-vlc-media-player';
import {WebView} from 'react-native-webview';

export default function App({navigation, route}) {
  var defaultStreamName = route.params.stream_name;
  // const webSocketUrl = 'ws://server.huvr.com:5080/WebRTCAppEE/websocket';
  // const webSocketUrl = 'ws://34.236.237.158:5080/WebRTCAppEE/websocket';
  //or webSocketUrl: 'wss://server.com:5443/WebRTCAppEE/websocket',
  const webSocketUrl = route.params.player_url;

  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('status');

  const adaptor = useAntMedia({
    url: webSocketUrl,
    mediaConstraints: {
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: 'front', // front or  environment
      },
    },
    callback(command: any, data: any) {
      setStatus(command);
      switch (command) {
        case 'pong':
          break;
        case 'play_started':
          setStatus('play_started');
          console.log('play_started');
          setIsPlaying(true);
          break;
        case 'play_finished':
          setStatus('play_finished');
          console.log('play_finished');
          setIsPlaying(false);
          setRemoteStream('');
          break;
        case 'newStreamAvailable':
          if (data.streamId == streamNameRef.current)
            setRemoteStream(data.stream.toURL());
            // setRemoteStream(streamNameRef.current.toURL());
            // console.log("streamNameRef.current-------------------");
            // console.log(data);
          break;
        default:
          console.log(command);
          break;
      }
    },
    callbackError: (err: any, data: any) => {
      console.error('callbackError', err, data);
      setStatus(err);
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
        <Text style={styles.heading}>Ant Media WebRTC Play</Text>

        {
          !isPlaying ? (
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
          )
        }
        {
        // webSocketUrl ? (
          // <WebView
          //   originWhitelist={['*']}
          //   source={{uri: webSocketUrl}}
          //   onLoadProgress={({ nativeEvent }) => {
          //     // this.loadingProgress = nativeEvent.progress;
          //     // console.log(nativeEvent.progress)
          //     // if(nativeEvent.progress === 1){
          //     //   alert("yes");
          //     // }
          //   }}
          //   onLoad={syntheticEvent => {
          //     // alert("load");
          //   }}
          //   onLoadStart={(syntheticEvent) => {
          //     // const { nativeEvent } = syntheticEvent;
          //     // console.warn(
          //     //   'WebView received error status code: ',
          //     //   nativeEvent.statusCode,
          //     // );
          //     // alert("load");
          //   }}
          //   style={{flex: 1}}
          // />
          
        //   <VLCPlayer
        //   // style={{height: '100%', width: '100%', zIndex: 100}}
        //   style={{flex: 1}}
        //   // videoAspectRatio="16:9"
        //   // source={{uri: 'https://rtmp.huvr.com/live/vince.flv'}}
        //   source={{uri: "https://server.huvr.com:5443/WebRTCAppEE/play.html?id=vince1&mute=false"}}
        //   // resizeMode="fill"
        //   autoAspectRatio={true}
        //   ref={v => {
        //     // console.log(v);
        //   }}
        //   // muted={mute}
        //   playInBackground={true}
        // />
        // ) : null
        }

         <Text style={{textAlign: 'center', marginBottom:20}}>{status}</Text> 
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
