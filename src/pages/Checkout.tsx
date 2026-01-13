import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrderAPI, ShippingAddress } from '@/api/client';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, discount, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const isAddressValid = () => {
    return address.fullName && address.phone && address.address &&
      address.city && address.state && address.pincode;
  };

  const handlePlaceOrder = async () => {
    if (!isAddressValid()) {
      toast.error('Please fill all address fields');
      return;
    }

    setIsLoading(true);
    try {
      const order = await createOrderAPI(address, paymentMethod);
      await clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to Checkout</h1>
          <Link to="/login" className="btn-flipkart-primary">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Link to="/" className="btn-flipkart-primary">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-4">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/cart">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="bg-card rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary" size={20} />
                <h2 className="text-lg font-semibold">Delivery Address</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={address.address}
                    onChange={handleInputChange}
                    placeholder="House No., Building, Street, Area"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-primary" size={20} />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  { id: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', disabled: true },
                  { id: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', disabled: true },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => !method.disabled && setPaymentMethod(e.target.value)}
                      disabled={method.disabled}
                      className="accent-primary"
                    />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.desc}</p>
                    </div>
                    {method.disabled && (
                      <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-card rounded-sm p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4 pb-4 border-b border-border">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-success">
                  <span>Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-success">Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg py-4 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || !isAddressValid()}
                className="w-full btn-flipkart-secondary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Truck size={16} />
                <span>Free delivery on all orders</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
