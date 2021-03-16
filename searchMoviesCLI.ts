import { question } from "readline-sync";
import { Client } from "pg";


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

console.log("Welcome to search-movies-cli!");
const client = new Client({ database: 'omdb' });
let searchTerm = ""

const text = "SELECT id, name, date, runtime, budget FROM movies \
WHERE kind = 'movie' \
AND LOWER(name) LIKE LOWER($1) \
ORDER BY date DESC \
LIMIT 10";


async function makeQuery() {
    let searchTerm = question("What is your favourite movie?")
    const values = [`%${searchTerm}%`]

    async function execute() {
        if (searchTerm === 'q') {
            console.log("Exiting Query!")
        }
        else {
            const result = await client.query(text, values)
            console.table(result.rows)
        }

    }
    await execute()
    return searchTerm
}

async function CLI() {
    await client.connect()
    console.log("Successfully connected")

    while (searchTerm != 'q') {
        searchTerm = await makeQuery()

    }
    await client.end()
}
CLI()



//, revenue, vote_average, votes_count --REMEMBER TO ADD THESE COLUMNS TO SELECT QUERY




