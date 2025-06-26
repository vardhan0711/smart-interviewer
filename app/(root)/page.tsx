import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'

const page = async () => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Please sign in to continue</p>
        </div>
      );
    }

    const [userInterviews, latestInterviews] = await Promise.all([
      getInterviewsByUserId(user.id),
      getLatestInterviews({ userId: user.id })
    ]);

    const hasPastInterviews = userInterviews && userInterviews.length > 0;
    const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0;

    return (
      <>
        <section className='card-cta'>
          <div className='flex flex-col gap-6 max-w-lg'> 
            <h2>Get Interview Ready using AI</h2>
            <p className='text-lg'>Practice using real interview questions and get instant feedback</p>
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>

          <Image 
            src="/robot.png" 
            alt="robo-dude" 
            width={380} 
            height={400} 
            className="max-sm:hidden"
          />
        </section>

        <section className='flex flex-col gap-6 mt-8'>
          <h2>Your Interviews</h2>
          <div className='interviews-section'>
            {hasPastInterviews ? (
              userInterviews.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>You haven't taken any interviews yet</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Take Interviews</h2>
          <div className="interviews-section">
            {hasUpcomingInterviews ? (
              latestInterviews.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no interviews available</p>
            )}
          </div>
        </section>
      </>
    )
  } catch (error) {
    console.error('Error loading page:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
}

export default page