import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Toys', 'Furniture', 'Appliances',
  'Vehicles', 'Books', 'Home & Garden', 'Sports', 'Health',
  'Pets', 'Beauty', 'Clearance', 'Decay Deals'
];

export default function CategoryMenu({ visible, onClose, onSelect }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (cat) => {
    setFavorites((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.header}>Categories</Text>
          <ScrollView contentContainerStyle={styles.grid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, favorites.includes(cat) && styles.fav]}
                onPress={() => {
                  onSelect(cat);
                  onClose();
                }}
                onLongPress={() => toggleFavorite(cat)}
              >
                <Text style={styles.catText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  catBtn: {
    backgroundColor: '#222',
    padding: 10,
    margin: 6,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  catText: { color: '#fff' },
  fav: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: { color: '#000', fontWeight: 'bold' },
});
