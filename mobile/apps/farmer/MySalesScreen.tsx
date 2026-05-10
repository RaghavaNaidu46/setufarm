import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
  Image, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';
import { useAuthStore } from '../../shared/store/authStore';

export default function MySalesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const { data: sales, refetch, isLoading } = useQuery({
    queryKey: ['my-orders', 'farmer'],
    queryFn: () => apiClient.get('/orders/my-orders?role=farmer').then(r => r.data),
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

  const renderSalesItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.salesCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.salesHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.salesBody}>
        <View style={styles.cropInfo}>
          <View style={styles.cropIconBg}>
            <Text style={{ fontSize: 24 }}>🌾</Text>
          </View>
          <View>
            <Text style={styles.cropName}>{item.crop_name}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </Text>
          </View>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.quantity}>{item.quantity_kg} kg</Text>
          <Text style={styles.amount}>₹{item.total_amount.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Sales</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        renderItem={renderSalesItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>💰</Text>
              <Text style={styles.emptyText}>No sales yet</Text>
              <TouchableOpacity 
                style={styles.listBtn}
                onPress={() => navigation.navigate('ListCrop')}
              >
                <Text style={styles.listBtnText}>List a Crop</Text>
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
  salesCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  salesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  salesBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cropIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
  cropName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  orderDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  priceInfo: { alignItems: 'flex-end' },
  quantity: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  amount: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: 2 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 10, marginBottom: 20 },
  listBtn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  listBtnText: { color: '#fff', fontWeight: 'bold' },
});
