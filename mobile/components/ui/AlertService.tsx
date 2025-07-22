import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Button {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title: string;
  message: string;
  buttons?: Button[];
}

interface AlertContextType {
  show: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const show = (opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <AlertContext.Provider value={{ show }}>
      {children}
      {options && (
        <CustomModal visible={visible} onRequestClose={hide} options={options} />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}

function CustomModal({
  visible,
  onRequestClose,
  options,
}: {
  visible: boolean;
  onRequestClose: () => void;
  options: AlertOptions;
}) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Theme[scheme];

  const defaultButtons: Button[] = [
    {
      text: 'OK',
      onPress: onRequestClose,
    },
  ];

  const buttons = options.buttons?.length ? options.buttons : defaultButtons;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.primary }]}>{options.title}</Text>
          <Text style={[styles.message, { color: theme.text }]}>{options.message}</Text>
          <View style={styles.buttonsRow}>
            {buttons.map((btn, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.8 },
                  btn.style === 'destructive' && { backgroundColor: '#FF3B30' },
                  btn.style === 'cancel' && { backgroundColor: theme.border },
                ]}
                onPress={() => {
                  onRequestClose();
                  btn.onPress?.();
                }}>
                <Text style={styles.buttonText}>{btn.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 