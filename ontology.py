import types
from owlready2 import *

def loadOntology(): 
    path = "http://test.org/FitnessData.owl"
    ontology = get_ontology(path)
    addClassesAndProperties(ontology)
    return ontology

def addClassesAndProperties(ontology):
    with ontology:
        FeatureOfInterest = types.new_class("FeatureOfInterest", (Thing,))
        Observation = types.new_class("Observation", (Thing,))
        Result = types.new_class("Result", (Thing,))
        Person = types.new_class("Person", (FeatureOfInterest,))

        class hasFeatureOfInterest(ObjectProperty):
            domain = [Observation]
            range = [FeatureOfInterest]
        class isFeatureOfInterestOf(ObjectProperty):
            domain = [FeatureOfInterest]
            range = [Observation]
            inverse_property = hasFeatureOfInterest
        class observedPerson(hasFeatureOfInterest):
            domain = [Observation]
            range = [Person]
        class personObservedBy(isFeatureOfInterestOf):
            domain = [Person]
            range = [Observation]
            inverse_property = observedPerson
        class personId(Person >> int):
            pass
        class observationId(Observation >> int):
            pass
        class resultId(Observation >> int):
            pass
        class hasResult(ObjectProperty):
            domain = [Observation]
            range = [Result]
        class resultOfObservation(ObjectProperty):
            domain = [Result]
            range = [Observation]
            inverse_property = hasResult
        class resultTime(Result >> datetime.datetime):
            pass
        class hasWeightKg(Result >> float):
            pass    
        class hasWeightPounds(Result >> float):
            pass
        class hasFat(Result >> float):
            pass 
        class hasBMI(Result >> float):
            pass   
        class hasCaloriesBurned(Result >> int):
            pass
        class hasCaloriesBurnedPerHour(Result >> int):
            pass
        class hasSedentaryMinutes(Result >> int):
            pass
        class hasLightlyActiveMinutes(Result >> int):
            pass
        class hasFairlyActiveMinutes(Result >> int):
            pass
        class hasVeryActiveMinutes(Result >> int):
            pass
        class hasSedentaryActiveDistance(Result >> float):
            pass
        class hasLightlyActiveDistance(Result >> float):
            pass
        class hasModeratelyActiveDistance(Result >> float):
            pass
        class hasVeryActiveDistance(Result >> float):
            pass
        class hasTotalSteps(Result >> int):
            pass
        class hasTotalStepsPerHour(Result >> int):
            pass
        class hasTotalIntensity(Result >> int):
            pass
        class hasAverageIntensity(Result >> float):
            pass
        class hasIntensityPerMinute(Result >> str):
            pass
        class hasTotalSleepRecords(Result >> int):
            pass
        class hasTotalMinutesAsleep(Result >> int):
            pass
        class hasTotalTimeInBed(Result >> int):
            pass
        class hasMETsPerMinute(Result >> str):
            pass
        class hasMinuteSleep(Result >> int):
            pass
        class hasStepsPerMinute(Result >> int):
            pass
        class hasHeartratePerSecond(Result >> int):
            pass

