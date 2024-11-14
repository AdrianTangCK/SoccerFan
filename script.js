/* To get data from excel file */

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('screenings-body');

    // Load and parse the Excel file
    fetch('screenings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            displayData(jsonData);
        });

    // Function to display data in table
    function displayData(data) {
        // Skip the header row (first row)
        data.slice(1).forEach(row => {
            const tr = document.createElement('tr');

            const locationName = document.createElement('td');
            locationName.textContent = row[0] || '';
            tr.appendChild(locationName);

            const address = document.createElement('td');
            address.textContent = row[1] || '';
            tr.appendChild(address);

            const zone = document.createElement('td');
            zone.textContent = row[2] || '';
            tr.appendChild(zone);

            const capacity = document.createElement('td');
            capacity.textContent = row[3] || '';
            tr.appendChild(capacity);

            const cost = document.createElement('td');
            cost.textContent = row[4] || '';
            tr.appendChild(cost);

            tableBody.appendChild(tr);
        });
    }
});
