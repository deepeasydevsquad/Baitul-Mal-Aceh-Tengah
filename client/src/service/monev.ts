import api from '@/service/api_administrator';

export const monev_list = async (params: { page?: number; limit?: number }) => {
  try {
    const response = await api.post('/monev/list', { params });
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

export const pertanyaan_evaluasi = async () => {
  try {
    const response = await api.get('/monev/pertanyaan_evaluasi');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

export const pertanyaan_monitoring = async () => {
  try {
    const response = await api.get('/monev/pertanyaan_monitoring');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil daftar monev:', error);
    throw error;
  }
};

// Kirim Jawaban Evaluasi
export const kirim_jawaban_evaluasi = async (payload: {
  monev_id: number;
  jawaban: { pertanyaan_id: number; jawaban: string }[];
}) => {
  try {
    const response = await api.post('/monev/kirim_jawaban_evaluasi', payload);
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim jawaban evaluasi:', error);
    throw error;
  }
};

// Kirim Jawaban Monitoring
export const kirim_jawaban_monitoring = async (payload: {
  monev_id: number;
  jawaban: { pertanyaan_id: number; jawaban: string }[];
}) => {
  try {
    const response = await api.post('/monev/kirim_jawaban_monitoring', payload);
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim jawaban monitoring:', error);
    throw error;
  }
};

// Ambil Gabungan Status Monev (Monitoring + Evaluasi)
export const gabung_status_monev = async () => {
  try {
    const response = await api.get('/monev/gabung_status_monev');
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil status monev gabungan:', error);
    throw error;
  }
};
