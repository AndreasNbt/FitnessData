from pyshacl import validate

# Path to the RDF data file
data_file = './Data.owl'

# Path to the SHACL shapes file
shapes_file = './rules.shacl'

# Perform SHACL validation
results_conforms, results_graph, results_text  = validate(data_file, shacl_graph=shapes_file ) 
                                                    
# Check if validation has errors or violations
if results_conforms:
    print("Data is valid according to the SHACL rules.")
else:
    print("Validation failed. The data does not conform to the SHACL rules.")

# Print validation report
print("\nValidation Report:")
print(results_text)


