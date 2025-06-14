import React from 'react';
import SidebarLinkGroup from './SidebarLinkGroup';
import { NavLink } from 'react-router-dom';

const SidebarTemplate = ({
  menu,
  pathname,
  sidebarExpanded,
  setSidebarExpanded,
}) => {
  if (menu.subs?.length) {
    return (
      <SidebarLinkGroup
        activeCondition={
          pathname === `/${menu.path}` || pathname.includes(menu.path)
        }
      >
        {(handleClick, open) => {
          return (
            <>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-form-strokedark duration-300 ease-in-out hover:bg-secondary2 hover:text-white ${
                  (pathname === `/${menu.path}` ||
                    pathname.includes(menu.path)) &&
                    'bg-secondary2 text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
              >
                {menu.icon} {menu.name}
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                    open && 'rotate-180'
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </NavLink>

              {/* Dropdown Menu */}
              <div
                className={`translate transform overflow-hidden ${
                  !open && 'hidden'
                }`}
              >
                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6 list-none">
                  {menu.subs.map((sub) => (
                    <li key={sub.path}>
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) =>
                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-form-strokedark duration-300 ease-in-out hover:text-secondary2 ' +
                          (isActive ? '!text-secondary2 font-semibold' : '')
                        }
                      >
                        {sub.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          );
        }}
      </SidebarLinkGroup>
    );
  }

  return (
    <li>
      <NavLink
        to={`/${menu.path}`}
        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-form-strokedark duration-300 ease-in-out hover:bg-secondary2 hover:text-white ${
          pathname.includes(menu.path) && 'bg-secondary2 text-white'
        }`}
      >
        {menu.icon}
        {menu.name}
      </NavLink>
    </li>
  );
};

export default SidebarTemplate;
