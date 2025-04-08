// screens/InitialScreen.js
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function InitialScreen({ navigation }) {
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');

      if (hasSeenWelcome) {
        navigation.replace('Auth');
      } else {
        await AsyncStorage.setItem('hasSeenWelcome', 'true');
        navigation.replace('Welcome');
      }
    };

    checkFirstLaunch();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator size="large" color="#FFA500" />
    </View>
  );
}
