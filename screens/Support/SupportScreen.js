import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function SupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const user = getAuth().currentUser;

  const submitTicket = async () => {
    if (!subject || !message) {
      Alert.alert('Missing Fields', 'Please complete the subject and message.');
      return;
    }

    await addDoc(collection(db, 'supportTickets'), {
      userId: user?.uid || 'anon',
      subject,
      message,
      createdAt: serverTimestamp(),
      status: 'open',
    });

    setSubject('');
    setMessage('');
    Alert.alert('Submitted', 'Your support request has been sent.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Need Help?</Text>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        placeholderTextColor="#aaa"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={[styles.input, { height: 140 }]}
        placeholder="Describe the issue"
        placeholderTextColor="#aaa"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={submitTicket}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 22, color: '#FFA500', fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
