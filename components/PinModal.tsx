
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import LoadingButton from './LoadingButton';
import Icon from './Icon';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
  mode: 'create' | 'verify';
  onPinVerified?: (pin: string) => Promise<boolean>;
  onPinCreated?: (pin: string) => Promise<boolean>;
}

export default function PinModal({
  visible,
  onClose,
  onSuccess,
  title,
  description,
  mode,
  onPinVerified,
  onPinCreated
}: PinModalProps) {
  const { colors } = useStyles();
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  const handleSubmit = async () => {
    if (mode === 'create') {
      if (step === 'enter') {
        if (pin.length < 4) {
          Alert.alert(t('error'), t('pinMustBe4Digits'));
          return;
        }
        setStep('confirm');
        return;
      }
      
      if (pin !== confirmPin) {
        Alert.alert(t('error'), t('pinsDoNotMatch'));
        setConfirmPin('');
        return;
      }
      
      if (onPinCreated) {
        try {
          const success = await onPinCreated(pin);
          if (success) {
            onSuccess();
            resetModal();
          } else {
            Alert.alert(t('error'), t('cannotCreatePin'));
          }
        } catch (error) {
          Alert.alert(t('error'), t('errorCreatingPin'));
        }
      }
    } else {
      if (pin.length < 4) {
        Alert.alert(t('error'), t('pleaseEnterPin'));
        return;
      }
      
      if (onPinVerified) {
        try {
          const isValid = await onPinVerified(pin);
          if (isValid) {
            onSuccess();
            resetModal();
          } else {
            Alert.alert(t('error'), t('incorrectPin'));
            setPin('');
          }
        } catch (error) {
          Alert.alert(t('error'), t('errorVerifyingPin'));
          setPin('');
        }
      }
    }
  };

  const resetModal = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
    onClose();
  };

  const getCurrentTitle = () => {
    if (mode === 'create') {
      return step === 'enter' ? t('createPin') : t('confirmPin');
    }
    return title;
  };

  const getCurrentDescription = () => {
    if (mode === 'create') {
      return step === 'enter' 
        ? t('createSecurityPin')
        : t('confirmYourPin');
    }
    return description;
  };

  const getCurrentPlaceholder = () => {
    if (mode === 'create') {
      return step === 'enter' ? t('enterPin') : t('confirmPin');
    }
    return t('enterPin');
  };

  const getCurrentValue = () => {
    return step === 'confirm' ? confirmPin : pin;
  };

  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (step === 'confirm') {
      setConfirmPin(numericText);
    } else {
      setPin(numericText);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetModal}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Icon name="shield-checkmark" size={32} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              {getCurrentTitle()}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {getCurrentDescription()}
            </Text>
          </View>

          <View style={styles.content}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundAlt,
                  borderColor: colors.border,
                  color: colors.text,
                }
              ]}
              value={getCurrentValue()}
              onChangeText={handleChangeText}
              placeholder={getCurrentPlaceholder()}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />
          </View>

          <View style={styles.actions}>
            <LoadingButton
              title={t('cancel')}
              onPress={resetModal}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <LoadingButton
              title={mode === 'create' && step === 'enter' ? t('next') : t('confirm')}
              onPress={handleSubmit}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
