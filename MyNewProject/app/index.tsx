import React from 'react';
import { View, Text, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Image Picker Test</Text>
      <Button title="Pick an image" onPress={pickImage} />
    </View>
  );
}