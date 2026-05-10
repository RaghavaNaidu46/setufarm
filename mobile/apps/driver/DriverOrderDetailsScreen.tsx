import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';

export default function DriverOrderDetailsScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => apiClient.get(`/orders/${orderId}`).then(r => r.data),
  });

  const { mutate: deliverOrder, isPending } = useMutation({
    mutationFn: () => apiClient.post(`/orders/${orderId}/delivery-proof`, {
        photo_url: "https://example.com/proof.jpg", // Placeholder for photo proof
        lat: 17.3850,
        lng: 78.4867
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-deliveries'] });
      Alert.alert('Delivered!', 'Payment has been updated. Great job!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: () => Alert.alert('Error', 'Failed to mark as delivered'),
  });

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Crop Information</Text>
          <Text style={styles.cropName}>{order.crop_name}</Text>
          <Text style={styles.qty}>Quantity: {order.quantity_kg} kg</Text>
          <Text style={styles.fee}>Your Payout: ₹{order.delivery_charge}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup Point (Farmer)</Text>
          <Text style={styles.name}>Aravind Farmer</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:7729069835')} style={styles.phoneRow}>
            <Text>📞 7729069835</Text>
          </TouchableOpacity>
          <Text style={styles.address}>Ganesh Mandir Street, Nirmal Village</Text>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navBtnText}>Navigate to Pickup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Point (Buyer)</Text>
          <Text style={styles.name}>Aravind Buyer</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:7093397835')} style={styles.phoneRow}>
            <Text>📞 7093397835</Text>
          </TouchableOpacity>
          <Text style={styles.address}>H.No 4-12, Village Center, Adilabad</Text>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.navBtnText, { color: '#2E7D32' }]}>Navigate to Delivery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {order.status === 'in_transit' ? (
          <TouchableOpacity 
            style={styles.deliverBtn}
            onPress={() => deliverOrder()}
            disabled={isPending}
          >
            {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.deliverBtnText}>Mark as Delivered</Text>}
          </TouchableOpacity>
        ) : (
          <Text style={styles.completeText}>Delivery Completed</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, elevation: 2 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 14, color: Colors.textMuted, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  cropName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  qty: { fontSize: 16, color: Colors.text, marginTop: 4 },
  fee: { fontSize: 18, color: Colors.primary, fontWeight: 'bold', marginTop: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  phoneRow: { marginVertical: 8 },
  address: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  navBtn: { backgroundColor: '#E3F2FD', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  navBtnText: { color: '#1976D2', fontWeight: 'bold' },
  footer: { padding: 20 },
  deliverBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 4 },
  deliverBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  completeText: { textAlign: 'center', color: '#2E7D32', fontWeight: 'bold', fontSize: 18 }
});
