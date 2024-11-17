document.addEventListener('DOMContentLoaded', () => {
    const screeningsBody = document.getElementById('screenings-body');
    const fixturesList = document.getElementById('fixtures-list');
    const zoneFilter = document.getElementById('zone-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const priceMaxFilter = document.getElementById('price-max-filter');

    let screeningsData = [];
    let fixturesData = [];
    let currentSortedColumn = null;
    let currentSortDirection = null; // 'asc' or 'desc'

    // Load screenings data from Excel
    fetch('screenings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            screeningsData = jsonData; // Save the raw data for filtering
            displayScreenings(screeningsData);
        });

    // Load fixtures data from Excel
    fetch('fixtures.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            fixturesData = jsonData; // Save fixtures data
            displayUpcomingFixtures(fixturesData);
        });

    // Function to display screenings in the table
    function displayScreenings(screenings) {
        screeningsBody.innerHTML = ''; // Clear existing data

        screenings.forEach((screening) => {
            const tr = document.createElement('tr');

            // Location
            const locationTd = document.createElement('td');
            const locationLink = document.createElement('a');
            locationLink.textContent = screening.Location;
            // Construct Google Maps query with location name
            locationLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(screening.Location + ', Singapore')}`;
            locationLink.target = "_blank"; // Open in a new tab
            locationLink.style.color = "#1d3557";
            locationLink.style.textDecoration = "underline";
            locationTd.appendChild(locationLink);
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
            capacityTd.textContent = screening.Capacity || 'N/A';
            capacityTd.style.textAlign = 'center';
            tr.appendChild(capacityTd);

            // Price
            const priceTd = document.createElement('td');
            const price = parseFloat(screening["Est. Price Per Pax (SGD)"]);
            priceTd.textContent = price === 0 ? 'Free' : price || 'N/A';
            priceTd.style.textAlign = 'center';
            tr.appendChild(priceTd);

            screeningsBody.appendChild(tr);
        });
    }

    // Function to display upcoming fixtures in the list
    function displayUpcomingFixtures(fixtures) {
        fixturesList.innerHTML = ''; // Clear existing data

        const today = new Date();
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);

        const filteredFixtures = fixtures.filter(fixture => {
            const fixtureDate = new Date(fixture.Date);
            return fixtureDate >= today && fixtureDate <= next7Days;
        });

        if (filteredFixtures.length === 0) {
            const noFixturesMessage = document.createElement('li');
            noFixturesMessage.textContent = 'No upcoming fixtures in the next 7 days.';
            noFixturesMessage.style.color = '#6c757d';
            fixturesList.appendChild(noFixturesMessage);
            return;
        }

        filteredFixtures.forEach(fixture => {
            const listItem = document.createElement('li');

            const date = new Date(`${fixture.Date} ${fixture.Time}`);
            const formattedDate = date.toLocaleDateString('en-SG', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric', // Include the year
            });
            const formattedTime = date.toLocaleTimeString('en-SG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // AM/PM format
            });

            const dateSpan = document.createElement('span');
            dateSpan.textContent = `${formattedDate}, ${formattedTime}`; // Full format
            dateSpan.classList.add('fixture-date');

            const eventSpan = document.createElement('span');
            eventSpan.textContent = fixture.Fixture;
            eventSpan.classList.add('fixture-event');

            const channelSpan = document.createElement('span');
            channelSpan.textContent = fixture.Channel;
            channelSpan.classList.add('fixture-channel');

            listItem.appendChild(dateSpan);
            listItem.appendChild(eventSpan);
            listItem.appendChild(channelSpan);

            fixturesList.appendChild(listItem);
        });
    }

    // Function to apply filters
    window.applyFilters = function () {
        const selectedZone = zoneFilter.value;
        const minCapacity = parseInt(capacityFilter.value, 10) || 0;
        const maxPrice = parseFloat(priceMaxFilter.value) || Infinity;

        const filteredData = screeningsData.filter(screening => {
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

        const isNumeric = columnIndex >= 3; // Capacity and Price are numeric
        let sortDirection = 'asc';
        if (currentSortedColumn === columnIndex && currentSortDirection === 'asc') {
            sortDirection = 'desc';
        }

        const sortedRows = tableRows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();

            return isNumeric
                ? (sortDirection === 'asc'
                    ? parseFloat(aText) - parseFloat(bText)
                    : parseFloat(bText) - parseFloat(aText))
                : (sortDirection === 'asc'
                    ? aText.localeCompare(bText)
                    : bText.localeCompare(aText));
        });

        screeningsBody.innerHTML = '';
        sortedRows.forEach(row => screeningsBody.appendChild(row));

        updateSortIcons(columnIndex, sortDirection);
        currentSortedColumn = columnIndex;
        currentSortDirection = sortDirection;
    };

    // Function to update sorting icons
    function updateSortIcons(columnIndex, sortDirection) {
        for (let i = 0; i < 5; i++) {
            const icon = document.getElementById(`sort-icon-${i}`);
            if (icon) {
                icon.textContent = '';
            }
        }

        const activeIcon = document.getElementById(`sort-icon-${columnIndex}`);
        if (activeIcon) {
            activeIcon.textContent = sortDirection === 'asc' ? '▲' : '▼';
        }
    }
});
