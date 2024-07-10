import { Skeleton } from '@/components'

export const BookListLoading = () => {
  return (
    <div className='grid grid-cols-4 gap-4'>
        <Skeleton className='w-[250px] h-[450px]' />
        <Skeleton className='w-[250px] h-[450px]' />
        <Skeleton className='w-[250px] h-[450px]' />
        <Skeleton className='w-[250px] h-[450px]' />
    </div>
  )
}

