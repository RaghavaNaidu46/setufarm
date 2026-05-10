import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../../shared/constants/colors';

export default function OrderSuccessScreen({ route, navigation }: any) {
  const { order } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.circle}>
          <Text style={styles.emoji}>🎉</Text>
        </View>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          The farmer has been notified and your fresh produce is on its way.
        </Text>

        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => navigation.navigate('BuyerOrderTracking', { orderId: order?.id })}
        >
          <Text style={styles.trackBtnText}>Track My Order</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'BuyerHome' }] })}
        >
          <Text style={styles.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 4 },
  emoji: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  trackBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, width: '100%', alignItems: 'center', marginBottom: 12 },
  trackBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  homeBtn: { backgroundColor: '#F0F4F0', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, width: '100%', alignItems: 'center' },
  homeBtnText: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' }
});
