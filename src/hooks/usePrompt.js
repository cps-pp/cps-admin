// src/hooks/usePrompt.js
import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePrompt(message, when) {
  const navigator = useContext(NavigationContext).navigator;

  const confirmNavigation = useCallback(() => {
    return window.confirm(message);
  }, [message]);

  useEffect(() => {
    if (!when) return;

    // เก็บ original methods
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;
    const originalGo = navigator.go;

    // Override navigation methods
    navigator.push = (to, options) => {
      if (confirmNavigation()) {
        originalPush.call(navigator, to, options);
      }
    };

    navigator.replace = (to, options) => {
      if (confirmNavigation()) {
        originalReplace.call(navigator, to, options);
      }
    };

    navigator.go = (delta) => {
      if (confirmNavigation()) {
        originalGo.call(navigator, delta);
      }
    };

    // จัดการ popstate event (สำหรับปุ่ม back/forward ของเบราว์เซอร์)
    const handlePopState = (event) => {
      if (!confirmNavigation()) {
        // ถ้าผู้ใช้ไม่ยืนยัน ให้ push state กลับไปที่เดิม
        window.history.pushState(null, '', window.location.href);
      }
    };

    // เพิ่ม popstate event listener
    window.addEventListener('popstate', handlePopState);

    // Push current state เพื่อให้ popstate ทำงาน
    window.history.pushState(null, '', window.location.href);

    // จัดการ beforeunload (สำหรับ refresh/close tab)
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      // คืนค่า original methods
      navigator.push = originalPush;
      navigator.replace = originalReplace;
      navigator.go = originalGo;

      // ลบ event listeners
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message, when, navigator, confirmNavigation]);
}