import pandas as pd
import joblib
import numpy as np
import logging
import os
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class DiseasePredictor:
    def __init__(self, model_path: str, data_path: str):
        try:
            # Construct absolute paths
            base_dir = os.path.dirname(os.path.abspath(__file__))
            absolute_model_path = os.path.join(base_dir, "data", "rf1_disease_model.joblib")
            absolute_data_path = os.path.join(base_dir, "data", "Training_updated_1.csv")

            # Load model
            self.model = joblib.load(absolute_model_path)

            # --- Use the model's actual features list (with spaces) ---
            if hasattr(self.model, 'feature_names_in_'):
                self.symptoms_list = list(self.model.feature_names_in_)
                logger.info(f"Using model's feature names: {len(self.symptoms_list)} features")
            else:
                # Fallback if model is missing feature names
                df = pd.read_csv(absolute_data_path)
                if 'diseases' in df.columns:
                    exclude_cols = ['diseases', 'Unnamed: 0'] if 'Unnamed: 0' in df.columns else ['diseases']
                    self.symptoms_list = df.drop(exclude_cols, axis=1).columns.tolist()
                else:
                    raise ValueError("Could not determine feature names from model or CSV.")
                logger.warning("Model lacks feature_names_in_. Using CSV header as fallback. Ensure training saves feature names.")

            # --- DEFINITIVE MAPPING OF ALL 385 DISEASES ---
            self.department_map = {
                # General Medicine (Approx. 85 Classes)
                'metabolic disorder': 'General Medicine', 'hyperkalemia': 'General Medicine',
                'hypoglycemia': 'General Medicine', 'fluid overload': 'General Medicine',
                'obesity': 'General Medicine', 'indigestion': 'General Medicine',
                'chronic rheumatic fever': 'General Medicine', 'hypocalcemia': 'General Medicine',
                'wilson disease': 'General Medicine', 'vitamin a deficiency': 'General Medicine',
                'hypercholesterolemia': 'General Medicine', 'thoracic outlet syndrome': 'General Medicine', # Overlap with Ortho/Neuro
                'hyperlipidemia': 'General Medicine', 'vitamin d deficiency': 'General Medicine',
                'iron deficiency anemia': 'General Medicine', 'anemia': 'General Medicine',
                'protein deficiency': 'General Medicine', 'magnesium deficiency': 'General Medicine',
                'scurvy': 'General Medicine', 'vitamin b12 deficiency': 'General Medicine',
                'orthostatic hypotension': 'General Medicine', 'hypokalemia': 'General Medicine',
                'dehydration': 'General Medicine', 'electrolyte imbalance': 'General Medicine', # Assumed category if needed
                'hypomagnesemia': 'General Medicine', # Assumed category if needed
                'chronic fatigue syndrome': 'General Medicine', # Assumed category if needed
                'rheumatic fever': 'General Medicine', 'hypertension': 'General Medicine', # Alias for high blood pressure
                'common cold': 'General Medicine', 'flu': 'General Medicine',
                'developmental disability': 'General Medicine', # May need Pediatrics/Neurology depending on context
                'asperger syndrome': 'General Medicine', # May need Psychiatry/Neurology depending on context
                'smoking or tobacco addiction': 'General Medicine', # Addiction Medicine overlap
                'pain disorder affecting the neck': 'General Medicine', # Could be Ortho/Neuro
                'chronic back pain': 'General Medicine', # Could be Ortho/Neuro
                'peripheral arterial disease': 'General Medicine', # Cardiology/Vascular overlap
                'acanthosis nigricans': 'General Medicine', # Often linked to Diabetes/Endocrinology
                'sarcoidosis': 'General Medicine', # Multi-system, often Pulmonology involved
                'tuberous sclerosis': 'General Medicine', # Multi-system, often Neurology involved
                'fibromyalgia': 'General Medicine', # Rheumatology overlap
                'lumbago': 'General Medicine', # Orthopedics overlap
                'high blood pressure': 'General Medicine', # Use this or hypertensive heart disease
                'wernicke korsakoff syndrome': 'General Medicine', # Neuro overlap due to cause (B1 def.)
                'gastroenteritis': 'General Medicine', # If non-infectious, otherwise Infectious Disease
                'narcolepsy': 'General Medicine', # Neurology overlap
                'delirium': 'General Medicine', # Neuro/Geriatrics overlap
                'torticollis': 'General Medicine', # Ortho/Neuro overlap
                'jaundice': 'General Medicine', # Sign, investigate with Gastro/Hepatology

                # Pulmonology / Respiratory (Approx. 20 Classes)
                'obstructive sleep apnea (osa)': 'Pulmonology', 'chronic obstructive pulmonary disease (copd)': 'Pulmonology',
                'acute respiratory distress syndrome (ards)': 'Pulmonology', 'atelectasis': 'Pulmonology',
                'emphysema': 'Pulmonology', 'asthma': 'Pulmonology', 'pulmonary eosinophilia': 'Pulmonology',
                'lung contusion': 'Pulmonology', 'abscess of the lung': 'Pulmonology', 'pneumonia': 'Pulmonology',
                'pleural effusion': 'Pulmonology', 'pulmonary fibrosis': 'Pulmonology',
                'acute bronchospasm': 'Pulmonology', 'lung cancer': 'Pulmonology', 'interstitial lung disease': 'Pulmonology',
                'pulmonary hypertension': 'Pulmonology', 'pneumothorax': 'Pulmonology', 'tuberculosis': 'Pulmonology',
                'acute bronchiolitis': 'Pulmonology', 'pneumoconiosis': 'Pulmonology',
                'acute bronchitis': 'Pulmonology', 'cystic fibrosis': 'Pulmonology', 'pulmonary congestion': 'Pulmonology',
                'empyema': 'Pulmonology',

                # Cardiology (Approx. 32 Classes)
                'heart attack': 'Cardiology', 'coronary atherosclerosis': 'Cardiology',
                'sick sinus syndrome': 'Cardiology', 'atrial fibrillation': 'Cardiology',
                'pericarditis': 'Cardiology', 'mitral valve disease': 'Cardiology',
                'pulmonic valve disease': 'Cardiology', 'hypertrophic obstructive cardiomyopathy (hocm)': 'Cardiology',
                'atrial flutter': 'Cardiology', 'paroxysmal ventricular tachycardia': 'Cardiology',
                'angina': 'Cardiology', 'ischemic heart disease': 'Cardiology',
                'cardiomyopathy': 'Cardiology', 'heart failure': 'Cardiology',
                'cardiac arrest': 'Cardiology', 'endocarditis': 'Cardiology', 'myocarditis': 'Cardiology',
                'tricuspid valve disease': 'Cardiology', 'hypertensive heart disease': 'Cardiology',
                'central atherosclerosis': 'Cardiology', 'arrhythmia': 'Cardiology',
                'aortic valve disease': 'Cardiology', 'sinus bradycardia': 'Cardiology',
                'heart block': 'Cardiology', 'congenital heart defect': 'Cardiology',
                'paroxysmal supraventricular tachycardia': 'Cardiology', 'thoracic aortic aneurysm': 'Cardiology',
                'premature atrial contractions (pacs)': 'Cardiology', 'premature ventricular contractions (pvcs)': 'Cardiology',
                'heart contusion': 'Cardiology', 'pulmonary embolism': 'Cardiology',
                'malignant hypertension': 'Cardiology',

                # Neurology (Approx. 65 Classes)
                'headache after lumbar puncture': 'Neurology', 'transient ischemic attack': 'Neurology',
                'restless leg syndrome': 'Neurology', 'stroke': 'Neurology', 'normal pressure hydrocephalus': 'Neurology',
                'intracranial hemorrhage': 'Neurology', 'subdural hemorrhage': 'Neurology', 'cerebral palsy': 'Neurology',
                'myoclonus': 'Neurology', 'cranial nerve palsy': 'Neurology', 'concussion': 'Neurology',
                'neuralgia': 'Neurology', 'chronic inflammatory demyelinating polyneuropathy (cidp)': 'Neurology',
                'myasthenia gravis': 'Neurology', 'epilepsy': 'Neurology', 'tension headache': 'Neurology',
                'bell palsy': 'Neurology', 'hydrocephalus': 'Neurology', 'encephalitis': 'Neurology',
                'optic neuritis': 'Neurology', 'hemiplegia': 'Neurology', 'meningioma': 'Neurology',
                'brain cancer': 'Neurology', 'syringomyelia': 'Neurology', 'parkinson disease': 'Neurology',
                'huntington disease': 'Neurology', 'amyotrophic lateral sclerosis (als)': 'Neurology',
                'autism': 'Neurology', 'lewy body dementia': 'Neurology', 'spinal stenosis': 'Neurology',
                'neuropathy due to drugs': 'Neurology', 'central retinal artery or vein occlusion': 'Neurology',
                'tourette syndrome': 'Neurology', 'spinocerebellar ataxia': 'Neurology',
                'guillain barre syndrome': 'Neurology', 'brachial neuritis': 'Neurology',
                'peripheral nerve disorder': 'Neurology', 'migraine': 'Neurology', 'cerebral edema': 'Neurology',
                'multiple sclerosis': 'Neurology', 'alzheimer disease': 'Neurology',
                'trigeminal neuralgia': 'Neurology', 'friedrich ataxia': 'Neurology', 'head injury': 'Neurology',
                'meningitis': 'Neurology', 'essential tremor': 'Neurology', 'subarachnoid hemorrhage': 'Neurology',
                'epidural hemorrhage': 'Neurology', 'pseudotumor cerebri': 'Neurology',
                'benign paroxysmal positional vertical (bppv)': 'Neurology', 'blepharospasm': 'Neurology',
                'vertebrobasilar insufficiency': 'Neurology', 'dementia': 'Neurology',
                'autonomic nervous system disorder': 'Neurology', 'intracranial abscess': 'Neurology',
                'moyamoya disease': 'Neurology', 'spina bifida': 'Neurology',
                'tic (movement) disorder': 'Neurology', 'ependymoma': 'Neurology',
                'muscular dystrophy': 'Neurology', 'extrapyramidal effect of drugs': 'Neurology', # Often drug side effect related

                # Gastroenterology (Approx. 38 Classes)
                'pyloric stenosis': 'Gastroenterology', 'choledocholithiasis': 'Gastroenterology',
                'ischemia of the bowel': 'Gastroenterology', 'acute pancreatitis': 'Gastroenterology',
                'achalasia': 'Gastroenterology', 'gastroesophageal reflux disease (gerd)': 'Gastroenterology',
                'colonic polyp': 'Gastroenterology', 'hiatal hernia': 'Gastroenterology',
                'diverticulosis': 'Gastroenterology', 'gastroparesis': 'Gastroenterology',
                'gastrointestinal hemorrhage': 'Gastroenterology', 'gastritis': 'Gastroenterology',
                'esophageal cancer': 'Gastroenterology', 'esophageal varices': 'Gastroenterology',
                'ulcerative colitis': 'Gastroenterology', 'intestinal malabsorption': 'Gastroenterology',
                'intestinal cancer': 'Gastroenterology', 'dumping syndrome': 'Gastroenterology',
                'celiac disease': 'Gastroenterology', 'chronic pancreatitis': 'Gastroenterology',
                'irritable bowel syndrome': 'Gastroenterology', 'pancreatic cancer': 'Gastroenterology',
                'ascending cholangitis': 'Gastroenterology', 'stomach cancer': 'Gastroenterology',
                'gastroduodenal ulcer': 'Gastroenterology', 'stricture of the esophagus': 'Gastroenterology',
                'crohn disease': 'Gastroenterology', 'cholecystitis': 'Gastroenterology',
                'esophagitis': 'Gastroenterology', 'lactose intolerance': 'Gastroenterology',
                'foreign body in the gastrointestinal tract': 'Gastroenterology',
                'persistent vomiting of unknown cause': 'Gastroenterology', 'gallstone': 'Gastroenterology',
                'diverticulitis': 'Gastroenterology', 'intestinal disease': 'Gastroenterology', # Vague, but map here
                'noninfectious gastroenteritis': 'Gastroenterology',

                # Dermatology (Approx. 42 Classes)
                'viral warts': 'Dermatology', 'alopecia': 'Dermatology', 'actinic keratosis': 'Dermatology',
                'pemphigus': 'Dermatology', 'psoriasis': 'Dermatology', 'seborrheic dermatitis': 'Dermatology',
                'fungal infection of the skin': 'Dermatology', 'eczema': 'Dermatology', 'itching of unknown cause': 'Dermatology',
                'lichen planus': 'Dermatology', 'acne': 'Dermatology', 'dermatitis due to sun exposure': 'Dermatology',
                'sebaceous cyst': 'Dermatology', 'skin cancer': 'Dermatology', 'melanoma': 'Dermatology',
                'lichen simplex': 'Dermatology', 'dyshidrosis': 'Dermatology', 'pityriasis rosea': 'Dermatology',
                'scabies': 'Dermatology', 'erythema multiforme': 'Dermatology', 'impetigo': 'Dermatology',
                'rosacea': 'Dermatology', 'diaper rash': 'Dermatology', 'paronychia': 'Dermatology',
                'molluscum contagiosum': 'Dermatology', 'seborrheic keratosis': 'Dermatology',
                'contact dermatitis': 'Dermatology', 'skin polyp': 'Dermatology',
                'hidradenitis suppurativa': 'Dermatology', 'burn': 'Dermatology',
                'kaposi sarcoma': 'Dermatology', # Oncology overlap
                'skin pigmentation disorder': 'Dermatology', 'atrophic skin condition': 'Dermatology',
                'genital herpes': 'Dermatology', # Infectious overlap
                'cold sore': 'Dermatology', # Infectious overlap
                'intertrigo (skin condition)': 'Dermatology', 'fungal infection of the hair': 'Dermatology',
                'hemangioma': 'Dermatology', 'callus': 'Dermatology', 'scar': 'Dermatology',
                'athlete\'s foot': 'Dermatology', 'acariasis': 'Dermatology', # Mite infestation
                'skin disorder': 'Dermatology', # Vague
                'aphthous ulcer': 'Dermatology', # Often dental/oral medicine
                'hirsutism': 'Dermatology', # Often Endocrinology

                # Infectious Diseases (Approx. 48 Classes)
                'cysticercosis': 'Infectious Diseases', 'dengue fever': 'Infectious Diseases',
                'pinworm infection': 'Infectious Diseases', 'cryptococcosis': 'Infectious Diseases',
                'infectious gastroenteritis': 'Infectious Diseases', 'mononucleosis': 'Infectious Diseases',
                'gonorrhea': 'Infectious Diseases', 'syphilis': 'Infectious Diseases',
                'chickenpox': 'Infectious Diseases', 'typhoid fever': 'Infectious Diseases',
                'histoplasmosis': 'Infectious Diseases', 'aspergillosis': 'Infectious Diseases',
                'trichinosis': 'Infectious Diseases', 'whooping cough': 'Infectious Diseases',
                'malaria': 'Infectious Diseases', 'septic arthritis': 'Infectious Diseases',
                'valley fever': 'Infectious Diseases', 'urinary tract infection': 'Infectious Diseases',
                'necrotizing fasciitis': 'Infectious Diseases', 'toxoplasmosis': 'Infectious Diseases',
                'cat scratch disease': 'Infectious Diseases', 'lymphadenitis': 'Infectious Diseases',
                'sepsis': 'Infectious Diseases', 'herpangina': 'Infectious Diseases',
                'lice': 'Infectious Diseases', 'scarlet fever': 'Infectious Diseases',
                'sporotrichosis': 'Infectious Diseases', 'lyme disease': 'Infectious Diseases',
                'chlamydia': 'Infectious Diseases', 'human immunodeficiency virus infection (hiv)': 'Infectious Diseases',
                'mumps': 'Infectious Diseases', 'gas gangrene': 'Infectious Diseases',
                'rocky mountain spotted fever': 'Infectious Diseases', 'viral hepatitis': 'Infectious Diseases',
                'pyogenic skin infection': 'Infectious Diseases', 'postoperative infection': 'Infectious Diseases',
                'trichomonas infection': 'Infectious Diseases', 'hpv': 'Infectious Diseases',
                'male genitalia infection': 'Infectious Diseases', 'lymphogranuloma venereum': 'Infectious Diseases',
                'granuloma inguinale': 'Infectious Diseases', 'parasitic disease': 'Infectious Diseases',
                'strep throat': 'Infectious Diseases', 'tonsillitis': 'Infectious Diseases',
                'infection of open wound': 'Infectious Diseases', 'shingles (herpes zoster)': 'Infectious Diseases',
                'conjunctivitis due to bacteria': 'Infectious Diseases', # Ophthalmology overlap
                'conjunctivitis due to virus': 'Infectious Diseases', # Ophthalmology overlap
                'epididymitis': 'Infectious Diseases', # Urology overlap
                'oral thrush (yeast infection)': 'Infectious Diseases',
                'viral exanthem': 'Infectious Diseases', # Viral rash
                'orbital cellulitis': 'Infectious Diseases', # Ophthalmology/ENT overlap

                # Orthopedics (Approx. 55 Classes)
                'fracture of the hand': 'Orthopedics', 'osteochondrosis': 'Orthopedics',
                'fracture of the leg': 'Orthopedics',
                'injury to the knee': 'Orthopedics', 'rotator cuff injury': 'Orthopedics',
                'injury to the hand': 'Orthopedics', 'injury to the hip': 'Orthopedics',
                'fracture of the arm': 'Orthopedics', 'dislocation of the elbow': 'Orthopedics',
                'spondylosis': 'Orthopedics', 'injury to the shoulder': 'Orthopedics',
                'bone spur of the calcaneous': 'Orthopedics', 'complex regional pain syndrome': 'Orthopedics', # Pain Management overlap
                'dislocation of the ankle': 'Orthopedics', 'plantar fasciitis': 'Orthopedics',
                'fracture of the finger': 'Orthopedics', 'dislocation of the patella': 'Orthopedics',
                'sciatica': 'Orthopedics', 'degenerative disc disease': 'Orthopedics',
                'fracture of the shoulder': 'Orthopedics', 'carpal tunnel syndrome': 'Orthopedics',
                'fracture of the rib': 'Orthopedics', 'fracture of the patella': 'Orthopedics',
                'chronic knee pain': 'Orthopedics', 'lateral epicondylitis (tennis elbow)': 'Orthopedics',
                'joint effusion': 'Orthopedics', 'tendinitis': 'Orthopedics', 'osteoarthritis': 'Orthopedics',
                'bursitis': 'Orthopedics', 'scoliosis': 'Orthopedics', 'avascular necrosis': 'Orthopedics',
                'fracture of the foot': 'Orthopedics', 'dislocation of the wrist': 'Orthopedics',
                'chondromalacia of the patella': 'Orthopedics', 'fracture of the vertebra': 'Orthopedics',
                'injury of the ankle': 'Orthopedics', 'spondylitis': 'Orthopedics',
                'herniated disk': 'Orthopedics', 'bunion': 'Orthopedics',
                'de quervain disease': 'Orthopedics', 'osteomyelitis': 'Orthopedics', # Infectious Disease overlap
                'adhesive capsulitis of the shoulder': 'Orthopedics', 'injury to the trunk': 'Orthopedics',
                'hammer toe': 'Orthopedics',
                'dislocation of the knee': 'Orthopedics', 'dislocation of the finger': 'Orthopedics',
                'dislocation of the hip': 'Orthopedics', 'fracture of the jaw': 'Orthopedics',
                'fracture of the neck': 'Orthopedics', 'fracture of the skull': 'Orthopedics',
                'fracture of the pelvis': 'Orthopedics', 'injury to the spinal cord': 'Orthopedics',
                'ingrown toe nail': 'Orthopedics', # Often Podiatry
                'flat feet': 'Orthopedics', # Often Podiatry
                'crushing injury': 'Orthopedics', # Trauma overlap
                'trigger finger (finger disorder)': 'Orthopedics', 'osteochondroma': 'Orthopedics',
                'dislocation of the vertebra': 'Orthopedics', 'arthritis of the hip': 'Orthopedics',
                'spondylolisthesis': 'Orthopedics', 'sprain or strain': 'Orthopedics',
                'ganglion cyst': 'Orthopedics', 'bone cancer': 'Orthopedics', # Oncology overlap
                'hemarthrosis': 'Orthopedics', # Usually a sign, not diagnosis
                'temporomandibular joint disorder': 'Orthopedics', # Often Dental/Maxillofacial
                'bone disorder': 'Orthopedics', # Vague
                'nerve impingement near the shoulder': 'Orthopedics', # Neurology overlap
                'dislocation of the shoulder': 'Orthopedics', # Added for completeness
                'open wound of the shoulder': 'Orthopedics', 'open wound of the arm': 'Orthopedics',
                'open wound of the knee': 'Orthopedics', 'open wound of the foot': 'Orthopedics',
                'open wound of the finger': 'Orthopedics', 'open wound of the hand': 'Orthopedics',
                'injury to the leg': 'Orthopedics', # General injury term
                'knee ligament or meniscus tear': 'Orthopedics',
            }

            # Severity classification
            self.severe_diseases = {
                'heart attack', 'cardiac arrest', 'stroke', 'intracranial hemorrhage',
                'subdural hemorrhage', 'sepsis', 'necrotizing fasciitis', 'lung cancer',
                'brain cancer', 'acute pancreatitis', 'pulmonary embolism',
                'acute respiratory distress syndrome (ards)', 'malignant hypertension',
                'melanoma', 'pemphigus', 'esophageal cancer', 'stomach cancer',
                'myocarditis', 'cerebral edema', 'gas gangrene', 'spinal stenosis'

                # --- CRITICAL CARDIAC (Arrhythmias & Structural) ---
                'endocarditis',                  # Valve destruction/embolism risk
                'pericarditis',                  # Tamponade risk
                'heart failure',                 # Acute decompensation
                'thoracic aortic aneurysm',      # Rupture risk
                'hypertrophic obstructive cardiomyopathy (hocm)', # Sudden death risk
                'paroxysmal ventricular tachycardia', # Lethal arrhythmia
                'heart block',                   # Cardiac arrest risk
                'atrial fibrillation',           # Stroke risk (requires senior anticoagulation decision)
                'ischemic heart disease',        # High risk coronary monitoring
                'pulmonary hypertension',        # Complex management/Heart failure risk

                # --- CRITICAL NEUROLOGICAL (Degenerative & Acute) ---
                'meningitis',                    # Medical emergency
                'encephalitis',                  # High morbidity/mortality
                'subarachnoid hemorrhage',       # High mortality (aneurysm rupture)
                'epidural hemorrhage',           # Surgical emergency
                'guillain barre syndrome',       # Respiratory paralysis risk
                'amyotrophic lateral sclerosis (als)', # Complex palliative/neuro management
                'multiple sclerosis',            # Complex neurological management
                'hydrocephalus',                 # Shunt requirement/ICP pressure
                'transient ischemic attack',     # Precursor to major stroke
                'myasthenia gravis',             # Crisis risk (breathing failure)

                # --- CRITICAL RESPIRATORY ---
                'pneumothorax',                  # Lung collapse
                'abscess of the lung',           # Severe infection/Surgical
                'empyema',                       # Surgical drainage required
                'pulmonary fibrosis',            # Irreversible failure
                'cystic fibrosis',               # Complex multisystem management
                'chronic obstructive pulmonary disease (copd)', # Severe exacerbations
                'tuberculosis',                  # Public health/Complex regimen

                # --- CRITICAL GASTROINTESTINAL & HEPATIC ---
                'ischemia of the bowel',         # Surgical emergency (dead gut)
                'gastrointestinal hemorrhage',   # Bleeding risk
                'esophageal varices',            # Fatal bleeding risk
                'pancreatic cancer',             # High mortality
                'intestinal cancer',             # Malignancy
                'ascending cholangitis',         # Sepsis risk
                'cholecystitis',                 # Surgical urgency
                'crohn disease',                 # Complex immunotherapy/surgery
                'ulcerative colitis',            # Complex immunotherapy/surgery

                # --- TRAUMA & ORTHOPEDIC EMERGENCIES ---
                'fracture of the skull',         # Brain injury risk
                'fracture of the pelvis',        # Massive internal bleeding risk
                'fracture of the neck',          # Quadriplegia risk
                'injury to the spinal cord',     # Permanent disability risk
                'osteomyelitis',                 # Bone infection (difficult to cure)
                'bone cancer',                   # Malignancy
                'crushing injury',               # Rhabdomyolysis/Kidney failure risk

                # --- INFECTIOUS & SYSTEMIC ---
                'dengue fever',                  # Hemorrhagic shock risk
                'malaria',                       # Cerebral malaria risk
                'typhoid fever',                 # Intestinal perforation risk
                'human immunodeficiency virus infection (hiv)', # Immunocompromised state
                'viral hepatitis',               # Liver failure risk
                'sarcoidosis',                   # Systemic organ damage

                # --- METABOLIC & OTHERS ---
                'hyperkalemia',                  # Cardiac arrest risk
                'peripheral arterial disease',   # Gangrene/Amputation risk
                'kaposi sarcoma'                 # Malignancy (usually HIV related)
            }

            logger.info("Predictor initialized successfully with full disease mappings.")

        except Exception as e:
            logger.error(f"Error initializing predictor: {str(e)}", exc_info=True)
            raise

    def predict(self, symptoms: List[str]) -> Dict:
        """
        Predict disease based on a clean list of symptoms, matching model feature format (with spaces).
        """
        try:
            logger.info(f"Starting prediction for {len(symptoms)} symptoms: {symptoms}")

            if not symptoms:
                logger.warning("Empty symptoms list provided")
                return {"error": "No symptoms provided"}

            matched = []
            unmatched = []
            symptoms_feature_set = set(self.symptoms_list)

            for symptom in symptoms:
                # --- Normalize input ONLY to lowercase and strip ---
                symptom_normalized = symptom.lower().strip()
                logger.debug(f"Normalizing input '{symptom}' to '{symptom_normalized}' for matching.")

                if symptom_normalized in symptoms_feature_set:
                    if symptom_normalized not in matched:
                        matched.append(symptom_normalized)
                else:
                    unmatched.append(symptom) # Keep original for logging

            logger.info(f"Successfully matched {len(matched)} symptoms: {matched}")
            if unmatched:
                logger.warning(f"Unmatched symptoms (ignored): {unmatched}")

            if not matched:
                logger.error("No symptoms could be matched to known symptoms")
                return {
                    "error": "No valid symptoms provided or matched",
                    "unmatched_inputs": unmatched
                }

            # --- Create input vector using model's feature names ---
            input_vector = [1 if feature_name in matched else 0 for feature_name in self.symptoms_list]

            # --- Use DataFrame for prediction to avoid UserWarning ---
            input_df = pd.DataFrame([input_vector], columns=self.symptoms_list)
            probabilities = self.model.predict_proba(input_df)[0]
            # --------------------------------------------------------

            disease_idx = np.argmax(probabilities)
            if not hasattr(self.model, 'classes_'):
                 raise AttributeError("Model is missing the 'classes_' attribute. Was it trained correctly?")
            disease = self.model.classes_[disease_idx]
            confidence = float(probabilities[disease_idx])

            logger.info(f"Top prediction: '{disease}' with confidence {confidence:.3f}")

            # Get department and doctor level
            department = self.department_map.get(disease, 'General Medicine') # Default if disease not mapped

            # Doctor Level Logic (Adjust thresholds as needed)
            if confidence < 0.3:
                doctor_level = "senior"
                department = "General Medicine" # Low confidence -> General checkup
            elif confidence < 0.6:
                doctor_level = "senior"
            else:
                doctor_level = "junior"

            # Check if any matched symptom indicates severity
            severe_symptom_present = any(symptom in self.severe_diseases for symptom in matched)

            # Override for severe diseases OR severe symptoms
            if disease.lower() in self.severe_diseases or severe_symptom_present:
                 if severe_symptom_present:
                     logger.info(f"Severe symptom present ({[s for s in matched if s in self.severe_diseases]}) - upgrading to senior doctor")
                 else:
                     logger.info(f"Disease '{disease}' classified as severe - upgrading to senior doctor")
                 doctor_level = "senior"

            result = {
                "disease": disease,
                "confidence": confidence,
                "department": department,
                "doctor_level": doctor_level,
                "matched_symptoms": matched,
                "unmatched_symptoms": unmatched
            }

            logger.info(f"Prediction complete: {result}")
            return result

        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}", exc_info=True)
            return {"error": f"An internal error occurred during prediction: {str(e)}"}

    def validate_setup(self) -> dict:
        """Validate predictor setup and return diagnostic info"""
        try:
            diagnostics = {
                "model_loaded": self.model is not None,
                "symptoms_count": len(self.symptoms_list) if hasattr(self, 'symptoms_list') else 0,
                "departments_count": len(self.department_map) if hasattr(self, 'department_map') else 0,
                "status": "healthy"
            }
            if diagnostics["symptoms_count"] == 0:
                 diagnostics["status"] = "error"
                 diagnostics["error_message"] = "Symptom list could not be loaded."

            # Check if all model classes are mapped
            if hasattr(self.model, 'classes_'):
                missing_mappings = [cls for cls in self.model.classes_ if cls not in self.department_map]
                if missing_mappings:
                    diagnostics["status"] = "issues_found"
                    diagnostics["issues"] = diagnostics.get("issues", []) + [f"Missing department mapping for {len(missing_mappings)} diseases (e.g., {missing_mappings[:3]})"]

            return diagnostics

        except Exception as e:
            logger.error(f"Validation failed: {str(e)}", exc_info=True)
            return {"status": "error", "error": str(e)}