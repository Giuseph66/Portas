import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAlert } from '@/components/ui/AlertService';

import Input from '@/components/ui/Input';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignUpScreen() {
  const router = useRouter();
  const { show } = useAlert();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = Theme[scheme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (password !== confirmPassword) {
      show({ title: 'Erro', message: 'As senhas não coincidem' });
      return;
    }

    try {
      setLoading(true);
      // Substitua a URL abaixo pelo endpoint real do backend
      const response = await fetch('https://example.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        show({ title: 'Sucesso', message: 'Conta criada com sucesso!' });
        router.replace('/(auth)/login');
      } else {
        show({ title: 'Erro', message: 'Não foi possível criar a conta' });
      }
    } catch (error) {
      console.error(error);
      show({ title: 'Erro', message: 'Não foi possível criar a conta' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image source={require('@/assets/icon/logo_porta.png')} style={[styles.logo , { tintColor: themeColors.primary }]} />
      <Text style={[styles.title, { color: themeColors.primary }]}>Criar Conta</Text>
      <Input placeholder="Nome" value={name} onChangeText={setName} />
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
      <Input
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <PrimaryButton title="Cadastrar" onPress={handleSignUp} loading={loading} />

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={[styles.link, { color: themeColors.secondary }]}>Já possui conta? Entrar</Text>
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