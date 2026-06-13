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
    id: 'ws-merchant-2', 
    name: "Nena's Sari-Sari Store", 
    type: 'merchant', 
    verificationStatus: 'Pending Review',
    ownerName: "Nena Radoc",
    contactNumber: "09173334444",
    storeAddress: "456 Rizal Ave, Pasay City",
    barangayPermit: "barangay_nena.pdf",
    submittedDate: "2026-06-02",
    walletAddress: "GBPASSKEY987ABC"
  },
  { 
    id: 'ws-distributor-2', 
    name: "Unilever Pampanga Dist.", 
    type: 'distributor', 
    verificationStatus: 'Pending Review',
    contactPerson: "Manuel Lopez",
    contactNumber: "09185556666",
    warehouseAddress: "San Fernando Industrial Park, Pampanga",
    registryId: "SEC-98765432-A",
    secRegistration: "sec_unilever.pdf",
    submittedDate: "2026-06-03",
    walletAddress: "GBSARIDIST777ALAS"
  },
  { 
    id: 'ws-merchant-3', 
    name: "Pilar Mini Mart", 
    type: 'merchant', 
    verificationStatus: 'Requires Additional Information',
    ownerName: "Pilar Cruz",
    contactNumber: "09197778888",
    storeAddress: "789 Aurora Blvd, Quezon City",
    barangayPermit: "barangay_pilar.pdf",
    submittedDate: "2026-06-01",
    missingDocs: "Missing valid 2026 Government ID and Business Permit.",
    walletAddress: "GBSARIMERCHANT456ABC"
  },
  { 
    id: 'ws-distributor-3', 
    name: "Alaska Wholesale Manila", 
    type: 'distributor', 
    verificationStatus: 'Rejected',
    contactPerson: "Grace Tee",
    contactNumber: "09209990000",
    warehouseAddress: "101 Port Area, Manila",
    registryId: "SEC-44445555-C",
    secRegistration: "sec_alaska.pdf",
    submittedDate: "2026-05-28",
    rejectionReason: "The provided SEC registration belongs to a different corporate entity. Please resubmit the correct license.",
    walletAddress: "GBSARIDIST888ALAS"
  }
];

const DEFAULT_USERS: UserProfile[] = [
  { id: 'USR-101', name: "John Santos", email: "john.santos@gmail.com", walletAddress: "GBSARIMERCHANT123XYZ", workspacesCount: 2, status: 'Active', createdDate: "2026-05-20" },
  { id: 'USR-102', name: "Nena Radoc", email: "nena.radoc@outlook.com", walletAddress: "GBPASSKEY987ABC", workspacesCount: 1, status: 'Active', createdDate: "2026-06-02" },
  { id: 'USR-103', name: "Manuel Lopez", email: "manuel.l@unilever.com", walletAddress: "GBSARIDIST777ALAS", workspacesCount: 1, status: 'Active', createdDate: "2026-06-03" },
  { id: 'USR-104', name: "Pilar Cruz", email: "pilar.cruz@yahoo.com", walletAddress: "GBSARIMERCHANT456ABC", workspacesCount: 1, status: 'Active', createdDate: "2026-06-01" },
  { id: 'USR-105', name: "Grace Tee", email: "g.tee@alaska.com", walletAddress: "GBSARIDIST888ALAS", workspacesCount: 1, status: 'Suspended', createdDate: "2026-05-28" }
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
  { id: "10521", supplier: "San Miguel Wholesalers", amount: "10.00", status: "Initialized", date: "2026-06-01", details: "3x cases San Miguel Pale Pilsen, 2x cases Red Horse", merchantAddress: "GBSARIMERCHANT123XYZ", merchantName: "Nena's Sari-Sari Store" },
  { id: "10522", supplier: "Unilever Pampanga Dist.", amount: "25.00", status: "Initialized", date: "2026-05-30", details: "50x packs Breeze detergent, 20x bottles Sunsilk Shampoo", merchantAddress: "GBSARIMERCHANT456ABC", merchantName: "Pilar Mini Mart" },
  { id: "10523", supplier: "Coca-Cola Manila Bottlers", amount: "45.50", status: "Funded", date: "2026-05-29", details: "10x cases Coca-Cola 1.5L, 5x cases Royal Orange", merchantAddress: "GBSARIMERCHANT123XYZ", merchantName: "Nena's Sari-Sari Store" },
  { id: "10524", supplier: "Alaska Milk Corporation", amount: "15.75", status: "In Transit", date: "2026-05-28", details: "5x boxes Alaska Evaporated Milk 370ml", merchantAddress: "GBSARIMERCHANT123XYZ", merchantName: "Nena's Sari-Sari Store" },
  { id: "10525", supplier: "Pampanga Beverage Hub", amount: "80.00", status: "Delivered", date: "2026-05-27", details: "20x cases Ginera San Miguel, 10x boxes GSM Blue", merchantAddress: "GBSARIMERCHANT456ABC", merchantName: "Pilar Mini Mart" },
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

      // Workspaces sync
      setWorkspaces(prev => {
        if (JSON.stringify(prev.map(w => ({ id: w.id, status: w.verificationStatus }))) !==
            JSON.stringify(synced.workspaces.map((w: any) => ({ id: w.id, status: w.verificationStatus })))) {
          return synced.workspaces;
        }
        return prev;
      });

      // Orders sync
      setOrders(prev => {
        if (JSON.stringify(prev.map(o => ({ id: o.id, status: o.status }))) !==
            JSON.stringify(synced.orders.map((o: any) => ({ id: o.id, status: o.status })))) {
          return synced.orders;
        }
        return prev;
      });

      // Sync remaining tables
      if (synced.users) setUsers(synced.users);
      if (synced.disputes) setDisputes(synced.disputes);
      if (synced.tickets) setTickets(synced.tickets);
      if (synced.adminLogs) setAdminLogs(synced.adminLogs);
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
