"use strict";

const { User, Grup, Menu, Submenu, Tab } = require("../../../models");
const jwt = require("jsonwebtoken");

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
        return {}    
    }
  }
}

module.exports = Model_r;
