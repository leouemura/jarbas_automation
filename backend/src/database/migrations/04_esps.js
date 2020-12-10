exports.up = function(knex){
    return knex.schema.createTable('esps', function(table){
        table.string('id').primary();
        table.string('espfunction').notNullable();
        table.string('house').notNullable();
        table.string('macid').notNullable();
        table.string('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('esps')
}