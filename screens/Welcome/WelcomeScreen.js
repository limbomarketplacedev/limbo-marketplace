import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/sp.png')} style={styles.logo} />
      
      <Text style={styles.title}>Welcome to Limbo Marketplace</Text>
      <Text style={styles.subtitle}>
        The marketplace where sellers sell more — and the deals just keep getting better.
      </Text>

      <Text style={styles.sectionTitle}>Why Price Decay?</Text>
      <Text style={styles.text}>
        Letting your item’s price decrease over time isn’t a loss — it’s a smart way to meet the market.
        Faster sales mean higher turnover. And higher turnover? More profits.
      </Text>

      <Text style={styles.sectionTitle}>📊 Example:</Text>
      <Text style={styles.text}>
        🔸 Seller 1 posts an item at $120 — no price decay. After 9 hours, it hasn’t sold. Still holding it.
        {"\n\n"}
        🔹 Seller 2 has 3 of the same item and posts with price decay (3 days).{"\n"}
        • 1st item sells after 6h for $108.38{"\n"}
        • 2nd item sells after 3h for $115.02{"\n"}
        • Total earned: $223.40 in 9 hours{"\n\n"}
        Seller 2 is preparing their next listings while Seller 1 is still waiting.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Auth')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', padding: 20, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 160, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFA500', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  sectionTitle: { color: '#FFA500', fontWeight: 'bold', fontSize: 18, marginTop: 10, marginBottom: 6 },
  text: { color: '#fff', fontSize: 14, textAlign: 'left', marginBottom: 12 },
  button: { marginTop: 20, backgroundColor: '#FFA500', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
