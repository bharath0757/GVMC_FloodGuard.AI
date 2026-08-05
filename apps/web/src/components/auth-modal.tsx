import * as React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Select,
  useToast,
} from '@floodguard/ui';
import { useAuth } from '@/context/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState<'citizen' | 'government'>('citizen');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: 'Authentication Successful',
          message: 'Logged in to FloodGuard AI Command Platform.',
          type: 'success',
        });
      } else {
        await register(email, password, fullName, role);
        toast({
          title: 'Account Created',
          message: `Registered new ${role} account successfully.`,
          type: 'success',
        });
      }
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Authentication Failed',
        message:
          errorObj.response?.data?.detail ||
          'Invalid credentials or request error.',
        type: 'error',
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <div className="mb-2 flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="FloodGuard Logo"
            className="h-10 w-auto shrink-0 rounded-lg border border-slate-700 bg-slate-900 object-contain p-1"
          />
          <div>
            <DialogTitle className="text-base font-bold">
              {mode === 'login'
                ? 'Sign In to FloodGuard AI'
                : 'Register Citizen / Officer Account'}
            </DialogTitle>
            <span className="block font-mono text-[10px] uppercase text-teal-400">
              GVMC Visakhapatnam • Predictive Data Platform
            </span>
          </div>
        </div>
        <DialogDescription>
          {mode === 'login'
            ? 'Enter your credentials to access live flood telemetry and emergency dispatch.'
            : 'Create an account to submit crowdsourced flood reports and track risk advisories.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {mode === 'register' && (
          <div>
            <label className="mb-1 block text-xs font-semibold">
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Varma"
              required
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold">
            Email Address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="mb-1 block text-xs font-semibold">
              Account Role
            </label>
            <Select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'citizen' | 'government')
              }
            >
              <option value="citizen">Citizen User</option>
              <option value="government">Government Authority / Officer</option>
            </Select>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-teal-400 hover:underline"
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already registered? Login'}
          </button>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
