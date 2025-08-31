import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { usePin } from '../hooks/usePin';
import PinModal from './PinModal';
import LoadingButton from './LoadingButton';
import Icon from './Icon';

interface PinSetupScreenProps {
  onComplete: () => void;
}

export default function PinSetupScreen({ onComplete }: PinSetupScreenProps) {
  const { colors, commonStyles } = useStyles();
  const { t } = useTranslation();
  const { setPin } = usePin();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleCreatePin = async (pin: string) => {
    const success = await setPin(pin);
    if (success) {
      Alert.alert('Succès', 'PIN créé avec succès', [
        { text: 'Continuer', onPress: onComplete }
      ]);
      return true;
    }
    return false;
  };

  return (
    <View style={[commonStyles.container, commonStyles.center, { backgroundColor: colors.background }]}>
      <View style={{ alignItems: 'center', paddingHorizontal: 40 }}>
        <Icon name="shield-checkmark" size={80} color={colors.primary} />
        
        <Text style={[commonStyles.title, { color: colors.text, textAlign: 'center', marginTop: 24 }]}>
          {t('secureYourApp')}
        </Text>
        
        <Text style={[commonStyles.text, { color: colors.textSecondary, textAlign: 'center', marginTop: 16, lineHeight: 24 }]}>
          {t('pinSetupDescription')}
        </Text>
        
        <LoadingButton
          title={t('createPin')}
          onPress={() => setShowPinModal(true)}
          style={{ marginTop: 32, minWidth: 200 }}
          icon="lock-closed"
        />
      </View>

      <PinModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => setShowPinModal(false)}
        title={t('createYourPin')}
        description={t('choosePinDescription')}
        mode="create"
        onPinCreated={handleCreatePin}
      />
    </View>
  );
}