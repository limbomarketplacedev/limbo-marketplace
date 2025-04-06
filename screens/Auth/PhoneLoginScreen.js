import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const sendCode = async () => {
    const auth = getAuth();
    try {
      const verifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(confirmationResult);
      Alert.alert('Code Sent', 'Check your phone for the verification code.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const confirmCode = async () => {
    try {
      await confirmation.confirm(code);
    } catch (err) {
      Alert.alert('Invalid Code', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Phone Login</Text>

      <TextInput
        style={styles.input}
        placeholder="+1 555 123 4567"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {confirmation ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            placeholderTextColor="#aaa"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={sendCode}>
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>
      )}

      {/* Hidden div for Recaptcha */}
      <View id="recaptcha-container" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, color: '#FFA500', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#FFA500', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
