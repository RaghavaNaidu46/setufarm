import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
  ActivityIndicator, Alert, ScrollView,
  StatusBar, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';
import { useAuthStore } from '../../shared/store/authStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverHomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);

  // Fetch Dashboard Data
  const { data: dashboard, refetch, isLoading } = useQuery({
    queryKey: ['driver-dashboard'],
    queryFn: () => apiClient.get('/users/driver/dashboard').then(r => r.data),
  });

  const { mutate: pickupOrder, isPending: pickingUp } = useMutation({
    mutationFn: (orderId: string) => apiClient.post(`/delivery/${orderId}/pickup`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard'] });
      Alert.alert('Success', 'Order picked up! Navigate to delivery address.');
    },
    onError: () => Alert.alert('Error', 'Failed to pickup order'),
  });

  const { mutate: respondToRequest } = useMutation({
    mutationFn: (params: { orderId: string, accept: boolean }) => 
      apiClient.post(`/users/driver/respond/${params.orderId}?accept=${params.accept}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard'] });
      Alert.alert('Success', variables.accept ? 'Request accepted!' : 'Request declined');
    },
    onError: () => Alert.alert('Error', 'Failed to respond to request'),
  });

  const onRefresh = () => {
    refetch();
  };

  const renderStatCard = (label: string, value: string | number, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const renderAvailableItem = ({ item }: { item: any }) => (
    <View style={styles.availableCard}>
      <View style={styles.cardInfo}>
        <View style={styles.cropIconContainer}>
          <MaterialCommunityIcons name="leaf" size={20} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cropName}>{item.crop_name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.distance_km} km away</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Earnings</Text>
          <Text style={styles.priceValue}>₹{item.delivery_charge}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.pickupBtn}
        onPress={() => pickupOrder(item.id)}
        disabled={pickingUp}
      >
        {pickingUp ? <ActivityIndicator color="#fff" /> : <Text style={styles.pickupBtnText}>Accept Pickup</Text>}
      </TouchableOpacity>
    </View>
  );

  const renderActiveItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.activeCard}
      onPress={() => navigation.navigate('DriverOrderDetails', { orderId: item.id })}
    >
      <View style={styles.activeCardHeader}>
        <View>
          <Text style={styles.activeCropName}>{item.crop_name}</Text>
          <Text style={styles.activeOrderTime}>Ordered {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>IN TRANSIT</Text>
        </View>
      </View>
      <View style={styles.activeCardFooter}>
        <View style={styles.activeMetaItem}>
          <Ionicons name="card-outline" size={16} color={Colors.primary} />
          <Text style={styles.activeMetaText}>Fee: ₹{item.delivery_charge}</Text>
        </View>
        <Text style={styles.tapToTrack}>Tap to track & deliver →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
               <Image 
                source={{ uri: user?.profile_photo || 'https://ui-avatars.com/api/?name=' + user?.name }} 
                style={styles.avatar} 
              />
              <View style={[styles.statusDot, { backgroundColor: isOnline ? Colors.success : Colors.danger }]} />
            </View>
            <View>
              <Text style={styles.greeting}>Hello, Captain</Text>
              <Text style={styles.name}>{user?.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsOnline(!isOnline)} style={[styles.onlineToggle, !isOnline && styles.offlineToggle]}>
            <Text style={styles.onlineToggleText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {renderStatCard("Today's Earnings", `₹${dashboard?.today_earnings || 0}`, 'wallet', '#FFD700')}
          {renderStatCard("Total Trips", dashboard?.total_deliveries || 0, 'truck-delivery', '#4CAF50')}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Active Orders Section */}
        {dashboard?.my_active_orders?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Deliveries</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{dashboard.my_active_orders.length}</Text>
              </View>
            </View>
            {dashboard.my_active_orders.map((item: any) => (
              <React.Fragment key={item.id}>
                {renderActiveItem({ item })}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Available Orders Section */}
        {/* Incoming Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Incoming Requests 📩</Text>
            {dashboard?.incoming_requests?.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{dashboard.incoming_requests.length}</Text>
              </View>
            )}
          </View>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : dashboard?.incoming_requests?.length > 0 ? (
            dashboard.incoming_requests.map((item: any) => (
              <View key={item.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.farmerName}>📩 {item.farmer_name} requested you</Text>
                    <Text style={styles.requestCrop}>{item.crop_name}</Text>
                    <View style={styles.loadRow}>
                      <MaterialCommunityIcons name="weight-kilogram" size={16} color={Colors.textMuted} />
                      <Text style={styles.loadText}>Load: {item.quantity_kg} kg</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.requestEarnings}>₹{item.delivery_charge}</Text>
                    <Text style={{ fontSize: 10, color: Colors.textMuted }}>Est. Earnings</Text>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.rejectBtn]} 
                    onPress={() => respondToRequest({ orderId: item.id, accept: false })}
                  >
                    <Text style={styles.rejectBtnText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.acceptBtn]} 
                    onPress={() => respondToRequest({ orderId: item.id, accept: true })}
                  >
                    <Text style={styles.acceptBtnText}>Accept Trip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="bell-off-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyText}>No requests at the moment</Text>
              <Text style={styles.emptySubtext}>When a farmer books you, it will appear here.</Text>
            </View>
          )}
        </View>

        {/* Available Orders Section (Fallback) */}
        {dashboard?.available_orders?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other Available Nearby</Text>
            </View>
            {dashboard.available_orders.map((item: any) => (
              <React.Fragment key={item.id}>
                {renderAvailableItem({ item })}
              </React.Fragment>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Logout for now, or could be in profile */}
      <TouchableOpacity style={[styles.logoutFab, { bottom: insets.bottom + 20 }]} onPress={logout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { 
    backgroundColor: Colors.primaryDark, 
    paddingHorizontal: 20, 
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Colors.primaryDark },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  onlineToggle: { backgroundColor: Colors.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  offlineToggle: { backgroundColor: Colors.danger },
  onlineToggleText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statCard: { 
    flex: 1, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 20, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  statIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  countBadge: { backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  availableCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cropIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cropName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 12, color: Colors.textMuted, marginLeft: 4 },
  priceContainer: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, color: Colors.textMuted },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  pickupBtn: { backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  pickupBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  activeCard: { 
    backgroundColor: Colors.primary, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  activeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  activeCropName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  activeOrderTime: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  activeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activeBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  activeCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
  activeMetaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeMetaText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, marginLeft: 4 },
  tapToTrack: { fontSize: 12, color: '#fff', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginTop: 15 },
  emptySubtext: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },

  logoutFab: { 
    position: 'absolute', 
    right: 20, 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: Colors.danger, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  requestCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 4 },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  farmerName: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  requestCrop: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 2 },
  loadRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  loadText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  requestEarnings: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  requestActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  acceptBtn: { backgroundColor: Colors.primary },
  acceptBtnText: { color: '#fff', fontWeight: 'bold' },
  rejectBtn: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FFE0E0' },
  rejectBtnText: { color: Colors.danger, fontWeight: 'bold' },
});
