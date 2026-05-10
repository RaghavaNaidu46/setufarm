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

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Bike' },
  { id: 'auto', label: 'Auto' },
  { id: 'tractor', label: 'Tractor' },
  { id: 'van', label: 'Van' },
  { id: 'tempo', label: 'Tempo' },
];

export default function DriverRegistrationScreen() {
  const navigation = useNavigation<any>();
  const { user, setUser, logout } = useAuthStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: 'telugu',
    vehicle_type: 'auto',
    vehicle_number: '',
    license_number: '',
    aadhar_number: '',
    upi_id: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      Alert.alert('Required', 'Please enter your name and phone number');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!formData.vehicle_number || !formData.license_number || !formData.upi_id || !formData.aadhar_number) {
      Alert.alert('Required', 'Please fill in all vehicle and ID details');
      return;
    }

    if (formData.aadhar_number.length !== 12) {
      Alert.alert('Invalid Aadhar', 'Aadhar number must be 12 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/users/register/driver', formData);
      
      setUser(response.data);
      Alert.alert('Success', 'Registration completed successfully!', [
        { text: 'Start Earning', onPress: () => navigation.replace('DriverHome') }
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
            <Text style={styles.title}>Driver Registration</Text>
            <Text style={styles.subtitle}>Join our delivery fleet and start earning today.</Text>
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
                  <Text style={styles.nextButtonText}>Next: Vehicle Details</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={styles.sectionTitle}>Vehicle & Identity</Text>
                
                <Text style={styles.label}>Vehicle Type</Text>
                <View style={styles.vehicleTypeGrid}>
                  {VEHICLE_TYPES.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      style={[styles.vTypeButton, formData.vehicle_type === v.id && styles.vTypeButtonActive]}
                      onPress={() => handleChange('vehicle_type', v.id)}
                    >
                      <Text style={[styles.vTypeText, formData.vehicle_type === v.id && styles.vTypeTextActive]}>
                        {v.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Vehicle Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="TS 08 AB 1234"
                  autoCapitalize="characters"
                  value={formData.vehicle_number}
                  onChangeText={(v) => handleChange('vehicle_number', v)}
                />

                <Text style={styles.label}>Driving License Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DL-XXXXXXXXXXXXX"
                  autoCapitalize="characters"
                  value={formData.license_number}
                  onChangeText={(v) => handleChange('license_number', v)}
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

                <Text style={styles.label}>UPI ID (for payments)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@upi"
                  autoCapitalize="none"
                  value={formData.upi_id}
                  onChangeText={(v) => handleChange('upi_id', v)}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Register</Text>}
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
  cancelText: { color: Colors.danger, fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
  stepIndicator: { flexDirection: 'row', marginTop: 20 },
  stepDot: { width: 60, height: 4, backgroundColor: Colors.border, marginRight: 8, borderRadius: 2 },
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
  vehicleTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  vTypeButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#f9f9f9' },
  vTypeButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  vTypeText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  vTypeTextActive: { color: '#fff' },
  nextButton: { backgroundColor: Colors.primary, borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 30 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' },
  backButton: { flex: 0.4, paddingVertical: 18, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  backButtonText: { color: Colors.textMuted, fontSize: 16, fontWeight: '600' },
  submitButton: { flex: 0.55, backgroundColor: Colors.success, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
