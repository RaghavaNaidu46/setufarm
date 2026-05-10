import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  FlatList, Image, ActivityIndicator, TextInput, ScrollView, Modal
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../shared/constants/colors';
import { useAuthStore } from '../../shared/store/authStore';
import apiClient, { getImageUrl } from '../../shared/api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocationStore } from '../../shared/store/locationStore';

export default function BuyerHomeScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const { selectedAddress, setSelectedAddress } = useLocationStore();
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains'];

  // Fetch addresses to initialize global state
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/addresses');
      const addrs = response.data;
      if (addrs.length > 0 && !selectedAddress) {
        const defaultAddr = addrs.find(a => a.is_default) || addrs[0];
        setSelectedAddress(defaultAddr);
      }
      return addrs;
    }
  });

  // Fetch nearby crops using selected address location
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['nearby-crops', selectedAddress?.id],
    queryFn: async () => {
      const response = await apiClient.get('/products/nearby', {
        params: {
          lat: selectedAddress?.lat || 0,
          lng: selectedAddress?.lng || 0,
          radius_km: 50
        }
      });
      return response.data.products || [];
    }
  });

  const filteredCrops = data?.filter((crop: any) => {
    const matchesSearch = crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderCropItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.cropCard}
      onPress={() => navigation.navigate('BuyerCropDetails', { crop: item })}
    >
      <Image
        source={{ uri: getImageUrl(item.photos && item.photos[0]) }}
        style={styles.cropImage}
      />
      <View style={styles.cropInfo}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cropName}>{item.crop_name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
               <Text style={styles.farmerMiniName}>by {item.farmer?.name || 'Local Farmer'}</Text>
               <Text style={styles.miniRating}> ★ {item.farmer?.rating || '0.0'}</Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{item.price_per_kg}/kg</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.locationText}>📍 {item.village || 'Nearby'}{item.district ? `, ${item.district}` : ''}</Text>
          {item.distance_km !== undefined && (
            <View style={styles.distanceBadgeMini}>
               <Text style={styles.distanceTextMini}>{item.distance_km} km</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.quantityText}>📦 {item.quantity_kg} kg available</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate('BuyerCropDetails', { crop: item })}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user?.name} 👋</Text>
            <TouchableOpacity 
              style={styles.addressSelector}
              onPress={() => setAddressPickerVisible(true)}
            >
              <Text style={styles.location} numberOfLines={1}>
                Delivering to {selectedAddress?.label || 'your location'} ▼
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={styles.profileAvatar}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for fresh crops..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Modal
        visible={addressPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddressPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setAddressPickerVisible(false)}
        >
          <View style={styles.addressModal}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            {addresses?.map((addr: any) => (
              <TouchableOpacity 
                key={addr.id}
                style={[
                  styles.addressOption,
                  selectedAddress?.id === addr.id && styles.addressOptionSelected
                ]}
                onPress={() => {
                  setSelectedAddress(addr);
                  setAddressPickerVisible(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.addressOptionLabel,
                    selectedAddress?.id === addr.id && styles.selectedText
                  ]}>{addr.label}</Text>
                  <Text style={styles.addressOptionSub}>{addr.address_line}, {addr.village}</Text>
                </View>
                {selectedAddress?.id === addr.id && <Text style={{ color: Colors.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.manageBtn}
              onPress={() => {
                setAddressPickerVisible(false);
                navigation.navigate('Addresses');
              }}
            >
              <Text style={styles.manageBtnText}>+ Add or Manage Addresses</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fresh From Farms</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Finding local crops...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>Failed to load crops.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredCrops?.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emoji}>🌱</Text>
            <Text style={styles.emptyText}>No crops found nearby.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCrops}
            keyExtractor={(item) => item.id}
            renderItem={renderCropItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: 24,
    paddingTop: 10,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  addressSelector: { marginTop: 4, paddingVertical: 4 },
  location: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  profileAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  addressModal: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  addressOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#eee', marginBottom: 12, backgroundColor: '#f9f9f9' },
  addressOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '20', borderWidth: 1 },
  addressOptionLabel: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  addressOptionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  selectedText: { color: Colors.primary },
  manageBtn: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
  manageBtnText: { color: Colors.primary, fontWeight: 'bold' },

  categoriesContainer: { paddingVertical: 20, paddingLeft: 24 },
  categoryBadge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E0E0E0', marginRight: 10 },
  categoryBadgeActive: { backgroundColor: Colors.primary },
  categoryText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  categoryTextActive: { color: '#fff' },

  content: { flex: 1, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },

  listContent: { paddingBottom: 30 },
  cropCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cropImage: { width: '100%', height: 160, resizeMode: 'cover' },
  cropInfo: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cropName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  farmerMiniName: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  miniRating: { fontSize: 11, color: '#FF9800', fontWeight: 'bold' },
  priceTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priceText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 14 },
  locationText: { fontSize: 13, color: Colors.textMuted },
  distanceBadgeMini: { backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  distanceTextMini: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  buyButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 12, fontSize: 16, color: Colors.textMuted },
  errorText: { fontSize: 16, color: Colors.error, marginBottom: 12 },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primaryLight, borderRadius: 10 },
  retryText: { color: Colors.primary, fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 10 },
  emoji: { fontSize: 50 }
});
