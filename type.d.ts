type Gender = "M" | "F" | "O";

type BloodGroup = "+A" | "+B" | "+AB" | "+O" | "-A" | "-B" | "-AB" | "-O" | "RARE";

type AuthType = "GOOGLE" | "EMAIL_PASSWORD";

interface UserObj {
  email: string;
  name: FormDataEntryValue;
  gender: Partial<Gender>;
  age: number;
  bloodGroup: Partial<BloodGroup>;
  previousIllness: string;
  authType: AuthType;
  uid: string;
  createdAt: number;
  updatedAt: number;
}

interface ClientLinkRouteObj {
  path: string;
  name: string;
}

type MedicalAdvice = {
  is_medical: boolean;
  is_emergency: boolean;
  emergency_reason: string;
  advice: string;
  recommended_action: string;
  confidence: number;
  disclaimer: string;
};
