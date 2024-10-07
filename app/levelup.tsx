import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ImageBackground, Image } from 'react-native';
import { useUserStore } from '../state/stores/userStore';
import { useRouter } from 'expo-router';

const LevelUpScreen = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const level = user?.level;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => router.back(), 2000);
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground 
      style={styles.container}
      source={require("../assets/bg.png")}
    >
      <View style={styles.contentContainer}>
        <Animated.Image
          source={require('../assets/levelup.png')}
          style={[
            styles.levelUpImage,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        />
        <Animated.Text style={[styles.levelUpText, { opacity: opacityAnim }]}>
          Level Up!
        </Animated.Text>
        <Animated.Text style={[styles.levelText, { opacity: opacityAnim }]}>
          Level {level}
        </Animated.Text>
        <View className="flex-row p-2 h-12 w-40 rounded-full items-center bg-[#B1ECC8]">
            <Image
              source={require("../assets/kid_star.png")}
              alt="star"
              width={20}
              height={20}
            />
            <Text className="font-bold items-center text-lg">
              {" "}
              Level: {level}
            </Text>
          </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 50, 0, 0.8)', // Dark green background
  },
  contentContainer: {
    alignItems: 'center',
  },
  levelUpImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  levelUpText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8F5E9', // Very light green text
    marginTop: 10,
  },
});

export default LevelUpScreen;