/**
 * App Navigator
 * Sets up React Navigation stack navigator
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EpHCalculatorScreen from '../screens/EpHCalculatorScreen';
import TrackCalculatorScreen from '../screens/TrackCalculatorScreen';
import { useTranslation } from 'react-i18next';

export type RootStackParamList = {
  EpHCalculator: undefined;
  TrackCalculator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="EpHCalculator"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="EpHCalculator"
        component={EpHCalculatorScreen}
        options={{
          title: t('common.ephCalculator'),
          headerShown: false, // We have custom header in screens
        }}
      />
      <Stack.Screen
        name="TrackCalculator"
        component={TrackCalculatorScreen}
        options={{
          title: t('common.trackCalculator'),
          headerShown: false, // We have custom header in screens
        }}
      />
    </Stack.Navigator>
  );
}

