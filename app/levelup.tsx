import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ImageBackground } from 'react-native';
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
      setTimeout(() => router.back(), 3000);
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
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <Animated.Image
            source={require('../assets/level-up-badge.png')}
            style={styles.levelUpImage}
          />
          <Text style={styles.spinningText}>Level {level}</Text>
        </Animated.View>
        <Animated.Text style={[styles.levelUpText, { opacity: opacityAnim }]}>
          Level Up!
        </Animated.Text>
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
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  levelUpImage: {
    width: 150,
    height: 150,
  },
  spinningText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  levelUpText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default LevelUpScreen;