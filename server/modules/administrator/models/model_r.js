"use strict";

const { User, Grup, Menu, Submenu, Tab } = require("../../../models");
const jwt = require("jsonwebtoken");
const moment = require("moment");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async getInfoUser() {
    try {
        var q = await User.findOne({
            where: { username : this.req.body.username }, 
        });
        return { id: q.id, username: q.username, name: q.name };
    } catch (error) {
        return {}
    }
  }


  async get_menu_submenu_tab() {

    try {
        const authHeader = this.req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);

        console.log("&&&&&Decode&&&&&");
        console.log(token);
        console.log(decoded);
        console.log(decoded.id);
        console.log("&&&&&Decode&&&&&");
        var user_info = {};
        await User.findOne({
            where : { 
                id: decoded.id
            },
            include : [
                {
                    required: true, 
                    model: Grup,
                }, 
            ]
        }).then(async (e) => {
            if (e) {
                user_info['name'] = e.name;
                user_info['grup_id'] = e.grup_id;
                if(e.grup_id == 1 ) {
                    user_info['group_access'] = {};
                }else{
                    user_info['group_access'] = JSON.parse(e.Grup.group_access);
                }
            }
        });

        var list_tab_user = { menu: [], submenu: [] };
        for( let x in user_info.group_access ) {
            list_tab_user.menu.push(user_info.group_access[x].id);
            if( user_info.group_access[x].Submenus.length > 0  ) {
              for( let y in  user_info.group_access[x].Submenus ) {
                list_tab_user.submenu.push(user_info.group_access[x].Submenus[y].id);
              }
            }
        }

        var menu = {};
        await Menu.findAll().then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {
                if( user_info['grup_id'] != 1 ) {
                    if( list_tab_user.menu.includes(e.id)  ) {
                        menu[e.id] = { id : e.id, name : e.name, path : e.path, icon : e.icon, tab : e.path === '#' ? '' : JSON.parse(e.tab)};
                    }
                }else{
                    menu[e.id] = { id : e.id, name : e.name, path : e.path, icon : e.icon, tab : e.path === '#' ? '' : JSON.parse(e.tab)};
                }   
            })
          );
        });
  
        var submenu = {};
        await Submenu.findAll().then(async (value) => {
          await Promise.all(
            await value.map(async (e) => {

                if(submenu[e.menu_id] === undefined ) {
                  if( user_info['grup_id'] === 1 ) {
                    submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) }]}}
                  }else {
                    if( list_tab_user.submenu.includes(e.id)  ) {
                      submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) }]}}
                    }
                  }
                }else{
                  if( user_info['grup_id'] === 1 ) {
                    submenu[e.menu_id].push({ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) });
                  }else {
                    if( list_tab_user.submenu.includes(e.id)  ) {
                      submenu[e.menu_id].push({ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) });
                    }
                  }
                }
            })
          );
        });

        var tab = {};
        await Tab.findAll().then(async (value) => {
            await Promise.all(
              await value.map(async (e) => {
                tab = {...tab,...{[e.id] : { id : e.id, name : e.name, icon : e.icon, path: e.path, desc : e.desc }}};
              })
            );
        });

        return { menu_info : { menu , submenu, tab }, user_info : user_info };
    } catch (error) {

      console.log("^^^^^^^^^^^^^^^^^^^^^^");
      console.log(error);
      console.log("^^^^^^^^^^^^^^^^^^^^^^");
        return {}    
    }

  }

    // if( user_info['grup_id'] != 1 ) {

    // }else {

    // }
    //   if( type === 'administrator' ) {
    //     submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) }]}}
    //   }else if( type === 'staff' ) {
    //     if( list_tab_user.submenu.includes(e.id)  ) {
    //       submenu = {...submenu,...{[e.menu_id] : [{ id: e.id, name : e.name, path: e.path, tab : e.tab === '' ? '' : JSON.parse(e.tab) }]}}
    //     }
    //   }

//   async initialize() {
//     if (!this.company_id) {
//       this.company_id = await getCompanyIdByCode(this.req);
//     }
//   }

//   //Mengambil semua data jenis visa yang tersedia untuk dropdown.
//   async getAllVisaTypes() {
//     await this.initialize();

//     try {
//       const visaTypes = await Mst_visa_request_type.findAll({
//         attributes: ["id", "name"],
//         order: [["name", "ASC"]],
//         raw: true,
//       });

//       return visaTypes;
//     } catch (error) {
//       console.error("Error di Model_r saat mengambil getAllVisaTypes:", error);
//       throw error;
//     }
//   }

//   async ambil_nama_paket_bulk(ids) {
//     const paketList = await Paket.findAll({
//       where: { id: { [Op.in]: ids } },
//       attributes: ["id", "name"],
//     });

//     const paketMap = {};
//     paketList.forEach((paket) => {
//       paketMap[paket.id] = paket.name;
//     });

//     return paketMap;
//   }

