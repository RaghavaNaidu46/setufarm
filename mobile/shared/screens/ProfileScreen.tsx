import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput,
  Alert, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.patch('/users/me', formData);
      setUser(response.data);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'F').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileRole}>{user?.role?.toUpperCase()}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(v) => setFormData({ ...formData, name: v })}
              />
            ) : (
              <Text style={styles.value}>{user?.name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={[styles.value, { color: Colors.textMuted }]}>{user?.email}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(v) => setFormData({ ...formData, phone: v })}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{user?.phone || 'Not set'}</Text>
            )}
          </View>

          {editing && (
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => { setEditing(false); setFormData({ name: user?.name || '', phone: user?.phone || '' }); }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.saveBtn]} 
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {user?.role === 'farmer' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Information</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>Village: {user?.village || 'Not set'}</Text>
              <Text style={styles.value}>District: {user?.district || 'Not set'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Identity</Text>
              <Text style={styles.value}>Aadhar: {user?.aadhar_number ? `**** **** ${user.aadhar_number.slice(-4)}` : 'Not verified'}</Text>
            </View>
          </View>
        )}

        {user?.role === 'buyer' && (
          <>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('BuyerOrders')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemTitle}>📦 My Purchases</Text>
                <Text style={styles.menuItemSub}>Track and view your order history</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('Addresses')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemTitle}>📍 Manage Saved Addresses</Text>
                <Text style={styles.menuItemSub}>Add or change delivery locations</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout Account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SetuFarm v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: Colors.white, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  content: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: Colors.primaryLight, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  profileName: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  profileRole: { fontSize: 14, color: Colors.primary, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
  section: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  editBtn: { color: Colors.primary, fontWeight: 'bold' },
  field: { marginBottom: 15 },
  label: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  value: { fontSize: 16, color: Colors.text, fontWeight: '500' },
  input: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: Colors.border,
    color: Colors.text
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 0.48, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#f5f5f5' },
  cancelBtnText: { color: Colors.textMuted, fontWeight: 'bold' },
  saveBtn: { backgroundColor: Colors.primary },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  menuItem: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  menuItemTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  menuItemSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  menuItemArrow: { fontSize: 20, color: Colors.textMuted, fontWeight: 'bold' },
  logoutBtn: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    paddingVertical: 15, 
    alignItems: 'center', 
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.error + '30'
  },
  logoutText: { color: Colors.error, fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: 12, marginTop: 30, marginBottom: 20 },
});
