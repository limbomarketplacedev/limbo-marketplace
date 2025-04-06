import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ItemCard from '../../components/ItemCard';

export default function SellerProfileScreen({ route }) {
  const { userId } = route.params;
  const [listings, setListings] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchListings = async () => {
      const q = query(collection(db, 'listings'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    };

    const fetchReviewSummary = async () => {
      const ref = doc(db, 'users', userId, 'reviews', 'summary');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setAvgRating(data.avgRating || null);
        setReviewCount(data.goodCount || 0);
      }
    };

    const fetchReviews = async () => {
      const reviewCol = collection(db, 'users', userId, 'reviews');
      const snap = await getDocs(reviewCol);
      const data = snap.docs
        .filter(doc => doc.id !== 'summary')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    };

    fetchListings();
    fetchReviewSummary();
    fetchReviews();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>Seller: {userId.slice(0, 8)}...</Text>
        <Text style={styles.badge}>🎖️ Verified Dealer</Text>
        {avgRating !== null && (
          <Text style={styles.reputation}>
            ⭐ {avgRating.toFixed(1)} · {reviewCount} Reviews
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => navigation.navigate('SubmitReview', {
          sellerId: userId,
          listingId: listings[0]?.id || 'unknown',
        })}
      >
        <Text style={styles.reviewText}>⭐ Leave a Review</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Listings by this seller</Text>
      <FlatList
        data={listings}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.sectionTitle}>Reviews</Text>
      {reviews.map((rev) => (
        <View key={rev.id} style={styles.reviewCard}>
          <Text style={styles.stars}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</Text>
          {rev.comment ? <Text style={styles.comment}>{rev.comment}</Text> : null}
          <Text style={styles.reviewer}>by {rev.reviewerId.slice(0, 6)}...</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { fontSize: 48, marginBottom: 10 },
  name: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  badge: { fontSize: 14, color: '#FFA500', marginTop: 5 },
  reputation: { fontSize: 14, color: '#fff', marginTop: 4 },
  sectionTitle: { fontSize: 16, color: '#aaa', marginVertical: 16 },
  reviewButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
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
