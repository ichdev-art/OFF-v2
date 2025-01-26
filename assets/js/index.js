let params = new URLSearchParams(document.location.search)
let idProduit = params.get("Produit")

if (idProduit == null || idProduit == "") {
    idProduit = "3017620425035"
}
fetch(`https://world.openfoodfacts.org/api/v2/product/${idProduit}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status == 0) {
            document.getElementById("product").innerHTML = `<h1> Le produit ou le code-barre rechercher n'existe pas dans notre bases de données`
        }

        let nutriscore = data.product.nutriscore_grade
        let nutriscoreimg = ""
        let bgnutri = ""
        let qualynutri = ""
        let textcl = ""

        switch (nutriscore) {
            case "a":
                nutriscoreimg = "assets/img/Nutriscore/A.svg"
                bgnutri = "vert"
                qualynutri = "Tres bonne qualité nutritionnelle"
                textcl = "txtvert"
                break;
            case "b":
                nutriscoreimg = "assets/img/Nutriscore/B.svg"
                bgnutri = "vertclair"
                qualynutri = "Bonne qualité nutritionnelle"
                textcl = "txtvertclair"
                break;
            case "c":
                nutriscoreimg = "assets/img/Nutriscore/C.svg"
                bgnutri = "jaune"
                qualynutri = "Qualité nutritionnelle moyenne"
                textcl = "txtjaune"
                break;
            case "d":
                nutriscoreimg = "assets/img/Nutriscore/D.svg"
                bgnutri = "orange"
                qualynutri = "Qualité nutritionnelle basse"
                textcl = "txtorange"
                break;
            case "e":
                nutriscoreimg = "assets/img/Nutriscore/E.svg"
                bgnutri = "rouge"
                qualynutri = "Qualité nutritionnelle mauvaise"
                textcl = "txtrouge"
                break;
            default:
                nutriscoreimg = "assets/img/Nutriscore/IDK.svg"
                bgnutri = "gris"
                qualynutri = "Qualité nutritionnelle inconnu"
                textcl = "txtgris"
                break
        }

        let novascore = data.product.nova_group
        let novaimg = ""
        let bgnova = ""
        let textnovacl = ""
        let transformed = ""

        switch (novascore) {
            case 1:
                novaimg = "assets/img/Novascore/Nova1.svg"
                bgnova = "vert"
                textnovacl = "txtvert"
                transformed = "Aliments non transformés ou minimalement transformés"
                break;
            case 2:
                novaimg = "assets/img/Novascore/Nova2.svg"
                bgnova = "vert"
                textnovacl = "txtvert"
                transformed = "Ingrédients culinaires transformés"
                break;
            case 3:
                novaimg = "assets/img/Novascore/Nova3.svg"
                bgnova = "vert"
                textnovacl = "txtvert"
                transformed = "Aliments transformés"
                break;
            case 4:
                novaimg = "assets/img/Novascore/Nova4.svg"
                bgnova = "rouge"
                textnovacl = "txtrouge"
                transformed = "Aliments ultra-transformés"
                break;
            default:
                novaimg = "assets/img/Novascore/NovaIDK.svg"
                bgnova = "gris"
                textnovacl = "txtgris"
                transformed = "Degré de transformation des aliments inconnu"
                break;
        }

        let countrie = ""
        if (data.product.countries_tags.length > 5) {
            for (let i = 0; i < 5; i++) {
                countrie += data.product.countries_tags[i] + ","
            }
        } else {
            countrie += data.product.countries_tags + ","
        }
        const card = `<div class="leftimg">
            <img src=${data.product.selected_images.front.display.fr} alt="Image du produit">
        </div>
        <div class="righttxt">
            <h1 class="nameT">${data.product.product_name_fr} - ${data.product.brands} - ${data.product.product_quantity} ${data.product.product_quantity_unit}</h1>
            <h2>Code-barres: <span>${data.code}</span></h2>
            <h2>Quantité : <span class="gramme">${data.product.product_quantity} ${data.product.product_quantity_unit}</span></h2>
            <h2>Conditionnement : <span>${data.product.packaging}</span></h2>
            <h2>Marques : <span>${data.product.brands}</span></h2>
            <h2>Catégorie : <span>${data.product.categories.split("en:")[0]}${data.product.categories_old.split("en:")[1]}</span></h2>
            <h2>Lieux de fabrication ou de transformation : <span>${data.product.manufacturing_places}</span></h2>
            <h2>Magasins : <span>${data.product.stores_tags}</span></h2>
            <h2>Pays de vente : <span>${countrie}</span></h2>
             </div>`

        const title = `<h2>${data.product.product_name_fr}</h2>`

        const cardbottom = `<div class="cardbottom">
        <h2>Correspondance avec vos préférences</h2>
        <div class="corresp">
            <div class="sousCard ${bgnutri}">
                <img src="${nutriscoreimg}" alt="nutriscore">
                <h2 class="${textcl}">Nutri-Score ${data.product.nutriscore_grade == "unknown" ? "inconnu" : data.product.nutriscore_grade}</h2>
                <p>${qualynutri}</p>
            </div>
            <div class="sousCard1 ${bgnova}">
                <img src="${novaimg}" alt="novascore">
                <h2 class="${textnovacl} txtc">${transformed}</h2>
                <p>${data.product.nova_groups == null ? "" : data.product.nova_groups + " Marqueurs d'ultra-transformation"} </p>
            </div>
        </div>
        </div>`

        document.querySelector(".card").innerHTML = card
        document.querySelector(".footer").innerHTML = cardbottom
        document.querySelector(".rightnav").innerHTML = title
    })
document.querySelector("#scan_button").addEventListener("click", function () {
    document.querySelector(".containerV").style.display = "flex"
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader();
    console.log("ZXing code reader initialized");
    codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById("sourceSelect");
            selectedDeviceId = videoInputDevices[0].deviceId;
            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement("option");
                    sourceOption.text = element.label;
                    sourceOption.value = element.deviceId;
                    sourceSelect.appendChild(sourceOption);
                });
                sourceSelect.onchange = () => {
                    selectedDeviceId = sourceSelect.value;
                };
                const sourceSelectPanel = document.getElementById("sourceSelectPanel");
                sourceSelectPanel.style.display = "block";
                document.querySelector("#button_container").style.display = "block";
            }
            document.getElementById("startButton").addEventListener("click", () => {
                codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    "video",
                    (result, err) => {
                        if (result) {

                            console.log(result);
                            document.getElementById("result").textContent = result.text;
                            document.querySelector("#nProduit").value = result.text;
                            document.getElementById("search_button").click()
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err);
                            document.getElementById("result").textContent = err;
                        }
                    }
                );
                console.log(
                    `Started continous decode from camera with id ${selectedDeviceId}`
                );
            });
            document.getElementById("resetButton").addEventListener("click", () => {
                codeReader.reset();
                document.getElementById("result").textContent = "";
                console.log("Reset.");
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

