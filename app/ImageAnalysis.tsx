import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

const COMPUTER_VISION_ENDPOINT = "https://sasehack.cognitiveservices.azure.com/";
const COMPUTER_VISION_KEY = `${process.env.COMPUTER_VISION_KEY}`;

// Replace this with a valid image URL of a recycling bin or recyclable items
const TEST_IMAGE_URL = 'https://c7.alamy.com/comp/H2YJGA/3d-business-people-illustration-businessman-hiding-in-a-trash-bin-H2YJGA.jpg';

interface ImageAnalysisProps {
  onAnalysisComplete: (result: string, imageUri: string) => void;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onAnalysisComplete }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const analyzeImage = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`${COMPUTER_VISION_ENDPOINT}vision/v3.2/analyze?visualFeatures=Objects,Tags,Description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': COMPUTER_VISION_KEY,
        },
        body: JSON.stringify({ url: TEST_IMAGE_URL }),
      });

      const data = await response.json();
      
      // Detect recycling bins with expanded criteria
      const recyclingBins = data.objects?.filter((obj: any) => 
        ['bin', 'container', 'recycling bin', 'waste container', 'trash can'].includes(obj.object.toLowerCase())
      ) || [];

      // Use tags for additional validation
      const isRecyclingBin = recyclingBins.length > 0 || 
        data.tags?.some((tag: { name: string; }) => ['recycling bin', 'waste container'].includes(tag.name.toLowerCase()));

      // Detect recyclable items
      const recyclableItems = data.objects?.filter((obj: any) => 
        ['bottle', 'can', 'paper', 'cardboard', 'plastic'].includes(obj.object.toLowerCase())
      ) || [];

      // Improved fullness estimation
      let fullness = 'Unable to determine';
      if (isRecyclingBin) {
        const bin = recyclingBins[0] || { rectangle: { w: data.metadata.width, h: data.metadata.height } };
        const binArea = bin.rectangle.w * bin.rectangle.h;
        const imageArea = data.metadata.width * data.metadata.height;
        const fillPercentage = (binArea / imageArea) * 100;

        if (fillPercentage < 25) fullness = '0-25% full (Nearly Empty)';
        else if (fillPercentage < 50) fullness = '26-50% full (Partially Full)';
        else if (fillPercentage < 75) fullness = '51-75% full (Mostly Full)';
        else fullness = '76-100% full (Very Full)';
      }

      // Prepare analysis result with more context
      const analysisResult = {
        binsDetected: isRecyclingBin ? 1 : 0,
        recyclableItemsDetected: recyclableItems.length,
        binFullness: fullness,
        detectedObjects: data.objects?.map((obj: any) => obj.object) || [],
        tags: data.tags?.map((tag: any) => tag.name) || [],
        description: data.description?.captions[0]?.text || 'No description available',
        confidence: isRecyclingBin ? 'High' : 'Low',
        recommendations: isRecyclingBin 
          ? 'Recycling bin detected successfully.' 
          : 'This may not be a recycling bin. Please check the image.',
      };

      setResult(JSON.stringify(analysisResult, null, 2));
      onAnalysisComplete(JSON.stringify(analysisResult, null, 2), TEST_IMAGE_URL);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult('Error analyzing image');
      onAnalysisComplete('Error analyzing image', TEST_IMAGE_URL);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: TEST_IMAGE_URL }} style={styles.image} />
      <Button title="Analyze Image" onPress={analyzeImage} disabled={analyzing} />
      {analyzing && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Analysis Results:</Text>
          <Text>Bins Detected: {JSON.parse(result).binsDetected}</Text>
          <Text>Recyclable Items: {JSON.parse(result).recyclableItemsDetected}</Text>
          <Text>Bin Fullness: {JSON.parse(result).binFullness}</Text>
          <Text>Detected Objects: {JSON.parse(result).detectedObjects.join(', ')}</Text>
          <Text>Tags: {JSON.parse(result).tags.join(', ')}</Text>
          <Text>Description: {JSON.parse(result).description}</Text>
          <Text>Confidence: {JSON.parse(result).confidence}</Text>
          <Text>Recommendations: {JSON.parse(result).recommendations}</Text>
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
  image: {
    width: 200,
    height: 200,
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