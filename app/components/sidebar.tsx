import Link from 'next/link';

export function Sidebar() {
    const menuItems = [
        {title: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-simple'},
        {title: 'Users', href: '/backoffice/user', icon: 'fa-solid fa-users'},
        {title: 'Repair', href: '/backoffice/repair_record', icon: 'fa-solid fa-clipboard-list'},
        {title: 'Status', href: '/backoffice/repair_status', icon: 'fa-solid fa-screwdriver'},
        {title: 'Report', href: '/backoffice/mecthaic_report', icon: 'fa-solid fa-file-alt'},
        {title: 'Devices', href: '/backoffice/device', icon: 'fa-solid fa-laptop'},

    ]

    return (
        <aside className='sidebar'>
            <div className='sidebar-header'>
                <i className='fa-solid fa-user text-4xl mr-5'></i>
                <h1 className='text-xl font-bold'>Bun Service 2025</h1>
            </div>
            <nav className='sidebar-nav bg-gray-950 p-4 rounded-tl-3xl ml-4'>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.title}>
                            <Link href={item.href} className='sidebar-item'>
                                <i className={item.icon + ' mr-2 w-6'}></i>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}