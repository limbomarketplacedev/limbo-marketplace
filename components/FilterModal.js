import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';

export default function FilterModal({ visible, onClose }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyWithDecay, setOnlyWithDecay] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Filter Listings</Text>

          <TextInput
            placeholder="Min Price"
            keyboardType="numeric"
            style={styles.input}
            value={minPrice}
            onChangeText={setMinPrice}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Max Price"
            keyboardType="numeric"
            style={styles.input}
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholderTextColor="#aaa"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Only Price Decay Items</Text>
            <Switch
              value={onlyWithDecay}
              onValueChange={setOnlyWithDecay}
              trackColor={{ false: '#999', true: '#FFA500' }}
              thumbColor={onlyWithDecay ? '#FFA500' : '#ccc'}
            />
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    color: '#FFA500',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
