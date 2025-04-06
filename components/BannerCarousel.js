import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, Dimensions } from 'react-native';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

export default function BannerCarousel() {
  const scrollRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const snap = await getDocs(collection(db, 'banners'));
      const urls = snap.docs.map(doc => doc.data().imageUrl);
      setBanners(urls);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % banners.length;
      setIndex(nextIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: screenWidth * nextIndex, animated: true });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [index, banners]);

  if (banners.length === 0) return null;

  return (
    <View style={styles.carousel}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {banners.map((url, i) => (
          <Image key={i} source={{ uri: url }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: screenWidth,
    height: 100,
    marginBottom: 10,
  },
  image: {
    width: screenWidth,
    height: 100,
    resizeMode: 'cover',
  },
});
