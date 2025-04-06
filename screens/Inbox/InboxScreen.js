import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function InboxScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchThreads = async () => {
      const q = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', user.uid)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setThreads(data);
    };
    fetchThreads();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📬 Messages</Text>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherId = item.participants.find(id => id !== user.uid);
          return (
            <TouchableOpacity
              style={styles.thread}
              onPress={() => navigation.navigate('Chat', { threadId: item.id, otherId })}
            >
              <Text style={styles.name}>Chat with {otherId.slice(0, 6)}...</Text>
              <Text style={styles.preview}>{item.lastMessage?.slice(0, 40) || 'No messages yet'}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFA500', marginBottom: 20 },
  thread: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { color: '#FFA500', fontWeight: 'bold' },
  preview: { color: '#aaa', marginTop: 4 },
});
