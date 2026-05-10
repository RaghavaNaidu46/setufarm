import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert,
  SafeAreaView, StatusBar
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverSelectionScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: drivers, isLoading, refetch } = useQuery({
    queryKey: ['nearby-drivers'],
    queryFn: () => apiClient.get('/users/drivers/nearby').then(r => r.data),
  });

  const { mutate: bookDrivers, isPending: booking } = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => apiClient.post(`/users/driver/request/${orderId}/${id}`));
      return Promise.all(promises);
    },
    onSuccess: () => {
      Alert.alert('Success', `Requests sent to ${selectedIds.length} drivers!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: () => Alert.alert('Error', 'Failed to send requests'),
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const vehicleTypes = ['bike', 'auto', 'tractor', 'van', 'tempo'];

  const filteredDrivers = filter 
    ? drivers?.filter((d: any) => d.vehicle_type === filter) 
    : drivers;

  const renderDriverItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.driverCard, selectedIds.includes(item.id) && styles.driverCardSelected]}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.driverHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.driverName}>{item.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating} • {item.distance_km} km away</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.vTypeBadge}>
            <Text style={styles.vTypeText}>{item.vehicle_type.toUpperCase()}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Ionicons 
              name={selectedIds.includes(item.id) ? "checkbox" : "square-outline"} 
              size={24} 
              color={selectedIds.includes(item.id) ? Colors.primary : Colors.border} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.driverDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="car-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.detailText}>{item.vehicle_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Driver</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity 
            style={[styles.filterChip, !filter && styles.filterChipActive]} 
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterText, !filter && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          {vehicleTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[styles.filterChip, filter === type && styles.filterChipActive]} 
              onPress={() => setFilter(type)}
            >
              <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 100 }} />
        ) : filteredDrivers?.length > 0 ? (
          <>
            <FlatList
              data={filteredDrivers}
              renderItem={renderDriverItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
            {selectedIds.length > 0 && (
              <View style={styles.bottomBar}>
                <TouchableOpacity 
                  style={styles.sendRequestsBtn}
                  onPress={() => bookDrivers(selectedIds)}
                  disabled={booking}
                >
                  {booking ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 10 }} />
                      <Text style={styles.sendRequestsText}>Send Requests to {selectedIds.length} Drivers</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="car-off" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>No drivers available nearby</Text>
            <Text style={styles.emptySubtext}>Try changing filters or checking again later.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', elevation: 2 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  filterSection: { backgroundColor: '#fff', paddingBottom: 12 },
  filterContent: { paddingHorizontal: 20, gap: 10 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#eee' },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  content: { flex: 1, padding: 20 },
  driverCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 2, borderColor: 'transparent' },
  driverCardSelected: { borderColor: Colors.primary, backgroundColor: '#F0F9F0' },
  driverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  driverName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { fontSize: 12, color: Colors.textMuted, marginLeft: 4 },
  vTypeBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  vTypeText: { color: '#1976D2', fontSize: 10, fontWeight: 'bold' },
  driverDetails: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: Colors.textMuted },
  bottomBar: { position: 'absolute', bottom: 20, left: 0, right: 0, paddingHorizontal: 20 },
  sendRequestsBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  sendRequestsText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
});
