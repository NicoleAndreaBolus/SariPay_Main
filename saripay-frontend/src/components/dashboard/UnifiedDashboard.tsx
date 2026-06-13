'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useSariPayContract, Order } from '@/hooks/useSariPayContract';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { QRGenerator } from '@/components/qr/QRGenerator';
import { QRScanner } from '@/components/qr/QRScanner';
import { shortenAddress } from '@/utils/address';
import confetti from 'canvas-confetti';
import { syncWithServer } from '@/utils/sync';
import { 
  Wallet,
  Home,
  Store, 
  Truck, 
  Lock, 
  Unlock, 
  QrCode, 
  ScanLine, 
  Activity, 
  DollarSign, 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Plus, 
  ArrowUpRight, 
  ChevronDown, 
  Check, 
  CheckCircle2, 
  X, 
  Menu, 
  MapPin, 
  CreditCard, 
  LockKeyhole, 
  Fingerprint, 
  Clock, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  HelpCircle as HelpIcon,
  XCircle,
  PlusCircle,
  Sparkles,
  Database,
  ShieldAlert,
  ClipboardCheck,
  CheckCircle
} from 'lucide-react';
import { LogoLockup, LogoIcon } from '@/components/common/Logo';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

// Workspace Type interface
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

export default function UnifiedDashboard() {
  const router = useRouter();
  
  // Custom hooks
  const wallet = useStellarWallet();
  const { walletAddress, walletBalance, authType, disconnect, refreshBalance } = wallet;
  const { orders, fundOrder, initOrder, dispatchOrder, confirmDelivery, getOrder, syncOrders, resetMockData } = useSariPayContract();

  // Import Order State
  const [importOrderId, setImportOrderId] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Live XLM Price in PHP (defaults to 11.57 PHP from CoinGecko)
  const [xlmPrice, setXlmPrice] = useState<number>(11.57);

  // Fetch live XLM price in PHP from CoinGecko Simple Price API
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=php");
        const data = await response.json();
        if (data?.stellar?.php) {
          console.log(`[Price API] Fetched live XLM price: ₱${data.stellar.php}`);
          setXlmPrice(data.stellar.php);
        }
      } catch (err) {
        console.error("[Price API] Failed to fetch live XLM price, using fallback:", err);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  const handleImportOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = importOrderId.replace(/\D/g, '');
    if (!cleanId) return;
    setIsImporting(true);
    try {
      const result = await getOrder(cleanId, walletAddress);
      if (result) {
        setImportOrderId('');
        router.push(`/order/${cleanId}`);
      } else {
        triggerAlert(`Order #${cleanId} could not be found on the blockchain ledger. Make sure the ID is correct.`, "Error", "error");
      }
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to import order.", "Error", "error");
    } finally {
      setIsImporting(false);
    }
  };

  // Workspaces list state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  
  // UI Panels / Modal states
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'passkeys' | 'wallets' | 'workspaces'>('profile');
  const [mobileTab, setMobileTab] = useState<'home' | 'orders' | 'wallet' | 'notifications' | 'profile'>('home');
  const [vStep, setVStep] = useState(1);
  const [notifFilter, setNotifFilter] = useState<'all' | 'transactions' | 'deliveries' | 'verification' | 'system'>('all');
  const [isMobileOrdersSheetOpen, setIsMobileOrdersSheetOpen] = useState(false);
  const [isQuickQrPickerOpen, setIsQuickQrPickerOpen] = useState(false);
  
  // Onboarding creation state
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'selection' | 'details'>('welcome');
  const [onboardingType, setOnboardingType] = useState<'merchant' | 'distributor' | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  
  // Verification submission states
  const [vOwnerName, setVOwnerName] = useState('');
  const [vContactNumber, setVContactNumber] = useState('');
  const [vStoreAddress, setVStoreAddress] = useState('');
  const [vBarangayPermit, setVBarangayPermit] = useState('barangay_permit_2026.pdf');
  const [vBusinessPermit, setVBusinessPermit] = useState('business_permit_2026.pdf');
  
  const [vCompanyName, setVCompanyName] = useState('');
  const [vContactPerson, setVContactPerson] = useState('');
  const [vWarehouseAddress, setVWarehouseAddress] = useState('');
  const [vSecRegistration, setVSecRegistration] = useState('sec_registration_2026.pdf');
  const [vDtiRegistration, setVDtiRegistration] = useState('dti_permit_2026.pdf');
  const [vRegistryId, setVRegistryId] = useState('');
  const [vSubmitError, setVSubmitError] = useState<string | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  // Merchant operational states
  const [merchantTab, setMerchantTab] = useState<'All' | 'Awaiting Transit' | 'Ready to Release'>('All');
  const [fundingId, setFundingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Distributor operational states
  const [distributorTab, setDistributorTab] = useState<'All' | 'Awaiting Escrow' | 'Ready to Dispatch' | 'Completed'>('All');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isShippingId, setIsShippingId] = useState<string | null>(null);
  const [invoiceMerchantName, setInvoiceMerchantName] = useState('');
  const [invoiceMerchantAddr, setInvoiceMerchantAddr] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState('');
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'error' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const triggerAlert = (message: string, title = 'Notice', type: 'info' | 'error' | 'success' = 'info') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Settings profile states
  const [profileName, setProfileName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saripay_profile_name') || 'SariPay User';
    }
    return 'SariPay User';
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saripay_profile_email') || 'user@saripay.co';
    }
    return 'user@saripay.co';
  });

  useEffect(() => {
    localStorage.setItem('saripay_profile_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('saripay_profile_email', profileEmail);
  }, [profileEmail]);
  const [passkeys, setPasskeys] = useState<string[]>(['Main Passkey (Chrome)', 'Android Fingerprint (Pixel)']);
  const [bioFaceId, setBioFaceId] = useState(true);
  const [bioFingerprint, setBioFingerprint] = useState(true);

  // Authentication guard
  useEffect(() => {
    const storedAddress = localStorage.getItem('saripay_wallet_address');
    if (!storedAddress) {
      router.push('/login');
    }
  }, [walletAddress, router]);

  // Auto-sync orders with blockchain ledger
  useEffect(() => {
    if (!walletAddress) return;
    
    syncOrders(walletAddress);
    
    const interval = setInterval(() => {
      syncOrders(walletAddress);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [walletAddress, syncOrders]);

  // Load Workspaces from LocalStorage or default
  useEffect(() => {
    const loadAndSync = async () => {
      const synced = await syncWithServer();
      const savedWorkspaces = localStorage.getItem('saripay_workspaces');
      const savedActiveId = localStorage.getItem('saripay_active_workspace_id');
      
      if (savedWorkspaces) {
        try {
          const parsed = JSON.parse(savedWorkspaces);
          setWorkspaces(parsed);
          if (parsed.length === 0) {
            setIsOnboardingOpen(true);
          } else if (savedActiveId && parsed.some((w: Workspace) => w.id === savedActiveId)) {
            setActiveWorkspaceId(savedActiveId);
          } else if (parsed.length > 0) {
            setActiveWorkspaceId(parsed[0].id);
          }
        } catch {
          initializeDefaultWorkspaces();
          setIsOnboardingOpen(true);
        }
      } else {
        initializeDefaultWorkspaces();
        setIsOnboardingOpen(true);
      }
    };
    loadAndSync();
  }, []);

  const initializeDefaultWorkspaces = () => {
    const defaults: Workspace[] = [];
    setWorkspaces(defaults);
    setActiveWorkspaceId('');
    localStorage.setItem('saripay_workspaces', JSON.stringify(defaults));
    localStorage.setItem('saripay_active_workspace_id', '');
  };

  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || null;
  }, [workspaces, activeWorkspaceId]);

  const firstName = useMemo(() => {
    return profileName.trim().split(' ')[0] || 'User';
  }, [profileName]);

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('saripay_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('saripay_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('saripay_notifications', JSON.stringify([]));
  }, []);

  // Load and manage notifications
  useEffect(() => {
    const saved = localStorage.getItem('saripay_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications([]);
      }
    } else {
      const initial: AppNotification[] = [
        {
          id: `notif-welcome`,
          title: "Welcome to SariPay",
          message: "Connect your wallet and complete business verification to start B2B escrow trade.",
          type: 'success',
          timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setNotifications(initial);
      localStorage.setItem('saripay_notifications', JSON.stringify(initial));
    }
  }, []);

  // Sync workspaces and states from server periodically & notify of status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const synced = await syncWithServer();
      if (synced && synced.workspaces) {
        setWorkspaces(prevWorkspaces => {
          const activeId = localStorage.getItem('saripay_active_workspace_id') || '';
          const oldActive = prevWorkspaces.find(w => w.id === activeId);
          const newActive = synced.workspaces.find((w: any) => w.id === activeId);
          
          if (oldActive && newActive && oldActive.verificationStatus !== newActive.verificationStatus) {
            if (newActive.verificationStatus === 'Verified') {
              addNotification("Workspace Verified!", `Congratulations! '${newActive.name}' is now fully verified by admin.`, "success");
            } else if (newActive.verificationStatus === 'Rejected') {
              addNotification("Verification Rejected", `'${newActive.name}' verification was rejected: ${newActive.rejectionReason || "Check compliance rules."}`, "warning");
            } else if (newActive.verificationStatus === 'Requires Additional Information') {
              addNotification("Compliance Info Required", `Compliance requires updates for '${newActive.name}': ${newActive.missingDocs || "Check docs."}`, "warning");
            }
          }
          return synced.workspaces;
        });

        // Sync active workspace ID
        const savedActiveId = localStorage.getItem('saripay_active_workspace_id');
        if (!savedActiveId && synced.workspaces.length > 0) {
          const firstId = synced.workspaces[0].id;
          setActiveWorkspaceId(firstId);
          localStorage.setItem('saripay_active_workspace_id', firstId);
        } else if (savedActiveId) {
          setActiveWorkspaceId(savedActiveId);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [addNotification]);

  const handleWorkspaceSwitch = (id: string) => {
    setActiveWorkspaceId(id);
    localStorage.setItem('saripay_active_workspace_id', id);
    setIsSwitcherOpen(false);
    
    // Add light transition feedback
    confetti({
      particleCount: 20,
      spread: 20,
      origin: { y: 0.1, x: 0.15 },
      colors: ['#059669', '#10B981']
    });
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('saripay_active_workspace_id');
    localStorage.removeItem('saripay_workspaces');
    router.push('/login');
  };

  // --- WORKSPACE ONBOARDING CREATION ---
  const handleOpenOnboarding = () => {
    setIsSwitcherOpen(false);
    setOnboardingStep('welcome');
    setOnboardingType(null);
    setNewWorkspaceName('');
    setIsOnboardingOpen(true);
  };

  const handleCreateWorkspace = () => {
    if (!onboardingType || !newWorkspaceName.trim()) return;

    const newWs: Workspace = {
      id: `ws-${onboardingType}-${Date.now()}`,
      name: newWorkspaceName.trim(),
      type: onboardingType,
      verificationStatus: 'Unverified', // Starts as unverified
      statusUpdatedAt: Date.now(),
      walletAddress: walletAddress || undefined
    };

    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    setActiveWorkspaceId(newWs.id);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updated));
    localStorage.setItem('saripay_active_workspace_id', newWs.id);
    // Sync with the shared server database immediately
    syncWithServer().catch(err => console.error("Failed to sync new workspace:", err));
    
    setIsOnboardingOpen(false);
    addNotification("Workspace Created", `Workspace '${newWs.name}' has been successfully created.`, "success");

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#ffffff']
    });
  };

  // --- VERIFICATION SUBMISSION FLOW ---
  const handleOpenVerificationModal = () => {
    setVOwnerName(profileName);
    setVContactNumber('09171234567');
    setVStoreAddress('Manila, Philippines');
    
    setVCompanyName(activeWorkspace?.name || '');
    setVContactPerson(profileName);
    setVWarehouseAddress('Santos Warehouse Hub, Valenzuela City');
    setVRegistryId('SEC-REG-1928');
    setVSubmitError(null);
    setVStep(1);
    setIsVerificationModalOpen(true);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVSubmitError(null);

    if (activeWorkspace?.type === 'merchant') {
      if (!vOwnerName || !vContactNumber || !vStoreAddress) {
        setVSubmitError("All required fields must be filled.");
        return;
      }
    } else {
      if (!vCompanyName || !vContactPerson || !vContactNumber || !vWarehouseAddress || !vRegistryId) {
        setVSubmitError("All required fields must be filled.");
        return;
      }
    }

    setIsSubmittingVerification(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock network delay

    const updatedWorkspaces = workspaces.map(w => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          verificationStatus: 'Pending Review' as const,
          statusUpdatedAt: Date.now(),
          ownerName: w.type === 'merchant' ? vOwnerName : undefined,
          contactPerson: w.type === 'distributor' ? vContactPerson : undefined,
          contactNumber: vContactNumber,
          storeAddress: w.type === 'merchant' ? vStoreAddress : undefined,
          warehouseAddress: w.type === 'distributor' ? vWarehouseAddress : undefined,
          registryId: w.type === 'distributor' ? vRegistryId : undefined,
          barangayPermit: w.type === 'merchant' ? vBarangayPermit : undefined,
          secRegistration: w.type === 'distributor' ? vSecRegistration : undefined,
          submittedDate: new Date().toISOString().split('T')[0]
        };
      }
      return w;
    });

    setWorkspaces(updatedWorkspaces);
    localStorage.setItem('saripay_workspaces', JSON.stringify(updatedWorkspaces));

    // Log admin action trigger
    const logs = JSON.parse(localStorage.getItem('saripay_admin_logs') || '[]');
    const newLog = {
      id: `log-${Date.now()}`,
      action: "Verification Request Submitted",
      workspace: activeWorkspace?.name,
      details: `Workspace submitted by ${profileName} for review.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    localStorage.setItem('saripay_admin_logs', JSON.stringify([newLog, ...logs]));

    // Sync with the shared server database immediately
    syncWithServer().catch(err => console.error("Failed to sync verification submission:", err));

    setIsVerificationModalOpen(false);
    setIsSubmittingVerification(false);
    addNotification("Verification Submitted", `Compliance documentation for '${activeWorkspace?.name}' submitted successfully.`, "info");

    confetti({
      particleCount: 50,
      spread: 30,
      colors: ['#059669', '#10B981']
    });
  };

  // --- MERCHANT OPERATIONS ---
  const handleLockEscrow = async (id: string, amount: string) => {
    if (activeWorkspace?.verificationStatus !== 'Verified') {
      triggerAlert("Verification Required: Your business workspace must be Verified by SariPay compliance before funding active escrows.", "Verification Required", "error");
      return;
    }
    setFundingId(id);
    try {
      const result = await fundOrder(id, walletBalance, walletAddress);
      if (result.success) {
        localStorage.setItem('saripay_wallet_balance', result.newBalance);
        await refreshBalance();
        addNotification("Escrow Funded", `Successfully locked ${amount} XLM in escrow for Order #${id}.`, "success");
        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#059669', '#10B981']
        });
      }
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to fund escrow contract.", "Error", "error");
    } finally {
      setFundingId(null);
    }
  };

  const openQrModal = (order: Order) => {
    if (activeWorkspace?.verificationStatus !== 'Verified') {
      triggerAlert("Verification Required: Your business workspace must be Verified by SariPay compliance before generating handoff QR codes.", "Verification Required", "error");
      return;
    }
    setSelectedOrder(order);
    setIsQrModalOpen(true);
  };

  const merchantOrders = useMemo(() => {
    return orders.filter(o => {
      if (merchantTab === 'All') return true;
      if (merchantTab === 'Awaiting Transit') return o.status === 'Initialized';
      if (merchantTab === 'Ready to Release') return o.status === 'Funded' || o.status === 'In Transit';
      return true;
    });
  }, [orders, merchantTab]);

  const merchantStats = useMemo(() => {
    const locked = orders
      .filter(o => o.status === 'Funded' || o.status === 'In Transit')
      .reduce((sum, o) => sum + parseFloat(o.amount), 0)
      .toFixed(2);
    const active = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Canceled').length;
    const completed = orders.filter(o => o.status === 'Delivered').length;

    return {
      lockedFunds: locked,
      activeOrders: active,
      completedDeliveries: completed
    };
  }, [orders]);

  // --- DISTRIBUTOR OPERATIONS ---
  const handleShipOrder = async (id: string) => {
    if (activeWorkspace?.verificationStatus !== 'Verified') {
      triggerAlert("Verification Required: Workspace must be Verified to complete settlements or dispatch escrows.", "Verification Required", "error");
      return;
    }
    setIsShippingId(id);
    try {
      await dispatchOrder(id, walletAddress);
      addNotification("Order Dispatched", `Order #${id} has been marked as In Transit. Courier has been notified.`, "info");
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.8 },
        colors: ['#059669', '#10B981']
      });
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to dispatch cargo.", "Error", "error");
    } finally {
      setIsShippingId(null);
    }
  };

  const openScanner = (order: Order) => {
    if (activeWorkspace?.verificationStatus !== 'Verified') {
      triggerAlert("Verification Required: Workspace must be Verified to scan handoff QR codes.", "Verification Required", "error");
      return;
    }
    setSelectedOrder(order);
    setIsScannerOpen(true);
  };

  const handleScanSuccess = async (decodedText: string) => {
    if (!selectedOrder) return;
    setIsScannerOpen(false);
    try {
      const success = await confirmDelivery(selectedOrder.id, walletAddress);
      if (success) {
        addNotification("Escrow Released", `Delivery verified for Order #${selectedOrder.id}. Funds released to supplier.`, "success");
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#059669', '#10B981', '#ffffff']
        });
        await refreshBalance();
      }
    } catch (err: any) {
      triggerAlert(err?.message || "Verification code mismatch.", "Error", "error");
    }
  };

  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceError(null);

    if (activeWorkspace?.verificationStatus !== 'Verified') {
      setInvoiceError("Verification Required: Your distributor workspace must be Verified to create order invoices.");
      return;
    }

    if (!invoiceMerchantAddr || !invoiceMerchantName || !invoiceAmount || !invoiceDetails) {
      setInvoiceError("All fields are required to register a supply purchase invoice.");
      return;
    }

    if (isNaN(parseFloat(invoiceAmount)) || parseFloat(invoiceAmount) <= 0) {
      setInvoiceError("Please enter a valid invoice amount.");
      return;
    }

    setIsSubmittingInvoice(true);
    try {
      const mockId = Math.floor(10000 + Math.random() * 90000).toString();
      const success = await initOrder({
        id: mockId,
        supplier: activeWorkspace?.name || "Santos Distribution",
        amount: parseFloat(invoiceAmount).toFixed(2),
        details: invoiceDetails,
        merchantAddress: invoiceMerchantAddr,
        merchantName: invoiceMerchantName
      }, walletAddress);

      if (success) {
        setIsCreateInvoiceOpen(false);
        setInvoiceMerchantAddr('');
        addNotification("Invoice Registered", `Supply purchase invoice created for Order #${mockId} (amount: ${invoiceAmount} XLM).`, "info");
        setInvoiceMerchantName('');
        setInvoiceAmount('');
        setInvoiceDetails('');
        confetti({
          particleCount: 40,
          spread: 30,
          origin: { y: 0.8 },
          colors: ['#059669', '#10B981']
        });
      }
    } catch (err: any) {
      setInvoiceError(err?.message || "Failed to initialize order.");
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const distributorOrders = useMemo(() => {
    return orders.filter(o => {
      if (distributorTab === 'All') return true;
      if (distributorTab === 'Awaiting Escrow') return o.status === 'Initialized';
      if (distributorTab === 'Ready to Dispatch') return o.status === 'Funded' || o.status === 'In Transit';
      if (distributorTab === 'Completed') return o.status === 'Delivered';
      return true;
    });
  }, [orders, distributorTab]);

  const distributorStats = useMemo(() => {
    const guaranteed = orders
      .filter(o => o.status === 'Funded' || o.status === 'In Transit')
      .reduce((sum, o) => sum + parseFloat(o.amount), 0)
      .toFixed(2);
    const pending = orders.filter(o => o.status === 'Initialized' || o.status === 'Funded').length;
    const completed = orders.filter(o => o.status === 'Delivered').length;

    return {
      guaranteedRevenue: guaranteed,
      pendingDeliveries: pending,
      completedDeliveries: completed
    };
  }, [orders]);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'all') return notifications;
    return notifications.filter(notif => {
      const title = notif.title.toLowerCase();
      const msg = notif.message.toLowerCase();
      if (notifFilter === 'transactions') {
        return title.includes('fund') || title.includes('release') || title.includes('payment') || title.includes('wallet') || title.includes('escrow') || title.includes('balance') || msg.includes('xlm') || msg.includes('php');
      }
      if (notifFilter === 'deliveries') {
        return title.includes('cargo') || title.includes('courier') || title.includes('ship') || title.includes('transit') || title.includes('deliver') || title.includes('handoff') || title.includes('route') || title.includes('logistics') || title.includes('invoice');
      }
      if (notifFilter === 'verification') {
        return title.includes('verified') || title.includes('verification') || title.includes('compliance') || title.includes('doc') || title.includes('approval') || title.includes('submit') || title.includes('review');
      }
      if (notifFilter === 'system') {
        const matchesOther = (
          title.includes('fund') || title.includes('release') || title.includes('payment') || title.includes('wallet') || title.includes('escrow') || title.includes('balance') || msg.includes('xlm') || msg.includes('php') ||
          title.includes('cargo') || title.includes('courier') || title.includes('ship') || title.includes('transit') || title.includes('deliver') || title.includes('handoff') || title.includes('route') || title.includes('logistics') || title.includes('invoice') ||
          title.includes('verified') || title.includes('verification') || title.includes('compliance') || title.includes('doc') || title.includes('approval') || title.includes('submit') || title.includes('review')
        );
        return !matchesOther;
      }
      return true;
    });
  }, [notifications, notifFilter]);

  const walletTransactions = useMemo(() => {
    return orders.map(order => {
      let title = "Escrow Created";
      let description = `Created escrow for Order #${order.id}`;
      let type: 'in' | 'out' = 'out';
      let statusColor = 'text-amber-500';
      if (order.status === 'Funded') {
        title = "Escrow Funded";
        description = `Locked funds for Order #${order.id}`;
        type = 'out';
        statusColor = 'text-[#059669]';
      } else if (order.status === 'In Transit') {
        title = "In Transit";
        description = `Cargo shipped for Order #${order.id}`;
        type = 'out';
        statusColor = 'text-teal-600';
      } else if (order.status === 'Delivered') {
        title = "Payment Settled";
        description = activeWorkspace?.type === 'merchant'
          ? `Released payout to supplier for Order #${order.id}`
          : `Received payout from merchant for Order #${order.id}`;
        type = activeWorkspace?.type === 'merchant' ? 'out' : 'in';
        statusColor = 'text-[#059669]';
      }
      return {
        id: `tx-${order.id}`,
        title,
        description,
        amount: order.amount,
        type,
        statusColor,
        timestamp: "Today"
      };
    });
  }, [orders, activeWorkspace]);

  // --- SETTINGS CONTROLS ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlert("Profile settings saved successfully!", "Success", "success");
  };

  const handleRegisterPasskey = () => {
    const keyName = prompt("Enter a label for this passkey:");
    if (keyName && keyName.trim()) {
      setPasskeys([...passkeys, keyName.trim()]);
      confetti({
        particleCount: 30,
        spread: 30,
        colors: ['#059669']
      });
    }
  };

  const handleDeleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) {
      triggerAlert("You must keep at least one active workspace.", "Notice", "info");
      return;
    }
    if (confirm("Are you sure you want to delete this workspace? All settings will be lost.")) {
      const updated = workspaces.filter(w => w.id !== id);
      setWorkspaces(updated);
      if (activeWorkspaceId === id) {
        setActiveWorkspaceId(updated[0].id);
        localStorage.setItem('saripay_active_workspace_id', updated[0].id);
      }
      localStorage.setItem('saripay_workspaces', JSON.stringify(updated));
      syncWithServer().catch(err => console.error("Failed to sync workspace deletion:", err));
    }
  };

  const handleResetAllSimulatorData = async () => {
    if (!confirm("Are you sure you want to completely clear the live server database and reset your account? This wipes all test workspaces and users, and cannot be undone.")) {
      return;
    }
    
    try {
      // Call the sync API with a reset payload containing empty arrays
      const res = await fetch(`/api/sync?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
        body: JSON.stringify({
          isReset: true,
          workspaces: [],
          orders: [],
          users: [],
          disputes: [],
          tickets: [],
          adminLogs: []
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      // Clear local storage and redirect
      localStorage.clear();
      window.location.href = '/register';
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to reset server data.", "Error", "error");
    }
  };

  const renderEmptyState = (type: 'orders' | 'deliveries' | 'escrows' | 'notifications', actionLabel?: string, actionFn?: () => void) => {
    const info = {
      orders: {
        title: "No Orders Yet",
        description: "You don't have any purchase invoices active. Create one to begin your transaction journey.",
        icon: FileText,
      },
      deliveries: {
        title: "No Deliveries Yet",
        description: "No cargo shipments are currently scheduled for dispatch or in transit.",
        icon: Truck,
      },
      escrows: {
        title: "No Escrows Yet",
        description: "You haven't locked or released any escrow smart contracts yet.",
        icon: Lock,
      },
      notifications: {
        title: "No Notifications Yet",
        description: "You're all caught up! Regulatory updates and escrow alerts will show here.",
        icon: Bell,
      }
    }[type];

    const Icon = info.icon;

    return (
      <div className="py-12 px-6 text-center border-2 border-dashed border-[#E5E7EB] rounded-3xl bg-white flex flex-col items-center gap-3.5 max-w-sm mx-auto mt-6">
        <div className="w-12 h-12 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] mx-auto">
          <Icon className="w-6 h-6 text-[#6B7280]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#111827]">{info.title}</h4>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed max-w-xs mx-auto">{info.description}</p>
        </div>
        {actionLabel && actionFn && (
          <Button
            variant="primary"
            onClick={actionFn}
            className="bg-[#059669] hover:bg-[#10B981] text-white font-bold text-[11px] px-5 py-2.5 rounded-xl mt-1.5 active:scale-95 cursor-pointer"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  };

  // Status Badges
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Initialized':
        return (
          <span className="text-[10px] px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200/50 rounded-full font-semibold uppercase">
            Initialized
          </span>
        );
      case 'Funded':
        return (
          <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 text-[#059669] border border-[#059669]/20 rounded-full font-semibold uppercase">
            Escrow Funded
          </span>
        );
      case 'In Transit':
        return (
          <span className="text-[10px] px-2.5 py-0.5 bg-teal-50 text-teal-600 border border-teal-200/50 rounded-full font-semibold uppercase flex items-center gap-1 w-fit">
            <Truck className="w-3 h-3 animate-bounce" /> In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 text-[#059669] border border-[#059669]/10 rounded-full font-semibold uppercase">
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP VIEWPORT */}
      {/* ======================================================== */}
      <div className="hidden md:flex min-h-screen bg-[#FAFAF9] text-[#111827] flex-col font-sans relative w-full">
      
      {/* A. DYNAMIC TOP BAR NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm px-6 py-4.5 flex items-center justify-between">
        
        {/* Left Side: Brand & Workspace Switcher */}
        <div className="flex items-center gap-4 relative">
          <LogoLockup size={34} />
          
          <span className="w-px h-6 bg-[#E5E7EB] hidden sm:inline" />

          {/* Workspace Switcher Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 bg-[#FAFAF9] hover:bg-[#E5E7EB]/40 border border-[#E5E7EB] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#111827] transition-colors cursor-pointer select-none"
            >
              {activeWorkspace?.type === 'merchant' ? (
                <Store className="w-3.5 h-3.5 text-[#059669]" />
              ) : (
                <Truck className="w-3.5 h-3.5 text-[#059669]" />
              )}
              <span className="truncate max-w-[120px] sm:max-w-none">{activeWorkspace?.name}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </button>

            {/* Dropdown Options overlay */}
            {isSwitcherOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSwitcherOpen(false)} />
                <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Switch Workspace
                  </div>
                  
                  <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto px-1.5">
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => handleWorkspaceSwitch(ws.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                          activeWorkspaceId === ws.id 
                            ? 'bg-[#059669]/5 text-[#059669]' 
                            : 'text-[#6B7280] hover:bg-[#FAFAF9] hover:text-[#111827]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {ws.type === 'merchant' ? (
                            <Store className="w-3.5 h-3.5" />
                          ) : (
                            <Truck className="w-3.5 h-3.5" />
                          )}
                          <span className="truncate max-w-[150px]">{ws.name}</span>
                        </div>
                        {activeWorkspaceId === ws.id && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#E5E7EB] mt-2 pt-2 px-1.5">
                    <button
                      onClick={handleOpenOnboarding}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#059669] hover:bg-[#059669]/5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Workspace
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side Tools menu */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#FAFAF9] transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#059669] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4.5 z-50 text-left animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Notification Center</h4>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-[10px] text-red-500 hover:text-red-700 font-semibold cursor-pointer bg-transparent border-0"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-stone-400 text-xs font-medium">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="flex gap-2.5 items-start text-xs border-b border-[#E5E7EB]/50 pb-2.5 group relative">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === 'success' ? 'bg-emerald-500' :
                            n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 pr-6">
                            <p className="font-semibold text-[#111827] leading-tight">{n.title}</p>
                            <p className="text-[#6B7280] mt-0.5 leading-normal text-[11px]">{n.message}</p>
                            <span className="text-[10px] text-stone-400 mt-1 block font-mono">{n.timestamp}</span>
                          </div>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="absolute right-0 top-1 text-stone-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer bg-transparent border-0"
                            title="Delete notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#FAFAF9] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#FAFAF9] transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile User avatar dropdown */}
          <div className="w-8 h-8 rounded-full bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center font-bold text-xs text-[#059669]">
            JS
          </div>

          <button
            onClick={handleDisconnect}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer hidden sm:block"
            title="Disconnect Wallet"
          >
            <LogOut className="w-5 h-5" />
          </button>

        </div>
      </nav>

      {/* B. MAIN DYNAMICS WORKSPACE AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Verification Status Banner */}
        {activeWorkspace && activeWorkspace.verificationStatus !== 'Verified' && (
          <div className="mb-8 p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3 text-left">
              {activeWorkspace.verificationStatus === 'Unverified' && (
                <>
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Workspace Unverified</h4>
                    <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-0.5">
                      Your business details have not been submitted. To fund secure escrows or scan deliveries, please submit your documents for verification.
                    </p>
                  </div>
                </>
              )}
              {activeWorkspace.verificationStatus === 'Pending Review' && (
                <>
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Verification Pending Review</h4>
                    <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-0.5">
                      Compliance is reviewing your submitted business documentation. Dashboard transaction capabilities will unlock immediately upon approval.
                    </p>
                  </div>
                </>
              )}
              {activeWorkspace.verificationStatus === 'Requires Additional Information' && (
                <>
                  <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Additional Compliance Information Required</h4>
                    <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-0.5">
                      Action Required: <span className="font-semibold text-orange-600">{activeWorkspace.missingDocs || "Missing Barangay/SEC permit details"}</span>. Please click below to update details.
                    </p>
                  </div>
                </>
              )}
              {activeWorkspace.verificationStatus === 'Rejected' && (
                <>
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">Workspace Verification Rejected</h4>
                    <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-0.5">
                      Reason: <span className="font-semibold text-red-600">{activeWorkspace.rejectionReason || "Details did not match SEC registries."}</span>. Please review rules and resubmit.
                    </p>
                  </div>
                </>
              )}
            </div>
            {activeWorkspace.verificationStatus !== 'Pending Review' && (
              <Button
                variant="primary"
                onClick={handleOpenVerificationModal}
                className="bg-[#059669] hover:bg-[#10B981] text-white text-xs font-semibold py-2 px-4.5 rounded-xl shrink-0 cursor-pointer"
              >
                {activeWorkspace.verificationStatus === 'Unverified' ? 'Verify Workspace' : 'Update Details'}
              </Button>
            )}
          </div>
        )}

        {/* transition container */}
        <div className="animate-in fade-in duration-300">
          
          {!activeWorkspace && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#059669]/10 blur-xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-tr from-[#059669] to-[#10B981] rounded-2xl flex items-center justify-center shadow-lg text-white">
                  <Store className="w-10 h-10" />
                </div>
              </div>
              
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
                Welcome to <span className="bg-gradient-to-r from-[#059669] to-[#10B981] bg-clip-text text-transparent">SariPay</span>
              </h2>
              <p className="mt-3 max-w-md text-base text-[#6B7280] font-normal leading-relaxed">
                Connect your business to the secure, blockchain-powered B2B commerce network. Create your first workspace to start creating orders and funding escrows.
              </p>
              
              <div className="mt-8 flex gap-4">
                <Button
                  variant="primary"
                  onClick={handleOpenOnboarding}
                  className="bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#10B981] hover:to-[#059669] text-white text-sm font-semibold py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Workspace
                </Button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* B.1 MERCHANT VIEWPORT */}
          {/* ======================================================== */}
          {activeWorkspace?.type === 'merchant' && (
            <div className="flex flex-col gap-10">
              
              {/* Hero welcome header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E5E7EB]">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">Welcome Back, {firstName}</h1>
                  <p className="text-sm text-[#6B7280] font-medium mt-1">
                    Secure Payments. Verified Deliveries.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={resetMockData}
                    className="flex items-center gap-2 border border-[#E5E7EB] bg-white text-xs font-semibold py-2 px-4 rounded-xl"
                  >
                    <Database className="w-4 h-4" />
                    Reset Mock Ledger
                  </Button>
                </div>
              </div>

              {/* Metrics cards grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Available Balance</span>
                    {activeWorkspace?.verificationStatus !== 'Verified' && (
                      <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200/50 flex items-center gap-1 animate-pulse shrink-0">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-extrabold text-[#111827] block mt-2">
                    ₱{activeWorkspace?.verificationStatus === 'Verified' && walletBalance 
                      ? (parseFloat(walletBalance) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      : "0.00"}
                  </span>
                  <span className="text-[9px] text-[#6B7280] block font-mono">
                    {activeWorkspace?.verificationStatus === 'Verified' && walletBalance ? walletBalance : "0.00"} XLM
                  </span>
                </div>
                <div className="bg-white p-6 rounded-2xl border-2 border-[#059669]/20 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Funds In Trust</span>
                  <span className="text-2xl font-extrabold text-[#059669] block mt-2">₱{(parseFloat(merchantStats.lockedFunds) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="text-[9px] text-[#059669] block font-mono font-bold">{merchantStats.lockedFunds} XLM Escrowed</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Active Orders</span>
                  <span className="text-2xl font-extrabold text-[#111827] block mt-2">{merchantStats.activeOrders}</span>
                  <span className="text-[9px] text-amber-600 font-bold block">Fulfillment pending</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Completed Deliveries</span>
                  <span className="text-2xl font-extrabold text-[#111827] block mt-2">{merchantStats.completedDeliveries}</span>
                  <span className="text-[9px] text-[#059669] font-bold block">100% release success</span>
                </div>
              </div>

              {/* Purchase Matrix Table & Handoff Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Active Purchase Queue (Left Column) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-6 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-base font-bold text-[#111827]">Active Purchase Queue</h3>
                      <form onSubmit={handleImportOrder} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={importOrderId}
                          onChange={(e) => setImportOrderId(e.target.value)}
                          placeholder="Import Order ID..."
                          className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-emerald-500 font-mono w-32"
                        />
                        <button
                          type="submit"
                          disabled={isImporting}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          {isImporting ? 'Importing...' : 'Import'}
                        </button>
                      </form>
                    </div>
                    <div className="flex bg-[#E5E7EB]/40 p-1 rounded-xl border border-[#E5E7EB]/50 gap-1 text-[11px] font-bold">
                      {(['All', 'Awaiting Transit', 'Ready to Release'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setMerchantTab(tab)}
                          className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                            merchantTab === tab ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {merchantOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      
                      {/* Desktop Queue Table */}
                      <table className="w-full text-left border-collapse hidden sm:table">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] text-[#6B7280] text-[10px] font-bold tracking-wider uppercase pb-3">
                            <th className="pb-3.5">Order ID</th>
                            <th className="pb-3.5">Supplier</th>
                            <th className="pb-3.5">Amount</th>
                            <th className="pb-3.5">Status</th>
                            <th className="pb-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/60 text-xs">
                          {merchantOrders.map(order => (
                            <tr key={order.id} className="hover:bg-[#FAFAF9]/50 transition-colors">
                              <td className="py-4 font-mono font-bold text-[#059669]">#{order.id}</td>
                              <td className="py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#111827]">{order.supplier}</span>
                                  <span className="text-[10px] text-[#6B7280] mt-0.5">{order.details}</span>
                                </div>
                              </td>
                              <td className="py-4 font-bold text-[#111827]">{order.amount} XLM</td>
                              <td className="py-4">{getStatusBadge(order.status)}</td>
                              <td className="py-4 text-right">
                                {order.status === 'Initialized' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleLockEscrow(order.id, order.amount)}
                                    isLoading={fundingId === order.id}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className={`text-[11px] font-semibold py-1 px-3 rounded-lg cursor-pointer ${
                                      activeWorkspace.verificationStatus === 'Verified'
                                        ? 'bg-[#059669] hover:bg-[#10B981] text-white'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                                    }`}
                                  >
                                    Fund Escrow
                                  </Button>
                                ) : (order.status === 'Funded' || order.status === 'In Transit') ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => openQrModal(order)}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className={`border text-[11px] font-semibold py-1 px-3 rounded-lg cursor-pointer ${
                                      activeWorkspace.verificationStatus === 'Verified'
                                        ? 'border-[#E5E7EB] hover:bg-stone-50 text-[#111827]'
                                        : 'border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed'
                                    }`}
                                  >
                                    Generate QR
                                  </Button>
                                ) : (
                                  <span className="text-[10px] text-[#059669] font-bold">✓ Settled</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Responsive Card Stack for Mobile Screens */}
                      <div className="flex flex-col gap-4 sm:hidden">
                        {merchantOrders.map(order => (
                          <div key={order.id} className="border border-[#E5E7EB] p-4.5 rounded-xl bg-[#FAFAF9]/30 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-[#059669] text-xs">#{order.id}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div>
                              <p className="font-bold text-[#111827] text-xs">{order.supplier}</p>
                              <p className="text-[10px] text-[#6B7280] mt-0.5 leading-relaxed">{order.details}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-1">
                              <span className="font-bold text-[#111827] text-xs">{order.amount} XLM</span>
                              <div>
                                {order.status === 'Initialized' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleLockEscrow(order.id, order.amount)}
                                    isLoading={fundingId === order.id}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className="bg-[#059669] text-[11px]"
                                  >
                                    Fund Escrow
                                  </Button>
                                ) : (order.status === 'Funded' || order.status === 'In Transit') ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => openQrModal(order)}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className="border border-[#E5E7EB] text-[11px]"
                                  >
                                    Generate QR
                                  </Button>
                                ) : (
                                  <span className="text-[10px] text-[#059669] font-bold">✓ Settled</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="py-16 text-center border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center p-6">
                      <AlertCircle className="w-8 h-8 text-[#6B7280] mb-3" />
                      <h4 className="text-sm font-bold text-[#111827] mb-1">No active orders yet.</h4>
                      <p className="text-xs text-[#6B7280] max-w-sm mb-4">You have settled all invoices. Wait for your suppliers to send new order invoices.</p>
                      <Button
                        variant="primary"
                        onClick={() => triggerAlert("Please request your wholesale supplier to send an order invoice. Or fund existing balances.", "Notice", "info")}
                        className="bg-[#059669] text-xs font-semibold py-2 px-4 rounded-xl"
                      >
                        Contact Supplier
                      </Button>
                    </div>
                  )}
                </div>

                {/* QR Code Handoff & Quick Actions Panel (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-8 w-full">
                  
                  {/* Generate QR Module card */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center">
                    <QrCode className="w-8 h-8 text-[#059669] mb-3" />
                    <h3 className="text-sm font-bold text-[#111827] mb-1">Generate Delivery QR</h3>
                    <p className="text-xs text-[#6B7280] max-w-xs mb-5">
                      Verify physical deliveries by generating a secure on-chain QR check. Show it to your driver on arrival.
                    </p>
                    
                    <div className="w-full bg-[#FAFAF9] border border-[#E5E7EB] p-4 rounded-xl flex flex-col items-center gap-3">
                      <div className="w-32 h-32 bg-white border border-[#E5E7EB] p-2.5 rounded-lg flex items-center justify-center">
                        <QrCode className="w-full h-full text-stone-300" />
                      </div>
                      <span className="text-[10px] text-[#6B7280] font-semibold">NO ACTIVE VERIFICATION QR CODE</span>
                    </div>

                    <Button
                      variant="primary"
                      disabled={activeWorkspace.verificationStatus !== 'Verified'}
                      onClick={() => {
                        const funded = orders.find(o => o.status === 'Funded' || o.status === 'In Transit');
                        if (funded) {
                          openQrModal(funded);
                        } else {
                          triggerAlert("No funded escrow orders available to verify. Please fund an order first.", "Notice", "info");
                        }
                      }}
                      className={`text-xs font-bold w-full py-3.5 mt-5 rounded-xl cursor-pointer ${
                        activeWorkspace.verificationStatus === 'Verified'
                          ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                          : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                      }`}
                    >
                      Generate QR
                    </Button>
                  </div>

                  {/* Merchant Quick Actions */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-4.5">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Merchant Quick Actions</h4>
                    <div className="flex flex-col gap-2.5">
                      <button 
                        onClick={() => {
                          if (activeWorkspace.verificationStatus !== 'Verified') {
                            triggerAlert("Verification Required: Workspace must be Verified to fund escrows.", "Verification Required", "error");
                            return;
                          }
                          const init = orders.find(o => o.status === 'Initialized');
                          if (init) handleLockEscrow(init.id, init.amount);
                          else triggerAlert("No initialized orders. Ask your supplier to create one.", "Notice", "info");
                        }}
                        className="flex items-center justify-between w-full text-left px-4 py-3 bg-[#FAFAF9] hover:bg-stone-100/60 rounded-xl text-xs font-semibold text-[#111827] border border-[#E5E7EB] cursor-pointer transition-colors"
                      >
                        <span>Fund Escrow</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#6B7280]" />
                      </button>
                      <button
                        onClick={() => triggerAlert("Wallet Activity Log: Settle on Stellar testnet Horizonal ledger.", "Wallet Activity", "info")}
                        className="flex items-center justify-between w-full text-left px-4 py-3 bg-[#FAFAF9] hover:bg-stone-100/60 rounded-xl text-xs font-semibold text-[#111827] border border-[#E5E7EB] cursor-pointer transition-colors"
                      >
                        <span>Wallet Activity</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#6B7280]" />
                      </button>
                      <button
                        onClick={() => setIsHelpOpen(true)}
                        className="flex items-center justify-between w-full text-left px-4 py-3 bg-[#FAFAF9] hover:bg-stone-100/60 rounded-xl text-xs font-semibold text-[#111827] border border-[#E5E7EB] cursor-pointer transition-colors"
                      >
                        <span>Support Desk</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* B.2 DISTRIBUTOR VIEWPORT */}
          {/* ======================================================== */}
          {activeWorkspace?.type === 'distributor' && (
            <div className="flex flex-col gap-10">
              
              {/* Hero welcome header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E5E7EB]">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">{activeWorkspace?.name} Dashboard</h1>
                  <p className="text-sm text-[#6B7280] font-medium mt-1">
                    Secure Payments. Verified Deliveries.
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="secondary"
                    onClick={resetMockData}
                    className="flex items-center gap-2 border border-[#E5E7EB] bg-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    Reset Mock Ledger
                  </Button>
                  <Button
                    onClick={() => {
                      if (activeWorkspace.verificationStatus !== 'Verified') {
                        triggerAlert("Verification Required: Distributor workspace must be Verified to initialize purchase invoices.", "Verification Required", "error");
                        return;
                      }
                      setIsCreateInvoiceOpen(true);
                    }}
                    className={`flex items-center gap-2 text-xs font-bold py-2 px-4.5 rounded-xl cursor-pointer ${
                      activeWorkspace.verificationStatus === 'Verified'
                        ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Create Invoice Order
                  </Button>
                </div>
              </div>

              {/* Metrics cards grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Guaranteed Revenue</span>
                  <span className="text-2xl font-extrabold text-[#059669] block mt-2">₱{(parseFloat(distributorStats.guaranteedRevenue) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="text-[9px] text-[#6B7280] block font-mono">{distributorStats.guaranteedRevenue} XLM Escrowed</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Pending Deliveries</span>
                  <span className="text-2xl font-extrabold text-[#111827] block mt-2">{distributorStats.pendingDeliveries}</span>
                  <span className="text-[9px] text-amber-600 font-bold block">Escrow funded</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Completed Deliveries</span>
                  <span className="text-2xl font-extrabold text-[#111827] block mt-2">{distributorStats.completedDeliveries}</span>
                  <span className="text-[9px] text-[#059669] font-bold block">Payouts released on-chain</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border-2 border-[#059669]/20 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Average Settlement Time</span>
                  <span className="text-2xl font-extrabold text-[#059669] block mt-2">Instant</span>
                  <span className="text-[9px] text-[#059669] font-bold block">Stellar Network speeds</span>
                </div>
              </div>

              {/* Invoices grid & QR scanner card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Revenue Assurance Panel (Left Column) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-6 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-base font-bold text-[#111827]">Revenue Assurance Panel</h3>
                    <div className="flex bg-[#E5E7EB]/40 p-1 rounded-xl border border-[#E5E7EB]/50 gap-1 text-[11px] font-bold">
                      {(['All', 'Awaiting Escrow', 'Ready to Dispatch', 'Completed'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setDistributorTab(tab)}
                          className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                            distributorTab === tab ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {distributorOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      
                      {/* Desktop Table View */}
                      <table className="w-full text-left border-collapse hidden sm:table">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] text-[#6B7280] text-[10px] font-bold tracking-wider uppercase pb-3">
                            <th className="pb-3.5">Order ID</th>
                            <th className="pb-3.5">Store / Address</th>
                            <th className="pb-3.5">Amount</th>
                            <th className="pb-3.5">Escrow Status</th>
                            <th className="pb-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/60 text-xs">
                          {distributorOrders.map(order => (
                            <tr key={order.id} className="hover:bg-[#FAFAF9]/50 transition-colors">
                              <td className="py-4 font-mono font-bold text-[#059669]">#{order.id}</td>
                              <td className="py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#111827]">{order.merchantName || "Brad's Sari-Sari Store"}</span>
                                  <span className="text-[10px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#6B7280] shrink-0" />
                                    {order.merchantAddress || "Tondo, Manila"}
                                  </span>
                                  <span className="text-[10px] text-stone-400 mt-1 font-sans">{order.details}</span>
                                </div>
                              </td>
                              <td className="py-4 font-bold text-[#111827]">{order.amount} XLM</td>
                              <td className="py-4">{getStatusBadge(order.status)}</td>
                              <td className="py-4 text-right">
                                {order.status === 'Initialized' ? (
                                  <span className="text-[11px] text-amber-600 font-semibold">Awaiting Deposit</span>
                                ) : order.status === 'Funded' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleShipOrder(order.id)}
                                    isLoading={isShippingId === order.id}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className={`text-[11px] font-semibold py-1 px-3 rounded-lg cursor-pointer ${
                                      activeWorkspace.verificationStatus === 'Verified'
                                        ? 'bg-[#059669] hover:bg-[#10B981] text-white'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                                    }`}
                                  >
                                    Ship Order
                                  </Button>
                                ) : order.status === 'In Transit' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => openScanner(order)}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className={`text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer animate-pulse ${
                                      activeWorkspace.verificationStatus === 'Verified'
                                        ? 'bg-[#059669] hover:bg-[#10B981] text-white'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                                    }`}
                                  >
                                    Scan QR code
                                  </Button>
                                ) : (
                                  <span className="text-[11px] text-[#059669] font-bold">✓ Settled</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
 
                      {/* stacked cards for mobile view */}
                      <div className="flex flex-col gap-4 sm:hidden">
                        {distributorOrders.map(order => (
                          <div key={order.id} className="border border-[#E5E7EB] p-4.5 rounded-xl bg-[#FAFAF9]/30 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-[#059669] text-xs">#{order.id}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div>
                              <p className="font-bold text-[#111827] text-xs">{order.merchantName || "Store Merchant"}</p>
                              <p className="text-[10px] text-[#6B7280] mt-0.5 leading-relaxed">{order.details}</p>
                              <p className="text-[9px] text-stone-400 mt-1 flex items-center gap-1 font-mono">
                                <MapPin className="w-3 h-3 text-stone-300" />
                                {order.merchantAddress || "Tondo, Manila"}
                              </p>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-1">
                              <span className="font-bold text-[#111827] text-xs">{order.amount} XLM</span>
                              <div>
                                {order.status === 'Initialized' ? (
                                  <span className="text-xs text-amber-600 font-semibold">Awaiting Deposit</span>
                                ) : order.status === 'Funded' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleShipOrder(order.id)}
                                    isLoading={isShippingId === order.id}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className="bg-[#059669] text-[11px]"
                                  >
                                    Ship Order
                                  </Button>
                                ) : order.status === 'In Transit' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => openScanner(order)}
                                    disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                    className="bg-[#059669] text-[11px] font-bold"
                                  >
                                    Scan QR
                                  </Button>
                                ) : (
                                  <span className="text-xs text-[#059669] font-bold">✓ Settled</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
 
                    </div>
                  ) : (
                    <div className="py-16 text-center border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center p-6">
                      <AlertCircle className="w-8 h-8 text-[#6B7280] mb-3" />
                      <h4 className="text-sm font-bold text-[#111827] mb-1">No deliveries scheduled.</h4>
                      <p className="text-xs text-[#6B7280] max-w-sm mb-4">No invoice transactions are currently active in this selection.</p>
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (activeWorkspace.verificationStatus !== 'Verified') {
                            triggerAlert("Verification Required: Workspace must be Verified to create order invoices.", "Verification Required", "error");
                            return;
                          }
                          setIsCreateInvoiceOpen(true);
                        }}
                        className={`text-xs font-semibold py-2 px-4 rounded-xl ${
                          activeWorkspace.verificationStatus === 'Verified'
                            ? 'bg-[#059669] text-white hover:bg-[#10B981]'
                            : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        Create Invoice
                      </Button>
                    </div>
                  )}
                </div>
 
                {/* QR Scanner Hub Panel (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-8 w-full">
                  
                  {/* Scanner interface card */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center">
                    <ScanLine className="w-8 h-8 text-[#059669] mb-3" />
                    <h3 className="text-sm font-bold text-[#111827] mb-1">QR Scanner Hub</h3>
                    <p className="text-xs text-[#6B7280] max-w-xs mb-5">
                      Verify physical handoffs at merchant stores to release locked payments on the blockchain.
                    </p>
                    
                    <div className="w-full bg-[#FAFAF9] border border-[#E5E7EB] p-4 rounded-xl flex flex-col items-center gap-3">
                      <div className="w-32 h-32 bg-white border border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                        <ScanLine className="w-10 h-10 text-stone-300" />
                      </div>
                      <span className="text-[10px] text-[#6B7280] font-semibold">CAMERA READY FOR HANDOFF</span>
                    </div>
 
                    <Button
                      variant="primary"
                      disabled={activeWorkspace.verificationStatus !== 'Verified'}
                      onClick={() => {
                        const inTransit = orders.find(o => o.status === 'In Transit');
                        if (inTransit) {
                          openScanner(inTransit);
                        } else {
                          triggerAlert("No 'In Transit' orders available to scan. Set an order status to 'Ship Order' first.", "Notice", "info");
                        }
                      }}
                      className={`text-xs font-bold w-full py-3.5 mt-5 rounded-xl cursor-pointer ${
                        activeWorkspace.verificationStatus === 'Verified'
                          ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                          : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                      }`}
                    >
                      Open Scanner
                    </Button>
                  </div>
 
                  {/* Delivery Route Operations checklist panel */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Logistics Dispatch Checklist</h4>
                    <ul className="flex flex-col gap-3 text-xs text-[#6B7280] font-normal">
                      <li className="flex gap-2 items-start">
                        <span className="w-4 h-4 rounded bg-[#059669]/10 text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                        <span>Confirm invoice order details match merchant inventory.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="w-4 h-4 rounded bg-[#059669]/10 text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                        <span>Ensure the merchant has funded the escrow before loading vehicle.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="w-4 h-4 rounded bg-[#059669]/10 text-[#059669] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                        <span>Scan the merchant's QR check during physical handoff.</span>
                      </li>
                    </ul>
                  </div>
 
                </div>
 
              </div>
 
            </div>
          )}
 
        </div>
 
      </div>
      </div>
 
      {/* ======================================================== */}
      {/* MOBILE VIEWPORT */}
      {/* ======================================================== */}
      <div className="flex md:hidden min-h-screen bg-[#FAFAF9] text-[#111827] flex-col font-sans relative w-full pb-24">
        
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="font-extrabold text-sm tracking-tight text-[#111827]">SariPay</span>
          </div>
          
          {/* Workspace Switcher Button */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-1.5 bg-[#FAFAF9] border border-[#E5E7EB] px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#111827] transition-all cursor-pointer truncate max-w-[170px]"
          >
            {activeWorkspace?.type === 'merchant' ? (
              <Store className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            ) : (
              <Truck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            )}
            <span className="truncate">{activeWorkspace?.name || 'Create Workspace'}</span>
            <ChevronDown className="w-3 h-3 text-[#6B7280] shrink-0" />
          </button>
        </header>

        {/* 1. HOME TAB */}
        {mobileTab === 'home' && (
          <div className="flex flex-col gap-5 pb-6">
            <div className="px-4 pt-5 pb-1">
              <h1 className="text-xl font-extrabold text-[#111827]">Mabuhay, {firstName}!</h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Welcome to your mobile business dashboard.</p>
            </div>

            {/* Compliance Warning Banner */}
            {activeWorkspace?.verificationStatus !== 'Verified' && (
              <div className="mx-4 bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex gap-2.5 items-start">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Verification Required</h4>
                    <p className="text-[10px] text-amber-800 font-normal leading-relaxed mt-0.5">
                      Your business workspace compliance status is <span className="font-bold">{activeWorkspace?.verificationStatus || 'Unverified'}</span>.
                      Please complete verification to unlock blockchain escrow settlements.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleOpenVerificationModal}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] py-2 px-4 rounded-xl shadow-sm cursor-pointer"
                >
                  {activeWorkspace?.verificationStatus === 'Unverified' ? 'Start Verification' : 'Update Documentation'}
                </Button>
              </div>
            )}

            {/* Horizontal Metric Cards (Swipable) */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto px-4 py-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                
                {/* Metric 1: Available Balance */}
                <div className="min-w-[85vw] snap-center bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Available Wallet Balance</span>
                    <span className="text-2xl font-extrabold text-[#111827] block mt-1">
                      ₱{(parseFloat(walletBalance || '0') * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2 mt-1">
                    <span className="text-[10px] text-[#6B7280] font-mono font-semibold">{walletBalance || '0.00'} XLM</span>
                    <span className="text-[8px] bg-emerald-50 text-[#059669] px-2 py-0.5 border border-[#059669]/10 rounded font-bold uppercase font-mono">Freighter Ledger</span>
                  </div>
                </div>

                {/* Metric 2: Funds In Trust / Guaranteed Revenue */}
                {activeWorkspace?.type === 'merchant' ? (
                  <div className="min-w-[85vw] snap-center bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[130px]">
                    <div>
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Funds In Escrow Trust</span>
                      <span className="text-2xl font-extrabold text-[#059669] block mt-1">
                        ₱{(parseFloat(merchantStats.lockedFunds) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2 mt-1">
                      <span className="text-[10px] text-[#6B7280] font-mono font-semibold">{merchantStats.lockedFunds} XLM Locked</span>
                      <span className="text-[8px] bg-emerald-50 text-[#059669] px-2 py-0.5 border border-[#059669]/10 rounded font-bold uppercase font-mono">Isolated Trust</span>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-[85vw] snap-center bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[130px]">
                    <div>
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Guaranteed Revenue</span>
                      <span className="text-2xl font-extrabold text-[#059669] block mt-1">
                        ₱{(parseFloat(distributorStats.guaranteedRevenue) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2 mt-1">
                      <span className="text-[10px] text-[#6B7280] font-mono font-semibold">{distributorStats.guaranteedRevenue} XLM Escrow Locked</span>
                      <span className="text-[8px] bg-emerald-50 text-[#059669] px-2 py-0.5 border border-[#059669]/10 rounded font-bold uppercase font-mono">Assured Ledger</span>
                    </div>
                  </div>
                )}

                {/* Metric 3: Active Orders / Deliveries */}
                <div className="min-w-[85vw] snap-center bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      {activeWorkspace?.type === 'merchant' ? 'Active Escrow Orders' : 'Scheduled Cargo Deliveries'}
                    </span>
                    <span className="text-2xl font-extrabold text-[#111827] block mt-1">
                      {activeWorkspace?.type === 'merchant' ? merchantStats.activeOrders : distributorStats.pendingDeliveries}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-2 mt-1">
                    <span className="text-[10px] text-[#6B7280] font-sans">Across all channels</span>
                    <span className="text-[8px] bg-[#6B7280]/10 text-[#6B7280] px-2 py-0.5 border border-stone-200 rounded font-bold uppercase">Active</span>
                  </div>
                </div>
              </div>

              {/* Swipe Guide Indicator */}
              <div className="flex justify-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
              </div>
            </div>

            {/* Role-Based Primary Action Banner */}
            <div className="px-4">
              {activeWorkspace?.type === 'merchant' ? (
                <button
                  onClick={() => {
                    if (activeWorkspace?.verificationStatus !== 'Verified') {
                      triggerAlert("Verification Required: Your business workspace must be Verified by SariPay compliance before generating handoff QR codes.", "Verification Required", "error");
                      return;
                    }
                    setIsQuickQrPickerOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4.5 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl shadow-md active:scale-[0.98] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <QrCode className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Generate QR Code</span>
                      <span className="text-[9px] text-white/80 block mt-0.5">Handoff code releases funds to supplier</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/90" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (activeWorkspace?.verificationStatus !== 'Verified') {
                      triggerAlert("Verification Required: Workspace must be Verified to scan handoff QR codes.", "Verification Required", "error");
                      return;
                    }
                    const inTransit = orders.find(o => o.status === 'In Transit');
                    if (inTransit) {
                      openScanner(inTransit);
                    } else {
                      triggerAlert("No 'In Transit' orders available to scan. Set an order status to 'Ship Order' first.", "Notice", "info");
                    }
                  }}
                  className="w-full flex items-center justify-between p-4.5 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl shadow-md active:scale-[0.98] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center animate-pulse">
                      <ScanLine className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Open Delivery Scanner</span>
                      <span className="text-[9px] text-white/80 block mt-0.5">Verify handoff to receive payout</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/90" />
                </button>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="px-4">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {activeWorkspace?.type === 'merchant' ? (
                  <>
                    <button
                      onClick={() => setMobileTab('orders')}
                      className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-[#059669]" />
                      <div>
                        <span className="text-xs font-bold text-[#111827] block">View Orders</span>
                        <span className="text-[9px] text-[#6B7280] block mt-0.5">Monitor invoices</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMerchantTab('Ready to Release');
                        setMobileTab('orders');
                      }}
                      className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                    >
                      <Truck className="w-5 h-5 text-[#059669]" />
                      <div>
                        <span className="text-xs font-bold text-[#111827] block">Track Deliveries</span>
                        <span className="text-[9px] text-[#6B7280] block mt-0.5">Handoff statuses</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (activeWorkspace?.verificationStatus !== 'Verified') {
                          triggerAlert("Verification Required: Workspace must be Verified to create invoices.", "Verification Required", "error");
                          return;
                        }
                        setIsCreateInvoiceOpen(true);
                      }}
                      className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                    >
                      <Plus className="w-5 h-5 text-[#059669]" />
                      <div>
                        <span className="text-xs font-bold text-[#111827] block">Create Invoice</span>
                        <span className="text-[9px] text-[#6B7280] block mt-0.5">Register purchase</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setMobileTab('orders')}
                      className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                    >
                      <Truck className="w-5 h-5 text-[#059669]" />
                      <div>
                        <span className="text-xs font-bold text-[#111827] block">View Deliveries</span>
                        <span className="text-[9px] text-[#6B7280] block mt-0.5">Track cargo lists</span>
                      </div>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setMobileTab('wallet')}
                  className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                >
                  <Wallet className="w-5 h-5 text-[#059669]" />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">Wallet Ledger</span>
                    <span className="text-[9px] text-[#6B7280] block mt-0.5">Verify balances</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col gap-2 text-left active:bg-stone-50 cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 text-[#059669]" />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">Help Center</span>
                    <span className="text-[9px] text-[#6B7280] block mt-0.5">Read platform FAQs</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="px-4">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Recent Escrows</h3>
              
              {orders.length === 0 ? (
                renderEmptyState('orders', 'Initialize First Order', () => {
                  if (activeWorkspace?.type === 'merchant') {
                    triggerAlert("Awaiting Distributor to invoice products for your store.", "Notice", "info");
                  } else {
                    setIsCreateInvoiceOpen(true);
                  }
                })
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.slice(0, 3).map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsMobileOrdersSheetOpen(true);
                      }}
                      className="bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-sm flex flex-col gap-3 active:bg-stone-50 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-extrabold text-xs text-[#059669]">#{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-xs text-[#111827]">
                          {activeWorkspace?.type === 'merchant' ? order.supplier : order.merchantName || 'Retail Store'}
                        </h4>
                        <p className="text-[10px] text-[#6B7280] mt-1 font-normal leading-relaxed">{order.details}</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-1">
                        <div>
                          <span className="text-xs font-extrabold text-[#111827] block">
                            ₱{(parseFloat(order.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[9px] font-mono text-[#6B7280] font-semibold block">{order.amount} XLM</span>
                        </div>
                        <span className="text-[10px] text-[#059669] font-bold">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ORDERS TAB */}
        {mobileTab === 'orders' && (
          <div className="flex flex-col gap-4 pb-6">
            <div className="px-4 pt-5">
              <h1 className="text-xl font-extrabold text-[#111827]">Escrows & Deliveries</h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Manage B2B ledger states and cargo shipping.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto px-4 py-1 hide-scrollbar">
              {activeWorkspace?.type === 'merchant' ? (
                (['All', 'Awaiting Transit', 'Ready to Release'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setMerchantTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-all border ${
                      merchantTab === tab 
                        ? 'bg-[#059669] text-white border-[#059669] shadow-sm' 
                        : 'bg-white text-[#6B7280] border-[#E5E7EB] active:bg-[#FAFAF9]'
                    }`}
                  >
                    {tab}
                  </button>
                ))
              ) : (
                (['All', 'Awaiting Escrow', 'Ready to Dispatch', 'Completed'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDistributorTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-all border ${
                      distributorTab === tab 
                        ? 'bg-[#059669] text-white border-[#059669] shadow-sm' 
                        : 'bg-white text-[#6B7280] border-[#E5E7EB] active:bg-[#FAFAF9]'
                    }`}
                  >
                    {tab}
                  </button>
                ))
              )}
            </div>

            {/* Orders list */}
            <div className="px-4 flex flex-col gap-3.5">
              {((activeWorkspace?.type === 'merchant' ? merchantOrders : distributorOrders).length === 0) ? (
                renderEmptyState('orders')
              ) : (
                (activeWorkspace?.type === 'merchant' ? merchantOrders : distributorOrders).map(order => (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsMobileOrdersSheetOpen(true);
                    }}
                    className="bg-white border border-[#E5E7EB] p-4.5 rounded-2xl shadow-sm flex flex-col gap-3 active:border-[#059669]/60 transition-all cursor-pointer text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-xs text-[#059669]">#{order.id}</span>
                        <span className="text-[8px] bg-stone-100 text-[#6B7280] font-bold px-1.5 py-0.5 rounded font-mono">STELLAR</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-xs text-[#111827]">
                        {activeWorkspace?.type === 'merchant' ? order.supplier : order.merchantName || 'Retail Store'}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">{order.details}</p>
                      <div className="flex items-center gap-1 text-[9px] text-[#6B7280] mt-1.5">
                        <MapPin className="w-3 h-3 text-[#6B7280] shrink-0" />
                        <span className="truncate">{activeWorkspace?.type === 'merchant' ? 'Warehouse Hub, Valenzuela' : order.merchantAddress || 'Metro Manila'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-3 mt-1" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <span className="text-xs font-extrabold text-[#111827] block">
                          ₱{(parseFloat(order.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[9px] font-mono text-[#6B7280] font-semibold mt-0.5 block">{order.amount} XLM</span>
                      </div>
                      
                      <div>
                        {activeWorkspace?.type === 'merchant' ? (
                          <>
                            {order.status === 'Initialized' ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleLockEscrow(order.id, order.amount)}
                                isLoading={fundingId === order.id}
                                disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                className={`text-[10px] font-bold py-1.5 px-3 rounded-xl cursor-pointer ${
                                  activeWorkspace.verificationStatus === 'Verified'
                                    ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                                }`}
                              >
                                Fund Escrow
                              </Button>
                            ) : order.status === 'Funded' || order.status === 'In Transit' ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openQrModal(order)}
                                disabled={activeWorkspace.verificationStatus !== 'Verified'}
                                className={`text-[10px] font-bold py-1.5 px-3 rounded-xl cursor-pointer ${
                                  activeWorkspace.verificationStatus === 'Verified'
                                    ? 'border-[#059669] text-[#059669] hover:bg-emerald-50/20'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                                }`}
                              >
                                Handoff QR
                              </Button>
                            ) : (
                              <span className="text-[10px] text-[#059669] font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Settled
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {order.status === 'Initialized' ? (
                              <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 border border-amber-100 rounded-full font-mono">Awaiting Escrow</span>
                            ) : order.status === 'Funded' ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleShipOrder(order.id)}
                                isLoading={isShippingId === order.id}
                                disabled={activeWorkspace?.verificationStatus !== 'Verified'}
                                className={`text-[10px] font-bold py-1.5 px-3 rounded-xl cursor-pointer ${
                                  activeWorkspace?.verificationStatus === 'Verified'
                                    ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                                }`}
                              >
                                Ship Order
                              </Button>
                            ) : order.status === 'In Transit' ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => openScanner(order)}
                                disabled={activeWorkspace?.verificationStatus !== 'Verified'}
                                className={`text-[10px] font-bold py-1.5 px-3 rounded-xl cursor-pointer ${
                                  activeWorkspace?.verificationStatus === 'Verified'
                                    ? 'bg-[#059669] hover:bg-[#10B981] text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
                                }`}
                              >
                                Scan QR
                              </Button>
                            ) : (
                              <span className="text-[10px] text-[#059669] font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Settled
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. WALLET TAB */}
        {mobileTab === 'wallet' && (
          <div className="flex flex-col gap-5 pb-6">
            <div className="px-4 pt-5">
              <h1 className="text-xl font-extrabold text-[#111827]">Secure B2B Wallet</h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5">On-chain transaction logs and isolated escrow holdings.</p>
            </div>

            {/* Premium Wallet balance card */}
            <div className="px-4">
              <div className="bg-gradient-to-br from-[#059669] to-[#047857] p-6 rounded-3xl shadow-md text-white">
                <span className="text-[10px] font-bold opacity-85 uppercase tracking-wider block">Stellar Available Balance</span>
                <span className="text-3xl font-extrabold block mt-1.5">
                  ₱{(parseFloat(walletBalance || '0') * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className="flex justify-between items-center border-t border-white/15 pt-3.5 mt-4 text-[10px] font-mono">
                  <span className="font-bold">{walletBalance || '0.00'} XLM</span>
                  <span className="opacity-80">{shortenAddress(walletAddress || "")}</span>
                </div>
              </div>
            </div>

            {/* Secondary: Escrow trust metrics */}
            <div className="px-4">
              <div className="bg-white border border-[#E5E7EB] p-4.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280] font-bold block uppercase tracking-wider">Funds In Escrow Trust</span>
                    <span className="text-base font-extrabold text-[#111827] mt-0.5 block">
                      ₱{((activeWorkspace?.type === 'merchant' ? parseFloat(merchantStats.lockedFunds) : parseFloat(distributorStats.guaranteedRevenue)) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#6B7280]">
                  {activeWorkspace?.type === 'merchant' ? merchantStats.lockedFunds : distributorStats.guaranteedRevenue} XLM
                </span>
              </div>
            </div>

            {/* Connected account metadata */}
            <div className="px-4">
              <div className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-xl p-3 flex justify-between items-center text-[10px] text-[#6B7280] font-mono font-bold uppercase">
                <span>Network Status: Online</span>
                <span className="text-[#059669]">Freighter Active</span>
              </div>
            </div>

            {/* Transactions History */}
            <div className="px-4">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">On-Chain Activity Logs</h3>
              
              {walletTransactions.length === 0 ? (
                renderEmptyState('escrows')
              ) : (
                <div className="flex flex-col gap-2.5">
                  {walletTransactions.map((tx) => {
                    return (
                      <div key={tx.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0`}>
                            {tx.type === 'in' ? (
                              <ArrowUpRight className="w-5 h-5 text-emerald-600 rotate-45" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#111827] block truncate">{tx.title}</span>
                            <span className="text-[10px] text-[#6B7280] block truncate mt-0.5 leading-none font-normal">{tx.description}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className={`text-xs font-extrabold block ${tx.type === 'in' ? 'text-emerald-600' : 'text-[#111827]'}`}>
                            {tx.type === 'in' ? '+' : '-'}{tx.amount} XLM
                          </span>
                          <span className="text-[9px] text-[#6B7280] font-mono font-bold mt-0.5 block">{tx.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {mobileTab === 'notifications' && (
          <div className="flex flex-col gap-4 pb-6">
            <div className="px-4 pt-5">
              <h1 className="text-xl font-extrabold text-[#111827]">Compliance & Escrow Alerts</h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Real-time status synchronization on the Stellar ledger.</p>
            </div>

            {/* Notification Filter Chips */}
            <div className="flex gap-2 overflow-x-auto px-4 py-1 hide-scrollbar">
              {(['all', 'transactions', 'deliveries', 'verification', 'system'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setNotifFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                    notifFilter === filter
                      ? 'bg-[#059669] text-white border-[#059669]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] active:bg-[#FAFAF9]'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="px-4 flex flex-col gap-3">
              {filteredNotifications.length === 0 ? (
                renderEmptyState('notifications')
              ) : (
                <>
                  {/* Clear All Header */}
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{filteredNotifications.length} Active Alerts</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-red-500 font-bold hover:text-red-600 active:scale-95 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Notification cards */}
                  {filteredNotifications.map((notif) => {
                    const isWarning = notif.type === 'warning';
                    const isSuccess = notif.type === 'success';
                    return (
                      <div 
                        key={notif.id}
                        className={`border rounded-2xl p-4 flex gap-3 bg-white text-left transition-all ${
                          isWarning ? 'border-amber-200' : isSuccess ? 'border-emerald-100' : 'border-[#E5E7EB]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isWarning ? 'bg-amber-50 text-amber-600' : isSuccess ? 'bg-emerald-50 text-[#059669]' : 'bg-[#FAFAF9] text-[#6B7280]'
                        }`}>
                          {isWarning ? <AlertCircle className="w-4.5 h-4.5" /> : isSuccess ? <CheckCircle className="w-4.5 h-4.5" /> : <Bell className="w-4.5 h-4.5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-[#111827] block truncate pr-2">{notif.title}</span>
                            <span className="text-[9px] text-[#6B7280] font-mono shrink-0 font-bold">{notif.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-[#6B7280] leading-relaxed mt-1 font-normal">{notif.message}</p>
                        </div>

                        {/* Individual Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1 text-stone-400 hover:text-red-500 active:scale-95 self-start shrink-0 ml-1 cursor-pointer"
                          aria-label="Delete Notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* 5. PROFILE TAB */}
        {mobileTab === 'profile' && (
          <div className="flex flex-col gap-6 pb-6">
            <div className="px-4 pt-5">
              <h1 className="text-xl font-extrabold text-[#111827]">Security & Settings</h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Manage biometrics and cryptographic keys.</p>
            </div>

            {/* Profile Brief Info */}
            <div className="px-4">
              <div className="bg-white border border-[#E5E7EB] p-4.5 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-[#059669] flex items-center justify-center font-bold text-base shrink-0 font-sans">
                  {profileName.trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-extrabold text-[#111827] truncate leading-tight">{profileName}</h3>
                  <p className="text-[10px] text-[#6B7280] truncate mt-0.5 leading-none">{profileEmail}</p>
                </div>
              </div>
            </div>

            {/* Connected Wallet detail box */}
            <div className="px-4">
              <div className="bg-[#FAFAF9] border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between text-xs text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Wallet className="w-4.5 h-4.5 text-[#059669] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-[#111827]">freighter Wallet</p>
                    <p className="text-[9px] font-mono text-[#6B7280] truncate max-w-[170px] mt-0.5">{walletAddress}</p>
                  </div>
                </div>
                <span className="text-[8px] bg-emerald-50 text-[#059669] font-bold font-mono px-2 py-0.5 border border-[#059669]/25 rounded shrink-0">ACTIVE</span>
              </div>
            </div>

            {/* Biometric Security Toggles */}
            <div className="px-4 space-y-3">
              <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider text-left">Security Preferences</h4>
              
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center justify-between bg-white border border-[#E5E7EB] p-4 rounded-2xl cursor-pointer active:bg-[#FAFAF9]">
                  <div className="flex items-center gap-3 text-left">
                    <Fingerprint className="w-5 h-5 text-[#059669]" />
                    <div>
                      <p className="text-xs font-bold text-[#111827]">Require Face ID Authorization</p>
                      <p className="text-[9px] text-[#6B7280] leading-tight font-normal mt-0.5">Release escrow contracts with face scanners</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={bioFaceId}
                    onChange={() => setBioFaceId(!bioFaceId)}
                    className="accent-[#059669] w-4.5 h-4.5 cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between bg-white border border-[#E5E7EB] p-4 rounded-2xl cursor-pointer active:bg-[#FAFAF9]">
                  <div className="flex items-center gap-3 text-left">
                    <Fingerprint className="w-5 h-5 text-[#059669]" />
                    <div>
                      <p className="text-xs font-bold text-[#111827]">Require Fingerprint Signatures</p>
                      <p className="text-[9px] text-[#6B7280] leading-tight font-normal mt-0.5">Dispatch shipment batches with fingerprint clicks</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={bioFingerprint}
                    onChange={() => setBioFingerprint(!bioFingerprint)}
                    className="accent-[#059669] w-4.5 h-4.5 cursor-pointer shrink-0"
                  />
                </label>
              </div>
            </div>

            {/* Settings links */}
            <div className="px-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider text-left">Account Settings</h4>
              
              <div className="flex flex-col gap-1 border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden text-xs">
                <button
                  onClick={() => {
                    setSettingsTab('profile');
                    setIsSettingsOpen(true);
                  }}
                  className="w-full text-left p-4 hover:bg-stone-50 active:bg-stone-100 flex justify-between items-center transition-colors border-b border-[#E5E7EB]/70 font-semibold text-[#111827] cursor-pointer"
                >
                  <span>Edit Profile Details</span>
                  <span className="text-[#6B7280]">→</span>
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('passkeys');
                    setIsSettingsOpen(true);
                  }}
                  className="w-full text-left p-4 hover:bg-stone-50 active:bg-stone-100 flex justify-between items-center transition-colors border-b border-[#E5E7EB]/70 font-semibold text-[#111827] cursor-pointer"
                >
                  <span>Registered Passkeys</span>
                  <span className="text-[#6B7280]">→</span>
                </button>

                <button
                  onClick={() => {
                    setSettingsTab('workspaces');
                    setIsSettingsOpen(true);
                  }}
                  className="w-full text-left p-4 hover:bg-stone-50 active:bg-stone-100 flex justify-between items-center transition-colors font-semibold text-[#111827] cursor-pointer"
                >
                  <span>Manage Workspaces</span>
                  <span className="text-[#6B7280]">→</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="px-4 pt-2">
              <button
                onClick={handleDisconnect}
                className="w-full text-center py-3.5 bg-red-50 hover:bg-red-100/70 border border-red-200 text-red-600 rounded-2xl text-xs font-bold cursor-pointer active:scale-[0.98] transition-all"
              >
                Disconnect & Log Out
              </button>
            </div>
          </div>
        )}

        {/* Floating Action Button (FAB) for Mobile View */}
        <div className="fixed bottom-20 right-4 z-40">
          {activeWorkspace?.type === 'merchant' ? (
            <button
              onClick={() => {
                if (activeWorkspace?.verificationStatus !== 'Verified') {
                  triggerAlert("Verification Required: Your business workspace must be Verified by SariPay compliance before generating handoff QR codes.", "Verification Required", "error");
                  return;
                }
                setIsQuickQrPickerOpen(true);
              }}
              className="w-14 h-14 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
              aria-label="Generate QR"
            >
              <QrCode className="w-6 h-6 text-white" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeWorkspace?.verificationStatus !== 'Verified') {
                  triggerAlert("Verification Required: Workspace must be Verified to scan handoff QR codes.", "Verification Required", "error");
                  return;
                }
                const inTransit = orders.find(o => o.status === 'In Transit');
                if (inTransit) {
                  openScanner(inTransit);
                } else {
                  triggerAlert("No 'In Transit' orders available to scan. Set an order status to 'Ship Order' first.", "Notice", "info");
                }
              }}
              className="w-14 h-14 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
              aria-label="Open Scanner"
            >
              <ScanLine className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] py-2 px-4 flex justify-around items-center z-40 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'orders', label: 'Orders', icon: FileText },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as any)}
                className="flex flex-col items-center justify-center py-1 px-3 min-w-[64px] min-h-[48px] rounded-xl transition-all relative cursor-pointer"
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#059669]' : 'text-[#6B7280]'}`} />
                <span className={`text-[10px] mt-1 font-semibold transition-colors ${isActive ? 'text-[#059669] font-bold' : 'text-[#6B7280]'}`}>
                  {tab.label}
                </span>
                {tab.id === 'notifications' && notifications.length > 0 && (
                  <span className="absolute top-1 right-3.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Workspace Switcher Bottom Sheet */}
        {isSwitcherOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSwitcherOpen(false)} />
            <div className="relative bg-white w-full rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto pb-8 z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto my-3 shrink-0" />
              <div className="px-6 pb-2.5 flex items-center justify-between border-b border-[#E5E7EB]">
                <h3 className="text-base font-extrabold text-[#111827]">Switch Workspace</h3>
                <button 
                  onClick={() => setIsSwitcherOpen(false)}
                  className="p-1.5 rounded-full bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-3 text-left">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      handleWorkspaceSwitch(ws.id);
                      setIsSwitcherOpen(false);
                    }}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      ws.id === activeWorkspaceId
                        ? 'bg-emerald-50/50 border-[#059669] text-[#059669]'
                        : 'bg-white border-[#E5E7EB] text-[#111827] active:bg-stone-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ws.id === activeWorkspaceId ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#FAFAF9] text-[#6B7280]'
                    }`}>
                      {ws.type === 'merchant' ? <Store className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold truncate">{ws.name}</p>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold mt-0.5">{ws.type} workspace</p>
                    </div>
                    {ws.id === activeWorkspaceId && (
                      <div className="w-5 h-5 bg-[#059669] text-white rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    handleOpenOnboarding();
                  }}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FAFAF9]/40 text-[#111827] hover:border-[#059669] active:bg-stone-100 transition-all text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#059669] shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Create Workspace</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5 font-semibold">Add a new retail or distributor workspace</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Mobile QR Code View Overlay */}
        {isQrModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-[#111827] flex flex-col md:hidden animate-in fade-in duration-300">
            <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <span className="text-sm font-bold text-white/90">Verification Handoff QR Code</span>
              <button 
                onClick={() => {
                  setIsQrModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-6 overflow-y-auto">
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-amber-200 font-bold font-sans uppercase">Screen Brightness Maxed Automatically</span>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-2xl relative overflow-hidden">
                <QRGenerator value={selectedOrder.id} size={240} />
              </div>

              <div className="w-full max-w-sm space-y-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white font-display">₱{(parseFloat(selectedOrder.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  <p className="text-xs text-white/60 mt-1 font-mono font-semibold">{selectedOrder.amount} XLM Locked</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 text-left text-xs font-mono text-white space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-sans">ORDER ID:</span>
                    <span className="font-bold text-[#059669]">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-sans">SUPPLIER:</span>
                    <span className="font-semibold truncate max-w-[180px]">{selectedOrder.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-sans">ESCROW STATUS:</span>
                    <span className="text-emerald-400 font-bold">{selectedOrder.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-500/10 py-3 rounded-xl border border-amber-500/20">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">ROTATES AUTOMATICALLY IN 04:59</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Mobile QR Scanner View Overlay */}
        {isScannerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-[#111827] flex flex-col md:hidden animate-in fade-in duration-300">
            <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <span className="text-sm font-bold text-white/90">Scan Merchant Handoff</span>
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-between py-10 px-6">
              <div className="text-center">
                <h3 className="text-base font-extrabold text-white">Position QR Code within Frame</h3>
                <p className="text-xs text-white/60 mt-1">Scanning for Order #{selectedOrder.id}</p>
              </div>

              <div className="w-full max-w-[270px] aspect-square relative my-4">
                <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
                
                {/* Fullscreen Scanner component instantiation */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner">
                  <QRScanner 
                    onScanSuccess={handleScanSuccess}
                    expectedValue={selectedOrder.id}
                  />
                </div>
              </div>

              <div className="w-full max-w-sm text-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 text-left text-xs font-mono text-white space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-sans">MERCHANT:</span>
                    <span className="font-bold">{selectedOrder.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-sans">CARGO DETAILS:</span>
                    <span className="font-semibold truncate max-w-[180px]">{selectedOrder.details}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-bold text-sm text-left">
                    <span className="text-emerald-400 font-sans font-bold">SETTLEMENT VALUE:</span>
                    <span className="text-emerald-400 font-display font-bold">₱{(parseFloat(selectedOrder.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Merchant: Quick QR Picker Sheet Overlay */}
        {isQuickQrPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsQuickQrPickerOpen(false)} />
            <div className="relative bg-white w-full rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto pb-8 z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto my-3 shrink-0" />
              <div className="px-6 pb-2.5 flex items-center justify-between border-b border-[#E5E7EB]">
                <h3 className="text-base font-extrabold text-[#111827]">Generate Handoff QR</h3>
                <button onClick={() => setIsQuickQrPickerOpen(false)} className="p-1.5 rounded-full bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-3">
                <p className="text-xs text-[#6B7280] mb-2 leading-relaxed text-left">
                  Select a funded or in-transit order escrow to generate the physical delivery verification code.
                </p>

                {orders.filter(o => o.status === 'Funded' || o.status === 'In Transit').length > 0 ? (
                  orders.filter(o => o.status === 'Funded' || o.status === 'In Transit').map(order => (
                    <button
                      key={order.id}
                      onClick={() => {
                        setIsQuickQrPickerOpen(false);
                        openQrModal(order);
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl border border-[#E5E7EB] bg-white active:bg-[#FAFAF9] text-left transition-all cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <span className="font-mono font-bold text-xs text-[#059669] block">#{order.id}</span>
                        <span className="font-bold text-xs text-[#111827] block truncate mt-1">{order.supplier}</span>
                        <span className="text-[10px] text-[#6B7280] block truncate mt-0.5">{order.details}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#111827] block">₱{(parseFloat(order.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full font-bold uppercase tracking-wider block mt-1.5">{order.status}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center border border-dashed border-[#E5E7EB] rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#111827]">No Funded Escrows Available</p>
                    <p className="text-[10px] text-[#6B7280] max-w-[200px] mx-auto mt-1 leading-normal font-semibold text-center">
                      Fund an active invoice under the Orders tab to generate verification code.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Order Detail Bottom Sheet */}
        {isMobileOrdersSheetOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => {
              setIsMobileOrdersSheetOpen(false);
              setSelectedOrder(null);
            }} />
            
            <div className="relative bg-white w-full rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto pb-8 z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto my-3 shrink-0" />
              
              <div className="px-6 pb-2.5 flex items-center justify-between border-b border-[#E5E7EB]">
                <div className="text-left">
                  <span className="text-[10px] font-mono font-extrabold text-[#059669]">ORDER ESCROW DETAILS</span>
                  <h3 className="text-sm font-extrabold text-[#111827] mt-0.5">Order #{selectedOrder.id}</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsMobileOrdersSheetOpen(false);
                    setSelectedOrder(null);
                  }} 
                  className="p-1.5 rounded-full bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-left">
                {/* Value Section */}
                <div className="bg-[#FAFAF9] border border-[#E5E7EB] p-5 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Escrow Contract Value</span>
                  <span className="text-3xl font-extrabold text-[#111827] block">
                    ₱{(parseFloat(selectedOrder.amount) * xlmPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#059669] block">{selectedOrder.amount} XLM</span>
                </div>

                {/* Info Grid */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start text-xs border-b border-stone-100 pb-2">
                    <span className="text-[#6B7280]">Supplier / Dispatcher</span>
                    <span className="font-bold text-[#111827] text-right">{selectedOrder.supplier}</span>
                  </div>
                  <div className="flex justify-between items-start text-xs border-b border-stone-100 pb-2">
                    <span className="text-[#6B7280]">Merchant / Receiver</span>
                    <span className="font-bold text-[#111827] text-right">{selectedOrder.merchantName || "Sari-Sari Store"}</span>
                  </div>
                  <div className="flex justify-between items-start text-xs border-b border-stone-100 pb-2">
                    <span className="text-[#6B7280]">Status Badge</span>
                    <span>{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs border-b border-stone-100 pb-2">
                    <span className="text-[#6B7280]">Handoff Address</span>
                    <span className="font-semibold text-[#111827]">{selectedOrder.merchantAddress || "Valenzuela Hub, Metro Manila"}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs pb-1">
                    <span className="text-[#6B7280]">Cargo Manifest Details</span>
                    <span className="font-semibold text-[#111827] leading-relaxed bg-[#FAFAF9] p-3 rounded-xl border border-[#E5E7EB]">{selectedOrder.details}</span>
                  </div>
                </div>

                {/* Blockchain Details Section */}
                <div className="border border-[#E5E7EB] rounded-2xl p-4 space-y-2.5 bg-emerald-50/10">
                  <h4 className="text-[10px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Stellar Soroban Cryptographic Proof
                  </h4>
                  <div className="text-[10px] space-y-1.5 font-mono text-[#6B7280]">
                    <div className="flex justify-between">
                      <span>Ledger State:</span>
                      <span className="text-emerald-700 font-bold">Synchronized</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contract Hash:</span>
                      <span className="truncate max-w-[150px]">{shortenAddress(walletAddress || "")}::soroban_escrow</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Limit:</span>
                      <span>12,500,000 CPU instructions</span>
                    </div>
                  </div>
                </div>

                {/* Context Action Button inside Details Sheet */}
                <div className="pt-2">
                  {activeWorkspace?.type === 'merchant' ? (
                    <>
                      {selectedOrder.status === 'Initialized' ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setIsMobileOrdersSheetOpen(false);
                            handleLockEscrow(selectedOrder.id, selectedOrder.amount);
                          }}
                          isLoading={fundingId === selectedOrder.id}
                          disabled={activeWorkspace.verificationStatus !== 'Verified'}
                          className="w-full py-4 text-xs font-bold bg-[#059669] text-white rounded-2xl cursor-pointer"
                        >
                          Fund Escrow Contract
                        </Button>
                      ) : selectedOrder.status === 'Funded' || selectedOrder.status === 'In Transit' ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setIsMobileOrdersSheetOpen(false);
                            openQrModal(selectedOrder);
                          }}
                          disabled={activeWorkspace.verificationStatus !== 'Verified'}
                          className="w-full py-4 text-xs font-bold bg-[#059669] text-white rounded-2xl cursor-pointer"
                        >
                          Generate Handoff QR Code
                        </Button>
                      ) : (
                        <div className="text-center py-2.5 bg-emerald-50 text-[#059669] font-bold text-xs rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5 font-semibold">
                          <CheckCircle className="w-4 h-4" /> Escrow Successfully Settled
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {selectedOrder.status === 'Initialized' ? (
                        <div className="text-center py-2.5 bg-amber-50 text-amber-600 font-semibold text-xs rounded-xl border border-amber-100 font-semibold">
                          Awaiting Escrow Deposit from Merchant
                        </div>
                      ) : selectedOrder.status === 'Funded' ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setIsMobileOrdersSheetOpen(false);
                            handleShipOrder(selectedOrder.id);
                          }}
                          isLoading={isShippingId === selectedOrder.id}
                          disabled={activeWorkspace?.verificationStatus !== 'Verified'}
                          className="w-full py-4 text-xs font-bold bg-[#059669] text-white rounded-2xl cursor-pointer"
                        >
                          Dispatch Cargo (Ship Order)
                        </Button>
                      ) : selectedOrder.status === 'In Transit' ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setIsMobileOrdersSheetOpen(false);
                            openScanner(selectedOrder);
                          }}
                          disabled={activeWorkspace?.verificationStatus !== 'Verified'}
                          className="w-full py-4 text-xs font-bold bg-[#059669] text-white rounded-2xl cursor-pointer"
                        >
                          Open Physical QR Scanner
                        </Button>
                      ) : (
                        <div className="text-center py-2.5 bg-emerald-50 text-[#059669] font-bold text-xs rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5 font-semibold">
                          <CheckCircle className="w-4 h-4" /> Escrow Successfully Settled
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
 
      {/* ======================================================== */}
      {/* C. ONBOARDING & SETTINGS MODALS */}
      {/* ======================================================== */}
      
      {/* C.1 WORKSPACE ONBOARDING FLOW MODAL */}
      <Modal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        title="Create Workspace"
      >
        <div className="flex flex-col gap-6">
          
          {/* STEP 1: WELCOME SCREEN */}
          {onboardingStep === 'welcome' && (
            <div className="flex flex-col items-center text-center p-4">
              <LogoIcon size={64} className="mb-6 animate-bounce" />
              <h3 className="text-2xl font-extrabold text-[#111827] mb-2">Welcome to SariPay</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm mb-8 font-normal">
                Let's create your first workspace. You can manage multiple retail stores or distributor channels under a single account.
              </p>
              <Button
                variant="primary"
                onClick={() => setOnboardingStep('selection')}
                className="bg-[#059669] hover:bg-[#10B981] text-white text-sm font-semibold w-full py-3.5 rounded-xl cursor-pointer"
              >
                Let's Start
              </Button>
            </div>
          )}

          {/* STEP 2: WORKSPACE SELECTION CARD STEP */}
          {onboardingStep === 'selection' && (
            <div className="flex flex-col gap-5 text-left">
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">What type of workspace would you like to create?</h3>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Choose the workspace that best matches how your business uses SariPay. You can always create additional workspaces later.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-2">
                {/* Selection A: Merchant Workspace */}
                <div 
                  onClick={() => {
                    setOnboardingType('merchant');
                    setNewWorkspaceName("");
                    setOnboardingStep('details');
                  }}
                  className="bg-white border border-[#E5E7EB] hover:border-[#059669]/60 p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all flex gap-4 items-start group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                    <Store className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#059669] transition-colors">Merchant Workspace</h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed mt-1 font-normal">
                      Buy inventory, fund escrows, verify deliveries, and manage supplier transactions.
                    </p>
                    <span className="text-[10px] text-stone-400 mt-2 block font-medium">Examples: Sari-Sari Store, Convenience Store, Restaurant</span>
                  </div>
                </div>

                {/* Selection B: Distributor Workspace */}
                <div 
                  onClick={() => {
                    setOnboardingType('distributor');
                    setNewWorkspaceName("");
                    setOnboardingStep('details');
                  }}
                  className="bg-white border border-[#E5E7EB] hover:border-[#059669]/60 p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all flex gap-4 items-start group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                    <Truck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#059669] transition-colors">Distributor Workspace</h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed mt-1 font-normal">
                      Manage deliveries, track guaranteed revenue, verify orders, and receive escrow settlements.
                    </p>
                    <span className="text-[10px] text-stone-400 mt-2 block font-medium">Examples: Wholesaler, Supplier, Warehouse Operator</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WORKSPACE DETAILS & CONFIRM */}
          {onboardingStep === 'details' && (
            <div className="flex flex-col gap-5 text-left">
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">Enter Workspace Details</h3>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Give your workspace a friendly business name so your partners can find you easily.
                </p>
              </div>

              <Input
                label="Workspace Business Name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g. John's Retail Grocery"
                id="onboarding-ws-name-input"
              />

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
                <Button
                  variant="secondary"
                  onClick={() => setOnboardingStep('selection')}
                  className="text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceName.trim()}
                  className="bg-[#059669] hover:bg-[#10B981] text-white text-xs font-bold py-2 px-5 rounded-xl cursor-pointer"
                >
                  Create {onboardingType === 'merchant' ? 'Merchant' : 'Distributor'} Workspace
                </Button>
              </div>
            </div>
          )}

        </div>
      </Modal>

      {/* C.2 SETTINGS MODAL */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings & Organization Management"
      >
        <div className="grid grid-cols-12 gap-6">
          
          {/* Side Tabs navigation */}
          <div className="col-span-12 md:col-span-3 flex md:flex-col gap-1 border-r border-[#E5E7EB]/80 pr-3 overflow-x-auto">
            {(['profile', 'security', 'passkeys', 'wallets', 'workspaces'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSettingsTab(tab)}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors shrink-0 ${
                  settingsTab === tab 
                    ? 'bg-[#059669]/5 text-[#059669]' 
                    : 'text-[#6B7280] hover:bg-[#FAFAF9] hover:text-[#111827]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Setting tabs body panel */}
          <div className="col-span-12 md:col-span-9 text-left min-h-[300px]">
            
            {/* Tab: Profile */}
            {settingsTab === 'profile' && (
              <div className="flex flex-col gap-6">
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-2">User Profile Settings</h4>
                  <Input
                    label="Full Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g. John Santos"
                    id="profile-name-input"
                  />
                  <Input
                    label="Primary Contact Email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="e.g. john@gmail.com"
                    id="profile-email-input"
                  />
                  <Button
                    type="submit"
                    className="bg-[#059669] hover:bg-[#10B981] text-white text-xs font-bold self-end px-5 py-2 mt-4 rounded-xl cursor-pointer"
                  >
                    Save Profile
                  </Button>
                </form>

                <div className="border-t border-[#E5E7EB] pt-6 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">Danger Zone</h4>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed font-normal">
                    To simulate a brand new registration or clear local testing data from the Vercel live server, click below. This will wipe out all database and device records.
                  </p>
                  <Button
                    type="button"
                    onClick={handleResetAllSimulatorData}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 px-4.5 rounded-xl border border-red-200/50 self-start cursor-pointer transition-colors"
                  >
                    Reset All Server & Client Data
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Security */}
            {settingsTab === 'security' && (
              <div className="flex flex-col gap-5">
                <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-2">Security Preferences</h4>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center justify-between border border-[#E5E7EB] p-4 rounded-xl cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">Require Face ID Authorization</p>
                      <p className="text-[10px] text-[#6B7280] font-normal mt-0.5">Use Face ID to authorize high-value escrow releases.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={bioFaceId}
                      onChange={() => setBioFaceId(!bioFaceId)}
                      className="accent-[#059669] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between border border-[#E5E7EB] p-4 rounded-xl cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">Require Fingerprint Signatures</p>
                      <p className="text-[10px] text-[#6B7280] font-normal mt-0.5">Confirm logistics dispatch updates using fingerprint scans.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={bioFingerprint}
                      onChange={() => setBioFingerprint(!bioFingerprint)}
                      className="accent-[#059669] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Tab: Passkey management */}
            {settingsTab === 'passkeys' && (
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Passkey Registry</h4>
                  <Button
                    onClick={handleRegisterPasskey}
                    className="bg-[#059669]/10 text-[#059669] text-[11px] font-bold py-1.5 px-3 rounded-lg border border-[#059669]/20 hover:bg-[#059669]/15 cursor-pointer"
                  >
                    Add Passkey
                  </Button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {passkeys.map((key, i) => (
                    <div key={i} className="flex justify-between items-center border border-[#E5E7EB] p-4 rounded-xl bg-[#FAFAF9]/50">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-[#059669]" />
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">{key}</p>
                          <p className="text-[9px] text-[#6B7280] font-mono mt-0.5">REGISTERED SECURE PATH</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setPasskeys(passkeys.filter(pk => pk !== key))}
                        className="text-stone-400 hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Connected Wallets list */}
            {settingsTab === 'wallets' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-2">Connected Stellar Wallets</h4>
                <div className="border border-[#E5E7EB] p-4.5 rounded-xl bg-[#FAFAF9] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-[#059669]" />
                    <div className="text-xs">
                      <p className="font-bold text-[#111827]">Stellar Freighter Wallet</p>
                      <p className="font-mono text-[9px] text-[#6B7280] mt-0.5">{walletAddress}</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-[#059669] font-bold px-2 py-0.5 border border-[#059669]/20 rounded-full font-mono">
                    ACTIVE
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Workspaces list */}
            {settingsTab === 'workspaces' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Active Workspaces</h4>
                  <Button
                    onClick={handleOpenOnboarding}
                    className="bg-[#059669]/10 text-[#059669] text-[11px] font-bold py-1.5 px-3 rounded-lg border border-[#059669]/20 hover:bg-[#059669]/15 cursor-pointer"
                  >
                    New Workspace
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {workspaces.map(ws => (
                    <div key={ws.id} className="flex justify-between items-center border border-[#E5E7EB] p-4 rounded-xl bg-white">
                      <div className="flex items-center gap-3">
                        {ws.type === 'merchant' ? (
                          <Store className="w-5 h-5 text-[#059669]" />
                        ) : (
                          <Truck className="w-5 h-5 text-[#059669]" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-[#111827]">{ws.name}</span>
                          <span className="text-[10px] bg-[#6B7280]/10 text-[#6B7280] font-semibold px-2 py-0.2 rounded-full border border-stone-200/50 uppercase ml-2 text-[8px]">
                            {ws.type}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteWorkspace(ws.id)}
                        className="text-stone-400 hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </Modal>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Help Center & FAQs"
      >
        <div className="flex flex-col gap-5 text-left">
          
          {/* Interactive Simulation Guide */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4.5 text-xs">
            <h5 className="font-bold text-[#059669] mb-1.5 flex items-center gap-1.5">
              🚀 Quick Escrow Simulation Test Guide
            </h5>
            <p className="text-[#047857] mb-3 leading-relaxed">
              To test the B2B escrow transaction cycle, follow these 5 quick steps:
            </p>
            <ol className="space-y-2.5 text-stone-700 font-medium list-decimal list-inside pl-1">
              <li>
                <span className="font-bold text-stone-900">Verify:</span> Click the <span className="underline text-[#059669]">Verify Workspace</span> banner and complete the quick 4-step wizard.
              </li>
              <li>
                <span className="font-bold text-stone-900">Initialize:</span> In the <span className="font-semibold text-stone-900">Merchant Workspace</span>, add or import a new order invoice.
              </li>
              <li>
                <span className="font-bold text-stone-900">Deposit:</span> Open the order and click <span className="underline text-[#059669]">Fund Escrow Contract</span> to lock funds on-chain.
              </li>
              <li>
                <span className="font-bold text-stone-900">Dispatch:</span> Switch to the <span className="font-semibold text-stone-900">Distributor Workspace</span> at the top and click <span className="underline text-[#059669]">Dispatch Cargo (Ship Order)</span>.
              </li>
              <li>
                <span className="font-bold text-stone-900">Handoff:</span> Switch to the <span className="font-semibold text-stone-900">Merchant Workspace</span> and generate the QR code. Switch back to <span className="font-semibold text-stone-900">Distributor Workspace</span>, open the scanner, and click <span className="underline text-[#059669]">Simulate Success</span> to release the funds!
              </li>
            </ol>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">Frequently Asked Questions</h4>
            <div className="flex flex-col gap-3.5">
              <div className="border-b border-[#E5E7EB] pb-3">
                <p className="text-xs font-bold text-[#111827] mb-1">What is the difference between Available Balance and Funds in Trust?</p>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  <strong>Available Balance</strong> is your active spending money. <strong>Funds in Trust</strong> is the total amount currently locked in secure smart contracts for pending orders. Funds in Trust are never touched by suppliers until you verify delivery.
                </p>
              </div>
              <div className="border-b border-[#E5E7EB] pb-3">
                <p className="text-xs font-bold text-[#111827] mb-1">What is smart contract escrow?</p>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Escrow is a secure container that isolates merchant funds on the Stellar network. Payouts are only released to the supplier's wallet when delivery verification succeeds.
                </p>
              </div>
              <div className="border-b border-[#E5E7EB] pb-3">
                <p className="text-xs font-bold text-[#111827] mb-1">How do I verify a delivery?</p>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  As a merchant, present the order's handoff QR code to the driver. The driver will scan it using the SariPay app. Verification release clears on the ledger under 5 seconds.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#111827] mb-1">Are there transaction costs?</p>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  SariPay fees are near-zero (0.1% per settled escrow contract). Network gas fees on Stellar Soroban contracts average less than ₱0.01 per signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* MERCHANT VERIFICATION QR MODAL */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Merchant Handoff Verification"
      >
        {selectedOrder && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs text-[#6B7280] font-normal">
              Present this handoff code to the delivery driver. When scanned, the smart contract will authorize releasing the locked escrow funds to the supplier.
            </p>
            
            <div className="my-2 bg-[#FAFAF9] p-3 rounded-2xl border border-[#E5E7EB] shadow-inner">
              <QRGenerator value={selectedOrder.id} size={220} />
            </div>

            <div className="bg-[#FAFAF9] p-4.5 rounded-xl border border-[#E5E7EB] text-left w-full font-mono text-xs text-[#111827]">
              <div className="flex justify-between mb-1">
                <span className="text-[#6B7280] font-sans font-normal">ORDER ID:</span>
                <span className="font-bold">#{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-[#6B7280] font-sans font-normal">SUPPLIER:</span>
                <span>{selectedOrder.supplier}</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E7EB] pt-2 mt-2 font-bold text-sm">
                <span className="text-[#059669] font-sans">ESCROW VALUE:</span>
                <span className="text-[#059669] font-display font-extrabold">{selectedOrder.amount} XLM</span>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => setIsQrModalOpen(false)}
              className="w-full mt-2 rounded-xl border border-[#E5E7EB] hover:bg-stone-50 py-3 text-xs font-semibold cursor-pointer"
            >
              Close Handoff Code
            </Button>
          </div>
        )}
      </Modal>

      {/* DISTRIBUTOR CREATE ORDER MODAL */}
      <Modal
        isOpen={isCreateInvoiceOpen}
        onClose={() => {
          setIsCreateInvoiceOpen(false);
          setInvoiceError(null);
        }}
        title="Initialize New Purchase Invoice"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="flex flex-col gap-4">
          <Input
            label="Merchant Name / Store"
            placeholder="e.g. Nena's Sari-Sari Store"
            value={invoiceMerchantName}
            onChange={(e) => setInvoiceMerchantName(e.target.value)}
            disabled={isSubmittingInvoice}
            id="dist-invoice-merchant-name"
          />
          <Input
            label="Merchant Wallet Address"
            placeholder="G..."
            value={invoiceMerchantAddr}
            onChange={(e) => setInvoiceMerchantAddr(e.target.value)}
            disabled={isSubmittingInvoice}
            id="dist-invoice-merchant-addr"
          />
          <Input
            label="Invoice Value (XLM)"
            placeholder="0.00"
            type="number"
            step="0.01"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            disabled={isSubmittingInvoice}
            id="dist-invoice-amount"
          />
          
          <div className="flex flex-col gap-1.5 w-full text-left">
            <label htmlFor="dist-invoice-details" className="text-xs font-semibold text-[#6B7280] font-sans">
              Product Handoff Details
            </label>
            <textarea
              id="dist-invoice-details"
              rows={3}
              placeholder="e.g. 5x Coca-Cola cases, 2x Breeze boxes"
              value={invoiceDetails}
              onChange={(e) => setInvoiceDetails(e.target.value)}
              disabled={isSubmittingInvoice}
              className="w-full px-4 py-3 bg-[#FAFAF9] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-stone-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all font-sans text-sm"
            />
          </div>

          {invoiceError && (
            <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
              ⚠️ {invoiceError}
            </p>
          )}

          <div className="border-t border-[#E5E7EB] pt-4 mt-2 flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsCreateInvoiceOpen(false)}
              disabled={isSubmittingInvoice}
              className="rounded-xl border border-[#E5E7EB]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmittingInvoice}
              className="bg-[#059669] hover:bg-[#10B981] text-white rounded-xl active:scale-95 transition-all duration-200"
            >
              Initialize Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* DISTRIBUTOR QR CODE SCANNER MODAL */}
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="Verification Scan - Claim Payout"
      >
        {selectedOrder && (
          <QRScanner 
            onScanSuccess={handleScanSuccess}
            expectedValue={selectedOrder.id}
          />
        )}
      </Modal>

      {/* WORKSPACE SUBMIT BUSINESS DETAILS VERIFICATION MODAL */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        title="Workspace Compliance Verification"
      >
        <div className="flex flex-col gap-4 text-left">
          {/* Progress Indicator */}
          <div className="w-full bg-stone-100 rounded-full h-1.5 mb-2 relative overflow-hidden">
            <div 
              className="bg-[#059669] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(vStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            <span>Step {vStep} of 4: {
              vStep === 1 ? 'Business Profile' :
              vStep === 2 ? 'Documents Upload' :
              vStep === 3 ? 'Review details' : 'Final Submit'
            }</span>
            <span>{vStep * 25}% Complete</span>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (vStep < 4) {
              setVStep(vStep + 1);
            } else {
              handleVerificationSubmit(e);
            }
          }} className="flex flex-col gap-4">
            
            {/* STEP 1: BUSINESS PROFILE */}
            {vStep === 1 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Please provide your business and owner details to start compliance review.
                </p>
                {activeWorkspace?.type === 'merchant' ? (
                  <>
                    <Input
                      label="Store Owner Full Name"
                      placeholder="e.g. John Santos"
                      value={vOwnerName}
                      onChange={(e) => setVOwnerName(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="merchant-owner-name-verification"
                    />
                    <Input
                      label="Store Owner Contact Number"
                      placeholder="e.g. 09171234567"
                      value={vContactNumber}
                      onChange={(e) => setVContactNumber(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="merchant-contact-num-verification"
                    />
                    <Input
                      label="Store Business Address"
                      placeholder="e.g. Stall #12, Public Market, Manila"
                      value={vStoreAddress}
                      onChange={(e) => setVStoreAddress(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="merchant-store-address-verification"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Registered Company Name"
                      placeholder="e.g. Santos Logistics Distribution"
                      value={vCompanyName}
                      onChange={(e) => setVCompanyName(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="distributor-company-name-verification"
                    />
                    <Input
                      label="Primary Contact Person"
                      placeholder="e.g. Ramon Santos"
                      value={vContactPerson}
                      onChange={(e) => setVContactPerson(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="distributor-contact-person-verification"
                    />
                    <Input
                      label="Contact Number"
                      placeholder="e.g. 09171234567"
                      value={vContactNumber}
                      onChange={(e) => setVContactNumber(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="distributor-contact-num-verification"
                    />
                    <Input
                      label="Warehouse Address"
                      placeholder="e.g. Block 5, Valenzuela Logistics Center, Metro Manila"
                      value={vWarehouseAddress}
                      onChange={(e) => setVWarehouseAddress(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="distributor-warehouse-address-verification"
                    />
                    <Input
                      label="SEC/DTI Corporate Registration ID"
                      placeholder="e.g. SEC-REG-10294-88"
                      value={vRegistryId}
                      onChange={(e) => setVRegistryId(e.target.value)}
                      disabled={isSubmittingVerification}
                      required
                      id="distributor-registry-id-verification"
                    />
                  </>
                )}
              </div>
            )}

            {/* STEP 2: DOCUMENTS */}
            {vStep === 2 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Regulatory compliance requires visual proof of registration. Review pre-registered draft attachments below.
                </p>
                {activeWorkspace?.type === 'merchant' ? (
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div className="flex flex-col gap-1 w-full text-xs">
                      <span className="font-semibold text-stone-500">Government Photo ID</span>
                      <div className="bg-[#FAFAF9] border border-dashed border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between text-[10px] text-[#6B7280] font-medium mt-1">
                        <span>✓ gov_photo_id.jpg attached</span>
                        <span className="text-emerald-600 font-bold">Pending Review</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full text-xs">
                      <span className="font-semibold text-stone-500">Barangay Permit (PDF)</span>
                      <div className="bg-[#FAFAF9] border border-dashed border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between text-[10px] text-[#6B7280] font-medium mt-1">
                        <span>✓ barangay_permit_2026.pdf attached</span>
                        <span className="text-emerald-600 font-bold">Pending Review</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div className="flex flex-col gap-1 w-full text-xs">
                      <span className="font-semibold text-stone-500">SEC Registration Document</span>
                      <div className="bg-[#FAFAF9] border border-dashed border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between text-[10px] text-[#6B7280] font-medium mt-1">
                        <span>✓ sec_registration_2026.pdf attached</span>
                        <span className="text-emerald-600 font-bold">Pending Review</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full text-xs">
                      <span className="font-semibold text-stone-500">Business Registration (DTI)</span>
                      <div className="bg-[#FAFAF9] border border-dashed border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between text-[10px] text-[#6B7280] font-medium mt-1">
                        <span>✓ dti_permit_2026.pdf attached</span>
                        <span className="text-emerald-600 font-bold">Pending Review</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {vStep === 3 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Verify that all details entered match your official corporate registration documentation.
                </p>
                <div className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-xl p-4.5 space-y-2 text-xs">
                  {activeWorkspace?.type === 'merchant' ? (
                    <>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Owner Name</span>
                        <span className="font-bold text-[#111827]">{vOwnerName}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Contact Number</span>
                        <span className="font-mono font-bold text-[#111827]">{vContactNumber}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-stone-500">Store Business Address</span>
                        <span className="font-semibold text-[#111827] leading-normal">{vStoreAddress}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Company Name</span>
                        <span className="font-bold text-[#111827]">{vCompanyName}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Contact Person</span>
                        <span className="font-bold text-[#111827]">{vContactPerson}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Contact Number</span>
                        <span className="font-mono font-bold text-[#111827]">{vContactNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-500">Registry ID</span>
                        <span className="font-mono font-bold text-[#111827]">{vRegistryId}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-stone-500">Warehouse Address</span>
                        <span className="font-semibold text-[#111827] leading-normal">{vWarehouseAddress}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: SUBMIT */}
            {vStep === 4 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  By submitting this request, you agree that all documents provided belong to the active business entity and comply with regulatory security norms.
                </p>
                <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4.5 flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 font-normal leading-relaxed">
                    <h5 className="font-bold text-emerald-900 mb-1">Corporate Compliance Pledge</h5>
                    I certify that these details are authentic. SariPay compliance department will approve registration within 24 business hours.
                  </div>
                </div>
              </div>
            )}

            {vSubmitError && (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                ⚠️ {vSubmitError}
              </p>
            )}

            {/* Button Actions */}
            <div className="border-t border-[#E5E7EB] pt-4 mt-2 flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  if (vStep > 1) {
                    setVStep(vStep - 1);
                  } else {
                    setIsVerificationModalOpen(false);
                  }
                }}
                disabled={isSubmittingVerification}
                className="rounded-xl border border-[#E5E7EB]"
              >
                {vStep > 1 ? 'Back' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                isLoading={isSubmittingVerification}
                className="bg-[#059669] hover:bg-[#10B981] text-white rounded-xl active:scale-95 transition-all duration-200"
              >
                {vStep < 4 ? 'Next' : 'Submit Verification'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* SYSTEM ALERT MODAL (RESPONSIVE) */}
      <Modal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
      >
        <div className="flex flex-col gap-4 text-left p-2">
          <div className="flex items-start gap-3.5">
            {alertConfig.type === 'error' && (
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-500">
                <ShieldAlert className="w-5.5 h-5.5" />
              </div>
            )}
            {alertConfig.type === 'success' && (
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <CheckCircle className="w-5.5 h-5.5" />
              </div>
            )}
            {alertConfig.type === 'info' && (
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-500">
                <AlertCircle className="w-5.5 h-5.5" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-1">
                {alertConfig.message}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-[#E5E7EB]">
            <Button
              variant="primary"
              onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
              className="bg-[#059669] hover:bg-[#10B981] text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer text-white"
            >
              Okay, Got it
            </Button>
          </div>
        </div>
      </Modal>

    </>
  );
}
