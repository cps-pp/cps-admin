'use client'

import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import Logo from '../../images/logo/cps-logo.png'
import SidebarTemplate from './SidebarTemplate'
import { FOLLOW, IMPORT, MENU, REPORTALL, SERVICE } from '../../configs/nav'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { role } = useAuth()
  const { pathname } = useLocation()
  const trigger = useRef(null)
  const sidebar = useRef(null)

  const filterSubs = (subs) => {
    if (!subs) return undefined
    return subs.filter(
      item =>
        !(
          role === 'admin' &&
          (item.path === '/manager/employee' || item.path === '/manager/servicelist')
        )
    )
  }

  const filteredMENU = MENU.map(menu => ({
    ...menu,
    subs: filterSubs(menu.subs),
  }))

  useEffect(() => {
    const clickHandler = (e) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(e.target) ||
        trigger.current.contains(e.target)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [sidebarOpen])

  useEffect(() => {
    const keyHandler = (e) => {
      if (!sidebarOpen || e.key !== 'Escape') return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [sidebarOpen])

  const stored = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    stored ? stored === 'true' : false
  )

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', String(sidebarExpanded))
    document.body.classList.toggle('sidebar-expanded', sidebarExpanded)
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute z-20 left-0 top-0 flex h-screen w-64 flex-col overflow-y-hidden bg-black dark:bg-boxdark duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <NavLink to="/dashboard">
          <img src={Logo} alt="Logo" width={160} />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar px-4 py-2">
        {/* MENU */}
        <section className="mb-6">
          <h3 className="px-2 text-sm font-semibold text-gray-400">ເມນູ</h3>
          <ul className="mt-2 space-y-1">
            {filteredMENU.map(menu => (
              <SidebarTemplate
                key={menu.path}
                menu={menu}
                pathname={pathname}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
              />
            ))}
          </ul>
        </section>

        {/* SERVICE */}
        <section className="mb-6">
          <h3 className="px-2 text-sm font-semibold text-gray-400">ບໍລິການ</h3>
          <ul className="mt-2 space-y-1">
            {SERVICE.map(menu => (
              <SidebarTemplate
                key={menu.path}
                menu={menu}
                pathname={pathname}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
              />
            ))}
          </ul>
        </section>

        {/* FOLLOW */}
        <section className="mb-6">
          <h3 className="px-2 text-sm font-semibold text-gray-400">ຕິດຕາມການປິ່ວປົວ</h3>
          <ul className="mt-2 space-y-1">
            {FOLLOW.map(menu => (
              <SidebarTemplate
                key={menu.path}
                menu={menu}
                pathname={pathname}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
              />
            ))}
          </ul>
        </section>

        {/* IMPORT */}
        <section className="mb-6">
          <h3 className="px-2 text-sm font-semibold text-gray-400">ສັ່ງຊື່ ແລະ ນຳເຂົ້າ</h3>
          <ul className="mt-2 space-y-1">
            {IMPORT.map(menu => (
              <SidebarTemplate
                key={menu.path}
                menu={menu}
                pathname={pathname}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
              />
            ))}
          </ul>
        </section>

        {/* REPORTALL */}
        <section className="mb-6">
          <h3 className="px-2 text-sm font-semibold text-gray-400">ລາຍງານ</h3>
          <ul className="mt-2 space-y-1">
            {REPORTALL.map(menu => (
              <SidebarTemplate
                key={menu.path}
                menu={menu}
                pathname={pathname}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
              />
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}

export default Sidebar
