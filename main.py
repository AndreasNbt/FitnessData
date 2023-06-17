import ontology as o
import data as d

# Create ontology and add classes and properties
onto = o.loadOntology()

# Add data from CSV files to the ontology
d.loadData(onto= onto)

# Save the ontology 
onto.save(file = "Data.owl")



