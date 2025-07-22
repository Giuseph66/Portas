import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAlert } from '@/components/ui/AlertService';

import Input from '@/components/ui/Input';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { show } = useAlert();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = Theme[scheme];
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRecover() {
    try {
      setLoading(true);
      // Substitua a URL abaixo pelo endpoint real do backend
      const response = await fetch('https://example.com/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        show({ title: 'Sucesso', message: 'Enviamos um link de recuperação para o seu e-mail' });
        router.replace('/(auth)/login');
      } else {
        show({ title: 'Erro', message: 'Não foi possível enviar o e-mail de recuperação' });
      }
    } catch (error) {
      console.error(error);
      show({ title: 'Erro', message: 'Não foi possível enviar o e-mail de recuperação' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image source={require('@/assets/icon/logo_porta.png')} style={[styles.logo , { tintColor: themeColors.primary }]} />
      <Text style={[styles.title, { color: themeColors.primary }]}>Recuperar Senha</Text>
      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <PrimaryButton title="Enviar link de recuperação" onPress={handleRecover} loading={loading} />
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={[styles.link, { color: themeColors.secondary }]}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    // cor dinâmica
    marginBottom: 32,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#007AFF',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'contain',
  },
}); 