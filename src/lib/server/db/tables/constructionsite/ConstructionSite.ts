import { pool } from '../../index';

export async function getConstructionSites() {
    const [result] = await pool.query('SELECT * FROM construction_site')
	console.log(result)
    return result
}