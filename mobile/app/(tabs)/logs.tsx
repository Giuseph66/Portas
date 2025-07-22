import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, StatusBar } from 'react-native';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LogItem {
  id: string;
  user: string;
  door: string;
  action: 'open' | 'close';
  datetime: string; // ISO
}

export default function LogsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Theme[scheme];
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const response = await fetch('http://20.20.20.104:4000/api/logs');
      if (response.ok) {
        const data: LogItem[] = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filtered = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.door.toLowerCase().includes(search.toLowerCase()),
  );

  function renderItem({ item }: { item: LogItem }) {
    const dateStr = new Date(item.datetime).toLocaleString();
    return (
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.date, { color: theme.text }]}>{dateStr}</Text>
        <Text style={[styles.user, { color: theme.text }]}>{item.user}</Text>
        <Text style={[styles.door, { color: theme.text }]}>{item.door}</Text>
        <Text style={{ color: item.action === 'open' ? theme.primary : theme.secondary, fontWeight: '600' }}>
          {item.action === 'open' ? 'Abriu' : 'Fechou'} a porta
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Histórico de Acessos</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por usuário ou porta"
        placeholderTextColor={scheme === 'light' ? '#6C6C6C' : '#8A8A8A'}
        style={[styles.search, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
      />
      <FlatList data={filtered} keyExtractor={(item) => item.id} renderItem={renderItem} />
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
    marginBottom: 16,
    marginTop: StatusBar.currentHeight,
    textAlign: 'center',
  },
  search: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 4,
  },
  date: {
    fontSize: 12,
  },
  user: {
    fontWeight: '600',
  },
  door: {
    fontStyle: 'italic',
  },
}); 