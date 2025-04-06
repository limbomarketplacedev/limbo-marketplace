import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ItemCard from '../../components/ItemCard';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const user = getAuth().currentUser;

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const snap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(items);
    };

    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Saved Listings</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 16,
    textAlign: 'center',
  },
});
