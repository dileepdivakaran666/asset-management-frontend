// src/contexts/MasterDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [vendorRes, branchRes] = await Promise.all([
          api.get('/vendors'),
          api.get('/branches'),
        ]);
        setVendors(vendorRes.data);
        setBranches(branchRes.data);
      } catch (error) {
        console.error('Failed to load master data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasters();
  }, []);

  return (
    <MasterDataContext.Provider value={{ vendors, branches, loading }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => useContext(MasterDataContext);
