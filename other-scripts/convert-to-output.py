#!/usr/bin/python3: --- 

import json
import sys

# --- Configuration ---
INPUT_FILE = "input.txt"
OUTPUT_FILE = "output.json"
DEFAULT_ALT_TEXT = "no alt"
# ---------------------

def create_json_from_links():
    """
    Reads links from input.txt and user prompts to create
    a formatted JSON object.
    """
    
    # 1. Get user input for the group
    try:
        group_key = input("Enter the group URL key (e.g., 'Birthday-Party'): ")
        group_name = input("Enter the group display name (e.g., 'Birthday Party'): ")
    except EOFError:
        print("\nInput cancelled. Exiting.")
        sys.exit()

    if not group_key or not group_name:
        print("Error: Both group key and name are required. Exiting.")
        sys.exit(1)

    # 2. Read the links from the input file
    try:
        with open(INPUT_FILE, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"\nError: Input file '{INPUT_FILE}' not found.")
        print(f"Please create '{INPUT_FILE}' in the same directory.")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred reading the file: {e}")
        sys.exit(1)

    # 3. Process the links
    # Split by comma, strip whitespace from each URL, and filter out empty strings
    links = [url.strip() for url in content.strip().split(',')]
    
    photos_list = []
    for link in links:
        if link:  # Only add non-empty links
            photos_list.append({
                "src": link,
                "alt": DEFAULT_ALT_TEXT
            })

    # 4. Build the final JSON structure
    final_data = {
        group_key: {
            "name": group_name,
            "photos": photos_list
        }
    }

    # 5. Convert to formatted JSON string
    try:
        output_json = json.dumps(final_data, indent=4)
    except Exception as e:
        print(f"An error occurred formatting the JSON: {e}")
        sys.exit(1)
        
    # 6. Print to console
    print("\n--- Generated JSON ---")
    print(output_json)

    # 7. Save to output file
    try:
        with open(OUTPUT_FILE, 'w') as out_f:
            out_f.write(output_json)
        print(f"\nSuccessfully saved to '{OUTPUT_FILE}'")
    except Exception as e:
        print(f"An error occurred writing to '{OUTPUT_FILE}': {e}")

if __name__ == "__main__":
    create_json_from_links()