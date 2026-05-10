import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../shared/api/client';
import { Colors } from '../../shared/constants/colors';
import { useAuthStore } from '../../shared/store/authStore';

import * as Location from 'expo-location';

export default function BuyerRegistrationScreen() {
  const navigation = useNavigation<any>();
  const { user, setUser, logout } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: 'telugu',
    village: '',
    district: '',
    state: 'Telangana',
    lat: 17.3850, // Default to Hyderabad
    lng: 78.4867,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      Alert.alert('Required', 'Please enter your name and phone number');
      return;
    }

    if (step === 1) {
      // Request location permission
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          setFormData(prev => ({
            ...prev,
            lat: location.coords.latitude,
            lng: location.coords.longitude
          }));
        }
      } catch (e) {
        console.warn('Location permission failed', e);
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.village || !formData.district) {
      Alert.alert('Required', 'Please enter your village and district');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/users/register/buyer', formData);
      
      setUser(response.data);
      Alert.alert('Success', 'Registration completed successfully!', [
        { text: 'Start Buying', onPress: () => navigation.replace('BuyerHome') }
      ]);
    } catch (error: any) {
      console.error('Registration Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2].map((s) => (
        <View 
          key={s} 
          style={[
            styles.stepDot, 
            step >= s ? styles.stepDotActive : null,
            step === s ? styles.stepDotCurrent : null
          ]} 
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Buyer Registration</Text>
            <Text style={styles.subtitle}>Complete your profile to find local crops</Text>
            {renderStepIndicator()}
          </View>

          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(v) => handleChange('name', v)}
              />

              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(v) => handleChange('phone', v)}
                maxLength={10}
              />

              <Text style={styles.label}>App Language</Text>
              <View style={styles.languageContainer}>
                {['telugu', 'hindi', 'english'].map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langButton,
                      formData.language === lang && styles.langButtonActive
                    ]}
                    onPress={() => handleChange('language', lang)}
                  >
                    <Text style={[
                      styles.langText,
                      formData.language === lang && styles.langTextActive
                    ]}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Location Details</Text>
              <Text style={styles.subtitle}>Helps us suggest nearby crops from farmers</Text>
              
              <Text style={[styles.label, {marginTop: 20}]}>Village / City *</Text>
              <TextInput
                style={styles.input}
                placeholder="Where are you located?"
                value={formData.village}
                onChangeText={(v) => handleChange('village', v)}
              />

              <Text style={styles.label}>District *</Text>
              <TextInput
                style={styles.input}
                placeholder="Your district"
                value={formData.district}
                onChangeText={(v) => handleChange('district', v)}
              />

              <Text style={styles.label}>State</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#e9ecef', color: '#6c757d' }]}
                value={formData.state}
                editable={false}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Complete Profile</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.cancelContainer} onPress={() => {
            Alert.alert(
              'Cancel Registration?',
              'Are you sure you want to cancel and log out?',
              [
                { text: 'No', style: 'cancel' },
                { text: 'Yes, Logout', style: 'destructive', onPress: logout }
              ]
            );
          }}>
            <Text style={styles.cancelText}>Cancel & Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  subtitle: { fontSize: 16, color: Colors.textMuted, marginTop: 4 },
  cancelContainer: { marginTop: 24, padding: 16, alignItems: 'center' },
  cancelText: { color: Colors.error, fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
  stepIndicator: { flexDirection: 'row', marginTop: 20 },
  stepDot: { width: 40, height: 4, backgroundColor: Colors.border, marginRight: 8, borderRadius: 2 },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotCurrent: { height: 6, marginTop: -1 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: Colors.border },
  languageContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 20 },
  langButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: Colors.border, marginHorizontal: 4 },
  langButtonActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  langText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  langTextActive: { color: Colors.primary },
  nextButton: { backgroundColor: Colors.primary, borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 30 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' },
  backButton: { flex: 0.4, paddingVertical: 18, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  backButtonText: { color: Colors.textMuted, fontSize: 16, fontWeight: '600' },
  nextButtonHalf: { flex: 0.55, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  submitButton: { flex: 0.55, backgroundColor: Colors.success, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
