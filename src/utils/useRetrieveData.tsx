import React, {useEffect,useState} from 'react'
import Papa from 'papaparse'

import { IBills, ILegislators, IVotes, IVoteResults } from './types';


export default function useRetrieveData(){

  const [bills,setBills] = useState<[IBills]>();
  const [legislators,setLegislators] = useState<[ILegislators]>();
  const [votes,setVotes] = useState<[IVotes]>();
  const [voteResults,setVoteResults] = useState<[IVoteResults]>();
  const [isLoading,setIsLoading] = useState<Boolean>(true)

  useEffect(() => {
    async function getData(target:RequestInfo) {
      const response = await fetch(target)
      const reader = response!.body!.getReader()
      const result = await reader.read() 
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) 
      const results = Papa.parse(csv, { header: true })
      return results
    }

    getData('./bills.csv').then((payload) => {
      setBills(payload.data as unknown as [IBills])    
    })  
    getData('./legislators.csv').then((payload) => {
      setLegislators(payload.data as unknown as [ILegislators] )    
    })
    getData('./vote_results.csv').then((payload) => {
      setVoteResults(payload.data as unknown as [IVoteResults])
    }) 
    getData('./votes.csv').then((payload) => {
      setVotes(payload.data as unknown as [IVotes])    
    })  
  }, [])

  useEffect(() => {
    if(bills && legislators && voteResults && votes){
      setIsLoading(false)
    }
  },[bills,legislators,voteResults, votes])

  return {bills,legislators,voteResults, votes,isLoading}
}