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

async function createPDF() {
        try {
            const response = await fetch('/api/pdf', {
                method: 'GET',
                headers: {
                    Accept: 'application/pdf'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Handle the binary data of the PDF
            const blob = await response.blob();
            console.log(blob);
            // Create a URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'default-filename.pdf'; // Default filename if none is specified
            if (contentDisposition) {
                const matches = /filename="([^"]+)"/.exec(contentDisposition);
                console.log(matches);
                if (matches && matches.length > 1) {
                    filename = matches[1]; // Extract filename if available
                }
            }

            // Create a link element to download the blob
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename; // You can specify a default filename for the download here

            // Append the link to the body, click it, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optional: Release the object URL
            window.URL.revokeObjectURL(blobUrl);

            // alert('PDF downloaded successfully!');
        } catch (error) {
            console.error('Error creating PDF:', error);
            // alert('Failed to create PDF');
        }
    }

</script>



<main>
    <td>
        <button
      type="button"
      class="button is-small is-info"
      on:click={() => {
          console.log('alo');
          createPDF();
      }}
  >
      {'Atsisiųsti duomenis'}</button
  >
    </td>
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
