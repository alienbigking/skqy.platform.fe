import { useMount } from 'ahooks'
import { getUrlParams } from '@/utils'

const useCurrentUrlParams = () => {
  useMount(() => {
    getCurrentUrlParams()
  })

  const getCurrentUrlParams = () => {
    const params = getUrlParams()
  }
}

export { useCurrentUrlParams }
