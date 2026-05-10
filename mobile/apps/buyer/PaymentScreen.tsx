import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';

export default function PaymentScreen({ route, navigation }: any) {
  const { order } = route.params;
  const [method, setMethod] = useState<'upi' | 'cod'>('upi');

  const { mutate: processPayment, isPending } = useMutation({
    mutationFn: () => apiClient.patch(`/orders/${order.id}/status?status=pending`),
    onSuccess: () => {
      navigation.replace('OrderSuccess', { order });
    },
    onError: (error: any) => {
      Alert.alert('Payment Error', error.response?.data?.detail || 'Failed to process payment');
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Crop Subtotal</Text>
            <Text style={styles.value}>₹{Math.round(order.subtotal).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Fee ({order.delivery_type})</Text>
            <Text style={styles.value}>₹{Math.round(order.delivery_charge || 0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Platform Fee</Text>
            <Text style={styles.value}>₹{Math.round(order.platform_commission || 0)}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{Math.round(order.total_amount).toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={[styles.methodBtn, method === 'upi' && styles.methodActive]} 
            onPress={() => setMethod('upi')}
          >
            <Text style={styles.methodIcon}>📱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>UPI / Online Payment</Text>
              <Text style={styles.methodSub}>Google Pay, PhonePe, Paytm</Text>
            </View>
            {method === 'upi' && <Text style={styles.check}>✅</Text>}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={[styles.methodBtn, method === 'cod' && styles.methodActive]} 
            onPress={() => setMethod('cod')}
          >
            <Text style={styles.methodIcon}>💵</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Cash on Delivery</Text>
              <Text style={styles.methodSub}>Pay when you receive the order</Text>
            </View>
            {method === 'cod' && <Text style={styles.check}>✅</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          style={styles.payBtn} 
          onPress={() => processPayment()}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>
              {method === 'upi' ? `Pay ₹${Math.round(order.total_amount + (order.delivery_charge || 0)).toLocaleString()}` : 'Confirm Cash Order'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', elevation: 2 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  backIcon: { fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  content: { flex: 1, padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textMuted, marginBottom: 12, marginTop: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 15, color: '#666' },
  value: { fontSize: 15, fontWeight: '600', color: Colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, marginTop: 4, marginBottom: 0 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
  methodBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  methodActive: { opacity: 1 },
  methodIcon: { fontSize: 28, marginRight: 16 },
  methodTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  methodSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  check: { fontSize: 18 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },

  payBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 4 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
