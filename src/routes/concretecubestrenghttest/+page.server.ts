import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import { getUserById, getUsers } from '$lib/server/db/tables/user/User';
import { parse } from 'cookie';
import { getStrenghtTests } from '$lib/server/db/tables/strengthtest/StrengthTest';
import type { StrengthTestListType, StrengthTestType } from '$lib/server/db/tables/strengthtest/StrengthTestType';
import { getCompanyById } from '$lib/server/db/tables/company/Company.js';
import type { QueryResult } from 'mysql2';
import type { CompanyType } from '$lib/server/db/tables/company/CompanyType';
import type { ConstructionSiteType } from '$lib/server/db/tables/constructionsite/ConstructionSiteType.js';
import { getConstructionSiteById } from '$lib/server/db/tables/constructionsite/ConstructionSite';

// export const load = (({ locals }) => {
// 	if (!locals?.role?.includes('teacher')) {
// 		throw error(404, 'Neteisėtas prisijungimas');
// 	}

//     let users: UserType[] = getUsers();

//     return {
//         users
//     };
// }) satisfies PageServerLoad;

export const load = async ({ request, depends }) => {
	depends('template:load');
    const cookies = request.headers.get('cookie');
    const { role, user_id, name, company_id } = parse(cookies || '');
	if (!role?.includes('admin' && 'employee')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}

    let users: MyUserType[] = await getUsers() as MyUserType[];
    let strengthTests: StrengthTestListType[] = await getStrenghtTests() as StrengthTestListType[];
     await Promise.all(strengthTests.map(async (test) => {
        let [clientCompany]: CompanyType[] = await getCompanyById(Number(test.ClientCompanyId)) as CompanyType[];
        test.ClientCompanyId = clientCompany;
        let [employeeCompany]: CompanyType[] = await getCompanyById(Number(test.EmployeeCompanyId)) as CompanyType[];
        test.EmployeeCompanyId = employeeCompany;
        let [testExecutedByUser]: MyUserType[] = await getUserById(Number(test.TestExecutedByUserId)) as MyUserType[];
        test.TestExecutedByUserId = testExecutedByUser;
        let [protocolCreatedByUser]: MyUserType[] = await getUserById(Number(test.ProtocolCreatedByUserId)) as MyUserType[];
        test.ProtocolCreatedByUserId = protocolCreatedByUser;
        let [clientConstructionSite]: ConstructionSiteType[] = await getConstructionSiteById(Number(test.ClientConstructionSiteId)) as ConstructionSiteType[];
        test.ClientConstructionSiteId = clientConstructionSite; }));
    return {
        users,
        strengthTests
    };
}

