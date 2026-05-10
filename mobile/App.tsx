import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './shared/store/authStore';

// Screens
import LandingScreen from './shared/screens/LandingScreen';
import RoleSelectionScreen from './shared/screens/RoleSelectionScreen';
import LoginScreen from './shared/screens/LoginScreen';
import ProfileScreen from './shared/screens/ProfileScreen';


import FarmerHomeScreen from './apps/farmer/FarmerHomeScreen';
import MySalesScreen from './apps/farmer/MySalesScreen';
import MyCropsScreen from './apps/farmer/MyCropsScreen';
import CropDetailsScreen from './apps/farmer/CropDetailsScreen';


import FarmerRegistrationScreen from './apps/farmer/FarmerRegistrationScreen';
import BuyerRegistrationScreen from './apps/buyer/BuyerRegistrationScreen';
import DriverRegistrationScreen from './apps/driver/DriverRegistrationScreen';
import BuyerHomeScreen from './apps/buyer/BuyerHomeScreen';
import BuyerCropDetailsScreen from './apps/buyer/BuyerCropDetailsScreen';

import ListCropScreen from './apps/farmer/ListCropScreen';
import DeliveryOptionsScreen from './apps/buyer/DeliveryOptionsScreen';
import PaymentScreen from './apps/buyer/PaymentScreen';
import OrderSuccessScreen from './apps/buyer/OrderSuccessScreen';
import BuyerOrdersScreen from './apps/buyer/BuyerOrdersScreen';
import BuyerOrderTrackingScreen from './apps/buyer/BuyerOrderTrackingScreen';
import AddressScreen from './apps/buyer/AddressScreen';

import FarmerOrderDetailsScreen from './apps/farmer/FarmerOrderDetailsScreen';
import DriverSelectionScreen from './apps/farmer/DriverSelectionScreen';
import DriverHomeScreen from './apps/driver/DriverHomeScreen';
import DriverOrderDetailsScreen from './apps/driver/DriverOrderDetailsScreen';

// Create a client




const queryClient = new QueryClient();

const Stack = createStackNavigator();

export default function App() {
  const { token, user, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!token ? (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          ) : (
            <>
              {user?.role === 'farmer' && !user?.name ? (
                <Stack.Screen name="FarmerRegistration" component={FarmerRegistrationScreen} />
              ) : null}

              {user?.role === 'buyer' && !user?.name ? (
                <Stack.Screen name="BuyerRegistration" component={BuyerRegistrationScreen} />
              ) : null}

              {user?.role === 'driver' && !user?.name ? (
                <Stack.Screen name="DriverRegistration" component={DriverRegistrationScreen} />
              ) : null}

              {/* Default Home Screens based on Role */}
              {user?.role === 'farmer' && user?.name ? (
                <Stack.Screen name="FarmerHome" component={FarmerHomeScreen} />
              ) : null}

              {user?.role === 'buyer' && user?.name ? (
                <Stack.Screen name="BuyerHome" component={BuyerHomeScreen} />
              ) : null}

              {user?.role === 'driver' && user?.name ? (
                <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
              ) : null}

              {/* Other Shared/Role-Specific Screens */}
              <Stack.Screen name="Profile" component={ProfileScreen} />

              <Stack.Screen name="MySales" component={MySalesScreen} />
              <Stack.Screen name="MyCrops" component={MyCropsScreen} />
              <Stack.Screen name="CropDetails" component={CropDetailsScreen} />
              <Stack.Screen name="BuyerCropDetails" component={BuyerCropDetailsScreen} />
              <Stack.Screen name="OrderDetails" component={FarmerOrderDetailsScreen} />

              <Stack.Screen name="ListCrop" component={ListCropScreen} />
              <Stack.Screen name="DeliveryOptions" component={DeliveryOptionsScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
              <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
              <Stack.Screen name="BuyerOrders" component={BuyerOrdersScreen} />
              <Stack.Screen name="BuyerOrderTracking" component={BuyerOrderTrackingScreen} />
              <Stack.Screen name="Addresses" component={AddressScreen} />
              <Stack.Screen name="DriverSelection" component={DriverSelectionScreen} />
              <Stack.Screen name="DriverOrderDetails" component={DriverOrderDetailsScreen} />
            </>
          )}


        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

