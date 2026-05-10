import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, StyleSheet, Alert,
  ActivityIndicator, Dimensions, SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../../shared/api/client';
import { Colors } from '../../shared/constants/colors';

const { width } = Dimensions.get('window');

const CROP_CATEGORIES = [
  {
    title: 'Vegetables',
    crops: [
      { name: 'Tomato', emoji: '🍅', telugu: 'టమాటా' },
      { name: 'Onion', emoji: '🧅', telugu: 'ఉల్లిపాయ' },
      { name: 'Brinjal', emoji: '🍆', telugu: 'వంకాయ' },
      { name: 'Chilli', emoji: '🌶️', telugu: 'మిర్చి' },
      { name: 'Potato', emoji: '🥔', telugu: 'బంగాళదుంప' },
    ]
  },
  {
    title: 'Fruits',
    crops: [
      { name: 'Mango', emoji: '🥭', telugu: 'మామిడి' },
      { name: 'Banana', emoji: '🍌', telugu: 'అరటి' },
      { name: 'Lemon', emoji: '🍋', telugu: 'నిమ్మ' },
      { name: 'Papaya', emoji: '🍈', telugu: 'బొప్పాయి' },
    ]
  },
  {
    title: 'Grains & Others',
    crops: [
      { name: 'Rice', emoji: '🌾', telugu: 'వరి' },
      { name: 'Corn', emoji: '🌽', telugu: 'మొక్కజొన్న' },
      { name: 'Cotton', emoji: '☁️', telugu: 'పత్తి' },
      { name: 'Turmeric', emoji: '🟡', telugu: 'పసుపు' },
    ]
  }
];

export default function ListCropScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [marketPrice, setMarketPrice] = useState({ min: 20, max: 25 });

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: (data) => apiClient.post('/products', data),
    onSuccess: () => {
      Alert.alert('Success! ✅', 'Your crop is listed for sale!');
      navigation.goBack();
    },
    onError: (err) => {
      Alert.alert('Upload Failed', 'Could not create listing. Please try again.');
    }
  });

  const pickImage = async () => {

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'We need camera access to take photos of your crops.');
        return;
      }

      if (photos.length >= 5) {
        Alert.alert('Limit reached', 'You can upload up to 5 photos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

      
      if (!result.canceled) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (err) {
      console.error('Camera Error:', err);
      Alert.alert('Camera Error', 'Could not open camera. Please try again or use the gallery.');
    }
  };


  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const startVoiceRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      setIsRecording(true);
      // Simulate processing
      setTimeout(() => {
        setIsRecording(false);
        setQuantity('500');
        setPrice('18');
        Alert.alert('Voice Recognized', 'Set quantity to 500kg and price to ₹18/kg');
      }, 2000);
    } catch (e) {
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCrop || !quantity || !price) {
      Alert.alert('Required', 'Please select a crop and enter quantity/price');
      return;
    }

    try {
      setIsUploading(true);
      
      const b64Photos = await Promise.all(
        photos.map(async (uri) => {
          if (!uri) return null;
          try {
            // Use fetch + FileReader (works without expo-file-system)
            const response = await fetch(uri);
            const blob = await response.blob();
            
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (readErr) {
            console.error('Photo Process Error:', readErr);
            return null;
          }
        })
      );
      
      const filteredPhotos = b64Photos.filter(p => p !== null) as string[];
      
      if (photos.length > 0 && filteredPhotos.length === 0) {
        throw new Error('Could not process any of the selected photos');
      }

      createListing({
        crop_name: selectedCrop.name,
        quantity_kg: parseFloat(quantity),
        price_per_kg: parseFloat(price),
        crop_photos: filteredPhotos,
      });
    } catch (err: any) {
      console.error('Submit Error Details:', err);
      Alert.alert('Error', `Failed to process images: ${err.message || 'Please try again'}`);
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Crop Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Photo Gallery */}
        <Text style={styles.sectionTitle}>Add Photos (Up to 5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
          <TouchableOpacity style={styles.addPhotoBox} onPress={pickImage}>
            <Text style={{ fontSize: 32 }}>📸</Text>
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
          
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.photoItem} />
              <TouchableOpacity style={styles.removePhoto} onPress={() => removePhoto(index)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Voice Assistant */}
        <TouchableOpacity
          style={[styles.voiceCard, isRecording && styles.voiceCardRecording]}
          onPress={startVoiceRecording}
        >
          <View style={styles.voiceIconBg}>
            <Text style={{ fontSize: 20 }}>{isRecording ? '🛑' : '🎤'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.voiceTitle}>
              {isRecording ? 'Listening...' : 'List via Voice (Telugu/Hindi)'}
            </Text>
            <Text style={styles.voiceSubtitle}>"I have 500kg of tomatoes for ₹20 per kg"</Text>
          </View>
        </TouchableOpacity>

        {/* Crop Selection */}
        <Text style={styles.sectionTitle}>Select Crop</Text>
        {CROP_CATEGORIES.map((cat, i) => (
          <View key={i} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <View style={styles.cropGrid}>
              {cat.crops.map((crop) => (
                <TouchableOpacity
                  key={crop.name}
                  style={[
                    styles.cropChip, 
                    selectedCrop?.name === crop.name && styles.cropChipSelected
                  ]}
                  onPress={() => setSelectedCrop(crop)}
                >
                  <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                  <Text style={[
                    styles.cropName, 
                    selectedCrop?.name === crop.name && styles.cropNameSelected
                  ]}>
                    {crop.telugu}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Details Input */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 1000"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per kg (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={styles.marketInsight}>
            <Text style={styles.insightText}>
              💡 Market trend: Prices are rising for {selectedCrop?.name || 'crops'} today.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, (isPending || isUploading) && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={isPending || isUploading}
        >
          {isPending || isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Post Listing for Sale</Text>
          )}
        </TouchableOpacity>


        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 24, color: Colors.text, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 15, marginTop: 10 },
  photoList: { flexDirection: 'row', marginBottom: 20 },
  addPhotoBox: { 
    width: 100, 
    height: 100, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: Colors.primary, 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 12
  },
  addPhotoText: { fontSize: 12, color: Colors.primary, fontWeight: 'bold', marginTop: 4 },
  photoContainer: { width: 100, height: 100, marginRight: 12 },
  photoItem: { width: 100, height: 100, borderRadius: 15 },
  removePhoto: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: Colors.error, 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  removeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  voiceCard: { 
    backgroundColor: Colors.primary + '10', 
    borderRadius: 20, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.primary + '20'
  },
  voiceCardRecording: { borderColor: Colors.error, backgroundColor: Colors.error + '10' },
  voiceIconBg: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15 
  },
  voiceTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  voiceSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  categoryBlock: { marginBottom: 20 },
  categoryTitle: { fontSize: 14, color: Colors.textMuted, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cropChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  cropChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  cropEmoji: { fontSize: 20, marginRight: 6 },
  cropName: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  cropNameSelected: { color: '#fff' },
  inputCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroup: { width: '48%' },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, fontSize: 16, color: Colors.text, borderWidth: 1, borderColor: '#eee' },
  marketInsight: { backgroundColor: '#FFF9C4', padding: 12, borderRadius: 12, marginTop: 15 },
  insightText: { fontSize: 12, color: '#827717', fontWeight: '600' },
  submitBtn: { 
    backgroundColor: Colors.primary, 
    borderRadius: 20, 
    paddingVertical: 18, 
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

