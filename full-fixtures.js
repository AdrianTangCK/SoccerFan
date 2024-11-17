document.addEventListener('DOMContentLoaded', () => {
    const fixturesBody = document.getElementById('fixtures-body');
    const eplDisclaimer = document.querySelector('.epl-disclaimer');

    // Initially hide the disclaimer
    eplDisclaimer.style.display = 'none';

    // Load and display the full fixtures from the Excel file
    fetch('fixtures.xlsx') // Ensure fixtures.xlsx is available in the root folder
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            displayFullFixtures(jsonData);
        });

    // Function to format the date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-SG', {
            weekday: 'short', // e.g., Sat
            day: '2-digit',   // e.g., 23
            month: 'short',   // e.g., Nov
            year: 'numeric',  // e.g., 2024
        });
    }

    // Function to display the full fixtures
    function displayFullFixtures(fixtures) {
        fixturesBody.innerHTML = ''; // Clear existing data

        if (fixtures.length === 0) {
            const noFixturesMessage = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '4');
            td.textContent = 'No fixtures available.';
            td.style.textAlign = 'center';
            td.style.color = '#6c757d';
            noFixturesMessage.appendChild(td);
            fixturesBody.appendChild(noFixturesMessage);

            // Hide disclaimer if no fixtures are available
            eplDisclaimer.style.display = 'none';
            return;
        }

        fixtures.forEach((fixture) => {
            const tr = document.createElement('tr');

            // Date
            const dateTd = document.createElement('td');
            dateTd.textContent = formatDate(fixture.Date); // Format the date
            tr.appendChild(dateTd);

            // Time
            const timeTd = document.createElement('td');
            timeTd.textContent = fixture.Time || 'N/A';
            tr.appendChild(timeTd);

            // Fixture
            const fixtureTd = document.createElement('td');
            fixtureTd.textContent = fixture.Fixture || 'N/A';
            tr.appendChild(fixtureTd);

            // Channel
            const channelTd = document.createElement('td');
            channelTd.textContent = fixture.Channel || 'N/A';
            tr.appendChild(channelTd);

            fixturesBody.appendChild(tr);
        });

        // Show disclaimer if fixtures are displayed
        eplDisclaimer.style.display = 'block';
    }
});
