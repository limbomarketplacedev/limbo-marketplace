import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function LimboStoreScreen() {
  const [tokens, setTokens] = useState(0);
  const [ribbons, setRibbons] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    const loadStatus = async () => {
      if (!uid) return;

      const featSnap = await getDoc(doc(db, 'users', uid, 'features', 'tracking'));
      if (featSnap.exists()) setTokens(featSnap.data().tokens || 0);

      const ribbonSnap = await getDoc(doc(db, 'users', uid, 'store', 'ribbons'));
      if (ribbonSnap.exists()) setRibbons(ribbonSnap.data().count || 0);

      const summarySnap = await getDoc(doc(db, 'users', uid, 'reviews', 'summary'));
      if (summarySnap.exists()) {
        const good = summarySnap.data().goodCount || 0;
        setIsVerified(good >= 3);
      }
    };

    loadStatus();
  }, [uid]);

  const buyToken = async () => {
    const ref = doc(db, 'users', uid, 'features', 'tracking');
    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data().tokens || 0 : 0;
    await setDoc(ref, { tokens: current + 1 }, { merge: true });
    setTokens(current + 1);
    Alert.alert('Purchased', '1 Feature Token added.');
  };

  const buyRibbons = async () => {
    if (!isVerified) return Alert.alert('Locked', 'You must be verified to buy ribbons.');
    const ref = doc(db, 'users', uid, 'store', 'ribbons');
    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data().count || 0 : 0;
    await setDoc(ref, { count: current + 25 }, { merge: true });
    setRibbons(current + 25);
    Alert.alert('Purchased', '25 Gold Ribbons added.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎁 Limbo Store</Text>

      <Text style={styles.section}>📌 Feature Tokens</Text>
      <Text style={styles.balance}>You have {tokens} tokens</Text>
      <TouchableOpacity style={styles.button} onPress={buyToken}>
        <Text style={styles.buttonText}>Buy 1 Token - $1</Text>
      </TouchableOpacity>

      <Text style={styles.section}>🎖️ Gold Ribbons</Text>
      <Text style={styles.balance}>You have {ribbons} ribbons</Text>
      {isVerified ? (
        <TouchableOpacity style={styles.button} onPress={buyRibbons}>
          <Text style={styles.buttonText}>Buy 25 Ribbons - $1</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.locked}>🔒 Must be verified seller to buy</Text>
      )}

      <Text style={styles.section}>🎨 Skins & Cosmetics</Text>
      <Text style={styles.locked}>Coming Soon: profile skins, borders, badges...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#FFA500', fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  section: { fontSize: 18, color: '#FFA500', marginTop: 20, marginBottom: 10 },
  balance: { color: '#fff', fontSize: 16, marginBottom: 10 },
  locked: { color: '#888', fontSize: 14, marginBottom: 20 },
  button: {
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
