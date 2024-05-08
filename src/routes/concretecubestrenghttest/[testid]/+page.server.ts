import { error } from "@sveltejs/kit";
import { parse } from "cookie";
import type { StrengthTestListType } from '$lib/server/db/tables/strengthtest/StrengthTestType';
import { getStrengthTestById } from '$lib/server/db/tables/strengthtest/StrengthTest';
import type { PageServerLoad } from './$types';
import type { CompanyType } from "$lib/server/db/tables/company/CompanyType";
import type { MyUserType } from "$lib/server/db/tables/user/UserType";
import type { ConstructionSiteType } from "$lib/server/db/tables/constructionsite/ConstructionSiteType";
import { getCompanyById } from "$lib/server/db/tables/company/Company";
import { getUserById } from "$lib/server/db/tables/user/User";
import { getConstructionSiteById } from "$lib/server/db/tables/constructionsite/ConstructionSite";
import type { StrengthTestDataType } from "$lib/server/db/tables/strengthtestdata/StrengthTestDataType";
import { getStrengthTestDataByStrengthTestId } from "$lib/server/db/tables/strengthtestdata/StrengthTestData";
import type { crossSectionalDimensionsType } from "$lib/server/db/tables/crosssectionaldimensions/CrossSectionalDimensionsType.js";
import { getCrossSectionalDimensionsByConcreteCubeStrenghtTestDataId } from "$lib/server/db/tables/crosssectionaldimensions/CrossSectionalDimensions";

export const load = async ({ request, depends, params }) => {
	depends('template:load');   
    const cookies = request.headers.get('cookie');
     const { role, user_id, name, company_id } = parse(cookies || '');
	if (!role?.includes('admin' && 'employee')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}
	const testid = parseInt(params.testid);
	
	let [strengthTest]: StrengthTestListType[] = await getStrengthTestById(testid) as StrengthTestListType;
	let [clientCompany]: CompanyType[] = await getCompanyById(Number(strengthTest.ClientCompanyId)) as CompanyType[];
	strengthTest.ClientCompanyId = clientCompany;
	let [employeeCompany]: CompanyType[] = await getCompanyById(Number(strengthTest.EmployeeCompanyId)) as CompanyType[];
	strengthTest.EmployeeCompanyId = employeeCompany;
	let [testExecutedByUser]: MyUserType[] = await getUserById(Number(strengthTest.TestExecutedByUserId)) as MyUserType[];
	strengthTest.TestExecutedByUserId = testExecutedByUser;
	let [protocolCreatedByUser]: MyUserType[] = await getUserById(Number(strengthTest.ProtocolCreatedByUserId)) as MyUserType[];
	strengthTest.ProtocolCreatedByUserId = protocolCreatedByUser;
	let [clientConstructionSite]: ConstructionSiteType[] = await getConstructionSiteById(Number(strengthTest.ClientConstructionSiteId)) as ConstructionSiteType[];
	strengthTest.ClientConstructionSiteId = clientConstructionSite;
	let strengthTestData: StrengthTestDataType[]  = await getStrengthTestDataByStrengthTestId(strengthTest.Id) as StrengthTestDataType[];
	//console.log("*********TESTDATA***********",strengthTestData);
	let crossSectionalDimensions: crossSectionalDimensionsType[][] = [];
	for (let data of strengthTestData) {
		let temp: crossSectionalDimensionsType[] = await getCrossSectionalDimensionsByConcreteCubeStrenghtTestDataId(data.Id) as crossSectionalDimensionsType[];
		crossSectionalDimensions.push(temp);
	}
	console.log("*********CROSSDATA***********",crossSectionalDimensions);
    return {
        strengthTest,
		strengthTestData,
		crossSectionalDimensions
    };

}
// export const load = (({ params, locals }) => {
// 	const albumId = parseInt(params.albumId);

// 	if (!albumId) {
// 		throw error(404, 'Album not found');
// 	}

// 	const album = getAlbumById(albumId);

// 	if (!album) {
// 		throw error(404, 'Album not found');
// 	}

// 	const tracks = getAlbumTracks(albumId);

// 	return {
// 		album,
// 		tracks,
// 		isAdmin: locals?.roles?.includes('admin')
// 	};
// }) satisfies PageServerLoad;