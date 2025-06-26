'use client';
import React, { useEffect } from 'react'
import Image from 'next/image'
import clsx from 'clsx';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { vapi} from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';

enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
}

interface SavedMessages{
    role:'user'|'system'|'assistant';
    content:string;
}

const Agent = ({userName,userId,type,interviewId,questions}:AgentProps) => {
    const router=useRouter();
    const [isSpeaking,setIsSpeaking]=useState(false);
    const [callStatus,setCallStatus]=useState<CallStatus>(CallStatus.INACTIVE);
    const [messages,setMessages]=useState<SavedMessages[]>([]);

    useEffect(()=>{
        const onCallStart=()=>setCallStatus(CallStatus.ACTIVE);
        const onCallEnd=()=>setCallStatus(CallStatus.FINISHED);
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };
        
        const onSpeechStart=()=>setIsSpeaking(true);
        const onSpeechEnd=()=>setIsSpeaking(false);
        const onError=(error:Error)=>console.log('Error',error);

        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallEnd);
        vapi.on('message',onMessage);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);
        vapi.on('error',onError);

        return ()=>{
            vapi.off('call-start',onCallStart);
            vapi.off('call-end',onCallEnd);
            vapi.off('message',onMessage);
            vapi.off('speech-start',onSpeechStart);
            vapi.off('speech-end',onSpeechEnd);
            vapi.off('error',onError);
        }
    },[])

    const handleGenerateFeedback=async(messages:SavedMessages[])=>{
        console.log('Generate feedback here.');
        const {success,id}={
            success:true,
            id:'feedback-id'
        }
        if(success && id){
            router.push(`/interview/${interviewId}/feedback`);
        }else{
            console.log('error saving feedback');
            router.push('/');
        }
    }
    
    useEffect(()=>{
        if(callStatus===CallStatus.FINISHED){
            if(type==='generate'){
                router.push('/');
            }else{
                handleGenerateFeedback(messages);
            }
        }
    },[messages,callStatus,type,userId,router,interviewId]);

    const handleCall=async()=>{
        try {
            setCallStatus(CallStatus.CONNECTING);

            if(type==='generate'){
                const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
                if (!workflowId) {
                    console.error('VAPI Workflow ID not configured');
                    setCallStatus(CallStatus.INACTIVE);
                    return;
                }
                
                await vapi.start(workflowId, {
                    variableValues:{
                        username:userName,
                        userid:userId,
                    }
                })
            }else{
                let formattedQuestions='';
                if(questions){
                    formattedQuestions=questions
                    .map((question)=>`- ${question}`)
                    .join('\n');
                }

                await vapi.start(interviewer,{
                    variableValues:{
                        questions:formattedQuestions
                    }
                })
            }
        } catch (error) {
            console.error('Error starting call:', error);
            setCallStatus(CallStatus.INACTIVE);
        }
    }

    const handleDisconnect=async()=>{
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const latestMessage=messages[messages.length-1]?.content;
    const isCallInactiveOrFinished=callStatus===CallStatus.INACTIVE||callStatus===CallStatus.FINISHED;

    return (  
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image  
                            src="/ai-avatar.png" 
                            alt="vapi" 
                            width={65} 
                            height={54} 
                            className='object-cover' 
                        />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI interviewer</h3>
                </div>

                <div className='card-border'>
                    <div className='card-content'>
                        <Image 
                            src="/user-avatar.png" 
                            alt="user avatar" 
                            width={120} 
                            height={120} 
                            className='rounded-full object-cover size-[120px]'
                        />
                        <h3>{userName || 'User'}</h3>
                    </div>
                </div>
            </div>
            
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p 
                            key={latestMessage}
                            className={clsx(
                                'transition-opacity duration-500 opacity-0',
                                'animate-fadeIn opacity-100'
                            )}
                        >
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            
            <div className='w-full flex justify-center'>
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call' onClick={handleCall}>
                        <span className={clsx(
                            'absolute animate-ping rounded-full opacity-75',
                            callStatus !== 'CONNECTING' && 'hidden'
                        )}/>
                        <span>
                            {isCallInactiveOrFinished ? 'Call' : 'Connecting...'}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent