# License Management - Remote Application

## 🏛️ Overview

The **License Management** micro frontend handles customs license operations including license issuance, renewal, tracking, and compliance monitoring.

### Role in Architecture
- **Remote Application**: Consumed by shell application
- **Domain**: Customs license lifecycle management
- **Shared Modules**: Exposes license components

---

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── LicenseList.tsx         # License listing with filters
│   ├── LicenseDetail.tsx       # License details view
│   ├── CreateLicense.tsx       # License application form
│   ├── RenewLicense.tsx        # License renewal form
│   ├── LicenseCard.tsx         # License preview card
│   ├── LicenseStatus.tsx       # Status badge component
│   ├── DocumentUpload.tsx      # Document upload component
│   └── index.ts                # Component exports
├── config/
│   └── module.config.ts        # Module configuration
│       - License types
│       - Validity periods
│       - Document requirements
├── data/
│   ├── mockLicenses.ts         # Mock license data
│   ├── licenseTypes.ts         # License type definitions
│   └── licenseColumns.ts       # Table column definitions
├── services/
│   ├── licenseService.ts       # License operations
│   │   - getLicenses()
│   │   - getLicenseById()
│   │   - createLicense()
│   │   - renewLicense()
│   │   - revokeLicense()
│   ├── documentService.ts      # Document management
│   │   - uploadDocument()
│   │   - getDocuments()
│   │   - deleteDocument()
│   └── index.ts                # Service exports
├── types/
│   ├── License.ts              # License type definitions
│   │   interface License {
│   │     id: string;
│   │     licenseNumber: string;
│   │     type: LicenseType;
│   │     status: LicenseStatus;
│   │     issuedDate: Date;
│   │     expiryDate: Date;
│   │     holder: LicenseHolder;
│   │     documents: Document[];
│   │   }
│   ├── Document.ts             # Document type definitions
│   └── index.ts                # Type exports
├── utils/
│   ├── licenseValidation.ts    # License validation rules
│   ├── expiryCalculation.ts    # Expiry date calculations
│   ├── documentValidation.ts   # Document validation
│   └── index.ts                # Utility exports
├── App.tsx                     # Main application component
├── Bootstrap.tsx               # Module initialization
├── index.tsx                   # Entry point
└── remotes.d.ts                # Remote type definitions
```

---

## 🔌 Module Federation

### Exposed Modules
```javascript
exposes: {
  "./LicenseManagement": "./src/App.tsx",
  "./LicenseList": "./src/components/LicenseList.tsx",
  "./LicenseCard": "./src/components/LicenseCard.tsx"
}
```

### Consumed Modules (from Shell)
```javascript
// Shared components
import { PageHeader, Card, Button, StatCard } from 'customMain/components/shared';

// Shared store
import { useAppSelector } from 'customMain/store/hooks';

// Services
import { apiService } from 'customMain/services';

// Styles
import 'customMain/TailwindStyles';
```

---

## 💡 Implementation Examples

### License List Component
```typescript
// src/components/LicenseList.tsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, StatCard, Button } from 'customMain/components/shared';
import { licenseService } from '../services';
import type { License, LicenseStatus } from '../types';
import LicenseCard from './LicenseCard';

