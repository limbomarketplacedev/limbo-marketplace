import React from 'react';
import BuyerProfileScreen from './BuyerProfileScreen';
import SellerProfileScreen from './SellerProfileScreen';

const ProfileScreen = ({ route }) => {
  // Replace this with real logic to detect user role
  const userType = route?.params?.userType || 'buyer';

  return userType === 'seller' ? <SellerProfileScreen /> : <BuyerProfileScreen />;
};

export default ProfileScreen;
