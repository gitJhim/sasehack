import React, { useState, useRef, useCallback } from 'react';
import { View, Button, Image, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevices, CameraPermissionStatus, CameraDevice } from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const COMPUTER_VISION_ENDPOINT = 'https://sasehack.cognitiveservices.azure.com/';
const COMPUTER_VISION_KEY = 'fb76ef3efd004d1782def5e59029fc42';

export interface AnalysisResult {
  binsDetected: number;
  recyclableItemsDetected: number;
  binFullness: string;
  detectedObjects: string[];
  tags: string[];
  description: string;
  confidence: string;
  recommendations: string;
}

export interface ImageAnalysisProps {
  onAnalysisComplete: (result: AnalysisResult, imageUri: string) => void;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onAnalysisComplete }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('not-determined');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find((d: { position: string; }) => d.position === 'back');

  React.useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = useCallback(async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setCameraPermission(cameraPermission);
    // You might want to handle library permission separately if needed
  }, []);

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto({
          flash: 'auto',
        });
        
        setSelectedImage(photo.path);
        setIsCameraActive(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select or take a photo first');
      return;
    }

    setAnalyzing(true);
    try {
      const imageData = await FileSystem.readAsStringAsync(selectedImage, { encoding: FileSystem.EncodingType.Base64 });

      const apiResponse = await fetch(`${COMPUTER_VISION_ENDPOINT}vision/v3.2/analyze?visualFeatures=Objects,Tags,Description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': COMPUTER_VISION_KEY,
        },
        body: Buffer.from(imageData, 'base64'),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log('Raw API response:', JSON.stringify(data, null, 2));
      
      const analysisResult = processAnalysisResults(data);

      setResult(analysisResult);
      onAnalysisComplete(analysisResult, selectedImage);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const processAnalysisResults = (data: any): AnalysisResult => {
    const recycleBinKeywords = ['bin', 'container', 'recycling bin', 'waste container', 'trash can', 'recycling'];
    const recyclableItemKeywords = ['bottle', 'can', 'paper', 'cardboard', 'plastic'];

    const recycleBins = data.objects?.filter((obj: any) => 
      recycleBinKeywords.some(keyword => obj.object.toLowerCase().includes(keyword))
    ) || [];

    const recycleBinTags = data.tags?.filter((tag: any) => 
      recycleBinKeywords.some(keyword => tag.name.toLowerCase().includes(keyword))
    ) || [];

    const recyclableItemTags = data.tags?.filter((tag: any) => 
      recyclableItemKeywords.some(keyword => tag.name.toLowerCase().includes(keyword))
    ) || [];

    const isRecyclingBin = recycleBins.length > 0 || recycleBinTags.length > 0;

    let confidence = 'Low';
    let confidencePoints = 0;

    if (recycleBins.length > 0) confidencePoints += 2;
    if (recycleBinTags.length > 0) confidencePoints += 1;
    if (data.description?.captions[0]?.text.toLowerCase().includes('recycling')) confidencePoints += 1;

    if (confidencePoints >= 2) confidence = 'High';
    else if (confidencePoints === 1) confidence = 'Medium';

    let fullness = 'Unable to determine';
    if (isRecyclingBin) {
      const description = data.description?.captions[0]?.text.toLowerCase() || '';
      if (description.includes('full') || description.includes('filled')) {
        fullness = '76-100% full (Very Full)';
      } else if (description.includes('empty')) {
        fullness = '0-25% full (Nearly Empty)';
      } else {
        fullness = '26-75% full (Partially Full)';
      }
    }

    return {
      binsDetected: recycleBins.length,
      recyclableItemsDetected: recyclableItemTags.length,
      binFullness: fullness,
      detectedObjects: data.objects?.map((obj: any) => obj.object) || [],
      tags: data.tags?.map((tag: any) => tag.name) || [],
      description: data.description?.captions[0]?.text || 'No description available',
      confidence,
      recommendations: isRecyclingBin 
        ? 'Recycling bin detected successfully.' 
        : 'This may not be a recycling bin. Please check the image.',
    };
  };

  if (cameraPermission === 'not-determined') {
    return <Text>Requesting permissions...</Text>;
  }

  if (cameraPermission === 'denied') {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isCameraActive && device ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <Button title="Cancel" onPress={() => setIsCameraActive(false)} />
        </View>
      ) : (
        <>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
          <View style={styles.buttonContainer}>
            <Button title="Take Photo" onPress={() => setIsCameraActive(true)} disabled={!device} />
            <Button title="Pick Image" onPress={pickImage} />
          </View>
          <Button 
            title="Analyze Image" 
            onPress={analyzeImage} 
            disabled={analyzing || !selectedImage} 
          />
        </>
      )}
      
      {analyzing && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Analysis Results:</Text>
          <Text>Bins Detected: {result.binsDetected}</Text>
          <Text>Recyclable Items: {result.recyclableItemsDetected}</Text>
          <Text>Bin Fullness: {result.binFullness}</Text>
          <Text>Detected Objects: {result.detectedObjects.join(', ')}</Text>
          <Text>Tags: {result.tags.join(', ')}</Text>
          <Text>Description: {result.description}</Text>
          <Text>Confidence: {result.confidence}</Text>
          <Text>Recommendations: {result.recommendations}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3/4,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ImageAnalysis;