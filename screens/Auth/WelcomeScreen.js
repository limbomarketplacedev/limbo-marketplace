import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/ic.png')} style={styles.logo} />

      <Text style={styles.title}>Welcome to Limbo Marketplace</Text>
      <Text style={styles.subtitle}>
        The marketplace where sellers sell more, and the deals just keep getting better.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          💡 Sellers let prices drop over time — not to lose money, but to increase turnover and close faster.
        </Text>
        <Text style={styles.cardText}>
          📦 Seller A posts an item at $120. No decay. It sits unsold for days.
        </Text>
        <Text style={styles.cardText}>
          💸 Seller B posts the same item with decay. It sells in 6 hours for $108. Then another for $115.
        </Text>
        <Text style={styles.cardText}>
          ✅ Result: Seller B sells 2 items in 9 hours and earns $223.40. Seller A still holds inventory.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>Start Exploring</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFA500',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: '60%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
