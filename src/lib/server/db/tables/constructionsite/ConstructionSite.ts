import { pool } from '../../index';

export async function getConstructionSites() {
    const [result] = await pool.query('SELECT * FROM construction_site')
	console.log(result)
    return result
}

export async function createConstructionSite(company_id: number, name: string, address: string) {
    try {
        const [result]: any[] = await pool.query("INSERT INTO construction_site (CompanyId, Name, Address) VALUES(?, ?, ?)", [company_id, name, address]);
        // const id = result.id;
        // return getConstructionSiteById(id);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Construction site already exists.');
        } else {
            throw new Error('Error creating construction site.');
        }
    }
}