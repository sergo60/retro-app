import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../app/ui/PrimaryButton';
import SecondaryButton from '../app/ui/SecondaryButton';
import SizedBox from '../app/ui/SizedBox';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        Prenez un moment pour réfléchir, partager et progresser. Connectez-vous pour créer votre
        rétrospective agile et faites le point avec votre équipe :{'\n'}
        {'\n'}✅ Ce qui a bien fonctionné{'\n'}❌ Ce qui peut être amélioré{'\n'}
        💡 Ce qu’on pourrait essayer pour la suite{'\n'}
        {'\n'}
        Construisez une meilleure collaboration, une rétro à la fois.{'\n'}
        🔐 Connectez-vous pour commencer !
      </Text>
      <SizedBox height={34} />
      <PrimaryButton onPress={() => navigation.navigate('Login')} title="Connexion" />
      <SecondaryButton onPress={() => navigation.navigate('Account')} title="Créer un compte" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 40,
    color: '#1A237E',
  },

  text: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});
