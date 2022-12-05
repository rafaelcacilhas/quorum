import useRetrieveData from './utils/useRetrieveData';
import Papa from 'papaparse'
import {IBillOutput, ILegislatorOutput} from "./utils/types"

const FAVOR = 1;
const OPPOSITION = 2;

export default function App() {

  const { 
    bills,legislators, voteResults, votes,
    isLoading
  } = useRetrieveData()

  // Should probably make a services folder 
  // inside utils to store these methods.
  const getBillSupport = (billId: Number) => {
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

    return votesInFavor.length
  }
  
  const getBillOpposition = (billId: Number) => {
    const voteId = votes!
      .find((item) => {
        return item.bill_id === billId
        })?.id

    const votesInBill = voteResults!
    .filter((vote) => {
      return vote.vote_id === voteId
    })

    let votesInOpposition = votesInBill
      .filter((vote) => {
        return vote.vote_type == OPPOSITION
      })

    return votesInOpposition.length
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
      return 'Unknown' 
    }
  }

  const getLegislatorSupport = (legislatorId:Number) => {
    const legislatorVotes = voteResults!
    .filter(  (voteResult) => {
      return voteResult.legislator_id === legislatorId
    })
    
    const inFavor = legislatorVotes
      .filter( (voteResult) => {
          return voteResult.vote_type == FAVOR
      })

    return inFavor.length 
  }

  const getLegislatorOpposition = (legislatorId:Number) => {
    const legislatorVotes = voteResults!
    .filter(  (voteResult) => {
      return voteResult.legislator_id === legislatorId
    })
    
    const inOpposition = legislatorVotes
      .filter( (voteResult) => {
          return voteResult.vote_type == OPPOSITION
      })

    return inOpposition.length
  }

  const downloadCSV = () =>{
    generateLegislatorsCsv();
    generateBillsCsv();
  }

  const generateLegislatorsCsv = () => {
    let legislatorOutput:[ILegislatorOutput] =  [ null as unknown as ILegislatorOutput  ]
    for(let i = 0; i < legislators!.length ; i++){
      legislatorOutput[i] = {
        id:legislators![i].id,
        name:legislators![i].name,     
        num_supported_bills: getLegislatorSupport(legislators![i].id),
        num_opposed_bills: getLegislatorOpposition(legislators![i].id),
      }
    }

    var csv = Papa.unparse(legislatorOutput!);
    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    csvURL = window.URL.createObjectURL(csvData);

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'legislators-support-oppose-count.csv');
    tempLink.click();
  }

  const generateBillsCsv = () => {
    let billsOutput:[IBillOutput] =  [ null as unknown as IBillOutput  ]
    for(let i = 0; i < bills!.length ; i++){
      billsOutput[i] = {
        id:bills![i].id,
        title:bills![i].title,     
        supporter_count: getBillSupport(bills![i].id),
        opposer_count: getBillOpposition(bills![i].id),
        primary_sponsor: getPrimarySponsor(bills![i].sponsor_id)
      }
    }

    var csv = Papa.unparse(billsOutput!);
    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    csvURL = window.URL.createObjectURL(csvData);

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'bills.csv');
    tempLink.click();
  }

  return (
    <div className="app">
      {isLoading? 
        <>
          Loading
        </>
        :
        <>

          <button onClick={downloadCSV} >
            Download
          </button>

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
                  {getBillSupport(bill.id) }/{getBillOpposition(bill.id)} 
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
                  {getLegislatorSupport(legislator.id)} / {getLegislatorOpposition(legislator.id)}
               </li>
              </ul>
            )
            })
          } 

        </>
      }
    </div>
  )
}
