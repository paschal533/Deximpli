'use client'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const useSideBar = () => {
  const [expand, setExpand] = useState<boolean | undefined>(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [realtime, setRealtime] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)


  const page = pathname.split('/').pop()

  const onExpand = () => setExpand((prev) => !prev)

  return {
    expand,
    onExpand,
    page,
    realtime,
    loading,
  }
}

export default useSideBar
