import React, {useState, useEffect} from 'react';
import {View, Button, Text} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

import RNFetchBlob from 'rn-fetch-blob';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFilePath, setRecordedFilePath] = useState('');

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.1);

    const subscription = audioRecorderPlayer.addRecordBackListener(e => {
      console.log('Recording Event:', e); // Log the events emitted by audioRecorderPlayer
    });

    return () => {
      audioRecorderPlayer.removeRecordBackListener(subscription);
    };
  }, []);

  const startRecording = async () => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/recording.aac`;

      await audioRecorderPlayer.startRecorder(filePath);
      setIsRecording(true);
      setRecordedFilePath(filePath);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('in acc', result);
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);

      setRecordedFilePath('');
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const playAudio = async () => {
    const audioFileUrl = 'file:////data/user/0/com.player/files/recording.aac'; // Replace with the URL of your audio file

    try {
      await audioRecorderPlayer.startPlayer(audioFileUrl);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };
  const stopAudio = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  };
  return (
    <View>
      <Button
        onPress={isRecording ? onStopRecord : startRecording}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
      />
      <Text>{isRecording ? 'Recording in progress' : 'Recording stopped'}</Text>

      <Button title="Play Audio" onPress={playAudio} />

      <Button title="Stop Audio" onPress={stopAudio} />
    </View>
  );
};

export default AudioRecorder;
