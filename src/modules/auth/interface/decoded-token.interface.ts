export interface DecodedToken {
  cpf: string;
  name: string;
  contact: {
    emailAddress: string;
    phone: string;
  };
  zipCode: string;
  borough: string;
  pets: string[];
  userId: string;
  iat: number;
  exp: number;
}
