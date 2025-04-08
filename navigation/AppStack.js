import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabs from './MainTabs';
import ListingDetailScreen from '../screens/Listing/ListingDetailScreen';
import ChatScreen from '../screens/Inbox/ChatScreen';
import SupportScreen from '../screens/Support/SupportScreen';
import SubmitReviewScreen from '../screens/Review/SubmitReviewScreen';
import SubmitBuyerReviewScreen from '../screens/Review/SubmitBuyerReviewScreen';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
      />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
      />
      <Stack.Screen
        name="SubmitReview"
        component={SubmitReviewScreen}
      />
      <Stack.Screen
        name="SubmitBuyerReview"
        component={SubmitBuyerReviewScreen}
      />
    </Stack.Navigator>
  );
}
