import { Kid } from "./Kid";

export interface Parents {
  _id?: string,
  email: string;
  mom: string;
  momphone: string;
  dad: string;
  dadphone: string;
  kids?: Kid[];
  }
  