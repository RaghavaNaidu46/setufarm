import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';
import { useAuthStore } from '../../shared/store/authStore';

export default function BuyerOrdersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const { data: orders, refetch, isLoading } = useQuery({
    queryKey: ['my-orders', 'buyer'],
    queryFn: () => apiClient.get('/orders/my-orders?role=buyer').then(r => r.data),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isDraft = item.status === 'draft';

    return (
      <TouchableOpacity
        style={[styles.orderCard, isDraft && styles.draftCard]}
        onPress={() => {
          if (isDraft) {
            // Resume flow based on whether delivery is selected
            if (!item.delivery_type) {
              navigation.navigate('DeliveryOptions', {
                orderId: item.id,
                productId: item.product_id,
                buyerLat: 0,
                buyerLng: 0,
                subtotal: item.subtotal
              });
            } else {
              navigation.navigate('Payment', { order: item });
            }
          } else {
            navigation.navigate('BuyerOrderTracking', { orderId: item.id });
          }
        }}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isDraft ? '#eee' : getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: isDraft ? '#666' : getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.cropInfo}>
            <View style={styles.cropIconBg}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
            <View>
              <Text style={styles.cropName}>{item.crop_name}</Text>
              <Text style={styles.orderDate}>
                {isDraft ? 'Not completed' : new Date(item.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            {isDraft ? (
              <View style={styles.resumeBadge}>
                <Text style={styles.resumeText}>Complete Checkout →</Text>
              </View>
            ) : (
              <>
                <Text style={styles.quantity}>{item.quantity_kg} kg</Text>
                <Text style={styles.amount}>₹{item.total_amount.toLocaleString()}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Purchases</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🛒</Text>
              <Text style={styles.emptyText}>You haven't bought anything yet</Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('BuyerHome')}
              >
                <Text style={styles.browseBtnText}>Browse Marketplace</Text>
              </TouchableOpacity>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  listContent: { padding: 20 },
  orderCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2 },
  draftCard: { borderColor: Colors.primary, borderWidth: 1, borderStyle: 'dashed' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  orderBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cropIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
  cropName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  orderDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  priceInfo: { alignItems: 'flex-end' },
  quantity: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  amount: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: 2 },
  resumeBadge: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  resumeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 10, marginBottom: 20 },
  browseBtn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  browseBtnText: { color: '#fff', fontWeight: 'bold' },
});
