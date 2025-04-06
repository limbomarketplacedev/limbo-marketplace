import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function SubscriptionStatusScreen() {
  const [active, setActive] = useState(false);
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      const uid = getAuth().currentUser?.uid;
      if (!uid) return;
      const ref = doc(db, 'users', uid, 'account', 'subscription');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setActive(data.active || false);
        setPlan(data.plan || 'Free');
      }
    };

    fetchStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>
      <Text style={styles.status}>
        {active ? '✅ Active Subscriber' : '❌ Not Subscribed'}
      </Text>
      <Text style={styles.plan}>Plan: {plan}</Text>

      <Text style={styles.benefits}>Perks:</Text>
      <Text style={styles.list}>• 3 Free Featured Listings/month</Text>
      <Text style={styles.list}>• Rank Badge Access</Text>
      <Text style={styles.list}>• Exclusive Skins & Store Discounts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFA500', marginBottom: 20, textAlign: 'center' },
  status: { fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 10 },
  plan: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 30 },
  benefits: { fontSize: 16, color: '#FFA500', marginBottom: 8 },
  list: { color: '#ccc', marginBottom: 6 },
});
