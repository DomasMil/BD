import type { PageServerLoad } from '../$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import type { CompanyType } from '$lib/server/db/tables/company/CompanyType';
import { getUsers } from '$lib/server/db/tables/user/User';
import { getCompanies } from '$lib/server/db/tables/company/Company';
import { getConstructionSites } from '$lib/server/db/tables/constructionsite/ConstructionSite';
import type { ConstructionSiteType } from '$lib/server/db/tables/constructionsite/ConstructionSiteType';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { createStrengthTest } from '$lib/server/db/tables/strengthtest/StrengthTest';
import { parse } from 'cookie';

export const load = (({ request, depends }) => {
    let users: MyUserType[] = getUsers();
    let companies: CompanyType[] = getCompanies();
    let constructionSites: ConstructionSiteType[] = getConstructionSites();

    return {
        users,
        companies,
        constructionSites
    };
}) satisfies PageServerLoad;

export const actions: Actions = {

    addStrengthTest: async ({ request, cookies }) => {
        const data = await request.formData();
        console.log("***************DATA****************", data)
        const clientCompany = data.get('clientCompany')?.toString();
        const companyConstructionSite = data.get('companyConstructionSite')?.toString();
        const receivedDate = data.get('receivedDate')?.toString();
        const deliveredBy = data.get('deliveredBy')?.toString();
        const sampleReceivedComment = data.get('sampleReceivedComment')?.toString();
        const sampleCount = data.get('sampleCount')?.toString();
        const testType = data.get('testType')?.toString();
        const acceptedSampleCount = data.get('acceptedSampleCount')?.toString();
        const rejectedSampleCount = data.get('rejectedSampleCount')?.toString();
        const concreteType = data.get('concreteType')?.toString();
        const testExecutionDate = data.get('testExecutionDate')?.toString();
        const testExecutorId = data.get('testExecutorId')?.toString();
        const testExecutorCompanyId = data.get('testExecutorCompanyId')?.toString();

        // let parsedData: { [key: string]: any } = {};

        // for (let entry of data.entries()) {
        //     const nameParts = entry[0].split('-');
        //     const category = nameParts[0];
        //     const index = nameParts[1];
        //     const subIndex = nameParts[2] || null;

        //     if (!parsedData[index]) {
        //         parsedData[index] = {};
        //     }

        //     if (subIndex) {
        //         if (!parsedData[index][category]) {
        //             parsedData[index][category] = {};
        //         }
        //         parsedData[index][category][subIndex] = entry[1];
        //     } else {
        //         parsedData[index][category] = entry[1];
        //     }
        // }

// let parsedData: { [key: string]: any } = {};

// for (let entry of data) {
//     const name = entry[0];
//     const value = entry[1];

//     // Filter out unwanted entries
//     if (!name.startsWith('skerspjūvio') && !name.startsWith('ardancioji') && !name.startsWith('stipris') && !name.startsWith('pastabos')) {
//         continue;
//     }

//     const nameParts = name.split('-');
//     const category = nameParts[0];
//     const index = nameParts[1];
//     const subIndex = nameParts[2] || null;

//     if (!parsedData[index]) {
//         parsedData[index] = {};
//     }

//     if (subIndex) {
//         if (!parsedData[index][category]) {
//             parsedData[index][category] = {};
//         }
//         parsedData[index][category][subIndex] = value;
//     } else {
//         parsedData[index][category] = value;
//     }
// }

let parsedData: { [key: string]: any } = {};

for (let entry of data) {
    const name = entry[0];
    const value = entry[1];

    // Filter out unwanted entries
    if (!name.startsWith('skerspjūvio') && !name.startsWith('ardancioji') && !name.startsWith('stipris') && !name.startsWith('pastabos')) {
        continue;
    }

    const nameParts = name.split('-');
    const category = nameParts[0];
    const index = nameParts[1];
    const subIndex = nameParts[2] || null;
    const subSubIndex = nameParts[3] || null;

    if (!parsedData[index]) {
        parsedData[index] = {};
    }

    if (subSubIndex) {
        if (!parsedData[index][category]) {
            parsedData[index][category] = {};
        }
        if (!parsedData[index][category][subIndex]) {
            parsedData[index][category][subIndex] = {};
        }
        parsedData[index][category][subIndex][subSubIndex] = value;
    } else if (subIndex) {
        if (!parsedData[index][category]) {
            parsedData[index][category] = {};
        }
        parsedData[index][category][subIndex] = value;
    } else {
        parsedData[index][category] = value;
    }
}

let flattenedData = [];

for (let index in parsedData) {
    for (let category in parsedData[index]) {
        if (typeof parsedData[index][category] === 'object') {
            for (let subIndex in parsedData[index][category]) {
                if (typeof parsedData[index][category][subIndex] === 'object') {
                    for (let subSubIndex in parsedData[index][category][subIndex]) {
                        let value = parsedData[index][category][subIndex][subSubIndex];
                        let name = `${category}-${index}-${subIndex}-${subSubIndex}`;
                        flattenedData.push({ name, value });
                    }
                } else {
                    let value = parsedData[index][category][subIndex];
                    let name = `${category}-${index}-${subIndex}`;
                    flattenedData.push({ name, value });
                }
            }
        } else {
            let value = parsedData[index][category];
            let name = `${category}-${index}`;
            flattenedData.push({ name, value });
        }
    }
}

let data0 = [];
let data1 = [];
let data2 = [];

for (let index in parsedData) {
    if (index === 'a' || index === 'b') {
        for (let subIndex in parsedData[index]['skerspjūvio']) {
            for (let subSubIndex in parsedData[index]['skerspjūvio'][subIndex]) {
                let value = parsedData[index]['skerspjūvio'][subIndex][subSubIndex];
                let name = `skerspjūvio-${index}-${subIndex}-${subSubIndex}`;
                switch(subIndex) {
                    case '0':
                        data0.push({ name, value });
                        break;
                    case '1':
                        data1.push({ name, value });
                        break;
                    case '2':
                        data2.push({ name, value });
                        break;
                }
            }
        }
    } else {
        for (let category in parsedData[index]) {
            let value = parsedData[index][category];
            let name = `${category}-${index}`;
            switch(index) {
                case '0':
                    data0.push({ name, value });
                    break;
                case '1':
                    data1.push({ name, value });
                    break;
                case '2':
                    data2.push({ name, value });
                    break;
            }
        }
    }
}

console.log("***************PARSEDTABLE1****************",JSON.stringify(data0, null, 2));
console.log("***************PARSEDTABLEEND****************");
console.log("***************PARSEDTABLE2****************",JSON.stringify(data1, null, 2));
console.log("***************PARSEDTABLEEND****************");
console.log("***************PARSEDTABLE3****************",JSON.stringify(data2, null, 2));
console.log("***************PARSEDTABLEEND****************");




        //console.log("***************PARSEDTABLE****************",JSON.stringify(flattenedData, null, 2));
        //console.log("***************PARSEDTABLEEND****************");

        //console.log("***************PIRMASDATE****************", receivedDate)
        if (clientCompany && companyConstructionSite && receivedDate && deliveredBy && sampleReceivedComment && sampleCount && testType && acceptedSampleCount && rejectedSampleCount && concreteType && testExecutionDate && testExecutorId && testExecutorCompanyId) {
            //console.log("***************ANTRASDATE****************", receivedDate)
            //createStrengthTest(Number(clientCompany), Number(companyConstructionSite), new Date(receivedDate), deliveredBy, sampleReceivedComment, Number(sampleCount), testType, Number(acceptedSampleCount), Number(rejectedSampleCount), concreteType, new Date(testExecutionDate), Number(testExecutorId), Number(testExecutorCompanyId));

            throw redirect(303, '/addconcretecubestrenghttest?addsuccess');
        } else {
            return fail(400, { errorMessage: 'Missing information' });
        }
    },

}