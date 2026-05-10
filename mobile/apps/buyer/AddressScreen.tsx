import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  FlatList, ActivityIndicator, Alert, TextInput, Modal
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../shared/constants/colors';
import apiClient from '../../shared/api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocationStore } from '../../shared/store/locationStore';

export default function AddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { setSelectedAddress } = useLocationStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address_line: '',
    village: '',
    district: '',
    pincode: '',
    is_default: false
  });

  // Fetch addresses
  const { data: addresses, isLoading, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/addresses');
      return response.data;
    }
  });

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err) => Alert.alert('Error', 'Failed to delete address')
  });

  // Update address mutation (for setting default)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`/addresses/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err) => Alert.alert('Error', 'Failed to update address')
  });

  // Add address mutation
  const addMutation = useMutation({
    mutationFn: (data) => apiClient.post('/addresses', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setModalVisible(false);
      setNewAddress({ label: 'Home', address_line: '', village: '', district: '', pincode: '', is_default: false });
      // Automatically select the new address
      setSelectedAddress(res.data);
    },
    onError: (err) => Alert.alert('Error', 'Failed to add address')
  });

  const handleSelectAddress = (item) => {
    setSelectedAddress(item);
    navigation.goBack();
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.addressCard}
      onPress={() => handleSelectAddress(item)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.labelRow}>
           <View style={styles.labelBadge}>
              <Text style={styles.labelText}>{item.label}</Text>
           </View>
           {item.is_default && <Text style={styles.defaultText}>Default</Text>}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {!item.is_default && (
            <TouchableOpacity 
              onPress={() => updateMutation.mutate({ id: item.id, data: { is_default: true } })}
            >
              <Text style={styles.setDefaultText}>Set Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressLine}>{item.address_line}</Text>
      <Text style={styles.addressSub}>{item.village}, {item.district} - {item.pincode}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Saved Addresses</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddressItem}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No addresses saved yet.</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity 
        style={[styles.addButton, { bottom: insets.bottom + 20 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            
            <Text style={styles.inputLabel}>Label (Home, Work, etc.)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Home"
              value={newAddress.label}
              onChangeText={(v) => setNewAddress({...newAddress, label: v})}
            />

            <Text style={styles.inputLabel}>Full Address</Text>
            <TextInput 
              style={[styles.input, { height: 80 }]} 
              placeholder="House No, Street name..."
              multiline
              value={newAddress.address_line}
              onChangeText={(v) => setNewAddress({...newAddress, address_line: v})}
            />

            <View style={styles.row}>
               <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Village/City</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Village"
                    value={newAddress.village}
                    onChangeText={(v) => setNewAddress({...newAddress, village: v})}
                  />
               </View>
               <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="500001"
                    keyboardType="number-pad"
                    value={newAddress.pincode}
                    onChangeText={(v) => setNewAddress({...newAddress, pincode: v})}
                  />
               </View>
            </View>

            <Text style={styles.inputLabel}>District</Text>
            <TextInput 
              style={styles.input} 
              placeholder="District"
              value={newAddress.district}
              onChangeText={(v) => setNewAddress({...newAddress, district: v})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={() => {
                  if (!newAddress.address_line || !newAddress.village) {
                    Alert.alert('Error', 'Please fill required fields');
                    return;
                  }
                  addMutation.mutate(newAddress);
                }}
              >
                {addMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Address</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 24, paddingBottom: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  backIcon: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  listContent: { padding: 24, paddingBottom: 100 },
  addressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  labelBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  labelText: { color: Colors.primary, fontWeight: 'bold', fontSize: 12 },
  defaultText: { color: Colors.success, fontSize: 12, fontWeight: '600' },
  setDefaultText: { color: Colors.primary, fontSize: 12, fontWeight: '600' },
  deleteText: { color: Colors.error, fontSize: 12, fontWeight: '600' },
  addressLine: { fontSize: 15, color: Colors.text, fontWeight: '500', marginBottom: 4 },
  addressSub: { fontSize: 13, color: Colors.textMuted },
  addButton: { position: 'absolute', left: 24, right: 24, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: Colors.textMuted, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textMuted, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row' },
  modalButtons: { flexDirection: 'row', marginTop: 30, gap: 15 },
  cancelBtn: { flex: 1, paddingVertical: 15, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  cancelBtnText: { color: Colors.textMuted, fontWeight: 'bold' },
  saveBtn: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 15, alignItems: 'center', borderRadius: 12 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});
