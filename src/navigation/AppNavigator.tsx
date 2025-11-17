import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DiaryEntry } from '../types';

import HomeScreen from '../screens/HomeScreen';
import EntryEditorScreen from '../screens/EntryEditorScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  EntryEditor: { entry?: DiaryEntry };
  EntryDetail: { entry: DiaryEntry };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EntryEditor" component={EntryEditorScreen} />
        <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
