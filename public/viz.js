/**
 * On crée la variable qui contiendra le nom du groupe de graphique du dashboard
 */
const groupName = "dataset";

/**
 * Fonction pour reset les filtres et redessiner les graphiques
 */
function reset() {
	dc.filterAll(groupName);
	dc.renderAll(groupName);
}

/**
 * Permet de montrer les % des tranches du pie chart
 * @param chart Le pie chart sur quoi faire la modification
 */
const montrerPourcentagesPieChart = (chart) => {
	chart.selectAll('text.pie-slice').text(function (d) {
		if (((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) !== 0) {
			return dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)) + '%';
		}
	})
}

/**
 * La fonction pour créer la visualisation
 */
async function createDataViz() {


	// On récupère le dataset et on le met dans la variable dataset
	let dataset = await d3.csv("/data/survey.csv");

	// On formate un peu la donnée pour nous éviter des soucis
	dataset.forEach((d) => {

		//d["While working"] = d["While working"] === "Yes";
		//d["Instrumentalist"] = d["Instrumentalist"] === "Yes";
		//d["Composer"] = d["Composer"] === "Yes";
		//d["Exploratory"] = d["Exploratory"] === "Yes";
		//d["Foreign languages"] = d["Foreign languages"] === "Yes";

		d["Age"] = +d["Age"];
		d["Hours per day"] = + d["Hours per day"];
		d["BPM"] = +d["BPM"];
		isNaN(d["Anxiety"]) ? d["Anxiety"] = +d["Anxiety"] : -1;
		isNaN(d["Depression"]) ? d["Depression"] = +d["Depression"] : -1;
		isNaN(d["Insomnia"]) ? d["Insomnia"] = +d["Insomnia"] : -1;
		d["OCD"] = +d["OCD"];


		d["Timestamp"] = new Date(d["Timestamp"]);
	});



	const ndx = crossfilter(dataset);
	console.log(dataset.dimension)

	////////////////////////////////////////////////////////////////////////////////////
	let plotRowChart = (name, divClass) => {
		const dim = ndx.dimension(function (d) {
			return d[name] || "Aucune information";
		});

		// On crée le groupe, on veut le nombre de mass shooting par saison
		const grp = dim.group().reduceCount();
	;

		// On crée le graphique avec le groupName
		const chrt = new dc.RowChart("#" + divClass, groupName)
			.dimension(dim) // On ajoute la dimension
			.group(grp) // On ajoute le groupe
			.cap(8) // On ne veux que 8 résultats et le reste est dans "Reste"
			.othersLabel("other")
			.elasticX(true)
			//.ordering(function (p) { // On veut trier par valeur croissante
			//		return -p.value;
			//})
			.ordinalColors(['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'magenta', 'black', 'brown']) // Les couleurs des éléments
			.legend(dc.legend().highlightSelected(true).x(0).y(13)) // On ajoute la légende
			.title(function (d) {
				return d.value;
			}) // Le titre à montrer quand la sourie est passée sur un élément
			.on('pretransition', montrerPourcentagesPieChart); // On veut montrer les % dans les tranches
		return chrt;
	}

	let plotPieChart = (name, divClass) => {
		const dim = ndx.dimension(function (d) {
			return d[name] || "Aucune information";
		});

		// On crée le groupe, on veut le nombre de mass shooting par saison
		const grp = dim.group().reduceCount();

		// On crée le graphique avec le groupName
		const chrt = dc.pieChart("#" + divClass, groupName)
			.dimension(dim) // On ajoute la dimension
			.group(grp) // On ajoute le groupe
			.othersLabel("other")
			//.ordering(function (p) { // On veut trier par valeur croissante
			//		return -p.value;
			//})
			.ordinalColors(['red', 'blue']) // Les couleurs des éléments
			.legend(dc.legend().highlightSelected(true).x(0).y(13)) // On ajoute la légende
			.title(function (d) {
				return d.value;
			}) // Le titre à montrer quand la sourie est passée sur un élément
			.on('pretransition', montrerPourcentagesPieChart); // On veut montrer les % dans les tranches
		return chrt;
	}
	////////////////////////////////////////////////////////////////////////////////////
	plotRowChart("Age", "ageChart")
	plotRowChart("Hours per day", "hoursChart")
	plotRowChart("OCD", "ocdChart")

	plotRowChart("Anxiety", "chart4")
	plotRowChart("Depression", "chart5")
	plotRowChart("Insomnia", "chart6")

	plotPieChart("Composer", "chart7")
	plotPieChart("Instrumentalist", "chart8")
	plotPieChart("While working", "chart9")

	dc.renderAll(groupName);
}
