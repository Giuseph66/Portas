import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAlert } from '@/components/ui/AlertService';

import Input from '@/components/ui/Input';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LoginScreen() {
  const router = useRouter();
  const { show } = useAlert();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = Theme[scheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      // Substitua a URL abaixo pelo endpoint real do backend
      router.replace('/(tabs)'); // navega após sucesso
      const response = await fetch('https://example.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        router.replace('/(tabs)'); // navega após sucesso
    } else {
        show({ title: 'Erro', message: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error(error);
      show({ title: 'Erro', message: 'Não foi possível realizar o login' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image source={require('@/assets/icon/logo_porta.png')} style={[styles.logo , { tintColor: themeColors.primary }]} />
      <Text style={[styles.title, { color: themeColors.primary }]}>Controle de Portas</Text>
      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <PrimaryButton title="Entrar" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={[styles.link, { color: themeColors.secondary }]}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={[styles.link, { color: themeColors.secondary }]}>Criar nova conta</Text>
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
    // cor dinâmica
    textAlign: 'center',
    marginTop: 12,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'contain',
  },
}); 