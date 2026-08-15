'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Store,
  Lock,
  RefreshCw,
  ShieldAlert,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Plus,
  AlertCircle,
  Fingerprint,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  FileText,
  LockKeyhole,
  Info,
  ChevronDown,
  LogOut,
  Sparkles,
  Database,
  Building,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { LogoLockup, LogoIcon } from '@/components/common/Logo';
import { syncWithServer } from '@/utils/sync';

// Interfaces matching system types
interface Workspace {
  id: string;
  name: string;
  type: 'merchant' | 'distributor';
  verificationStatus?: 'Unverified' | 'Pending Review' | 'Verified' | 'Rejected' | 'Requires Additional Information';
  statusUpdatedAt?: number;
  ownerName?: string;
  storeAddress?: string;
  warehouseAddress?: string;
  contactPerson?: string;
  contactNumber?: string;
  registryId?: string;
  barangayPermit?: string;
  secRegistration?: string;
  submittedDate?: string;
  rejectionReason?: string;
  missingDocs?: string;
  internalNotes?: string;
  walletAddress?: string;
}

interface Order {
  id: string;
  supplier: string;
  amount: string;
  status: 'Initialized' | 'Funded' | 'In Transit' | 'Delivered' | 'Canceled';
  date: string;
  details: string;
  merchantAddress?: string;
  merchantName?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  workspacesCount: number;
  status: 'Active' | 'Suspended';
  createdDate: string;
}

interface Dispute {
  id: string;
  orderId: string;
  merchant: string;
  distributor: string;
  status: 'Open' | 'Resolved' | 'Closed';
  createdDate: string;
  details: string;
  evidence: string[];
  notes?: string;
}

interface SupportTicket {
  id: string;
  title: string;
  user: string;
  status: 'Open' | 'Resolved';
  createdDate: string;
  details: string;
  notes?: string;
}

interface AdminLog {
  id: string;
  action: string;
  workspace?: string;
  details: string;
  timestamp: string;
  adminUser: string;
}

