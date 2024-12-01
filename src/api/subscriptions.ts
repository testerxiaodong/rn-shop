import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { supabase } from '../lib/supabase'

export const useOrderUpdateSubscription = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const subscriptionResponse = supabase
      .channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'order' },
        (payload) => {
          // console.log('Change received!', payload)
          // 通过queryKey来刷新缓存
          queryClient.invalidateQueries({
            queryKey: ['orders'],
          })
        }
      )
      .subscribe()
    // 清除副作用，离开页面时取消订阅
    return () => {
      subscriptionResponse.unsubscribe()
    }
  }, [])
}
