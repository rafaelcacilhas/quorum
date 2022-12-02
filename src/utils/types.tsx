export interface IBills {
    id: Number,
    title: String,
    sponsor_id: Number
  }
export  interface ILegislators {
    id: Number,
    name: String,
  }
export interface IVotes {
    id: Number,
    bill_id: Number
  }
export interface IVoteResults {
    id: Number,
    legislator_id: Number,
    vote_id: Number,
    vote_type: Number
  }