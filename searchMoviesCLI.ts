import { question } from "readline-sync";
import { Client } from "pg";


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

const client = new Client({ database: 'omdb' });




const text = "SELECT id, name, date, runtime, budget FROM movies \
WHERE kind = 'movie' \
AND LOWER(name) LIKE LOWER($1) \
ORDER BY date DESC \
LIMIT 10";


async function makeQuery() {
    const searchTerm = question("What is your favourite movie?")
    const values = [`%${searchTerm}%`]
    let continueRunning = true

    if (searchTerm != 'quit') {
        continueRunning = true
    }
    else {
        continueRunning = false
    }

    async function execute() {
        if (continueRunning === false) {
            console.log("Exiting Query!")
        }
        else {
            const result = await client.query(text, values)
            console.table(result.rows)
        }

    }
    await execute()
    return continueRunning
}
// 
async function CLI() {
    console.log("about to connect")
    await client.connect()
    console.log("Success")
    let continueRunning = true

    while (continueRunning === true) {
        continueRunning = await makeQuery()

    }
    await client.end()
}
CLI()



//, revenue, vote_average, votes_count --REMEMBER TO ADD THESE COLUMNS TO SELECT QUERY




// async function startStop() {
//     searchTerm = await makeQuery()
//     if (searchTerm != 'q') {
//         continueRunning = true
//     }
//     else {
//         continueRunning = false
//     }
//     return continueRunning
// }



