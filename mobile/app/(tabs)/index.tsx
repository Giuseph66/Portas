import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAlert } from '@/components/ui/AlertService';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

interface Door {
  id: string;
  name: string;
  status: 'open' | 'closed';
}

export default function DoorsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Theme[scheme];
  const [doors, setDoors] = useState<Door[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingDoorId, setLoadingDoorId] = useState<string | null>(null);
  const { show } = useAlert();

  useEffect(() => {
    fetchDoors();
  }, []);

  async function fetchDoors() {
    // Substitua a URL pelo endpoint real
    try {
      setRefreshing(true);
      const response = await fetch('https://esp-server.neurelix.com.br/api/list');
      console.log('response', response);
      if (response.ok) {
        const json = await response.json();
        console.log('raw', json);

        // A resposta é um array com outro array dentro
        if (Array.isArray(json) && Array.isArray(json[0])) {
          const innerArr = json[0];
          const id = innerArr[0];
          const details = innerArr[1];
          const espInfo = details?._espInfo;

          console.log('ID:', id);
          console.log('ESP Info:', espInfo);

          let doorsArr: any[] = [];
          if (Array.isArray(details?.doors)) {
            doorsArr = details.doors;
          } else if (details?._espInfo) {
            // cria porta única a partir do espInfo
            const info = details._espInfo;
            doorsArr = [
              {
                id: info.id,
                name: info.ssid ?? 'Porta Principal',
                status: 'closed',
              },
            ];
          }

          setDoors(
            doorsArr.map((d) => ({
              id: d.id ?? String(Math.random()),
              name: d.name ?? `Porta ${d.id}`,
              status: d.status ?? (d.estado ?? 'closed'),
            })) as Door[],
          );
        } else {
          show({ title: 'Erro', message: 'Formato de dados inesperado' });
        }
      } else {
        show({ title: 'Erro', message: 'Não foi possível carregar as portas' });
      }
    } catch (error) {
      console.error('error', error);
      show({ title: 'Erro', message: 'Não foi possível carregar as portas' });
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleDoor(door: Door, command: 'abrir' | 'fechar') {
    try {
      setLoadingDoorId(door.id);
      const data = `${door.id}:${command}`;
      console.log('data', data);
      const response = await fetch(`https://esp-server.neurelix.com.br/api/cmd`, {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        setDoors((prev) =>
          prev.map((d) => (d.id === door.id ? { ...d, status: command === 'abrir' ? 'open' : 'closed' } : d)),
        );
        show({ title: 'Sucesso', message: `Porta ${command === 'abrir' ? 'aberta' : 'fechada'} com sucesso` });
      } else {
        show({ title: 'Erro', message: 'Comando não executado' });
      }
    } catch (error) {
      console.error(error);
      show({ title: 'Erro', message: 'Comando não executado' });
    } finally {
      setLoadingDoorId(null);
    }
  }

  function renderItem({ item }: { item: Door }) {
    const isOpen = item.status === 'open';
    return (
      <View style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <IconSymbol name={isOpen ? 'lock.open' : 'lock'} size={28} color={theme.primary} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
          <Text style={{ color: isOpen ? theme.primary : theme.secondary, fontWeight: '600' }}>
            {isOpen ? 'ABERTA' : 'FECHADA'}
          </Text>
        </View>
        <PrimaryButton
          title={isOpen ? 'Fechar' : 'Abrir'}
          onPress={() => toggleDoor(item, isOpen ? 'fechar' : 'abrir')}
          disabled={false}
          loading={loadingDoorId === item.id}
          style={{ width: 90 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={[styles.title, { color: theme.primary }]}>Controle de Portas</Text>
      </TouchableOpacity>
      <FlatList
        data={doors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDoors} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: StatusBar.currentHeight,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
});
