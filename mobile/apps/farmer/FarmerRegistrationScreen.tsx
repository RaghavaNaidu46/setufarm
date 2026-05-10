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

export default function FarmerRegistrationScreen() {
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
    farm_size_acres: '',
    aadhar_number: '',
    lat: 17.3850,
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

    if (step === 2 && (!formData.village || !formData.district)) {
      Alert.alert('Required', 'Please enter your village and district');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.aadhar_number || formData.aadhar_number.length !== 12) {
      Alert.alert('Invalid Aadhar', 'Please enter a valid 12-digit Aadhar number');
      return;
    }
    if (!formData.farm_size_acres) {
      Alert.alert('Required', 'Please enter your farm size');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/users/register/farmer', {
        ...formData,
        farm_size_acres: parseFloat(formData.farm_size_acres)
      });
      
      setUser(response.data);
      Alert.alert('Success', 'Registration completed successfully!', [
        { text: 'Start Selling', onPress: () => navigation.replace('FarmerHome') }
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
      {[1, 2, 3].map((s) => (
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
            <Text style={styles.title}>Farmer Registration</Text>
            <Text style={styles.subtitle}>Let's set up your profile to start selling.</Text>
            {renderStepIndicator()}
          </View>



          <View style={styles.card}>
            {step === 1 && (
              <View>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(v) => handleChange('name', v)}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.phone}
                  onChangeText={(v) => handleChange('phone', v)}
                />

                <Text style={styles.label}>Preferred Language</Text>
                <View style={styles.languageContainer}>
                  {['telugu', 'hindi', 'english'].map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.langButton, formData.language === lang && styles.langButtonActive]}
                      onPress={() => handleChange('language', lang)}
                    >
                      <Text style={[styles.langText, formData.language === lang && styles.langTextActive]}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next: Location</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={styles.sectionTitle}>Location Details</Text>
                <Text style={styles.label}>Village</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Village Name"
                  value={formData.village}
                  onChangeText={(v) => handleChange('village', v)}
                />

                <Text style={styles.label}>District</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your District"
                  value={formData.district}
                  onChangeText={(v) => handleChange('district', v)}
                />

                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                  value={formData.state}
                  editable={false}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.nextButtonHalf} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next: Farm & ID</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 3 && (
              <View>
                <Text style={styles.sectionTitle}>Identity & Farm Details</Text>
                <Text style={styles.label}>Farm Size (Acres)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2.5"
                  keyboardType="decimal-pad"
                  value={formData.farm_size_acres}
                  onChangeText={(v) => handleChange('farm_size_acres', v)}
                />

                <Text style={styles.label}>Aadhar Number (12 digits)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012"
                  keyboardType="number-pad"
                  maxLength={12}
                  value={formData.aadhar_number}
                  onChangeText={(v) => handleChange('aadhar_number', v)}
                />

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    💡 Aadhar details are used for verification to build trust with buyers.
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Complete Registration</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.cancelContainer} onPress={() => logout()}>
            <Text style={styles.cancelText}>Cancel Registration</Text>
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
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
  infoBox: { backgroundColor: '#fff9e6', padding: 12, borderRadius: 10, marginTop: 20 },
  infoText: { fontSize: 12, color: '#856404', lineHeight: 18 },
});
