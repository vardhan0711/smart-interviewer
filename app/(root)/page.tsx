import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import {  getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
const page = async () => {
  const user=await getCurrentUser();
  const []=await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({userId:user?.id!})
  ])

  const userInterviews=await getInterviewsByUserId(user?.id!);
  const latestInterviews=await getLatestInterviews({userId:user?.id!})

  const hasPastInterviews=userInterviews?.length>0;
  const hasUpcomingInterviews=latestInterviews?.length>0;


  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-2-lg'> 
          <h2>Get Interview Ready using AI</h2>
          <p className='text-lg'>Practise using real interview questions and get instant feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview"> start an Interview </Link>
             </Button>
        </div>

        <Image src="/robot.png" alt="robo-dude" width={380} height={400} className="max-sm:hidden"/>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
            {
            hasPastInterviews?(
              userInterviews?.map((interview)=>(
                <InterviewCard{...interview} key={interview.id}/>
              ))) :(<p>you haven't taken any interviews yet</p>) }
        </div>

      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard{...interview} key={interview.id}/>
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page