export const mockAnalytics = {
    conversion: {
        current: 3.2,
        previous: 4.1,
        trend: 'down',
        steps: [
            { name: 'View Products', rate: 100 },
            { name: 'Add to Cart', rate: 25 },
            { name: 'Checkout Start', rate: 12 },
            { name: 'Purchase Complete', rate: 3.2 },
        ]
    },
    retention: {
        d1: 45,
        d7: 18,
        d30: 5,
    },
    frictionPoints: [
        { page: '/checkout', issue: 'Long form validation error', impact: 'High' },
        { page: '/login', issue: 'Password reset loop', impact: 'Medium' },
    ],
    sessions: [
        { id: '1', user: 'User 102', duration: '5:20', sentiment: 'Frustrated', exitPage: '/checkout' },
        { id: '2', user: 'User 405', duration: '2:15', sentiment: 'Satisfied', exitPage: '/confirmation' },
    ]
};
