import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ItemCard({ item }) {
  const [liked, setLiked] = useState(false);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'favorites', item.id);
    getDoc(ref).then(snap => {
      if (snap.exists()) setLiked(true);
    });
  }, [user]);

  const toggleLike = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'favorites', item.id);
    if (liked) {
      await deleteDoc(ref);
      setLiked(false);
    } else {
      await setDoc(ref, item);
      setLiked(true);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <TouchableOpacity style={styles.heart} onPress={toggleLike}>
        <FontAwesome name={liked ? 'heart' : 'heart-o'} size={20} color="#FFA500" />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.startPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
    margin: 8,
    width: 160,
    position: 'relative',
  },
  image: {
    height: 120,
    width: '100%',
    borderRadius: 10,
    marginBottom: 8,
  },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  price: { color: '#FFA500', fontWeight: 'bold', marginTop: 4 },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
