import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useStyles } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export default function Button({ text, onPress, style, textStyle }: ButtonProps) {
  const { colors } = useStyles();
  
  return (
    <TouchableOpacity 
      style={[
        {
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 8,
          marginTop: 10,
          width: '100%',
          elevation: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }, 
        style
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Text style={[
        {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
        }, 
        textStyle
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
