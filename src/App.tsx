import useRetrieveData from './utils/useRetrieveData';

const FAVOR = 1;
const OPPOSITION = 2;

export default function App() {

  const { 
    bills,legislators, voteResults, votes,
    isLoading
  } = useRetrieveData()

  const getBillVotes = (billId: Number) => {

    const voteId = votes!
      .find((item) => {
        return item.bill_id === billId
        })?.id

    const votesInBill = voteResults!
    .filter((vote) => {
      return vote.vote_id === voteId
    })

    let votesInFavor = votesInBill
      .filter((vote) => {
        return vote.vote_type == FAVOR
      })

    let votesInOpposition = votesInBill
      .filter((vote) => {
        return vote.vote_type == OPPOSITION
      })

    return `${votesInFavor.length} / ${ votesInOpposition.length}`   
  }

  const getPrimarySponsor = (primarySponsorId: Number) =>{
    let sponsor = legislators!
      .find((item) => {
        return item.id === primarySponsorId
    })

    if(sponsor) {
      return sponsor.name  
    }
    else {
      return primarySponsorId 
    }
  }

  const getLegislatorVotes = (legislatorId:Number) => {
    
    const legislatorVotes = voteResults!
    .filter(  (voteResult) => {
      return voteResult.legislator_id === legislatorId
    })
    
    const inFavor = legislatorVotes
      .filter( (voteResult) => {
          return voteResult.vote_type == FAVOR
      })

    const inOpposition = legislatorVotes
      .filter( (voteResult) => {
          return voteResult.vote_type == OPPOSITION
      })

    return `${inFavor.length} / ${inOpposition.length}`

  }

  return (
    <div className="app">
      {isLoading? 
        <>
          Loading
        </>
        :
        <>
          <h3>Bills</h3> 

          {bills!
          .map((bill) => {
            return(
              <ul key={bill.id.toString()}>
                <li key={`billTitle-${bill.id}`} >  
                  Title: {bill.title}  
                </li>

                <li key={`billSponsor-${bill.id}`}> 
                  Primary Sponsor:
                  {getPrimarySponsor(bill.sponsor_id)}
                </li>

                <li key={`billSup-${bill.id}`}> 
                  Supported / Opposed by: 
                  {getBillVotes(bill.id) } 
                </li>
              </ul>
            )
            })
          }

          <br/>

          <h3>Legislators</h3>

          {legislators!.map((legislator) => {
            return(
              <ul key={legislator.id.toString()}>
               <li key={`legName-${legislator.id}`} > 
                Name: {legislator.name} 
              </li>
               <li key={`legSup-${legislator.id}`} > 
                  Supported / Opposed: 
                 {getLegislatorVotes(legislator.id)} 
               </li>
              </ul>
            )
            })
          } 

          {true? 
            <>
            </>
            :
            <>
              <h3>Votes</h3>
              {votes!.map((item) => {
                return(
                  <ul key={item.id.toString()}>
                    <li key={`voteId-${item.id}`} > id: {item.id} </li>
                    <li key={`voteBill-${item.id}`} > Bill id: {item.bill_id}  </li>
                  </ul>
                )
                })
              }

              <br/>

              <h3>Vote Results</h3>
              {voteResults!.map((item) => {
                return(
                  <ul key={item.id.toString()}>
                  <li key={`voteResId-${item.id}`} >  id: {item.id} </li>
                  <li key={`voteLegId-${item.id}`} >  Legislator id: {item.legislator_id}  </li>
                  <li key={`voteId-${item.id}`} >  Vote id: {item.vote_id}  </li>
                  <li key={`voteType-${item.id}`} >  Vote type: {item.vote_type}  </li>
                  </ul>
                )
                })
              }

              <br/>

            </>
          }

        </>
      }
    </div>
  )
}
