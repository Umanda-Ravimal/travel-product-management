import type { DashboardStats } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error('Failed to load dashboard statistics.');
  }

  return response.json();
}