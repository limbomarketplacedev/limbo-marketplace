import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

export default function SubmitReviewScreen({ route, navigation }) {
  const { sellerId, listingId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    if (rating < 1) {
      Alert.alert('Error', 'Please select at least 1 star.');
      return;
    }

    const reviewRef = doc(db, 'users', sellerId, 'reviews', user.uid);

    const exists = await getDoc(reviewRef);
    if (exists.exists()) {
      Alert.alert('Error', 'You already reviewed this seller.');
      return;
    }

    await setDoc(reviewRef, {
      reviewerId: user.uid,
      rating,
      comment,
      listingId,
      createdAt: new Date(),
    });

    if (rating >= 4) {
      const summaryRef = doc(db, 'users', sellerId, 'reviews', 'summary');
      const summarySnap = await getDoc(summaryRef);
      const current = summarySnap.exists() ? summarySnap.data().goodCount || 0 : 0;
      await updateDoc(summaryRef, { goodCount: current + 1 }).catch(() =>
        setDoc(summaryRef, { goodCount: 1 })
      );
    }

    Alert.alert('Thank you!', 'Your review has been submitted.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Review</Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <FontAwesome
              name={i <= rating ? 'star' : 'star-o'}
              size={32}
              color="#FFA500"
              style={{ margin: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Optional comment..."
        placeholderTextColor="#aaa"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#FFA500', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  stars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
