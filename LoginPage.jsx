import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Fake a 1-second network delay for the UI demo
    setTimeout(() => {
      setLoading(false);
      navigate('/operations', { replace: true });
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Login - KitchenOS</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Kitchen Command Center</CardTitle>
            <CardDescription>Sign in to access your operations dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Any email works for demo!" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Any password works!" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} autoComplete="current-password" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} disabled={loading} />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground select-none">Remember me for 30 days</Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign in to Command Center'}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Enterprise cloud kitchen operations platform</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
