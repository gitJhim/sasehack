
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageAnalysis from './ImageAnalysis';

export default function Index() {
  const handleAnalysisComplete = (result: string, imageUri: string) => {
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 50,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',  
    marginBottom: 100,
  },
});