import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { useCartStore } from '../store/cart-store'
import { StatusBar } from 'expo-status-bar'
import { createOrder, createOrderItem } from '../api/api'
import { openStripeCheckout, setupStripePaymentSheet } from '../lib/stripe'
import { useState } from 'react'

type CartItemType = {
  id: number
  title: string
  heroImage: string
  price: number
  quantity: number
  maxQuantity: number
}

type CartItemProps = {
  item: CartItemType
  onRemove: (id: number) => void
  onIncrement: (id: number) => void
  onDecrement: (id: number) => void
}

const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemove,
}: CartItemProps) => {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.heroImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onDecrement(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrement(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Cart() {
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
    resetCart,
  } = useCartStore()

  const { mutateAsync: createSupabaseOrder } = createOrder()
  const { mutateAsync: createSupabaseOrderItem } = createOrderItem()
  const [isCheckout, setIsCheckout] = useState(false)
  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Ther are no items in your cart, Lets go shopping')
      return
    }
    setIsCheckout(true)
    const totalPrice = parseFloat(getTotalPrice())

    try {
      // 初始化 Stripe PaymentSheet
      await setupStripePaymentSheet(Math.floor(totalPrice * 100))

      // 获取用户的最终选择，如果取消或者发生异常，则直接返回
      const result = await openStripeCheckout()
      if (!result) {
        return
      }

      // 支付成功的处理
      await createSupabaseOrder(
        { totalPrice },
        {
          onSuccess: (data) => {
            // 创建订单项
            createSupabaseOrderItem(
              items.map((item) => ({
                orderId: data.id,
                productId: item.id,
                quantity: item.quantity,
              })),
              {
                onSuccess: () => {
                  alert(
                    'Payment complete successfully ,Order created successfully'
                  )
                  resetCart()
                },
              }
            )
          },
        }
      )
    } catch (error) {
      alert('An error occurred while creating the order')
    } finally {
      setIsCheckout(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={removeItem}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
          />
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText} testID="totalPrice">
          Total: ${getTotalPrice()}
        </Text>
        <TouchableOpacity
          disabled={isCheckout}
          onPress={handleCheckout}
          style={styles.checkoutButton}
          testID="checkoutButton"
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cartList: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
