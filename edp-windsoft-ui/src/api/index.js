import { http, unwrap } from './client';

export const systemsApi = {
  listPublic:  ()       => unwrap(http.get('/systems')),
  showPublic:  (slug)   => unwrap(http.get(`/systems/${slug}`)),
  listAdmin:   ()       => unwrap(http.get('/admin/systems')),
  create:      (body)   => unwrap(http.post('/admin/systems', body)),
  update:      (id, b)  => unwrap(http.put(`/admin/systems/${id}`, b)),
  remove:      (id)     => unwrap(http.delete(`/admin/systems/${id}`)),
  reorder:     (ids)    => unwrap(http.post('/admin/systems/reorder', { ids })),
};

export const settingsApi = {
  getPublic: ()     => unwrap(http.get('/settings')),
  saveAdmin: (body) => unwrap(http.put('/admin/settings', body)),
};

export const solutionsApi = {
  listPublic:  ()       => unwrap(http.get('/solutions')),
  getBySlug:   (slug)   => unwrap(http.get(`/solutions/${slug}`)),
  listAdmin:   ()       => unwrap(http.get('/admin/solutions')),
  create:      (body)   => unwrap(http.post('/admin/solutions', body)),
  update:      (id, b)  => unwrap(http.put(`/admin/solutions/${id}`, b)),
  remove:      (id)     => unwrap(http.delete(`/admin/solutions/${id}`)),
  reorder:     (ids)    => unwrap(http.post('/admin/solutions/reorder', { ids })),
};

export const siteContentApi = {
  getPublic: ()     => unwrap(http.get('/site-content')),
  saveAdmin: (body) => unwrap(http.put('/admin/site-content', body)),
};

export const contactMessagesApi = {
  submit:       (body) => unwrap(http.post('/contact-messages', body)),
  listAdmin:    ()     => unwrap(http.get('/admin/contact-messages')),
  markRead:     (id, read) => unwrap(http.patch(`/admin/contact-messages/${id}`, { is_read: read })),
  remove:       (id)   => unwrap(http.delete(`/admin/contact-messages/${id}`)),
};

export const faqApi = {
  listPublic:  ()       => unwrap(http.get('/faq')),
  listAdmin:   ()       => unwrap(http.get('/admin/faq')),
  create:      (body)   => unwrap(http.post('/admin/faq', body)),
  update:      (id, b)  => unwrap(http.put(`/admin/faq/${id}`, b)),
  remove:      (id)     => unwrap(http.delete(`/admin/faq/${id}`)),
  reorder:     (ids)    => unwrap(http.post('/admin/faq/reorder', { ids })),
};
