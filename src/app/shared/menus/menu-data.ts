export const MENU_ITEMS = [
  {
    label: 'แดชบอร์ด',
    route: '/admin/dashboard',
    icon:'dashboard',
    role: ['admin']
  },
  {
    label: 'ขอใช้เปล',
    route: '/admin/accessible',
    icon:'comment',
    role: ['admin']
  },
  {
    label: 'วอร์ด',
    route: '/admin/wards',
    icon:'domain_add',
    role: ['admin']
  },
  {
    label: 'ผู้ใช้งาน',
    route: '/admin/users',
    icon:'people',
    role: ['admin']
  },
  {
    label: 'รายงาน',
    route: '/admin/reports',
    icon:'analytics',
    role: ['admin']
  },


  /*********************
   *********************
   * CENTER ROUTERS
   ********************/
   {
    label: 'แดชบอร์ด',
    route: '/center/dashboard',
    icon:'dashboard',
    role: ['centeropd','centeripd']
  },
  {
    label: 'ขอใช้เปล',
    route: '/center/accessible',
    icon:'comment',
    role: ['centeropd','centeripd']
  },
  {
    label: 'วอร์ด',
    route: '/center/wards',
    icon:'domain_add',
    role: ['centeropd','centeripd']
  },
  {
    label: 'ผู้ใช้งาน',
    route: '/center/users',
    icon:'people',
    role: ['centeropd','centeripd']
  },
  {
    label: 'รายงาน',
    route: '/center/reports',
    icon:'analytics',
    role: ['centeropd','centeripd']
  },
  {
    label: 'คู่มือ',
    route: '/center/doc',
    icon:'book_2',
    role: ['centeropd','centeripd']
  },
  /*********************
   *********************
   * WARD ROUTERS
   ********************/
   {
    label: 'แดชบอร์ด',
    route: '/ward/dashboard',
    icon:'dashboard',
    role: ['ward']
  },
  {
    label: 'ขอใช้เปล',
    route: '/ward/accessible',
    icon:'comment',
    role: ['ward']
  },
  {
    label: 'วอร์ด',
    route: '/ward/wards',
    icon:'domain_add',
    role: ['ward']
  },
  {
    label: 'รายงาน',
    route: '/ward/reports',
    icon:'analytics',
    role: ['ward']
  },
  {
    label: 'คู่มือ',
    route: '/ward/doc',
    icon:'book_2',
    role: ['ward']
  },

  /*********************
   *********************
   * RIDER ROUTERS
   ********************/
   {
    label: 'แดชบอร์ด',
    route: '/rider/dashboard',
    icon:'dashboard',
    role: ['rideropd','rideripd']
  },
  {
    label: 'รับงาน',
    route: '/rider/jobs',
    icon:'system_security_update',
    role: ['rideropd','rideripd']
  },
  {
    label: 'คู่มือ',
    route: '/rider/doc',
    icon:'book_2',
    role: ['rideropd','rideripd']
  },
];
