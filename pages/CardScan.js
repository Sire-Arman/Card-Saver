import React, { useEffect,useRef,useState,useCallback } from 'react';
import { Alert, Pressable, Text, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from 'react-native-text-recognition';
import {Camera} from 'expo-camera';
function CardScan() {
  const camera = useRef(null);
  
  const [result,setResult]=useState("");
  const recognizeText = async (imageUri) => {
    try {
      const result = await TextRecognition.recognize(imageUri);
      console.log(result);
      setResult(JSON.stringify(result));
      // Handle the text recognition result here
    } catch (error) {
      console.error('Text recognition error:', error);
    }
  };

  const captureAndRecognize = useCallback(async () => {
    try {
      if (camera.current) {
        const { uri } = await camera.current.takePictureAsync({
          quality: 1, // Adjust quality as needed
        });
        console.log('Captured photo:', uri);
        recognizeText(uri);
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
    }
  }, []);
  
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access media library is required');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    const selectedImageUri = pickerResult.assets[0].uri;

    recognizeText(selectedImageUri);
  };

  return (<View>
      <Pressable onPress={pickImage}>
        <Text>Open Image Picker</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={captureAndRecognize}>
          <Text style={styles.buttonText}>Capture and Recognize</Text>
        </Pressable>
      <Camera
            photo
            enableHighQualityPhotos
            ref={camera}
            style={styles.camera}
            isActive={true}
          />
         <Text>{result}</Text> 
    </View>
  );
}


const styles = StyleSheet.create({
  camera: {
    marginVertical: 24,
    height: 240,
    width: 360,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
});


export default CardScan;