// Initial Mock Datasets
const DEFAULT_WORKSPACES: Workspace[] = [
  {
    "id": "ws-merchant-1",
    "name": "Maria's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786760864251,
    "ownerName": "Maria Santos",
    "storeAddress": "100 Barangay 10, Quezon City",
    "contactNumber": "09171000000",
    "barangayPermit": "bp_permit_1.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GCISQDTKEEUGE5KUH7O7EEGKGTM7ZIVRABL275BOCSQNXPXTFIEX7UMO"
  },
  {
    "id": "ws-distributor-2",
    "name": "Juan Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786757264251,
    "contactPerson": "Juan Dela Cruz",
    "contactNumber": "09182008888",
    "warehouseAddress": "Building 2, Logistics Park, Manila",
    "registryId": "SEC-2026-88001",
    "secRegistration": "sec_reg_2.pdf",
    "submittedDate": "2026-07-06",
    "walletAddress": "GBALNCR7WABCJSTVQJVYX72GN2ASTE7GZG5WZMDVMOLCPDZEBZ76Y35V"
  },
  {
    "id": "ws-merchant-3",
    "name": "Elena's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786753664251,
    "ownerName": "Elena Reyes",
    "storeAddress": "102 Barangay 12, Pasig City",
    "contactNumber": "09171015554",
    "barangayPermit": "bp_permit_3.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GAFYVG6BMZEPSQSZSHWJWQANNVNVMAF65HDGBBEEUC7FWTMZOC7ZL2T3"
  },
  {
    "id": "ws-distributor-4",
    "name": "Roberto Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786750064251,
    "contactPerson": "Roberto Garcia",
    "contactNumber": "09182026664",
    "warehouseAddress": "Building 4, Logistics Park, Makati City",
    "registryId": "SEC-2026-88003",
    "secRegistration": "sec_reg_4.pdf",
    "submittedDate": "2026-07-08",
    "walletAddress": "GCTIXPA2EU3W34BIG7S6PSVJUZS2VORP2B7QJGMZLKS2OA26WP2GTJ2A"
  },
  {
    "id": "ws-merchant-5",
    "name": "Ana's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786746464251,
    "ownerName": "Ana Mendoza",
    "storeAddress": "104 Barangay 14, Taguig City",
    "contactNumber": "09171031108",
    "barangayPermit": "bp_permit_5.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GBLZIIPNP54YEPAQQD7XY66XNRF2H6D75ZJRYD6SG3KVCGI7UEKAEDJ5"
  },
  {
    "id": "ws-distributor-6",
    "name": "Carlos Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786742864251,
    "contactPerson": "Carlos Ramos",
    "contactNumber": "09182044440",
    "warehouseAddress": "Building 6, Logistics Park, Cebu City",
    "registryId": "SEC-2026-88005",
    "secRegistration": "sec_reg_6.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GBSRMIVV4XRLOOAFNZAHA72OIHLRUZEI2V2GGHPX6PSVU65MB4MPXCJF"
  },
  {
    "id": "ws-merchant-7",
    "name": "Teresa's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786739264251,
    "ownerName": "Teresa Aquino",
    "storeAddress": "106 Barangay 16, Davao City",
    "contactNumber": "09171046662",
    "barangayPermit": "bp_permit_7.pdf",
    "submittedDate": "2026-07-16",
    "walletAddress": "GC4HFMWIDH6YIERH6XQFCIWJLBIYGOUOKHXBHHABADWYQAQQRLXWIXZW"
  },
  {
    "id": "ws-distributor-8",
    "name": "Jose Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786735664251,
    "contactPerson": "Jose Fernandez",
    "contactNumber": "09182062216",
    "warehouseAddress": "Building 8, Logistics Park, Caloocan",
    "registryId": "SEC-2026-88007",
    "secRegistration": "sec_reg_8.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GCXNS2GIHSCYQIUSV6S6WGTSSFGZOZDYEODGBLY6O6NUAJYIWALSFJJW"
  },
  {
    "id": "ws-merchant-9",
    "name": "Lucia's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786732064251,
    "ownerName": "Lucia Torres",
    "storeAddress": "108 Barangay 18, Mandaluyong",
    "contactNumber": "09171062216",
    "barangayPermit": "bp_permit_9.pdf",
    "submittedDate": "2026-07-18",
    "walletAddress": "GBJEY254WBDZMGRVLAVIG44TDCNRGA53XW76NVQ7VIVTUUX6OE35OKWF"
  },
  {
    "id": "ws-distributor-10",
    "name": "Miguel Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786728464251,
    "contactPerson": "Miguel Bautista",
    "contactNumber": "09182079992",
    "warehouseAddress": "Building 10, Logistics Park, Pampanga",
    "registryId": "SEC-2026-88009",
    "secRegistration": "sec_reg_10.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GB2RVIWIGUPXV7RNAUHGZQTVPZQNGOE35YAOYOB63AOOJE2MGKIJUVTQ"
  },
  {
    "id": "ws-merchant-11",
    "name": "Rosa's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786724864251,
    "ownerName": "Rosa Villanueva",
    "storeAddress": "110 Barangay 20, Laguna",
    "contactNumber": "09171077770",
    "barangayPermit": "bp_permit_11.pdf",
    "submittedDate": "2026-07-20",
    "walletAddress": "GCER3IXWUVKREW6SYVJ6PK7OZQOCRVSBIKJ34LLEZRF7W6CHDO6VI2QB"
  },
  {
    "id": "ws-distributor-12",
    "name": "Antonio Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786721264251,
    "contactPerson": "Antonio Castro",
    "contactNumber": "09182097768",
    "warehouseAddress": "Building 12, Logistics Park, Cavite",
    "registryId": "SEC-2026-88011",
    "secRegistration": "sec_reg_12.pdf",
    "submittedDate": "2026-07-16",
    "walletAddress": "GBJ7VNRRTBMEWIJYG7NM3OTEZP63FP4SOO5PCCCFJATLH7PVIJCXK3RF"
  },
  {
    "id": "ws-merchant-13",
    "name": "Sofia's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786717664251,
    "ownerName": "Sofia Morales",
    "storeAddress": "112 Barangay 22, Bulacan",
    "contactNumber": "09171093324",
    "barangayPermit": "bp_permit_13.pdf",
    "submittedDate": "2026-07-22",
    "walletAddress": "GB5ERLEIEM7KJALHMDAG3UWZ4Y35ISRG4HRFMWT7YOBTJVMYS3KO46IT"
  },
  {
    "id": "ws-distributor-14",
    "name": "Francisco Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786714064251,
    "contactPerson": "Francisco Navarro",
    "contactNumber": "09182115544",
    "warehouseAddress": "Building 14, Logistics Park, Batangas",
    "registryId": "SEC-2026-88013",
    "secRegistration": "sec_reg_14.pdf",
    "submittedDate": "2026-07-18",
    "walletAddress": "GDBA5NNQPDLMLHE6LTL7VA55SFNBAFWZPREKXFPVRNITWKI7SG2YVKYL"
  },
  {
    "id": "ws-merchant-15",
    "name": "Carmen's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786710464251,
    "ownerName": "Carmen Gutierrez",
    "storeAddress": "114 Barangay 24, Iloilo City",
    "contactNumber": "09171108878",
    "barangayPermit": "bp_permit_15.pdf",
    "submittedDate": "2026-07-24",
    "walletAddress": "GBXTJC6QZXQ2DFGGNJKP3KB2GZCACLCFGZ2CRWF5UKN5EI54DZQ3YLEN"
  },
  {
    "id": "ws-distributor-16",
    "name": "Gabriel Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786706864251,
    "contactPerson": "Gabriel Flores",
    "contactNumber": "09182133320",
    "warehouseAddress": "Building 16, Logistics Park, Quezon City",
    "registryId": "SEC-2026-88015",
    "secRegistration": "sec_reg_16.pdf",
    "submittedDate": "2026-07-20",
    "walletAddress": "GBLFJ4QFBW4YD22MOVWVJVZ5SG7TIYOVOZLVLXRS7LE5VZEAQL4EVVXH"
  },
  {
    "id": "ws-merchant-17",
    "name": "Isabel's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786703264251,
    "ownerName": "Isabel Delgado",
    "storeAddress": "116 Barangay 26, Manila",
    "contactNumber": "09171124432",
    "barangayPermit": "bp_permit_17.pdf",
    "submittedDate": "2026-07-26",
    "walletAddress": "GDT2QXGB2QJ5WYL7DUQX4ZEO55TIGDEXNJBJ2ALWBZC4OWREYARDQ5GX"
  },
  {
    "id": "ws-distributor-18",
    "name": "Manuel Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786699664251,
    "contactPerson": "Manuel Ortiz",
    "contactNumber": "09182151096",
    "warehouseAddress": "Building 18, Logistics Park, Pasig City",
    "registryId": "SEC-2026-88017",
    "secRegistration": "sec_reg_18.pdf",
    "submittedDate": "2026-07-22",
    "walletAddress": "GCJAVG7EKP3MEBSLBPIQV3EC7TTMWRA4QJ2L6PGZOPV23CYGGJ3GQPIG"
  },
  {
    "id": "ws-merchant-19",
    "name": "Patricia's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786696064251,
    "ownerName": "Patricia Romero",
    "storeAddress": "118 Barangay 28, Makati City",
    "contactNumber": "09171139986",
    "barangayPermit": "bp_permit_19.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GD6VVCSH3EXG6WIP6CNGFIAOXFRXOWINLQI4SI7HP7FP6H3BRT3722KI"
  },
  {
    "id": "ws-distributor-20",
    "name": "David Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786692464251,
    "contactPerson": "David Gomez",
    "contactNumber": "09182168872",
    "warehouseAddress": "Building 20, Logistics Park, Taguig City",
    "registryId": "SEC-2026-88019",
    "secRegistration": "sec_reg_20.pdf",
    "submittedDate": "2026-07-24",
    "walletAddress": "GAXDQ6MCLS5VRUNHBLAEFZUEZ5N7CPP26VBISJ6BCM3C7NHHG3Z4TW33"
  },
  {
    "id": "ws-merchant-21",
    "name": "Esperanza's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786688864251,
    "ownerName": "Esperanza Cruz",
    "storeAddress": "120 Barangay 10, Cebu City",
    "contactNumber": "09171155540",
    "barangayPermit": "bp_permit_21.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GCWOT2QFMXORPQ4WZMHRFMXLCOGCIFUXWDVKMF2ZRHTLQ7JMQKFOJK2Q"
  },
  {
    "id": "ws-distributor-22",
    "name": "Ramon Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786685264251,
    "contactPerson": "Ramon Perez",
    "contactNumber": "09182186648",
    "warehouseAddress": "Building 22, Logistics Park, Davao City",
    "registryId": "SEC-2026-88021",
    "secRegistration": "sec_reg_22.pdf",
    "submittedDate": "2026-07-06",
    "walletAddress": "GC2JFHYSYOYAZIKXENIQM56KZRE2IGWEZZDSJ4IMQFKV6HIMASRZDFLR"
  },
  {
    "id": "ws-merchant-23",
    "name": "Lourdes's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786681664251,
    "ownerName": "Lourdes Sanchez",
    "storeAddress": "122 Barangay 12, Caloocan",
    "contactNumber": "09171171094",
    "barangayPermit": "bp_permit_23.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GBEN7MAIMHIBJFVALUSGMCKTPTCIUDMBJZT6ZYU7DKJQKQRHQUMT5CCI"
  },
  {
    "id": "ws-distributor-24",
    "name": "Eduardo Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786678064251,
    "contactPerson": "Eduardo Diaz",
    "contactNumber": "09182204424",
    "warehouseAddress": "Building 24, Logistics Park, Mandaluyong",
    "registryId": "SEC-2026-88023",
    "secRegistration": "sec_reg_24.pdf",
    "submittedDate": "2026-07-08",
    "walletAddress": "GD5NUKB5F4A462RGL3KESB5SCOEJJJTBIJYJVWIC3RAPGN4AQVSQOARS"
  },
  {
    "id": "ws-merchant-25",
    "name": "Christina's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786674464251,
    "ownerName": "Christina Alvarez",
    "storeAddress": "124 Barangay 14, Pampanga",
    "contactNumber": "09171186648",
    "barangayPermit": "bp_permit_25.pdf",
    "submittedDate": "2026-07-16",
    "walletAddress": "GDW5XCD43SO43UJRX54Z5XLO5Z6EFNXX3B55JDXJFR6ZCV3MWLFZPWTH"
  },
  {
    "id": "ws-distributor-26",
    "name": "Angelito Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786670864251,
    "contactPerson": "Angelito Dimagiba",
    "contactNumber": "09182222200",
    "warehouseAddress": "Building 26, Logistics Park, Laguna",
    "registryId": "SEC-2026-88025",
    "secRegistration": "sec_reg_26.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GBRDSFWPSCM5FE5DSI4ENLR6ZN35SRBOPI43KUTQI6LGMX7KZE5S35YG"
  },
  {
    "id": "ws-merchant-27",
    "name": "Corazon's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786667264251,
    "ownerName": "Corazon Aquino",
    "storeAddress": "126 Barangay 16, Cavite",
    "contactNumber": "09171202202",
    "barangayPermit": "bp_permit_27.pdf",
    "submittedDate": "2026-07-18",
    "walletAddress": "GADAETKFITDV6RANXECHJH422YWUN5UCSQMEIMUEB2XBHSOKC5Q4TOLI"
  },
  {
    "id": "ws-distributor-28",
    "name": "Danilo Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786663664251,
    "contactPerson": "Danilo Dizon",
    "contactNumber": "09182239976",
    "warehouseAddress": "Building 28, Logistics Park, Bulacan",
    "registryId": "SEC-2026-88027",
    "secRegistration": "sec_reg_28.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GAR4NXHAYGEODGM7WQ5E57H6VQREWMC6LUOMLVDGO4JOULJDLYEBHDSY"
  },
  {
    "id": "ws-merchant-29",
    "name": "Estrella's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786660064251,
    "ownerName": "Estrella Beltran",
    "storeAddress": "128 Barangay 18, Batangas",
    "contactNumber": "09171217756",
    "barangayPermit": "bp_permit_29.pdf",
    "submittedDate": "2026-07-20",
    "walletAddress": "GCFYIH2RHI4BPIZWEFV5YFVJQCRSRNUJZPNHYJSPXVIS77LRODFQBLL5"
  },
  {
    "id": "ws-distributor-30",
    "name": "Felipe Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786656464251,
    "contactPerson": "Felipe Valenzuela",
    "contactNumber": "09182257752",
    "warehouseAddress": "Building 30, Logistics Park, Iloilo City",
    "registryId": "SEC-2026-88029",
    "secRegistration": "sec_reg_30.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GCEYQHGQ4RPZ2T6MY477OLESOKEKYAUY4GJQ3JWMEXGWIMTWDBAFBAYO"
  },
  {
    "id": "ws-merchant-31",
    "name": "Grace's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786652864251,
    "ownerName": "Grace Tan",
    "storeAddress": "130 Barangay 20, Quezon City",
    "contactNumber": "09171233310",
    "barangayPermit": "bp_permit_31.pdf",
    "submittedDate": "2026-07-22",
    "walletAddress": "GC4LQK2G3AVK6CWYKF3QBETT65O7FC6EZVDVQIL4UBPW7AB27OOXXDEH"
  },
  {
    "id": "ws-distributor-32",
    "name": "Hector Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786649264251,
    "contactPerson": "Hector Lim",
    "contactNumber": "09182275528",
    "warehouseAddress": "Building 32, Logistics Park, Manila",
    "registryId": "SEC-2026-88031",
    "secRegistration": "sec_reg_32.pdf",
    "submittedDate": "2026-07-16",
    "walletAddress": "GB5IJOMUMXN37UKBG7S2MLJ4NEAJHVHURRYNA3DKCWB2DBOQ6NULKVSY"
  },
  {
    "id": "ws-merchant-33",
    "name": "Irene's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786645664251,
    "ownerName": "Irene Sy",
    "storeAddress": "132 Barangay 22, Pasig City",
    "contactNumber": "09171248864",
    "barangayPermit": "bp_permit_33.pdf",
    "submittedDate": "2026-07-24",
    "walletAddress": "GA4ZYH4657BJ6E5GTXKKZLQUPZ3RVVCVMY5QW5KVBFFCDYDULPHDOGEC"
  },
  {
    "id": "ws-distributor-34",
    "name": "Joaquin Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786642064251,
    "contactPerson": "Joaquin Co",
    "contactNumber": "09182293304",
    "warehouseAddress": "Building 34, Logistics Park, Makati City",
    "registryId": "SEC-2026-88033",
    "secRegistration": "sec_reg_34.pdf",
    "submittedDate": "2026-07-18",
    "walletAddress": "GC3DYHKTGZWZ3UQ6CTUGGOWQUTKEMOM2NHFSUUGFRHEU5LMM7CIAZ7WE"
  },
  {
    "id": "ws-merchant-35",
    "name": "Katarina's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786638464251,
    "ownerName": "Katarina Go",
    "storeAddress": "134 Barangay 24, Taguig City",
    "contactNumber": "09171264418",
    "barangayPermit": "bp_permit_35.pdf",
    "submittedDate": "2026-07-26",
    "walletAddress": "GCPINYBZLHRHMEGFQYPGUOL6ZTRGC55DWVRFT2SDYHTU5YWZRNXKNMEA"
  },
  {
    "id": "ws-distributor-36",
    "name": "Leandro Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786634864251,
    "contactPerson": "Leandro Ong",
    "contactNumber": "09182311080",
    "warehouseAddress": "Building 36, Logistics Park, Cebu City",
    "registryId": "SEC-2026-88035",
    "secRegistration": "sec_reg_36.pdf",
    "submittedDate": "2026-07-20",
    "walletAddress": "GBCCV6IUKRWRFE7AHU7252P5SMAWA5H4NDAXZJYGYYPTAC6DT2YZZ6V3"
  },
  {
    "id": "ws-merchant-37",
    "name": "Marilou's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786631264251,
    "ownerName": "Marilou Tee",
    "storeAddress": "136 Barangay 26, Davao City",
    "contactNumber": "09171279972",
    "barangayPermit": "bp_permit_37.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GDZQBQV2UYB7NSXUERKVMKMX6OLMORSKJVGDPWFHSWUSPAWKLF3ZDQ6G"
  },
  {
    "id": "ws-distributor-38",
    "name": "Nestor Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786627664251,
    "contactPerson": "Nestor Yap",
    "contactNumber": "09182328856",
    "warehouseAddress": "Building 38, Logistics Park, Caloocan",
    "registryId": "SEC-2026-88037",
    "secRegistration": "sec_reg_38.pdf",
    "submittedDate": "2026-07-22",
    "walletAddress": "GBMYFDUBUJC7ZIH2IODCJ6AG3PZUL36JZBHL34KHJ6ZWWBVR5O37DVQS"
  },
  {
    "id": "ws-merchant-39",
    "name": "Olivia's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786624064251,
    "ownerName": "Olivia Uy",
    "storeAddress": "138 Barangay 28, Mandaluyong",
    "contactNumber": "09171295526",
    "barangayPermit": "bp_permit_39.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GBYRBY6B65OIIHPRLNMV5XXOWTDZU3YZCJSOCPBJ5F3GGACNP32D263N"
  },
  {
    "id": "ws-distributor-40",
    "name": "Pedro Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786620464251,
    "contactPerson": "Pedro Ang",
    "contactNumber": "09182346632",
    "warehouseAddress": "Building 40, Logistics Park, Pampanga",
    "registryId": "SEC-2026-88039",
    "secRegistration": "sec_reg_40.pdf",
    "submittedDate": "2026-07-24",
    "walletAddress": "GDPTDUITKLUVDUXC27CA45PQXHSD3PXZ4Q4SSYJPXKMACUR3XGLR3V2G"
  },
  {
    "id": "ws-merchant-41",
    "name": "Quirino's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786616864251,
    "ownerName": "Quirino Dy",
    "storeAddress": "140 Barangay 10, Laguna",
    "contactNumber": "09171311080",
    "barangayPermit": "bp_permit_41.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GCJ6EKJX43GQ6UMIF4RZSXSBJDJS3T2DRL4PLVB6OEZ3HEXSP36PGPMX"
  },
  {
    "id": "ws-distributor-42",
    "name": "Rosario Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786613264251,
    "contactPerson": "Rosario Lao",
    "contactNumber": "09182364408",
    "warehouseAddress": "Building 42, Logistics Park, Cavite",
    "registryId": "SEC-2026-88041",
    "secRegistration": "sec_reg_42.pdf",
    "submittedDate": "2026-07-06",
    "walletAddress": "GAQIEHAXW4V2OLR3H3TYL7VHDX4HRJF2XKC4PFJNO2KNE6UI3Y5Q7YYN"
  },
  {
    "id": "ws-merchant-43",
    "name": "Salvador's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786609664251,
    "ownerName": "Salvador King",
    "storeAddress": "142 Barangay 12, Bulacan",
    "contactNumber": "09171326634",
    "barangayPermit": "bp_permit_43.pdf",
    "submittedDate": "2026-07-16",
    "walletAddress": "GDU5LLL4BYVGXGBKO5VDMUJJZNDBMII24NXRF3UTUVMIPGJ7SMFJT3VW"
  },
  {
    "id": "ws-distributor-44",
    "name": "Trinidad Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786606064251,
    "contactPerson": "Trinidad Chua",
    "contactNumber": "09182382184",
    "warehouseAddress": "Building 44, Logistics Park, Batangas",
    "registryId": "SEC-2026-88043",
    "secRegistration": "sec_reg_44.pdf",
    "submittedDate": "2026-07-08",
    "walletAddress": "GAHVRZG6BRM4WVA53DZETJMBIES3LN7M34YD5GC55UHPLDQFKP37JOPO"
  },
  {
    "id": "ws-merchant-45",
    "name": "Ursula's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786602464251,
    "ownerName": "Ursula See",
    "storeAddress": "144 Barangay 14, Iloilo City",
    "contactNumber": "09171342188",
    "barangayPermit": "bp_permit_45.pdf",
    "submittedDate": "2026-07-18",
    "walletAddress": "GDQTH4U23IWEFCQGCJBAEWUZPYA5RCASPL5AMDPXVEAXC7ZTMEEXTGM3"
  },
  {
    "id": "ws-distributor-46",
    "name": "Vicente Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786598864251,
    "contactPerson": "Vicente Poe",
    "contactNumber": "09182399960",
    "warehouseAddress": "Building 46, Logistics Park, Quezon City",
    "registryId": "SEC-2026-88045",
    "secRegistration": "sec_reg_46.pdf",
    "submittedDate": "2026-07-10",
    "walletAddress": "GAMILN2QMGUZG55LHCHI3YRT3QYEWPICDHJPIRJGQHOF7E6N4ZJXBIRE"
  },
  {
    "id": "ws-merchant-47",
    "name": "Wilfredo's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786595264251,
    "ownerName": "Wilfredo Sy",
    "storeAddress": "146 Barangay 16, Manila",
    "contactNumber": "09171357742",
    "barangayPermit": "bp_permit_47.pdf",
    "submittedDate": "2026-07-20",
    "walletAddress": "GC6LXWVFERTY5YHBWQFLHQBZJIJHZQUUWVNZ3BHGWEKNDQXUAZQP6CGR"
  },
  {
    "id": "ws-distributor-48",
    "name": "Ximena Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786591664251,
    "contactPerson": "Ximena Cruz",
    "contactNumber": "09182417736",
    "warehouseAddress": "Building 48, Logistics Park, Pasig City",
    "registryId": "SEC-2026-88047",
    "secRegistration": "sec_reg_48.pdf",
    "submittedDate": "2026-07-12",
    "walletAddress": "GAHNMMS7HUT5773LIHU2BA6N7THAEH4ZXFQ47D6FPRGQCSKT65MH3EX6"
  },
  {
    "id": "ws-merchant-49",
    "name": "Yolanda's Sari-Sari Store",
    "type": "merchant",
    "verificationStatus": "Pending Review",
    "statusUpdatedAt": 1786588064251,
    "ownerName": "Yolanda Recto",
    "storeAddress": "148 Barangay 18, Makati City",
    "contactNumber": "09171373296",
    "barangayPermit": "bp_permit_49.pdf",
    "submittedDate": "2026-07-22",
    "walletAddress": "GDRHRQCDJFGDVALG3GZ2AJLU4VIUW43DQWDHYSIKE2M53BQ4QVWAR6EA"
  },
  {
    "id": "ws-distributor-50",
    "name": "Zenaida Wholesale & Logistics",
    "type": "distributor",
    "verificationStatus": "Verified",
    "statusUpdatedAt": 1786584464251,
    "contactPerson": "Zenaida Laurel",
    "contactNumber": "09182435512",
    "warehouseAddress": "Building 50, Logistics Park, Taguig City",
    "registryId": "SEC-2026-88049",
    "secRegistration": "sec_reg_50.pdf",
    "submittedDate": "2026-07-14",
    "walletAddress": "GA3DEDDNDICJPO6N7FPWESKUP6HYRYDRIJCHA3FIQK3APIMMZY2MVUCX"
  }
];

