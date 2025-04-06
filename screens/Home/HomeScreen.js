import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView,
  TouchableOpacity
} from 'react-native';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ItemCard from '../../components/ItemCard';
import FilterModal from '../../components/FilterModal';
import CategoryMenu from '../../components/CategoryMenu';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    onlyWithDecay: false,
    category: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const now = Timestamp.now();

      const featQuery = query(
        collection(db, 'listings'),
        where('isFeatured', '==', true),
        where('featuredUntil', '>', now),
        orderBy('featuredUntil', 'desc')
      );

      const allQuery = query(
        collection(db, 'listings'),
        orderBy('createdAt', 'desc')
      );

      const [featSnap, allSnap] = await Promise.all([
        getDocs(featQuery),
        getDocs(allQuery),
      ]);

      const all = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = all.filter(item => {
        const price = item.startPrice;
        if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
        if (filters.onlyWithDecay && !item.decayEnabled) return false;
        if (filters.category && item.category !== filters.category) return false;
        return true;
      });

      setFeatured(featSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setItems(filtered);
    };

    fetchData();
  }, [filters]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.section}>🔥 Featured Items</Text>
        <FlatList
          horizontal
          data={featured}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}
        />

        <View style={styles.headerRow}>
          <Text style={styles.section}>🛒 All Listings</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Text style={styles.filterBtn}>Filter</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.categoryBtn}
        onPress={() => setCategoryMenuVisible(true)}
      >
        <Text style={styles.categoryText}>☰ Categories</Text>
      </TouchableOpacity>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
      <CategoryMenu
        visible={categoryMenuVisible}
        onClose={() => setCategoryMenuVisible(false)}
        onSelect={(category) => {
          setFilters(prev => ({ ...prev, category }));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  section: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
  },
  featuredRow: { paddingLeft: 16, paddingBottom: 10 },
  filterBtn: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginRight: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
  },
  categoryText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
