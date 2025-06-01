// src/services/profile.js
import api from './api.js'

export const getDevProfile = () =>
  api.get('/api/dev/profile')

export const updateDevProfile = (data) =>
  api.put('/api/dev/profile', data)

export const getCompanyProfile = () =>
  api.get('/api/company/profile')

export const updateCompanyProfile = (data) =>
  api.put('/api/company/profile', data)

export const createJob = (data) =>
  api.post('/api/company/jobs', data);

export const getCompanyJobs = () =>
  api.get('/api/company/jobs');

export const updateJob = (id, data) =>
  api.put(`/api/company/jobs/${id}`, data);

export const deleteJob = (id) =>
  api.delete(`/api/company/jobs/${id}`);