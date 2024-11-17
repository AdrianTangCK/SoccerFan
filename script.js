document.addEventListener('DOMContentLoaded', () => {
    const screeningsBody = document.getElementById('screenings-body');
    const zoneFilter = document.getElementById('zone-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const priceMaxFilter = document.getElementById('price-max-filter');

    let screeningsData = [];

    // Load and display data from Excel file
    fetch('screenings.xlsx') // Ensure screenings.xlsx is available in the root folder
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            screeningsData = jsonData; // Save the raw data for filtering
            displayScreenings(screeningsData);
        });

    // Function to display screenings in the table
    function displayScreenings(screenings) {
        screeningsBody.innerHTML = ''; // Clear existing data

        screenings.forEach((screening) => {
            const tr = document.createElement('tr');

            // Location
            const locationTd = document.createElement('td');
            locationTd.textContent = screening.Location; // Ensure the Excel column is named "Location"
            tr.appendChild(locationTd);

            // Address
            const addressTd = document.createElement('td');
            addressTd.textContent = screening.Address;
            tr.appendChild(addressTd);

            // Zone
            const zoneTd = document.createElement('td');
            zoneTd.textContent = screening.Zone;
            tr.appendChild(zoneTd);

            // Capacity
            const capacityTd = document.createElement('td');
            capacityTd.textContent = screening.Capacity;
            capacityTd.style.textAlign = 'center';
            tr.appendChild(capacityTd);

            // Estimated Price Per Pax (SGD)
            const priceTd = document.createElement('td');
            priceTd.textContent = screening["Est. Price Per Pax (SGD)"];
            priceTd.style.textAlign = 'center';
            tr.appendChild(priceTd);

            screeningsBody.appendChild(tr);
        });
    }

    // Function to apply filters
    window.applyFilters = function () {
        const selectedZone = zoneFilter.value;
        const minCapacity = parseInt(capacityFilter.value, 10) || 0;
        const maxPrice = parseFloat(priceMaxFilter.value) || Infinity;

        const filteredData = screeningsData.filter((screening) => {
            const capacity = parseInt(screening.Capacity, 10) || 0;
            const price = parseFloat(screening["Est. Price Per Pax (SGD)"]) || 0;

            return (
                (selectedZone === '' || screening.Zone === selectedZone) &&
                capacity >= minCapacity &&
                price <= maxPrice
            );
        });

        displayScreenings(filteredData);
    };

    // Function to reset filters
    window.resetFilters = function () {
        zoneFilter.value = '';
        capacityFilter.value = '';
        priceMaxFilter.value = '';
        displayScreenings(screeningsData);
    };

    // Function to sort table by column
    window.sortTable = function (columnIndex) {
        const tableRows = Array.from(screeningsBody.rows);

        const isNumeric = columnIndex >= 3; // Assume columns 3 and 4 are numeric (Capacity, Price)
        const sortedRows = tableRows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();

            return isNumeric
                ? parseFloat(aText) - parseFloat(bText)
                : aText.localeCompare(bText);
        });

        screeningsBody.innerHTML = ''; // Clear table body
        sortedRows.forEach((row) => screeningsBody.appendChild(row));
    };
});
