import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Alert, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../shared/constants/colors';
import { getImageUrl } from '../../shared/api/client';


const { width } = Dimensions.get('window');

export default function CropDetailsScreen({ route, navigation }) {
  const { crop } = route.params;
  const insets = useSafeAreaInsets();

  const handleMarkAsSold = () => {
    Alert.alert(
      'Mark as Sold?',
      'This will hide the listing from buyers.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Mark Sold', onPress: () => navigation.goBack() }
      ]
    );
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
            <View>
              <Text style={styles.cropName}>{crop.crop_name}</Text>
              <Text style={styles.category}>Vegetables • Fresh</Text>
            </View>
            <View style={[styles.statusBadge, crop.status === 'active' ? styles.statusActive : styles.statusSold]}>
              <Text style={[styles.statusText, crop.status === 'active' ? styles.statusTextActive : styles.statusTextSold]}>
                {crop.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>QUANTITY</Text>
              <Text style={styles.statValue}>{crop.quantity_kg} kg</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>PRICE / KG</Text>
              <Text style={styles.statValue}>₹{crop.price_per_kg}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>📍 {crop.village || 'Your Village'}, {crop.district || 'Your District'}</Text>
              <Text style={styles.locationSub}>Buyers within 20km can see this listing</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              High quality {crop.crop_name} harvested yesterday. No pesticides used. 
              Ready for immediate pickup or delivery.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.soldBtn} onPress={handleMarkAsSold}>
              <Text style={styles.soldBtnText}>Mark as Sold</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { width: width, height: 350 },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: { position: 'absolute', left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  backIcon: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  content: { flex: 1, padding: 24, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  cropName: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  category: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusSold: { backgroundColor: '#F5F5F5' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextActive: { color: '#2E7D32' },
  statusTextSold: { color: '#757575' },
  statsCard: { backgroundColor: '#F8F9FA', borderRadius: 24, padding: 20, flexDirection: 'row', marginBottom: 30, borderWidth: 1, borderColor: '#eee' },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.textMuted, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  divider: { width: 1, height: '100%', backgroundColor: '#ddd' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  locationBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee' },
  locationText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  locationSub: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  description: { fontSize: 15, color: '#555', lineHeight: 24 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 30 },
  editBtn: { flex: 1, backgroundColor: '#F0F4F0', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  editBtnText: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
  soldBtn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  soldBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
