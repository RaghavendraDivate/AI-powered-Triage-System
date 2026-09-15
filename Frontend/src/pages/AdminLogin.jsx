import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { hospitalAPI } from '@/services/api.js';
import { useToast } from '@/hooks/use-toast.js';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter both username and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await hospitalAPI.login(username, password);
      
      // Store token in sessionStorage (session-based auth)
      sessionStorage.setItem('admin_token', response.access_token);
      sessionStorage.setItem('admin_username', response.username);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.username}!`,
        variant: 'success',
      });

      // Redirect to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Lock size={48} />
          </div>
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>

        <Card className="admin-login-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access appointment management and system administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="form-field">
                <Label htmlFor="username">Username</Label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-field">
                <Label htmlFor="password">Password</Label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="admin-info">
                <p className="admin-info-text">
                  For demo purposes: username is <code>admin</code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="back-to-home">
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
