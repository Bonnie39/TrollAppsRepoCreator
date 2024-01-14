let appCount = 0;

function addApp() {
    appCount++;
    const appsContainer = document.getElementById('appsContainer');

    const appDiv = document.createElement('div');
    appDiv.classList.add('app');
    appDiv.innerHTML = `
        <h2>App ${appCount}</h2>

        <label for="appName${appCount}">App Name:</label>
        <input type="text" class="appName">

        <label for="appBundleIdentifier${appCount}">Bundle Identifier:</label>
        <input type="text" class="appBundleIdentifier">

        <!-- Add other app information fields -->

        <label for="appIconURL${appCount}">App Icon URL:</label>
        <input type="text" class="appIconURL">

        <label for="appTintColor${appCount}">App Tint Color:</label>
        <input type="text" class="appTintColor">

        <button class="addVersionBtn">+ Add Version</button>

        <div class="versionsContainer"></div>
    `;

    appsContainer.appendChild(appDiv);
}

function addVersion(event) {
    const button = event.target;
    const appDiv = button.closest('.app');

    if (!appDiv) {
        console.error('App element not found');
        return;
    }

    const versionsContainer = appDiv.querySelector('.versionsContainer');
    const versionCount = versionsContainer.childElementCount + 1;

    const versionDiv = document.createElement('div');
    versionDiv.innerHTML = `
        <h3>Version ${versionCount}</h3>

        <label for="appVersion">Version:</label>
        <input type="text" class="appVersion">

        <!-- Add other version information fields -->

        <label for="appDownloadURL">Download URL:</label>
        <input type="text" class="appDownloadURL">

        <label for="appSize">Size:</label>
        <input type="text" class="appSize">
    `;

    versionsContainer.appendChild(versionDiv);
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('addVersionBtn')) {
        addVersion(event);
    }
});


function generateRepo() {
    const repoName = document.getElementById('repoName').value;

    if (!repoName) {
        console.error("Repo Name is required!");
        return;
    }

    const appsContainer = document.getElementById('appsContainer');
    const appDivs = appsContainer.querySelectorAll('.app');
    
    const repoJSON = {
        "name": repoName,
        "apps": []
    };

    appDivs.forEach((appDiv) => {
        const appName = appDiv.querySelector('.appName').value;
        const appBundleIdentifier = appDiv.querySelector('.appBundleIdentifier').value;
        const appIconURL = appDiv.querySelector('.appIconURL').value;
        const appTintColor = appDiv.querySelector('.appTintColor').value;

        const versionsContainer = appDiv.querySelector('.versionsContainer');
        const versionDivs = versionsContainer.querySelectorAll('div');

        const appObj = {
            "name": appName,
            "bundleIdentifier": appBundleIdentifier,
            "iconURL": appIconURL,
            "tintColor": appTintColor,
            "versions": []
        };

        versionDivs.forEach((versionDiv) => {
            const appVersion = versionDiv.querySelector('.appVersion').value;
            const appDownloadURL = versionDiv.querySelector('.appDownloadURL').value;
            const appSize = versionDiv.querySelector('.appSize').value;

            const versionObj = {
                "version": appVersion,
                "downloadURL": appDownloadURL,
                "size": appSize
            };

            appObj.versions.push(versionObj);
        });

        repoJSON.apps.push(appObj);
    });

    // Log or do something with the generated JSON
    console.log(JSON.stringify(repoJSON, null, 2));
}