const DEFAULT_USERS: UserProfile[] = [
  {
    "id": "USR-101",
    "name": "Maria Santos",
    "email": "maria.santos@gmail.com",
    "walletAddress": "GCISQDTKEEUGE5KUH7O7EEGKGTM7ZIVRABL275BOCSQNXPXTFIEX7UMO",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-15"
  },
  {
    "id": "USR-102",
    "name": "Juan Dela Cruz",
    "email": "juan.dela.cruz@gmail.com",
    "walletAddress": "GBALNCR7WABCJSTVQJVYX72GN2ASTE7GZG5WZMDVMOLCPDZEBZ76Y35V",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-16"
  },
  {
    "id": "USR-103",
    "name": "Elena Reyes",
    "email": "elena.reyes@gmail.com",
    "walletAddress": "GAFYVG6BMZEPSQSZSHWJWQANNVNVMAF65HDGBBEEUC7FWTMZOC7ZL2T3",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-17"
  },
  {
    "id": "USR-104",
    "name": "Roberto Garcia",
    "email": "roberto.garcia@gmail.com",
    "walletAddress": "GCTIXPA2EU3W34BIG7S6PSVJUZS2VORP2B7QJGMZLKS2OA26WP2GTJ2A",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-18"
  },
  {
    "id": "USR-105",
    "name": "Ana Mendoza",
    "email": "ana.mendoza@gmail.com",
    "walletAddress": "GBLZIIPNP54YEPAQQD7XY66XNRF2H6D75ZJRYD6SG3KVCGI7UEKAEDJ5",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-19"
  },
  {
    "id": "USR-106",
    "name": "Carlos Ramos",
    "email": "carlos.ramos@gmail.com",
    "walletAddress": "GBSRMIVV4XRLOOAFNZAHA72OIHLRUZEI2V2GGHPX6PSVU65MB4MPXCJF",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-20"
  },
  {
    "id": "USR-107",
    "name": "Teresa Aquino",
    "email": "teresa.aquino@gmail.com",
    "walletAddress": "GC4HFMWIDH6YIERH6XQFCIWJLBIYGOUOKHXBHHABADWYQAQQRLXWIXZW",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-21"
  },
  {
    "id": "USR-108",
    "name": "Jose Fernandez",
    "email": "jose.fernandez@gmail.com",
    "walletAddress": "GCXNS2GIHSCYQIUSV6S6WGTSSFGZOZDYEODGBLY6O6NUAJYIWALSFJJW",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-22"
  },
  {
    "id": "USR-109",
    "name": "Lucia Torres",
    "email": "lucia.torres@gmail.com",
    "walletAddress": "GBJEY254WBDZMGRVLAVIG44TDCNRGA53XW76NVQ7VIVTUUX6OE35OKWF",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-23"
  },
  {
    "id": "USR-110",
    "name": "Miguel Bautista",
    "email": "miguel.bautista@gmail.com",
    "walletAddress": "GB2RVIWIGUPXV7RNAUHGZQTVPZQNGOE35YAOYOB63AOOJE2MGKIJUVTQ",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-24"
  },
  {
    "id": "USR-111",
    "name": "Rosa Villanueva",
    "email": "rosa.villanueva@gmail.com",
    "walletAddress": "GCER3IXWUVKREW6SYVJ6PK7OZQOCRVSBIKJ34LLEZRF7W6CHDO6VI2QB",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-25"
  },
  {
    "id": "USR-112",
    "name": "Antonio Castro",
    "email": "antonio.castro@gmail.com",
    "walletAddress": "GBJ7VNRRTBMEWIJYG7NM3OTEZP63FP4SOO5PCCCFJATLH7PVIJCXK3RF",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-26"
  },
  {
    "id": "USR-113",
    "name": "Sofia Morales",
    "email": "sofia.morales@gmail.com",
    "walletAddress": "GB5ERLEIEM7KJALHMDAG3UWZ4Y35ISRG4HRFMWT7YOBTJVMYS3KO46IT",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-27"
  },
  {
    "id": "USR-114",
    "name": "Francisco Navarro",
    "email": "francisco.navarro@gmail.com",
    "walletAddress": "GDBA5NNQPDLMLHE6LTL7VA55SFNBAFWZPREKXFPVRNITWKI7SG2YVKYL",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-28"
  },
  {
    "id": "USR-115",
    "name": "Carmen Gutierrez",
    "email": "carmen.gutierrez@gmail.com",
    "walletAddress": "GBXTJC6QZXQ2DFGGNJKP3KB2GZCACLCFGZ2CRWF5UKN5EI54DZQ3YLEN",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-29"
  },
  {
    "id": "USR-116",
    "name": "Gabriel Flores",
    "email": "gabriel.flores@gmail.com",
    "walletAddress": "GBLFJ4QFBW4YD22MOVWVJVZ5SG7TIYOVOZLVLXRS7LE5VZEAQL4EVVXH",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-15"
  },
  {
    "id": "USR-117",
    "name": "Isabel Delgado",
    "email": "isabel.delgado@gmail.com",
    "walletAddress": "GDT2QXGB2QJ5WYL7DUQX4ZEO55TIGDEXNJBJ2ALWBZC4OWREYARDQ5GX",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-16"
  },
  {
    "id": "USR-118",
    "name": "Manuel Ortiz",
    "email": "manuel.ortiz@gmail.com",
    "walletAddress": "GCJAVG7EKP3MEBSLBPIQV3EC7TTMWRA4QJ2L6PGZOPV23CYGGJ3GQPIG",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-17"
  },
  {
    "id": "USR-119",
    "name": "Patricia Romero",
    "email": "patricia.romero@gmail.com",
    "walletAddress": "GD6VVCSH3EXG6WIP6CNGFIAOXFRXOWINLQI4SI7HP7FP6H3BRT3722KI",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-18"
  },
  {
    "id": "USR-120",
    "name": "David Gomez",
    "email": "david.gomez@gmail.com",
    "walletAddress": "GAXDQ6MCLS5VRUNHBLAEFZUEZ5N7CPP26VBISJ6BCM3C7NHHG3Z4TW33",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-19"
  },
  {
    "id": "USR-121",
    "name": "Esperanza Cruz",
    "email": "esperanza.cruz@gmail.com",
    "walletAddress": "GCWOT2QFMXORPQ4WZMHRFMXLCOGCIFUXWDVKMF2ZRHTLQ7JMQKFOJK2Q",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-20"
  },
  {
    "id": "USR-122",
    "name": "Ramon Perez",
    "email": "ramon.perez@gmail.com",
    "walletAddress": "GC2JFHYSYOYAZIKXENIQM56KZRE2IGWEZZDSJ4IMQFKV6HIMASRZDFLR",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-21"
  },
  {
    "id": "USR-123",
    "name": "Lourdes Sanchez",
    "email": "lourdes.sanchez@gmail.com",
    "walletAddress": "GBEN7MAIMHIBJFVALUSGMCKTPTCIUDMBJZT6ZYU7DKJQKQRHQUMT5CCI",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-22"
  },
  {
    "id": "USR-124",
    "name": "Eduardo Diaz",
    "email": "eduardo.diaz@gmail.com",
    "walletAddress": "GD5NUKB5F4A462RGL3KESB5SCOEJJJTBIJYJVWIC3RAPGN4AQVSQOARS",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-23"
  },
  {
    "id": "USR-125",
    "name": "Christina Alvarez",
    "email": "christina.alvarez@gmail.com",
    "walletAddress": "GDW5XCD43SO43UJRX54Z5XLO5Z6EFNXX3B55JDXJFR6ZCV3MWLFZPWTH",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-24"
  },
  {
    "id": "USR-126",
    "name": "Angelito Dimagiba",
    "email": "angelito.dimagiba@gmail.com",
    "walletAddress": "GBRDSFWPSCM5FE5DSI4ENLR6ZN35SRBOPI43KUTQI6LGMX7KZE5S35YG",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-25"
  },
  {
    "id": "USR-127",
    "name": "Corazon Aquino",
    "email": "corazon.aquino@gmail.com",
    "walletAddress": "GADAETKFITDV6RANXECHJH422YWUN5UCSQMEIMUEB2XBHSOKC5Q4TOLI",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-26"
  },
  {
    "id": "USR-128",
    "name": "Danilo Dizon",
    "email": "danilo.dizon@gmail.com",
    "walletAddress": "GAR4NXHAYGEODGM7WQ5E57H6VQREWMC6LUOMLVDGO4JOULJDLYEBHDSY",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-27"
  },
  {
    "id": "USR-129",
    "name": "Estrella Beltran",
    "email": "estrella.beltran@gmail.com",
    "walletAddress": "GCFYIH2RHI4BPIZWEFV5YFVJQCRSRNUJZPNHYJSPXVIS77LRODFQBLL5",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-28"
  },
  {
    "id": "USR-130",
    "name": "Felipe Valenzuela",
    "email": "felipe.valenzuela@gmail.com",
    "walletAddress": "GCEYQHGQ4RPZ2T6MY477OLESOKEKYAUY4GJQ3JWMEXGWIMTWDBAFBAYO",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-29"
  },
  {
    "id": "USR-131",
    "name": "Grace Tan",
    "email": "grace.tan@gmail.com",
    "walletAddress": "GC4LQK2G3AVK6CWYKF3QBETT65O7FC6EZVDVQIL4UBPW7AB27OOXXDEH",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-15"
  },
  {
    "id": "USR-132",
    "name": "Hector Lim",
    "email": "hector.lim@gmail.com",
    "walletAddress": "GB5IJOMUMXN37UKBG7S2MLJ4NEAJHVHURRYNA3DKCWB2DBOQ6NULKVSY",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-16"
  },
  {
    "id": "USR-133",
    "name": "Irene Sy",
    "email": "irene.sy@gmail.com",
    "walletAddress": "GA4ZYH4657BJ6E5GTXKKZLQUPZ3RVVCVMY5QW5KVBFFCDYDULPHDOGEC",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-17"
  },
  {
    "id": "USR-134",
    "name": "Joaquin Co",
    "email": "joaquin.co@gmail.com",
    "walletAddress": "GC3DYHKTGZWZ3UQ6CTUGGOWQUTKEMOM2NHFSUUGFRHEU5LMM7CIAZ7WE",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-18"
  },
  {
    "id": "USR-135",
    "name": "Katarina Go",
    "email": "katarina.go@gmail.com",
    "walletAddress": "GCPINYBZLHRHMEGFQYPGUOL6ZTRGC55DWVRFT2SDYHTU5YWZRNXKNMEA",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-19"
  },
  {
    "id": "USR-136",
    "name": "Leandro Ong",
    "email": "leandro.ong@gmail.com",
    "walletAddress": "GBCCV6IUKRWRFE7AHU7252P5SMAWA5H4NDAXZJYGYYPTAC6DT2YZZ6V3",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-20"
  },
  {
    "id": "USR-137",
    "name": "Marilou Tee",
    "email": "marilou.tee@gmail.com",
    "walletAddress": "GDZQBQV2UYB7NSXUERKVMKMX6OLMORSKJVGDPWFHSWUSPAWKLF3ZDQ6G",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-21"
  },
  {
    "id": "USR-138",
    "name": "Nestor Yap",
    "email": "nestor.yap@gmail.com",
    "walletAddress": "GBMYFDUBUJC7ZIH2IODCJ6AG3PZUL36JZBHL34KHJ6ZWWBVR5O37DVQS",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-22"
  },
  {
    "id": "USR-139",
    "name": "Olivia Uy",
    "email": "olivia.uy@gmail.com",
    "walletAddress": "GBYRBY6B65OIIHPRLNMV5XXOWTDZU3YZCJSOCPBJ5F3GGACNP32D263N",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-23"
  },
  {
    "id": "USR-140",
    "name": "Pedro Ang",
    "email": "pedro.ang@gmail.com",
    "walletAddress": "GDPTDUITKLUVDUXC27CA45PQXHSD3PXZ4Q4SSYJPXKMACUR3XGLR3V2G",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-24"
  },
  {
    "id": "USR-141",
    "name": "Quirino Dy",
    "email": "quirino.dy@gmail.com",
    "walletAddress": "GCJ6EKJX43GQ6UMIF4RZSXSBJDJS3T2DRL4PLVB6OEZ3HEXSP36PGPMX",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-25"
  },
  {
    "id": "USR-142",
    "name": "Rosario Lao",
    "email": "rosario.lao@gmail.com",
    "walletAddress": "GAQIEHAXW4V2OLR3H3TYL7VHDX4HRJF2XKC4PFJNO2KNE6UI3Y5Q7YYN",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-26"
  },
  {
    "id": "USR-143",
    "name": "Salvador King",
    "email": "salvador.king@gmail.com",
    "walletAddress": "GDU5LLL4BYVGXGBKO5VDMUJJZNDBMII24NXRF3UTUVMIPGJ7SMFJT3VW",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-27"
  },
  {
    "id": "USR-144",
    "name": "Trinidad Chua",
    "email": "trinidad.chua@gmail.com",
    "walletAddress": "GAHVRZG6BRM4WVA53DZETJMBIES3LN7M34YD5GC55UHPLDQFKP37JOPO",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-28"
  },
  {
    "id": "USR-145",
    "name": "Ursula See",
    "email": "ursula.see@gmail.com",
    "walletAddress": "GDQTH4U23IWEFCQGCJBAEWUZPYA5RCASPL5AMDPXVEAXC7ZTMEEXTGM3",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-29"
  },
  {
    "id": "USR-146",
    "name": "Vicente Poe",
    "email": "vicente.poe@gmail.com",
    "walletAddress": "GAMILN2QMGUZG55LHCHI3YRT3QYEWPICDHJPIRJGQHOF7E6N4ZJXBIRE",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-15"
  },
  {
    "id": "USR-147",
    "name": "Wilfredo Sy",
    "email": "wilfredo.sy@gmail.com",
    "walletAddress": "GC6LXWVFERTY5YHBWQFLHQBZJIJHZQUUWVNZ3BHGWEKNDQXUAZQP6CGR",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-16"
  },
  {
    "id": "USR-148",
    "name": "Ximena Cruz",
    "email": "ximena.cruz@gmail.com",
    "walletAddress": "GAHNMMS7HUT5773LIHU2BA6N7THAEH4ZXFQ47D6FPRGQCSKT65MH3EX6",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-17"
  },
  {
    "id": "USR-149",
    "name": "Yolanda Recto",
    "email": "yolanda.recto@gmail.com",
    "walletAddress": "GDRHRQCDJFGDVALG3GZ2AJLU4VIUW43DQWDHYSIKE2M53BQ4QVWAR6EA",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-18"
  },
  {
    "id": "USR-150",
    "name": "Zenaida Laurel",
    "email": "zenaida.laurel@gmail.com",
    "walletAddress": "GA3DEDDNDICJPO6N7FPWESKUP6HYRYDRIJCHA3FIQK3APIMMZY2MVUCX",
    "workspacesCount": 1,
    "status": "Active",
    "createdDate": "2026-07-19"
  }
];

const DEFAULT_DISPUTES: Dispute[] = [
  { id: 'DISP-901', orderId: '10524', merchant: "Nena's Sari-Sari Store", distributor: "Alaska Wholesale Manila", status: 'Open', createdDate: "2026-06-03", details: "Merchant claims goods were received damaged (Alaska Evaporated Milk cans were crushed). Logistics partner denies responsibility.", evidence: ["crushed_cans.jpg", "delivery_receipt.pdf"], notes: "Investigating courier logs." },
  { id: 'DISP-902', orderId: '10523', merchant: "Nena's Sari-Sari Store", distributor: "Coca-Cola Manila Bottlers", status: 'Resolved', createdDate: "2026-05-30", details: "Merchant reported short shipment (only received 8 out of 10 cases). Distributor verified warehouse stock count and refunded 2 cases.", evidence: ["short_shipment.jpg"], notes: "Refund released via smart contract trigger." }
];

