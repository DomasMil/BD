export type StrengthTestType = {
    Id:            number,
    TestProtocolNumber: string,
    ClientCompanyId: number,
    EmployeeCompanyId: number,
    TestExecutionDate: Date,
    TestSamplesReceivedDate: Date,
    TestSamplesDeliveredBy: string,
    TestSamplesReceivedComment: string,
    TestSamplesReceivedCount: number,
    TestExecutedByUserId: number,
    ProtocolCreatedByUserId: number,
    TestType: string,
    ConcreteType: string,
    AcceptedSampleCount: number,
    RejectedSampleCount: number,
    AverageCrushForce: number,
    StandardDeviation: number,
    CharacteristicStrength: number,
    ConcreteRating: string,
    ClientConstructionSiteId: number,
}
