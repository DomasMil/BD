<script lang="ts">
	import type { PageData } from './$types';
    import { page } from '$app/stores';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';
	import type { StrengthTestListType } from '$lib/server/db/tables/strengthtest/StrengthTestType';
    import { goto } from '$app/navigation';
	import type { Page } from '@sveltejs/kit';
	import type { StrengthTestDataType } from '$lib/server/db/tables/strengthtestdata/StrengthTestDataType';
	import type { crossSectionalDimensionsType } from '$lib/server/db/tables/crosssectionaldimensions/CrossSectionalDimensionsType';

    export let data: PageData;
    
    let strengthTest: StrengthTestListType;
    let strengthTestData: StrengthTestDataType[];
    let crossSectionalDimensions: crossSectionalDimensionsType[][];

    $: if (strengthTest == null) {
    strengthTest = data.strengthTest;
}
    $: if (strengthTestData == null) {
        strengthTestData = data.strengthTestData;
}
    $: if (crossSectionalDimensions == null) {
        crossSectionalDimensions = data.crossSectionalDimensions;
}
</script>



<main>
    <h2>Strength Test Data</h2>
    <p>Id: {strengthTest.Id}</p>
    <p>Test Protocol Number: {strengthTest.TestProtocolNumber}</p>
    <h3>Client Company</h3>
    <p>Id: {strengthTest.ClientCompanyId.Id}</p>
    <p>Name: {strengthTest.ClientCompanyId.Name}</p>
    <p>Address: {strengthTest.ClientCompanyId.Address}</p>
    <p>Company Code: {strengthTest.ClientCompanyId.CompanyCode}</p>
    <h3>Employee Company</h3>
    <p>Id: {strengthTest.EmployeeCompanyId.Id}</p>
    <p>Name: {strengthTest.EmployeeCompanyId.Name}</p>
    <p>Address: {strengthTest.EmployeeCompanyId.Address}</p>
    <p>Company Code: {strengthTest.EmployeeCompanyId.CompanyCode}</p>
    <p>Test Execution Date: {strengthTest.TestExecutionDate}</p>
    <p>Test Samples Received Date: {strengthTest.TestSamplesReceivedDate}</p>
    <p>Test Samples Delivered By: {strengthTest.TestSamplesDeliveredBy}</p>
    <p>Test Samples Received Comment: {strengthTest.TestSamplesReceivedComment}</p>
    <p>Test Samples Received Count: {strengthTest.TestSamplesReceivedCount}</p>
    <h3>Test Executed By User</h3>
    <p>Id: {strengthTest.TestExecutedByUserId.id}</p>
    <p>Username: {strengthTest.TestExecutedByUserId.username}</p>
    <p>Email: {strengthTest.TestExecutedByUserId.email}</p>
    <p>Name: {strengthTest.TestExecutedByUserId.name}</p>
    <p>Role: {strengthTest.TestExecutedByUserId.role}</p>
    <h3>Protocol Created By User</h3>
    <p>Id: {strengthTest.ProtocolCreatedByUserId.id}</p>
    <p>Username: {strengthTest.ProtocolCreatedByUserId.username}</p>
    <p>Email: {strengthTest.ProtocolCreatedByUserId.email}</p>
    <p>Name: {strengthTest.ProtocolCreatedByUserId.name}</p>
    <p>Role: {strengthTest.ProtocolCreatedByUserId.role}</p>
    <p>Test Type: {strengthTest.TestType}</p>
    <p>Concrete Type: {strengthTest.ConcreteType}</p>
    <p>Accepted Sample Count: {strengthTest.AcceptedSampleCount}</p>
    <p>Rejected Sample Count: {strengthTest.RejectedSampleCount}</p>
    <p>Average Crush Force: {strengthTest.AverageCrushForce}</p>
    <p>Standard Deviation: {strengthTest.StandardDeviation}</p>
    <p>Characteristic Strength: {strengthTest.CharacteristicStrenght}</p>
    <p>Concrete Rating: {strengthTest.ConcreteRating}</p>
    <h3>Client Construction Site</h3>
    <p>Id: {strengthTest.ClientConstructionSiteId.Id}</p>
    <p>Company Id: {strengthTest.ClientConstructionSiteId.CompanyId}</p>
    <p>Name: {strengthTest.ClientConstructionSiteId.Name}</p>
    <p>Address: {strengthTest.ClientConstructionSiteId.Address}</p>

    <h2>Strength Test Data</h2>
    {#each strengthTestData as data, i}
        <div>
            <p>Id: {data.Id}</p>
            <p>ConcreteCubeStrengthTestId: {data.ConcreteCubeStrengthTestId}</p>
            <p>Comment: {data.Comment}</p>
            <p>DestructivePower: {data.DestructivePower}</p>
            <p>CrushingStrength: {data.CrushingStrength}</p>
        </div>
    {/each}

    <h2>Cross Sectional Dimensions</h2>
    {#each crossSectionalDimensions as dimensions, i}
        {#each dimensions as dimension, j}
            <div>
                <p>Id: {dimension.Id}</p>
                <p>ConcreteCubeStrenghtTestDataId: {dimension.ConcreteCubeStrenghtTestDataId}</p>
                <p>Dimension: {dimension.Dimension}</p>
                <p>Value: {dimension.Value}</p>
            </div>
        {/each}
    {/each}
</main>
