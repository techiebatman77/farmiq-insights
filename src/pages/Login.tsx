import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TopographicOverlay, CoordinateMarker } from '@/components/ui/TopographicOverlay';

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
    <div className="min-h-screen bg-background relative flex">
      <TopographicOverlay className="text-sage" opacity={0.08} />

      {/* Left side - branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-primary/50 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display text-sm tracking-wider text-foreground">AGRISMART</span>
          </div>
          <CoordinateMarker lat="9.93" lon="76.26" className="block mb-4" />
        </div>

        <div>
          <h1 className="font-display text-6xl xl:text-7xl text-foreground leading-[0.9] mb-6">
            A SMARTER<br />WAY TO<br />FARM
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground max-w-md">
            AI-powered insights • Satellite monitoring • Kerala agriculture
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="coord-text">©2024 — AGRISMART</span>
          <span className="coord-text">KERALA, INDIA</span>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-[420px] flex flex-col justify-center p-8 lg:p-10 relative z-10 border-l border-border/30">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-8 h-8 border border-primary/50 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display text-sm tracking-wider text-foreground">AGRISMART</span>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-2xl text-foreground mb-2">
            {isSignup ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {isSignup ? 'Start managing your farm with AI' : 'Sign in to your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input id="name" placeholder="Anandu Krishnan" value={name} onChange={e => setName(e.target.value)} required className="bg-muted/30 border-border/50 font-mono text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="farm" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Farm Name</Label>
                <Input id="farm" placeholder="Kerala Green Farms" value={farm} onChange={e => setFarm(e.target.value)} required className="bg-muted/30 border-border/50 font-mono text-sm" />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</Label>
            <Input id="email" type="email" placeholder="anandu@farms.kerala" value={email} onChange={e => setEmail(e.target.value)} required className="bg-muted/30 border-border/50 font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-muted/30 border-border/50 font-mono text-sm" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider text-xs h-10" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSignup ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/30" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-[10px] font-mono text-muted-foreground uppercase">or</span></div>
          </div>

          {!isSignup && (
            <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-wider h-9 border-border/50" onClick={fillDemo}>
              Use Demo Account
            </Button>
          )}

          <p className="text-center text-xs font-mono text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="text-primary hover:underline uppercase tracking-wider" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p className="text-center coord-text mt-8">
          Demo: anandu@farms.kerala / password123
        </p>
      </div>
    </div>
  );
}