const DEFAULT_TICKETS: SupportTicket[] = [
  { id: 'TCK-301', title: "Biometric Passkey Registration Failing", user: "Nena Radoc", status: 'Open', createdDate: "2026-06-03", details: "User gets error when registering Android biometric key. Recommended clearing cache or updating Chrome browser.", notes: "Follow up with Stellar wallet integration team." },
  { id: 'TCK-302', title: "Stellar Wallet Connection Timeout", user: "John Santos", status: 'Resolved', createdDate: "2026-06-01", details: "Freighter wallet extension timed out. Resolved after extension update.", notes: "Extension updated, works fine." }
];

const DEFAULT_ADMIN_LOGS: AdminLog[] = [
  { id: 'log-1', action: "Admin System Initiated", details: "SariPay Admin Console loaded successfully.", timestamp: "2026-06-04 08:00:00", adminUser: "admin@saripay.co" },
  { id: 'log-2', action: "Compliance Checklist Updated", details: "Compliance rules for Merchant onboarding updated by administrator.", timestamp: "2026-06-04 08:05:00", adminUser: "admin@saripay.co" }
];

const DEFAULT_ORDERS: Order[] = [
  {
    "id": "8942",
    "supplier": "Juan Wholesale & Logistics",
    "amount": "85.84",
    "status": "Delivered",
    "date": "2026-07-01",
    "details": "5x Great Taste Coffee Boxes, 10x Piattos",
    "merchantAddress": "GCISQDTKEEUGE5KUH7O7EEGKGTM7ZIVRABL275BOCSQNXPXTFIEX7UMO",
    "merchantName": "Maria's Sari-Sari Store"
  },
  {
    "id": "8941",
    "supplier": "Roberto Wholesale & Logistics",
    "amount": "56.63",
    "status": "Delivered",
    "date": "2026-07-02",
    "details": "12x Lucky Me Pancit Canton Bundles",
    "merchantAddress": "GAFYVG6BMZEPSQSZSHWJWQANNVNVMAF65HDGBBEEUC7FWTMZOC7ZL2T3",
    "merchantName": "Elena's Sari-Sari Store"
  },
  {
    "id": "8940",
    "supplier": "Carlos Wholesale & Logistics",
    "amount": "119.46",
    "status": "Funded",
    "date": "2026-07-03",
    "details": "8x Purefoods Corned Beef, 4x Magnolia Milk",
    "merchantAddress": "GBLZIIPNP54YEPAQQD7XY66XNRF2H6D75ZJRYD6SG3KVCGI7UEKAEDJ5",
    "merchantName": "Ana's Sari-Sari Store"
  },
  {
    "id": "8939",
    "supplier": "Jose Wholesale & Logistics",
    "amount": "95.57",
    "status": "Delivered",
    "date": "2026-07-04",
    "details": "15x Bear Brand Milk Powder 300g",
    "merchantAddress": "GC4HFMWIDH6YIERH6XQFCIWJLBIYGOUOKHXBHHABADWYQAQQRLXWIXZW",
    "merchantName": "Teresa's Sari-Sari Store"
  },
  {
    "id": "8938",
    "supplier": "Miguel Wholesale & Logistics",
    "amount": "69.91",
    "status": "In Transit",
    "date": "2026-07-05",
    "details": "20x 555 Sardines, 10x Argentina Corned Beef",
    "merchantAddress": "GBJEY254WBDZMGRVLAVIG44TDCNRGA53XW76NVQ7VIVTUUX6OE35OKWF",
    "merchantName": "Lucia's Sari-Sari Store"
  },
  {
    "id": "8937",
    "supplier": "Antonio Wholesale & Logistics",
    "amount": "140.20",
    "status": "Delivered",
    "date": "2026-07-06",
    "details": "4x Sacks Sinandomeng Rice 25kg",
    "merchantAddress": "GCER3IXWUVKREW6SYVJ6PK7OZQOCRVSBIKJ34LLEZRF7W6CHDO6VI2QB",
    "merchantName": "Rosa's Sari-Sari Store"
  },
  {
    "id": "8936",
    "supplier": "Francisco Wholesale & Logistics",
    "amount": "45.00",
    "status": "Funded",
    "date": "2026-07-07",
    "details": "10x Datu Puti Soy Sauce & Vinegar 1L",
    "merchantAddress": "GB5ERLEIEM7KJALHMDAG3UWZ4Y35ISRG4HRFMWT7YOBTJVMYS3KO46IT",
    "merchantName": "Sofia's Sari-Sari Store"
  },
  {
    "id": "8935",
    "supplier": "Gabriel Wholesale & Logistics",
    "amount": "110.50",
    "status": "Initialized",
    "date": "2026-07-08",
    "details": "6x Silver Swan Soy Sauce Gallons",
    "merchantAddress": "GBXTJC6QZXQ2DFGGNJKP3KB2GZCACLCFGZ2CRWF5UKN5EI54DZQ3YLEN",
    "merchantName": "Carmen's Sari-Sari Store"
  },
  {
    "id": "8934",
    "supplier": "Manuel Wholesale & Logistics",
    "amount": "88.00",
    "status": "Delivered",
    "date": "2026-07-09",
    "details": "15x Safeguard Soap 3-Packs",
    "merchantAddress": "GDT2QXGB2QJ5WYL7DUQX4ZEO55TIGDEXNJBJ2ALWBZC4OWREYARDQ5GX",
    "merchantName": "Isabel's Sari-Sari Store"
  },
  {
    "id": "8933",
    "supplier": "David Wholesale & Logistics",
    "amount": "65.25",
    "status": "Delivered",
    "date": "2026-07-10",
    "details": "8x Tide Powder Detergent 500g",
    "merchantAddress": "GD6VVCSH3EXG6WIP6CNGFIAOXFRXOWINLQI4SI7HP7FP6H3BRT3722KI",
    "merchantName": "Patricia's Sari-Sari Store"
  },
  {
    "id": "8932",
    "supplier": "Ramon Wholesale & Logistics",
    "amount": "78.50",
    "status": "Delivered",
    "date": "2026-07-11",
    "details": "12x Alaska Evaporated Milk 370ml",
    "merchantAddress": "GCWOT2QFMXORPQ4WZMHRFMXLCOGCIFUXWDVKMF2ZRHTLQ7JMQKFOJK2Q",
    "merchantName": "Esperanza's Sari-Sari Store"
  },
  {
    "id": "8931",
    "supplier": "Eduardo Wholesale & Logistics",
    "amount": "92.30",
    "status": "Delivered",
    "date": "2026-07-12",
    "details": "6x Golden Fiesta Cooking Oil 1L",
    "merchantAddress": "GBEN7MAIMHIBJFVALUSGMCKTPTCIUDMBJZT6ZYU7DKJQKQRHQUMT5CCI",
    "merchantName": "Lourdes's Sari-Sari Store"
  },
  {
    "id": "8930",
    "supplier": "Angelito Wholesale & Logistics",
    "amount": "135.00",
    "status": "Funded",
    "date": "2026-07-13",
    "details": "24x Nissin Cup Noodles 60g",
    "merchantAddress": "GDW5XCD43SO43UJRX54Z5XLO5Z6EFNXX3B55JDXJFR6ZCV3MWLFZPWTH",
    "merchantName": "Christina's Sari-Sari Store"
  },
  {
    "id": "8929",
    "supplier": "Danilo Wholesale & Logistics",
    "amount": "52.40",
    "status": "Delivered",
    "date": "2026-07-14",
    "details": "10x UFC Banana Ketchup 550g",
    "merchantAddress": "GADAETKFITDV6RANXECHJH422YWUN5UCSQMEIMUEB2XBHSOKC5Q4TOLI",
    "merchantName": "Corazon's Sari-Sari Store"
  },
  {
    "id": "8928",
    "supplier": "Felipe Wholesale & Logistics",
    "amount": "104.80",
    "status": "In Transit",
    "date": "2026-07-15",
    "details": "8x San Miguel Pale Pilsen Cases",
    "merchantAddress": "GCFYIH2RHI4BPIZWEFV5YFVJQCRSRNUJZPNHYJSPXVIS77LRODFQBLL5",
    "merchantName": "Estrella's Sari-Sari Store"
  },
  {
    "id": "8927",
    "supplier": "Hector Wholesale & Logistics",
    "amount": "85.84",
    "status": "Delivered",
    "date": "2026-07-16",
    "details": "5x Great Taste Coffee Boxes, 10x Piattos",
    "merchantAddress": "GC4LQK2G3AVK6CWYKF3QBETT65O7FC6EZVDVQIL4UBPW7AB27OOXXDEH",
    "merchantName": "Grace's Sari-Sari Store"
  },
  {
    "id": "8926",
    "supplier": "Joaquin Wholesale & Logistics",
    "amount": "56.63",
    "status": "Funded",
    "date": "2026-07-17",
    "details": "12x Lucky Me Pancit Canton Bundles",
    "merchantAddress": "GA4ZYH4657BJ6E5GTXKKZLQUPZ3RVVCVMY5QW5KVBFFCDYDULPHDOGEC",
    "merchantName": "Irene's Sari-Sari Store"
  },
  {
    "id": "8925",
    "supplier": "Leandro Wholesale & Logistics",
    "amount": "119.46",
    "status": "Initialized",
    "date": "2026-07-18",
    "details": "8x Purefoods Corned Beef, 4x Magnolia Milk",
    "merchantAddress": "GCPINYBZLHRHMEGFQYPGUOL6ZTRGC55DWVRFT2SDYHTU5YWZRNXKNMEA",
    "merchantName": "Katarina's Sari-Sari Store"
  },
  {
    "id": "8924",
    "supplier": "Nestor Wholesale & Logistics",
    "amount": "95.57",
    "status": "Delivered",
    "date": "2026-07-19",
    "details": "15x Bear Brand Milk Powder 300g",
    "merchantAddress": "GDZQBQV2UYB7NSXUERKVMKMX6OLMORSKJVGDPWFHSWUSPAWKLF3ZDQ6G",
    "merchantName": "Marilou's Sari-Sari Store"
  },
  {
    "id": "8923",
    "supplier": "Pedro Wholesale & Logistics",
    "amount": "69.91",
    "status": "Delivered",
    "date": "2026-07-20",
    "details": "20x 555 Sardines, 10x Argentina Corned Beef",
    "merchantAddress": "GBYRBY6B65OIIHPRLNMV5XXOWTDZU3YZCJSOCPBJ5F3GGACNP32D263N",
    "merchantName": "Olivia's Sari-Sari Store"
  },
  {
    "id": "8922",
    "supplier": "Rosario Wholesale & Logistics",
    "amount": "140.20",
    "status": "Delivered",
    "date": "2026-07-21",
    "details": "4x Sacks Sinandomeng Rice 25kg",
    "merchantAddress": "GCJ6EKJX43GQ6UMIF4RZSXSBJDJS3T2DRL4PLVB6OEZ3HEXSP36PGPMX",
    "merchantName": "Quirino's Sari-Sari Store"
  },
  {
    "id": "8921",
    "supplier": "Trinidad Wholesale & Logistics",
    "amount": "45.00",
    "status": "Delivered",
    "date": "2026-07-22",
    "details": "10x Datu Puti Soy Sauce & Vinegar 1L",
    "merchantAddress": "GDU5LLL4BYVGXGBKO5VDMUJJZNDBMII24NXRF3UTUVMIPGJ7SMFJT3VW",
    "merchantName": "Salvador's Sari-Sari Store"
  },
  {
    "id": "8920",
    "supplier": "Vicente Wholesale & Logistics",
    "amount": "110.50",
    "status": "Funded",
    "date": "2026-07-23",
    "details": "6x Silver Swan Soy Sauce Gallons",
    "merchantAddress": "GDQTH4U23IWEFCQGCJBAEWUZPYA5RCASPL5AMDPXVEAXC7ZTMEEXTGM3",
    "merchantName": "Ursula's Sari-Sari Store"
  },
  {
    "id": "8919",
    "supplier": "Ximena Wholesale & Logistics",
    "amount": "88.00",
    "status": "Delivered",
    "date": "2026-07-24",
    "details": "15x Safeguard Soap 3-Packs",
    "merchantAddress": "GC6LXWVFERTY5YHBWQFLHQBZJIJHZQUUWVNZ3BHGWEKNDQXUAZQP6CGR",
    "merchantName": "Wilfredo's Sari-Sari Store"
  },
  {
    "id": "8918",
    "supplier": "Zenaida Wholesale & Logistics",
    "amount": "65.25",
    "status": "In Transit",
    "date": "2026-07-25",
    "details": "8x Tide Powder Detergent 500g",
    "merchantAddress": "GDRHRQCDJFGDVALG3GZ2AJLU4VIUW43DQWDHYSIKE2M53BQ4QVWAR6EA",
    "merchantName": "Yolanda's Sari-Sari Store"
  },
  {
    "id": "8917",
    "supplier": "Juan Wholesale & Logistics",
    "amount": "78.50",
    "status": "Delivered",
    "date": "2026-07-26",
    "details": "12x Alaska Evaporated Milk 370ml",
    "merchantAddress": "GCISQDTKEEUGE5KUH7O7EEGKGTM7ZIVRABL275BOCSQNXPXTFIEX7UMO",
    "merchantName": "Maria's Sari-Sari Store"
  },
  {
    "id": "8916",
    "supplier": "Roberto Wholesale & Logistics",
    "amount": "92.30",
    "status": "Funded",
    "date": "2026-07-27",
    "details": "6x Golden Fiesta Cooking Oil 1L",
    "merchantAddress": "GAFYVG6BMZEPSQSZSHWJWQANNVNVMAF65HDGBBEEUC7FWTMZOC7ZL2T3",
    "merchantName": "Elena's Sari-Sari Store"
  },
  {
    "id": "8915",
    "supplier": "Carlos Wholesale & Logistics",
    "amount": "135.00",
    "status": "Initialized",
    "date": "2026-07-28",
    "details": "24x Nissin Cup Noodles 60g",
    "merchantAddress": "GBLZIIPNP54YEPAQQD7XY66XNRF2H6D75ZJRYD6SG3KVCGI7UEKAEDJ5",
    "merchantName": "Ana's Sari-Sari Store"
  },
  {
    "id": "8914",
    "supplier": "Jose Wholesale & Logistics",
    "amount": "52.40",
    "status": "Delivered",
    "date": "2026-07-01",
    "details": "10x UFC Banana Ketchup 550g",
    "merchantAddress": "GC4HFMWIDH6YIERH6XQFCIWJLBIYGOUOKHXBHHABADWYQAQQRLXWIXZW",
    "merchantName": "Teresa's Sari-Sari Store"
  },
  {
    "id": "8913",
    "supplier": "Miguel Wholesale & Logistics",
    "amount": "104.80",
    "status": "Delivered",
    "date": "2026-07-02",
    "details": "8x San Miguel Pale Pilsen Cases",
    "merchantAddress": "GBJEY254WBDZMGRVLAVIG44TDCNRGA53XW76NVQ7VIVTUUX6OE35OKWF",
    "merchantName": "Lucia's Sari-Sari Store"
  },
  {
    "id": "8912",
    "supplier": "Antonio Wholesale & Logistics",
    "amount": "85.84",
    "status": "Delivered",
    "date": "2026-07-03",
    "details": "5x Great Taste Coffee Boxes, 10x Piattos",
    "merchantAddress": "GCER3IXWUVKREW6SYVJ6PK7OZQOCRVSBIKJ34LLEZRF7W6CHDO6VI2QB",
    "merchantName": "Rosa's Sari-Sari Store"
  },
  {
    "id": "8911",
    "supplier": "Francisco Wholesale & Logistics",
    "amount": "56.63",
    "status": "Delivered",
    "date": "2026-07-04",
    "details": "12x Lucky Me Pancit Canton Bundles",
    "merchantAddress": "GB5ERLEIEM7KJALHMDAG3UWZ4Y35ISRG4HRFMWT7YOBTJVMYS3KO46IT",
    "merchantName": "Sofia's Sari-Sari Store"
  },
  {
    "id": "8910",
    "supplier": "Gabriel Wholesale & Logistics",
    "amount": "119.46",
    "status": "Funded",
    "date": "2026-07-05",
    "details": "8x Purefoods Corned Beef, 4x Magnolia Milk",
    "merchantAddress": "GBXTJC6QZXQ2DFGGNJKP3KB2GZCACLCFGZ2CRWF5UKN5EI54DZQ3YLEN",
    "merchantName": "Carmen's Sari-Sari Store"
  },
  {
    "id": "8909",
    "supplier": "Manuel Wholesale & Logistics",
    "amount": "95.57",
    "status": "Delivered",
    "date": "2026-07-06",
    "details": "15x Bear Brand Milk Powder 300g",
    "merchantAddress": "GDT2QXGB2QJ5WYL7DUQX4ZEO55TIGDEXNJBJ2ALWBZC4OWREYARDQ5GX",
    "merchantName": "Isabel's Sari-Sari Store"
  },
  {
    "id": "8908",
    "supplier": "David Wholesale & Logistics",
    "amount": "69.91",
    "status": "In Transit",
    "date": "2026-07-07",
    "details": "20x 555 Sardines, 10x Argentina Corned Beef",
    "merchantAddress": "GD6VVCSH3EXG6WIP6CNGFIAOXFRXOWINLQI4SI7HP7FP6H3BRT3722KI",
    "merchantName": "Patricia's Sari-Sari Store"
  },
  {
    "id": "8907",
    "supplier": "Ramon Wholesale & Logistics",
    "amount": "140.20",
    "status": "Delivered",
    "date": "2026-07-08",
    "details": "4x Sacks Sinandomeng Rice 25kg",
    "merchantAddress": "GCWOT2QFMXORPQ4WZMHRFMXLCOGCIFUXWDVKMF2ZRHTLQ7JMQKFOJK2Q",
    "merchantName": "Esperanza's Sari-Sari Store"
  },
  {
    "id": "8906",
    "supplier": "Eduardo Wholesale & Logistics",
    "amount": "45.00",
    "status": "Funded",
    "date": "2026-07-09",
    "details": "10x Datu Puti Soy Sauce & Vinegar 1L",
    "merchantAddress": "GBEN7MAIMHIBJFVALUSGMCKTPTCIUDMBJZT6ZYU7DKJQKQRHQUMT5CCI",
    "merchantName": "Lourdes's Sari-Sari Store"
  },
  {
    "id": "8905",
    "supplier": "Angelito Wholesale & Logistics",
    "amount": "110.50",
    "status": "Initialized",
    "date": "2026-07-10",
    "details": "6x Silver Swan Soy Sauce Gallons",
    "merchantAddress": "GDW5XCD43SO43UJRX54Z5XLO5Z6EFNXX3B55JDXJFR6ZCV3MWLFZPWTH",
    "merchantName": "Christina's Sari-Sari Store"
  },
  {
    "id": "8904",
    "supplier": "Danilo Wholesale & Logistics",
    "amount": "88.00",
    "status": "Delivered",
    "date": "2026-07-11",
    "details": "15x Safeguard Soap 3-Packs",
    "merchantAddress": "GADAETKFITDV6RANXECHJH422YWUN5UCSQMEIMUEB2XBHSOKC5Q4TOLI",
    "merchantName": "Corazon's Sari-Sari Store"
  },
  {
    "id": "8903",
    "supplier": "Felipe Wholesale & Logistics",
    "amount": "65.25",
    "status": "Delivered",
    "date": "2026-07-12",
    "details": "8x Tide Powder Detergent 500g",
    "merchantAddress": "GCFYIH2RHI4BPIZWEFV5YFVJQCRSRNUJZPNHYJSPXVIS77LRODFQBLL5",
    "merchantName": "Estrella's Sari-Sari Store"
  },
  {
    "id": "8902",
    "supplier": "Hector Wholesale & Logistics",
    "amount": "78.50",
    "status": "Delivered",
    "date": "2026-07-13",
    "details": "12x Alaska Evaporated Milk 370ml",
    "merchantAddress": "GC4LQK2G3AVK6CWYKF3QBETT65O7FC6EZVDVQIL4UBPW7AB27OOXXDEH",
    "merchantName": "Grace's Sari-Sari Store"
  },
  {
    "id": "8901",
    "supplier": "Joaquin Wholesale & Logistics",
    "amount": "92.30",
    "status": "Delivered",
    "date": "2026-07-14",
    "details": "6x Golden Fiesta Cooking Oil 1L",
    "merchantAddress": "GA4ZYH4657BJ6E5GTXKKZLQUPZ3RVVCVMY5QW5KVBFFCDYDULPHDOGEC",
    "merchantName": "Irene's Sari-Sari Store"
  },
  {
    "id": "8900",
    "supplier": "Leandro Wholesale & Logistics",
    "amount": "135.00",
    "status": "Funded",
    "date": "2026-07-15",
    "details": "24x Nissin Cup Noodles 60g",
    "merchantAddress": "GCPINYBZLHRHMEGFQYPGUOL6ZTRGC55DWVRFT2SDYHTU5YWZRNXKNMEA",
    "merchantName": "Katarina's Sari-Sari Store"
  },
  {
    "id": "8899",
    "supplier": "Nestor Wholesale & Logistics",
    "amount": "52.40",
    "status": "Delivered",
    "date": "2026-07-16",
    "details": "10x UFC Banana Ketchup 550g",
    "merchantAddress": "GDZQBQV2UYB7NSXUERKVMKMX6OLMORSKJVGDPWFHSWUSPAWKLF3ZDQ6G",
    "merchantName": "Marilou's Sari-Sari Store"
  },
  {
    "id": "8898",
    "supplier": "Pedro Wholesale & Logistics",
    "amount": "104.80",
    "status": "In Transit",
    "date": "2026-07-17",
    "details": "8x San Miguel Pale Pilsen Cases",
    "merchantAddress": "GBYRBY6B65OIIHPRLNMV5XXOWTDZU3YZCJSOCPBJ5F3GGACNP32D263N",
    "merchantName": "Olivia's Sari-Sari Store"
  },
  {
    "id": "8897",
    "supplier": "Rosario Wholesale & Logistics",
    "amount": "85.84",
    "status": "Delivered",
    "date": "2026-07-18",
    "details": "5x Great Taste Coffee Boxes, 10x Piattos",
    "merchantAddress": "GCJ6EKJX43GQ6UMIF4RZSXSBJDJS3T2DRL4PLVB6OEZ3HEXSP36PGPMX",
    "merchantName": "Quirino's Sari-Sari Store"
  },
  {
    "id": "8896",
    "supplier": "Trinidad Wholesale & Logistics",
    "amount": "56.63",
    "status": "Funded",
    "date": "2026-07-19",
    "details": "12x Lucky Me Pancit Canton Bundles",
    "merchantAddress": "GDU5LLL4BYVGXGBKO5VDMUJJZNDBMII24NXRF3UTUVMIPGJ7SMFJT3VW",
    "merchantName": "Salvador's Sari-Sari Store"
  },
  {
    "id": "8895",
    "supplier": "Vicente Wholesale & Logistics",
    "amount": "119.46",
    "status": "Initialized",
    "date": "2026-07-20",
    "details": "8x Purefoods Corned Beef, 4x Magnolia Milk",
    "merchantAddress": "GDQTH4U23IWEFCQGCJBAEWUZPYA5RCASPL5AMDPXVEAXC7ZTMEEXTGM3",
    "merchantName": "Ursula's Sari-Sari Store"
  },
  {
    "id": "8894",
    "supplier": "Ximena Wholesale & Logistics",
    "amount": "95.57",
    "status": "Delivered",
    "date": "2026-07-21",
    "details": "15x Bear Brand Milk Powder 300g",
    "merchantAddress": "GC6LXWVFERTY5YHBWQFLHQBZJIJHZQUUWVNZ3BHGWEKNDQXUAZQP6CGR",
    "merchantName": "Wilfredo's Sari-Sari Store"
  },
  {
    "id": "8893",
    "supplier": "Zenaida Wholesale & Logistics",
    "amount": "69.91",
    "status": "Delivered",
    "date": "2026-07-22",
    "details": "20x 555 Sardines, 10x Argentina Corned Beef",
    "merchantAddress": "GDRHRQCDJFGDVALG3GZ2AJLU4VIUW43DQWDHYSIKE2M53BQ4QVWAR6EA",
    "merchantName": "Yolanda's Sari-Sari Store"
  }
];

