// Mock data for admin panel development
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    createdAt: Date;
    lastActive: Date;
}

export interface AdminSettings {
    theme: 'dark' | 'light';
    adminEmail: string;
    globalAnnouncement: string;
    maintenanceMode: boolean;
}

export interface DashboardStats {
    totalUsers: number;
    activeSessions: number;
    systemStatus: 'Healthy' | 'Warning' | 'Critical';
}

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Alexander Ross',
        email: 'raconleader@gmail.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2026-02-01'),
        lastActive: new Date()
    },
    {
        id: '2',
        name: 'Marcus Chen',
        email: 'manav@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2026-02-02'),
        lastActive: new Date()
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        email: 'dasd@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2026-02-03'),
        lastActive: new Date()
    },
    {
        id: '4',
        name: 'Benjamin Wright',
        email: 'soham@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2026-02-04'),
        lastActive: new Date()
    },
    {
        id: '5',
        name: 'Soham',
        email: 'soham123@gmail.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2026-02-05'),
        lastActive: new Date()
    },
    {
        id: '6',
        name: 'Elena Rodriguez',
        email: 'a@GMAIL.COM',
        role: 'user',
        status: 'inactive',
        createdAt: new Date('2026-02-06'),
        lastActive: new Date('2026-02-07')
    }
];

export const mockStats: DashboardStats = {
    totalUsers: 138,
    activeSessions: 18,
    systemStatus: 'Healthy'
};

export const mockSettings: AdminSettings = {
    theme: 'dark',
    adminEmail: 'admin@prism.ai',
    globalAnnouncement: '',
    maintenanceMode: false
};
