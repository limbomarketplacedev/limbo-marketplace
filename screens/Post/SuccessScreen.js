import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SuccessScreen() {
  const navigation = useNavigation();
  const scale = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Text style={styles.icon}>🎉</Text>
      </Animated.View>
      <Text style={styles.text}>Posted Successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#FFA500',
    padding: 50,
    borderRadius: 100,
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