const LicenseList: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filter, setFilter] = useState<LicenseStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadLicenses();
  }, [filter]);

  const loadLicenses = async () => {
    const data = await licenseService.getLicenses(filter);
    setLicenses(data);
  };

  const activeCount = licenses.filter(l => l.status === 'ACTIVE').length;
  const expiringCount = licenses.filter(l => {
    const daysUntilExpiry = Math.floor(
      (new Date(l.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && l.status === 'ACTIVE';
  }).length;
  const expiredCount = licenses.filter(l => l.status === 'EXPIRED').length;

  return (
    <div className="p-6">
      <PageHeader 
        title="License Management" 
        subtitle="Manage customs licenses and permits"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Active Licenses"
          value={activeCount}
          description="Currently valid"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringCount}
          description="Within 30 days"
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <StatCard
          title="Expired"
          value={expiredCount}
          description="Requires renewal"
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
        <StatCard
          title="Total Licenses"
          value={licenses.length}
          description="All licenses"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
      </div>

      <Card className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Licenses</h2>
          <Button variant="primary" onClick={() => {}}>
            Apply for License
          </Button>
        </div>

        <div className="space-y-4">
          {licenses.map(license => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LicenseList;
```

### License Service Implementation
```typescript
// src/services/licenseService.ts
import { apiService } from 'customMain/services';
import type { License, CreateLicenseDTO, RenewLicenseDTO, LicenseStatus } from '../types';

export const licenseService = {
  async getLicenses(status?: LicenseStatus | 'ALL'): Promise<License[]> {
    const params = status !== 'ALL' ? { status } : {};
    const response = await apiService.get('/licenses', { params });
    return response.data;
  },

  async getLicenseById(id: string): Promise<License> {
    const response = await apiService.get(`/licenses/${id}`);
    return response.data;
  },

  async getLicenseByNumber(licenseNumber: string): Promise<License> {
    const response = await apiService.get(`/licenses/number/${licenseNumber}`);
    return response.data;
  },

  async createLicense(license: CreateLicenseDTO): Promise<License> {
    const response = await apiService.post('/licenses', license);
    return response.data;
  },

  async renewLicense(id: string, renewal: RenewLicenseDTO): Promise<License> {
    const response = await apiService.post(`/licenses/${id}/renew`, renewal);
    return response.data;
  },

  async revokeLicense(id: string, reason: string): Promise<void> {
    await apiService.post(`/licenses/${id}/revoke`, { reason });
  },

  async updateLicense(id: string, updates: Partial<License>): Promise<License> {
    const response = await apiService.put(`/licenses/${id}`, updates);
    return response.data;
  }
};
```

### Document Service Implementation
```typescript
// src/services/documentService.ts
import { apiService } from 'customMain/services';
import type { Document } from '../types';

export const documentService = {
  async uploadDocument(
    licenseId: string, 
    file: File, 
    documentType: string
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    formData.append('licenseId', licenseId);

    const response = await apiService.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getDocuments(licenseId: string): Promise<Document[]> {
    const response = await apiService.get(`/licenses/${licenseId}/documents`);
    return response.data;
  },

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await apiService.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    await apiService.delete(`/documents/${documentId}`);
  }
};
```

### Type Definitions
```typescript
// src/types/License.ts
export enum LicenseType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  WAREHOUSE = 'WAREHOUSE',
  TRANSIT = 'TRANSIT',
  BROKER = 'BROKER'
}

export enum LicenseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  SUSPENDED = 'SUSPENDED'
}

export interface LicenseHolder {
  name: string;
  companyName: string;
  taxId: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface License {
  id: string;
  licenseNumber: string;
  type: LicenseType;
  status: LicenseStatus;
  issuedDate: Date;
  expiryDate: Date;
  holder: LicenseHolder;
  documents: Document[];
  conditions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

export interface CreateLicenseDTO {
  type: LicenseType;
  holder: LicenseHolder;
  requestedDuration: number; // months
  documents: File[];
}

export interface RenewLicenseDTO {
  duration: number; // months
  documents?: File[];
}
```

### License Card Component
```typescript
// src/components/LicenseCard.tsx
import React from 'react';
import { Card } from 'customMain/components/shared';
import type { License } from '../types';
import LicenseStatus from './LicenseStatus';

interface Props {
  license: License;
  onClick?: () => void;
}

const LicenseCard: React.FC<Props> = ({ license, onClick }) => {
  const daysUntilExpiry = Math.floor(
    (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{license.licenseNumber}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {license.type} License
          </p>
          <p className="text-sm text-gray-600">
            Holder: {license.holder.companyName}
          </p>
        </div>
        <LicenseStatus status={license.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Issued Date</p>
          <p className="text-sm font-medium">
            {new Date(license.issuedDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expiry Date</p>
          <p className={`text-sm font-medium ${isExpiringSoon ? 'text-yellow-600' : ''}`}>
            {new Date(license.expiryDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            ⚠️ Expires in {daysUntilExpiry} days - Renewal required
          </p>
        </div>
      )}
    </Card>
  );
};

export default LicenseCard;
```

### Expiry Calculation Utility
```typescript
// src/utils/expiryCalculation.ts
export const calculateExpiryDate = (
  issuedDate: Date, 
  durationMonths: number
): Date => {
  const expiry = new Date(issuedDate);
  expiry.setMonth(expiry.getMonth() + durationMonths);
  return expiry;
};

export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isExpired = (expiryDate: Date): boolean => {
  return new Date(expiryDate) < new Date();
};

export const isExpiringSoon = (expiryDate: Date, thresholdDays: number = 30): boolean => {
  const days = getDaysUntilExpiry(expiryDate);
  return days > 0 && days <= thresholdDays;
};
```

---

## 🚀 Getting Started

### Development
```bash
npm install
npm start
# Runs on http://localhost:5003
```

### Build
```bash
npm run build
```

---

## 🔗 Integration with Shell

### Routing
```typescript
// Shell loads at /license
<Route path="/license" element={<LicenseManagement />} />
```

### State Sharing
```typescript
// Access current user
const currentUser = useAppSelector(state => state.user);
```

---

## 📦 Dependencies

### Remote Dependencies
- `customMain/components/shared` - UI components
- `customMain/store` - Redux store
- `customMain/services` - API service
- `customMain/TailwindStyles` - Styles

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture
- [custom-main README](../custom-main/README.md) - Shell documentation

