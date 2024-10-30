https://docs.trefle.io/docs/examples/snippets

https://trefle.io/api/v1/species/search?token=dpG3NamiooVeV7jOI7qZRICd251hZfnVAOSqtNqH7zQ&q=coconut&limit=10
https://trefle.io/api/v1/plants?token=dpG3NamiooVeV7jOI7qZRICd251hZfnVAOSqtNqH7zQ&q=coconut&limit=10
https://trefle.io/api/v1/species?token=dpG3NamiooVeV7jOI7qZRICd251hZfnVAOSqtNqH7zQ&q=coconut&limit=10

//  &order[year]=asc
//  &filter[common_name]=beach%20strawberry
//      &filter[edible_part]=roots,leaves

Species
common_name (string)	The usual common name, in english, of the species (if any).
scientific_name (string)	The scientific name follows the Binomial nomenclature, and represents its genus and its species within the genus, resulting in a single worldwide name for each organism. The scientific name of an infraspecific taxons (ranks below species, such as subspecies, forms, varieties...) is a combination of the name of a species and an infraspecific epithet. A connecting term is used to denote the rank. See IAPT recommendation
year (integer)	The first publication year of a valid name of this species. See author citation
bibliography (string)	The first publication of a valid name of this species. See author citation
family_common_name (string)	The common name (in english) of the species family
family (string)	The scientific name of the species family
genus (string)	The scientific name of the species genus
image_url (string)	A main image url of the species
duration (array of strings)	The plant duration(s), which can be:
- Annual: plants that live, reproduce, and die in one growing season.
- Biennial: plants that need two growing seasons to complete their life cycle, normally completing vegetative growth the first year and flowering the second year.
- Perennial: plants that live for more than two years, with the shoot system dying back to soil level each year.
common_names (object)	Common names of the species per language
distribution (object)	(Deprecated) Distribution of the species per establishment
synonyms (array of objects)	The symonyms scientific names and authors
sources (array of objects)	The symonyms scientific names and authors

links
self (string)	API endpoint to the species itself
genus (string)	API endpoint to the species genus
plant (string)	API endpoint to the species plant

images
flower (array of objects)	Image(s) of the species flower
leaf (array of objects)	Image(s) of the species leaf
habit (array of objects)	Image(s) of the species habit
fruit (array of objects)	Image(s) of the species fruit
bark (array of objects)	Image(s) of the species bark
other (array of objects)	Image(s) of the species other

flower
color (array of strings)	The flower color(s)
conspicuous (boolean)	Is the flower visible?

specifications
average_height (object)	The average height of the species, in centimeters
shape_and_orientation (string)	The predominant shape of the species

growth
days_to_harvest (number)	The average numbers of days required to from planting to harvest
description (string)	A description on how the plant usually grows
sowing (string)	A description on how to sow the plant
ph_maximum (number)	The maximum acceptable soil pH (of the top 30 centimeters of soil) for the plant
ph_minimum (number)	The minimum acceptable soil pH (of the top 30 centimeters of soil) for the plant
light (integer)	Required amount of light, on a scale from 0 (no light, <= 10 lux) to 10 (very intensive insolation, >= 100 000 lux)
atmospheric_humidity (integer)	Required relative humidity in the air, on a scale from 0 (<=10%) to 10 (>= 90%)
growth_months (array of strings)	The most active growth months of the species (usually all year round for perennial plants)
bloom_months (array of strings)	The months the species usually blooms
fruit_months (array of strings)	The months the species usually produces fruits
row_spacing (object)	The minimum spacing between each rows of plants, in centimeters
spread (object)	The average spreading of the plant, in centimeters
minimum_precipitation (object)	Minimum precipitation per year, in milimeters per year
maximum_precipitation (object)	Maximum precipitation per year, in milimeters per year
minimum_root_depth (object)	Minimum depth of soil required for the species, in centimeters. Plants that do not have roots such as rootless aquatic plants have 0
minimum_temperature (object)	The minimum tolerable temperature for the species. In celsius or fahrenheit degrees
maximum_temperature (object)	The maximum tolerable temperature for the species. In celsius or fahrenheit degrees
soil_nutriments (integer)	Required quantity of nutriments in the soil, on a scale from 0 (oligotrophic) to 10 (hypereutrophic)
soil_salinity (integer)	Tolerance to salinity, on a scale from 0 (untolerant) to 10 (hyperhaline)
soil_texture (integer)	Required texture of the soil, on a scale from 0 (clay) to 10 (rock)
soil_humidity (integer)	Required humidity of the soil, on a scale from 0 (xerophile) to 10 (subaquatic)

sources[]
name (string)	The name of the source
citation (string)	How to cite the source
url (string)	The link on the source website, or the publication reference
last_update (string)	The last time the source was checked