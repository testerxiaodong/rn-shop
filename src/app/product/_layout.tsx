import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[slug]"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              testID="backButton"
            >
              <Ionicons name="arrow-back" size={24} color={'black'} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  )
}
