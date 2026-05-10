import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
  Image, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient, { getImageUrl } from '../../shared/api/client';


export default function MyCropsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['my-crops'],
    queryFn: () => apiClient.get('/products/my-listings').then(r => r.data),
  });

  const renderCropItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cropCard}
      onPress={() => navigation.navigate('CropDetails', { crop: item })}
    >
      <Image 
        source={{ uri: getImageUrl(item.photos && item.photos[0]) }} 
        style={styles.cropImage} 
      />


      <View style={styles.cropInfo}>
        <View style={styles.statusRow}>
          <Text style={styles.cropName}>{item.crop_name}</Text>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusSold]}>
            <Text style={[styles.statusText, item.status === 'active' ? styles.statusTextActive : styles.statusTextSold]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.details}>{item.quantity_kg} kg available</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price_per_kg}/kg</Text>
          <View style={styles.editBtn}>
            <Text style={styles.editBtnText}>Details</Text>
          </View>
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
        <Text style={styles.title}>My Listed Crops</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={data?.products || []}
        keyExtractor={(item) => item.id}
        renderItem={renderCropItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🌱</Text>
              <Text style={styles.emptyText}>You haven't listed any crops yet.</Text>
              <TouchableOpacity 
                style={styles.listBtn}
                onPress={() => navigation.navigate('ListCrop')}
              >
                <Text style={styles.listBtnText}>List Your First Crop</Text>
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
  header: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  listContent: { padding: 20 },
  cropCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    flexDirection: 'row',
    padding: 12, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  cropImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#f0f0f0' },
  cropInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusSold: { backgroundColor: '#F5F5F5' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextActive: { color: '#2E7D32' },
  statusTextSold: { color: '#757575' },
  details: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  editBtn: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  editBtnText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 10, marginBottom: 20, textAlign: 'center' },
  listBtn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  listBtnText: { color: '#fff', fontWeight: 'bold' },
});
