exports.up = function(knex){
    return knex.schema.createTable('houses', function(table){
        table.string('id').primary();
        table.string('house').notNullable();
        table.string('user_id').notNullable();
        table.string('state').notNullable();
        table.foreign('user_id').references('id').inTable('users');
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('houses')
}