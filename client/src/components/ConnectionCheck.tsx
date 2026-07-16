import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, XCircle, CheckCircle2, ServerCrash } from 'lucide-react';

export const ConnectionCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const endpoint = import.meta.env.VITE_GRAPHQL_API_URL || 'http://localhost:4000/graphql';

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ __schema { queryType { name } } }',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        if (json.errors) {
          throw new Error(`GraphQL Error: ${json.errors[0].message}`);
        }

        setStatus('connected');
      } catch (err: any) {
        setStatus('error');
        
        // Detailed heuristic error reporting
        if (err.message.includes('Failed to fetch')) {
          setErrorDetails('Network Error: CORS Blocked or ERR_CONNECTION_REFUSED. Check backend console.');
        } else {
          setErrorDetails(err.message || 'Unknown network failure');
        }
      }
    };

    checkConnection();
  }, [endpoint]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 z-50 p-4 rounded-xl shadow-2xl bg-slate-900 border border-slate-700/50 backdrop-blur-xl max-w-sm text-sm"
      >
        <div className="flex items-start gap-3">
          {status === 'checking' && <Activity className="w-5 h-5 text-blue-400 animate-pulse mt-0.5" />}
          {status === 'connected' && <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />}
          {status === 'error' && <ServerCrash className="w-5 h-5 text-rose-400 mt-0.5" />}

          <div className="flex-1">
            <h3 className="text-slate-100 font-medium mb-1">
              {status === 'checking' && 'Verifying Connection...'}
              {status === 'connected' && 'API Connected'}
              {status === 'error' && 'Connection Failed'}
            </h3>
            
            <p className="text-slate-400 text-xs mb-2 truncate" title={endpoint}>
              {endpoint}
            </p>

            {status === 'error' && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-300 text-xs font-mono break-words">
                {errorDetails}
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
