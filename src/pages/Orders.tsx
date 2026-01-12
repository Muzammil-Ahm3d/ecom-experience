import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';

// Mock orders data
const mockOrders = [
  {
    id: 'FK1736547890',
    date: '2024-01-10',
    status: 'delivered',
    total: 156900,
    items: [
      { product: products[0], quantity: 1 },
    ],
  },
  {
    id: 'FK1736123456',
    date: '2024-01-08',
    status: 'processing',
    total: 26990,
    items: [
      { product: products[2], quantity: 1 },
    ],
  },
  {
    id: 'FK1735987654',
    date: '2024-01-05',
    status: 'shipped',
    total: 19494,
    items: [
      { product: products[5], quantity: 2 },
      { product: products[9], quantity: 1 },
    ],
  },
  {
    id: 'FK1735654321',
    date: '2024-01-01',
    status: 'cancelled',
    total: 42990,
    items: [
      { product: products[6], quantity: 1 },
    ],
  },
];

const statusConfig = {
  processing: {
    label: 'Processing',
    color: 'text-blue-600 bg-blue-50',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-orange-600 bg-orange-50',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-success bg-success/10',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-destructive bg-destructive/10',
    icon: XCircle,
  },
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-4">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/account">My Account</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Orders</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* Filters */}
        <div className="bg-card rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by order ID or product name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {status === 'all' ? 'All Orders' : statusConfig[status as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
              return (
                <div key={order.id} className="bg-card rounded-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono font-medium">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ordered on</p>
                        <p className="font-medium">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      statusConfig[order.status as keyof typeof statusConfig].color
                    }`}>
                      <StatusIcon size={16} />
                      {statusConfig[order.status as keyof typeof statusConfig].label}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-border">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-4 flex gap-4">
                        <Link to={`/product/${item.product.id}`} className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-medium text-foreground hover:text-primary line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            View Product
                          </Link>
                          {order.status === 'delivered' && (
                            <button className="text-sm text-primary hover:underline">
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="p-4 border-t border-border bg-muted/50 flex flex-wrap gap-4">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Order Details
                    </Link>
                    {order.status === 'delivered' && (
                      <>
                        <button className="text-sm text-primary hover:underline">
                          Download Invoice
                        </button>
                        <button className="text-sm text-primary hover:underline">
                          Return / Replace
                        </button>
                      </>
                    )}
                    {(order.status === 'processing' || order.status === 'shipped') && (
                      <button className="text-sm text-primary hover:underline">
                        Track Order
                      </button>
                    )}
                    <button className="text-sm text-primary hover:underline">
                      Need Help?
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-sm p-12 text-center">
            <Package size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : "You haven't placed any orders yet"}
            </p>
            <Link to="/" className="btn-flipkart-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
