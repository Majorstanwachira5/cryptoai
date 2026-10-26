export interface ReferralUser {
  id: string;
  uid: string;
  username: string;
  email: string;
  joinedAt: number;
  totalVolumeUSDT: number;
  commissionEarnedUSDT: number;
  status: "active" | "pending";
}

export interface ReferralTier {
  tier: number;
  name: string;
  minVolume: number;
  commissionRate: number; // e.g. 0.20 for 20%
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  eligibleReferrals: number;
  totalCommissionUSDT: number;
  pendingCommissionUSDT: number;
  confirmedCommissionUSDT: number;
  currentTier: ReferralTier;
  nextTier?: ReferralTier;
  recentReferrals: ReferralUser[];
}
