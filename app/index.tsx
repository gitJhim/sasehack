import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageAnalysis from '../components/ImageAnalysis';

// Import or define the AnalysisResult interface
interface AnalysisResult {
  binsDetected: number;
  recyclableItemsDetected: number;
  binFullness: string;
  detectedObjects: string[];
  tags: string[];
  description: string;
  confidence: string;
  recommendations: string;
}

export default function Index() {
  const handleAnalysisComplete = (result: AnalysisResult, imageUri: string) => {
    console.log('Analysis result:', result);
    console.log('Image URI:', imageUri);
    // You can add more logic here to handle the analysis result
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recycling Bin Analyzer</Text>
      <ImageAnalysis onAnalysisComplete={handleAnalysisComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});