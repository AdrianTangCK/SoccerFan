document.addEventListener('DOMContentLoaded', () => {
    const fixturesBody = document.getElementById('fixtures-body');

    // Load and display the full fixtures from the Excel file
    fetch('fixtures.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract and display full fixtures
            const fullFixtures = jsonData.slice(1).map(row => ({
                date: row[0], // Date column
                time: row[1], // Time column
                fixture: row[2], // Fixture column
                channel: row[3] // Channel column
            }));

            displayFullFixtures(fullFixtures);
        });

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
            return;
        }

        fixtures.forEach(fixture => {
            const tr = document.createElement('tr');

            const dateTd = document.createElement('td');
            dateTd.textContent = fixture.date;
            tr.appendChild(dateTd);

            const timeTd = document.createElement('td');
            timeTd.textContent = fixture.time;
            tr.appendChild(timeTd);

            const fixtureTd = document.createElement('td');
            fixtureTd.textContent = fixture.fixture;
            tr.appendChild(fixtureTd);

            const channelTd = document.createElement('td');
            channelTd.textContent = fixture.channel;
            tr.appendChild(channelTd);

            fixturesBody.appendChild(tr);
        });
    }
});
