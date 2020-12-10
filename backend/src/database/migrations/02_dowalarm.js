exports.up = function(knex){
    return knex.schema.createTable('dowalarms', function(table){
        table.string('id').primary();
        table.string('hour').notNullable();
        table.string('minute').notNullable();
        table.string('dayoftheweek').notNullable();
        table.string('state').notNullable();
        table.string('user_id').notNullable();
        table.string('alarm_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
        table.foreign('alarm_id').references('id').inTable('frequencyalarms');
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('dowalarms')
}