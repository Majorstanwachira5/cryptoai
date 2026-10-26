export type UserRole = "user" | "admin" | "trader";
export type KycTier = "unverified" | "tier1_basic" | "tier2_verified" | "tier3_pro";

export interface UserSecurityActivity {
  id: string;
  action: string;
  ipAddress: string;
  location: string;
  device: string;
  status: "success" | "suspicious" | "failed";
  timestamp: number;
}

export interface UserProfile {
  id: string;
  uid: string;
  username: string;
  email: string;
  role: UserRole;
  kycTier: KycTier;
  twoFactorEnabled: boolean;
  antiPhishingCode?: string;
  preferredFiat: string;
  timezone: string;
  createdAt: number;
  securityActivity: UserSecurityActivity[];
}
