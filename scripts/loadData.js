function downloadLocalStorage() {
    const data = {};

    // percorre todas as chaves
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }

    // transforma em JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

    // cria link temporário p/ download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "localStorage.json";
    a.click();
}


function uploadLocalStorage(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = JSON.parse(event.target.result);

        // restaura no localStorage
        for (const key in data) {
            localStorage.setItem(key, data[key]);
        }

        // recarrega a página para aplicar
        location.reload();
    };
    reader.readAsText(file);
}
