const {
  handleValidationErrors,
  handleServerError,
  messageError,
} = require("../../../helper/handleError");
const ExcelJS = require("exceljs");
const moment = require("moment");
const Model_r = require("../models/model_r");
const { convertToRP } = require("../../../helper/currencyHelper");
const { kabupatenKota } = require("../../../helper/locationHelper");

const controllers = {};

controllers.fn_get_data_laporan_rekap_per_kecamatan = async (req, res) => {
    try {
      const { tahun } = req.query;
      const model_r_instance = new Model_r(req);
      const feedBack = await model_r_instance.fn_get_data_laporan_rekap_per_kecamatan(tahun);
  
      if (feedBack.error) {
        return res.status(500).json({
          error: true,
          error_msg: feedBack.message || "Gagal mengambil data laporan",
          data: {},
        });
      }
      if (!feedBack.feedBack || Object.keys(feedBack.feedBack).length === 0) {
        return res.status(404).json({
          error: true,
          error_msg: "Data laporan penyaluran tidak ditemukan",
          data: {},
        });
      }
  
      res.status(200).json({
        error: false,
        error_msg: "Data laporan penyaluran ditemukan",
        data: feedBack,
      });
    } catch (error) {
      console.error("ERROR in controller:", error);
      res.status(500).json({ 
        error: true, 
        error_msg: "Internal Server Error",
        message: error.message 
      });
    }
  };

  controllers.download_excel_laporan_rekap_penyaluran_per_kecamatan = async (req, res) => {
    const tahun = req.query.tahun;
    const myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    
    try {
      const border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
  
      const fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
  
      const huruf = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
      const bulan = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGS','SEP','OKT','NOV','DES'];
  
      const total_per_bulan = { 
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 
        6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0
      };
  
      // Get data dari model
      const model_r = new Model_r(req);
      const result = await model_r.fn_get_data_laporan_rekap_per_kecamatan(tahun);
  
      if (result.error) {
        return res.status(500).send('Gagal mengambil data laporan');
      }
  
      const data = result.feedBack;
  
      // Buat workbook dan worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Rekap');
      const kabupatenKotas = await kabupatenKota();
      
      // Header Title
      const title = [
        'BAITUL MAL', 
        kabupatenKotas.toUpperCase(), 
        'REKAPITULASI PENYALURAN PER KECAMATAN', 
        (tahun == '0' ? '' : 'TAHUN ' + tahun)
      ];
      
      let rows = 1;
      for (let y in title) {
        worksheet.mergeCells(`A${rows}:N${rows}`); 
        worksheet.getCell(`A${rows}`).value = title[y]; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).font = { bold: true };
        rows++;
      }
  
      worksheet.addRow([]);
      rows++;
  
      // Header kolom
      worksheet.getCell(`A${rows}`).value = 'KECAMATAN'; 
      worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`A${rows}`).border = border;
      worksheet.getCell(`A${rows}`).fill = fill;
  
      for (let bul = 0; bul < bulan.length; bul++) {
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).value = bulan[bul];
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).border = border;
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).fill = fill;
      }
  
      worksheet.getCell(`N${rows}`).value = 'JUMLAH';
      worksheet.getCell(`N${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`N${rows}`).border = border;
      worksheet.getCell(`N${rows}`).fill = fill;
  
      rows++;
  
      // Data per kecamatan
      for (let kecId in data) {
        const kecamatan = data[kecId];
        
        worksheet.getCell(`A${rows}`).value = kecamatan.name; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).border = border;
        
        let total_kecamatan = 0;
  
        // Data per bulan
        for (let bul = 0; bul < 12; bul++) {
          const rupiah = kecamatan.detail_rupiah[bul] || 0;
          worksheet.getCell(`${huruf[bul + 1]}${rows}`).value = await convertToRP(rupiah); 
          worksheet.getCell(`${huruf[bul + 1]}${rows}`).alignment = { horizontal: 'right', vertical: 'middle' };
          worksheet.getCell(`${huruf[bul + 1]}${rows}`).border = border;
  
          total_kecamatan += rupiah;
          total_per_bulan[bul] += rupiah;
        }
  
        // Total per kecamatan
        worksheet.getCell(`N${rows}`).value = await convertToRP(total_kecamatan); 
        worksheet.getCell(`N${rows}`).alignment = { horizontal: 'right', vertical: 'middle' };
        worksheet.getCell(`N${rows}`).border = border;
  
        rows++;
      }
  
      // Total keseluruhan
      worksheet.getCell(`A${rows}`).value = 'TOTAL KESELURUHAN'; 
      worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`A${rows}`).border = border;
      worksheet.getCell(`A${rows}`).fill = fill;
      worksheet.getCell(`A${rows}`).font = { bold: true };
  
      let grand_total = 0;
      for (let bul = 0; bul < 12; bul++) {
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).value = await convertToRP(total_per_bulan[bul]); 
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).alignment = { horizontal: 'right', vertical: 'middle' };
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).border = border;
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).fill = fill;
        worksheet.getCell(`${huruf[bul + 1]}${rows}`).font = { bold: true };
        grand_total += total_per_bulan[bul];
      }
  
      worksheet.getCell(`N${rows}`).value = await convertToRP(grand_total); 
      worksheet.getCell(`N${rows}`).alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getCell(`N${rows}`).border = border;
      worksheet.getCell(`N${rows}`).fill = fill;
      worksheet.getCell(`N${rows}`).font = { bold: true };
  
      rows += 3;
  
      // Tanda tangan
      const tanda_tangan = await model_r.tanda_tangan();
      
      if (Object.keys(data).length > 0) {
        worksheet.mergeCells(`A${rows}:G${rows}`);
        worksheet.getCell(`A${rows}`).value = 'DIKETAHUI'; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells(`H${rows}:N${rows}`);
        worksheet.getCell(`H${rows}`).value = `REDELONG, ${moment().format('DD MMMM YYYY')}`; 
        worksheet.getCell(`H${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        rows++;
  
        worksheet.mergeCells(`A${rows}:G${rows}`);
        worksheet.getCell(`A${rows}`).value = tanda_tangan.data.nama_jabatan1; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells(`H${rows}:N${rows}`);
        worksheet.getCell(`H${rows}`).value = tanda_tangan.data.nama_jabatan2; 
        worksheet.getCell(`H${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        rows += 4;
  
        worksheet.mergeCells(`A${rows}:G${rows}`);
        worksheet.getCell(`A${rows}`).value = tanda_tangan.data.nama_pejabat1; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).font = { bold: true, underline: true };
        worksheet.mergeCells(`H${rows}:N${rows}`);
        worksheet.getCell(`H${rows}`).value = tanda_tangan.data.nama_pejabat2; 
        worksheet.getCell(`H${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`H${rows}`).font = { bold: true, underline: true };
        rows += 2;
  
        worksheet.mergeCells(`A${rows}:N${rows}`);
        worksheet.getCell(`A${rows}`).value = 'BAITUL MAL'; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).font = { bold: true };
        rows++;
  
        worksheet.mergeCells(`A${rows}:N${rows}`);
        worksheet.getCell(`A${rows}`).value = kabupatenKotas.toUpperCase(); 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).font = { bold: true };
        rows++;
  
        worksheet.mergeCells(`A${rows}:N${rows}`);
        worksheet.getCell(`A${rows}`).value = tanda_tangan.data.nama_jabatan3; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        rows += 4;
  
        worksheet.mergeCells(`A${rows}:N${rows}`);
        worksheet.getCell(`A${rows}`).value = tanda_tangan.data.nama_pejabat3; 
        worksheet.getCell(`A${rows}`).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(`A${rows}`).font = { bold: true, underline: true };
      }
  
      // Set column width
      worksheet.columns = [
        { key: 'kec', width: 20 }, 
        { key: 'jan', width: 15 },
        { key: 'feb', width: 15 },
        { key: 'mar', width: 15 },
        { key: 'apr', width: 15 },
        { key: 'mei', width: 15 },
        { key: 'jun', width: 15 },
        { key: 'jul', width: 15 },
        { key: 'ags', width: 15 },
        { key: 'sep', width: 15 },
        { key: 'okt', width: 15 },
        { key: 'nov', width: 15 },
        { key: 'des', width: 15 },
        { key: 'jmlh', width: 20 }
      ];
  
      // Set header untuk download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=laporan_rekap_penyaluran_per_kecamatan_tahun_${tahun === '0' ? 'semua' : tahun}_${myDate.replace(/:/g, '-')}.xlsx`
      );
  
      // Kirim file Excel
      await workbook.xlsx.write(res);
      res.end();
  
    } catch (error) {
      console.log("---------------------");
      console.log("ERROR DOWNLOAD EXCEL:", error);
      console.log("---------------------");
      res.status(500).send('Terjadi kesalahan saat mengunduh file Excel');
    }
  };

module.exports = controllers;
