import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function SupportInboxScreen() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      const snap = await getDocs(collection(db, 'supportTickets'));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    };

    loadTickets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Support Requests</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>📝 {item.subject}</Text>
            <Text style={styles.body}>{item.message}</Text>
            <Text style={styles.meta}>From: {item.userId}</Text>
            <Text style={styles.meta}>Status: {item.status}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: {
    fontSize: 22,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  subject: { color: '#FFA500', fontWeight: 'bold', marginBottom: 6 },
  body: { color: '#fff', marginBottom: 6 },
  meta: { color: '#888', fontSize: 12 },
});
