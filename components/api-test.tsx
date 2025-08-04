'use client';

import { useState } from 'react';
import { authApi, dashboardApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: 'admin@test.com',
        password: 'admin123'
      });
      setResult(`✅ Login sucesso: ${response.user.name}`);
    } catch (error: any) {
      setResult(`❌ Login erro: ${error.message}`);
    }
    setLoading(false);
  };

  const testStats = async () => {
    setLoading(true);
    try {
      const stats = await dashboardApi.getStats();
      setResult(`✅ Stats: ${stats.total_users} usuários, ${stats.total_documents} docs`);
    } catch (error: any) {
      setResult(`❌ Stats erro: ${error.message}`);
    }
    setLoading(false);
  };

  const testActivity = async () => {
    setLoading(true);
    try {
      const activity = await dashboardApi.getRecentActivity();
      setResult(`✅ Activity: ${activity.length} atividades recentes`);
    } catch (error: any) {
      setResult(`❌ Activity erro: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Teste da API
          <span className="text-sm font-normal text-muted-foreground">
            Mock Mode: {process.env.NEXT_PUBLIC_MOCK_API}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={testLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            Testar Login
          </button>
          
          <button 
            onClick={testStats}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
          >
            Testar Stats
          </button>
          
          <button 
            onClick={testActivity}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
          >
            Testar Activity
          </button>
        </div>
        
        {loading && <p className="text-blue-500 text-sm">Carregando...</p>}
        
        {result && (
          <div className="p-3 bg-muted rounded text-sm">
            <strong>Resultado:</strong><br />
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}