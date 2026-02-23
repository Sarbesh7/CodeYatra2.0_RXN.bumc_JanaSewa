// API Configuration and Service Layer
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('access_token');

// Headers with authentication
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  login: (email, password) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  getMe: () => fetchAPI('/auth/me', {
    headers: authHeaders()
  })
};

// ==================== SERVICES API ====================

export const servicesAPI = {
  getAll: (officeType = null) => {
    const params = officeType ? `?office_type=${officeType}` : '';
    return fetchAPI(`/services${params}`);
  },

  getById: (id) => fetchAPI(`/services/${id}`),

  // Admin
  create: (data) => fetchAPI('/admin/services', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  update: (id, data) => fetchAPI(`/admin/services/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  delete: (id) => fetchAPI(`/admin/services/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
};

// ==================== APPLICATIONS API ====================

export const applicationsAPI = {
  create: (data) => fetchAPI('/applications', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  getMyApplications: () => fetchAPI('/applications', {
    headers: authHeaders()
  }),

  getById: (id) => fetchAPI(`/applications/${id}`, {
    headers: authHeaders()
  }),

  track: (serialNumber) => fetchAPI(`/track/${serialNumber}`),

  // File upload
  uploadDocument: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  },

  // Admin
  getAll: (status = null, serviceId = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (serviceId) params.append('service_id', serviceId);
    const query = params.toString() ? `?${params}` : '';
    
    return fetchAPI(`/admin/applications${query}`, {
      headers: authHeaders()
    });
  },

  updateStatus: (id, status, adminRemarks = null) => fetchAPI(`/admin/applications/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status, admin_remarks: adminRemarks })
  }),

  uploadOfficialDocument: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/official-document`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  }
};

// ==================== COMPLAINTS API ====================

export const complaintsAPI = {
  create: (data) => fetchAPI('/complaints', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  getMyComplaints: () => fetchAPI('/complaints', {
    headers: authHeaders()
  }),

  uploadAttachment: async (complaintId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  },

  // Admin
  getAll: (status = null) => {
    const params = status ? `?status=${status}` : '';
    return fetchAPI(`/admin/complaints${params}`, {
      headers: authHeaders()
    });
  },

  update: (id, status, adminResponse = null) => fetchAPI(`/admin/complaints/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status, admin_response: adminResponse })
  })
};

// ==================== NOTICES API ====================

export const noticesAPI = {
  getAll: (category = null) => {
    const params = category ? `?category=${category}` : '';
    return fetchAPI(`/notices${params}`);
  },

  getById: (id) => fetchAPI(`/notices/${id}`),

  // Admin
  create: (data) => fetchAPI('/admin/notices', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  update: (id, data) => fetchAPI(`/admin/notices/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  delete: (id) => fetchAPI(`/admin/notices/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
};

// ==================== ADMIN STATS API ====================

export const adminAPI = {
  getStats: () => fetchAPI('/admin/stats', {
    headers: authHeaders()
  }),

  // Applications
  getApplications: (status = null, serviceId = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (serviceId) params.append('service_id', serviceId);
    const query = params.toString() ? `?${params}` : '';
    
    return fetchAPI(`/admin/applications${query}`, {
      headers: authHeaders()
    });
  },

  updateApplicationStatus: async (id, status, file = null) => {
    if (file) {
      // Upload official document with status update
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/admin/applications/${id}/official-document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }
      
      // Also update status
      await fetchAPI(`/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      
      return response.json();
    }
    
    return fetchAPI(`/admin/applications/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
  },

  // Services
  createService: (data) => fetchAPI('/admin/services', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  updateService: (id, data) => fetchAPI(`/admin/services/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }),

  deleteService: (id) => fetchAPI(`/admin/services/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  }),

  // Complaints
  getComplaints: (status = null) => {
    const params = status ? `?status=${status}` : '';
    return fetchAPI(`/admin/complaints${params}`, {
      headers: authHeaders()
    });
  },

  updateComplaint: (id, status, adminResponse = null) => fetchAPI(`/admin/complaints/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status, admin_response: adminResponse })
  }),

  // Users
  getUsers: () => fetchAPI('/admin/users', {
    headers: authHeaders()
  })
};

// ==================== SEED DATA ====================

export const seedData = () => fetchAPI('/seed', { method: 'POST' });

export default {
  auth: authAPI,
  services: servicesAPI,
  applications: applicationsAPI,
  complaints: complaintsAPI,
  notices: noticesAPI,
  admin: adminAPI,
  seed: seedData
};
