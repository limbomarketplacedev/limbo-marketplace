import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdminReportsScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      const snap = await getDocs(collection(db, 'reports'));
      const items = [];

      for (let report of snap.docs) {
        const data = report.data();
        if (data.type === 'listing') {
          const listingRef = doc(db, 'listings', data.itemId);
          const listingSnap = await getDoc(listingRef);
          if (listingSnap.exists()) {
            items.push({
              id: report.id,
              ...data,
              listing: listingSnap.data(),
            });
          }
        }
      }

      setReports(items);
    };

    loadReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Flagged Listings</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Item: {item.listing.title}</Text>
            <Text style={styles.label}>Reported by: {item.reporter}</Text>
            <Text style={styles.sub}>ID: {item.itemId}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: {
    fontSize: 22,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: { color: '#fff', fontWeight: 'bold' },
  sub: { color: '#888', fontSize: 12 },
});
