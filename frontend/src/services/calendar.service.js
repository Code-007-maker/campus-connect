import api from './api'
export const calendarService = {
  list: () => api.get('/events'),
  create: (payload) => api.post('/events', payload)
}
