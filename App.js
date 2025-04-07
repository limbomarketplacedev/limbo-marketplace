import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AppStack from './navigation/AppStack';
import AuthStack from './navigation/AuthStack';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['AsyncStorage has been extracted']);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user === null ? (
  <WelcomeScreen />
) : user ? (
  <AppStack />
) : (
  <AuthStack />
)}

    </NavigationContainer>
  );
}
