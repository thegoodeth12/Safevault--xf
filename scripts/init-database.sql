-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  timezone VARCHAR(50) DEFAULT 'UTC',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(255) UNIQUE NOT NULL,
  asset_type VARCHAR(10) NOT NULL,
  balance DECIMAL(20, 8) DEFAULT 0,
  private_key_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('sent', 'received', 'exchange')),
  asset_type VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  to_address VARCHAR(255),
  from_address VARCHAR(255),
  transaction_hash VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create security_audits table
CREATE TABLE IF NOT EXISTS security_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  recommendations JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audits_user_id ON security_audits(user_id);

-- Insert sample user for testing
INSERT INTO users (id, email, name, password_hash) 
VALUES (
  'test-user-id-123',
  'demo@safewallet.com',
  'Demo User',
  'hashed_password_here'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample wallets for the demo user
INSERT INTO wallets (user_id, address, asset_type, balance, private_key_encrypted) VALUES
  ('test-user-id-123', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC', 0.45, 'encrypted_private_key_1'),
  ('test-user-id-123', '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1', 'ETH', 2.35, 'encrypted_private_key_2'),
  ('test-user-id-123', '8Kbgi29cpjq2GjdwV6A214B1nFoxXeX5XhFubPMSKvX', 'SOL', 12.5, 'encrypted_private_key_3')
ON CONFLICT (address) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (user_id, wallet_id, type, asset_type, amount, to_address, from_address, transaction_hash, status) 
SELECT 
  'test-user-id-123',
  w.id,
  'received',
  'BTC',
  0.05,
  w.address,
  '3FZbgi29cpjq2GjdwV6A214B1nFoxXeX5XhFubPMSKvX',
  'tx_hash_1',
  'completed'
FROM wallets w WHERE w.asset_type = 'BTC' AND w.user_id = 'test-user-id-123'
ON CONFLICT (transaction_hash) DO NOTHING;
