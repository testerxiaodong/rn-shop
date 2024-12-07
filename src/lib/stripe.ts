// 1 setup payment sheet
// 2 Open stripe checkout form

import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native'
import { supabase } from './supabase'
import { CollectionMode } from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet'

/**
 * 调用supabase边缘函数stripe-checkout，获取paymentIntent publicKey ephemeralKey customer
 * @param totalAmount 订单总金额
 * @returns
 */
const fetchStripekeys = async (totalAmount: number) => {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      totalAmount,
    },
  })

  if (error) throw new Error(error.message)

  return data
}

/**
 * 初始化PaymentSheet
 * @param totalAmount 订单总金额
 */
export const setupStripePaymentSheet = async (totalAmount: number) => {
  const { paymentIntent, publicKey, ephemeralKey, customer } =
    await fetchStripekeys(totalAmount)

  if (!paymentIntent || !publicKey) {
    throw new Error('Failed to fetch Stripe keys')
  }

  const returnURL = 'rn-shop://cart'

  await initPaymentSheet({
    merchantDisplayName: 'Codewithlari',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    billingDetailsCollectionConfiguration: {
      name: 'always' as CollectionMode,
      phone: 'always' as CollectionMode,
    },
    returnURL,
  })
}

/**
 * 获取用户最终的支付选择：支付或取消(发生异常时，弹出提示信息)
 * @returns 用户是否选择了支付
 */
export const openStripeCheckout = async () => {
  try {
    // 接收用户最终的选择
    // 可能的选择：1.支付 2.取消
    const { error } = await presentPaymentSheet()
    // 如果用户选择了支付，则返回true，否则返回false，用户选择取消时，不做任何处理
    if (error && error.code === 'Canceled') {
      return false
    }
    return true
  } catch {
    // 捕获异常，弹出提示信息
    alert('Something went wrong, please try again later.')
    return false
  }
}
