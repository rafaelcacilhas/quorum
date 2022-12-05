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

export interface ILegislatorOutput {
  id: Number,
  name: String,
  num_supported_bills: Number,
  num_opposed_bills: Number,
}

export interface IBillOutput {
  id: Number,
  title: String,
  supporter_count: Number,
  opposer_count: Number,
  primary_sponsor: String
}