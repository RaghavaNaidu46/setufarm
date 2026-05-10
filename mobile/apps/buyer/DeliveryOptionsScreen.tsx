import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../shared/api/client';
import { Colors } from '../../shared/constants/colors';

export default function DeliveryOptionsScreen({ route, navigation }) {
  const { orderId, productId, buyerLat, buyerLng, subtotal } = route.params;
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['delivery-options', productId],
    queryFn: () => apiClient.get(`/orders/delivery-options/${productId}`, {
      params: { buyer_lat: buyerLat, buyer_lng: buyerLng }
    }).then(r => r.data),
  });

  // Auto-select first available option (prefer driver)
  useEffect(() => {
    if (data?.options && !selected) {
      const driverOption = data.options.find(o => o.type === 'driver' && o.available);
      if (driverOption) {
        setSelected('driver');
      } else {
        const firstAvail = data.options.find(o => o.available);
        if (firstAvail) setSelected(firstAvail.type);
      }
    }
  }, [data, selected]);

  const { mutate: confirmDelivery, isPending } = useMutation({
    mutationFn: (option) => apiClient.post(`/orders/${orderId}/select-delivery`, option),
    onSuccess: (res) => navigation.navigate('Payment', { order: res.data }),
  });

  const icons = { driver: '🛺', farmer: '🚜', self_pickup: '🏪' };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Delivery</Text>
      </View>

      <View style={styles.body}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ORDER TOTAL</Text>
          <Text style={styles.summaryValue}>₹{subtotal?.toLocaleString()}</Text>
          <Text style={styles.summaryDist}>📍 Farm is {data?.distance_km}km away</Text>
        </View>

        <Text style={styles.sectionTitle}>🚚 Select Delivery Option</Text>
        
        {(!data?.options || data.options.length === 0) && (
          <View style={styles.emptyOptions}>
            <Text style={styles.emptyText}>No delivery options available for this distance.</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnSmall}>
              <Text style={{ color: Colors.primary }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {data?.options?.map((option) => (
          <TouchableOpacity
            key={option.type}
            activeOpacity={0.7}
            style={[
              styles.optionCard,
              selected === option.type && styles.optionCardSelected,
            ]}
            onPress={() => setSelected(option.type)}
          >
            {option.type === 'driver' && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>FASTEST</Text>
              </View>
            )}
            <View style={styles.optionTop}>
              <View style={[styles.iconCircle, { backgroundColor: option.type === 'driver' ? '#E3F2FD' : '#F5F5F5' }]}>
                <Text style={{ fontSize: 24 }}>{icons[option.type]}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionTelugu}>{option.label_telugu}</Text>
                <View style={styles.metaRow}>
                   <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                   <Text style={styles.optionTime}>{option.estimated_time}</Text>
                </View>
                {option.type === 'driver' && (
                  <Text style={styles.optionAvail}>
                    {option.drivers_available > 0 ? `${option.drivers_available} drivers nearby` : 'Driver will be assigned'}
                  </Text>
                )}
              </View>
              <View style={styles.priceBox}>
                {option.charge === 0 ? (
                  <Text style={styles.freeText}>FREE</Text>
                ) : (
                  <Text style={styles.chargeText}>+₹{Math.round(option.charge)}</Text>
                )}
              </View>
            </View>

            {selected === option.type && (
              <View style={styles.selectionIndicator}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={styles.selectedText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Total */}
        {selected && (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Final Total</Text>
            <Text style={styles.totalValue}>
              ₹{Math.round((subtotal || 0) + (data?.options?.find(o => o.type === selected)?.charge || 0)).toLocaleString()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, !selected && { opacity: 0.4 }]}
          onPress={() => selected && confirmDelivery({
            type: selected,
            charge: data.options.find(o => o.type === selected)?.charge || 0
          })}
          disabled={!selected || isPending}
        >
          <Text style={styles.confirmText}>
            {isPending ? 'Confirming...' : 'Confirm & Pay →'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  body: { padding: 14 },
  summaryCard: { backgroundColor: Colors.primary, borderRadius: 14, padding: 14, marginBottom: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  summaryValue: { fontSize: 26, fontWeight: '600', color: '#fff', marginTop: 2 },
  summaryDist: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 15 },
  emptyOptions: { padding: 40, alignItems: 'center', backgroundColor: '#fff', borderRadius: 20 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, marginBottom: 20 },
  backBtnSmall: { padding: 10 },
  optionCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: Colors.border, position: 'relative' },
  optionCardSelected: { borderColor: Colors.primary, borderWidth: 1.5 },
  optionCardDisabled: { opacity: 0.4 },
  badge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 9, color: Colors.primary, fontWeight: '600' },
  optionTop: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  optionTelugu: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  optionTime: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  optionAvail: { fontSize: 10, color: Colors.primary, marginTop: 2, fontWeight: '500' },
  priceBox: { alignItems: 'flex-end' },
  chargeText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  freeText: { fontSize: 16, fontWeight: '600', color: Colors.success },
  saveText: { fontSize: 10, color: Colors.success, marginTop: 2 },
  selectedCheck: { marginTop: 10, borderTopWidth: 0.5, borderTopColor: Colors.primaryLight, paddingTop: 8, alignItems: 'center' },
  totalBox: { backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 13, color: Colors.primaryDark, fontWeight: '500' },
  totalValue: { fontSize: 20, fontWeight: '600', color: Colors.primary },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  confirmText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  recommendedBadge: { position: 'absolute', top: -10, right: 20, backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, elevation: 3 },
  recommendedText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  selectionIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10, gap: 6 },
  selectedText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
});