export default function AdminPortal() {
  const router = useRouter();

  // Authentication State
  const [adminSession, setAdminSession] = useState<{ email: string; role: string; name: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@saripay.co');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [loginRole, setLoginRole] = useState('Super Admin');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginStepText, setLoginStepText] = useState('');

  // Primary Platform States (synced with LocalStorage)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<'Overview' | 'Verification Queue' | 'Users' | 'Workspaces' | 'Escrows' | 'Transactions' | 'Disputes' | 'Analytics' | 'Support' | 'Settings'>('Overview');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Merchant' | 'Distributor' | 'Pending' | 'Approved' | 'Rejected' | 'Additional Information Required'>('All');

  // Selection states for Modals
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Review interaction states
  const [rejectionReason, setRejectionReason] = useState('');
  const [missingDocs, setMissingDocs] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isNotesSubmitting, setIsNotesSubmitting] = useState(false);
  
  // Notification banner state
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Load datasets on mount
  useEffect(() => {
    // Session load
    const storedSession = localStorage.getItem('saripay_admin_session');
    if (storedSession) {
      try {
        setAdminSession(JSON.parse(storedSession));
      } catch {
        // Ignore
      }
    }

    const loadAndSync = async () => {
      // First sync with the shared server database to get latest registrations/escrows
      const synced = await syncWithServer();
      
      const storedWorkspaces = localStorage.getItem('saripay_workspaces');
      if (storedWorkspaces) {
        try {
          const parsed = JSON.parse(storedWorkspaces);
          // Ensure default properties for mock verifications exist
          const merged = DEFAULT_WORKSPACES.map(def => {
            const match = parsed.find((w: Workspace) => w.id === def.id);
            return match ? { ...def, ...match } : def;
          });
          // Append any new user-created workspaces
          const newWorkspaces = parsed.filter((w: Workspace) => !DEFAULT_WORKSPACES.some(def => def.id === w.id));
          setWorkspaces([...merged, ...newWorkspaces]);
        } catch {
          setWorkspaces(DEFAULT_WORKSPACES);
        }
      } else {
        setWorkspaces(DEFAULT_WORKSPACES);
      }

      // Orders load
      const storedOrders = localStorage.getItem('saripay_orders');
      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch {
          setOrders(DEFAULT_ORDERS);
        }
      } else {
        setOrders(DEFAULT_ORDERS);
      }

      // Users load
      const storedUsers = localStorage.getItem('saripay_users');
      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch {
          setUsers(DEFAULT_USERS);
        }
      } else {
        setUsers(DEFAULT_USERS);
      }

      // Disputes load
      const storedDisputes = localStorage.getItem('saripay_disputes');
      if (storedDisputes) {
        try {
          setDisputes(JSON.parse(storedDisputes));
        } catch {
          setDisputes(DEFAULT_DISPUTES);
        }
      } else {
        setDisputes(DEFAULT_DISPUTES);
      }

      // Tickets load
      const storedTickets = localStorage.getItem('saripay_support_tickets');
      if (storedTickets) {
        try {
          setTickets(JSON.parse(storedTickets));
        } catch {
          setTickets(DEFAULT_TICKETS);
        }
      } else {
        setTickets(DEFAULT_TICKETS);
      }

      // Admin Logs load
      const storedLogs = localStorage.getItem('saripay_admin_logs');
      if (storedLogs) {
        try {
          setAdminLogs(JSON.parse(storedLogs));
        } catch {
          setAdminLogs(DEFAULT_ADMIN_LOGS);
        }
      } else {
        setAdminLogs(DEFAULT_ADMIN_LOGS);
      }
    };

    loadAndSync();
  }, []);

  // Periodic LocalStorage syncing loop to capture real-time user-level requests
  useEffect(() => {
    if (!adminSession) return;
    const interval = setInterval(async () => {
      const synced = await syncWithServer();
      if (!synced) return;

      // Workspaces sync (merge synced user workspaces with default mock workspaces)
      setWorkspaces(prev => {
        const merged = DEFAULT_WORKSPACES.map(def => {
          const match = synced.workspaces.find((w: any) => w.id === def.id);
          return match ? { ...def, ...match } : def;
        });
        const newItems = synced.workspaces.filter((w: any) => !DEFAULT_WORKSPACES.some(def => def.id === w.id));
        const finalItems = [...merged, ...newItems];

        if (JSON.stringify(prev.map(w => ({ id: w.id, status: w.verificationStatus }))) !==
            JSON.stringify(finalItems.map((w: any) => ({ id: w.id, status: w.verificationStatus })))) {
          return finalItems;
        }
        return prev;
      });

      // Orders sync (merge synced user orders with default mock orders)
      setOrders(prev => {
        const merged = DEFAULT_ORDERS.map(def => {
          const match = synced.orders.find((o: any) => o.id === def.id);
          return match ? { ...def, ...match } : def;
        });
        const newItems = synced.orders.filter((o: any) => !DEFAULT_ORDERS.some(def => def.id === o.id));
        const finalItems = [...merged, ...newItems];

        if (JSON.stringify(prev.map(o => ({ id: o.id, status: o.status }))) !==
            JSON.stringify(finalItems.map((o: any) => ({ id: o.id, status: o.status })))) {
          return finalItems;
        }
        return prev;
      });

      // Users sync (merge default mock users with synced users)
      if (synced.users) {
        setUsers(prev => {
          const merged = DEFAULT_USERS.map(def => {
            const match = synced.users.find((u: any) => u.id === def.id);
            return match ? { ...def, ...match } : def;
          });
          const newItems = synced.users.filter((u: any) => !DEFAULT_USERS.some(def => def.id === u.id));
          return [...merged, ...newItems];
        });
      }

      // Disputes sync (merge default mock disputes with synced disputes)
      if (synced.disputes) {
        setDisputes(prev => {
          const merged = DEFAULT_DISPUTES.map(def => {
            const match = synced.disputes.find((d: any) => d.id === def.id);
            return match ? { ...def, ...match } : def;
          });
          const newItems = synced.disputes.filter((d: any) => !DEFAULT_DISPUTES.some(def => def.id === d.id));
          return [...merged, ...newItems];
        });
      }

      // Support Tickets sync (merge default mock tickets with synced tickets)
      if (synced.tickets) {
        setTickets(prev => {
          const merged = DEFAULT_TICKETS.map(def => {
            const match = synced.tickets.find((t: any) => t.id === def.id);
            return match ? { ...def, ...match } : def;
          });
          const newItems = synced.tickets.filter((t: any) => !DEFAULT_TICKETS.some(def => def.id === t.id));
          return [...merged, ...newItems];
        });
      }

      // Admin Logs sync (merge default mock logs with synced logs)
      if (synced.adminLogs) {
        setAdminLogs(prev => {
          const merged = DEFAULT_ADMIN_LOGS.map(def => {
            const match = synced.adminLogs.find((l: any) => l.id === def.id);
            return match ? { ...def, ...match } : def;
          });
          const newItems = synced.adminLogs.filter((l: any) => !DEFAULT_ADMIN_LOGS.some(def => def.id === l.id));
          return [...merged, ...newItems];
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [adminSession]);

  // Log write helper
  const addAdminLog = (action: string, details: string, workspaceName?: string) => {
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      action,
      workspace: workspaceName,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminUser: adminSession?.email || 'admin@saripay.co'
    };
    const updated = [newLog, ...adminLogs];
    setAdminLogs(updated);
    localStorage.setItem('saripay_admin_logs', JSON.stringify(updated));
    // Push the compliance or admin changes to the shared server database asynchronously
    syncWithServer().catch(err => console.error("Failed to sync after addAdminLog:", err));
  };

  // Toast helper
  const triggerNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Mock Biometric / Passkey Login Simulation
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginEmail !== 'admin@saripay.co' || loginPassword !== 'admin') {
      setLoginError('Invalid Administrator credentials. Please verify and retry.');
      return;
    }

    setIsLoggingIn(true);
    try {
      setLoginStepText('Reading hardware biometric key...');
      await new Promise(res => setTimeout(res, 800));
      setLoginStepText('Validating cryptographic passkey signatures...');
      await new Promise(res => setTimeout(res, 900));
      setLoginStepText('Authorizing admin credentials on ledger...');
      await new Promise(res => setTimeout(res, 600));

      const session = {
        email: loginEmail,
        role: loginRole,
        name: `SariPay ${loginRole}`
      };
      setAdminSession(session);
      localStorage.setItem('saripay_admin_session', JSON.stringify(session));

      // Append login log
      const newLog: AdminLog = {
        id: `log-${Date.now()}`,
        action: "Admin Login Successful",
        details: `Administrator logged in with role: ${loginRole}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        adminUser: loginEmail
      };
      const updatedLogs = [newLog, ...adminLogs];
      setAdminLogs(updatedLogs);
      localStorage.setItem('saripay_admin_logs', JSON.stringify(updatedLogs));

      triggerNotification('success', `Welcome back, ${session.name}!`);
    } catch {
      setLoginError('Security handshake failed. Biometric authentication timed out.');
    } finally {
      setIsLoggingIn(false);
      setLoginStepText('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('saripay_admin_session');
    setAdminSession(null);
    triggerNotification('info', 'Logged out of Operations Portal.');
  };

  // Reset Demo Configuration
  const handleResetData = async () => {
    if (!confirm('Are you sure you want to restore default simulator data? This resets all verifications, disputes, users, and logs.')) return;
    
    const resetPayload = {
      workspaces: DEFAULT_WORKSPACES,
      orders: DEFAULT_ORDERS,
      users: DEFAULT_USERS,
      disputes: DEFAULT_DISPUTES,
      tickets: DEFAULT_TICKETS,
      adminLogs: DEFAULT_ADMIN_LOGS,
    };

    localStorage.setItem('saripay_workspaces', JSON.stringify(DEFAULT_WORKSPACES));
    localStorage.setItem('saripay_orders', JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem('saripay_users', JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('saripay_disputes', JSON.stringify(DEFAULT_DISPUTES));
    localStorage.setItem('saripay_support_tickets', JSON.stringify(DEFAULT_TICKETS));
    localStorage.setItem('saripay_admin_logs', JSON.stringify(DEFAULT_ADMIN_LOGS));
    
    setWorkspaces(DEFAULT_WORKSPACES);
    setOrders(DEFAULT_ORDERS);
    setUsers(DEFAULT_USERS);
    setDisputes(DEFAULT_DISPUTES);
    setTickets(DEFAULT_TICKETS);
    setAdminLogs(DEFAULT_ADMIN_LOGS);

    // Hard reset the server state
    await syncWithServer(true, resetPayload);

    triggerNotification('success', 'Simulator data re-seeded to default defaults successfully.');
    addAdminLog("Simulator Data Reset", "Re-seeded workspaces, orders, and logs to baseline settings.");
  };

  // Platform Metrics calculations
  const platformMetrics = useMemo(() => {
    const merchantCount = workspaces.filter(w => w.type === 'merchant').length;
    const distributorCount = workspaces.filter(w => w.type === 'distributor').length;
    
    let totalEscrowAmount = 0;
    let activeEscrows = 0;
    let completedEscrows = 0;
    let failedEscrows = 0;
    let totalLocked = 0;
    let totalSettled = 0;

    orders.forEach(o => {
      const amt = parseFloat(o.amount) || 0;
      totalEscrowAmount += amt;
      if (o.status === 'Funded' || o.status === 'In Transit') {
        activeEscrows += 1;
        totalLocked += amt;
      } else if (o.status === 'Delivered') {
        completedEscrows += 1;
        totalSettled += amt;
      } else if (o.status === 'Canceled') {
        failedEscrows += 1;
      }
    });

    const pendingVerifications = workspaces.filter(w => w.verificationStatus === 'Pending Review').length;
    const openDisputes = disputes.filter(d => d.status === 'Open').length;
    const successRate = orders.length > 0 
      ? Math.round((orders.filter(o => o.status === 'Delivered').length / orders.filter(o => o.status !== 'Initialized').length || 1) * 100)
      : 100;

    return {
      merchantCount,
      distributorCount,
      totalWorkspaces: workspaces.length,
      totalEscrowVolume: totalEscrowAmount + 41250, // base simulated premium volume
      activeEscrows,
      completedEscrows,
      failedEscrows,
      totalLockedFunds: totalLocked,
      totalSettledFunds: totalSettled + 39800,
      pendingVerifications,
      openDisputes,
      successRate: Math.min(successRate, 100)
    };
  }, [workspaces, orders, disputes]);

  // Actions: VERIFICATION APPROVAL FLOW
  const handleApproveVerification = (wsId: string) => {
    const updated = workspaces.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          verificationStatus: 'Verified' as const,
          statusUpdatedAt: Date.now(),
          rejectionReason: undefined,
          missingDocs: undefined,
          internalNotes: internalNotes.trim() || w.internalNotes
        };
      }
      return w;
    });

    const target = workspaces.find(w => w.id === wsId);
    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));
    
    // Add audit log
    addAdminLog("Workspace Verification Approved", `Approved compliance credentials for workspace "${target?.name}". Unlocked platform operations.`, target?.name);
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#059669', '#10B981', '#ffffff']
    });

    triggerNotification('success', 'Workspace Verified Successfully. On-chain credentials activated.');
    setSelectedWorkspace(null);
    setInternalNotes('');
  };

  // Actions: VERIFICATION REJECTION FLOW
  const handleRejectVerification = (wsId: string) => {
    if (!rejectionReason.trim()) {
      alert("A clear rejection reason is required for compliance tracking.");
      return;
    }

    const updated = workspaces.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          verificationStatus: 'Rejected' as const,
          statusUpdatedAt: Date.now(),
          rejectionReason: rejectionReason.trim(),
          internalNotes: internalNotes.trim() || w.internalNotes
        };
      }
      return w;
    });

    const target = workspaces.find(w => w.id === wsId);
    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));

    addAdminLog("Workspace Verification Rejected", `Rejected verification for workspace "${target?.name}". Reason: ${rejectionReason}`, target?.name);
    triggerNotification('error', `Workspace credentials rejected. User notified.`);
    
    setSelectedWorkspace(null);
    setRejectionReason('');
    setInternalNotes('');
  };

  // Actions: REQUEST ADDITIONAL INFORMATION FLOW
  const handleRequestInfoVerification = (wsId: string) => {
    if (!missingDocs.trim()) {
      alert("Please specify the missing documents or required corrections.");
      return;
    }

    const updated = workspaces.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          verificationStatus: 'Requires Additional Information' as const,
          statusUpdatedAt: Date.now(),
          missingDocs: missingDocs.trim(),
          internalNotes: internalNotes.trim() || w.internalNotes
        };
      }
      return w;
    });

    const target = workspaces.find(w => w.id === wsId);
    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));

    addAdminLog("Verification Information Requested", `Requested additional documents for workspace "${target?.name}". Missing requirements: ${missingDocs}`, target?.name);
    triggerNotification('info', `Information request submitted. Workspace set to Requires Info.`);

    setSelectedWorkspace(null);
    setMissingDocs('');
    setInternalNotes('');
  };

  // Actions: USER STATUS TOGGLE (Suspend/Reactivate)
  const handleToggleUserStatus = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const newStatus: 'Active' | 'Suspended' = target.status === 'Active' ? 'Suspended' : 'Active';
    const updated = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);

    setUsers(updated);
    localStorage.setItem('saripay_users', JSON.stringify(updated));

    addAdminLog(
      newStatus === 'Suspended' ? "User Account Suspended" : "User Account Reactivated",
      `${newStatus === 'Suspended' ? 'Suspended' : 'Reactivated'} account access for user ${target.name} (${target.email}).`
    );

    triggerNotification(newStatus === 'Suspended' ? 'error' : 'success', `User account ${target.name} has been ${newStatus === 'Suspended' ? 'suspended' : 'reactivated'}.`);
    
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  // Actions: WORKSPACE STATUS TOGGLE (Suspend/Reactivate)
  const handleToggleWorkspaceStatus = (wsId: string) => {
    const target = workspaces.find(w => w.id === wsId);
    if (!target) return;

    // Toggle: if Verified/Pending/Unverified/Requires, we can suspend it. If suspended (Rejected or custom status), let's toggle.
    // For MVP workspace suspension, let's toggle status to 'Rejected' (or a Suspended status) or save toggle action.
    const isSuspended = target.verificationStatus === 'Rejected';
    const nextStatus: Workspace['verificationStatus'] = isSuspended ? 'Verified' : 'Rejected';
    
    const updated = workspaces.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          verificationStatus: nextStatus,
          statusUpdatedAt: Date.now(),
          rejectionReason: isSuspended ? undefined : "Suspended by Platform Administrator for compliance review."
        };
      }
      return w;
    });

    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));

    addAdminLog(
      isSuspended ? "Workspace Re-activated" : "Workspace Suspended",
      `${isSuspended ? 'Reactivated' : 'Suspended'} workspace "${target.name}".`,
      target.name
    );

    triggerNotification(isSuspended ? 'success' : 'error', `Workspace "${target.name}" has been ${isSuspended ? 'reactivated' : 'suspended'}.`);
    setSelectedWorkspace(null);
  };

  const handleDeleteWorkspaceAdmin = (wsId: string) => {
    const target = workspaces.find(w => w.id === wsId);
    if (!target) return;

    if (!confirm(`Are you sure you want to permanently delete workspace "${target.name}"? This action cannot be undone.`)) {
      return;
    }

    const updated = workspaces.filter(w => w.id !== wsId);
    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));

    // Track the deletion for sync
    try {
      const deletedIds = JSON.parse(localStorage.getItem('saripay_deleted_workspace_ids') || '[]');
      if (!deletedIds.includes(wsId)) {
        deletedIds.push(wsId);
        localStorage.setItem('saripay_deleted_workspace_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {
      localStorage.setItem('saripay_deleted_workspace_ids', JSON.stringify([wsId]));
    }

    addAdminLog(
      "Workspace Deleted",
      `Permanently deleted workspace "${target.name}" from the system.`,
      target.name
    );

    triggerNotification('error', `Workspace "${target.name}" has been permanently deleted.`);
  };

  // Actions: DISPUTES RESOLVE FLOW
  const handleResolveDispute = (dispId: string, status: 'Resolved' | 'Closed') => {
    const updated = disputes.map(d => {
      if (d.id === dispId) {
        return { ...d, status, notes: internalNotes || d.notes };
      }
      return d;
    });

    const target = disputes.find(d => d.id === dispId);
    setDisputes(updated);
    localStorage.setItem('saripay_disputes', JSON.stringify(updated));

    addAdminLog(
      status === 'Resolved' ? "Dispute Resolved" : "Dispute Closed",
      `Marked dispute ${dispId} for Order #${target?.orderId} as ${status}. Note: ${internalNotes || 'None'}`
    );

    triggerNotification('success', `Dispute ${dispId} is now ${status}.`);
    setSelectedDispute(null);
    setInternalNotes('');
  };

  // Actions: ADD INTERNAL NOTES TO WORKSPACE
  const handleSaveInternalNotes = (e: React.FormEvent, wsId: string) => {
    e.preventDefault();
    setIsNotesSubmitting(true);
    
    const updated = workspaces.map(w => {
      if (w.id === wsId) {
        return { ...w, internalNotes };
      }
      return w;
    });

    setWorkspaces(updated);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));
    
    addAdminLog("Workspace Note Added", `Updated internal administrative review note on workspace ID: ${wsId}`);
    triggerNotification('success', 'Internal notes updated successfully.');
    setIsNotesSubmitting(false);
  };

  // Filters for Verification Table
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter(w => {
      // Type Filters
      if (verificationFilter === 'Merchant' && w.type !== 'merchant') return false;
      if (verificationFilter === 'Distributor' && w.type !== 'distributor') return false;
      if (verificationFilter === 'Pending' && w.verificationStatus !== 'Pending Review') return false;
      if (verificationFilter === 'Approved' && w.verificationStatus !== 'Verified') return false;
      if (verificationFilter === 'Rejected' && w.verificationStatus !== 'Rejected') return false;
      if (verificationFilter === 'Additional Information Required' && w.verificationStatus !== 'Requires Additional Information') return false;

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = w.name?.toLowerCase().includes(q);
        const matchesOwner = w.ownerName?.toLowerCase().includes(q) || w.contactPerson?.toLowerCase().includes(q);
        const matchesId = w.id?.toLowerCase().includes(q);
        const matchesWallet = w.walletAddress?.toLowerCase().includes(q);
        return matchesName || matchesOwner || matchesId || matchesWallet;
      }

      return true;
    });
  }, [workspaces, verificationFilter, searchQuery]);

  // Formatted date string utility
  const formatDateTime = (str: string) => {
    if (!str) return '';
    return str;
  };

  // Render Login overlay if session is missing
  if (!adminSession) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <Building className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">SariPay<span className="text-emerald-600 font-semibold text-sm ml-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">Operations</span></span>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Access Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Secure compliance, verification, and support monitor console
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 border border-slate-200 rounded-2xl shadow-xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Admin Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                    placeholder="admin@saripay.co"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Admin Role Scope
                </label>
                <div className="mt-1 relative">
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium bg-white"
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Operations Admin">Operations Admin</option>
                    <option value="Compliance Admin">Compliance Admin</option>
                    <option value="Support Admin">Support Admin</option>
                  </select>
                </div>
              </div>

              {loginError && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-xs font-semibold text-red-800">{loginError}</span>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="animate-spin h-4 w-4" />
                      <span>{loginStepText || 'Processing credentials...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Fingerprint className="h-4 w-4" />
                      <span>Biometric Passkey Login</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 text-xs text-emerald-800 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>Interactive MVP Login Instructions</span>
                </div>
                <p className="text-emerald-700">
                  Authentication is separate from distributor or store login. Click the button to simulate a biometric passkey scan (default credentials are pre-filled).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-bounce transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> :
           notification.type === 'error' ? <XCircle className="h-5 w-5 text-red-600" /> :
           <Info className="h-5 w-5 text-blue-600" />}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 flex-shrink-0">
        {/* Brand Lockup */}
        <div className="h-16 px-6 flex items-center border-b border-slate-800 gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">SariPay</span>
            <span className="text-[10px] text-emerald-400 font-bold block leading-none">ADMIN OPERATIONS</span>
          </div>
        </div>

        {/* Admin info bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              SA
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{adminSession.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{adminSession.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            title="Log out" 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'Verification Queue', icon: ClipboardCheck, label: 'Verification Queue', badge: platformMetrics.pendingVerifications },
            { id: 'Users', icon: Users, label: 'Users' },
            { id: 'Workspaces', icon: Store, label: 'Workspaces' },
            { id: 'Escrows', icon: Lock, label: 'Escrows' },
            { id: 'Transactions', icon: RefreshCw, label: 'Transactions' },
            { id: 'Disputes', icon: ShieldAlert, label: 'Disputes', badge: platformMetrics.openDisputes },
            { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'Support', icon: MessageSquare, label: 'Support' },
            { id: 'Settings', icon: Settings, label: 'Security & Settings' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer section */}
        <div className="p-4 border-t border-slate-800 text-center text-[10px] text-slate-500 font-medium">
          SariPay Operations Console v1.0.0
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="px-3.5 py-1.5 border border-amber-200 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Reset Demo Data
            </button>
            <span className="h-4 w-px bg-slate-200"></span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-500">Live Syncing Enabled</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest text-emerald-700">SariPay Platform Status</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Platform Overview</h2>
              </div>

              {/* 9 Metric Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Total Merchants", value: platformMetrics.merchantCount, sub: "Registered stores", type: "success" },
                  { label: "Total Distributors", value: platformMetrics.distributorCount, sub: "Verified suppliers", type: "success" },
                  { label: "Total Workspaces", value: platformMetrics.totalWorkspaces, sub: "Operational units", type: "success" },
                  { label: "Total Escrow Volume", value: `$${platformMetrics.totalEscrowVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, sub: "Stellar ledger volume", type: "primary" },
                  { label: "Active Escrows", value: platformMetrics.activeEscrows, sub: "Locked in smart contracts", type: "primary" },
                  { label: "Completed Escrows", value: platformMetrics.completedEscrows, sub: "Payout settled", type: "primary" },
                  { label: "Pending Verifications", value: platformMetrics.pendingVerifications, sub: "Awaiting compliance check", type: "warning", highlight: platformMetrics.pendingVerifications > 0 },
                  { label: "Open Disputes", value: platformMetrics.openDisputes, sub: "Awaiting review", type: "danger", highlight: platformMetrics.openDisputes > 0 },
                  { label: "Settlement Success Rate", value: `${platformMetrics.successRate}%`, sub: "Deliveries completed", type: "success" }
                ].map((card, idx) => (
                  <div key={idx} className={`bg-white p-6 border border-slate-200 rounded-2xl transition-all shadow-sm ${
                    card.highlight ? 'ring-2 ring-emerald-500/20 border-emerald-400' : ''
                  }`}>
                    <span className="text-xs font-semibold text-slate-400 block">{card.label}</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</span>
                      {card.highlight && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500 block mt-2">{card.sub}</span>
                  </div>
                ))}
              </div>

              {/* Feed and Quick Verification list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Verification Requests */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600" />
                      Pending Workspace Verifications
                    </h3>
                    <button 
                      onClick={() => setActiveTab('Verification Queue')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      View All ({platformMetrics.pendingVerifications})
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 flex-1">
                    {workspaces.filter(w => w.verificationStatus === 'Pending Review').length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500/30 mx-auto mb-2" />
                        No pending verification requests. Queue is empty!
                      </div>
                    ) : (
                      workspaces.filter(w => w.verificationStatus === 'Pending Review').map((ws) => (
                        <div key={ws.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                              {ws.type === 'merchant' ? <Store className="h-5 w-5 text-slate-600" /> : <Building className="h-5 w-5 text-slate-600" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{ws.name}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                  {ws.type}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 block">
                                Submitted on: {ws.submittedDate || 'Recently'} by {ws.ownerName || ws.contactPerson || 'Store Owner'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedWorkspace(ws)}
                            className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/10"
                          >
                            Review Request
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Platform activity feed */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Database className="h-4.5 w-4.5 text-emerald-600" />
                      Recent Activity Feed
                    </h3>
                  </div>
                  <div className="p-6 space-y-5 overflow-y-auto flex-1 max-h-[350px]">
                    {adminLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="flex gap-3">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-955 block leading-tight">{log.action}</span>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">{log.details}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION QUEUE */}
          {activeTab === 'Verification Queue' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Compliance Dashboard</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Workspace Verification Queue</h2>
              </div>

              {/* Filters Header */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'All', label: 'All Requests' },
                    { id: 'Merchant', label: 'Merchants' },
                    { id: 'Distributor', label: 'Distributors' },
                    { id: 'Pending', label: 'Pending Review' },
                    { id: 'Approved', label: 'Approved (Verified)' },
                    { id: 'Rejected', label: 'Rejected' },
                    { id: 'Additional Information Required', label: 'Requires Info' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setVerificationFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        verificationFilter === f.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Verification ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Name</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Owner / Contact</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Date</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredWorkspaces.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                          No matching verification requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredWorkspaces.map((ws) => {
                        const isPending = ws.verificationStatus === 'Pending Review';
                        return (
                          <tr key={ws.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs font-bold text-slate-900">
                              {ws.id.replace('ws-', 'V-').substring(0, 10).toUpperCase()}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-slate-955">
                              {ws.name}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs uppercase font-extrabold text-slate-500">
                              {ws.type}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-600 font-medium">
                              {ws.ownerName || ws.contactPerson || 'N/A'}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-500">
                              {ws.submittedDate || '2026-06-04'}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs font-semibold">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                ws.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                ws.verificationStatus === 'Pending Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                ws.verificationStatus === 'Requires Additional Information' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                ws.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                                'bg-slate-50 text-slate-700 border border-slate-200'
                              }`}>
                                {ws.verificationStatus || 'Unverified'}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-xs font-bold">
                              <button
                                onClick={() => {
                                  setSelectedWorkspace(ws);
                                  setRejectionReason(ws.rejectionReason || '');
                                  setMissingDocs(ws.missingDocs || '');
                                  setInternalNotes(ws.internalNotes || '');
                                }}
                                className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                {isPending ? 'Review & Decision' : 'View Credentials'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USERS */}
          {activeTab === 'Users' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Platform Directory</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-sans">Users Management</h2>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">User ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Wallet Address</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Workspaces</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-medium">
                    {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-bold text-slate-900">{usr.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-955">{usr.name}</td>
                        <td className="px-6 py-4 text-slate-600">{usr.email}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{usr.walletAddress}</td>
                        <td className="px-6 py-4 font-semibold">{usr.workspacesCount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            usr.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {usr.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => setSelectedUser(usr)}
                            className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-bold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(usr.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-white transition-colors ${
                              usr.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {usr.status === 'Active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WORKSPACES */}
          {activeTab === 'Workspaces' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Platform Architecture</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Workspace Management</h2>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search workspace properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Workspace Name</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Owner/Contact</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Verification Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Escrow Volume</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {workspaces.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.type.includes(searchQuery.toLowerCase())).map((ws) => (
                      <tr key={ws.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-bold text-slate-955">{ws.name}</td>
                        <td className="px-6 py-4 uppercase font-bold text-slate-400">{ws.type}</td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{ws.ownerName || ws.contactPerson || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ws.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            ws.verificationStatus === 'Pending Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            ws.verificationStatus === 'Requires Additional Information' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {ws.verificationStatus || 'Unverified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {ws.type === 'merchant' ? '$2,450.00 XLM' : '$12,800.00 XLM'}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => {
                              setSelectedWorkspace(ws);
                              setRejectionReason(ws.rejectionReason || '');
                              setMissingDocs(ws.missingDocs || '');
                              setInternalNotes(ws.internalNotes || '');
                            }}
                            className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-bold"
                          >
                            Review Verification
                          </button>
                          <button
                            onClick={() => handleToggleWorkspaceStatus(ws.id)}
                            className="px-2.5 py-1 border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg font-bold"
                          >
                            {ws.verificationStatus === 'Rejected' ? 'Reactivate' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => handleDeleteWorkspaceAdmin(ws.id)}
                            className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg font-bold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ESCROWS (READ-ONLY) */}
          {activeTab === 'Escrows' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Smart Contract Ledger</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Escrow Operations Monitor</h2>
              </div>

              {/* View Only Smart Contract Banner Disclaimer */}
              <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row gap-5 items-start">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <LockKeyhole className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-xs uppercase font-extrabold text-emerald-500 tracking-wider">VIEW ONLY BOUNDARY LIMIT</span>
                  <h4 className="font-extrabold text-base tracking-tight">Decentralized Escrow Smart Contract Controlled</h4>
                  <p className="text-xs text-slate-400 max-w-2xl leading-normal">
                    Admins do not possess private keys capable of releasing, altering, or executing customer payments. All logistics payouts are governed strictly by Stellar Soroban smart contracts, requiring cryptographic multi-sig signatures, delivery receipts, or order delivery triggers from merchants and distributors.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 border border-slate-800 bg-slate-900 rounded-xl text-xs font-bold text-slate-400">
                  View-Only Admin Mode
                </span>
              </div>

              {/* Metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: "Active Escrows", value: platformMetrics.activeEscrows },
                  { label: "Completed Settlement Escrows", value: platformMetrics.completedEscrows },
                  { label: "Total Locked Funds", value: `$${platformMetrics.totalLockedFunds.toFixed(2)} XLM` },
                  { label: "Total Settled Payouts", value: `$${platformMetrics.totalSettledFunds.toLocaleString()} XLM` }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block">{card.label}</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{card.value}</span>
                  </div>
                ))}
              </div>

              {/* Escrow Orders Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Escrow Ledger Monitor</h3>
                </div>
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Escrow ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Merchant</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Supplier</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Date Initialized</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-medium">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-bold text-slate-900">ESC-{ord.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-955">{ord.merchantName || "Merchant Store"}</td>
                        <td className="px-6 py-4 text-slate-700">{ord.supplier}</td>
                        <td className="px-6 py-4 font-bold text-slate-955">${ord.amount} XLM</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            ord.status === 'Funded' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            ord.status === 'In Transit' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: TRANSACTIONS */}
          {activeTab === 'Transactions' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Ledger Operations</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">On-Chain Transaction Monitor</h2>
              </div>

              {/* Transactions list */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Wallet Key Address</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Transaction Type</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                    {[
                      { txId: "tx_018276f5716...", wallet: "GBSARIMERCHANT123XYZ", amount: "45.50 XLM", type: "Fund Escrow", status: "Success", time: "2026-06-04 10:14:02" },
                      { txId: "tx_01928374a2b...", wallet: "GBSARIDIST777ALAS", amount: "10.00 XLM", type: "Initialize Escrow", status: "Success", time: "2026-06-04 09:22:15" },
                      { txId: "tx_0110928cd34...", wallet: "GBSARIMERCHANT456ABC", amount: "80.00 XLM", type: "Release Payout", status: "Success", time: "2026-06-03 16:45:10" },
                      { txId: "tx_012837ff221...", wallet: "GBSARIMERCHANT456ABC", amount: "25.00 XLM", type: "Fund Escrow", status: "Success", time: "2026-06-03 11:30:00" },
                      { txId: "tx_0199283dfef...", wallet: "GBSARIMERCHANT123XYZ", amount: "15.75 XLM", type: "Dispute Claimed", status: "Success", time: "2026-06-02 14:05:12" }
                    ].map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{tx.txId}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{tx.wallet}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-955">{tx.amount}</td>
                        <td className="px-6 py-4 text-slate-700">{tx.type}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{tx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: DISPUTES */}
          {activeTab === 'Disputes' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Conflict Resolution</span>
                <h2 className="text-3xl font-extrabold text-slate-955 tracking-tight font-sans">Escrow Dispute Management</h2>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: "Open Disputes", value: platformMetrics.openDisputes },
                  { label: "Resolved Disputes", value: disputes.filter(d => d.status === 'Resolved').length },
                  { label: "Pending Compliance Reviews", value: disputes.filter(d => d.status === 'Open').length },
                  { label: "High Priority Cases", value: disputes.filter(d => d.status === 'Open').length }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block">{card.label}</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{card.value}</span>
                  </div>
                ))}
              </div>

              {/* Disputes Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Dispute ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Merchant</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Distributor</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Order ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Created Date</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                    {disputes.map((disp) => (
                      <tr key={disp.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-bold text-slate-900">{disp.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-955">{disp.merchant}</td>
                        <td className="px-6 py-4 text-slate-600">{disp.distributor}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">ESC-{disp.orderId}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            disp.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {disp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{disp.createdDate}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedDispute(disp);
                              setInternalNotes(disp.notes || '');
                            }}
                            className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-bold"
                          >
                            Review Dispute
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS */}
          {activeTab === 'Analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Growth Indicators</span>
                <h2 className="text-3xl font-extrabold text-slate-955 tracking-tight font-sans">Platform Analytics</h2>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SVG Chart 1: Escrow Volume Growth */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm mb-4">Total Escrow Volume Growth</h3>
                  <div className="h-64 w-full bg-slate-50 rounded-xl relative flex items-end p-4 border border-slate-100">
                    {/* SVG Line */}
                    <svg className="absolute inset-0 h-full w-full p-6 overflow-visible" preserveAspectRatio="none">
                      <path
                        d="M 0 150 Q 80 120 160 90 T 320 60 T 480 30"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="100%" y2="30" stroke="#E2E8F0" strokeDasharray="3" />
                      <line x1="0" y1="90" x2="100%" y2="90" stroke="#E2E8F0" strokeDasharray="3" />
                      <line x1="0" y1="150" x2="100%" y2="150" stroke="#E2E8F0" strokeDasharray="3" />
                    </svg>
                    {/* Graph labels */}
                    <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold z-10">
                      <span>March 2026</span>
                      <span>April 2026</span>
                      <span>May 2026</span>
                      <span>June 2026 (current)</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-3 font-semibold block text-center">Simulated cumulative escrow volume ($ XLM equivalent)</span>
                </div>

                {/* SVG Chart 2: Transaction Types split */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm mb-4">Verification Conversion Funnel</h3>
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {[
                      { label: "Submitted Verifications", value: 18, pct: 100, color: "bg-slate-300" },
                      { label: "Complied / Approved", value: 12, pct: 66, color: "bg-emerald-600" },
                      { label: "Requires Corrections", value: 4, pct: 22, color: "bg-orange-500" },
                      { label: "Rejected Requests", value: 2, pct: 11, color: "bg-red-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.label}</span>
                          <span className="text-slate-900">{item.value} workspaces ({item.pct}%)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SUPPORT */}
          {activeTab === 'Support' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Customer Assistance</span>
                <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-sans">Customer Support tickets</h2>
              </div>

              {/* Tickets Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Ticket ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Subject</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Created Date</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-bold text-slate-900">{t.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-955">{t.title}</td>
                        <td className="px-6 py-4 text-slate-600">{t.user}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            t.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{t.createdDate}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedTicket(t);
                              setInternalNotes(t.notes || '');
                            }}
                            className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-bold"
                          >
                            Respond
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">Platform Auditing</span>
                <h2 className="text-3xl font-extrabold text-slate-955 tracking-tight font-sans">Security & Settings</h2>
              </div>

              {/* Audit Logs section */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Database className="h-4.5 w-4.5 text-emerald-600" />
                    Complete Administrative Audit Log File
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                  {adminLogs.map((log) => (
                    <div key={log.id} className="p-4.5 hover:bg-slate-50/30 flex gap-4 items-start">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] font-bold mt-1">
                        {log.id}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-xs font-bold text-slate-900 block">{log.action}</span>
                          <span className="text-[10px] text-slate-450 font-bold">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium leading-normal">{log.details}</p>
                        {log.workspace && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded mt-2 inline-block">
                            Workspace: {log.workspace}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">Operator: {log.adminUser}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: WORKSPACE REVIEW DIALOG */}
      {selectedWorkspace && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedWorkspace(null);
            setRejectionReason('');
            setMissingDocs('');
            setInternalNotes('');
          }}
          title={`${selectedWorkspace.verificationStatus === 'Pending Review' ? 'Review Submission:' : 'Workspace Info:'} ${selectedWorkspace.name}`}
        >
          <div className="space-y-5 text-sm">
            
            {/* Core Specs */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase">Workspace ID</span>
                <span className="font-bold text-slate-900">{selectedWorkspace.id}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase">Workspace Type</span>
                <span className="font-bold text-slate-950 uppercase">{selectedWorkspace.type}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase">Connected Wallet</span>
                <span className="font-mono text-xs text-slate-500 font-bold truncate block">
                  {selectedWorkspace.walletAddress || 'GBPASSKEY987ABC...'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase">Compliance Status</span>
                <span className="font-extrabold text-emerald-600 uppercase">
                  {selectedWorkspace.verificationStatus || 'Unverified'}
                </span>
              </div>
            </div>

            {/* Document details based on type */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-600" />
                Submitted Verification Documents
              </h4>
              
              {selectedWorkspace.type === 'merchant' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Store Owner</span>
                    <span className="font-bold text-slate-900 text-sm block">{selectedWorkspace.ownerName || 'SariPay Store Owner'}</span>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase pt-2">Contact Number</span>
                    <span className="font-semibold text-slate-700 text-xs block">{selectedWorkspace.contactNumber || '09171112222'}</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Store Address</span>
                    <span className="font-semibold text-slate-700 text-xs block">{selectedWorkspace.storeAddress || '123 Mabini St, Manila'}</span>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase pt-2">Barangay Clearance Permit</span>
                    <span className="font-bold text-emerald-600 text-xs flex items-center gap-1 cursor-pointer hover:underline pt-0.5">
                      <FileText className="h-3.5 w-3.5" />
                      {selectedWorkspace.barangayPermit || 'barangay_clearance.pdf'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Distributor Contact Person</span>
                    <span className="font-bold text-slate-905 text-sm block">{selectedWorkspace.contactPerson || 'SariPay Supplier Agent'}</span>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase pt-2">Warehouse Location</span>
                    <span className="font-semibold text-slate-700 text-xs block truncate">{selectedWorkspace.warehouseAddress || 'Warehouse 4B, South Harbor'}</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Business SEC Registry ID</span>
                    <span className="font-bold text-slate-900 text-xs block">{selectedWorkspace.registryId || 'SEC-12345678-B'}</span>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase pt-2">SEC Registration PDF</span>
                    <span className="font-bold text-emerald-600 text-xs flex items-center gap-1 cursor-pointer hover:underline pt-0.5">
                      <FileText className="h-3.5 w-3.5" />
                      {selectedWorkspace.secRegistration || 'sec_registration.pdf'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error / Rejection details if present */}
            {(selectedWorkspace.rejectionReason || selectedWorkspace.missingDocs) && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px]">Previous Deficiencies / Notes</span>
                {selectedWorkspace.rejectionReason && <p><strong>Rejection Reason:</strong> {selectedWorkspace.rejectionReason}</p>}
                {selectedWorkspace.missingDocs && <p><strong>Missing Documents:</strong> {selectedWorkspace.missingDocs}</p>}
              </div>
            )}

            {/* Compliance Actions */}
            {selectedWorkspace.verificationStatus === 'Pending Review' ? (
              <div className="border-t border-slate-200 pt-5 space-y-4">
                
                {/* Decision input forms */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase pb-1">
                      Internal Admin Notes (Only visible to compliance staff)
                    </label>
                    <textarea
                      rows={2}
                      className="block w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                      placeholder="Add compliance notes, verification logs..."
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase pb-1">
                        Rejection Reason (Visible to user)
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                        placeholder="Why is this rejected?..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase pb-1">
                        Missing Documents (Visible to user)
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                        placeholder="Barangay Permit 2026 required..."
                        value={missingDocs}
                        onChange={(e) => setMissingDocs(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary triggers */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => handleApproveVerification(selectedWorkspace.id)}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    Approve & Verified
                  </button>
                  <button
                    onClick={() => handleRequestInfoVerification(selectedWorkspace.id)}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Request Info
                  </button>
                  <button
                    onClick={() => handleRejectVerification(selectedWorkspace.id)}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    Reject Request
                  </button>
                </div>
              </div>
            ) : (
              // Read-only modal controls
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <form onSubmit={(e) => handleSaveInternalNotes(e, selectedWorkspace.id)} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">
                    Admin Review Notes & Logs
                  </label>
                  <textarea
                    rows={2}
                    className="block w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                    placeholder="Add compliance notes..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Notes are private to administrators.
                    </span>
                    <button
                      type="submit"
                      disabled={isNotesSubmitting}
                      className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      {isNotesSubmitting ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </Modal>
      )}

      {/* MODAL 2: USER PROFILE DIALOG */}
      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title={`User Profile: ${selectedUser.name}`}
        >
          <div className="space-y-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Account ID</span>
                <span className="font-bold text-slate-900">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Email Address</span>
                <span className="font-semibold text-slate-700">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Stellar Ledger Key</span>
                <span className="font-mono text-xs text-slate-500">{selectedUser.walletAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Created Date</span>
                <span className="font-semibold text-slate-600">{selectedUser.createdDate}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => handleToggleUserStatus(selectedUser.id)}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${
                  selectedUser.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: DISPUTE DETAIL DIALOG */}
      {selectedDispute && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedDispute(null);
            setInternalNotes('');
          }}
          title={`Review Dispute: ${selectedDispute.id}`}
        >
          <div className="space-y-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Associated Order ID</span>
                <span className="font-bold text-slate-900">ESC-{selectedDispute.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Disputing Merchant</span>
                <span className="font-bold text-slate-900">{selectedDispute.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Distributor Partner</span>
                <span className="font-bold text-slate-900">{selectedDispute.distributor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Initiation Date</span>
                <span className="font-semibold text-slate-500">{selectedDispute.createdDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase block">Dispute Case Details</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs leading-normal text-slate-900">
                {selectedDispute.details}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase block">Evidence Files Uploaded</span>
              <div className="flex gap-2">
                {selectedDispute.evidence.map((ev, idx) => (
                  <span key={idx} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-emerald-600 font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-50">
                    <FileText className="h-3.5 w-3.5" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>

            {selectedDispute.status === 'Open' ? (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase pb-1">
                    Internal Resolution Notes
                  </label>
                  <textarea
                    rows={2}
                    className="block w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                    placeholder="Enter final arbitration outcome..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveDispute(selectedDispute.id, 'Resolved')}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Resolve Case
                  </button>
                  <button
                    onClick={() => handleResolveDispute(selectedDispute.id, 'Closed')}
                    className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Close Case
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1">
                <strong>Resolution Note:</strong> {selectedDispute.notes || 'None entered.'}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL 4: SUPPORT TICKETS DETAIL */}
      {selectedTicket && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedTicket(null);
            setInternalNotes('');
          }}
          title={`Respond to Ticket: ${selectedTicket.id}`}
        >
          <div className="space-y-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Customer</span>
                <span className="font-bold text-slate-900">{selectedTicket.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Ticket Subject</span>
                <span className="font-bold text-slate-955">{selectedTicket.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Submitted</span>
                <span className="font-semibold text-slate-500">{selectedTicket.createdDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase block">Details</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs leading-normal text-slate-900">
                {selectedTicket.details}
              </p>
            </div>

            {selectedTicket.status === 'Open' ? (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase pb-1">
                    Response Notes
                  </label>
                  <textarea
                    rows={2}
                    className="block w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                    placeholder="Notes on resolution..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    const updated = tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'Resolved' as const, notes: internalNotes } : t);
                    setTickets(updated);
                    localStorage.setItem('saripay_support_tickets', JSON.stringify(updated));
                    addAdminLog("Support Ticket Resolved", `Resolved ticket ${selectedTicket.id}: "${selectedTicket.title}".`);
                    triggerNotification('success', 'Ticket marked as Resolved.');
                    setSelectedTicket(null);
                    setInternalNotes('');
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Mark as Resolved & Send Response
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1">
                <strong>Resolution Notes:</strong> {selectedTicket.notes || 'None entered.'}
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
}
