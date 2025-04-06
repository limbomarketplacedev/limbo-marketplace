import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import PostItemScreen from '../screens/Post/PostItemScreen';
import LimboStoreScreen from '../screens/Store/LimboStoreScreen';
import ClearanceScreen from '../screens/Clearance/ClearanceScreen';
import InboxScreen from '../screens/Inbox/InboxScreen';
import HomeScreen from '../screens/Home/HomeScreen';


export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIconStyle: { marginBottom: -5 },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="message" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostItemScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.postButton}>
              <Entypo name="plus" size={28} color="#000" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={LimboStoreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clearance"
        component={ClearanceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-offer" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  postButton: {
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 50,
    marginBottom: 30,
  },
});
