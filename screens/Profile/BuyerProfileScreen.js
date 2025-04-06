import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function BuyerProfileScreen({ route }) {
  const { buyerId } = route.params;
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadSummary = async () => {
      const snap = await getDoc(doc(db, 'users', buyerId, 'reviewsFromSellers', 'summary'));
      if (snap.exists()) setSummary(snap.data());
    };

    const loadReviews = async () => {
      const col = collection(db, 'users', buyerId, 'reviewsFromSellers');
      const snap = await getDocs(col);
      const items = snap.docs
        .filter(doc => doc.id !== 'summary')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(items);
    };

    loadSummary();
    loadReviews();
  }, [buyerId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👤 Buyer: {buyerId.slice(0, 8)}...</Text>

      {summary && (
        <Text style={styles.reputation}>
          ⭐ {summary.avgRating?.toFixed(1) || 'N/A'} · {summary.count || 0} Reviews
        </Text>
      )}

      <Text style={styles.sectionTitle}>Seller Feedback</Text>

      {reviews.length === 0 ? (
        <Text style={styles.empty}>No reviews yet</Text>
      ) : (
        reviews.map((rev) => (
          <View key={rev.id} style={styles.reviewCard}>
            <Text style={styles.stars}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</Text>
            {rev.comment && <Text style={styles.comment}>{rev.comment}</Text>}
            <Text style={styles.reviewer}>by {rev.sellerId.slice(0, 6)}...</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#FFA500', marginBottom: 10 },
  reputation: { fontSize: 16, color: '#fff', marginBottom: 20 },
  sectionTitle: { fontSize: 16, color: '#aaa', marginBottom: 10 },
  empty: { color: '#666', fontStyle: 'italic' },
  reviewCard: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  stars: { color: '#FFA500', fontSize: 16, marginBottom: 4 },
  comment: { color: '#fff', fontSize: 14 },
  reviewer: { color: '#888', fontSize: 12, marginTop: 4 },
});
