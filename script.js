/* To get data from excel file */

document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = 'Sheet1'; // specify the worksheet name
        const firstSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        displayResults(jsonData);
    };

    reader.readAsArrayBuffer(file);
});

function displayResults(locations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    locations.forEach(location => {
        const locationElement = document.createElement('div');
        locationElement.classList.add('restaurant');
        locationElement.textContent = `${location.Name}, ${location.Address}`;

        const detailsElement = document.createElement('div');
        detailsElement.classList.add('details');
        detailsElement.textContent = `Zone: ${location.Zone}, Capacity: ${location.Capacity}, Cost: ${location.Cost}`;

        locationElement.appendChild(detailsElement);
        resultsDiv.appendChild(locationElement);
    });
}
