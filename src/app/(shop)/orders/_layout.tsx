import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useOrderUpdateSubscription } from '../../../api/subscriptions'

export default function OrdersLayout() {
  // 订阅订单更新，收到订单状态更新之后使用tanstack-query重新查询订单列表
  useOrderUpdateSubscription()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'All the Orders',
          headerTitleAlign: 'center',
        }}
      />
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
