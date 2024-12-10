# Open the input file with the 'utf-8' encoding
with open('text.txt', 'r', encoding='utf-8') as infile, open('text1.txt', 'w', encoding='utf-8') as outfile:
    # Read the entire content of the input file
    content = infile.read()

    # Replace each closing curly brace with '},' to add a comma after it
    content = content.replace('}', '},')

    # Remove the comma from the last closing brace (if necessary)
    if content.endswith(',\n'):
        content = content[:-2]  # Remove the last comma and newline

    # Write the updated content to the output file
    outfile.write(content)

print("Commas added after every closing brace in the file.")
