import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, SafeAreaView, StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../constants/colors';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const mode = route.params?.mode || 'signin';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer' | 'driver'>(route.params?.role || 'farmer');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const [loading, setLoading] = useState(false);

  const { sendOTP, verifyOTP } = useAuthStore();

  const handleSendOTP = async () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await sendOTP(email);
      setStep('otp');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOTP(email, otp, role);
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP or Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButtonTop}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🌾</Text>
            <Text style={styles.title}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'signup'
                ? 'Join the SetuFarm community today'
                : 'Sign in to continue to SetuFarm'}
            </Text>
          </View>

          <View style={styles.card}>
            {step === 'email' ? (
              <>
                <Text style={styles.label}>I am a...</Text>
                <View style={styles.roleContainer}>
                  {(['farmer', 'buyer', 'driver'] as const).map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleButton, role === r && styles.roleButtonActive]}
                      onPress={() => setRole(r)}
                    >
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter OTP sent to {email}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                  autoFocus
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & {mode === 'signup' ? 'Sign Up' : 'Login'}</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('email')} style={styles.changeEmailButton}>
                  <Text style={styles.changeEmailText}>Change Email Address</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardView: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButtonTop: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backIcon: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 50, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12 
  },
  label: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 12, marginTop: 12 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleButton: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: Colors.border, 
    marginHorizontal: 4 
  },
  roleButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  roleTextActive: { color: '#fff' },
  input: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  button: { 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    padding: 18, 
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  changeEmailButton: { marginTop: 20, alignItems: 'center' },
  changeEmailText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});

