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

export const mockLicenses: License[] = [
  {
    id: '1',
    licenseNumber: 'LIC-2024-00123',
    companyName: 'Global Import Export Ltd.',
    licenseType: 'Import License',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: 'Active',
    issuedBy: 'Customs Authority'
  },
  {
    id: '2',
    licenseNumber: 'LIC-2024-00124',
    companyName: 'TechParts International',
    licenseType: 'Export License',
    issueDate: '2024-02-20',
    expiryDate: '2025-02-19',
    status: 'Active',
    issuedBy: 'Trade Department'
  },
  {
    id: '3',
    licenseNumber: 'LIC-2023-00890',
    companyName: 'FastShip Logistics',
    licenseType: 'Warehouse License',
    issueDate: '2023-11-10',
    expiryDate: '2024-11-09',
    status: 'Expired',
    issuedBy: 'Port Authority'
  },
  {
    id: '4',
    licenseNumber: 'LIC-2024-00125',
    companyName: 'MedSupply Corp.',
    licenseType: 'Special Import License',
    issueDate: '2024-03-05',
    expiryDate: '2025-03-04',
    status: 'Active',
    issuedBy: 'Health Ministry'
  },
  {
    id: '5',
    licenseNumber: 'LIC-2024-00126',
    companyName: 'AutoParts Direct',
    licenseType: 'General License',
    issueDate: '2024-04-12',
    expiryDate: '2025-04-11',
    status: 'Suspended',
    issuedBy: 'Customs Authority'
  },
  {
    id: '6',
    licenseNumber: 'LIC-2024-00127',
    companyName: 'EcoFriendly Imports',
    licenseType: 'Import License',
    issueDate: '2024-12-01',
    expiryDate: '2025-11-30',
    status: 'Pending',
    issuedBy: 'Environmental Agency'
  }
];

export interface LicenseActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'issued' | 'renewed' | 'suspended' | 'expired';
}

export const mockActivities: LicenseActivity[] = [
  {
    id: '1',
    description: 'New license issued: LIC-2024-00127',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'issued'
  },
  {
    id: '2',
    description: 'License renewed: LIC-2024-00123',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'renewed'
  },
  {
    id: '3',
    description: 'License suspended: LIC-2024-00126',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    type: 'suspended'
  },
  {
    id: '4',
    description: 'License expired: LIC-2023-00890',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'expired'
  }
];
