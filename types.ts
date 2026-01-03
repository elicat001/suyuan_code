
export interface TraceNode {
  id: string;
  nodeName: string;
  description: string;
  mediaUrls: string[];
  nodeTime: string;
  operator: string;
}

export interface Batch {
  id: string;
  batchNo: string;
  origin: string;
  treeType: string;
  harvestYear: number;
  status: '陈化中' | '已出库';
  createdAt: string;
}

export interface Product {
  id: string;
  uuid: string;
  batchId: string;
  scanCount: number;
  firstScanTime: string | null;
  isActive: boolean;
}

export enum ViewMode {
  CONSUMER = 'CONSUMER',
  ADMIN = 'ADMIN',
  SPECS = 'SPECS'
}
