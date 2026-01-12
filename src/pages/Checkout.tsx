import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Banknote, Smartphone, Building2, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, total, clearCart } = useCart();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.pincode || !address.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = 'FK' + Date.now().toString().slice(-10);
    clearCart();
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order #${orderId} has been confirmed.`,
    });
    
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/" className="btn-flipkart-primary">
            Continue Shopping
          </Link>
        </main>
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
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Address Section */}
            <div className="checkout-section">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 'address' ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'
                }`}>
                  {step === 'payment' ? <Check size={16} /> : '1'}
                </div>
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                {step === 'payment' && (
                  <button
                    onClick={() => setStep('address')}
                    className="ml-auto text-sm text-primary hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {step === 'address' ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={address.name}
                        onChange={(e) => setAddress(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={address.phone}
                        onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={address.address}
                      onChange={(e) => setAddress(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="House No., Building, Street, Area"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>

                  <button type="submit" className="btn-flipkart-secondary">
                    Deliver Here
                  </button>
                </form>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-muted rounded-sm">
                  <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{address.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.address}, {address.city} {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className={`checkout-section ${step !== 'payment' ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <h2 className="text-lg font-semibold">Payment Options</h2>
              </div>

              {step === 'payment' && (
                <div className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center gap-4 p-4 border border-border rounded-sm hover:border-primary cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="text-primary" size={24} />
                        <div>
                          <p className="font-medium">UPI</p>
                          <p className="text-sm text-muted-foreground">Pay using UPI apps</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-border rounded-sm hover:border-primary cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="text-primary" size={24} />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-border rounded-sm hover:border-primary cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building2 className="text-primary" size={24} />
                        <div>
                          <p className="font-medium">Net Banking</p>
                          <p className="text-sm text-muted-foreground">All major banks</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-border rounded-sm hover:border-primary cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="text-primary" size={24} />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="btn-flipkart-secondary w-full py-4 text-lg disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-sm sticky top-20">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-muted-foreground uppercase text-sm">
                  Order Summary
                </h2>
              </div>

              {/* Order Items */}
              <div className="p-4 max-h-64 overflow-y-auto border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 mb-4 last:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-success">
                  <span>Discount</span>
                  <span>− {formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="border-t border-dashed pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
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
