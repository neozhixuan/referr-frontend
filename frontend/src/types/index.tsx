export interface referralType {
  _id: string;
  userId: string;
  organisation: string;
  code: string;
  url: string;
  description: string;
  expiryDate: Date | null;
  approvals: Array<string>;
  date: Date;
}

export interface organisationType {
  _id: string;
  name: string;
  imgUrl: string;
}

export type PropType = {
  orgCount: number;
  refer: referralType[] | never[];
  org: organisationType[] | never[];
  refCount: number;
  user: string;
  Logout: () => void;
  retrieveReferrals: () => void;
};
