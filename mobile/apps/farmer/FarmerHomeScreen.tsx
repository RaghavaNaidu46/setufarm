import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
  StatusBar, Dimensions, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useQuery } from '@tanstack/react-query';
import apiClient, { getImageUrl } from '../../shared/api/client';
import { Colors } from '../../shared/constants/colors';
import { useAuthStore } from '../../shared/store/authStore';

const { width } = Dimensions.get('window');

export default function FarmerHomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const { data: dashboard, refetch, isRefetching } = useQuery({
    queryKey: ['farmer-dashboard'],
    queryFn: () => apiClient.get('/users/farmer/dashboard').then(r => r.data),
  });

  const quickActions = [
    { icon: '🌱', title: 'List Crop', subtitle: 'Post new item', screen: 'ListCrop', color: '#4CAF50' },
    { icon: '🚜', title: 'My Crops', subtitle: 'Active listings', screen: 'MyCrops', color: '#8BC34A' },
    { icon: '💰', title: 'My Sales', subtitle: `${dashboard?.pending_orders || 0} pending`, screen: 'MySales', color: '#FF9800' },
    { icon: '🏦', title: 'Payments', subtitle: `₹${dashboard?.pending_payout || 0} due`, screen: 'Payments', color: '#2196F3' },
  ];


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
      >
        {/* Top Header Section */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greet}>Namaste,</Text>
              <Text style={styles.name}>{user?.name || 'Farmer'} Garu 🌾</Text>
            </View>
            <TouchableOpacity
              style={styles.profileCircle}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileInitial}>{(user?.name || 'F').charAt(0)}</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balLabel}>WEEKLY EARNINGS</Text>
              <Text style={styles.balValue}>₹{dashboard?.weekly_earnings?.toLocaleString() || '0'}</Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendText}>+12% from last week</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.sellBtn}
              onPress={() => navigation.navigate('ListCrop')}
            >
              <Text style={styles.sellBtnText}>+ SELL CROP</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Quick Actions Grid */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.iconCircle, { backgroundColor: action.color + '15' }]}>
                  <Text style={{ fontSize: 24 }}>{action.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardSub}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Market Status Widget */}
          <View style={styles.marketWidget}>
            <View style={styles.marketInfo}>
              <Text style={styles.marketLabel}>Market Status</Text>
              <Text style={styles.marketValue}>Bullish for Rice & Chillies</Text>
            </View>
            <TouchableOpacity style={styles.marketBtn}>
              <Text style={styles.marketBtnText}>Insights</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Sales */}
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sales</Text>

              <TouchableOpacity onPress={() => navigation.navigate('MySales')}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>

            {!dashboard?.recent_orders || dashboard.recent_orders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No orders yet. List your crops to start selling!</Text>
              </View>
            ) : (
              dashboard.recent_orders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}

                >
                  <View style={styles.orderEmoji}>
                    {order.crop_photo ? (
                      <Image source={{ uri: getImageUrl(order.crop_photo) }} style={styles.recentOrderImage} />
                    ) : (
                      <Text style={{ fontSize: 24 }}>🥬</Text>
                    )}
                  </View>

                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>{order.crop_name} — {order.quantity_kg}kg</Text>
                    <Text style={styles.orderBuyer}>{order.buyer_name}</Text>
                  </View>
                  <View style={[styles.statusBadge, order.status === 'delivered' ? styles.statusDelivered : styles.statusPending]}>
                    <Text style={[styles.statusText, order.status === 'delivered' ? styles.statusTextDelivered : styles.statusTextPending]}>
                      {order.status.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  greet: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  profileInitial: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  balLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  balValue: { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginTop: 4 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  trendText: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  sellBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sellBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  iconCircle: { width: 50, height: 50, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  cardSub: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  marketWidget: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primary + '20'
  },
  marketLabel: { fontSize: 12, color: Colors.primary, fontWeight: 'bold', textTransform: 'uppercase' },
  marketValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginTop: 4 },
  marketBtn: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  marketBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  ordersSection: { marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAll: { fontSize: 14, color: Colors.primary, fontWeight: 'bold' },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  orderEmoji: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', marginRight: 16, overflow: 'hidden' },
  recentOrderImage: { width: '100%', height: '100%' },

  orderInfo: { flex: 1 },
  orderTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  orderBuyer: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusDelivered: { backgroundColor: Colors.success + '15' },
  statusPending: { backgroundColor: Colors.warning + '15' },
  statusText: { fontSize: 10, fontWeight: '900' },
  statusTextDelivered: { color: Colors.success },
  statusTextPending: { color: Colors.warning },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 22 },
});

