POST http://localhost:3003/auth/login_administrator
Content-Type: application/json

{
    "username": "admin",
    "password": "admin"
}
HTTP 200
[Captures]
access_token: jsonpath "$.access_token"


POST http://localhost:3003/bakal_penerima_bantuan/list
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
    "pageNumber": 1,
    "perpage": 10,
    "search": "",
    "type_status_kegiatan": "sedang_berlangsung",
    "type_status_realiasasi": ""
}

HTTP 200
[Asserts]
jsonpath "$.error" == false

