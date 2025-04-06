import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './navigation/AppStack';
import AuthStack from './navigation/AuthStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './screens/Onboarding/OnboardingScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SplashAnimation from './components/SplashAnimation';

export default function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        setShowOnboarding(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    checkLaunch();
    return () => unsubscribe();
  }, []);

  if (loading) return <SplashAnimation />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {showOnboarding ? (
          <OnboardingScreen />
        ) : user ? (
          <AppStack />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
