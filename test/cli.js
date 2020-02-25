const cli = require('./tcp.client');

let conn = {
    host: 'localhost',
    port: 3333,
    exclusive:true
}

cli.conn(conn);
