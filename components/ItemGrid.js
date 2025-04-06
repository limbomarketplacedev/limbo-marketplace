import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemCard from './ItemCard'; // Optional: your reusable card component

export default function ItemGrid({ items }) {
  const renderItem = ({ item }) => <ItemCard item={item} />;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.grid}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 10,
  },
});
