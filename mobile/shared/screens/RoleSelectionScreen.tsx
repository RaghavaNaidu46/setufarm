import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const navigation = useNavigation<any>();

  const handleSelectRole = (role: 'farmer' | 'buyer' | 'driver') => {
    navigation.navigate('Login', { mode: 'signup', role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Join SetuFarm</Text>
        <Text style={styles.subtitle}>Choose how you want to use the platform</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.roleCard, styles.farmerCard]} 
          onPress={() => handleSelectRole('farmer')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👨‍🌾</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.roleTitle}>Farmer</Text>
            <Text style={styles.roleDescription}>List your crops, manage orders, and grow your business.</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SELL</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, styles.buyerCard]} 
          onPress={() => handleSelectRole('buyer')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🛒</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.roleTitle}>Buyer</Text>
            <Text style={styles.roleDescription}>Browse fresh produce, order directly from farms, and save.</Text>
          </View>
          <View style={styles.badgeBuyer}>
            <Text style={styles.badgeText}>BUY</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, styles.driverCard]} 
          onPress={() => handleSelectRole('driver')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
            <Text style={styles.icon}>🚚</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.roleTitle}>Driver</Text>
            <Text style={styles.roleDescription}>Deliver fresh produce from farms to buyers and earn money.</Text>
          </View>
          <View style={styles.badgeDriver}>
            <Text style={styles.badgeText}>EARN</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account? 
          <Text 
            style={styles.link} 
            onPress={() => navigation.navigate('Login', { mode: 'signin' })}
          > Sign In</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 20 },
  backButton: { marginBottom: 20 },
  backText: { fontSize: 28, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  subtitle: { fontSize: 16, color: Colors.textMuted, marginTop: 8 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  farmerCard: { borderColor: Colors.primary + '20' },
  buyerCard: { borderColor: Colors.info + '20' },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  icon: { fontSize: 32 },
  textContainer: { flex: 1 },
  roleTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  roleDescription: { fontSize: 14, color: Colors.textMuted, marginTop: 4, lineHeight: 20 },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  badgeBuyer: {
    backgroundColor: Colors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  badgeDriver: {
    backgroundColor: '#f57c00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  driverCard: { borderColor: '#f57c0040' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  footer: { padding: 24, alignItems: 'center' },
  footerText: { color: Colors.textMuted, fontSize: 16 },
  link: { color: Colors.primary, fontWeight: 'bold' },
});
