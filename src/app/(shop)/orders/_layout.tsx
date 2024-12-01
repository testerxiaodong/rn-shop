import { Stack } from 'expo-router'
import { useOrderUpdateSubscription } from '../../../api/subscriptions'

export default function OrdersLayout() {
  // 订阅订单更新，收到订单状态更新之后使用tanstack-query重新查询订单列表
  useOrderUpdateSubscription()
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