//   // DAFTAR TRANSAKSI VISA
//   async daftar_transaksi_visa() {
//     await this.initialize();

//     try {
//       const body = this.req.body;
//       const limit = parseInt(body.perpage) || 10;
//       const page =
//         body.pageNumber && body.pageNumber !== "0"
//           ? parseInt(body.pageNumber)
//           : 1;

//       let where = { division_id: body.cabang };

//       if (body.search) {
//         where = {
//           ...where,
//           invoice: { [Op.like]: `%${body.search}%` },
//         };
//       }

//       const sql = {
//         limit,
//         offset: (page - 1) * limit,
//         order: [["createdAt", "DESC"]],
//         where,
//         include: [
//           {
//             model: Kostumer,
//             required: false,
//             attributes: ["name"],
//           },
//           {
//             model: Paket,
//             required: false,
//             attributes: ["name"],
//           },
//           {
//             model: Mst_visa_request_type,
//             required: false,
//             attributes: ["name"],
//           },
//         ]
//       };

//       const q = await Visa_transaction.findAndCountAll(sql);
//       const total = q.count;
//       let data = [];

//       if (total > 0) {
//         await Promise.all(
//           q.rows.map(async (e) => {
//             data.push({
//               id: e.id,
//               invoice: e.invoice, 
//               petugas: e.petugas,
//               kostumer: e.Kostumer?.name || "-", 
//               paket: e.Paket?.name || "-", 
//               pax: e.pax,
//               harga_travel: e.harga_travel, 
//               harga_costumer: e.harga_costumer,
//               jenis_visa: e.Mst_visa_request_type.name, 
//               tanggal_transaksi : moment(e.createdAt).format("D MMMM YYYY")
//             });
//           })
//         );
//       }

//       console.log("YYYYYYYYYYYYYYYY");
//       console.log(total);
//       console.log("YYYYYYYYYYYYYYYY");

//       return {
//         data,
//         total,
//       };
//     } catch (error) {
//       console.error("❌ Gagal ambil data transaksi visa:", error);
//       return { data: [], total: 0 };
//     }
//   }

//   // MENGAMBIL DAFTAR KOTA
//   async getAllCities() {
//     await this.initialize();

//     try {
//       const cities = await Mst_kota.findAll({
//         attributes: ["id", "name", "kode"],
//         where: {
//           company_id: this.company_id,
//         },
//         order: [["name", "ASC"]],

//         raw: true,
//       });

//       return cities;
//     } catch (error) {
//       console.error("Error di Model_r saat mengambil getAllCities:", error);
//       throw error;
//     }
//   }

//   async daftar_kostumer() {
//     try {
//       await this.initialize(); // inisialisasi company_id
//       const sql = await Kostumer.findAll({
//         where: { company_id: this.company_id },
//       });

//       const data = sql.map((d) => ({
//         id: d.id,
//         name: d.name,
//       }));
//       return data;
//     } catch (error) {
//       console.error("Gagal ambil daftar kostumer:", error);
//       return [];
//     }
//   }

//   async daftar_paket() {
//     const body = this.req.body;
//     try {
//       const sql = await Paket.findAll({
//         where: { division_id: body.division_id },
//       });

//       const data = sql.map((d) => ({
//         id: d.id,
//         name: d.name,
//       }));

//       return data;
//     } catch (error) {
//       console.error("Gagal ambil daftar kostumer:", error);
//       return [];
//     }
//   }

//   async daftar_jenis_visa() {
//     try {
//       const sql = await Mst_visa_request_type.findAll();
//       const data = sql.map((d) => ({
//         id: d.id,
//         name: d.name,
//       }));

//       return data;
//     } catch (error) {
//       console.error("Gagal ambil daftar jenis visa :", error);
//       return [];
//     }
//   }

//   async get_sumber_dana_paket() {
//     await this.initialize();
    
//     const akuntansi = new Akuntansi(); 

//     try {
//       var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun('11010', this.company_id, this.req.body.cabang, '0') );
//       var sumber_dana = [{ id: 0, name: 'Kas (Saldo : ' + saldo + ')'}];
//       await Mst_bank.findAll({ where: { company_id: this.company_id }, }).then(async (value) => {
//         await Promise.all(
//           await value.map(async (e) => {
//             var saldo = await convertToRP( await akuntansi.saldo_masing_masing_akun(e.nomor_akun, this.company_id, this.req.body.cabang, '0') );
//             sumber_dana.push({ 
//               id : e.id, 
//               name : e.kode + ' (Saldo : ' + saldo + ')', 
//             });
//           })
//         );
//       });

//       const sql = await Paket.findAll({ where: { division_id: this.req.body.cabang } });
//       const daftar_paket = sql.map((d) => ({ id: d.id, name: d.name }));

//       return { sumber_dana, daftar_paket };
//     } catch (error) {
//       console.error("Gagal ambil daftar jenis visa :", error);
//       return {};
//     }
//   }
}

module.exports = Model_r;
