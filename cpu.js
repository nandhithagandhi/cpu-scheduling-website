function createTable() {

    let n = Number(document.getElementById("numProcess").value);
    let table = document.getElementById("inputTable");

    let html = `
        <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
        </tr>
    `;

    for (let i = 1; i <= n; i++) {
        html += `
            <tr>
                <td>P${i}</td>
                <td><input type="text" id="at${i}"></td>
                <td><input type="text" id="bt${i}"></td>
                <td><input type="text" id="pr${i}"></td>
            </tr>
        `;
    }

    table.innerHTML = html;
}


function calculateScheduling() {

    let n = Number(document.getElementById("numProcess").value);
    let algo = document.getElementById("Algorithm").value;

    if (!n || n <= 0) {
        alert("Enter number of processes and click Create first");
        return;
    }

    let processes = [];

    for (let i = 1; i <= n; i++) {

        processes.push({
            id: "P" + i,
            arrival: Number(document.getElementById("at" + i).value) || 0,
            burst: Number(document.getElementById("bt" + i).value) || 0,
            priority: Number(document.getElementById("pr" + i).value) || 0
        });
    }

    let currentTime = 0;

    // added for average calculation
    let totalTAT = 0;
    let totalWT = 0;

    let result = `
        <table border="1">
            <tr>
                <th>Process</th>
                <th>Arrival</th>
                <th>Burst</th>
                <th>Completion</th>
                <th>Turnaround</th>
                <th>Waiting</th>
            </tr>
    `;

    let ganttChart = `<div class="gantt-container">`;
    ganttChart += `<div class="time">0</div>`;

    while (processes.length > 0) {

        let available = processes.filter(p => p.arrival <= currentTime);

        if (available.length === 0) {
            currentTime = Math.min(...processes.map(p => p.arrival));
            continue;
        }

        let selected;

        if (algo === "fcfs")
            selected = available.sort((a,b)=>a.arrival-b.arrival)[0];

        else if (algo === "sjf")
            selected = available.sort((a,b)=>a.burst-b.burst)[0];

        else if (algo === "priority")
            selected = available.sort((a,b)=>a.priority-b.priority)[0];

        processes = processes.filter(p => p !== selected);

        let ct = currentTime + selected.burst;
        let tat = ct - selected.arrival;
        let wt = tat - selected.burst;

        // accumulate totals
        totalTAT += tat;
        totalWT += wt;

        result += `
            <tr>
                <td>${selected.id}</td>
                <td>${selected.arrival}</td>
                <td>${selected.burst}</td>
                <td>${ct}</td>
                <td>${tat}</td>
                <td>${wt}</td>
            </tr>
        `;

        ganttChart += `
            <div class="gantt-block">
                <div class="block">${selected.id}</div>
                <div class="time">${ct}</div>
            </div>
        `;

        currentTime = ct;
    }

    result += "</table>";

    //  average calculation
    let avgTAT = (totalTAT / n).toFixed(2);
    let avgWT = (totalWT / n).toFixed(2);

    result += `
        <br>
        <b>Average Turnaround Time :</b> ${avgTAT} ms<br>
        <b>Average Waiting Time :</b> ${avgWT} ms
    `;

    ganttChart += "</div>";

    document.getElementById("output").innerHTML = result;
    document.getElementById("gantt").innerHTML = ganttChart;
}


function onlyNumber(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}
