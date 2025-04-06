import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Image } from 'react-native';

export default function SplashAnimation() {
  const scale = useRef(new Animated.Value(0.3)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const thump = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 4200,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 4200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start(() => {
      Animated.sequence([
        Animated.timing(thump, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(thump, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/ic.png')}
        style={[
          styles.icon,
          {
            transform: [
              { scale },
              { rotate: spin },
              { scale: thump },
            ],
          },
        ]}
      />
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
  icon: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
});
