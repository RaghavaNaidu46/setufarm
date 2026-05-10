import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, 
  TouchableOpacity, Dimensions, ActivityIndicator, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient, { getImageUrl } from '../../shared/api/client';

const { width } = Dimensions.get('window');

import { useLocationStore } from '../../shared/store/locationStore';

export default function BuyerCropDetailsScreen({ route, navigation }) {
  const { crop } = route.params;
  const insets = useSafeAreaInsets();
  
  const { selectedAddress, setSelectedAddress } = useLocationStore();
  const [quantity, setQuantity] = useState(10);

  // Fetch addresses to ensure list is fresh (and default is set if missing)
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

  const minQty = 5;
  const maxQty = crop.quantity_kg;
  const subtotal = quantity * crop.price_per_kg;

  // Mutation to create the order
  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedAddress) {
        throw new Error('Please select a delivery address');
      }
      const payload = {
        product_id: crop.id,
        quantity_kg: quantity,
        address_id: selectedAddress.id
      };
      const response = await apiClient.post('/orders', payload);
      return response.data;
    },
    onSuccess: (orderData) => {
      // Navigate to DeliveryOptions with the created order context
      navigation.navigate('DeliveryOptions', {
        orderId: orderData.id,
        productId: crop.id,
        buyerLat: selectedAddress?.lat || 0, 
        buyerLng: selectedAddress?.lng || 0,
        subtotal: orderData.subtotal
      });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to start checkout. Please try again.');
    }
  });

  const handleAdjustQuantity = (amount: number) => {
    const newQty = quantity + amount;
    if (newQty >= minQty && newQty <= maxQty) {
      setQuantity(newQty);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: getImageUrl(crop.photos && crop.photos[0]) }} 
            style={styles.mainImage} 
          />
          <TouchableOpacity 
            style={[styles.backBtn, { top: insets.top + 10 }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cropName}>{crop.crop_name}</Text>
              <Text style={styles.category}>Fresh Produce • Directly from Farm</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>₹{crop.price_per_kg} / kg</Text>
            </View>
          </View>

          {/* Farmer Info Card */}
          <View style={styles.farmerCard}>
             <View style={styles.farmerInfo}>
                <View style={styles.farmerAvatar}>
                   <Text style={styles.farmerAvatarText}>{crop.farmer?.name?.charAt(0) || 'F'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                   <Text style={styles.farmerName}>{crop.farmer?.name || 'Local Farmer'}</Text>
                   <View style={styles.ratingRow}>
                      <Text style={{ fontSize: 12, color: '#FF9800' }}>★ {crop.farmer?.rating || '0.0'}</Text>
                      <Text style={styles.farmerMeta}> • Verified Farmer</Text>
                   </View>
                </View>
                {crop.distance_km !== undefined && (
                   <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{crop.distance_km} km away</Text>
                   </View>
                )}
             </View>
             <View style={styles.divider} />
             <Text style={styles.locationDetail}>📍 {crop.village || 'Nearby'}{crop.district ? `, ${crop.district}` : ''}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deliver to</Text>
            {selectedAddress ? (
               <View style={styles.selectedAddressCard}>
                  <View style={{ flex: 1 }}>
                     <View style={styles.labelRow}>
                        <Text style={styles.addressLabelText}>{selectedAddress.label}</Text>
                     </View>
                     <Text style={styles.addressText} numberOfLines={1}>
                        {selectedAddress.address_line}, {selectedAddress.village}
                     </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.changeBtn}
                    onPress={() => navigation.navigate('Addresses')}
                  >
                     <Text style={styles.changeBtnText}>Change</Text>
                  </TouchableOpacity>
               </View>
            ) : (
               <TouchableOpacity 
                 style={styles.addAddressBtn}
                 onPress={() => navigation.navigate('Addresses')}
               >
                  <Text style={styles.addAddressText}>+ Add Delivery Address</Text>
               </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this crop</Text>
            <Text style={styles.description}>
              Freshly harvested {crop.crop_name} from local farmers. 
              By buying directly on SetuFarm, you support local agriculture and get the freshest produce at the best prices.
            </Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.orderCard}>
            <Text style={styles.orderCardTitle}>Select Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleAdjustQuantity(-5)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Text style={styles.qtyLabel}>kg</Text>
              </View>

              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleAdjustQuantity(5)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.stockText}>Total available: {crop.quantity_kg} kg</Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Item Subtotal:</Text>
              <Text style={styles.totalValue}>₹{subtotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 20 }]}>
        <View>
          <Text style={styles.bottomPrice}>₹{subtotal.toLocaleString()}</Text>
          <Text style={styles.bottomLabel}>{quantity} kg total</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn} 
          onPress={() => createOrder()}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { width: width, height: 320 },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: { position: 'absolute', left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  backIcon: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  
  content: { flex: 1, padding: 24, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cropName: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  category: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  priceBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  priceText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 16 },
  
  farmerCard: { backgroundColor: '#F8F9FA', borderRadius: 20, padding: 16, marginBottom: 25, borderWidth: 1, borderColor: '#eee' },
  farmerInfo: { flexDirection: 'row', alignItems: 'center' },
  farmerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  farmerAvatarText: { color: Colors.primary, fontWeight: 'bold', fontSize: 18 },
  farmerName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  farmerMeta: { fontSize: 12, color: Colors.textMuted },
  distanceBadge: { backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  distanceText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  locationDetail: { fontSize: 13, color: Colors.textMuted },
  
  selectedAddressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee' },
  addressLabelText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  addressText: { fontSize: 14, color: Colors.text, marginTop: 4 },
  changeBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  changeBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
  addAddressBtn: { backgroundColor: '#F0F7F0', borderRadius: 16, padding: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary },
  addAddressText: { color: Colors.primary, fontWeight: 'bold' },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  description: { fontSize: 15, color: '#555', lineHeight: 24 },
  
  orderCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  orderCardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 16, textAlign: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 10 },
  qtyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 24, color: Colors.primary, fontWeight: '600', marginTop: -2 },
  qtyDisplay: { alignItems: 'center', width: 60 },
  qtyValue: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  qtyLabel: { fontSize: 12, color: Colors.textMuted },
  stockText: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginBottom: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  totalLabel: { fontSize: 16, color: Colors.textMuted, fontWeight: '500' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.text },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  bottomPrice: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  bottomLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  checkoutBtn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 16, borderRadius: 16 },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
