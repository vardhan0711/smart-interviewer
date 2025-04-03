import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'; // or import cn from 'classnames'

enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
}
const Agent = ({userName}:AgentProps) => {
  const callStatus=CallStatus.FINISHED;
  const isSpeaking=true;  
  const messages=[
    'what is your name',
    'my name is yolo,nice to meet you',
  ]
  const lastMessage=messages[messages.length-1];

  return (  
  <>
  <div className='call-view'>
        <div className='card-interviewer'>
            <div className='avatar'>
                <Image  src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover' />
                {isSpeaking && <span className='animate-speak'/>}
            </div>
            <h3>AI interviewer</h3>

        </div>

        <div className='card-border'>
            <div className='card-content'>
                <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className='rounded-full object-cover size-[120px]'/>
                <h3>{userName}</h3>
            </div>
        </div>
    </div>
    {messages.length>0&&(
        <div className='transcript-border'>
            <div className='transcript'>
                <p key={lastMessage}className={clsx('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
                    {lastMessage}
                </p>
            </div>
        </div>
    )}
    <div className='w-full flex justify-center'>
        {callStatus!== 'ACTIVE'?(
            <button className='relative btn-call'>
                <span className={clsx('absolute animate-ping rounded-full opacity-75',callStatus!=='CONNECTING'&'hidden')}/>
                    
                <span>
                {callStatus==='INACTIVE'||callStatus==='FINISHED'?'Call':'....'}
                </span>
            </button>
        ):(
            <button className='btn-disconnect'>
                End
            </button>
        )}
    </div>
  </>
  
    
  )
}

export default Agent