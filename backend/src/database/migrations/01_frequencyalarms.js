exports.up = function(knex){
    return knex.schema.createTable('frequencyalarms', function(table){
        table.string('id').primary();
        table.string('hour').notNullable();
        table.string('minute').notNullable();
        table.specificType('frequency', 'integer ARRAY').notNullable()
        table.string('state').notNullable();
        table.string('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('frequencyalarms')
}