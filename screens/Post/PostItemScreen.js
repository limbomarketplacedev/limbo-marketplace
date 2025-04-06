import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';

export default function PostItemScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const [useRibbon, setUseRibbon] = useState(false);
  const [ribbonsAvailable, setRibbonsAvailable] = useState(0);
  const [featureListing, setFeatureListing] = useState(false);

  const [startPrice, setStartPrice] = useState('');
  const [bottomPrice, setBottomPrice] = useState('');
  const [decayDays, setDecayDays] = useState('');
  const [decayEnabled, setDecayEnabled] = useState(false);

  const [decayValid, setDecayValid] = useState(true);
  const [decayRate, setDecayRate] = useState(0);

  useEffect(() => {
    const loadRibbonBalance = async () => {
      const user = getAuth().currentUser;
      if (!user) return;
      const ribbonRef = doc(db, 'users', user.uid, 'store', 'ribbons');
      const snap = await getDoc(ribbonRef);
      if (snap.exists()) {
        setRibbonsAvailable(snap.data().count || 0);
      }
    };
    loadRibbonBalance();
  }, []);

  useEffect(() => {
    if (!decayEnabled || !startPrice || !bottomPrice || !decayDays) {
      setDecayValid(true);
      setDecayRate(0);
      return;
    }

    const start = parseFloat(startPrice);
    const bottom = parseFloat(bottomPrice);
    const days = parseInt(decayDays);
    const minDropPercent = 0.10 + 0.05 * (days - 1);
    const requiredDrop = start * minDropPercent;
    const actualDrop = start - bottom;
    const isValid = actualDrop >= requiredDrop;
    setDecayValid(isValid);

    if (isValid) {
      const totalHours = days * 24;
      const rate = actualDrop / totalHours;
      setDecayRate(rate);
    } else {
      setDecayRate(0);
    }
  }, [startPrice, bottomPrice, decayDays, decayEnabled]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submit = async () => {
    if (!title || !startPrice || !bottomPrice || !category || !image) {
      Alert.alert('Missing Info', 'Fill all fields and select an image');
      return;
    }

    if (decayEnabled && !decayValid) {
      Alert.alert('Invalid Decay Setup', 'Decay pricing does not meet minimum drop %');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const id = uuid.v4();
      const imgRef = ref(storage, `listings/${id}.jpg`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(imgRef, blob);
      const imageUrl = await getDownloadURL(imgRef);

      let isFeatured = false;
      let featuredUntil = null;

      if (featureListing) {
        const uid = user.uid;
        const subSnap = await getDoc(doc(db, 'users', uid, 'account', 'subscription'));
        const isSub = subSnap.exists() && subSnap.data().active === true;

        const featRef = doc(db, 'users', uid, 'features', 'tracking');
        const featSnap = await getDoc(featRef);
        const now = new Date();
        const reset = new Date(); reset.setUTCDate(1); reset.setUTCHours(0, 0, 0, 0);

        let tokens = 0;
        let freeUsed = 0;
        let freeReset = reset;

        if (featSnap.exists()) {
          const data = featSnap.data();
          tokens = data.tokens || 0;
          freeUsed = data.freeUsed || 0;
          freeReset = data.freeReset?.toDate?.() || reset;
        }

        const expired = now > new Date(freeReset.setMonth(freeReset.getMonth() + 1));
        if (expired) freeUsed = 0;

        if (isSub && freeUsed < 3) {
          await setDoc(featRef, {
            freeUsed: freeUsed + 1,
            tokens,
            freeReset: new Date(reset),
          });
          isFeatured = true;
        } else if (tokens > 0) {
          await updateDoc(featRef, { tokens: tokens - 1 });
          isFeatured = true;
        } else {
          Alert.alert('Feature Unavailable', 'You have no free features left and no tokens.');
          return;
        }

        if (isFeatured) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 2);
          featuredUntil = expiry;
        }
      }

      await addDoc(collection(db, 'listings'), {
        userId: user?.uid || 'anon',
        title,
        description: desc,
        category,
        startPrice: parseFloat(startPrice),
        bottomPrice: parseFloat(bottomPrice),
        decayDays: decayEnabled ? parseInt(decayDays) : 0,
        decayRate: decayEnabled ? decayRate : 0,
        decayEnabled,
        hasRibbon: useRibbon && ribbonsAvailable > 0,
        isFeatured,
        featuredUntil,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      if (useRibbon && ribbonsAvailable > 0) {
        const ribbonRef = doc(db, 'users', user.uid, 'store', 'ribbons');
        await updateDoc(ribbonRef, { count: ribbonsAvailable - 1 });
      }

      Alert.alert('Success', 'Your item has been posted.');
      setTitle(''); setDesc(''); setStartPrice(''); setBottomPrice('');
      setDecayDays(''); setCategory(''); setImage(null);
      setDecayEnabled(false); setUseRibbon(false); setFeatureListing(false);
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post New Item</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <Text style={styles.pickText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#aaa" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#aaa" value={desc} onChangeText={setDesc} multiline />
      <TextInput style={styles.input} placeholder="Category" placeholderTextColor="#aaa" value={category} onChangeText={setCategory} />

      <TextInput style={styles.input} placeholder="Start Price" placeholderTextColor="#aaa" value={startPrice} onChangeText={setStartPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bottom Price" placeholderTextColor="#aaa" value={bottomPrice} onChangeText={setBottomPrice} keyboardType="numeric" />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Enable Price Decay</Text>
        <Switch
          value={decayEnabled}
          onValueChange={setDecayEnabled}
          trackColor={{ false: '#666', true: '#FFA500' }}
          thumbColor={decayEnabled ? '#FFA500' : '#ccc'}
        />
      </View>

      {decayEnabled && (
        <>
          <TextInput style={styles.input} placeholder="Decay Duration (Days)" placeholderTextColor="#aaa" value={decayDays} onChangeText={setDecayDays} keyboardType="numeric" />
          <Text style={{ color: decayValid ? '#0f0' : '#F55', marginBottom: 10 }}>
            {decayValid
              ? `✔ Valid — Price will drop $${decayRate.toFixed(2)}/hr`
              : '❌ Bottom price too high for selected decay duration'}
          </Text>
        </>
      )}

      {ribbonsAvailable > 0 && (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Apply Gold Ribbon ({ribbonsAvailable} left)</Text>
          <Switch
            value={useRibbon}
            onValueChange={setUseRibbon}
            trackColor={{ false: '#666', true: 'gold' }}
            thumbColor={useRibbon ? 'gold' : '#ccc'}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Feature Listing (2 Days)</Text>
        <Switch
          value={featureListing}
          onValueChange={setFeatureListing}
          trackColor={{ false: '#666', true: '#FFD700' }}
          thumbColor={featureListing ? '#FFD700' : '#ccc'}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!title || !startPrice || !bottomPrice || !category || !image || (decayEnabled && !decayValid)) && { backgroundColor: '#555' }]}
        onPress={submit}
        disabled={!title || !startPrice || !bottomPrice || !category || !image || (decayEnabled && !decayValid)}
      >
        <Text style={styles.submitText}>Post Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#FFA500', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#1a1a1a',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickText: { color: '#aaa' },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
