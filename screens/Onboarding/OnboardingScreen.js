import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { View, Text, Image } from 'react-native';
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';


export default function OnboardingScreen({ navigation }) {
  return (
    <Onboarding
      onDone={() => navigation.replace('Main')}
      onSkip={() => navigation.replace('Main')}
      pages={[
        {
          backgroundColor: '#000',
          image: <Image source={require('../../assets/slide1.png')} style={{ width: 200, height: 200 }} />,
          title: 'Welcome to Limbo',
          subtitle: 'The marketplace where prices fall over time.',
          titleStyles: { color: '#FFA500' },
          subTitleStyles: { color: '#fff' },
        },
        {
          backgroundColor: '#000',
          image: <Image source={require('../../assets/slide2.png')} style={{ width: 200, height: 200 }} />,
          title: 'Price Decay',
          subtitle: 'Items drop in price every hour — set your start and bottom price.',
          titleStyles: { color: '#FFA500' },
          subTitleStyles: { color: '#fff' },
        },
        {
          backgroundColor: '#000',
          image: <Image source={require('../../assets/slide3.png')} style={{ width: 200, height: 200 }} />,
          title: 'Get Featured',
          subtitle: 'Boost your visibility with ribbons, badges, and featured listings.',
          titleStyles: { color: '#FFA500' },
          subTitleStyles: { color: '#fff' },
        },
        {
          backgroundColor: '#000',
          image: <Image source={require('../../assets/slide4.png')} style={{ width: 200, height: 200 }} />,
          title: 'Earn Trust',
          subtitle: 'Good reviews earn badges and unlock seller tools.',
          titleStyles: { color: '#FFA500' },
          subTitleStyles: { color: '#fff' },
        },
      ]}
    />
  );
}
