import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import ItemCard from '../../components/ItemCard';

export default function ClearanceScreen() {
  const [clearanceItems, setClearanceItems] = useState([]);

  useEffect(() => {
    const loadClearance = async () => {
      const q = query(
        collection(db, 'listings'),
        where('decayEnabled', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const results = [];

      const now = new Date();
      snap.docs.forEach(doc => {
        const item = doc.data();
        if (!item.createdAt?.toDate) return;

        const hours = (now - item.createdAt.toDate()) / 3600000;
        const decay = item.decayRate * hours;
        const price = item.startPrice - decay;

        const clearanceTrigger = item.bottomPrice + 2; // within $2 of bottom
        if (price <= clearanceTrigger) {
          results.push({ id: doc.id, ...item });
        }
      });

      setClearanceItems(results);
    };

    loadClearance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💸 Clearance Deals</Text>
      <FlatList
        data={clearanceItems}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: {
    fontSize: 22,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
