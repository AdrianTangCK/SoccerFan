/* To get data from excel file */

// Simulated Excel data in CSV format
const excelData = `
Name,Address,Zone,Capacity,Cost,IsShowingFootball
Restaurant A,123 Main St,Zone 1,50,30,Yes
Restaurant B,456 Orchard Rd,Zone 2,100,50,No
Restaurant C,789 Marina Bay,Zone 3,75,40,Yes
`;

function readExcelData(data) {
    const workbook = XLSX.read(data, { type: 'string' });
    const sheetName = 'Sheet1'; // Specify the worksheet name
    const firstSheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    displayResults(jsonData);
}

function displayResults(locations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    locations.forEach(location => {
        if (location.IsShowingFootball === 'Yes') {
            const locationElement = document.createElement('div');
            locationElement.classList.add('restaurant');
            locationElement.textContent = `${location.Name}, ${location.Address}`;

            const detailsElement = document.createElement('div');
            detailsElement.classList.add('details');
            detailsElement.textContent = `Zone: ${location.Zone}, Capacity: ${location.Capacity}, Cost: ${location.Cost}`;

            locationElement.appendChild(detailsElement);
            resultsDiv.appendChild(locationElement);
        }
    });
}

// Convert CSV to a format that SheetJS can read
const workbook = XLSX.read(excelData, { type: 'string' });
readExcelData(workbook);


/*
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
*/