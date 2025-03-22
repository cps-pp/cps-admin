import Account from '@/pages/Admin';
import SignIn from '@/pages/Authentication/SignIn';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import { ReactElement } from 'react';

import PatientPage from '@/pages/Manager/Patient';
import CreatePatient from '@/pages/Manager/Patient/create';
import EmployeePage from '@/pages/Manager/Employee';
import Dashboard from '@/pages/Dashboard';
import CategoryPage from '@/pages/Manager/Category';
import MedicinesPage from '@/pages/Manager/Medicines';
import EquipmentPage from '@/pages/Manager/MedicinesEquipment';
import ServcicePage from '@/pages/Manager/ServiceList';
import ExchangePage from '@/pages/Manager/Exchange';
import SupplierPage from '@/pages/Manager/Supplier';
import ServicePatientPage from '@/pages/Service/ServicePatient';
import FollowPage from '@/pages/Follow';
import DetailPatient from '@/pages/Manager/Patient/detail';
import EditPatient from '@/pages/Manager/Patient/edit';
import DiseasePage from '@/pages/Manager/Disease';
import CreateCetegory from '@/pages/Manager/Category/create';
import EditCate from '@/pages/Manager/Category/edit';
import DetailCategory from '@/pages/Manager/Category/detail';
import CreateServiceList from '@/pages/Manager/ServiceList/create';
import DetailServiceList from '@/pages/Manager/ServiceList/detail';
import EditServicerList from '@/pages/Manager/ServiceList/edit';

export interface IRoute {
  path: string;
  title: string;
  component: ReactElement;
}

export const ROUTES: IRoute[] = [
  {
    path: '/dashboard',
    title: 'CPS Admin',
    component: <Dashboard />,
  },
  {
    path: '/auth',
    title: 'Signin | CPS Admin',
    component: <SignIn />,
  },
//  -------------------------- Patient Path --------------------------------

  {
    path: '/manager/patient',
    title: 'Patient List| CPS Admin',
    component: <PatientPage />,
  },
  {
    path: '/patient/create',
    title: 'Patient Create | CPS Admin',
    component: <CreatePatient />,
  },
  {
    path: '/patient/edit/:id',
    title: 'Patient Edit | CPS Admin',
    component: <EditPatient />,
  },
  {
    path: '/patient/detail/:id',
    title: 'Patient Detail | CPS Admin',
    component: <DetailPatient />,
  },
//  -------------------------- Employee Path --------------------------------
  {
    path: '/manager/employee',
    title: 'Employee| CPS Admin',
    component: <EmployeePage />,
  },

//  -------------------------- Category Path --------------------------------
{
  path: '/manager/category',
  title: 'Category | CPS Admin',
  component: <CategoryPage />,
},
{
  path: '/category/create',
  title: 'Category Create | CPS Admin',
  component: <CreateCetegory />,
},
{
  path: '/category/edit/:id',
  title: 'Category Edit | CPS Admin',
  component: <EditCate />,
},
{
  path: '/category/detail/:id',
  title: 'Detail Category | CPS Admin',
  component: <DetailCategory />,
},
//  -------------------------- Medicines Path --------------------------------
  {
    path: '/manager/medicines',
    title: 'Medicines | CPS Admin',
    component: <MedicinesPage />,
  },
// -------------------------- EquipmentPage Path --------------------------------
{
  path: '/manager/equipment',
  title: 'Equipment | CPS Admin',
  component: <EquipmentPage />,
},

// -------------------------- Service Path --------------------------------
{
  path: '/manager/servicelist',
  title: 'Service List | CPS Admin',
  component: <ServcicePage />,
},
{
  path: '/servicelist/create',
  title: 'Service Create | CPS Admin',
  component: <CreateServiceList />,
},
{
  path: '/servicelist/detail/:id',
  title: 'Service Detail | CPS Admin',
  component: <DetailServiceList />,
},
{
  path: '/servicelist/edit/:id',
  title: 'Service Edit| CPS Admin',
  component: <EditServicerList />,
},
// -------------------------- Exchange Path --------------------------------

{
  path: '/manager/exchange',
  title: 'Exchange | CPS Admin',
  component: <ExchangePage />,
},
// -------------------------- OralPage Path --------------------------------

{
  path: '/manager/disease',
  title: 'Oral | CPS Admin',
  component: <DiseasePage />,
},
// -------------------------- SupplierPage Path --------------------------------



{
  path: '/manager/supplier',
  title: 'Supplier | CPS Admin',
  component: <SupplierPage />,
},

// -------------------------- ServicePatient Path --------------------------------

{
  path: '/service',
  title: 'Servicepatient | CPS Admin',
  component: <ServicePatientPage />,
},


// -------------------------- Follow Path --------------------------------
{
  path: '/follow',
  title: 'Follow | CPS Admin',
  component: <FollowPage />,
},



  {
    path: '/profile',
    title: 'Profile | CPS Admin',
    component: <Profile />,
  },

  {
    path: '/admin/account',
    title: 'Accounts | CPS Admin',
    component: <Account />,
  },
  {
    path: '*',
    title: '404 Not Found',
    component: <NotFound />,
  },
];
