import api from "@/service/api_administrator"

// fungsi named export
export const list = async (param: any) => {
  try {
    const response = await api.post("/laporan_umum/list")
    return response.data
  } catch (error) {
    console.error("Gagal mengambil request keanggotaan:", error)
    throw error
  }
}

