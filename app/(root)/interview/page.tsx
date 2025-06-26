import React from 'react'
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'

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

    return (
      <>
        <h3>Interview Generation</h3>
        <Agent 
          userName={user.name} 
          userId={user.id} 
          type="generate"
        />
      </>
    )
  } catch (error) {
    console.error('Error loading interview page:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
}

export default page