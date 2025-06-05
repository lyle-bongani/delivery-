// Mock data (replace with actual API calls)
const mockItems = [
    { id: 1, name: 'Item 1', price: 19.99, description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', price: 29.99, description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', price: 39.99, description: 'Description for Item 3' },
    { id: 4, name: 'Item 4', price: 49.99, description: 'Description for Item 4' }
];

const mockClientOrders = [
    {
        id: 'ORD001',
        items: [
            { id: 1, name: 'Item 1', price: 19.99, quantity: 2 },
            { id: 2, name: 'Item 2', price: 29.99, quantity: 1 }
        ],
        status: 'pending',
        total: 69.97,
        date: '2024-03-15',
        estimatedDelivery: '2024-03-16',
        address: '123 Main St'
    },
    {
        id: 'ORD002',
        items: [
            { id: 3, name: 'Item 3', price: 39.99, quantity: 1 }
        ],
        status: 'delivered',
        total: 39.99,
        date: '2024-03-14',
        deliveredDate: '2024-03-15',
        address: '123 Main St'
    }
];

class ClientDashboard {
    constructor() {
        this.orders = [];
        this.items = [];
        this.initializeDashboard();
    }

    async initializeDashboard() {
        await Promise.all([
            this.loadOrders(),
            this.loadItems()
        ]);
        this.updateUserInfo();
        this.renderActiveOrders();
        this.renderOrderHistory();
        this.setupEventListeners();
    }

    async loadOrders() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                this.orders = mockClientOrders;
                resolve();
            }, 500);
        });
    }

    async loadItems() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                this.items = mockItems;
                resolve();
            }, 500);
        });
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        if (userName) {
            const userData = JSON.parse(localStorage.getItem('currentUser'));
            userName.textContent = userData.name;
        }
    }

    renderActiveOrders() {
        const tableBody = document.getElementById('activeOrdersTable');
        if (!tableBody) return;

        const activeOrders = this.orders.filter(order =>
            order.status === 'pending' || order.status === 'processing'
        );

        tableBody.innerHTML = activeOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                <td>
                    <span class="badge badge-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>${order.estimatedDelivery}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="clientDashboard.viewOrder('${order.id}')">
                        Track
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderOrderHistory() {
        const tableBody = document.getElementById('orderHistoryTable');
        if (!tableBody) return;

        const completedOrders = this.orders.filter(order =>
            order.status === 'delivered' || order.status === 'cancelled'
        );

        tableBody.innerHTML = completedOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="badge badge-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="clientDashboard.viewOrder('${order.id}')">
                        Details
                    </button>
                    ${order.status === 'delivered' ? `
                        <button class="btn btn-sm btn-success" onclick="clientDashboard.reorder('${order.id}')">
                            Reorder
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        // New Order button
        const newOrderBtn = document.getElementById('newOrderBtn');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                this.showNewOrderModal();
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.loadPage(page);
            });
        });

        // Submit Order button
        const submitOrderBtn = document.getElementById('submitOrderBtn');
        if (submitOrderBtn) {
            submitOrderBtn.addEventListener('click', () => {
                this.submitNewOrder();
            });
        }
    }

    showNewOrderModal() {
        const itemsList = document.getElementById('itemsList');
        if (!itemsList) return;

        itemsList.innerHTML = this.items.map(item => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.description}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-3">$${item.price.toFixed(2)}</span>
                            <div class="input-group" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="clientDashboard.updateQuantity(${item.id}, -1)">-</button>
                                <input type="number" class="form-control form-control-sm text-center" id="quantity-${item.id}" value="0" min="0" readonly>
                                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="clientDashboard.updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        const modal = new bootstrap.Modal(document.getElementById('newOrderModal'));
        modal.show();
    }

    updateQuantity(itemId, change) {
        const input = document.getElementById(`quantity-${itemId}`);
        if (!input) return;

        const currentValue = parseInt(input.value) || 0;
        const newValue = Math.max(0, currentValue + change);
        input.value = newValue;
    }

    async submitNewOrder() {
        const selectedItems = this.items
            .map(item => {
                const quantity = parseInt(document.getElementById(`quantity-${item.id}`).value) || 0;
                return quantity > 0 ? { ...item, quantity } : null;
            })
            .filter(item => item !== null);

        if (selectedItems.length === 0) {
            alert('Please select at least one item');
            return;
        }

        const address = document.getElementById('deliveryAddress').value;
        if (!address) {
            alert('Please enter a delivery address');
            return;
        }

        // Simulate API call
        const newOrder = {
            id: `ORD${String(this.orders.length + 1).padStart(3, '0')}`,
            items: selectedItems,
            status: 'pending',
            total: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString().split('T')[0],
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            address: address
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.orders.unshift(newOrder);

        // Update UI
        this.renderActiveOrders();
        this.renderOrderHistory();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newOrderModal'));
        modal.hide();

        // Reset form
        document.getElementById('newOrderForm').reset();
        alert('Order placed successfully!');
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Implement order details view
        alert(`Order Details:\nID: ${order.id}\nItems: ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}\nTotal: $${order.total}\nStatus: ${order.status}\nDate: ${order.date}${order.estimatedDelivery ? `\nEstimated Delivery: ${order.estimatedDelivery}` : ''}`);
    }

    reorder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Pre-fill the new order modal with items from the previous order
        this.showNewOrderModal();
        order.items.forEach(item => {
            const input = document.getElementById(`quantity-${item.id}`);
            if (input) {
                input.value = item.quantity;
            }
        });
    }

    async loadPage(page) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // Load page content (implement based on requirements)
        switch (page) {
            case 'home':
                await this.loadOrders();
                this.renderActiveOrders();
                this.renderOrderHistory();
                break;
            case 'orders':
                // Implement orders page
                break;
            case 'profile':
                // Implement profile page
                break;
        }
    }
}

// Initialize client dashboard
const clientDashboard = new ClientDashboard(); 