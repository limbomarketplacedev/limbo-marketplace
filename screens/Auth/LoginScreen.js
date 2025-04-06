import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useGoogleLogin, useFacebookLogin } from '../../auth/providers';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { promptAsync: googlePrompt, request: googleReq } = useGoogleLogin();
  const { promptAsync: facebookPrompt, request: fbReq } = useFacebookLogin();

  const handleEmailLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or login with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => googlePrompt()}
          disabled={!googleReq}
        >
          <FontAwesome name="google" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => facebookPrompt()}
          disabled={!fbReq}
        >
          <FontAwesome name="facebook" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate('Phone')}
        >
          <MaterialIcons name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, color: '#FFA500', fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  loginButton: { backgroundColor: '#FFA500', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  loginText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  or: { color: '#fff', textAlign: 'center', marginVertical: 20 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  socialButton: { backgroundColor: '#222', padding: 15, borderRadius: 50 },
  registerLink: { color: '#FFA500', textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' },
});
