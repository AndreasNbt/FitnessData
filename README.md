# FitnessData

Welcome to the README file for this GitHub repository. This document will guide you through the installation requirements and instructions for running the program.

## Prerequisites

Before running the program, please ensure that you have the following prerequisites installed:

- Python: Python is required to execute the Python scripts in this repository. You can download the latest version of Python from the official Python website: [python.org](https://www.python.org).
  
- Node.js and npm: Node.js is required for running the Angular project included in this repository. You can download and install Node.js from the official Node.js website: [nodejs.org](https://nodejs.org).

- GraphDB: GraphDB is a prerequisite for this project. Follow the steps below to install GraphDB:

  1. Download GraphDB from the official Ontotext website: [ontotext.com/products/graphdb/](https://www.ontotext.com/products/graphdb/).

  2. Choose the appropriate installation package for your operating system and follow the installation instructions provided in the GraphDB documentation.

## Installation

To install the necessary dependencies for this project, please follow these steps:

1. Clone the repository to your local machine using the following command: **git clone https://github.com/AndreasNbt/FitnessData.git
   
2. After that, navigate to the repository's directory: **cd directory
   
3. Install all the necessary dependencies for the python scripts:
   **pip install pandas
   **pip install pyshacl
   **pip install owlready2

4. Install Node.js dependencies by running the following command: **npm install

## Execution Instructions

- To run the program which reads and transforms the data, and creates the ontology, execute the main.py script with the following command: **python main.py
  There is already a Data.owl file in the repository which contains the output of the main.py script, so you dont have to run it unless you want to change or test something.

- To validate the created ontology, execute the validation.py script with the following command: **python validation.py

- Next, you have to create a local GraphDB repository and store the Data.owl file. To do that, open the GraphDB Workbench by opening the GraphDB Desktop app that you previously installed.
  After that, navigate to the Import page and add the Data.owl file that exists in the repository by click the "**Upload RDF files" button near the top of the page. When the file appears below, click the Import button on it's right.

- Finally, to run the web application, first navigate to the Dashboards folder: **cd ./Dashboards
  First, you need to run the local server which will send requests to the database. To do that navigate to the backend folder with this command:  **cd ./src/backend
  and then start the server with the command: **node server.js
  After that, open a new terminal, navigate to the Dashboards folder and start the Angular project with the command: **ng serve
  This will execute the project and open a browser window which will display the home (about) page.
  



