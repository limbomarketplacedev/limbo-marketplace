import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function ListingDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [currentPrice, setCurrentPrice] = useState(item.startPrice);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!item.decayEnabled || !item.createdAt?.toDate) return;

    const start = item.createdAt.toDate();
    const timer = setInterval(() => {
      const now = new Date();
      const hoursPassed = Math.floor((now - start) / 3600000);
      const newPrice = Math.max(
        item.startPrice - item.decayRate * hoursPassed,
        item.bottomPrice
      );
      setCurrentPrice(newPrice.toFixed(2));
      const mins = 60 - now.getMinutes();
      setTimeLeft(mins);
    }, 60000);

    return () => clearInterval(timer);
  }, [item]);

  const chartData = {
    labels: ['Now', 'End'],
    datasets: [
      {
        data: [item.startPrice, item.bottomPrice],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={{ height: 240, borderRadius: 10 }} />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${currentPrice}</Text>

      {item.decayEnabled && (
        <>
          <Text style={{ color: '#FFA500', marginBottom: 8 }}>
            ⏱ Price drops every hour — {timeLeft} mins to next drop
          </Text>

          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={160}
            yAxisSuffix="$"
            withVerticalLines={false}
            chartConfig={{
              backgroundColor: '#000',
              backgroundGradientFrom: '#000',
              backgroundGradientTo: '#000',
              decimalPlaces: 2,
              color: () => '#FFA500',
              labelColor: () => '#aaa',
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />
        </>
      )}

      <Text style={styles.desc}>{item.description}</Text>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('SellerProfile', { sellerId: item.userId })}
      >
        <Text style={styles.profileText}>View Seller Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={async () => {
          const user = getAuth().currentUser;
          if (!user) return;
          await addDoc(collection(db, 'reports'), {
            type: 'listing',
            itemId: item.id,
            reporter: user.uid,
            createdAt: serverTimestamp(),
          });
          Alert.alert('Reported', 'Thanks. Our team will review this listing.');
        }}
      >
        <Text style={styles.reportText}>⚠️ Report Listing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 24, color: '#FFA500', fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 20, color: '#fff', marginBottom: 10 },
  profileButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  profileText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chartLabel: { color: '#aaa', fontSize: 14 },
  desc: { color: '#fff', fontSize: 16, marginTop: 20 },
  reportButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  reportText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});
