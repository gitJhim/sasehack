import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useUserStore } from '../state/stores/userStore';

const LevelUpScreen = () => {
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
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.levelUpContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <Text style={styles.levelUpText}>Level Up!</Text>
        <Animated.Text style={[styles.levelText, { opacity: opacityAnim }]}>
          Level {level}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 50, 0, 0.8)', // Dark green background
  },
  levelUpContainer: {
    backgroundColor: '#4CAF50', // Bright green background
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8BC34A', // Light green border
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