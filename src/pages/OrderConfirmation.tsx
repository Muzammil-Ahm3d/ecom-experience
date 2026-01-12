import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-card rounded-sm p-8 text-center mb-6">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground mb-4">
              Thank you for shopping with us. Your order has been confirmed.
            </p>
            <p className="font-mono text-lg bg-muted px-4 py-2 rounded-sm inline-block">
              Order ID: #{orderId}
            </p>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-card rounded-sm p-6 mb-6">
            <h2 className="font-semibold mb-6">Order Status</h2>
            
            <div className="order-timeline">
              <div className="timeline-item">
                <div className="timeline-dot completed" />
                <div className="ml-2">
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="ml-2">
                  <p className="font-medium text-muted-foreground">Processing</p>
                  <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="ml-2">
                  <p className="font-medium text-muted-foreground">Shipped</p>
                  <p className="text-sm text-muted-foreground">On the way</p>
                </div>
              </div>

              <div className="timeline-item pb-0">
                <div className="timeline-dot" />
                <div className="ml-2">
                  <p className="font-medium text-muted-foreground">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Expected by {estimatedDelivery.toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-card rounded-sm p-6 mb-6">
            <h2 className="font-semibold mb-4">Delivery Information</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Package className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-medium">1 Package</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Shipping</p>
                  <p className="font-medium">Free Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">Home</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/orders" className="flex-1 btn-flipkart-primary text-center py-4">
              View Orders
            </Link>
            <Link to="/" className="flex-1 btn-flipkart-secondary text-center py-4">
              Continue Shopping
            </Link>
            <button className="flex-1 flex items-center justify-center gap-2 py-4 border border-border rounded-sm hover:bg-muted transition-colors">
              <Download size={18} />
              Download Invoice
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-muted rounded-sm text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@flipkart.com" className="text-primary hover:underline">
                support@flipkart.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
