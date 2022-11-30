import React, {useEffect,useState} from 'react'
import Papa from 'papaparse'

interface IBills {
  id: Number,
  title: String,
  sponsor_id: Number
}
interface ILegislators {
  id: Number,
  name: String,
}
interface IVotes {
  id: Number,
  bill_id: Number
}
interface IVoteResults {
  id: Number,
  legislator_id: Number,
  vote_id: Number,
  vote_type: Number
}

const FAVOR = 1;
const OPPOSITION = 2;

export default function App() {

  const [bills,setBills] = useState<[IBills]>();
  const [legislators,setLegislators] = useState<ILegislators>();
  const [votes,setVotes] = useState<IVotes>();
  const [voteResults,setVoteResults] = useState<[IVoteResults]>();
  const [isLoading,setIsLoading] = useState<Boolean>(true)

  useEffect(() => {
    async function getData(target:String) {
      const response = await fetch(target)
      const reader = response.body.getReader()
      const result = await reader.read() 
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) 
      const results = Papa.parse(csv, { header: true })
      return results
    }

    getData('./bills.csv').then((payload) => {
      setBills(payload.data)    
    })  
    getData('./legislators.csv').then((payload) => {
      setLegislators(payload.data)    
    })
    getData('./vote_results.csv').then((payload) => {
      setVoteResults(payload.data)
    }) 
    getData('./votes.csv').then((payload) => {
      setVotes(payload.data)    
    })  
  }, [])

  useEffect(() => {
    if(bills && legislators && voteResults && votes){
      setIsLoading(false)
    }
  },[bills,legislators,voteResults, votes])


  //This should be useMemo
  const getBillVotes = (billId) => {

    let voteId = votes
      .find((item) => {
        return item.bill_id === billId
        })?.id

    let votesInFavor = voteResults
      .filter((vote) => {
        return vote.vote_id === voteId
      })
      .filter((vote) => {
        return vote.vote_type == FAVOR
      })

    let votesInOpposition = voteResults
      .filter((vote) => {
        return vote.vote_id === voteId
      })
      .filter((vote) => {
        return vote.vote_type == OPPOSITION
      })

    return `${votesInFavor.length} / ${ votesInOpposition.length}`   
  }


  const getPrimarySponsor = (primarySponsorId) =>{
    let sponsor = legislators.find((item) => {
        return item.id === primarySponsorId
    })

    if(sponsor) {
      return sponsor?.name  
    }
    else {
      return <b> {primarySponsorId} </b> 
    }
  }

  const getLegislatorVotes = (legislatorId) => {
    const inFavor = voteResults
      .filter(  (item) => {
        return item.legislator_id == legislatorId
      })
      .filter( (item) => {
          return item.vote_type == FAVOR
      })

    const inOpposition = voteResults
      .filter(  (item) => {
        return item.legislator_id == legislatorId
      })
      .filter( (item) => {
          return item.vote_type == OPPOSITION
      })


    console.log('medium', 
    voteResults
      .filter((item)=>{return item.vote_type==2}).length)


    return `${inFavor.length} / ${inOpposition.length}`

  }


  return (
    <div className="app">
      {isLoading? 
        <>
          Carregando
        </>
        :
        <>
          <h3>Bills</h3> 
          {bills.map((item) => {
            return(
              <ul key={item.id}>
                <li >  title: {item.title}  </li>

                <li> 
                  Primary Sponsor:
                  {getPrimarySponsor(item.sponsor_id)}
                </li>

                <li> 
                  Supported / Opposed by: {getBillVotes(item.id) } 
                </li>
              </ul>
            )
            })
          }

          <br/>

          
          <h3>Legislators</h3>

          {legislators.map((item) => {
            return(
              <ul key={item.id}>
               <li > name: {item.name} </li>
               <li > Supported / Opposed: 
                 {getLegislatorVotes(item.id)} 
               </li>
              </ul>
            )
            })
          } 


          <h3>Votes</h3>
          {votes.map((item) => {
            return(
              <ul key={item.id}>
               <li > id: {item.id} </li>
               <li> Bill id: {item.bill_id}  </li>
              </ul>
            )
            })
          }

          <br/>

          <h3>Vote Results</h3>
          {voteResults.map((item) => {
            return(
              <ul key={item.id}>
               <li > id: {item.id} </li>
               <li> Legislator id: {item.legislator_id}  </li>
               <li> Vote id: {item.vote_id}  </li>
               <li> Vote type: {item.vote_type}  </li>
              </ul>
            )
            })
          }

          <br/>





        </>
    
      }
    </div>
  )
}
