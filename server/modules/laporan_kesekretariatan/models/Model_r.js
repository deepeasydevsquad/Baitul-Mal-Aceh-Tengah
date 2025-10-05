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
      // Kesekretariatan
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
                  required: true,
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

  async kegiatan_kesekretariatan(tahun) {
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

  async tanda_tangan() {
    try {
      var data = {};
      await Setting.findAll({
        where: {
          name: {
            [Op.in]: [
              "nama_jabatan1",
              "nama_pejabat1",
              "nama_jabatan2",
              "nama_pejabat2",
              "nama_jabatan3",
              "nama_pejabat3",
            ],
          },
        },
      }).then(async (value) => {
        await Promise.all(
          await value.map(async (e) => {
            data = { ...data, ...{ [e.name]: e.value } };
          })
        );
      });
      return { error: false, data: data };
    } catch (error) {
      return { error: true };
    }
  }
}

module.exports = Model_r;
