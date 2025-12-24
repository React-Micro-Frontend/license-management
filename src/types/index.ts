export interface License {
  id: string;
  licenseNumber: string;
  companyName: string;
  licenseType: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Pending';
  issuedBy: string;
}

export interface LicenseActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'issued' | 'renewed' | 'suspended' | 'expired';
}
