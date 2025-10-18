const moment = require("moment");
const {
  Sequelize,
  Op,
  Permohonan,
  Kegiatan_keseketariatan,
  Setting,
  Member,
  Kegiatan,
  Desa,
  Kecamatan,
  Asnaf,
  Program,
  Riwayat_pengumpulan,
  Riwayat_donasi,
  Realisasi_permohonan,
} = require("../../../models");
const { convertToRP } = require("../../../helper/currencyHelper");
const { kabupatenKota } = require("../../../helper/locationHelper");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async get_tahun() {
    try {
      var data = [];
      // selain amil
      await Realisasi_permohonan.findAll({
        where: {
          status_realisasi: "sudah_direalisasi",
        },
        include: [
          {
            model: Permohonan,
            required: true,
            include: [
              {
                model: Kegiatan,
                required: true,
                include: [
                  {
                    model: Asnaf,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            var year = moment(e.tanggal_realisasi).format("YYYY");
            console.log(year);
            if (!data.includes(year)) {
              data.push(year);
            }
          })
        );
      });
      // amil
      await Kegiatan_keseketariatan.findAll({}).then(async (value) => {
        console.log(value),
          await Promise.all(
            await value.map(async (e) => {
              var year = moment(e.tanggal_penyaluran).format("YYYY");
              console.log(year);
              if (!data.includes(year)) {
                data.push(year);
              }
            })
          );
      });

      console.log(data);

      data.sort((a, b) => a - b);

      return { error: false, data };
    } catch (error) {
      return { error: true };
    }
  }

  async fn_asnaf(tahun, asnaf) {
    var data = {};
    var total = {};
    var order = [];
    var where = {
      status: "approve",
      status_realisasi: "sudah_direalisasi",
    };

    if (tahun != "0") {
      where = {
        ...where,
        ...{
          tanggal_realisasi: {
            [Op.between]: [
              tahun + "-01-01 00:00:00",
              tahun + "-12-31 23:59:59",
            ],
          },
        },
      };
    }

    await Realisasi_permohonan.findAll({
      where: where,
      order: [["tanggal_realisasi", "DESC"]],
      include: [
        {
          model: Permohonan,
          required: true,
          include: [
            {
              model: Member,
              required: true,
              include: [
                {
                  model: Desa,
                  required: false,
                  include: [
                    {
                      model: Kecamatan,
                      required: false,
                    },
                  ],
                },
              ],
            },
            {
              model: Kegiatan,
              required: true,
              where: {
                asnaf_id: asnaf,
              },
              include: [
                {
                  model: Asnaf,
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    }).then(async (value) => {
      await Promise.all(
        value.map(async (e) => {
          var namaBulan = moment(e.tanggal_realisasi).format("MMMM");
          var tahunMoment = moment(e.tanggal_realisasi).format("YYYY");
          var name = namaBulan + "_" + tahunMoment;

          if (!order.includes(name)) {
            order.push(name);
          }

          var kredits = await convertToRP(e.biaya_disetujui);

          const member = e.Permohonan.Member;
          const kegiatan = e.Permohonan.Kegiatan;

          if (data[name] === undefined) {
            data[name] = [
              {
                tanggal: moment(e.tanggal_realisasi).format("DD/MM/YYYY"),
                nik: member.nomor_ktp,
                kredit: kredits,
                uraian: member.fullname,
                alamat:
                  member.tipe === "perorangan"
                    ? member.desa_id === null
                      ? member.alamat
                      : member.Desa.name
                    : "INSTANSI",
                kec:
                  member.tipe === "perorangan"
                    ? member.desa_id === null
                      ? "LBM"
                      : member.Desa.Kecamatan?.kode
                    : "INS",
                kode_akun: kegiatan.Asnaf.name + " - " + kegiatan.kode,
              },
            ];
            total[name] = e.biaya_disetujui;
          } else {
            data[name].push({
              tanggal: moment(e.tanggal_realisasi).format("DD/MM/YYYY"),
              nik: member.nomor_ktp,
              kredit: kredits,
              uraian: kegiatan.nama_kegiatan,
              alamat:
                member.tipe === "perorangan"
                  ? member.desa_id === null
                    ? member.alamat
                    : member.Desa.name
                  : "INSTANSI",
              kec:
                member.tipe === "perorangan"
                  ? member.Desa.id === null
                    ? "LBM"
                    : member.Desa.Kecamatan.kode
                  : "INS",
              kode_akun: kegiatan.Asnaf.name + kegiatan.kode,
            });
            total[name] = total[name] + e.biaya_disetujui;
          }
        })
      );
    });

    var feedBack = [];
    for (const key of order) {
      var list = [];
      var num = 1;
      for (let y in data[key]) {
        list.push([
          num.toString(),
          data[key][y].tanggal,
          data[key][y].uraian,
          data[key][y].nik,
          data[key][y].alamat,
          data[key][y].kec,
          data[key][y].kode_akun,
          data[key][y].kredit.toString(),
        ]);
        num++;
      }
      feedBack.push({
        bulan: key,
        data: list,
        total: await convertToRP(total[key]),
      });
    }
    return feedBack;
  }

  async fn_asnaf_amil(tahun) {
    var data = {};
    var total = {};
    var order = [];
    var where = {};

    if (tahun != "0") {
      where = {
        ...where,
        ...{
          tanggal_penyaluran: {
            [Op.between]: [
              tahun + "-01-01 00:00:00",
              tahun + "-12-31 23:59:59",
            ],
          },
        },
      };
    }

    await Kegiatan_keseketariatan.findAll({
      where: where,
      order: [["tanggal_penyaluran", "DESC"]],
      include: [
        {
          required: false,
          model: Desa,
          include: {
            required: false,
            model: Kecamatan,
          },
        },
      ],
    }).then(async (value) => {
      await Promise.all(
        await value.map(async (e) => {
          var namaBulan = moment(e.tanggal_penyaluran).format("MMMM");
          var tahunMoment = moment(e.tanggal_penyaluran).format("YYYY");
          var name = namaBulan + "_" + tahunMoment;
          var kredits = await convertToRP(e.nominal_kegiatan);

          if (!order.includes(name)) {
            order.push(name);
          }

          if (data[name] === undefined) {
            data = {
              ...data,
              ...{
                [name]: [
                  {
                    tanggal: moment(e.tanggal_penyaluran).format("DD/MM/YYYY"),
                    nik: "-",
                    kredit: kredits,
                    uraian: e.nama_kegiatan,
                    alamat:
                      e.tipe === "perorangan"
                        ? e.desa_id === null
                          ? e.alamat
                          : e.Desa.name
                        : "INSTANSI",
                    kec:
                      e.tipe === "perorangan"
                        ? e.desa_id === null
                          ? "LBM"
                          : e.Desa.Kecamatan.kode
                        : "INS",
                    kode_akun: e.kode,
                  },
                ],
              },
            };
            total = { ...total, ...{ [name]: e.nominal_kegiatan } };
          } else {
            data[name].push({
              tanggal: moment(e.tanggal_penyaluran).format("DD/MM/YYYY"),
              nik: "-",
              kredit: kredits,
              uraian: e.nama_kegiatan,
              alamat:
                e.tipe === "perorangan"
                  ? e.desa_id === null
                    ? e.alamat
                    : e.Desa.name
                  : "INSTANSI",
              kec:
                e.tipe === "perorangan"
                  ? e.desa_id === null
                    ? "LBM"
                    : e.Desa.Kecamatan.kode
                  : "INS",
              kode_akun: e.kode,
            });
            total[name] = total[name] + e.nominal_kegiatan;
          }
        })
      );
    });

    var feedBack = [];
    for (const key of order) {
      var list = [];
      var num = 1;
      for (let y in data[key]) {
        list.push([
          num.toString(),
          data[key][y].tanggal,
          data[key][y].uraian,
          data[key][y].nik,
          data[key][y].alamat,
          data[key][y].kec,
          data[key][y].kode_akun,
          data[key][y].kredit.toString(),
        ]);
        num++;
      }
      feedBack.push({
        bulan: key,
        data: list,
        total: await convertToRP(total[key]),
      });
    }
    return feedBack;
  }

  async count_member() {
    try {
      const q = await Member.findAndCountAll();
      return await q.count;
    } catch (error) {
      return await 0;
    }
  }

  async count_asnaf() {
    try {
      const q = await Asnaf.findAndCountAll();
      return await q.count;
    } catch (error) {
      return await 0;
    }
  }

  async count_program() {
    try {
      const q = await Program.findAndCountAll();
      return await q.count;
    } catch (error) {
      return await 0;
    }
  }

  async count_program_bantuan() {
    try {
      const q = await Kegiatan.findAndCountAll();
      return await q.count;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerima_bantuan() {
    try {
      const q = await Realisasi_permohonan.findAndCountAll({
        where: { status: "approve", status_realisasi: "sudah_direalisasi" },
      });
      return await q.count;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penyaluran_bantuan() {
    try {
      var total = 0;
      await Realisasi_permohonan.findAll({
        where: { status: "approve", status_realisasi: "sudah_direalisasi" },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.biaya_disetujui;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_zakat() {
    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: { tipe: { [Op.ne]: "infaq" }, status: "success" },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_zakat_tahun_ini() {
    const startOfYear = moment().startOf("year").toDate(); // Awal tahun
    const endOfYear = moment().endOf("year").toDate();

    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: {
          tipe: { [Op.ne]: "infaq" },
          status: "success",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_zakat_hari_ini() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    ); // Awal hari ini
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    ); // Akhir hari ini
    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: {
          tipe: { [Op.ne]: "infaq" },
          status: "success",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_infaq() {
    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: { tipe: "infaq", status: "success" },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_infaq_tahun_ini() {
    const startOfYear = moment().startOf("year").toDate(); // Awal tahun
    const endOfYear = moment().endOf("year").toDate();

    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: {
          tipe: "infaq",
          status: "success",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_infaq_hari_ini() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    ); // Awal hari ini
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    ); // Akhir hari ini
    try {
      var total = 0;
      await Riwayat_pengumpulan.findAll({
        where: {
          tipe: "infaq",
          status: "success",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_donasi() {
    try {
      var total = 0;
      await Riwayat_donasi.findAll({
        where: { status: "success" },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_donasi_tahun_ini() {
    const startOfYear = moment().startOf("year").toDate(); // Awal tahun
    const endOfYear = moment().endOf("year").toDate();

    try {
      var total = 0;
      await Riwayat_donasi.findAll({
        where: {
          status: "success",
          createdAt: {
            [Op.between]: [startOfYear, endOfYear], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async count_total_penerimaan_donasi_hari_ini() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    ); // Awal hari ini
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    ); // Akhir hari ini
    try {
      var total = 0;
      await Riwayat_donasi.findAll({
        where: {
          status: "success",
          createdAt: {
            [Op.between]: [startOfDay, endOfDay], // Rentang waktu di tahun ini
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            total = total + e.nominal;
          })
        );
      });
      return total;
    } catch (error) {
      return await 0;
    }
  }

  async info_laporan_umum() {
    try {
      // total member
      const total_member = await this.count_member();
      // total asnaf
      const total_asnaf = await this.count_asnaf();
      // total program
      const total_program = await this.count_program();
      // total program bantuan
      const total_program_bantuan = await this.count_program_bantuan();
      // total_penerima_bantuan
      const total_penerima_bantuan = await this.count_total_penerima_bantuan();
      // total penyaluran bantuan
      const total_penyaluran_bantuan =
        await this.count_total_penyaluran_bantuan();
      // total penerima zakat
      const total_penerimaan_zakat = await this.count_total_penerimaan_zakat();
      // total penerimaan zakat tahun ini
      const total_penerimaan_zakat_tahun_ini =
        await this.count_total_penerimaan_zakat_tahun_ini();
      // total penerimaan zakat hari ini
      const total_penerimaan_zakat_hari_ini =
        await this.count_total_penerimaan_zakat_hari_ini();
      // total penerima infaq
      const total_penerimaan_infaq = await this.count_total_penerimaan_infaq();
      // total penerimaan infaq tahun ini
      const total_penerimaan_infaq_tahun_ini =
        await this.count_total_penerimaan_infaq_tahun_ini();
      // total penerimaan infaq hari ini
      const total_penerimaan_infaq_hari_ini =
        await this.count_total_penerimaan_infaq_hari_ini();
      // total penerima donasi
      const total_penerimaan_donasi =
        await this.count_total_penerimaan_donasi();
      // total penerimaan donasi tahun ini
      const total_penerimaan_donasi_tahun_ini =
        await this.count_total_penerimaan_donasi_tahun_ini();
      // total penerimaan donasi hari ini
      const total_penerimaan_donasi_hari_ini =
        await this.count_total_penerimaan_donasi_hari_ini();

      return {
        error: false,
        data: {
          total_member,
          total_asnaf,
          total_program,
          total_program_bantuan,
          total_penerima_bantuan,
          total_penyaluran_bantuan,
          total_penerimaan_zakat,
          total_penerimaan_zakat_tahun_ini,
          total_penerimaan_zakat_hari_ini,
          total_penerimaan_infaq,
          total_penerimaan_infaq_tahun_ini,
          total_penerimaan_infaq_hari_ini,
          total_penerimaan_donasi,
          total_penerimaan_donasi_tahun_ini,
          total_penerimaan_donasi_hari_ini,
        },
      };
    } catch (error) {
      console.log("AAAAAAAAAAAAAAAAAAAA");
      console.log(error);
      console.log("AAAAAAAAAAAAAAAAAAAA");
      return { error: true };
    }
  }

  async fn_get_data(tahun) {
    const list_asnaf = {
      fakir: 1,
      miskin: 2,
      muallaf: 3,
      gharim: 4,
      fisabilillah: 5,
      ibnu_sabil: 6,
      amil: 7,
    };
    var data = {};
    for (let x in list_asnaf) {
      if (x === "amil") {
        var temp = await this.fn_asnaf_amil(tahun);
        data = { ...data, ...{ [x]: temp } };
      } else {
        var temp = await this.fn_asnaf(tahun, list_asnaf[x]);
        data = { ...data, ...{ [x]: temp } };
      }
    }
    return data;
  }

  async fn_get_data_laporan_rekap_per_asnaf(tahun) {
    try {
      const allAsnaf = await Asnaf.findAll();
      const list = {};
      for (const asnaf of allAsnaf) {
        list[asnaf.id] = {
          name: asnaf.name,
          total_rupiah: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
          },
          total_pemohon: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
          },
        };
      }
      list["7"] = {
        name: "Amil",
        total_rupiah: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
        total_pemohon: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
      };

      let where = { status: "approve", status_realisasi: "sudah_direalisasi" };
      let where_penyaluran_amil = {};

      if (tahun && tahun !== "0") {
        const yearCondition = Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("tanggal_realisasi")),
          tahun
        );
        where[Sequelize.Op.and] = yearCondition;

        const yearConditionAmil = Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("tanggal_penyaluran")),
          tahun
        );
        where_penyaluran_amil[Sequelize.Op.and] = yearConditionAmil;
      }

      const realisasiPermohonan = await Realisasi_permohonan.findAll({
        where: where,
        include: [
          {
            model: Permohonan,
            required: true,
            include: [
              {
                model: Kegiatan,
                required: true,
                include: [{ model: Asnaf, required: true }],
              },
            ],
          },
        ],
      });

      for (const e of realisasiPermohonan) {
        const index_bulan = moment(e.tanggal_realisasi).month();
        const asnafId = e.Permohonan.Kegiatan.asnaf_id;

        if (
          list[asnafId] &&
          list[asnafId].total_rupiah[index_bulan] !== undefined
        ) {
          list[asnafId].total_rupiah[index_bulan] += e.biaya_disetujui;
          list[asnafId].total_pemohon[index_bulan] += 1;
        }
      }

      const kegiatanKesekretariatan = await Kegiatan_keseketariatan.findAll({
        where: where_penyaluran_amil,
        order: [["tanggal_penyaluran", "DESC"]],
      });

      for (const e of kegiatanKesekretariatan) {
        const index_bulan = moment(e.tanggal_penyaluran).month();
        if (list["7"]) {
          // Asnaf Amil (ID 7)
          list["7"].total_rupiah[index_bulan] += e.nominal_kegiatan;
          list["7"].total_pemohon[index_bulan] += 1;
        }
      }

      return { error: false, feedBack: list };
    } catch (error) {
      console.error("Error di fn_get_data_laporan_rekap_per_asnaf:", error);
      return { error: true };
    }
  }

  async fn_get_data_laporan_rekap_per_kode_asnaf(tahun) {
    try {
      var list = {};
      await Asnaf.findAll().then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            list = {
              ...list,
              ...{
                [e.id]: {
                  id: e.id,
                  name: e.name,
                  rows: 0,
                  detail: {},
                  total_rupiah: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                  },
                  total_pemohon: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                  },
                },
              },
            };

            if (!list["7"]) {
              list["7"] = {
                id: 7,
                name: "Amil",
                rows: 0,
                detail: {},
                total_rupiah: {
                  0: 0,
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                  6: 0,
                  7: 0,
                  8: 0,
                  9: 0,
                  10: 0,
                  11: 0,
                },
                total_pemohon: {
                  0: 0,
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                  6: 0,
                  7: 0,
                  8: 0,
                  9: 0,
                  10: 0,
                  11: 0,
                },
              };
            }
          })
        );
      });

      console.log("list pertama", list);

      await Kegiatan.findAll({ order: [["asnaf_id", "ASC"]] }).then(
        async (value) => {
          await Promise.all(
            await value.map(async (e) => {
              list[e.asnaf_id].detail = {
                ...list[e.asnaf_id].detail,
                ...{
                  [e.id]: {
                    id: e.id,
                    name: e.nama_kegiatan,
                    kode: e.kode !== "" ? e.kode : "00",
                    detail_penyaluran: {
                      0: 0,
                      1: 0,
                      2: 0,
                      3: 0,
                      4: 0,
                      5: 0,
                      6: 0,
                      7: 0,
                      8: 0,
                      9: 0,
                      10: 0,
                      11: 0,
                    },
                  },
                },
              };

              list[e.asnaf_id].rows = list[e.asnaf_id].rows + 1;
            })
          );
        }
      );

      console.log("list kedua", list);

      var where = {};
      var where_penyaluran_amil = {};
      if (tahun !== undefined && tahun !== "0") {
        where = {
          [Sequelize.Op.and]: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("tanggal_realisasi")),
            tahun
          ),
        };
        where_penyaluran_amil = {
          [Sequelize.Op.and]: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("tanggal_penyaluran")),
            tahun
          ),
        };
      }

      where = {
        ...where,
        ...{ status: "approve", status_realisasi: "sudah_direalisasi" },
      };

      await Realisasi_permohonan.findAll({
        where: where,
        include: [
          {
            model: Permohonan,
            required: true,
            include: [
              {
                model: Kegiatan,
                required: true,
              },
            ],
          },
        ],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            var index_bulan = moment(e.tanggal_realisasi).month();
            var asnaf_id = e.Permohonan.Kegiatan.asnaf_id.toString();
            var kegiatan_id = e.Permohonan.Kegiatan.id.toString();

            if (list[asnaf_id] && list[asnaf_id].detail[kegiatan_id]) {
              list[asnaf_id].detail[kegiatan_id].detail_penyaluran[
                index_bulan.toString()
              ] += e.biaya_disetujui;
            }

            if (list[asnaf_id]) {
              list[asnaf_id].total_rupiah[index_bulan.toString()] +=
                e.biaya_disetujui;
              list[asnaf_id].total_pemohon[index_bulan.toString()] += 1;
            }
          })
        );
      });

      console.log("list ketiga", list);

      await Kegiatan_keseketariatan.findAll({
        where: where_penyaluran_amil,
        order: [["tanggal_penyaluran", "DESC"]],
        include: [
          {
            required: false,
            model: Desa,
            include: {
              required: false,
              model: Kecamatan,
            },
          },
        ],
      }).then(async (value) => {
        await Promise.all(
          value.map(async (e) => {
            var index_bulan = moment(e.tanggal_penyaluran).month();
            var kegiatanIdStr = e.id.toString();

            if (!list["7"].detail[kegiatanIdStr]) {
              list["7"].detail[kegiatanIdStr] = {
                id: e.id,
                name: e.uraian_kegiatan || e.nama_kegiatan,
                kode: "00",
                detail_penyaluran: {
                  0: 0,
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                  6: 0,
                  7: 0,
                  8: 0,
                  9: 0,
                  10: 0,
                  11: 0,
                },
              };
              list["7"].rows = (list["7"].rows || 0) + 1;
            }

            list["7"].detail[kegiatanIdStr].detail_penyaluran[
              index_bulan.toString()
            ] += e.nominal_kegiatan || 0;
            list["7"].total_rupiah[index_bulan.toString()] +=
              e.nominal_kegiatan || 0;
            list["7"].total_pemohon[index_bulan.toString()] += 1;
          })
        );
      });

      console.log("list 4", list);

      return { error: false, feedBack: list };
    } catch (error) {
      console.error(
        "Error in fn_get_data_laporan_rekap_per_kode_asnaf:",
        error
      );
      return { error: true, message: error.message };
    }
  }

  async fn_get_data_laporan_rekap_per_kecamatan(tahun) {
    try {
      var list = {};

      await Kecamatan.findAll().then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            list = {
              ...list,
              ...{
                [e.id]: {
                  name: e.name,
                  kode: e.kode,
                  detail_rupiah: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                  },
                  detail_pemohon: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                  },
                },
              },
            };
          })
        );
      });

      console.log("list 1", list);

      var kab = {
        name: await kabupatenKota(),
        kode: "KBM",
        detail_rupiah: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
        detail_pemohon: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
      };
      var instansi = {
        name: "Instansi",
        kode: "INS",
        detail_rupiah: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
        detail_pemohon: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
        },
      };

      list = { ...list, ...{ [0]: kab } };
      list = { ...list, ...{ [12]: instansi } };

      console.log("list 2", list);

      var where = {};
      if (tahun !== undefined && tahun !== "0") {
        where = {
          [Sequelize.Op.and]: Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("tanggal_realisasi")),
            tahun
          ),
        };
      }

      where = {
        ...where,
        ...{ status: "approve", status_realisasi: "sudah_direalisasi" },
      };

      await Realisasi_permohonan.findAll({
        where: where,
        include: [
          {
            required: true,
            model: Permohonan,
            include: {
              required: true,
              model: Kegiatan,
            },
          },
          {
            required: true,
            model: Permohonan,
            include: {
              required: true,
              model: Member,
              include: {
                required: true,
                model: Desa,
              },
            },
          },
        ],
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            var index_bulan = moment(e.tanggal_realisasi).month();
            if (e.Permohonan.Kegiatan.area_penyaluran === "kabupaten") {
              list[0].detail_rupiah[index_bulan] =
                list[0].detail_rupiah[index_bulan] + e.biaya_disetujui;
              list[0].detail_pemohon[index_bulan] =
                list[0].detail_pemohon[index_bulan] + 1;
            } else if (e.Permohonan.Kegiatan.area_penyaluran === "instansi") {
              list[12].detail_rupiah[index_bulan] =
                list[12].detail_rupiah[index_bulan] + e.biaya_disetujui;
              list[12].detail_pemohon[index_bulan] =
                list[12].detail_pemohon[index_bulan] + 1;
            } else if (
              e.Permohonan.Kegiatan.area_penyaluran === "semua_pemohon"
            ) {
              list[11].detail_rupiah[index_bulan] =
                list[11].detail_rupiah[index_bulan] + e.biaya_disetujui;
              list[11].detail_pemohon[index_bulan] =
                list[11].detail_pemohon[index_bulan] + 1;
            } else {
              list[e.Permohonan.Member.Desa.kecamatan_id].detail_rupiah[
                index_bulan
              ] =
                list[e.Permohonan.Member.Desa.kecamatan_id].detail_rupiah[
                  index_bulan
                ] + e.biaya_disetujui;
              list[e.Permohonan.Member.Desa.kecamatan_id].detail_pemohon[
                index_bulan
              ] =
                list[e.Permohonan.Member.Desa.kecamatan_id].detail_pemohon[
                  index_bulan
                ] + 1;
            }
          })
        );
      });

      console.log("list 3", list);

      return { error: false, feedBack: list };
    } catch (error) {
      console.log("------------------------------");
      console.log(error);
      console.log("------------------------------");
      return { error: true };
    }
  }

  async tanda_tangan() {
    try {
      // default value pakai nama field-nya sendiri
      let data = {
        nama_jabatan1: "Nama Jabatan 1",
        nama_pejabat1: "Nama Pejabat 1",
        nama_jabatan2: "Nama Jabatan 2",
        nama_pejabat2: "Nama Pejabat 2",
        nama_jabatan3: "Nama Jabatan 3",
        nama_pejabat3: "Nama Pejabat 3",
      };

      const value = await Setting.findAll({
        where: {
          name: {
            [Op.in]: Object.keys(data),
          },
        },
      });

      // kalau ada datanya, ganti value default
      value.forEach((e) => {
        data[e.name] = e.value || e.name;
      });

      return { error: false, data };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}

module.exports = Model_r;
