// Mock data (replace with actual API calls)
const mockOrders = [
    {
        id: 'ORD001',
        customer: 'John Doe',
        status: 'pending',
        amount: 45.99,
        date: '2024-03-15',
        items: ['Item 1', 'Item 2']
    },
    {
        id: 'ORD002',
        customer: 'Jane Smith',
        status: 'processing',
        amount: 29.99,
        date: '2024-03-15',
        items: ['Item 3']
    },
    {
        id: 'ORD003',
        customer: 'Mike Johnson',
        status: 'delivered',
        amount: 89.99,
        date: '2024-03-14',
        items: ['Item 4', 'Item 5', 'Item 6']
    }
];

class AdminDashboard {
    constructor() {
        this.orders = [];
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.loadOrders();
        this.updateDashboardStats();
        this.renderRecentOrders();
    }

    async loadOrders() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                this.orders = mockOrders;
                resolve();
            }, 500);
        });
    }

    updateDashboardStats() {
        const totalOrders = this.orders.length;
        const activeDeliveries = this.orders.filter(order =>
            order.status === 'pending' || order.status === 'processing'
        ).length;
        const totalCustomers = new Set(this.orders.map(order => order.customer)).size;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.amount, 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('activeDeliveries').textContent = activeDeliveries;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    }

    renderRecentOrders() {
        const tableBody = document.getElementById('recentOrdersTable');
        if (!tableBody) return;

        tableBody.innerHTML = this.orders
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>
                        <span class="badge badge-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </td>
                    <td>$${order.amount.toFixed(2)}</td>
                    <td>${order.date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="adminDashboard.viewOrder('${order.id}')">
                            View
                        </button>
                        <button class="btn btn-sm btn-success" onclick="adminDashboard.updateOrderStatus('${order.id}')">
                            Update
                        </button>
                    </td>
                </tr>
            `).join('');
    }

    setupEventListeners() {
        // Add any other event listeners needed
        // Note: Navigation is now handled by direct href links
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Implement order details view
        alert(`Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nItems: ${order.items.join(', ')}\nAmount: $${order.amount}\nStatus: ${order.status}`);
    }

    updateOrderStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const statuses = ['pending', 'processing', 'delivered', 'cancelled'];
        const currentIndex = statuses.indexOf(order.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];

        // Simulate API call
        setTimeout(() => {
            order.status = nextStatus;
            this.renderRecentOrders();
            this.updateDashboardStats();
        }, 500);
    }
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard(); 