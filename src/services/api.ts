import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(idToken: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateProfile(userData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteAccount() {
    return this.request('/auth/profile', {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users${queryString}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async getUserStats(id: string) {
    return this.request(`/users/${id}/stats`);
  }

  async getUserGames(id: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/${id}/games${queryString}`);
  }

  async getUserBookings(id: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/${id}/bookings${queryString}`);
  }

  async uploadAvatar(avatar: string) {
    return this.request('/users/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar }),
    });
  }

  // Turf endpoints
  async getTurfs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/turfs${queryString}`);
  }

  async getTurfById(id: string) {
    return this.request(`/turfs/${id}`);
  }

  async createTurf(turfData: any) {
    return this.request('/turfs', {
      method: 'POST',
      body: JSON.stringify(turfData),
    });
  }

  async updateTurf(id: string, turfData: any) {
    return this.request(`/turfs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(turfData),
    });
  }

  async deleteTurf(id: string) {
    return this.request(`/turfs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyTurfs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/turfs/my${queryString}`);
  }

  async uploadTurfImages(id: string, images: string[]) {
    return this.request(`/turfs/${id}/images`, {
      method: 'POST',
      body: JSON.stringify({ images }),
    });
  }

  async getTurfBookings(id: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/turfs/${id}/bookings${queryString}`);
  }

  async getTurfReviews(id: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/turfs/${id}/reviews${queryString}`);
  }

  // Game endpoints
  async getGames(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/games${queryString}`);
  }

  async getGameById(id: string) {
    return this.request(`/games/${id}`);
  }

  async createGame(gameData: any) {
    return this.request('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async updateGame(id: string, gameData: any) {
    return this.request(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  }

  async deleteGame(id: string) {
    return this.request(`/games/${id}`, {
      method: 'DELETE',
    });
  }

  async joinGame(id: string) {
    return this.request(`/games/${id}/join`, {
      method: 'POST',
    });
  }

  async leaveGame(id: string) {
    return this.request(`/games/${id}/leave`, {
      method: 'POST',
    });
  }

  async requestToJoin(id: string, message?: string) {
    return this.request(`/games/${id}/request`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async handleJoinRequest(id: string, requestId: string, action: 'approve' | 'reject') {
    return this.request(`/games/${id}/request`, {
      method: 'PUT',
      body: JSON.stringify({ requestId, action }),
    });
  }

  async getMyGames(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/games/my${queryString}`);
  }

  async getGameRequests(id: string) {
    return this.request(`/games/${id}/requests`);
  }

  // Booking endpoints
  async getBookings(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/bookings${queryString}`);
  }

  async getBookingById(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id: string, bookingData: any) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  async confirmBooking(id: string) {
    return this.request(`/bookings/${id}/confirm`, {
      method: 'POST',
    });
  }

  async getMyBookings(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/bookings/my${queryString}`);
  }
}

export const apiService = new ApiService();
export default apiService;