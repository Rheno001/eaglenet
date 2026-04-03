import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

export default function PaymentWatcher({ user }) {
  const lastPaymentId = useRef(localStorage.getItem('last_seen_payment'));

  useEffect(() => {
    // Only run for Admins/Superadmins
    const role = user?.role?.toLowerCase();
    if (role !== 'admin' && role !== 'superadmin') return;

    const checkPayments = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
        const res = await fetch(`${apiBase}/api/payments?limit=1&status=SUCCESS`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) return;
        
        const result = await res.json();
        
        if (result.status === 'success' && result.data?.length > 0) {
          const newest = result.data[0];
          
          // Verify it's actually a new payment we haven't seen in this session or storage
          if (newest.id !== lastPaymentId.current) {
            
            // Only show toast if we HAD a previous ID (ignore first run after boot/storage clear)
            if (lastPaymentId.current) {
               Swal.fire({
                title: 'New Settlement Detected',
                html: `<b>${newest.user?.firstName || 'A customer'}</b> has just settled a freight charge of <b>₦${parseFloat(newest.amount).toLocaleString()}</b>.`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 6000,
                timerProgressBar: true,
                background: '#ffffff',
                color: '#0f172a',
                iconColor: '#10b981',
                showClass: {
                  popup: 'animate__animated animate__fadeInRight'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutRight'
                }
              });
            }
            
            lastPaymentId.current = newest.id;
            localStorage.setItem('last_seen_payment', newest.id);
          }
        }
      } catch {
        // Silently handle errors to not disturb admin UX
        console.debug("Payment watcher polled, but server was busy.");
      }
    };

    // Check every 20 seconds
    const interval = setInterval(checkPayments, 20000);
    checkPayments(); // Initial check

    return () => clearInterval(interval);
  }, [user]);

  return null;
}
