import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';

export default function UploadBannerScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadBanner = async () => {
    if (!image) return Alert.alert('No Image Selected');

    const id = uuid.v4();
    const imgRef = ref(storage, `banners/${id}.jpg`);
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(imgRef, blob);
    const imageUrl = await getDownloadURL(imgRef);

    await addDoc(collection(db, 'banners'), {
      imageUrl,
      createdAt: serverTimestamp(),
    });

    setImage(null);
    Alert.alert('Uploaded', 'Banner uploaded successfully.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload Banner</Text>
      <TouchableOpacity onPress={pickImage} style={styles.picker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <Text style={styles.pickText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={uploadBanner}>
        <Text style={styles.buttonText}>Upload Banner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 22, color: '#FFA500', fontWeight: 'bold', marginBottom: 20 },
  picker: {
    backgroundColor: '#222',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickText: { color: '#aaa' },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  button: {
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
