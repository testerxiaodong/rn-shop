import { Stack, useNavigation } from 'expo-router'
import { ToastProvider } from 'react-native-toast-notifications'
import AuthProvider from '../providers/auth-provider'
import QueryProvider from '../providers/query-provider'
import { StripeProvider } from '@stripe/stripe-react-native'
import NotificationProvider from '../providers/notification-provider'
import { useEffect } from 'react'
import * as Linking from 'expo-linking'

export default function RootLayout() {
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url
      // 解析 URL 并导航到相应的页面
      // console.log('Recived deep link: ', url)
    }

    const subscription = Linking.addEventListener('url', handleDeepLink)

    // 检查应用启动时是否有深度链接
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <ToastProvider>
      <AuthProvider>
        <QueryProvider>
          <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
          >
            <NotificationProvider>
              <Stack>
                <Stack.Screen
                  name="(shop)"
                  options={{ headerShown: false, title: 'Shop' }}
                />
                <Stack.Screen
                  name="categories"
                  options={{ headerShown: false, title: 'Categories' }}
                />
                <Stack.Screen
                  name="product"
                  options={{ headerShown: false, title: 'Product' }}
                />
                <Stack.Screen
                  name="cart"
                  options={{
                    presentation: 'modal',
                    title: 'Shopping Cart',
                    headerTitleAlign: 'center',
                  }}
                />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
              </Stack>
            </NotificationProvider>
          </StripeProvider>
        </QueryProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
