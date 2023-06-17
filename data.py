import pandas as pd
from owlready2 import datetime

def setDateTime(result, data):
    date = data.split()[0]
    month = int(date.split("/")[0])
    day = int(date.split("/")[1])
    year = int(date.split("/")[2])

    if len(data.split()) > 1:
        time = data.split()[1]
        hour = int(time.split(":")[0])
        minutes = int(time.split(":")[1])
        
        if "AM" in data and hour == 12:
            hour = 0
        if "PM" in data and hour != 12:
            hour += 12
    else:
        hour = 0
        minutes = 0

    result.resultTime = [datetime.datetime(year, month, day, hour, minutes)]

files = ["./database/weightLogInfo.csv", "./database/dailyCalories.csv"]

#files = ["./database/weightLogInfo.csv", "./database/dailyCalories.csv",
 #        "./database/dailyIntensities.csv", "./database/dailySteps.csv",
  #       "./database/hourlyCalories.csv", "./database/hourlyIntensities.csv",
   #      "./database/hourlySteps.csv", "./database/minuteSleep.csv", 
    #     "./database/sleepDay.csv"]

def loadData(onto):
    people = []
    filenum = 1
    observationCount = 1
    resultCount = 1
    for file in files:
        observationCount, resultCount = loadFileData(onto, people, file, filenum, observationCount, resultCount)
        filenum += 1
    
    
def loadFileData(onto, people, filename, filenum, observationCount, resultCount):

    df = pd.read_csv(filename)
    df.fillna(0, inplace=True)  

    for row in df.iterrows():
        column_index = 0
        observation = onto.Observation(observationId = [observationCount])
        result = onto.Result(resultId = [resultCount])
        observation.hasResult = [result]
        observationCount += 1
        resultCount += 1
        
        for data in row[1]:        
            if (column_index == 0):
                if data in people:
                    for person in onto.Person.instances():
                        if person.personId[0] == data:
                            observation.observedPerson = [person]
                            break
                else:
                    person = onto.Person(personId = [data])
                    observation.observedPerson = [person]
                    people.append(data)

            else:
                if data != 0:
                    match(filenum):
                        case 1:
                            loadWeightLogInfo(column_index, result, data)
                        case 2:
                            loadDailyCalories(column_index, result, data)
                        case 3:
                            loadDailyIntensities(column_index, result, data)
                        case 4:
                            loadDailySteps(column_index, result, data)
                        case 5:
                            loadHourlyCalories(column_index, result, data)
                        case 6:
                            loadHourlyIntensities(column_index, result, data)
                        case 7:
                            loadHourlySteps(column_index, result, data)
                        case 8:
                            loadMinuteSleep(column_index, result, data)
                        case 9:
                            loadSleepDay(column_index, result, data)
            column_index += 1

    return observationCount, resultCount

def loadWeightLogInfo(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasWeightKg = [data]
        case 3:
            result.hasWeightPounds = [data]
        case 4:
            result.hasFat = [data]
        case 5:
            result.hasBMI = [data]

def loadDailyCalories(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasCaloriesBurned = [data]
    
def loadDailyIntensities(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasSedentaryMinutes = [data]
        case 3:
            result.hasLightlyActiveMinutes = [data]
        case 4:
            result.hasFairlyActiveMinutes = [data]
        case 5:
            result.hasVeryActiveMinutes = [data]
        case 6:
            result.hasSedentaryActiveMinutes = [data]
        case 7:
            result.hasLightlyActiveMinutes = [data]
        case 8:
            result.hasModeratelyActiveDistance = [data]
        case 9:
            result.hasVeryActiveDistance = [data]

def loadDailySteps(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasTotalSteps = [data]
                
def loadHourlyCalories(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasCaloriesBurned = [data]
                
def loadHourlyIntensities(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasTotalIntensity = [data]
        case 3:
            result.hasAverageIntensity = [data]

def loadHourlySteps(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasTotalSteps = [data]
                
def loadSleepDay(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasTotalSleepRecords = [data]
        case 3:
            result.hasTotalMinutesAsleep = [data]
        case 4:
            result.hasTotalTimeInBed = [data]

def loadMinuteSleep(column_index, result, data):
    match(column_index):
        case 1:
            setDateTime(result, data)
        case 2:
            result.hasMinuteSleep = [data]