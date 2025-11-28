import api from './api'
export const bookingService = {
  create: (payload) => api.post('/bookings', payload),
  userBookings: () => api.get('/bookings/user')
}
