import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import ListingDetailScreen from '../screens/Listing/ListingDetailScreen';
import SellerProfileScreen from '../screens/Profile/SellerProfileScreen';
import SubmitReviewScreen from '../screens/Reviews/SubmitReviewScreen';
import SubmitBuyerReviewScreen from '../screens/Reviews/SubmitBuyerReviewScreen';
import BuyerProfileScreen from '../screens/Profile/BuyerProfileScreen';
import SubscriptionStatusScreen from '../screens/Profile/SubscriptionStatusScreen';
import LimboStoreScreen from '../screens/Store/LimboStoreScreen';
import FavoritesScreen from '../screens/Profile/FavoritesScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import SuccessScreen from '../screens/Post/SuccessScreen';
import InboxScreen from '../screens/Inbox/InboxScreen';
import ChatScreen from '../screens/Inbox/ChatScreen';
import AdminReportsScreen from '../screens/Admin/AdminReportsScreen';
import UploadBannerScreen from '../screens/Admin/UploadBannerScreen';
import SupportScreen from '../screens/Support/SupportScreen';
import SupportInboxScreen from '../screens/Admin/SupportInboxScreen';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
      <Stack.Screen name="SubmitReview" component={SubmitReviewScreen} />
      <Stack.Screen name="SubmitBuyerReview" component={SubmitBuyerReviewScreen} />
      <Stack.Screen name="BuyerProfile" component={BuyerProfileScreen} />
      <Stack.Screen name="SubscriptionStatus" component={SubscriptionStatusScreen} />
      <Stack.Screen name="LimboStore" component={LimboStoreScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
      <Stack.Screen name="UploadBanner" component={UploadBannerScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="SupportInbox" component={SupportInboxScreen} />

    </Stack.Navigator>
  );
}
