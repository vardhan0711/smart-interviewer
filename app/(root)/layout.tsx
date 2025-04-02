import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/actions/auth.action';

const RootLayout = async ({children}:{children:ReactNode}) => {
  const isUserAuthenticated=await isAuthenticated();
  if(isUserAuthenticated) redirect('/sign-in');

  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex itmes center gap-2'>
        <Image src="/logo.svg" alt="logo" width={38} height={42}/>
        <h2 className='text-primary-100'>
          PrepView
        </h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout