import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [farm, setFarm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (isSignup) {
      const ok = signup(email, password, name, farm);
      if (!ok) {
        toast({ title: 'Signup failed', description: 'Email already exists.', variant: 'destructive' });
      }
    } else {
      const ok = login(email, password);
      if (!ok) {
        toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
      }
    }
    setLoading(false);
  };

  const fillDemo = () => {
    setEmail('anandu@farms.kerala');
    setPassword('password123');
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto shadow-glow">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FarmIQ Insights</h1>
          <p className="text-muted-foreground">Your AI-Powered Farm Dashboard</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle>{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignup ? 'Start managing your farm with AI' : 'Sign in to your farm dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Anandu Krishnan" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farm">Farm Name</Label>
                    <Input id="farm" placeholder="Kerala Green Farms" value={farm} onChange={e => setFarm(e.target.value)} required />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="anandu@farms.kerala" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="forest" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSignup ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
              </div>

              {!isSignup && (
                <Button variant="outline" className="w-full" onClick={fillDemo}>
                  🌾 Use Demo Account
                </Button>
              )}

              <p className="text-center text-sm text-muted-foreground">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => setIsSignup(!isSignup)}>
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Demo: anandu@farms.kerala / password123
        </p>
      </div>
    </div>
  );
}
