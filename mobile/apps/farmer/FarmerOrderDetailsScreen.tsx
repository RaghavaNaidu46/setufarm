import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';

export default function FarmerOrderDetailsScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => apiClient.get(`/orders/${orderId}`).then(r => r.data),
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: string) => apiClient.patch(`/orders/${orderId}/status?status=${status}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-orders', 'farmer'] });
      
      // Auto-navigate to driver selection if marked ready and it's a GramFleet order
      if (res.data.status === 'ready_for_pickup' && res.data.delivery_type === 'driver') {
        navigation.navigate('DriverSelection', { orderId: res.data.id });
      } else {
        Alert.alert('Success', 'Order status updated successfully');
      }
    },
    onError: () => Alert.alert('Error', 'Failed to update order status'),
  });

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

  const renderActionButtons = () => {
    // Normalize status for checking
    const status = (order?.status || '').toLowerCase();

    switch (status) {
      case 'pending':
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => updateStatus('cancelled')}
              disabled={isPending}
            >
              <Text style={styles.cancelBtnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn]}
              onPress={() => updateStatus('confirmed')}
              disabled={isPending}
            >
              <Text style={styles.confirmBtnText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        );
      case 'confirmed':
        return (
          <TouchableOpacity
            style={[styles.btn, styles.primaryBtn, { flexDirection: 'row', gap: 10 }]}
            onPress={() => updateStatus('ready_for_pickup')}
            disabled={isPending}
          >
            <Ionicons name="cube-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>
              {order.delivery_type === 'driver' ? 'Ready! Book GramFleet Driver' : 'Mark as Ready'}
            </Text>
          </TouchableOpacity>
        );
      case 'ready_for_pickup':
        if (order.delivery_type === 'farmer') {
          return (
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn]}
              onPress={() => updateStatus('in_transit')}
              disabled={isPending}
            >
              <Text style={styles.primaryBtnText}>Start Delivery (Out for Delivery)</Text>
            </TouchableOpacity>
          );
        }
        return <Text style={styles.statusInfo}>Awaiting pickup by driver/buyer</Text>;
      case 'in_transit':
        if (order.delivery_type === 'farmer') {
          return (
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn]}
              onPress={() => updateStatus('delivered')}
              disabled={isPending}
            >
              <Text style={styles.primaryBtnText}>Mark as Delivered</Text>
            </TouchableOpacity>
          );
        }
        return <Text style={styles.statusInfo}>Order is on the way</Text>;
      default:
        return (
          <View>
            <Text style={styles.statusInfo}>Current Status: {order.status}</Text>
            {/* Forced button for testing if others fail */}
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn, { marginTop: 10 }]}
              onPress={() => updateStatus('ready_for_pickup')}
            >
              <Text style={styles.primaryBtnText}>FORCE: Mark as Ready</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.cropName}>{order.crop_name}</Text>
            <Text style={styles.qty}>{order.quantity_kg} kg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Your Earnings</Text>
            <Text style={styles.earnings}>₹{order.subtotal.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Buyer Details</Text>
          <Text style={styles.buyerName}>Aravind Buyer</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => Linking.openURL('tel:7093397835')}
          >
            <Text style={{ fontSize: 18 }}>📞</Text>
            <Text style={styles.phoneNumber}>7093397835</Text>
          </TouchableOpacity>
          <Text style={styles.address}>H.No 4-12, Village Center, Adilabad</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Mode</Text>
          <View style={[
            styles.deliveryBadge,
            { backgroundColor: order.delivery_type === 'driver' ? '#E3F2FD' : order.delivery_type === 'farmer' ? '#E8F5E9' : '#FFF3E0' }
          ]}>
            <View style={[
              styles.badgeIconBg,
              { backgroundColor: order.delivery_type === 'driver' ? '#2196F3' : order.delivery_type === 'farmer' ? '#4CAF50' : '#FF9800' }
            ]}>
              <Text style={{ fontSize: 32 }}>{order.delivery_type === 'driver' ? '🛺' : order.delivery_type === 'farmer' ? '🚜' : '🏪'}</Text>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={[
                styles.badgeTextMain,
                { color: order.delivery_type === 'driver' ? '#1565C0' : order.delivery_type === 'farmer' ? '#2E7D32' : '#E65100' }
              ]}>
                {order.delivery_type === 'driver' ? 'GRAMFLEET' : order.delivery_type === 'farmer' ? 'SELF DELIVERY' : 'BUYER PICKUP'}
              </Text>
              <Text style={styles.badgeTextSub}>
                {order.delivery_type === 'driver' ? 'Driver is coming' : order.delivery_type === 'farmer' ? 'You deliver' : 'Buyer is coming'}
              </Text>
            </View>
          </View>
          
          {order.delivery_type === 'driver' && (
            <View style={styles.driverAssignmentSection}>
              <View style={styles.divider} />
              
              <Text style={styles.assignmentLabel}>Driver Requests</Text>
              
              {order.requests && order.requests.length > 0 ? (
                order.requests.map((req: any, index: number) => (
                  <View key={index} style={[
                    styles.statusPulseCard, 
                    req.status === 'accepted' ? { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' } :
                    req.status === 'rejected' ? { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' } :
                    req.status === 'cancelled' ? { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' } :
                    { backgroundColor: '#FFF9C4', borderColor: '#FFF176' }
                  ]}>
                    {req.status === 'requested' && <View style={styles.pulseDot} />}
                    {req.status === 'accepted' && <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />}
                    {req.status === 'rejected' && <Ionicons name="close-circle" size={20} color="#C62828" />}
                    {req.status === 'cancelled' && <Ionicons name="ban-outline" size={20} color="#9E9E9E" />}

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[
                        styles.statusMainText,
                        req.status === 'accepted' ? { color: '#1B5E20' } :
                        req.status === 'rejected' ? { color: '#B71C1C' } :
                        req.status === 'cancelled' ? { color: '#616161' } :
                        { color: '#856404' }
                      ]}>
                        {req.driver_name}
                      </Text>
                      <Text style={styles.statusSubText}>
                        {req.status === 'requested' ? 'Waiting for response...' :
                          req.status === 'accepted' ? 'Accepted! Coming now.' :
                            req.status === 'rejected' ? 'Busy (Rejected)' :
                              'Cancelled (Another driver accepted)'}
                      </Text>
                    </View>
                    {req.status === 'requested' && <ActivityIndicator size="small" color={Colors.primary} />}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyRequestsText}>No drivers requested yet</Text>
              )}

              {(!order.assigned_driver_id) && order.status === 'ready_for_pickup' && (
                <TouchableOpacity 
                  style={styles.findDriverBtn}
                  onPress={() => navigation.navigate('DriverSelection', { orderId: order.id })}
                >
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.findDriverBtnText}>
                    {order.requests?.length > 0 ? 'Request More Drivers' : 'Find Nearby Drivers'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons inside ScrollView for better visibility */}
        <View style={styles.actionContainer}>
          {renderActionButtons()}
        </View>
      </ScrollView>
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
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  orderId: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold' },
  statusBadge: { backgroundColor: Colors.primary + '20', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  statusText: { color: Colors.primary, fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cropName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  qty: { fontSize: 16, color: Colors.textMuted },
  label: { fontSize: 14, color: Colors.textMuted },
  earnings: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  buyerName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  phoneNumber: { fontSize: 16, color: Colors.primary, fontWeight: 'bold' },
  address: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  deliveryBadge: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginTop: 8 },
  badgeIconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  badgeTextMain: { fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  badgeTextSub: { fontSize: 13, color: '#555', marginTop: 2, fontWeight: '500' },
  statusPulseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FFF176', marginTop: 10 },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  statusMainText: { fontSize: 16, fontWeight: 'bold', color: '#856404' },
  statusSubText: { fontSize: 12, color: '#856404', marginTop: 2 },
  emptyRequestsText: { fontSize: 14, color: Colors.textMuted, fontStyle: 'italic', marginVertical: 10 },
  actionContainer: { marginTop: 10, marginBottom: 100 },
  actionRow: { flexDirection: 'row', gap: 12 },
  btn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  primaryBtn: { backgroundColor: Colors.primary, width: '100%' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  confirmBtn: { backgroundColor: Colors.primary, flex: 1 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#FFF0F0', flex: 0.4 },
  cancelBtnText: { color: '#FF4D4D', fontWeight: 'bold' },
  statusInfo: { textAlign: 'center', color: Colors.textMuted, fontSize: 15, fontStyle: 'italic', backgroundColor: '#eee', padding: 15, borderRadius: 12 },
  driverAssignmentSection: { marginTop: 10 },
  assignmentLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold', marginBottom: 8 },
  assignedDriverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12 },
  assignedDriverName: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  statusBadgeSmall: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusTextSmall: { fontSize: 10, fontWeight: 'bold' },
  findDriverBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  findDriverBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
