import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📝', desc: 'Awaiting farmer confirmation' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Farmer is preparing your order' },
  { key: 'ready_for_pickup', label: 'Ready', icon: '📦', desc: 'Packed and ready for transport' },
  { key: 'in_transit', label: 'On the Way', icon: '🚚', desc: 'Your produce is moving!' },
  { key: 'delivered', label: 'Delivered', icon: '🏠', desc: 'Arrived at your location' }
];

export default function BuyerOrderTrackingScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => apiClient.get(`/orders/${orderId}`).then(r => r.data),
    refetchInterval: 10000, // Refresh every 10 seconds for real-time tracking
  });

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );

  if (error || !order) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Failed to load order tracking</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: Colors.primary, marginTop: 10 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cropName}>{order.crop_name}</Text>
              <Text style={styles.orderId}>ID: #{order.id.slice(0, 8)}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.amount}>₹{order.total_amount.toLocaleString()}</Text>
              <Text style={styles.qty}>{order.quantity_kg} kg</Text>
            </View>
          </View>
        </View>

        {/* Delivery Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Delivery Status</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <View key={step.key} style={styles.stepContainer}>
                  <View style={styles.stepIndicator}>
                    <View style={[
                      styles.dot, 
                      isCompleted ? styles.dotCompleted : styles.dotPending,
                      isCurrent && styles.dotCurrent
                    ]}>
                      {isCompleted && <Text style={styles.dotIcon}>✓</Text>}
                    </View>
                    {index < STATUS_STEPS.length - 1 && (
                      <View style={[
                        styles.line, 
                        index < currentStatusIndex ? styles.lineCompleted : styles.linePending
                      ]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={[styles.stepLabel, isCompleted && styles.textCompleted]}>
                        {step.label}
                      </Text>
                      <Text style={styles.stepEmoji}>{step.icon}</Text>
                    </View>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Farmer Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Farmer Details</Text>
          <View style={styles.personRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{order.farmer?.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.personName}>{order.farmer?.name || 'Local Farmer'}</Text>
              <View style={styles.ratingRow}>
                 <Text style={styles.ratingText}>★ {order.farmer?.rating || '0.0'}</Text>
                 <Text style={styles.locationText}> • {order.farmer?.village}, {order.farmer?.district}</Text>
              </View>
            </View>
            {order.farmer?.phone ? (
              <TouchableOpacity 
                style={styles.callCircle}
                onPress={() => Linking.openURL(`tel:${order.farmer.phone}`)}
              >
                <Text style={{ fontSize: 20 }}>📞</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.callCircle, { opacity: 0.3, backgroundColor: '#eee' }]}>
                <Text style={{ fontSize: 20 }}>📞</Text>
              </View>
            )}
          </View>
        </View>

        {/* Price Breakup Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Price Breakup</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Subtotal</Text>
            <Text style={styles.priceValue}>₹{order.subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST (5%)</Text>
            <Text style={styles.priceValue}>+ ₹{order.gst_amount.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee (2%)</Text>
            <Text style={styles.priceValue}>+ ₹{order.service_fee.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Charge</Text>
            <Text style={styles.priceValue}>
              {order.delivery_charge > 0 ? `+ ₹${order.delivery_charge.toLocaleString()}` : 'FREE'}
            </Text>
          </View>
          <View style={[styles.divider, { marginVertical: 12 }]} />
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: Colors.text, fontWeight: 'bold', fontSize: 16 }]}>Total Paid</Text>
            <Text style={[styles.priceValue, { color: Colors.primary, fontWeight: 'bold', fontSize: 18 }]}>₹{order.total_amount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Delivery Address Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Delivering To</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressEmoji}>📍</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressContent}>{order.delivery_address_text || 'Address details being updated'}</Text>
            </View>
          </View>
        </View>

        {/* Driver / Delivery Method */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Delivery Agent</Text>
          <View style={styles.methodRow}>
            <View style={[styles.methodIconBg, { backgroundColor: order.delivery_type === 'driver' ? '#E3F2FD' : '#F5F5F5' }]}>
               <Text style={{ fontSize: 24 }}>{order.delivery_type === 'driver' ? '🛺' : order.delivery_type === 'farmer' ? '🚜' : '🏪'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.methodName}>
                {order.delivery_type === 'driver' ? 'GramFleet Delivery' : order.delivery_type === 'farmer' ? 'Farmer Self-Delivery' : 'Self Pickup'}
              </Text>
              <Text style={styles.methodDesc}>
                {order.delivery_type === 'self_pickup' ? 'Farm location will be shared' : 'On-door delivery service'}
              </Text>
            </View>
          </View>

          {order.delivery_type === 'driver' && order.assigned_driver && (
            <View style={styles.driverSection}>
              <View style={styles.divider} />
              <View style={styles.personRow}>
                <View style={[styles.avatarCircle, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={[styles.avatarInitial, { color: Colors.primary }]}>
                    {order.assigned_driver.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.personName}>{order.assigned_driver.name}</Text>
                  <Text style={styles.personSubText}>GramFleet Captain • Active Now</Text>
                </View>
                <TouchableOpacity 
                  style={styles.callCircle}
                  onPress={() => {
                    const numberToCall = (order.status === 'in_transit' || order.status === 'picked_up') 
                      ? '+13203318140' 
                      : order.assigned_driver.phone;
                    Linking.openURL(`tel:${numberToCall}`);
                  }}
                >
                  <Text style={{ fontSize: 18 }}>📞</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>Need Help? Chat with Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  scrollContent: { padding: 20 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  orderId: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  priceInfo: { alignItems: 'flex-end' },
  amount: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  qty: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  timelineCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  timeline: { paddingLeft: 10 },
  stepContainer: { flexDirection: 'row', minHeight: 70 },
  stepIndicator: { alignItems: 'center', marginRight: 15 },
  dot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  dotCompleted: { backgroundColor: Colors.primary },
  dotPending: { backgroundColor: '#E0E0E0' },
  dotCurrent: { borderWidth: 3, borderColor: Colors.primaryLight },
  dotIcon: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  line: { width: 2, flex: 1, marginVertical: -2 },
  lineCompleted: { backgroundColor: Colors.primary },
  linePending: { backgroundColor: '#E0E0E0' },
  stepContent: { flex: 1, paddingBottom: 25 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepLabel: { fontSize: 16, fontWeight: 'bold', color: '#B0B0B0' },
  textCompleted: { color: Colors.text },
  stepEmoji: { fontSize: 18 },
  stepDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  personRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  personName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  personSubText: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, color: '#FF9800', fontWeight: 'bold' },
  locationText: { fontSize: 13, color: Colors.textMuted },
  callCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  
  addressBox: { flexDirection: 'row', backgroundColor: '#F9F9F9', padding: 16, borderRadius: 16 },
  addressEmoji: { fontSize: 20 },
  addressTitle: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold', textTransform: 'uppercase' },
  addressContent: { fontSize: 14, color: Colors.text, marginTop: 4, lineHeight: 20 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 14, color: Colors.textMuted },
  priceValue: { fontSize: 14, color: Colors.text, fontWeight: '500' },

  methodRow: { flexDirection: 'row', alignItems: 'center' },
  methodName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  methodDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  methodIconBg: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  driverSection: { marginTop: 5 },
  footer: { padding: 20 },
  helpBtn: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center' },
  helpBtnText: { color: Colors.primary, fontWeight: 'bold' },
  errorText: { color: Colors.error, fontSize: 16 },
});
