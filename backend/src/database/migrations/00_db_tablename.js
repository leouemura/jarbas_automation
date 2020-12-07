//EXEMPLO DE SCHEMA USANDO KNEX

exports.up = function(knex){
    return knex.schema.createTable('db_tablename', function(table){
        table.string('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('db_tablename')
}