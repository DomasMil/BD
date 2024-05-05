import { pool } from '../../index';
import {findUserByUsername} from '../user/User'


export async function getStrenghtTests() {
    const [result] = await pool.query('SELECT * FROM strength_test')
	console.log(result)
    return result
}

export async function createStrengthTest(clientCompany: number, companyConstructionSite: number, receivedDate: Date, deliveredBy: String, sampleReceivedComment: string, sampleCount: number, testType: string, acceptedSampleCount: number, rejectedSampleCount: number, concreteType: string, testExecutionDate: Date, testExecutorId: Number, testExecutorCompanyId: Number) {
    //console.log("***************TESTEXECUTOR****************", testExecutorId)
    try {
        //console.log("***************INSERTED DATA****************", clientCompany, companyConstructionSite, testExecutorCompanyId, testExecutorId, testExecutorId)
        const [result]: any[] = await pool.query("INSERT INTO strength_test (ClientCompanyId, ClientConstructionSiteId, EmployeeCompanyId, TestExecutedByUserId, ProtocolCreatedByUserId, TestSamplesReceivedDate, TestSamplesDeliveredBy, TestSamplesReceivedComment, TestSamplesReceivedCount, TestType, AcceptedSampleCount, RejectedSampleCount, ConcreteType, TestExecutionDate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [clientCompany, companyConstructionSite, testExecutorCompanyId, testExecutorId, testExecutorId, receivedDate, deliveredBy, sampleReceivedComment, sampleCount, testType, acceptedSampleCount, rejectedSampleCount, concreteType, testExecutionDate]);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Construction site already exists.');
        } else {
            throw new Error('Error creating construction site.');
        }
    }
}